import { useState, useCallback } from 'react';
import { generateSessionId } from '../lib/utils';

export function useAgentChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId] = useState(() => {
    // Intentar recuperar session ID del localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('agentSessionId');
      if (stored) return stored;
      
      const newId = generateSessionId();
      localStorage.setItem('agentSessionId', newId);
      return newId;
    }
    return generateSessionId();
  });

  const sendMessage = useCallback(async (message) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/chat', {  // ✅ CORRECTO para Vercel Functions
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message, 
          sessionId 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la respuesta');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  return { 
    sendMessage, 
    loading, 
    error, 
    sessionId 
  };
}