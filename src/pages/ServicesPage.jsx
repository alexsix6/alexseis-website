import React from 'react';
    import { motion } from 'framer-motion';
    import { Bot, CloudCog, Activity, MessageSquarePlus, Zap, Brain, BarChart, Settings2, ArrowRight } from 'lucide-react';
    import { NavLink } from 'react-router-dom';
    import { Button } from '@/components/ui/button';

    const services = [
      {
        icon: Bot,
        title: 'Desarrollo de Agentes de IA Personalizados',
        description: 'Creamos agentes inteligentes que automatizan tareas, interactúan con usuarios y optimizan flujos de trabajo complejos, adaptados específicamente a tus necesidades.',
        color: 'primary',
      },
      {
        icon: CloudCog,
        title: 'Consultoría y Soluciones en Google Cloud',
        description: 'Maximizamos el potencial de Google Cloud para tu negocio, implementando soluciones robustas en BigQuery, Cloud Run y asegurando el acceso con configuraciones SSH seguras.',
        color: 'secondary',
      },
      {
        icon: Activity,
        title: 'Integración de IA en Procesos Empresariales',
        description: 'Identificamos oportunidades para aplicar IA en tus operaciones, mejorando la eficiencia, la toma de decisiones y la experiencia del cliente.',
        color: 'accent',
      },
      {
        icon: MessageSquarePlus,
        title: 'Desarrollo de GPTs y Conexión con Claude',
        description: 'Construimos GPTs personalizados en la plataforma ChatGPT y desarrollamos soluciones con MCP para conectar a Claude Desktop, expandiendo tus capacidades conversacionales.',
        color: 'primary',
      },
      {
        icon: Zap,
        title: 'Optimización de Modelos de IA',
        description: 'Mejoramos el rendimiento, la eficiencia y la escalabilidad de tus modelos de IA existentes, asegurando que operen al máximo potencial.',
        color: 'secondary',
      },
      {
        icon: BarChart,
        title: 'Análisis Avanzado de Datos con IA',
        description: 'Transformamos tus datos en insights accionables utilizando técnicas de IA, para una toma de decisiones más inteligente y estratégica.',
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
          <div className="text-center mb-12 md:mb-16">
            <motion.h1 
              className="text-h1 font-extrabold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Nuestros <span className="text-primary">Servicios</span> de IA Especializados
            </motion.h1>
            <motion.p 
              className="text-h3 text-gray-300 max-w-3xl mx-auto font-normal"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Soluciones innovadoras para transformar tu empresa con el poder de la Inteligencia Artificial y la nube.
            </motion.p>
          </div>

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
          
          <motion.div 
            className="mt-16 md:mt-24 text-center glass-card p-8 md:p-12 border-primary/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: services.length * 0.1 + 0.2 }}
          >
            <Brain className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-h2 font-bold text-text-light mb-4">¿Tienes un Desafío Único?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
              Nos especializamos en crear soluciones de IA a medida. Si tienes una idea o un problema complejo, contáctanos para explorar cómo podemos ayudarte.
            </p>
            <Button asChild size="lg" className="btn btn-primary text-lg py-4 px-8">
              <NavLink to="/contact">
                Hablemos de Tu Proyecto <ArrowRight className="ml-2 h-5 w-5" />
              </NavLink>
            </Button>
          </motion.div>
        </motion.div>
      );
    };

    export default ServicesPage;