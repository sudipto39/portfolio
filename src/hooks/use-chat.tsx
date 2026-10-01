import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ENV, PROVIDERS, type ModelOption, type ProviderId, type RemoteProvider } from '../lib/ai/config';
import { AIError, streamChat, type ApiMessage } from '../lib/ai/providers';
import { streamDemo } from '../lib/ai/demo';
import { buildSystemPrompt } from '../lib/ai/prompt';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  provider?: ProviderId;
  model?: string;
  pending?: boolean;
  stopped?: boolean;
  durationMs?: number;
  error?: { message: string; hint?: string };
}

export interface AISettings {
  provider: ProviderId;
  models: Record<RemoteProvider, string>;
  endpoints: Record<RemoteProvider, string>;
  keys: Record<RemoteProvider, string>;
  extraModels: Record<RemoteProvider, ModelOption[]>;
  deepseekThinking: boolean;
  remember: boolean;
}

interface ChatContextValue {
  messages: ChatMessage[];
  isStreaming: boolean;
  send: (text: string) => void;
  /** Opens the chat sheet and sends a question. */
  ask: (text: string) => void;
  stop: () => void;
  reset: () => void;
  retry: () => void;
  settings: AISettings;
  saveSettings: (next: AISettings) => void;
  setProvider: (provider: ProviderId) => void;
  isLive: boolean;
  activeProvider: ProviderId;
  activeModel: string;
  activeModelLabel: string;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  settingsOpen: boolean;
  settingsProvider: ProviderId | null;
  openSettings: (provider?: ProviderId) => void;
  closeSettings: () => void;
  embeddedVisible: boolean;
  setEmbeddedVisible: (visible: boolean) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

const SETTINGS_KEY = 'ai-twin.settings.v1';
const KEYS_KEY = 'ai-twin.keys.v1';
const MAX_HISTORY = 12;

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

/* ------------------------------ helpers ------------------------------ */

export function effectiveEndpoint(settings: AISettings, provider: RemoteProvider): string {
  return settings.endpoints[provider].trim() || ENV.endpoints[provider];
}

/** A provider is "live" when it has a key or an endpoint (proxy) configured. */
export function canGoLive(settings: AISettings, provider: ProviderId): boolean {
  if (provider === 'demo') return false;
  return Boolean(settings.keys[provider]?.trim() || ENV.keys[provider] || effectiveEndpoint(settings, provider));
}

export function modelOptions(settings: AISettings, provider: ProviderId): ModelOption[] {
  if (provider === 'demo') return PROVIDERS.demo.models;
  const seen = new Set<string>();
  const out: ModelOption[] = [];
  for (const m of [...PROVIDERS[provider].models, ...settings.extraModels[provider]]) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);
    out.push(m);
  }
  return out;
}

export function modelLabel(settings: AISettings, provider: ProviderId, id: string): string {
  return modelOptions(settings, provider).find((m) => m.id === id)?.label ?? id;
}

function defaultSettings(): AISettings {
  return {
    provider: ENV.provider ?? (ENV.keys.gemini ? 'gemini' : 'demo'),
    models: {
      gemini: PROVIDERS.gemini.models[0].id,
      claude: PROVIDERS.claude.models[0].id,
      deepseek: PROVIDERS.deepseek.models[0].id,
    },
    endpoints: { gemini: '', claude: '', deepseek: '' },
    keys: {
      gemini: ENV.keys.gemini ?? '',
      claude: ENV.keys.claude ?? '',
      deepseek: ENV.keys.deepseek ?? '',
    },
    extraModels: { gemini: [], claude: [], deepseek: [] },
    deepseekThinking: false,
    remember: false,
  };
}

function loadSettings(): AISettings {
  const base = defaultSettings();
  if (typeof window === 'undefined') return base;
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') as Partial<AISettings>;
    const keys = JSON.parse(
      localStorage.getItem(KEYS_KEY) ?? sessionStorage.getItem(KEYS_KEY) ?? '{}'
    ) as Partial<Record<RemoteProvider, string>>;
    const provider = saved.provider && saved.provider in PROVIDERS ? saved.provider : base.provider;
    return {
      ...base,
      ...saved,
      provider,
      models: { ...base.models, ...saved.models },
      endpoints: { ...base.endpoints, ...saved.endpoints },
      extraModels: { ...base.extraModels, ...saved.extraModels },
      keys: { ...base.keys, ...keys },
    };
  } catch {
    return base;
  }
}

/** Settings go to localStorage; keys go to sessionStorage unless the user opts in to "remember". */
function persist(settings: AISettings) {
  try {
    const { keys, ...rest } = settings;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(rest));
    localStorage.removeItem(KEYS_KEY);
    sessionStorage.removeItem(KEYS_KEY);
    if (keys.gemini || keys.claude || keys.deepseek) {
      (settings.remember ? localStorage : sessionStorage).setItem(KEYS_KEY, JSON.stringify(keys));
    }
  } catch {
    /* storage unavailable (private mode / quota) */
  }
}

/** Anthropic requires alternating roles starting with "user"; merge and trim history accordingly. */
function toApiMessages(history: ChatMessage[]): ApiMessage[] {
  const out: ApiMessage[] = [];
  for (const m of history) {
    if (m.error || m.pending || !m.content.trim()) continue;
    const prev = out[out.length - 1];
    if (prev && prev.role === m.role) prev.content += `\n\n${m.content}`;
    else out.push({ role: m.role, content: m.content });
  }
  const recent = out.slice(-MAX_HISTORY);
  while (recent.length && recent[0].role !== 'user') recent.shift();
  return recent;
}

