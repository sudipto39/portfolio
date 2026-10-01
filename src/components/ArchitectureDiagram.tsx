import { SpotlightCard } from './shared';

const NODE_WIDTH = 144;
const NODE_HEIGHT = 46;

const COLUMNS: [label: string, x: number][] = [
  ['clients', 92],
  ['cloud run', 282],
  ['services', 502],
  ['storage', 712],
];

const NODES = [
  { id: 'client', x: 92, y: 190, label: 'React 19 App', sub: 'Vite · Tailwind', color: '#38bdf8' },
  { id: 'gateway', x: 282, y: 190, label: 'GCP Cloud Run', sub: 'Express 5 · Auth', color: '#fb923c' },
  { id: 'webhooks', x: 502, y: 85, label: 'HMAC Webhooks', sub: 'timingSafeEqual', color: '#34d399' },
  { id: 'gitea', x: 502, y: 190, label: 'Gitea Git API', sub: 'Diffs · Milestones', color: '#f97316' },
  { id: 'judge0', x: 502, y: 295, label: 'Judge0 Sandbox', sub: 'GCP Compute VM', color: '#fbbf24' },
  { id: 'redis', x: 712, y: 85, label: 'Redis Store', sub: 'Queue & Sessions', color: '#f43f5e' },
  { id: 'postgres', x: 712, y: 190, label: 'Neon Postgres', sub: 'Prisma Migrations', color: '#10b981' },
  { id: 's3', x: 712, y: 295, label: 'AWS S3', sub: 'Presigned Artifacts', color: '#f59e0b' },
];

const EDGES = [
  // Client -> Cloud Run Gateway
  { d: 'M 164 190 L 210 190', dur: 2.2, dashed: false },
  // Cloud Run Gateway -> Services (smooth cubic S-curves)
  { d: 'M 354 190 C 392 190, 392 85, 430 85', dur: 2.8, dashed: false },
  { d: 'M 354 190 L 430 190', dur: 2.4, dashed: false },
  { d: 'M 354 190 C 392 190, 392 295, 430 295', dur: 3.0, dashed: false },
  // Services -> Storage
  { d: 'M 574 85 L 640 85', dur: 2.2, dashed: false },
  { d: 'M 574 190 L 640 190', dur: 2.4, dashed: false },
  { d: 'M 574 295 L 640 295', dur: 2.6, dashed: false },
  // Redis + Postgres Hybrid Session Fallback sync bus
  { d: 'M 712 108 L 712 167', dur: 3.4, dashed: true },
];

const PORTS = [
  { x: 164, y: 190 },
  { x: 210, y: 190 },
  { x: 354, y: 190 },
  { x: 430, y: 85 },
  { x: 430, y: 190 },
  { x: 430, y: 295 },
  { x: 574, y: 85 },
  { x: 574, y: 190 },
  { x: 574, y: 295 },
  { x: 640, y: 85 },
  { x: 640, y: 190 },
  { x: 640, y: 295 },
  { x: 712, y: 108 },
  { x: 712, y: 167 },
];

export function ArchitectureDiagram() {
  return (
    <SpotlightCard className="p-5 sm:p-7 transition-all duration-300 hover:border-orange-400/30 hover:shadow-2xl hover:shadow-orange-500/10">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-400" />
          </span>
          giteaforge.topology — cloud-native
        </div>
        <div className="flex items-center gap-4 font-mono text-xs text-gray-400">
          <span>
            webhook <span className="text-orange-200 font-semibold">&lt; 45ms</span>
          </span>
          <span>
            <span className="text-amber-200 font-semibold">8+</span> Languages
          </span>
        </div>
      </div>

      <svg
        viewBox="0 0 810 360"
        className="h-auto w-full transition-all duration-300"
        role="img"
        aria-label="GiteaForge cloud-native architecture: clients call GCP Cloud Run Express 5 services connecting to HMAC webhooks, Gitea Git API, and Judge0 sandboxes backed by Redis and Neon PostgreSQL"
      >
        <defs>
          <linearGradient id="nodeBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#141a26" />
            <stop offset="100%" stopColor="#080c14" />
          </linearGradient>
        </defs>

        {/* Column Headers */}
        {COLUMNS.map(([label, x]) => (
          <text
            key={label}
            x={x}
            y={32}
            textAnchor="middle"
            className="fill-gray-500 font-mono text-[10px] uppercase tracking-[0.2em]"
          >
            {label}
          </text>
        ))}

        {/* Edges & Animated Data Packets */}
        {EDGES.map((e, i) => (
          <g key={i}>
            <path
              d={e.d}
              fill="none"
              stroke={e.dashed ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.08)'}
              strokeWidth={1.5}
              strokeDasharray={e.dashed ? '4 4' : undefined}
            />
            <path
              d={e.d}
              fill="none"
              stroke={e.dashed ? 'rgba(245,158,11,0.6)' : 'rgba(251,146,60,0.65)'}
              strokeWidth={1.5}
              strokeDasharray={e.dashed ? '4 4' : undefined}
              className="flow-line"
            />
            <circle r={2.5} fill={e.dashed ? '#fbbf24' : '#fdba74'}>
              <animateMotion dur={`${e.dur}s`} repeatCount="indefinite" path={e.d} />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.88;1"
                dur={`${e.dur}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        {/* Redis + Postgres Fallback Label */}
        <text x={718} y={141} className="fill-amber-400/80 font-mono text-[7.5px] uppercase tracking-wider">
          fallback
        </text>

        {/* Hardware Connector Ports */}
        {PORTS.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3} fill="#0d1117" stroke="rgba(251,146,60,0.7)" strokeWidth={1} />
            <circle cx={p.x} cy={p.y} r={1.2} fill="#ffffff" />
          </g>
        ))}

        {/* Pulse around the Cloud Run gateway */}
        <rect
          x={282 - 76}
          y={190 - 27}
          width={152}
          height={54}
          rx={14}
          fill="none"
          stroke="rgba(251,146,60,0.4)"
          strokeWidth={1}
        >
          <animate attributeName="stroke-opacity" values="0.7;0.15;0.7" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" values="1;2;1" dur="2.4s" repeatCount="indefinite" />
        </rect>
        <circle cx={282} cy={190} r={44} fill="none" stroke="rgba(245,158,11,0.25)">
          <animate attributeName="r" values="38;56;38" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.4s" repeatCount="indefinite" />
        </circle>

        {/* Micro-service & Infrastructure Node Cards */}
        {NODES.map((n) => (
          <g
            key={n.id}
            transform={`translate(${n.x - NODE_WIDTH / 2} ${n.y - NODE_HEIGHT / 2})`}
            className="cursor-pointer transition-transform duration-200 hover:scale-[1.03]"
          >
            <rect
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx={10}
              fill="url(#nodeBg)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={1}
              className="hover:stroke-orange-400/60 transition-colors"
            />
            {/* Status indicator dot with subtle ambient glow */}
            <circle cx={14} cy={23} r={5} fill={n.color} opacity={0.25} />
            <circle cx={14} cy={23} r={2.8} fill={n.color} />

            {/* Title */}
            <text x={26} y={20} className="fill-slate-100 text-[11px] font-semibold tracking-tight">
              {n.label}
            </text>
            {/* Subtitle */}
            <text x={26} y={34} className="fill-gray-400 font-mono text-[8.5px]">
              {n.sub}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> HMAC-SHA256 verified
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" /> Judge0 VM sandbox
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" /> Redis + Postgres fallback
        </span>
      </div>
    </SpotlightCard>
  );
}
