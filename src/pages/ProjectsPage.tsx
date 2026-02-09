import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    CheckCircle, BarChart2, Users, Briefcase, Award, Filter, ExternalLink,
    Shield, Database, Brain, Zap, MessageSquare, FileText, Eye,
    Cloud
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { localizedSchema } from '@/lib/schema-utils';
import type { ProjectCard } from '@/types';

// Color type for this page
type ColorKey = 'primary' | 'secondary' | 'accent';

// Differentiator card interface
interface DifferentiatorCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

// PROYECTOS OPTIMIZADOS CON NUEVO SISTEMA BIGQUERY + CLAUDE
const allProjects: ProjectCard[] = [
  {
    id: 1,
    title: 'Control de permanencia vehicular',
    client: 'Empresa Industrial',
    category: 'Business Intelligence',
    description: 'Analizando 16,097 movimientos vehiculares, implementé un sistema de control basado en medianas dinámicas por proceso, desplegué dashboards Power BI en tiempo real y optimicé la gestión de turnos, reduciendo esperas y mejorando la experiencia operativa.',
    results: [
      '~10% reducción promedio en tiempos de permanencia (16,097 operaciones)',
      '95% de operaciones dentro de parámetros normales post-implementación',
      '40 min de tiempo muerto eliminado en validaciones de diferencias de pesos complejas',
      'Mejora significativa en predictibilidad y satisfacción de usuarios'
    ],
    technologies: ['BigQuery', 'Power BI', 'Metodología LEAN', 'Gestión de KPIs'],
    icon: Shield,
    color: "primary",
    metrics: {
      before: "Tiempos impredecibles sin control",
      after: "95% operaciones dentro de parámetros",
      improvement: "~10% reducción global promedio"
    },
    imageUrl: "https://publicidad-zaimella.vercel.app/control-logistico.png"
  },
  {
    id: 2,
    title: 'Pipeline BigQuery + Claude Desktop: Sistema de BI Conversacional',
    client: 'Arquitectura Data Analytics Enterprise',
    category: 'Data Analytics + IA',
    description: 'Sistema completo de análisis conversacional: pipeline ETL automatizado (CSV → Google Cloud Storage → BigQuery) + integración Claude Desktop via MCP. Permite análisis complejos conversacionales de grandes volúmenes empresariales con queries automáticas y insights profundos.',
    results: [
      'Pipeline ETL completamente automatizado: CSV → Cloud Storage → BigQuery',
      'Integración Claude Desktop + MCP para análisis conversacional de datos',
      'Consultas SQL generadas automáticamente desde lenguaje natural',
      'Análisis multi-dimensional: tendencias, patrones, anomalías y predicciones'
    ],
    technologies: ['BigQuery', 'Google Cloud Storage', 'Claude Desktop', 'MCP Protocol', 'Python ETL'],
    icon: Cloud,
    color: "secondary",
    metrics: {
      before: "Análisis manual con SQL complejo",
      after: "Análisis conversacional automático",
      improvement: "ETL + IA conversacional integrado"
    },
    imageUrl: "https://publicidad-zaimella.vercel.app/base-datos-LLM.png"
  },
  {
    id: 3,
    title: 'Herramientas RAG Empresariales Multi-Estrategia',
    client: 'Plataforma Multi-Cliente SaaS',
    category: 'Agentes de IA',
    description: 'Sistema avanzado RAG multi-estrategia que procesa documentos empresariales y permite consultas inteligentes. Arquitectura escalable en Google Cloud Run con múltiples LLMs integrados: OpenAI, Claude, Cohere.',
    results: [
      'RAG multi-estrategia: básica, avanzada, ensemble adaptativo',
      'Latencia < 2 segundos, 1000+ consultas/minuto sostenidas',
      'Disponibilidad 99.9% en Google Cloud Run con auto-scaling',
      'Integración: OpenAI, Claude, Cohere + bases vectoriales Qdrant'
    ],
    technologies: ['Google Cloud Run', 'OpenAI', 'Claude API', 'Qdrant', 'Python Flask', 'Docker'],
    icon: Brain,
    color: "accent",
    metrics: {
      before: "Búsqueda manual documentos",
      after: "< 2s latencia, 1000+ consultas/min",
      improvement: "99.9% disponibilidad enterprise"
    },
    imageUrl: "https://publicidad-zaimella.vercel.app/herramientas-RAG.png"
  },
  {
    id: 4,
    title: 'Plataforma Serverless: Hosting + IA Generativa Híbrida',
    client: 'Arquitectura SaaS Serverless',
    category: 'Plataformas Serverless',
    description: 'Plataforma única que combina hosting estático de imágenes con generación de contenido mediante IA. URLs permanentes + creación automática con FLUX.1 y Veo 3 en arquitectura serverless Vercel con CDN global.',
    results: [
      'Plataforma híbrida: hosting tradicional + IA generativa unificado',
      'URLs públicas permanentes con CDN global Vercel',
      'Generación automática: imágenes (FLUX.1) y videos (Veo 3)',
      'Arquitectura serverless 100% escalable con zero-downtime'
    ],
    technologies: ['Vercel Serverless', 'Replicate API', 'FLUX.1', 'Veo 3', 'OpenRouter', 'CDN Global'],
    icon: Zap,
    color: "primary",
    metrics: {
      before: "Hosting + IA por separado",
      after: "Plataforma híbrida unificada",
      improvement: "CDN global + auto-scaling serverless"
    },
    imageUrl: "https://publicidad-zaimella.vercel.app/generador-imagenes.png"
  },
  {
    id: 5,
    title: 'WhatsApp Chatbot: Arquitectura Microservicios Enterprise',
    client: 'Sistema de Microservicios Escalable',
    category: 'Agentes de IA',
    description: 'Chatbot empresarial completo con arquitectura de microservicios Docker. GPT-4, procesamiento multimedia (Whisper, Vision), Google Calendar, memoria persistente Zep y monitoreo Prometheus + Grafana para producción.',
    results: [
      'Arquitectura microservicios enterprise-ready con Docker',
      'Multimedia: texto, voz (Whisper), imágenes (Vision API)',
      'Integración: Google Calendar, Gmail, memoria persistente Zep',
      'Monitoreo producción: Prometheus + Grafana + alertas automáticas'
    ],
    technologies: ['Docker', 'TypeScript', 'GPT-4', 'MongoDB', 'PostgreSQL', 'Redis', 'Prometheus'],
    icon: MessageSquare,
    color: "secondary",
    metrics: {
      before: "Chatbot simple",
      after: "Plataforma empresarial escalable",
      improvement: "Múltiples usuarios simultáneos + monitoreo"
    },
    imageUrl: "https://publicidad-zaimella.vercel.app/chatbot-empresarial.png"
  }
];

