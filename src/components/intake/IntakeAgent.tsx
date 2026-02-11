/**
 * INNATE.data Intake v3.0 - Intelligent Agent UI Component
 * Displays the AI agent evaluation and clarification interface
 * v4.5: i18n support
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bot, Send, ArrowRight, Loader2, MessageCircle, SkipForward, Check, Circle, AlertCircle } from 'lucide-react';
import { INNATE_COLORS } from '@/lib/intake-constants';
import type { AgentFollowUp, AgentStatusType, ProcessingStep } from '@/types';

// ===== Sub-component props =====

// Animated typing indicator
const TypingIndicator: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-2"
  >
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: INNATE_COLORS.cyan }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  </motion.div>
);

interface AgentAvatarProps {
  size?: 'large' | 'small';
}

// Agent avatar component
const AgentAvatar: React.FC<AgentAvatarProps> = ({ size = 'large' }) => {
  const sizeClasses = size === 'large' ? 'w-20 h-20' : 'w-12 h-12';
  const iconSize = size === 'large' ? 'w-10 h-10' : 'w-6 h-6';

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={`${sizeClasses} rounded-full flex items-center justify-center`}
      style={{ backgroundColor: 'rgba(0, 217, 255, 0.1)' }}
    >
      <Bot className={iconSize} style={{ color: INNATE_COLORS.cyan }} />
    </motion.div>
  );
};

interface ChatBubbleProps {
  message: string;
  isAgent?: boolean;
  delay?: number;
}

// Chat bubble component
const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isAgent = true, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
    className={`flex gap-3 ${isAgent ? '' : 'flex-row-reverse'}`}
  >
    {isAgent && <AgentAvatar size="small" />}
    <div
      className="max-w-md p-4 rounded-2xl"
      style={{
        backgroundColor: isAgent ? 'rgba(0, 217, 255, 0.1)' : 'rgba(255,255,255,0.05)',
        borderColor: isAgent ? INNATE_COLORS.cyan + '30' : 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      }}
    >
      <p style={{ color: INNATE_COLORS.textPrimary }}>{message}</p>
    </div>
    {!isAgent && (
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
      >
        <MessageCircle className="w-6 h-6" style={{ color: INNATE_COLORS.textMuted }} />
      </div>
    )}
  </motion.div>
);

// v3.1: Processing checklist with animated checkmarks
const ProcessingChecklist: React.FC<{ steps: ProcessingStep[] }> = ({ steps }) => {
  if (steps.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-sm mx-auto space-y-3"
    >
      {steps.map((step, i) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3"
        >
          {/* Status icon */}
          {step.status === 'done' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: INNATE_COLORS.green }}
            >
              <Check className="w-4 h-4" style={{ color: INNATE_COLORS.background }} />
            </motion.div>
          )}
          {step.status === 'processing' && (
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              <Loader2
                className="w-5 h-5 animate-spin"
                style={{ color: INNATE_COLORS.cyan }}
              />
            </div>
          )}
          {step.status === 'pending' && (
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              <Circle
                className="w-5 h-5"
                style={{ color: 'rgba(255,255,255,0.2)' }}
              />
            </div>
          )}
          {step.status === 'error' && (
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              <AlertCircle
                className="w-5 h-5"
                style={{ color: INNATE_COLORS.warning }}
              />
            </div>
          )}

          {/* Label */}
          <span
            className="text-sm"
            style={{
              color: step.status === 'done'
                ? INNATE_COLORS.green
                : step.status === 'processing'
                  ? INNATE_COLORS.cyan
                  : step.status === 'error'
                    ? INNATE_COLORS.warning
                    : INNATE_COLORS.textMuted,
            }}
          >
            {step.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

// ===== Main component =====

interface IntakeAgentProps {
  agentStatus: AgentStatusType;
  currentAgentQuestion: string | null;
  agentFollowUps: AgentFollowUp[];
  agentIterations: number;
  agentClosingMessage: string | null;
  processingSteps: ProcessingStep[];
  onAnswer: (response: string) => void;
  onSkip: () => void;
  onComplete: () => void;
  isSubmitting: boolean;
}

const IntakeAgent: React.FC<IntakeAgentProps> = ({
  agentStatus,
  currentAgentQuestion,
  agentFollowUps,
  agentIterations,
  agentClosingMessage,
  processingSteps,
  onAnswer,
  onSkip,
  onComplete,
  isSubmitting,
}) => {
  const { t } = useTranslation('intake');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when asking for response
  useEffect(() => {
    if (agentStatus === 'asking' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [agentStatus]);

  const handleSubmit = (): void => {
    if (inputValue.trim()) {
      onAnswer(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: INNATE_COLORS.textPrimary }}
        >
          {t('agent.title')}
        </h2>
        <p style={{ color: INNATE_COLORS.textMuted }}>
          {t('agent.subtitle')}
        </p>
      </motion.div>

      {/* Chat container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="min-h-[300px] rounded-2xl border p-6 space-y-6"
        style={{
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderColor: 'rgba(255,255,255,0.1)',
        }}
      >
        {/* Processing & Analyzing states */}
        <AnimatePresence mode="wait">
          {(agentStatus === 'processing' || agentStatus === 'analyzing') && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8 space-y-6"
            >
              <AgentAvatar size="large" />
              <ProcessingChecklist steps={processingSteps} />
              {agentStatus === 'analyzing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3 pt-2"
                >
                  <TypingIndicator />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Previous interactions + current question */}
          {(agentStatus === 'asking' || agentStatus === 'complete') && (
            <motion.div
              key="conversation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Show previous follow-ups */}
              {agentFollowUps.map((fu, index) => (
                <React.Fragment key={index}>
                  <ChatBubble message={fu.question} isAgent={true} delay={0} />
                  <ChatBubble message={fu.answer} isAgent={false} delay={0.1} />
                </React.Fragment>
              ))}

              {/* Current question (if asking) */}
              {agentStatus === 'asking' && currentAgentQuestion && (
                <ChatBubble
                  message={currentAgentQuestion}
                  isAgent={true}
                  delay={agentFollowUps.length > 0 ? 0 : 0.2}
                />
              )}

              {/* Closing message (if complete) */}
              {agentStatus === 'complete' && agentClosingMessage && (
                <ChatBubble
                  message={agentClosingMessage}
                  isAgent={true}
                  delay={0.2}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input area (only when asking) */}
        {agentStatus === 'asking' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-4 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('agent.input_placeholder')}
                className="flex-grow p-4 rounded-xl border transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderColor: inputValue ? INNATE_COLORS.cyan : 'rgba(255,255,255,0.1)',
                  color: INNATE_COLORS.textPrimary,
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className="p-4 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                style={{
                  backgroundColor: inputValue.trim() ? INNATE_COLORS.cyan : 'rgba(255,255,255,0.1)',
                  color: inputValue.trim() ? INNATE_COLORS.background : INNATE_COLORS.textMuted,
                }}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between pt-4"
      >
        {/* Skip button (only when asking) */}
        {agentStatus === 'asking' && (
          <button
            onClick={onSkip}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: INNATE_COLORS.textMuted }}
          >
            <SkipForward className="w-4 h-4" />
            {t('agent.skip_button')}
          </button>
        )}

        {agentStatus !== 'asking' && <div />}

        {/* Continue button (only when complete) */}
        {agentStatus === 'complete' && (
          <button
            onClick={onComplete}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: INNATE_COLORS.cyan,
              color: INNATE_COLORS.background,
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('buttons.continue')}...
              </>
            ) : (
              <>
                {t('buttons.continue')}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </motion.div>

      {/* Iteration indicator */}
      {agentIterations > 0 && agentStatus === 'asking' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm"
          style={{ color: INNATE_COLORS.textMuted }}
        >
          {t('agent.asking_title')} {agentIterations}/{AGENT_CONFIG.maxIterations}
        </motion.p>
      )}
    </div>
  );
};

export default IntakeAgent;
