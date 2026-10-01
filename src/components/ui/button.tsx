import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] active:duration-75 select-none outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-white text-gray-950 hover:bg-gray-200',
        gradient:
          'bg-linear-to-r from-orange-400 to-amber-500 font-semibold text-gray-950 shadow-lg shadow-orange-500/25 hover:shadow-orange-400/40 hover:brightness-110',
        outline: 'border border-white/15 bg-white/[0.02] text-gray-100 hover:border-white/25 hover:bg-white/[0.06]',
        secondary: 'bg-white/[0.06] text-gray-100 hover:bg-white/[0.1]',
        ghost: 'text-gray-400 hover:bg-white/[0.06] hover:text-white',
        link: 'text-orange-300 underline-offset-4 hover:underline',
        destructive: 'bg-red-500/90 text-white hover:bg-red-500',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 px-6 text-[15px]',
        xl: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
