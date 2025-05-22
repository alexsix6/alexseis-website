import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input'; // Assuming this is a styled input
    import { Textarea } from '@/components/ui/textarea'; // Assuming this is a styled textarea
    import { Label } from '@/components/ui/label'; // Assuming this is a styled label
    import { useToast } from "@/components/ui/use-toast";
    import { Mail, Phone, MapPin, Send, Briefcase, MessageCircle, User } from 'lucide-react';

    const pageVariants = {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
    };

    const itemVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };
    
    const ContactPage = () => {
      const { toast } = useToast();
      const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        interest: '',
        message: '',
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

      const InputField = ({ id, name, type = "text", placeholder, value, onChange, error, icon: Icon }) => (
        <div className="floating-label-input">
          {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" style={{paddingTop: '0.1rem'}}/>}
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder} /* Needs to be present for :placeholder-shown */
            className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border rounded-lg bg-transparent text-text-light 
                       ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                               : 'border-gray-700 focus:border-accent focus:ring-accent'}`}
          />
          <label htmlFor={id} className={`absolute ${Icon ? 'left-12' : 'left-4'} top-3 text-gray-400 text-sm transition-all duration-200 pointer-events-none`}>
            {placeholder}
          </label>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );

      const TextareaField = ({ id, name, placeholder, value, onChange, error, icon: Icon }) => (
         <div className="floating-label-input">
          {Icon && <Icon className="absolute left-4 top-5 h-5 w-5 text-gray-500 z-10" />}
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={5}
            className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border rounded-lg bg-transparent text-text-light 
                       ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                               : 'border-gray-700 focus:border-accent focus:ring-accent'}`}
          />
          <label htmlFor={id} className={`absolute ${Icon ? 'left-12' : 'left-4'} top-3 text-gray-400 text-sm transition-all duration-200 pointer-events-none`}>
            {placeholder}
          </label>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );


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
            <motion.div 
              variants={itemVariants} 
              className="lg:col-span-3 glass-card p-6 md:p-8 border-primary/30 relative overflow-hidden"
            >
              <div className="absolute inset-0 hero-gradient opacity-10 z-0"></div>
              <div className="relative z-10">
                <h2 className="text-h2 font-semibold text-primary mb-6 md:mb-8">Envíanos un Mensaje</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <InputField id="name" name="name" placeholder="Nombre Completo *" value={formData.name} onChange={handleChange} error={errors.name} icon={User} />
                  <InputField id="email" name="email" type="email" placeholder="Correo Electrónico *" value={formData.email} onChange={handleChange} error={errors.email} icon={Mail} />
                  <InputField id="company" name="company" placeholder="Empresa (Opcional)" value={formData.company} onChange={handleChange} error={errors.company} icon={Briefcase} />
                  
                  <div className="floating-label-input">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" style={{paddingTop: '0.1rem'}}/>
                    <select 
                      id="interest" name="interest" value={formData.interest} onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg bg-transparent text-text-light appearance-none
                                 ${errors.interest ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                  : 'border-gray-700 focus:border-accent focus:ring-accent'}`}
                    >
                      <option value="" className="bg-bg-dark">Estoy interesado en...</option>
                      <option value="agentes-ia" className="bg-bg-dark">Desarrollo de Agentes de IA</option>
                      <option value="google-cloud" className="bg-bg-dark">Soluciones Google Cloud</option>
                      <option value="gpts-claude" className="bg-bg-dark">GPTs y Claude</option>
                      <option value="consultoria" className="bg-bg-dark">Consultoría General</option>
                      <option value="otro" className="bg-bg-dark">Otro</option>
                    </select>
                    <label htmlFor="interest" className="absolute left-12 top-3 text-gray-400 text-sm transition-all duration-200 pointer-events-none">
                      Estoy interesado en...
                    </label>
                    {errors.interest && <p className="text-red-500 text-xs mt-1">{errors.interest}</p>}
                  </div>

                  <TextareaField id="message" name="message" placeholder="Tu Mensaje *" value={formData.message} onChange={handleChange} error={errors.message} />
                  
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

            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6 md:space-y-8">
              <div className="glass-card p-6 md:p-8 border-secondary/30">
                <h3 className="text-h3 font-semibold text-secondary mb-4 md:mb-6">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-300 hover:text-secondary transition-colors">
                    <Mail className="h-5 w-5 mr-3 text-secondary flex-shrink-0" />
                    <a href="mailto:info@aisolutionscorp.example.com">info@aisolutionscorp.example.com</a>
                  </div>
                  <div className="flex items-center text-gray-300 hover:text-secondary transition-colors">
                    <Phone className="h-5 w-5 mr-3 text-secondary flex-shrink-0" />
                    <a href="tel:+15551234567">+1 (555) 123-4567</a>
                  </div>
                  <div className="flex items-start text-gray-300">
                    <MapPin className="h-5 w-5 mr-3 mt-1 text-secondary flex-shrink-0" />
                    <span>123 Tech Avenue, Innovation City, CA 90210, USA</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 md:p-8 border-accent/30">
                <h3 className="text-h3 font-semibold text-accent mb-4">¿Listo para Innovar?</h3>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  Estamos entusiasmados por conocer tus desafíos y explorar cómo nuestras soluciones de IA pueden ayudarte a alcanzar tus metas. 
                  Aplicar al programa <span className="font-semibold text-accent">Google for Startups Cloud</span> es uno de nuestros próximos objetivos.
                </p>
                 <img  
                  alt="Logo de Google Cloud Platform"
                  className="h-10 opacity-80"
                 src="https://images.unsplash.com/photo-1667984390553-7f439e6ae401" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      );
    };

    export default ContactPage;