/* ------------------------------ provider ------------------------------ */

export function ChatProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AISettings>(loadSettings);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsProvider, setSettingsProvider] = useState<ProviderId | null>(null);
  const [embeddedVisible, setEmbeddedVisible] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const settingsRef = useRef(settings);
  const systemPrompt = useMemo(() => buildSystemPrompt(), []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    settingsRef.current = settings;
    persist(settings);
  }, [settings]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const patchMessage = useCallback((id: string, patch: (m: ChatMessage) => Partial<ChatMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch(m) } : m)));
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const isActive = () => abortRef.current === controller;

      const s = settingsRef.current;
      const provider: ProviderId = canGoLive(s, s.provider) ? s.provider : 'demo';
      const model = provider === 'demo' ? PROVIDERS.demo.models[0].id : s.models[provider];

      const userMsg: ChatMessage = { id: uid(), role: 'user', content: text };
      const assistantId = uid();
      const assistantMsg: ChatMessage = { id: assistantId, role: 'assistant', content: '', provider, model, pending: true };
      const history = [...messagesRef.current, userMsg];
      messagesRef.current = [...history, assistantMsg];
      setMessages(messagesRef.current);
      setIsStreaming(true);

      // Batch token updates to one React render per animation frame.
      let textBuf = '';
      let reasonBuf = '';
      let frame = 0;
      const flush = () => {
        frame = 0;
        if (!textBuf && !reasonBuf) return;
        const t = textBuf;
        const r = reasonBuf;
        textBuf = '';
        reasonBuf = '';
        patchMessage(assistantId, (m) => ({
          content: m.content + t,
          reasoning: r ? (m.reasoning ?? '') + r : m.reasoning,
        }));
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(flush);
      };
      const onText = (delta: string) => {
        textBuf += delta;
        schedule();
      };
      const onReasoning = (delta: string) => {
        reasonBuf += delta;
        schedule();
      };

      const startedAt = performance.now();
      try {
        if (provider === 'demo') {
          await streamDemo(text, { signal: controller.signal, onText });
        } else {
          await streamChat({
            provider,
            model,
            apiKey: s.keys[provider]?.trim() || ENV.keys[provider] || undefined,
            endpoint: effectiveEndpoint(s, provider) || undefined,
            thinking: provider === 'deepseek' ? s.deepseekThinking : undefined,
            system: systemPrompt,
            messages: toApiMessages(history),
            signal: controller.signal,
            onText,
            onReasoning,
          });
        }
        if (frame) cancelAnimationFrame(frame);
        flush();
        patchMessage(assistantId, (m) => ({
          pending: false,
          durationMs: performance.now() - startedAt,
          content: m.content || '_The model returned an empty response — try rephrasing._',
        }));
      } catch (err) {
        if (frame) cancelAnimationFrame(frame);
        flush();
        const aborted = controller.signal.aborted;
        patchMessage(assistantId, () => ({
          pending: false,
          stopped: aborted || undefined,
          durationMs: performance.now() - startedAt,
          error: aborted
            ? undefined
            : {
                message: err instanceof Error ? err.message : 'Something went wrong.',
                hint: err instanceof AIError ? err.hint : undefined,
              },
        }));
      } finally {
        if (isActive()) {
          abortRef.current = null;
          setIsStreaming(false);
        }
      }
    },
    [patchMessage, systemPrompt]
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    messagesRef.current = [];
    setMessages([]);
  }, []);

  const retry = useCallback(() => {
    const list = messagesRef.current;
    let idx = -1;
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].role === 'user') {
        idx = i;
        break;
      }
    }
    if (idx === -1) return;
    const text = list[idx].content;
    messagesRef.current = list.slice(0, idx);
    setMessages(messagesRef.current);
    void send(text);
  }, [send]);

  const ask = useCallback(
    (text: string) => {
      setChatOpen(true);
      void send(text);
    },
    [send]
  );

  const saveSettings = useCallback((next: AISettings) => setSettings(next), []);
  const setProvider = useCallback((provider: ProviderId) => setSettings((prev) => ({ ...prev, provider })), []);

  const openSettings = useCallback((provider?: ProviderId) => {
    setSettingsProvider(provider ?? null);
    setSettingsOpen(true);
  }, []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const isLive = canGoLive(settings, settings.provider);
  const activeProvider: ProviderId = isLive ? settings.provider : 'demo';
  const activeModel = activeProvider === 'demo' ? PROVIDERS.demo.models[0].id : settings.models[activeProvider];
  const activeModelLabel = modelLabel(settings, activeProvider, activeModel);

  const value = useMemo<ChatContextValue>(
    () => ({
      messages,
      isStreaming,
      send: (text: string) => void send(text),
      ask,
      stop,
      reset,
      retry,
      settings,
      saveSettings,
      setProvider,
      isLive,
      activeProvider,
      activeModel,
      activeModelLabel,
      chatOpen,
      setChatOpen,
      settingsOpen,
      settingsProvider,
      openSettings,
      closeSettings,
      embeddedVisible,
      setEmbeddedVisible,
    }),
    [
      messages,
      isStreaming,
      send,
      ask,
      stop,
      reset,
      retry,
      settings,
      saveSettings,
      setProvider,
      isLive,
      activeProvider,
      activeModel,
      activeModelLabel,
      chatOpen,
      settingsOpen,
      settingsProvider,
      openSettings,
      closeSettings,
      embeddedVisible,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>');
  return ctx;
}
