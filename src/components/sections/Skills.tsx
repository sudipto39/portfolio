import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cloud, Database, MousePointerClick, Server, Sparkles, X } from 'lucide-react';
import { coreStack, orbitStack, STACK_GROUPS, usedIn, type StackGroup, type StackTech } from '../../data/stack';
import { useChat } from '../../hooks/use-chat';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';
import { EASE, Reveal, SectionHeading } from '../shared';
import { StackOrbit } from './StackOrbit';

type Filter = 'all' | StackGroup;

const GROUP_ICONS: Record<StackGroup, typeof Server> = { backend: Server, data: Database, platform: Cloud };

function levelWord(level: number): string {
  if (level >= 92) return 'Daily driver · expert';
  if (level >= 85) return 'Advanced · production-hardened';
  if (level >= 75) return 'Strong · used regularly';
  return 'Solid working knowledge';
}

export function Skills() {
  const { ask } = useChat();
  const [filter, setFilter] = useState<Filter>('all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = coreStack.find((t) => t.id === activeId) ?? null;

  const changeFilter = (next: Filter) => {
    setFilter(next);
    const current = coreStack.find((t) => t.id === activeId);
    if (current && next !== 'all' && current.group !== next) setActiveId(null);
  };

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: coreStack.length },
    ...STACK_GROUPS.map((g) => ({ id: g.id, label: g.short, count: coreStack.filter((t) => t.group === g.id).length })),
  ];

  return (
    <section id="skills" className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.08),transparent_60%)]"
      />
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Stack"
          title={
            <>
              Everything I build <span className="text-gradient">converges here</span>
            </>
          }
          description="13 core tools wired into one system, with the rest of my toolbox in orbit. Hover or tap any of them to see how deep it goes — and where it has run in production."
        />

        <Reveal delay={0.05} className="mt-10 flex justify-center">
          <div
            role="radiogroup"
            aria-label="Filter the stack"
            className="scrollbar-thin flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.02] p-1"
          >
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={filter === f.id}
                onClick={() => changeFilter(f.id)}
                className={cn(
                  'relative isolate flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors',
                  filter === f.id ? 'text-white' : 'text-stone-400 hover:text-stone-200'
                )}
              >
                {filter === f.id && (
                  <motion.span
                    layoutId="stack-filter"
                    className="absolute inset-0 -z-10 rounded-xl bg-orange-400/[0.12] ring-1 ring-orange-400/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {f.label}
                <span className="font-mono text-[10px] text-stone-500">{f.count}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8">
          <StackOrbit filter={filter} activeId={activeId} onInspect={setActiveId} onReset={() => setActiveId(null)} />
        </div>

        <Reveal delay={0.1} className="relative z-10 mx-auto -mt-2 max-w-4xl">
          <div className="min-h-[188px] rounded-3xl border border-white/[0.08] bg-panel/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-6">
            <AnimatePresence mode="wait" initial={false}>
              {active ? (
                <TechDetails
                  key={active.id}
                  tech={active}
                  onClose={() => setActiveId(null)}
                  onAsk={() => ask(`What's your experience with ${active.name}? Where have you used it in production?`)}
                />
              ) : (
                <Overview key="overview" filter={filter} onFilter={changeFilter} />
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-3xl text-center font-mono text-[11px] leading-relaxed text-stone-500">
            <span className="text-orange-300/80">In orbit —</span> {orbitStack.map((t) => t.name).join(' · ')}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ panels ------------------------------ */

const panelMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.22, ease: EASE },
};

function TechDetails({ tech, onClose, onAsk }: { tech: StackTech; onClose: () => void; onAsk: () => void }) {
  const group = STACK_GROUPS.find((g) => g.id === tech.group);
  const places = usedIn(tech);

  return (
    <motion.div {...panelMotion} className="relative grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-8">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close details"
        className="absolute -right-1 -top-1 rounded-lg p-1.5 text-stone-500 transition hover:bg-white/5 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>

      <div>
        <div className="flex items-center gap-4">
          <span
            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_30%,#2e1d12,#1a100a)]"
            style={{ boxShadow: `0 0 32px -8px ${tech.icon.color}66` }}
          >
            <svg viewBox="0 0 24 24" width={28} height={28} aria-hidden>
              <path d={tech.icon.path} fill={tech.icon.color} />
            </svg>
          </span>
          <div className="min-w-0 pr-6">
            <h3 className="truncate text-lg font-semibold text-white">{tech.name}</h3>
            <p className="font-mono text-[11px] uppercase tracking-wider text-orange-300/80">{group?.label}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-baseline justify-between gap-3 text-xs">
            <span className="text-stone-400">{levelWord(tech.level)}</span>
            <span className="font-mono text-orange-200">{tech.level}/100</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-orange-600 via-orange-400 to-amber-300"
              initial={{ width: 0 }}
              animate={{ width: `${tech.level}%` }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <p className="text-[15px] leading-relaxed text-stone-300">{tech.blurb}</p>
        {places.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {places.map((p) => (
              <span
                key={p}
                className="rounded-md border border-orange-400/15 bg-orange-400/[0.06] px-2 py-0.5 font-mono text-[11px] text-orange-100/80"
              >
                {p}
              </span>
            ))}
          </div>
        )}
        <div className="mt-5 md:mt-auto md:pt-5">
          <Button size="sm" variant="secondary" onClick={onAsk}>
            <Sparkles className="h-3.5 w-3.5 text-orange-300" />
            Ask my AI twin about {tech.name}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function Overview({ filter, onFilter }: { filter: Filter; onFilter: (f: Filter) => void }) {
  return (
    <motion.div {...panelMotion}>
      <p className="mb-4 flex items-center gap-2 text-xs text-stone-500">
        <MousePointerClick className="h-3.5 w-3.5 text-orange-300/80" />
        Hover or tap any tool above to inspect it — or focus a layer of the stack:
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {STACK_GROUPS.map((g) => {
          const Icon = GROUP_ICONS[g.id];
          const techs = coreStack.filter((t) => t.group === g.id);
          const avg = Math.round(techs.reduce((sum, t) => sum + t.level, 0) / techs.length);
          const selected = filter === g.id;
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onFilter(selected ? 'all' : g.id)}
              className={cn(
                'rounded-2xl border p-4 text-left transition',
                selected
                  ? 'border-orange-400/40 bg-orange-400/[0.08]'
                  : 'border-white/[0.07] bg-white/[0.015] hover:border-orange-400/25 hover:bg-white/[0.03]'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-medium text-white">
                  <Icon className="h-4 w-4 text-orange-300" />
                  {g.label}
                </span>
                <span className="font-mono text-xs text-orange-200/80">{avg}</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                {techs.map((t) => (
                  <span key={t.id} title={t.name} className="grid h-7 w-7 place-items-center rounded-full border border-white/[0.08] bg-ink">
                    <svg viewBox="0 0 24 24" width={14} height={14} aria-hidden>
                      <path d={t.icon.path} fill={t.icon.color} />
                    </svg>
                  </span>
                ))}
              </div>
              <p className="mt-3 truncate text-xs text-stone-500">{techs.map((t) => t.name).join(' · ')}</p>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
