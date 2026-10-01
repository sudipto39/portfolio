import { useState } from 'react';
import { motion } from 'framer-motion';
import { Braces, Check, Copy, Radio, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useChat } from '../hooks/use-chat';
import { PROVIDER_ORDER, PROVIDERS, type ProviderId } from '../lib/ai/config';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/button';
import { ChatPanel } from '../components/ai/ChatPanel';
import { EASE, PageTransition, ProviderIcon, SectionHeading, SpotlightCard, StaggerContainer, StaggerItem } from '../components/shared';
import { PageBackground } from '../components/animations/PageBackground';
import { AnimatedParagraph } from '../components/animations/ParagraphAnimation';

const STEPS = [
  {
    icon: Braces,
    title: 'Grounded on Single Source of Truth',
    body: 'The AI system prompt is dynamically assembled from profile.ts with exact architectural details, tech metrics, and battle scars.',
  },
  {
    icon: Radio,
    title: 'Token-by-Token SSE Streaming',
    body: 'Server-Sent Events reader parses streaming chunks and batches token renders with requestAnimationFrame for smooth 60fps output.',
  },
  {
    icon: ShieldCheck,
    title: 'Private & Zero Telemetry',
    body: 'Your queries stay in your browser or your own Cloudflare Worker proxy. No intermediate analytics or telemetry databases.',
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

export function AITwinPage() {
  const { setProvider, activeProvider } = useChat();
  const [copied, setCopied] = useState(false);

  const choose = (id: ProviderId) => {
    setProvider(id);
    toast.success(id === 'demo' ? 'Switched to offline demo engine' : `Active engine: ${PROVIDERS[id].name}`);
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(PROXY_SNIPPET).then(() => {
      setCopied(true);
      toast.success('Worker proxy snippet copied');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <PageTransition className="relative pt-28 pb-24 sm:pt-36 sm:pb-32">
      {/* Background Animated Synaptic Neural Grid & Floating Embers */}
      <PageBackground variant="ai-twin" />

      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <SectionHeading
          eyebrow="Interactive AI Studio"
          title={
            <>
              Talk to my <span className="text-gradient">AI twin</span>
            </>
          }
          description="Ask questions about my distributed systems architecture, consistency trade-offs, scaling bottlenecks, or career milestones."
        />

        {/* Provider Switcher Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
          className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:flex-row sm:px-6"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-gray-400 mr-2">Engine:</span>
            {PROVIDER_ORDER.map((id) => {
              const p = PROVIDERS[id];
              const isSelected = activeProvider === id;
              return (
                <motion.button
                  key={id}
                  type="button"
                  onClick={() => choose(id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    'relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all',
                    isSelected
                      ? 'border border-orange-400/40 bg-orange-400/15 text-orange-200 shadow-[0_0_16px_rgba(251,146,60,0.15)]'
                      : 'border border-white/[0.06] bg-white/[0.02] text-gray-400 hover:border-white/15 hover:text-white'
                  )}
                >
                  <ProviderIcon provider={id} className="h-4 w-4" />
                  <span>{p.name}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="text-xs text-gray-500 font-mono">
            Zero friction · Free tier &amp; offline grounded
          </div>
        </motion.div>

        {/* Main Chat Panel Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, delay: 0.15, ease: EASE }}
          className="mt-8 rounded-3xl border border-white/[0.08] bg-panel/90 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden hover:border-orange-400/20 transition-colors"
        >
          <ChatPanel className="min-h-[650px] max-h-[850px]" />
        </motion.div>

        {/* How It Works Architecture Breakdown */}
        <div className="mt-20">
          <h3 className="text-xl font-bold text-white text-center mb-8">
            How this AI Twin is engineered
          </h3>
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <StaggerItem key={step.title} className="h-full">
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="h-full"
                  >
                    <SpotlightCard className="group p-6 flex flex-col h-full transition-all duration-300 hover:border-orange-400/30 hover:shadow-xl hover:shadow-orange-500/5">
                      <span className="grid h-10 w-10 place-items-center rounded-xl border border-orange-400/25 bg-orange-400/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                        <Icon className="h-5 w-5 text-orange-300" />
                      </span>
                      <h4 className="mt-4 font-semibold text-white group-hover:text-orange-100 transition-colors">{step.title}</h4>
                      <AnimatedParagraph delay={0.08} className="mt-2 text-sm leading-relaxed text-gray-400 flex-1">
                        {step.body}
                      </AnimatedParagraph>
                    </SpotlightCard>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Cloudflare Worker Proxy Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.95, ease: EASE }}
          className="mt-16 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8"
        >
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h4 className="font-semibold text-white">Want to keep your API key on the server?</h4>
              <AnimatedParagraph delay={0.08} className="mt-1 text-sm text-gray-400">
                Deploy this tiny Cloudflare Worker proxy in 2 minutes to forward Gemini or Groq SSE requests safely.
              </AnimatedParagraph>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" onClick={copySnippet}>
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy Worker Code'}
              </Button>
            </motion.div>
          </div>

          <pre className="mt-6 max-h-72 overflow-x-auto rounded-xl border border-white/[0.06] bg-ink/90 p-4 font-mono text-xs leading-relaxed text-gray-300 scrollbar-thin">
            {PROXY_SNIPPET}
          </pre>
        </motion.div>
      </div>
    </PageTransition>
  );
}
