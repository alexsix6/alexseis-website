import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Bot, CloudCog, Activity, MessageSquarePlus, Zap, Brain, BarChart, Settings2, ArrowRight,
    Search, Database, BarChart3, TrendingUp, Users,
    Cpu,
    Network,
    Cloud
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePageMeta } from '@/hooks/usePageMeta';
import { localizedSchema } from '@/lib/schema-utils';
import type { ServiceCard } from '@/types';

// Color type for this page
type ColorKey = 'primary' | 'secondary' | 'accent';

// Process step interface
interface ProcessStep {
  step: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  color: ColorKey;
}

// SERVICIOS COMPLETAMENTE REDISEÑADOS PARA IA EMPRESARIAL
const services: ServiceCard[] = [
  {
    icon: Brain,
    title: 'Implementación RAG Multi-Estrategia',
    description: 'Desarrollo de sistemas RAG empresariales con OpenAI, Claude. Arquitecturas vectoriales escalables con Qdrant. Latencia <2s, disponibilidad 99.9%.',
    color: 'primary',
    technologies: ['OpenAI', 'Claude', 'Qdrant', 'Google Cloud Run']
  },
  {
    icon: Bot,
    title: 'Chatbots Enterprise con Microservicios',
    description: 'Arquitecturas completas con Docker, TypeScript y múltiples bases de datos. Procesamiento multimedia, memoria persistente y monitoreo Prometheus + Grafana.',
    color: 'secondary',
    technologies: ['Docker', 'TypeScript', 'MongoDB', 'PostgreSQL']
  },
  {
    icon: Cloud,
    title: 'Plataformas Serverless Híbridas',
    description: 'Desarrollo en Vercel con integración IA generativa. APIs REST escalables, CDN global y arquitecturas event-driven. FLUX.1, Veo 3 y Replicate API.',
    color: 'accent',
    technologies: ['Vercel', 'Replicate', 'FLUX.1', 'Serverless']
  },
  {
    icon: Database,
    title: 'Pipelines BigQuery + LLM Integration',
    description: 'Automatización completa CSV → BigQuery con análisis conversacional IA. Scripts Python inteligentes, dashboards Power BI y procesamiento 1-click.',
    color: 'primary',
    technologies: ['BigQuery', 'Python', 'Power BI', 'LLM APIs']
  },
  {
    icon: Network,
    title: 'Arquitecturas AI Escalables',
    description: 'Diseño de infraestructuras enterprise-ready. Google Cloud Run, autoscaling, load balancing y arquitecturas fault-tolerant para aplicaciones IA críticas.',
    color: 'secondary',
    technologies: ['Google Cloud', 'Kubernetes', 'Load Balancing', 'Monitoring']
  },
  {
    icon: TrendingUp,
    title: 'Optimización Performance IA',
    description: 'Monitoreo avanzado con métricas específicas IA: latencia de inferencia, throughput de tokens, costos API y optimización continua basada en datos reales.',
    color: 'accent',
    technologies: ['Monitoring', 'Analytics', 'Cost Optimization', 'Performance']
  },
];

const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
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

const borderColorClasses: Record<ColorKey, string> = {
  primary: "border-primary/50",
  secondary: "border-secondary/50",
  accent: "border-accent/50",
};

