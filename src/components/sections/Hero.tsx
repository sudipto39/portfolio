import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUp, Download, MapPin, Rocket, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';
import { useChat } from '../../hooks/use-chat';
import { Button } from '../ui/button';
import { EASE, GithubIcon, LinkedinIcon } from '../shared';
import ParticleField from '../ParticleField';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.05, delay, ease: EASE },
});

export function Hero() {
  const { ask } = useChat();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);
  const [question, setQuestion] = useState('');
  const [tick, setTick] = useState(0);
  const suggestions = profile.suggestedQuestions;
  const placeholder = suggestions[tick % suggestions.length];

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 3200);
    return () => window.clearInterval(id);
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(question.trim() || placeholder);
    setQuestion('');
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-24 pt-32 lg:pt-28"
    >
      {/* Atmospheric Background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-80">
          <ParticleField active={inView} />
        </div>
        <div className="bg-grid fade-radial absolute inset-0 opacity-70" />
        <div className="absolute left-1/2 top-[-12%] h-[520px] w-[860px] -translate-x-1/2 rounded-full bg-orange-500/[0.13] blur-[120px]" />
        <div className="absolute bottom-[-18%] right-[-8%] h-[420px] w-[560px] rounded-full bg-orange-800/[0.14] blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent to-ink" />
      </div>

      <div className="mx-auto grid w-full max-w-[1700px] items-center gap-12 px-6 sm:px-10 lg:px-16 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          {/* Availability Badge */}
          <motion.div {...fadeUp(0)}>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-400/[0.08] py-1.5 pl-2.5 pr-3.5 text-xs text-orange-200 transition-all duration-200 hover:border-orange-400/40 hover:bg-orange-400/[0.14] hover:scale-105"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-400" />
              </span>
              <span className="font-semibold text-orange-300">Fresher · Available for Full-Time Roles</span>
              <span className="text-orange-200/40">·</span>
              <span className="inline-flex items-center gap-1 text-orange-200/80 font-mono text-[11px]">
                <MapPin className="h-3 w-3" />
                {profile.location.split(',')[0]}
              </span>
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.08)}
            className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[4.2rem]"
          >
            <span className="mb-2 block text-lg font-medium tracking-normal text-gray-400 sm:text-xl">
              Hi, I&apos;m {profile.name} —
            </span>
            I build backends that <span className="text-gradient">scale quietly.</span>
          </motion.h1>

          {/* Requested Exact Profile Summary Paragraph */}
          <motion.div {...fadeUp(0.16)} className="mt-6 max-w-2xl">
            <p className="text-base sm:text-lg leading-relaxed text-gray-300 font-normal">
              Backend and full-stack developer with production experience building cloud-native systems using{' '}
              <strong className="font-semibold text-white">Node.js, TypeScript, and GCP</strong>. Built{' '}
              <strong className="font-semibold text-orange-300">GiteaForge</strong>, an academic Git management platform featuring{' '}
              <strong className="font-semibold text-white">Judge0</strong> multi-language code execution, HMAC-authenticated webhook pipelines, and fault-tolerant{' '}
              <strong className="font-semibold text-white">Redis + PostgreSQL</strong> session architecture.
            </p>
          </motion.div>

          {/* Requested Action Buttons Row: [🚀 VIEW PROJECTS] [📥 DOWNLOAD RESUME] CONTACT ME → */}
          <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-wrap items-center gap-4">
            {/* VIEW PROJECTS */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button asChild size="lg" variant="gradient" className="h-12 px-6 rounded-xl font-mono text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20">
                <Link to="/projects" className="inline-flex items-center gap-2">
                  <Rocket className="h-4 w-4" />
                  View Projects
                </Link>
              </Button>
            </motion.div>

            {/* DOWNLOAD RESUME */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <a
                href={profile.resumeUrl}
                download={profile.resumeFilename}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 font-mono text-xs uppercase tracking-wider text-gray-200 shadow-md backdrop-blur-md transition hover:border-orange-400/40 hover:bg-white/[0.08] hover:text-white"
              >
                <Download className="h-4 w-4 text-orange-300" />
                Download Resume
              </a>
            </motion.div>

            {/* CONTACT ME → */}
            <Link
              to="/contact"
              className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-gray-400 transition hover:text-orange-300 py-2 px-1"
            >
              Contact Me <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Requested NETWORK Bar */}
          <motion.div {...fadeUp(0.30)} className="mt-7 flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 mr-1">
              Network:
            </span>

            {/* GitHub */}
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-gray-300 transition hover:border-orange-400/35 hover:bg-orange-400/10 hover:text-white"
            >
              <GithubIcon className="h-3.5 w-3.5 text-orange-400" />
              <span>{profile.links.githubShort}</span>
            </a>

            {/* LinkedIn */}
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-gray-300 transition hover:border-orange-400/35 hover:bg-orange-400/10 hover:text-white"
            >
              <LinkedinIcon className="h-3.5 w-3.5 text-amber-400" />
              <span>{profile.links.linkedinShort}</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-gray-300 transition hover:border-orange-400/35 hover:bg-orange-400/10 hover:text-white"
            >
              <span className="text-orange-400 font-bold">@</span>
              <span>{profile.email}</span>
            </a>
          </motion.div>

          {/* Inline AI ask bar */}
          <motion.form {...fadeUp(0.36)} onSubmit={onSubmit} className="mt-8 max-w-2xl">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 pl-4 shadow-2xl shadow-black/30 backdrop-blur-xl transition focus-within:border-orange-400/40 focus-within:bg-white/[0.06] focus-within:ring-4 focus-within:ring-orange-400/10">
              <Sparkles className="h-4 w-4 shrink-0 text-orange-300 animate-pulse" />
              <label htmlFor="hero-ask" className="sr-only">
                Ask my AI twin
              </label>
              <input
                id="hero-ask"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                autoComplete="off"
                placeholder={`Ask my AI twin: “${placeholder}”`}
                className="h-11 min-w-0 flex-1 bg-transparent text-[14.5px] text-white outline-none placeholder:text-gray-500"
              />
              <Button type="submit" size="icon" variant="gradient" className="rounded-xl transition-transform hover:scale-105" aria-label="Ask my AI twin">
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.slice(0, 3).map((q) => (
                <motion.button
                  key={q}
                  type="button"
                  onClick={() => ask(q)}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs text-gray-400 transition hover:border-orange-400/30 hover:text-orange-100"
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </motion.form>
        </div>

        {/* Live Terminal Card */}
        <TerminalCard />
      </div>
    </section>
  );
}

/* ------------------------------ terminal ------------------------------ */

type Token = [text: string, className: string];
const KEY = 'text-orange-300';
const STR = 'text-amber-200';
const PUNC = 'text-stone-500';
const NUM = 'text-yellow-300';
const BOOL = 'text-orange-400';

const COMMAND = 'curl -s api.sudipto.dev/v1/profile | jq';
const RESPONSE: Token[][] = [
  [['{', PUNC]],
  [['  "name"', KEY], [': ', PUNC], [JSON.stringify(profile.name), STR], [',', PUNC]],
  [['  "role"', KEY], [': ', PUNC], [JSON.stringify(profile.role), STR], [',', PUNC]],
  [['  "flagship_project"', KEY], [': ', PUNC], ['"GiteaForge"', STR], [',', PUNC]],
  [['  "stack"', KEY], [': [', PUNC], ['"Node.js"', STR], [', ', PUNC], ['"TypeScript"', STR], [', ', PUNC], ['"GCP"', STR], ['],', PUNC]],
  [['  "cgpa"', KEY], [': ', PUNC], ['7.78', NUM], [',', PUNC]],
  [['  "apis_built"', KEY], [': ', PUNC], ['"25+"', STR], [',', PUNC]],
  [['  "open_to_work"', KEY], [': ', PUNC], ['true', BOOL]],
  [['}', PUNC]],
];

function TerminalCard() {
  const [typed, setTyped] = useState(0);
  const [lines, setLines] = useState(0);

  useEffect(() => {
    if (typed < COMMAND.length) {
      const t = setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 800 : 25 + Math.random() * 40);
      return () => clearTimeout(t);
    }
    if (lines <= RESPONSE.length) {
      const t = setTimeout(() => setLines((n) => n + 1), lines === 0 ? 350 : 80);
      return () => clearTimeout(t);
    }
  }, [typed, lines]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 1.15, delay: 0.35, ease: EASE }}
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      <div aria-hidden className="absolute -inset-px rounded-2xl bg-linear-to-br from-orange-400/40 via-white/5 to-amber-700/40" />
      <div className="relative overflow-hidden rounded-2xl bg-panel/90 shadow-2xl shadow-orange-500/10 backdrop-blur-xl transition-all duration-300 hover:border-orange-400/30">
        <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-orange-400/80" />
          <span className="ml-3 font-mono text-[11px] text-gray-500">~/sudipto — zsh</span>
        </div>
        <div className="scrollbar-thin min-h-[292px] overflow-x-auto px-5 py-4 font-mono text-[12.5px] leading-6" aria-hidden>
          <div className="whitespace-pre text-gray-200">
            <span className="text-orange-400">➜</span> <span className="text-amber-300">~</span> {COMMAND.slice(0, typed)}
            {typed < COMMAND.length && <span className="caret" />}
          </div>
          {lines > 0 && (
            <div className="text-gray-500">
              <span className="text-orange-400">HTTP/2 200</span> · 22ms · application/json
            </div>
          )}
          {RESPONSE.slice(0, Math.max(0, lines - 1)).map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="whitespace-pre">
              {line.map(([text, cls], j) => (
                <span key={j} className={cls}>
                  {text}
                </span>
              ))}
            </motion.div>
          ))}
          {lines > RESPONSE.length && (
            <div className="mt-1 text-gray-200">
              <span className="text-orange-400">➜</span> <span className="text-amber-300">~</span> <span className="caret" />
            </div>
          )}
        </div>
      </div>

      {/* Floating Status Badges */}
      <div className="absolute left-0 top-20 z-20 hidden -translate-x-1/2 sm:flex">
        <div className="animate-float flex items-center gap-2 rounded-xl border border-white/10 bg-panel/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
          <Terminal className="h-3.5 w-3.5 text-amber-300" />
          <span className="text-gray-400">Judge0 Sandbox</span>
          <span className="font-mono text-white">8+ Languages</span>
        </div>
      </div>
      <div className="absolute -right-3 bottom-8 hidden animate-float items-center gap-2 rounded-xl border border-white/10 bg-panel/90 px-3 py-2 text-xs shadow-xl backdrop-blur [animation-delay:1.8s] sm:flex">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        <span className="text-gray-400">HMAC Webhooks</span>
        <span className="font-mono text-white">Verified</span>
      </div>
    </motion.div>
  );
}

/* ------------------------------ marquee ------------------------------ */

export function TechMarquee() {
  const items = profile.marquee;
  return (
    <div className="relative border-y border-white/[0.06] bg-white/[0.012] py-5">
      <div className="fade-x overflow-hidden">
        <div className="flex w-max animate-marquee gap-12 pr-12 hover:[animation-play-state:paused]">
          {[...items, ...items].map((t, i) => (
            <span
              key={`${t}-${i}`}
              aria-hidden={i >= items.length || undefined}
              className="flex items-center gap-3 whitespace-nowrap font-mono text-sm text-gray-500"
            >
              <span className="h-1 w-1 rounded-full bg-orange-400/60" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
