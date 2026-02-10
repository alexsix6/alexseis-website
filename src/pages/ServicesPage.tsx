import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight, Shield, Zap, Clock, Check, X,
  Search, Database, Rocket, BarChart3, Gift, Star, Crown
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePageMeta } from '@/hooks/usePageMeta';
import { localizedSchema } from '@/lib/schema-utils';

const ServicesPage: React.FC = () => {
  const { t, i18n } = useTranslation(['services', 'common']);
  usePageMeta({ titleKey: 'meta.title', descriptionKey: 'meta.description', ns: 'services', path: '/services' });

  // Tier icons
  const tierIcons = {
    free: <Gift className="h-10 w-10 text-accent" />,
    core: <Star className="h-10 w-10 text-primary" />,
    ecosystem: <Crown className="h-10 w-10 text-secondary" />,
  };

  // Tier accent colors
  const tierColors = {
    free: { border: 'border-accent/40', bg: 'bg-accent/5', text: 'text-accent', badge: 'bg-accent/20 text-accent' },
    core: { border: 'border-primary/40', bg: 'bg-primary/5', text: 'text-primary', badge: 'bg-primary/20 text-primary' },
    ecosystem: { border: 'border-secondary/40', bg: 'bg-secondary/5', text: 'text-secondary', badge: 'bg-secondary/20 text-secondary' },
  };

  // Guarantee icons map
  const guaranteeIconMap: Record<string, React.ReactNode> = {
    clock: <Clock className="h-8 w-8 text-primary" />,
    zap: <Zap className="h-8 w-8 text-accent" />,
    shield: <Shield className="h-8 w-8 text-secondary" />,
  };

  // Process step icons
  const stepIcons = [
    <Search className="h-7 w-7" />,
    <Database className="h-7 w-7" />,
    <Rocket className="h-7 w-7" />,
    <BarChart3 className="h-7 w-7" />,
  ];

  const stepColors = ['text-primary', 'text-secondary', 'text-accent', 'text-primary'];

  // i18n data
  const mechanismTraditional = useMemo(() => {
    const items = t('services:mechanism.traditional.items', { returnObjects: true });
    return Array.isArray(items) ? items as string[] : [];
  }, [t, i18n.language]);

  const mechanismInnate = useMemo(() => {
    const items = t('services:mechanism.innate.items', { returnObjects: true });
    return Array.isArray(items) ? items as string[] : [];
  }, [t, i18n.language]);

  const guaranteeItems = useMemo(() => {
    const items = t('services:guarantees.items', { returnObjects: true });
    return Array.isArray(items) ? items as Array<{ icon: string; title: string; description: string }> : [];
  }, [t, i18n.language]);

  const processSteps = useMemo(() => {
    const steps = t('services:process.steps', { returnObjects: true });
    return Array.isArray(steps) ? steps as Array<{ step: string; title: string; description: string }> : [];
  }, [t, i18n.language]);

  const tierKeys = ['free', 'core', 'ecosystem'] as const;
  const tierIncludes = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const key of tierKeys) {
      const inc = t(`services:tiers.${key}.includes`, { returnObjects: true });
      result[key] = Array.isArray(inc) ? inc as string[] : [];
    }
    return result;
  }, [t, i18n.language]);

  // Schema Markup
  useEffect(() => {
    const schemaScript: HTMLScriptElement = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": localizedSchema("INNATE.data — Servicios Zero-Egress", "INNATE.data — Zero-Egress Services"),
      "description": localizedSchema(
        "Arquitectura zero-egress de IA empresarial. Value Ladder: Roadmap gratuito, INNATE Core e INNATE Ecosystem.",
        "Zero-egress enterprise AI architecture. Value Ladder: Free roadmap, INNATE Core, and INNATE Ecosystem."
      ),
      "provider": {
        "@type": "Person",
        "name": "Alex Seis",
        "jobTitle": localizedSchema("Arquitecto de Soluciones de Datos Enterprise", "Enterprise Data Solutions Architect")
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "INNATE.data Value Ladder",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": { "@type": "Service", "name": "Native Intelligence Roadmap" },
            "price": "0", "priceCurrency": "USD"
          },
          {
            "@type": "Offer",
            "itemOffered": { "@type": "Service", "name": "INNATE Core" },
            "price": "25000", "priceCurrency": "USD"
          },
          {
            "@type": "Offer",
            "itemOffered": { "@type": "Service", "name": "INNATE Ecosystem" },
            "price": "100000", "priceCurrency": "USD"
          }
        ]
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
  const pageVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  return (
    <motion.div
      className="py-12 md:py-20 container-max"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* ===== PAGE HEADER ===== */}
      <div className="text-center mb-12 md:mb-16">
        <motion.h1
          className="text-h1 font-extrabold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t('services:page_title')}
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl max-w-3xl mx-auto font-normal"
          style={{ color: 'var(--current-text-secondary)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('services:page_subtitle')}
        </motion.p>
      </div>

      {/* ===== MECHANISM COMPARISON ===== */}
      <motion.section
        className="mb-16 md:mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-h2 font-bold text-center mb-3">
          {t('services:mechanism.title')}
        </h2>
        <p className="text-center text-lg mb-10" style={{ color: 'var(--current-text-secondary)' }}>
          {t('services:mechanism.subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Traditional */}
          <motion.div
            className="p-8 rounded-2xl border-2 border-red-500/30 bg-red-500/5"
            whileHover={{ y: -3, transition: { duration: 0.3 } }}
          >
            <h3 className="text-xl font-bold mb-6 text-red-400">
              {t('services:mechanism.traditional.title')}
            </h3>
            <ul className="space-y-4">
              {mechanismTraditional.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span style={{ color: 'var(--current-text-secondary)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* INNATE */}
          <motion.div
            className="p-8 rounded-2xl border-2 border-accent/30 bg-accent/5"
            whileHover={{ y: -3, transition: { duration: 0.3 } }}
          >
            <h3 className="text-xl font-bold mb-6 text-accent">
              {t('services:mechanism.innate.title')}
            </h3>
            <ul className="space-y-4">
              {mechanismInnate.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span style={{ color: 'var(--current-text-secondary)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== VALUE LADDER — 3 TIERS ===== */}
      <motion.section
        className="mb-16 md:mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tierKeys.map((key, index) => {
            const colors = tierColors[key];
            return (
              <motion.div
                key={key}
                className={`relative p-8 rounded-2xl border-2 ${colors.border} ${colors.bg} flex flex-col`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.3 } }}
              >
                {/* Popular badge for Core tier */}
                {key === 'core' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-xs font-bold bg-primary text-white">
                      {t('services:popular_badge')}
                    </span>
                  </div>
                )}

                {/* Badge */}
                <span className={`inline-block self-start px-3 py-1 rounded-full text-xs font-semibold mb-4 ${colors.badge}`}>
                  {t(`services:tiers.${key}.badge`)}
                </span>

                {/* Icon + Title */}
                <div className="flex items-center gap-3 mb-3">
                  {tierIcons[key]}
                  <h3 className="text-xl font-bold" style={{ color: 'var(--current-text)' }}>
                    {t(`services:tiers.${key}.title`)}
                  </h3>
                </div>

                {/* Price */}
                <div className={`text-3xl font-extrabold mb-4 ${colors.text}`}>
                  {t(`services:tiers.${key}.price`)}
                </div>

                {/* Description */}
                <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--current-text-secondary)' }}>
                  {t(`services:tiers.${key}.description`)}
                </p>

                {/* Includes */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {(tierIncludes[key] || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${colors.text}`} />
                      <span style={{ color: 'var(--current-text-secondary)' }}>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button asChild size="lg" className={`mt-auto w-full ${key === 'core' ? 'btn btn-primary' : 'btn btn-outline'}`}>
                  <NavLink to="/intake">
                    {t(`services:tiers.${key}.cta`)} <ArrowRight className="ml-2 h-4 w-4" />
                  </NavLink>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ===== GUARANTEES ===== */}
      <motion.section
        className="mb-16 md:mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-h2 font-bold text-center mb-10">
          {t('services:guarantees.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
                {guaranteeIconMap[item.icon] || <Shield className="h-8 w-8 text-primary" />}
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
      </motion.section>

      {/* ===== METHODOLOGY ===== */}
      <motion.section
        className="mb-16 md:mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <h2 className="text-h2 font-bold text-center mb-10">
          {t('services:process.title')}
        </h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-6 glass-card p-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className={`text-3xl font-bold ${stepColors[index] || 'text-primary'}`}>
                  {step.step}
                </div>
                <div className={`p-2.5 rounded-lg ${stepColors[index] || 'text-primary'}`} style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}>
                  {stepIcons[index] || <Search className="h-7 w-7" />}
                </div>
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-1 ${stepColors[index] || 'text-primary'}`}>
                  {step.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--current-text-secondary)' }}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== FINAL CTA ===== */}
      <motion.div
        className="text-center glass-card p-8 md:p-12 border-primary/30 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-h2 font-bold mb-4" style={{ color: 'var(--current-text)' }}>
          {t('services:cta_section.title')}
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--current-text-secondary)' }}>
          {t('services:cta_section.description')}
        </p>
        <Button asChild size="lg" className="btn btn-primary text-lg py-4 px-8">
          <NavLink to="/intake">
            {t('services:cta_section.button')} <ArrowRight className="ml-2 h-5 w-5" />
          </NavLink>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ServicesPage;
