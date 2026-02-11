/**
 * INNATE.data - Intelligent Client Intake Questionnaire
 * Constantes y configuración del cuestionario
 */
import type { IntakeQuestion, IntakeOption } from '@/types';

// Paleta de colores INNATE.data
export const INNATE_COLORS = {
  // Documentos
  primary: '#1a365d',      // Azul oscuro profesional
  accent: '#ed8936',       // Naranja energético (CTAs)

  // Web/Video
  background: '#0f0f1a',   // Deep space
  cyan: '#00d9ff',         // Cyan neón
  green: '#00ff88',        // Verde neón (éxito)
  warning: '#ffaa00',      // Naranja warning

  // Texto
  textPrimary: '#ffffff',
  textSecondary: '#a0aec0',
  textMuted: '#718096',
} as const;

export type InnateColorKey = keyof typeof INNATE_COLORS;

// Configuración del video de arquitectura
export interface VideoPlaceholder {
  title: string;
  duration: string;
  description: string;
}

export interface VideoConfig {
  url: string | null;
  placeholder: VideoPlaceholder;
}

export const VIDEO_CONFIG: VideoConfig = {
  url: '/innate_data.mp4',
  placeholder: {
    title: 'Cómo funciona INNATE.data',
    duration: '90 segundos',
    description: 'Conoce nuestra arquitectura de AI que vive dentro de tu data warehouse',
  },
};

// Las 8 preguntas estrategicas (optimizado v2.0 - 2026-02-01)
// Basado en analisis de documentos ESTAMPA + best practices McKinsey/Typeform
export const INTAKE_QUESTIONS: IntakeQuestion[] = [
  // Q1: Infrastructure Foundation (easy start)
  {
    id: 'database_location',
    question: '¿Donde vive tu base de datos principal?',
    type: 'options',
    required: true,
    options: [
      { value: 'on_premise', label: 'Servidor fisico propio', icon: '🏢' },
      { value: 'cloud', label: 'Cloud (Azure/AWS/GCP)', icon: '☁️' },
      { value: 'hybrid', label: 'Hibrido', icon: '🔀' },
      { value: 'unknown', label: 'No estoy seguro', icon: '❓' },
    ],
  },
  // Q2: Industry Context (NEW - critical for personalization)
  {
    id: 'industry',
    question: '¿En que industria opera tu empresa?',
    type: 'options',
    required: true,
    options: [
      { value: 'retail', label: 'Retail / E-commerce', icon: '🛍️' },
      { value: 'financial', label: 'Servicios Financieros / Fintech', icon: '🏦' },
      { value: 'manufacturing', label: 'Manufactura / Industrial', icon: '🏭' },
      { value: 'healthcare', label: 'Salud / Farmaceutica', icon: '🏥' },
      { value: 'logistics', label: 'Logistica / Supply Chain', icon: '🚚' },
      { value: 'services', label: 'Servicios Profesionales', icon: '💼' },
      { value: 'other', label: 'Otra industria', icon: '🏢' },
    ],
  },
  // Q3: Company Size (NEW - critical for scoping)
  {
    id: 'company_size',
    question: '¿Cual es el tamano de tu empresa?',
    type: 'options',
    required: true,
    options: [
      { value: 'small', label: '1-50 empleados', icon: '🏠' },
      { value: 'medium', label: '51-200 empleados', icon: '🏢' },
      { value: 'large', label: '201-1000 empleados', icon: '🏙️' },
      { value: 'enterprise', label: '1000+ empleados', icon: '🌆' },
    ],
  },
  // Q4: Main System (moved from Q2)
  {
    id: 'main_system',
    question: '¿Que sistema principal usan para gestionar el negocio?',
    type: 'text',
    required: true,
    placeholder: 'Ej: ICG FrontRetail, SAP, Oracle, SQL Server, etc.',
    hint: 'ERP, software de gestion, o base de datos principal',
  },
  // Q5: Analytics Maturity (v3.0 - with conditional follow-up)
  {
    id: 'has_analytics',
    question: '¿Tienen alguna herramienta de analytics/BI activa?',
    type: 'options',
    required: true,
    options: [
      { value: 'yes', label: 'Si, usamos analytics', icon: '✅' },
      { value: 'no', label: 'No tenemos', icon: '❌' },
      { value: 'partial', label: 'Parcialmente', icon: '⚠️' },
    ],
    // v3.0: Conditional follow-up question
    followUp: {
      condition: ['yes', 'partial'], // Show if answer is yes or partial
      question: {
        id: 'analytics_tool',
        question: '¿Que herramienta de analytics utilizan?',
        type: 'text',
        required: false,
        placeholder: 'Ej: Power BI, Tableau, Looker, Google Analytics, Excel avanzado...',
        hint: 'Menciona las principales que usen actualmente',
      }
    }
  },
  // Q6: VPN Access (feasibility check)
  {
    id: 'has_vpn',
    question: '¿Existe acceso remoto (VPN) al servidor de base de datos?',
    type: 'options',
    required: true,
    options: [
      { value: 'yes', label: 'Si', icon: '✅' },
      { value: 'no', label: 'No', icon: '❌' },
      { value: 'unknown', label: 'No se', icon: '❓' },
    ],
  },
  // Q7: IT Management
  {
    id: 'it_management',
    question: '¿Como manejan el area de Tecnologia?',
    type: 'options',
    required: true,
    options: [
      { value: 'internal', label: 'Equipo interno', icon: '👥' },
      { value: 'external', label: 'Proveedor externo', icon: '🏢' },
      { value: 'mixed', label: 'Mixto (interno + proveedor)', icon: '🔀' },
    ],
  },
  // Q8: Main Challenge (CLIMAX - deep discovery)
  {
    id: 'main_challenge',
    question: '¿Cual es el principal desafio con sus datos hoy?',
    type: 'textarea',
    required: true,
    placeholder: 'Ej: "La BD ha crecido mucho y en ocasiones se satura con algunos procesos"',
    hint: 'Performance, reportes lentos, saturacion, falta de visibilidad, etc.',
  },
];

