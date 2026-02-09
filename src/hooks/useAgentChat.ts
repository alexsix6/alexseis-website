import { useState, useCallback } from 'react';
import { generateSessionId } from '../lib/utils';

export interface ChatApiResponse {
  response: string;
  sessionId?: string;
  error?: string;
}

export interface UseAgentChatReturn {
  sendMessage: (message: string) => Promise<ChatApiResponse>;
  loading: boolean;
  error: string | null;
  sessionId: string;
}

export function useAgentChat(): UseAgentChatReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState<string>(() => {
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

  const sendMessage = useCallback(async (message: string): Promise<ChatApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId
        })
      });

      const data = await response.json() as ChatApiResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Error en la respuesta');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
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
