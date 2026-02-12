/**
 * INNATE.data Intake v3.2 - Audio Transcription API
 * Uses OpenAI Whisper for Spanish audio transcription
 * Includes hallucination detection for known Whisper artifacts
 */
import OpenAI from 'openai';
import { applySecurityMiddleware } from './lib/security.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Known Whisper hallucination phrases (silent/corrupted audio)
const WHISPER_HALLUCINATIONS = [
  'subtítulos realizados por la comunidad de amara.org',
  'subtitulos realizados por la comunidad de amara.org',
  'subtítulos por la comunidad de amara.org',
  'subtitles by the amara.org community',
  'thanks for watching',
  'thank you for watching',
  'please subscribe',
  'gracias por ver',
  'suscríbete',
  'like and subscribe',
  'www.mooji.org',
  'amara.org',
];

/**
 * Detect if transcription is a Whisper hallucination
 */
function isHallucination(text) {
  if (!text) return true;
  const normalized = text.trim().toLowerCase();
  if (normalized.length < 5) return true;
  return WHISPER_HALLUCINATIONS.some(h => normalized.includes(h));
}

export default async function handler(req, res) {
  // Apply shared security middleware
  const security = applySecurityMiddleware(req, res, 'transcribe');
  if (!security.ok) return;

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const contentType = req.headers['content-type'] || '';
    let audioBuffer;

    if (contentType.includes('multipart/form-data')) {
      const formData = req.body;

      if (!formData || !formData.audio) {
        return res.status(400).json({ error: 'No audio file provided' });
      }

      if (formData.audio instanceof Buffer) {
        audioBuffer = formData.audio;
      } else if (typeof formData.audio === 'string') {
        audioBuffer = Buffer.from(formData.audio, 'base64');
      } else {
        return res.status(400).json({ error: 'Invalid audio format' });
      }
    } else if (contentType.includes('application/octet-stream')) {
      audioBuffer = req.body;
    } else if (contentType.includes('application/json')) {
      const { audio } = req.body;
      if (!audio) {
        return res.status(400).json({ error: 'No audio data in request' });
      }
      audioBuffer = Buffer.from(audio, 'base64');
    } else {
      return res.status(400).json({
        error: 'Unsupported content type'
      });
    }

    // Validate buffer
    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({ error: 'Empty audio data' });
    }

    // Enforce 25MB server-side limit
    if (audioBuffer.length > 25 * 1024 * 1024) {
      return res.status(413).json({ error: 'Audio file too large. Maximum 25MB.' });
    }

    // Create a File object for the OpenAI API
    const audioFile = new File([audioBuffer], 'audio.webm', {
      type: 'audio/webm',
    });

    // Call Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'es',
      response_format: 'text',
      prompt: 'El cliente describe su infraestructura de datos, sistemas y desafios tecnologicos de su empresa.',
    });

    // Check for known Whisper hallucinations
    if (isHallucination(transcription)) {
      return res.status(200).json({
        success: false,
        transcription: null,
        error: 'No se pudo transcribir el audio. Por favor intenta grabar de nuevo hablando mas cerca del microfono.',
      });
    }

    return res.status(200).json({
      success: true,
      transcription: transcription,
    });
  } catch (error) {
    console.error('Transcription error:', error.message);

    if (error.status === 400) {
      return res.status(400).json({
        error: 'Invalid audio format. Please record again.',
      });
    }

    if (error.status === 413) {
      return res.status(413).json({
        error: 'Audio file too large. Maximum 25MB.',
      });
    }

    return res.status(500).json({
      error: 'Transcription failed',
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};
