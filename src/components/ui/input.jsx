import React from 'react';
    import { cn } from '@/lib/utils';

    const Input = React.forwardRef(({ className, type, ...props }, ref) => {
      return (
        <input
          type={type}
          className={cn(
            'flex h-auto w-full rounded-lg border border-input bg-transparent px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 text-text-light',
            'focus:border-accent focus:ring-accent', // Custom focus for enterprise look
            className
          )}
          ref={ref}
          {...props}
        />
      );
    });
    Input.displayName = 'Input';

    export { Input };