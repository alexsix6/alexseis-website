import React from 'react';
import { motion } from 'framer-motion';
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
    BarChart2, // Nuevo icono necesario
    Clock,     // Nuevo icono necesario
    Database,  // Nuevo icono necesario
    Target     // Nuevo icono necesario
} from 'lucide-react';
import CountUp from 'react-countup';

// Nuevas estadísticas con métricas reales de Alex
const stats = [
  { value: 700, label: 'Mejora en Mi Productividad Personal', icon: TrendingUp, suffix: '%' },
  { value: 95, label: 'Reducción Promedio en Tiempos', icon: Clock, suffix: '%' },
  { value: 15, label: 'Años Optimizando Procesos', icon: Award, suffix: '+' },
];

// Nuevos valores enfocados en la metodología "Lo que se mide, se mejora"
const values = [
  { 
    icon: BarChart2,
    title: 'Resultados Medibles', 
    description: 'Cada proyecto debe generar métricas concretas de mejora. Si no se puede medir, no se puede mejorar.',
    color: 'primary'
  },
  { 
    icon: ShieldCheck, 
    title: 'Transparencia Total', 
    description: 'Muestro exactamente cómo obtuve cada resultado. Casos reales, datos reales, impacto real.',
    color: 'secondary'
  },
  { 
    icon: Zap, 
    title: 'Eficiencia Comprobada', 
    description: 'Mi propia productividad aumentó 700%: lo que hacía en una semana, ahora lo resuelvo en un día.',
    color: 'accent'
  },
];

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardHoverEffect = {
  y: -8,
  scale: 1.03,
  boxShadow: "0 12px 32px rgba(var(--primary-rgb), 0.3)",
  transition: { duration: 0.3, type: "spring", stiffness: 200 }
};

const AboutPage = () => {
  return (
    <motion.div 
      className="py-12 md:py-20 container-max"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Sección de Introducción - TRANSFORMADA */}
      <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
        <h1 className="text-h1 font-extrabold mb-4">
          Conoce a <span className="text-primary">Alex Seis</span>
        </h1>
        <p className="text-h3 text-gray-300 max-w-3xl mx-auto font-normal">
          Arquitecto de Sistemas de Decisión con experiencia comprobada transformando procesos caóticos en operaciones medibles. Especializado en RRHH y Seguridad Física, he desarrollado una metodología única que convierte datos dispersos en inteligencia empresarial accionable.
        </p>
      </motion.div>

      {/* Sección: Mi Historia - TRANSFORMADA */}
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
            Ahí nació mi especialización.
          </p>
          <ul className="mt-6 space-y-2 text-gray-300">
            <li className="flex items-center"><Target size={20} className="text-accent mr-2"/> Enfoque en problemas reales, no tecnología por tecnología</li>
            <li className="flex items-center"><BarChart2 size={20} className="text-accent mr-2"/> Todo debe ser medible y generar ROI tangible</li>
            <li className="flex items-center"><Brain size={20} className="text-accent mr-2"/> Experiencia práctica en RRHH y Seguridad Física</li>
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

      {/* Sección: Metodología "Lo que se mide, se mejora" - TRANSFORMADA */}
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
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-secondary font-bold text-sm">1</span>
              </div>
              <div>
                <p className="text-gray-300"><strong className="text-secondary">Auditar</strong> tus datos actuales (identificar el caos)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-secondary font-bold text-sm">2</span>
              </div>
              <div>
                <p className="text-gray-300"><strong className="text-secondary">Estructurar</strong> la información crítica</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-secondary font-bold text-sm">3</span>
              </div>
              <div>
                <p className="text-gray-300"><strong className="text-secondary">Automatizar</strong> la recolección y análisis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-secondary font-bold text-sm">4</span>
              </div>
              <div>
                <p className="text-gray-300"><strong className="text-secondary">Medir</strong> resultados en tiempo real</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-secondary font-bold text-sm">5</span>
              </div>
              <div>
                <p className="text-gray-300"><strong className="text-secondary">Optimizar</strong> basado en datos concretos</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* NUEVA SECCIÓN: Casos de Impacto Real */}
      <motion.div variants={itemVariants} className="mb-12 md:mb-20">
        <h2 className="text-h2 font-bold text-center mb-8 md:mb-12 text-text-light">
          Casos de <span className="text-accent">Impacto Real</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <motion.div 
            className="glass-card p-6 border-primary/30"
            whileHover={cardHoverEffect}
          >
            <div className="inline-block p-3 rounded-lg bg-primary/10 mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary">Controles Clave: De Caos a Control Total</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Situación:</strong> Problemas no identificados de fondo</p>
              <p><strong>Solución:</strong> Reestructuré procesos y datos entre áreas</p>
              <p><strong>Resultado:</strong> Reducción a 2-6 días máximo (95% mejora)</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 border-secondary/30"
            whileHover={cardHoverEffect}
          >
            <div className="inline-block p-3 rounded-lg bg-secondary/10 mb-4">
              <Users className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-secondary">Análisis de Colaboradores: Predicción de Problemas</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Situación:</strong> Reincidencias en eventos de seguridad</p>
              <p><strong>Solución:</strong> Dashboard predictivo con análisis de patrones</p>
              <p><strong>Resultado:</strong> Identificación proactiva de colaboradores problemáticos</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Sección: Valores - TRANSFORMADA */}
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

      {/* Sección: Stats - TRANSFORMADA */}
      <motion.div variants={itemVariants} className="mb-12 md:mb-20 glass-card p-6 md:p-10">
        <h2 className="text-h2 font-bold text-center mb-8 md:mb-12 text-text-light">
          Mi Impacto en <span className="text-accent">Números</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="bg-bg-dark/50 p-6 rounded-xl shadow-medium text-center border border-glass-border"
              whileHover={{ y: -5, boxShadow: "0 8px 20px rgba(var(--accent-rgb), 0.2)"}}
            >
              <stat.icon className={`h-12 w-12 text-accent mx-auto mb-4`} />
              <div className="text-4xl font-extrabold text-text-light mb-1">
                <CountUp end={stat.value} duration={3} suffix={stat.suffix} enableScrollSpy scrollSpyOnce/>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Sección: Mi Especialización - TRANSFORMADA */}
      <motion.div variants={itemVariants} className="mb-12 md:mb-20">
        <h2 className="text-h2 font-bold text-center mb-8 md:mb-12 text-text-light">
          Mi <span className="text-primary">Especialización</span> Única
        </h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            { 
              icon: Database, 
              title: 'Arquitectura de Datos', 
              description: 'Diseño estructuras de datos optimizadas que soportan análisis profundos y automatización inteligente.', 
              color: 'primary' 
            },
            { 
              icon: BarChart2, 
              title: 'Análisis Predictivo', 
              description: 'Creo dashboards que no solo muestran qué pasó, sino que predicen qué va a pasar.', 
              color: 'secondary' 
            },
            { 
              icon: Target, 
              title: 'RRHH y Seguridad Física', 
              description: 'Experiencia específica en estas áreas me permite identificar oportunidades que otros no ven.', 
              color: 'accent' 
            },
          ].map((item, index) => (
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