// Sección de uploads opcional
export interface UploadConfig {
  question: string;
  hint: string;
  maxFileSize: number;
  acceptedDocuments: string;
  acceptedImages: string;
  maxFiles: number;
}

export const UPLOAD_CONFIG: UploadConfig = {
  question: '¿Tienes algo más que nos ayude a entender tu situación?',
  hint: 'Documentos, diagramas, capturas de pantalla, o explica con audio',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedDocuments: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
  acceptedImages: '.jpg,.jpeg,.png,.gif,.webp',
  maxFiles: 5,
};

// v3.0: Audio recording configuration
export interface AudioConfig {
  maxDuration: number;
  mimeType: string;
  audioBitsPerSecond: number;
}

export const AUDIO_CONFIG: AudioConfig = {
  maxDuration: 5 * 60, // 5 minutes max
  mimeType: 'audio/webm',
  audioBitsPerSecond: 128000,
};

// v3.0: Agent configuration
export interface AgentConfig {
  maxIterations: number;
  loadingMessages: string[];
}

export const AGENT_CONFIG: AgentConfig = {
  maxIterations: 2, // Maximum clarification rounds
  loadingMessages: [
    'Analizando tus respuestas...',
    'Revisando la informacion...',
    'Casi listo...',
  ],
};

// Mensajes del cuestionario
export interface IntakeMessages {
  landing: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    videoLabel: string;
  };
  progress: {
    question: string;
    of: string;
    almostDone: string;
  };
  uploads: {
    title: string;
    skip: string;
    documents: string;
    images: string;
    audio: string;
  };
  confirmation: {
    title: string;
    summary: string;
    nextStep: string;
    nextStepDescription: string;
    contact: string;
    email: string;
  };
  agent: {
    title: string;
    analyzing: string;
    askingTitle: string;
    inputPlaceholder: string;
    sendButton: string;
    skipButton: string;
    thankYou: string;
  };
}

export const INTAKE_MESSAGES: IntakeMessages = {
  landing: {
    title: 'Diagnóstico Inteligente',
    subtitle: 'INNATE.data',
    description: 'Antes de nuestra reunion, necesito conocer tu infraestructura. Son solo 8 preguntas.',
    cta: 'Iniciar Diagnóstico',
    videoLabel: 'Primero, conoce cómo funciona nuestra arquitectura',
  },
  progress: {
    question: 'Pregunta',
    of: 'de',
    almostDone: 'Casi terminamos',
  },
  uploads: {
    title: 'Complemento (Opcional)',
    skip: 'Saltar este paso',
    documents: 'Subir documentos',
    images: 'Subir imágenes',
    audio: 'Grabar audio',
  },
  confirmation: {
    title: '¡Listo! Ya tenemos lo que necesitamos',
    summary: 'Resumen',
    nextStep: 'Proximo paso',
    nextStepDescription: 'Te contactare en las proximas 24 horas con un analisis preliminar y propuesta de fecha para nuestra reunion.',
    contact: '¿Preguntas?',
    email: 'innate.data@alexseis.com',
  },
  // v3.0: Agent messages
  agent: {
    title: 'Revision Inteligente',
    analyzing: 'Analizando tus respuestas...',
    askingTitle: 'Una pregunta mas',
    inputPlaceholder: 'Escribe tu respuesta...',
    sendButton: 'Enviar respuesta',
    skipButton: 'Continuar sin responder',
    thankYou: 'Gracias por la informacion adicional.',
  },
};

// Mapeo de valores a labels legibles
export const VALUE_LABELS: Record<string, Record<string, string>> = {
  database_location: {
    on_premise: 'Servidor fisico on-premise',
    cloud: 'Cloud (Azure/AWS/GCP)',
    hybrid: 'Hibrido',
    unknown: 'Por determinar',
  },
  industry: {
    retail: 'Retail / E-commerce',
    financial: 'Servicios Financieros / Fintech',
    manufacturing: 'Manufactura / Industrial',
    healthcare: 'Salud / Farmaceutica',
    logistics: 'Logistica / Supply Chain',
    services: 'Servicios Profesionales',
    other: 'Otra industria',
  },
  company_size: {
    small: 'Pequena (1-50 empleados)',
    medium: 'Mediana (51-200 empleados)',
    large: 'Grande (201-1000 empleados)',
    enterprise: 'Enterprise (1000+ empleados)',
  },
  has_analytics: {
    yes: 'Si, tienen analytics activo',
    no: 'No tienen analytics',
    partial: 'Parcialmente implementado',
  },
  has_vpn: {
    yes: 'Si, VPN disponible',
    no: 'No hay VPN',
    unknown: 'Por confirmar',
  },
  it_management: {
    internal: 'Equipo interno',
    external: 'Proveedor externo',
    mixed: 'Mixto (interno + proveedor)',
  },
  // v3.0: New field for analytics tool follow-up
  analytics_tool: {}, // Free text, no predefined labels
};

// Schema para BigQuery (v3.0 - includes agent + transcription fields)
export interface BigQueryField {
  name: string;
  type: 'STRING' | 'JSON' | 'INTEGER' | 'TIMESTAMP';
  required?: boolean;
}

export interface BigQuerySchema {
  table: string;
  fields: BigQueryField[];
}

export const BIGQUERY_SCHEMA: BigQuerySchema = {
  table: 'alexseis_web.client_intake_responses',
  fields: [
    { name: 'session_id', type: 'STRING', required: true },
    { name: 'database_location', type: 'STRING' },
    { name: 'industry', type: 'STRING' },
    { name: 'company_size', type: 'STRING' },
    { name: 'main_system', type: 'STRING' },
    { name: 'has_analytics', type: 'STRING' },
    { name: 'analytics_tool', type: 'STRING' },
    { name: 'has_vpn', type: 'STRING' },
    { name: 'it_management', type: 'STRING' },
    { name: 'main_challenge', type: 'STRING' },
    { name: 'uploaded_files', type: 'JSON' },
    { name: 'audio_recording_url', type: 'STRING' },
    { name: 'audio_transcription', type: 'STRING' },
    { name: 'agent_follow_ups', type: 'JSON' },
    { name: 'agent_iterations', type: 'INTEGER' },
    { name: 'client_name', type: 'STRING' },
    { name: 'client_email', type: 'STRING' },
    { name: 'client_company', type: 'STRING' },
    { name: 'source_url', type: 'STRING' },
    { name: 'user_agent', type: 'STRING' },
    { name: 'ip_address', type: 'STRING' },
    { name: 'started_at', type: 'TIMESTAMP' },
    { name: 'completed_at', type: 'TIMESTAMP' },
    { name: 'completion_time_seconds', type: 'INTEGER' },
  ],
};
