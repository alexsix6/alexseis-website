/**
 * Shared TypeScript interfaces for alexseis-website
 * FASE 4: Enterprise-Level Upgrade
 */
import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';

// ===== THEME =====
export type Theme = 'light' | 'dark';

export interface UseThemeReturn {
  theme: Theme;
  isDark: boolean;
  isLight: boolean;
  isLoading: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  systemPrefersDark: boolean;
}

// ===== CHAT =====
export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

export interface ChatResponse {
  response: string;
  sessionId?: string;
}

export interface UseAgentChatReturn {
  sendMessage: (message: string) => Promise<ChatResponse>;
  loading: boolean;
  error: string | null;
  sessionId: string;
}

// ===== FORMS =====
export interface ClientInfo {
  name: string;
  email: string;
  company: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
  _hp_website: string;
}

// ===== INTAKE =====
export type IntakeStageType = 'landing' | 'questions' | 'uploads' | 'agent' | 'confirmation';

export interface IntakeOption {
  value: string;
  label: string;
  icon: string;
}

export interface IntakeQuestion {
  id: string;
  question: string;
  type: 'options' | 'text' | 'textarea';
  required: boolean;
  options?: IntakeOption[];
  placeholder?: string;
  hint?: string;
  followUp?: {
    condition: string[];
    question: IntakeQuestion;
  };
}

export interface IntakeProgress {
  current: number;
  total: number;
  answered: number;
  percentage: number;
}

export interface AgentFollowUp {
  question: string;
  answer: string;
}

export type AgentStatusType = 'idle' | 'processing' | 'analyzing' | 'evaluating' | 'asking' | 'complete';

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'done' | 'error';
}

export interface IntakeAnswers {
  [key: string]: string | boolean | null;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
}

export interface FileExtraction {
  filename: string;
  type: 'image' | 'document' | 'unsupported' | 'error';
  extraction: string | null;
}

export interface AudioRecording {
  blob: Blob;
  url: string;
  duration: number;
}

// ===== NAVIGATION =====
export interface NavItem {
  path: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

// ===== SERVICES =====
export interface ServiceCard {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
  technologies: string[];
  details?: string[];
}

// ===== PROJECTS =====
export interface ProjectCard {
  id: number;
  title: string;
  client: string;
  category: string;
  description: string;
  results: string[];
  technologies: string[];
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'accent';
  metrics?: {
    before: string;
    after: string;
    improvement: string;
  };
  imageUrl?: string;
}

// ===== ABOUT =====
export interface StatItem {
  value: number;
  label: string;
  icon: LucideIcon;
  suffix: string;
  prefix?: string;
  decimals?: number;
}

export interface ValueCard {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
}

// ===== ANALYTICS =====
export interface AnalyticsEventParams {
  [key: string]: string | number | boolean | undefined;
}

export interface UseAnalyticsReturn {
  trackPageView: (pagePath?: string, pageTitle?: string) => void;
  trackFormStart: (formName: string) => void;
  trackFormSubmit: (formName: string, formData?: AnalyticsEventParams) => void;
  trackCTAClick: (ctaName: string, ctaLocation?: string) => void;
  trackChatOpen: () => void;
  trackChatMessage: (messageType?: string) => void;
  trackEmailSignup: (source: string) => void;
}

// ===== BLOG =====
export interface BlogPostMeta {
  title: string;
  date: string;
  description: string;
  slug: string;
  tags?: string[];
  author?: string;
  image?: string;
}
