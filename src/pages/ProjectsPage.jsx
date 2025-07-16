import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle, BarChart2, Users, Briefcase, Award, Filter, ExternalLink,
    Shield,    // Sistema CCTV
    Database,  // BigQuery + LLM
    Brain,     // Herramientas RAG
    Zap,       // Publicidad Empresa  
    MessageSquare, // WhatsApp Chatbot
    FileText,  
    Eye        
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';

// Casos reales de Alex con métricas específicas y herramientas reales
const allProjects = [
  {
    id: 1,
    title: 'Control de permanencia vehicular',
    client: 'Empresa Industrial',
    category: 'Optimización Logística',
    description: 'Analizando 16,097 movimientos vehiculares, implementé un sistema de control basado en medianas dinámicas por proceso, desplegué dashboards en tiempo real y optimicé la gestión de turnos, reduciendo esperas y mejorando la experiencia operativa.',
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
    title: 'Base de Datos + LLM: Análisis Empresarial Inteligente',
    client: 'Base Seguridad Física Corporativa',
    category: 'Análisis de Datos',
    description: 'Sistema automatizado que procesa datos empresariales (control vehicular, tolerancias, eventos) con scripts inteligentes en BigQuery. Los LLMs permiten análisis conversacional y dashboards ejecutivos automáticos.',
    results: [
      'Pipeline automatizado: CSV → BigQuery (proceso 1-click)',
      'Análisis conversacional de datos empresariales con IA',
      'Dashboards ejecutivos generados automáticamente',
      'Integración múltiple: vehicular, tolerancias, eventos'
    ],
    technologies: ['BigQuery', 'Python Scripts', 'LLM Integration', 'Power BI', 'Cloud Storage'],
    icon: Database,
    color: "secondary",
    metrics: {
      before: "Proceso manual 5 pasos",
      after: "Automatizado 1-click",
      improvement: "Análisis IA conversacional"
    },
    imageUrl: "https://publicidad-zaimella.vercel.app/base-datos-LLM.png"
  },
  {
    id: 3,
    title: 'Herramientas RAG Empresariales',
    client: 'Plataforma Multi-Cliente',
    category: 'Agentes de IA',
    description: 'Sistema avanzado RAG multi-estrategia que procesa documentos empresariales y permite consultas inteligentes. Arquitectura escalable en Google Cloud Run con múltiples LLMs integrados.',
    results: [
      'RAG multi-estrategia: básica, avanzada, ensemble',
      'Latencia < 2 segundos, 1000+ consultas/minuto',
      'Disponibilidad 99.9% en Google Cloud Run',
      'Integración: OpenAI, Claude, Cohere, bases vectoriales'
    ],
    technologies: ['Google Cloud Run', 'OpenAI', 'Claude API', 'Qdrant', 'Python Flask'],
    icon: Brain,
    color: "accent",
    metrics: {
      before: "Búsqueda manual documentos",
      after: "< 2s latencia, 1000+ consultas/min",
      improvement: "99.9% disponibilidad"
    },
    imageUrl: "https://publicidad-zaimella.vercel.app/herramientas-RAG.png"
  },
  {
    id: 4,
    title: 'Publicidad Empresa: Hosting + IA Generativa',
    client: 'Plataforma Híbrida SaaS',
    category: 'Plataformas Empresariales',
    description: 'Plataforma única que combina hosting estático de imágenes con generación de contenido mediante IA. URLs permanentes + creación automática con FLUX.1 y Veo 3 en arquitectura serverless.',
    results: [
      'Plataforma híbrida: hosting tradicional + IA generativa',
      'URLs públicas permanentes con CDN global',
      'Generación automática: imágenes (FLUX.1) y videos (Veo 3)',
      'Arquitectura serverless escalable en Vercel'
    ],
    technologies: ['Vercel Serverless', 'Replicate API', 'FLUX.1', 'Veo 3', 'OpenRouter'],
    icon: Zap,
    color: "primary",
    metrics: {
      before: "Hosting + IA por separado",
      after: "Plataforma híbrida unificada",
      improvement: "CDN global + serverless"
    },
    imageUrl: "https://publicidad-zaimella.vercel.app/generador-imagenes.png"
  },
  {
    id: 5,
    title: 'WhatsApp Chatbot Enterprise',
    client: 'Arquitectura Microservicios',
    category: 'Agentes de IA',
    description: 'Chatbot empresarial completo con arquitectura de microservicios. GPT-4, procesamiento multimedia, Google Calendar, memoria persistente y monitoreo con Prometheus + Grafana.',
    results: [
      'Arquitectura microservicios enterprise-ready',
      'Multimedia: texto, voz (Whisper), imágenes (Vision)',
      'Integración: Google Calendar, Gmail, memoria Zep',
      'Monitoreo producción: Prometheus + Grafana'
    ],
    technologies: ['Docker', 'TypeScript', 'GPT-4', 'MongoDB', 'PostgreSQL', 'Redis'],
    icon: MessageSquare,
    color: "secondary",
    metrics: {
      before: "Chatbot simple",
      after: "Plataforma empresarial",
      improvement: "Múltiples usuarios simultáneos"
    },
    imageUrl: "https://publicidad-zaimella.vercel.app/chatbot-empresarial.png"
  }
];

