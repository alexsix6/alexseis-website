import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Función existente para combinar clases de Tailwind
export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

// ===== NUEVAS FUNCIONES PARA EL BACKEND =====

// Validar email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Generar ID de sesión único
export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Rate limiting helper
export const checkRateLimit = async (supabaseAdmin, ip, maxRequests = 10, windowMs = 60000) => {
  const windowStart = new Date(Date.now() - windowMs);
  
  const { count } = await supabaseAdmin
    .from('agent_conversations')
    .select('*', { count: 'exact', head: true })
    .eq('user_ip', ip)
    .gte('created_at', windowStart.toISOString());
    
  return {
    success: count < maxRequests,
    remaining: maxRequests - count
  };
};

// Obtener IP del request
export const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress ||
         'unknown';
};