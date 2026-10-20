// Connector system - allows AI to create and use connectors dynamically
// Local/personal registry only

export interface Connector {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  capabilities: string[];
  config: Record<string, any>;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
}

export interface ConnectorResult {
  success: boolean;
  message: string;
  data?: any;
}

// Local connector registry (stored in localStorage)
class ConnectorRegistry {
  private connectors: Map<string, Connector> = new Map();
  private storageKey = 'openai_connectors';

  constructor() {
    this.load();
  }

  // Load from localStorage
  private load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        data.forEach((c: any) => {
          this.connectors.set(c.id, { ...c, createdAt: new Date(c.createdAt) });
        });
      }
    } catch (e) {
      console.error('Failed to load connectors:', e);
    }
  }

  // Save to localStorage
  private save() {
    try {
      const data = Array.from(this.connectors.values());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save connectors:', e);
    }
  }

  // Register new connector
  register(connector: Omit<Connector, 'createdAt' | 'usageCount'>): Connector {
    const full: Connector = {
      ...connector,
      createdAt: new Date(),
      usageCount: 0
    };
    this.connectors.set(connector.id, full);
    this.save();
    return full;
  }

  // Get connector by ID
  get(id: string): Connector | undefined {
    return this.connectors.get(id);
  }

  // Get all connectors
  getAll(): Connector[] {
    return Array.from(this.connectors.values());
  }

  // Find connectors by trigger keyword
  findByTrigger(keyword: string): Connector[] {
    const lower = keyword.toLowerCase();
    return this.getAll().filter(c => 
      c.triggers.some(t => lower.includes(t.toLowerCase()))
    );
  }

  // Update usage
  markUsed(id: string) {
    const connector = this.connectors.get(id);
    if (connector) {
      connector.lastUsed = new Date();
      connector.usageCount++;
      this.save();
    }
  }

  // Delete connector
  delete(id: string) {
    this.connectors.delete(id);
    this.save();
  }

  // Clear all
  clear() {
    this.connectors.clear();
    this.save();
  }
}

// Singleton instance
export const connectorRegistry = new ConnectorRegistry();

// Create a new connector dynamically
export function createConnector(
  name: string,
  description: string,
  triggers: string[],
  capabilities: string[],
  config: Record<string, any> = {}
): Connector {
  const id = `connector_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return connectorRegistry.register({
    id,
    name,
    description,
    triggers,
    capabilities,
    config
  });
}

// Execute connector action
export async function executeConnector(
  connectorId: string,
  action: string,
  params: Record<string, any> = {}
): Promise<ConnectorResult> {
  const connector = connectorRegistry.get(connectorId);
  if (!connector) {
    return { success: false, message: 'Connector not found' };
  }

  // Mark as used
  connectorRegistry.markUsed(connectorId);

  // Execute based on connector type
  // This would dispatch to actual implementation
  return {
    success: true,
    message: `Executed ${action} on ${connector.name}`,
    data: { action, params }
  };
}

// Get connector stats
export function getConnectorStats() {
  const all = connectorRegistry.getAll();
  return {
    total: all.length,
    recentlyUsed: all.filter(c => {
      if (!c.lastUsed) return false;
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      return c.lastUsed > dayAgo;
    }).length,
    mostUsed: all.sort((a, b) => b.usageCount - a.usageCount).slice(0, 5)
  };
}
