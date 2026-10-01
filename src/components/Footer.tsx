import { motion } from 'framer-motion';
import { ArrowUp, Mail, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { useChat } from '../hooks/use-chat';
import { GithubIcon, LinkedinIcon } from './shared';

export function Footer() {
  const { setChatOpen } = useChat();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-ink/80 pt-16 pb-12">
      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 lg:px-16">
        <div className="grid gap-10 md:grid-cols-4 pb-12 border-b border-white/[0.06]">
          {/* Col 1: Bio / Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="group inline-flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-xs font-semibold text-orange-300 transition group-hover:rotate-6 group-hover:border-orange-400/40">
                {profile.initials}
              </span>
              <span className="text-base font-semibold tracking-tight text-white">
                {profile.name}
                <span className="text-orange-400">.</span>
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-gray-400">
              {profile.role} specialising in {profile.focus.toLowerCase()}. Designed for high throughput, strict consistency, and fault-tolerant operations.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <motion.a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.15, rotate: 6 }}
                whileTap={{ scale: 0.95 }}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-gray-400 transition-colors hover:border-orange-400/40 hover:text-white"
                aria-label="GitHub"
              >
                <GithubIcon className="h-4 w-4" />
              </motion.a>
              <motion.a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.15, rotate: -6 }}
                whileTap={{ scale: 0.95 }}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-gray-400 transition-colors hover:border-orange-400/40 hover:text-white"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4" />
              </motion.a>
              <motion.a
                href={`mailto:${profile.email}`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-gray-400 transition-colors hover:border-orange-400/40 hover:text-white"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </motion.a>
              <motion.button
                type="button"
                onClick={() => setChatOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-orange-400/25 bg-orange-400/10 px-3 py-1.5 text-xs font-medium text-orange-300 transition-colors hover:bg-orange-400/20"
              >
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Ask AI Twin
              </motion.button>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-medium uppercase tracking-wider text-gray-300">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 transition-colors hover:text-orange-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 transition-colors hover:text-orange-200">
                  About &amp; Principles
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 transition-colors hover:text-orange-200">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link to="/stack" className="text-gray-400 transition-colors hover:text-orange-200">
                  Stack &amp; Orbit
                </Link>
              </li>
              <li>
                <Link to="/experience" className="text-gray-400 transition-colors hover:text-orange-200">
                  Experience
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Interactive & Contact */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-medium uppercase tracking-wider text-gray-300">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/ai-twin" className="text-gray-400 transition-colors hover:text-orange-200">
                  AI Twin Studio
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 transition-colors hover:text-orange-200">
                  Get in Touch
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Available for contracts
                </span>
              </li>
              <li>
                <span className="text-xs text-gray-500 font-mono">
                  {profile.location} · {profile.timezone.split('—')[0].trim()}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {profile.name}. All systems operational.</p>
          <p className="text-center sm:text-right text-gray-500">
            Engineered with React 19, Tailwind CSS &amp; Framer Motion
          </p>
          <motion.button
            type="button"
            onClick={scrollToTop}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-1.5 text-gray-400 transition-colors hover:text-orange-200"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-1" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
