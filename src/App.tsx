import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import PreviewPanel from './components/PreviewPanel';
import MindPanel from './components/MindPanel';
import TerminalPanel from './components/TerminalPanel';
import VoiceControls from './components/VoiceControls';
import AuthModal from './components/AuthModal';
import ProjectManager from './components/ProjectManager';
import TemplateLibrary from './components/TemplateLibrary';
import VettingPanel from './components/VettingPanel';

export type PanelView = 'chat' | 'preview' | 'mind' | 'terminal' | 'projects' | 'templates';
export type ProjectPhase = 'brainstorm' | 'code';

export interface Project {
  id: string;
  name: string;
  phase: ProjectPhase;
  createdAt: Date;
  todos: TodoItem[];
  memories: Memory[];
}

export interface TodoItem {
  id: string;
  text: string;
  status: 'pending' | 'in-progress' | 'done';
  order: number;
}

export interface Memory {
  id: string;
  type: 'preference' | 'decision' | 'requirement' | 'lesson';
  content: string;
  tags: string[];
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  language?: string;
}

function App() {
  const [activePanel, setActivePanel] = useState<PanelView>('chat');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectPhase, setProjectPhase] = useState<ProjectPhase>('brainstorm');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [voiceActive, setVoiceActive] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [showVetting, setShowVetting] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentProject(null);
    setMessages([]);
  };

  const handleSendMessage = (content: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: generateAIResponse(content),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const generateAIResponse = (input: string): string => {
    const responses = [
      "I understand what you're looking for. Let me think through this using my RAM graph...\n\n🧠 **Working Memory Active**\n- Analyzing your request\n- Checking Mind section for relevant context\n- Mapping dependencies\n\nBased on what I see, here's my approach:\n1. First, let's clarify the requirements\n2. Then I'll generate the code structure\n3. We'll test it in the dummy terminal\n4. Finally, we'll build and deploy\n\nWhat would you like to adjust?",
      "Great idea! Let me run this through the CRUCIBLE vetting process:\n\n🔥 **Steelman:** This approach has strong fundamentals...\n⚔️ **Skeptic:** Edge case to consider — what about error handling?\n🔧 **Pragmatist:** Timeline looks good with current resources\n🔄 **Contrarian:** Have we considered an alternative approach?\n\n**Verdict: 💎 DIAMOND** — This is solid. Let's proceed.\n\nI've also saved this decision to the Mind section for future reference.",
      "I've detected a potential loop in my reasoning:\n\n🔄 **Loop Detected in RAM Graph:**\n- Step 1: Analyze component\n- Step 2: Check dependencies\n- Step 3: Back to Step 1\n\n**Finding alternate route...**\n\nNew path:\n- Step 1: Map all dependencies first\n- Step 2: Analyze each component with full context\n- Step 3: Generate optimized solution\n\nThis avoids the circular reasoning. Here's the updated plan...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleStartProject = (project: Project) => {
    setCurrentProject(project);
    setActivePanel('chat');
  };

  const handleSwitchPhase = () => {
    if (projectPhase === 'brainstorm') {
      setProjectPhase('code');
      // Generate todos from chat
      if (currentProject) {
        const todos: TodoItem[] = messages
          .filter(m => m.role === 'user')
          .map((m, i) => ({
            id: crypto.randomUUID(),
            text: m.content.substring(0, 60) + (m.content.length > 60 ? '...' : ''),
            status: 'pending' as const,
            order: i + 1,
          }));
        setCurrentProject({ ...currentProject, todos });
      }
    } else {
      setProjectPhase('brainstorm');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-white mb-4">
            Nexus<span className="text-purple-400">AI</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Intelligent App Factory — Build Anything
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-lg font-semibold transition-all hover:scale-105"
          >
            Get Started
          </button>
        </motion.div>
        <AnimatePresence>
          {showAuth && <AuthModal onLogin={handleLogin} onClose={() => setShowAuth(false)} />}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
        currentProject={currentProject}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {currentProject ? currentProject.name : 'NexusAI Platform'}
            </h2>
            {currentProject && (
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  projectPhase === 'brainstorm' 
                    ? 'bg-blue-500/20 text-blue-300' 
                    : 'bg-green-500/20 text-green-300'
                }`}>
                  {projectPhase === 'brainstorm' ? '🧩 Brainstorm' : '💻 Code Mode'}
                </span>
                <button
                  onClick={handleSwitchPhase}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-full text-xs font-medium transition-colors"
                >
                  Switch to {projectPhase === 'brainstorm' ? 'Code' : 'Brainstorm'}
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <VoiceControls
              active={voiceActive}
              setActive={setVoiceActive}
              ttsEnabled={ttsEnabled}
              setTtsEnabled={setTtsEnabled}
            />
            <button
              onClick={() => setShowVetting(!showVetting)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                showVetting ? 'bg-orange-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              🔥 Vetting
            </button>
          </div>
        </div>

        {/* Panel Content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activePanel === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <ChatPanel
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    projectPhase={projectPhase}
                    todos={currentProject?.todos || []}
                  />
                </motion.div>
              )}
              {activePanel === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <PreviewPanel />
                </motion.div>
              )}
              {activePanel === 'mind' && (
                <motion.div
                  key="mind"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <MindPanel memories={currentProject?.memories || []} />
                </motion.div>
              )}
              {activePanel === 'terminal' && (
                <motion.div
                  key="terminal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <TerminalPanel />
                </motion.div>
              )}
              {activePanel === 'projects' && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <ProjectManager onStartProject={handleStartProject} />
                </motion.div>
              )}
              {activePanel === 'templates' && (
                <motion.div
                  key="templates"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <TemplateLibrary onCreateProject={handleStartProject} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Vetting Panel (side panel) */}
          <AnimatePresence>
            {showVetting && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 360, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-gray-700 overflow-hidden"
              >
                <VettingPanel onClose={() => setShowVetting(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && <AuthModal onLogin={handleLogin} onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
