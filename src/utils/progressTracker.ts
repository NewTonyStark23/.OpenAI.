// Progress Tracker - Tracks task execution progress and enables resumption
// Integrates with Needle for automatic refresh and continuation

export interface ProgressState {
  taskId: string;
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
  failedSteps: number;
  skippedSteps: number;
  lastUpdated: Date;
  context: string; // Summary of what's been done
  nextAction: string; // What needs to happen next
  error?: string;
}

export interface NeedleRefreshRequest {
  taskId: string;
  reason: 'timeout' | 'context_limit' | 'error' | 'manual';
  lastStep: number;
  context: string;
  nextAction: string;
}

// Progress Tracker Manager
class ProgressTracker {
  private states: Map<string, ProgressState> = new Map();
  private storageKey = 'openai_progress_states';
  private refreshKey = 'openai_needle_refresh';

  constructor() {
    this.load();
  }

  // Load from localStorage
  private load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        data.forEach((s: any) => {
          this.states.set(s.taskId, {
            ...s,
            lastUpdated: new Date(s.lastUpdated),
          });
        });
      }
    } catch (e) {
      console.error('Failed to load progress states:', e);
    }
  }

  // Save to localStorage
  private save() {
    try {
      const data = Array.from(this.states.values());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save progress states:', e);
    }
  }

  // Update progress state
  updateProgress(
    taskId: string,
    currentStep: number,
    totalSteps: number,
    completedSteps: number,
    failedSteps: number,
    skippedSteps: number,
    context: string,
    nextAction: string,
    error?: string
  ): ProgressState {
    const state: ProgressState = {
      taskId,
      currentStep,
      totalSteps,
      completedSteps,
      failedSteps,
      skippedSteps,
      lastUpdated: new Date(),
      context,
      nextAction,
      error,
    };

    this.states.set(taskId, state);
    this.save();
    return state;
  }

  // Get progress state
  getProgress(taskId: string): ProgressState | null {
    return this.states.get(taskId) || null;
  }

  // Get all progress states
  getAllProgress(): ProgressState[] {
    return Array.from(this.states.values());
  }

  // Generate context summary for Needle refresh
  generateContextSummary(taskId: string): string {
    const state = this.states.get(taskId);
    if (!state) return '';

    const progress = Math.round((state.completedSteps / state.totalSteps) * 100);
    
    let summary = `Task Progress: ${progress}% (${state.completedSteps}/${state.totalSteps} steps)\n\n`;
    summary += `Completed Steps: ${state.completedSteps}\n`;
    summary += `Failed Steps: ${state.failedSteps}\n`;
    summary += `Skipped Steps: ${state.skippedSteps}\n`;
    summary += `Current Step: ${state.currentStep}\n\n`;
    summary += `Context:\n${state.context}\n\n`;
    summary += `Next Action:\n${state.nextAction}`;

    if (state.error) {
      summary += `\n\nError:\n${state.error}`;
    }

    return summary;
  }

  // Request Needle refresh
  requestNeedleRefresh(taskId: string, reason: NeedleRefreshRequest['reason']): NeedleRefreshRequest | null {
    const state = this.states.get(taskId);
    if (!state) return null;

    const request: NeedleRefreshRequest = {
      taskId,
      reason,
      lastStep: state.currentStep,
      context: state.context,
      nextAction: state.nextAction,
    };

    // Save refresh request
    localStorage.setItem(this.refreshKey, JSON.stringify(request));

    return request;
  }

  // Get pending refresh request
  getPendingRefresh(): NeedleRefreshRequest | null {
    try {
      const stored = localStorage.getItem(this.refreshKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load refresh request:', e);
    }
    return null;
  }

  // Clear refresh request (after Needle has processed it)
  clearRefreshRequest() {
    localStorage.removeItem(this.refreshKey);
  }

  // Check if task needs refresh
  needsRefresh(taskId: string, timeoutMs: number = 30000): boolean {
    const state = this.states.get(taskId);
    if (!state) return false;

    const now = Date.now();
    const lastUpdate = state.lastUpdated.getTime();
    
    return (now - lastUpdate) > timeoutMs;
  }

  // Delete progress state
  deleteProgress(taskId: string) {
    this.states.delete(taskId);
    this.save();
  }

  // Clear all progress states
  clearAll() {
    this.states.clear();
    this.save();
  }

  // Get progress percentage
  getProgressPercentage(taskId: string): number {
    const state = this.states.get(taskId);
    if (!state || state.totalSteps === 0) return 0;
    return Math.round((state.completedSteps / state.totalSteps) * 100);
  }

  // Get estimated time remaining (simple heuristic)
  getEstimatedTimeRemaining(taskId: string, averageStepTimeMs: number = 5000): number {
    const state = this.states.get(taskId);
    if (!state) return 0;

    const remainingSteps = state.totalSteps - state.completedSteps - state.failedSteps - state.skippedSteps;
    return remainingSteps * averageStepTimeMs;
  }
}

// Singleton instance
export const progressTracker = new ProgressTracker();

// Helper functions
export function updateTaskProgress(
  taskId: string,
  currentStep: number,
  totalSteps: number,
  completedSteps: number,
  failedSteps: number,
  skippedSteps: number,
  context: string,
  nextAction: string,
  error?: string
): ProgressState {
  return progressTracker.updateProgress(
    taskId,
    currentStep,
    totalSteps,
    completedSteps,
    failedSteps,
    skippedSteps,
    context,
    nextAction,
    error
  );
}

export function getTaskProgress(taskId: string): ProgressState | null {
  return progressTracker.getProgress(taskId);
}

export function requestRefresh(taskId: string, reason: NeedleRefreshRequest['reason']): NeedleRefreshRequest | null {
  return progressTracker.requestNeedleRefresh(taskId, reason);
}

export function checkAndRefresh(taskId: string, timeoutMs: number = 30000): NeedleRefreshRequest | null {
  if (progressTracker.needsRefresh(taskId, timeoutMs)) {
    return progressTracker.requestNeedleRefresh(taskId, 'timeout');
  }
  return null;
}
