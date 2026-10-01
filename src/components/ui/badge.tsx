import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-white/10 bg-white/[0.05] text-gray-300',
        outline: 'border-white/15 text-gray-400',
        cyan: 'border-orange-400/20 bg-orange-400/10 text-orange-300',
        violet: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
        emerald: 'border-orange-400/20 bg-orange-400/10 text-orange-300',
        amber: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
        rose: 'border-rose-400/20 bg-rose-400/10 text-rose-300',
        sky: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
