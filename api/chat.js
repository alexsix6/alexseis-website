import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

// ===== FUNCIONES AUXILIARES INTEGRADAS =====
// Integradas directamente para evitar problemas de importación en Vercel Functions

const getServiceSupabase = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Faltan variables de entorno de Supabase');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.headers['x-client-ip'] ||
         req.connection?.remoteAddress ||
         'unknown';
};

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const checkRateLimit = async (supabaseAdmin, ip, maxRequests = 10, windowMs = 60000) => {
  try {
    const windowStart = new Date(Date.now() - windowMs);
    
    const { count, error } = await supabaseAdmin
      .from('agent_conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_ip', ip)
      .gte('created_at', windowStart.toISOString());
    
    if (error) {
      console.error('Error checking rate limit:', error);
      // En caso de error, permitir la solicitud
      return { success: true, remaining: maxRequests };
    }
    
    return {
      success: count < maxRequests,
      remaining: maxRequests - count
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // En caso de error, permitir la solicitud
    return { success: true, remaining: maxRequests };
  }
};

// ===== CONFIGURACIÓN =====

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Prompt del sistema para el agente
const SYSTEM_PROMPT = `Eres un experto asistente de AI especializado en Google Cloud Platform, BigQuery, Power BI e Inteligencia Artificial. 
Tu nombre es AI Assistant de Alex Seis Projects. 

Tus especialidades incluyen:
- Google Cloud Platform (GCP): Compute Engine, Cloud Storage, Cloud Functions, etc.
- BigQuery: Análisis de datos, optimización de consultas, mejores prácticas
- Power BI: Visualización de datos, DAX, integración con otras herramientas
- Inteligencia Artificial: Machine Learning, NLP, Computer Vision
- Arquitectura de soluciones cloud
- Optimización de costos en la nube

Proporciona respuestas claras, precisas y profesionales. Si no conoces algo, sé honesto al respecto.
Responde en español a menos que el usuario escriba en otro idioma.`;

// ===== HANDLER PRINCIPAL =====

export default async function handler(req, res) {
  // AGREGAR ESTOS LOGS DE DEBUG
  console.log('=== INICIO DE SOLICITUD ===');
  console.log('Método:', req.method);
  console.log('Body:', req.body);
  console.log('ENV Check:', {
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSupabaseService: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  });

  // Configurar CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejar preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message, sessionId: clientSessionId } = req.body;
    
    // Validaciones
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'El mensaje es demasiado largo (máximo 1000 caracteres)' });
    }

    // Verificar API key de OpenAI
    if (!process.env.OPENAI_API_KEY) {
      console.error('Falta OPENAI_API_KEY');
      return res.status(503).json({ 
        error: 'El servicio no está configurado correctamente' 
      });
    }

    // Obtener IP del cliente
    const clientIp = getClientIp(req);
    
    // Inicializar Supabase Admin
    let supabaseAdmin;
    try {
      supabaseAdmin = getServiceSupabase();
    } catch (error) {
      console.error('Error inicializando Supabase:', error);
      return res.status(503).json({ 
        error: 'Error de configuración del servicio' 
      });
    }
    
    // Verificar rate limit
    const rateLimitCheck = await checkRateLimit(supabaseAdmin, clientIp);
    if (!rateLimitCheck.success) {
      return res.status(429).json({ 
        error: 'Demasiadas solicitudes. Por favor espera un momento antes de intentar de nuevo.',
        remainingRequests: rateLimitCheck.remaining 
      });
    }

    // Generar o usar session ID
    const sessionId = clientSessionId || generateSessionId();
    
    // Medir tiempo de respuesta
    const startTime = Date.now();

    // Llamada a OpenAI
    console.log('Enviando mensaje a OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;
    const responseTime = Date.now() - startTime;
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Guardar en Supabase
    console.log('Guardando conversación en base de datos...');
    const { error: dbError } = await supabaseAdmin
      .from('agent_conversations')
      .insert({
        session_id: sessionId,
        user_message: message,
        agent_response: aiResponse,
        model_used: 'gpt-3.5-turbo',
        tokens_used: tokensUsed,
        response_time_ms: responseTime,
        user_ip: clientIp,
        user_agent: req.headers['user-agent'] || 'unknown'
      });

    if (dbError) {
      console.error('Error al guardar en base de datos:', dbError);
      // No fallar la respuesta por error de BD
    }

    // Responder al cliente
    return res.status(200).json({
      success: true,
      response: aiResponse,
      sessionId: sessionId,
      responseTime: responseTime
    });

  } catch (error) {
    console.error('Error en chat API:', error);
    
    // Manejo de errores específicos de OpenAI
    if (error?.error?.code === 'insufficient_quota') {
      return res.status(503).json({ 
        error: 'El servicio está temporalmente no disponible. Por favor intenta más tarde.' 
      });
    }
    
    if (error?.error?.code === 'rate_limit_exceeded') {
      return res.status(429).json({ 
        error: 'Límite de velocidad excedido. Por favor intenta en unos segundos.' 
      });
    }

    if (error?.status === 401) {
      console.error('Error de autenticación con OpenAI');
      return res.status(503).json({ 
        error: 'Error de configuración del servicio' 
      });
    }
    
    return res.status(500).json({ 
      error: 'Ocurrió un error procesando tu solicitud.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}