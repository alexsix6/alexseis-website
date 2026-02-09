/**
 * PrivacyPage - GDPR/CCPA compliant privacy policy
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Database, Lock, Users, Cookie, Mail } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  controller: Shield,
  data_collected: Database,
  purpose: Lock,
  legal_basis: Lock,
  retention: Database,
  third_parties: Database,
  rights: Users,
  cookies_policy: Cookie,
  contact: Mail,
};

const PrivacyPage: React.FC = () => {
  const { t } = useTranslation('privacy');
  usePageMeta({ titleKey: 'meta.title', descriptionKey: 'meta.description', ns: 'privacy', path: '/privacy' });

  const sections = [
    'controller',
    'data_collected',
    'purpose',
    'legal_basis',
    'retention',
    'third_parties',
    'rights',
    'cookies_policy',
    'contact',
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 md:py-20"
    >
      <div className="container-max max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-accent" />
            <h1
              className="text-3xl md:text-4xl font-extrabold"
              style={{ color: 'var(--current-text)' }}
            >
              {t('title')}
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--current-text-muted)' }}>
            {t('last_updated')}: 2026-02-09
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((sectionKey) => {
            const Icon = sectionIcons[sectionKey] || Shield;

            return (
              <motion.section
                key={sectionKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl border p-6"
                style={{
                  backgroundColor: 'var(--current-surface)',
                  borderColor: 'var(--current-border)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="h-5 w-5 text-accent flex-shrink-0" />
                  <h2
                    className="text-xl font-bold"
                    style={{ color: 'var(--current-text)' }}
                  >
                    {t(`sections.${sectionKey}.title`)}
                  </h2>
                </div>

                {/* Content rendering based on section type */}
                {sectionKey === 'data_collected' && (
                  <ul
                    className="list-disc list-inside space-y-2 text-sm"
                    style={{ color: 'var(--current-text-secondary)' }}
                  >
                    <li>{t('sections.data_collected.analytics')}</li>
                    <li>{t('sections.data_collected.forms')}</li>
                    <li>{t('sections.data_collected.chat')}</li>
                    <li>{t('sections.data_collected.cookies')}</li>
                  </ul>
                )}

                {sectionKey === 'third_parties' && (
                  <ul
                    className="list-disc list-inside space-y-2 text-sm"
                    style={{ color: 'var(--current-text-secondary)' }}
                  >
                    <li>{t('sections.third_parties.ga4')}</li>
                    <li>{t('sections.third_parties.openai')}</li>
                    <li>{t('sections.third_parties.bigquery')}</li>
                    <li>{t('sections.third_parties.vercel')}</li>
                  </ul>
                )}

                {sectionKey === 'rights' && (
                  <>
                    <ul
                      className="list-disc list-inside space-y-2 text-sm mb-4"
                      style={{ color: 'var(--current-text-secondary)' }}
                    >
                      <li>{t('sections.rights.access')}</li>
                      <li>{t('sections.rights.rectification')}</li>
                      <li>{t('sections.rights.deletion')}</li>
                      <li>{t('sections.rights.portability')}</li>
                    </ul>
                    <p
                      className="text-sm"
                      style={{ color: 'var(--current-text-muted)' }}
                    >
                      {t('sections.rights.content')}
                    </p>
                  </>
                )}

                {/* Simple content sections */}
                {['controller', 'purpose', 'legal_basis', 'retention', 'cookies_policy', 'contact'].includes(sectionKey) && (
                  <p
                    className="text-sm"
                    style={{ color: 'var(--current-text-secondary)' }}
                  >
                    {t(`sections.${sectionKey}.content`)}
                  </p>
                )}
              </motion.section>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPage;
