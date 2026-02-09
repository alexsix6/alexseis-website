import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ThemeToggleMinimal, ThemeToggle } from '../ThemeToggle';
import type { UseThemeReturn } from '@/types';

// Mock useTheme hook
const mockToggleTheme = vi.fn();
let mockThemeState: UseThemeReturn = {
  theme: 'light',
  isDark: false,
  isLight: true,
  isLoading: false,
  toggleTheme: mockToggleTheme,
  setTheme: vi.fn(),
  systemPrefersDark: false,
};

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => mockThemeState,
}));

describe('ThemeToggleMinimal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockThemeState = {
      theme: 'light',
      isDark: false,
      isLight: true,
      isLoading: false,
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
      systemPrefersDark: false,
    };
  });

  it('renders toggle button', () => {
    render(<ThemeToggleMinimal />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('calls toggleTheme on click', async () => {
    const user = userEvent.setup();
    render(<ThemeToggleMinimal />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('shows correct aria-label for light mode', () => {
    render(<ThemeToggleMinimal />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'theme.toggle_dark');
  });

  it('shows correct aria-label for dark mode', () => {
    mockThemeState = { ...mockThemeState, isDark: true, isLight: false, theme: 'dark' as const };
    render(<ThemeToggleMinimal />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'theme.toggle_light');
  });

  it('shows loading spinner when isLoading', () => {
    mockThemeState = { ...mockThemeState, isLoading: true };
    render(<ThemeToggleMinimal />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ThemeToggleMinimal className="my-class" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('my-class');
  });
});

describe('ThemeToggle (full variant)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockThemeState = {
      theme: 'light',
      isDark: false,
      isLight: true,
      isLoading: false,
      toggleTheme: mockToggleTheme,
      setTheme: vi.fn(),
      systemPrefersDark: false,
    };
  });

  it('renders toggle button', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('shows label when showLabel=true', () => {
    render(<ThemeToggle showLabel />);
    expect(screen.getByText('theme.light_mode')).toBeInTheDocument();
  });

  it('shows Modo Oscuro label in dark mode', () => {
    mockThemeState = { ...mockThemeState, isDark: true, isLight: false, theme: 'dark' as const };
    render(<ThemeToggle showLabel />);
    expect(screen.getByText('theme.dark_mode')).toBeInTheDocument();
  });

  it('calls toggleTheme on click', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
