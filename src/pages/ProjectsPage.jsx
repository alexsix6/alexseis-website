import React, { useState, useMemo } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { CheckCircle, BarChart2, Users, Briefcase, Award, Filter, ExternalLink } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { NavLink } from 'react-router-dom';

    const allProjects = [
      {
        id: 1,
        title: 'Optimización de Cadena de Suministro con IA Predictiva',
        client: 'Empresa Logística Global',
        category: 'Google Cloud',
        description: 'Desarrollamos un sistema de IA que predice la demanda y optimiza rutas de envío, utilizando BigQuery para análisis de grandes volúmenes de datos y Cloud Run para el despliegue escalable del modelo.',
        results: [
          'Reducción del 15% en costos de combustible.',
          'Mejora del 20% en tiempos de entrega.',
        ],
        technologies: ['Google BigQuery', 'Cloud Run', 'Python', 'TensorFlow'],
        icon: BarChart2,
        color: "primary",
        imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095"
      },
      {
        id: 2,
        title: 'Agente Virtual Inteligente para Soporte al Cliente',
        client: 'Compañía de SaaS',
        category: 'GPT & LLM',
        description: 'Implementamos un agente conversacional basado en un GPT personalizado, capaz de resolver el 80% de las consultas de soporte de primer nivel, integrado con su base de conocimientos y sistemas CRM.',
        results: [
          'Disminución del 30% en el volumen de tickets de soporte.',
          'Resolución instantánea para el 80% de las consultas comunes.',
        ],
        technologies: ['ChatGPT API', 'LangChain', 'Vector DBs', 'Node.js'],
        icon: Users,
        color: "secondary",
        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485"
      },
      {
        id: 3,
        title: 'Automatización de Procesos Documentales con IA',
        client: 'Firma Legal',
        category: 'Claude & MCP',
        description: 'Construimos una solución de IA para extraer información clave de documentos legales y contratos, utilizando Claude para el procesamiento de lenguaje natural avanzado y Google Cloud Storage para el almacenamiento seguro.',
        results: [
          'Reducción del 70% en el tiempo de procesamiento manual.',
          'Precisión superior al 95% en la extracción de datos.',
        ],
        technologies: ['Claude API', 'Google Vision AI', 'Python', 'GCS'],
        icon: Briefcase,
        color: "accent",
        imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216"
      },
       {
        id: 4,
        title: 'Sistema de Recomendación para E-commerce',
        client: 'Retailer Online',
        category: 'Google Cloud',
        description: 'Desarrollo de un motor de recomendaciones personalizado usando Vertex AI, aumentando la tasa de conversión y el valor promedio del pedido.',
        results: [
          'Aumento del 25% en la tasa de clics de productos recomendados.',
          'Incremento del 12% en el valor promedio del pedido.',
        ],
        technologies: ['Vertex AI', 'BigQuery ML', 'Python', 'Docker'],
        icon: BarChart2,
        color: "primary",
        imageUrl: "https://images.unsplash.com/photo-1556740714-a8395b3bf30f"
      },
      {
        id: 5,
        title: 'Chatbot de Ventas Avanzado con GPT-4',
        client: 'Agencia Inmobiliaria',
        category: 'GPT & LLM',
        description: 'Creación de un chatbot que califica leads, agenda visitas y responde preguntas frecuentes, mejorando la eficiencia del equipo de ventas.',
        results: [
          'Aumento del 40% en la calificación de leads.',
          'Reducción del tiempo de respuesta a clientes en un 60%.',
        ],
        technologies: ['GPT-4 API', 'FastAPI', 'React', 'Supabase'],
        icon: Users,
        color: "secondary",
        imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f"
      }
    ];
    
    const categories = ['Todos', 'Google Cloud', 'GPT & LLM', 'Claude & MCP'];

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
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-h1 font-extrabold mb-4">
              Nuestros <span className="text-secondary">Proyectos</span> Destacados
            </h1>
            <p className="text-h3 text-gray-300 max-w-3xl mx-auto font-normal">
              Descubre cómo hemos ayudado a empresas a alcanzar sus objetivos con soluciones de IA innovadoras y personalizadas.
            </p>
          </motion.div>

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
                        alt={`Visualización del proyecto ${project.title}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                       />
                       <div className={`absolute top-2 right-2 p-2 rounded-md bg-${project.color}/80 backdrop-blur-sm`}>
                          <project.icon className={`h-6 w-6 text-white`} />
                       </div>
                    </div>
                    <h2 className={`text-xl font-semibold text-${project.color} mb-1`}>{project.title}</h2>
                    <p className="text-xs text-gray-400 mb-3 font-medium">Cliente: {project.client} | Categoría: {project.category}</p>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed flex-grow">{project.description}</p>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-200 mb-1">Resultados Clave:</h3>
                      <ul className="space-y-1">
                        {project.results.map((result, i) => (
                          <li key={i} className="flex items-start text-xs text-gray-300">
                            <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-accent flex-shrink-0" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-200 mb-2">Tecnologías:</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <span 
                            key={i} 
                            className={`px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700/70 text-gray-300`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                     <Button asChild size="sm" variant="link" className={`mt-4 text-${project.color} hover:text-${project.color}/80 self-start px-0`}>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          Ver Estudio de Caso <ExternalLink className="ml-1.5 h-4 w-4" />
                        </a>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            className="mt-16 md:mt-24 text-center glass-card p-8 md:p-12 border-secondary/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Award className="h-16 w-16 text-secondary mx-auto mb-6" />
            <h2 className="text-h2 font-bold text-text-light mb-4">Listos para tu Próximo Desafío</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
              Nuestra experiencia se traduce en resultados. Permítenos ser tu socio estratégico en la implementación de soluciones de IA que marquen la diferencia.
            </p>
            <Button asChild size="lg" className="btn btn-secondary text-lg py-4 px-8">
              <NavLink to="/contact">
                Hablemos de tu Proyecto <BarChart2 className="ml-2 h-5 w-5" />
              </NavLink>
            </Button>
          </motion.div>
        </motion.div>
      );
    };

    export default ProjectsPage;