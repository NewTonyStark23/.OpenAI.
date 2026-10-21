// Error Capture System - Captures errors from all sources
// Terminal, Preview, Code Generation, Device Control, etc.

export interface CapturedError {
  id: string;
  source: 'terminal' | 'preview' | 'code-generation' | 'device-control' | 'task-queue' | 'connector' | 'unknown';
  type: 'syntax' | 'runtime' | 'network' | 'permission' | 'timeout' | 'validation' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
  resolution?: string;
}

export interface ErrorPattern {
  id: string;
  pattern: string; // Regex or keyword pattern
  frequency: number;
  lastSeen: Date;
  resolution: string;
  autoFixable: boolean;
}

// Error Capture Manager
class ErrorCaptureManager {
  private errors: CapturedError[] = [];
  private patterns: ErrorPattern[] = [];
  private storageKey = 'openai_error_log';
  private patternsKey = 'openai_error_patterns';
  private maxErrors = 1000; // Keep last 1000 errors

  constructor() {
    this.load();
  }

  // Load from localStorage
  private load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.errors = data.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
      }

      const patternsStored = localStorage.getItem(this.patternsKey);
      if (patternsStored) {
        const data = JSON.parse(patternsStored);
        this.patterns = data.map((p: any) => ({
          ...p,
          lastSeen: new Date(p.lastSeen),
        }));
      }
    } catch (e) {
      console.error('Failed to load error log:', e);
    }
  }

  // Save to localStorage
  private save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.errors));
      localStorage.setItem(this.patternsKey, JSON.stringify(this.patterns));
    } catch (e) {
      console.error('Failed to save error log:', e);
    }
  }

  // Capture error
  capture(
    source: CapturedError['source'],
    type: CapturedError['type'],
    severity: CapturedError['severity'],
    message: string,
    stack?: string,
    context?: Record<string, any>
  ): CapturedError {
    const error: CapturedError = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source,
      type,
      severity,
      message,
      stack,
      context,
      timestamp: new Date(),
      resolved: false,
    };

    this.errors.unshift(error); // Add to beginning

    // Trim if too many
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Check for pattern
    this.detectPattern(error);

    this.save();
    return error;
  }

  // Detect if error matches known pattern
  private detectPattern(error: CapturedError) {
    const messageLower = error.message.toLowerCase();

    for (const pattern of this.patterns) {
      const regex = new RegExp(pattern.pattern, 'i');
      if (regex.test(messageLower)) {
        pattern.frequency++;
        pattern.lastSeen = new Date();
        return pattern;
      }
    }

    // New pattern detected
    const keywords = this.extractKeywords(error.message);
    if (keywords.length > 0) {
      const newPattern: ErrorPattern = {
        id: `pattern_${Date.now()}`,
        pattern: keywords.join('|'),
        frequency: 1,
        lastSeen: new Date(),
        resolution: 'Pending analysis',
        autoFixable: false,
      };
      this.patterns.push(newPattern);
    }
  }

  // Extract keywords from error message
  private extractKeywords(message: string): string[] {
    const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or'];
    const words = message.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.includes(w));

    return [...new Set(words)].slice(0, 5); // Top 5 unique keywords
  }

  // Mark error as resolved
  resolve(errorId: string, resolution: string) {
    const error = this.errors.find(e => e.id === errorId);
    if (error) {
      error.resolved = true;
      error.resolution = resolution;
      this.save();
    }
  }

  // Get all errors
  getAll(): CapturedError[] {
    return this.errors;
  }

  // Get unresolved errors
  getUnresolved(): CapturedError[] {
    return this.errors.filter(e => !e.resolved);
  }

  // Get errors by source
  getBySource(source: CapturedError['source']): CapturedError[] {
    return this.errors.filter(e => e.source === source);
  }

  // Get errors by severity
  getBySeverity(severity: CapturedError['severity']): CapturedError[] {
    return this.errors.filter(e => e.severity === severity);
  }

  // Get recent errors
  getRecent(limit: number = 10): CapturedError[] {
    return this.errors.slice(0, limit);
  }

  // Get error patterns
  getPatterns(): ErrorPattern[] {
    return this.patterns.sort((a, b) => b.frequency - a.frequency);
  }

  // Get error stats
  getStats() {
    const total = this.errors.length;
    const unresolved = this.errors.filter(e => !e.resolved).length;
    const bySeverity = {
      critical: this.errors.filter(e => e.severity === 'critical').length,
      high: this.errors.filter(e => e.severity === 'high').length,
      medium: this.errors.filter(e => e.severity === 'medium').length,
      low: this.errors.filter(e => e.severity === 'low').length,
    };
    const bySource = {
      terminal: this.errors.filter(e => e.source === 'terminal').length,
      preview: this.errors.filter(e => e.source === 'preview').length,
      'code-generation': this.errors.filter(e => e.source === 'code-generation').length,
      'device-control': this.errors.filter(e => e.source === 'device-control').length,
      'task-queue': this.errors.filter(e => e.source === 'task-queue').length,
      connector: this.errors.filter(e => e.source === 'connector').length,
    };

    return { total, unresolved, bySeverity, bySource };
  }

  // Clear all errors
  clear() {
    this.errors = [];
    this.save();
  }

  // Clear resolved errors
  clearResolved() {
    this.errors = this.errors.filter(e => !e.resolved);
    this.save();
  }

  // Export errors as JSON
  export(): string {
    return JSON.stringify({
      errors: this.errors,
      patterns: this.patterns,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  // Import errors from JSON
  import(json: string) {
    try {
      const data = JSON.parse(json);
      if (data.errors) {
        this.errors = data.errors.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp),
        }));
      }
      if (data.patterns) {
        this.patterns = data.patterns.map((p: any) => ({
          ...p,
          lastSeen: new Date(p.lastSeen),
        }));
      }
      this.save();
    } catch (e) {
      console.error('Failed to import errors:', e);
    }
  }
}

// Singleton instance
export const errorCapture = new ErrorCaptureManager();

// Helper functions
export function captureError(
  source: CapturedError['source'],
  type: CapturedError['type'],
  severity: CapturedError['severity'],
  message: string,
  stack?: string,
  context?: Record<string, any>
): CapturedError {
  return errorCapture.capture(source, type, severity, message, stack, context);
}

export function resolveError(errorId: string, resolution: string) {
  errorCapture.resolve(errorId, resolution);
}

export function getErrorStats() {
  return errorCapture.getStats();
}

export function getUnresolvedErrors() {
  return errorCapture.getUnresolved();
}

// Global error handlers
export function setupGlobalErrorHandlers() {
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    captureError(
      'unknown',
      'runtime',
      'high',
      `Unhandled Promise Rejection: ${event.reason}`,
      event.reason?.stack,
      { promise: event.promise }
    );
  });

  // Capture unhandled errors
  window.addEventListener('error', (event) => {
    captureError(
      'unknown',
      'runtime',
      'high',
      `Uncaught Error: ${event.message}`,
      event.error?.stack,
      { filename: event.filename, lineno: event.lineno, colno: event.colno }
    );
  });
}
