import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useAnalytics } from '../useAnalytics';

// Wrapper with router context
function createWrapper(initialPath = '/') {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(MemoryRouter, { initialEntries: [initialPath] }, children);
  };
}

describe('useAnalytics', () => {
  beforeEach(() => {
    // Mock gtag globally
    (window as unknown as Record<string, unknown>).gtag = vi.fn();
  });

  it('returns all tracking functions', () => {
    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(),
    });

    expect(result.current.trackPageView).toBeDefined();
    expect(result.current.trackFormStart).toBeDefined();
    expect(result.current.trackFormSubmit).toBeDefined();
    expect(result.current.trackCTAClick).toBeDefined();
    expect(result.current.trackChatOpen).toBeDefined();
    expect(result.current.trackChatMessage).toBeDefined();
    expect(result.current.trackEmailSignup).toBeDefined();
  });

  it('trackPageView calls gtag with correct params', () => {
    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper('/services'),
    });

    result.current.trackPageView('/services', 'Services Page');

    expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
      page_path: '/services',
      page_title: 'Services Page',
    }));
  });

  it('trackFormStart fires event with form name', () => {
    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(),
    });

    result.current.trackFormStart('contact');

    expect(window.gtag).toHaveBeenCalledWith('event', 'form_start', expect.objectContaining({
      form_name: 'contact',
    }));
  });

  it('trackFormSubmit fires form_submit and generate_lead events', () => {
    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(),
    });

    result.current.trackFormSubmit('contact', { email: 'test@test.com' });

    // Should fire form_submit
    expect(window.gtag).toHaveBeenCalledWith('event', 'form_submit', expect.objectContaining({
      form_name: 'contact',
    }));
    // Should also fire generate_lead conversion
    expect(window.gtag).toHaveBeenCalledWith('event', 'generate_lead', expect.objectContaining({
      lead_source: 'contact',
      value: 25,
    }));
  });

  it('trackCTAClick sends cta_click event', () => {
    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(),
    });

    result.current.trackCTAClick('header_cta', 'header');

    expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', expect.objectContaining({
      cta_name: 'header_cta',
      cta_location: 'header',
    }));
  });

  it('trackEmailSignup fires email_signup and generate_lead', () => {
    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(),
    });

    result.current.trackEmailSignup('footer');

    expect(window.gtag).toHaveBeenCalledWith('event', 'email_signup', expect.objectContaining({
      signup_source: 'footer',
    }));
    expect(window.gtag).toHaveBeenCalledWith('event', 'generate_lead', expect.objectContaining({
      lead_source: 'email_signup',
      value: 15,
    }));
  });

  it('works without window.gtag (graceful degradation)', () => {
    // Remove gtag
    delete (window as unknown as Record<string, unknown>).gtag;

    const { result } = renderHook(() => useAnalytics(), {
      wrapper: createWrapper(),
    });

    // Should not throw
    expect(() => {
      result.current.trackPageView();
      result.current.trackFormStart('test');
      result.current.trackCTAClick('test');
      result.current.trackChatOpen();
      result.current.trackChatMessage();
      result.current.trackEmailSignup('test');
    }).not.toThrow();
  });
});
