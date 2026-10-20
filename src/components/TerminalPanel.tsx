import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Download, Shield } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
}

export default function TerminalPanel() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const inputLine: TerminalLine = {
      id: crypto.randomUUID(),
      type: 'input',
      content: cmd,
    };
    setLines(prev => [...prev, inputLine]);

    setTimeout(() => {
      const responses: Record<string, TerminalLine[]> = {
        'help': [
          { id: crypto.randomUUID(), type: 'output', content: 'Available commands:', timestamp: new Date() } as any,
          { id: crypto.randomUUID(), type: 'output', content: '  npm install          — Install dependencies', timestamp: new Date() } as any,
          { id: crypto.randomUUID(), type: 'output', content: '  npm run build        — Build project', timestamp: new Date() } as any,
          { id: crypto.randomUUID(), type: 'output', content: '  clear                — Clear terminal', timestamp: new Date() } as any,
          { id: crypto.randomUUID(), type: 'output', content: '  help                 — Show this help', timestamp: new Date() } as any,
        ],
        'clear': [],
      };

      if (cmd === 'clear') {
        setLines([]);
        return;
      }

      const response = responses[cmd] || [
        { id: crypto.randomUUID(), type: 'output', content: `Executed: ${cmd}`, timestamp: new Date() } as any,
      ];
      setLines(prev => [...prev, ...response]);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && isRunning) {
      handleCommand(input.trim());
      setInput('');
    }
  };

  const handleKill = () => {
    setIsRunning(false);
    setLines(prev => [...prev, {
      id: crypto.randomUUID(),
      type: 'error',
      content: '⛔ TERMINAL KILLED — All processes terminated',
    }]);
  };

  const handleRestart = () => {
    setIsRunning(true);
    setLines([{
      id: crypto.randomUUID(),
      type: 'system',
      content: '🔄 Terminal restarted — Sandboxed environment active',
    }]);
  };

  return (
    <div className="h-full flex flex-col bg-black font-mono">
      {/* Terminal Header */}
      <div className="h-10 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={handleKill} />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500 cursor-pointer" onClick={handleRestart} />
          </div>
          <span className="text-xs text-gray-400">openai-terminal — sandboxed</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-green-400" />
          <span className="text-xs text-green-400">Sandboxed</span>
          <button
            onClick={() => setLines([])}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <Trash2 size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.length === 0 && isRunning && (
          <div className="text-gray-600 text-center py-8">
            <p>Sandboxed terminal ready.</p>
            <p className="mt-1">Type a command or "help" for available commands.</p>
          </div>
        )}
        {lines.map(line => (
          <motion.div
            key={line.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mb-1 ${
              line.type === 'input' ? 'text-green-400' :
              line.type === 'error' ? 'text-red-400' :
              line.type === 'system' ? 'text-blue-400' :
              'text-gray-300'
            }`}
          >
            {line.type === 'input' && <span className="text-purple-400">$ </span>}
            {line.content}
          </motion.div>
        ))}
      </div>

      {/* Input Line */}
      <div className="border-t border-gray-800 p-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-purple-400 text-sm">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={!isRunning}
            placeholder={isRunning ? 'Enter command...' : 'Terminal killed — click restart'}
            className="flex-1 bg-transparent text-green-400 text-sm focus:outline-none placeholder-gray-600 disabled:text-gray-600"
          />
          {!isRunning && (
            <button
              onClick={handleRestart}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white transition-colors"
            >
              Restart
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
