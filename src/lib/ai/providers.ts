import { CLAUDE_EFFORT_MODELS, PROVIDERS, type ModelOption, type RemoteProvider } from './config';

export interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamOptions {
  provider: RemoteProvider;
  model: string;
  apiKey?: string;
  endpoint?: string;
  /** DeepSeek thinking mode (streams `reasoning_content`). */
  thinking?: boolean;
  system: string;
  messages: ApiMessage[];
  signal: AbortSignal;
  onText: (delta: string) => void;
  onReasoning?: (delta: string) => void;
}

export class AIError extends Error {
  status?: number;
  hint?: string;

  constructor(message: string, options: { status?: number; hint?: string } = {}) {
    super(message);
    this.name = 'AIError';
    this.status = options.status;
    this.hint = options.hint;
  }
}

/* ------------------------------------------------------------------ */
/* HTTP helpers                                                        */
/* ------------------------------------------------------------------ */

const baseUrl = (provider: RemoteProvider, endpoint?: string) =>
  (endpoint?.trim() || PROVIDERS[provider].defaultEndpoint).replace(/\/+$/, '');

function claudeHeaders(apiKey?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'anthropic-version': '2023-06-01',
  };
  if (apiKey) {
    headers['x-api-key'] = apiKey;
    // Required by Anthropic to allow CORS requests straight from the browser.
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }
  return headers;
}

function deepseekHeaders(apiKey?: string): Record<string, string> {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (apiKey) headers.authorization = `Bearer ${apiKey}`;
  return headers;
}

const isAbort = (err: unknown) => err instanceof Error && err.name === 'AbortError';

async function request(url: string, init: RequestInit, provider: RemoteProvider, viaProxy: boolean): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (err) {
    if (isAbort(err)) throw err;
    throw new AIError(`Couldn’t reach ${viaProxy ? 'your proxy endpoint' : PROVIDERS[provider].host}.`, {
      hint: viaProxy
        ? 'Check the endpoint URL and make sure it allows CORS from this origin.'
        : 'You may be offline, or the provider blocked a direct browser (CORS) request — configure a proxy endpoint in AI settings.',
    });
  }
  if (!res.ok) throw await httpError(res, provider);
  return res;
}

function extractMessage(body: unknown): string {
  if (!body || typeof body !== 'object') return '';
  const b = body as { error?: { message?: unknown } | string; message?: unknown };
  if (typeof b.error === 'string') return b.error;
  if (b.error && typeof b.error === 'object' && typeof b.error.message === 'string') return b.error.message;
  if (typeof b.message === 'string') return b.message;
  return '';
}

async function httpError(res: Response, provider: RemoteProvider): Promise<AIError> {
  let detail = '';
  try {
    detail = extractMessage(await res.json());
  } catch {
    /* non-JSON error body */
  }
  const name = PROVIDERS[provider].name;
  const hints: Record<number, string> = {
    400: 'The request was rejected — try another model in AI settings.',
    401: `Your ${name} API key looks invalid or revoked. Update it in AI settings.`,
    402: 'Your account balance is too low — top up with the provider.',
    403: 'This key isn’t allowed to use the selected model.',
    404: 'Model or endpoint not found — pick another model or check the endpoint.',
    429: 'Rate limited — wait a few seconds and retry.',
    500: `${name} had an internal error — retry shortly.`,
    503: `${name} is temporarily overloaded — retry shortly.`,
    529: `${name} is temporarily overloaded — retry shortly.`,
  };
  return new AIError(detail || `${name} responded with HTTP ${res.status}.`, { status: res.status, hint: hints[res.status] });
}

/* ------------------------------------------------------------------ */
/* Minimal, spec-compliant Server-Sent Events reader                   */
/* ------------------------------------------------------------------ */

interface SSEEvent {
  event?: string;
  data: string;
}

function parseEvent(raw: string): SSEEvent | null {
  let event: string | undefined;
  const data: string[] = [];
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.startsWith(':')) continue; // blank or keep-alive comment
    const idx = line.indexOf(':');
    const field = idx === -1 ? line : line.slice(0, idx);
    let value = idx === -1 ? '' : line.slice(idx + 1);
    if (value.startsWith(' ')) value = value.slice(1);
    if (field === 'event') event = value;
    else if (field === 'data') data.push(value);
  }
  return data.length ? { event, data: data.join('\n') } : null;
}

async function* readSSE(res: Response): AsyncGenerator<SSEEvent> {
  if (!res.body) throw new AIError('This browser does not support streaming responses.');
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finished = false;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let match: RegExpExecArray | null;
      while ((match = /\r?\n\r?\n/.exec(buffer))) {
        const raw = buffer.slice(0, match.index);
        buffer = buffer.slice(match.index + match[0].length);
        const evt = parseEvent(raw);
        if (evt) yield evt;
      }
    }
    finished = true;
    const tail = parseEvent(buffer + decoder.decode());
    if (tail) yield tail;
  } finally {
    if (finished) reader.releaseLock();
    else reader.cancel().catch(() => undefined);
  }
}

