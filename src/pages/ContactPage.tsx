import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePageMeta } from '@/hooks/usePageMeta';
import { localizedSchema } from '@/lib/schema-utils';
import type { ContactFormData } from '@/types';
import type { LucideIcon } from 'lucide-react';
import {
    Mail, Phone, MapPin, Send, Briefcase, MessageCircle, User,
    Linkedin, Instagram, Twitter, Github
} from 'lucide-react';

// SVG icon props type
interface SvgIconProps extends React.SVGAttributes<SVGElement> {
  className?: string;
}

// Componente TikTok Icon personalizado
const TikTokIcon: React.FC<SvgIconProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.204-1.924-1.204-2.338C16.537 1.434 16.21 1 15.644 1h-3.497c-.566 0-1.02.434-1.02 1v11.587a2.896 2.896 0 1 1-1.84-2.706V7.548a6.27 6.27 0 0 0-.84-.057C4.347 7.491 1 10.838 1 15.938S4.347 24.385 8.447 24.385s7.447-3.347 7.447-7.447V9.133a9.524 9.524 0 0 0 5.606 1.791V7.427a5.923 5.923 0 0 1-2.179-1.865Z"/>
  </svg>
);

// Form validation errors type
interface FormErrors {
  name?: string | null;
  email?: string | null;
  company?: string | null;
  interest?: string | null;
  message?: string | null;
  [key: string]: string | null | undefined;
}

// Contact info item type
interface ContactInfoItem {
  icon: LucideIcon;
  text: string;
  href: string;
  labelKey: string;
}

// Social link type
interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
}

const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// InputField props
interface InputFieldProps {
  id: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  icon?: LucideIcon;
  labelText?: string;
}

// Componente InputField (etiqueta siempre arriba)
const InputField: React.FC<InputFieldProps> = ({ id, name, type = "text", placeholder, value, onChange, error, icon: Icon, labelText }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium" style={{ color: 'var(--current-text-secondary)' }}>
      {labelText || placeholder}
    </label>
    <div className="relative rounded-md shadow-sm">
      {Icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5" style={{ color: 'var(--current-text-muted)' }} aria-hidden="true" />
      </div>}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder.endsWith(' *') ? placeholder.substring(0, placeholder.length - 2) : placeholder}
        className={`block w-full rounded-lg border bg-transparent
                    px-4 py-3 ${Icon ? 'pl-10' : 'pl-4'}
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'focus:border-accent focus:ring-accent'}`}
        style={{ borderColor: error ? undefined : 'var(--current-border)', color: 'var(--current-text)' }}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// TextareaField props
interface TextareaFieldProps {
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string | null;
  labelText?: string;
}

