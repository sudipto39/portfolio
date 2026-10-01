import { SpotlightCard } from './shared';

const NODE_WIDTH = 144;
const NODE_HEIGHT = 46;

const COLUMNS: [label: string, x: number][] = [
  ['EDGE', 92],
  ['GATEWAY', 282],
  ['SERVICES', 502],
  ['DATA', 712],
];

const NODES = [
  { id: 'clients', x: 92, y: 190, label: 'Clients', sub: 'React 19 · Mobile', color: '#f59e0b' },
  { id: 'gateway', x: 282, y: 190, label: 'API Gateway', sub: 'Express 5 · Auth', color: '#fb923c' },
  { id: 'auth', x: 502, y: 85, label: 'Auth & RBAC', sub: 'JWT · OWASP Security', color: '#ef4444' },
  { id: 'services', x: 502, y: 190, label: 'Microservices', sub: 'Node.js · REST APIs', color: '#f59e0b' },
  { id: 'worker', x: 502, y: 295, label: 'Async Worker', sub: 'Docker · Sandboxes', color: '#fbbf24' },
  { id: 'redis', x: 712, y: 85, label: 'Redis Store', sub: 'Sessions & Cache', color: '#ef4444' },
  { id: 'postgres', x: 712, y: 190, label: 'PostgreSQL', sub: 'Neon · Prisma ORM', color: '#f59e0b' },
  { id: 'cloud', x: 712, y: 295, label: 'AWS S3 / GCP', sub: 'Cloud Artifacts', color: '#fbbf24' },
];

const EDGES = [
  // Clients -> API Gateway
  { d: 'M 164 190 L 210 190', dur: 2.2, dashed: false },
  // API Gateway -> Services (smooth curves)
  { d: 'M 354 190 C 392 190, 392 85, 430 85', dur: 2.8, dashed: false },
  { d: 'M 354 190 L 430 190', dur: 2.4, dashed: false },
  { d: 'M 354 190 C 392 190, 392 295, 430 295', dur: 3.0, dashed: false },
  // Services -> Data
  { d: 'M 574 85 L 640 85', dur: 2.2, dashed: false },
  { d: 'M 574 190 L 640 190', dur: 2.4, dashed: false },
  // Async Worker -> PostgreSQL (upward sync curve)
  { d: 'M 574 295 C 607 295, 607 190, 640 190', dur: 3.2, dashed: true },
  // Async Worker -> Cloud storage
  { d: 'M 574 295 L 640 295', dur: 2.6, dashed: false },
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
];

export function SystemTopologyDiagram() {
  return (
    <SpotlightCard className="p-5 sm:p-7 transition-all duration-300 hover:border-orange-400/30 hover:shadow-2xl hover:shadow-orange-500/10">
      {/* Header bar matching the user's requested style */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 font-mono text-xs text-gray-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-400" />
          </span>
          <span className="font-semibold text-white">system.topology</span>
          <span className="text-gray-500">—</span>
          <span className="text-orange-300">live</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs text-gray-400">
          <span>
            p99 <span className="text-orange-200 font-bold">42ms</span>
          </span>
          <span>
            <span className="text-amber-200 font-bold">12k</span> TPS
          </span>
        </div>
      </div>

      <svg
        viewBox="0 0 810 360"
        className="h-auto w-full transition-all duration-300"
        role="img"
        aria-label="Cloud-native live system architecture: Clients connecting to API Gateway routing to Auth, Microservices, and Async Workers backed by Redis, PostgreSQL, and AWS S3"
      >
        <defs>
          <linearGradient id="liveNodeBg" x1="0" y1="0" x2="0" y2="1">
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
            className="fill-gray-500 font-mono text-[10px] uppercase tracking-[0.25em]"
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
              stroke={e.dashed ? 'rgba(245,158,11,0.22)' : 'rgba(255,255,255,0.08)'}
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

        {/* Hardware Connector Ports */}
        {PORTS.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3} fill="#0d1117" stroke="rgba(251,146,60,0.7)" strokeWidth={1} />
            <circle cx={p.x} cy={p.y} r={1.2} fill="#ffffff" />
          </g>
        ))}

        {/* Pulsing Concentric Radar Rings around API Gateway */}
        <circle cx={282} cy={190} r={46} fill="none" stroke="rgba(251,146,60,0.25)">
          <animate attributeName="r" values="40;58;40" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx={282} cy={190} r={36} fill="none" stroke="rgba(245,158,11,0.3)">
          <animate attributeName="r" values="32;48;32" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Micro-service & Node Cards */}
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
              fill="url(#liveNodeBg)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={1}
              className="hover:stroke-orange-400/60 transition-colors"
            />
            {/* Status indicator dot */}
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

      {/* Footer Status Indicators matching the reference image */}
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 font-mono text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> idempotent writes
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" /> async queues &amp; sandboxes
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" /> SLO-driven alerts
        </span>
      </div>
    </SpotlightCard>
  );
}
