import { motion } from 'framer-motion';
import { ArrowRight, Layers, Sparkles, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';
import { accents, profile, type Project } from '../data/profile';
import { useChat } from '../hooks/use-chat';
import { Button } from '../components/ui/button';
import { Hero, TechMarquee } from '../components/sections/Hero';
import { Counter, EASE, PageTransition, SectionHeading, SpotlightCard, StaggerContainer, StaggerItem } from '../components/shared';

export function HomePage() {
  const featuredProjects = profile.projects.filter((p) => p.featured).slice(0, 3);

  return (
    <PageTransition className="relative">
      {/* Hero with live terminal & interactive prompt */}
      <Hero />

      {/* Real-time tech marquee */}
      <TechMarquee />

      {/* Production Stats Row */}
      <section className="relative border-b border-white/[0.06] bg-white/[0.01] py-16">
        <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 lg:px-16">
          <StaggerContainer className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-12">
            {profile.stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.03 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5 text-center sm:text-left transition-colors hover:border-orange-400/30 hover:bg-orange-400/[0.02]"
                >
                  <div className="font-mono text-3xl font-bold tracking-tight text-white sm:text-5xl">
                    <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                  </div>
                  <div className="mt-2 text-xs text-gray-400 sm:text-sm">{stat.label}</div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Architecture Projects */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 lg:px-16 overflow-x-clip">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              align="left"
              eyebrow="Flagship Systems"
              title={
                <>
                  Architectures designed <span className="text-gradient">for zero drift</span>
                </>
              }
              description="High-throughput money movement, distributed job queues, and real-time streaming pipelines operating at enterprise scale."
            />
            <Button asChild variant="outline" className="group shrink-0">
              <Link to="/projects">
                View all {profile.projects.length} systems <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p, i) => (
              <FeaturedProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Architecture & Engineering Principles Teaser */}
      <section className="relative border-t border-white/[0.06] bg-white/[0.015] py-24 sm:py-32">
        <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 lg:px-16">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.15fr] overflow-hidden">
            {/* Left portion slides in from left */}
            <motion.div
              initial={{ opacity: 0, x: -70 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '0px 0px -20px 0px' }}
              transition={{ duration: 1.05, ease: EASE }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/[0.06] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-orange-300">
                <Workflow className="h-3.5 w-3.5" />
                Live Architecture
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl leading-tight">
                Cloud-native resilience, <span className="text-gradient">verified security</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-gray-400 sm:text-lg">
                I design backend systems that fail gracefully, protect sensitive webhook payloads with cryptographic HMAC-SHA256 verification, and isolate untrusted code in Dockerized sandboxes. Architected GiteaForge on GCP Cloud Run with automated Neon PostgreSQL migrations and hybrid Redis session fallbacks.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-orange-400/30"
                >
                  <div className="font-mono text-3xl font-bold text-orange-300">&lt; 45ms</div>
                  <div className="mt-1 text-xs text-gray-400 sm:text-sm">Webhook ingestion latency</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-orange-400/30"
                >
                  <div className="font-mono text-3xl font-bold text-amber-300">0</div>
                  <div className="mt-1 text-xs text-gray-400 sm:text-sm">Critical failures in production</div>
                </motion.div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild variant="gradient" size="lg" className="group">
                  <Link to="/about">
                    Explore Architecture &amp; Principles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="transition-transform hover:scale-105">
                  <Link to="/experience">View Experience &amp; Education</Link>
                </Button>
              </div>
            </motion.div>

            {/* Right portion slides in from right */}
            <motion.div
              initial={{ opacity: 0, x: 70 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '0px 0px -20px 0px' }}
              transition={{ duration: 1.05, delay: 0.15, ease: EASE }}
            >
              <SpotlightCard className="p-8 transition-all duration-300 hover:border-orange-400/30 hover:shadow-2xl hover:shadow-orange-500/5">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 font-mono text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>giteaforge.topology</span>
                  </div>
                  <span className="text-orange-300 font-semibold">GCP Cloud Run · Docker</span>
                </div>

                <div className="my-8 space-y-4 font-mono text-xs sm:text-sm">
                  <motion.div
                    whileHover={{ scale: 1.015, x: 4 }}
                    className="flex items-center justify-between rounded-xl border border-orange-400/20 bg-orange-400/5 px-5 py-4 transition-colors hover:bg-orange-400/10"
                  >
                    <span className="text-gray-200 font-medium">GCP Cloud Run (Containerized)</span>
                    <span className="text-orange-300">Express 5 · JWT</span>
                  </motion.div>
                  <div className="flex justify-center">
                    <span className="text-gray-500 font-mono text-xs">↓ HMAC-SHA256 Webhook Verification</span>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.015, x: 4 }}
                    className="flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-400/5 px-5 py-4 transition-colors hover:bg-amber-400/10"
                  >
                    <span className="text-gray-200 font-medium">Judge0 Code Execution VM</span>
                    <span className="text-amber-300">8+ Languages</span>
                  </motion.div>
                  <div className="flex justify-center">
                    <span className="text-gray-500 font-mono text-xs">↓ Prisma Migrations &amp; Hybrid Sessions</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center transition-colors hover:border-orange-400/30"
                    >
                      <div className="text-gray-300 font-medium">Neon PostgreSQL</div>
                      <div className="text-xs text-gray-500 mt-1">Prisma Schema</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center transition-colors hover:border-orange-400/30"
                    >
                      <div className="text-gray-300 font-medium">Redis Cache</div>
                      <div className="text-xs text-gray-500 mt-1">Session Fallback</div>
                    </motion.div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Preview Banner */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 lg:px-16 text-center">
          <SectionHeading
            eyebrow="Technology Foundation"
            title={
              <>
                Engineered with <span className="text-gradient">battle-tested tools</span>
              </>
            }
            description="Explore the interactive 3D Stack Orbit containing core languages, databases, message brokers, and cloud orchestration systems."
          />

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {profile.marquee.map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.08, y: -3 }}
                transition={{ duration: 0.2 }}
                className="cursor-default rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 font-mono text-xs sm:text-sm text-gray-300 transition-colors hover:border-orange-400/40 hover:text-white shadow-sm"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button asChild size="lg" variant="outline" className="group">
              <Link to="/stack">
                Launch 3D Constellation Orbit <Layers className="h-4 w-4 transition-transform group-hover:scale-110" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom Conversion Section */}
      <section className="relative border-t border-white/[0.06] py-24 sm:py-32">
        <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 lg:px-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Have a distributed system challenge?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
            Whether you are scaling from 1k to 100k requests/sec, decomposing legacy monoliths, or requiring 99.99% uptime for core financial paths.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="gradient" className="group">
              <Link to="/ai-twin">
                <Sparkles className="h-4 w-4 animate-pulse" /> Ask My AI Twin First
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="transition-transform hover:scale-105">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

