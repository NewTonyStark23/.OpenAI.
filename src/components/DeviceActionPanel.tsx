import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { pendingActions, type DeviceAction } from '../utils/safetySystem';

interface DeviceActionPanelProps {
  onConfirm: (actionId: string) => void;
  onCancel: (actionId: string) => void;
}

export default function DeviceActionPanel({ onConfirm, onCancel }: DeviceActionPanelProps) {
  const [actions, setActions] = useState<DeviceAction[]>([]);

  useEffect(() => {
    // Load pending actions
    setActions(pendingActions.getAll());
    
    // Poll for updates
    const interval = setInterval(() => {
      setActions(pendingActions.getAll());
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  if (actions.length === 0) {
    return null;
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle size={16} className="text-green-400" />;
      case 'medium': return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'high': return <AlertTriangle size={16} className="text-red-400" />;
      default: return <Shield size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="border-t border-[#2a2a2a] bg-[#1a1a1a] p-3">
      <div className="max-w-3xl mx-auto space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={14} className="text-purple-400" />
          <span className="text-xs font-semibold text-gray-300">
            Pending Device Actions ({actions.length})
          </span>
        </div>

        <AnimatePresence>
          {actions.map(action => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`border rounded-lg p-3 ${getRiskColor(action.riskLevel)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getRiskIcon(action.riskLevel)}
                    <span className="text-sm font-medium text-white">
                      {action.action}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-black/20">
                      {action.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-2">
                    <strong>Device:</strong> {action.device}
                  </div>

                  {action.params && Object.keys(action.params).length > 0 && (
                    <div className="text-xs text-gray-500 mb-2">
                      <strong>Parameters:</strong> {JSON.stringify(action.params)}
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    <strong>Time:</strong> {action.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onConfirm(action.id)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                  >
                    ✓ Confirm
                  </button>
                  <button
                    onClick={() => onCancel(action.id)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
                  >
                    ✗ Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
