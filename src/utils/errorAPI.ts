// API/CLI Interface for Error Management
// Allows external tools to interact with the error system

import { errorCapture, type CapturedError } from './errorCapture';
import { errorAnalysis, type ErrorAnalysis, type SelfUpdate } from './errorAnalysis';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface CLICommand {
  command: string;
  args: Record<string, any>;
}

// API Interface
class ErrorAPI {
  // Submit a new error
  submitError(
    source: CapturedError['source'],
    type: CapturedError['type'],
    severity: CapturedError['severity'],
    message: string,
    stack?: string,
    context?: Record<string, any>
  ): APIResponse<CapturedError> {
    try {
      const error = errorCapture.capture(source, type, severity, message, stack, context);
      return {
        success: true,
        data: error,
        timestamp: new Date(),
      };
    } catch (e) {
      return {
        success: false,
        error: `Failed to submit error: ${e}`,
        timestamp: new Date(),
      };
    }
  }

  // Get error by ID
  getError(errorId: string): APIResponse<CapturedError> {
    const error = errorCapture.getAll().find(e => e.id === errorId);
    if (!error) {
      return {
        success: false,
        error: 'Error not found',
        timestamp: new Date(),
      };
    }
    return {
      success: true,
      data: error,
      timestamp: new Date(),
    };
  }

  // Get all errors
  getAllErrors(filters?: {
    source?: CapturedError['source'];
    severity?: CapturedError['severity'];
    resolved?: boolean;
    limit?: number;
  }): APIResponse<CapturedError[]> {
    let errors = errorCapture.getAll();

    if (filters?.source) {
      errors = errors.filter(e => e.source === filters.source);
    }
    if (filters?.severity) {
      errors = errors.filter(e => e.severity === filters.severity);
    }
    if (filters?.resolved !== undefined) {
      errors = errors.filter(e => e.resolved === filters.resolved);
    }
    if (filters?.limit) {
      errors = errors.slice(0, filters.limit);
    }

    return {
      success: true,
      data: errors,
      timestamp: new Date(),
    };
  }

  // Resolve an error
  resolveError(errorId: string, resolution: string): APIResponse<void> {
    try {
      errorCapture.resolve(errorId, resolution);
      errorAnalysis.learnFromResolution(errorId, resolution);
      return {
        success: true,
        timestamp: new Date(),
      };
    } catch (e) {
      return {
        success: false,
        error: `Failed to resolve error: ${e}`,
        timestamp: new Date(),
      };
    }
  }

  // Analyze an error
  analyzeError(errorId: string): APIResponse<ErrorAnalysis> {
    const error = errorCapture.getAll().find(e => e.id === errorId);
    if (!error) {
      return {
        success: false,
        error: 'Error not found',
        timestamp: new Date(),
      };
    }

    const analysis = errorAnalysis.analyzeError(error);
    return {
      success: true,
      data: analysis,
      timestamp: new Date(),
    };
  }

  // Analyze all unresolved errors
  analyzeAllUnresolved(): APIResponse<ErrorAnalysis[]> {
    const analyses = errorAnalysis.analyzeAllUnresolved();
    return {
      success: true,
      data: analyses,
      timestamp: new Date(),
    };
  }

  // Get error stats
  getStats(): APIResponse<any> {
    const stats = errorCapture.getStats();
    return {
      success: true,
      data: stats,
      timestamp: new Date(),
    };
  }

  // Get self-updates
  getUpdates(): APIResponse<SelfUpdate[]> {
    const updates = errorAnalysis.getUpdates();
    return {
      success: true,
      data: updates,
      timestamp: new Date(),
    };
  }

  // Get pending updates
  getPendingUpdates(): APIResponse<SelfUpdate[]> {
    const updates = errorAnalysis.getPendingUpdates();
    return {
      success: true,
      data: updates,
      timestamp: new Date(),
    };
  }

  // Apply a self-update
  applyUpdate(update: Omit<SelfUpdate, 'id' | 'applied' | 'timestamp'>): APIResponse<SelfUpdate> {
    try {
      const selfUpdate = errorAnalysis.applyUpdate(update);
      return {
        success: true,
        data: selfUpdate,
        timestamp: new Date(),
      };
    } catch (e) {
      return {
        success: false,
        error: `Failed to apply update: ${e}`,
        timestamp: new Date(),
      };
    }
  }

  // Export all error data
  exportData(): APIResponse<string> {
    try {
      const data = errorCapture.export();
      return {
        success: true,
        data,
        timestamp: new Date(),
      };
    } catch (e) {
      return {
        success: false,
        error: `Failed to export data: ${e}`,
        timestamp: new Date(),
      };
    }
  }

  // Import error data
  importData(json: string): APIResponse<void> {
    try {
      errorCapture.import(json);
      return {
        success: true,
        timestamp: new Date(),
      };
    } catch (e) {
      return {
        success: false,
        error: `Failed to import data: ${e}`,
        timestamp: new Date(),
      };
    }
  }

  // Clear all errors
  clearErrors(): APIResponse<void> {
    try {
      errorCapture.clear();
      return {
        success: true,
        timestamp: new Date(),
      };
    } catch (e) {
      return {
        success: false,
        error: `Failed to clear errors: ${e}`,
        timestamp: new Date(),
      };
    }
  }

  // Clear resolved errors
  clearResolved(): APIResponse<void> {
    try {
      errorCapture.clearResolved();
      return {
        success: true,
        timestamp: new Date(),
      };
    } catch (e) {
      return {
        success: false,
        error: `Failed to clear resolved errors: ${e}`,
        timestamp: new Date(),
      };
    }
  }
}

// CLI Interface
class ErrorCLI {
  private api: ErrorAPI;

  constructor() {
    this.api = new ErrorAPI();
  }

  // Execute CLI command
  execute(command: CLICommand): APIResponse {
    const { command: cmd, args } = command;

    switch (cmd) {
      case 'submit':
        return this.api.submitError(
          args.source,
          args.type,
          args.severity,
          args.message,
          args.stack,
          args.context
        );

      case 'get':
        return this.api.getError(args.errorId);

      case 'list':
        return this.api.getAllErrors(args.filters);

      case 'resolve':
        return this.api.resolveError(args.errorId, args.resolution);

      case 'analyze':
        return this.api.analyzeError(args.errorId);

      case 'analyze-all':
        return this.api.analyzeAllUnresolved();

      case 'stats':
        return this.api.getStats();

      case 'updates':
        return this.api.getUpdates();

      case 'pending-updates':
        return this.api.getPendingUpdates();

      case 'apply-update':
        return this.api.applyUpdate(args.update);

      case 'export':
        return this.api.exportData();

      case 'import':
        return this.api.importData(args.json);

      case 'clear':
        return this.api.clearErrors();

      case 'clear-resolved':
        return this.api.clearResolved();

      case 'help':
        return {
          success: true,
          data: this.getHelp(),
          timestamp: new Date(),
        };

      default:
        return {
          success: false,
          error: `Unknown command: ${cmd}. Use 'help' for available commands.`,
          timestamp: new Date(),
        };
    }
  }

  // Get help text
  private getHelp(): string {
    return `
Error Management CLI Commands:

  submit <source> <type> <severity> <message> [stack] [context]
    Submit a new error
    
  get <errorId>
    Get error by ID
    
  list [filters]
    List errors with optional filters
    Filters: source, severity, resolved, limit
    
  resolve <errorId> <resolution>
    Mark error as resolved
    
  analyze <errorId>
    Analyze a specific error
    
  analyze-all
    Analyze all unresolved errors
    
  stats
    Get error statistics
    
  updates
    Get all self-updates
    
  pending-updates
    Get pending self-updates
    
  apply-update <update>
    Apply a self-update
    
  export
    Export all error data as JSON
    
  import <json>
    Import error data from JSON
    
  clear
    Clear all errors
    
  clear-resolved
    Clear only resolved errors
    
  help
    Show this help message

Examples:
  submit terminal runtime high "TypeError: Cannot read property 'x' of undefined"
  list {"source": "terminal", "severity": "high"}
  analyze error_1234567890_abc
  resolve error_1234567890_abc "Added null check"
    `.trim();
  }
}

// Singleton instances
export const errorAPI = new ErrorAPI();
export const errorCLI = new ErrorCLI();

// Helper functions
export function submitError(
  source: CapturedError['source'],
  type: CapturedError['type'],
  severity: CapturedError['severity'],
  message: string,
  stack?: string,
  context?: Record<string, any>
): APIResponse<CapturedError> {
  return errorAPI.submitError(source, type, severity, message, stack, context);
}

export function getError(errorId: string): APIResponse<CapturedError> {
  return errorAPI.getError(errorId);
}

export function listErrors(filters?: any): APIResponse<CapturedError[]> {
  return errorAPI.getAllErrors(filters);
}

export function resolveError(errorId: string, resolution: string): APIResponse<void> {
  return errorAPI.resolveError(errorId, resolution);
}

export function analyzeError(errorId: string): APIResponse<ErrorAnalysis> {
  return errorAPI.analyzeError(errorId);
}

export function getStats(): APIResponse<any> {
  return errorAPI.getStats();
}

export function executeCLICommand(command: CLICommand): APIResponse {
  return errorCLI.execute(command);
}

// Global error handler setup
export function setupErrorHandler() {
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    submitError(
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
    submitError(
      'unknown',
      'runtime',
      'high',
      `Uncaught Error: ${event.message}`,
      event.error?.stack,
      { filename: event.filename, lineno: event.lineno, colno: event.colno }
    );
  });

  console.log('✅ Error handler setup complete');
}
