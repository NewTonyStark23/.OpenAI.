# Task Queue System Guide

## Overview

The Task Queue System allows OpenAI to handle massive prompts by breaking them into numbered steps, tracking progress, and automatically resuming via Needle when context limits are reached.

## Features

### 1. Massive Prompt Handling
- Automatically breaks large prompts into numbered steps
- Each step is tracked individually
- Progress is saved to localStorage
- Can resume from where it left off

### 2. Progressive Execution
- Steps are executed one by one
- Each step's status is tracked (pending, in-progress, done, error, skipped)
- Real-time progress updates
- Visual progress bar in the Task Queue panel

### 3. Needle Integration
- Automatic refresh when context limit is reached
- Manual refresh capability
- Context summary generation for seamless continuation
- Configurable refresh timeout (default: 30 seconds)

### 4. Task Queue Management
- Queue multiple tasks
- Priority levels (normal, high, urgent)
- Pause/resume tasks
- Delete tasks
- View all task history

### 5. Interrupt System
- Interrupt current task with urgent prompts
- Current task is automatically paused
- Urgent task is created with highest priority
- Needle refreshes to handle urgent request immediately

## How It Works

### Flow Diagram

```
User sends massive prompt
         ↓
Task Queue breaks it into steps
         ↓
Needle starts executing step 1
         ↓
Progress tracked in localStorage
         ↓
If context limit reached → Needle refreshes
         ↓
Needle receives context summary
         ↓
Continues from last completed step
         ↓
Repeat until all steps complete
```

### Example Scenario

**User Prompt:**
```
Build a complete e-commerce platform with:
1. User authentication system
2. Product catalog with categories
3. Shopping cart functionality
4. Payment integration
5. Order management system
6. Admin dashboard
7. Email notifications
8. Search and filtering
9. Product reviews
10. Wishlist functionality
```

**What Happens:**

1. **Task Creation**
   - Task Queue analyzes the prompt
   - Breaks it into 10 numbered steps
   - Creates a task with priority "normal"

2. **Execution Starts**
   - Needle begins with step 1: "User authentication system"
   - Progress is tracked in localStorage
   - Terminal shows: "Step 1/10: Building user authentication..."

3. **Context Limit Reached**
   - After step 4, Needle hits context limit
   - Progress Tracker generates context summary
   - Needle Integration triggers refresh

4. **Needle Refresh**
   - Needle receives context:
     ```
     Task Progress: 40% (4/10 steps)
     Completed Steps: 4
     Current Step: 4
     
     Context:
     - User authentication: ✓ Complete
     - Product catalog: ✓ Complete
     - Shopping cart: ✓ Complete
     - Payment integration: ✓ Complete
     
     Next Action:
     Build order management system
     ```
   - Needle continues from step 5

5. **Completion**
   - All 10 steps completed
   - Task marked as "completed"
   - Progress saved for reference

## Using the Task Queue

### Creating Tasks

**Automatic (from massive prompts):**
```
Just send a large prompt with multiple requirements.
The system will automatically detect and create tasks.
```

**Manual (via Task Queue panel):**
1. Click the Task Queue icon in sidebar
2. Click "Create Task"
3. Enter your prompt
4. Select priority level
5. Click "Create"

### Managing Tasks

**View Tasks:**
- Click Task Queue icon in sidebar
- See all tasks with progress bars
- Current task highlighted in purple

**Pause Task:**
- Click pause button (⏸️) on any running task
- Task status changes to "paused"
- Resume anytime by clicking play button (▶️)

**Delete Task:**
- Click delete button (🗑️) on any task
- Confirm deletion
- Task and progress removed

**Interrupt with Urgent Task:**
1. In Task Queue panel, use "Interrupt" section
2. Enter urgent prompt
3. Click "Interrupt"
4. Current task pauses automatically
5. Urgent task starts immediately

### Monitoring Progress

**Progress Indicators:**
- Progress bar shows completion percentage
- Step list shows individual step status:
  - ✓ Done (green checkmark)
  - ▶ In Progress (blue play icon, animated)
  - ⚠ Error (red warning)
  - ⊘ Skipped (gray)
  - ○ Pending (gray circle)

**Terminal Output:**
```
📋 Task Queue — Starting task: Build e-commerce platform
✓ Step 1/10: User authentication system
✓ Step 2/10: Product catalog with categories
✓ Step 3/10: Shopping cart functionality
✓ Step 4/10: Payment integration
⚠ Context limit reached — Needle refreshing...
✓ Needle refreshed — Continuing from step 5
✓ Step 5/10: Order management system
...
✅ Task completed: Build e-commerce platform
```

## Needle Integration

### Configuration

Access Needle settings in Settings panel:

