import { useState } from 'react';
import { Brain, GitBranch, Zap, CheckCircle, Activity } from 'lucide-react';

interface RamNode {
  id: string;
  label: string;
  type: 'step' | 'decision' | 'query' | 'result';
  visited: boolean;
  connections: string[];
}

export default function RamGraphStatus() {
  const [nodes] = useState<RamNode[]>([]);

  return (
    <div className="h-full flex flex-col bg-gray-900/50">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-purple-400" />
            <h3 className="font-semibold text-white">RAM Graph</h3>
            <span className="text-xs text-gray-500">(Working Memory)</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <GitBranch size={12} />
            {nodes.length} nodes
          </span>
          <span className="flex items-center gap-1">
            <Zap size={12} />
            0 steps
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle size={12} className="text-green-400" />
            0 visited
          </span>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Activity size={48} className="text-gray-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">RAM Graph Inactive</h3>
        <p className="text-sm text-gray-500 max-w-sm mb-4">
          The RAM graph activates when I'm working through a problem. It tracks every step I take and detects loops in reasoning.
        </p>
        <div className="grid grid-cols-3 gap-4 text-center mt-4">
          <div className="p-3 bg-gray-800 rounded-lg">
            <p className="text-lg font-bold text-purple-400">0</p>
            <p className="text-xs text-gray-500">Steps</p>
          </div>
          <div className="p-3 bg-gray-800 rounded-lg">
            <p className="text-lg font-bold text-green-400">0</p>
            <p className="text-xs text-gray-500">Visited</p>
          </div>
          <div className="p-3 bg-gray-800 rounded-lg">
            <p className="text-lg font-bold text-yellow-400">0</p>
            <p className="text-xs text-gray-500">Loops</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-6">
          Start a conversation to see the RAM graph in action
        </p>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/30">
        <p className="text-xs text-gray-500 text-center">
          Loop detection • Step tracking • Alternate route finding
        </p>
      </div>
    </div>
  );
}
