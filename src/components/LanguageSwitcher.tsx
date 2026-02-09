import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'es';

  const toggleLanguage = () => {
    const newLang = currentLang === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className={`px-2 py-1 rounded-lg text-xs font-bold border transition-all duration-300 hover:scale-105 ${className}`}
      style={{
        borderColor: 'var(--current-border)',
        color: 'var(--current-text-secondary)',
        backgroundColor: 'transparent',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      title={currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      {currentLang === 'es' ? 'EN' : 'ES'}
    </motion.button>
  );
}