// Categorías actualizadas basadas en la experiencia real de Alex
const categories = ['Todos', 'Optimización de Procesos', 'Análisis de Datos', 'Agentes de IA', 'Plataformas Empresariales'];

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = {
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

const iconColorClasses = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'Todos') return allProjects;
    return allProjects.filter(project => project.category === activeFilter);
  }, [activeFilter]);

  return (
    <motion.div 
      className="py-12 md:py-20 container-max"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Título y descripción */}
      <motion.div 
        className="text-center mb-12 md:mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-h1 font-extrabold mb-4">
          Casos <span className="text-secondary">Reales</span> de Impacto
        </h1>
        <p className="text-h3 text-gray-300 max-w-3xl mx-auto font-normal">
          Resultados medibles en proyectos reales. Cada caso incluye métricas específicas, herramientas implementadas y el impacto cuantificable en la organización.
        </p>
      </motion.div>

      {/* Filtros de categorías */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {categories.map(category => (
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

      {/* Grid de proyectos */}
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
                    alt={`Dashboard del proyecto ${project.title}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                   />
                   <div className={`absolute top-2 right-2 p-2 rounded-md bg-${project.color}/80 backdrop-blur-sm`}>
                      <project.icon className={`h-6 w-6 text-white`} />
                   </div>
                </div>
                
                <h2 className={`text-xl font-semibold text-${project.color} mb-1`}>{project.title}</h2>
                <p className="text-xs text-gray-400 mb-3 font-medium">Cliente: {project.client} | {project.category}</p>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed flex-grow">{project.description}</p>
                
                {/* Métricas destacadas */}
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
                  <h3 className="text-sm font-semibold text-gray-200 mb-2">Herramientas:</h3>
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
                    Implementar Similar <ExternalLink className="ml-1.5 h-4 w-4" />
                  </NavLink>
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Metodología de Resultados */}
      <motion.div 
        className="mb-16 md:mb-24 mt-16 md:mt-24 glass-card p-8 md:p-12 border-accent/30"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <h2 className="text-h2 font-bold text-center mb-8 text-text-light">
          Por qué Mis Casos son <span className="text-accent">Diferentes</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-accent mb-2">Casos Reales</h3>
            <p className="text-gray-300 text-sm">No son ejemplos teóricos. Son proyectos que implementé personalmente con resultados verificables.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart2 className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-accent mb-2">Métricas Concretas</h3>
            <p className="text-gray-300 text-sm">Cada caso incluye números específicos: tiempos, porcentajes de mejora, ROI calculado.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-accent mb-2">Transparencia Total</h3>
            <p className="text-gray-300 text-sm">Muestro exactamente cómo logré cada resultado, qué herramientas usé y qué obstáculos superé.</p>
          </div>
        </div>
      </motion.div>

      {/* CTA final */}
      <motion.div 
        className="mt-16 md:mt-24 text-center glass-card p-8 md:p-12 border-secondary/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <Award className="h-16 w-16 text-secondary mx-auto mb-6" />
        <h2 className="text-h2 font-bold text-text-light mb-4">¿Necesitas Resultados Similares?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
          Mi experiencia se traduce en resultados medibles. Si tienes procesos caóticos o datos dispersos, podemos replicar estos resultados en tu organización.
        </p>
        <Button asChild size="lg" className="btn btn-secondary text-lg py-4 px-8">
          <NavLink to="/contact">
            Analizar Mi Situación <BarChart2 className="ml-2 h-5 w-5" />
          </NavLink>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProjectsPage;