import React from 'react';
import { motion } from 'framer-motion';
import { 
    Bot, CloudCog, Activity, MessageSquarePlus, Zap, Brain, BarChart, Settings2, ArrowRight,
    Search,      // Nuevo icono necesario
    Database,    // Nuevo icono necesario
    BarChart3,   // Nuevo icono necesario
    TrendingUp,  // Nuevo icono necesario
    Users        // Nuevo icono necesario
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Nuevos servicios enfocados en la metodología específica de Alex
const services = [
  {
    icon: Search,
    title: 'Auditoría de Datos y Procesos',
    description: 'Análisis completo de tus datos actuales, identificación de ineficiencias y mapeo de oportunidades de mejora. Incluye diagnóstico de bases de datos dispersas y procesos manuales.',
    color: 'primary',
  },
  {
    icon: Database,
    title: 'Estructuración de Bases de Datos',
    description: 'Diseño e implementación de arquitecturas de datos optimizadas. Consolido información dispersa en sistemas estructurados que facilitan análisis y automatización.',
    color: 'secondary',
  },
  {
    icon: BarChart3,
    title: 'Dashboards de Análisis en Tiempo Real',
    description: 'Desarrollo de sistemas de visualización que convierten datos complejos en insights accionables. Métricas claras, alertas automáticas y reportes ejecutivos.',
    color: 'accent',
  },
  {
    icon: Zap,
    title: 'Automatización de Procesos Críticos',
    description: 'Implementación de flujos automatizados que eliminan tareas manuales repetitivas. Integración con IA para decisiones inteligentes y escalabilidad.',
    color: 'primary',
  },
  {
    icon: TrendingUp,
    title: 'Optimización Continua Basada en Datos',
    description: 'Monitoreo constante de KPIs, identificación de nuevas oportunidades y ajustes basados en resultados medibles. Garantizo mejora continua.',
    color: 'secondary',
  },
  {
    icon: Users,
    title: 'Capacitación y Adopción del Equipo',
    description: 'Entrenamiento especializado para tu equipo en el uso de nuevos sistemas. Aseguro que toda la organización aproveche las mejoras implementadas.',
    color: 'accent',
  },
];

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
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

const borderColorClasses = {
  primary: "border-primary/50",
  secondary: "border-secondary/50",
  accent: "border-accent/50",
};

const ServicesPage = () => {
  return (
    <motion.div 
      className="py-12 md:py-20 container-max"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Título y descripción - TRANSFORMADO */}
      <div className="text-center mb-12 md:mb-16">
        <motion.h1 
          className="text-h1 font-extrabold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Mi <span className="text-primary">Metodología</span> de Optimización
        </motion.h1>
        <motion.p 
          className="text-h3 text-gray-300 max-w-3xl mx-auto font-normal"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Proceso probado para transformar datos caóticos en sistemas de decisión que generan resultados medibles. Cada paso está diseñado para maximizar el ROI y minimizar la resistencia al cambio.
        </motion.p>
      </div>

      {/* Grid de servicios - TRANSFORMADO */}
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
              <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">{service.description}</p>
              <Button asChild size="sm" variant="outline" className={`mt-auto btn btn-outline border-${service.color} text-${service.color} hover:bg-${service.color} hover:text-bg-dark w-full`}>
                <NavLink to="/contact">
                  Saber Más <Settings2 className="ml-2 h-4 w-4" />
                </NavLink>
              </Button>
              <div className={`absolute bottom-0 left-0 h-1 w-0 bg-${service.color} group-hover:w-full transition-all duration-500 ease-out`}></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* NUEVA SECCIÓN: Proceso Paso a Paso */}
      <motion.div 
        className="mb-16 md:mb-24 mt-16 md:mt-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <h2 className="text-h2 font-bold text-center mb-8 md:mb-12 text-text-light">
          Mi Proceso <span className="text-primary">Probado</span>
        </h2>
        <div className="space-y-8">
          {[
            { 
              step: "01", 
              title: "Diagnóstico Profundo", 
              desc: "Análisis completo de tus datos, procesos y sistemas actuales. Identifico exactamente dónde está el problema.",
              icon: Search,
              color: "primary"
            },
            { 
              step: "02", 
              title: "Diseño de Arquitectura", 
              desc: "Creo la estructura de datos optimizada que soportará todos los análisis y automatizaciones futuras.",
              icon: Database,
              color: "secondary"
            },
            { 
              step: "03", 
              title: "Implementación Gradual", 
              desc: "Desarrollo por fases para minimizar interrupciones. Cada etapa genera resultados medibles inmediatos.",
              icon: Zap,
              color: "accent"
            },
            { 
              step: "04", 
              title: "Medición y Optimización", 
              desc: "Monitoreo constante de KPIs y ajustes basados en datos reales. Garantizo mejora continua.",
              icon: TrendingUp,
              color: "primary"
            }
          ].map((item, index) => (
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

      {/* CTA final - TRANSFORMADO */}
      <motion.div 
        className="mt-16 md:mt-24 text-center glass-card p-8 md:p-12 border-primary/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: services.length * 0.1 + 0.2 }}
      >
        <Database className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="text-h2 font-bold text-text-light mb-4">¿Tus Datos Están Dispersos?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
          Si pierdes tiempo buscando información, si tus reportes toman días en lugar de minutos, 
          o si sientes que tus datos no te están ayudando a tomar mejores decisiones, hablemos.
        </p>
        <Button asChild size="lg" className="btn btn-primary text-lg py-4 px-8">
          <NavLink to="/contact">
            Diagnosticar Mi Situación <ArrowRight className="ml-2 h-5 w-5" />
          </NavLink>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ServicesPage;