import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle, ArrowRight, Quote, Shield, Database, Brain,
  Zap, MessageSquare, Cloud, BarChart3, Eye, Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { localizedSchema } from '@/lib/schema-utils';

// Project icon mapping
const projectIcons: Record<string, React.ReactNode> = {
  creatia: <Palette className="h-6 w-6" />,
  conversational_bi: <Cloud className="h-6 w-6" />,
  rag_zero_egress: <Brain className="h-6 w-6" />,
  scalable_infra: <Zap className="h-6 w-6" />,
  enterprise_agent: <MessageSquare className="h-6 w-6" />,
};

const projectColors: Record<string, string> = {
  creatia: 'text-secondary',
  conversational_bi: 'text-primary',
  rag_zero_egress: 'text-accent',
  scalable_infra: 'text-primary',
  enterprise_agent: 'text-secondary',
};

const projectBorders: Record<string, string> = {
  creatia: 'border-secondary/30',
  conversational_bi: 'border-primary/30',
  rag_zero_egress: 'border-accent/30',
  scalable_infra: 'border-primary/30',
  enterprise_agent: 'border-secondary/30',
};

const ProjectsPage: React.FC = () => {
  const { t, i18n } = useTranslation(['projects', 'common']);
  usePageMeta({ titleKey: 'meta.title', descriptionKey: 'meta.description', ns: 'projects', path: '/projects' });

  const projectKeys = ['creatia', 'conversational_bi', 'rag_zero_egress', 'scalable_infra', 'enterprise_agent'];

  // i18n data
  const heroMetrics = useMemo(() => {
    const metricKeys = ['transactions', 'time_reduction', 'roi', 'payback', 'clients', 'response'];
    return metricKeys.map(key => ({
      value: t(`projects:hero_case.metrics.${key}.value`),
      label: t(`projects:hero_case.metrics.${key}.label`),
    }));
  }, [t, i18n.language]);

  const heroStack = useMemo(() => {
    const s = t('projects:hero_case.stack', { returnObjects: true });
    return Array.isArray(s) ? s as string[] : [];
  }, [t, i18n.language]);

  const differentiatorItems = useMemo(() => {
    const items = t('projects:differentiators.items', { returnObjects: true });
    return Array.isArray(items) ? items as Array<{ title: string; description: string }> : [];
  }, [t, i18n.language]);

  // Projects data from i18n
  const projectsData = useMemo(() => {
    return projectKeys.map(key => {
      const results = t(`projects:projects.${key}.results`, { returnObjects: true });
      const stack = t(`projects:projects.${key}.stack`, { returnObjects: true });
      return {
        key,
        title: t(`projects:projects.${key}.title`),
        category: t(`projects:projects.${key}.category`),
        description: t(`projects:projects.${key}.description`),
        results: Array.isArray(results) ? results as string[] : [],
        stack: Array.isArray(stack) ? stack as string[] : [],
      };
    });
  }, [t, i18n.language]);

  // Differentiator icons
  const diffIcons = [
    <BarChart3 className="h-8 w-8 text-accent" />,
    <Shield className="h-8 w-8 text-accent" />,
    <Eye className="h-8 w-8 text-accent" />,
  ];

  // Schema Markup
  useEffect(() => {
    const schemaScript: HTMLScriptElement = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": localizedSchema("Caso de Exito: Ecosistema INNATE.data", "Success Story: INNATE.data Ecosystem"),
      "description": localizedSchema(
        "Ecosistema INNATE.data: La Estratega (282M+ registros, 17 MCP tools) + La Ejecutora (13 herramientas, Imagen 3/Veo 2) + La Orquestadora. 270% ROI verificado con arquitectura zero-egress.",
        "INNATE.data Ecosystem: The Strategist (282M+ records, 17 MCP tools) + The Executor (13 tools, Imagen 3/Veo 2) + The Orchestrator. 270% verified ROI with zero-egress architecture."
      ),
      "author": {
        "@type": "Person",
        "name": "Alex Seis",
        "jobTitle": localizedSchema("Arquitecto Zero-Egress | INNATE.data", "Zero-Egress Architect | INNATE.data")
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
      <motion.div
        className="text-center mb-12 md:mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-h1 font-extrabold mb-4">
          {t('projects:page_title')}
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto font-normal" style={{ color: 'var(--current-text-secondary)' }}>
          {t('projects:page_subtitle')}
        </p>
      </motion.div>

      {/* ===== HERO CASE STUDY ===== */}
      <motion.section
        className="mb-16 md:mb-24 glass-card p-8 md:p-12 rounded-2xl border-accent/30"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {/* Badge */}
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-accent/20 text-accent mb-6">
          {t('projects:hero_case.badge')}
        </span>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6" style={{ color: 'var(--current-text)' }}>
          {t('projects:hero_case.title')}
        </h2>

        {/* Description */}
        <p className="text-lg mb-8 max-w-3xl leading-relaxed" style={{ color: 'var(--current-text-secondary)' }}>
          {t('projects:hero_case.description')}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {heroMetrics.map((metric, i) => (
            <motion.div
              key={i}
              className="text-center p-4 rounded-xl bg-accent/5 border border-accent/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
            >
              <div className="text-xl md:text-2xl font-extrabold text-accent">{metric.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--current-text-muted)' }}>{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <div className="flex items-start gap-3 mb-8 p-4 rounded-xl bg-accent/5 border-l-4 border-accent">
          <Quote className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
          <div>
            <p className="text-lg font-semibold italic" style={{ color: 'var(--current-text)' }}>
              {t('projects:hero_case.quote')}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--current-text-muted)' }}>
              — {t('projects:hero_case.quote_author')}
            </p>
          </div>
        </div>

        {/* Stack */}
        <div className="flex flex-wrap gap-2 mb-8">
          {heroStack.map((tech, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30">
              {tech}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Button asChild size="lg" className="btn btn-primary text-lg py-4 px-8">
          <NavLink to="/intake">
            {t('projects:hero_case.cta')} <ArrowRight className="ml-2 h-5 w-5" />
          </NavLink>
        </Button>
      </motion.section>

      {/* ===== SUPPORTING PROJECTS ===== */}
      <motion.section
        className="mb-16 md:mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-h2 font-bold text-center mb-3">
          {t('projects:supporting_title')}
        </h2>
        <p className="text-center text-lg mb-10" style={{ color: 'var(--current-text-secondary)' }}>
          {t('projects:supporting_subtitle')}
        </p>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project, index) => (
            <motion.div
              key={project.key}
              className={`glass-card p-6 rounded-2xl flex flex-col ${projectBorders[project.key] || ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.3 } }}
            >
              {/* Icon + Category */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${projectColors[project.key] || 'text-primary'}`} style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}>
                  {projectIcons[project.key] || <Database className="h-6 w-6" />}
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--current-text-muted)' }}>
                  {project.category}
                </span>
              </div>

              {/* Title */}
              <h3 className={`text-lg font-bold mb-2 ${projectColors[project.key] || 'text-primary'}`}>
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-sm mb-4 leading-relaxed flex-grow" style={{ color: 'var(--current-text-secondary)' }}>
                {project.description}
              </p>

              {/* Results */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--current-text-muted)' }}>
                  {t('projects:labels.results')}
                </h4>
                <ul className="space-y-1.5">
                  {project.results.map((result, i) => (
                    <li key={i} className="flex items-start text-xs gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span style={{ color: 'var(--current-text-secondary)' }}>{result}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stack */}
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs font-medium" style={{
                    background: 'rgba(var(--primary-rgb), 0.1)',
                    color: 'var(--primary)',
                    border: '1px solid rgba(var(--primary-rgb), 0.2)',
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== DIFFERENTIATORS ===== */}
      <motion.section
        className="mb-16 md:mb-24 glass-card p-8 md:p-12 rounded-2xl border-accent/30"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-h2 font-bold text-center mb-10">
          {t('projects:differentiators.title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {differentiatorItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {diffIcons[index]}
              </div>
              <h3 className="text-lg font-semibold text-accent mb-2">{item.title}</h3>
              <p className="text-sm" style={{ color: 'var(--current-text-secondary)' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ===== FINAL CTA ===== */}
      <motion.div
        className="text-center glass-card p-8 md:p-12 rounded-2xl border-primary/30"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-h2 font-bold mb-4" style={{ color: 'var(--current-text)' }}>
          {t('projects:cta_section.title')}
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--current-text-secondary)' }}>
          {t('projects:cta_section.description')}
        </p>
        <Button asChild size="lg" className="btn btn-primary text-lg py-4 px-8">
          <NavLink to="/intake">
            {t('projects:cta_section.button')} <ArrowRight className="ml-2 h-5 w-5" />
          </NavLink>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProjectsPage;
