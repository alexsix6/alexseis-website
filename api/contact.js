import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { name, email, company, interest, message } = req.body;

    // Guardar en Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        full_name: name,
        email,
        company: company || null,
        area_of_interest: interest || null,
        message,
        source_page: req.headers.referer || 'contact-form',
        ip_address: req.headers['x-forwarded-for'] || 'unknown'
      });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Mensaje enviado correctamente'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      error: 'Error al enviar el mensaje' 
    });
  }
}