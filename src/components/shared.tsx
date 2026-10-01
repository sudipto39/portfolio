import { useEffect, useRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { Cpu, Sparkles } from 'lucide-react';
import { profile } from '../data/profile';
import type { ProviderId } from '../lib/ai/config';
import { cn } from '../utils/cn';

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ----------------------------- motion ----------------------------- */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -20px 0px' }}
      transition={{ duration: 0.95, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  useEffect(() => {
    // When the entering page mounts in AnimatePresence, reset scroll position instantly without jittering the outgoing view
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }}
      transition={{ duration: 0.48, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AmbientGlow({
  className,
  color = 'rgba(251, 146, 60, 0.12)',
  size = 500,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <motion.div
      aria-hidden
      animate={{
        scale: [1, 1.25, 1],
        opacity: [0.5, 0.85, 0.5],
        x: [0, 25, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(70px)',
      }}
      className={cn('pointer-events-none absolute rounded-full', className)}
    />
  );
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -20px 0px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.85, ease: EASE } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div className={cn('max-w-4xl', align === 'center' && 'mx-auto text-center', className)}>
      <motion.span
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -20px 0px' }}
        transition={{ duration: 0.75, ease: EASE }}
        className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/[0.06] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-orange-300"
      >
        <span className="h-1 w-1 rounded-full bg-orange-300" />
        {eyebrow}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -20px 0px' }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        className="mt-5 text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -20px 0px' }}
          transition={{ duration: 0.95, delay: 0.22, ease: EASE }}
          className="mt-4 text-pretty text-base leading-relaxed text-gray-400 sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

/** Card with a cursor-following glow. */
export function SpotlightCard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn(
        'group/spot relative isolate overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] transition-[border-color,background-color,box-shadow,transform] duration-300 will-change-transform',
        className
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(251, 146, 60, 0.14), transparent 45%)',
        }}
      />
      {children}
    </div>
  );
}

export function Counter({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, { duration: 1.8, ease: EASE, onUpdate: (v) => setDisplay(v) });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Typewriter({ words, className }: { words: readonly string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    let delay = deleting ? 32 : 65;
    if (!deleting && text === word) delay = 1800;
    if (deleting && text === '') delay = 350;

    const timer = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === '') {
        setDeleting(false);
        setIndex((i) => i + 1);
      } else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [text, deleting, index, words]);

  return <span className={cn('caret', className)}>{text}</span>;
}

/* ----------------------------- atoms ----------------------------- */

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] px-1.5 font-mono text-[10px] font-medium text-gray-400',
        className
      )}
    >
      {children}
    </kbd>
  );
}

export function TwinAvatar({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'h-7 w-7 text-[10px]', md: 'h-9 w-9 text-xs', lg: 'h-14 w-14 text-base' };
  const badge = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };
  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn(
          'grid place-items-center rounded-full bg-linear-to-br from-orange-300 via-amber-400 to-orange-700 font-mono font-semibold text-gray-950 shadow-lg shadow-orange-500/20',
          sizes[size]
        )}
      >
        {profile.initials}
      </span>
      <span
        className={cn(
          'absolute -bottom-0.5 -right-0.5 grid place-items-center rounded-full bg-panel ring-1 ring-white/15',
          badge[size]
        )}
      >
        <Sparkles className="h-[60%] w-[60%] text-orange-300" />
      </span>
    </span>
  );
}

/* ----------------------------- brand marks ----------------------------- */

type IconProps = { className?: string };

export function GithubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0C17.28 4.95 18.29 5.27 18.29 5.27c.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3" />
    </svg>
  );
}

export function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/** Stylised Claude spark (not the official logo). */
export function ClaudeMark({ className }: IconProps) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" className={className} aria-hidden>
      {rays.map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        const r2 = i % 2 ? 8 : 10.5;
        return (
          <line
            key={deg}
            x1={12 + 2.4 * Math.cos(a)}
            y1={12 + 2.4 * Math.sin(a)}
            x2={12 + r2 * Math.cos(a)}
            y2={12 + r2 * Math.sin(a)}
          />
        );
      })}
    </svg>
  );
}

/** Stylised DeepSeek whale (not the official logo). */
export function DeepSeekMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M2 13.6C2 9.9 5.5 7 10.1 7c3.5 0 6.2 1.6 7.3 4.2.6-1.7 1.9-2.9 3.9-3.4-.3 2-1.2 3.4-2.6 4.3 1.3.5 2.2 1.5 2.5 2.9-1.9-.2-3.2-.9-3.9-2.1-.9 3.1-3.8 5.1-7.9 5.1C5.3 18 2 16.3 2 13.6Z" />
      <circle cx="6.6" cy="12.1" r="1" fill="#140c08" />
    </svg>
  );
}

export function ProviderIcon({ provider, className }: { provider: ProviderId; className?: string }) {
  if (provider === 'claude') return <ClaudeMark className={cn('text-claude', className)} />;
  if (provider === 'deepseek') return <DeepSeekMark className={cn('text-deepseek', className)} />;
  return <Cpu className={cn('text-orange-300', className)} />;
}
