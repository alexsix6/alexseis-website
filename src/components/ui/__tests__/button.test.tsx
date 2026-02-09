import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Button } from '../button';

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn');
  });

  it('renders all variant styles', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Button variant={variant}>Test</Button>);
      const button = screen.getByRole('button', { name: /test/i });
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  it('renders all size styles', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;
    sizes.forEach((size) => {
      const { unmount } = render(<Button size={size}>Test</Button>);
      const button = screen.getByRole('button', { name: /test/i });
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    const button = screen.getByRole('button', { name: /test/i });
    expect(button).toHaveClass('custom-class');
  });

  it('passes disabled prop correctly', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it('renders as child element with asChild prop', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has displayName set', () => {
    expect(Button.displayName).toBe('Button');
  });
});
