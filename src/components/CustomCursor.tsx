import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for outer fluid ring
  const springConfig = { damping: 28, stiffness: 450, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Snappy spring for inner core dot
  const dotSpringConfig = { damping: 40, stiffness: 1400 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  useEffect(() => {
    // Only activate on devices with fine pointer (mouse/trackpad), not touch
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) return;

    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check element under cursor for interactive hover states
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], [role="tab"], [role="radio"], [role="switch"], [role="checkbox"], .cursor-pointer, [data-cursor-interactive], summary, label[for]'
      );
      const textInput = target.closest('input, textarea, [contenteditable="true"]');

      setIsPointer(Boolean(interactive && !textInput));
      setIsTextInput(Boolean(textInput));
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const clickId = Date.now();
      setClicks((prev) => [...prev.slice(-3), { id: clickId, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setClicks((prev) => prev.filter((c) => c.id !== clickId));
      }, 550);
    };

    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.25s ease' }}
    >
      {/* 1. Outer Smooth Trailing Ring with Magnetic Morphing */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{
          width: isTextInput ? 24 : isPointer ? 54 : 34,
          height: isTextInput ? 38 : isPointer ? 54 : 34,
          borderRadius: isTextInput ? '6px' : '9999px',
          borderColor: isPointer
            ? 'rgba(251, 146, 60, 0.85)'
            : isTextInput
            ? 'rgba(251, 146, 60, 0.5)'
            : 'rgba(251, 146, 60, 0.45)',
          backgroundColor: isPointer
            ? 'rgba(251, 146, 60, 0.12)'
            : isTextInput
            ? 'rgba(251, 146, 60, 0.05)'
            : 'rgba(251, 146, 60, 0.03)',
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 25,
        }}
        className="absolute rounded-full border border-orange-400/50 backdrop-blur-[0.5px] shadow-[0_0_15px_rgba(251,146,60,0.15)]"
      />

      {/* 2. Inner Precision Core Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{
          scale: isTextInput ? 0 : isPointer ? 0.6 : isClicking ? 1.4 : 1,
          opacity: isTextInput ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
        className="absolute h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_10px_2px_rgba(251,146,60,0.9)]"
      />

      {/* 3. Ripple Shockwave on Click */}
      {clicks.map((click) => (
        <motion.div
          key={click.id}
          initial={{
            x: click.x,
            y: click.y,
            translateX: '-50%',
            translateY: '-50%',
            scale: 0.6,
            opacity: 0.8,
          }}
          animate={{
            scale: 2.2,
            opacity: 0,
          }}
          transition={{
            duration: 0.55,
            ease: 'easeOut',
          }}
          className="absolute h-8 w-8 rounded-full border border-orange-400"
        />
      ))}
    </div>
  );
}
