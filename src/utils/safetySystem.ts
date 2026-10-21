// Safety system for device control - requires confirmation before execution

export interface DeviceAction {
  id: string;
  device: string;
  action: string;
  params: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  timestamp: Date;
}

export interface SafetyCheck {
  passed: boolean;
  warnings: string[];
  suggestions: string[];
}

// Risk assessment for device actions
export function assessRisk(action: string, device: string): 'low' | 'medium' | 'high' {
  const highRiskActions = ['power off', 'factory reset', 'delete', 'format', 'erase'];
  const mediumRiskActions = ['change settings', 'update', 'install', 'uninstall', 'restart'];
  
  const lowerAction = action.toLowerCase();
  
  if (highRiskActions.some(r => lowerAction.includes(r))) {
    return 'high';
  }
  if (mediumRiskActions.some(r => lowerAction.includes(r))) {
    return 'medium';
  }
  return 'low';
}

// Safety check before execution
export function performSafetyCheck(action: DeviceAction): SafetyCheck {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Check risk level
  if (action.riskLevel === 'high') {
    warnings.push('This is a high-risk action that could cause data loss or system changes');
    suggestions.push('Consider testing in a safe environment first');
  }
  
  if (action.riskLevel === 'medium') {
    warnings.push('This action will modify device settings');
    suggestions.push('Make sure you want to proceed with these changes');
  }
  
  // Check if device is currently in use
  // (This would check real device state in production)
  
  return {
    passed: warnings.length === 0 || action.riskLevel === 'low',
    warnings,
    suggestions
  };
}

// Pending actions queue (awaiting confirmation)
class PendingActions {
  private actions: Map<string, DeviceAction> = new Map();
  private storageKey = 'openai_pending_actions';

  constructor() {
    this.load();
  }

  private load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        data.forEach((a: any) => {
          this.actions.set(a.id, { ...a, timestamp: new Date(a.timestamp) });
        });
      }
    } catch (e) {
      console.error('Failed to load pending actions:', e);
    }
  }

  private save() {
    try {
      const data = Array.from(this.actions.values());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save pending actions:', e);
    }
  }

  // Add action to pending queue
  add(action: DeviceAction) {
    this.actions.set(action.id, action);
    this.save();
  }

  // Get pending action
  get(id: string): DeviceAction | undefined {
    return this.actions.get(id);
  }

  // Get all pending
  getAll(): DeviceAction[] {
    return Array.from(this.actions.values());
  }

  // Remove from queue (after execution or cancellation)
  remove(id: string) {
    this.actions.delete(id);
    this.save();
  }

  // Clear all
  clear() {
    this.actions.clear();
    this.save();
  }
}

export const pendingActions = new PendingActions();

// Request confirmation for device action
export function requestConfirmation(
  device: string,
  action: string,
  params: Record<string, any> = {}
): DeviceAction {
  const id = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const riskLevel = assessRisk(action, device);
  
  const deviceAction: DeviceAction = {
    id,
    device,
    action,
    params,
    riskLevel,
    description: `${action} on ${device}`,
    timestamp: new Date()
  };
  
  pendingActions.add(deviceAction);
  return deviceAction;
}

// Format confirmation message
export function formatConfirmationMessage(action: DeviceAction): string {
  const riskEmoji = {
    low: '🟢',
    medium: '🟡',
    high: '🔴'
  };
  
  const safety = performSafetyCheck(action);
  
  let message = `${riskEmoji[action.riskLevel]} **Confirmation Required**\n\n`;
  message += `**Device:** ${action.device}\n`;
  message += `**Action:** ${action.action}\n`;
  message += `**Risk Level:** ${action.riskLevel.toUpperCase()}\n\n`;
  
  if (safety.warnings.length > 0) {
    message += `**⚠️ Warnings:**\n`;
    safety.warnings.forEach(w => {
      message += `• ${w}\n`;
    });
    message += '\n';
  }
  
  if (safety.suggestions.length > 0) {
    message += `**💡 Suggestions:**\n`;
    safety.suggestions.forEach(s => {
      message += `• ${s}\n`;
    });
    message += '\n';
  }
  
  message += `**Proceed?** Reply "yes" to execute or "no" to cancel.`;
  
  return message;
}

// Execute after confirmation
export async function executeAfterConfirmation(
  actionId: string,
  executor: (action: DeviceAction) => Promise<any>
): Promise<{ success: boolean; message: string; result?: any }> {
  const action = pendingActions.get(actionId);
  if (!action) {
    return { success: false, message: 'Action not found or already executed' };
  }
  
  try {
    const result = await executor(action);
    pendingActions.remove(actionId);
    return { success: true, message: 'Action executed successfully', result };
  } catch (error) {
    return { success: false, message: `Failed to execute: ${error}` };
  }
}