function FeaturedProjectCard({ project: p, index }: { project: Project; index: number }) {
  const { ask } = useChat();
  const accent = accents[p.accent];
  const col = index % 3; // 0 = left, 1 = middle, 2 = right

  const initial =
    col === 0
      ? { opacity: 0, x: -120, scale: 0.96 }
      : col === 2
      ? { opacity: 0, x: 120, scale: 0.96 }
      : { opacity: 0, x: 0, scale: 0.88 };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -25px 0px' }}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ duration: 0.95, delay: col === 1 ? 0.14 : 0, ease: EASE }}
      className="h-full"
    >
      <SpotlightCard className="group flex h-full flex-col p-7 transition-all duration-300 hover:border-orange-400/40 hover:shadow-2xl hover:shadow-orange-500/10">
        <div className="flex items-center justify-between gap-3">
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] transition-transform duration-200 group-hover:scale-105 ${accent.border} ${accent.bg} ${accent.text}`}>
            {p.category}
          </span>
          <span className="font-mono text-xs text-gray-500">{p.year}</span>
        </div>

        <h3 className="mt-4 text-xl font-semibold tracking-tight text-white transition-colors duration-200 group-hover:text-orange-100">{p.title}</h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-gray-400">{p.summary}</p>

        {/* Metrics callout */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 text-center transition-colors group-hover:border-white/[0.12] group-hover:bg-white/[0.03]"
        >
          {p.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-mono text-sm font-semibold text-white group-hover:text-orange-200 transition-colors">{m.value}</div>
              <div className="truncate text-[10px] text-gray-500">{m.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tech tags */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <motion.span
              key={t}
              whileHover={{ scale: 1.08, y: -1 }}
              transition={{ duration: 0.15 }}
              className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 font-mono text-[11px] text-gray-400 hover:border-orange-400/30 hover:text-orange-200"
            >
              {t}
            </motion.span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4">
          <Link
            to={`/projects/${p.id}`}
            className="group/btn inline-flex items-center gap-1.5 text-xs font-semibold text-orange-300 transition-all duration-200 hover:text-orange-200"
          >
            Case Study <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1.5" />
          </Link>
          <motion.button
            type="button"
            onClick={() => ask(`Explain the architecture and design decisions behind the ${p.title} project`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1 rounded-lg border border-orange-400/20 bg-orange-400/5 px-2.5 py-1 text-xs text-orange-300 transition-colors hover:bg-orange-400/15 hover:text-orange-100"
          >
            <Sparkles className="h-3 w-3 animate-pulse" />
            Ask AI
          </motion.button>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
