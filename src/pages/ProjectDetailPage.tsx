import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Globe, Layers, Server, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { accents, profile } from '../data/profile';
import { useChat } from '../hooks/use-chat';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/button';
import { EASE, GithubIcon, PageTransition, SpotlightCard } from '../components/shared';
import { PageBackground } from '../components/animations/PageBackground';
import { AnimatedParagraph } from '../components/animations/ParagraphAnimation';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram';

const GITEAFORGE_MODULES = [
  { id: 1, name: 'Projects & Collaboration', count: 21, path: '/api/v1/projects' },
  { id: 2, name: 'Admin & System Management', count: 15, path: '/api/v1/admin' },
  { id: 3, name: 'Lab Assignments & Code Sandbox', count: 15, path: '/api/v1/lab-assignments' },
  { id: 4, name: 'Users & Credentials', count: 11, path: '/api/v1/users' },
  { id: 5, name: 'Milestones & Submissions', count: 9, path: '/api/v1' },
  { id: 6, name: 'Authentication & Session', count: 8, path: '/api/v1/auth' },
  { id: 7, name: 'Batches & Academic Roster', count: 8, path: '/api/v1/batches' },
  { id: 8, name: 'Supervisor Portal', count: 8, path: '/api/v1/supervisors' },
  { id: 9, name: 'Problem Statements', count: 6, path: '/api/v1/problem-statements' },
  { id: 10, name: 'Gitea Repository Management', count: 6, path: '/api/v1/gitea' },
  { id: 11, name: 'Courses', count: 5, path: '/api/v1/courses' },
  { id: 12, name: 'Activities & Heatmap', count: 5, path: '/api/v1/activities' },
  { id: 13, name: 'Execution Sandbox, Files, Evaluations & Webhooks', count: 10, path: '/api/v1/sandbox' },
  { id: 14, name: 'Root & Monitoring', count: 3, path: '/api-docs Swagger UI' },
];

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { ask } = useChat();

  const currentIndex = profile.projects.findIndex((p) => p.id === id);
  const project = profile.projects[currentIndex];

  if (!project) {
    return (
      <PageTransition className="mx-auto max-w-4xl px-4 pt-36 pb-24 text-center">
        <h2 className="text-3xl font-bold text-white">Project Not Found</h2>
        <p className="mt-3 text-gray-400">The requested architecture case study does not exist.</p>
        <Button asChild variant="gradient" className="mt-8">
          <Link to="/projects">
            <ArrowLeft className="h-4 w-4" /> Back to All Projects
          </Link>
        </Button>
      </PageTransition>
    );
  }

  const prevProject = currentIndex > 0 ? profile.projects[currentIndex - 1] : null;
  const nextProject = currentIndex < profile.projects.length - 1 ? profile.projects[currentIndex + 1] : null;
  const accent = accents[project.accent];

  return (
    <PageTransition className="relative pt-28 pb-24 sm:pt-36 sm:pb-32">
      <PageBackground variant="projects" />
      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16">
        {/* Navigation Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="flex items-center gap-2 text-xs sm:text-sm font-mono text-gray-400"
        >
          <Link to="/projects" className="group inline-flex items-center gap-1 hover:text-white transition">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Projects
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-orange-300">{project.category}</span>
          <span className="text-gray-600">/</span>
          <span className="text-gray-300 truncate">{project.title}</span>
        </motion.div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
          className="mt-8 border-b border-white/[0.08] pb-10"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className={cn('rounded-full border px-3 py-1 font-mono text-xs', accent.border, accent.bg, accent.text)}>
              {project.category}
            </span>
            <span className="font-mono text-xs text-gray-400">{project.year}</span>
            <span className="font-mono text-xs text-gray-400">·</span>
            <span className="font-mono text-xs text-gray-300">Role: {project.role}</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>

          <p className="mt-5 max-w-4xl text-lg sm:text-xl leading-relaxed text-gray-300">
            {project.summary}
          </p>

          {/* Links Row */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {project.github && (
              <Button asChild variant="outline" size="lg" className="transition-transform hover:scale-105">
                <a href={project.github} target="_blank" rel="noreferrer">
                  <GithubIcon className="h-4 w-4" /> View Source on GitHub
                </a>
              </Button>
            )}
            {project.live && (
              <Button asChild variant="outline" size="lg" className="transition-transform hover:scale-105">
                <a href={project.live} target="_blank" rel="noreferrer">
                  <Globe className="h-4 w-4" /> Live Deployment / Docs
                </a>
              </Button>
            )}
            <Button
              variant="gradient"
              size="lg"
              className="transition-transform hover:scale-105"
              onClick={() => ask(`Walk me through the system design of ${project.title}: architecture, trade-offs and consistency model`)}
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              Ask AI Twin Architecture Deep-Dive
            </Button>
          </div>
        </motion.div>

        {/* GiteaForge Cloud-Native Interactive Architecture Diagram */}
        {project.id === 'giteaforge' && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.05, ease: EASE }}
            className="mt-12"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-orange-400">
                  Cloud-Native System Topology
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Interactive Architecture Topology
                </h2>
              </div>
              <div className="flex items-center gap-4 font-mono text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Express 5 Gateway
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                  Judge0 VM Execution
                </span>
              </div>
            </div>
            <ArchitectureDiagram />

            {/* Detailed Endpoint Breakdown by Module (129 APIs total, 130 with Swagger UI) */}
            <div className="mt-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-orange-400 uppercase tracking-wider">
                    <Server className="h-4 w-4" /> Production API Topology
                  </div>
                  <h3 className="mt-1 text-xl sm:text-2xl font-bold text-white">
                    Detailed Endpoint Breakdown by Module
                  </h3>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-orange-400/30 bg-orange-400/10 px-4 py-2 font-mono text-xs sm:text-sm">
                  <span className="font-bold text-white">Total: <span className="text-orange-300">129 APIs</span></span>
                  <span className="text-gray-400">(130 with <code className="text-amber-200">/api-docs</code> Swagger UI)</span>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {GITEAFORGE_MODULES.map((mod) => (
                  <motion.div
                    key={mod.id}
                    whileHover={{ scale: 1.015, x: 2 }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition-colors hover:border-orange-400/30 hover:bg-orange-400/[0.03]"
                  >
                    <div className="min-w-0 flex items-center gap-2.5">
                      <span className="font-mono text-xs font-semibold text-orange-400 shrink-0">
                        {mod.id}.
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-xs sm:text-sm font-medium text-gray-200">
                          {mod.name}
                        </div>
                        <code className="text-[11px] font-mono text-gray-500 truncate block">
                          {mod.path}
                        </code>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] font-semibold text-orange-300">
                      {mod.count} APIs
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 2-Column Wide Content Grid */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left Column: Architectural Deep Dive */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.95, delay: 0.15, ease: EASE }}
            className="space-y-8"
          >
            <SpotlightCard className="p-8 sm:p-10 transition-all duration-300 hover:border-orange-400/30 hover:shadow-xl hover:shadow-orange-500/5">
              <h2 className="text-2xl font-bold text-white">System Architecture &amp; Implementation</h2>
              <div className="mt-6 text-base sm:text-lg leading-relaxed text-gray-300 space-y-4">
                <p>{project.details}</p>
              </div>
            </SpotlightCard>

            {/* Interactive AI Twin Prompt Box */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl border border-orange-400/25 bg-linear-to-br from-orange-950/30 via-panel to-ink p-8 shadow-xl shadow-orange-500/5"
            >
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-orange-300">
                <Sparkles className="h-4 w-4 animate-spin-slow" />
                Interactive Architectural Q&amp;A
              </div>
              <h3 className="mt-3 text-2xl font-bold text-white">
                Want deeper technical insights into this system?
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-400">
                Click any question below to inspect the architectural trade-offs, consistency guarantees, and failure modes with my AI Twin:
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                {[
                  {
                    prompt: `How did you handle idempotency keys and prevent duplicate transactions in the ${project.title}?`,
                    label: '“How was idempotency guaranteed across writes?”',
                  },
                  {
                    prompt: `What were the hardest operational failure modes encountered when running ${project.title} in production?`,
                    label: '“What failure modes occurred in production & how were they mitigated?”',
                  },
                  {
                    prompt: `Why was the specific tech stack (${project.tech.join(', ')}) chosen for ${project.title}?`,
                    label: '“Why this specific technology stack over alternatives?”',
                  },
                ].map((item) => (
                  <motion.button
                    key={item.label}
                    type="button"
                    onClick={() => ask(item.prompt)}
                    whileHover={{ x: 8, scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left text-sm text-gray-200 transition-colors hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-white"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-4 w-4 text-orange-400/50 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Production Metrics & Tech Ecosystem */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.95, delay: 0.25, ease: EASE }}
            className="space-y-8"
          >
            {/* Production Metrics Highlights */}
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8">
              <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-6">
                Production Outcomes &amp; Telemetry
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                {project.metrics.map((m) => (
                  <motion.div
                    key={m.label}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-center sm:text-left lg:text-left transition-colors hover:border-orange-400/30 hover:bg-orange-400/[0.03]"
                  >
                    <div className="font-mono text-3xl font-bold text-orange-300 transition-colors group-hover:text-amber-200">
                      {m.value}
                    </div>
                    <div className="mt-1 font-mono text-xs text-gray-400 uppercase tracking-wider">
                      {m.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Technologies Used */}
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Technologies &amp; Infrastructure</h3>
                <Link to="/stack" className="group inline-flex items-center gap-1 font-mono text-xs text-orange-300 hover:text-orange-200 transition">
                  3D Orbit <Layers className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {project.tech.map((t) => (
                  <motion.div
                    key={t}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <Link
                      to="/stack"
                      className="inline-block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs sm:text-sm text-gray-300 transition-colors hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-200"
                    >
                      {t}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Previous / Next Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.2 }}
          className="mt-16 flex items-center justify-between border-t border-white/[0.08] pt-8"
        >
          {prevProject ? (
            <Link
              to={`/projects/${prevProject.id}`}
              className="group flex flex-col text-left transition"
            >
              <span className="font-mono text-xs text-gray-500 group-hover:text-orange-300 flex items-center gap-1 transition-colors">
                <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1.5" /> Previous System
              </span>
              <span className="mt-1 text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              to={`/projects/${nextProject.id}`}
              className="group flex flex-col text-right transition"
            >
              <span className="font-mono text-xs text-gray-500 group-hover:text-orange-300 flex items-center justify-end gap-1 transition-colors">
                Next System <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1.5" />
              </span>
              <span className="mt-1 text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                {nextProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
