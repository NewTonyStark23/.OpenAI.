import { useState } from 'react';
import { GitBranch, Plus, Trash2, Download, Upload, RefreshCw, ExternalLink, Folder, FileCode } from 'lucide-react';

interface Repo {
  id: string;
  name: string;
  url: string;
  branch: string;
  lastSync: Date;
  status: 'connected' | 'syncing' | 'error';
}

export default function ConnectorsPanel() {
  const [repos, setRepos] = useState<Repo[]>([
    {
      id: '1',
      name: 'openai-platform',
      url: 'https://github.com/user/openai-platform',
      branch: 'main',
      lastSync: new Date(),
      status: 'connected'
    }
  ]);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [newRepoBranch, setNewRepoBranch] = useState('main');

  const handleAddRepo = () => {
    if (newRepoUrl.trim()) {
      const newRepo: Repo = {
        id: Date.now().toString(),
        name: newRepoUrl.split('/').pop() || 'repo',
        url: newRepoUrl,
        branch: newRepoBranch,
        lastSync: new Date(),
        status: 'connected'
      };
      setRepos([...repos, newRepo]);
      setNewRepoUrl('');
      setNewRepoBranch('main');
      setShowAddRepo(false);
    }
  };

  const handleRemoveRepo = (id: string) => {
    setRepos(repos.filter(r => r.id !== id));
  };

  const handleSyncRepo = (id: string) => {
    setRepos(repos.map(r => 
      r.id === id ? { ...r, status: 'syncing' as const, lastSync: new Date() } : r
    ));
    // Simulate sync
    setTimeout(() => {
      setRepos(repos.map(r => 
        r.id === id ? { ...r, status: 'connected' as const } : r
      ));
    }, 2000);
  };

  const getStatusColor = (status: Repo['status']) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'syncing': return 'text-yellow-400';
      case 'error': return 'text-red-400';
    }
  };

  const getStatusIcon = (status: Repo['status']) => {
    switch (status) {
      case 'connected': return <div className="w-2 h-2 bg-green-400 rounded-full" />;
      case 'syncing': return <RefreshCw size={12} className="text-yellow-400 animate-spin" />;
      case 'error': return <div className="w-2 h-2 bg-red-400 rounded-full" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="p-4 border-b border-[#1a1a1a]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <GitBranch size={20} className="text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Repository Manager</h2>
          </div>
          <button
            onClick={() => setShowAddRepo(!showAddRepo)}
            className="p-2 hover:bg-[#1a1a1a] rounded transition-colors"
            title="Add Repository"
          >
            <Plus size={16} className="text-gray-400" />
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Connect GitHub repositories to manage code, upload, download, and sync
        </p>
      </div>

      {/* Add Repo Form */}
      {showAddRepo && (
        <div className="p-4 border-b border-[#1a1a1a] bg-[#0f0f0f]">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Repository URL</label>
              <input
                type="text"
                value={newRepoUrl}
                onChange={(e) => setNewRepoUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Branch</label>
              <input
                type="text"
                value={newRepoBranch}
                onChange={(e) => setNewRepoBranch(e.target.value)}
                placeholder="main"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddRepo}
                disabled={!newRepoUrl.trim()}
                className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 rounded text-sm font-medium transition-colors"
              >
                Connect Repository
              </button>
              <button
                onClick={() => setShowAddRepo(false)}
                className="px-3 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Repo List */}
      <div className="flex-1 overflow-y-auto p-4">
        {repos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <GitBranch size={48} className="text-gray-700 mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No Repositories Connected</h3>
            <p className="text-sm text-gray-500 mb-4">
              Connect a GitHub repository to manage your code
            </p>
            <button
              onClick={() => setShowAddRepo(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition-colors"
            >
              Connect Repository
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {repos.map(repo => (
              <div
                key={repo.id}
                className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-4 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Folder size={16} className="text-purple-400" />
                      <h3 className="text-sm font-medium text-white">{repo.name}</h3>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(repo.status)}
                        <span className={`text-xs ${getStatusColor(repo.status)}`}>
                          {repo.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <GitBranch size={12} />
                      <span>{repo.branch}</span>
                      <span>•</span>
                      <span>Last sync: {repo.lastSync.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSyncRepo(repo.id)}
                      disabled={repo.status === 'syncing'}
                      className="p-1.5 hover:bg-[#1a1a1a] rounded transition-colors disabled:opacity-50"
                      title="Sync Repository"
                    >
                      <RefreshCw size={14} className="text-gray-400" />
                    </button>
                    <button
                      onClick={() => window.open(repo.url, '_blank')}
                      className="p-1.5 hover:bg-[#1a1a1a] rounded transition-colors"
                      title="Open in Browser"
                    >
                      <ExternalLink size={14} className="text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleRemoveRepo(repo.id)}
                      className="p-1.5 hover:bg-[#1a1a1a] rounded transition-colors"
                      title="Remove Repository"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-3 border-t border-[#1a1a1a]">
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded text-xs text-gray-400 transition-colors">
                    <Download size={12} />
                    Pull
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded text-xs text-gray-400 transition-colors">
                    <Upload size={12} />
                    Push
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded text-xs text-gray-400 transition-colors">
                    <FileCode size={12} />
                    Files
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#1a1a1a] bg-[#0f0f0f]">
        <p className="text-xs text-gray-500 text-center">
          💡 Tip: You can also manage repos via chat commands like "push to main" or "pull latest"
        </p>
      </div>
    </div>
  );
}
