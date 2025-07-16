import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { 
    Mail, Phone, MapPin, Send, Briefcase, MessageCircle, User, 
    Linkedin, Instagram, Twitter, Github
} from 'lucide-react';

// Componente TikTok Icon personalizado
const TikTokIcon = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.204-1.924-1.204-2.338C16.537 1.434 16.21 1 15.644 1h-3.497c-.566 0-1.02.434-1.02 1v11.587a2.896 2.896 0 1 1-1.84-2.706V7.548a6.27 6.27 0 0 0-.84-.057C4.347 7.491 1 10.838 1 15.938S4.347 24.385 8.447 24.385s7.447-3.347 7.447-7.447V9.133a9.524 9.524 0 0 0 5.606 1.791V7.427a5.923 5.923 0 0 1-2.179-1.865Z"/>
  </svg>
);

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Componente InputField (etiqueta siempre arriba)
const InputField = ({ id, name, type = "text", placeholder, value, onChange, error, icon: Icon, labelText }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300">
      {labelText || placeholder}
    </label>
    <div className="relative rounded-md shadow-sm">
      {Icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-gray-500" aria-hidden="true" />
      </div>}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder.endsWith(' *') ? placeholder.substring(0, placeholder.length - 2) : placeholder}
        className={`block w-full rounded-lg border bg-transparent text-text-light 
                    px-4 py-3 ${Icon ? 'pl-10' : 'pl-4'} 
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-700 focus:border-accent focus:ring-accent'}`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// Componente TextareaField (etiqueta siempre arriba)
const TextareaField = ({ id, name, placeholder, value, onChange, error, labelText }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300">
      {labelText || placeholder}
    </label>
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder.endsWith(' *') ? placeholder.substring(0, placeholder.length - 2) : placeholder}
      rows={5}
      className={`block w-full rounded-lg border bg-transparent text-text-light px-4 py-3
                  ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-700 focus:border-accent focus:ring-accent'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', interest: '', message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido.";
    }
    if (!formData.message.trim()) newErrors.message = "El mensaje es obligatorio.";
    else if (formData.message.trim().length < 10) newErrors.message = "El mensaje debe tener al menos 10 caracteres.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Error de Validación",
        description: "Por favor, corrige los errores en el formulario.",
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
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar');
      }
  
      toast({
        title: "Mensaje Enviado Exitosamente",
        description: "Gracias por contactarnos. Nos pondremos en contacto contigo pronto.",
        className: "bg-accent text-bg-dark border-accent",
      });
      
      setFormData({ name: '', email: '', company: '', interest: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Hubo un error al enviar el mensaje",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, text: "ai@alexseis.com", href: "mailto:ai@alexseis.com", label: "Correo Electrónico" },
    { icon: Phone, text: "+593 983391240", href: "tel:+593983391240", label: "Teléfono" },
    // La información de MapPin se elimina ya que no queremos la sección de ubicación
    // { icon: MapPin, text: "Quito, Ecuador (Presencia Global)", href: "#", label: "Ubicación" }, 
  ];

  // URLs reales actualizadas basadas en los perfiles confirmados
  const socialLinks = [
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
      <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
        <h1 className="text-h1 font-extrabold mb-4">
          Hablemos de Tu <span className="text-accent">Situación</span>
        </h1>
        <p className="text-h3 text-gray-300 max-w-3xl mx-auto font-normal">
          ¿Tus datos están dispersos? ¿Pierdes tiempo en procesos manuales? ¿Necesitas información clara para tomar mejores decisiones? Analicemos tu situación específica.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8 md:gap-12 items-start">
        {/* Columna del Formulario */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-3 glass-card p-6 md:p-8 border-primary/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 hero-gradient opacity-10 z-0"></div>
          <div className="relative z-10">
            <h2 className="text-h2 font-semibold text-primary mb-6 md:mb-8">Envíanos un Mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField id="name" name="name" labelText="Nombre Completo *" placeholder="Tu nombre completo" value={formData.name} onChange={handleChange} error={errors.name} icon={User} />
              <InputField id="email" name="email" type="email" labelText="Correo Electrónico *" placeholder="ejemplo@dominio.com" value={formData.email} onChange={handleChange} error={errors.email} icon={Mail} />
              <InputField id="company" name="company" labelText="Empresa" placeholder="Nombre de tu empresa (Opcional)" value={formData.company} onChange={handleChange} error={errors.company} icon={Briefcase} />
              
              <div className="space-y-1.5">
                <label htmlFor="interest" className="block text-sm font-medium text-gray-300">Estoy interesado en...</label>
                <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MessageCircle className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                    <select 
                      id="interest" name="interest" value={formData.interest} onChange={handleChange}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-lg bg-transparent text-text-light appearance-none focus:outline-none
                                  ${errors.interest ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                                  : 'border-gray-700 focus:border-accent focus:ring-accent'}`}
                    >
                      <option value="auditoria-datos" className="bg-bg-dark">Auditoría de Datos y Procesos</option>
                      <option value="dashboard-analytics" className="bg-bg-dark">Dashboards y Analytics</option>
                      <option value="automatizacion" className="bg-bg-dark">Automatización de Procesos</option>
                      <option value="optimizacion-rrhh" className="bg-bg-dark">Optimización RRHH</option>
                      <option value="seguridad-fisica" className="bg-bg-dark">Sistemas de Seguridad</option>
                      <option value="consultoria-general" className="bg-bg-dark">Consultoría General</option>
                    </select>
                </div>
                {errors.interest && <p className="text-red-500 text-xs mt-1">{errors.interest}</p>}
              </div>

              <TextareaField id="message" name="message" labelText="Tu Mensaje *" placeholder="Describe tu proyecto o consulta aquí..." value={formData.message} onChange={handleChange} error={errors.message} />
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full btn btn-primary text-lg py-3.5"
                disabled={isSubmitting}
              >
                {isSubmitting ? <div className="loading-spinner !w-6 !h-6 !border-2 !m-0"></div> : (<>Enviar Mensaje <Send className="ml-2 h-5 w-5" /></>)}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Columna de Información de Contacto y Social Media */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="glass-card p-6 md:p-8 border-secondary/30">
            <h3 className="text-h3 font-semibold text-secondary mb-4 md:mb-6">Información de Contacto</h3>
            <div className="space-y-4">
              {contactInfo.map(item => (
                <a key={item.label} href={item.href} className="flex items-center text-gray-300 hover:text-secondary transition-colors group">
                  <item.icon className="h-5 w-5 mr-3 text-secondary flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{item.text}</span>
                </a>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700/50">
                 <h4 className="text-lg font-semibold text-gray-200 mb-4">Síguenos</h4>
                 <div className="flex flex-wrap gap-3">
                    {socialLinks.map(social => (
                        <a 
                            key={social.label} 
                            href={social.href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label={social.label}
                            className="text-gray-400 hover:text-accent transition-colors p-2.5 bg-gray-800/50 hover:bg-gray-700/70 rounded-full"
                        >
                            <social.icon className="h-5 w-5" />
                        </a>
                    ))}
                 </div>
            </div>
          </div>
          
          {/* SECCIÓN: "Mi Filosofía" */}
          <div className="glass-card p-6 md:p-8 border-accent/30">
            <h3 className="text-h3 font-semibold text-accent mb-4 italic">Mi Filosofía</h3>
            <p className="text-gray-300 text-center text-md leading-relaxed italic">
              "Lo que se mide, se mejora. Lo que no se mide, se deteriora."
              </p>
              <p className="text-gray-400 text-center text-sm mt-2">
                — Cada proyecto debe generar métricas concretas de mejora
              </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactPage;