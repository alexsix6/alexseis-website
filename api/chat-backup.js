/**
 * Chat API Backup - Supabase version (legacy)
 * The primary chat.js uses BigQuery. This is kept for reference.
 */
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import { applySecurityMiddleware, sanitizeString } from './lib/security.js';

const getServiceSupabase = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export default async function handler(req, res) {
  const security = applySecurityMiddleware(req, res, 'chat');
  if (!security.ok) return;

  try {
    const { message, sessionId: clientSessionId } = req.body;

    const sanitizedMessage = sanitizeString(message, 1000);

    if (!sanitizedMessage || sanitizedMessage.length === 0) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: 'El servicio no está configurado correctamente'
      });
    }

    let supabaseAdmin;
    try {
      supabaseAdmin = getServiceSupabase();
    } catch (error) {
      return res.status(503).json({
        error: 'Error de configuración del servicio'
      });
    }

    const sessionId = clientSessionId || generateSessionId();
    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: sanitizedMessage }
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;
    const responseTime = Date.now() - startTime;
    const tokensUsed = completion.usage?.total_tokens || 0;

    const { error: dbError } = await supabaseAdmin
      .from('agent_conversations')
      .insert({
        session_id: sessionId,
        user_message: sanitizedMessage,
        agent_response: aiResponse,
        model_used: 'gpt-4o',
        tokens_used: tokensUsed,
        response_time_ms: responseTime,
        user_ip: security.clientIp,
        user_agent: req.headers['user-agent'] || 'unknown'
      });

    if (dbError) {
      console.error('Supabase insert error (non-fatal):', dbError.message);
    }

    return res.status(200).json({
      success: true,
      response: aiResponse,
      sessionId: sessionId,
      responseTime: responseTime
    });

  } catch (error) {
    console.error('Chat API error:', error.message);

    if (error?.error?.code === 'insufficient_quota') {
      return res.status(503).json({
        error: 'El servicio está temporalmente no disponible.'
      });
    }

    if (error?.error?.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        error: 'Límite de velocidad excedido.'
      });
    }

    return res.status(500).json({
      error: 'Ocurrió un error procesando tu solicitud.'
    });
  }
}
