import React from 'react';
    import { motion } from 'framer-motion';
    import { Users, Brain, TrendingUp, ShieldCheck, Lightbulb, Award, BarChartHorizontalBig, CloudCog } from 'lucide-react';
    import CountUp from 'react-countup';

    const teamMembers = [
      {
        name: 'Dr. Ada Lovelace',
        role: 'CEO & IA Visionary',
        bio: 'Pionera en la aplicación estratégica de IA, con más de 15 años de experiencia liderando equipos de alta tecnología y proyectos innovadores en Google Cloud.',
        imageUrl: 'https://images.unsplash.com/photo-1580894908361-967195033215',
        imgReplaceText: 'Retrato profesional de Dr. Ada Lovelace, CEO, sonriendo con confianza en un entorno de oficina moderno.'
      },
      {
        name: 'Alan Turing',
        role: 'CTO & Lead AI Architect',
        bio: 'Experto en arquitecturas de IA complejas y desarrollo de modelos de aprendizaje profundo. Apasionado por resolver desafíos técnicos con soluciones elegantes y eficientes.',
        imageUrl: 'https://images.unsplash.com/photo-1610216705422-caa3fc269d98',
        imgReplaceText: 'Retrato profesional de Alan Turing, CTO, con expresión pensativa, delante de un fondo con código y diagramas de flujo.'
      },
      {
        name: 'Grace Hopper',
        role: 'Head of Cloud Solutions',
        bio: 'Especialista en Google Cloud Platform, certificada en múltiples disciplinas. Lidera la implementación y optimización de infraestructuras cloud para soluciones de IA escalables.',
        imageUrl: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0',
        imgReplaceText: 'Retrato profesional de Grace Hopper, Head of Cloud Solutions, en un centro de datos con servidores de fondo.'
      },
    ];

    const stats = [
      { value: 50, label: 'Proyectos Completados', icon: Award, suffix: '+' },
      { value: 98, label: 'Satisfacción del Cliente', icon: Users, suffix: '%' },
      { value: 10, label: 'Años de Experiencia en IA', icon: Brain, suffix: '+' },
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
          <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
            <h1 className="text-h1 font-extrabold mb-4">
              Conoce a <span className="text-primary">AI Solutions Corp</span>
            </h1>
            <p className="text-h3 text-gray-300 max-w-3xl mx-auto font-normal">
              Somos un equipo apasionado de expertos en Inteligencia Artificial, dedicados a transformar negocios con tecnología de vanguardia y un profundo conocimiento del ecosistema Google Cloud.
            </p>
          </motion.div>

          {/* Z-Pattern Layout Section 1: Misión */}
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

          {/* Z-Pattern Layout Section 2: Visión */}
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

          {/* Stats Section */}
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
          
          {/* Expertise Section */}
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


          {/* Team Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-h2 font-bold text-center mb-8 md:mb-12 text-text-light">
              Conoce a Nuestro <span className="text-secondary">Equipo Directivo</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-10">
              {teamMembers.map((member) => (
                <motion.div 
                  key={member.name} 
                  className="glass-card p-6 text-center border-secondary/30"
                  whileHover={cardHoverEffect}
                >
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-5 border-4 border-secondary shadow-lg">
                     <img  
                      alt={member.imgReplaceText}
                      className="w-full h-full object-cover"
                     src={member.imageUrl} />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-1">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      );
    };

    export default AboutPage;