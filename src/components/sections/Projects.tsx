import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Star } from 'lucide-react';
import { accents, profile, type Project, type ProjectCategory } from '../../data/profile';
import { useChat } from '../../hooks/use-chat';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { EASE, GithubIcon, SectionHeading, SpotlightCard } from '../shared';

type Filter = 'All' | ProjectCategory;
const FILTERS: Filter[] = ['All', 'Distributed Systems', 'Data', 'APIs', 'Security'];

export function Projects() {
  const [filter, setFilter] = useState<Filter>('All');
  const list = filter === 'All' ? profile.projects : profile.projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Selected work"
          title={
            <>
              Systems I&apos;ve designed <span className="text-gradient">&amp; shipped</span>
            </>
          }
          description="Real problems, measurable outcomes. Ask my AI twin about any of them for the architecture deep-dive."
        />

        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Filter projects"
            className="scrollbar-thin flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.02] p-1"
          >
            {FILTERS.map((f) => {
              const count = f === 'All' ? profile.projects.length : profile.projects.filter((p) => p.category === f).length;
              return (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'relative isolate flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors',
                    filter === f ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                  )}
                >
                  {filter === f && (
                    <motion.span
                      layoutId="project-filter"
                      className="absolute inset-0 -z-10 rounded-xl bg-white/[0.08] ring-1 ring-white/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {f}
                  <span className="font-mono text-[10px] text-gray-500">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          layout
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const { ask } = useChat();
  const accent = accents[p.accent];

  return (
    <SpotlightCard className="flex h-full flex-col p-6 transition-colors hover:border-white/15">
      <div className="flex items-center justify-between gap-3">
        <span className={cn('rounded-full border px-2.5 py-0.5 text-[11px] font-medium', accent.border, accent.bg, accent.text)}>
          {p.category}
        </span>
        <span className="flex items-center gap-2 font-mono text-xs text-gray-500">
          {p.featured && <Star className="h-3.5 w-3.5 fill-amber-300/80 text-amber-300/80" aria-label="Featured" />}
          {p.year}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{p.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-400">{p.summary}</p>

      <dl className="mt-5 grid grid-cols-3 gap-2">
        {p.metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
            <dt className="truncate text-[10.5px] text-gray-500">{m.label}</dt>
            <dd className={cn('mt-0.5 font-mono text-sm font-semibold', accent.text)}>{m.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {p.tech.map((t) => (
          <span key={t} className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-gray-400">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-6">
        <div className="flex items-center gap-1">
          {p.github && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.title} source code`}
                  className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent>Source code</TooltipContent>
            </Tooltip>
          )}
          {p.live && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={p.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.title} live site`}
                  className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent>Live</TooltipContent>
            </Tooltip>
          )}
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            ask(`Tell me about the ${p.title} project — the architecture, your role and the hardest problem you solved.`)
          }
        >
          <Sparkles className="h-3.5 w-3.5 text-orange-300" />
          Ask AI about this
        </Button>
      </div>
    </SpotlightCard>
  );
}