```typescript
{
  enabled: true,              // Enable/disable Needle
  refreshTimeoutMs: 30000,    // Time before auto-refresh
  maxRefreshAttempts: 10,     // Max refreshes per task
  autoRefresh: true           // Auto-refresh on timeout
}
```

### Manual Refresh

1. Go to Task Queue panel
2. Find the task you want to refresh
3. Click refresh button (🔄)
4. Needle receives context and continues

### Refresh Reasons

- **timeout**: No activity for 30 seconds
- **context_limit**: AI hit context window limit
- **error**: Task encountered an error
- **manual**: User requested refresh

## Advanced Features

### Priority System

**Normal Priority:**
- Default for regular tasks
- Executed in FIFO order

**High Priority:**
- Jump ahead of normal tasks
- Use for important but not urgent work

**Urgent Priority:**
- Interrupts current task
- Starts immediately
- Use for critical fixes

### Context Summary Generation

When Needle refreshes, it receives:

```
Task Progress: 40% (4/10 steps)

Completed Steps: 4
Failed Steps: 0
Skipped Steps: 0
Current Step: 4

Context:
- User authentication: ✓ Complete
  - Login/logout functionality
  - JWT token management
  - Password hashing
  
- Product catalog: ✓ Complete
  - Product CRUD operations
  - Category management
  - Image uploads
  
- Shopping cart: ✓ Complete
  - Add/remove items
  - Quantity updates
  - Price calculations
  
- Payment integration: ✓ Complete
  - Stripe integration
  - Payment processing
  - Transaction records

Next Action:
Build order management system
- Order creation
- Order status tracking
- Order history
```

### Error Handling

**Step Errors:**
- Step marked as "error"
- Error message displayed
- Task continues to next step
- Can retry failed steps manually

**Task Errors:**
- Task marked as "interrupted"
- Error logged in terminal
- Can resume or delete task

## Best Practices

### 1. Break Down Large Prompts
Instead of:
```
Build a complete app with auth, database, API, frontend, backend, 
testing, deployment, monitoring, logging, and documentation.
```

Do:
```
Build a complete app with:
1. User authentication
2. Database schema
3. REST API endpoints
4. Frontend components
5. Backend services
6. Unit tests
7. Deployment config
8. Monitoring setup
9. Logging system
10. Documentation
```

### 2. Use Priority Wisely
- **Normal**: Regular features, enhancements
- **High**: Important bugs, critical features
- **Urgent**: Production issues, security fixes

### 3. Monitor Progress
- Check Task Queue panel regularly
- Watch terminal for errors
- Pause if you need to make changes

### 4. Handle Interrupts Carefully
- Only interrupt for truly urgent issues
- Current task will resume after urgent task completes
- Don't interrupt frequently (disrupts flow)

## Troubleshooting

### Task Not Starting
- Check if another task is running
- Verify Needle is enabled in settings
- Check browser console for errors

### Needle Not Refreshing
- Verify autoRefresh is enabled
- Check refreshTimeoutMs setting
- Try manual refresh
- Check browser console for errors

### Progress Not Saving
- Check localStorage is enabled
- Verify browser isn't in private/incognito mode
- Check browser console for errors

### Task Stuck on Step
- Try manual Needle refresh
- Check terminal for error messages
- Pause and resume the task
- Delete and recreate if necessary

## Technical Details

### Storage Keys

- `openai_task_queue`: Task queue data
- `openai_task_progress`: Progress tracking
- `openai_needle_config`: Needle configuration
- `openai_needle_status`: Needle status
- `openai_needle_pending_refresh`: Pending refresh requests

### Data Structures

**Task:**
```typescript
{
  id: string;
  prompt: string;
  steps: TaskStep[];
  currentStep: number;
  status: 'queued' | 'running' | 'paused' | 'completed' | 'interrupted';
  priority: 'normal' | 'high' | 'urgent';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}
```

**TaskStep:**
```typescript
{
  id: string;
  number: number;
  description: string;
  status: 'pending' | 'in-progress' | 'done' | 'skipped' | 'error';
  code?: string;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}
```

**ProgressState:**
```typescript
{
  taskId: string;
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
  failedSteps: number;
  skippedSteps: number;
  lastUpdated: Date;
  context: string;
  nextAction: string;
  error?: string;
}
```

## Future Enhancements

- [ ] Task dependencies
- [ ] Parallel step execution
- [ ] Step retry logic
- [ ] Task templates
- [ ] Export/import tasks
- [ ] Task scheduling
- [ ] Progress analytics
- [ ] Collaboration features

## Support

For issues or questions:
1. Check this guide
2. Review terminal output
3. Check browser console
4. Review localStorage data
5. Create an issue on GitHub
