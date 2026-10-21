# Error Management & Self-Healing System

## Overview

The Error Management System provides comprehensive error tracking, analysis, and self-healing capabilities. It automatically captures errors from all sources, analyzes them using pattern matching, and generates self-updates to prevent future occurrences.

## Features

### 1. Error Capture (`errorCapture.ts`)
- **Global Error Handlers**: Automatically captures unhandled promise rejections and runtime errors
- **Multi-Source Tracking**: Captures errors from terminal, preview, code generation, device control, task queue, and connectors
- **Severity Levels**: Critical, High, Medium, Low
- **Pattern Detection**: Identifies recurring error patterns
- **Persistent Storage**: All errors stored in localStorage

### 2. Error Analysis (`errorAnalysis.ts`)
- **Root Cause Identification**: Analyzes error messages to identify root causes
- **Fix Suggestions**: Generates actionable fix recommendations
- **Confidence Scoring**: Rates analysis confidence (0-100%)
- **Related Errors**: Finds similar errors for pattern recognition
- **Prevention Tips**: Generates tips to prevent future occurrences
- **Self-Update Generation**: Creates updates to fix recurring issues

### 3. API/CLI Interface (`errorAPI.ts`)
- **REST-like API**: Programmatic access to error management
- **CLI Commands**: Command-line interface for automation
- **Export/Import**: JSON export/import for backup and sharing
- **Batch Operations**: Analyze all errors, clear resolved, etc.

### 4. Error Management Panel (`ErrorManagementPanel.tsx`)
- **Real-time Dashboard**: Live error statistics and trends
- **Filtering & Search**: Filter by source, severity, resolution status
- **Error Analysis**: One-click analysis with detailed insights
- **Self-Updates**: View and apply pending self-updates
- **CLI Interface**: Built-in CLI for advanced operations

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Error Sources                         │
│  Terminal │ Preview │ Code Gen │ Device │ Tasks │ etc.  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Error Capture System                        │
│  - Global error handlers                                │
│  - Manual capture API                                   │
│  - Pattern detection                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│             Error Analysis Engine                        │
│  - Root cause identification                            │
│  - Fix suggestion generation                            │
│  - Confidence scoring                                   │
│  - Related error detection                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Self-Update System                          │
│  - Pattern learning                                     │
│  - Auto-fix generation                                  │
│  - Update application                                   │
│  - Rollback support                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              API/CLI Interface                           │
│  - REST API endpoints                                   │
│  - CLI commands                                         │
│  - Export/Import                                        │
└─────────────────────────────────────────────────────────┘
```

## Usage

### Automatic Error Capture

The system automatically captures errors via global handlers:

```typescript
// Setup in main.tsx
import { setupErrorHandler } from './utils/errorAPI';
setupErrorHandler();
```

### Manual Error Capture

```typescript
import { captureError } from './utils/errorCapture';

captureError(
  'terminal',           // source
  'runtime',            // type
  'high',               // severity
  'TypeError: Cannot read property "x" of undefined',
  error.stack,          // optional stack trace
  { component: 'App' }  // optional context
);
```

### Error Analysis

```typescript
import { analyzeError } from './utils/errorAnalysis';

const analysis = analyzeError(errorId);
console.log(analysis.rootCause);      // "Null or undefined value accessed"
console.log(analysis.suggestedFix);   // "Add null checks..."
console.log(analysis.confidence);     // 85
console.log(analysis.preventionTips); // ["Use TypeScript...", ...]
```

### API Usage

```typescript
import { errorAPI } from './utils/errorAPI';

// Get all errors
const response = errorAPI.getAllErrors({
  source: 'terminal',
  severity: 'high',
  resolved: false
});

// Analyze error
const analysis = errorAPI.analyzeError(errorId);

// Resolve error
errorAPI.resolveError(errorId, 'Added null check');

// Export data
const json = errorAPI.exportData();
```

### CLI Usage

```typescript
import { executeCLICommand } from './utils/errorAPI';

// List errors
executeCLICommand({
  command: 'list',
  args: { filters: { source: 'terminal', severity: 'high' } }
});

// Analyze all
executeCLICommand({ command: 'analyze-all', args: {} });

