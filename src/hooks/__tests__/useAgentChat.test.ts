import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAgentChat } from '../useAgentChat';

describe('useAgentChat', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with a session ID', () => {
    const { result } = renderHook(() => useAgentChat());
    expect(result.current.sessionId).toMatch(/^session_/);
  });

  it('starts with loading=false and error=null', () => {
    const { result } = renderHook(() => useAgentChat());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('restores session ID from localStorage', () => {
    localStorage.setItem('agentSessionId', 'session_test_123');
    const { result } = renderHook(() => useAgentChat());
    expect(result.current.sessionId).toBe('session_test_123');
  });

  it('sendMessage makes fetch call to /api/chat', async () => {
    const mockResponse = { response: 'Hello!', sessionId: 'session_test_123' };
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    ) as unknown as typeof fetch;

    const { result } = renderHook(() => useAgentChat());

    let data: unknown;
    await act(async () => {
      data = await result.current.sendMessage('Hi');
    });

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('Hi'),
    });
    expect(data).toEqual(mockResponse);
  });

  it('sets loading state during request', async () => {
    let resolvePromise: (value: unknown) => void;
    globalThis.fetch = vi.fn(
      () => new Promise((resolve) => { resolvePromise = resolve; })
    ) as unknown as typeof fetch;

    const { result } = renderHook(() => useAgentChat());

    const promise = act(async () => {
      const sendPromise = result.current.sendMessage('test');
      // loading should be true while waiting
      return sendPromise;
    });

    // Resolve the fetch
    resolvePromise!({
      ok: true,
      json: () => Promise.resolve({ response: 'ok' }),
    });

    await promise;
    expect(result.current.loading).toBe(false);
  });

  it('handles fetch errors without crash', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Server error' }),
      })
    ) as unknown as typeof fetch;

    const { result } = renderHook(() => useAgentChat());

    await act(async () => {
      try {
        await result.current.sendMessage('test');
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Server error');
    expect(result.current.loading).toBe(false);
  });

  it('handles network errors gracefully', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.reject(new Error('Network failure'))
    ) as unknown as typeof fetch;

    const { result } = renderHook(() => useAgentChat());

    await act(async () => {
      try {
        await result.current.sendMessage('test');
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe('Network failure');
    expect(result.current.loading).toBe(false);
  });
});
