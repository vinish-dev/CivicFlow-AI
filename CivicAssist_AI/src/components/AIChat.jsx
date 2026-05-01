// src/components/AIChat.jsx
// AI chat interface with message history, TTS, and "Explain Simply" option.

import { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX, Lightbulb, Trash2, Bot, User } from 'lucide-react';
import { speak, stopSpeaking, isTTSSupported } from '../services/tts.service';

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-5">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message, language, onSpeak }) {
  const isAssistant = message.role === 'assistant';

  // Render markdown-like text with basic formatting
  const renderText = (text) => {
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-bold text-gray-900 mt-2">{line.slice(2, -2)}</p>;
        }
        if (/^\d+\.\s/.test(line)) {
          return <p key={i} className="ml-3 flex gap-2"><span className="text-blue-600 font-semibold">{line.split('.')[0]}.</span><span>{line.slice(line.indexOf('.') + 1).trim()}</span></p>;
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return <p key={i} className="ml-3 flex gap-2"><span className="text-blue-500">•</span><span>{line.slice(2)}</span></p>;
        }
        if (line.trim() === '') return <br key={i} />;
        return <p key={i} className="text-gray-700">{line.replace(/\*\*(.*?)\*\*/g, (_, m) => m)}</p>;
      });
  };

  return (
    <div className={`flex gap-3 px-4 py-3 animate-fade-in-up ${isAssistant ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isAssistant ? 'bg-blue-600' : 'bg-gray-200'
      }`}>
        {isAssistant ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-gray-600" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isAssistant ? '' : 'items-end flex flex-col'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAssistant
            ? 'bg-white border border-gray-200 rounded-tl-sm shadow-sm'
            : 'bg-blue-600 text-white rounded-tr-sm'
        }`}>
          {isAssistant ? (
            <div className="ai-response space-y-1">{renderText(message.text)}</div>
          ) : (
            <span>{message.text}</span>
          )}
        </div>

        {isAssistant && isTTSSupported() && (
          <button
            onClick={() => onSpeak(message.text)}
            className="mt-1.5 flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
            aria-label="Read aloud"
          >
            <Volume2 className="w-3.5 h-3.5" />
            {language === 'hi' ? 'सुनें' : 'Listen'}
          </button>
        )}
      </div>
    </div>
  );
}

const QUICK_PROMPTS_EN = [
  'How do I register to vote?',
  'What is voter ID eligibility?',
  'Where is my polling booth?',
  'How does EVM work?',
];

const QUICK_PROMPTS_HI = [
  'मतदाता पंजीकरण कैसे करें?',
  'मतदाता पहचान पत्र कैसे बनवाएं?',
  'मेरा मतदान केंद्र कहाँ है?',
  'EVM कैसे काम करती है?',
];

export function AIChat({ userProfile, language = 'en', messages, isLoading, error, onSendMessage, onClearChat }) {
  const [input, setInput] = useState('');
  const [simplified, setSimplified] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    const q = input.trim();
    if (!q || isLoading) return;
    onSendMessage(q, simplified);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSpeak = (text) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speak(text, language === 'hi' ? 'hi-IN' : 'en-IN');
      setTimeout(() => setIsSpeaking(false), 10000);
    }
  };

  const quickPrompts = language === 'hi' ? QUICK_PROMPTS_HI : QUICK_PROMPTS_EN;

  return (
    <div className="card flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-sm">CivicFlow AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">{language === 'hi' ? 'ऑनलाइन' : 'Online'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-simplify"
            onClick={() => setSimplified((s) => !s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              simplified
                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700'
            }`}
            title="Explain in simple terms"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {language === 'hi' ? 'सरल करें' : 'Simplify'}
          </button>
          {messages.length > 0 && (
            <button
              id="btn-clear-chat"
              onClick={onClearChat}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              aria-label="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl">🗳️</span>
            </div>
            <p className="font-semibold text-gray-800 mb-1">
              {language === 'hi' ? 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?' : 'Hello! How can I help you?'}
            </p>
            <p className="text-sm text-gray-500 mb-5">
              {language === 'hi' ? 'चुनाव प्रक्रिया के बारे में कुछ भी पूछें' : 'Ask me anything about the election process'}
            </p>
            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2 justify-center">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt); inputRef.current?.focus(); }}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-full transition-colors border border-blue-100"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-2">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} language={language} onSpeak={handleSpeak} />
            ))}
            {isLoading && <TypingIndicator />}
            {error && (
              <div className="mx-4 my-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-xs text-red-600 font-medium">⚠️ {error}</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100">
        {simplified && (
          <div className="mb-2 flex items-center gap-1.5 text-xs text-amber-700">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सरल भाषा मोड सक्रिय' : 'Simplified language mode active'}</span>
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={language === 'hi' ? 'अपना प्रश्न यहाँ लिखें...' : 'Ask about voting, registration, eligibility...'}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            disabled={isLoading}
            maxLength={500}
            aria-label="Chat input"
          />
          <button
            id="btn-send-chat"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
