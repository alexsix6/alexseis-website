import React from 'react';
    import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Home, Briefcase, Target, Users, Mail, Bot, Cloud, Puzzle, Code } from 'lucide-react';
    import logo from '@/assets/Logoweb.png'; // <-- AGREGAR ESTA LÍNEA

    import HomePage from '@/pages/HomePage';
    import ServicesPage from '@/pages/ServicesPage';
    import ProjectsPage from '@/pages/ProjectsPage';
    import AboutPage from '@/pages/AboutPage';
    import ContactPage from '@/pages/ContactPage';
    import { Toaster } from "@/components/ui/toaster";
    
    const navItems = [
      { path: '/', label: 'Inicio', icon: Home },
      { path: '/services', label: 'Servicios', icon: Briefcase },
      { path: '/projects', label: 'Proyectos', icon: Target },
      { path: '/about', label: 'Nosotros', icon: Users },
      { path: '/contact', label: 'Contacto', icon: Mail },
    ];

    function App() {
      return (
        <Router>
          <div className="flex flex-col min-h-screen bg-bg-dark text-text-light">
            <header className="sticky top-0 z-50 shadow-strong backdrop-blur-lg bg-bg-dark/80">
              <nav className="container-max h-20 flex justify-between items-center"> {/* Navbar height 80px (h-20) */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                <NavLink to="/" className="flex items-center">
                  <img 
                    src={logo} 
                    alt="AI Solutions Corp" 
                    className="h-12 md:h-20 w-auto object-contain transition-all duration-300 hover:scale-105" 
                  />
                </NavLink>
              </motion.div>
                <ul className="flex space-x-3 items-center"> {/* Reduced space for more items if needed */}
                  {navItems.map((item) => (
                    <motion.li key={item.path} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 rounded-button text-sm font-medium transition-all duration-300 ease-in-out
                           hover:text-accent hover:bg-white/5
                           ${isActive ? 'bg-primary text-white shadow-md' : 'text-gray-300'}`
                        }
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.label}
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </header>

            <main className="flex-grow"> {/* Removed container from here, pages will handle it */}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </main>

            <footer className="bg-bg-dark/90 text-gray-400 py-6 mt-auto shadow-inner border-t border-glass-border">
              <div className="container-max text-center flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm mb-2 md:mb-0">&copy; {new Date().getFullYear()} AI Solutions Corp. Todos los derechos reservados.</p>
                <div className="flex space-x-4 mb-2 md:mb-0">
                  <a href="#" aria-label="Twitter" className="hover:text-accent transition-colors"><Bot size={20} /></a>
                  <a href="#" aria-label="LinkedIn" className="hover:text-accent transition-colors"><Cloud size={20} /></a>
                  <a href="#" aria-label="GitHub" className="hover:text-accent transition-colors"><Puzzle size={20}/></a>
                </div>
                <p className="text-xs">Diseñado con <span className="text-accent">IA</span> y <span className="text-secondary">♥</span> para la innovación.</p>
              </div>
            </footer>
          </div>
          <Toaster />
        </Router>
      );
    }

    export default App;