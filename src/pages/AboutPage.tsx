import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants, TargetAndTransition } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Users,
    Brain,
    TrendingUp,
    ShieldCheck,
    Lightbulb,
    Award,
    BarChartHorizontalBig,
    CloudCog,
    HeartHandshake,
    Zap,
    Puzzle,
    BarChart2,
    Clock,
    Database,
    Target
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import CountUp from 'react-countup';
import { usePageMeta } from '@/hooks/usePageMeta';
import { localizedSchema } from '@/lib/schema-utils';
import type { StatItem, ValueCard } from '@/types';

// Color type for this page
type ColorKey = 'primary' | 'secondary' | 'accent';

// Tech stack item interface
interface TechStackItem {
  category: string;
  technologies: string[];
  icon: LucideIcon;
  color: ColorKey;
}

// Specialization item interface
interface SpecializationItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: ColorKey;
}

// RAG implementation card interface
interface RagImplementation {
  icon: LucideIcon;
  title: string;
  stack: string;
  result: string;
  detail: string;
  color: ColorKey;
  borderClass: string;
  bgClass: string;
}

// ESTADÍSTICAS TÉCNICAS OPTIMIZADAS PARA SEO
const stats: StatItem[] = [
  { value: 99.9, label: 'Uptime RAG Systems Enterprise', icon: ShieldCheck, suffix: '%' },
  { value: 2, label: 'Latencia Promedio (segundos)', icon: Zap, suffix: '<', prefix: '' },
  { value: 1000, label: 'Consultas/Min Procesadas', icon: TrendingUp, suffix: '+' },
  { value: 15, label: 'Años Arquitecturas Escalables', icon: Award, suffix: '+' },
];

// VALORES OPTIMIZADOS CON KEYWORDS TÉCNICOS
const values: ValueCard[] = [
  {
    icon: BarChart2,
    title: 'Arquitecturas Medibles',
    description: 'Cada implementación RAG genera métricas específicas: uptime, latencia, throughput. Si no se puede medir, no es enterprise.',
    color: 'primary'
  },
  {
    icon: ShieldCheck,
    title: 'Stack Tecnológico Transparente',
    description: 'Muestro exactamente OpenAI, Claude, Google Cloud Run, Qdrant. Stack completo, arquitectura completa, resultados completos.',
    color: 'secondary'
  },
  {
    icon: Zap,
    title: 'Performance Enterprise',
    description: 'Mis implementaciones RAG alcanzan 99.9% uptime y <2s latencia porque diseño para escala desde el día uno.',
    color: 'accent'
  },
];

const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardHoverEffect: TargetAndTransition = {
  y: -8,
  scale: 1.03,
  boxShadow: "0 12px 32px rgba(var(--primary-rgb), 0.3)",
  transition: { duration: 0.3, type: "spring", stiffness: 200 }
};