// CATEGORÍAS OPTIMIZADAS PARA SEO
const categories: string[] = ['Todos', 'Business Intelligence', 'Data Analytics + IA', 'Agentes de IA', 'Plataformas Serverless'];

const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease:"easeOut" } },
  exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3, ease:"easeIn" } },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 16px 48px rgba(0,0,0,0.25)",
    transition: { duration: 0.3, type: "spring", stiffness: 200 }
  }
};

const iconColorClasses: Record<ColorKey, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

const ProjectsPage: React.FC = () => {
  const { i18n } = useTranslation('projects');
  usePageMeta({ titleKey: 'meta.title', descriptionKey: 'meta.description', ns: 'projects', path: '/projects' });

  const [activeFilter, setActiveFilter] = useState<string>('Todos');

  const filteredProjects = useMemo((): ProjectCard[] => {
    if (activeFilter === 'Todos') return allProjects;
    return allProjects.filter(project => project.category === activeFilter);
  }, [activeFilter]);

  // SCHEMA MARKUP PARA PORTFOLIO
  useEffect(() => {
    const schemaScript: HTMLScriptElement = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": localizedSchema("Arquitecturas IA y Sistemas Enterprise - Portfolio", "AI Architectures and Enterprise Systems - Portfolio"),
      "description": localizedSchema("Casos reales de implementación: RAG multi-estrategia, pipelines BigQuery, plataformas serverless y arquitecturas microservicios", "Real implementation cases: multi-strategy RAG, BigQuery pipelines, serverless platforms and microservices architectures"),
      "author": {
        "@type": "Person",
        "name": "Alex Seis",
        "jobTitle": localizedSchema("Arquitecto de IA Empresarial", "Enterprise AI Architect")
      },
      "workExample": allProjects.map(project => ({
        "@type": "CreativeWork",
        "name": project.title,
        "description": project.description,
        "technology": project.technologies,
        "result": project.results.slice(0, 2)
      }))
    });

    document.head.appendChild(schemaScript);
    return () => {
      if (document.head.contains(schemaScript)) {
        document.head.removeChild(schemaScript);
      }
    };
  }, [i18n.language]);

  // Differentiator cards data
  const differentiators: DifferentiatorCard[] = [
    {
      icon: FileText,
      title: 'Implementaciones Reales',
      description: 'No son demos. Son sistemas en producción con usuarios reales y métricas verificables de performance.',
    },
    {
      icon: BarChart2,
      title: 'Métricas Enterprise',
      description: '99.9% uptime, <2s latencia, 1000+ consultas/min. Números reales de sistemas escalables.',
    },
    {
      icon: Eye,
      title: 'Stack Completo Visible',
      description: 'Código, arquitectura, tecnologías y decisiones técnicas completamente transparentes.',
    },
  ];

  return (
    <motion.div
      className="py-12 md:py-20 container-max"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* TÍTULO Y DESCRIPCIÓN OPTIMIZADOS */}
      <motion.div
        className="text-center mb-12 md:mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-h1 font-extrabold mb-4">
          Arquitecturas <span className="text-secondary">IA Reales</span> - RAG, Serverless y Sistemas Enterprise
        </h1>
        <p className="text-h3 text-gray-300 max-w-3xl mx-auto font-normal">
          Implementaciones verificables con OpenAI, Claude, Google Cloud Run y BigQuery. Cada arquitectura incluye métricas específicas, stack tecnológico completo y resultados cuantificables en producción.
        </p>
      </motion.div>

      {/* FILTROS OPTIMIZADOS */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setActiveFilter(category)}
            variant={activeFilter === category ? 'default' : 'outline'}
            className={`btn rounded-button px-6 py-2 text-sm
              ${activeFilter === category
                ? 'btn-primary'
                : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
          >
            {category === 'Todos' ? <Filter className="mr-2 h-4 w-4" /> : null}
            {category}
          </Button>
        ))}
      </motion.div>

      {/* GRID DE PROYECTOS OPTIMIZADO */}
      <motion.div
        className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        layout
      >
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              className={`glass-card group relative overflow-hidden border-${project.color}/30`}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
              layout
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-4 shadow-lg">
                   <img
                    src={project.imageUrl}
                    alt={`Arquitectura ${project.title} - Dashboard con ${project.technologies.slice(0,3).join(', ')}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                   />
                   <div className={`absolute top-2 right-2 p-2 rounded-md bg-${project.color}/80 backdrop-blur-sm`}>
                      <project.icon className={`h-6 w-6 text-white`} />
                   </div>
                </div>

                <h2 className={`text-xl font-semibold text-${project.color} mb-1`}>{project.title}</h2>
                <p className="text-xs text-gray-400 mb-3 font-medium">Arquitectura: {project.client} | {project.category}</p>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed flex-grow">{project.description}</p>

                {/* Métricas destacadas */}
                {project.metrics && (
                  <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-200 mb-2">Métricas de Impacto:</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Antes:</span>
                        <div className="text-gray-300 font-medium">{project.metrics.before}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Después:</span>
                        <div className={`text-${project.color} font-medium`}>{project.metrics.after}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-400">Resultado:</span>
                      <div className={`text-${project.color} font-bold text-sm`}>{project.metrics.improvement}</div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-200 mb-1">Resultados Clave:</h3>
                  <ul className="space-y-1">
                    {project.results.slice(0, 2).map((result, i) => (
                      <li key={i} className="flex items-start text-xs text-gray-300">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-accent flex-shrink-0" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-200 mb-2">Stack Tecnológico:</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium bg-${project.color}/20 text-${project.color}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <Button asChild size="sm" variant="link" className={`mt-4 text-${project.color} hover:text-${project.color}/80 self-start px-0`}>
                  <NavLink to="/contact">
                    Implementar Arquitectura Similar <ExternalLink className="ml-1.5 h-4 w-4" />
                  </NavLink>
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* METODOLOGÍA OPTIMIZADA */}
      <motion.div
        className="mb-16 md:mb-24 mt-16 md:mt-24 glass-card p-8 md:p-12 border-accent/30"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <h2 className="text-h2 font-bold text-center mb-8 text-text-light">
          Por qué Mis Arquitecturas son <span className="text-accent">Diferentes</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {differentiators.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-accent mb-2">{item.title}</h3>
              <p className="text-gray-300 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA FINAL OPTIMIZADO */}
      <motion.div
        className="mt-16 md:mt-24 text-center glass-card p-8 md:p-12 border-secondary/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <Award className="h-16 w-16 text-secondary mx-auto mb-6" />
        <h2 className="text-h2 font-bold text-text-light mb-4">¿Necesitas Arquitecturas IA Similares?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
          Si necesitas implementar RAG, pipelines BigQuery, plataformas serverless o arquitecturas microservicios,
          analicemos tu caso específico y diseñemos la solución óptima.
        </p>
        <Button asChild size="lg" className="btn btn-secondary text-lg py-4 px-8">
          <NavLink to="/contact">
            Evaluar Mi Proyecto IA <BarChart2 className="ml-2 h-5 w-5" />
          </NavLink>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProjectsPage;
