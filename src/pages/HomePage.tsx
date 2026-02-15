import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Variants, TargetAndTransition } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, Shield, Zap, Clock, X, Check } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { localizedSchema } from '@/lib/schema-utils';

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation(['home', 'common']);
  usePageMeta({ titleKey: 'meta.title', descriptionKey: 'meta.description', ns: 'home', path: '/' });

  // Typing effect headlines from i18n
  const headlines = useMemo(() => {
    const h = t('home:hero.headlines', { returnObjects: true });
    return Array.isArray(h) ? h as string[] : [
      "Zero-Egress Architecture for Enterprise AI",
      "282M Records Analyzed in Seconds",
      "AI That Lives Inside Your Data Warehouse",
      "From 2-Day Reports to Instant Answers"
    ];
  }, [t, i18n.language]);

  const [_currentHeadline, setCurrentHeadline] = useState<number>(0);
  const [typedText, setTypedText] = useState<string>('');

  // Typing animation
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
  }, [headlines]);

  // Schema Markup
  useEffect(() => {
    const schemaScript: HTMLScriptElement = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": localizedSchema("INNATE.data - Arquitectura Zero-Egress de IA Empresarial", "INNATE.data - Zero-Egress Enterprise AI Architecture"),
      "description": localizedSchema(
        "Arquitectura de IA nativa que vive dentro de tu data warehouse. 282M+ registros, 30s respuesta, 270% ROI.",
        "Native AI architecture that lives inside your data warehouse. 282M+ records, 30s response, 270% ROI."
      ),
      "provider": {
        "@type": "Person",
        "name": "Alex Seis",
        "jobTitle": localizedSchema("Arquitecto Zero-Egress | INNATE.data", "Zero-Egress Architect | INNATE.data"),
        "expertise": ["Zero-Egress AI", "Enterprise Data Architecture", "MCP Servers", "BigQuery", "Vertex AI", "Cloud Run"],
        "knowsAbout": ["INNATE.data", "Zero-Egress Architecture", "MCP Servers", "BigQuery", "Claude AI", "Enterprise AI", "INNATE.data Ecosystem", "Vertex AI"],
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "PA"
        }
      },
      "serviceType": [
        localizedSchema("Roadmap de Inteligencia Nativa", "Native Intelligence Roadmap"),
        localizedSchema("INNATE Core - Implementacion Zero-Egress", "INNATE Core - Zero-Egress Implementation"),
        localizedSchema("INNATE Ecosystem - Multi-Departamento", "INNATE Ecosystem - Multi-Department")
      ],
      "areaServed": "Global",
      "url": typeof window !== 'undefined' ? window.location.origin : "https://alexseis.com",
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceCurrency": "USD"
      }
    });

    document.head.appendChild(schemaScript);
    return () => {
      if (document.head.contains(schemaScript)) {
        document.head.removeChild(schemaScript);
      }
    };
  }, [i18n.language]);

  // Animation variants
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

  const guaranteesVariants: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.9, ease: "easeOut" } },
  };

  const mechanismVariants: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, ease: "easeOut" } },
  };

  // Hover effects
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

  // Guarantee icons map
  const guaranteeIcons: Record<string, React.ReactNode> = {
    shield: <Shield className="h-8 w-8 text-primary" />,
    zap: <Zap className="h-8 w-8 text-secondary" />,
    clock: <Clock className="h-8 w-8 text-accent" />,
  };

  // Get guarantee items from i18n
  const guaranteeItems = useMemo(() => {
    const items = t('home:guarantees.items', { returnObjects: true });
    return Array.isArray(items) ? items as Array<{ icon: string; title: string; description: string }> : [];
  }, [t, i18n.language]);

  // Get mechanism comparison points from i18n
  const traditionalPoints = useMemo(() => {
    const p = t('home:mechanism.traditional.points', { returnObjects: true });
    return Array.isArray(p) ? p as string[] : [];
  }, [t, i18n.language]);

  const innatePoints = useMemo(() => {
    const p = t('home:mechanism.innate.points', { returnObjects: true });
    return Array.isArray(p) ? p as string[] : [];
  }, [t, i18n.language]);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <motion.section
        className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)] hero-gradient overflow-hidden p-4 md:p-6 pt-20 sm:pt-24 md:pt-28"
        variants={heroVariants}
        initial="initial"
        animate="animate"
      >
        {/* Particle background */}
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

        {/* Hero Content */}
        <motion.div className="z-10 container-max" variants={contentVariants}>
          {/* Brand */}
          <motion.div
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-sm font-semibold text-primary tracking-wider">
              {t('home:hero.brand')}
            </span>
          </motion.div>

          <h1 className="text-h1 font-extrabold mb-2 text-white">
            {t('home:hero.tagline')} <br />
            <span className="typing-effect text-accent">{typedText}</span>
            <span className="opacity-0">_</span>
          </h1>

          <p className="text-xl md:text-h3 main-description mb-10 max-w-3xl mx-auto leading-relaxed">
            {t('home:hero.description')}
          </p>

          {/* METRICS - verified production data */}
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
              <div className="text-2xl md:text-3xl font-bold text-accent mb-2">
                {t('home:metrics.transactions.value')}
              </div>
              <div className="text-sm" style={{ color: 'var(--current-text-secondary)' }}>{t('home:metrics.transactions.label')}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--current-text-muted)' }}>{t('home:metrics.transactions.detail')}</div>
            </motion.div>

            <motion.div
              className="glass-card p-6 text-center border-accent/30"
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                {t('home:metrics.speed.value')}
              </div>
              <div className="text-sm" style={{ color: 'var(--current-text-secondary)' }}>{t('home:metrics.speed.label')}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--current-text-muted)' }}>{t('home:metrics.speed.detail')}</div>
            </motion.div>

            <motion.div
              className="glass-card p-6 text-center border-accent/30"
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                {t('home:metrics.roi.value')}
              </div>
              <div className="text-sm" style={{ color: 'var(--current-text-secondary)' }}>{t('home:metrics.roi.label')}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--current-text-muted)' }}>{t('home:metrics.roi.detail')}</div>
            </motion.div>
          </motion.div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 md:mb-12">
            <motion.div whileHover={ctaButtonHover} className="inline-block w-full sm:w-auto">
              <Button asChild size="lg" className="btn btn-primary w-full text-lg py-3 px-6 sm:py-4 sm:px-8 rounded-button">
                <NavLink to="/intake">
                  {t('home:hero.cta_primary')} <ArrowRight className="ml-2 h-5 w-5" />
                </NavLink>
              </Button>
            </motion.div>
            <motion.div whileHover={secondaryButtonHover} className="inline-block w-full sm:w-auto">
              <Button asChild size="lg" variant="outline" className="btn btn-outline w-full text-lg py-3 px-6 sm:py-4 sm:px-8 rounded-button border-2 hover:text-accent hover:border-accent hover:bg-accent/10" style={{ borderColor: 'var(--current-border)', color: 'var(--current-text-secondary)' }}>
                <NavLink to="/projects">
                  {t('home:hero.cta_secondary')}
                </NavLink>
              </Button>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="w-full flex justify-center mt-4 md:mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <NavLink to="/services" aria-label={t('home:sections.services_title')} className="cursor-pointer group">
              <ChevronDown className="h-10 w-10 md:h-12 md:w-12 group-hover:text-accent transition-colors duration-300 animate-bounce" style={{ color: 'var(--current-text-muted)' }} />
            </NavLink>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ===== MECHANISM SECTION — Zero-Egress Comparison ===== */}
      <motion.section
        className="py-16 md:py-24 px-4"
        variants={mechanismVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container-max max-w-5xl mx-auto">
          <h2 className="text-h2 font-bold text-center mb-3">
            {t('home:mechanism.title')}
          </h2>
          <p className="text-center text-lg mb-12" style={{ color: 'var(--current-text-secondary)' }}>
            {t('home:mechanism.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional AI */}
            <motion.div
              className="p-8 rounded-2xl border-2 border-red-500/30 bg-red-500/5"
              whileHover={{ y: -3, transition: { duration: 0.3 } }}
            >
              <h3 className="text-xl font-bold mb-6 text-red-400">
                {t('home:mechanism.traditional.title')}
              </h3>
              <ul className="space-y-4">
                {traditionalPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span style={{ color: 'var(--current-text-secondary)' }}>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* INNATE.data */}
            <motion.div
              className="p-8 rounded-2xl border-2 border-accent/30 bg-accent/5"
              whileHover={{ y: -3, transition: { duration: 0.3 } }}
            >
              <h3 className="text-xl font-bold mb-6 text-accent">
                {t('home:mechanism.innate.title')}
              </h3>
              <ul className="space-y-4">
                {innatePoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span style={{ color: 'var(--current-text-secondary)' }}>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== GUARANTEES SECTION ===== */}
      <motion.section
        className="py-16 md:py-24 px-4"
        variants={guaranteesVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container-max max-w-5xl mx-auto">
          <h2 className="text-h2 font-bold text-center mb-12">
            {t('home:guarantees.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guaranteeItems.map((item, index) => (
              <motion.div
                key={index}
                className="glass-card p-8 text-center rounded-2xl"
                whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <div className="flex justify-center mb-4">
                  {guaranteeIcons[item.icon] || <Shield className="h-8 w-8 text-primary" />}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--current-text)' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--current-text-secondary)' }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default HomePage;