const AboutPage: React.FC = () => {
  const { i18n } = useTranslation('about');
  usePageMeta({ titleKey: 'meta.title', descriptionKey: 'meta.description', ns: 'about', path: '/about' });

  // SCHEMA MARKUP OPTIMIZADO PARA SEO
  useEffect(() => {
    const schemaScript: HTMLScriptElement = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Alex Seis",
      "jobTitle": localizedSchema("Arquitecto de IA Empresarial", "Enterprise AI Architect"),
      "description": localizedSchema("Especialista en RAG implementation enterprise, enterprise chatbot architecture y serverless platforms developer", "Specialist in enterprise RAG implementation, enterprise chatbot architecture and serverless platforms development"),
      "expertise": [
        "RAG Implementation Enterprise",
        "AI Architect Consultant",
        "Serverless Platforms Developer",
        "Enterprise Chatbot Architecture",
        "LLM Integration Consultant"
      ],
      "knowsAbout": [
        "OpenAI", "Claude", "Google Cloud Run", "BigQuery",
        "Docker", "Microservices", "RAG Multi-Strategy", "Qdrant", "Pinecone"
      ],
      "hasOccupation": {
        "@type": "Occupation",
        "name": localizedSchema("Arquitecto IA Empresarial", "AI Enterprise Architect"),
        "skills": ["RAG Multi-Strategy", "Enterprise Chatbots", "Serverless Platforms", "LLM Integration"],
        "experienceRequirements": localizedSchema("15+ años optimizando procesos empresariales", "15+ years optimizing enterprise processes")
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "EC"
      },
      "url": typeof window !== 'undefined' ? window.location.origin : "https://alexseis.com"
    });

    document.head.appendChild(schemaScript);
    return () => {
      if (document.head.contains(schemaScript)) {
        document.head.removeChild(schemaScript);
      }
    };
  }, [i18n.language]);

  // Tech stack data
  const techStack: TechStackItem[] = [
    {
      category: 'LLM Integration',
      technologies: ['OpenAI', 'Claude', 'Gemini', 'Mistral AI'],
      icon: Brain,
      color: 'primary'
    },
    {
      category: 'Cloud & Serverless',
      technologies: ['Google Cloud Run', 'Vercel', 'Docker', 'Railway'],
      icon: CloudCog,
      color: 'secondary'
    },
    {
      category: 'Bases Vectoriales / Data Warehouse',
      technologies: ['Qdrant', 'BigQuery', 'Supabase', 'PostgreSQL'],
      icon: Database,
      color: 'accent'
    },
    {
      category: 'DevOps & Deployment',
      technologies: ['Git Workflow', 'Automated Testing', 'Cloud Deployment', 'Documentation'],
      icon: BarChart2,
      color: 'primary'
    }
  ];

  // Specializations data
  const specializations: SpecializationItem[] = [
    {
      icon: Database,
      title: 'Arquitectura RAG Enterprise',
      description: 'Diseño sistemas RAG multi-estrategia con OpenAI, Claude y Qdrant que alcanzan 99.9% uptime y procesan 1000+ consultas/min.',
      color: 'primary'
    },
    {
      icon: BarChart2,
      title: 'LLM Integration Consultant',
      description: 'Integro múltiples LLMs (OpenAI, Claude, Cohere) en arquitecturas serverless escalables con Google Cloud Run.',
      color: 'secondary'
    },
    {
      icon: Target,
      title: 'Serverless Platforms Developer',
      description: 'Desarrollo plataformas serverless híbridas que combinan hosting tradicional con IA generativa en Vercel y Replicate.',
      color: 'accent'
    },
  ];

  return (
    <motion.div
      className="py-12 md:py-20 container-max"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* SECCIÓN DE INTRODUCCIÓN OPTIMIZADA PARA SEO */}
      <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
        <h1 className="text-h1 font-extrabold mb-4">
          Alex Seis - <span className="text-primary">Arquitecto IA Enterprise</span><br/>
          <span className="text-accent">RAG, Serverless y Sistemas Escalables</span>
        </h1>
        <p className="text-h3 text-gray-300 max-w-3xl mx-auto font-normal">
          Especialista en <strong>RAG implementation enterprise</strong> y <strong>AI architect consultant</strong>.
          Desarrollo arquitecturas serverless con OpenAI, Claude y Google Cloud Run.
          Métricas reales: 99.9% uptime, &lt;2s latencia, arquitecturas que procesan 1000+ consultas/min en producción.
        </p>
      </motion.div>

      {/* SECCIÓN: Stack Tecnológico Enterprise */}
      <motion.div variants={itemVariants} className="mb-12 md:mb-20">
        <h2 className="text-h2 font-bold text-center mb-8 md:mb-12 text-text-light">
          Stack Tecnológico <span className="text-primary">Enterprise</span>
        </h2>
        <div className="grid md:grid-cols-4 gap-6 md:gap-8">
          {techStack.map((stack, index) => (
            <motion.div
              key={index}
              className={`glass-card p-6 text-center border-${stack.color}/30`}
              whileHover={cardHoverEffect}
            >
              <div className={`inline-block p-4 rounded-lg bg-${stack.color}/10 mb-4`}>
                <stack.icon className={`h-10 w-10 text-${stack.color}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-3 text-${stack.color}`}>{stack.category}</h3>
              <div className="space-y-1">
                {stack.technologies.map((tech, i) => (
                  <div key={i} className="text-xs text-gray-300 bg-gray-800/50 px-2 py-1 rounded">
                    {tech}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* SECCIÓN: Mi Historia - TRANSFORMADA */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20 items-center">
        <div className="order-1">
          <h2 className="text-h2 font-bold text-primary mb-4 flex items-center">
            <Lightbulb className="mr-3 h-10 w-10" /> Mi Historia
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Durante años trabajando en Recursos Humanos y Seguridad Física, me enfrenté constantemente al mismo problema: <strong>excelentes profesionales perdiendo tiempo en procesos manuales ineficientes</strong>.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mt-4">
            Veía cómo tareas que deberían tomar días se extendían por semanas, cómo datos valiosos se perdían en hojas de cálculo dispersas, y cómo decisiones importantes se tomaban sin la información correcta.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mt-4 font-semibold">
            Ahí nació mi especialización en <strong>RAG implementation enterprise</strong> y <strong>AI architect consultant</strong>.
          </p>
          <ul className="mt-6 space-y-2 text-gray-300">
            <li className="flex items-center"><Target size={20} className="text-accent mr-2"/> Enfoque en problemas reales, no tecnología por tecnología</li>
            <li className="flex items-center"><BarChart2 size={20} className="text-accent mr-2"/> Todo debe ser medible y generar ROI tangible</li>
            <li className="flex items-center"><Brain size={20} className="text-accent mr-2"/> Experiencia práctica implementando OpenAI, Claude y Google Cloud Run</li>
          </ul>
        </div>
        <motion.div
          className="order-2 md:order-1 w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-strong"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
            <img
            alt="Professional data analyst working with multiple dashboards, clean office setup, person looking at security monitoring systems"
            className="object-cover w-full h-full"
            src="https://publicidad-zaimella.vercel.app/historia-alexseis.png" />
        </motion.div>
      </motion.div>

      {/* SECCIÓN: Metodología "Lo que se mide, se mejora" - TRANSFORMADA */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20 items-center">
        <motion.div
          className="order-1 md:order-2 w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-strong"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
            <img
            alt="Modern business intelligence dashboard showing real-time metrics, executive reviewing performance charts"
            className="object-cover w-full h-full"
            src="https://publicidad-zaimella.vercel.app/dashboard-hero.png" />
        </motion.div>
        <div className="order-2 md:order-1">
          <h2 className="text-h2 font-bold text-secondary mb-4 flex items-center">
            <TrendingUp className="mr-3 h-10 w-10" /> La Metodología "Lo que se mide, se mejora"
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Mi enfoque no es vender tecnología por tecnología. Es simple y probado:
          </p>
          <div className="mt-6 space-y-4">
            {([
              { num: '1', text: 'Auditar', desc: 'arquitectura actual (identificar gaps para RAG/LLM integration)' },
              { num: '2', text: 'Estructurar', desc: 'pipeline de datos (BigQuery + vectorización)' },
              { num: '3', text: 'Automatizar', desc: 'con serverless platforms (Vercel + Google Cloud Run)' },
              { num: '4', text: 'Medir', desc: 'performance (99.9% uptime, <2s latencia)' },
              { num: '5', text: 'Optimizar', desc: 'basado en métricas enterprise reales' },
            ] as const).map((step) => (
              <div key={step.num} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-secondary font-bold text-sm">{step.num}</span>
                </div>
                <div>
                  <p className="text-gray-300"><strong className="text-secondary">{step.text}</strong> {step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* NUEVA SECCIÓN: Implementaciones RAG Enterprise Reales */}
      <motion.div variants={itemVariants} className="mb-12 md:mb-20">
        <h2 className="text-h2 font-bold text-center mb-8 md:mb-12 text-text-light">
          Implementaciones <span className="text-accent">RAG Enterprise</span> Reales
        </h2>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            className="glass-card p-6 border-primary/30"
            whileHover={cardHoverEffect}
          >
            <div className="inline-block p-3 rounded-lg bg-primary/10 mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary">RAG Multi-Estrategia Empresarial</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Stack:</strong> OpenAI + Claude + Qdrant + Google Cloud Run</p>
              <p><strong>Resultado:</strong> 99.9% uptime, &lt;2s latencia, 1000+ consultas/min</p>
              <p><strong>Cliente:</strong> Plataforma SaaS Multi-Cliente Escalable</p>
            </div>
          </motion.div>

          <motion.div
            className="glass-card p-6 border-secondary/30"
            whileHover={cardHoverEffect}
          >
            <div className="inline-block p-3 rounded-lg bg-secondary/10 mb-4">
              <CloudCog className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-secondary">Pipeline BigQuery + LLM Integration</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Stack:</strong> BigQuery + Claude Desktop + MCP + Python ETL</p>
              <p><strong>Resultado:</strong> Análisis conversacional automatizado de datos</p>
              <p><strong>Impacto:</strong> ETL completamente automatizado + IA conversacional</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* SECCIÓN: Valores - TRANSFORMADA */}
      <motion.div variants={itemVariants} className="mb-12 md:mb-20">
        <h2 className="text-h2 font-bold text-center mb-8 md:mb-12 text-text-light">
          Los <span className="text-primary">Principios</span> que me Definen
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className={`glass-card p-6 text-center border-${value.color}/30`}
              whileHover={cardHoverEffect}
            >
              <div className={`inline-block p-4 rounded-lg bg-${value.color}/10 mb-4`}>
                <value.icon className={`h-12 w-12 text-${value.color}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 text-${value.color}`}>{value.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* SECCIÓN: Stats - TRANSFORMADA CON MÉTRICAS TÉCNICAS */}
      <motion.div variants={itemVariants} className="mb-12 md:mb-20 glass-card p-6 md:p-10">
        <h2 className="text-h2 font-bold text-center mb-8 md:mb-12 text-text-light">
          Mi Impacto en <span className="text-accent">Números</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-bg-dark/50 p-6 rounded-xl shadow-medium text-center border border-glass-border"
              whileHover={{ y: -5, boxShadow: "0 8px 20px rgba(var(--accent-rgb), 0.2)"}}
            >
              <stat.icon className={`h-12 w-12 text-accent mx-auto mb-4`} />
              <div className="text-4xl font-extrabold text-text-light mb-1">
                {stat.suffix === '<' ? (
                  <>
                    <CountUp end={stat.value} duration={3} enableScrollSpy scrollSpyOnce/>
                    <span className="text-2xl">s</span>
                  </>
                ) : (
                  <CountUp end={stat.value} duration={3} suffix={stat.suffix} enableScrollSpy scrollSpyOnce/>
                )}
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* SECCIÓN: Mi Especialización - TRANSFORMADA */}
      <motion.div variants={itemVariants} className="mb-12 md:mb-20">
        <h2 className="text-h2 font-bold text-center mb-8 md:mb-12 text-text-light">
          Mi <span className="text-primary">Especialización</span> Única
        </h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {specializations.map((item, index) => (
            <motion.div
              key={index}
              className={`glass-card p-6 text-center border-${item.color}/30`}
              whileHover={cardHoverEffect}
            >
              <div className={`inline-block p-4 rounded-lg bg-${item.color}/10 mb-4`}>
                <item.icon className={`h-12 w-12 text-${item.color}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 text-${item.color}`}>{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
};

export default AboutPage;
