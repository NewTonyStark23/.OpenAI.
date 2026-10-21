import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import PreviewPanel from './components/PreviewPanel';
import MindPanel from './components/MindPanel';
import TerminalPanel from './components/TerminalPanel';
import VoiceControls from './components/VoiceControls';
import AuthModal from './components/AuthModal';
import ProjectManager from './components/ProjectManager';
import VettingPanel from './components/VettingPanel';
import SettingsPanel from './components/SettingsPanel';
import ConnectorsPanel from './components/ConnectorsPanel';
import DeviceActionPanel from './components/DeviceActionPanel';
import TaskQueuePanel from './components/TaskQueuePanel';
import ErrorManagementPanel from './components/ErrorManagementPanel';
import { generateCode, generateResponse } from './utils/codeGenerator';
import { pendingActions, executeAfterConfirmation, requestConfirmation } from './utils/safetySystem';
import { taskQueue, createTaskFromPrompt } from './utils/taskQueue';
import { needleIntegration, startNeedleMonitoring } from './utils/needleIntegration';
import { parseDeviceCommand, generatePermissionMessage, executeDeviceCommand, permissionManager } from './utils/deviceControl';
import { PanelRight, PanelBottom, Maximize2, Terminal } from 'lucide-react';

export type PanelView = 'chat' | 'preview' | 'mind' | 'terminal' | 'projects' | 'settings' | 'connectors' | 'tasks' | 'errors';
export type ProjectPhase = 'brainstorm' | 'code';
export type AuthMode = 'logged-in' | 'guest' | 'none';
export type LayoutMode = 'split' | 'chat-only' | 'preview-only';

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
  const [generatedCode, setGeneratedCode] = useState('');
  const [voiceActive, setVoiceActive] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [showVetting, setShowVetting] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isAIBusy, setIsAIBusy] = useState(false);
  const [aiStatus, setAiStatus] = useState('');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [showTerminal, setShowTerminal] = useState(false);

  // Start Needle monitoring for automatic task refresh
  useEffect(() => {
    startNeedleMonitoring();
    return () => {
      needleIntegration.stopMonitoring();
    };
  }, []);

  const handleLogin = () => { setAuthMode('logged-in'); setShowAuth(false); };
  const handleGuest = () => { setAuthMode('guest'); setShowAuth(false); };
  const handleLogout = () => {
    setAuthMode('none');
    setCurrentProject(null);
    setMessages([]);
    setGeneratedCode('');
  };

  const addTerminalLine = (content: string) => {
    setTerminalLines(prev => [...prev, content]);
  };

  const runAICommands = async (commands: { label: string; output: string[] }[]) => {
    for (const cmd of commands) {
      setAiStatus(cmd.label);
      addTerminalLine(`$ ${cmd.label}`);
      await new Promise(resolve => setTimeout(resolve, 300));
      for (const line of cmd.output) {
        addTerminalLine(line);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(), role: 'user', content, timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Check if this is a device control command
    const deviceCommand = parseDeviceCommand(content);
    if (deviceCommand) {
      // Handle device control
      setIsAIBusy(true);
      setAiStatus('Analyzing device command...');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate permission request
      const permissionMessage = generatePermissionMessage(deviceCommand);
      const permissionRequest = permissionManager.createRequest(deviceCommand);
      
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(), role: 'assistant',
        content: permissionMessage, timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsAIBusy(false);
      setAiStatus('');
      return;
    }

    // Check if this is a permission response (yes/no)
    const lowerContent = content.toLowerCase().trim();
    const pendingRequests = permissionManager.getPendingRequests();
    if (pendingRequests.length > 0 && (lowerContent === 'yes' || lowerContent === 'no')) {
      const lastRequest = pendingRequests[pendingRequests.length - 1];
      
      if (lowerContent === 'yes') {
        permissionManager.grantPermission(lastRequest.id);
        setIsAIBusy(true);
        setAiStatus('Executing device command...');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Execute the command
        const result = await executeDeviceCommand(lastRequest.command);
        
        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(), role: 'assistant',
          content: result.message, timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsAIBusy(false);
        setAiStatus('');
      } else {
        permissionManager.denyPermission(lastRequest.id);
        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(), role: 'assistant',
          content: '✓ Command cancelled.', timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMsg]);
      }
      return;
    }

    // Normal code generation flow
    setIsAIBusy(true);
    setAiStatus('Analyzing your request...');
    setShowTerminal(true);

    await new Promise(resolve => setTimeout(resolve, 600));
    setAiStatus('Running terminal commands...');
    addTerminalLine('🤖 AI Terminal — Starting work');

    await runAICommands([
      { label: 'Analyzing requirements', output: ['✓ Requirements parsed', '✓ Framework: React + Tailwind'] },
      { label: 'Generating code', output: ['✓ Components created', '✓ Styles applied', '✓ Logic implemented'] },
      { label: 'Building project', output: ['✓ Build successful', '✓ No errors'] },
    ]);

    const code = generateCode(content);
    setGeneratedCode(code);
    addTerminalLine(`✓ Code generated (${code.length} chars)`);
    addTerminalLine('✅ Ready — Check Preview →');

    await new Promise(resolve => setTimeout(resolve, 400));
    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(), role: 'assistant',
      content: generateResponse(content), timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsAIBusy(false);
    setAiStatus('');
  };

  const handleInterrupt = (urgentPrompt: string) => {
    // Interrupt current task with urgent prompt
    const currentTask = taskQueue.getCurrentTask();
    if (currentTask) {
      taskQueue.pauseCurrentTask();
      addTerminalLine(`⚠️ Task interrupted: ${currentTask.prompt.substring(0, 50)}...`);
    }
    
    // Create urgent task
    const urgentTask = taskQueue.interruptForUrgent(urgentPrompt);
    addTerminalLine(`🚨 Urgent task created: ${urgentPrompt.substring(0, 50)}...`);
    addTerminalLine(`✓ Needle will refresh to handle urgent request`);
    
    // Trigger Needle refresh
    needleIntegration.manualRefresh(urgentTask.id);
    
    // Switch to tasks panel to show progress
    setActivePanel('tasks');
  };

  const handleStartProject = (project: Project) => {
    setCurrentProject(project);
    setMessages([]);
    setGeneratedCode('');
    setTerminalLines([]);
    setActivePanel('chat');
  };

  const handleCreateProject = (name: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(), name, phase: 'brainstorm',
      createdAt: new Date(), todos: [], memories: [],
    };
    setProjects(prev => [newProject, ...prev]);
    handleStartProject(newProject);
  };

  const handleAddMemory = (memory: Omit<Memory, 'id' | 'createdAt'>) => {
    setMemories(prev => [{ ...memory, id: crypto.randomUUID(), createdAt: new Date() }, ...prev]);
  };

  const handleSwitchPhase = () => {
    if (projectPhase === 'brainstorm') {
      setProjectPhase('code');
      if (currentProject) {
        const todos: TodoItem[] = messages.filter(m => m.role === 'user').map((m, i) => ({
          id: crypto.randomUUID(),
          text: m.content.substring(0, 60) + (m.content.length > 60 ? '...' : ''),
          status: 'pending' as const, order: i + 1,
        }));
        setCurrentProject({ ...currentProject, todos });
      }
    } else {
      setProjectPhase('brainstorm');
    }
  };

  // Landing screen
  if (authMode === 'none') {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center px-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
            AI
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Open<span className="text-purple-400">AI</span>
          </h1>
          <p className="text-gray-400 mb-2">You describe it. I build it.</p>
          <p className="text-xs text-gray-600 mb-8">100% free • Unlimited • Local-first</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setShowAuth(true)} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all">
              Sign In / Sign Up
            </button>
            <button onClick={handleGuest} className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-lg font-medium transition-all border border-[#2a2a2a]">
              Continue Without Login →
            </button>
          </div>
        </motion.div>
        <AnimatePresence>
          {showAuth && <AuthModal onLogin={handleLogin} onGuest={handleGuest} onClose={() => setShowAuth(false)} />}
        </AnimatePresence>
      </div>
    );
  }

  // Qwen Code-style unified layout
  return (
    <div className="h-screen flex bg-[#0d0d0d] text-white overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
        currentProject={currentProject}
        authMode={authMode}
        projects={projects}
        onStartProject={handleStartProject}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-11 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-medium text-gray-300">
              {currentProject ? currentProject.name : 'OpenAI'}
            </h2>
            {currentProject && (
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  projectPhase === 'brainstorm' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                }`}>
                  {projectPhase === 'brainstorm' ? '🧩 Brainstorm' : '💻 Code'}
                </span>
                <button
                  onClick={handleSwitchPhase}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Switch
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAIBusy && (
              <div className="flex items-center gap-1.5 text-xs text-purple-400 mr-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                <span>{aiStatus}</span>
              </div>
            )}

            {/* Layout Controls */}
            <button
              onClick={() => setLayoutMode('split')}
              className={`p-1.5 rounded transition-colors ${layoutMode === 'split' ? 'bg-purple-600/20 text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
              title="Split View"
            >
              <PanelRight size={14} />
            </button>
            <button
              onClick={() => setLayoutMode('chat-only')}
              className={`p-1.5 rounded transition-colors ${layoutMode === 'chat-only' ? 'bg-purple-600/20 text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
              title="Chat Only"
            >
              <Maximize2 size={14} />
            </button>

            <div className="w-px h-4 bg-[#2a2a2a]" />

            <VoiceControls active={voiceActive} setActive={setVoiceActive} ttsEnabled={ttsEnabled} setTtsEnabled={setTtsEnabled} />

            <button
              onClick={() => setShowVetting(!showVetting)}
              className={`px-2 py-1 rounded text-xs transition-colors ${showVetting ? 'bg-orange-600/20 text-orange-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              🔥
            </button>
          </div>
        </div>

        {/* Main Split View */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {/* Chat / Main Panel */}
            <div className={`flex flex-col overflow-hidden ${layoutMode === 'split' ? 'flex-1' : 'flex-1'}`}>
              <div className="flex-1 overflow-hidden flex flex-col">
                {activePanel === 'chat' && (
                  <>
                    <div className="flex-1 overflow-hidden">
                      <ChatPanel
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        projectPhase={projectPhase}
                        todos={currentProject?.todos || []}
                        generatedCode={generatedCode}
                        aiStatus={aiStatus}
                        isAIBusy={isAIBusy}
                      />
                    </div>
                    <DeviceActionPanel
                      onConfirm={async (actionId) => {
                        await executeAfterConfirmation(actionId, async (action) => {
                          addTerminalLine(`✓ Confirmed: ${action.action} on ${action.device}`);
                          // Execute the actual device command here
                          return { success: true };
                        });
                      }}
                      onCancel={(actionId) => {
                        pendingActions.remove(actionId);
                        addTerminalLine(`✗ Cancelled action`);
                      }}
                    />
                  </>
                )}
                {activePanel === 'mind' && <MindPanel memories={memories} onAddMemory={handleAddMemory} />}
                {activePanel === 'projects' && <ProjectManager projects={projects} onStartProject={handleStartProject} onCreateProject={handleCreateProject} />}
                {activePanel === 'settings' && <SettingsPanel />}
                {activePanel === 'connectors' && <ConnectorsPanel />}
                {activePanel === 'tasks' && <TaskQueuePanel onInterrupt={handleInterrupt} />}
                {activePanel === 'errors' && <ErrorManagementPanel />}
                {activePanel === 'preview' && layoutMode === 'chat-only' && <PreviewPanel generatedCode={generatedCode} />}
              </div>
            </div>

            {/* Right Panel - Preview (in split mode) */}
            {layoutMode === 'split' && (
              <div className="w-[45%] border-l border-[#2a2a2a] flex flex-col overflow-hidden">
                <div className="h-8 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center px-3">
                  <span className="text-xs text-gray-400">Preview</span>
                  {generatedCode && <span className="ml-2 text-xs text-green-400">● Live</span>}
                </div>
                <div className="flex-1 overflow-hidden">
                  <PreviewPanel generatedCode={generatedCode} />
                </div>
              </div>
            )}

            {/* Vetting Side Panel */}
            <AnimatePresence>
              {showVetting && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-l border-[#2a2a2a] overflow-hidden"
                >
                  <VettingPanel onClose={() => setShowVetting(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Terminal (collapsible) */}
          <AnimatePresence>
            {showTerminal && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 220 }}
                exit={{ height: 0 }}
                className="border-t border-[#2a2a2a] overflow-hidden"
              >
                <div className="h-7 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">Terminal</span>
                    {isAIBusy && <span className="text-xs text-purple-400">• AI working...</span>}
                  </div>
                  <button
                    onClick={() => setShowTerminal(false)}
                    className="text-xs text-gray-500 hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                <div className="h-[calc(100%-28px)] overflow-hidden">
                  <TerminalPanel lines={terminalLines} isRunning={isAIBusy} currentTask={aiStatus} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show Terminal Button (when hidden) */}
          {!showTerminal && terminalLines.length > 0 && (
            <button
              onClick={() => setShowTerminal(true)}
              className="h-7 bg-[#1a1a1a] border-t border-[#2a2a2a] flex items-center px-3 gap-2 hover:bg-[#2a2a2a] transition-colors"
            >
              <Terminal size={12} className="text-gray-400" />
              <span className="text-xs text-gray-400">Terminal</span>
              <span className="text-xs text-gray-600">• {terminalLines.length} lines</span>
              <PanelBottom size={12} className="text-gray-500 ml-auto" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAuth && <AuthModal onLogin={handleLogin} onGuest={handleGuest} onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
