import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Zap, Settings } from 'lucide-react';
import { connectorRegistry, type Connector, createConnector } from '../utils/connectorRegistry';

export default function ConnectorsPanel() {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newConnector, setNewConnector] = useState({
    name: '',
    description: '',
    triggers: '',
    capabilities: '',
    config: '{}'
  });

  useEffect(() => {
    loadConnectors();
  }, []);

  const loadConnectors = () => {
    setConnectors(connectorRegistry.getAll());
  };

  const handleCreate = () => {
    try {
      const config = JSON.parse(newConnector.config);
      createConnector(
        newConnector.name,
        newConnector.description,
        newConnector.triggers.split(',').map(t => t.trim()),
        newConnector.capabilities.split(',').map(c => c.trim()),
        config
      );
      
      setNewConnector({
        name: '',
        description: '',
        triggers: '',
        capabilities: '',
        config: '{}'
      });
      setShowCreateForm(false);
      loadConnectors();
    } catch (error) {
      alert('Invalid JSON in config field');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this connector?')) {
      connectorRegistry.delete(id);
      loadConnectors();
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0d0d0d]">
      {/* Header */}
      <div className="border-b border-[#2a2a2a] p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Connectors</h2>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors flex items-center gap-1"
          >
            <Plus size={14} />
            Create
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Local connectors for device control and automation
        </p>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-b border-[#2a2a2a] p-4 bg-[#1a1a1a]"
        >
          <h3 className="text-sm font-medium text-white mb-3">Create New Connector</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Name</label>
              <input
                type="text"
                value={newConnector.name}
                onChange={(e) => setNewConnector({ ...newConnector, name: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g., Samsung TV, Philips Hue"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Description</label>
              <input
                type="text"
                value={newConnector.description}
                onChange={(e) => setNewConnector({ ...newConnector, description: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                placeholder="What does this connector do?"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Triggers (comma-separated)</label>
              <input
                type="text"
                value={newConnector.triggers}
                onChange={(e) => setNewConnector({ ...newConnector, triggers: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g., tv, television, samsung"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Capabilities (comma-separated)</label>
              <input
                type="text"
                value={newConnector.capabilities}
                onChange={(e) => setNewConnector({ ...newConnector, capabilities: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g., change volume, set picture mode"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Config (JSON)</label>
              <textarea
                value={newConnector.config}
                onChange={(e) => setNewConnector({ ...newConnector, config: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
                rows={4}
                placeholder='{"ip": "192.168.1.100", "port": 8001}'
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!newConnector.name || !newConnector.description}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded transition-colors"
              >
                Create Connector
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Connectors List */}
      <div className="flex-1 overflow-y-auto p-4">
        {connectors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Zap size={48} className="text-gray-700 mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No Connectors Yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create connectors to control devices and services
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
            >
              Create Your First Connector
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {connectors.map(connector => (
              <motion.div
                key={connector.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white mb-1">
                      {connector.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">
                      {connector.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(connector.id)}
                    className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Triggers:</span>
                    <span className="text-gray-300">
                      {connector.triggers.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Capabilities:</span>
                    <span className="text-gray-300">
                      {connector.capabilities.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>Used {connector.usageCount} times</span>
                    {connector.lastUsed && (
                      <>
                        <span>•</span>
                        <span>Last: {connector.lastUsed.toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
