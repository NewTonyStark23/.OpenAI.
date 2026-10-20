import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Sparkles, Paperclip } from 'lucide-react';
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
    <div className="h-full flex flex-col bg-[#0d0d0d]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <Sparkles size={20} className="text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">What are we building?</h2>
            <p className="text-sm text-gray-500 text-center max-w-md mb-6">
              Describe your app and I'll handle everything — code, build, test. You're the product manager, I'm the developer.
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-md w-full">
              {[
                'Landing page with hero',
                'Todo app with dark mode',
                'Login form with Google',
                'Portfolio site',
              ].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => !isAIBusy && onSendMessage(suggestion)}
                  disabled={isAIBusy}
                  className="px-3 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] disabled:opacity-50 rounded-lg text-xs text-gray-400 transition-colors text-left border border-[#2a2a2a]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                {msg.role === 'user' ? (
                  <div className="max-w-[85%] bg-purple-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div className="flex gap-3 max-w-[90%]">
                    <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      AI
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* AI Working Indicator */}
            {isAIBusy && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  AI
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] rounded-xl border border-purple-500/20">
                  <Loader2 size={12} className="text-purple-400 animate-spin" />
                  <span className="text-xs text-purple-300">{aiStatus || 'Working...'}</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-[#2a2a2a] bg-[#0d0d0d] p-3">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-2 focus-within:border-purple-500/50 transition-colors">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-300 transition-colors"
              title="Attach"
            >
              <Paperclip size={16} />
            </button>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isAIBusy}
              placeholder={isAIBusy ? 'I\'m working on it...' : 'Describe what you want to build...'}
              rows={1}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 resize-none focus:outline-none disabled:opacity-50"
              style={{ minHeight: '24px', maxHeight: '120px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isAIBusy}
              className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-[#2a2a2a] disabled:text-gray-600 rounded-lg transition-colors"
            >
              {isAIBusy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-[10px] text-gray-600">
              Enter to send • Shift+Enter for new line
            </span>
            <span className="text-[10px] text-gray-600">
              🤖 I code • You describe
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
