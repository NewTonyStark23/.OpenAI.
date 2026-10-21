import { motion } from 'framer-motion';
import { Layout, Smartphone, Globe, ShoppingCart, MessageSquare, Camera, Music, BarChart3, Dumbbell, Utensils, BookOpen, Map, Gamepad2, Users } from 'lucide-react';
import type { Project } from '../App';

interface TemplateLibraryProps {
  onCreateProject: (project: Project) => void;
}

const templates = [
  { id: 'todo', name: 'Todo/Task App', icon: BookOpen, color: 'bg-blue-500/20 text-blue-300', desc: 'Task management with categories and due dates' },
  { id: 'chat', name: 'Chat/Messaging', icon: MessageSquare, color: 'bg-green-500/20 text-green-300', desc: 'Real-time messaging with contacts and groups' },
  { id: 'ecommerce', name: 'E-commerce Store', icon: ShoppingCart, color: 'bg-purple-500/20 text-purple-300', desc: 'Product catalog, cart, and checkout flow' },
  { id: 'gallery', name: 'Photo Gallery', icon: Camera, color: 'bg-pink-500/20 text-pink-300', desc: 'Image uploads, albums, and lightbox viewer' },
  { id: 'music', name: 'Music Player', icon: Music, color: 'bg-red-500/20 text-red-300', desc: 'Audio playback with playlists and equalizer' },
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3, color: 'bg-yellow-500/20 text-yellow-300', desc: 'Analytics dashboard with charts and metrics' },
  { id: 'fitness', name: 'Fitness Tracker', icon: Dumbbell, color: 'bg-orange-500/20 text-orange-300', desc: 'Workout logging, progress charts, rest timer' },
  { id: 'food', name: 'Food Delivery', icon: Utensils, color: 'bg-amber-500/20 text-amber-300', desc: 'Restaurant listings, ordering, and tracking' },
  { id: 'notes', name: 'Note-taking App', icon: BookOpen, color: 'bg-teal-500/20 text-teal-300', desc: 'Rich text editor with folders and search' },
  { id: 'maps', name: 'Location/Maps', icon: Map, color: 'bg-emerald-500/20 text-emerald-300', desc: 'Map integration with markers and routes' },
  { id: 'game', name: 'Simple Game', icon: Gamepad2, color: 'bg-indigo-500/20 text-indigo-300', desc: 'Casual game with score tracking' },
  { id: 'social', name: 'Social Feed', icon: Users, color: 'bg-cyan-500/20 text-cyan-300', desc: 'Posts, likes, comments, and profiles' },
];

export default function TemplateLibrary({ onCreateProject }: TemplateLibraryProps) {
  const handleSelectTemplate = (template: typeof templates[0]) => {
    const project: Project = {
      id: crypto.randomUUID(),
      name: template.name,
      phase: 'brainstorm',
      createdAt: new Date(),
      todos: [],
      memories: [],
    };
    onCreateProject(project);
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Template Library</h2>
        <p className="text-gray-400 text-sm mt-1">
          Start from a pre-built template or create from scratch
        </p>
      </div>

      {/* Mobile/Windows Templates */}
      <div className="mb-4 flex items-center gap-2">
        <Smartphone size={16} className="text-green-400" />
        <span className="text-sm font-medium text-gray-300">Mobile & Desktop Templates</span>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {templates.map(template => {
          const Icon = template.icon;
          return (
            <motion.button
              key={template.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectTemplate(template)}
              className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${template.color}`}>
                  <Icon size={20} />
                </div>
                <h4 className="font-medium text-white text-sm">{template.name}</h4>
              </div>
              <p className="text-xs text-gray-400">{template.desc}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-400">React Native</span>
                <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-400">Flutter</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Web Templates */}
      <div className="mb-4 flex items-center gap-2">
        <Globe size={16} className="text-blue-400" />
        <span className="text-sm font-medium text-gray-300">Web App Templates</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Landing Page', desc: 'Hero section, features, CTA' },
          { name: 'Blog Platform', desc: 'Articles, categories, comments' },
          { name: 'SaaS Dashboard', desc: 'User management, billing, analytics' },
        ].map(template => (
          <motion.button
            key={template.name}
            whileHover={{ scale: 1.03 }}
            className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all text-left"
          >
            <h4 className="font-medium text-white text-sm mb-1">{template.name}</h4>
            <p className="text-xs text-gray-400">{template.desc}</p>
            <span className="inline-block mt-3 px-2 py-0.5 bg-blue-500/20 rounded text-xs text-blue-300">
              React + Tailwind
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
