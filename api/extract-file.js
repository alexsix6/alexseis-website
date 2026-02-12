/**
 * INNATE.data Intake v3.1 - File Content Extraction API
 * Extracts text from documents and describes images using AI
 * Supported: PDF, DOCX, TXT/CSV (text extraction + summary), Images (GPT-4o-mini Vision)
 */
import OpenAI from 'openai';
import { applySecurityMiddleware, sanitizeString } from './lib/security.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SUMMARY_SYSTEM_PROMPT = `Extrae un resumen preciso y conciso del siguiente documento. Incluye datos clave: nombres, cifras, fechas, sistemas mencionados y contexto importante para entender la situacion del cliente. Responde en espanol. Maximo 400 palabras.`;

const IMAGE_USER_PROMPT = `Describe detalladamente el contenido de esta imagen en espanol. Si es un diagrama, esquema, arquitectura o captura de pantalla, explica que muestra y que informacion relevante contiene. Si tiene texto visible, incluyelo. Maximo 300 palabras.`;

/**
 * Summarize raw text using GPT-4o-mini
 */
async function summarizeText(rawText, filename) {
  const truncated = rawText.substring(0, 8000);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
      { role: 'user', content: `Documento: "${filename}"\n\n${truncated}` },
    ],
    temperature: 0.3,
    max_tokens: 600,
  });

  return completion.choices[0]?.message?.content || '';
}

/**
 * Describe image using GPT-4o-mini Vision
 */
async function describeImage(base64Data, mimeType) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: IMAGE_USER_PROMPT },
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${base64Data}`, detail: 'low' },
          },
        ],
      },
    ],
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content || '';
}

export default async function handler(req, res) {
  const security = applySecurityMiddleware(req, res, 'extract-file');
  if (!security.ok) return;

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const { filename, mimeType, data } = req.body;

    if (!filename || !mimeType || !data) {
      return res.status(400).json({ error: 'Missing required fields: filename, mimeType, data' });
    }

    const sanitizedFilename = sanitizeString(filename, 200);
    const buffer = Buffer.from(data, 'base64');

    // Enforce 10MB limit (pre-base64 size)
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(413).json({ error: 'File too large. Maximum 10MB.' });
    }

    let extraction = null;
    let extractionType = 'unsupported';

    // --- IMAGES ---
    if (mimeType.startsWith('image/')) {
      extractionType = 'image';
      extraction = await describeImage(data, mimeType);
    }
    // --- PDF ---
    else if (mimeType === 'application/pdf') {
      extractionType = 'document';
      // Dynamic import from lib to avoid pdf-parse test file issue (v1.1.1)
      const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
      const pdfData = await pdfParse(buffer);
      const rawText = pdfData.text;

      if (rawText && rawText.trim().length > 20) {
        extraction = await summarizeText(rawText, sanitizedFilename);
      } else {
        extraction = '[PDF sin texto extraible - posiblemente escaneado]';
      }
    }
    // --- DOCX ---
    else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      extractionType = 'document';
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      const rawText = result.value;

      if (rawText && rawText.trim().length > 20) {
        extraction = await summarizeText(rawText, sanitizedFilename);
      } else {
        extraction = '[Documento sin texto extraible]';
      }
    }
    // --- TEXT / CSV ---
    else if (mimeType.startsWith('text/') || mimeType === 'application/csv') {
      extractionType = 'document';
      const rawText = buffer.toString('utf-8');

      if (rawText && rawText.trim().length > 20) {
        extraction = await summarizeText(rawText, sanitizedFilename);
      } else {
        extraction = '[Archivo de texto vacio o muy corto]';
      }
    }
    // --- UNSUPPORTED (XLS, PPT, etc.) ---
    else {
      return res.status(200).json({
        filename: sanitizedFilename,
        type: 'unsupported',
        extraction: null,
      });
    }

    return res.status(200).json({
      filename: sanitizedFilename,
      type: extractionType,
      extraction: sanitizeString(extraction, 5000),
    });
  } catch (error) {
    console.error('Extract-file error:', error.message);

    return res.status(200).json({
      filename: req.body?.filename || 'unknown',
      type: 'error',
      extraction: null,
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};
