import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useAnimationFrame, useInView, useReducedMotion } from 'framer-motion';
import { coreStack, orbitStack, STACK_GROUPS, type StackGroup, type StackTech } from '../../data/stack';
import { cn } from '../../utils/cn';
import { EASE } from '../shared';

/* ------------------------------------------------------------------ */
/* Layout — the scene is drawn in fixed coordinates, then scaled       */
/* ------------------------------------------------------------------ */

interface Ellipse {
  rx: number;
  ry: number;
  cx: number;
  cy: number;
}

interface Layout {
  w: number;
  h: number;
  icon: number;
  gap: number;
  rows: number[];
  rowY: number[];
  core: { x: number; y: number; r: number };
  orbits: Ellipse[];
  rings: Ellipse[];
  compact: boolean;
}

/** Ellipses that all "sit" on the same floor line, like the reference. */
const onFloor = (cx: number, floor: number, list: [rx: number, ry: number][]): Ellipse[] =>
  list.map(([rx, ry]) => ({ rx, ry, cx, cy: floor - ry }));

const DESKTOP: Layout = {
  w: 1000,
  h: 690,
  icon: 54,
  gap: 80,
  rows: [7, 7],
  rowY: [56, 138],
  core: { x: 500, y: 452, r: 92 },
  orbits: onFloor(500, 655, [
    [460, 116],
    [396, 128],
    [338, 146],
  ]),
  rings: onFloor(500, 590, [
    [176, 80],
    [150, 60],
  ]),
  compact: false,
};

const MOBILE: Layout = {
  w: 420,
  h: 640,
  icon: 50,
  gap: 70,
  rows: [5, 5, 4],
  rowY: [32, 100, 168],
  core: { x: 210, y: 400, r: 66 },
  orbits: onFloor(210, 590, [
    [202, 60],
    [174, 68],
    [148, 82],
  ]),
  rings: onFloor(210, 492, [[100, 42]]),
  compact: true,
};

interface Node {
  tech: StackTech;
  index: number;
  x: number;
  y: number;
  d: string;
}

