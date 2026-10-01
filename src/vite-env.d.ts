/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Default AI provider for visitors: "claude" | "deepseek" | "demo" */
  readonly VITE_AI_PROVIDER?: string;
  /** Optional server-side proxy (holds your Anthropic key). Client calls `${endpoint}/v1/messages`. */
  readonly VITE_CLAUDE_ENDPOINT?: string;
  /** Optional server-side proxy (holds your DeepSeek key). Client calls `${endpoint}/chat/completions`. */
  readonly VITE_DEEPSEEK_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
