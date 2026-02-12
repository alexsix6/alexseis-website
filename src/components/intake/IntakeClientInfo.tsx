/**
 * INNATE.data Intake - Client Identification Step
 * Required fields: name, email, company (before questionnaire)
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, User, Mail, Building2 } from 'lucide-react';
import { INNATE_COLORS } from '@/lib/intake-constants';
import type { ClientInfo } from '@/types';

interface IntakeClientInfoProps {
  clientInfo: ClientInfo;
  setClientInfo: React.Dispatch<React.SetStateAction<ClientInfo>>;
  onContinue: () => void;
}

const IntakeClientInfo: React.FC<IntakeClientInfoProps> = ({
  clientInfo,
  setClientInfo,
  onContinue,
}) => {
  const { t } = useTranslation('intake');
  const [errors, setErrors] = useState<Partial<Record<keyof ClientInfo, string>>>({});

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (field: keyof ClientInfo, value: string): void => {
    setClientInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (): void => {
    const newErrors: Partial<Record<keyof ClientInfo, string>> = {};

    if (!clientInfo.name.trim()) {
      newErrors.name = t('client_info.error_name');
    }
    if (!clientInfo.email.trim()) {
      newErrors.email = t('client_info.error_email');
    } else if (!validateEmail(clientInfo.email.trim())) {
      newErrors.email = t('client_info.error_email_invalid');
    }
    if (!clientInfo.company.trim()) {
      newErrors.company = t('client_info.error_company');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onContinue();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const fields: { key: keyof ClientInfo; icon: typeof User; type: string; }[] = [
    { key: 'name', icon: User, type: 'text' },
    { key: 'email', icon: Mail, type: 'email' },
    { key: 'company', icon: Building2, type: 'text' },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: INNATE_COLORS.textPrimary }}
        >
          {t('client_info.title')}
        </h2>
        <p style={{ color: INNATE_COLORS.textMuted }}>
          {t('client_info.subtitle')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-5 max-w-md mx-auto"
      >
        {fields.map(({ key, icon: Icon, type }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + index * 0.1 }}
          >
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: INNATE_COLORS.textSecondary }}
            >
              {t(`client_info.label_${key}`)}
            </label>
            <div className="relative">
              <Icon
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: errors[key] ? INNATE_COLORS.warning : INNATE_COLORS.textMuted }}
              />
              <input
                type={type}
                value={clientInfo[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t(`client_info.placeholder_${key}`)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderColor: errors[key]
                    ? INNATE_COLORS.warning
                    : clientInfo[key]
                      ? INNATE_COLORS.cyan
                      : 'rgba(255,255,255,0.1)',
                  color: INNATE_COLORS.textPrimary,
                }}
                autoFocus={index === 0}
              />
            </div>
            {errors[key] && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm mt-1"
                style={{ color: INNATE_COLORS.warning }}
              >
                {errors[key]}
              </motion.p>
            )}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center pt-4"
      >
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: INNATE_COLORS.cyan,
            color: INNATE_COLORS.background,
          }}
        >
          {t('buttons.continue')}
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};

export default IntakeClientInfo;
