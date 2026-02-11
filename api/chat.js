import { OpenAI } from 'openai';
import { BigQuery } from '@google-cloud/bigquery';
import { applySecurityMiddleware, sanitizeString, getClientIp } from './lib/security.js';

// ===== CONFIGURATION =====

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const initBigQuery = () => {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'cognitivedsai-herramientas';

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString()
    );
    return new BigQuery({ projectId, credentials });
  }

  return new BigQuery({ projectId });
};

const bigquery = initBigQuery();

const SYSTEM_PROMPT = `Eres el AI Assistant de INNATE.data, especializado en arquitectura de datos enterprise e Inteligencia Artificial.

Especialidades de INNATE.data:
- Arquitectura Zero-Egress: BigQuery + Cloud SQL + Supabase (datos nunca salen del warehouse)
- RAG Enterprise: Retrieval-Augmented Generation sobre datos propios del cliente
- Google Cloud Platform: BigQuery, Cloud Run, Vertex AI, Cloud Functions
- Automatización: N8N workflows, pipelines ETL/ELT
- Business Intelligence: Power BI, Looker Studio, dashboards en tiempo real
- AI/ML: NLP, Computer Vision, modelos predictivos

Casos de éxito verificables:
- 282M registros analizados en segundos (CMF)
- Reportes de 2 días reducidos a respuestas instantáneas
- ROI promedio documentado: 270%

Responde de forma clara, profesional y orientada a valor de negocio.
Si te preguntan algo fuera de tu expertise, sé honesto.
Responde en español a menos que el usuario escriba en otro idioma.
Cuando sea relevante, sugiere agendar una auditoría IA gratuita en /intake.`;

// ===== HANDLER =====

export default async function handler(req, res) {
  // Apply shared security middleware (CORS, rate limit, honeypot, headers)
  const security = applySecurityMiddleware(req, res, 'chat');
  if (!security.ok) return;

  try {
    const { message, sessionId: clientSessionId } = req.body;

    // Validate and sanitize input
    const sanitizedMessage = sanitizeString(message, 1000);

    if (!sanitizedMessage || sanitizedMessage.length === 0) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: 'El servicio no está configurado correctamente'
      });
    }

    const sessionId = clientSessionId || generateSessionId();
    const startTime = Date.now();

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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

    // Log to BigQuery (non-blocking, errors don't fail the response)
    const conversationData = {
      session_id: sessionId,
      user_message: sanitizedMessage,
      agent_response: aiResponse,
      model_used: 'gpt-4o-mini',
      tokens_used: tokensUsed,
      response_time_ms: responseTime,
      user_ip: security.clientIp,
      user_agent: req.headers['user-agent'] || 'unknown',
      created_at: new Date().toISOString()
    };

    try {
      await bigquery
        .dataset('alexseis_web')
        .table('conversations')
        .insert([conversationData]);
    } catch (dbError) {
      console.error('BigQuery insert error (non-fatal):', dbError.message);
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
        error: 'El servicio está temporalmente no disponible. Por favor intenta más tarde.'
      });
    }

    if (error?.error?.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        error: 'Límite de velocidad excedido. Por favor intenta en unos segundos.'
      });
    }

    if (error?.status === 401) {
      return res.status(503).json({
        error: 'Error de configuración del servicio'
      });
    }

    return res.status(500).json({
      error: 'Ocurrió un error procesando tu solicitud.'
    });
  }
}
