/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Default AI provider for visitors: "gemini" | "groq" | "demo" */
  readonly VITE_AI_PROVIDER?: string;
  /** Google Gemini API key */
  readonly VITE_GEMINI_API_KEY?: string;
  /** Optional custom Gemini endpoint or proxy */
  readonly VITE_GEMINI_ENDPOINT?: string;
  /** Groq API key */
  readonly VITE_GROQ_API_KEY?: string;
  /** Optional custom Groq endpoint or proxy */
  readonly VITE_GROQ_ENDPOINT?: string;
  /** Web3Forms Access Key for contact form submissions */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
