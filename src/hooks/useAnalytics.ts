/**
 * useAnalytics - Centralized GA4 analytics tracking hook
 * FASE 3: Lead Generation Infrastructure
 *
 * Events tracked:
 * - page_view: automatic on route change
 * - form_start: user begins filling a form
 * - form_submit: form successfully submitted
 * - cta_click: CTA button clicked
 * - chat_open: Agent3D chat opened
 * - chat_message: message sent in chat
 * - email_signup: newsletter subscription
 * - lead_generated: conversion event (contact/intake/email)
 */
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// GA4 Measurement ID - replace with your actual ID
const GA_MEASUREMENT_ID: string = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX';

/**
 * Safe wrapper for gtag calls
 * Won't throw if gtag hasn't loaded yet
 */
function gtagWrapper(...args: unknown[]): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
}

export interface TrackEventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track a custom event in GA4
 */
function trackEvent(eventName: string, params: TrackEventParams = {}): void {
  gtagWrapper('event', eventName, {
    ...params,
    send_to: GA_MEASUREMENT_ID,
  });
}

export interface UseAnalyticsReturn {
  trackPageView: (pagePath?: string, pageTitle?: string) => void;
  trackFormStart: (formName: string) => void;
  trackFormSubmit: (formName: string, formData?: TrackEventParams) => void;
  trackCTAClick: (ctaName: string, ctaLocation?: string) => void;
  trackChatOpen: () => void;
  trackChatMessage: (messageType?: string) => void;
  trackEmailSignup: (source: string) => void;
}

/**
 * Central analytics hook
 */
export function useAnalytics(): UseAnalyticsReturn {
  const location = useLocation();

  // Track page views (call this in a useEffect with location dependency)
  const trackPageView = useCallback((pagePath?: string, pageTitle?: string): void => {
    trackEvent('page_view', {
      page_path: pagePath || location.pathname,
      page_title: pageTitle || document.title,
      page_location: window.location.href,
    });
  }, [location.pathname]);

  // Track form interactions
  const trackFormStart = useCallback((formName: string): void => {
    trackEvent('form_start', {
      form_name: formName,
      page_path: location.pathname,
    });
  }, [location.pathname]);

  const trackFormSubmit = useCallback((formName: string, formData: TrackEventParams = {}): void => {
    trackEvent('form_submit', {
      form_name: formName,
      page_path: location.pathname,
      ...formData,
    });
    // Also fire as a conversion event
    trackEvent('generate_lead', {
      currency: 'USD',
      value: formName === 'intake' ? 50 : formName === 'contact' ? 25 : 10,
      lead_source: formName,
    });
  }, [location.pathname]);

  // Track CTA clicks
  const trackCTAClick = useCallback((ctaName: string, ctaLocation?: string): void => {
    trackEvent('cta_click', {
      cta_name: ctaName,
      cta_location: ctaLocation || location.pathname,
    });
  }, [location.pathname]);

  // Track chat interactions
  const trackChatOpen = useCallback((): void => {
    trackEvent('chat_open', {
      page_path: location.pathname,
    });
  }, [location.pathname]);

  const trackChatMessage = useCallback((messageType = 'user'): void => {
    trackEvent('chat_message', {
      message_type: messageType,
      page_path: location.pathname,
    });
  }, [location.pathname]);

  // Track email signups
  const trackEmailSignup = useCallback((source: string): void => {
    trackEvent('email_signup', {
      signup_source: source,
      page_path: location.pathname,
    });
    // Fire as conversion
    trackEvent('generate_lead', {
      currency: 'USD',
      value: 15,
      lead_source: 'email_signup',
      signup_location: source,
    });
  }, [location.pathname]);

  return {
    trackPageView,
    trackFormStart,
    trackFormSubmit,
    trackCTAClick,
    trackChatOpen,
    trackChatMessage,
    trackEmailSignup,
  };
}

// Export standalone trackEvent for use outside React components
export { trackEvent, GA_MEASUREMENT_ID };
