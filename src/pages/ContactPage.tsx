import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircle2, Clock, Copy, Download, Loader2, Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { profile } from '../data/profile';
import { useChat } from '../hooks/use-chat';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { EASE, GithubIcon, LinkedinIcon, PageTransition, SectionHeading, SpotlightCard } from '../components/shared';
import { PageBackground } from '../components/animations/PageBackground';
import { AnimatedParagraph } from '../components/animations/ParagraphAnimation';

const TOPICS = ['Full-time role', 'Internship', 'GiteaForge architecture', 'Just saying hi'] as const;
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
  if (f.name.trim().length < 2) errors.name = 'Please provide your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) errors.email = 'Please provide a valid email address.';
  if (f.message.trim().length < 10) errors.message = 'Please include at least a sentence or two so I can prepare a relevant reply.';
  return errors;
}

export function ContactPage() {
  const { ask } = useChat();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [copied, setCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const field = (key: FieldName) => ({
    value: form[key],
    'aria-invalid': errors[key] ? true : undefined,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    },
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error('Please complete the highlighted fields');
      return;
    }

    setIsSubmitting(true);
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();

    if (!accessKey) {
      // Fallback: If access key is not yet set in .env, launch mailto draft gracefully
      toast.info('Opening default mail client as fallback… (Add VITE_WEB3FORMS_ACCESS_KEY in .env for direct API delivery)', {
        duration: 5000,
      });
      const subject = `[Portfolio Inquiry] ${form.topic} — from ${form.name.trim()}`;
      const body = `${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`;
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setIsSubmitted(true);
      setForm(EMPTY);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: form.name.trim(),
          email: form.email.trim(),
          topic: form.topic,
          message: form.message.trim(),
          subject: `[Portfolio Inquiry] ${form.topic} — from ${form.name.trim()}`,
          from_name: form.name.trim(),
          botcheck: '',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Message sent successfully via Web3Forms!', {
          description: "Thank you for reaching out! Sudipto has received your message in his inbox.",
        });
        setIsSubmitted(true);
        setForm(EMPTY);
      } else {
        toast.error(data.message || 'Web3Forms submission failed. Opening email draft…');
        const subject = `[Portfolio Inquiry] ${form.topic} — from ${form.name.trim()}`;
        const body = `${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`;
        window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    } catch {
      toast.error('Network error contacting Web3Forms. Opening email draft as fallback…');
      const subject = `[Portfolio Inquiry] ${form.topic} — from ${form.name.trim()}`;
      const body = `${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`;
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } finally {
      setIsSubmitting(false);
    }
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

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(profile.phone);
      setPhoneCopied(true);
      toast.success('Phone number copied to clipboard');
      setTimeout(() => setPhoneCopied(false), 1600);
    } catch {
      toast.error('Couldn’t access the clipboard');
    }
  };

  return (
    <PageTransition className="relative pt-28 pb-24 sm:pt-36 sm:pb-32">
      {/* Background Animated Beacon Waves & Floating Embers */}
      <PageBackground variant="contact" />

      <div className="mx-auto w-full max-w-[1700px] px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <SectionHeading
          eyebrow="Contact & Collaboration"
          title={
            <>
              Let&apos;s build systems that <span className="text-gradient">never fail</span>
            </>
          }
          description="Available for full-time backend and full-stack software engineer roles, high-impact internships, and cloud-native projects."
        />

        {/* Content Grid */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.35fr]">
          {/* Left info column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="space-y-4"
          >
            {/* Availability card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3.5 rounded-2xl border border-orange-400/20 bg-orange-400/[0.04] p-5 shadow-lg shadow-orange-500/5"
            >
              <span className="relative mt-1 flex h-3 w-3 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-400" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-orange-100">{profile.availability}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-orange-200/70 font-mono">
                  <Clock className="h-3.5 w-3.5 animate-spin-slow" /> {profile.responseTime}
                </p>
              </div>
            </motion.div>

            {/* Live Clock & Timezone (IST - Kolkata) */}
            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-orange-400/30"
            >
              <div className="flex items-center justify-between font-mono text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-orange-300" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-orange-300 font-bold">{time ? `${time} IST` : 'IST (UTC+5:30)'}</span>
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {profile.timezone}
              </p>
            </motion.div>

            {/* Direct Email Card */}
            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 pl-5 transition-colors hover:border-orange-400/30"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Mail className="h-4 w-4 shrink-0 text-orange-300" />
                <a
                  href={`mailto:${profile.email}`}
                  className="truncate text-sm font-medium text-white transition hover:text-orange-200"
                >
                  {profile.email}
                </a>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="outline" onClick={copyEmail} aria-label="Copy email">
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </motion.div>
            </motion.div>

            {/* Direct Phone Card */}
            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 pl-5 transition-colors hover:border-orange-400/30"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Phone className="h-4 w-4 shrink-0 text-orange-300" />
                <a
                  href={`tel:${profile.phone}`}
                  className="truncate text-sm font-medium text-white transition hover:text-orange-200"
                >
                  {profile.phone}
                </a>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="outline" onClick={copyPhone} aria-label="Copy phone">
                  {phoneCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {phoneCopied ? 'Copied' : 'Copy'}
                </Button>
              </motion.div>
            </motion.div>

            {/* Social channels & Resume */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Button asChild variant="outline" size="sm" className="transition-transform hover:scale-105">
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="h-4 w-4" /> GitHub
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="transition-transform hover:scale-105">
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedinIcon className="h-4 w-4" /> LinkedIn
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="transition-transform hover:scale-105">
                <a href={profile.resumeUrl} download={profile.resumeFilename} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 text-orange-300" /> Resume PDF
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="transition-transform hover:scale-105"
                onClick={() => ask('Tell me about your background and what roles you are currently looking for')}
              >
                <Sparkles className="h-3.5 w-3.5 text-orange-300 animate-pulse" />
                Ask AI Twin First
              </Button>
            </div>

            {/* FAQ Card */}
            <SpotlightCard className="mt-8 p-6 transition-all duration-300 hover:border-orange-400/30">
              <h4 className="font-semibold text-white text-sm">What to expect next?</h4>
              <AnimatedParagraph delay={0.08} className="mt-2 text-xs text-gray-400 leading-relaxed">
                I actively review and respond to all recruiter inquiries, engineering invitations, and project proposals. I am prepared for technical coding interviews, system design walkthroughs of GiteaForge, and immediate onboarding.
              </AnimatedParagraph>
            </SpotlightCard>
          </motion.div>

          {/* Right form column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.95, delay: 0.12, ease: EASE }}
          >
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-8 transition-colors hover:border-white/[0.14]"
            >
              {/* Web3Forms Anti-Spam Honeypot */}
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-white">Send a Direct Message</h3>
                <span className="rounded-full border border-orange-400/25 bg-orange-400/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-orange-300">
                  Web3Forms
                </span>
              </div>
              <AnimatedParagraph delay={0.05} className="mt-1 text-xs text-gray-400">
                Delivered directly to my inbox via Web3Forms with instant email notification.
              </AnimatedParagraph>

              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-200 text-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Message delivered to Sudipto's inbox! Expect a response within a few hours.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-[11px] underline text-emerald-300 hover:text-white shrink-0"
                  >
                    Send another
                  </button>
                </motion.div>
              )}

              {/* Topic Pills */}
              <div className="mt-6">
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-gray-400">
                  Topic of Discussion
                </label>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((topic) => (
                    <motion.button
                      key={topic}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, topic }))}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative isolate rounded-xl border px-3.5 py-1.5 text-xs transition-colors ${
                        form.topic === topic
                          ? 'border-orange-400/40 text-orange-200'
                          : 'border-white/[0.08] bg-white/[0.02] text-gray-400 hover:text-white'
                      }`}
                    >
                      {form.topic === topic && (
                        <motion.span
                          layoutId="contact-topic-pill"
                          className="absolute inset-0 -z-10 rounded-xl bg-orange-400/[0.15]"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      {topic}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Fields */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field id="contact-name" label="Your Name" error={errors.name}>
                  <Input id="contact-name" placeholder="Engineering Lead / Recruiter" {...field('name')} />
                </Field>
                <Field id="contact-email" label="Your Email" error={errors.email}>
                  <Input id="contact-email" type="email" placeholder="recruiter@company.com" {...field('email')} />
                </Field>
              </div>

              <Field id="contact-message" label="Opportunity or Project Details" error={errors.message} className="mt-4">
                <Textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Tell me about the team, tech stack, role expectations, or interview process…"
                  {...field('message')}
                />
              </Field>

              <div className="mt-6 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
                <p className="font-mono text-[11px] text-gray-500">
                  Powered by Web3Forms · Instant delivery to inbox
                </p>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button type="submit" variant="gradient" size="lg" disabled={isSubmitting} className="group">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2 text-white" />
                        Delivering…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
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
      <label htmlFor={id} className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-gray-400">
        {label}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-rose-300"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