// Componente TextareaField (etiqueta siempre arriba)
const TextareaField: React.FC<TextareaFieldProps> = ({ id, name, placeholder, value, onChange, error, labelText }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium" style={{ color: 'var(--current-text-secondary)' }}>
      {labelText || placeholder}
    </label>
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder.endsWith(' *') ? placeholder.substring(0, placeholder.length - 2) : placeholder}
      rows={5}
      className={`block w-full rounded-lg border bg-transparent px-4 py-3
                  ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'focus:border-accent focus:ring-accent'}`}
      style={{ borderColor: error ? undefined : 'var(--current-border)', color: 'var(--current-text)' }}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const ContactPage: React.FC = () => {
  const { t, i18n } = useTranslation('contact');
  usePageMeta({ titleKey: 'meta.title', descriptionKey: 'meta.description', ns: 'contact', path: '/contact' });
  const { toast } = useToast();
  const { trackFormStart, trackFormSubmit } = useAnalytics();
  const hasTrackedFormStart = useRef<boolean>(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', company: '', interest: '', message: '', _hp_website: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // SCHEMA MARKUP OPTIMIZADO PARA SEO
  useEffect(() => {
    const schemaScript: HTMLScriptElement = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "mainEntity": {
        "@type": "Organization",
        "name": localizedSchema("INNATE.data - Arquitectura Zero-Egress", "INNATE.data - Zero-Egress Architecture"),
        "description": localizedSchema("Arquitectura zero-egress de IA empresarial. La IA se despliega dentro del data warehouse del cliente. 282M+ registros, 270% ROI verificado.", "Zero-egress enterprise AI architecture. AI deploys inside the client's data warehouse. 282M+ records, 270% verified ROI."),
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+593-983391240",
          "email": "ai@alexseis.com",
          "contactType": localizedSchema("Arquitecto Zero-Egress", "Zero-Egress Architect"),
          "areaServed": "Global",
          "availableLanguage": ["Spanish", "English"],
          "serviceType": [
            localizedSchema("Arquitectura Zero-Egress (INNATE Core)", "Zero-Egress Architecture (INNATE Core)"),
            localizedSchema("Ecosistema Multi-Departamento (ALBA + CREATIA + AUTO)", "Multi-Department Ecosystem (ALBA + CREATIA + AUTO)"),
            localizedSchema("MCP Servers + BigQuery Integration", "MCP Servers + BigQuery Integration"),
            localizedSchema("IA Generativa Enterprise con Vertex AI", "Enterprise Generative AI with Vertex AI")
          ]
        },
        "founder": {
          "@type": "Person",
          "name": "Alex Seis",
          "jobTitle": localizedSchema("Arquitecto Zero-Egress | INNATE.data", "Zero-Egress Architect | INNATE.data"),
          "expertise": ["Zero-Egress Architecture", "MCP Servers", "Enterprise AI", "BigQuery"]
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "EC"
        },
        "url": typeof window !== 'undefined' ? window.location.origin : "https://alexseis.com"
      }
    });

    document.head.appendChild(schemaScript);
    return () => {
      if (document.head.contains(schemaScript)) {
        document.head.removeChild(schemaScript);
      }
    };
  }, [i18n.language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    // Track first form interaction
    if (!hasTrackedFormStart.current) {
      trackFormStart('contact');
      hasTrackedFormStart.current = true;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = t('validation.name_required');
    if (!formData.email.trim()) {
      newErrors.email = t('validation.email_required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('validation.email_invalid');
    }
    if (!formData.message.trim()) newErrors.message = t('validation.message_required');
    else if (formData.message.trim().length < 10) newErrors.message = t('validation.message_min_length');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: t('validation.validation_error'),
        description: t('validation.fix_errors'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json() as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || t('error.send_failed'));
      }

      toast({
        title: t('success.title'),
        description: t('success.description'),
        className: "bg-accent text-bg-dark border-accent",
      });

      // Track successful conversion
      trackFormSubmit('contact', {
        interest: formData.interest,
        has_company: !!formData.company,
      });

      setFormData({ name: '', email: '', company: '', interest: '', message: '', _hp_website: '' });
      setErrors({});
      hasTrackedFormStart.current = false;
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : t('error.send_failed');
      toast({
        title: t('error.title'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo: ContactInfoItem[] = [
    { icon: Mail, text: "ai@alexseis.com", href: "mailto:ai@alexseis.com", labelKey: "email_label" },
    { icon: Phone, text: "+593 983391240", href: "tel:+593983391240", labelKey: "phone_label" },
  ];

  // URLs reales actualizadas basadas en los perfiles confirmados
  const socialLinks: SocialLink[] = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/alex-patricio-seis-espinosa-09402578", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/alexsix6", label: "GitHub" },
    { icon: Twitter, href: "https://x.com/AlexSeis0204", label: "X (Twitter)" },
    { icon: Instagram, href: "https://instagram.com/alexseis81", label: "Instagram" },
    { icon: TikTokIcon, href: "https://tiktok.com/@alex.seis", label: "TikTok" },
  ];

  return (
    <motion.div
      className="py-12 md:py-20 container-max"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* SECCIÓN DE INTRODUCCIÓN OPTIMIZADA PARA SEO */}
      <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
        <h1 className="text-h1 font-extrabold mb-4">
          {t('hero.title_1')} <span className="text-accent">{t('hero.title_accent')}</span><br/>
          {t('hero.title_2')} <span className="text-primary">{t('hero.title_primary')}</span>
        </h1>
        <p
          className="text-h3 max-w-3xl mx-auto font-normal"
          style={{ color: 'var(--current-text-secondary)' }}
          dangerouslySetInnerHTML={{ __html: t('hero.subtitle') }}
        />
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8 md:gap-12 items-start">
        {/* Columna del Formulario */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-3 glass-card p-6 md:p-8 border-primary/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 hero-gradient opacity-10 z-0"></div>
          <div className="relative z-10">
            <h2 className="text-h2 font-semibold text-primary mb-6 md:mb-8">{t('form.title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField id="name" name="name" labelText={t('form.name')} placeholder={t('form.name_placeholder')} value={formData.name} onChange={handleChange} error={errors.name} icon={User} />
              <InputField id="email" name="email" type="email" labelText={t('form.email')} placeholder={t('form.email_placeholder')} value={formData.email} onChange={handleChange} error={errors.email} icon={Mail} />
              <InputField id="company" name="company" labelText={t('form.company')} placeholder={t('form.company_placeholder')} value={formData.company} onChange={handleChange} error={errors.company} icon={Briefcase} />

              <div className="space-y-1.5">
                <label htmlFor="interest" className="block text-sm font-medium" style={{ color: 'var(--current-text-secondary)' }}>{t('form.interest')}</label>
                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MessageCircle className="h-5 w-5" style={{ color: 'var(--current-text-muted)' }} aria-hidden="true" />
                    </div>
                    <select
                      id="interest" name="interest" value={formData.interest} onChange={handleChange}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-lg bg-transparent appearance-none focus:outline-none
                                  ${errors.interest ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                  : 'focus:border-accent focus:ring-accent'}`}
                      style={{ borderColor: errors.interest ? undefined : 'var(--current-border)', color: 'var(--current-text)' }}
                    >
                      <option value="rag-implementation" style={{ backgroundColor: 'var(--current-surface)' }}>{t('interests_options.rag_implementation')}</option>
                      <option value="enterprise-chatbots" style={{ backgroundColor: 'var(--current-surface)' }}>{t('interests_options.enterprise_chatbots')}</option>
                      <option value="serverless-platforms" style={{ backgroundColor: 'var(--current-surface)' }}>{t('interests_options.serverless_platforms')}</option>
                      <option value="llm-integration" style={{ backgroundColor: 'var(--current-surface)' }}>{t('interests_options.llm_integration')}</option>
                      <option value="bigquery-ai" style={{ backgroundColor: 'var(--current-surface)' }}>{t('interests_options.bigquery_ai')}</option>
                      <option value="consultoria-general" style={{ backgroundColor: 'var(--current-surface)' }}>{t('interests_options.consultoria_general')}</option>
                    </select>
                </div>
                {errors.interest && <p className="text-red-500 text-xs mt-1">{errors.interest}</p>}
              </div>

              <TextareaField id="message" name="message" labelText={t('form.message')} placeholder={t('form.message_placeholder')} value={formData.message} onChange={handleChange} error={errors.message} />

              {/* Honeypot field - hidden from users, catches bots */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                <label htmlFor="_hp_website">Website</label>
                <input
                  type="text"
                  id="_hp_website"
                  name="_hp_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData._hp_website || ''}
                  onChange={handleChange}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full btn btn-primary text-lg py-3.5"
                disabled={isSubmitting}
              >
                {isSubmitting ? <div className="loading-spinner !w-6 !h-6 !border-2 !m-0"></div> : (<>{t('form.submit')} <Send className="ml-2 h-5 w-5" /></>)}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Columna de Información de Contacto y Social Media */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="glass-card p-6 md:p-8 border-secondary/30">
            <h3 className="text-h3 font-semibold text-secondary mb-4 md:mb-6">{t('direct_contact')}</h3>
            <div className="space-y-4">
              {contactInfo.map((item) => (
                <a key={item.labelKey} href={item.href} className="flex items-center hover:text-secondary transition-colors group" style={{ color: 'var(--current-text-secondary)' }}>
                  <item.icon className="h-5 w-5 mr-3 text-secondary flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{item.text}</span>
                </a>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--current-border)' }}>
                 <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--current-text-secondary)' }}>{t('follow_us')}</h4>
                 <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="hover:text-accent transition-colors p-2.5 rounded-full"
                            style={{ color: 'var(--current-text-muted)', backgroundColor: 'var(--current-surface)' }}
                        >
                            <social.icon className="h-5 w-5" />
                        </a>
                    ))}
                 </div>
            </div>
          </div>

          {/* SECCIÓN: Stack Tecnológico Específico */}
          <div className="glass-card p-6 md:p-8 border-accent/30">
            <h3 className="text-h3 font-semibold text-accent mb-4">{t('stack.title')}</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--current-text-secondary)' }}>{t('stack.llm_title')}</h4>
                <p className="text-xs" style={{ color: 'var(--current-text-muted)' }}>{t('stack.llm_desc')}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--current-text-secondary)' }}>{t('stack.cloud_title')}</h4>
                <p className="text-xs" style={{ color: 'var(--current-text-muted)' }}>{t('stack.cloud_desc')}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--current-text-secondary)' }}>{t('stack.vector_title')}</h4>
                <p className="text-xs" style={{ color: 'var(--current-text-muted)' }}>{t('stack.vector_desc')}</p>
              </div>
            </div>
          </div>

          {/* SECCIÓN: "Mi Filosofía" */}
          <div className="glass-card p-6 md:p-8 border-accent/30">
            <h3 className="text-h3 font-semibold text-accent mb-4 italic">{t('philosophy.title')}</h3>
            <p className="text-center text-md leading-relaxed italic" style={{ color: 'var(--current-text-secondary)' }}>
              {t('philosophy.quote')}
              </p>
              <p className="text-center text-sm mt-2" style={{ color: 'var(--current-text-muted)' }}>
                {t('philosophy.subtitle')}
              </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
