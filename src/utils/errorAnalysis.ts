// Error Analysis & Self-Update System
// Analyzes errors, generates fixes, and applies self-updates

import { errorCapture, type CapturedError } from './errorCapture';

export interface ErrorAnalysis {
  errorId: string;
  rootCause: string;
  category: string;
  suggestedFix: string;
  confidence: number; // 0-100
  autoFixable: boolean;
  relatedErrors: string[];
  preventionTips: string[];
}

export interface SelfUpdate {
  id: string;
  type: 'code-fix' | 'config-change' | 'pattern-learned' | 'documentation';
  description: string;
  changes: Record<string, any>;
  applied: boolean;
  timestamp: Date;
  rollbackData?: any;
}

// Error Analysis Engine
class ErrorAnalysisEngine {
  private updates: SelfUpdate[] = [];
  private updatesKey = 'openai_self_updates';

  constructor() {
    this.loadUpdates();
  }

  private loadUpdates() {
    try {
      const stored = localStorage.getItem(this.updatesKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.updates = data.map((u: any) => ({
          ...u,
          timestamp: new Date(u.timestamp),
        }));
      }
    } catch (e) {
      console.error('Failed to load updates:', e);
    }
  }

  private saveUpdates() {
    try {
      localStorage.setItem(this.updatesKey, JSON.stringify(this.updates));
    } catch (e) {
      console.error('Failed to save updates:', e);
    }
  }

  // Analyze a single error
  analyzeError(error: CapturedError): ErrorAnalysis {
    const analysis: ErrorAnalysis = {
      errorId: error.id,
      rootCause: this.identifyRootCause(error),
      category: this.categorizeError(error),
      suggestedFix: this.generateFix(error),
      confidence: this.calculateConfidence(error),
      autoFixable: this.isAutoFixable(error),
      relatedErrors: this.findRelatedErrors(error),
      preventionTips: this.generatePreventionTips(error),
    };

    return analysis;
  }

  // Identify root cause
  private identifyRootCause(error: CapturedError): string {
    const message = error.message.toLowerCase();

    // Common patterns
    if (message.includes('undefined') || message.includes('null')) {
      return 'Null or undefined value accessed';
    }
    if (message.includes('not a function')) {
      return 'Function called on wrong type or missing method';
    }
    if (message.includes('cannot read property')) {
      return 'Property access on null/undefined object';
    }
    if (message.includes('timeout')) {
      return 'Operation exceeded time limit';
    }
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network connectivity or API issue';
    }
    if (message.includes('permission') || message.includes('denied')) {
      return 'Insufficient permissions or access denied';
    }
    if (message.includes('syntax')) {
      return 'Code syntax error';
    }
    if (message.includes('type') || message.includes('typescript')) {
      return 'Type mismatch or type error';
    }

