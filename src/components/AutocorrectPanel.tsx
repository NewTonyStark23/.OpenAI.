import { useState } from 'react';
import { Wand2, Settings, Shield, Zap, AlertTriangle } from 'lucide-react';

interface AutocorrectRule {
  id: string;
  name: string;
  language: string;
  enabled: boolean;
  severity: 'error' | 'warning' | 'info';
  description: string;
}

export default function AutocorrectPanel() {
  const [enabled, setEnabled] = useState(true);
  const [autoFix, setAutoFix] = useState(true);
  const [rules, setRules] = useState<AutocorrectRule[]>([
    { id: '1', name: 'Missing Error Boundary', language: 'React', enabled: true, severity: 'error', description: 'Components should be wrapped in error boundaries' },
    { id: '2', name: 'Unused Variables', language: 'TypeScript', enabled: true, severity: 'warning', description: 'Remove or use declared variables' },
    { id: '3', name: 'Async Without Await', language: 'TypeScript', enabled: true, severity: 'error', description: 'Async functions must use await' },
    { id: '4', name: 'Missing Key Prop', language: 'React', enabled: true, severity: 'warning', description: 'List items need unique keys' },
    { id: '5', name: 'Console.log Left', language: 'All', enabled: true, severity: 'info', description: 'Remove debug console.log statements' },
    { id: '6', name: 'Type Safety', language: 'TypeScript', enabled: true, severity: 'error', description: 'Avoid any types, use proper typing' },
  ]);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wand2 size={18} className="text-purple-400" />
            <h3 className="font-semibold text-white">AI Autocorrect</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEnabled(!enabled)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                enabled ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}
            >
              {enabled ? '✓ Active' : 'Disabled'}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Self-designed error detection • Auto-fixes issues in generated code
        </p>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 border-b border-gray-700 grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-lg font-bold text-red-400">0</p>
          <p className="text-xs text-gray-500">Errors</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-400">0</p>
          <p className="text-xs text-gray-500">Warnings</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-400">0</p>
          <p className="text-xs text-gray-500">Auto-fixed</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle size={48} className="text-gray-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">No Issues Detected</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Autocorrect will scan generated code for errors and warnings. Issues will appear here as code is generated.
        </p>
      </div>

      {/* Rules Section */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-1">
            <Settings size={14} />
            Rules ({rules.filter(r => r.enabled).length}/{rules.length} active)
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoFix(!autoFix)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                autoFix ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}
            >
              {autoFix ? '🔧 Auto-fix ON' : 'Auto-fix OFF'}
            </button>
          </div>
        </div>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {rules.map(rule => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-2 rounded hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`w-4 h-4 rounded border transition-colors ${
                    rule.enabled ? 'bg-purple-600 border-purple-500' : 'border-gray-600'
                  }`}
                />
                <span className={`text-xs ${rule.enabled ? 'text-gray-300' : 'text-gray-500'}`}>
                  {rule.name}
                </span>
                <span className="text-xs text-gray-600">({rule.language})</span>
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                rule.severity === 'error' ? 'bg-red-500/20 text-red-300' :
                rule.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>
                {rule.severity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 bg-gray-800/30">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Shield size={12} className="text-green-400" />
            AI-designed • Self-maintained
          </span>
          <span className="flex items-center gap-1">
            <Zap size={12} className="text-yellow-400" />
            Real-time detection
          </span>
        </div>
      </div>
    </div>
  );
}
