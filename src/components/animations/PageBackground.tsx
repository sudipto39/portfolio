import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export type PageVariant = 'about' | 'projects' | 'stack' | 'experience' | 'ai-twin' | 'contact' | 'default';

interface PageBackgroundProps {
  variant?: PageVariant;
  className?: string;
}

// Generate deterministic floating ember particle points
function generateParticles(count: number, seed: number) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const pseudoRandom1 = Math.sin(seed + i * 12.9898) * 0.5 + 0.5;
    const pseudoRandom2 = Math.cos(seed + i * 78.233) * 0.5 + 0.5;
    const pseudoRandom3 = Math.sin(seed + i * 45.164) * 0.5 + 0.5;
    const pseudoRandom4 = Math.cos(seed + i * 93.371) * 0.5 + 0.5;

    particles.push({
      id: i,
      left: `${(pseudoRandom1 * 96 + 2).toFixed(1)}%`,
      top: `${(pseudoRandom2 * 96 + 2).toFixed(1)}%`,
      size: Math.floor(pseudoRandom3 * 4) + 2, // 2px to 6px
      duration: (pseudoRandom4 * 12 + 10).toFixed(1), // 10s to 22s
      delay: (pseudoRandom1 * 5).toFixed(1),
      xOffset: (pseudoRandom2 * 60 - 30).toFixed(0),
      yOffset: -(pseudoRandom3 * 90 + 30).toFixed(0),
      opacity: (pseudoRandom4 * 0.5 + 0.25).toFixed(2),
      isAmber: i % 3 === 0,
      isPulse: i % 4 === 0,
    });
  }
  return particles;
}

