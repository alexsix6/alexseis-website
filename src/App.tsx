import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Home, Briefcase, Target, Users, Mail, BookOpen, Bot, Cloud, Puzzle, Zap, LucideIcon } from 'lucide-react';
import { ThemeToggleMinimal } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import SpaceEffects from '@/components/SpaceEffects';
import { Toaster } from "@/components/ui/toaster";
import EmailCapture from '@/components/EmailCapture';
import { useAnalytics } from '@/hooks/useAnalytics';

// INNATE.data logo (WebP optimized: 35KB from 2.5MB PNG)
import logo from '@/assets/innate-logo.webp';

// ===== LAZY-LOADED PAGES =====
// Each page becomes its own chunk, loaded on-demand
const HomePage = lazy(() => import('@/pages/HomePage'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const IntakePage = lazy(() => import('@/pages/IntakePage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));

// Lazy-load Agent3D (Spline 3D is ~4MB, only load when needed)
const Agent3D = lazy(() => import('@/components/Agent3D'));

// ===== NAV ITEM TYPE =====
interface NavItemConfig {
  path: string;
  labelKey: string;
  icon: LucideIcon;
}

// ===== LOADING FALLBACK =====
const PageLoader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}
        />
        <p className="text-sm" style={{ color: 'var(--current-text-muted)' }}>{t('loading')}</p>
      </div>
    </div>
  );
};

// ===== ANALYTICS PAGE TRACKER =====
// Tracks page views on route change
function AnalyticsTracker(): null {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  return null;
}

const navItems: NavItemConfig[] = [
  { path: '/', labelKey: 'nav.home', icon: Home },
  { path: '/services', labelKey: 'nav.services', icon: Briefcase },
  { path: '/projects', labelKey: 'nav.projects', icon: Target },
  { path: '/about', labelKey: 'nav.about', icon: Users },
  { path: '/contact', labelKey: 'nav.contact', icon: Mail },
  { path: '/blog', labelKey: 'nav.blog', icon: BookOpen },
];

function AppContent(): React.JSX.Element {
  const { trackCTAClick } = useAnalytics();
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-col min-h-screen transition-all duration-300"
      style={{
        color: 'var(--current-text)'
      }}
    >
      {/* Analytics Page View Tracker */}
      <AnalyticsTracker />

      {/* Space Effects - Only in Dark Mode */}
      <SpaceEffects />

      <header
        className="sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300"
        style={{
          backgroundColor: 'var(--current-glass)',
          borderBottomColor: 'var(--current-border)',
          boxShadow: '0 4px 6px var(--current-shadow)'
        }}
      >
        <nav className="container-max h-20 flex justify-between items-center">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <NavLink to="/" className="flex items-center">
              <img
                src={logo}
                alt={t('logo_alt')}
                className="h-12 md:h-20 w-auto object-contain transition-all duration-300 hover:scale-105"
                width="200"
                height="80"
                loading="eager"
              />
            </NavLink>
          </motion.div>

          {/* Navigation + CTA + Theme Toggle + Language Switcher */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggleMinimal />

            <ul className="hidden md:flex space-x-3 items-center">
              {navItems.map((item) => (
                <motion.li key={item.path} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-button text-sm font-medium transition-all duration-300 ease-in-out
                       hover:text-accent
                       ${isActive
                         ? 'bg-primary text-white shadow-md'
                         : ''
                       }`
                    }
                    style={({ isActive }) => ({
                      color: isActive ? '#FFFFFF' : 'var(--current-text-secondary)',
                      backgroundColor: isActive ? 'var(--primary)' : 'transparent'
                    })}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      const target = e.currentTarget;
                      if (!target.classList.contains('bg-primary')) {
                        target.style.backgroundColor = 'var(--current-surface-hover)';
                      }
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      const target = e.currentTarget;
                      if (!target.classList.contains('bg-primary')) {
                        target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {t(item.labelKey)}
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            {/* Sticky CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <NavLink
                to="/intake"
                onClick={() => trackCTAClick('header_cta', 'header')}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  boxShadow: '0 4px 15px rgba(var(--primary-rgb), 0.4)',
                }}
              >
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">{t('cta.roadmap')}</span>
                <span className="sm:hidden">{t('cta.roadmap')}</span>
              </NavLink>
            </motion.div>
          </div>

        </nav>
      </header>

      <main className="flex-grow relative z-10">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/intake" element={<IntakePage />} />
            <Route path="/roadmap" element={<IntakePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* Lazy-loaded 3D Chat Agent */}
      <Suspense fallback={null}>
        <Agent3D />
      </Suspense>

      <footer
        className="py-8 mt-auto shadow-inner border-t transition-all duration-300 relative z-10"
        style={{
          backgroundColor: 'var(--current-bg-secondary)',
          color: 'var(--current-text-muted)',
          borderTopColor: 'var(--current-border)'
        }}
      >
        <div className="container-max">
          {/* Email Capture / Newsletter */}
          <div className="mb-8 pb-8 border-b" style={{ borderBottomColor: 'var(--current-border)' }}>
            <EmailCapture variant="inline" />
          </div>

          {/* Footer content */}
          <div className="text-center flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-2 md:mb-0">&copy; {new Date().getFullYear()} {t('footer.brand', { defaultValue: 'INNATE.data by Alex Seis' })}. {t('footer.rights')}</p>
            <div className="flex space-x-4 mb-2 md:mb-0">
              <a
                href="https://github.com/alexsix6"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="transition-colors hover:text-accent"
                style={{ color: 'var(--current-text-muted)' }}
              >
                <Bot size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/alex-patricio-seis-espinosa-09402578"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-colors hover:text-accent"
                style={{ color: 'var(--current-text-muted)' }}
              >
                <Cloud size={20} />
              </a>
              <a
                href="https://x.com/AlexSeis0204"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="transition-colors hover:text-accent"
                style={{ color: 'var(--current-text-muted)' }}
              >
                <Puzzle size={20}/>
              </a>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <NavLink to="/privacy" className="hover:text-accent transition-colors" style={{ color: 'var(--current-text-muted)' }}>
                {t('footer.privacy_policy')}
              </NavLink>
              <span>·</span>
              <span>
                {t('footer.designed_with')} <span className="text-accent">IA</span> {t('footer.and')} <span className="text-secondary">♥</span> {t('footer.for_innovation')}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App(): React.JSX.Element {
  return (
    <Router>
      <AppContent />
      <Toaster />
    </Router>
  );
}

export default App;
