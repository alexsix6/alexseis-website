/**
 * Barra de progreso del cuestionario
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { INNATE_COLORS } from '@/lib/intake-constants';

interface IntakeProgressProps {
  current: number;
  total: number;
}

const IntakeProgress: React.FC<IntakeProgressProps> = ({ current, total }) => {
  const { t } = useTranslation('intake');
  const percentage = (current / total) * 100;

  return (
    <div className="flex items-center gap-3">
      {/* Texto de progreso */}
      <span className="text-sm" style={{ color: INNATE_COLORS.textSecondary }}>
        {t('progress.template', { current, total })}
      </span>

      {/* Barra de progreso */}
      <div
        className="w-32 h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: INNATE_COLORS.cyan }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default IntakeProgress;
