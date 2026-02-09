import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Función existente para combinar clases de Tailwind
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

// ===== NUEVAS FUNCIONES PARA EL BACKEND =====

// Validar email
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Generar ID de sesión único
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Rate limiting helper (legacy - Supabase)
interface RateLimitResult {
  success: boolean;
  remaining: number;
}

interface SupabaseAdmin {
  from: (table: string) => {
    select: (columns: string, options?: { count: string; head: boolean }) => {
      eq: (column: string, value: string) => {
        gte: (column: string, value: string) => Promise<{ count: number | null }>;
      };
    };
  };
}

export const checkRateLimit = async (
  supabaseAdmin: SupabaseAdmin,
  ip: string,
  maxRequests = 10,
  windowMs = 60000
): Promise<RateLimitResult> => {
  const windowStart = new Date(Date.now() - windowMs);

  const { count } = await supabaseAdmin
    .from('agent_conversations')
    .select('*', { count: 'exact', head: true })
    .eq('user_ip', ip)
    .gte('created_at', windowStart.toISOString());

  return {
    success: (count ?? 0) < maxRequests,
    remaining: maxRequests - (count ?? 0)
  };
};

// Obtener IP del request
interface IncomingRequest {
  headers: Record<string, string | string[] | undefined>;
  connection?: { remoteAddress?: string };
}

export const getClientIp = (req: IncomingRequest): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const forwardedStr = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return forwardedStr?.split(',')[0] ||
         (req.headers['x-real-ip'] as string) ||
         req.connection?.remoteAddress ||
         'unknown';
};
