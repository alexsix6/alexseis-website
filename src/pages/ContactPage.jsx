import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { 
    Mail, Phone, MapPin, Send, Briefcase, MessageCircle, User, 
    Linkedin, Instagram, Twitter, Github, FileText // Usando FileText como placeholder para TikTok
} from 'lucide-react';

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
    setTimeout(() => {
      console.log('Form data submitted:', formData);
      toast({
        title: "Mensaje Enviado Exitosamente",
        description: "Gracias por contactarnos. Nos pondremos en contacto contigo pronto.",
        className: "bg-accent text-bg-dark border-accent",
      });
      setFormData({ name: '', email: '', company: '', interest: '', message: '' });
      setErrors({});
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    { icon: Mail, text: "info@alexseis.com", href: "mailto:info@alexseis.com", label: "Correo Electrónico" },
    { icon: Phone, text: "+593 987654321", href: "tel:+593987654321", label: "Teléfono" },
    // La información de MapPin se elimina ya que no queremos la sección de ubicación
    // { icon: MapPin, text: "Quito, Ecuador (Presencia Global)", href: "#", label: "Ubicación" }, 
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/in/tu-perfil", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/tu-usuario", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com/tu-usuario", label: "X (Twitter)" },
    { icon: Instagram, href: "https://instagram.com/tu-usuario", label: "Instagram" },
    { icon: FileText, href: "https://tiktok.com/@tu-usuario", label: "TikTok" }, // Reemplaza FileText con un SVG de TikTok si lo tienes
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
          Ponte en <span className="text-accent">Contacto</span>
        </h1>
        <p className="text-h3 text-gray-300 max-w-3xl mx-auto font-normal">
          ¿Listo para transformar tu negocio con IA? Hablemos de tus ideas y proyectos. Estamos aquí para ayudarte.
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
                      <option value="" className="bg-bg-dark text-gray-400">Selecciona un área de interés...</option>
                      <option value="agentes-ia" className="bg-bg-dark">Desarrollo de Agentes de IA</option>
                      <option value="google-cloud" className="bg-bg-dark">Soluciones Google Cloud</option>
                      <option value="gpts-claude" className="bg-bg-dark">GPTs y Claude</option>
                      <option value="consultoria" className="bg-bg-dark">Consultoría General</option>
                      <option value="otro" className="bg-bg-dark">Otro</option>
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
                 <h4 className="text-lg font-semibold text-gray-200 mb-4">Síguenos</h4> {/* Título más corto */}
                 <div className="flex flex-wrap gap-3"> {/* Reducido gap para acomodar más iconos si es necesario */}
                    {socialLinks.map(social => (
                        <a 
                            key={social.label} 
                            href={social.href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label={social.label}
                            className="text-gray-400 hover:text-accent transition-colors p-2.5 bg-gray-800/50 hover:bg-gray-700/70 rounded-full" // Ajustado padding
                        >
                            <social.icon className="h-5 w-5" /> {/* Tamaño de ícono ligeramente reducido */}
                        </a>
                    ))}
                 </div>
            </div>
          </div>
          
          {/* SECCIÓN MODIFICADA: "¿Listo para Innovar?" */}
          <div className="glass-card p-6 md:p-8 border-accent/30">
            <h3 className="text-h3 font-semibold text-accent mb-4 italic">Un Pensamiento...</h3> {/* Título modificado y en cursiva */}
            <p className="text-gray-300 text-center text-md leading-relaxed italic"> {/* Texto modificado, centrado y en cursiva */}
              "A veces lo más valioso no esta escondido, simplemente, nadie lo esta mirando."
            </p>
            {/* Se eliminó la imagen/logo de Google Cloud y el texto anterior */}
          </div>
        </motion.div>
      </div>

      {/* LA SECCIÓN DE MAPA HA SIDO ELIMINADA */}

    </motion.div>
  );
};

export default ContactPage;