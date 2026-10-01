import { Children, isValidElement, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { EASE } from '../shared';

interface AnimatedParagraphProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverAccent?: boolean;
}

export function AnimatedParagraph({
  children,
  className,
  delay = 0,
  hoverAccent = false,
}: AnimatedParagraphProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -20px 0px' }}
      transition={{ duration: 0.95, delay, ease: EASE }}
      className={cn(
        'leading-relaxed text-gray-400 transition-colors duration-200',
        hoverAccent &&
          'rounded-xl border border-transparent p-3 -ml-3 hover:border-orange-500/20 hover:bg-orange-500/[0.03] hover:text-gray-200',
        className
      )}
    >
      {children}
    </motion.p>
  );
}

interface StaggerParagraphsProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerParagraphs({
  children,
  className,
  staggerDelay = 0.16,
}: StaggerParagraphsProps) {
  const items = Children.toArray(children);

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
      {items.map((child, idx) => {
        if (!isValidElement(child)) return child;
        return (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function TextHighlight({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-orange-400/20 bg-orange-400/10 px-1.5 py-0.5 font-mono text-[0.92em] text-orange-200 font-medium transition-all hover:border-orange-400/40 hover:bg-orange-400/20 hover:text-white',
        className
      )}
    >
      {children}
    </span>
  );
}
