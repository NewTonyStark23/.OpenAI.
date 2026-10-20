import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Code, Loader2, CheckCircle } from 'lucide-react';
import type { ChatMessage, ProjectPhase, TodoItem } from '../App';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  projectPhase: ProjectPhase;
  todos: TodoItem[];
  generatedCode: string;
  aiStatus: string;
  isAIBusy: boolean;
}

export default function ChatPanel({ messages, onSendMessage, projectPhase, todos, generatedCode, aiStatus, isAIBusy }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [showCode, setShowCode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isAIBusy) {
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
              <span className="text-4xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {projectPhase === 'brainstorm' ? 'Brainstorm Mode' : 'Code Mode'}
            </h3>
            <p className="text-gray-400 max-w-md mb-2">
              {projectPhase === 'brainstorm'
                ? 'Tell me what you want to build. I\'ll handle everything — code, build, test, deploy.'
                : 'I\'m working on your project. Ask me to make changes or additions.'}
            </p>
            <p className="text-xs text-gray-500 mb-6">
              💡 You don't code — I do. Just describe what you want.
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3 max-w-lg">
              {['Build a landing page', 'Create a todo app', 'Design a portfolio', 'Make a login form'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => !isAIBusy && onSendMessage(suggestion)}
                  disabled={isAIBusy}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-lg text-sm text-gray-300 transition-colors text-left"
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

        {/* AI Working Indicator */}
        {isAIBusy && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[80%] rounded-2xl px-5 py-3 bg-gray-800 border border-purple-500/30">
              <div className="flex items-center gap-2 text-sm text-purple-300">
                <Loader2 size={14} className="animate-spin" />
                <span>{aiStatus || 'Working...'}</span>
              </div>
            </div>
          </motion.div>
        )}

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
              Generated Code ({generatedCode.length.toLocaleString()} chars)
              <CheckCircle size={14} className="text-green-400" />
            </span>
            <span>{showCode ? '▼ Hide' : '▲ Show'}</span>
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
            disabled={isAIBusy}
            placeholder={isAIBusy
              ? 'I\'m working on it...'
              : projectPhase === 'brainstorm'
              ? 'Describe what you want to build...'
              : 'Tell me what to change...'}
            className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isAIBusy}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl transition-colors"
          >
            {isAIBusy ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
            🤖 I handle all coding • You just describe
          </span>
          <span className="text-xs text-gray-500">
            Check Terminal → to see my work
          </span>
        </div>
      </div>
    </div>
  );
}
