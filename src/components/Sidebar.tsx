import { motion } from 'framer-motion';
import {
  MessageSquare, Eye, Brain, Terminal, FolderOpen, Layout,
  ChevronLeft, ChevronRight, LogOut, Mic, Settings, Rocket,
  Activity, Volume2, Wand2, User
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
}

const navItems: { id: PanelView; icon: typeof MessageSquare; label: string; section: string }[] = [
  { id: 'chat', icon: MessageSquare, label: 'Chat', section: 'Core' },
  { id: 'preview', icon: Eye, label: 'Preview', section: 'Core' },
  { id: 'mind', icon: Brain, label: 'Mind', section: 'Core' },
  { id: 'terminal', icon: Terminal, label: 'Terminal', section: 'Core' },
  { id: 'projects', icon: FolderOpen, label: 'Projects', section: 'Core' },
  { id: 'templates', icon: Layout, label: 'Templates', section: 'Core' },
  { id: 'build', icon: Rocket, label: 'Build', section: 'Tools' },
  { id: 'ram', icon: Activity, label: 'RAM Graph', section: 'Tools' },
  { id: 'voice', icon: Volume2, label: 'Voice', section: 'Tools' },
  { id: 'autocorrect', icon: Wand2, label: 'Autocorrect', section: 'Tools' },
  { id: 'settings', icon: Settings, label: 'Settings', section: 'System' },
];

export default function Sidebar({
  activePanel, setActivePanel, collapsed, setCollapsed, onLogout, currentProject, authMode
}: SidebarProps) {
  const sections = [...new Set(navItems.map(item => item.section))];

  return (
    <motion.div
      animate={{ width: collapsed ? 64 : 220 }}
      className="h-full bg-gray-800 border-r border-gray-700 flex flex-col"
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-700">
        {!collapsed && (
          <h1 className="text-lg font-bold">
            Open<span className="text-purple-400">AI</span>
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
      <nav className="flex-1 py-2 overflow-y-auto">
        {sections.map(section => (
          <div key={section} className="mb-2">
            {!collapsed && (
              <p className="px-4 py-1 text-xs text-gray-500 uppercase tracking-wider">{section}</p>
            )}
            {navItems.filter(item => item.section === section).map(item => {
              const Icon = item.icon;
              const isActive = activePanel === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border-r-2 border-purple-400'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 p-4">
        {!collapsed && (
          <>
            {/* User Status */}
            <div className="mb-3 p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                {authMode === 'guest' ? (
                  <>
                    <User size={14} className="text-yellow-400" />
                    <span className="text-xs text-yellow-300">Guest Mode</span>
                  </>
                ) : (
                  <>
                    <Mic size={14} className="text-green-400" />
                    <span className="text-xs text-green-400">Signed In</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {authMode === 'guest'
                  ? 'Data stored locally'
                  : 'KittenTTS + Whistle'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-gray-600 rounded text-xs text-gray-300">🪡 Needle</span>
                <span className="px-1.5 py-0.5 bg-gray-600 rounded text-xs text-gray-300">🧠 xerj</span>
              </div>
            </div>
          </>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-2 py-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-700"
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm">{authMode === 'guest' ? 'Exit Guest' : 'Logout'}</span>}
        </button>
      </div>
    </motion.div>
  );
}
