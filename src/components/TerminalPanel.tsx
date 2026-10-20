import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Power, Trash2, Download, Shield } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
  timestamp: Date;
}

export default function TerminalPanel() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'system',
      content: '🔒 OpenAI Dummy Terminal v1.0 — Sandboxed Environment',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'system',
      content: '⚡ Powered by xterm.js + DumbTerm architecture',
      timestamp: new Date(),
    },
    {
      id: '3',
      type: 'system',
      content: '🛡️ All commands run in isolated container. Kill switch active.',
      timestamp: new Date(),
    },
    {
      id: '4',
      type: 'output',
      content: '',
      timestamp: new Date(),
    },
  ]);
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
      timestamp: new Date(),
    };
    setLines(prev => [...prev, inputLine]);

    // Simulate command responses
    setTimeout(() => {
      const responses: Record<string, TerminalLine[]> = {
        'npm install': [
          { id: crypto.randomUUID(), type: 'output', content: '📦 Installing dependencies...', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: 'added 247 packages in 12.3s', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: '✅ Dependencies installed successfully', timestamp: new Date() },
        ],
        'npm run build': [
          { id: crypto.randomUUID(), type: 'output', content: '🔨 Building project...', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: 'vite v5.0.0 building for production...', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: '✓ 42 modules transformed.', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: 'dist/index.html    0.45 kB │ gzip: 0.30 kB', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: 'dist/assets/index.js  142.53 kB │ gzip: 45.82 kB', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: '✅ Build completed in 3.2s', timestamp: new Date() },
        ],
        'npx react-native run-android': [
          { id: crypto.randomUUID(), type: 'output', content: '📱 Starting Android emulator...', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: 'info Running jetifier...', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: 'info Connecting to the development server...', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: 'info Installing APK on emulator...', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: '✅ App launched on Android emulator', timestamp: new Date() },
        ],
        'flutter build apk': [
          { id: crypto.randomUUID(), type: 'output', content: '🏗️ Building Flutter APK...', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: 'Running Gradle task \'assembleRelease\'...', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: '✓ Built build/app/outputs/flutter-apk/app-release.apk', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: '✅ APK size: 12.4 MB', timestamp: new Date() },
        ],
        'clear': [],
        'help': [
          { id: crypto.randomUUID(), type: 'output', content: 'Available commands:', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: '  npm install          — Install dependencies', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: '  npm run build        — Build project', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: '  npx react-native run-android — Run on Android', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: '  flutter build apk    — Build Android APK', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: '  clear                — Clear terminal', timestamp: new Date() },
          { id: crypto.randomUUID(), type: 'output', content: '  help                 — Show this help', timestamp: new Date() },
        ],
      };

      if (cmd === 'clear') {
        setLines([]);
        return;
      }

      const response = responses[cmd] || [
        { id: crypto.randomUUID(), type: 'output', content: `$ ${cmd}: command executed in sandbox`, timestamp: new Date() },
      ];
      setLines(prev => [...prev, ...response]);
    }, 500);
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
      timestamp: new Date(),
    }]);
  };

  const handleRestart = () => {
    setIsRunning(true);
    setLines([
      {
        id: crypto.randomUUID(),
        type: 'system',
        content: '🔄 Terminal restarted — Sandboxed environment active',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="h-full flex flex-col bg-black font-mono">
      {/* Terminal Header */}
      <div className="h-10 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" onClick={handleKill} />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" onClick={handleRestart} />
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
          <button className="p-1 hover:bg-gray-700 rounded transition-colors">
            <Download size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 text-sm"
        onClick={() => inputRef.current?.focus()}
      >
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
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white transition-colors flex items-center gap-1"
            >
              <Power size={12} /> Restart
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
