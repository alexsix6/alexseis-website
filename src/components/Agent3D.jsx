import { useState, useRef, useEffect } from "react";
import { SplineScene } from "./ui/splite"; // Tu import correcto

export function Agent3D() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleSend = async () => {
    if (message.trim()) {
      // Agregar mensaje del usuario
      setMessages([...messages, { text: message, sender: 'user' }]);
      setMessage("");
      setIsTyping(true);
      
      try {
        // Simulamos respuesta del bot (reemplaza con tu API real)
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            text: "Gracias por tu pregunta. Como especialista en Google Cloud e IA, estoy aquí para ayudarte.", 
            sender: 'bot' 
          }]);
          setIsTyping(false);
        }, 1500);
      } catch (error) {
        console.error('Error:', error);
        setIsTyping(false);
      }
    }
  };

  const quickActions = [
    { icon: "🚀", text: "Optimización Cloud", action: "¿Cómo puedo optimizar mis costos en Google Cloud?" },
    { icon: "🤖", text: "Agentes IA", action: "¿Qué son los agentes de IA y cómo implementarlos?" },
    { icon: "📊", text: "BigQuery", action: "¿Cómo usar BigQuery para análisis de datos?" },
    { icon: "🔧", text: "Integración", action: "¿Cómo integrar servicios de Google Cloud?" }
  ];

  const handleQuickAction = (action) => {
    setMessage(action);
    textareaRef.current?.focus();
  };

  return (
    <div className={`fixed bottom-6 right-6 transition-all duration-500 z-30 ${
      isMinimized 
        ? 'w-16 h-16' 
        : isExpanded 
          ? 'w-[360px] h-[580px]' 
          : 'w-80 h-[480px]'
    }`}>
      
      {isMinimized ? (
        /* ESTADO MINIMIZADO */
        <button 
          onClick={() => setIsMinimized(false)}
          className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-3xl animate-bounce hover:animate-none"
        >
          <span className="drop-shadow-lg">🤖</span>
        </button>
      ) : (
        /* ESTADO NORMAL/EXPANDIDO */
        <div className="h-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-2xl shadow-2xl border border-purple-500/20 overflow-hidden backdrop-blur-xl flex flex-col">
          
          {/* HEADER MEJORADO */}
          <div className="bg-gradient-to-r from-purple-900/90 to-pink-900/90 px-3 py-2 border-b border-purple-500/20 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">🤖</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xs">AI Assistant</h3>
                  <p className="text-purple-200 text-xs flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    Especialista en Google Cloud
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-purple-200 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {isExpanded ? (
                      <path d="M19 14l-5 5m0 0l-5-5m5 5V5" />
                    ) : (
                      <path d="M5 10l5-5m0 0l5 5m-5-5v14" />
                    )}
                  </svg>
                </button>
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="text-purple-200 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 12H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ÁREA DEL AGENTE 3D */}
          <div className={`relative overflow-hidden transition-all duration-500 ${
            isExpanded ? 'h-48' : 'h-40'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10"></div>
            
            <iframe 
              src="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
              style={{ border: 'none' }}
              title="3D Agent"
            />
            
            {/* Status del agente */}
            <div className="absolute bottom-2 left-2 right-2 z-20">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2">
                <p className="text-white text-xs font-medium">
                  {isTyping ? (
                    <span className="flex items-center gap-2">
                      <span className="flex gap-1">
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                      </span>
                      Escribiendo...
                    </span>
                  ) : (
                    "¡Hola! 👋 Pregúntame sobre IA, Google Cloud o BigQuery"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* ÁREA DE MENSAJES (si está expandido) */}
          {isExpanded && messages.length > 0 && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-900/30 min-h-[150px] max-h-[250px]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-800/80 text-gray-100 border border-gray-700/50'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CHAT INTERFACE PROFESIONAL */}
          <div className="mt-auto bg-gradient-to-t from-gray-950 to-gray-900/50 p-4 space-y-3">
            {/* Quick Actions - Diseño moderno tipo chips */}
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#6b7280 transparent' }}>
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex-shrink-0 bg-gradient-to-r from-gray-800/80 to-gray-700/80 hover:from-purple-800/80 hover:to-pink-800/80 text-gray-200 hover:text-white text-xs px-2.5 py-1.5 rounded-full transition-all duration-300 flex items-center gap-2 border border-gray-600/30 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 group"
                >
                  <span className="text-base group-hover:animate-bounce">{action.icon}</span>
                  <span className="font-medium">{action.text}</span>
                </button>
              ))}
            </div>
            
            {/* Input Area - Diseño moderno estilo Discord/Slack */}
            <div className="relative">
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 focus-within:border-purple-500/50 focus-within:shadow-lg focus-within:shadow-purple-500/10 transition-all duration-300">
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
                  className="w-full bg-transparent text-white placeholder-gray-400 px-3 py-2 text-sm focus:outline-none resize-none min-h-[40px] max-h-[80px]"
                  rows="1"
                />
                
                {/* Toolbar con opciones */}
                <div className="flex items-center justify-between px-3 pb-2">
                  {/* Botones removidos según feedback */}
                  <div></div>
                  
                  <button 
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl px-4 py-2 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/25 disabled:shadow-none flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                  >
                    <span>Enviar</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Indicador de caracteres */}
              {message.length > 0 && (
                <div className="absolute -top-6 right-0 text-xs text-gray-500">
                  {message.length}/500
                </div>
              )}
            </div>
            
            {/* Footer con branding sutil */}
            <div className="text-center pt-1">
              <p className="text-xs text-gray-500">
                Powered by AI • <span className="text-purple-400">Google Cloud Partner</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}