/* ------------------------------------------------------------------ */
/* Claude — Anthropic Messages API                                     */
/* ------------------------------------------------------------------ */

interface ClaudeEvent {
  type?: string;
  delta?: { type?: string; text?: string; thinking?: string };
  error?: { message?: string };
}

async function streamClaude(opts: StreamOptions): Promise<void> {
  const body: Record<string, unknown> = {
    model: opts.model,
    max_tokens: 4096,
    system: opts.system,
    messages: opts.messages,
    stream: true,
  };
  // Low effort keeps a chat widget snappy; Claude still thinks adaptively when needed.
  if (CLAUDE_EFFORT_MODELS.test(opts.model)) body.output_config = { effort: 'low' };

  const res = await request(
    `${baseUrl('claude', opts.endpoint)}/v1/messages`,
    { method: 'POST', headers: claudeHeaders(opts.apiKey), body: JSON.stringify(body), signal: opts.signal },
    'claude',
    Boolean(opts.endpoint?.trim())
  );

  for await (const { data } of readSSE(res)) {
    let evt: ClaudeEvent;
    try {
      evt = JSON.parse(data) as ClaudeEvent;
    } catch {
      continue;
    }
    if (evt.type === 'content_block_delta') {
      if (evt.delta?.type === 'text_delta' && evt.delta.text) opts.onText(evt.delta.text);
      else if (evt.delta?.type === 'thinking_delta' && evt.delta.thinking) opts.onReasoning?.(evt.delta.thinking);
    } else if (evt.type === 'error') {
      throw new AIError(evt.error?.message ?? 'Claude interrupted the stream.', {
        hint: 'Usually transient (overload) — retry in a moment.',
      });
    } else if (evt.type === 'message_stop') {
      return;
    }
  }
}

/* ------------------------------------------------------------------ */
/* DeepSeek — OpenAI-compatible Chat Completions                       */
/* ------------------------------------------------------------------ */

interface DeepSeekChunk {
  choices?: { delta?: { content?: string | null; reasoning_content?: string | null } }[];
  error?: { message?: string };
}

async function streamDeepSeek(opts: StreamOptions): Promise<void> {
  const body: Record<string, unknown> = {
    model: opts.model,
    messages: [{ role: 'system', content: opts.system }, ...opts.messages],
    stream: true,
    thinking: { type: opts.thinking ? 'enabled' : 'disabled' },
  };
  if (opts.thinking) {
    body.reasoning_effort = 'low';
    body.max_tokens = 4096;
  } else {
    body.temperature = 0.7;
    body.max_tokens = 1024;
  }

  const res = await request(
    `${baseUrl('deepseek', opts.endpoint)}/chat/completions`,
    { method: 'POST', headers: deepseekHeaders(opts.apiKey), body: JSON.stringify(body), signal: opts.signal },
    'deepseek',
    Boolean(opts.endpoint?.trim())
  );

  for await (const { data } of readSSE(res)) {
    if (data === '[DONE]') return;
    let chunk: DeepSeekChunk;
    try {
      chunk = JSON.parse(data) as DeepSeekChunk;
    } catch {
      continue;
    }
    if (chunk.error?.message) throw new AIError(chunk.error.message);
    const delta = chunk.choices?.[0]?.delta;
    if (delta?.reasoning_content) opts.onReasoning?.(delta.reasoning_content);
    if (delta?.content) opts.onText(delta.content);
  }
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function streamChat(opts: StreamOptions): Promise<void> {
  return opts.provider === 'claude' ? streamClaude(opts) : streamDeepSeek(opts);
}

/** Lists models available to the key via each provider's Models API. */
export async function listModels(
  provider: RemoteProvider,
  apiKey?: string,
  endpoint?: string,
  signal?: AbortSignal
): Promise<ModelOption[]> {
  const viaProxy = Boolean(endpoint?.trim());
  const base = baseUrl(provider, endpoint);

  if (provider === 'claude') {
    const res = await request(`${base}/v1/models?limit=100`, { headers: claudeHeaders(apiKey), signal }, provider, viaProxy);
    const json = (await res.json()) as { data?: { id: string; display_name?: string }[] };
    return (json.data ?? [])
      .filter((m) => m.id.startsWith('claude'))
      .map((m) => ({ id: m.id, label: m.display_name ?? m.id, hint: 'From your Anthropic account' }));
  }

  const res = await request(`${base}/models`, { headers: deepseekHeaders(apiKey), signal }, provider, viaProxy);
  const json = (await res.json()) as { data?: { id: string; owned_by?: string }[] };
  return (json.data ?? []).map((m) => ({ id: m.id, label: m.id, hint: 'From your DeepSeek account' }));
}
