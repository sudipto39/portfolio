import { PROVIDERS, type ModelOption, type RemoteProvider } from './config';

export interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamOptions {
  provider: RemoteProvider;
  model: string;
  apiKey?: string;
  endpoint?: string;
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

function geminiHeaders(apiKey?: string): Record<string, string> {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (apiKey) headers['x-goog-api-key'] = apiKey;
  return headers;
}

function groqHeaders(apiKey?: string): Record<string, string> {
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
    throw new AIError(`Couldn't reach ${viaProxy ? 'your proxy endpoint' : PROVIDERS[provider].host}.`, {
      hint: viaProxy
        ? 'Check the endpoint URL and make sure it allows CORS from this origin.'
        : 'You may be offline, or the provider blocked a direct browser request — configure a proxy endpoint in AI settings.',
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
    403: "This key isn't allowed to use the selected model.",
    404: 'Model or endpoint not found — pick another model or check the endpoint.',
    429: 'Rate limited — wait a few seconds and retry.',
    500: `${name} had an internal error — retry shortly.`,
    503: `${name} is temporarily overloaded — retry shortly.`,
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
/* Google Gemini — Generative Language REST Streaming API             */
/* ------------------------------------------------------------------ */

interface GeminiCandidate {
  content?: {
    parts?: { text?: string }[];
    role?: string;
  };
  finishReason?: string;
}

interface GeminiChunk {
  candidates?: GeminiCandidate[];
  error?: { message?: string; code?: number };
}

async function streamGemini(opts: StreamOptions): Promise<void> {
  const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
  for (const m of opts.messages) {
    const role = m.role === 'assistant' ? 'model' : 'user';
    const prev = contents[contents.length - 1];
    if (prev && prev.role === role) {
      prev.parts[0].text += `\n\n${m.content}`;
    } else {
      contents.push({ role, parts: [{ text: m.content }] });
    }
  }

  const body: Record<string, unknown> = {
    contents,
    systemInstruction: { parts: [{ text: opts.system }] },
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  };

  const keyParam = opts.apiKey ? `?alt=sse&key=${encodeURIComponent(opts.apiKey)}` : '?alt=sse';
  const url = `${baseUrl('gemini', opts.endpoint)}/v1beta/models/${opts.model}:streamGenerateContent${keyParam}`;

  const res = await request(
    url,
    { method: 'POST', headers: geminiHeaders(opts.apiKey), body: JSON.stringify(body), signal: opts.signal },
    'gemini',
    Boolean(opts.endpoint?.trim())
  );

  for await (const { data } of readSSE(res)) {
    let chunk: GeminiChunk;
    try {
      chunk = JSON.parse(data) as GeminiChunk;
    } catch {
      continue;
    }
    if (chunk.error?.message) throw new AIError(chunk.error.message);
    const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) opts.onText(text);
  }
}

/* ------------------------------------------------------------------ */
/* Groq — OpenAI-compatible Chat Completions (free tier)              */
/* ------------------------------------------------------------------ */

interface GroqChunk {
  choices?: { delta?: { content?: string | null } }[];
  error?: { message?: string };
}

async function streamGroq(opts: StreamOptions): Promise<void> {
  const body: Record<string, unknown> = {
    model: opts.model,
    messages: [{ role: 'system', content: opts.system }, ...opts.messages],
    stream: true,
    temperature: 0.7,
    max_tokens: 2048,
  };

  const res = await request(
    `${baseUrl('groq', opts.endpoint)}/openai/v1/chat/completions`,
    { method: 'POST', headers: groqHeaders(opts.apiKey), body: JSON.stringify(body), signal: opts.signal },
    'groq',
    Boolean(opts.endpoint?.trim())
  );

  for await (const { data } of readSSE(res)) {
    if (data === '[DONE]') return;
    let chunk: GroqChunk;
    try {
      chunk = JSON.parse(data) as GroqChunk;
    } catch {
      continue;
    }
    if (chunk.error?.message) throw new AIError(chunk.error.message);
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) opts.onText(content);
  }
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function streamChat(opts: StreamOptions): Promise<void> {
  if (opts.provider === 'gemini') return streamGemini(opts);
  return streamGroq(opts);
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

  if (provider === 'gemini') {
    if (!apiKey && !viaProxy) return PROVIDERS.gemini.models;
    try {
      const url = `${base}/v1beta/models?key=${encodeURIComponent(apiKey ?? '')}`;
      const res = await request(url, { headers: { 'content-type': 'application/json' }, signal }, provider, viaProxy);
      const json = (await res.json()) as { models?: { name: string; displayName?: string; description?: string }[] };
      const list = (json.models ?? [])
        .filter((m) => m.name.includes('gemini'))
        .map((m) => {
          const id = m.name.replace(/^models\//, '');
          return { id, label: m.displayName ?? id, hint: m.description ? `${m.description.slice(0, 45)}…` : 'Google Gemini model' };
        });
      return list.length ? list : PROVIDERS.gemini.models;
    } catch {
      return PROVIDERS.gemini.models;
    }
  }

  // Groq — OpenAI-compatible /models endpoint
  if (!apiKey && !viaProxy) return PROVIDERS.groq.models;
  try {
    const res = await request(`${base}/openai/v1/models`, { headers: groqHeaders(apiKey), signal }, provider, viaProxy);
    const json = (await res.json()) as { data?: { id: string; owned_by?: string }[] };
    return (json.data ?? []).map((m) => ({ id: m.id, label: m.id, hint: 'From your GroqCloud account' }));
  } catch {
    return PROVIDERS.groq.models;
  }
}
