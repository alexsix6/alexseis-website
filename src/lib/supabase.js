import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente público (para el frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente de servicio (para el backend - más permisos)
// Solo usar en server-side (API routes)
export const getServiceSupabase = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Service role client can only be used server-side!');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
};