const ServicesPage: React.FC = () => {
  const { i18n } = useTranslation('services');
  usePageMeta({ titleKey: 'meta.title', descriptionKey: 'meta.description', ns: 'services', path: '/services' });

  // SCHEMA MARKUP PARA SERVICIOS
  useEffect(() => {
    const schemaScript: HTMLScriptElement = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": localizedSchema("Servicios de IA Empresarial", "Enterprise AI Services"),
      "description": localizedSchema("Implementación RAG, chatbots enterprise y plataformas serverless", "RAG implementation, enterprise chatbots and serverless platforms"),
      "provider": {
        "@type": "Person",
        "name": "Alex Seis",
        "jobTitle": localizedSchema("Arquitecto de IA Empresarial", "Enterprise AI Architect")
      },
      "serviceType": [
        localizedSchema("Implementación RAG", "RAG Implementation"),
        localizedSchema("Chatbots Enterprise", "Enterprise Chatbots"),
        localizedSchema("Plataformas Serverless", "Serverless Platforms"),
        localizedSchema("Integración BigQuery", "BigQuery Integration"),
        localizedSchema("Arquitectura IA", "AI Architecture")
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": localizedSchema("Servicios IA", "AI Services"),
        "itemListElement": services.map((service) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": service.title,
            "description": service.description
          }
        }))
      }
    });

    document.head.appendChild(schemaScript);
    return () => {
      if (document.head.contains(schemaScript)) {
        document.head.removeChild(schemaScript);
      }
    };
  }, [i18n.language]);

  return (
    <motion.div
      className="py-12 md:py-20 container-max"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* TÍTULO Y DESCRIPCIÓN OPTIMIZADOS */}
      <div className="text-center mb-12 md:mb-16">
        <motion.h1
          className="text-h1 font-extrabold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Servicios de <span className="text-primary">IA Empresarial</span> - RAG, Chatbots y Serverless
        </motion.h1>
        <motion.p
          className="text-h3 text-gray-300 max-w-3xl mx-auto font-normal"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Arquitecturas enterprise probadas con OpenAI, Claude y Google Cloud Run. Implementaciones que combinan IA cutting-edge con infraestructura escalable. Resultados medibles: Latencia &lt;2s, disponibilidad 99.9%, 1000+ consultas/min sostenidas.
        </motion.p>
      </div>

      {/* GRID DE SERVICIOS OPTIMIZADO */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            className={`glass-card group relative overflow-hidden ${borderColorClasses[service.color]}`}
            variants={cardVariants}
            whileHover="hover"
          >
            <div className={`absolute -top-4 -right-4 w-24 h-24 ${iconColorClasses[service.color]} opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-300`}>
               <service.icon size={96} strokeWidth={1} />
            </div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg bg-${service.color}/10 mr-4`}>
                  <service.icon className={`h-8 w-8 ${iconColorClasses[service.color]}`} />
                </div>
                <h2 className={`text-xl font-semibold text-text-light`}>{service.title}</h2>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-grow">{service.description}</p>

              {/* Tecnologías utilizadas */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-300 mb-2">Stack Tecnológico:</h4>
                <div className="flex flex-wrap gap-1">
                  {service.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded text-xs font-medium bg-${service.color}/20 text-${service.color} border border-${service.color}/30`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <Button asChild size="sm" variant="outline" className={`mt-auto btn btn-outline border-${service.color} text-${service.color} hover:bg-${service.color} hover:text-bg-dark w-full`}>
                <NavLink to="/contact">
                  Implementar Ahora <Settings2 className="ml-2 h-4 w-4" />
                </NavLink>
              </Button>
              <div className={`absolute bottom-0 left-0 h-1 w-0 bg-${service.color} group-hover:w-full transition-all duration-500 ease-out`}></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PROCESO PASO A PASO OPTIMIZADO */}
      <motion.div
        className="mb-16 md:mb-24 mt-16 md:mt-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <h2 className="text-h2 font-bold text-center mb-8 md:mb-12 text-text-light">
          Metodología de <span className="text-primary">Implementación IA</span>
        </h2>
        <div className="space-y-8">
          {([
            {
              step: "01",
              title: "Auditoría Arquitectural IA",
              desc: "Análisis completo de infraestructura actual, identificación de oportunidades IA y evaluación de readiness para implementación enterprise.",
              icon: Search,
              color: "primary"
            },
            {
              step: "02",
              title: "Diseño de Arquitectura AI-First",
              desc: "Arquitectura escalable con microservicios, APIs RESTful, bases vectoriales y integración LLM. Diseño para 99.9% uptime y <2s latencia.",
              icon: Database,
              color: "secondary"
            },
            {
              step: "03",
              title: "Implementación DevOps + MLOps",
              desc: "Deploy con Docker, CI/CD automatizado, monitoreo Prometheus y escalado automático. Cada fase genera métricas verificables.",
              icon: Zap,
              color: "accent"
            },
            {
              step: "04",
              title: "Optimización y Monitoreo IA",
              desc: "Métricas específicas IA: latencia de inferencia, throughput de tokens, costos API. Optimización continua basada en datos reales.",
              icon: TrendingUp,
              color: "primary"
            }
          ] as ProcessStep[]).map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-6 glass-card p-6 border-gray-700/50"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
            >
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className={`text-4xl font-bold text-${item.color}`}>{item.step}</div>
                <div className={`p-3 rounded-lg bg-${item.color}/10`}>
                  <item.icon className={`h-8 w-8 text-${item.color}`} />
                </div>
              </div>
              <div>
                <h3 className={`text-xl font-semibold text-${item.color} mb-2`}>{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA FINAL OPTIMIZADO */}
      <motion.div
        className="mt-16 md:mt-24 text-center glass-card p-8 md:p-12 border-primary/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: services.length * 0.1 + 0.2 }}
      >
        <Brain className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="text-h2 font-bold text-text-light mb-4">¿Listo para Implementar IA Empresarial?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
          Si tu empresa necesita arquitecturas IA escalables, RAG implementations o chatbots enterprise-ready,
          conversemos sobre tu roadmap de transformación digital con IA.
        </p>
        <Button asChild size="lg" className="btn btn-primary text-lg py-4 px-8">
          <NavLink to="/contact">
            Evaluar Mi Proyecto IA <ArrowRight className="ml-2 h-5 w-5" />
          </NavLink>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ServicesPage;