export function PageBackground({ variant = 'default', className }: PageBackgroundProps) {
  const particles = useMemo(() => {
    const seed = variant.split('').reduce((acc, c) => acc + c.charCodeAt(0), 42);
    return generateParticles(24, seed);
  }, [variant]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none',
        className
      )}
    >
      {/* 1. Global Subtle Tech Grid with Radial Vignette */}
      <div className="absolute inset-0 bg-grid opacity-35 fade-radial" />

      {/* 2. Floating Ambient Glow Orbs with Organic Drift */}
      <motion.div
        animate={{
          scale: [1, 1.28, 1.05, 1],
          x: [0, 45, -30, 0],
          y: [0, -35, 25, 0],
          opacity: [0.12, 0.2, 0.14, 0.12],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.35) 0%, rgba(234, 88, 12, 0.12) 45%, transparent 70%)',
          filter: 'blur(90px)',
        }}
        className="absolute -top-24 left-[10%] h-[480px] w-[480px] rounded-full sm:h-[620px] sm:w-[620px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.35, 1.1, 1],
          x: [0, -50, 40, 0],
          y: [0, 45, -25, 0],
          opacity: [0.1, 0.18, 0.12, 0.1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(180, 83, 9, 0.1) 50%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        className="absolute top-1/3 -right-28 h-[520px] w-[520px] rounded-full sm:h-[680px] sm:w-[680px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.22, 1],
          x: [0, 35, -45, 0],
          y: [0, -40, 30, 0],
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
        style={{
          background: 'radial-gradient(circle, rgba(217, 119, 87, 0.28) 0%, rgba(251, 146, 60, 0.08) 50%, transparent 70%)',
          filter: 'blur(95px)',
        }}
        className="absolute bottom-1/4 -left-20 h-[450px] w-[450px] rounded-full sm:h-[600px] sm:w-[600px]"
      />

      {/* 3. Floating Ember Stardust / Spark Particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{
              opacity: [0, Number(p.opacity), Number(p.opacity) * 0.7, 0],
              y: [0, Number(p.yOffset)],
              x: [0, Number(p.xOffset), 0],
              scale: p.isPulse ? [1, 1.6, 1] : [1, 1.2, 1],
            }}
            transition={{
              duration: Number(p.duration),
              repeat: Infinity,
              delay: Number(p.delay),
              ease: 'easeInOut',
            }}
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              boxShadow: p.isAmber
                ? '0 0 10px 2px rgba(245, 158, 11, 0.6)'
                : '0 0 10px 2px rgba(251, 146, 60, 0.6)',
            }}
            className={cn(
              'absolute rounded-full',
              p.isAmber ? 'bg-amber-300' : 'bg-orange-400'
            )}
          />
        ))}
      </div>

      {/* 4. Variant-Specific Thematic Animated Motifs */}
      {variant === 'about' && (
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M 50 120 L 250 120 L 320 200 L 700 200"
            fill="none"
            stroke="#fb923c"
            strokeWidth="1.5"
            strokeDasharray="8 12"
            animate={{ strokeDashoffset: [0, -100] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M 800 600 L 1050 600 L 1150 720 L 1500 720"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="6 10"
            animate={{ strokeDashoffset: [0, 80] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
      )}

      {variant === 'projects' && (
        <div className="absolute inset-0 overflow-hidden opacity-[0.07]">
          {/* Subtle streaming data matrix beams */}
          <motion.div
            className="absolute -top-40 left-1/4 h-[900px] w-px bg-linear-to-b from-transparent via-orange-400 to-transparent"
            animate={{ y: ['-50%', '100%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -top-40 right-1/3 h-[750px] w-px bg-linear-to-b from-transparent via-amber-400 to-transparent"
            animate={{ y: ['-40%', '110%'] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'linear', delay: 2 }}
          />
          <motion.div
            className="absolute -top-40 right-1/6 h-[800px] w-px bg-linear-to-b from-transparent via-orange-300 to-transparent"
            animate={{ y: ['-60%', '100%'] }}
            transition={{ duration: 9.5, repeat: Infinity, ease: 'linear', delay: 4 }}
          />
        </div>
      )}

      {variant === 'stack' && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08]">
          {/* Subtle concentric radar / planetary rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            className="h-[750px] w-[750px] rounded-full border border-dashed border-orange-400/50"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
            className="absolute h-[1050px] w-[1050px] rounded-full border border-dotted border-amber-400/40"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
            className="absolute h-[1350px] w-[1350px] rounded-full border border-dashed border-orange-500/30"
          />
        </div>
      )}

      {variant === 'experience' && (
        <div className="absolute inset-0 opacity-[0.06]">
          {/* Vertical milestone pulse bar */}
          <div className="absolute top-0 bottom-0 left-[15.5px] sm:left-[19.5px] lg:left-[calc(50%-700px)] w-[1px] bg-linear-to-b from-orange-400 via-amber-300 to-transparent" />
          <motion.div
            className="absolute left-[13px] sm:left-[17px] lg:left-[calc(50%-702px)] h-8 w-2 rounded-full bg-orange-400 blur-[2px]"
            animate={{ y: ['0vh', '100vh'] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}

      {variant === 'ai-twin' && (
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Synaptic AI neural connection lines */}
          <motion.circle
            cx="20%"
            cy="30%"
            r="4"
            fill="#fb923c"
            animate={{ opacity: [0.2, 0.8, 0.2], r: [3, 5, 3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.circle
            cx="35%"
            cy="20%"
            r="3"
            fill="#f59e0b"
            animate={{ opacity: [0.3, 0.9, 0.3], r: [2, 4, 2] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
          <motion.circle
            cx="75%"
            cy="40%"
            r="4"
            fill="#fb923c"
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 4.5, repeat: Infinity, delay: 2 }}
          />
          <motion.circle
            cx="85%"
            cy="25%"
            r="3"
            fill="#fdba74"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
          />
          <path
            d="M 280 220 L 490 150 L 720 280 L 1050 300"
            fill="none"
            stroke="rgba(251, 146, 60, 0.4)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        </svg>
      )}

      {variant === 'contact' && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07]">
          {/* Communication radar beacon rings radiating outward */}
          {[0, 1, 2].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border border-orange-400"
              initial={{ width: 120, height: 120, opacity: 0.8 }}
              animate={{
                width: [120, 800],
                height: [120, 800],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: ring * 2,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      {/* 5. Smooth bottom gradient blend */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-ink via-ink/60 to-transparent" />
    </div>
  );
}
