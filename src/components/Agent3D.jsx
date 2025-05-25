import { useState, useRef, useEffect } from "react";
import { SplineScene } from "./ui/splite"; // Tu import correcto
import { useAgentChat } from "../hooks/useAgentChat"; // <-- NUEVA LÍNEA

export function Agent3D() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const { sendMessage, loading: apiLoading, sessionId } = useAgentChat(); // <-- NUEVA LÍNEA

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
      setMessages(prev => [...prev, { text: message, sender: 'user' }]);
      setMessage("");
      setIsTyping(true);
      
      try {
        // Llamar a la API real
        const { response } = await sendMessage(message);
        
        // Agregar respuesta del bot
        setMessages(prev => [...prev, { 
          text: response, 
          sender: 'bot' 
        }]);
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        
        // Mensaje de error para el usuario
        setMessages(prev => [...prev, { 
          text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.', 
          sender: 'bot' 
        }]);
      } finally {
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
    <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 transition-all duration-500 z-30 ${
      isMinimized 
        ? 'w-16 h-16' // Tamaño minimizado sigue igual
        : 'w-[calc(100%-2rem)] h-[75vh] shadow-2xl sm:w-80 sm:h-[480px]' // Tamaños responsivos para estado operacional
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

          {/* ÁREA DEL AGENTE 3D */}
          <div className="relative overflow-hidden transition-all duration-500 h-60"> {/* Altura fija para estado operacional */}
            
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />

            {/* NUEVO BOTÓN DE MINIMIZAR */}
            <button 
              onClick={() => setIsMinimized(true)}
              className="absolute top-2 right-2 text-purple-200 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg z-20" // z-20 para asegurar que esté sobre la escena de Spline
              aria-label="Minimizar chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 12H4" /> {/* Ícono de línea para minimizar */}
              </svg>
            </button>
          </div>

            {/* Status del agente */}
            <div className="px-4 py-0"> {/* Ajusta el padding (px-4 py-0) según necesites para el espaciado */}
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2"> {/* Mantenemos el fondo y blur si te gusta */}
              <p className="text-white text-xs font-medium text-center"> {/* Añadí text-center, puedes quitarlo si no te gusta */}
                {isTyping ? (
                  <span className="flex items-center justify-center gap-2"> {/* Añadí justify-center */}
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

          {/* ÁREA DE MENSAJES */}
          {!isMinimized && messages.length > 0 && ( // <<--- CONDICIÓN ACTUALIZADA
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-900/30 min-h-[150px] max-h-[250px]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {/* AJUSTE DE ALINEACIÓN DEL TEXTO AQUÍ */}
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm text-left ${ // <--- AÑADIDO: text-left
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
          {/* AJUSTE DE ESPACIADO (space-y-2) y PADDING SUPERIOR (pt-2) YA APLICADOS EN PASO ANTERIOR */}
          <div className="mt-auto bg-gradient-to-t from-gray-950 to-gray-900/50 px-4 pt-2 pb-4 space-y-2">

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
                  // AJUSTES DE ALTURA Y PADDING DEL TEXTAREA AQUÍ
                  className="w-full bg-transparent text-white placeholder-gray-400 px-3 py-1.5 text-sm focus:outline-none resize-none min-h-[36px] max-h-[80px]"
                  rows="1"
                />
                
                {/* Contenedor del botón de enviar */}
                <div className="flex items-center justify-end px-3 pb-1"> {/* Cambiado justify-between a justify-end y eliminado el div vacío */}
                  
                  <button 
                    onClick={handleSend}
                    disabled={!message.trim() || apiLoading} // <-- ACTUALIZAR ESTA LÍNEA
                    aria-label="Enviar mensaje" // Buena práctica para accesibilidad cuando solo hay un ícono
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white hover:text-white rounded-lg p-1.5 transition-all duration-300 hover:scale-110 disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/25 disabled:shadow-none flex items-center justify-center disabled:opacity-50" 
                    // CAMBIOS EN LAS CLASES DEL BOTÓN:
                    // - Eliminado: px-4, py-1.5 (padding original), gap-2, text-sm, font-medium
                    // - Cambiado: rounded-xl a rounded-lg (o rounded-full si prefieres un círculo)
                    // - Añadido: p-2 (nuevo padding para hacerlo más cuadrado), aria-label
                    // - El color del ícono se hereda de text-white. Si quieres un ícono púrpura sobre fondo blanco, o viceversa, necesitaríamos ajustar más.
                    //   Para un ícono púrpura sobre el gradiente actual, el text-white funciona bien para el SVG si su stroke="currentColor".
                    //   Si quieres que el ícono mismo sea de un púrpura específico, puedes cambiar text-white a text-purple-400 (por ejemplo)
                    //   o modificar el SVG directamente. Por ahora, lo dejamos con text-white para que contraste con el fondo degradado.
                  >
                    {/* SE ELIMINÓ: <span>Enviar</span> */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"> {/* Aumenté el strokeWidth un poco para que sea más visible */}
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