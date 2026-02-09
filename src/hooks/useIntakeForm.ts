/**
 * INNATE.data - Hook para el cuestionario inteligente
 * v3.0: Maneja estado, navegacion, follow-ups, transcripcion y agente IA
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { INTAKE_QUESTIONS, AGENT_CONFIG } from '@/lib/intake-constants';
import type {
  IntakeQuestion,
  IntakeProgress,
  AgentFollowUp,
  AgentStatusType,
  IntakeStageType,
  IntakeAnswers,
  ClientInfo,
} from '@/types';

// Generar ID de sesion unico
const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `intake_${timestamp}_${randomPart}`;
};

// Estados del formulario (v3.0: added AGENT stage)
export const INTAKE_STAGES: Record<string, IntakeStageType> = {
  LANDING: 'landing',
  QUESTIONS: 'questions',
  UPLOADS: 'uploads',
  AGENT: 'agent',
  CONFIRMATION: 'confirmation',
} as const;

// Summary item shape
export interface IntakeSummaryItem {
  id: string;
  question: string;
  answer: string | boolean | null;
  type: string;
  followUpAnswer?: string | boolean | null;
  followUpQuestion?: string;
}

// Agent call result
interface AgentCallResult {
  complete: boolean;
  message?: string;
  question?: string;
  error?: boolean;
}

export interface UseIntakeFormReturn {
  // Estado
  stage: IntakeStageType;
  currentQuestion: IntakeQuestion | null;
  currentQuestionIndex: number;
  answers: IntakeAnswers;
  progress: IntakeProgress;
  hasCurrentAnswer: boolean;
  uploadedFiles: File[];
  audioRecording: Blob | null;
  isSubmitting: boolean;
  submitError: string | null;
  sessionId: string;
  clientInfo: ClientInfo;
  summary: IntakeSummaryItem[];

  // v3.0: Audio transcription
  audioTranscription: string | null;
  isTranscribing: boolean;

  // v3.0: Agent state
  agentStatus: AgentStatusType;
  agentFollowUps: AgentFollowUp[];
  agentIterations: number;
  currentAgentQuestion: string | null;
  agentClosingMessage: string | null;

  // Acciones
  setAnswer: (questionId: string, value: string) => void;
  answerAndNext: (value: string, hasFollowUp?: boolean) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  startQuestionnaire: () => void;
  addFile: (file: File) => void;
  removeFile: (index: number) => void;
  saveAudioRecording: (audioBlob: Blob | null) => void;
  submitForm: () => Promise<boolean>;
  goToConfirmation: () => Promise<void>;
  setClientInfo: React.Dispatch<React.SetStateAction<ClientInfo>>;
  setStage: React.Dispatch<React.SetStateAction<IntakeStageType>>;

  // v3.0: New actions
  transcribeAudio: (audioBlob: Blob) => Promise<string | null>;
  goToAgent: () => Promise<void>;
  callAgent: (additionalContext?: string | null) => Promise<AgentCallResult>;
  answerAgentQuestion: (response: string) => Promise<void>;
  skipAgentQuestion: () => void;
  goToConfirmationFromAgent: () => void;
}

export function useIntakeForm(): UseIntakeFormReturn {
  // Estado principal
  const [stage, setStage] = useState<IntakeStageType>(INTAKE_STAGES.LANDING);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<IntakeAnswers>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [audioRecording, setAudioRecording] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sessionId] = useState(() => generateSessionId());
  const [startTime] = useState(() => new Date());

  // v3.0: Audio transcription state
  const [audioTranscription, setAudioTranscription] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // v3.0: Agent state
  const [agentStatus, setAgentStatus] = useState<AgentStatusType>('idle');
  const [agentFollowUps, setAgentFollowUps] = useState<AgentFollowUp[]>([]);
  const [agentIterations, setAgentIterations] = useState(0);
  const [currentAgentQuestion, setCurrentAgentQuestion] = useState<string | null>(null);
  const [agentClosingMessage, setAgentClosingMessage] = useState<string | null>(null);

  // Informacion del cliente (opcional)
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    email: '',
    company: '',
  });

  // Pregunta actual
  const currentQuestion = useMemo((): IntakeQuestion | null => {
    return INTAKE_QUESTIONS[currentQuestionIndex] || null;
  }, [currentQuestionIndex]);

  // Progreso
  const progress = useMemo((): IntakeProgress => {
    const total = INTAKE_QUESTIONS.length;
    const answered = Object.keys(answers).filter(key =>
      INTAKE_QUESTIONS.some(q => q.id === key)
    ).length;
    return {
      current: currentQuestionIndex + 1,
      total,
      answered,
      percentage: Math.round((answered / total) * 100),
    };
  }, [currentQuestionIndex, answers]);

  // Verificar si la pregunta actual tiene respuesta
  const hasCurrentAnswer = useMemo((): boolean => {
    if (!currentQuestion) return false;
    const answer = answers[currentQuestion.id];
    if (!answer) return false;
    if (typeof answer === 'string') return answer.trim().length > 0;
    return true;
  }, [currentQuestion, answers]);

  // Guardar respuesta (incluye follow-ups)
  const setAnswer = useCallback((questionId: string, value: string): void => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);

  // v3.0: Responder pregunta actual con soporte para follow-up
  const answerAndNext = useCallback((value: string, hasFollowUp = false): void => {
    if (!currentQuestion) return;

    setAnswer(currentQuestion.id, value);

    // Si tiene follow-up activo, no avanzar (esperar respuesta del follow-up)
    if (hasFollowUp) {
      return;
    }

    // Si hay mas preguntas, avanzar
    if (currentQuestionIndex < INTAKE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Ultima pregunta, ir a uploads
      setStage(INTAKE_STAGES.UPLOADS);
    }
  }, [currentQuestion, currentQuestionIndex, setAnswer]);

  // Navegacion
  const goToNextQuestion = useCallback((): void => {
    if (!hasCurrentAnswer) return;

    if (currentQuestionIndex < INTAKE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setStage(INTAKE_STAGES.UPLOADS);
    }
  }, [currentQuestionIndex, hasCurrentAnswer]);

  const goToPreviousQuestion = useCallback((): void => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (stage === INTAKE_STAGES.UPLOADS) {
      setStage(INTAKE_STAGES.QUESTIONS);
      setCurrentQuestionIndex(INTAKE_QUESTIONS.length - 1);
    }
  }, [currentQuestionIndex, stage]);

  // Iniciar cuestionario
  const startQuestionnaire = useCallback((): void => {
    setStage(INTAKE_STAGES.QUESTIONS);
    setCurrentQuestionIndex(0);
  }, []);

  // Agregar archivo
  const addFile = useCallback((file: File): void => {
    setUploadedFiles(prev => [...prev, file]);
  }, []);

  // Remover archivo
  const removeFile = useCallback((index: number): void => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Guardar grabacion de audio
  const saveAudioRecording = useCallback((audioBlob: Blob | null): void => {
    setAudioRecording(audioBlob);
  }, []);

  // v3.0: Transcribir audio usando Whisper API
  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string | null> => {
    if (!audioBlob) return null;

    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json() as { transcription: string };
      setAudioTranscription(data.transcription);
      return data.transcription;
    } catch (error) {
      console.error('Transcription error:', error);
      return null;
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  // v3.0: Llamar al agente para evaluacion
  const callAgent = useCallback(async (additionalContext: string | null = null): Promise<AgentCallResult> => {
    setAgentStatus('analyzing');

    try {
      const payload = {
        answers,
        audioTranscription,
        previousFollowUps: agentFollowUps,
        additionalContext,
      };

      const response = await fetch('/api/intake-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Agent evaluation failed');
      }

      const data = await response.json() as {
        status: 'complete' | 'needs_clarification';
        closing_message?: string;
        follow_up_question?: string;
      };

      if (data.status === 'complete') {
        setAgentStatus('complete');
        setAgentClosingMessage(data.closing_message || null);
        return { complete: true, message: data.closing_message };
      } else if (data.status === 'needs_clarification') {
        setAgentStatus('asking');
        setCurrentAgentQuestion(data.follow_up_question || null);
        return { complete: false, question: data.follow_up_question };
      }

      // Default to complete if unexpected response
      setAgentStatus('complete');
      return { complete: true };
    } catch (error) {
      console.error('Agent error:', error);
      // On error, mark as complete to not block the user
      setAgentStatus('complete');
      setAgentClosingMessage('Gracias por tu informacion. Estaremos en contacto pronto.');
      return { complete: true, error: true };
    }
  }, [answers, audioTranscription, agentFollowUps]);

  // v3.0: Responder a pregunta del agente
  const answerAgentQuestion = useCallback(async (response: string): Promise<void> => {
    const newIteration = agentIterations + 1;
    setAgentIterations(newIteration);

    // Guardar el follow-up
    const newFollowUp: AgentFollowUp = {
      question: currentAgentQuestion || '',
      answer: response,
    };
    setAgentFollowUps(prev => [...prev, newFollowUp]);

    // Si llegamos al maximo de iteraciones, terminar
    if (newIteration >= AGENT_CONFIG.maxIterations) {
      setAgentStatus('complete');
      setAgentClosingMessage('Gracias por toda la informacion adicional. Tenemos lo que necesitamos.');
      return;
    }

    // Llamar al agente de nuevo con la nueva respuesta
    await callAgent(response);
  }, [agentIterations, currentAgentQuestion, callAgent]);

  // v3.0: Saltar pregunta del agente
  const skipAgentQuestion = useCallback((): void => {
    setAgentStatus('complete');
    setAgentClosingMessage('Gracias por tu informacion. Estaremos en contacto pronto.');
  }, []);

  // v3.0: Ir de uploads a agent
  const goToAgent = useCallback(async (): Promise<void> => {
    // Primero transcribir audio si existe
    if (audioRecording && !audioTranscription) {
      await transcribeAudio(audioRecording);
    }

    setStage(INTAKE_STAGES.AGENT);
    // Iniciar evaluacion del agente
    await callAgent();
  }, [audioRecording, audioTranscription, transcribeAudio, callAgent]);

  // v3.0: Ir de agent a confirmation
  const goToConfirmationFromAgent = useCallback((): void => {
    setStage(INTAKE_STAGES.CONFIRMATION);
  }, []);

  // Calcular tiempo de completado
  const getCompletionTime = useCallback((): number => {
    const endTime = new Date();
    const diffMs = endTime.getTime() - startTime.getTime();
    return Math.round(diffMs / 1000);
  }, [startTime]);

  // Enviar formulario (v3.0: incluye nuevos campos)
  const submitForm = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const filesMetadata = uploadedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));

      // v3.0: Payload actualizado con nuevos campos
      const payload = {
        session_id: sessionId,
        answers: answers,
        client_info: clientInfo,
        completion_time_seconds: getCompletionTime(),
        started_at: startTime.toISOString(),
        completed_at: new Date().toISOString(),
        uploaded_files_metadata: filesMetadata.length > 0 ? filesMetadata : null,
        has_audio_recording: !!audioRecording,
        // v3.0 new fields
        audio_transcription: audioTranscription,
        agent_follow_ups: agentFollowUps.length > 0 ? agentFollowUps : null,
        agent_iterations: agentIterations,
      };

      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'Error al enviar el formulario');
      }

      setStage(INTAKE_STAGES.CONFIRMATION);
      return true;
    } catch (error) {
      console.error('Error submitting intake form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSubmitError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [sessionId, answers, clientInfo, uploadedFiles, audioRecording, audioTranscription, agentFollowUps, agentIterations, getCompletionTime, startTime]);

  // Ir directamente a confirmacion (saltando agent)
  const goToConfirmation = useCallback(async (): Promise<void> => {
    const success = await submitForm();
    if (success) {
      setStage(INTAKE_STAGES.CONFIRMATION);
    }
  }, [submitForm]);

  // Manejar teclas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (stage !== INTAKE_STAGES.QUESTIONS) return;

      if (e.key === 'Enter' && hasCurrentAnswer && currentQuestion?.type !== 'textarea') {
        e.preventDefault();
        goToNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, hasCurrentAnswer, currentQuestion, goToNextQuestion]);

  // Persistencia en localStorage
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`intake_${sessionId}`, JSON.stringify({
        answers,
        currentQuestionIndex,
        stage,
        clientInfo,
        audioTranscription,
        agentFollowUps,
        savedAt: new Date().toISOString(),
      }));
    }
  }, [answers, currentQuestionIndex, stage, clientInfo, sessionId, audioTranscription, agentFollowUps]);

  // Resumen para confirmacion (v3.0: incluye follow-ups y transcripcion)
  const summary = useMemo((): IntakeSummaryItem[] => {
    const questionSummary: IntakeSummaryItem[] = INTAKE_QUESTIONS.map(q => {
      const item: IntakeSummaryItem = {
        id: q.id,
        question: q.question,
        answer: answers[q.id] || 'No respondido',
        type: q.type,
      };

      // Include follow-up answer if exists
      if (q.followUp && answers[q.followUp.question.id]) {
        item.followUpAnswer = answers[q.followUp.question.id];
        item.followUpQuestion = q.followUp.question.question;
      }

      return item;
    });

    return questionSummary;
  }, [answers]);

  return {
    // Estado
    stage,
    currentQuestion,
    currentQuestionIndex,
    answers,
    progress,
    hasCurrentAnswer,
    uploadedFiles,
    audioRecording,
    isSubmitting,
    submitError,
    sessionId,
    clientInfo,
    summary,

    // v3.0: Audio transcription
    audioTranscription,
    isTranscribing,

    // v3.0: Agent state
    agentStatus,
    agentFollowUps,
    agentIterations,
    currentAgentQuestion,
    agentClosingMessage,

    // Acciones
    setAnswer,
    answerAndNext,
    goToNextQuestion,
    goToPreviousQuestion,
    startQuestionnaire,
    addFile,
    removeFile,
    saveAudioRecording,
    submitForm,
    goToConfirmation,
    setClientInfo,
    setStage,

    // v3.0: New actions
    transcribeAudio,
    goToAgent,
    callAgent,
    answerAgentQuestion,
    skipAgentQuestion,
    goToConfirmationFromAgent,
  };
}

export default useIntakeForm;
