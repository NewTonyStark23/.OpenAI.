import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, AlertTriangle, CheckCircle, Settings, Code, Zap, Shield } from 'lucide-react';

interface AutocorrectRule {
  id: string;
  name: string;
  language: string;
  enabled: boolean;
  severity: 'error' | 'warning' | 'info';
  description: string;
}

interface DetectedIssue {
  id: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  line: number;
  file: string;
  suggestion: string;
  autoFixed: boolean;
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

  const [detectedIssues] = useState<DetectedIssue[]>([
    {
      id: '1',
      rule: 'Missing Error Boundary',
      message: 'UserProfile component lacks error boundary',
      severity: 'error',
      line: 42,
      file: 'src/components/UserProfile.tsx',
      suggestion: 'Wrap with <ErrorBoundary> component',
      autoFixed: true,
    },
    {
      id: '2',
      rule: 'Missing Key Prop',
      message: 'List item in map() missing key',
      severity: 'warning',
      line: 87,
      file: 'src/components/TodoList.tsx',
      suggestion: 'Add key={item.id} to list element',
      autoFixed: true,
    },
    {
      id: '3',
      rule: 'Console.log Left',
      message: 'Debug statement found',
      severity: 'info',
      line: 15,
      file: 'src/utils/api.ts',
      suggestion: 'Remove console.log("debug:", data)',
      autoFixed: false,
    },
  ]);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'info': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
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
          <p className="text-lg font-bold text-red-400">
            {detectedIssues.filter(i => i.severity === 'error').length}
          </p>
          <p className="text-xs text-gray-500">Errors</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-400">
            {detectedIssues.filter(i => i.severity === 'warning').length}
          </p>
          <p className="text-xs text-gray-500">Warnings</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-400">
            {detectedIssues.filter(i => i.autoFixed).length}
          </p>
          <p className="text-xs text-gray-500">Auto-fixed</p>
        </div>
      </div>

      {/* Detected Issues */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Detected Issues</h4>
        {detectedIssues.map(issue => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {issue.severity === 'error' ? <AlertTriangle size={12} /> :
                   issue.severity === 'warning' ? <AlertTriangle size={12} /> :
                   <CheckCircle size={12} />}
                  <span className="text-xs font-medium">{issue.rule}</span>
                </div>
                <p className="text-sm">{issue.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {issue.file}:{issue.line}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  💡 {issue.suggestion}
                </p>
              </div>
              {issue.autoFixed && (
                <span className="px-2 py-0.5 bg-green-500/20 rounded text-xs text-green-300">
                  Fixed ✓
                </span>
              )}
            </div>
          </motion.div>
        ))}
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
