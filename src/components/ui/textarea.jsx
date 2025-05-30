import React from 'react';
    import { cn } from '@/lib/utils';

    const Textarea = React.forwardRef(({ className, ...props }, ref) => {
      return (
        <textarea
          className={cn(
            'flex min-h-[120px] w-full rounded-lg border border-input bg-transparent px-4 py-3 text-base ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 text-text-light',
            'focus:border-accent focus:ring-accent', // Custom focus for enterprise look
            className
          )}
          ref={ref}
          {...props}
        />
      );
    });
    Textarea.displayName = 'Textarea';

    export { Textarea };