// Needle Integration - Handles automatic refresh and task continuation
// Monitors task progress and triggers Needle when AI needs to resume

import { taskQueue, type Task } from './taskQueue';
import { progressTracker, type NeedleRefreshRequest } from './progressTracker';

export interface NeedleConfig {
  enabled: boolean;
  refreshTimeoutMs: number;
  maxRefreshAttempts: number;
  autoRefresh: boolean;
}

export interface NeedleStatus {
  active: boolean;
  lastRefresh: Date | null;
  refreshCount: number;
  currentTaskId: string | null;
  config: NeedleConfig;
}

// Needle Integration Manager
class NeedleIntegration {
  private config: NeedleConfig = {
    enabled: true,
    refreshTimeoutMs: 30000, // 30 seconds
    maxRefreshAttempts: 10,
    autoRefresh: true,
  };

  private refreshCounts: Map<string, number> = new Map();
  private lastRefreshTimes: Map<string, Date> = new Map();
  private monitoringInterval: ReturnType<typeof setInterval> | null = null;
  private configKey = 'openai_needle_config';
  private statusKey = 'openai_needle_status';

  constructor() {
    this.loadConfig();
  }

  // Load config from localStorage
  private loadConfig() {
    try {
      const stored = localStorage.getItem(this.configKey);
      if (stored) {
        this.config = { ...this.config, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load Needle config:', e);
    }
  }

  // Save config to localStorage
  private saveConfig() {
    try {
      localStorage.setItem(this.configKey, JSON.stringify(this.config));
    } catch (e) {
      console.error('Failed to save Needle config:', e);
    }
  }

  // Update config
  updateConfig(newConfig: Partial<NeedleConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  // Get current config
  getConfig(): NeedleConfig {
    return { ...this.config };
  }

  // Start monitoring tasks for refresh needs
  startMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      this.checkAndRefresh();
    }, 5000); // Check every 5 seconds
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  // Check all running tasks and refresh if needed
  private checkAndRefresh() {
    if (!this.config.enabled || !this.config.autoRefresh) {
      return;
    }

    const currentTask = taskQueue.getCurrentTask();
    if (!currentTask || currentTask.status !== 'running') {
      return;
    }

    // Check if task needs refresh
    const needsRefresh = progressTracker.needsRefresh(
      currentTask.id,
      this.config.refreshTimeoutMs
    );

    if (needsRefresh) {
      this.requestRefresh(currentTask, 'timeout');
    }
  }

  // Request Needle refresh for a task
  requestRefresh(task: Task, reason: NeedleRefreshRequest['reason']): boolean {
    // Check if we've exceeded max refresh attempts
    const refreshCount = this.refreshCounts.get(task.id) || 0;
    if (refreshCount >= this.config.maxRefreshAttempts) {
      console.warn(`Max refresh attempts reached for task ${task.id}`);
      return false;
    }

    // Generate context summary
    const context = progressTracker.generateContextSummary(task.id);
    if (!context) {
      console.warn(`No progress state found for task ${task.id}`);
      return false;
    }

    // Create refresh request
    const request = progressTracker.requestNeedleRefresh(task.id, reason);
    if (!request) {
      return false;
    }

    // Update refresh tracking
    this.refreshCounts.set(task.id, refreshCount + 1);
    this.lastRefreshTimes.set(task.id, new Date());

    // Save status
    this.saveStatus();

    // Trigger Needle refresh
    this.triggerNeedleRefresh(request);

    return true;
  }

  // Trigger the actual Needle refresh
  private triggerNeedleRefresh(request: NeedleRefreshRequest) {
    // This would integrate with the actual Needle API
    // For now, we'll simulate it by logging and storing the request
    
    console.log('Needle Refresh Request:', request);

    // Store the refresh request for the Needle tool to pick up
    const refreshKey = 'openai_needle_pending_refresh';
    localStorage.setItem(refreshKey, JSON.stringify({
      ...request,
      timestamp: new Date().toISOString(),
    }));

    // In a real implementation, this would:
    // 1. Call the Needle API to refresh the AI context
    // 2. Pass the context summary to continue from where it left off
    // 3. Resume task execution
  }

  // Manual refresh request
  manualRefresh(taskId: string): boolean {
    const task = taskQueue.getAllTasks().find(t => t.id === taskId);
    if (!task) {
      return false;
    }

    return this.requestRefresh(task, 'manual');
  }

  // Get Needle status
  getStatus(): NeedleStatus {
    const currentTask = taskQueue.getCurrentTask();
    const totalRefreshes = Array.from(this.refreshCounts.values()).reduce((a, b) => a + b, 0);
    
    let lastRefresh: Date | null = null;
    const refreshTimes = Array.from(this.lastRefreshTimes.values());
    if (refreshTimes.length > 0) {
      lastRefresh = new Date(Math.max(...refreshTimes.map(t => t.getTime())));
    }

    return {
      active: this.monitoringInterval !== null,
      lastRefresh,
      refreshCount: totalRefreshes,
      currentTaskId: currentTask?.id || null,
      config: { ...this.config },
    };
  }

  // Get refresh count for a task
  getRefreshCount(taskId: string): number {
    return this.refreshCounts.get(taskId) || 0;
  }

  // Reset refresh count for a task
  resetRefreshCount(taskId: string) {
    this.refreshCounts.delete(taskId);
    this.lastRefreshTimes.delete(taskId);
    this.saveStatus();
  }

  // Save status to localStorage
  private saveStatus() {
    try {
      const status = this.getStatus();
      localStorage.setItem(this.statusKey, JSON.stringify({
        ...status,
        lastRefresh: status.lastRefresh?.toISOString() || null,
      }));
    } catch (e) {
      console.error('Failed to save Needle status:', e);
    }
  }

  // Cleanup when task is completed
  onTaskComplete(taskId: string) {
    this.resetRefreshCount(taskId);
    progressTracker.clearRefreshRequest();
  }

  // Cleanup when task is deleted
  onTaskDelete(taskId: string) {
    this.resetRefreshCount(taskId);
  }
}

// Singleton instance
export const needleIntegration = new NeedleIntegration();

// Helper functions
export function startNeedleMonitoring() {
  needleIntegration.startMonitoring();
}

export function stopNeedleMonitoring() {
  needleIntegration.stopMonitoring();
}

export function updateNeedleConfig(config: Partial<NeedleConfig>) {
  needleIntegration.updateConfig(config);
}

export function getNeedleStatus(): NeedleStatus {
  return needleIntegration.getStatus();
}

export function manualNeedleRefresh(taskId: string): boolean {
  return needleIntegration.manualRefresh(taskId);
}

export function getNeedleRefreshCount(taskId: string): number {
  return needleIntegration.getRefreshCount(taskId);
}
