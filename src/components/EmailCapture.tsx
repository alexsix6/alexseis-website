/**
 * EmailCapture - Newsletter/Lead Magnet component
 * FASE 3: Lead Generation Infrastructure
 */
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle, X, Zap } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

type EmailCaptureStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface EmailCaptureProps {
  variant?: 'inline' | 'banner';
  onClose?: () => void;
}

const EmailCapture: React.FC<EmailCaptureProps> = ({ variant = 'inline', onClose }) => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<EmailCaptureStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { trackEmailSignup, trackFormStart } = useAnalytics();
  const hasTrackedStart = useRef(false);
  const { t } = useTranslation();

  const handleFocus = (): void => {
    if (!hasTrackedStart.current) {
      trackFormStart('email_capture');
      hasTrackedStart.current = true;
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Honeypot check (bot trap)
    if (honeypot) return;

    // Basic email validation
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg(t('email_capture.error_invalid'));
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Newsletter Subscriber',
          email: email.trim(),
          company: '',
          interest: 'newsletter',
          message: 'Suscripción newsletter - Lead magnet: Guía RAG Enterprise',
          _hp_website: honeypot,
        }),
      });

      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error || 'Error al suscribirse');
      }

      setStatus('success');
      trackEmailSignup(variant === 'inline' ? 'footer' : 'popup');
      setEmail('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar. Intenta de nuevo.';
      setErrorMsg(errorMessage);
      setStatus('error');
    }
  };

  // Success state
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-3 p-4 rounded-xl ${
          variant === 'inline'
            ? 'bg-green-500/10 border border-green-500/30'
            : 'bg-green-500/10 border border-green-500/30 max-w-md mx-auto'
        }`}
      >
        <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
        <div>
          <p className="text-green-300 font-medium text-sm">
            {t('email_capture.success_title')}
          </p>
          <p className="text-green-400/60 text-xs mt-0.5">
            {t('email_capture.success_subtitle')}
          </p>
        </div>
      </motion.div>
    );
  }

  // Inline variant (for footer / homepage sections)
  if (variant === 'inline') {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-5 w-5 text-accent" />
          <h3 className="text-base font-semibold" style={{ color: 'var(--current-text)' }}>
            {t('email_capture.title')}
          </h3>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--current-text-muted)' }}>
          {t('email_capture.subtitle')}
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--current-text-muted)' }} />
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleFocus}
              placeholder={t('email_capture.placeholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-accent/50"
              style={{
                backgroundColor: 'var(--current-surface)',
                borderColor: errorMsg ? '#ef4444' : 'var(--current-border)',
                color: 'var(--current-text)',
              }}
              disabled={status === 'submitting'}
            />
          </div>
          <motion.button
            type="submit"
            disabled={status === 'submitting'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-300 flex items-center gap-2 disabled:opacity-60"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {status === 'submitting' ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {t('cta.download')}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>

          {/* Honeypot */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}>
            <input type="text" name="_hp_capture" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>
        </form>
        {errorMsg && (
          <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
        )}
      </div>
    );
  }

  // Banner variant (sticky bottom / dismissible)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-40 p-4 border-t backdrop-blur-xl"
        style={{
          backgroundColor: 'var(--current-glass)',
          borderTopColor: 'var(--current-border)',
        }}
      >
        <div className="container-max flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.15)' }}
            >
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--current-text)' }}>
                {t('email_capture.title')}
              </p>
              <p className="text-xs" style={{ color: 'var(--current-text-muted)' }}>
                {t('email_capture.banner_subtitle')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleFocus}
              placeholder={t('email_capture.placeholder')}
              className="flex-1 sm:w-56 px-4 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-accent/50"
              style={{
                backgroundColor: 'var(--current-surface)',
                borderColor: 'var(--current-border)',
                color: 'var(--current-text)',
              }}
              disabled={status === 'submitting'}
            />
            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 disabled:opacity-60"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {status === 'submitting' ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>{t('cta.download')} <ArrowRight className="h-4 w-4" /></>
              )}
            </motion.button>
          </form>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label={t('cta.close')}
            >
              <X className="h-5 w-5" style={{ color: 'var(--current-text-muted)' }} />
            </button>
          )}
        </div>
        {errorMsg && (
          <p className="text-red-400 text-xs mt-2 text-center">{errorMsg}</p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailCapture;
