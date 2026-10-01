import * as React from 'react';
import { cn } from '../../utils/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-sm text-white outline-none transition placeholder:text-gray-500',
      'focus:border-orange-400/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-orange-400/10',
      'aria-invalid:border-rose-400/60 aria-invalid:focus:ring-rose-400/10',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
