/**
 * INNATE.data Intake v3.0 - Intelligent Agent API
 * Uses GPT-4 to evaluate client responses and request clarifications
 */
import OpenAI from 'openai';
import { applySecurityMiddleware, sanitizeString } from './lib/security.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AGENT_SYSTEM_PROMPT = `Eres un agente de INNATE.data que evalua las respuestas de un cliente potencial que busca servicios de data analytics e inteligencia artificial.

Tu rol es:
1. Analizar si las respuestas estan completas y son claras
2. Identificar informacion vaga o que necesite clarificacion
3. Formular UNA pregunta de seguimiento si es necesario (maximo)
4. Ser amable, profesional y NO tecnico

REGLAS IMPORTANTES:
- Si el desafio principal (main_challenge) es muy vago (ej: "mejorar", "optimizar" sin contexto), pide especificar QUE quieren mejorar
- Si mencionan un sistema pero no es claro como lo usan, pide confirmar
- NO preguntes sobre presupuesto o timeline
- NO preguntes sobre datos personales o confidenciales
- Maximo 1 pregunta de clarificacion por evaluacion
- Lenguaje simple, no tecnico, en espanol
- Se calido y profesional
- Si ya tienes suficiente informacion, marca como complete

FORMATO DE RESPUESTA (JSON estricto):
{
  "status": "complete" | "needs_clarification",
  "analysis": "Breve analisis interno (no mostrar al cliente)",
  "follow_up_question": "Pregunta para el cliente si status=needs_clarification, null si complete",
  "closing_message": "Mensaje de cierre amable si status=complete, null si needs_clarification"
}`;

export default async function handler(req, res) {
  // Apply shared security middleware
  const security = applySecurityMiddleware(req, res, 'intake-agent');
  if (!security.ok) return;

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const {
      answers,
      audioTranscription,
      previousFollowUps,
      additionalContext,
      fileExtractions
    } = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ error: 'No answers provided' });
    }

    // Sanitize user-provided text before passing to LLM
    const sanitizedTranscription = sanitizeString(audioTranscription, 5000);
    const sanitizedContext = sanitizeString(additionalContext, 2000);

    // Build the user message with context
    let userMessage = `Evalua las siguientes respuestas del cliente:\n\n`;

    const answerLabels = {
      database_location: 'Ubicacion de base de datos',
      industry: 'Industria',
      company_size: 'Tamano de empresa',
      main_system: 'Sistema principal',
      has_analytics: 'Tienen analytics',
      analytics_tool: 'Herramienta de analytics',
      has_vpn: 'Tienen VPN',
      it_management: 'Gestion de TI',
      main_challenge: 'Desafio principal',
    };

    for (const [key, value] of Object.entries(answers)) {
      const label = answerLabels[key] || key;
      const sanitizedValue = sanitizeString(String(value), 1000);
      userMessage += `- ${label}: ${sanitizedValue}\n`;
    }

    if (sanitizedTranscription) {
      userMessage += `\nTranscripcion de audio del cliente:\n"${sanitizedTranscription}"\n`;
    }

    if (previousFollowUps && Array.isArray(previousFollowUps) && previousFollowUps.length > 0) {
      userMessage += `\nInteracciones previas del agente:\n`;
      // Limit to max 5 follow-ups to prevent abuse
      previousFollowUps.slice(0, 5).forEach((fu, i) => {
        const q = sanitizeString(fu.question, 500);
        const a = sanitizeString(fu.answer, 1000);
        userMessage += `${i + 1}. Pregunta: ${q}\n   Respuesta: ${a}\n`;
      });
    }

    if (sanitizedContext) {
      userMessage += `\nRespuesta adicional del cliente:\n"${sanitizedContext}"\n`;
    }

    // v3.1: Include file extractions
    if (fileExtractions && Array.isArray(fileExtractions) && fileExtractions.length > 0) {
      userMessage += `\nDocumentos e imagenes adjuntos por el cliente:\n`;
      fileExtractions.slice(0, 5).forEach((ext, i) => {
        const label = ext.type === 'image' ? 'Imagen' : 'Documento';
        const content = sanitizeString(ext.extraction, 2000);
        if (content) {
          userMessage += `${i + 1}. ${label} "${sanitizeString(ext.filename, 200)}": ${content}\n`;
        }
      });
    }

    userMessage += `\nEvalua y responde en el formato JSON especificado.`;

    // Call GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: AGENT_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('Empty response from GPT-4');
    }

    let agentResponse;
    try {
      agentResponse = JSON.parse(responseText);
    } catch (parseError) {
      agentResponse = {
        status: 'complete',
        analysis: 'Parse error - defaulting to complete',
        follow_up_question: null,
        closing_message: 'Gracias por compartir esta informacion. Tenemos todo lo necesario para preparar tu diagnostico personalizado.',
      };
    }

    if (!agentResponse.status || !['complete', 'needs_clarification'].includes(agentResponse.status)) {
      agentResponse.status = 'complete';
    }

    if (agentResponse.status === 'complete' && !agentResponse.closing_message) {
      agentResponse.closing_message = 'Excelente, tenemos toda la informacion necesaria. Estaremos en contacto pronto con tu diagnostico personalizado.';
    }

    return res.status(200).json(agentResponse);
  } catch (error) {
    console.error('Agent error:', error.message);

    return res.status(200).json({
      status: 'complete',
      analysis: 'Error occurred - graceful fallback',
      follow_up_question: null,
      closing_message: 'Gracias por tu informacion. Nuestro equipo revisara tus respuestas y te contactara pronto.',
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
