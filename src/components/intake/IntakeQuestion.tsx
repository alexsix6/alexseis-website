/**
 * Componente de pregunta individual (estilo conversacional)
 * v3.0: Soporte para preguntas condicionales (follow-up)
 */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { INNATE_COLORS } from '@/lib/intake-constants';
import type { IntakeQuestion as IntakeQuestionType, IntakeOption } from '@/types';

// ===== Sub-component props =====

interface OptionButtonProps {
  option: IntakeOption;
  isSelected: boolean;
  onClick: () => void;
}

// Boton de opcion
const OptionButton: React.FC<OptionButtonProps> = ({ option, isSelected, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full p-4 rounded-xl text-left flex items-center gap-4 transition-all duration-200 border"
    style={{
      backgroundColor: isSelected ? 'rgba(0, 217, 255, 0.1)' : 'rgba(255,255,255,0.03)',
      borderColor: isSelected ? INNATE_COLORS.cyan : 'rgba(255,255,255,0.1)',
    }}
  >
    <span className="text-2xl">{option.icon}</span>
    <span className="flex-grow font-medium">{option.label}</span>
    {isSelected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-6 h-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: INNATE_COLORS.cyan }}
      >
        <Check className="w-4 h-4" style={{ color: INNATE_COLORS.background }} />
      </motion.div>
    )}
  </motion.button>
);

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
  autoFocus?: boolean;
}

// Input de texto
const TextInput: React.FC<TextInputProps> = ({ value, onChange, onSubmit, placeholder, hint, multiline, autoFocus = true }) => {
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault();
      if (value.trim()) onSubmit();
    }
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="space-y-2">
      <InputComponent
        ref={inputRef as React.RefObject<any>}
        type="text"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={multiline ? 4 : undefined}
        className="w-full p-4 rounded-xl text-lg border transition-all duration-200 resize-none"
        style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderColor: 'rgba(255,255,255,0.1)',
          color: INNATE_COLORS.textPrimary,
        }}
      />
      {hint && (
        <p className="text-sm" style={{ color: INNATE_COLORS.textMuted }}>
          {hint}
        </p>
      )}
    </div>
  );
};

interface FollowUpQuestionProps {
  followUpConfig: NonNullable<IntakeQuestionType['followUp']>;
  value: string | undefined;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
}

// v3.0: Componente de Follow-up Question
const FollowUpQuestion: React.FC<FollowUpQuestionProps> = ({ followUpConfig, value, onChange, onSubmit, onSkip }) => {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleSubmit = (): void => {
    onChange(localValue.trim());
    onSubmit();
  };

  const handleSkip = (): void => {
    onChange('');
    onSkip();
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 pt-4 border-t"
      style={{ borderColor: 'rgba(255,255,255,0.1)' }}
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-lg font-medium"
        style={{ color: INNATE_COLORS.cyan }}
      >
        {followUpConfig.question.question}
      </motion.p>

      <TextInput
        value={localValue}
        onChange={setLocalValue}
        onSubmit={handleSubmit}
        placeholder={followUpConfig.question.placeholder}
        hint={followUpConfig.question.hint}
        multiline={followUpConfig.question.type === 'textarea'}
        autoFocus={true}
      />

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleSkip}
          className="text-sm px-3 py-1 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: INNATE_COLORS.textMuted }}
        >
          Saltar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!localValue.trim()}
          className="flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
          style={{
            backgroundColor: localValue.trim() ? INNATE_COLORS.cyan : 'rgba(255,255,255,0.1)',
            color: localValue.trim() ? INNATE_COLORS.background : INNATE_COLORS.textMuted,
          }}
        >
          Continuar
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// ===== Main component =====

interface IntakeQuestionProps {
  question: IntakeQuestionType | null;
  answer: string | undefined;
  followUpAnswer?: string;
  onAnswer: (value: string, hasFollowUp?: boolean) => void;
  onFollowUpAnswer?: (questionId: string, value: string) => void;
  onBack?: () => void;
}

