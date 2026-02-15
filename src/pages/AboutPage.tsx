import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Variants, TargetAndTransition } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Lightbulb, Target, Zap, Shield, Eye, Puzzle,
  Brain, Database, Cloud, BarChart2, ArrowRight
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePageMeta } from '@/hooks/usePageMeta';
import { localizedSchema } from '@/lib/schema-utils';

// Story step icons
const storyIcons: Record<string, React.ReactNode> = {
  backstory: <Target className="h-8 w-8 text-primary" />,
  wall: <Shield className="h-8 w-8 text-red-400" />,
  epiphany: <Lightbulb className="h-8 w-8 text-accent" />,
  achievement: <Zap className="h-8 w-8 text-secondary" />,
};

const storyBorders: Record<string, string> = {
  backstory: 'border-l-primary',
  wall: 'border-l-red-400',
  epiphany: 'border-l-accent',
  achievement: 'border-l-secondary',
};

// Value icons
const valueIcons = [
  <Brain className="h-8 w-8 text-primary" />,
  <Shield className="h-8 w-8 text-accent" />,
  <Zap className="h-8 w-8 text-secondary" />,
  <Eye className="h-8 w-8 text-primary" />,
  <Puzzle className="h-8 w-8 text-accent" />,
];

// Stack category icons
const stackIcons = [
  <Database className="h-8 w-8 text-primary" />,
  <Brain className="h-8 w-8 text-accent" />,
  <Cloud className="h-8 w-8 text-secondary" />,
  <BarChart2 className="h-8 w-8 text-primary" />,
];

const stackColors = ['text-primary', 'text-accent', 'text-secondary', 'text-primary'];

