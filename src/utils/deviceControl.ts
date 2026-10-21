// Device Control System - Handles smart home device control through chat
// User types commands like "connect to TV and change brightness"
// AI explains steps and asks for permission before executing

export interface SmartDevice {
  id: string;
  type: 'tv' | 'speaker' | 'light' | 'thermostat' | 'lock' | 'camera' | 'other';
  brand?: string;
  model?: string;
  name: string;
  ip?: string;
  capabilities: string[];
  connected: boolean;
}

export interface DeviceCommand {
  device: SmartDevice;
  action: string;
  parameters: Record<string, any>;
  steps: string[];
  requiresPermission: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface PermissionRequest {
  id: string;
  command: DeviceCommand;
  timestamp: Date;
  granted: boolean | null;
}

// Device Registry - Stores known devices
class DeviceRegistry {
  private devices: Map<string, SmartDevice> = new Map();
  private storageKey = 'openai_devices';

  constructor() {
    this.load();
  }

  private load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        data.forEach((d: SmartDevice) => {
          this.devices.set(d.id, d);
        });
      }
    } catch (e) {
      console.error('Failed to load devices:', e);
    }
  }

  private save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.devices.values())));
    } catch (e) {
      console.error('Failed to save devices:', e);
    }
  }

  addDevice(device: SmartDevice) {
    this.devices.set(device.id, device);
    this.save();
  }

  getDevice(id: string): SmartDevice | undefined {
    return this.devices.get(id);
  }

  getAllDevices(): SmartDevice[] {
    return Array.from(this.devices.values());
  }

  findDeviceByName(name: string): SmartDevice | undefined {
    const lower = name.toLowerCase();
    return Array.from(this.devices.values()).find(d => 
      d.name.toLowerCase().includes(lower) ||
      d.type.toLowerCase().includes(lower) ||
      d.brand?.toLowerCase().includes(lower)
    );
  }

  removeDevice(id: string) {
    this.devices.delete(id);
    this.save();
  }

  updateDevice(id: string, updates: Partial<SmartDevice>) {
    const device = this.devices.get(id);
    if (device) {
      this.devices.set(id, { ...device, ...updates });
      this.save();
    }
  }
}

export const deviceRegistry = new DeviceRegistry();

