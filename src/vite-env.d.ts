/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Default AI provider for visitors: "claude" | "deepseek" | "demo" */
  readonly VITE_AI_PROVIDER?: string;
  /** Optional server-side proxy (holds your Anthropic key). Client calls `${endpoint}/v1/messages`. */
  readonly VITE_CLAUDE_ENDPOINT?: string;
  /** Optional server-side proxy (holds your DeepSeek key). Client calls `${endpoint}/chat/completions`. */
  readonly VITE_DEEPSEEK_ENDPOINT?: string;
  /** Web3Forms Access Key for contact form submissions */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
