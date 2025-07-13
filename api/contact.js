import { BigQuery } from '@google-cloud/bigquery';

// ===== INICIALIZAR BIGQUERY CON AUTENTICACIÓN =====
const initBigQuery = () => {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'cognitivedsai-herramientas';
  
  // Para Vercel: usar credenciales base64
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString()
    );
    
    return new BigQuery({
      projectId,
      credentials
    });
  }
  
  // Para local: usar autenticación por defecto
  return new BigQuery({ projectId });
};

const bigquery = initBigQuery();

// ===== FUNCIONES AUXILIARES =====
const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.headers['x-client-ip'] ||
         req.connection?.remoteAddress ||
         'unknown';
};

export default async function handler(req, res) {
  console.log('=== CONTACT FORM REQUEST ===');
  console.log('Method:', req.method);
  console.log('Body:', req.body);

  // CORS headers
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
    const { name, email, company, interest, message } = req.body;

    // Validaciones básicas
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Nombre, email y mensaje son requeridos' 
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        error: 'Email no válido' 
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({ 
        error: 'El mensaje es demasiado largo (máximo 2000 caracteres)' 
      });
    }

    // Obtener información del request
    const clientIp = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    const sourcePage = req.headers.referer || 'contact-form';

    // Preparar datos para BigQuery
    const contactData = {
      full_name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim() || null,
      area_of_interest: interest?.trim() || null,
      message: message.trim(),
      source_page: sourcePage,
      ip_address: clientIp,
      created_at: new Date().toISOString()
    };

    // ===== GUARDAR EN BIGQUERY =====
    console.log('Guardando mensaje de contacto en BigQuery...');
    
    try {
      await bigquery
        .dataset('alexseis_web')
        .table('contact_submissions')
        .insert([contactData]);
      
      console.log('✅ Mensaje de contacto guardado en BigQuery');
    } catch (dbError) {
      console.error('❌ Error al guardar en BigQuery:', dbError);
      // No fallar la respuesta por error de BD
    }

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: 'Mensaje enviado correctamente'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    return res.status(500).json({ 
      error: 'Error al enviar el mensaje',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}