    return 'Unknown error - requires manual investigation';
  }

  // Categorize error
  private categorizeError(error: CapturedError): string {
    const categories: Record<string, string[]> = {
      'Runtime Error': ['undefined', 'null', 'not a function', 'cannot read'],
      'Network Error': ['network', 'fetch', 'api', 'timeout', 'connection'],
      'Permission Error': ['permission', 'denied', 'unauthorized', 'forbidden'],
      'Syntax Error': ['syntax', 'parse', 'unexpected token'],
      'Type Error': ['type', 'typescript', 'ts', 'interface'],
      'Logic Error': ['logic', 'algorithm', 'calculation'],
      'Resource Error': ['memory', 'storage', 'quota', 'limit'],
    };

    const message = error.message.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(kw => message.includes(kw))) {
        return category;
      }
    }

    return 'Uncategorized Error';
  }

  // Generate fix suggestion
  private generateFix(error: CapturedError): string {
    const message = error.message.toLowerCase();

    if (message.includes('undefined') || message.includes('null')) {
      return 'Add null checks or optional chaining (?.) before accessing properties';
    }
    if (message.includes('not a function')) {
      return 'Verify the object type and ensure the method exists before calling';
    }
    if (message.includes('timeout')) {
      return 'Increase timeout duration or optimize the operation';
    }
    if (message.includes('network')) {
      return 'Check network connectivity and API endpoint availability';
    }
    if (message.includes('permission')) {
      return 'Verify user permissions and authentication tokens';
    }
    if (message.includes('syntax')) {
      return 'Review code syntax and fix formatting errors';
    }

    return 'Manual investigation required - error pattern not recognized';
  }

  // Calculate confidence in analysis
  private calculateConfidence(error: CapturedError): number {
    const message = error.message.toLowerCase();
    let confidence = 50; // Base confidence

    // Boost confidence for recognized patterns
    if (message.includes('undefined') || message.includes('null')) confidence += 20;
    if (message.includes('not a function')) confidence += 20;
    if (message.includes('timeout')) confidence += 15;
    if (message.includes('network')) confidence += 15;
    if (message.includes('permission')) confidence += 15;

    // Reduce confidence for unknown patterns
    if (message.length < 20) confidence -= 20;

    return Math.max(0, Math.min(100, confidence));
  }

  // Check if error can be auto-fixed
  private isAutoFixable(error: CapturedError): boolean {
    const autoFixablePatterns = [
      'undefined',
      'null',
      'not a function',
      'missing import',
      'unused variable',
    ];

    const message = error.message.toLowerCase();
    return autoFixablePatterns.some(pattern => message.includes(pattern));
  }

  // Find related errors
  private findRelatedErrors(error: CapturedError): string[] {
    const allErrors = errorCapture.getAll();
    const related: string[] = [];

    // Find errors with similar messages or same source
    for (const other of allErrors) {
      if (other.id === error.id) continue;
      if (other.source === error.source) {
        // Check message similarity
        const similarity = this.calculateSimilarity(error.message, other.message);
        if (similarity > 0.6) {
          related.push(other.id);
        }
      }
    }

    return related.slice(0, 5); // Top 5 related
  }

  // Calculate message similarity (simple Jaccard similarity)
  private calculateSimilarity(msg1: string, msg2: string): number {
    const words1 = new Set(msg1.toLowerCase().split(/\s+/));
    const words2 = new Set(msg2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  // Generate prevention tips
  private generatePreventionTips(error: CapturedError): string[] {
    const tips: string[] = [];
    const message = error.message.toLowerCase();

    if (message.includes('undefined') || message.includes('null')) {
      tips.push('Use TypeScript for better type safety');
      tips.push('Add defensive null checks');
      tips.push('Use optional chaining (?.) for property access');
    }
    if (message.includes('timeout')) {
      tips.push('Implement retry logic with exponential backoff');
      tips.push('Add progress indicators for long operations');
    }
    if (message.includes('network')) {
      tips.push('Add offline support and caching');
      tips.push('Implement retry mechanisms');
      tips.push('Show user-friendly error messages');
    }
    if (message.includes('permission')) {
      tips.push('Check permissions before operations');
      tips.push('Provide clear error messages to users');
    }

    if (tips.length === 0) {
      tips.push('Add comprehensive error logging');
      tips.push('Implement error boundaries');
      tips.push('Add unit tests for edge cases');
    }

    return tips;
  }

  // Analyze all unresolved errors
  analyzeAllUnresolved(): ErrorAnalysis[] {
    const unresolved = errorCapture.getUnresolved();
    return unresolved.map(error => this.analyzeError(error));
  }

  // Apply self-update
  applyUpdate(update: Omit<SelfUpdate, 'id' | 'applied' | 'timestamp'>): SelfUpdate {
    const selfUpdate: SelfUpdate = {
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...update,
      applied: false,
      timestamp: new Date(),
    };

    this.updates.unshift(selfUpdate);
    this.saveUpdates();

    return selfUpdate;
  }

  // Mark update as applied
  markUpdateApplied(updateId: string) {
    const update = this.updates.find(u => u.id === updateId);
    if (update) {
      update.applied = true;
      this.saveUpdates();
    }
  }

  // Get all updates
  getUpdates(): SelfUpdate[] {
    return this.updates;
  }

  // Get pending updates
  getPendingUpdates(): SelfUpdate[] {
    return this.updates.filter(u => !u.applied);
  }

  // Generate self-update from error analysis
  generateSelfUpdate(analysis: ErrorAnalysis): SelfUpdate | null {
    if (!analysis.autoFixable) return null;

    const update: Omit<SelfUpdate, 'id' | 'applied' | 'timestamp'> = {
      type: 'code-fix',
      description: `Auto-fix for: ${analysis.rootCause}`,
      changes: {
        errorId: analysis.errorId,
        fix: analysis.suggestedFix,
        confidence: analysis.confidence,
      },
      rollbackData: null,
    };

    return this.applyUpdate(update);
  }

  // Learn from resolved error
  learnFromResolution(errorId: string, resolution: string) {
    const error = errorCapture.getAll().find(e => e.id === errorId);
    if (!error) return;

    // Create pattern learning update
    const update: Omit<SelfUpdate, 'id' | 'applied' | 'timestamp'> = {
      type: 'pattern-learned',
      description: `Learned pattern from resolved error: ${error.message.substring(0, 50)}...`,
      changes: {
        errorPattern: error.message,
        resolution: resolution,
        source: error.source,
      },
    };

    this.applyUpdate(update);
  }

  // Get update stats
  getUpdateStats() {
    const total = this.updates.length;
    const applied = this.updates.filter(u => u.applied).length;
    const byType = {
      'code-fix': this.updates.filter(u => u.type === 'code-fix').length,
      'config-change': this.updates.filter(u => u.type === 'config-change').length,
      'pattern-learned': this.updates.filter(u => u.type === 'pattern-learned').length,
      'documentation': this.updates.filter(u => u.type === 'documentation').length,
    };

    return { total, applied, pending: total - applied, byType };
  }
}

// Singleton instance
export const errorAnalysis = new ErrorAnalysisEngine();

// Helper functions
export function analyzeError(error: CapturedError): ErrorAnalysis {
  return errorAnalysis.analyzeError(error);
}

export function analyzeAllErrors(): ErrorAnalysis[] {
  return errorAnalysis.analyzeAllUnresolved();
}

export function applySelfUpdate(update: Omit<SelfUpdate, 'id' | 'applied' | 'timestamp'>): SelfUpdate {
  return errorAnalysis.applyUpdate(update);
}

export function getSelfUpdates(): SelfUpdate[] {
  return errorAnalysis.getUpdates();
}

export function getPendingUpdates(): SelfUpdate[] {
  return errorAnalysis.getPendingUpdates();
}
