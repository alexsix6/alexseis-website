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
  const security = applySecurityMiddleware(req, res, 'contact');
  if (!security.ok) return;

  try {
    const { name, email, company, interest, message } = req.body;

    // Sanitize all inputs
    const sanitizedName = sanitizeString(name, 200);
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedCompany = sanitizeString(company, 200);
    const sanitizedInterest = sanitizeString(interest, 200);
    const sanitizedMessage = sanitizeString(message, 2000);

    // Validate required fields
    if (!sanitizedName) {
      return res.status(400).json({ error: 'Nombre es requerido' });
    }

    if (!sanitizedEmail) {
      return res.status(400).json({ error: 'Email no válido' });
    }

    if (!sanitizedMessage || sanitizedMessage.length < 10) {
      return res.status(400).json({ error: 'Mensaje es requerido (mínimo 10 caracteres)' });
    }

    // Prepare data for BigQuery
    const contactData = {
      full_name: sanitizedName,
      email: sanitizedEmail,
      company: sanitizedCompany || null,
      area_of_interest: sanitizedInterest || null,
      message: sanitizedMessage,
      source_page: req.headers.referer || 'contact-form',
      ip_address: security.clientIp,
      created_at: new Date().toISOString()
    };

    // Save to BigQuery (non-blocking)
    try {
      await bigquery
        .dataset('alexseis_web')
        .table('contact_submissions')
        .insert([contactData]);
    } catch (dbError) {
      console.error('BigQuery insert error (non-fatal):', dbError.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Mensaje enviado correctamente'
    });

  } catch (error) {
    console.error('Contact form error:', error.message);

    return res.status(500).json({
      error: 'Error al enviar el mensaje'
    });
  }
}
