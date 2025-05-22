import React from 'react';
    import { Slot } from '@radix-ui/react-slot';
    import { cva } from 'class-variance-authority';
    import { cn } from '@/lib/utils';

    const buttonVariants = cva(
      'inline-flex items-center justify-center font-semibold ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      {
        variants: {
          variant: {
            default: 'bg-primary text-[color:var(--primary-foreground)] hover:bg-primary/90 shadow-primary',
            destructive:
              'bg-destructive text-[color:var(--destructive-foreground)] hover:bg-destructive/90 shadow-md',
            outline:
              'border-2 border-input bg-transparent hover:bg-accent hover:text-[color:var(--accent-foreground)]',
            secondary:
              'bg-secondary text-[color:var(--secondary-foreground)] hover:bg-secondary/80 shadow-secondary',
            ghost: 'hover:bg-white/10 hover:text-accent',
            link: 'text-accent underline-offset-4 hover:underline hover:text-accent/80',
          },
          size: {
            default: 'h-auto px-4 py-2 text-sm rounded-button', 
            sm: 'h-auto px-3 py-1.5 text-xs rounded-button',
            lg: 'h-auto px-8 py-3 text-base rounded-button', 
            icon: 'h-10 w-10 rounded-button',
          },
        },
        defaultVariants: {
          variant: 'default',
          size: 'default',
        },
      }
    );

    const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
      const Comp = asChild ? Slot : 'button';
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }), 'btn')} 
          ref={ref}
          {...props}
        />
      );
    });
    Button.displayName = 'Button';

    export { Button, buttonVariants };