const IntakeQuestion: React.FC<IntakeQuestionProps> = ({
  question,
  answer,
  followUpAnswer,
  onAnswer,
  onFollowUpAnswer,
  onBack
}) => {
  const [localValue, setLocalValue] = useState(answer || '');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [pendingAnswer, setPendingAnswer] = useState<string | null>(null);

  // Actualizar localValue cuando cambia la pregunta
  useEffect(() => {
    setLocalValue(answer || '');
    setShowFollowUp(false);
    setPendingAnswer(null);
  }, [question?.id, answer]);

  // Check if we should show follow-up based on current answer
  useEffect(() => {
    if (question?.followUp && answer) {
      const shouldShow = question.followUp.condition.includes(answer);
      setShowFollowUp(shouldShow);
    }
  }, [question, answer]);

  if (!question) return null;

  const hasFollowUp = question.followUp && question.followUp.condition;

  const handleOptionClick = (value: string): void => {
    // Check if this triggers a follow-up
    if (hasFollowUp && question.followUp!.condition.includes(value)) {
      // Store the answer but don't advance yet
      setPendingAnswer(value);
      setShowFollowUp(true);
      // Still call onAnswer to update the main answer
      if (onFollowUpAnswer) {
        // Use a special handler that doesn't advance
        onAnswer(value, true); // true = has follow-up, don't advance
      } else {
        onAnswer(value);
      }
    } else {
      // No follow-up, proceed normally
      setShowFollowUp(false);
      setPendingAnswer(null);
      onAnswer(value);
    }
  };

  const handleFollowUpChange = (value: string): void => {
    if (onFollowUpAnswer) {
      onFollowUpAnswer(question.followUp!.question.id, value);
    }
  };

  const handleFollowUpSubmit = (): void => {
    // Advance to next question
    onAnswer(pendingAnswer || answer || '', false); // false = advance now
  };

  const handleFollowUpSkip = (): void => {
    // Clear follow-up answer and advance
    if (onFollowUpAnswer) {
      onFollowUpAnswer(question.followUp!.question.id, '');
    }
    onAnswer(pendingAnswer || answer || '', false);
  };

  const handleTextSubmit = (): void => {
    if (localValue.trim()) {
      onAnswer(localValue.trim());
    }
  };

  return (
    <div className="space-y-8">
      {/* Pregunta */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold"
        style={{ color: INNATE_COLORS.textPrimary }}
      >
        {question.question}
      </motion.h2>

      {/* Opciones o Input segun tipo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {question.type === 'options' && (
          <div className="space-y-3">
            {question.options!.map((option) => (
              <OptionButton
                key={option.value}
                option={option}
                isSelected={answer === option.value || pendingAnswer === option.value}
                onClick={() => handleOptionClick(option.value)}
              />
            ))}
          </div>
        )}

        {question.type === 'text' && (
          <TextInput
            value={localValue}
            onChange={setLocalValue}
            onSubmit={handleTextSubmit}
            placeholder={question.placeholder}
            hint={question.hint}
            multiline={false}
          />
        )}

        {question.type === 'textarea' && (
          <TextInput
            value={localValue}
            onChange={setLocalValue}
            onSubmit={handleTextSubmit}
            placeholder={question.placeholder}
            hint={question.hint}
            multiline={true}
          />
        )}
      </motion.div>

      {/* v3.0: Follow-up Question */}
      <AnimatePresence>
        {showFollowUp && hasFollowUp && (
          <FollowUpQuestion
            followUpConfig={question.followUp!}
            value={followUpAnswer}
            onChange={handleFollowUpChange}
            onSubmit={handleFollowUpSubmit}
            onSkip={handleFollowUpSkip}
          />
        )}
      </AnimatePresence>

      {/* Botones de navegacion (solo para text/textarea) */}
      {(question.type === 'text' || question.type === 'textarea') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between pt-4"
        >
          {/* Boton Atras */}
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: INNATE_COLORS.textSecondary }}
            >
              <ArrowLeft className="w-4 h-4" />
              Atras
            </button>
          ) : (
            <div />
          )}

          {/* Boton Continuar */}
          <button
            onClick={handleTextSubmit}
            disabled={!localValue.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
            style={{
              backgroundColor: localValue.trim() ? INNATE_COLORS.cyan : 'rgba(255,255,255,0.1)',
              color: localValue.trim() ? INNATE_COLORS.background : INNATE_COLORS.textMuted,
            }}
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Indicador de teclado para opciones (solo si no hay follow-up activo) */}
      {question.type === 'options' && !showFollowUp && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm"
          style={{ color: INNATE_COLORS.textMuted }}
        >
          Selecciona una opcion para continuar
        </motion.p>
      )}
    </div>
  );
};

export default IntakeQuestion;