function buildNodes(l: Layout): Node[] {
  const nodes: Node[] = [];
  const endY = l.core.y - l.core.r + 2;
  let i = 0;
  l.rows.forEach((count, row) => {
    for (let j = 0; j < count && i < coreStack.length; j++, i++) {
      const x = l.w / 2 + (j - (count - 1) / 2) * l.gap;
      const y = l.rowY[row];
      const y0 = y + l.icon / 2 + 2;
      const x1 = l.core.x + (x - l.core.x) * 0.07;
      const dy = endY - y0;
      // Leaves the icon leaning inwards and lands on the core vertically.
      const d = `M ${x} ${y0} C ${x + (x1 - x) * 0.18} ${y0 + dy * 0.32}, ${x1} ${endY - dy * 0.45}, ${x1} ${endY}`;
      nodes.push({ tech: coreStack[i], index: i, x, y, d });
    }
  });
  return nodes;
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

interface StackOrbitProps {
  filter: 'all' | StackGroup;
  activeId: string | null;
  onInspect: (id: string) => void;
  onReset: () => void;
}

export function StackOrbit({ filter, activeId, onInspect, onReset }: StackOrbitProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? Math.min(1000, Math.max(320, window.innerWidth - 64)) : 1000
  );
  const reduced = useReducedMotion() ?? false;
  const entered = useInView(wrapRef, { once: true, amount: 0.05 });
  const visible = useInView(wrapRef, { amount: 0.02 });

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = width > 0 && width < 640 ? MOBILE : DESKTOP;
  const scale = width ? Math.min(1, width / layout.w) : 1;
  const nodes = useMemo(() => buildNodes(layout), [layout]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const inFilter = useCallback((t: StackTech) => filter === 'all' || t.group === filter, [filter]);
  const activeIndex = nodes.findIndex((n) => n.tech.id === activeId);
  const active = activeIndex >= 0 ? nodes[activeIndex].tech : null;

  /* ---------- light pulses travelling down the wires ---------- */
  const [pulses, setPulses] = useState<{ key: number; index: number; strong: boolean }[]>([]);
  const pulseKey = useRef(0);
  const removePulse = useCallback((key: number) => setPulses((p) => p.filter((x) => x.key !== key)), []);

  // Wires remount when switching desktop ↔ mobile layouts; drop pulses bound to the old paths.
  useEffect(() => setPulses([]), [layout]);

  useEffect(() => {
    if (!entered || !visible || reduced) return;
    const pool = nodes.filter((n) => inFilter(n.tech)).map((n) => n.index);
    const idle = window.setInterval(() => {
      if (!pool.length) return;
      const index = pool[Math.floor(Math.random() * pool.length)];
      setPulses((p) => [...p.slice(-10), { key: ++pulseKey.current, index, strong: false }]);
    }, 650);
    const focused =
      activeIndex >= 0
        ? window.setInterval(() => {
            setPulses((p) => [...p.slice(-10), { key: ++pulseKey.current, index: activeIndex, strong: true }]);
          }, 420)
        : 0;
    return () => {
      window.clearInterval(idle);
      if (focused) window.clearInterval(focused);
    };
  }, [entered, visible, reduced, nodes, inFilter, activeIndex]);

  const { core } = layout;
  const lineTop = layout.rowY[0];
  const lineBottom = core.y - core.r;
  const groupLabel = filter === 'all' ? 'the stack' : STACK_GROUPS.find((g) => g.id === filter)?.short;

  return (
    <div ref={wrapRef} className="relative w-full" style={{ height: layout.h * scale, minHeight: 320 }}>
      {width > 0 && (
        <div
          className="absolute top-0 origin-top-left"
          style={{
            width: layout.w,
            height: layout.h,
            left: (width - layout.w * scale) / 2,
            transform: `scale(${scale})`,
          }}
        >
          {/* Glows */}
          <div
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              left: core.x - core.r * 3.4,
              top: core.y - core.r * 2.6,
              width: core.r * 6.8,
              height: core.r * 5.4,
              background: 'radial-gradient(closest-side, rgba(234,88,12,0.34), rgba(194,65,12,0.12) 55%, transparent)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              left: layout.orbits[0].cx - layout.orbits[0].rx,
              top: layout.orbits[0].cy - layout.orbits[0].ry,
              width: layout.orbits[0].rx * 2,
              height: layout.orbits[0].ry * 2 + 20,
              background: 'radial-gradient(closest-side, rgba(251,146,60,0.12), transparent)',
            }}
          />

          {/* Wires, orbits & pulses */}
          <svg className="absolute inset-0 overflow-visible" width={layout.w} height={layout.h} aria-hidden>
            <defs>
              <linearGradient id="wire" gradientUnits="userSpaceOnUse" x1="0" y1={lineTop} x2="0" y2={lineBottom}>
                <stop offset="0" stopColor="#fdba74" stopOpacity="0.12" />
                <stop offset="1" stopColor="#fb923c" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="orbit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fb923c" stopOpacity="0.04" />
                <stop offset="0.55" stopColor="#fb923c" stopOpacity="0.28" />
                <stop offset="1" stopColor="#fdba74" stopOpacity="0.85" />
              </linearGradient>
              <radialGradient id="pulse-halo">
                <stop offset="0" stopColor="#fdba74" stopOpacity="0.9" />
                <stop offset="1" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>
              <filter id="wire-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>

            {[...layout.orbits, ...layout.rings].map((o, i) => (
              <motion.ellipse
                key={`orbit-${layout.compact}-${i}`}
                cx={o.cx}
                cy={o.cy}
                rx={o.rx}
                ry={o.ry}
                fill="none"
                stroke="url(#orbit)"
                strokeWidth={i < layout.orbits.length ? 1.3 : 1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={entered ? { pathLength: 1, opacity: 1 } : undefined}
                transition={{ duration: 1.8, delay: 0.5 + i * 0.12, ease: EASE }}
              />
            ))}

            <OrbitIcons layout={layout} running={entered && visible && !reduced} />

            {nodes.map((n) => (
              <motion.path
                key={`wire-${layout.compact}-${n.tech.id}`}
                ref={(el) => {
                  pathRefs.current[n.index] = el;
                }}
                d={n.d}
                fill="none"
                stroke="url(#wire)"
                strokeWidth={layout.compact ? 1.1 : 1.2}
                initial={{ pathLength: 0 }}
                animate={entered ? { pathLength: 1, opacity: inFilter(n.tech) ? 1 : 0.14 } : undefined}
                transition={{ pathLength: { duration: 1.2, delay: 0.35 + n.index * 0.05, ease: EASE }, opacity: { duration: 0.3 } }}
              />
            ))}

            {active && activeIndex >= 0 && (
              <g key={`active-${active.id}-${layout.compact}`}>
                <motion.path
                  d={nodes[activeIndex].d}
                  fill="none"
                  stroke="#fb923c"
                  strokeWidth={5}
                  filter="url(#wire-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  transition={{ duration: 0.45, ease: EASE }}
                />
                <motion.path
                  d={nodes[activeIndex].d}
                  fill="none"
                  stroke="#fed7aa"
                  strokeWidth={1.8}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, ease: EASE }}
                />
              </g>
            )}

            {pulses.map((p) => (
              <Pulse key={p.key} id={p.key} path={pathRefs.current[p.index]} strong={p.strong} onDone={removePulse} />
            ))}
          </svg>

          {/* Core */}
          <motion.button
            type="button"
            onClick={onReset}
            aria-label={active ? `Showing ${active.name}. Reset the stack view` : 'The stack'}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={entered ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="absolute rounded-full outline-none focus-visible:ring-2 focus-visible:ring-orange-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
            style={{ left: core.x - core.r, top: core.y - core.r, width: core.r * 2, height: core.r * 2 }}
          >
            <CoreRing r={core.r} level={active?.level ?? 0} />
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full"
              animate={reduced ? undefined : { boxShadow: ['0 0 60px rgba(234,88,12,0.35)', '0 0 95px rgba(234,88,12,0.55)', '0 0 60px rgba(234,88,12,0.35)'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border border-orange-300/20 bg-[radial-gradient(circle_at_50%_88%,#ea580c_0%,#9a3412_34%,#431407_70%,#1f0f07_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-24px_48px_rgba(251,146,60,0.28)]"
            />
            <span className="relative flex h-full w-full items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                {active ? (
                  <motion.span
                    key={active.id}
                    initial={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                    transition={{ duration: 0.22 }}
                    className="flex flex-col items-center"
                  >
                    <BrandGlyph path={active.icon.path} color={active.icon.color} size={layout.compact ? 24 : 32} glow />
                    <span className={cn('mt-2 font-semibold text-white', layout.compact ? 'text-[11px]' : 'text-sm')}>
                      {active.name}
                    </span>
                    <span className={cn('font-mono text-orange-200/90', layout.compact ? 'text-[9px]' : 'text-[11px]')}>
                      {active.level}/100
                    </span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="glyph"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.22 }}
                    className="flex flex-col items-center"
                  >
                    <StackGlyph size={layout.compact ? 44 : 60} />
                    <span
                      className={cn(
                        'mt-1.5 font-mono uppercase tracking-[0.22em] text-orange-100/70',
                        layout.compact ? 'text-[8px]' : 'text-[10px]'
                      )}
                    >
                      {groupLabel}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </motion.button>

          {/* Tech nodes */}
          {nodes.map((n) => (
            <TechNode
              key={`${layout.compact}-${n.tech.id}`}
              node={n}
              size={layout.icon}
              entered={entered}
              dimmed={!inFilter(n.tech)}
              active={n.tech.id === activeId}
              onInspect={onInspect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

const TechNode = memo(function TechNode({
  node,
  size,
  entered,
  dimmed,
  active,
  onInspect,
}: {
  node: Node;
  size: number;
  entered: boolean;
  dimmed: boolean;
  active: boolean;
  onInspect: (id: string) => void;
}) {
  const { tech } = node;
  const inspect = () => onInspect(tech.id);
  // Stagger only the entrance; afterwards hover/active changes must respond instantly.
  const [introDone, setIntroDone] = useState(false);
  const delay = introDone ? 0 : 0.05 + node.index * 0.04;

  return (
    <motion.button
      type="button"
      aria-label={`${tech.name}, ${tech.level} out of 100`}
      aria-pressed={active}
      onMouseEnter={inspect}
      onFocus={inspect}
      onClick={inspect}
      initial={{ opacity: 0, y: -14, scale: 0.6 }}
      animate={entered ? { opacity: dimmed ? 0.28 : 1, y: 0, scale: active ? 1.12 : 1 } : undefined}
      onAnimationComplete={() => entered && setIntroDone(true)}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        opacity: { duration: 0.3, delay },
        default: { type: 'spring', stiffness: 380, damping: 22, delay },
      }}
      className={cn(
        'group absolute grid place-items-center rounded-full border outline-none transition-[border-color,box-shadow] duration-200',
        'bg-[radial-gradient(circle_at_50%_30%,#2e1d12,#1a100a)] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_10px_24px_-10px_rgba(0,0,0,0.9)]',
        'focus-visible:ring-2 focus-visible:ring-orange-300/70',
        active
          ? 'border-orange-400/70 shadow-[0_0_0_4px_rgba(251,146,60,0.12),0_0_28px_rgba(251,146,60,0.45)]'
          : 'border-white/[0.09] hover:border-orange-400/45'
      )}
      style={{ left: node.x - size / 2, top: node.y - size / 2, width: size, height: size }}
    >
      <BrandGlyph path={tech.icon.path} color={tech.icon.color} size={Math.round(size * 0.44)} />
      <span
        className={cn(
          'pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap font-mono text-[10.5px] tracking-wide transition-opacity duration-200',
          active ? 'text-orange-200 opacity-100' : 'text-stone-400 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
        )}
      >
        {tech.name}
      </span>
    </motion.button>
  );
});

function Pulse({
  id,
  path,
  strong,
  onDone,
}: {
  id: number;
  path: SVGPathElement | null | undefined;
  strong: boolean;
  onDone: (id: number) => void;
}) {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!path) {
      onDone(id);
      return;
    }
    const len = path.getTotalLength();
    const controls = animate(0, 1, {
      duration: strong ? 1.05 : 1.7,
      ease: [0.45, 0, 0.7, 1],
      onUpdate: (v) => {
        const el = ref.current;
        if (!el) return;
        const p = path.getPointAtLength(v * len);
        el.setAttribute('transform', `translate(${p.x} ${p.y})`);
        el.setAttribute('opacity', String(Math.min(1, v * 8, (1 - v) * 10 + 0.15)));
      },
      onComplete: () => onDone(id),
    });
    return () => controls.stop();
    // Each pulse animates exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <g ref={ref} opacity={0}>
      <circle r={strong ? 9 : 7} fill="url(#pulse-halo)" />
      <circle r={strong ? 2.6 : 2} fill="#fff7ed" />
    </g>
  );
}

/** Small tools riding the orbits, scaled/faded by depth for a 3D feel. */
function OrbitIcons({ layout, running }: { layout: Layout; running: boolean }) {
  const refs = useRef<(SVGGElement | null)[]>([]);
  const elapsed = useRef(0);
  const runningRef = useRef(running);
  runningRef.current = running;

  const items = useMemo(() => {
    const perOrbit = layout.orbits.map(() => [] as number[]);
    orbitStack.forEach((_, i) => perOrbit[i % layout.orbits.length].push(i));
    const speeds = [0.1, -0.075, 0.13];
    return orbitStack.map((tech, i) => {
      const orbit = i % layout.orbits.length;
      const slot = perOrbit[orbit].indexOf(i);
      const phase = (slot / perOrbit[orbit].length) * Math.PI * 2 + orbit * 0.9;
      return { tech, orbit, phase, speed: speeds[orbit % speeds.length] };
    });
  }, [layout]);

  const place = useCallback(
    (t: number) => {
      items.forEach((it, i) => {
        const el = refs.current[i];
        if (!el) return;
        const o = layout.orbits[it.orbit];
        const theta = it.phase + it.speed * t;
        const depth = (Math.sin(theta) + 1) / 2; // 0 = far (top), 1 = near (bottom)
        const s = (layout.compact ? 0.62 : 0.72) + 0.5 * depth;
        el.setAttribute('transform', `translate(${o.cx + o.rx * Math.cos(theta)} ${o.cy + o.ry * Math.sin(theta)}) scale(${s})`);
        el.style.opacity = String(0.22 + 0.78 * depth);
      });
    },
    [items, layout]
  );

  useEffect(() => place(elapsed.current), [place]);

  useAnimationFrame((_, delta) => {
    if (!runningRef.current) return;
    elapsed.current += Math.min(delta, 64) / 1000;
    place(elapsed.current);
  });

  return (
    <g>
      {items.map((it, i) => (
        <g
          key={it.tech.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <circle r={14} fill="#140c08" fillOpacity={0.75} stroke="#fb923c" strokeOpacity={0.18} />
          <g transform="translate(-8.5 -8.5) scale(0.7083)">
            <path d={it.tech.path} fill="#fdba74" />
          </g>
          <title>{it.tech.name}</title>
        </g>
      ))}
    </g>
  );
}

function CoreRing({ r, level }: { r: number; level: number }) {
  const ringR = r + 13;
  const size = ringR * 2 + 8;
  const c = 2 * Math.PI * ringR;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -rotate-90"
      width={size}
      height={size}
      style={{ left: r - size / 2, top: r - size / 2 }}
    >
      <circle cx={size / 2} cy={size / 2} r={ringR} fill="none" stroke="rgba(251,146,60,0.14)" strokeWidth={2} strokeDasharray="2 6" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={ringR}
        fill="none"
        stroke="#fb923c"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={c}
        initial={false}
        animate={{ strokeDashoffset: c * (1 - level / 100), opacity: level ? 1 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ filter: 'drop-shadow(0 0 6px rgba(251,146,60,0.8))' }}
      />
    </svg>
  );
}

function BrandGlyph({ path, color, size, glow }: { path: string; color: string; size: number; glow?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
      style={glow ? { filter: `drop-shadow(0 0 10px ${color}88)` } : undefined}
    >
      <path d={path} fill={color} />
    </svg>
  );
}

/** Stacked-layers mark drawn with glowing strokes — "the stack". */
function StackGlyph({ size }: { size: number }) {
  return (
    <svg
      viewBox="-32 -24 64 58"
      width={size}
      height={(size * 58) / 64}
      fill="none"
      stroke="#fff7ed"
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ filter: 'drop-shadow(0 0 6px rgba(253,186,116,0.95)) drop-shadow(0 0 16px rgba(249,115,22,0.7))' }}
    >
      <path d="M0 -20 L27 -6 L0 8 L-27 -6 Z" />
      <path d="M-27 6 L0 20 L27 6" />
      <path d="M-27 17 L0 31 L27 17" opacity={0.75} />
    </svg>
  );
}
