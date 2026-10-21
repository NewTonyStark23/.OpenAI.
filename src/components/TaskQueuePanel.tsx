import { useState, useEffect } from 'react';
import { ListTodo, Play, Pause, Trash2, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { taskQueue, type Task, type TaskStep } from '../utils/taskQueue';
import { progressTracker } from '../utils/progressTracker';

interface TaskQueuePanelProps {
  onInterrupt: (prompt: string) => void;
}

export default function TaskQueuePanel({ onInterrupt }: TaskQueuePanelProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [queueCount, setQueueCount] = useState(0);
  const [interruptPrompt, setInterruptPrompt] = useState('');

  useEffect(() => {
    loadTasks();
    
    // Refresh every 2 seconds
    const interval = setInterval(loadTasks, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadTasks = () => {
    const allTasks = taskQueue.getAllTasks();
    setTasks(allTasks);
    setCurrentTask(taskQueue.getCurrentTask());
    setQueueCount(taskQueue.getQueuedPrompts().length);
  };

  const handleStartTask = (taskId: string) => {
    taskQueue.resumeTask(taskId);
    loadTasks();
  };

  const handlePauseTask = (taskId: string) => {
    taskQueue.pauseCurrentTask();
    loadTasks();
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Delete this task?')) {
      taskQueue.deleteTask(taskId);
      progressTracker.deleteProgress(taskId);
      loadTasks();
    }
  };

  const handleInterrupt = () => {
    if (interruptPrompt.trim()) {
      onInterrupt(interruptPrompt);
      setInterruptPrompt('');
      loadTasks();
    }
  };

  const getTaskStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'interrupted':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStepStatusIcon = (status: TaskStep['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'in-progress':
        return <Play className="w-3 h-3 text-blue-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'skipped':
        return <Zap className="w-3 h-3 text-gray-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const getProgressPercentage = (taskId: string) => {
    return progressTracker.getProgressPercentage(taskId);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Task Queue</h2>
          {queueCount > 0 && (
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
              {queueCount} queued
            </span>
          )}
        </div>
      </div>

      {/* Interrupt Section */}
      {currentTask && (
        <div className="p-4 border-b border-[#1a1a1a] bg-red-500/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Interrupt Current Task</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={interruptPrompt}
              onChange={(e) => setInterruptPrompt(e.target.value)}
              placeholder="Urgent prompt to interrupt current task..."
              className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              onKeyPress={(e) => e.key === 'Enter' && handleInterrupt()}
            />
            <button
              onClick={handleInterrupt}
              disabled={!interruptPrompt.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded transition-colors"
            >
              Interrupt
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No tasks in queue</p>
              <p className="text-sm mt-1">Send a massive prompt to create tasks</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {tasks.map((task) => {
              const progress = getProgressPercentage(task.id);
              const isCurrent = currentTask?.id === task.id;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border ${
                    isCurrent
                      ? 'border-purple-500 bg-purple-500/5'
                      : 'border-[#1a1a1a] bg-[#0f0f0f]'
                  }`}
                >
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1">
                      {getTaskStatusIcon(task.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {task.prompt.substring(0, 80)}
                          {task.prompt.length > 80 && '...'}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>{task.steps.length} steps</span>
                          <span>•</span>
                          <span className="capitalize">{task.priority}</span>
                          <span>•</span>
                          <span className="capitalize">{task.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {task.status === 'paused' && (
                        <button
                          onClick={() => handleStartTask(task.id)}
                          className="p-1.5 hover:bg-green-500/10 rounded transition-colors"
                          title="Resume"
                        >
                          <Play className="w-4 h-4 text-green-500" />
                        </button>
                      )}
                      {task.status === 'running' && (
                        <button
                          onClick={() => handlePauseTask(task.id)}
                          className="p-1.5 hover:bg-yellow-500/10 rounded transition-colors"
                          title="Pause"
                        >
                          <Pause className="w-4 h-4 text-yellow-500" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {task.status !== 'queued' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Steps */}
                  {isCurrent && (
                    <div className="space-y-1 mt-3 pt-3 border-t border-[#1a1a1a]">
                      <p className="text-xs font-medium text-gray-400 mb-2">Steps:</p>
                      {task.steps.map((step) => (
                        <div
                          key={step.id}
                          className="flex items-start gap-2 text-xs"
                        >
                          {getStepStatusIcon(step.status)}
                          <div className="flex-1 min-w-0">
                            <p className={`truncate ${
                              step.status === 'done'
                                ? 'text-gray-500 line-through'
                                : step.status === 'in-progress'
                                ? 'text-blue-400'
                                : 'text-gray-400'
                            }`}>
                              {step.number}. {step.description}
                            </p>
                            {step.error && (
                              <p className="text-red-400 text-xs mt-0.5">{step.error}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