// Parse device command from chat message
export function parseDeviceCommand(message: string): DeviceCommand | null {
  const lower = message.toLowerCase();

  // TV commands
  if (lower.includes('tv') || lower.includes('television')) {
    const device = deviceRegistry.findDeviceByName('tv') || {
      id: 'tv_1',
      type: 'tv' as const,
      brand: 'Samsung',
      name: 'Living Room TV',
      capabilities: ['brightness', 'volume', 'power', 'input', 'picture_mode'],
      connected: false
    };

    let action = '';
    let parameters: Record<string, any> = {};

    if (lower.includes('brightness')) {
      action = 'set_brightness';
      const match = message.match(/(\d+)/);
      parameters.level = match ? parseInt(match[1]) : 50;
    } else if (lower.includes('volume')) {
      action = 'set_volume';
      const match = message.match(/(\d+)/);
      parameters.level = match ? parseInt(match[1]) : 50;
    } else if (lower.includes('power off') || lower.includes('turn off')) {
      action = 'power_off';
    } else if (lower.includes('power on') || lower.includes('turn on')) {
      action = 'power_on';
    } else {
      return null;
    }

    return {
      device,
      action,
      parameters,
      steps: [
        `Connect to ${device.name}`,
        `Authenticate with device`,
        `Execute ${action} command`,
        `Verify command executed successfully`
      ],
      requiresPermission: true,
      riskLevel: action.includes('power') ? 'medium' : 'low'
    };
  }

  // Speaker commands
  if (lower.includes('speaker') || lower.includes('google home') || lower.includes('alexa')) {
    const device = deviceRegistry.findDeviceByName('speaker') || {
      id: 'speaker_1',
      type: 'speaker' as const,
      brand: 'Google',
      name: 'Room Speaker',
      capabilities: ['volume', 'wake_word', 'play', 'pause', 'stop'],
      connected: false
    };

    let action = '';
    let parameters: Record<string, any> = {};

    if (lower.includes('wake word') || lower.includes('wakeword')) {
      action = 'set_wake_word';
      const match = message.match(/["'](.+?)["']/);
      parameters.wakeWord = match ? match[1] : 'hey google';
    } else if (lower.includes('volume')) {
      action = 'set_volume';
      const match = message.match(/(\d+)/);
      parameters.level = match ? parseInt(match[1]) : 50;
    } else {
      return null;
    }

    return {
      device,
      action,
      parameters,
      steps: [
        `Connect to ${device.name}`,
        `Authenticate with device`,
        `Execute ${action} command`,
        `Verify command executed successfully`
      ],
      requiresPermission: true,
      riskLevel: 'low'
    };
  }

  // Light commands
  if (lower.includes('light') || lower.includes('lamp') || lower.includes('hue')) {
    const device = deviceRegistry.findDeviceByName('light') || {
      id: 'light_1',
      type: 'light' as const,
      brand: 'Philips',
      name: 'Room Light',
      capabilities: ['brightness', 'color', 'power', 'temperature'],
      connected: false
    };

    let action = '';
    let parameters: Record<string, any> = {};

    if (lower.includes('brightness')) {
      action = 'set_brightness';
      const match = message.match(/(\d+)/);
      parameters.level = match ? parseInt(match[1]) : 50;
    } else if (lower.includes('color')) {
      action = 'set_color';
      parameters.color = message.match(/(red|blue|green|yellow|purple|white|orange)/i)?.[1] || 'white';
    } else if (lower.includes('on')) {
      action = 'power_on';
    } else if (lower.includes('off')) {
      action = 'power_off';
    } else {
      return null;
    }

    return {
      device,
      action,
      parameters,
      steps: [
        `Connect to ${device.name}`,
        `Authenticate with device`,
        `Execute ${action} command`,
        `Verify command executed successfully`
      ],
      requiresPermission: true,
      riskLevel: 'low'
    };
  }

  return null;
}

// Generate permission request message
export function generatePermissionMessage(command: DeviceCommand): string {
  const riskEmoji = {
    low: '🟢',
    medium: '🟡',
    high: '🔴'
  };

  let message = `I can help you control your ${command.device.name}.\n\n`;
  message += `**Action:** ${command.action.replace(/_/g, ' ')}\n`;
  if (Object.keys(command.parameters).length > 0) {
    message += `**Parameters:** ${JSON.stringify(command.parameters)}\n`;
  }
  message += `**Risk Level:** ${riskEmoji[command.riskLevel]} ${command.riskLevel.toUpperCase()}\n\n`;
  
  message += `**Steps I'll take:**\n`;
  command.steps.forEach((step, i) => {
    message += `${i + 1}. ${step}\n`;
  });
  
  message += `\n**Do you want me to proceed?** Reply "yes" to execute or "no" to cancel.`;
  
  return message;
}

// Execute device command (simulated)
export async function executeDeviceCommand(command: DeviceCommand): Promise<{ success: boolean; message: string }> {
  // Simulate execution
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In real implementation, this would:
  // 1. Connect to device via API/network
  // 2. Authenticate
  // 3. Send command
  // 4. Wait for response
  // 5. Return result
  
  return {
    success: true,
    message: `✓ Successfully executed ${command.action} on ${command.device.name}`
  };
}

// Permission request manager
class PermissionManager {
  private requests: Map<string, PermissionRequest> = new Map();
  private storageKey = 'openai_permission_requests';

  constructor() {
    this.load();
  }

  private load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        data.forEach((r: any) => {
          this.requests.set(r.id, {
            ...r,
            timestamp: new Date(r.timestamp)
          });
        });
      }
    } catch (e) {
      console.error('Failed to load permission requests:', e);
    }
  }

  private save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.requests.values())));
    } catch (e) {
      console.error('Failed to save permission requests:', e);
    }
  }

  createRequest(command: DeviceCommand): PermissionRequest {
    const request: PermissionRequest = {
      id: `perm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      command,
      timestamp: new Date(),
      granted: null
    };
    this.requests.set(request.id, request);
    this.save();
    return request;
  }

  getRequest(id: string): PermissionRequest | undefined {
    return this.requests.get(id);
  }

  grantPermission(id: string) {
    const request = this.requests.get(id);
    if (request) {
      request.granted = true;
      this.save();
    }
  }

  denyPermission(id: string) {
    const request = this.requests.get(id);
    if (request) {
      request.granted = false;
      this.save();
    }
  }

  getPendingRequests(): PermissionRequest[] {
    return Array.from(this.requests.values()).filter(r => r.granted === null);
  }

  clearOldRequests() {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    Array.from(this.requests.entries()).forEach(([id, request]) => {
      if (request.timestamp < oneDayAgo) {
        this.requests.delete(id);
      }
    });
    this.save();
  }
}

export const permissionManager = new PermissionManager();
