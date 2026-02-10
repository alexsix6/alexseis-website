/**
 * Seccion de uploads multimedia (opcional)
 * v3.0: Audio mejorado (5 min max), preview, transcripcion
 * v4.5: i18n support
 */
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FileText, Image, Mic, X, ArrowRight,
  ArrowLeft, Loader2, AlertCircle, Square, Play, Pause, Trash2
} from 'lucide-react';
import { INNATE_COLORS, UPLOAD_CONFIG, AUDIO_CONFIG } from '@/lib/intake-constants';
import type { LucideIcon } from 'lucide-react';

// ===== Sub-component props =====

interface UploadedFileProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
}

// Componente de archivo subido
const UploadedFileItem: React.FC<UploadedFileProps> = ({ file, index, onRemove }) => {
  const isImage = file.type.startsWith('image/');
  const Icon = isImage ? Image : FileText;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-center gap-3 p-3 rounded-lg border"
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderColor: 'rgba(255,255,255,0.1)',
      }}
    >
      <Icon className="w-5 h-5 flex-shrink-0" style={{ color: INNATE_COLORS.cyan }} />
      <span className="flex-grow truncate text-sm">{file.name}</span>
      <span className="text-xs" style={{ color: INNATE_COLORS.textMuted }}>
        {(file.size / 1024).toFixed(0)} KB
      </span>
      <button
        onClick={() => onRemove(index)}
        className="p-1 rounded hover:bg-white/10 transition-colors"
        style={{ color: INNATE_COLORS.textMuted }}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

interface UploadButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: (file: File) => void;
  accept: string;
}

// Boton de upload
const UploadButton: React.FC<UploadButtonProps> = ({ icon: Icon, label, onClick, accept }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (): void => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => onClick(file));
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="flex flex-col items-center gap-2 p-6 rounded-xl border border-dashed transition-all duration-200 hover:border-opacity-50"
        style={{
          borderColor: INNATE_COLORS.cyan,
          backgroundColor: 'rgba(0, 217, 255, 0.03)',
        }}
      >
        <Icon className="w-8 h-8" style={{ color: INNATE_COLORS.cyan }} />
        <span className="text-sm font-medium">{label}</span>
      </button>
    </>
  );
};

interface AudioRecorderProps {
  onSave: (blob: Blob) => void;
  audioBlob: Blob | null;
  onDelete: () => void;
  labels: {
    record: string;
    recording: string;
    recorded: string;
    reRecord: string;
    recordingHint: string;
    errorMic: string;
  };
}

// v3.0: Componente de grabacion de audio mejorado
const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSave, audioBlob, onDelete, labels }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Create audio URL for preview
  const audioUrl = audioBlob ? URL.createObjectURL(audioBlob) : null;

  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });
      streamRef.current = stream;

      const options: MediaRecorderOptions = {
        mimeType: AUDIO_CONFIG.mimeType,
        audioBitsPerSecond: AUDIO_CONFIG.audioBitsPerSecond,
      };

      // Fallback for browsers that don't support webm
      if (!MediaRecorder.isTypeSupported(AUDIO_CONFIG.mimeType)) {
        delete options.mimeType;
      }

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e: BlobEvent): void => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = (): void => {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        onSave(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= AUDIO_CONFIG.maxDuration - 1) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert(labels.errorMic);
    }
  };

  const stopRecording = (): void => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const togglePlayback = (): void => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = (): void => {
    setIsPlaying(false);
  };

  const handleDelete = (): void => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    onDelete();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maxTimeFormatted = formatTime(AUDIO_CONFIG.maxDuration);

  // Recording state
  if (isRecording) {
    const progressPercent = (recordingTime / AUDIO_CONFIG.maxDuration) * 100;

    return (
      <button
        onClick={stopRecording}
        className="flex flex-col items-center gap-2 p-6 rounded-xl border border-dashed transition-all duration-200 relative overflow-hidden"
        style={{
          borderColor: INNATE_COLORS.warning,
          backgroundColor: 'rgba(255, 170, 0, 0.1)',
        }}
      >
        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 h-1"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: INNATE_COLORS.warning,
            transition: 'width 1s linear',
          }}
        />

        <div className="relative">
          <Square className="w-8 h-8" style={{ color: INNATE_COLORS.warning }} />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        </div>
        <span className="text-sm font-medium" style={{ color: INNATE_COLORS.warning }}>
          {labels.recording} {formatTime(recordingTime)}
        </span>
        <span className="text-xs" style={{ color: INNATE_COLORS.textMuted }}>
          {labels.recordingHint.replace('{{time}}', maxTimeFormatted)}
        </span>
      </button>
    );
  }

  // Has recording state (preview)
  if (audioBlob) {
    return (
      <div
        className="flex flex-col items-center gap-3 p-4 rounded-xl border"
        style={{
          borderColor: INNATE_COLORS.green,
          backgroundColor: 'rgba(0, 255, 136, 0.05)',
        }}
      >
        <audio
          ref={audioRef}
          src={audioUrl!}
          onEnded={handleAudioEnded}
          className="hidden"
        />

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={togglePlayback}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
            style={{
              backgroundColor: INNATE_COLORS.green,
              color: INNATE_COLORS.background,
            }}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <div className="flex-grow">
            <p className="text-sm font-medium" style={{ color: INNATE_COLORS.green }}>
              {labels.recorded}
            </p>
            <p className="text-xs" style={{ color: INNATE_COLORS.textMuted }}>
              {(audioBlob.size / 1024).toFixed(0)} KB
            </p>
          </div>

          <button
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: INNATE_COLORS.textMuted }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={startRecording}
          className="text-xs underline"
          style={{ color: INNATE_COLORS.textMuted }}
        >
          {labels.reRecord}
        </button>
      </div>
    );
  }

  // Default state (no recording)
  return (
    <button
      onClick={startRecording}
      className="flex flex-col items-center gap-2 p-6 rounded-xl border border-dashed transition-all duration-200 hover:border-opacity-50"
      style={{
        borderColor: INNATE_COLORS.cyan,
        backgroundColor: 'rgba(0, 217, 255, 0.03)',
      }}
    >
      <Mic className="w-8 h-8" style={{ color: INNATE_COLORS.cyan }} />
      <span className="text-sm font-medium">{labels.record}</span>
      <span className="text-xs" style={{ color: INNATE_COLORS.textMuted }}>
        Max {maxTimeFormatted}
      </span>
    </button>
  );
};

