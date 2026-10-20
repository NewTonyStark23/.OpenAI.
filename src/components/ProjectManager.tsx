import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, Clock, MoreVertical } from 'lucide-react';
import type { Project } from '../App';

interface ProjectManagerProps {
  onStartProject: (project: Project) => void;
}

const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Fitness Tracker App',
    phase: 'code',
    createdAt: new Date('2026-01-15'),
    todos: [
      { id: '1', text: 'Design workout logging UI', status: 'done', order: 1 },
      { id: '2', text: 'Implement exercise library', status: 'done', order: 2 },
      { id: '3', text: 'Add progress charts', status: 'in-progress', order: 3 },
      { id: '4', text: 'Build rest timer feature', status: 'pending', order: 4 },
    ],
    memories: [],
  },
  {
    id: '2',
    name: 'E-commerce Store',
    phase: 'brainstorm',
    createdAt: new Date('2026-02-01'),
    todos: [],
    memories: [],
  },
  {
    id: '3',
    name: 'Portfolio Website',
    phase: 'code',
    createdAt: new Date('2026-02-10'),
    todos: [
      { id: '1', text: 'Create hero section', status: 'done', order: 1 },
      { id: '2', text: 'Build project gallery', status: 'done', order: 2 },
      { id: '3', text: 'Add contact form', status: 'done', order: 3 },
      { id: '4', text: 'Deploy to production', status: 'pending', order: 4 },
    ],
    memories: [],
  },
];

export default function ProjectManager({ onStartProject }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: crypto.randomUUID(),
        name: newProjectName.trim(),
        phase: 'brainstorm',
        createdAt: new Date(),
        todos: [],
        memories: [],
      };
      setProjects([newProject, ...projects]);
      setNewProjectName('');
      setShowNewProject(false);
    }
  };

  const getProgress = (project: Project) => {
    if (project.todos.length === 0) return 0;
    const done = project.todos.filter(t => t.status === 'done').length;
    return Math.round((done / project.todos.length) * 100);
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your app projects</p>
        </div>
        <button
          onClick={() => setShowNewProject(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* New Project Form */}
      {showNewProject && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gray-800 rounded-xl p-4 border border-gray-700"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              placeholder="Project name..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              autoFocus
            />
            <button
              onClick={handleCreateProject}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => setShowNewProject(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
            onClick={() => onStartProject(project)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FolderOpen size={18} className="text-purple-400" />
                <h3 className="font-semibold text-white">{project.name}</h3>
              </div>
              <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                <MoreVertical size={14} className="text-gray-400" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                project.phase === 'brainstorm'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-green-500/20 text-green-300'
              }`}>
                {project.phase === 'brainstorm' ? '🧩 Brainstorm' : '💻 Code'}
              </span>
            </div>

            {/* Progress */}
            {project.todos.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{getProgress(project)}%</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${getProgress(project)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              <span>{project.createdAt.toLocaleDateString()}</span>
              {project.todos.length > 0 && (
                <>
                  <span className="mx-1">•</span>
                  <span>{project.todos.filter(t => t.status === 'done').length}/{project.todos.length} tasks</span>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
