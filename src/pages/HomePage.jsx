import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Asumo que este es tu componente de botón personalizado
import { ArrowRight, ChevronDown } from 'lucide-react'; // Iconos
import { NavLink } from 'react-router-dom'; // Para la navegación
import { Agent3D } from '../components/Agent3D'; // Tu componente de chat flotante

// Array de titulares para el efecto de tipeo
const headlines = [
  "Agentes de IA Inteligentes",
  "Soluciones Google Cloud",
  "Transformación Digital",
  "Optimización de Procesos"
];

const HomePage = () => {
  // Estados para el efecto de tipeo del titular
  const [currentHeadline, setCurrentHeadline] = useState(0);
  const [typedText, setTypedText] = useState('');

  // useEffect para la animación de tipeo del titular
  useEffect(() => {
    let charIndex = 0;
    let headlineIndex = 0;
    let isDeleting = false;
    let typingTimeout;

    const type = () => {
      const fullText = headlines[headlineIndex];
      if (isDeleting) {
        setTypedText(fullText.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setTypedText(fullText.substring(0, charIndex + 1));
        charIndex++;
      }

      if (!isDeleting && charIndex === fullText.length) {
        isDeleting = true;
        typingTimeout = setTimeout(type, 2000); // Pausa al final del texto
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        headlineIndex = (headlineIndex + 1) % headlines.length;
        setCurrentHeadline(headlineIndex);
        typingTimeout = setTimeout(type, 500); // Pausa antes de empezar el nuevo texto
      } else {
        typingTimeout = setTimeout(type, isDeleting ? 50 : 150); // Velocidad de tipeo/borrado
      }
    };
    typingTimeout = setTimeout(type, 500); // Iniciar después de un breve retraso
    return () => clearTimeout(typingTimeout); // Limpieza al desmontar el componente
  }, []);

  // Variantes de animación para Framer Motion
  const heroVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: "easeOut" } },
  };
  
  // Efectos hover para los botones (ejemplos, puedes personalizarlos más)
  const ctaButtonHover = {
    scale: 1.05,
    boxShadow: "0px 10px 20px rgba(var(--primary-rgb), 0.4)", // Asume que --primary-rgb está definido en tu CSS
    transition: { duration: 0.3 }
  };
  const secondaryButtonHover = {
    scale: 1.05,
    borderColor: "var(--accent)", // Asume que --accent está definido
    color: "var(--accent)",
    backgroundColor: "rgba(var(--accent-rgb), 0.1)", // Asume que --accent-rgb está definido
    transition: { duration: 0.3 }
  };

  return (
    // Usamos un Fragmento <>...</> para permitir que Agent3D sea hermano de la sección principal
    // Esto es crucial para que Agent3D (con position:fixed) no se vea afectado por el overflow:hidden de la sección.
    <>
      <motion.section 
        className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)] hero-gradient overflow-hidden p-4 md:p-6 pt-20 sm:pt-24 md:pt-28"
        variants={heroVariants}
        initial="initial"
        animate="animate"
      >
        {/* Fondo de partículas animadas */}
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

        {/* Contenedor principal del contenido "hero" */}
        <motion.div className="z-10 container-max" variants={contentVariants}>
          {/* Titular principal con efecto de tipeo */}
          <h1 className="text-h1 font-extrabold mb-6 text-white"> {/* Asumo que text-h1 y text-white vienen de tu CSS/Tailwind config */}
            Potenciamos Tu Negocio con <br />
            <span className="typing-effect text-accent">{typedText}</span>
            <span className="opacity-0">_</span> {/* Truco para mantener altura consistente durante el tipeo */}
          </h1>
          
          {/* Párrafo descriptivo. Asumo que corregiste el color usando 'main-description' o similar */}
          <p className="text-xl md:text-h3 main-description mb-10 max-w-3xl mx-auto leading-relaxed"> 
            Creamos soluciones de Inteligencia Artificial a medida, especializadas en el ecosistema Google Cloud, para optimizar tus procesos y desbloquear nuevas oportunidades de crecimiento.
          </p>

          {/* Contenedor para los botones de Call to Action (CTA) */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 md:mb-12">
            {/* Botón "Descubre Servicios" */}
            <motion.div whileHover={ctaButtonHover} className="inline-block w-full sm:w-auto">
              <Button asChild size="lg" className="btn btn-primary w-full text-lg py-3 px-6 sm:py-4 sm:px-8 rounded-button">
                <NavLink to="/services">
                  Descubre Servicios <ArrowRight className="ml-2 h-5 w-5" />
                </NavLink>
              </Button>
            </motion.div>
            {/* Botón "Contacta Ahora" */}
            <motion.div whileHover={secondaryButtonHover} className="inline-block w-full sm:w-auto">
              <Button asChild size="lg" variant="outline" className="btn btn-outline w-full text-lg py-3 px-6 sm:py-4 sm:px-8 rounded-button border-2 border-gray-400 text-gray-300 hover:text-accent hover:border-accent hover:bg-accent/10">
                <NavLink to="/contact">
                  Contacta Ahora
                </NavLink>
              </Button>
            </motion.div>
          </div>

          {/* "BOTÓN DE ATAJO" (ChevronDown) - Reubicado y Funcional */}
          {/* Este es el contenedor del ChevronDown, ahora en el flujo normal del documento, después de los botones CTA. */}
          <motion.div
            className="w-full flex justify-center mt-4 md:mt-8" // Centra el ícono y le da margen superior
            initial={{ opacity: 0, y: 20 }} // Animación de entrada
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            {/* Opción A (Activa): Navega a la ruta /services. Asegúrate que esta ruta exista en tu router. */}
            <NavLink to="/services" aria-label="Ver servicios" className="cursor-pointer group">
              <ChevronDown className="h-10 w-10 md:h-12 md:w-12 text-gray-400 group-hover:text-accent transition-colors duration-300 animate-bounce" />
            </NavLink>

            {/* Opción B (Comentada): Para hacer scroll a una sección DENTRO de la misma página.
                Descomenta y ajusta 'id-de-tu-seccion-servicios' si prefieres esta opción.
            <button
              onClick={() => {
                const servicesSection = document.getElementById('id-de-tu-seccion-servicios');
                servicesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              aria-label="Ir a servicios"
              className="cursor-pointer group focus:outline-none"
            >
              <ChevronDown className="h-10 w-10 md:h-12 md:w-12 text-gray-400 group-hover:text-accent transition-colors duration-300 animate-bounce" />
            </button> */}
          </motion.div>

        </motion.div> {/* Fin de motion.div className="z-10 container-max" */}
      
      </motion.section> {/* Fin de motion.section principal */}

      {/* El componente Agent3D se renderiza aquí, como hermano de la sección principal.
          Gracias a su `position: fixed` interno, flotará donde debe sin ser afectado por el `overflow-hidden` de la sección. */}
      <Agent3D />
    </>
  );
};

export default HomePage;