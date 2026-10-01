import { Activity, ArrowRight, Layers, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { useChat } from '../hooks/use-chat';
import { Button } from '../components/ui/button';
import { Counter, EASE, PageTransition, SectionHeading, SpotlightCard, StaggerContainer, StaggerItem } from '../components/shared';
import { PageBackground } from '../components/animations/PageBackground';
import { AnimatedParagraph, StaggerParagraphs } from '../components/animations/ParagraphAnimation';
import { SystemTopologyDiagram } from '../components/SystemTopologyDiagram';

const PRINCIPLE_ICONS = [ShieldCheck, Activity, Layers, Workflow];

export function AboutPage() {
  const { ask } = useChat();

  return (
    <PageTransition className="relative pt-28 pb-24 sm:pt-36 sm:pb-32">
      {/* Background Ambient Particles & Orbiting Ember Lights */}
      <PageBackground variant="about" />

      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 lg:px-16">
        {/* Page Header */}
        <SectionHeading
          eyebrow={`About ${profile.name}`}
          title={
            <>
              Cloud-native engineer <span className="text-gradient">building secure systems</span>
            </>
          }
          description="Backend and full-stack developer with production experience building cloud-native systems using Node.js, TypeScript, and GCP. Creator of GiteaForge."
        />

        {/* Narrative & Live System Topology Row */}
        <div className="mt-16 grid items-center gap-14 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.95, ease: EASE }}
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              The Philosophy: Security-first, fault-tolerant cloud architecture
            </motion.h3>

            <StaggerParagraphs className="mt-6 space-y-4 text-base leading-relaxed text-gray-400 sm:text-lg">
              {profile.bio.map((paragraph, i) => (
                <AnimatedParagraph key={i} hoverAccent delay={i * 0.1}>
                  {paragraph}
                </AnimatedParagraph>
              ))}
            </StaggerParagraphs>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.95, delay: 0.35, ease: EASE }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button variant="gradient" size="lg" onClick={() => ask('Walk me through your background and architectural philosophy.')}>
                <Sparkles className="h-4 w-4" />
                Ask my AI Twin about my career
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/experience">
                  Explore Experience &amp; Education <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Cloud-Native Live System Topology Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.05, ease: EASE }}
          >
            <SystemTopologyDiagram />
          </motion.div>
        </div>

        {/* Production Metrics Grid */}
        <div className="mt-20">
          <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 text-center mb-6">
            Key Engineering Metrics
          </h3>
          <StaggerContainer className="grid grid-cols-2 gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 lg:grid-cols-4">
            {profile.stats.map((s) => (
              <StaggerItem key={s.label}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl border border-white/[0.06] bg-ink/80 p-6 sm:p-8 text-center transition-colors hover:border-orange-400/30"
                >
                  <div className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 text-sm text-gray-400">{s.label}</div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Engineering Principles */}
        <div className="mt-24">
          <SectionHeading
            eyebrow="Core Principles"
            title={
              <>
                How I approach <span className="text-gradient">every project</span>
              </>
            }
            description="Production-tested engineering tenets that prioritize security, reliable fallbacks, and automated cloud delivery."
          />

          <StaggerContainer className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {profile.principles.map((p, i) => {
              const Icon = PRINCIPLE_ICONS[i % PRINCIPLE_ICONS.length];
              return (
                <StaggerItem key={p.title} className="h-full">
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="h-full"
                  >
                    <SpotlightCard className="group flex h-full flex-col p-7 transition-all duration-300 hover:border-orange-400/40 hover:shadow-xl hover:shadow-orange-500/10">
                      <span className="grid h-12 w-12 place-items-center rounded-xl border border-orange-400/25 bg-orange-400/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <Icon className="h-6 w-6 text-orange-300" />
                      </span>
                      <h3 className="mt-5 text-xl font-semibold text-white">{p.title}</h3>
                      <AnimatedParagraph delay={0.1} className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">
                        {p.body}
                      </AnimatedParagraph>
                    </SpotlightCard>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-14 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-2xl sm:text-3xl font-semibold text-white"
          >
            Looking for a motivated cloud-native engineer?
          </motion.h3>
          <AnimatedParagraph
            delay={0.1}
            className="mx-auto mt-3 max-w-2xl text-base text-gray-400"
          >
            I am currently open to full-time backend and full-stack software engineering opportunities, internships, and high-impact projects.
          </AnimatedParagraph>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Button asChild size="lg" variant="gradient">
              <Link to="/contact">Get in Touch</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/projects">View Projects</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
