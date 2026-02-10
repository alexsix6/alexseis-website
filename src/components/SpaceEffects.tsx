import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
  type: 'bright' | 'normal';
  twinkle: boolean;
  color: 'colored' | 'white';
}

interface Meteor {
  id: string;
  startX: number;
  startY: number;
  angle: number;
  speed: number;
  delay: number;
  length: number;
}

interface PulseStar {
  id: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  pulseSpeed: number;
}

interface ThemeConfig {
  background: string;
  aurora: { background: string; opacity: number };
  waves: string[];
  waveGlow: string[];
  particles: { white: string; colored: string[] };
  galaxy: string;
  nebula: string[];
  meteor: string;
  particleCount: number;
  meteorCount: number;
  pulseCount: number;
  mouseIntensity: number;
}

export function SpaceEffects(): JSX.Element {
  const { isDark } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [pulseStars, setPulseStars] = useState<PulseStar[]>([]);

  const getThemeConfig = (dark: boolean): ThemeConfig => {
    if (dark) {
      return {
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(0, 217, 255, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 10% 90%, rgba(237, 137, 54, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 90% 10%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
          linear-gradient(135deg, #0f0f1a 0%, #1a1b3a 100%)
        `,
        aurora: {
          background: `
            linear-gradient(45deg,
              rgba(0, 217, 255, 0.1) 0%,
              transparent 30%,
              rgba(0, 255, 136, 0.08) 60%,
              transparent 100%
            )
          `,
          opacity: 0.3
        },
        waves: [
          'rgba(0, 255, 136, 0.3)',
          'rgba(0, 217, 255, 0.25)',
          'rgba(237, 137, 54, 0.2)',
          'rgba(59, 130, 246, 0.15)'
        ],
        waveGlow: [
          'rgba(0, 255, 136, 0.4)',
          'rgba(0, 217, 255, 0.3)',
          'rgba(237, 137, 54, 0.3)',
          'rgba(59, 130, 246, 0.2)'
        ],
        particles: {
          white: '#ffffff',
          colored: ['#00ff88', '#00d9ff', '#ed8936']
        },
        galaxy: `
          radial-gradient(ellipse 800px 400px at 50% 50%,
            rgba(0, 217, 255, 0.2) 0%,
            rgba(0, 255, 136, 0.1) 30%,
            rgba(237, 137, 54, 0.08) 60%,
            transparent 100%
          )
        `,
        nebula: [
          'rgba(0, 217, 255, 0.15)',
          'rgba(0, 255, 136, 0.12)',
          'rgba(237, 137, 54, 0.1)'
        ],
        meteor: `
          linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(0, 255, 136, 0.6) 100%
          )
        `,
        particleCount: 35,
        meteorCount: 3,
        pulseCount: 6,
        mouseIntensity: 30
      };
    } else {
      return {
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(0, 217, 255, 0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(0, 255, 136, 0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 10% 90%, rgba(237, 137, 54, 0.04) 0%, transparent 50%),
          radial-gradient(ellipse at 90% 10%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
          linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)
        `,
        aurora: {
          background: `
            linear-gradient(45deg,
              rgba(0, 217, 255, 0.03) 0%,
              transparent 30%,
              rgba(0, 255, 136, 0.02) 60%,
              transparent 100%
            )
          `,
          opacity: 0.4
        },
        waves: [
          'rgba(0, 217, 255, 0.15)',
          'rgba(0, 255, 136, 0.12)',
          'rgba(237, 137, 54, 0.10)',
          'rgba(59, 130, 246, 0.08)'
        ],
        waveGlow: [
          'rgba(0, 217, 255, 0.2)',
          'rgba(0, 255, 136, 0.15)',
          'rgba(237, 137, 54, 0.15)',
          'rgba(59, 130, 246, 0.1)'
        ],
        particles: {
          white: '#64748b',
          colored: ['#00ff88', '#00d9ff', '#ed8936']
        },
        galaxy: `
          radial-gradient(ellipse 800px 400px at 50% 50%,
            rgba(0, 217, 255, 0.08) 0%,
            rgba(0, 255, 136, 0.04) 30%,
            rgba(237, 137, 54, 0.03) 60%,
            transparent 100%
          )
        `,
        nebula: [
          'rgba(0, 217, 255, 0.08)',
          'rgba(0, 255, 136, 0.06)',
          'rgba(237, 137, 54, 0.05)'
        ],
        meteor: `
          linear-gradient(90deg,
            rgba(100, 116, 139, 0) 0%,
            rgba(100, 116, 139, 0.6) 50%,
            rgba(0, 217, 255, 0.4) 100%
          )
        `,
        particleCount: 25,
        meteorCount: 2,
        pulseCount: 4,
        mouseIntensity: 15
      };
    }
  };

  const themeConfig = getThemeConfig(isDark);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < themeConfig.particleCount; i++) {
      newParticles.push({
        id: `${isDark ? 'dark' : 'light'}-${i}-${Date.now()}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 0.5,
        speed: Math.random() * 0.8 + 0.2,
        opacity: isDark ? Math.random() * 0.8 + 0.2 : Math.random() * 0.4 + 0.1,
        delay: Math.random() * 15,
        type: Math.random() > 0.7 ? 'bright' : 'normal',
        twinkle: Math.random() > 0.5,
        color: Math.random() > 0.8 ? 'colored' : 'white',
      });
    }
    setParticles(newParticles);

    const newMeteors: Meteor[] = [];
    for (let i = 0; i < themeConfig.meteorCount; i++) {
      newMeteors.push({
        id: `${isDark ? 'dark' : 'light'}-meteor-${i}-${Date.now()}`,
        startX: Math.random() * 100,
        startY: Math.random() * 30,
        angle: Math.random() * 60 + 15,
        speed: Math.random() * 3 + 2,
        delay: i * 8 + Math.random() * 15,
        length: Math.random() * 50 + 30,
      });
    }
    setMeteors(newMeteors);

    const newPulseStars: PulseStar[] = [];
    for (let i = 0; i < themeConfig.pulseCount; i++) {
      newPulseStars.push({
        id: `${isDark ? 'dark' : 'light'}-pulse-${i}-${Date.now()}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 3,
        delay: Math.random() * 8,
        pulseSpeed: Math.random() * 2 + 2,
      });
    }
    setPulseStars(newPulseStars);

  }, [isDark, themeConfig.particleCount, themeConfig.meteorCount, themeConfig.pulseCount]);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let animId: number;

    const handleMouseMove = (e: MouseEvent): void => {
      targetX = (e.clientX / window.innerWidth - 0.5) * themeConfig.mouseIntensity;
      targetY = (e.clientY / window.innerHeight - 0.5) * themeConfig.mouseIntensity;
    };

    const updatePosition = (): void => {
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      setMousePosition({ x: mouseX, y: mouseY });
      animId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [themeConfig.mouseIntensity]);

  useEffect(() => {
    const styleId = 'space-effects-styles';
    const existingStyle = document.getElementById(styleId);

    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes enhancedBigBang {
        0% { transform: scale(0.5); opacity: 0.4; }
        30% { opacity: 0.15; }
        100% { transform: scale(1.5); opacity: 0; }
      }
      @keyframes twinkleParticle {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.3); }
      }
      @keyframes floatParticle {
        0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        25% { transform: translateY(-15px) translateX(8px) rotate(90deg); }
        50% { transform: translateY(-5px) translateX(-12px) rotate(180deg); }
        75% { transform: translateY(10px) translateX(5px) rotate(270deg); }
        100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
      }
      @keyframes pulseStar {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.5); }
      }
      @keyframes galaxyRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes nebulaFloat {
        0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
        33% { transform: translateY(-30px) scale(1.1) rotate(120deg); }
        66% { transform: translateY(20px) scale(0.95) rotate(240deg); }
      }
      @keyframes meteorShower {
        0% { opacity: 0; transform: translateX(-100px) translateY(0px); }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { opacity: 0; transform: translateX(300px) translateY(150px); }
      }
      @keyframes auroraWave {
        0%, 100% { transform: translateX(-50px) scaleY(1); }
        33% { transform: translateX(30px) scaleY(1.2); }
        66% { transform: translateX(-20px) scaleY(0.8); }
      }
      @keyframes cosmicDust {
        0%, 100% { opacity: 0.1; }
        50% { opacity: 0.3; }
      }
    `;

    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{
        background: themeConfig.background,
        transition: 'background 1s ease-in-out',
      }}
    >
      {/* Aurora Effect */}
      <div
        className="absolute inset-0"
        style={{
          background: themeConfig.aurora.background,
          opacity: themeConfig.aurora.opacity,
          animation: 'auroraWave 25s ease-in-out infinite',
          transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
          filter: 'blur(40px)',
          transition: 'all 1s ease-in-out',
        }}
      />

      {/* Big Bang Waves */}
      <div className="absolute inset-0">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={`${isDark ? 'dark' : 'light'}-wave-${index}`}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: `${index * 250}px`,
              height: `${index * 250}px`,
              marginTop: `${index * -125}px`,
              marginLeft: `${index * -125}px`,
              border: `2px solid ${themeConfig.waves[index - 1]}`,
              animation: `enhancedBigBang ${12 + index * 3}s ease-out infinite`,
              animationDelay: `${index * 1.5}s`,
              transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
              filter: 'blur(1px)',
              boxShadow: `0 0 20px ${themeConfig.waveGlow[index - 1]}`,
              transition: 'all 1s ease-in-out',
            }}
          />
        ))}
      </div>

      {/* Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color === 'colored' ?
                themeConfig.particles.colored[parseInt(particle.id.split('-')[1]) % 3] :
                themeConfig.particles.white,
              opacity: particle.opacity,
              animation: `${particle.twinkle ? 'twinkleParticle' : 'floatParticle'} ${20 + particle.speed * 15}s linear infinite`,
              animationDelay: `${particle.delay}s`,
              transform: `translate(${mousePosition.x * particle.speed * 0.15}px, ${mousePosition.y * particle.speed * 0.15}px)`,
              filter: particle.type === 'bright' ?
                (isDark ? 'blur(0px) brightness(1.5)' : 'blur(0.5px) brightness(1.2)') :
                'blur(0.5px)',
              boxShadow: particle.type === 'bright' ?
                `0 0 ${particle.size * 2}px ${particle.color === 'colored' ?
                  themeConfig.particles.colored[parseInt(particle.id.split('-')[1]) % 3] + (isDark ? '40' : '30') :
                  themeConfig.particles.white + (isDark ? '40' : '20')}` : 'none',
              transition: 'background-color 1s ease-in-out, box-shadow 1s ease-in-out',
            }}
          />
        ))}
      </div>

      {/* Pulse Stars */}
      <div className="absolute inset-0">
        {pulseStars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: themeConfig.particles.white,
              animation: `pulseStar ${star.pulseSpeed}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
              filter: isDark ? 'brightness(1.8)' : 'brightness(1.3)',
              boxShadow: isDark ? `
                0 0 ${star.size * 3}px rgba(255, 255, 255, 0.8),
                0 0 ${star.size * 6}px rgba(255, 255, 255, 0.4),
                0 0 ${star.size * 9}px rgba(255, 255, 255, 0.2)
              ` : `
                0 0 ${star.size * 2}px rgba(100, 116, 139, 0.4),
                0 0 ${star.size * 4}px rgba(100, 116, 139, 0.2)
              `,
              transition: 'all 1s ease-in-out',
            }}
          />
        ))}
      </div>

      {/* Galaxy */}
      <div
        className="absolute inset-0"
        style={{
          background: themeConfig.galaxy,
          opacity: isDark ? 0.25 : 0.15,
          animation: 'galaxyRotate 180s linear infinite',
          transform: `translate(${mousePosition.x * 0.08}px, ${mousePosition.y * 0.08}px) scale(1.2)`,
          filter: 'blur(30px)',
          transition: 'all 1s ease-in-out',
        }}
      />

      {/* Nebula Clouds */}
      <div className="absolute inset-0">
        {[1, 2, 3].map((index) => (
          <div
            key={`${isDark ? 'dark' : 'light'}-nebula-${index}`}
            className="absolute"
            style={{
              width: `${400 + index * 100}px`,
              height: `${300 + index * 80}px`,
              top: `${index * 25 + 10}%`,
              left: `${index * 30 + 5}%`,
              background: `radial-gradient(ellipse, ${themeConfig.nebula[index - 1]} 0%, transparent 70%)`,
              borderRadius: '50%',
              filter: 'blur(40px)',
              animation: `nebulaFloat ${20 + index * 8}s ease-in-out infinite`,
              animationDelay: `${index * 4}s`,
              transform: `translate(${mousePosition.x * 0.12}px, ${mousePosition.y * 0.12}px)`,
              opacity: isDark ? 0.6 : 0.4,
              transition: 'all 1s ease-in-out',
            }}
          />
        ))}
      </div>

      {/* Meteors */}
      <div className="absolute inset-0">
        {meteors.map((meteor) => (
          <div
            key={meteor.id}
            className="absolute"
            style={{
              left: `${meteor.startX}%`,
              top: `${meteor.startY}%`,
              width: `${meteor.length}px`,
              height: '2px',
              background: themeConfig.meteor,
              borderRadius: '1px',
              animation: `meteorShower ${meteor.speed}s ease-out infinite`,
              animationDelay: `${meteor.delay}s`,
              transform: `rotate(${meteor.angle}deg)`,
              filter: 'blur(0.5px)',
              boxShadow: isDark ?
                '0 0 10px rgba(0, 255, 136, 0.6)' :
                '0 0 6px rgba(0, 217, 255, 0.4)',
              transition: 'all 1s ease-in-out',
            }}
          />
        ))}
      </div>

      {/* Cosmic Dust */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at ${50 + mousePosition.x * 0.5}% ${50 + mousePosition.y * 0.5}%,
              ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(100, 116, 139, 0.06)'} 0%,
              transparent 40%
            )
          `,
          filter: 'blur(20px)',
          animation: 'cosmicDust 30s ease-in-out infinite',
          opacity: isDark ? 0.2 : 0.3,
          transition: 'all 1s ease-in-out',
        }}
      />
    </div>
  );
}

export default SpaceEffects;
