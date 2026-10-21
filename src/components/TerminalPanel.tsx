import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TerminalPanelProps {
  lines?: string[];
  isRunning?: boolean;
  currentTask?: string;
}

export default function TerminalPanel({ lines: externalLines = [], isRunning: externalIsRunning = false, currentTask: externalCurrentTask = '' }: TerminalPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [externalLines]);

  const displayLines = externalLines;

  return (
    <div className="h-full bg-[#0d0d0d] font-mono text-xs overflow-hidden flex flex-col">
      {/* Terminal Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3">
        {displayLines.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-gray-600">
              Terminal will show AI commands as they run.
            </p>
          </div>
        ) : (
          displayLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -3 }}
              animate={{ opacity: 1, x: 0 }}
              className={`mb-0.5 leading-relaxed ${
                line.startsWith('$') ? 'text-purple-400' :
                line.startsWith('✓') || line.startsWith('✅') ? 'text-green-400' :
                line.startsWith('❌') || line.startsWith('⛔') ? 'text-red-400' :
                line.startsWith('🤖') || line.startsWith('🚀') ? 'text-blue-400' :
                'text-gray-400'
              }`}
            >
              {line}
            </motion.div>
          ))
        )}
        {externalIsRunning && (
          <div className="text-purple-400 animate-pulse mt-1">▋</div>
        )}
      </div>
    </div>
  );
}
