import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { Braces, Radio, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useChat } from '../../hooks/use-chat';
import { PROVIDER_ORDER, PROVIDERS, type ProviderId } from '../../lib/ai/config';
import { cn } from '../../utils/cn';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { ProviderIcon, Reveal, SectionHeading } from '../shared';
import { ChatPanel } from './ChatPanel';

const STEPS = [
  {
    icon: Braces,
    title: 'Grounded on real data',
    body: 'The system prompt is generated from the same profile.ts that renders this page.',
  },
  {
    icon: Radio,
    title: 'Streamed over SSE',
    body: 'Tokens are parsed by a tiny SSE reader and batched per animation frame.',
  },
  {
    icon: ShieldCheck,
    title: 'Your key, your browser',
    body: 'Requests go straight to Google Gemini or Groq API — or your proxy.',
  },
];

const PROXY_SNIPPET = `// Cloudflare Worker — keeps your Groq or Gemini key server-side.
// Deploy it, then configure VITE_GROQ_ENDPOINT=https://ai.your-domain.dev
export default {
  async fetch(req, env) {
    const cors = {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'content-type, authorization',
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': \`Bearer \${env.GROQ_API_KEY}\`,
      },
      body: req.body,
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: { ...cors, 'content-type': 'text/event-stream' },
    });
  },
};`;

export function AISection() {
  const { setProvider, setEmbeddedVisible, activeProvider } = useChat();
  const chatRef = useRef<HTMLDivElement>(null);
  const chatInView = useInView(chatRef, { amount: 0.3 });

  useEffect(() => {
    setEmbeddedVisible(chatInView);
  }, [chatInView, setEmbeddedVisible]);

  const choose = (id: ProviderId) => {
    setProvider(id);
    toast.success(id === 'demo' ? 'Switched to the offline demo engine' : `Switched to ${PROVIDERS[id].name}`);
  };

  return (
    <section id="ai" className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-40 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-orange-800/[0.08] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="AI twin"
          title={
            <>
              Don&apos;t read my CV — <span className="text-gradient">ask it.</span>
            </>
          }
          description="An AI version of me, grounded on my resume, LinkedIn, and real engineering metrics. Powered by Google Gemini & Groq (both 100% free) with real-time streaming — or the offline demo engine, no key needed."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Chat */}
          <div ref={chatRef} className="lg:order-2">
            <Reveal className="h-full">
              <div className="relative h-[620px] lg:h-full lg:min-h-[660px]">
                <div aria-hidden className="absolute -inset-px rounded-3xl bg-linear-to-b from-orange-400/40 via-white/5 to-amber-700/30" />
                <div className="relative h-full overflow-hidden rounded-3xl bg-panel/95 shadow-2xl shadow-orange-500/10 backdrop-blur-xl">
                  <ChatPanel />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Explainer */}
          <div className="space-y-6 lg:order-1">
            <Reveal>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-gray-500">Choose the brain</p>
              <div className="space-y-2.5">
                {PROVIDER_ORDER.map((id) => {
                  const m = PROVIDERS[id];
                  const selected = activeProvider === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => choose(id)}
                      className={cn(
                        'group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all',
                        selected
                          ? cn(m.accentBorder, 'bg-white/[0.04]')
                          : 'border-white/[0.07] bg-white/[0.015] hover:border-white/15 hover:bg-white/[0.03]'
                      )}
                    >
                      <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl border', m.accentBg, m.accentBorder)}>
                        <ProviderIcon provider={id} className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-2">
                          <span className="font-medium text-white">{m.name}</span>
                          <span className="text-xs text-gray-500">by {m.vendor}</span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-gray-400">
                          {m.tagline} · {m.models.map((x) => x.label.replace(/^(Gemini|Groq) /, '')).join(', ')}
                        </span>
                      </span>
                      <span
                        className={cn(
                          'shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
                          selected
                            ? 'border-orange-400/30 bg-orange-400/10 text-orange-300'
                            : 'border-white/10 text-gray-400'
                        )}
                      >
                        {selected ? 'Active' : 'Ready'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {STEPS.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-4">
                    <Icon className="h-4 w-4 text-orange-300" />
                    <p className="mt-3 text-sm font-medium text-white">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400">{body}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <Accordion type="single" collapsible className="rounded-2xl border border-white/[0.07] bg-white/[0.015] px-4">
                <AccordionItem value="keys">
                  <AccordionTrigger>Where does my API key go?</AccordionTrigger>
                  <AccordionContent>
                    Directly into your browser — environment variables or localStorage. Requests go directly
                    from your browser to Google AI Studio or GroqCloud (or your proxy). Nothing touches intermediate servers.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="grounding">
                  <AccordionTrigger>Will it make things up?</AccordionTrigger>
                  <AccordionContent>
                    Every request carries a system prompt generated from my real profile data, with strict rules: only use those
                    facts, never invent employers or metrics, and say “I don’t know” otherwise.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="demo">
                  <AccordionTrigger>Can I use it without a key?</AccordionTrigger>
                  <AccordionContent>
                    Yes — the offline demo engine answers common questions instantly from the same data, fully on-device. Use
                    Google Gemini or Groq for free-form conversations.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="proxy">
                  <AccordionTrigger>Ship it with a server-side key (proxy)</AccordionTrigger>
                  <AccordionContent>
                    <p>Deploy a tiny edge proxy that injects the key, then point the custom endpoint at it:</p>
                    <pre className="scrollbar-thin mt-3 max-h-72 overflow-auto rounded-xl border border-white/[0.08] bg-black/50 p-3 font-mono text-[11px] leading-relaxed text-gray-300">
                      {PROXY_SNIPPET}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
