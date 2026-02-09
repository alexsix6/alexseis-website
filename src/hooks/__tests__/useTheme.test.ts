import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Reset DOM
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('initializes with light theme by default', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(result.current.isLight).toBe(true);
    expect(result.current.isDark).toBe(false);
  });

  it('restores theme from localStorage', () => {
    localStorage.setItem('alexseis-theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
  });

  it('toggles from light to dark', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(localStorage.getItem('alexseis-theme')).toBe('dark');
  });

  it('toggles from dark to light', () => {
    localStorage.setItem('alexseis-theme', 'dark');
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('light');
    expect(result.current.isLight).toBe(true);
  });

  it('persists theme in localStorage on toggle', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.toggleTheme();
    });
    expect(localStorage.getItem('alexseis-theme')).toBe('dark');
    act(() => {
      result.current.toggleTheme();
    });
    expect(localStorage.getItem('alexseis-theme')).toBe('light');
  });

  it('sets specific theme', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.setTheme('dark');
    });
    expect(result.current.theme).toBe('dark');
    expect(localStorage.getItem('alexseis-theme')).toBe('dark');
  });

  it('applies dark class to html element when dark', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.toggleTheme();
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class when switching to light', () => {
    localStorage.setItem('alexseis-theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    act(() => {
      result.current.toggleTheme();
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('dispatches themeChange custom event on toggle', () => {
    const listener = vi.fn();
    window.addEventListener('themeChange', listener);

    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.toggleTheme();
    });

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener('themeChange', listener);
  });

  it('detects system preference for dark mode', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(result.current.systemPrefersDark).toBe(true);
  });

  it('finishes loading after initialization', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.isLoading).toBe(false);
  });
});
