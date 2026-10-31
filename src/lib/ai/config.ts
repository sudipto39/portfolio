export type RemoteProvider = 'gemini' | 'groq';
export type ProviderId = RemoteProvider | 'demo';

export interface ModelOption {
  id: string;
  label: string;
  hint: string;
}

export interface ProviderMeta {
  id: ProviderId;
  name: string;
  vendor: string;
  tagline: string;
  description: string;
  host: string;
  defaultEndpoint: string;
  keyUrl?: string;
  keyPlaceholder?: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  models: ModelOption[];
}

export const PROVIDERS: Record<ProviderId, ProviderMeta> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    vendor: 'Google AI Studio',
    tagline: '100% Free tier, ultra-fast & smart',
    description: 'Google Gemini Flash-Lite & Flash models via Google AI Studio. Free 15 RPM / 1,500 RPD — zero cost, no credit card required.',
    host: 'generativelanguage.googleapis.com',
    defaultEndpoint: 'https://generativelanguage.googleapis.com',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    keyPlaceholder: 'AIzaSy…',
    accentText: 'text-sky-400',
    accentBg: 'bg-sky-500/10',
    accentBorder: 'border-sky-500/35',
    models: [
      { id: 'gemini-flash-lite-latest', label: 'Gemini Flash Lite', hint: 'Ultra-fast (~1s response time), 100% free' },
      { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash Lite', hint: 'Fast, responsive & lightweight' },
      { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', hint: 'Heavy reasoning model (slower)' },
    ],
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    vendor: 'GroqCloud',
    tagline: 'Ultra-fast inference, free forever',
    description: 'High-speed open models via GroqCloud LPUs. Blazing fast inference with a generous free tier — no credit card required.',
    host: 'api.groq.com',
    defaultEndpoint: 'https://api.groq.com',
    keyUrl: 'https://console.groq.com/keys',
    keyPlaceholder: 'gsk_…',
    accentText: 'text-violet-400',
    accentBg: 'bg-violet-500/10',
    accentBorder: 'border-violet-500/35',
    models: [
      { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B', hint: 'Best reasoning & depth — ultra-fast (Free)' },
      { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B', hint: 'Blazing fast instant response (Free)' },
      { id: 'qwen/qwen3.8-27b', label: 'Qwen 3.8 27B', hint: 'High intelligence & coding proficiency (Free)' },
    ],
  },
  demo: {
    id: 'demo',
    name: 'Offline demo',
    vendor: 'On-device',
    tagline: 'Instant, private, no key needed',
    description: 'A tiny on-device intent engine over my profile data. No internet, no API key — just instant answers.',
    host: 'your browser',
    defaultEndpoint: '',
    accentText: 'text-orange-300',
    accentBg: 'bg-orange-400/10',
    accentBorder: 'border-orange-400/35',
    models: [{ id: 'local-intent-engine', label: 'Local intent engine', hint: 'Rule-based, runs entirely in your browser' }],
  },
};

export const PROVIDER_ORDER: ProviderId[] = ['gemini', 'groq', 'demo'];

// Vite inlines import.meta.env at build time; the fallback keeps this module usable in Node tests.
const env: Partial<ImportMetaEnv> = import.meta.env ?? {};
const envProvider = env.VITE_AI_PROVIDER;

/** Build-time configuration — lets the site owner pre-configure free AI providers. */
export const ENV = {
  provider:
    envProvider === 'gemini' || envProvider === 'groq' || envProvider === 'demo'
      ? (envProvider as ProviderId)
      : env.VITE_GEMINI_API_KEY
      ? 'gemini'
      : env.VITE_GROQ_API_KEY
      ? 'groq'
      : undefined,
  keys: {
    gemini: env.VITE_GEMINI_API_KEY ?? '',
    groq: env.VITE_GROQ_API_KEY ?? '',
  } as Record<RemoteProvider, string>,
  endpoints: {
    gemini: env.VITE_GEMINI_ENDPOINT ?? '',
    groq: env.VITE_GROQ_ENDPOINT ?? '',
  } as Record<RemoteProvider, string>,
};

export function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