const AboutPage: React.FC = () => {
  const { t, i18n } = useTranslation(['about', 'common']);
  usePageMeta({ titleKey: 'meta.title', descriptionKey: 'meta.description', ns: 'about', path: '/about' });

  // i18n data
  const storyKeys = ['backstory', 'wall', 'epiphany', 'achievement'];

  const valuesItems = useMemo(() => {
    const items = t('about:values.items', { returnObjects: true });
    return Array.isArray(items) ? items as Array<{ title: string; description: string }> : [];
  }, [t, i18n.language]);

  const statsItems = useMemo(() => {
    const items = t('about:stats.items', { returnObjects: true });
    return Array.isArray(items) ? items as Array<{ value: string; label: string }> : [];
  }, [t, i18n.language]);

  const stackCategories = useMemo(() => {
    const cats = t('about:stack.categories', { returnObjects: true });
    return Array.isArray(cats) ? cats as Array<{ title: string; items: string[] }> : [];
  }, [t, i18n.language]);

  // Schema Markup
  useEffect(() => {
    const schemaScript: HTMLScriptElement = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Alex Seis",
      "jobTitle": localizedSchema("Arquitecto Zero-Egress | INNATE.data", "Zero-Egress Architect | INNATE.data"),
      "description": localizedSchema(
        "Creador de INNATE.data — arquitectura zero-egress de IA empresarial. Ecosistema: 694M+ transacciones, 270% ROI verificado.",
        "Creator of INNATE.data — zero-egress enterprise AI architecture. Ecosystem: 694M+ transactions, 270% verified ROI."
      ),
      "expertise": ["Zero-Egress AI", "Enterprise Data Architecture", "MCP Servers", "BigQuery", "Vertex AI", "Cloud Run"],
      "knowsAbout": ["INNATE.data", "Zero-Egress Architecture", "MCP Servers", "BigQuery", "Claude AI", "INNATE.data Ecosystem", "Vertex AI"],
      "hasOccupation": {
        "@type": "Occupation",
        "name": localizedSchema("Arquitecto Zero-Egress", "Zero-Egress Architect"),
        "skills": ["Zero-Egress AI", "MCP Servers", "Enterprise Data Architecture", "BigQuery", "Vertex AI"],
        "experienceRequirements": localizedSchema("15+ anos en operaciones enterprise", "15+ years in enterprise operations")
      },
      "address": { "@type": "PostalAddress", "addressCountry": "PA" },
      "url": typeof window !== 'undefined' ? window.location.origin : "https://alexseis.com"
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

  const itemVariants: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardHoverEffect: TargetAndTransition = {
    y: -5,
    scale: 1.02,
    boxShadow: "0 12px 32px rgba(var(--primary-rgb), 0.2)",
    transition: { duration: 0.3, type: "spring", stiffness: 200 }
  };

  return (
    <motion.div
      className="py-12 md:py-20 container-max"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* ===== PAGE HEADER ===== */}
      <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
        <h1 className="text-h1 font-extrabold mb-4">
          {t('about:page_title')}
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto font-normal" style={{ color: 'var(--current-text-secondary)' }}>
          {t('about:page_subtitle')}
        </p>
      </motion.div>

      {/* ===== EPIPHANY BRIDGE — Story ===== */}
      <motion.section
        className="mb-16 md:mb-24 max-w-3xl mx-auto"
        variants={itemVariants}
      >
        <h2 className="text-h2 font-bold text-center mb-10">
          {t('about:story.title')}
        </h2>

        <div className="space-y-8">
          {storyKeys.map((key, index) => (
            <motion.div
              key={key}
              className={`p-6 rounded-xl border-l-4 ${storyBorders[key]} bg-opacity-5`}
              style={{ background: 'rgba(var(--primary-rgb), 0.03)' }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-3">
                {storyIcons[key]}
                <h3 className="text-xl font-bold" style={{ color: 'var(--current-text)' }}>
                  {t(`about:story.${key}.title`)}
                </h3>
              </div>
              <p className="leading-relaxed" style={{ color: 'var(--current-text-secondary)' }}>
                {t(`about:story.${key}.text`)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== 5 INNATE VALUES ===== */}
      <motion.section
        className="mb-16 md:mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-h2 font-bold text-center mb-10">
          {t('about:values.title')}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {valuesItems.map((item, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 text-center rounded-2xl"
              whileHover={cardHoverEffect}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex justify-center mb-4">
                {valueIcons[index] || <Brain className="h-8 w-8 text-primary" />}
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

      {/* ===== STATS ===== */}
      <motion.section
        className="mb-16 md:mb-24 glass-card p-8 md:p-12 rounded-2xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-h2 font-bold text-center mb-10">
          {t('about:stats.title')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statsItems.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-xl"
              style={{ background: 'rgba(var(--accent-rgb), 0.05)', border: '1px solid rgba(var(--accent-rgb), 0.2)' }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(var(--accent-rgb), 0.15)" }}
            >
              <div className="text-3xl md:text-4xl font-extrabold text-accent mb-2">{stat.value}</div>
              <p className="text-sm" style={{ color: 'var(--current-text-muted)' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== TECH STACK ===== */}
      <motion.section
        className="mb-16 md:mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-h2 font-bold text-center mb-10">
          {t('about:stack.title')}
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {stackCategories.map((cat, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 text-center rounded-2xl"
              whileHover={cardHoverEffect}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="flex justify-center mb-4">
                {stackIcons[index]}
              </div>
              <h3 className={`text-lg font-semibold mb-3 ${stackColors[index]}`}>
                {cat.title}
              </h3>
              <div className="space-y-1.5">
                {(cat.items || []).map((tech, i) => (
                  <div key={i} className="text-xs px-2 py-1 rounded" style={{
                    background: 'rgba(var(--primary-rgb), 0.08)',
                    color: 'var(--current-text-secondary)',
                  }}>
                    {tech}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== CTA ===== */}
      <motion.div
        className="text-center glass-card p-8 md:p-12 rounded-2xl border-primary/30"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-h2 font-bold mb-4" style={{ color: 'var(--current-text)' }}>
          {t('projects:cta_section.title', { defaultValue: t('about:page_title') })}
        </h2>
        <Button asChild size="lg" className="btn btn-primary text-lg py-4 px-8">
          <NavLink to="/intake">
            {t('common:cta.roadmap_full')} <ArrowRight className="ml-2 h-5 w-5" />
          </NavLink>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AboutPage;
