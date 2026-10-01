import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Check, Clock, Copy, Mail, MapPin, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { profile } from '../../data/profile';
import { useChat } from '../../hooks/use-chat';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { GithubIcon, LinkedinIcon, Reveal, SectionHeading } from '../shared';

const TOPICS = ['Full-time role', 'Consulting', 'Architecture review', 'Just saying hi'] as const;
type Topic = (typeof TOPICS)[number];
type FieldName = 'name' | 'email' | 'message';

interface FormState {
  name: string;
  email: string;
  message: string;
  topic: Topic;
}

const EMPTY: FormState = { name: '', email: '', message: '', topic: TOPICS[0] };

function validate(f: FormState): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (f.name.trim().length < 2) errors.name = 'Please tell me your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) errors.email = 'That email doesn’t look quite right.';
  if (f.message.trim().length < 10) errors.message = 'A sentence or two helps me reply properly.';
  return errors;
}

export function Contact() {
  const { ask } = useChat();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [copied, setCopied] = useState(false);

  const field = (key: FieldName) => ({
    value: form[key],
    'aria-invalid': errors[key] ? true : undefined,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error('Please fix the highlighted fields');
      return;
    }
    const subject = `[Portfolio] ${form.topic} — ${form.name.trim()}`;
    const body = `${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success('Opening your email client…', { description: `Your message to ${profile.email} is ready to send.` });
    setForm(EMPTY);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      toast.success('Email copied to clipboard');
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error('Couldn’t access the clipboard');
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_bottom,rgba(194,65,12,0.18),transparent_60%)]"
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Contact"
            title={
              <>
                Have a hard backend problem? <span className="text-gradient">Let&apos;s talk.</span>
              </>
            }
            description="Roles, consulting, or a second pair of eyes on your architecture — I read every message."
          />

          <Reveal delay={0.1} className="mt-8 space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-orange-400/15 bg-orange-400/[0.04] p-4">
              <span className="relative mt-1.5 flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-400" />
              </span>
              <div>
                <p className="text-sm font-medium text-orange-100">{profile.availability}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-orange-100/60">
                  <Clock className="h-3 w-3" /> {profile.responseTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-2 pl-4">
              <Mail className="h-4 w-4 shrink-0 text-gray-400" />
              <a href={`mailto:${profile.email}`} className="min-w-0 flex-1 truncate text-sm text-gray-100 transition hover:text-orange-200">
                {profile.email}
              </a>
              <Button size="sm" variant="ghost" onClick={copyEmail} aria-label="Copy email address">
                {copied ? <Check className="h-3.5 w-3.5 text-orange-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-4 text-sm text-gray-300">
              <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="truncate">
                {profile.location} <span className="text-gray-500">· {profile.timezone}</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild variant="outline" size="icon">
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <GithubIcon className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="icon">
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" onClick={() => ask('Are you open to new roles, and what’s the best way to reach you?')}>
                <Sparkles className="h-4 w-4 text-orange-300" />
                Ask my AI twin instead
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-8"
          >
            <fieldset>
              <legend className="text-xs font-medium uppercase tracking-wider text-gray-400">What&apos;s this about?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={form.topic === t}
                    onClick={() => setForm((f) => ({ ...f, topic: t }))}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-xs transition',
                      form.topic === t
                        ? 'border-orange-400/40 bg-orange-400/10 text-orange-100'
                        : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field id="contact-name" label="Name" error={errors.name}>
                <Input id="contact-name" placeholder="Ada Lovelace" autoComplete="name" {...field('name')} />
              </Field>
              <Field id="contact-email" label="Email" error={errors.email}>
                <Input id="contact-email" type="email" placeholder="ada@company.com" autoComplete="email" {...field('email')} />
              </Field>
            </div>
            <Field id="contact-message" label="Message" error={errors.message} className="mt-4">
              <Textarea
                id="contact-message"
                rows={5}
                placeholder="Tell me about the system, the scale and what’s hurting…"
                {...field('message')}
              />
            </Field>

            <div className="mt-6 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-xs text-gray-500">Opens your email client — no trackers, no databases.</p>
              <Button type="submit" variant="gradient" size="lg">
                <Send className="h-4 w-4" />
                Send message
              </Button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </label>
      {children}
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs text-rose-300" role="alert">
          {error}
        </motion.p>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-sm text-gray-500 md:flex-row">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-xs font-semibold text-orange-300">
            {profile.initials}
          </span>
          <span>
            © {new Date().getFullYear()} {profile.name}. Built to scale quietly.
          </span>
        </div>
        <p className="text-center text-xs md:text-right">
          React 19 · Tailwind v4 · shadcn/ui · Framer Motion · Three.js ·{' '}
          <span className="text-gray-400">AI by Claude &amp; DeepSeek</span>
        </p>
        <a href="#home" className="inline-flex items-center gap-1.5 text-xs text-gray-400 transition hover:text-white">
          Back to top <ArrowUp className="h-3.5 w-3.5" />
        </a>
      </div>
    </footer>
  );
}
