import React, { useEffect, useState } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { ArrowRight, ChevronDown } from 'lucide-react';
    import { NavLink } from 'react-router-dom';
    import { Agent3D } from '../components/Agent3D';

    const headlines = [
      "Agentes de IA Inteligentes",
      "Soluciones Google Cloud",
      "Transformación Digital",
      "Optimización de Procesos"
    ];

    const HomePage = () => {
      const [currentHeadline, setCurrentHeadline] = useState(0);
      const [typedText, setTypedText] = useState('');

      useEffect(() => {
        let charIndex = 0;
        let headlineIndex = 0;
        let isDeleting = false;
        let typingTimeout;

        const type = () => {
          const fullText = headlines[headlineIndex];
          if (isDeleting) {
            setTypedText(fullText.substring(0, charIndex -1));
            charIndex--;
          } else {
            setTypedText(fullText.substring(0, charIndex + 1));
            charIndex++;
          }

          if (!isDeleting && charIndex === fullText.length) {
            isDeleting = true;
            typingTimeout = setTimeout(type, 2000); // Pause at end
          } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            headlineIndex = (headlineIndex + 1) % headlines.length;
            setCurrentHeadline(headlineIndex);
            typingTimeout = setTimeout(type, 500);
          } else {
            typingTimeout = setTimeout(type, isDeleting ? 50 : 150);
          }
        };
        typingTimeout = setTimeout(type, 500);
        return () => clearTimeout(typingTimeout);
      }, []);


      const heroVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.5 } },
      };

      const contentVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: "easeOut" } },
      };
      
      const ctaButtonHover = {
        scale: 1.05,
        boxShadow: "0px 10px 20px rgba(var(--primary-rgb), 0.4)",
        transition: { duration: 0.3 }
      };
      const secondaryButtonHover = {
        scale: 1.05,
        borderColor: "var(--accent)",
        color: "var(--accent)",
        backgroundColor: "rgba(var(--accent-rgb), 0.1)",
        transition: { duration: 0.3 }
      };


      return (
        <motion.section 
          className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)] hero-gradient overflow-hidden p-4 md:p-6" /* 80px is navbar height (h-20) */
          variants={heroVariants}
          initial="initial"
          animate="animate"
        >
          <div className="particle-background">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 2}px`,
                height: `${Math.random() * 3 + 2}px`,
                animationDelay: `${Math.random() * -20}s`,
                animationDuration: `${Math.random() * 10 + 15}s`,
              }}></div>
            ))}
          </div>

          <motion.div className="z-10 container-max" variants={contentVariants}>
            <h1 className="text-h1 font-extrabold mb-6 text-white">
              Potenciamos Tu Negocio con <br />
              <span className="typing-effect text-accent">{typedText}</span>
              <span className="opacity-0">_</span> {/* For consistent height */}
            </h1>
            
            <p className="text-xl md:text-h3 text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
              Creamos soluciones de Inteligencia Artificial a medida, especializadas en el ecosistema Google Cloud, para optimizar tus procesos y desbloquear nuevas oportunidades de crecimiento.
            </p>

            <div className="space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
              <motion.div whileHover={ctaButtonHover} className="inline-block">
                <Button asChild size="lg" className="btn btn-primary w-full sm:w-auto text-lg py-4 px-8 rounded-button">
                  <NavLink to="/services">
                    Descubre Servicios <ArrowRight className="ml-2 h-5 w-5" />
                  </NavLink>
                </Button>
              </motion.div>
              <motion.div whileHover={secondaryButtonHover} className="inline-block">
                 <Button asChild size="lg" variant="outline" className="btn btn-outline w-full sm:w-auto text-lg py-4 px-8 rounded-button border-2 border-gray-400 text-gray-300 hover:text-accent hover:border-accent hover:bg-accent/10">
                   <NavLink to="/contact">
                    Contacta Ahora
                  </NavLink>
                </Button>
              </motion.div>
              <Agent3D />
            </div>
          </motion.div>
          
          <motion.div 
            className="scroll-indicator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <ChevronDown className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-accent animate-scroll-indicator" />
          </motion.div>
        </motion.section>
      );
    };

    export default HomePage;