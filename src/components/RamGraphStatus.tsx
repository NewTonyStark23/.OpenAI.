import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, GitBranch, AlertTriangle, CheckCircle, Zap, Activity } from 'lucide-react';

interface RamNode {
  id: string;
  label: string;
  type: 'step' | 'decision' | 'query' | 'result';
  visited: boolean;
  connections: string[];
}

interface LoopAlert {
  detected: boolean;
  steps: string[];
  resolution: string;
}

export default function RamGraphStatus() {
  const [nodes, setNodes] = useState<RamNode[]>([
    { id: '1', label: 'Analyze requirements', type: 'step', visited: true, connections: ['2'] },
    { id: '2', label: 'Check dependencies', type: 'step', visited: true, connections: ['3', '4'] },
    { id: '3', label: 'Map component tree', type: 'decision', visited: true, connections: ['5'] },
    { id: '4', label: 'Query Mind section', type: 'query', visited: true, connections: ['5'] },
    { id: '5', label: 'Generate solution', type: 'result', visited: false, connections: [] },
  ]);
  const [loopAlert, setLoopAlert] = useState<LoopAlert | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string>('5');
  const [stepCount, setStepCount] = useState(4);
  const [isProcessing, setIsProcessing] = useState(true);

  // Simulate RAM graph activity
  useEffect(() => {
    const interval = setInterval(() => {
      setStepCount(prev => prev + 1);
      // Randomly activate nodes
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      setActiveNodeId(randomNode.id);
    }, 2000);

    return () => clearInterval(interval);
  }, [nodes]);

  // Simulate loop detection occasionally
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoopAlert({
        detected: true,
        steps: ['Analyze requirements', 'Check dependencies', 'Analyze requirements'],
        resolution: 'Alternate route found: Skip to component mapping',
      });
      setTimeout(() => setLoopAlert(null), 5000);
    }, 8000);

    return () => clearTimeout(timeout);
  }, []);

  const getNodeColor = (node: RamNode) => {
    if (node.id === activeNodeId) return 'border-purple-500 bg-purple-500/20';
    if (node.visited) return 'border-green-500/50 bg-green-500/10';
    return 'border-gray-600 bg-gray-800';
  };

  const getNodeIcon = (type: RamNode['type']) => {
    switch (type) {
      case 'step': return '📍';
      case 'decision': return '🔀';
      case 'query': return '🔍';
      case 'result': return '✅';
    }
  };

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
          <div className="flex items-center gap-2">
            {isProcessing && (
              <div className="flex items-center gap-1 text-xs text-purple-400">
                <Activity size={12} className="animate-pulse" />
                <span>Processing</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <GitBranch size={12} />
            {nodes.length} nodes
          </span>
          <span className="flex items-center gap-1">
            <Zap size={12} />
            {stepCount} steps taken
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle size={12} className="text-green-400" />
            {nodes.filter(n => n.visited).length} visited
          </span>
        </div>
      </div>

      {/* Loop Alert */}
      {loopAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="m-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-yellow-400" />
            <span className="text-sm font-medium text-yellow-300">Loop Detected</span>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <p>Path: {loopAlert.steps.join(' → ')}</p>
            <p className="text-green-400">✓ {loopAlert.resolution}</p>
          </div>
        </motion.div>
      )}

      {/* Graph Visualization */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          {nodes.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border transition-all ${getNodeColor(node)}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{getNodeIcon(node.type)}</span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    node.id === activeNodeId ? 'text-purple-200' :
                    node.visited ? 'text-green-200' : 'text-gray-400'
                  }`}>
                    {node.label}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">Node #{node.id}</span>
                    {node.visited && (
                      <span className="text-xs text-green-400 flex items-center gap-0.5">
                        <CheckCircle size={10} />
                        visited
                      </span>
                    )}
                    {node.id === activeNodeId && (
                      <span className="text-xs text-purple-400 flex items-center gap-0.5">
                        <Zap size={10} />
                        active
                      </span>
                    )}
                  </div>
                </div>
                {node.connections.length > 0 && (
                  <div className="text-xs text-gray-500">
                    → {node.connections.length}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection Lines (simplified) */}
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Graph Connections:</p>
          <div className="flex flex-wrap gap-2">
            {nodes.filter(n => n.connections.length > 0).map(node => (
              node.connections.map(connId => (
                <span key={`${node.id}-${connId}`} className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-400">
                  #{node.id} → #{connId}
                </span>
              ))
            ))}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/30">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-purple-400">{stepCount}</p>
            <p className="text-xs text-gray-500">Steps</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-400">{nodes.filter(n => n.visited).length}</p>
            <p className="text-xs text-gray-500">Visited</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-400">{loopAlert ? '1' : '0'}</p>
            <p className="text-xs text-gray-500">Loops</p>
          </div>
        </div>
      </div>
    </div>
  );
}
