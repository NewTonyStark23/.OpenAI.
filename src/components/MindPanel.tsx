import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag, Plus, GitBranch, Database, Brain, Zap } from 'lucide-react';
import type { Memory } from '../App';

interface MindPanelProps {
  memories: Memory[];
}

const defaultMemories: Memory[] = [
  {
    id: '1',
    type: 'preference',
    content: 'User prefers dark mode for all applications',
    tags: ['design', 'ui'],
    createdAt: new Date('2026-01-15'),
  },
  {
    id: '2',
    type: 'decision',
    content: 'Using React Native over Flutter for cross-platform apps',
    tags: ['framework', 'architecture'],
    createdAt: new Date('2026-01-20'),
  },
  {
    id: '3',
    type: 'requirement',
    content: 'All apps must support offline-first with sync when online',
    tags: ['backend', 'feature'],
    createdAt: new Date('2026-02-01'),
  },
  {
    id: '4',
    type: 'lesson',
    content: 'Always add error boundaries in React components',
    tags: ['react', 'best-practice'],
    createdAt: new Date('2026-02-10'),
  },
  {
    id: '5',
    type: 'preference',
    content: 'User prefers minimal UI with accent colors',
    tags: ['design', 'style'],
    createdAt: new Date('2026-02-15'),
  },
];

export default function MindPanel({ memories: propMemories }: MindPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');

  const memories = propMemories.length > 0 ? propMemories : defaultMemories;
  const allTags = [...new Set(memories.flatMap(m => m.tags))];

  const filteredMemories = memories.filter(m => {
    const matchesSearch = m.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || m.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const getTypeIcon = (type: Memory['type']) => {
    switch (type) {
      case 'preference': return '⭐';
      case 'decision': return '✅';
      case 'requirement': return '📋';
      case 'lesson': return '💡';
    }
  };

  const getTypeColor = (type: Memory['type']) => {
    switch (type) {
      case 'preference': return 'text-yellow-400';
      case 'decision': return 'text-green-400';
      case 'requirement': return 'text-blue-400';
      case 'lesson': return 'text-purple-400';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain size={20} className="text-purple-400" />
            <h3 className="text-lg font-semibold">Mind Section</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Database size={12} /> xerj Graph
            </span>
            <button
              onClick={() => setShowAddMemory(!showAddMemory)}
              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search memories..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                selectedTag === tag
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Add Memory / Import Repo */}
      {showAddMemory && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-b border-gray-700 p-4 bg-gray-800/50"
        >
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Add Memory</label>
              <textarea
                placeholder="What should I remember?"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none h-20"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block flex items-center gap-1">
                <GitBranch size={12} /> Import Repo as Mind
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={repoUrl}
                  onChange={e => setRepoUrl(e.target.value)}
                  placeholder="github.com/user/repo"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-medium transition-colors">
                  Import
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Memory Stats */}
      <div className="px-4 py-2 border-b border-gray-700 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Zap size={12} className="text-yellow-400" />
          {memories.length} atomic memories
        </span>
        <span className="flex items-center gap-1">
          <Tag size={12} className="text-blue-400" />
          {allTags.length} tags
        </span>
        <span className="flex items-center gap-1">
          <GitBranch size={12} className="text-green-400" />
          Graph connected
        </span>
      </div>

      {/* Memories List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredMemories.map(memory => (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">{getTypeIcon(memory.type)}</span>
              <div className="flex-1">
                <p className="text-sm text-gray-200">{memory.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs ${getTypeColor(memory.type)}`}>
                    {memory.type}
                  </span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-500">
                    {memory.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {memory.tags.map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-gray-700 rounded text-xs text-gray-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
