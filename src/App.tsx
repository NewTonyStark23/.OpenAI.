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
import SettingsPanel from './components/SettingsPanel';
import BuildPipeline from './components/BuildPipeline';
import RamGraphStatus from './components/RamGraphStatus';
import VoiceConversation from './components/VoiceConversation';
import AutocorrectPanel from './components/AutocorrectPanel';

export type PanelView = 'chat' | 'preview' | 'mind' | 'terminal' | 'projects' | 'templates' | 'settings' | 'build' | 'ram' | 'voice' | 'autocorrect';
export type ProjectPhase = 'brainstorm' | 'code';
export type AuthMode = 'logged-in' | 'guest' | 'none';

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
  const [authMode, setAuthMode] = useState<AuthMode>('none');
  const [showAuth, setShowAuth] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectPhase, setProjectPhase] = useState<ProjectPhase>('brainstorm');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [voiceActive, setVoiceActive] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [showVetting, setShowVetting] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = () => {
    setAuthMode('logged-in');
    setShowAuth(false);
  };

  const handleGuest = () => {
    setAuthMode('guest');
    setShowAuth(false);
  };

  const handleLogout = () => {
    setAuthMode('none');
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

  // Landing / Auth screen
  if (authMode === 'none') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">
            Open<span className="text-purple-400">AI</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-2">
            Intelligent App Factory
          </p>
          <p className="text-sm text-gray-500 mb-8 max-w-lg mx-auto">
            Build Android apps, Windows apps, and web apps — all from conversation.
            100% free, unlimited, local-first. No account required.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['🧠 Persistent Memory', '🔥 CRUCIBLE Vetting', '🎤 Voice Chat', '📱 App Factory', '🪡 Needle AI', '🖥️ Sandbox Terminal'].map(feature => (
              <span key={feature} className="px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-full text-xs text-gray-400">
                {feature}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowAuth(true)}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Sign In / Sign Up
            </button>
            <button
              onClick={handleGuest}
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-lg font-semibold transition-all hover:scale-105 border border-gray-600"
            >
              Continue Without Login →
            </button>
          </div>

          <p className="text-xs text-gray-600 mt-6">
            Guest mode: All data stored locally on your device. No sign-up needed.
          </p>
        </motion.div>
        <AnimatePresence>
          {showAuth && <AuthModal onLogin={handleLogin} onGuest={handleGuest} onClose={() => setShowAuth(false)} />}
        </AnimatePresence>
      </div>
    );
  }

  const renderPanel = () => {
    switch (activePanel) {
      case 'chat':
        return <ChatPanel messages={messages} onSendMessage={handleSendMessage} projectPhase={projectPhase} todos={currentProject?.todos || []} />;
      case 'preview':
        return <PreviewPanel />;
      case 'mind':
        return <MindPanel memories={currentProject?.memories || []} />;
      case 'terminal':
        return <TerminalPanel />;
      case 'projects':
        return <ProjectManager onStartProject={handleStartProject} />;
      case 'templates':
        return <TemplateLibrary onCreateProject={handleStartProject} />;
      case 'settings':
        return <SettingsPanel />;
      case 'build':
        return <BuildPipeline />;
      case 'ram':
        return <RamGraphStatus />;
      case 'voice':
        return <VoiceConversation active={voiceActive} setActive={setVoiceActive} ttsEnabled={ttsEnabled} setTtsEnabled={setTtsEnabled} />;
      case 'autocorrect':
        return <AutocorrectPanel />;
      default:
        return <ChatPanel messages={messages} onSendMessage={handleSendMessage} projectPhase={projectPhase} todos={currentProject?.todos || []} />;
    }
  };

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
        authMode={authMode}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {currentProject ? currentProject.name : 'OpenAI Platform'}
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
            {authMode === 'guest' && (
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">
                👤 Guest Mode
              </span>
            )}
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
              <motion.div
                key={activePanel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                {renderPanel()}
              </motion.div>
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
        {showAuth && <AuthModal onLogin={handleLogin} onGuest={handleGuest} onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
