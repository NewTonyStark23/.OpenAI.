import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Download, Upload, Trash2, Filter, Search } from 'lucide-react';
import { errorCapture, type CapturedError } from '../utils/errorCapture';
import { errorAnalysis, type ErrorAnalysis, type SelfUpdate } from '../utils/errorAnalysis';
import { errorAPI } from '../utils/errorAPI';

export default function ErrorManagementPanel() {
  const [errors, setErrors] = useState<CapturedError[]>([]);
  const [analyses, setAnalyses] = useState<Map<string, ErrorAnalysis>>(new Map());
  const [updates, setUpdates] = useState<SelfUpdate[]>([]);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterResolved, setFilterResolved] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedError, setSelectedError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'errors' | 'updates' | 'cli'>('errors');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setErrors(errorCapture.getAll());
    setUpdates(errorAnalysis.getUpdates());
  };

  const handleAnalyze = (errorId: string) => {
    const analysis = errorAnalysis.analyzeError(errors.find(e => e.id === errorId)!);
    setAnalyses(prev => new Map(prev).set(errorId, analysis));
  };

  const handleResolve = (errorId: string, resolution: string) => {
    errorCapture.resolve(errorId, resolution);
    loadData();
  };

  const handleApplyUpdate = (updateId: string) => {
    errorAnalysis.markUpdateApplied(updateId);
    loadData();
  };

  const handleExport = () => {
    const data = errorCapture.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-log-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('Clear all errors? This cannot be undone.')) {
      errorCapture.clear();
      loadData();
    }
  };

  const handleClearResolved = () => {
    errorCapture.clearResolved();
    loadData();
  };

  // Filter errors
  const filteredErrors = errors.filter(error => {
    if (filterSource !== 'all' && error.source !== filterSource) return false;
    if (filterSeverity !== 'all' && error.severity !== filterSeverity) return false;
    if (filterResolved === 'resolved' && !error.resolved) return false;
    if (filterResolved === 'unresolved' && error.resolved) return false;
    if (searchQuery && !error.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = errorCapture.getStats();
  const updateStats = errorAnalysis.getUpdateStats();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-semibold text-white">Error Management</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="p-2 hover:bg-[#1a1a1a] rounded transition-colors"
            title="Export"
          >
            <Download className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={handleClearResolved}
            className="p-2 hover:bg-[#1a1a1a] rounded transition-colors"
            title="Clear Resolved"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
          </button>
          <button
            onClick={handleClear}
            className="p-2 hover:bg-[#1a1a1a] rounded transition-colors"
            title="Clear All"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 p-4 border-b border-[#1a1a1a]">
        <div className="bg-[#0f0f0f] rounded p-3">
          <div className="text-xs text-gray-500 mb-1">Total</div>
          <div className="text-xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#0f0f0f] rounded p-3">
          <div className="text-xs text-gray-500 mb-1">Unresolved</div>
          <div className="text-xl font-bold text-orange-400">{stats.unresolved}</div>
        </div>
        <div className="bg-[#0f0f0f] rounded p-3">
          <div className="text-xs text-gray-500 mb-1">Critical</div>
          <div className="text-xl font-bold text-red-400">{stats.bySeverity.critical}</div>
        </div>
        <div className="bg-[#0f0f0f] rounded p-3">
          <div className="text-xs text-gray-500 mb-1">Updates</div>
          <div className="text-xl font-bold text-purple-400">{updateStats.pending}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1a1a1a]">
        <button
          onClick={() => setActiveTab('errors')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'errors'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Errors ({filteredErrors.length})
        </button>
        <button
          onClick={() => setActiveTab('updates')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'updates'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Self-Updates ({updateStats.pending})
        </button>
        <button
          onClick={() => setActiveTab('cli')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'cli'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          CLI
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'errors' && (
          <>
            {/* Filters */}
            <div className="p-4 border-b border-[#1a1a1a] space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search errors..."
                  className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border border-[#1a1a1a] rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#0f0f0f] border border-[#1a1a1a] rounded text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Sources</option>
                  <option value="terminal">Terminal</option>
                  <option value="preview">Preview</option>
                  <option value="code-generation">Code Generation</option>
                  <option value="device-control">Device Control</option>
                  <option value="task-queue">Task Queue</option>
                  <option value="connector">Connector</option>
                </select>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#0f0f0f] border border-[#1a1a1a] rounded text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={filterResolved}
                  onChange={(e) => setFilterResolved(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#0f0f0f] border border-[#1a1a1a] rounded text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="resolved">Resolved</option>
                  <option value="unresolved">Unresolved</option>
                </select>
              </div>
            </div>

            {/* Error List */}
            <div className="flex-1 overflow-y-auto">
              {filteredErrors.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No errors found</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {filteredErrors.map((error) => {
                    const analysis = analyses.get(error.id);
                    const isSelected = selectedError === error.id;

                    return (
                      <div
                        key={error.id}
                        className={`p-4 rounded border ${
                          error.resolved
                            ? 'border-green-500/30 bg-green-500/5'
                            : 'border-[#1a1a1a] bg-[#0f0f0f]'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            {error.resolved ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`px-2 py-0.5 rounded text-xs border ${getSeverityColor(error.severity)}`}>
                              {error.severity}
                            </span>
                            <span className="text-xs text-gray-500">{error.source}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {!error.resolved && (
                              <button
                                onClick={() => handleAnalyze(error.id)}
                                className="p-1.5 hover:bg-[#1a1a1a] rounded transition-colors"
                                title="Analyze"
                              >
                                <RefreshCw className="w-4 h-4 text-purple-400" />
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedError(isSelected ? null : error.id)}
                              className="text-xs text-gray-500 hover:text-gray-300"
                            >
                              {isSelected ? '▼' : '▶'}
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-white mb-1">{error.message}</p>
                        <p className="text-xs text-gray-500">
                          {error.timestamp.toLocaleString()}
                        </p>

                        {error.resolved && error.resolution && (
                          <div className="mt-2 p-2 bg-green-500/10 rounded text-xs text-green-400">
                            ✓ {error.resolution}
                          </div>
                        )}

                        {/* Analysis */}
                        {isSelected && analysis && (
                          <div className="mt-3 pt-3 border-t border-[#1a1a1a] space-y-2">
                            <div>
                              <div className="text-xs font-medium text-gray-400 mb-1">Root Cause</div>
                              <div className="text-sm text-white">{analysis.rootCause}</div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-400 mb-1">Suggested Fix</div>
                              <div className="text-sm text-blue-400">{analysis.suggestedFix}</div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-400 mb-1">Confidence</div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-purple-500"
                                    style={{ width: `${analysis.confidence}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-400">{analysis.confidence}%</span>
                              </div>
                            </div>
                            {analysis.preventionTips.length > 0 && (
                              <div>
                                <div className="text-xs font-medium text-gray-400 mb-1">Prevention Tips</div>
                                <ul className="text-xs text-gray-400 space-y-1">
                                  {analysis.preventionTips.map((tip, i) => (
                                    <li key={i}>• {tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {!error.resolved && (
                              <button
                                onClick={() => {
                                  const resolution = prompt('Enter resolution:');
                                  if (resolution) handleResolve(error.id, resolution);
                                }}
                                className="w-full mt-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                              >
                                Mark as Resolved
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'updates' && (
          <div className="flex-1 overflow-y-auto p-4">
            {updates.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <RefreshCw className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No self-updates yet</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    className={`p-4 rounded border ${
                      update.applied
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-purple-500/30 bg-purple-500/5'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {update.applied ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <RefreshCw className="w-4 h-4 text-purple-500" />
                        )}
                        <span className="text-xs text-gray-500">{update.type}</span>
                      </div>
                      {!update.applied && (
                        <button
                          onClick={() => handleApplyUpdate(update.id)}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-white mb-1">{update.description}</p>
                    <p className="text-xs text-gray-500">
                      {update.timestamp.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cli' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-[#0f0f0f] rounded p-4 font-mono text-xs text-gray-400">
              <div className="mb-4">
                <div className="text-green-400 mb-2">$ Error Management CLI</div>
                <div className="text-gray-500">Type commands to manage errors programmatically</div>
              </div>
              <div className="space-y-2">
                <div className="text-purple-400">Available Commands:</div>
                <div>• submit &lt;source&gt; &lt;type&gt; &lt;severity&gt; &lt;message&gt;</div>
                <div>• get &lt;errorId&gt;</div>
                <div>• list [filters]</div>
                <div>• resolve &lt;errorId&gt; &lt;resolution&gt;</div>
                <div>• analyze &lt;errorId&gt;</div>
                <div>• analyze-all</div>
                <div>• stats</div>
                <div>• updates</div>
                <div>• export</div>
                <div>• clear</div>
                <div>• help</div>
              </div>
              <div className="mt-4 text-yellow-400">
                Note: CLI integration requires backend server setup.
                <br />
                See SETUP_GUIDE.md for instructions.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
