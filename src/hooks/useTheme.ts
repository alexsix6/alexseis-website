import { useState, useEffect } from 'react';
import type { Theme } from '@/types';

export interface UseThemeReturn {
  theme: Theme;
  isDark: boolean;
  isLight: boolean;
  isLoading: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  systemPrefersDark: boolean;
}

/**
 * Hook personalizado para manejar el tema light/dark
 * Mantiene persistencia en localStorage y aplica clase CSS automáticamente
 */
export function useTheme(): UseThemeReturn {
  // Estado del tema (light/dark)
  const [theme, setThemeState] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Aplicar tema al DOM - CORREGIDO para compatibilidad con SpaceEffects
  const applyTheme = (newTheme: Theme): void => {
    try {
      const htmlElement = document.documentElement;

      if (newTheme === 'dark') {
        htmlElement.classList.add('dark');

        // SpaceEffects se encarga del fondo espacial
        document.body.style.backgroundColor = 'transparent';
        document.body.style.backgroundImage = 'none';

        // Aplicar solo variables CSS necesarias si existen
        htmlElement.style.setProperty('--current-bg', '#0f0f23');
        htmlElement.style.setProperty('--current-text', '#ffffff');
        htmlElement.style.setProperty('--current-text-secondary', '#e2e8f0');
        htmlElement.style.setProperty('--current-surface-hover', 'rgba(255, 255, 255, 0.1)');
        htmlElement.style.setProperty('--current-glass', 'rgba(15, 15, 35, 0.8)');
        htmlElement.style.setProperty('--current-border', 'rgba(6, 255, 165, 0.3)');
        htmlElement.style.setProperty('--current-shadow', 'rgba(0, 0, 0, 0.3)');
        htmlElement.style.setProperty('--current-bg-secondary', 'rgba(26, 27, 58, 0.9)');
        htmlElement.style.setProperty('--current-text-muted', 'rgba(226, 232, 240, 0.7)');

      } else {
        htmlElement.classList.remove('dark');

        // SpaceEffects se encarga del fondo claro
        document.body.style.backgroundColor = 'transparent';
        document.body.style.backgroundImage = 'none';

        // Aplicar variables CSS para light mode
        htmlElement.style.setProperty('--current-bg', '#ffffff');
        htmlElement.style.setProperty('--current-text', '#1f2937');
        htmlElement.style.setProperty('--current-text-secondary', '#6b7280');
        htmlElement.style.setProperty('--current-surface-hover', 'rgba(0, 0, 0, 0.05)');
        htmlElement.style.setProperty('--current-glass', 'rgba(255, 255, 255, 0.8)');
        htmlElement.style.setProperty('--current-border', 'rgba(229, 231, 235, 0.8)');
        htmlElement.style.setProperty('--current-shadow', 'rgba(0, 0, 0, 0.1)');
        htmlElement.style.setProperty('--current-bg-secondary', 'rgba(248, 250, 252, 0.9)');
        htmlElement.style.setProperty('--current-text-muted', 'rgba(107, 114, 128, 1)');
      }

      console.log(`🎨 Theme applied: ${newTheme}, dark class present: ${htmlElement.classList.contains('dark')}`);

    } catch (error) {
      console.error('Error applying theme:', error);
    }
  };

  // Inicializar tema desde localStorage o preferencias del sistema
  useEffect(() => {
    const initializeTheme = (): void => {
      try {
        // 1. Intentar obtener preferencia guardada
        const savedTheme = localStorage.getItem('alexseis-theme');

        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setThemeState(savedTheme);
          applyTheme(savedTheme);
        } else {
          // 2. Si no hay preferencia, usar preferencia del sistema
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const systemTheme: Theme = systemPrefersDark ? 'dark' : 'light';
          setThemeState(systemTheme);
          applyTheme(systemTheme);

          // Guardar la preferencia detectada
          localStorage.setItem('alexseis-theme', systemTheme);
        }
      } catch (error) {
        console.warn('Error loading theme preference:', error);
        // Fallback a light mode
        setThemeState('light');
        applyTheme('light');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();

    // Escuchar cambios en preferencias del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent): void => {
      // Solo aplicar si no hay preferencia manual guardada
      const savedTheme = localStorage.getItem('alexseis-theme');
      if (!savedTheme) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  // Función para alternar tema
  const toggleTheme = (): void => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';

    console.log(`🎛️ Toggling theme: ${theme} → ${newTheme}`);

    setThemeState(newTheme);
    applyTheme(newTheme);

    // Persistir en localStorage
    try {
      localStorage.setItem('alexseis-theme', newTheme);
    } catch (error) {
      console.warn('Error saving theme preference:', error);
    }

    // Dispatch evento personalizado para otros componentes
    window.dispatchEvent(new CustomEvent('themeChange', {
      detail: { theme: newTheme }
    }));

    setTimeout(() => {
      const htmlElement = document.documentElement;
      console.log(`🔍 Post-toggle check: theme=${newTheme}, dark class=${htmlElement.classList.contains('dark')}`);
    }, 100);
  };

  // Función para establecer tema específico
  const setSpecificTheme = (newTheme: Theme): void => {
    if (newTheme !== 'light' && newTheme !== 'dark') {
      console.warn('Invalid theme. Use "light" or "dark"');
      return;
    }

    setThemeState(newTheme);
    applyTheme(newTheme);

    try {
      localStorage.setItem('alexseis-theme', newTheme);
    } catch (error) {
      console.warn('Error saving theme preference:', error);
    }

    window.dispatchEvent(new CustomEvent('themeChange', {
      detail: { theme: newTheme }
    }));
  };

  // Estados derivados
  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  return {
    theme,
    isDark,
    isLight,
    isLoading,
    toggleTheme,
    setTheme: setSpecificTheme,
    // Utilidades adicionales
    systemPrefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
  };
}
