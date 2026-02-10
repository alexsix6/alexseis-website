import { useState, useRef, useEffect } from "react";
import { SplineScene } from "./ui/splite";
import { useAgentChat } from "../hooks/useAgentChat";
import { trackEvent } from "../hooks/useAnalytics";
import type { ChatMessage } from "@/types";

interface QuickAction {
  icon: string;
  text: string;
  action: string;
}

export function Agent3D(): JSX.Element {
  const [isMinimized, setIsMinimized] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, loading: apiLoading, sessionId } = useAgentChat();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Show email prompt after 3 messages (if not already captured)
  useEffect(() => {
    if (messageCount >= 3 && !emailCaptured && !showEmailPrompt) {
      setShowEmailPrompt(true);
    }
  }, [messageCount, emailCaptured, showEmailPrompt]);

  const handleOpen = (): void => {
    setIsMinimized(false);
    trackEvent('chat_open', { page_path: window.location.pathname });
  };

  const handleSend = async (): Promise<void> => {
    if (message.trim()) {
      const userMsg = message;
      setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
      setMessage("");
      setIsTyping(true);
      setMessageCount(prev => prev + 1);

      // Track message sent
      trackEvent('chat_message', {
        message_type: 'user',
        message_count: messageCount + 1,
        page_path: window.location.pathname,
      });

      try {
        const { response } = await sendMessage(userMsg);
        setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
      } catch {
        setMessages(prev => [...prev, {
          text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
          sender: 'bot'
        }]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleEmailSubmit = async (): Promise<void> => {
    if (!userEmail.trim() || !/\S+@\S+\.\S+/.test(userEmail)) return;

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Chat Lead',
          email: userEmail.trim(),
          company: '',
          interest: 'chat-lead',
          message: `Lead capturado desde chat. Mensajes: ${messageCount}. Session: ${sessionId}`,
          _hp_website: '',
        }),
      });

      setEmailCaptured(true);
      setShowEmailPrompt(false);
      trackEvent('generate_lead', {
        currency: 'USD',
        value: 30,
        lead_source: 'chatbot',
        message_count: messageCount,
      });

      setMessages(prev => [...prev, {
        text: `Gracias. Te enviaré información personalizada sobre arquitectura IA a ${userEmail}.`,
        sender: 'bot'
      }]);
    } catch {
      setShowEmailPrompt(false);
    }
  };

  // Conversion-focused quick actions
  const quickActions: QuickAction[] = [
    { icon: "📊", text: "Auditoría IA", action: "¿Cómo hago una auditoría de madurez IA en mi empresa?" },
    { icon: "⚡", text: "ROI de IA", action: "¿Cuál es el ROI típico de implementar RAG enterprise?" },
    { icon: "📈", text: "Caso Real", action: "Muéstrame un caso real con métricas de éxito verificables" },
    { icon: "🎯", text: "Mi Proyecto", action: "Quiero evaluar si mi proyecto es candidato para IA enterprise" },
  ];

  const handleQuickAction = (action: string): void => {
    setMessage(action);
    textareaRef.current?.focus();
    trackEvent('cta_click', {
      cta_name: 'chat_quick_action',
      cta_location: 'chatbot',
    });
  };

  return (
    <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 transition-all duration-500 z-30 ${
      isMinimized
        ? 'w-16 h-16'
        : 'w-[calc(100%-2rem)] h-[75vh] shadow-2xl sm:w-80 sm:h-[480px]'
    }`}>

      {isMinimized ? (
        /* ESTADO MINIMIZADO */
        <button
          onClick={handleOpen}
          className="w-full h-full rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-3xl animate-bounce hover:animate-none"
          style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a365d 100%)', boxShadow: '0 0 20px rgba(0, 217, 255, 0.3), 0 0 40px rgba(0, 217, 255, 0.1)' }}
        >
          <span className="drop-shadow-lg">{"🤖"}</span>
        </button>
      ) : (
        /* ESTADO NORMAL/EXPANDIDO */
        <div className="h-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(0, 217, 255, 0.2)' }}>

          {/* AREA DEL AGENTE 3D */}
          <div className="relative overflow-hidden transition-all duration-500 h-60">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />

            {/* BOTON DE MINIMIZAR */}
            <button
              onClick={() => setIsMinimized(true)}
              className="absolute top-2 right-2 text-cyan-200 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg z-20"
              aria-label="Minimizar chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 12H4" />
              </svg>
            </button>
          </div>

          {/* Status del agente */}
          <div className="px-4 py-0">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2">
              <p className="text-white text-xs font-medium text-center">
                {isTyping ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                    </span>
                    Analizando...
                  </span>
                ) : (
                  "¡Hola! 👋 Pregúntame sobre arquitectura IA enterprise"
                )}
              </p>
            </div>
          </div>

          {/* AREA DE MENSAJES */}
          {!isMinimized && messages.length > 0 && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-900/30 min-h-[150px] max-h-[250px]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm text-left ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white'
                      : 'bg-gray-800/80 text-gray-100 border border-gray-700/50'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />

              {/* Email capture prompt (appears after 3 messages) */}
              {showEmailPrompt && !emailCaptured && (
                <div className="bg-cyan-900/40 border border-cyan-500/30 rounded-xl p-3 space-y-2">
                  <p className="text-xs text-cyan-200">
                    {"📧"} ¿Quieres recibir información personalizada sobre tu caso?
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="tu@empresa.com"
                      className="flex-1 bg-gray-800/60 text-white text-xs px-3 py-1.5 rounded-lg border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={handleEmailSubmit}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Enviar
                    </button>
                  </div>
                  <button
                    onClick={() => setShowEmailPrompt(false)}
                    className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    No, gracias
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CHAT INTERFACE */}
          <div className="mt-auto bg-gradient-to-t from-gray-950 to-gray-900/50 px-4 pt-2 pb-4 space-y-2">

            {/* Quick Actions */}
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#6b7280 transparent' }}>
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex-shrink-0 bg-gradient-to-r from-gray-800/80 to-gray-700/80 hover:from-cyan-900/80 hover:to-cyan-800/80 text-gray-200 hover:text-white text-xs px-2.5 py-1.5 rounded-full transition-all duration-300 flex items-center gap-2 border border-gray-600/30 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 group"
                >
                  <span className="text-base group-hover:animate-bounce">{action.icon}</span>
                  <span className="font-medium">{action.text}</span>
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="relative">
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 focus-within:border-cyan-500/50 focus-within:shadow-lg focus-within:shadow-cyan-500/10 transition-all duration-300">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Escribe tu pregunta aquí..."
                  className="w-full bg-transparent text-white placeholder-gray-400 px-3 py-1.5 text-sm focus:outline-none resize-none min-h-[36px] max-h-[80px]"
                  rows={1}
                />

                {/* Send button */}
                <div className="flex items-center justify-end px-3 pb-1">
                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || apiLoading}
                    aria-label="Enviar mensaje"
                    className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white hover:text-white rounded-lg p-1.5 transition-all duration-300 hover:scale-110 disabled:hover:scale-100 shadow-lg hover:shadow-cyan-500/25 disabled:shadow-none flex items-center justify-center disabled:opacity-50"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Character counter */}
              {message.length > 0 && (
                <div className="absolute -top-6 right-0 text-xs text-gray-500">
                  {message.length}/500
                </div>
              )}
            </div>

            {/* Footer with branding + CTA */}
            <div className="text-center pt-1 space-y-1">
              <a
                href="/intake"
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2"
                onClick={() => trackEvent('cta_click', { cta_name: 'chat_footer_cta', cta_location: 'chatbot' })}
              >
                {"🚀"} Solicitar Auditoría IA Gratuita
              </a>
              <p className="text-xs text-gray-500">
                INNATE.data {"•"} <span className="text-cyan-400">Arquitectura IA Enterprise</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agent3D;
