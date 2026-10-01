import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUp,
  Braces,
  Briefcase,
  Check,
  ChevronDown,
  CircleAlert,
  Copy,
  Layers,
  Rocket,
  RotateCcw,
  Settings2,
  Sparkles,
  Square,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { profile } from '../../data/profile';
import { useChat, type ChatMessage } from '../../hooks/use-chat';
import { PROVIDERS } from '../../lib/ai/config';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Kbd, ProviderIcon, TwinAvatar } from '../shared';
import { Markdown } from './Markdown';

const SUGGESTION_ICONS = [Layers, Workflow, Briefcase, Rocket, Braces, Zap];

interface ChatPanelProps {
  className?: string;
  autoFocus?: boolean;
  onClose?: () => void;
}

export function ChatPanel({ className, autoFocus = false, onClose }: ChatPanelProps) {
  const { messages, isStreaming, send, stop, reset, retry, isLive, activeProvider, activeModelLabel, openSettings } =
    useChat();
  const [input, setInput] = useState('');
  const inputId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stickToBottom = useRef(true);

  // Keep the newest tokens in view unless the reader scrolled up.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!autoFocus || !window.matchMedia('(pointer: fine)').matches) return;
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [autoFocus]);

  // Auto-grow the composer.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const submit = (value: string = input) => {
    const text = value.trim();
    if (!text || isStreaming) return;
    stickToBottom.current = true;
    send(text);
    setInput('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const meta = PROVIDERS[activeProvider];
  const lastIndex = messages.length - 1;

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      {/* Header */}
      <header className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
        <TwinAvatar />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{profile.firstName}&apos;s AI twin</p>
          <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full',
                isLive ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.9)]' : 'bg-amber-400'
              )}
            />
            <span className="truncate">{isLive ? 'Live · grounded on my portfolio' : 'Demo mode · on-device answers'}</span>
          </p>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => openSettings()}
              className="flex max-w-[10.5rem] items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-2 pr-2.5 text-xs text-gray-300 transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              <ProviderIcon provider={activeProvider} className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{activeModelLabel}</span>
              <ChevronDown className="h-3 w-3 shrink-0 text-gray-500" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Switch model · AI settings</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" onClick={reset} disabled={messages.length === 0} aria-label="New conversation">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>New conversation</TooltipContent>
        </Tooltip>

        {onClose && (
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close chat">
            <X className="h-4 w-4" />
          </Button>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} onScroll={onScroll} className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 py-5" aria-live="polite">
        {messages.length === 0 ? (
          <EmptyState onPick={submit} />
        ) : (
          <div className="space-y-6">
            {messages.map((m, i) => (
              <MessageRow key={m.id} message={m} onRetry={i === lastIndex ? retry : undefined} />
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="border-t border-white/[0.07] p-3 sm:p-4"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 pl-3.5 transition focus-within:border-orange-400/40 focus-within:ring-4 focus-within:ring-orange-400/10">
          <label htmlFor={inputId} className="sr-only">
            Message {profile.firstName}&apos;s AI twin
          </label>
          <textarea
            id={inputId}
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about my projects, stack, availability…"
            className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent py-2.5 text-sm text-gray-100 outline-none placeholder:text-gray-500"
          />
          {isStreaming ? (
            <Button type="button" size="icon" variant="secondary" onClick={stop} aria-label="Stop generating">
              <Square className="h-3.5 w-3.5 fill-current" />
            </Button>
          ) : (
            <Button type="submit" size="icon" variant="gradient" disabled={!input.trim()} aria-label="Send message">
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 px-1 text-[11px] text-gray-500">
          {isLive ? (
            <span className="flex min-w-0 items-center gap-1.5">
              <ProviderIcon provider={activeProvider} className="h-3 w-3 shrink-0" />
              <span className="truncate">Streaming live from {meta.host}</span>
            </span>
          ) : (
            <span className="truncate">
              Demo mode ·{' '}
              <button type="button" onClick={() => openSettings('claude')} className="text-orange-300 hover:underline">
                connect Claude
              </button>{' '}
              or{' '}
              <button type="button" onClick={() => openSettings('deepseek')} className="text-orange-300 hover:underline">
                DeepSeek
              </button>
            </span>
          )}
          <span className="hidden shrink-0 items-center gap-1 sm:flex">
            <Kbd>↵</Kbd> send <Kbd>⇧↵</Kbd> newline
          </span>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------ pieces ------------------------------ */

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center py-4 text-center">
      <div className="relative">
        <div aria-hidden className="absolute inset-0 -z-10 scale-150 rounded-full bg-orange-400/25 blur-2xl" />
        <TwinAvatar size="lg" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white">Hi, I&apos;m {profile.firstName}&apos;s AI twin 👋</h3>
      <p className="mt-1.5 max-w-xs text-sm text-gray-400">
        Ask me anything about my projects, stack, experience or availability.
      </p>
      <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
        {profile.suggestedQuestions.map((q, i) => {
          const Icon = SUGGESTION_ICONS[i % SUGGESTION_ICONS.length];
          return (
            <motion.button
              key={q}
              type="button"
              onClick={() => onPick(q)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="group flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-left text-[13px] text-gray-300 transition hover:border-orange-400/30 hover:bg-orange-400/[0.05] hover:text-white"
            >
              <Icon className="h-4 w-4 shrink-0 text-gray-500 transition group-hover:text-orange-300" />
              <span className="line-clamp-1">{q}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function MessageRow({ message, onRetry }: { message: ChatMessage; onRetry?: () => void }) {
  if (message.role === 'user') {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md border border-orange-400/15 bg-orange-400/[0.08] px-4 py-2.5 text-[14px] leading-relaxed text-orange-50">
          {message.content}
        </div>
      </motion.div>
    );
  }

  const meta = message.provider ? PROVIDERS[message.provider] : null;
  const thinking = Boolean(message.pending && !message.content);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
      <TwinAvatar size="sm" className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10.5px] text-gray-500">
          {message.provider && <ProviderIcon provider={message.provider} className="h-3 w-3 shrink-0" />}
          <span>{meta?.name}</span>
          <span aria-hidden>·</span>
          <span className="truncate">{message.model}</span>
          {!message.pending && message.durationMs != null && (
            <>
              <span aria-hidden>·</span>
              <span className="shrink-0">{(message.durationMs / 1000).toFixed(1)}s</span>
            </>
          )}
        </div>

        {message.reasoning && <Reasoning text={message.reasoning} active={thinking} />}

        {thinking ? (
          <ThinkingDots label={message.reasoning ? 'Reasoning' : 'Thinking'} />
        ) : message.content ? (
          <Markdown content={message.content} streaming={message.pending} />
        ) : null}

        {message.stopped && <p className="mt-2 text-xs italic text-gray-500">Stopped.</p>}
        {message.error && <ErrorNotice error={message.error} onRetry={onRetry} />}
        {!message.pending && !message.error && message.content && <CopyButton text={message.content} />}
      </div>
    </motion.div>
  );
}

function Reasoning({ text, active }: { text: string; active: boolean }) {
  const [open, setOpen] = useState(active);
  useEffect(() => {
    setOpen(active);
  }, [active]);

  return (
    <div className="mb-3 overflow-hidden rounded-xl border border-amber-400/15 bg-amber-400/[0.04]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-amber-200/80 transition hover:text-amber-100"
        aria-expanded={open}
      >
        <Sparkles className={cn('h-3.5 w-3.5', active && 'animate-pulse')} />
        {active ? 'Reasoning…' : 'Thought process'}
        <ChevronDown className={cn('ml-auto h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="scrollbar-thin max-h-48 overflow-y-auto whitespace-pre-wrap border-t border-amber-400/10 px-3 py-2 font-mono text-[11.5px] leading-relaxed text-gray-400">
          {text}
        </div>
      )}
    </div>
  );
}

function ThinkingDots({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 py-1 text-sm text-gray-500">
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-orange-300"
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </span>
      {label}…
    </div>
  );
}

function ErrorNotice({ error, onRetry }: { error: { message: string; hint?: string }; onRetry?: () => void }) {
  const { openSettings } = useChat();
  return (
    <div className="mt-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-3 text-sm">
      <div className="flex items-start gap-2 text-rose-200">
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <span className="break-words">{error.message}</span>
      </div>
      {error.hint && <p className="mt-1.5 pl-6 text-xs text-rose-200/70">{error.hint}</p>}
      <div className="mt-3 flex flex-wrap gap-2 pl-6">
        {onRetry && (
          <Button size="sm" variant="secondary" onClick={onRetry}>
            <RotateCcw className="h-3.5 w-3.5" /> Retry
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => openSettings()}>
          <Settings2 className="h-3.5 w-3.5" /> AI settings
        </Button>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Clipboard isn’t available here');
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="mt-2 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] text-gray-500 transition hover:bg-white/5 hover:text-gray-300"
    >
      {copied ? <Check className="h-3 w-3 text-orange-400" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
