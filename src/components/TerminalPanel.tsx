import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Shield, Play, Pause, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'system' | 'success';
  content: string;
  timestamp: Date;
}

interface TerminalTask {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'done' | 'error';
  commands: string[];
}

interface TerminalPanelProps {
  lines?: string[];
  isRunning?: boolean;
  currentTask?: string;
}

export default function TerminalPanel({ lines: externalLines = [], isRunning: externalIsRunning = false, currentTask: externalCurrentTask = '' }: TerminalPanelProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState<TerminalTask | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use external state if provided
  const displayLines = externalLines.length > 0 ? externalLines.map((content, i) => ({
    id: String(i),
    type: content.startsWith('$') ? 'command' as const : content.startsWith('✓') || content.startsWith('✅') ? 'success' as const : 'output' as const,
    content,
    timestamp: new Date(),
  })) : lines;
  const displayIsRunning = externalLines.length > 0 ? externalIsRunning : isRunning;
  const displayCurrentTask = externalLines.length > 0 ? externalCurrentTask : (currentTask?.name || '');

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  // Simulate AI running tasks
  const runAITask = async (task: TerminalTask) => {
    setIsRunning(true);
    setCurrentTask(task);

    addLine('system', `🚀 Starting: ${task.name}`);

    for (const cmd of task.commands) {
      await executeCommand(cmd);
    }

    addLine('success', `✅ Completed: ${task.name}`);
    setIsRunning(false);
    setCurrentTask(null);
  };

  const executeCommand = async (command: string) => {
    addLine('command', `$ ${command}`);

    // Simulate command execution
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Simulate output
    const outputs: Record<string, string[]> = {
      'npm install': [
        '📦 Installing dependencies...',
        'added 247 packages in 12.3s',
      ],
      'npm run build': [
        '🔨 Building project...',
        'vite v5.0.0 building for production...',
        '✓ 42 modules transformed.',
        'dist/index.html    0.45 kB │ gzip: 0.30 kB',
        'dist/assets/index.js  142.53 kB │ gzip: 45.82 kB',
        '✓ built in 3.2s',
      ],
      'npx react-native init MyApp': [
        '📱 Creating React Native project...',
        'Installing template...',
        'Installing CocoaPods dependencies...',
        '✓ Project created successfully',
      ],
      'cd MyApp && npx react-native run-android': [
        '📱 Starting Android emulator...',
        'Building APK...',
        'Installing on device...',
        '✓ App launched successfully',
      ],
      'flutter create my_app': [
        '🦋 Creating Flutter project...',
        'Running flutter pub get...',
        '✓ Project created at my_app/',
      ],
      'cd my_app && flutter build apk': [
        '🏗️ Building Flutter APK...',
        'Running Gradle task \'assembleRelease\'...',
        '✓ Built build/app/outputs/flutter-apk/app-release.apk',
        '✓ APK size: 12.4 MB',
      ],
    };

    const output = outputs[command] || [`Executed: ${command}`];
    
    for (const line of output) {
      addLine('output', line);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  };

  const addLine = (type: TerminalLine['type'], content: string) => {
    setLines(prev => [...prev, {
      id: crypto.randomUUID(),
      type,
      content,
      timestamp: new Date(),
    }]);
  };

  // Example AI tasks
  const aiTasks: TerminalTask[] = [
    {
      id: '1',
      name: 'Install Dependencies',
      status: 'pending',
      commands: ['npm install'],
    },
    {
      id: '2',
      name: 'Build Web App',
      status: 'pending',
      commands: ['npm run build'],
    },
    {
      id: '3',
      name: 'Create Android App',
      status: 'pending',
      commands: ['npx react-native init MyApp', 'cd MyApp && npx react-native run-android'],
    },
    {
      id: '4',
      name: 'Create Flutter App',
      status: 'pending',
      commands: ['flutter create my_app', 'cd my_app && flutter build apk'],
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-gray-400">AI Terminal — I'm building for you</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-green-400" />
          <span className="text-xs text-green-400">Sandboxed</span>
          {isRunning && (
            <div className="flex items-center gap-1 text-xs text-purple-400">
              <Loader2 size={12} className="animate-spin" />
              <span>Running</span>
            </div>
          )}
        </div>
      </div>

      {/* Task Queue */}
      <div className="p-4 border-b border-gray-700 bg-gray-800/50">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">📋 Task Queue</h3>
        <div className="grid grid-cols-2 gap-2">
          {aiTasks.map(task => (
            <button
              key={task.id}
              onClick={() => !isRunning && runAITask(task)}
              disabled={isRunning}
              className="flex items-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-left transition-colors"
            >
              {task.status === 'done' ? (
                <CheckCircle size={14} className="text-green-400" />
              ) : task.status === 'running' ? (
                <Loader2 size={14} className="text-purple-400 animate-spin" />
              ) : (
                <Play size={14} className="text-gray-400" />
              )}
              <span className="text-xs text-gray-300">{task.name}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Or just chat with me — I'll run the right commands automatically
        </p>
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 text-sm font-mono"
      >
        {displayLines.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">AI Terminal</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-4">
              I'll run all the commands for you. Just tell me what you want to build, and I'll handle the rest.
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>✅ Install dependencies</p>
              <p>✅ Build apps</p>
              <p>✅ Run tests</p>
              <p>✅ Deploy</p>
            </div>
          </div>
        ) : (
          displayLines.map(line => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`mb-1 ${
                line.type === 'command' ? 'text-purple-400 font-semibold' :
                line.type === 'error' ? 'text-red-400' :
                line.type === 'success' ? 'text-green-400' :
                line.type === 'system' ? 'text-blue-400 font-semibold' :
                'text-gray-300'
              }`}
            >
              {line.content}
            </motion.div>
          ))
        )}
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3 text-xs">
          <span className={displayIsRunning ? 'text-purple-400' : 'text-gray-500'}>
            {displayIsRunning ? '● AI Working' : '○ Ready'}
          </span>
          {displayCurrentTask && (
            <>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400">Task: {displayCurrentTask}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{displayLines.length} lines</span>
          <span>•</span>
          <span>AI-driven</span>
        </div>
      </div>
    </div>
  );
}
