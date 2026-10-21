import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Loader2, Package, Code, TestTube, Rocket, Download, Shield, AlertTriangle } from 'lucide-react';

type PipelineStage = 'design' | 'generate' | 'test' | 'build' | 'deliver';

interface StageInfo {
  id: PipelineStage;
  name: string;
  icon: typeof Code;
  color: string;
  steps: string[];
}

const stages: StageInfo[] = [
  {
    id: 'design',
    name: 'Design',
    icon: Code,
    color: 'text-blue-400',
    steps: [
      'Analyzing requirements...',
      'Generating wireframes...',
      'Creating component hierarchy...',
      'Applying design system...',
    ],
  },
  {
    id: 'generate',
    name: 'Generate',
    icon: Code,
    color: 'text-green-400',
    steps: [
      'Creating project structure...',
      'Generating screens (12 files)...',
      'Building components...',
      'Integrating backend...',
      'Adding navigation...',
    ],
  },
  {
    id: 'test',
    name: 'Test',
    icon: TestTube,
    color: 'text-yellow-400',
    steps: [
      'Running in emulator...',
      'Checking for errors...',
      'Performance analysis...',
      'Accessibility check...',
    ],
  },
  {
    id: 'build',
    name: 'Build',
    icon: Package,
    color: 'text-purple-400',
    steps: [
      'Compiling source code...',
      'Bundling assets...',
      'Signing APK...',
      'Optimizing size...',
    ],
  },
  {
    id: 'deliver',
    name: 'Deliver',
    icon: Rocket,
    color: 'text-pink-400',
    steps: [
      'Generating download link...',
      'Creating source archive...',
      'Preparing documentation...',
    ],
  },
];

export default function BuildPipeline() {
  const [currentStage, setCurrentStage] = useState<PipelineStage | null>(null);
  const [completedStages, setCompletedStages] = useState<PipelineStage[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [publishMode, setPublishMode] = useState<'personal' | 'google-play'>('personal');

  const startBuild = () => {
    setIsBuilding(true);
    setCurrentStage('design');
    setCompletedStages([]);
    setCurrentStep(0);

    let stageIndex = 0;
    let stepIndex = 0;

    const advance = () => {
      if (stageIndex >= stages.length) {
        setIsBuilding(false);
        return;
      }

      const stage = stages[stageIndex];
      setCurrentStage(stage.id);
      setCurrentStep(stepIndex);

      stepIndex++;
      if (stepIndex >= stage.steps.length) {
        setCompletedStages(prev => [...prev, stage.id]);
        stageIndex++;
        stepIndex = 0;
      }

      setTimeout(advance, 800 + Math.random() * 400);
    };

    setTimeout(advance, 500);
  };

  const getStageStatus = (stageId: PipelineStage) => {
    if (completedStages.includes(stageId)) return 'done';
    if (currentStage === stageId) return 'active';
    return 'pending';
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Build Pipeline</h2>
            <p className="text-gray-400 text-sm mt-1">
              From idea to installable app in 5 stages
            </p>
          </div>
          <button
            onClick={startBuild}
            disabled={isBuilding}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            {isBuilding ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Building...
              </>
            ) : (
              <>
                <Rocket size={18} />
                Start Build
              </>
            )}
          </button>
        </div>

        {/* Publishing Mode Toggle */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-sm text-gray-400">Publish Mode:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPublishMode('personal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                publishMode === 'personal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              👤 Personal
            </button>
            <button
              onClick={() => setPublishMode('google-play')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                publishMode === 'google-play'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              🏪 Google Play
            </button>
          </div>
          {publishMode === 'google-play' && (
            <div className="flex items-center gap-1 text-xs text-green-400">
              <Shield size={12} />
              <span>Compliance checks enabled</span>
            </div>
          )}
        </div>

        {/* Pipeline Stages */}
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const status = getStageStatus(stage.id);
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-800 rounded-xl border transition-all ${
                  status === 'active'
                    ? 'border-purple-500 shadow-lg shadow-purple-500/10'
                    : status === 'done'
                    ? 'border-green-500/30'
                    : 'border-gray-700'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      status === 'done' ? 'bg-green-500/20' :
                      status === 'active' ? 'bg-purple-500/20' :
                      'bg-gray-700'
                    }`}>
                      {status === 'done' ? (
                        <CheckCircle size={20} className="text-green-400" />
                      ) : status === 'active' ? (
                        <Loader2 size={20} className={`${stage.color} animate-spin`} />
                      ) : (
                        <Circle size={20} className="text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        status === 'done' ? 'text-green-300' :
                        status === 'active' ? 'text-white' :
                        'text-gray-400'
                      }`}>
                        {index + 1}. {stage.name}
                      </h3>
                    </div>
                    {status === 'done' && (
                      <span className="text-xs text-green-400 px-2 py-1 bg-green-500/10 rounded-full">
                        ✓ Complete
                      </span>
                    )}
                    {status === 'active' && (
                      <span className="text-xs text-purple-400 px-2 py-1 bg-purple-500/10 rounded-full animate-pulse">
                        ● Active
                      </span>
                    )}
                  </div>

                  {/* Steps */}
                  <div className="space-y-1 ml-13">
                    {stage.steps.map((step, stepIdx) => {
                      const isActive = status === 'active' && stepIdx === currentStep;
                      const isDone = status === 'done' || (status === 'active' && stepIdx < currentStep);
                      return (
                        <div
                          key={stepIdx}
                          className={`flex items-center gap-2 text-xs ${
                            isDone ? 'text-green-400' :
                            isActive ? 'text-purple-300' :
                            'text-gray-500'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle size={12} />
                          ) : isActive ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Circle size={12} />
                          )}
                          <span>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Completion Card */}
        <AnimatePresence>
          {completedStages.length === stages.length && !isBuilding && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-gradient-to-r from-green-500/10 to-purple-500/10 border border-green-500/30 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Rocket size={24} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Build Complete! 🎉</h3>
                  <p className="text-sm text-gray-400">Your app is ready to install</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
                  <Download size={16} />
                  Download APK (12.4 MB)
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                  <Package size={16} />
                  Export Source Code
                </button>
              </div>
              {publishMode === 'google-play' && (
                <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 text-sm text-green-300">
                    <Shield size={14} />
                    <span className="font-medium">Google Play Compliance: ✓ Passed</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-gray-400">
                    <li>✓ Privacy policy generated</li>
                    <li>✓ Data collection disclosed</li>
                    <li>✓ Content rating: Everyone</li>
                    <li>✓ Release-signed APK</li>
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
