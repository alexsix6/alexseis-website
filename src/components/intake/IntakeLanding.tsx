/**
 * Landing del cuestionario con video y CTA
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Clock, Shield } from 'lucide-react';
import { INNATE_COLORS } from '@/lib/intake-constants';
import type { VideoConfig, IntakeMessages } from '@/lib/intake-constants';

interface IntakeLandingProps {
  onStart: () => void;
  videoConfig: VideoConfig;
  messages: IntakeMessages['landing'];
}

const IntakeLanding: React.FC<IntakeLandingProps> = ({ onStart, videoConfig, messages }) => {
  const hasVideo = videoConfig?.url;

  return (
    <div className="text-center space-y-8">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span
          className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium"
          style={{
            backgroundColor: 'rgba(0, 217, 255, 0.1)',
            color: INNATE_COLORS.cyan,
            border: `1px solid ${INNATE_COLORS.cyan}30`,
          }}
        >
          <Shield className="w-4 h-4 mr-2" />
          Zero-Egress Architecture
        </span>
      </motion.div>

      {/* Titulo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span style={{ color: INNATE_COLORS.cyan }}>{messages.title}</span>
        </h1>
        <p className="text-lg md:text-xl" style={{ color: INNATE_COLORS.textSecondary }}>
          {messages.subtitle}
        </p>
      </motion.div>

      {/* Video o Placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative max-w-lg mx-auto"
      >
        {hasVideo ? (
          <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
            <iframe
              src={videoConfig.url!}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="INNATE.data Architecture"
            />
          </div>
        ) : (
          // Placeholder cuando no hay video
          <div
            className="aspect-video rounded-2xl flex flex-col items-center justify-center border border-white/10"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(0, 217, 255, 0.1)' }}
            >
              <Play
                className="w-8 h-8 ml-1"
                style={{ color: INNATE_COLORS.cyan }}
              />
            </div>
            <p className="font-medium mb-1" style={{ color: INNATE_COLORS.textPrimary }}>
              {videoConfig.placeholder.title}
            </p>
            <p className="text-sm flex items-center gap-1" style={{ color: INNATE_COLORS.textMuted }}>
              <Clock className="w-4 h-4" />
              {videoConfig.placeholder.duration}
            </p>
          </div>
        )}

        {/* Label del video */}
        <p
          className="mt-3 text-sm"
          style={{ color: INNATE_COLORS.textMuted }}
        >
          {messages.videoLabel}
        </p>
      </motion.div>

      {/* Descripcion */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg max-w-md mx-auto"
        style={{ color: INNATE_COLORS.textSecondary }}
      >
        {messages.description}
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={onStart}
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: INNATE_COLORS.cyan,
            color: INNATE_COLORS.background,
          }}
        >
          {messages.cta}
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>

      {/* Indicadores de tiempo y seguridad */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-6 text-sm"
        style={{ color: INNATE_COLORS.textMuted }}
      >
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          ~5 minutos
        </span>
        <span className="flex items-center gap-1">
          <Shield className="w-4 h-4" />
          Datos encriptados
        </span>
      </motion.div>
    </div>
  );
};

export default IntakeLanding;
