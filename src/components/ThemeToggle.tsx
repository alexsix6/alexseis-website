import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sun, Moon, Loader2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export interface ThemeToggleMinimalProps {
  className?: string;
}

export function ThemeToggleMinimal({ className = '' }: ThemeToggleMinimalProps): JSX.Element {
  const { isDark, isLoading, toggleTheme } = useTheme();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className={`w-6 h-6 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        w-6 h-6 rounded-lg
        flex items-center justify-center
        bg-gray-100 hover:bg-gray-200
        dark:bg-gray-800 dark:hover:bg-gray-700
        border border-gray-200 dark:border-gray-600
        transition-all duration-300
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-purple-500
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? t('theme.toggle_light') : t('theme.toggle_dark')}
      title={isDark ? t('theme.toggle_light') : t('theme.toggle_dark')}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: 1
        }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-cyan-400" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
}

type ThemeToggleSize = 'sm' | 'default' | 'lg';

interface SizeConfig {
  button: string;
  circle: string;
  icons: string;
  text: string;
}

export interface ThemeToggleProps {
  size?: ThemeToggleSize;
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ size = 'default', showLabel = false, className = '' }: ThemeToggleProps): JSX.Element {
  const { isDark, isLoading, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const sizeConfig: Record<ThemeToggleSize, SizeConfig> = {
    sm: {
      button: 'w-12 h-6',
      circle: 'w-5 h-5',
      icons: 'w-3 h-3',
      text: 'text-xs'
    },
    default: {
      button: 'w-14 h-7',
      circle: 'w-6 h-6',
      icons: 'w-4 h-4',
      text: 'text-sm'
    },
    lg: {
      button: 'w-16 h-8',
      circle: 'w-7 h-7',
      icons: 'w-5 h-5',
      text: 'text-base'
    }
  };

  const config = sizeConfig[size] || sizeConfig.default;

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`${config.button} bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center`}>
          <Loader2 className={`${config.icons} animate-spin text-gray-400`} />
        </div>
        {showLabel && (
          <span className={`${config.text} text-gray-400`}>
            {t('theme.loading')}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <motion.button
        onClick={toggleTheme}
        className={`
          ${config.button}
          relative rounded-full p-1
          border-2 transition-all duration-300
          hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-800
          ${isDark
            ? 'bg-slate-800 border-cyan-400'
            : 'bg-slate-200 border-slate-300'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isDark ? t('theme.toggle_light') : t('theme.toggle_dark')}
        title={isDark ? t('theme.toggle_light') : t('theme.toggle_dark')}
      >
        <motion.div
          className={`
            ${config.circle}
            absolute rounded-full
            flex items-center justify-center
            border border-gray-300 dark:border-cyan-400
            ${isDark ? 'bg-slate-900' : 'bg-white'}
          `}
          animate={{
            x: isDark ? 26 : 2,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          <motion.div
            animate={{
              opacity: isDark ? 1 : 0,
              scale: isDark ? 1 : 0.5,
              rotate: isDark ? 0 : 180
            }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Moon className={`${config.icons} text-cyan-400`} />
          </motion.div>

          <motion.div
            animate={{
              opacity: isDark ? 0 : 1,
              scale: isDark ? 0.5 : 1,
              rotate: isDark ? 180 : 0
            }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Sun className={`${config.icons} text-yellow-500`} />
          </motion.div>
        </motion.div>

        <div className="flex items-center justify-between w-full h-full px-1.5">
          <Sun className={`${config.icons} text-yellow-400 opacity-30`} />
          <Moon className={`${config.icons} text-gray-300 opacity-30`} />
        </div>
      </motion.button>

      {showLabel && (
        <motion.span
          className={`
            ${config.text} font-medium
            text-gray-700 dark:text-gray-300
            transition-colors duration-300
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {isDark ? t('theme.dark_mode') : t('theme.light_mode')}
        </motion.span>
      )}
    </div>
  );
}
