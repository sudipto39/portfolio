export type RemoteProvider = 'gemini' | 'claude' | 'deepseek';
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
    description: 'Google Gemini 1.5 & 2.0 Flash models via Google AI Studio. Free 15 RPM / 1,500 RPD with zero cost and no credit card required.',
    host: 'generativelanguage.googleapis.com',
    defaultEndpoint: 'https://generativelanguage.googleapis.com',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    keyPlaceholder: 'AIzaSy…',
    accentText: 'text-sky-400',
    accentBg: 'bg-sky-500/10',
    accentBorder: 'border-sky-500/35',
    models: [
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', hint: 'Fast, reliable & 100% free (Recommended)' },
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', hint: 'Cutting-edge speed & reasoning (Free)' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', hint: 'Deeper reasoning & complex analysis' },
    ],
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    vendor: 'Anthropic',
    tagline: 'Nuanced, well-structured answers',
    description: 'Anthropic’s Claude models — excellent at careful, nuanced technical explanations.',
    host: 'api.anthropic.com',
    defaultEndpoint: 'https://api.anthropic.com',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    keyPlaceholder: 'sk-ant-api03-…',
    accentText: 'text-claude',
    accentBg: 'bg-claude/10',
    accentBorder: 'border-claude/35',
    models: [
      { id: 'claude-sonnet-5', label: 'Claude Sonnet 5', hint: 'Best balance of speed & intelligence' },
      { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', hint: 'Fastest & most affordable' },
      { id: 'claude-opus-5-5', label: 'Claude Opus 5.5', hint: 'Most capable — deeper answers' },
    ],
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    vendor: 'DeepSeek',
    tagline: 'Fast, frontier-grade & low-cost',
    description: 'DeepSeek V4 models via the OpenAI-compatible API, with optional visible reasoning.',
    host: 'api.deepseek.com',
    defaultEndpoint: 'https://api.deepseek.com',
    keyUrl: 'https://platform.deepseek.com/api_keys',
    keyPlaceholder: 'sk-…',
    accentText: 'text-deepseek',
    accentBg: 'bg-deepseek/10',
    accentBorder: 'border-deepseek/40',
    models: [
      { id: 'deepseek-flash', label: 'DeepSeek V4.1 Flash', hint: 'Fast & ultra low-cost' },
      { id: 'deepseek-v4-pro', label: 'DeepSeek V4 Pro', hint: 'Strongest DeepSeek model' },
    ],
  },
  demo: {
    id: 'demo',
    name: 'Offline demo',
    vendor: 'On-device',
    tagline: 'Instant, private, no key needed',
    description: 'A tiny on-device intent engine over my profile data.',
    host: 'your browser',
    defaultEndpoint: '',
    accentText: 'text-orange-300',
    accentBg: 'bg-orange-400/10',
    accentBorder: 'border-orange-400/35',
    models: [{ id: 'local-intent-engine', label: 'Local intent engine', hint: 'Rule-based, runs entirely in your browser' }],
  },
};

export const PROVIDER_ORDER: ProviderId[] = ['gemini', 'claude', 'deepseek', 'demo'];

/** Claude models that accept `output_config.effort` (Haiku 4.5 does not). */
export const CLAUDE_EFFORT_MODELS = /claude-(opus-(4-[5-9]|5)|sonnet-(4-6|5)|fable|mythos)/;

// Vite inlines import.meta.env at build time; the fallback keeps this module usable in Node tests.
const env: Partial<ImportMetaEnv> = import.meta.env ?? {};
const envProvider = env.VITE_AI_PROVIDER;

/** Build-time configuration — lets the site owner ship live AI through server-side proxies or free API keys. */
export const ENV = {
  provider:
    envProvider === 'gemini' || envProvider === 'claude' || envProvider === 'deepseek' || envProvider === 'demo'
      ? (envProvider as ProviderId)
      : (env.VITE_GEMINI_API_KEY ? 'gemini' : undefined),
  keys: {
    gemini: env.VITE_GEMINI_API_KEY ?? '',
    claude: env.VITE_CLAUDE_API_KEY ?? '',
    deepseek: env.VITE_DEEPSEEK_API_KEY ?? '',
  } as Record<RemoteProvider, string>,
  endpoints: {
    gemini: env.VITE_GEMINI_ENDPOINT ?? '',
    claude: env.VITE_CLAUDE_ENDPOINT ?? '',
    deepseek: env.VITE_DEEPSEEK_ENDPOINT ?? '',
  } as Record<RemoteProvider, string>,
};

export function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
