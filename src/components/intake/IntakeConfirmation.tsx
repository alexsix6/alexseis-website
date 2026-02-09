/**
 * Pagina de confirmacion con resumen de respuestas
 */
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, ArrowRight, Calendar } from 'lucide-react';
import { INNATE_COLORS, VALUE_LABELS } from '@/lib/intake-constants';
import type { IntakeMessages } from '@/lib/intake-constants';
import type { IntakeSummaryItem } from '@/hooks/useIntakeForm';

// Obtener label legible para un valor
const getReadableValue = (questionId: string, value: string | boolean | null): string => {
  if (value === null || value === undefined) return 'No respondido';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (VALUE_LABELS[questionId] && VALUE_LABELS[questionId][value]) {
    return VALUE_LABELS[questionId][value];
  }
  return value;
};

interface IntakeConfirmationProps {
  summary: IntakeSummaryItem[];
  sessionId: string;
  messages: IntakeMessages['confirmation'];
}

const IntakeConfirmation: React.FC<IntakeConfirmationProps> = ({ summary, sessionId, messages }) => {
  return (
    <div className="space-y-8 text-center">
      {/* Icono de exito */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="flex justify-center"
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 255, 136, 0.1)' }}
        >
          <CheckCircle className="w-12 h-12" style={{ color: INNATE_COLORS.green }} />
        </div>
      </motion.div>

      {/* Titulo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: INNATE_COLORS.green }}>
          {messages.title}
        </h2>
        <p className="text-sm" style={{ color: INNATE_COLORS.textMuted }}>
          Sesion: {sessionId}
        </p>
      </motion.div>

      {/* Resumen de respuestas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-left rounded-xl border p-6 space-y-4"
        style={{
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderColor: 'rgba(255,255,255,0.1)',
        }}
      >
        <h3 className="font-semibold text-lg" style={{ color: INNATE_COLORS.textPrimary }}>
          {messages.summary}
        </h3>

        <div className="space-y-3">
          {summary.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="flex items-start gap-3"
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(0, 217, 255, 0.1)',
                  color: INNATE_COLORS.cyan,
                }}
              >
                {index + 1}
              </span>
              <div className="flex-grow">
                <p className="text-sm" style={{ color: INNATE_COLORS.textMuted }}>
                  {item.question.replace('?', '')}:
                </p>
                <p className="font-medium" style={{ color: INNATE_COLORS.textPrimary }}>
                  {getReadableValue(item.id, item.answer)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Proximo paso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl border p-6 text-left"
        style={{
          backgroundColor: 'rgba(0, 217, 255, 0.05)',
          borderColor: INNATE_COLORS.cyan + '30',
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(0, 217, 255, 0.1)' }}
          >
            <Calendar className="w-6 h-6" style={{ color: INNATE_COLORS.cyan }} />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1" style={{ color: INNATE_COLORS.cyan }}>
              {messages.nextStep}
            </h3>
            <p style={{ color: INNATE_COLORS.textSecondary }}>
              {messages.nextStepDescription}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Contacto */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="pt-4"
      >
        <p className="text-sm mb-2" style={{ color: INNATE_COLORS.textMuted }}>
          {messages.contact}
        </p>
        <a
          href={`mailto:${messages.email}`}
          className="inline-flex items-center gap-2 text-lg font-medium transition-colors hover:opacity-80"
          style={{ color: INNATE_COLORS.cyan }}
        >
          <Mail className="w-5 h-5" />
          {messages.email}
        </a>
      </motion.div>

      {/* Boton para volver al inicio */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: INNATE_COLORS.textSecondary,
          }}
        >
          Volver al inicio
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </div>
  );
};

export default IntakeConfirmation;
