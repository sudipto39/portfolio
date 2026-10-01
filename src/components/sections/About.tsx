import { Activity, ArrowRight, Layers, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { profile } from '../../data/profile';
import { useChat } from '../../hooks/use-chat';
import { Button } from '../ui/button';
import { Counter, Reveal, SectionHeading, SpotlightCard } from '../shared';

const PRINCIPLE_ICONS = [ShieldCheck, Activity, Layers, Workflow];

/* ---------------------- animated architecture diagram ---------------------- */

const COLUMNS: [label: string, x: number][] = [
  ['edge', 70],
  ['gateway', 220],
  ['services', 380],
  ['data', 530],
];

const NODES = [
  { id: 'client', x: 70, y: 190, label: 'Clients', sub: 'web · mobile', dot: 'fill-amber-400' },
  { id: 'gateway', x: 220, y: 190, label: 'API Gateway', sub: 'auth · limits', dot: 'fill-orange-400' },
  { id: 'identity', x: 380, y: 90, label: 'Identity', sub: 'OIDC · RBAC', dot: 'fill-orange-700' },
  { id: 'payments', x: 380, y: 190, label: 'Payments', sub: 'Go · gRPC', dot: 'fill-orange-400' },
  { id: 'ledger', x: 380, y: 290, label: 'Ledger', sub: 'event-sourced', dot: 'fill-amber-400' },
  { id: 'redis', x: 530, y: 90, label: 'Redis', sub: 'sessions', dot: 'fill-orange-700' },
  { id: 'postgres', x: 530, y: 190, label: 'PostgreSQL', sub: 'HA cluster', dot: 'fill-amber-400' },
  { id: 'kafka', x: 530, y: 290, label: 'Kafka', sub: 'outbox events', dot: 'fill-amber-400' },
];

const EDGES = [
  { d: 'M120 190 H170', dur: 1.6 },
  { d: 'M270 190 C300 190 300 90 330 90', dur: 2.2 },
  { d: 'M270 190 H330', dur: 1.8 },
  { d: 'M270 190 C300 190 300 290 330 290', dur: 2.4 },
  { d: 'M430 90 H480', dur: 1.5 },
  { d: 'M430 190 H480', dur: 1.7 },
  { d: 'M430 290 C455 290 455 204 480 204', dur: 2.1 },
  { d: 'M430 290 H480', dur: 1.6 },
];

function ArchitectureDiagram() {
  return (
    <SpotlightCard className="p-4 sm:p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[11px] text-gray-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
          system.topology — live
        </div>
        <div className="flex items-center gap-3 font-mono text-[10.5px] text-gray-500">
          <span>
            p99 <span className="text-gray-200">42ms</span>
          </span>
          <span>
            <span className="text-gray-200">12k</span> TPS
          </span>
        </div>
      </div>

      <svg
        viewBox="0 0 600 360"
        className="h-auto w-full"
        role="img"
        aria-label="Simplified architecture: clients call an API gateway that routes to identity, payments and ledger services backed by Redis, PostgreSQL and Kafka"
      >
        {COLUMNS.map(([label, x]) => (
          <text
            key={label}
            x={x}
            y={34}
            textAnchor="middle"
            className="fill-gray-600 font-mono text-[10px] uppercase tracking-[0.2em]"
          >
            {label}
          </text>
        ))}

        {EDGES.map((e, i) => (
          <g key={i}>
            <path d={e.d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} />
            <path d={e.d} fill="none" stroke="rgba(251,146,60,0.6)" strokeWidth={1.5} className="flow-line" />
            <circle r={3} fill="#fdba74">
              <animateMotion dur={`${e.dur}s`} repeatCount="indefinite" path={e.d} />
            </circle>
          </g>
        ))}

        {/* pulse around the gateway */}
        <circle cx={220} cy={190} r={30} fill="none" stroke="rgba(251,146,60,0.4)">
          <animate attributeName="r" values="28;48" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="2.4s" repeatCount="indefinite" />
        </circle>

        {NODES.map((n) => (
          <g key={n.id} transform={`translate(${n.x - 50} ${n.y - 22})`}>
            <rect width={100} height={44} rx={10} className="fill-gray-950 stroke-white/15" strokeWidth={1} />
            <circle cx={14} cy={22} r={3.5} className={n.dot} />
            <text x={25} y={19} className="fill-gray-100 text-[11px] font-medium">
              {n.label}
            </text>
            <text x={25} y={32} className="fill-gray-500 font-mono text-[8.5px]">
              {n.sub}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10.5px] text-gray-500">
        <span>● idempotent writes</span>
        <span>● outbox → Kafka → consumers</span>
        <span>● SLO-driven alerts</span>
      </div>
    </SpotlightCard>
  );
}

/* ------------------------------ section ------------------------------ */

export function About() {
  const { ask } = useChat();

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="About"
              title={
                <>
                  Engineer by trade, <span className="text-gradient">operator at heart.</span>
                </>
              }
            />
            <Reveal delay={0.1} className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-gray-400">
              {profile.bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </Reveal>
            <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => ask('Walk me through your career so far.')}>
                <Sparkles className="h-4 w-4 text-orange-300" />
                Ask my twin about my career
              </Button>
              <Button variant="ghost" asChild>
                <a href="#experience">
                  See experience <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <ArchitectureDiagram />
          </Reveal>
        </div>

        <Reveal className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] lg:grid-cols-4">
          {profile.stats.map((s) => (
            <div key={s.label} className="bg-ink px-5 py-7 sm:px-6">
              <div className="font-mono text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </div>
              <div className="mt-1.5 text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </Reveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profile.principles.map((p, i) => {
            const Icon = PRINCIPLE_ICONS[i % PRINCIPLE_ICONS.length];
            return (
              <Reveal key={p.title} delay={i * 0.06} className="h-full">
                <SpotlightCard className="h-full p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-orange-400/20 bg-orange-400/[0.06]">
                    <Icon className="h-4 w-4 text-orange-300" />
                  </span>
                  <h3 className="mt-4 font-medium text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{p.body}</p>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
