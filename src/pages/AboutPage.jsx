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
    HeartHandshake, // Ejemplo de ícono para un valor
    Zap,            // Ejemplo de ícono para un valor
    Puzzle        // Ejemplo de ícono para un valor
} from 'lucide-react';
import CountUp from 'react-countup';

// El array 'teamMembers' ha sido eliminado.

const stats = [
  { value: 50, label: 'Proyectos Completados', icon: Award, suffix: '+' },
  { value: 98, label: 'Satisfacción del Cliente', icon: Users, suffix: '%' },
  { value: 10, label: 'Años de Experiencia en IA', icon: Brain, suffix: '+' },
];

// Ejemplo de datos para la nueva sección de Valores
const values = [
  { 
    icon: Lightbulb, // Reutilizando Lightbulb o puedes elegir otro más específico
    title: 'Innovación Constante', 
    description: 'Abrazamos el cambio y la experimentación para estar siempre a la vanguardia tecnológica, ofreciendo soluciones creativas y efectivas.',
    color: 'primary' // Usará el color primario definido en tu CSS/Tailwind
  },
  { 
    icon: HeartHandshake, 
    title: 'Compromiso con el Cliente', 
    description: 'Construimos relaciones sólidas basadas en la confianza, la transparencia y la dedicación para superar las expectativas de nuestros socios.',
    color: 'secondary' // Usará el color secundario
  },
  { 
    icon: ShieldCheck, // Reutilizando ShieldCheck o puedes elegir otro
    title: 'Ética e Integridad', 
    description: 'Operamos con los más altos estándares éticos, asegurando un desarrollo y aplicación responsable de la inteligencia artificial.',
    color: 'accent' // Usará el color de acento
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
  boxShadow: "0 12px 32px rgba(var(--primary-rgb), 0.3)", // Asegúrate que --primary-rgb esté definido
  transition: { duration: 0.3, type: "spring", stiffness: 200 }
};

const AboutPage = () => {
  return (
    <motion.div 
      className="py-12 md:py-20 container-max" // Asumo container-max definido
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Sección de Introducción */}
      <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
        <h1 className="text-h1 font-extrabold mb-4">
          Conoce a <span className="text-primary">AI Solutions Corp</span>
        </h1>
        <p className="text-h3 text-gray-300 max-w-3xl mx-auto font-normal">
          Somos un equipo apasionado de expertos en Inteligencia Artificial, dedicados a transformar negocios con tecnología de vanguardia y un profundo conocimiento del ecosistema Google Cloud.
        </p>
      </motion.div>

      {/* Sección: Misión */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20 items-center">
        <div className="order-1">
          <h2 className="text-h2 font-bold text-primary mb-4 flex items-center">
            <Lightbulb className="mr-3 h-10 w-10" /> Nuestra Misión
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Empoderar a las empresas con soluciones de IA personalizadas que impulsen la innovación, optimicen la eficiencia y generen un crecimiento sostenible. Creemos en el poder transformador de la IA para resolver los desafíos más complejos y crear un futuro más inteligente.
          </p>
          <ul className="mt-6 space-y-2 text-gray-300">
            <li className="flex items-center"><ShieldCheck size={20} className="text-accent mr-2"/> Soluciones a medida y escalables.</li>
            <li className="flex items-center"><TrendingUp size={20} className="text-accent mr-2"/> Enfoque en resultados tangibles.</li>
            <li className="flex items-center"><Brain size={20} className="text-accent mr-2"/> Innovación constante y ética.</li>
          </ul>
        </div>
        <motion.div 
          className="order-2 md:order-1 w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-strong"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
            <img  
            alt="Equipo de IA colaborando en un proyecto innovador con post-its y diagramas"
            className="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1552664730-d307ca884978" />
        </motion.div>
      </motion.div>

      {/* Sección: Visión */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20 items-center">
        <motion.div 
          className="order-1 md:order-2 w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-strong"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
            <img  
            alt="Visión futurista de una ciudad inteligente conectada por IA"
            className="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9" />
        </motion.div>
        <div className="order-2 md:order-1">
          <h2 className="text-h2 font-bold text-secondary mb-4 flex items-center">
            <TrendingUp className="mr-3 h-10 w-10" /> Nuestra Visión
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Ser líderes en el desarrollo de agentes de IA y soluciones en la nube, reconocidos por nuestra excelencia técnica, enfoque en el cliente y contribución al avance de la inteligencia artificial aplicada. Aspiramos a ser el socio tecnológico preferido para empresas que buscan la vanguardia.
          </p>
            <p className="mt-4 text-gray-400 leading-relaxed">
            Nos vemos como catalizadores del cambio, ayudando a las organizaciones a navegar la complejidad de la IA y a cosechar sus beneficios estratégicos.
          </p>
        </div>
      </motion.div>

      {/* NUEVA SECCIÓN: Nuestros Valores */}
      <motion.div variants={itemVariants} className="mb-12 md:mb-20">
        <h2 className="text-h2 font-bold text-center mb-8 md:mb-12 text-text-light">
          Los <span className="text-primary">Principios</span> que nos Definen
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {values.map((value, index) => (
            <motion.div 
              key={index} 
              className={`glass-card p-6 text-center border-${value.color}/30`} // Asume que glass-card y border-color/30 están definidos
              whileHover={cardHoverEffect}
            >
              <div className={`inline-block p-4 rounded-lg bg-${value.color}/10 mb-4`}> {/* Asume bg-color/10 definido */}
                <value.icon className={`h-12 w-12 text-${value.color}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 text-${value.color}`}>{value.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sección: Stats */}
      <motion.div variants={itemVariants} className="mb-12 md:mb-20 glass-card p-6 md:p-10">
        <h2 className="text-h2 font-bold text-center mb-8 md:mb-12 text-text-light">
          Nuestro Impacto en <span className="text-accent">Números</span>
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
      
      {/* Sección: Expertise */}
      <motion.div variants={itemVariants} className="mb-12 md:mb-20">
        <h2 className="text-h2 font-bold text-center mb-8 md:mb-12 text-text-light">
          Nuestra <span className="text-primary">Expertise</span> Fundamental
        </h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: Brain, title: 'IA Avanzada y ML', description: 'Dominio de Machine Learning, Deep Learning, NLP y desarrollo de agentes autónomos.', color: 'primary' },
            { icon: CloudCog, title: 'Google Cloud Pro', description: 'Expertos en BigQuery, Cloud Run, Vertex AI y arquitecturas seguras en GCP.', color: 'secondary' },
            { icon: BarChartHorizontalBig, title: 'Soluciones B2B Estratégicas', description: 'Enfoque en la creación de valor tangible para empresas, optimizando procesos y resultados.', color: 'accent' },
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

      {/* La sección del Equipo Directivo ha sido eliminada. */}

    </motion.div>
  );
};

export default AboutPage;