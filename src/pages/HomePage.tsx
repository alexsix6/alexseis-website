import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants, TargetAndTransition } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { localizedSchema } from '@/lib/schema-utils';

// Array de titulares para el efecto de tipeo - YA OPTIMIZADO
const headlines: string[] = [
  "RAG Multi-Estrategia para Enterprise AI",
  "Chatbots Enterprise en Arquitecturas Microservicios",
  "Automatización IA en Plataformas Serverless",
  "Business Intelligence con IA Automatizada"
];

const HomePage: React.FC = () => {
  const { i18n } = useTranslation('home');
  usePageMeta({ titleKey: 'meta.title', descriptionKey: 'meta.description', ns: 'home', path: '/' });

  // Estados para el efecto de tipeo del titular
  const [currentHeadline, setCurrentHeadline] = useState<number>(0);
  const [typedText, setTypedText] = useState<string>('');

  // useEffect para la animación de tipeo del titular
  useEffect(() => {
    let charIndex = 0;
    let headlineIndex = 0;
    let isDeleting = false;
    let typingTimeout: ReturnType<typeof setTimeout>;

    const type = (): void => {
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
        typingTimeout = setTimeout(type, 2000);
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

  // Schema Markup
  useEffect(() => {
    const schemaScript: HTMLScriptElement = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": localizedSchema("Alex Seis - Arquitecto de IA Empresarial", "Alex Seis - Enterprise AI Architect"),
      "description": localizedSchema("Especializado en implementaciones RAG empresariales, chatbots enterprise y plataformas serverless. Combina Business Intelligence con IA cutting-edge.", "Specialized in enterprise RAG implementations, chatbots, and serverless platforms. Combines Business Intelligence with cutting-edge AI."),
      "provider": {
        "@type": "Person",
        "name": "Alex Seis",
        "jobTitle": localizedSchema("Arquitecto de IA Empresarial", "Enterprise AI Architect"),
        "expertise": ["RAG Implementation", "Enterprise AI", "Serverless Architecture", "Business Intelligence", "Chatbot Development"],
        "knowsAbout": ["OpenAI", "Claude", "Google Cloud Run", "Power BI", "Docker", "Microservices", "RAG Architecture", "Enterprise AI", "Serverless Computing"],
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "EC"
        }
      },
      "serviceType": [
        localizedSchema("RAG Multi-Estrategia", "Multi-Strategy RAG"),
        localizedSchema("Chatbots Enterprise", "Enterprise Chatbots"),
        localizedSchema("Plataformas Serverless", "Serverless Platforms"),
        localizedSchema("Business Intelligence", "Business Intelligence"),
        localizedSchema("Automatización IA", "AI Automation")
      ],
      "areaServed": "Global",
      "url": typeof window !== 'undefined' ? window.location.origin : "https://alexseis.com",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "15"
      },
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceCurrency": "USD"
      }
    });

    document.head.appendChild(schemaScript);

    // Cleanup al desmontar
    return () => {
      if (document.head.contains(schemaScript)) {
        document.head.removeChild(schemaScript);
      }
    };
  }, [i18n.language]);

  // Variantes de animación para Framer Motion
  const heroVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  const contentVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: "easeOut" } },
  };

  const metricsVariants: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.6, ease: "easeOut" } },
  };

  // Efectos hover para los botones
  const ctaButtonHover: TargetAndTransition = {
    scale: 1.05,
    boxShadow: "0px 10px 20px rgba(var(--primary-rgb), 0.4)",
    transition: { duration: 0.3 }
  };
  const secondaryButtonHover: TargetAndTransition = {
    scale: 1.05,
    borderColor: "var(--accent)",
    color: "var(--accent)",
    backgroundColor: "rgba(var(--accent-rgb), 0.1)",
    transition: { duration: 0.3 }
  };

  return (
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
          <h1 className="text-h1 font-extrabold mb-6 text-white">
            Arquitecto de IA Empresarial <br />
            <span className="typing-effect text-accent">{typedText}</span>
            <span className="opacity-0">_</span>
          </h1>

          <p className="text-xl md:text-h3 main-description mb-10 max-w-3xl mx-auto leading-relaxed">
            Soy Alex Seis, Arquitecto especializado en implementaciones RAG empresariales, chatbots enterprise y plataformas serverless. Combino Business Intelligence tradicional con tecnologías cutting-edge: OpenAI, Claude, Google Cloud Run, Power BI. Resultados verificables en Fortune 500: 99.9% uptime, &lt;2s latencia, arquitecturas que procesan 1000+ consultas/min.
          </p>

          {/* MÉTRICAS OPTIMIZADAS PARA SEO */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto"
            variants={metricsVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="glass-card p-6 text-center border-accent/30"
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div className="text-2xl md:text-3xl font-bold text-accent mb-2">99.9%</div>
              <div className="text-sm text-gray-300">Uptime RAG Systems</div>
              <div className="text-xs text-gray-400 mt-1">Arquitecturas enterprise escalables</div>
            </motion.div>

            <motion.div
              className="glass-card p-6 text-center border-accent/30"
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">&lt;2s</div>
              <div className="text-sm text-gray-300">Latencia promedio</div>
              <div className="text-xs text-gray-400 mt-1">1000+ consultas/min procesadas</div>
            </motion.div>

            <motion.div
              className="glass-card p-6 text-center border-accent/30"
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">700%</div>
              <div className="text-sm text-gray-300">Mejora productividad</div>
              <div className="text-xs text-gray-400 mt-1">Procesos manuales → IA automatizada</div>
            </motion.div>
          </motion.div>

          {/* Contenedor para los botones de Call to Action (CTA) */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 md:mb-12">
            <motion.div whileHover={ctaButtonHover} className="inline-block w-full sm:w-auto">
              <Button asChild size="lg" className="btn btn-primary w-full text-lg py-3 px-6 sm:py-4 sm:px-8 rounded-button">
                <NavLink to="/projects">
                  Ver Arquitecturas Reales <ArrowRight className="ml-2 h-5 w-5" />
                </NavLink>
              </Button>
            </motion.div>
            <motion.div whileHover={secondaryButtonHover} className="inline-block w-full sm:w-auto">
              <Button asChild size="lg" variant="outline" className="btn btn-outline w-full text-lg py-3 px-6 sm:py-4 sm:px-8 rounded-button border-2 border-gray-400 text-gray-300 hover:text-accent hover:border-accent hover:bg-accent/10">
                <NavLink to="/contact">
                  Evaluar Mi Proyecto IA
                </NavLink>
              </Button>
            </motion.div>
          </div>

          {/* "BOTÓN DE ATAJO" (ChevronDown) */}
          <motion.div
            className="w-full flex justify-center mt-4 md:mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <NavLink to="/services" aria-label="Ver servicios de IA empresarial" className="cursor-pointer group">
              <ChevronDown className="h-10 w-10 md:h-12 md:w-12 text-gray-400 group-hover:text-accent transition-colors duration-300 animate-bounce" />
            </NavLink>
          </motion.div>

        </motion.div>

      </motion.section>
    </>
  );
};

export default HomePage;
