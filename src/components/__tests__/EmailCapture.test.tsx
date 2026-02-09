import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import EmailCapture from '../EmailCapture';

// Mock useAnalytics
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEmailSignup: vi.fn(),
    trackFormStart: vi.fn(),
    trackPageView: vi.fn(),
    trackFormSubmit: vi.fn(),
    trackCTAClick: vi.fn(),
    trackChatOpen: vi.fn(),
    trackChatMessage: vi.fn(),
  }),
}));

function renderWithRouter(ui: React.ReactElement) {
  return render(
    <MemoryRouter>{ui}</MemoryRouter>
  );
}

// Since react-i18next is mocked globally, t() returns the key itself
// e.g., t('email_capture.placeholder') → 'email_capture.placeholder'
describe('EmailCapture', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders inline variant by default', () => {
    renderWithRouter(<EmailCapture />);
    expect(screen.getByPlaceholderText('email_capture.placeholder')).toBeInTheDocument();
    expect(screen.getByText('cta.download')).toBeInTheDocument();
  });

  it('renders inline variant with title', () => {
    renderWithRouter(<EmailCapture variant="inline" />);
    expect(screen.getByText('email_capture.title')).toBeInTheDocument();
  });

  it('renders banner variant', () => {
    renderWithRouter(<EmailCapture variant="banner" />);
    expect(screen.getByPlaceholderText('email_capture.placeholder')).toBeInTheDocument();
  });

  it('shows close button on banner variant when onClose provided', () => {
    const onClose = vi.fn();
    renderWithRouter(<EmailCapture variant="banner" onClose={onClose} />);
    const closeButton = screen.getByLabelText('cta.close');
    expect(closeButton).toBeInTheDocument();
  });

  it('validates invalid email', async () => {
    const user = userEvent.setup();
    renderWithRouter(<EmailCapture variant="inline" />);

    const input = screen.getByPlaceholderText('email_capture.placeholder');
    await user.type(input, 'not-an-email');

    // Submit the form directly since motion.button proxy may not bubble correctly
    const form = input.closest('form')!;
    fireEvent.submit(form);

    expect(screen.getByText('email_capture.error_invalid')).toBeInTheDocument();
  });

  it('validates empty email', async () => {
    const user = userEvent.setup();
    renderWithRouter(<EmailCapture variant="inline" />);

    const submitBtn = screen.getByText('cta.download');
    await user.click(submitBtn);

    expect(screen.getByText('email_capture.error_invalid')).toBeInTheDocument();
  });

  it('has honeypot field hidden from users', () => {
    const { container } = renderWithRouter(<EmailCapture variant="inline" />);
    const honeypotInput = container.querySelector('input[name="_hp_capture"]');
    expect(honeypotInput).toBeInTheDocument();
    // The honeypot container should be visually hidden
    const honeypotWrapper = honeypotInput?.closest('div[aria-hidden="true"]');
    expect(honeypotWrapper).toBeInTheDocument();
  });

  it('shows success state after successful submission', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as unknown as typeof fetch;

    const user = userEvent.setup();
    renderWithRouter(<EmailCapture variant="inline" />);

    const input = screen.getByPlaceholderText('email_capture.placeholder');
    const submitBtn = screen.getByText('cta.download');

    await user.type(input, 'test@example.com');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('email_capture.success_title')).toBeInTheDocument();
    });
  });

  it('shows error message on failed submission', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Rate limit exceeded' }),
      })
    ) as unknown as typeof fetch;

    const user = userEvent.setup();
    renderWithRouter(<EmailCapture variant="inline" />);

    const input = screen.getByPlaceholderText('email_capture.placeholder');
    const submitBtn = screen.getByText('cta.download');

    await user.type(input, 'test@example.com');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Rate limit exceeded')).toBeInTheDocument();
    });
  });

  it('calls fetch with correct payload on successful submission', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as unknown as typeof fetch;

    const user = userEvent.setup();
    renderWithRouter(<EmailCapture variant="inline" />);

    const input = screen.getByPlaceholderText('email_capture.placeholder');
    await user.type(input, 'valid@test.com');

    const submitBtn = screen.getByText('cta.download');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
        method: 'POST',
      }));
    });
  });
});
