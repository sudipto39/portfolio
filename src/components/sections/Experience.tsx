import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { profile } from '../../data/profile';
import { cn } from '../../utils/cn';
import { EASE, SectionHeading } from '../shared';

export function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4">
        <SectionHeading
          eyebrow="Experience"
          title={
            <>
              A decade of shipping <span className="text-gradient">&amp; operating</span> backends
            </>
          }
        />

        <ol className="relative mt-14 space-y-6 before:absolute before:bottom-4 before:left-[15.5px] before:top-4 before:w-px before:bg-linear-to-b before:from-orange-400/60 before:via-white/10 before:to-transparent sm:before:left-[19.5px]">
          {profile.experience.map((role, i) => {
            const current = i === 0;
            return (
              <motion.li
                key={role.company}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                className="relative pl-12 sm:pl-14"
              >
                <span className="absolute left-0 top-5 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-ink sm:h-10 sm:w-10">
                  <span
                    className={cn(
                      'rounded-full',
                      current ? 'h-2.5 w-2.5 bg-orange-300 shadow-[0_0_12px_rgba(251,146,60,0.9)]' : 'h-2 w-2 bg-gray-500'
                    )}
                  />
                </span>

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5 transition-colors hover:border-white/15 sm:p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-gray-500">
                    <span className={cn(current && 'text-orange-300')}>{role.period}</span>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {role.location}
                    </span>
                    {current && (
                      <span className="rounded-full border border-orange-400/25 bg-orange-400/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-orange-300">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {role.title} <span className="font-normal text-gray-500">@</span>{' '}
                    <span className="text-gray-200">{role.company}</span>
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">{role.summary}</p>
                  <ul className="mt-4 space-y-2">
                    {role.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5 text-sm text-gray-300">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-orange-400/70" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {role.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-gray-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
