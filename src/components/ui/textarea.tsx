import * as React from 'react';
import { cn } from '../../utils/cn';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[110px] w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-gray-500',
      'focus:border-orange-400/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-orange-400/10',
      'aria-invalid:border-rose-400/60 aria-invalid:focus:ring-rose-400/10',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };
