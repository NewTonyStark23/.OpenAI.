// Task Queue System - Handles massive prompts by breaking them into numbered steps
// Supports queuing, progress tracking, and automatic resumption via Needle

export interface Task {
  id: string;
  prompt: string;
  steps: TaskStep[];
  currentStep: number;
  status: 'queued' | 'running' | 'paused' | 'completed' | 'interrupted';
  priority: 'normal' | 'high' | 'urgent';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export interface TaskStep {
  id: string;
  number: number;
  description: string;
  status: 'pending' | 'in-progress' | 'done' | 'skipped' | 'error';
  code?: string;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface QueuedPrompt {
  id: string;
  prompt: string;
  priority: 'normal' | 'high' | 'urgent';
  timestamp: Date;
  estimatedSteps?: number;
}

// Task Queue Manager
class TaskQueueManager {
  private tasks: Map<string, Task> = new Map();
  private queue: string[] = []; // Task IDs in order
  private currentTaskId: string | null = null;
  private storageKey = 'openai_task_queue';
  private progressKey = 'openai_task_progress';

  constructor() {
    this.load();
  }

  // Load from localStorage
  private load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        data.tasks?.forEach((t: any) => {
          this.tasks.set(t.id, {
            ...t,
            createdAt: new Date(t.createdAt),
            startedAt: t.startedAt ? new Date(t.startedAt) : undefined,
            completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
          });
        });
        this.queue = data.queue || [];
        this.currentTaskId = data.currentTaskId || null;
      }
    } catch (e) {
      console.error('Failed to load task queue:', e);
    }
  }

  // Save to localStorage
  private save() {
    try {
      const data = {
        tasks: Array.from(this.tasks.values()),
        queue: this.queue,
        currentTaskId: this.currentTaskId,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save task queue:', e);
    }
  }

  // Parse massive prompt into numbered steps
  parsePromptIntoSteps(prompt: string): TaskStep[] {
    // This would use AI to break down the prompt
    // For now, simple heuristic-based parsing
    const steps: TaskStep[] = [];
    
    // Detect sections (simplified - real version would use AI)
    const sections = this.detectSections(prompt);
    
    sections.forEach((section, index) => {
      steps.push({
        id: `step_${Date.now()}_${index}`,
        number: index + 1,
        description: section,
        status: 'pending',
      });
    });
    
    return steps;
  }

  // Detect sections in prompt (simplified)
  private detectSections(prompt: string): string[] {
    const sections: string[] = [];
    
    // Look for common patterns
    const patterns = [
      /(?:create|build|implement|add)\s+(.+?)(?=\.|$)/gi,
      /(?:step|part|section)\s+\d+[:.]\s*(.+?)(?=\.|$)/gi,
      /(?:first|then|next|finally)[:.]\s*(.+?)(?=\.|$)/gi,
    ];
    
    // Simple fallback: split by sentences
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (sentences.length > 0) {
      return sentences.slice(0, 20).map(s => s.trim()); // Max 20 steps
    }
    
    return ['Complete the requested task'];
  }

  // Create new task from prompt
  createTask(prompt: string, priority: 'normal' | 'high' | 'urgent' = 'normal'): Task {
    const steps = this.parsePromptIntoSteps(prompt);
    
    const task: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      prompt,
      steps,
      currentStep: 0,
      status: 'queued',
      priority,
      createdAt: new Date(),
    };
    
    this.tasks.set(task.id, task);
    
    // Add to queue based on priority
    if (priority === 'urgent') {
      this.queue.unshift(task.id);
    } else {
      this.queue.push(task.id);
    }
    
    this.save();
    return task;
  }

  // Get current task
  getCurrentTask(): Task | null {
    if (!this.currentTaskId) return null;
    return this.tasks.get(this.currentTaskId) || null;
  }

  // Start next task in queue
  startNextTask(): Task | null {
    if (this.currentTaskId) {
      const current = this.tasks.get(this.currentTaskId);
      if (current && current.status === 'running') {
        return current; // Already running
      }
    }
    
    // Find next queued task
    while (this.queue.length > 0) {
      const taskId = this.queue.shift()!;
      const task = this.tasks.get(taskId);
      
      if (task && task.status === 'queued') {
        task.status = 'running';
        task.startedAt = new Date();
        this.currentTaskId = taskId;
        this.save();
        return task;
      }
    }
    
    return null;
  }

  // Update step status
  updateStepStatus(taskId: string, stepNumber: number, status: TaskStep['status'], code?: string, error?: string) {
    const task = this.tasks.get(taskId);
    if (!task) return;
    
    const step = task.steps.find(s => s.number === stepNumber);
    if (!step) return;
    
    step.status = status;
    if (code) step.code = code;
    if (error) step.error = error;
    
    if (status === 'in-progress') {
      step.startedAt = new Date();
      task.currentStep = stepNumber;
    } else if (status === 'done' || status === 'error') {
      step.completedAt = new Date();
    }
    
    // Check if task is complete
    if (task.steps.every(s => s.status === 'done' || s.status === 'skipped')) {
      task.status = 'completed';
      task.completedAt = new Date();
      this.currentTaskId = null;
    }
    
    this.save();
  }

  // Pause current task
  pauseCurrentTask() {
    if (!this.currentTaskId) return;
    
    const task = this.tasks.get(this.currentTaskId);
    if (task) {
      task.status = 'paused';
      this.save();
    }
  }

  // Resume paused task
  resumeTask(taskId: string) {
    const task = this.tasks.get(taskId);
    if (task && task.status === 'paused') {
      task.status = 'running';
      this.currentTaskId = taskId;
      this.save();
    }
  }

  // Interrupt current task for urgent prompt
  interruptForUrgent(urgentPrompt: string): Task {
    // Pause current task
    this.pauseCurrentTask();
    
    // Create urgent task
    const urgentTask = this.createTask(urgentPrompt, 'urgent');
    
    // Start it immediately
    urgentTask.status = 'running';
    urgentTask.startedAt = new Date();
    this.currentTaskId = urgentTask.id;
    this.save();
    
    return urgentTask;
  }

  // Get progress summary
  getProgress(): { total: number; completed: number; current: number; queue: number } {
    const allTasks = Array.from(this.tasks.values());
    const completed = allTasks.filter(t => t.status === 'completed').length;
    const current = this.getCurrentTask();
    
    return {
      total: allTasks.length,
      completed,
      current: current ? current.currentStep : 0,
      queue: this.queue.length,
    };
  }

  // Get all tasks
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values()).sort((a, b) => {
      // Sort by priority, then by creation time
      const priorityOrder = { urgent: 0, high: 1, normal: 2 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  // Get queued prompts
  getQueuedPrompts(): QueuedPrompt[] {
    const prompts: QueuedPrompt[] = [];
    
    for (const taskId of this.queue) {
      const task = this.tasks.get(taskId);
      if (task) {
        prompts.push({
          id: task.id,
          prompt: task.prompt,
          priority: task.priority,
          timestamp: task.createdAt,
          estimatedSteps: task.steps.length,
        });
      }
    }
    
    return prompts;
  }

  // Delete task
  deleteTask(taskId: string) {
    this.tasks.delete(taskId);
    this.queue = this.queue.filter(id => id !== taskId);
    if (this.currentTaskId === taskId) {
      this.currentTaskId = null;
    }
    this.save();
  }

  // Clear completed tasks
  clearCompleted() {
    const toDelete = Array.from(this.tasks.entries())
      .filter(([_, task]) => task.status === 'completed')
      .map(([id]) => id);
    
    toDelete.forEach(id => this.tasks.delete(id));
    this.save();
  }
}

// Singleton instance
export const taskQueue = new TaskQueueManager();

// Helper functions
export function createTaskFromPrompt(prompt: string, priority: 'normal' | 'high' | 'urgent' = 'normal'): Task {
  return taskQueue.createTask(prompt, priority);
}

export function getCurrentTask(): Task | null {
  return taskQueue.getCurrentTask();
}

export function startNextTask(): Task | null {
  return taskQueue.startNextTask();
}

export function getQueueStatus(): {
  progress: { total: number; completed: number; current: number; queue: number };
  current: Task | null;
  queued: QueuedPrompt[];
  all: Task[];
} {
  return {
    progress: taskQueue.getProgress(),
    current: taskQueue.getCurrentTask(),
    queued: taskQueue.getQueuedPrompts(),
    all: taskQueue.getAllTasks(),
  };
}