// Get stats
executeCLICommand({ command: 'stats', args: {} });
```

## Error Sources

### Terminal Errors
- Command execution failures
- Build errors
- Runtime exceptions

### Preview Errors
- Rendering errors
- iframe communication issues
- CSS/JS errors

### Code Generation Errors
- Template errors
- Syntax errors
- Type errors

### Device Control Errors
- Network timeouts
- Permission denied
- Device not found

### Task Queue Errors
- Task execution failures
- Needle refresh errors
- Context limit errors

### Connector Errors
- API call failures
- Authentication errors
- Rate limiting

## Self-Update Types

### Code Fix
Automatically fixes code issues:
```typescript
{
  type: 'code-fix',
  description: 'Add null check for user object',
  changes: {
    file: 'src/components/UserProfile.tsx',
    line: 42,
    fix: 'if (user) { ... }'
  }
}
```

### Config Change
Updates configuration:
```typescript
{
  type: 'config-change',
  description: 'Increase timeout from 5s to 10s',
  changes: {
    key: 'network.timeout',
    oldValue: 5000,
    newValue: 10000
  }
}
```

### Pattern Learned
Records error patterns for future prevention:
```typescript
{
  type: 'pattern-learned',
  description: 'Null check pattern for API responses',
  changes: {
    pattern: 'Cannot read property .* of undefined',
    solution: 'Always check if response.data exists'
  }
}
```

### Documentation
Updates documentation:
```typescript
{
  type: 'documentation',
  description: 'Add error handling guide',
  changes: {
    file: 'docs/error-handling.md',
    content: '...'
  }
}
```

## Filtering & Search

### By Source
- `terminal`: Terminal/command errors
- `preview`: Preview/rendering errors
- `code-generation`: Code generation errors
- `device-control`: Device control errors
- `task-queue`: Task queue errors
- `connector`: Connector errors
- `unknown`: Unclassified errors

### By Severity
- `critical`: System-breaking errors
- `high`: Major functionality issues
- `medium`: Minor functionality issues
- `low`: Cosmetic/non-blocking issues

### By Status
- `resolved`: Errors that have been fixed
- `unresolved`: Active errors requiring attention

## Statistics Dashboard

The dashboard shows:
- **Total Errors**: All captured errors
- **Unresolved**: Active errors
- **Critical**: Critical severity errors
- **Updates**: Pending self-updates

## Best Practices

### 1. Regular Monitoring
Check the Error Management panel daily to catch issues early.

### 2. Prompt Resolution
Resolve errors quickly to prevent pattern accumulation.

### 3. Review Self-Updates
Review pending self-updates before applying to ensure they're appropriate.

### 4. Export Regularly
Export error logs regularly for backup and analysis.

### 5. Use Filters
Filter errors by source/severity to focus on critical issues first.

## Integration with Backend

For full functionality, connect to a backend server:

```javascript
// server/server.js additions

// Error submission endpoint
app.post('/api/errors', (req, res) => {
  const { source, type, severity, message, stack, context } = req.body;
  // Store in database
  // Trigger analysis
  // Generate self-updates
  res.json({ success: true });
});

// Error analysis endpoint
app.post('/api/errors/:id/analyze', (req, res) => {
  // Run AI analysis
  // Return root cause and suggestions
  res.json({ analysis: {...} });
});

// Self-update endpoint
app.post('/api/updates/apply', (req, res) => {
  // Apply update
  // Log changes
  res.json({ success: true });
});
```

## Future Enhancements

- [ ] AI-powered error analysis using LLMs
- [ ] Automatic fix application
- [ ] Error prediction/prevention
- [ ] Cross-project error sharing
- [ ] Error trend visualization
- [ ] Integration with error tracking services (Sentry, etc.)
- [ ] Automated rollback on failed updates
- [ ] Error correlation across sources

## Troubleshooting

### Errors Not Capturing
- Ensure `setupErrorHandler()` is called in main.tsx
- Check browser console for handler setup errors
- Verify localStorage is enabled

### Analysis Not Working
- Check error message format
- Verify error exists in storage
- Check browser console for analysis errors

### Self-Updates Not Applying
- Review update description and changes
- Check for conflicts with existing code
- Verify rollback data is present

### Performance Issues
- Clear old resolved errors regularly
- Limit error storage (default: 1000)
- Export and archive old error logs

## API Reference

### Error Capture
```typescript
captureError(source, type, severity, message, stack?, context?): CapturedError
resolveError(errorId, resolution): void
getUnresolvedErrors(): CapturedError[]
getErrorStats(): ErrorStats
```

### Error Analysis
```typescript
analyzeError(error: CapturedError): ErrorAnalysis
analyzeAllUnresolved(): ErrorAnalysis[]
generateSelfUpdate(analysis: ErrorAnalysis): SelfUpdate | null
learnFromResolution(errorId, resolution): void
```

### Error API
```typescript
errorAPI.submitError(...): APIResponse<CapturedError>
errorAPI.getError(errorId): APIResponse<CapturedError>
errorAPI.getAllErrors(filters?): APIResponse<CapturedError[]>
errorAPI.resolveError(errorId, resolution): APIResponse<void>
errorAPI.analyzeError(errorId): APIResponse<ErrorAnalysis>
errorAPI.analyzeAllUnresolved(): APIResponse<ErrorAnalysis[]>
errorAPI.getStats(): APIResponse<ErrorStats>
errorAPI.getUpdates(): APIResponse<SelfUpdate[]>
errorAPI.applyUpdate(update): APIResponse<SelfUpdate>
errorAPI.exportData(): APIResponse<string>
errorAPI.importData(json): APIResponse<void>
```

### Error CLI
```typescript
executeCLICommand({ command, args }): APIResponse
```

## Conclusion

The Error Management System provides a comprehensive solution for tracking, analyzing, and self-healing errors. It integrates seamlessly with the OpenAI platform and provides both automatic and manual error management capabilities.
