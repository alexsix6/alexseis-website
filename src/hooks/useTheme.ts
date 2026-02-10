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

  // Aplicar tema al DOM — variables.css maneja colores via .dark class
  const applyTheme = (newTheme: Theme): void => {
    try {
      const htmlElement = document.documentElement;

      if (newTheme === 'dark') {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }

      // Let CSS handle background (base.css + SpaceEffects)
      // IMPORTANT: Do NOT set inline body styles — they override CSS variables

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

    // Listen for theme changes from other useTheme() instances
    const handleExternalThemeChange = (e: Event): void => {
      const customEvent = e as CustomEvent;
      const newTheme = customEvent.detail?.theme;
      if (newTheme && (newTheme === 'light' || newTheme === 'dark')) {
        setThemeState(newTheme);
      }
    };

    window.addEventListener('themeChange', handleExternalThemeChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      window.removeEventListener('themeChange', handleExternalThemeChange);
    };
  }, []);

  // Función para alternar tema
  const toggleTheme = (): void => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';

    setThemeState(newTheme);
    applyTheme(newTheme);

    // Persistir en localStorage
    try {
      localStorage.setItem('alexseis-theme', newTheme);
    } catch (error) {
      console.warn('Error saving theme preference:', error);
    }

    // Dispatch evento para componentes que escuchan manualmente
    window.dispatchEvent(new CustomEvent('themeChange', {
      detail: { theme: newTheme }
    }));
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
