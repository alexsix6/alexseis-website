/**
 * INNATE.data - Intelligent Client Intake Page
 * v3.0: Cuestionario conversacional con agente IA
 * v4.5: i18n support - components use useTranslation('intake') directly
 */
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useIntakeForm, INTAKE_STAGES } from '@/hooks/useIntakeForm';
import type { UseIntakeFormReturn } from '@/hooks/useIntakeForm';
import { INNATE_COLORS, VIDEO_CONFIG } from '@/lib/intake-constants';
import { trackEvent } from '@/hooks/useAnalytics';
import { usePageMeta } from '@/hooks/usePageMeta';

// Componentes internos
import IntakeLanding from '@/components/intake/IntakeLanding';
import IntakeQuestion from '@/components/intake/IntakeQuestion';
import IntakeUploads from '@/components/intake/IntakeUploads';
import IntakeAgent from '@/components/intake/IntakeAgent';
import IntakeConfirmation from '@/components/intake/IntakeConfirmation';
import IntakeProgress from '@/components/intake/IntakeProgress';

// Variantes de animacion para transiciones suaves
const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const IntakePage: React.FC = () => {
  const { t } = useTranslation('intake');
  const intake: UseIntakeFormReturn = useIntakeForm();
  const hasTrackedStart = useRef<boolean>(false);

  usePageMeta({ titleKey: 'meta.title', descriptionKey: 'meta.description', ns: 'intake', path: '/intake' });

  // Track intake stage changes
  useEffect(() => {
    if (intake.stage === INTAKE_STAGES.QUESTIONS && !hasTrackedStart.current) {
      trackEvent('form_start', { form_name: 'intake', page_path: '/intake' });
      hasTrackedStart.current = true;
    }
    if (intake.stage === INTAKE_STAGES.CONFIRMATION) {
      trackEvent('form_submit', { form_name: 'intake', page_path: '/intake' });
      trackEvent('generate_lead', {
        currency: 'USD',
        value: 50,
        lead_source: 'intake',
      });
    }
  }, [intake.stage]);

  // v3.0: Handler for completing from agent stage
  const handleAgentComplete = async (): Promise<void> => {
    await intake.submitForm();
    intake.goToConfirmationFromAgent();
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: INNATE_COLORS.background,
        color: INNATE_COLORS.textPrimary,
      }}
    >
      {/* Header minimalista */}
      <header className="py-4 px-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span
            className="text-xl font-bold"
            style={{ color: INNATE_COLORS.cyan }}
          >
            INNATE
          </span>
          <span className="text-xl font-light text-white/80">.data</span>
        </motion.div>

        {/* Mostrar progreso solo durante las preguntas */}
        {intake.stage === INTAKE_STAGES.QUESTIONS && (
          <IntakeProgress
            current={intake.progress.current}
            total={intake.progress.total}
          />
        )}
      </header>

      {/* Contenido principal */}
      <main className="flex-grow flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {intake.stage === INTAKE_STAGES.LANDING && (
            <motion.div
              key="landing"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl"
            >
              <IntakeLanding
                onStart={intake.startQuestionnaire}
                videoConfig={VIDEO_CONFIG}
              />
            </motion.div>
          )}

          {intake.stage === INTAKE_STAGES.QUESTIONS && (
            <motion.div
              key={`question-${intake.currentQuestionIndex}`}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <IntakeQuestion
                question={intake.currentQuestion}
                answer={intake.answers[intake.currentQuestion?.id ?? ''] as string | undefined}
                followUpAnswer={
                  intake.currentQuestion?.followUp
                    ? intake.answers[intake.currentQuestion.followUp.question.id] as string | undefined
                    : undefined
                }
                onAnswer={intake.answerAndNext}
                onFollowUpAnswer={intake.setAnswer}
                onBack={intake.currentQuestionIndex > 0 ? intake.goToPreviousQuestion : undefined}
              />
            </motion.div>
          )}

          {intake.stage === INTAKE_STAGES.UPLOADS && (
            <motion.div
              key="uploads"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl"
            >
              <IntakeUploads
                uploadedFiles={intake.uploadedFiles}
                audioRecording={intake.audioRecording}
                onAddFile={intake.addFile}
                onRemoveFile={intake.removeFile}
                onSaveAudio={intake.saveAudioRecording}
                onSubmit={intake.goToAgent}
                onSkip={intake.goToAgent}
                onBack={intake.goToPreviousQuestion}
                isSubmitting={intake.isSubmitting || intake.isTranscribing}
                error={intake.submitError}
                isTranscribing={intake.isTranscribing}
              />
            </motion.div>
          )}

          {/* v3.0: Agent stage */}
          {intake.stage === INTAKE_STAGES.AGENT && (
            <motion.div
              key="agent"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl"
            >
              <IntakeAgent
                agentStatus={intake.agentStatus}
                currentAgentQuestion={intake.currentAgentQuestion}
                agentFollowUps={intake.agentFollowUps}
                agentIterations={intake.agentIterations}
                agentClosingMessage={intake.agentClosingMessage}
                onAnswer={intake.answerAgentQuestion}
                onSkip={intake.skipAgentQuestion}
                onComplete={handleAgentComplete}
                isSubmitting={intake.isSubmitting}
              />
            </motion.div>
          )}

          {intake.stage === INTAKE_STAGES.CONFIRMATION && (
            <motion.div
              key="confirmation"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl"
            >
              <IntakeConfirmation
                summary={intake.summary}
                sessionId={intake.sessionId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer minimalista */}
      <footer className="py-4 px-6 text-center">
        <p className="text-sm" style={{ color: INNATE_COLORS.textMuted }}>
          {t('footer.security')}
        </p>
      </footer>
    </div>
  );
};

export default IntakePage;
