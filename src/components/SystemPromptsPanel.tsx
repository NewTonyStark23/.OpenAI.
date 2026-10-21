import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Edit, Check, X, Download, Upload } from 'lucide-react';
import { getAllSystemPrompts, toggleSystemPrompt, getRuleBook, updateRuleBook, type SystemPrompt } from '../utils/systemPrompt';

export default function SystemPromptsPanel() {
  const [prompts, setPrompts] = useState<SystemPrompt[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = () => {
    setPrompts(getAllSystemPrompts());
  };

  const handleToggle = (id: string) => {
    toggleSystemPrompt(id);
    loadPrompts();
  };

  const handleEdit = (prompt: SystemPrompt) => {
    setEditingId(prompt.id);
    setEditContent(prompt.content);
  };

  const handleSave = () => {
    if (editingId) {
      updateRuleBook(editContent);
      setEditingId(null);
      setEditContent('');
      loadPrompts();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleExport = () => {
    const ruleBook = getRuleBook();
    const blob = new Blob([ruleBook], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'RULE_BOOK.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          updateRuleBook(content);
          loadPrompts();
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="p-4 border-b border-[#1a1a1a]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-purple-400" />
            <h2 className="text-lg font-semibold text-white">AI Rule Book</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="p-2 hover:bg-[#1a1a1a] rounded transition-colors"
              title="Export Rule Book"
            >
              <Download size={16} className="text-gray-400" />
            </button>
            <button
              onClick={handleImport}
              className="p-2 hover:bg-[#1a1a1a] rounded transition-colors"
              title="Import Rule Book"
            >
              <Upload size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          System prompts that define AI behavior and personality. These are automatically injected into every conversation.
        </p>
      </div>

      {/* Prompts List */}
      <div className="flex-1 overflow-y-auto p-4">
        {prompts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
              <p>No system prompts configured</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                className={`bg-[#0f0f0f] border rounded-lg p-4 ${
                  prompt.enabled ? 'border-purple-500/30' : 'border-[#1a1a1a]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-white">{prompt.name}</h3>
                      {prompt.id === 'rule_book' && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                          Core
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>Priority: {prompt.priority}</span>
                      <span>•</span>
                      <span>Updated: {prompt.lastUpdated.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggle(prompt.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        prompt.enabled
                          ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      {prompt.enabled ? 'Active' : 'Inactive'}
                    </button>
                    {prompt.id === 'rule_book' && (
                      <button
                        onClick={() => handleEdit(prompt)}
                        className="p-1.5 hover:bg-[#1a1a1a] rounded transition-colors"
                        title="Edit Rule Book"
                      >
                        <Edit size={14} className="text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                {editingId === prompt.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-96 bg-[#1a1a1a] border border-[#2a2a2a] rounded p-3 text-sm text-white font-mono focus:outline-none focus:border-purple-500"
                      placeholder="Enter system prompt content..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs font-medium transition-colors"
                      >
                        <Check size={14} />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium transition-colors"
                      >
                        <X size={14} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#1a1a1a] rounded p-3 max-h-48 overflow-y-auto">
                    <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono">
                      {prompt.content.substring(0, 500)}
                      {prompt.content.length > 500 && '...'}
                    </pre>
                  </div>
                )}

                {prompt.id === 'rule_book' && (
                  <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
                    <p className="text-xs text-purple-400">
                      💡 This is the core AI personality prompt. It defines the "roided up Claude Opus" mentality and is automatically loaded into every conversation.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#1a1a1a] bg-[#0f0f0f]">
        <p className="text-xs text-gray-500 text-center">
          System prompts are automatically injected into every AI conversation to ensure consistent behavior
        </p>
      </div>
    </div>
  );
}
