import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Cloud, Database, Server, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { coreStack, orbitStack, STACK_GROUPS, usedIn, type StackGroup, type StackTech } from '../data/stack';
import { useChat } from '../hooks/use-chat';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/button';
import { EASE, PageTransition, SectionHeading, SpotlightCard, StaggerContainer, StaggerItem } from '../components/shared';
import { StackOrbit } from '../components/sections/StackOrbit';
import { PageBackground } from '../components/animations/PageBackground';
import { AnimatedParagraph } from '../components/animations/ParagraphAnimation';

type Filter = 'all' | StackGroup;

const GROUP_ICONS: Record<StackGroup, typeof Server> = {
  backend: Server,
  data: Database,
  platform: Cloud,
};

function levelWord(level: number): string {
  if (level >= 92) return 'Daily driver · expert';
  if (level >= 85) return 'Advanced · production-hardened';
  if (level >= 75) return 'Strong · used regularly';
  return 'Solid working knowledge';
}

export function StackPage() {
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
    { id: 'all', label: 'All Core', count: coreStack.length },
    ...STACK_GROUPS.map((g) => ({
      id: g.id,
      label: g.short,
      count: coreStack.filter((t) => t.group === g.id).length,
    })),
  ];

  return (
    <PageTransition className="relative pt-28 pb-24 sm:pt-36 sm:pb-32">
      {/* Background Animated Concentric Orbital Rings, Tech Grid & Floating Embers */}
      <PageBackground variant="stack" />

      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 lg:px-16 overflow-x-clip">
        {/* Header */}
        <SectionHeading
          eyebrow="Engine Room"
          title={
            <>
              Technology stack <span className="text-gradient">&amp; infrastructure</span>
            </>
          }
          description="14 core technologies wired into one system, with the rest of my toolbox in orbit. Rotate and tap any node to inspect proficiency and production usage."
        />

        {/* Orbit Filter Pills */}
        <div className="mt-10 flex justify-center">
          <div
            role="radiogroup"
            aria-label="Filter the stack"
            className="scrollbar-thin flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.02] p-1.5"
          >
            {filters.map((f) => (
              <motion.button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={filter === f.id}
                onClick={() => changeFilter(f.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  'relative isolate flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-colors',
                  filter === f.id ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                )}
              >
                {filter === f.id && (
                  <motion.span
                    layoutId="stack-filter-pill"
                    className="absolute inset-0 -z-10 rounded-xl bg-orange-400/[0.14] ring-1 ring-orange-400/25"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {f.label}
                <span className="font-mono text-[10px] text-gray-500">{f.count}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 3D Orbit Visualization */}
        <div className="mt-8">
          <StackOrbit
            filter={filter}
            activeId={activeId}
            onInspect={setActiveId}
            onReset={() => setActiveId(null)}
          />
        </div>

        {/* Dynamic Detail Card */}
        <div className="relative z-10 mx-auto -mt-2 max-w-5xl">
          <div className="min-h-[190px] rounded-3xl border border-white/[0.08] bg-panel/85 p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
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
        </div>

        {/* Orbital Tools String */}
        <div className="mt-6 text-center">
          <p className="font-mono text-xs text-gray-500">
            <span className="text-orange-300 font-semibold">Supporting ecosystem in orbit:</span>{' '}
            {orbitStack.map((t) => t.name).join(' · ')}
          </p>
        </div>

        {/* Category Breakdown Sections */}
        <div className="mt-20 space-y-12">
          <div className="border-t border-white/[0.08] pt-12">
            <h3 className="text-2xl font-bold tracking-tight text-white mb-8 text-center sm:text-left">
              Detailed Competency Matrix
            </h3>

            <div className="grid gap-6 md:grid-cols-3 overflow-x-clip">
              {profile.skillGroups.map((group, idx) => {
                const col = idx % 3; // 0 = left, 1 = middle, 2 = right
                const Icon = GROUP_ICONS[group.id];

                const initial =
                  col === 0
                    ? { opacity: 0, x: -110, scale: 0.96 }
                    : col === 2
                    ? { opacity: 0, x: 110, scale: 0.96 }
                    : { opacity: 0, x: 0, scale: 0.88 };

                return (
                  <motion.div
                    key={group.id}
                    initial={initial}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: '0px 0px -30px 0px' }}
                    whileHover={{ y: -6, scale: 1.015 }}
                    transition={{ duration: 0.95, delay: col === 1 ? 0.14 : 0, ease: EASE }}
                    className="h-full"
                  >
                    <SpotlightCard className="group flex flex-col h-full p-6 transition-all duration-300 hover:border-orange-400/30 hover:shadow-2xl hover:shadow-orange-500/5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl border border-orange-400/25 bg-orange-400/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                          <Icon className="h-5 w-5 text-orange-300" />
                        </span>
                        <div>
                          <h4 className="font-semibold text-white group-hover:text-orange-100 transition-colors">{group.title}</h4>
                          <span className="font-mono text-[11px] text-gray-500">{group.skills.length} core tools</span>
                        </div>
                      </div>

                      <AnimatedParagraph delay={0.08} className="mt-3 text-xs text-gray-400">
                        {group.description}
                      </AnimatedParagraph>

                      <div className="mt-6 space-y-3.5 flex-1">
                        {group.skills.map((s, sIdx) => (
                          <div key={s.name}>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-gray-300">{s.name}</span>
                              <span className="font-mono text-orange-300 font-semibold">{s.level}%</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                              <motion.div
                                className="h-full rounded-full bg-linear-to-r from-orange-600 via-orange-500 to-amber-400"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${s.level}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.15, delay: sIdx * 0.09, ease: EASE }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/[0.06]">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500 block mb-2">
                          Additional tools &amp; frameworks:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {group.extras.map((extra) => (
                            <motion.span
                              key={extra}
                              whileHover={{ scale: 1.08, y: -1 }}
                              transition={{ duration: 0.15 }}
                              className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-gray-400 hover:border-orange-400/30 hover:text-orange-200"
                            >
                              {extra}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.95, ease: EASE }}
          className="mt-20 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 sm:flex-row transition-all duration-300 hover:border-orange-400/20"
        >
          <div>
            <h4 className="text-xl font-semibold text-white">Want to see these tools in action?</h4>
            <AnimatedParagraph delay={0.1} className="mt-1 text-sm text-gray-400">
              Browse production systems built with Go, Kafka, PostgreSQL, and Kubernetes.
            </AnimatedParagraph>
          </div>
          <Button asChild size="lg" variant="gradient" className="group shrink-0">
            <Link to="/projects">
              View Production Systems <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  );
}

function TechDetails({
  tech,
  onClose,
  onAsk,
}: {
  tech: StackTech;
  onClose: () => void;
  onAsk: () => void;
}) {
  const group = STACK_GROUPS.find((g) => g.id === tech.group);
  const places = usedIn(tech);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: EASE }}
      className="relative grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close details"
        className="absolute -right-1 -top-1 rounded-lg p-1.5 text-gray-500 transition hover:bg-white/5 hover:text-white"
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
            <p className="font-mono text-[11px] uppercase tracking-wider text-orange-300">{group?.label}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-baseline justify-between gap-3 text-xs">
            <span className="text-gray-400">{levelWord(tech.level)}</span>
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
        <p className="text-[14.5px] leading-relaxed text-gray-300">{tech.blurb}</p>
        {places.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {places.map((place) => (
              <span
                key={place}
                className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-gray-300"
              >
                {place}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 pt-3 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onAsk}
            className="inline-flex items-center gap-1.5 text-xs text-orange-300 hover:text-orange-200"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ask my AI twin about {tech.name} in production
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Overview({
  onFilter,
}: {
  filter: Filter;
  onFilter: (f: Filter) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: EASE }}
      className="flex flex-col justify-between gap-4 md:flex-row md:items-center"
    >
      <div>
        <h4 className="text-base font-semibold text-white">Interactive 3D Stack Constellation</h4>
        <p className="mt-1 text-sm text-gray-400 max-w-xl">
          Hover or click any orbital node in the 3D canvas above to inspect proficiency ratings, architectural role, and links to the production projects where it runs.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onFilter('backend')}
          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-gray-300 hover:border-orange-400/40 hover:text-white"
        >
          Backend
        </button>
        <button
          type="button"
          onClick={() => onFilter('data')}
          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-gray-300 hover:border-orange-400/40 hover:text-white"
        >
          Data
        </button>
        <button
          type="button"
          onClick={() => onFilter('platform')}
          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-gray-300 hover:border-orange-400/40 hover:text-white"
        >
          Platform
        </button>
      </div>
    </motion.div>
  );
}
