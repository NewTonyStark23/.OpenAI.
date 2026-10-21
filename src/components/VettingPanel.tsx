import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Shield, Sword, Target, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

interface VettingPanelProps {
  onClose: () => void;
}

type Verdict = 'diamond' | 'refined' | 'weak' | 'killed' | null;

interface VettingStep {
  id: string;
  agent: string;
  icon: typeof Shield;
  color: string;
  status: 'pending' | 'active' | 'done';
  content: string;
}

const initialSteps: VettingStep[] = [
  {
    id: '1',
    agent: 'Steelman',
    icon: Shield,
    color: 'text-blue-400',
    status: 'pending',
    content: 'Making the strongest case FOR the proposed change...',
  },
  {
    id: '2',
    agent: 'Skeptic',
    icon: AlertTriangle,
    color: 'text-yellow-400',
    status: 'pending',
    content: 'Looking for logic flaws, edge cases, assumptions...',
  },
  {
    id: '3',
    agent: 'Pragmatist',
    icon: Target,
    color: 'text-green-400',
    status: 'pending',
    content: 'Reality check on resources, timeline, feasibility...',
  },
  {
    id: '4',
    agent: 'Contrarian',
    icon: Sword,
    color: 'text-red-400',
    status: 'pending',
    content: 'Arguing the exact opposite position...',
  },
  {
    id: '5',
    agent: 'Friendly Fire',
    icon: Sword,
    color: 'text-orange-400',
    status: 'pending',
    content: 'Agents critique each other\'s critiques...',
  },
  {
    id: '6',
    agent: 'Synthesizer',
    icon: Sparkles,
    color: 'text-purple-400',
    status: 'pending',
    content: 'Weighing all inputs and rendering judgment...',
  },
];

const verdictExamples: Record<string, { verdict: Verdict; title: string; content: string }> = {
  diamond: {
    verdict: 'diamond',
    title: '💎 DIAMOND',
    content: 'The change survived all attacks. Ship it.',
  },
  refined: {
    verdict: 'refined',
    title: '🔧 REFINED',
    content: 'Core is valid, but specific changes needed:\n- Add error boundary around new component\n- Handle edge case for empty state\n- Optimize re-renders with useMemo',
  },
  weak: {
    verdict: 'weak',
    title: '⚠️ WEAK',
    content: 'Risky but might work with extreme caution.\n- Multiple edge cases identified\n- Performance concerns on low-end devices\n- Consider alternative approach',
  },
  killed: {
    verdict: 'killed',
    title: '🪦 KILLED',
    content: 'Fatal flaw found by all attackers.\n- All three attackers identified the same issue\n- Architecture doesn\'t support this approach\n- Recommend pivoting to alternative solution',
  },
};

export default function VettingPanel({ onClose }: VettingPanelProps) {
  const [steps, setSteps] = useState<VettingStep[]>(initialSteps);
  const [isRunning, setIsRunning] = useState(false);
  const [verdict, setVerdict] = useState<Verdict>(null);

  const startVetting = () => {
    setIsRunning(true);
    setVerdict(null);
    setSteps(initialSteps.map(s => ({ ...s, status: 'pending' })));

    // Simulate vetting process
    let delay = 0;
    initialSteps.forEach((step, index) => {
      delay += 1200;
      setTimeout(() => {
        setSteps(prev => prev.map(s =>
          s.id === step.id ? { ...s, status: 'active' } : s
        ));
      }, delay);

      delay += 1500;
      setTimeout(() => {
        setSteps(prev => prev.map(s =>
          s.id === step.id ? { ...s, status: 'done' } : s
        ));

        // After all steps done, show verdict
        if (index === initialSteps.length - 1) {
          setTimeout(() => {
            const verdicts: Verdict[] = ['diamond', 'refined', 'refined', 'diamond'];
            const randomVerdict = verdicts[Math.floor(Math.random() * verdicts.length)];
            setVerdict(randomVerdict);
            setIsRunning(false);
          }, 800);
        }
      }, delay);
    });
  };

  const currentVerdict = verdict ? verdictExamples[verdict] : null;

  return (
    <div className="h-full flex flex-col bg-gray-800/50">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h3 className="font-semibold text-white">CRUCIBLE Vetting</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded transition-colors">
          <X size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {steps.map(step => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.id}
              animate={{
                opacity: step.status === 'pending' ? 0.5 : 1,
                scale: step.status === 'active' ? 1.02 : 1,
              }}
              className={`p-3 rounded-lg border transition-all ${
                step.status === 'active'
                  ? 'border-purple-500 bg-purple-500/10'
                  : step.status === 'done'
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-gray-700 bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className={step.color} />
                <span className={`text-sm font-medium ${step.color}`}>{step.agent}</span>
                {step.status === 'active' && (
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                )}
                {step.status === 'done' && (
                  <CheckCircle size={14} className="text-green-400 ml-auto" />
                )}
              </div>
              <p className="text-xs text-gray-400">{step.content}</p>
            </motion.div>
          );
        })}

        {/* Verdict */}
        {currentVerdict && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg border ${
              verdict === 'diamond' ? 'border-green-500 bg-green-500/10' :
              verdict === 'refined' ? 'border-blue-500 bg-blue-500/10' :
              verdict === 'weak' ? 'border-yellow-500 bg-yellow-500/10' :
              'border-red-500 bg-red-500/10'
            }`}
          >
            <h4 className="font-bold text-lg mb-2">{currentVerdict.title}</h4>
            <p className="text-sm text-gray-300 whitespace-pre-line">{currentVerdict.content}</p>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={startVetting}
          disabled={isRunning}
          className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium text-sm transition-colors"
        >
          {isRunning ? '🔥 Vetting in progress...' : '🔥 Run CRUCIBLE Vetting'}
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Threshold: Major changes only • Small edits skip vetting
        </p>
      </div>
    </div>
  );
}
