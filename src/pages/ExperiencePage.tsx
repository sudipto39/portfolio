import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Briefcase,
  Calendar,
  CheckCircle2,
  Download,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { useChat } from '../hooks/use-chat';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/button';
import {
  Counter,
  EASE,
  PageTransition,
  SectionHeading,
  SpotlightCard,
  StaggerContainer,
  StaggerItem,
} from '../components/shared';
import { PageBackground } from '../components/animations/PageBackground';
import { AnimatedParagraph } from '../components/animations/ParagraphAnimation';

export function ExperiencePage() {
  const { ask } = useChat();

  return (
    <PageTransition className="relative pt-28 pb-24 sm:pt-36 sm:pb-32">
      {/* Background Animated Milestone Pulse & Floating Embers */}
      <PageBackground variant="experience" />

      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-10 lg:px-16 overflow-x-clip">
        {/* Header */}
        <SectionHeading
          eyebrow="Experience & Education"
          title={
            <>
              Hands-on engineering <span className="text-gradient">&amp; cybersecurity</span>
            </>
          }
          description="Production backend internships, academic excellence at The Neotia University, and continuous shipping of high-reliability microservices and code sandboxes."
        />

        {/* Quick Highlights Bar with Animated Counters */}
        <StaggerContainer className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StaggerItem>
            <motion.div
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-center transition-colors hover:border-orange-400/30 hover:bg-orange-400/[0.02]"
            >
              <div className="font-mono text-3xl font-bold text-white sm:text-4xl">
                <Counter value={25} suffix="+" />
              </div>
              <div className="mt-1.5 text-xs text-gray-400 sm:text-sm">Production REST APIs (AiLabs)</div>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-center transition-colors hover:border-orange-400/30 hover:bg-orange-400/[0.02]"
            >
              <div className="font-mono text-3xl font-bold text-orange-300 sm:text-4xl">
                <Counter value={8} suffix="+" />
              </div>
              <div className="mt-1.5 text-xs text-gray-400 sm:text-sm">Languages in Judge0 Sandbox</div>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-center transition-colors hover:border-orange-400/30 hover:bg-orange-400/[0.02]"
            >
              <div className="font-mono text-3xl font-bold text-amber-300 sm:text-4xl">
                <Counter value={100} suffix="%" />
              </div>
              <div className="mt-1.5 text-xs text-gray-400 sm:text-sm">HMAC Webhook Reliability</div>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-center transition-colors hover:border-orange-400/30 hover:bg-orange-400/[0.02]"
            >
              <div className="font-mono text-3xl font-bold text-emerald-300 sm:text-4xl">
                <Counter value={7.78} decimals={2} />
              </div>
              <div className="mt-1.5 text-xs text-gray-400 sm:text-sm">B.Tech CSE CGPA (TNU)</div>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>

        {/* Section 1: Industry & Internship Timeline */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-10">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-orange-400/25 bg-orange-400/10">
              <Briefcase className="h-5 w-5 text-orange-300" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-white">Industry Experience &amp; Internships</h2>
              <p className="font-mono text-xs text-gray-400">Production backend engineering &amp; cybersecurity auditing</p>
            </div>
          </div>

          <ol className="relative space-y-10 before:absolute before:bottom-4 before:left-[15.5px] before:top-4 before:w-[2px] before:bg-linear-to-b before:from-orange-400/70 before:via-orange-500/20 before:to-transparent sm:before:left-[19.5px]">
            {profile.experience.map((role, i) => {
              const current = i === 0;
              return (
                <motion.li
                  key={role.company}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.85, delay: i * 0.1, ease: EASE }}
                  className="relative pl-12 sm:pl-16"
                >
                  {/* Node icon */}
                  <span className="absolute left-0 top-5 grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-ink shadow-lg shadow-black/60 sm:h-10 sm:w-10">
                    {current ? (
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-400 shadow-[0_0_14px_rgba(251,146,60,1)]" />
                      </span>
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-gray-500 transition-all group-hover:bg-orange-300" />
                    )}
                  </span>

                  <motion.div
                    whileHover={{ x: 6, y: -2 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <SpotlightCard className="group p-6 sm:p-8 transition-all duration-300 hover:border-orange-400/35 hover:shadow-2xl hover:shadow-orange-500/5">
                      {/* Tenure & Location */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-gray-400">
                        <span className={cn(current && 'text-orange-300 font-semibold')}>{role.period}</span>
                        <span aria-hidden>·</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-orange-400/80" />
                          {role.location}
                        </span>
                        {current && (
                          <span className="rounded-full border border-orange-400/25 bg-orange-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-orange-300 font-mono">
                            Recent Internship
                          </span>
                        )}
                      </div>

                      {/* Title & Company */}
                      <h3 className="mt-3 text-xl sm:text-2xl font-bold text-white transition-colors group-hover:text-orange-100">
                        {role.title} <span className="font-normal text-gray-500">@</span>{' '}
                        <span className="text-gray-200">{role.company}</span>
                      </h3>

                      {/* Summary */}
                      <AnimatedParagraph delay={0.05} className="mt-2.5 text-sm sm:text-base leading-relaxed text-gray-300">
                        {role.summary}
                      </AnimatedParagraph>

                      {/* Key Highlights */}
                      <div className="mt-6 space-y-3">
                        <h4 className="font-mono text-xs uppercase tracking-wider text-gray-400">
                          Key Responsibilities &amp; Achievements:
                        </h4>
                        <ul className="space-y-2.5">
                          {role.highlights.map((h, hIdx) => (
                            <motion.li
                              key={h}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.65, delay: hIdx * 0.06, ease: EASE }}
                              className="group/item flex gap-3 text-sm text-gray-300 leading-relaxed"
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-400 transition-transform group-hover/item:scale-110" />
                              <span>{h}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Technology Stack Tags */}
                      <div className="mt-6 pt-5 border-t border-white/[0.06]">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-1.5">
                            {role.stack.map((t) => (
                              <motion.span
                                key={t}
                                whileHover={{ scale: 1.08, y: -1 }}
                                transition={{ duration: 0.15 }}
                                className="rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] text-gray-300 hover:border-orange-400/30 hover:text-orange-200"
                              >
                                {t}
                              </motion.span>
                            ))}
                          </div>

                          <motion.button
                            type="button"
                            onClick={() =>
                              ask(
                                `Tell me about your experience at ${role.company}: what were your responsibilities, the architecture, and main challenges?`
                              )
                            }
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-orange-400/20 bg-orange-400/5 px-2.5 py-1 text-xs text-orange-300 hover:bg-orange-400/15 hover:text-orange-200 transition-colors"
                          >
                            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                            Ask AI about this role
                          </motion.button>
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* Section 2: Academic Education */}
        <div className="mt-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-orange-400/25 bg-orange-400/10">
              <GraduationCap className="h-5 w-5 text-orange-300" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-white">Academic Education</h2>
              <p className="font-mono text-xs text-gray-400">Formal engineering education &amp; academic performance</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {profile.education.map((edu, idx) => (
              <motion.div
                key={edu.institution}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.95, delay: idx * 0.15, ease: EASE }}
              >
                <SpotlightCard className="h-full p-6 sm:p-8 transition-all duration-300 hover:border-orange-400/35 hover:shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-gray-400">
                    <span className="flex items-center gap-1.5 text-orange-300 font-semibold">
                      <Calendar className="h-3.5 w-3.5 text-orange-400" />
                      {edu.period}
                    </span>
                    {edu.score && (
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-300 font-mono">
                        {edu.score}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-xl sm:text-2xl font-bold text-white">{edu.institution}</h3>
                  <p className="mt-1.5 text-sm sm:text-base font-medium text-orange-200/90">{edu.degree}</p>

                  <p className="mt-2 text-xs text-gray-400 flex items-center gap-1 font-mono">
                    <MapPin className="h-3 w-3 text-orange-400/80" />
                    {edu.location}
                  </p>

                  <AnimatedParagraph delay={0.1} className="mt-5 text-sm text-gray-300 leading-relaxed border-t border-white/[0.06] pt-4">
                    {edu.details}
                  </AnimatedParagraph>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 3: Certifications & Co-Curricular */}
        <div className="mt-24 overflow-x-clip">
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-amber-400/25 bg-amber-400/10">
              <Award className="h-5 w-5 text-amber-300" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-white">Certifications &amp; Credentials</h2>
              <p className="font-mono text-xs text-gray-400">Bootcamps, VAPT specialization &amp; co-curricular activities</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {profile.certifications.map((cert, idx) => {
              const col = idx % 3; // 0 = left, 1 = middle, 2 = right

              // Left card comes from left, right from right, middle fades into place
              const initial =
                col === 0
                  ? { opacity: 0, x: -120, scale: 0.96 }
                  : col === 2
                  ? { opacity: 0, x: 120, scale: 0.96 }
                  : { opacity: 0, x: 0, scale: 0.88 };

              return (
                <motion.div
                  key={cert.title}
                  initial={initial}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, margin: '0px 0px -30px 0px' }}
                  whileHover={{ y: -8, scale: 1.015 }}
                  transition={{ duration: 0.95, delay: col === 1 ? 0.14 : 0, ease: EASE }}
                  className="h-full"
                >
                  <SpotlightCard className="h-full p-6 transition-all duration-300 hover:border-amber-400/35 hover:shadow-xl">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-2 text-amber-300">
                        <ShieldCheck className="h-4 w-4" />
                      </span>
                      <span className="font-mono text-xs text-gray-400">{cert.date}</span>
                    </div>

                    <h3 className="mt-4 text-base font-bold text-white leading-snug">{cert.title}</h3>
                    <p className="mt-1 text-xs text-gray-400">{cert.issuer}</p>

                    {cert.badge && (
                      <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-gray-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                        {cert.badge}
                      </div>
                    )}
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Leadership & Engineering Values */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.95, ease: EASE }}
          className="mt-24 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-10 transition-all duration-300 hover:border-orange-400/20"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-orange-400/25 bg-orange-400/10">
              <Briefcase className="h-5 w-5 text-orange-300" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-white">Engineering Philosophy &amp; Work Ethics</h3>
              <p className="font-mono text-xs text-gray-400">Security-conscious development, clean code &amp; continuous learning</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 text-sm text-gray-300 leading-relaxed">
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
              <h4 className="font-semibold text-white mb-2 text-base">Contract-First Collaboration</h4>
              <AnimatedParagraph delay={0.08} className="text-gray-400">
                Every service starts with strict schema validation (Zod, Prisma, OpenAPI) and Postman testing before shipping to production. This eliminates integration bugs and ensures seamless frontend-backend alignment with zero critical failures.
              </AnimatedParagraph>
            </div>
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
              <h4 className="font-semibold text-white mb-2 text-base">Security &amp; VAPT Awareness</h4>
              <AnimatedParagraph delay={0.12} className="text-gray-400">
                Hands-on cybersecurity experience applying OWASP Top 10 mitigation, timing-safe cryptographic comparisons (`crypto.timingSafeEqual`), RBAC token verification, and automated vulnerability scanning across all endpoints.
              </AnimatedParagraph>
            </div>
          </div>

          {/* Action CTA Banner */}
          <div className="mt-8 flex flex-wrap gap-4 border-t border-white/[0.06] pt-6">
            <Button asChild variant="gradient" size="lg" className="shadow-lg shadow-orange-500/20">
              <a href={profile.resumeUrl} download={profile.resumeFilename}>
                <Download className="h-4 w-4 mr-2" /> Download Resume (PDF)
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Discuss Opportunities &amp; Roles</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="group">
              <Link to="/projects">
                View Project Case Studies <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
