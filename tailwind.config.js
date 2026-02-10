/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ← NUEVA LÍNEA: Habilita dark mode por clase
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem', // p-4 (16px)
        sm: '2rem',    // p-8 (32px)
        lg: '3rem',    // p-12 (48px)
        xl: '4rem',    // p-16 (64px)
      },
      screens: {
        '2xl': '1200px', // Max container width
      },
    },
    extend: {
      colors: {
        // ===== COLORES EXISTENTES (sin cambios) =====
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        'bg-dark': 'var(--bg-dark)',
        'text-light': 'var(--text-light)',
        'text-dark': 'var(--text-dark)',
        glass: 'var(--glass)',
        'glass-border': 'var(--glass-border)',

        // ===== COLORES INNATE.data =====
        'innate-blue': '#1a365d',
        'innate-cyan': '#00d9ff',
        'innate-orange': '#ed8936',
        'innate-green': '#00ff88',
        'innate-orange-warm': '#ffaa00',
        
        // ===== COLORES SHADCN (sin cambios) =====
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        'primary-shadcn': {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        'secondary-shadcn': {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        'accent-shadcn': {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      spacing: {
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '48px',
        '6': '64px',
        '8': '80px',
        '10': '96px',
        '12': '128px',
      },
      fontSize: {
        'h1': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'xs': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      borderRadius: {
        DEFAULT: '1rem', /* 16px */
        lg: '1rem', /* var(--radius) */
        xl: '1.5rem', /* 24px */
        '2xl': '2rem', /* 32px */
        md: 'calc(1rem - 2px)', /* from shadcn */
        sm: 'calc(1rem - 4px)', /* from shadcn */
        button: '12px',
      },
      boxShadow: {
        'subtle': '0 8px 24px rgba(0,0,0,0.15)',
        'medium': '0 12px 32px rgba(0,0,0,0.2)',
        'strong': '0 16px 48px rgba(0,0,0,0.25)',
        'primary': '0 6px 18px rgba(var(--primary-rgb), 0.3)',
        'secondary': '0 6px 18px rgba(var(--secondary-rgb), 0.3)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        'conic-gradient': 'conic-gradient(from 180deg at 50% 50%, var(--primary) 0deg, var(--secondary) 180deg, var(--accent) 360deg)',
        'radial-gradient': 'radial-gradient(circle, var(--primary), var(--secondary), var(--bg-dark) 70%)',
        // ===== NUEVOS FONDOS ESPACIALES =====
        'space-gradient': 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 25%, #0f0f1a 50%, #000000 100%)',
        'galaxy-gradient': 'radial-gradient(ellipse at top, #1a365d 0%, #16213e 50%, #0f0f1a 100%)',
        'nebula-gradient': 'linear-gradient(135deg, #00d9ff 0%, #1a365d 50%, #0f0f1a 100%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'typing': {
          from: { width: '0' },
          to: { width: '100%' },
        },
        'blink-caret': {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: 'var(--accent)' },
        },
        'scroll-anim': {
          '0%': { transform: 'translate(-50%, 0)', opacity: '1' },
          '50%': { transform: 'translate(-50%, 10px)', opacity: '0.5' },
          '100%': { transform: 'translate(-50%, 0)', opacity: '1' },
        },
        'float': {
          '0%': { transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-20px) translateX(15px) rotate(90deg)' },
          '50%': { transform: 'translateY(10px) translateX(-10px) rotate(180deg)' },
          '75%': { transform: 'translateY(-15px) translateX(20px) rotate(270deg)' },
          '100%': { transform: 'translateY(0px) translateX(0px) rotate(360deg)' },
        },
        'spin': {
          to: { transform: 'rotate(360deg)' },
        },
        'shimmer': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        // ===== NUEVAS ANIMACIONES ESPACIALES =====
        'twinkle': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        'drift': {
          '0%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-30px) translateX(20px)' },
          '66%': { transform: 'translateY(20px) translateX(-15px)' },
          '100%': { transform: 'translateY(0px) translateX(0px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'typing': 'typing 3.5s steps(40, end), blink-caret .75s step-end infinite',
        'scroll-indicator': 'scroll-anim 2s infinite',
        'particle-float': 'float 20s infinite ease-in-out',
        'spin': 'spin 1s linear infinite',
        'shimmer': 'shimmer 1.5s infinite',
        // ===== NUEVAS ANIMACIONES ESPACIALES =====
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'drift': 'drift 8s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};