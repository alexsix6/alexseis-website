/**
 * INNATE.data Intake v3.0 - BigQuery Storage API
 * Handles intake form submission with agent and transcription data
 */
import { BigQuery } from '@google-cloud/bigquery';
import { applySecurityMiddleware, sanitizeString, sanitizeEmail } from './lib/security.js';

// ===== BIGQUERY INIT =====
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

// ===== HANDLER =====
export default async function handler(req, res) {
  // Apply shared security middleware (CORS, rate limit, honeypot, headers)
  const security = applySecurityMiddleware(req, res, 'intake');
  if (!security.ok) return;

  try {
    const contentType = req.headers['content-type'] || '';
    const formData = contentType.includes('application/json') ? req.body : req.body;

    const {
      session_id,
      answers,
      client_info,
      completion_time_seconds,
      started_at,
      completed_at,
      uploaded_files_metadata,
      file_extractions,
      audio_transcription,
      agent_follow_ups,
      agent_iterations,
      agent_closing_message
    } = formData;

    // Parse answers/client_info if stringified
    const parsedAnswers = typeof answers === 'string' ? JSON.parse(answers) : answers;
    const parsedClientInfo = typeof client_info === 'string' ? JSON.parse(client_info) : client_info;

    // Validate required fields
    const sanitizedSessionId = sanitizeString(session_id, 100);
    if (!sanitizedSessionId) {
      return res.status(400).json({ error: 'Session ID es requerido' });
    }

    if (!parsedAnswers || Object.keys(parsedAnswers).length === 0) {
      return res.status(400).json({ error: 'Las respuestas son requeridas' });
    }

    // Sanitize all answer fields
    const intakeData = {
      session_id: sanitizedSessionId,
      database_location: sanitizeString(parsedAnswers.database_location, 500) || null,
      industry: sanitizeString(parsedAnswers.industry, 500) || null,
      company_size: sanitizeString(parsedAnswers.company_size, 500) || null,
      main_system: sanitizeString(parsedAnswers.main_system, 500) || null,
      has_analytics: sanitizeString(parsedAnswers.has_analytics, 500) || null,
      analytics_tool: sanitizeString(parsedAnswers.analytics_tool, 500) || null,
      has_vpn: sanitizeString(parsedAnswers.has_vpn, 500) || null,
      it_management: sanitizeString(parsedAnswers.it_management, 500) || null,
      main_challenge: sanitizeString(parsedAnswers.main_challenge, 2000) || null,
      uploaded_files: uploaded_files_metadata ? JSON.stringify(
        uploaded_files_metadata.map(meta => {
          const extraction = file_extractions?.find(e => e.filename === meta.name);
          return {
            ...meta,
            extraction: extraction?.extraction ? sanitizeString(extraction.extraction, 3000) : null,
            extraction_type: extraction?.type || null,
          };
        })
      ) : null,
      audio_recording_url: null,
      audio_transcription: sanitizeString(audio_transcription, 5000) || null,
      agent_follow_ups: agent_follow_ups ? JSON.stringify(agent_follow_ups) : null,
      agent_iterations: parseInt(agent_iterations) || 0,
      agent_closing_message: sanitizeString(agent_closing_message, 2000) || null,
      client_name: sanitizeString(parsedClientInfo?.name, 200) || null,
      client_email: parsedClientInfo?.email ? sanitizeEmail(parsedClientInfo.email) : null,
      client_company: sanitizeString(parsedClientInfo?.company, 200) || null,
      source_url: req.headers.referer || 'intake-form',
      user_agent: req.headers['user-agent'] || 'unknown',
      ip_address: security.clientIp,
      started_at: started_at || new Date().toISOString(),
      completed_at: completed_at || new Date().toISOString(),
      completion_time_seconds: parseInt(completion_time_seconds) || null,
    };

    // Save to BigQuery
    try {
      const dataset = bigquery.dataset('alexseis_web');
      const table = dataset.table('client_intake_responses');

      const [exists] = await table.exists();

      if (!exists) {
        const schema = [
          { name: 'session_id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'database_location', type: 'STRING', mode: 'NULLABLE' },
          { name: 'industry', type: 'STRING', mode: 'NULLABLE' },
          { name: 'company_size', type: 'STRING', mode: 'NULLABLE' },
          { name: 'main_system', type: 'STRING', mode: 'NULLABLE' },
          { name: 'has_analytics', type: 'STRING', mode: 'NULLABLE' },
          { name: 'analytics_tool', type: 'STRING', mode: 'NULLABLE' },
          { name: 'has_vpn', type: 'STRING', mode: 'NULLABLE' },
          { name: 'it_management', type: 'STRING', mode: 'NULLABLE' },
          { name: 'main_challenge', type: 'STRING', mode: 'NULLABLE' },
          { name: 'uploaded_files', type: 'STRING', mode: 'NULLABLE' },
          { name: 'audio_recording_url', type: 'STRING', mode: 'NULLABLE' },
          { name: 'audio_transcription', type: 'STRING', mode: 'NULLABLE' },
          { name: 'agent_follow_ups', type: 'STRING', mode: 'NULLABLE' },
          { name: 'agent_iterations', type: 'INTEGER', mode: 'NULLABLE' },
          { name: 'agent_closing_message', type: 'STRING', mode: 'NULLABLE' },
          { name: 'client_name', type: 'STRING', mode: 'NULLABLE' },
          { name: 'client_email', type: 'STRING', mode: 'NULLABLE' },
          { name: 'client_company', type: 'STRING', mode: 'NULLABLE' },
          { name: 'source_url', type: 'STRING', mode: 'NULLABLE' },
          { name: 'user_agent', type: 'STRING', mode: 'NULLABLE' },
          { name: 'ip_address', type: 'STRING', mode: 'NULLABLE' },
          { name: 'started_at', type: 'TIMESTAMP', mode: 'NULLABLE' },
          { name: 'completed_at', type: 'TIMESTAMP', mode: 'NULLABLE' },
          { name: 'completion_time_seconds', type: 'INTEGER', mode: 'NULLABLE' },
        ];

        await dataset.createTable('client_intake_responses', { schema });
      }

      await table.insert([intakeData]);
    } catch (dbError) {
      console.error('BigQuery insert error (non-fatal):', dbError.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Diagnostico recibido correctamente',
      session_id: sanitizedSessionId
    });

  } catch (error) {
    console.error('Intake form error:', error.message);

    return res.status(500).json({
      error: 'Error al procesar el diagnostico'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
