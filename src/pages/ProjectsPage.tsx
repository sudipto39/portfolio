import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Globe, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { accents, profile, type Project, type ProjectCategory } from '../data/profile';
import { useChat } from '../hooks/use-chat';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/button';
import { EASE, GithubIcon, PageTransition, SectionHeading, SpotlightCard } from '../components/shared';
import { PageBackground } from '../components/animations/PageBackground';
import { AnimatedParagraph } from '../components/animations/ParagraphAnimation';

type Filter = 'All' | ProjectCategory;
const FILTERS: Filter[] = ['All', 'Distributed Systems', 'Data', 'APIs', 'Security'];

export function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');

  const list = useMemo(() => {
    return profile.projects.filter((p) => {
      const matchesFilter = filter === 'All' || p.category === filter;
      if (!matchesFilter) return false;
      if (!search.trim()) return true;

      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.details.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q)) ||
        p.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [filter, search]);

  return (
    <PageTransition className="relative pt-28 pb-24 sm:pt-36 sm:pb-32">
      {/* Background Animated Beams, Tech Grid, and Floating Embers */}
      <PageBackground variant="projects" />

      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 lg:px-16 overflow-x-clip">
        {/* Page Heading */}
        <SectionHeading
          eyebrow="Selected Work"
          title={
            <>
              Production systems <span className="text-gradient">engineered to scale</span>
            </>
          }
          description="Distributed event ledgers, high-throughput stream pipelines, and fault-tolerant infrastructure built for strict consistency."
        />

        {/* Category Filter Pills (Centered in the middle) */}
        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Filter projects"
            className="scrollbar-thin flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.02] p-1.5"
          >
            {FILTERS.map((f) => {
              const count = f === 'All' ? profile.projects.length : profile.projects.filter((p) => p.category === f).length;
              return (
                <motion.button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    'relative isolate flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-colors',
                    filter === f ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                  )}
                >
                  {filter === f && (
                    <motion.span
                      layoutId="project-filter-pill"
                      className="absolute inset-0 -z-10 rounded-xl bg-orange-400/[0.14] ring-1 ring-orange-400/25"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {f}
                  <span className="font-mono text-[10px] text-gray-500">{count}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Quick Search Input & Counter */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-xs sm:text-sm text-gray-400 font-mono">
            <span>Showing {list.length} of {profile.projects.length} systems</span>
            {search && (
              <button onClick={() => setSearch('')} className="ml-3 text-orange-300 hover:underline">
                Clear search
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tech, keyword, or architecture…"
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-orange-400/40 focus:ring-2 focus:ring-orange-400/20"
            />
          </div>
        </div>

        {/* Project Grid (3 cards per row on desktop) */}
        <motion.div
          layout
          className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => {
              const col = i % 3; // 0 = left, 1 = middle, 2 = right
              const row = Math.floor(i / 3);
              const delay = Math.min(row * 0.2, 0.4) + (col === 1 ? 0.14 : 0);

              // Left card comes from left, right from right, middle fades clearly in the center
              const initial =
                col === 0
                  ? { opacity: 0, x: -120, scale: 0.96 }
                  : col === 2
                  ? { opacity: 0, x: 120, scale: 0.96 }
                  : { opacity: 0, x: 0, scale: 0.88 };

              const exit =
                col === 0
                  ? { opacity: 0, x: -60, scale: 0.95 }
                  : col === 2
                  ? { opacity: 0, x: 60, scale: 0.95 }
                  : { opacity: 0, scale: 0.9 };

              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={initial}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, margin: '0px 0px -30px 0px' }}
                  exit={{ ...exit, transition: { duration: 0.22, ease: 'easeIn' } }}
                  transition={{
                    layout: { type: 'spring', stiffness: 320, damping: 30 },
                    duration: 0.95,
                    delay,
                    ease: EASE,
                  }}
                  className="h-full"
                >
                  <FullProjectCard project={p} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {list.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 rounded-2xl border border-white/[0.06] bg-white/[0.015] py-16 text-center"
          >
            <p className="text-gray-400 text-sm">No projects matched your search criteria.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setFilter('All');
                setSearch('');
              }}
            >
              Reset Filters
            </Button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}

function FullProjectCard({ project: p }: { project: Project }) {
  const { ask } = useChat();
  const accent = accents[p.accent];

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="h-full"
    >
      <SpotlightCard className="group flex h-full flex-col p-6 transition-all duration-300 hover:border-orange-400/40 hover:shadow-2xl hover:shadow-orange-500/10">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3">
          <span className={cn('rounded-full border px-2.5 py-0.5 font-mono text-[11px] transition-transform duration-200 group-hover:scale-105', accent.border, accent.bg, accent.text)}>
            {p.category}
          </span>
          <span className="font-mono text-xs text-gray-500">{p.year}</span>
        </div>

        {/* Title & Role */}
        <h3 className="mt-4 text-xl font-semibold tracking-tight text-white transition-colors duration-200 group-hover:text-orange-100">{p.title}</h3>
        <div className="mt-1 font-mono text-xs text-gray-400">Role: {p.role}</div>

        {/* Summary */}
        <AnimatedParagraph delay={0.05} className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">
          {p.summary}
        </AnimatedParagraph>

        {/* Production Metrics */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center transition-colors group-hover:border-white/[0.12] group-hover:bg-white/[0.04]"
        >
          {p.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-mono text-sm font-semibold text-white group-hover:text-orange-200 transition-colors">{m.value}</div>
              <div className="truncate text-[10px] text-gray-500">{m.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tech Stack Chips */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <motion.span
              key={t}
              whileHover={{ scale: 1.08, y: -1 }}
              transition={{ duration: 0.15 }}
              className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 font-mono text-[11px] text-gray-300 hover:border-orange-400/40 hover:text-orange-200"
            >
              {t}
            </motion.span>
          ))}
        </div>

        {/* Action Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4">
          <Link
            to={`/projects/${p.id}`}
            className="group/btn inline-flex items-center gap-1.5 text-xs font-semibold text-orange-300 transition-all duration-200 hover:text-orange-200"
          >
            Case Study <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1.5" />
          </Link>

          <div className="flex items-center gap-2">
            {p.github && (
              <motion.a
                href={p.github}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.2, rotate: 6 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="GitHub Repository"
              >
                <GithubIcon className="h-4 w-4" />
              </motion.a>
            )}
            {p.live && (
              <motion.a
                href={p.live}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.2, rotate: -6 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="Live Demo / Portal"
              >
                <Globe className="h-4 w-4" />
              </motion.a>
            )}
            <motion.button
              type="button"
              onClick={() => ask(`Explain the architecture and design decisions behind the ${p.title} project`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1 rounded-lg border border-orange-400/25 bg-orange-400/10 px-2.5 py-1 text-xs text-orange-300 transition-colors hover:bg-orange-400/20 hover:text-orange-100"
            >
              <Sparkles className="h-3 w-3 animate-pulse" />
              Ask AI
            </motion.button>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