// ===== Main component =====

interface IntakeUploadsProps {
  uploadedFiles: File[];
  audioRecording: Blob | null;
  onAddFile: (file: File) => void;
  onRemoveFile: (index: number) => void;
  onSaveAudio: (blob: Blob | null) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  error: string | null;
  isTranscribing: boolean;
}

const IntakeUploads: React.FC<IntakeUploadsProps> = ({
  uploadedFiles,
  audioRecording,
  onAddFile,
  onRemoveFile,
  onSaveAudio,
  onSubmit,
  onSkip,
  onBack,
  isSubmitting,
  error,
  isTranscribing,
}) => {
  const { t } = useTranslation('intake');

  const handleAddFile = (file: File): void => {
    if (file.size > UPLOAD_CONFIG.maxFileSize) {
      alert(t('uploads.error_file_size'));
      return;
    }
    if (uploadedFiles.length >= UPLOAD_CONFIG.maxFiles) {
      alert(t('uploads.error_max_files', { max: UPLOAD_CONFIG.maxFiles }));
      return;
    }
    onAddFile(file);
  };

  const handleDeleteAudio = (): void => {
    onSaveAudio(null);
  };

  const isLoading = isSubmitting || isTranscribing;
  const loadingText = isTranscribing
    ? t('agent.analyzing', { defaultValue: 'Transcribiendo...' })
    : t('buttons.continue', { defaultValue: 'Enviando...' });

  // Audio recorder labels
  const audioLabels = {
    record: t('uploads.record_audio'),
    recording: t('agent.analyzing', { defaultValue: 'Grabando...' }),
    recorded: t('uploads.audio_recorded'),
    reRecord: t('uploads.re_record'),
    recordingHint: t('uploads.recording_hint'),
    errorMic: t('uploads.error_mic'),
  };

  return (
    <div className="space-y-8">
      {/* Titulo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: INNATE_COLORS.textPrimary }}
        >
          {t('uploads.question')}
        </h2>
        <p style={{ color: INNATE_COLORS.textMuted }}>
          {t('uploads.hint')}
        </p>
      </motion.div>

      {/* Botones de upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <UploadButton
          icon={FileText}
          label={t('uploads.documents')}
          onClick={handleAddFile}
          accept={UPLOAD_CONFIG.acceptedDocuments}
        />
        <UploadButton
          icon={Image}
          label={t('uploads.images')}
          onClick={handleAddFile}
          accept={UPLOAD_CONFIG.acceptedImages}
        />
        <AudioRecorder
          onSave={onSaveAudio}
          audioBlob={audioRecording}
          onDelete={handleDeleteAudio}
          labels={audioLabels}
        />
      </motion.div>

      {/* Archivos subidos */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <p className="text-sm font-medium" style={{ color: INNATE_COLORS.textSecondary }}>
            {t('uploads.uploaded_files')} ({uploadedFiles.length}/{UPLOAD_CONFIG.maxFiles})
          </p>
          {uploadedFiles.map((file, index) => (
            <UploadedFileItem
              key={`${file.name}-${index}`}
              file={file}
              index={index}
              onRemove={onRemoveFile}
            />
          ))}
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 p-4 rounded-lg"
          style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }}
        >
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-400">{error}</span>
        </motion.div>
      )}

      {/* Botones de navegacion */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between pt-4"
      >
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-white/5 disabled:opacity-50"
          style={{ color: INNATE_COLORS.textSecondary }}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('uploads.back')}
        </button>

        <div className="flex items-center gap-3">
          {/* Boton Saltar */}
          <button
            onClick={onSkip}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg transition-colors hover:bg-white/5 disabled:opacity-50"
            style={{ color: INNATE_COLORS.textMuted }}
          >
            {t('uploads.skip')}
          </button>

          {/* Boton Continuar */}
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: INNATE_COLORS.cyan,
              color: INNATE_COLORS.background,
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {loadingText}
              </>
            ) : (
              <>
                {t('uploads.continue')}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default IntakeUploads;
