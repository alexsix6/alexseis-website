import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// Mock analytics
const mockTrackFormStart = vi.fn();
const mockTrackFormSubmit = vi.fn();

vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackFormStart: mockTrackFormStart,
    trackFormSubmit: mockTrackFormSubmit,
    trackPageView: vi.fn(),
    trackCTAClick: vi.fn(),
    trackChatOpen: vi.fn(),
    trackChatMessage: vi.fn(),
    trackEmailSignup: vi.fn(),
  }),
}));

// Mock toast
const mockToast = vi.fn();
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock Spline
vi.mock('@splinetool/react-spline', () => ({
  default: () => React.createElement('div', { 'data-testid': 'spline-mock' }),
}));

// Mock framer-motion
vi.mock('framer-motion', () => {
  const motionPropsToFilter = new Set([
    'initial', 'animate', 'exit', 'variants', 'whileHover', 'whileTap',
    'transition', 'whileInView', 'viewport', 'layout', 'layoutId',
    'onAnimationComplete',
  ]);

  const createMotionProxy = () => new Proxy({}, {
    get: (_target, prop) => {
      return React.forwardRef(function MotionComponent(
        props: Record<string, unknown>,
        ref: React.Ref<unknown>
      ) {
        const htmlProps: Record<string, unknown> = {};
        const { children, ...rest } = props;
        for (const [key, value] of Object.entries(rest)) {
          if (!motionPropsToFilter.has(key)) {
            htmlProps[key] = value;
          }
        }
        return React.createElement(prop as string, { ...htmlProps, ref }, children as React.ReactNode);
      });
    },
  });

  return {
    motion: createMotionProxy(),
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useAnimation: () => ({ start: vi.fn(), set: vi.fn() }),
    useInView: () => true,
  };
});

// Import after mocks
const { default: ContactPage } = await import('../ContactPage');

function renderContactPage() {
  return render(
    <MemoryRouter initialEntries={['/contact']}>
      <ContactPage />
    </MemoryRouter>
  );
}

describe('ContactPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as unknown as typeof fetch;
  });

  it('renders the contact form with required fields', () => {
    renderContactPage();
    // i18n mock returns the key — placeholders use form.name_placeholder etc.
    expect(screen.getByPlaceholderText('form.name_placeholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('form.email_placeholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('form.message_placeholder')).toBeInTheDocument();
  });

  it('renders submit button with correct label', () => {
    renderContactPage();
    const submitBtn = screen.getByRole('button', { name: /form\.submit/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields on submit', async () => {
    renderContactPage();

    const form = screen.getByPlaceholderText('form.name_placeholder').closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('validation.name_required')).toBeInTheDocument();
    });
  });

  it('validates email format on form submission', async () => {
    const user = userEvent.setup();
    renderContactPage();

    await user.type(screen.getByPlaceholderText('form.name_placeholder'), 'Test User');
    await user.type(screen.getByPlaceholderText('form.email_placeholder'), 'invalid-email');
    await user.type(
      screen.getByPlaceholderText('form.message_placeholder'),
      'Necesito ayuda con implementación de IA enterprise completa'
    );

    const form = screen.getByPlaceholderText('form.name_placeholder').closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('validation.email_invalid')).toBeInTheDocument();
    });
  });

  it('fires trackFormStart when user interacts with form', async () => {
    const user = userEvent.setup();
    renderContactPage();

    await user.type(screen.getByPlaceholderText('form.name_placeholder'), 'A');

    await waitFor(() => {
      expect(mockTrackFormStart).toHaveBeenCalledWith('contact');
    });
  });
});
