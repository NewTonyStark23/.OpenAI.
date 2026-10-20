import { motion } from 'framer-motion';
import {
  MessageSquare, Eye, Brain, Terminal, FolderOpen, Layout,
  ChevronLeft, ChevronRight, LogOut, Mic
} from 'lucide-react';
import type { PanelView, Project } from '../App';

interface SidebarProps {
  activePanel: PanelView;
  setActivePanel: (panel: PanelView) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
  currentProject: Project | null;
}

const navItems: { id: PanelView; icon: typeof MessageSquare; label: string }[] = [
  { id: 'chat', icon: MessageSquare, label: 'Chat' },
  { id: 'preview', icon: Eye, label: 'Preview' },
  { id: 'mind', icon: Brain, label: 'Mind' },
  { id: 'terminal', icon: Terminal, label: 'Terminal' },
  { id: 'projects', icon: FolderOpen, label: 'Projects' },
  { id: 'templates', icon: Layout, label: 'Templates' },
];

export default function Sidebar({
  activePanel, setActivePanel, collapsed, setCollapsed, onLogout, currentProject
}: SidebarProps) {
  return (
    <motion.div
      animate={{ width: collapsed ? 64 : 220 }}
      className="h-full bg-gray-800 border-r border-gray-700 flex flex-col"
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-700">
        {!collapsed && (
          <h1 className="text-lg font-bold">
            Nexus<span className="text-purple-400">AI</span>
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Current Project */}
      {!collapsed && currentProject && (
        <div className="px-4 py-3 border-b border-gray-700">
          <p className="text-xs text-gray-400">Current Project</p>
          <p className="text-sm font-medium truncate">{currentProject.name}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? 'bg-purple-600/20 text-purple-300 border-r-2 border-purple-400'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 p-4">
        {!collapsed && (
          <div className="mb-3 p-3 bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Mic size={14} className="text-green-400" />
              <span className="text-xs text-green-400">Voice Ready</span>
            </div>
            <p className="text-xs text-gray-400">KittenTTS + Whistle</p>
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-2 py-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-700"
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </motion.div>
  );
}
