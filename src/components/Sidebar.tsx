import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Eye, Brain, Terminal, FolderOpen, Layout,
  ChevronLeft, ChevronRight, LogOut, Settings, Rocket,
  Activity, Volume2, Wand2, FileCode, Plus, Folder, ChevronDown,
  PanelRight, PanelBottom, Maximize2, Minimize2, Zap, ListTodo, AlertTriangle
} from 'lucide-react';
import type { PanelView, Project, AuthMode } from '../App';

interface SidebarProps {
  activePanel: PanelView;
  setActivePanel: (panel: PanelView) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
  currentProject: Project | null;
  authMode: AuthMode;
  projects: Project[];
  onStartProject: (project: Project) => void;
}

export default function Sidebar({
  activePanel, setActivePanel, collapsed, setCollapsed, onLogout, currentProject, authMode, projects, onStartProject
}: SidebarProps) {
  const [showProjects, setShowProjects] = useState(true);

  return (
    <motion.div
      animate={{ width: collapsed ? 48 : 260 }}
      className="h-full bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col"
    >
      {/* Logo */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-[#2a2a2a]">
        {!collapsed && (
          <h1 className="text-sm font-semibold text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center text-xs">
              AI
            </div>
            OpenAI
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-[#2a2a2a] rounded transition-colors text-gray-400"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Icon Nav (always visible) */}
      <div className={`flex ${collapsed ? 'flex-col' : 'flex-row'} border-b border-[#2a2a2a] ${collapsed ? 'py-2' : 'p-2'} gap-1`}>
        <button
          onClick={() => setActivePanel('chat')}
          className={`p-2 rounded transition-colors ${
            activePanel === 'chat' ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:bg-[#2a2a2a]'
          }`}
          title="Chat"
        >
          <MessageSquare size={16} />
        </button>
        <button
          onClick={() => setActivePanel('preview')}
          className={`p-2 rounded transition-colors ${
            activePanel === 'preview' ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:bg-[#2a2a2a]'
          }`}
          title="Preview"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => setActivePanel('terminal')}
          className={`p-2 rounded transition-colors ${
            activePanel === 'terminal' ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:bg-[#2a2a2a]'
          }`}
          title="Terminal"
        >
          <Terminal size={16} />
        </button>
        {!collapsed && (
          <>
            <button
              onClick={() => setActivePanel('mind')}
              className={`p-2 rounded transition-colors ${
                activePanel === 'mind' ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:bg-[#2a2a2a]'
              }`}
              title="Mind"
            >
              <Brain size={16} />
            </button>
            <button
              onClick={() => setActivePanel('settings')}
              className={`p-2 rounded transition-colors ${
                activePanel === 'settings' ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:bg-[#2a2a2a]'
              }`}
              title="Settings"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => setActivePanel('connectors')}
              className={`p-2 rounded transition-colors ${
                activePanel === 'connectors' ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:bg-[#2a2a2a]'
              }`}
              title="Connectors"
            >
              <Zap size={16} />
            </button>
            <button
              onClick={() => setActivePanel('tasks')}
              className={`p-2 rounded transition-colors ${
                activePanel === 'tasks' ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:bg-[#2a2a2a]'
              }`}
              title="Task Queue"
            >
              <ListTodo size={16} />
            </button>
            <button
              onClick={() => setActivePanel('errors')}
              className={`p-2 rounded transition-colors ${
                activePanel === 'errors' ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:bg-[#2a2a2a]'
              }`}
              title="Error Management"
            >
              <AlertTriangle size={16} />
            </button>
          </>
        )}
      </div>

      {/* Project Explorer (Qwen Code style) */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto">
          {/* Projects Section */}
          <div className="border-b border-[#2a2a2a]">
            <button
              onClick={() => setShowProjects(!showProjects)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:bg-[#2a2a2a]"
            >
              <span>Projects</span>
              <ChevronDown size={12} className={`transition-transform ${showProjects ? '' : '-rotate-90'}`} />
            </button>
            {showProjects && (
              <div className="pb-2">
                {projects.length === 0 ? (
                  <div className="px-3 py-4 text-center">
                    <p className="text-xs text-gray-500 mb-2">No projects yet</p>
                    <button
                      onClick={() => setActivePanel('projects')}
                      className="text-xs text-purple-400 hover:text-purple-300"
                    >
                      + Create Project
                    </button>
                  </div>
                ) : (
                  projects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => onStartProject(project)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                        currentProject?.id === project.id
                          ? 'bg-purple-600/10 text-purple-300'
                          : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200'
                      }`}
                    >
                      <Folder size={14} />
                      <span className="truncate">{project.name}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Current Project Files */}
          {currentProject && (
            <div className="p-2">
              <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {currentProject.name}
              </p>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-400 hover:bg-[#2a2a2a] rounded cursor-pointer">
                  <FileCode size={12} />
                  <span>src/App.tsx</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-400 hover:bg-[#2a2a2a] rounded cursor-pointer">
                  <FileCode size={12} />
                  <span>src/components/</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-400 hover:bg-[#2a2a2a] rounded cursor-pointer">
                  <FileCode size={12} />
                  <span>package.json</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom */}
      <div className="border-t border-[#2a2a2a] p-2">
        {!collapsed && authMode === 'guest' && (
          <div className="px-2 py-1 mb-2 text-xs text-yellow-400 bg-yellow-500/10 rounded">
            👤 Guest Mode
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-gray-400 hover:text-red-400 hover:bg-[#2a2a2a] rounded transition-colors text-sm"
        >
          <LogOut size={14} />
          {!collapsed && <span>{authMode === 'guest' ? 'Exit' : 'Logout'}</span>}
        </button>
      </div>
    </motion.div>
  );
}
