import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Code, Eye, Smartphone, Monitor } from 'lucide-react';
import type { ChatMessage, ProjectPhase, TodoItem } from '../App';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  projectPhase: ProjectPhase;
  todos: TodoItem[];
  generatedCode: string;
}

export default function ChatPanel({ messages, onSendMessage, projectPhase, todos, generatedCode }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [showCode, setShowCode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🧠</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {projectPhase === 'brainstorm' ? 'Brainstorm Mode' : 'Code Mode'}
            </h3>
            <p className="text-gray-400 max-w-md">
              {projectPhase === 'brainstorm'
                ? 'Describe what you want to build. Your code will appear in the Preview panel in real-time.'
                : 'I\'m generating code based on our brainstorm. Watch the Preview panel for live output.'}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-lg">
              {['Build a landing page with hero section', 'Create a todo list app', 'Design a portfolio site', 'Make a login form'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => onSendMessage(suggestion)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
              <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Generated Code Toggle */}
      {generatedCode && (
        <div className="border-t border-gray-700">
          <button
            onClick={() => setShowCode(!showCode)}
            className="w-full px-4 py-2 flex items-center justify-between text-sm text-gray-400 hover:bg-gray-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Code size={14} />
              Generated Code ({generatedCode.length} chars)
            </span>
            <span>{showCode ? '▼' : '▲'}</span>
          </button>
          {showCode && (
            <div className="max-h-48 overflow-y-auto p-4 bg-black/50">
              <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">{generatedCode}</pre>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={projectPhase === 'brainstorm'
              ? 'Describe what you want to build...'
              : 'Request changes or updates...'}
            className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
            🧠 Unlimited • No caps • Code renders in Preview →
          </span>
          <span className="text-xs text-gray-500">
            Auto-detect language • Mirror response
          </span>
        </div>
      </div>
    </div>
  );
}
