import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Cpu, HardDrive, Wifi, WifiOff, Database, Code2, Smartphone, Monitor, Globe, Key, Palette, Volume2, Brain, Zap } from 'lucide-react';

export default function SettingsPanel() {
  const [framework, setFramework] = useState<'react-native' | 'flutter' | 'auto'>('auto');
  const [backend, setBackend] = useState<'firebase' | 'supabase' | 'appwrite' | 'offline'>('supabase');
  const [aiModel, setAiModel] = useState<'ollama' | 'lm-studio' | 'api-key' | 'needle'>('ollama');
  const [publishMode, setPublishMode] = useState<'personal' | 'google-play'>('personal');
  const [language, setLanguage] = useState<'auto' | 'en' | 'es' | 'ja' | 'ko' | 'zh'>('auto');
  const [ttsVoice, setTtsVoice] = useState('Bruno');
  const [wakeWord, setWakeWord] = useState('Hey OpenAI');
  const [hardwareMode, setHardwareMode] = useState<'auto' | 'high' | 'medium' | 'low'>('auto');

  // Simulated hardware detection
  const [detectedSpecs] = useState({
    cpu: navigator.hardwareConcurrency || 'Unknown',
    ram: 'Unknown',
    gpu: 'Detecting...',
  });

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Settings size={24} className="text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Platform Settings</h2>
        </div>

        {/* Hardware Detection */}
        <section className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu size={18} className="text-blue-400" />
            Hardware Detection
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">CPU Cores</p>
              <p className="text-lg font-bold text-white">{detectedSpecs.cpu}</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">RAM</p>
              <p className="text-lg font-bold text-white">{detectedSpecs.ram}</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">GPU</p>
              <p className="text-lg font-bold text-white">{detectedSpecs.gpu}</p>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Performance Mode</label>
            <div className="grid grid-cols-4 gap-2">
              {(['auto', 'high', 'medium', 'low'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setHardwareMode(mode)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    hardwareMode === mode
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {mode === 'auto' ? '🔄 Auto' : mode === 'high' ? '⚡ High' : mode === 'medium' ? '🔧 Medium' : '🪶 Low'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* AI Model */}
        <section className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain size={18} className="text-purple-400" />
            AI Model (100% Free & Unlimited)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'ollama' as const, name: 'Ollama (Local)', desc: 'Free, unlimited, runs on your machine', icon: '🦙' },
              { id: 'needle' as const, name: 'Needle (Local)', desc: '8-29MB, tool calls, edge AI', icon: '🪡' },
              { id: 'lm-studio' as const, name: 'LM Studio', desc: 'GUI for local models', icon: '🖥️' },
              { id: 'api-key' as const, name: 'API Key', desc: 'OpenAI, Anthropic, etc.', icon: '🔑' },
            ].map(model => (
              <button
                key={model.id}
                onClick={() => setAiModel(model.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  aiModel === model.id
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                }`}
              >
                <span className="text-2xl mb-2 block">{model.icon}</span>
                <p className="text-sm font-medium text-white">{model.name}</p>
                <p className="text-xs text-gray-400 mt-1">{model.desc}</p>
              </button>
            ))}
          </div>
          {aiModel === 'api-key' && (
            <div className="mt-4">
              <label className="text-sm text-gray-400 mb-1 block">API Key</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="sk-..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
                  Connect
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Framework Selection */}
        <section className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Code2 size={18} className="text-green-400" />
            App Framework
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'auto' as const, name: 'Auto Select', desc: 'AI chooses best fit', icon: '🤖' },
              { id: 'react-native' as const, name: 'React Native', desc: 'JavaScript, cross-platform', icon: '⚛️' },
              { id: 'flutter' as const, name: 'Flutter', desc: 'Dart, native performance', icon: '🦋' },
            ].map(fw => (
              <button
                key={fw.id}
                onClick={() => setFramework(fw.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  framework === fw.id
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                }`}
              >
                <span className="text-2xl mb-2 block">{fw.icon}</span>
                <p className="text-sm font-medium text-white">{fw.name}</p>
                <p className="text-xs text-gray-400 mt-1">{fw.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Backend Selection */}
        <section className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Database size={18} className="text-yellow-400" />
            Backend (Free / Local Only)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'firebase' as const, name: 'Firebase', desc: 'Free tier, Google-backed', icon: '🔥' },
              { id: 'supabase' as const, name: 'Supabase', desc: 'Open source, self-hostable', icon: '⚡' },
              { id: 'appwrite' as const, name: 'Appwrite', desc: 'Self-hosted, completely free', icon: '🟢' },
              { id: 'offline' as const, name: 'Offline Only', desc: 'SQLite/Realm, no cloud', icon: '📴' },
            ].map(b => (
              <button
                key={b.id}
                onClick={() => setBackend(b.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  backend === b.id
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                }`}
              >
                <span className="text-2xl mb-2 block">{b.icon}</span>
                <p className="text-sm font-medium text-white">{b.name}</p>
                <p className="text-xs text-gray-400 mt-1">{b.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Publishing Mode */}
        <section className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Smartphone size={18} className="text-orange-400" />
            Publishing Mode
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPublishMode('personal')}
              className={`p-4 rounded-lg border text-left transition-all ${
                publishMode === 'personal'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
              }`}
            >
              <p className="text-sm font-medium text-white">👤 Personal App</p>
              <p className="text-xs text-gray-400 mt-1">Debug-signed, no policies required. For personal use/testing.</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="px-1.5 py-0.5 bg-blue-500/20 rounded text-xs text-blue-300">No Google Terms</span>
                <span className="px-1.5 py-0.5 bg-blue-500/20 rounded text-xs text-blue-300">Fast Build</span>
              </div>
            </button>
            <button
              onClick={() => setPublishMode('google-play')}
              className={`p-4 rounded-lg border text-left transition-all ${
                publishMode === 'google-play'
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
              }`}
            >
              <p className="text-sm font-medium text-white">🏪 Google Play Ready</p>
              <p className="text-xs text-gray-400 mt-1">Release-signed, policy compliant. Auto-generates privacy policy.</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="px-1.5 py-0.5 bg-green-500/20 rounded text-xs text-green-300">Policy Check</span>
                <span className="px-1.5 py-0.5 bg-green-500/20 rounded text-xs text-green-300">Release Signed</span>
              </div>
            </button>
          </div>
        </section>

        {/* Voice Settings */}
        <section className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Volume2 size={18} className="text-pink-400" />
            Voice (KittenTTS + Whistle)
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Wake Word</label>
              <input
                type="text"
                value={wakeWord}
                onChange={e => setWakeWord(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">TTS Voice (47 built-in)</label>
              <select
                value={ttsVoice}
                onChange={e => setTtsVoice(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                {['Bruno', 'Luna', 'Bella', 'Jasper', 'Kiki', 'Leo', 'Rosie', 'Hugo'].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Zap size={12} className="text-yellow-400" />
              <span>Whistle STT: 16.9MB • 7 languages • Real-time on CPU</span>
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Globe size={18} className="text-cyan-400" />
            Auto-Translator
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'auto' as const, name: '🔄 Auto Detect', desc: 'Mirror your language' },
              { id: 'en' as const, name: '🇺🇸 English', desc: 'Always English' },
              { id: 'es' as const, name: '🇪🇸 Español', desc: 'Always Spanish' },
              { id: 'ja' as const, name: '🇯🇵 日本語', desc: 'Always Japanese' },
              { id: 'ko' as const, name: '🇰🇷 한국어', desc: 'Always Korean' },
              { id: 'zh' as const, name: '🇨🇳 中文', desc: 'Always Chinese' },
            ].map(lang => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  language === lang.id
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                }`}
              >
                <p className="text-sm font-medium text-white">{lang.name}</p>
                <p className="text-xs text-gray-400">{lang.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* VSCode Setup */}
        <section className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Code2 size={18} className="text-blue-400" />
            VSCode Development Setup
          </h3>
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300 mb-2">
                <strong>Quick Start:</strong> Open this project in VSCode and install recommended extensions
              </p>
              <div className="bg-gray-900 rounded p-3 font-mono text-xs text-gray-300">
                <div className="text-green-400">$ code .</div>
                <div className="text-gray-500 mt-1"># VSCode will prompt to install recommended extensions</div>
                <div className="text-green-400 mt-2">$ npm install</div>
                <div className="text-green-400">$ npm run dev</div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Recommended Extensions (Auto-installed):</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'ESLint', desc: 'Code linting' },
                  { name: 'Prettier', desc: 'Code formatting' },
                  { name: 'Tailwind CSS', desc: 'CSS autocomplete' },
                  { name: 'TypeScript', desc: 'Type checking' },
                  { name: 'React Snippets', desc: 'Code snippets' },
                  { name: 'GitLens', desc: 'Git integration' },
                ].map(ext => (
                  <div key={ext.name} className="bg-gray-700/50 rounded p-2">
                    <p className="text-xs font-medium text-white">{ext.name}</p>
                    <p className="text-xs text-gray-400">{ext.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Useful Commands:</p>
              <div className="space-y-1 text-xs font-mono text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">F5</span>
                  <span className="text-gray-500">→</span>
                  <span>Start debugging</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">Ctrl+Shift+P</span>
                  <span className="text-gray-500">→</span>
                  <span>Command palette</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">Ctrl+`</span>
                  <span className="text-gray-500">→</span>
                  <span>Toggle terminal</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.open('https://code.visualstudio.com/', '_blank')}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                📥 Download VSCode
              </button>
              <button
                onClick={() => {
                  const instructions = `VSCode Setup Instructions:

1. Install VSCode from https://code.visualstudio.com/
2. Open this project folder in VSCode
3. Click "Install All" when prompted for recommended extensions
4. Run: npm install
5. Run: npm run dev
6. Open http://localhost:5173

Debug Configurations:
- F5: Start debugging
- Ctrl+Shift+P: Command palette
- Tasks: Run Task → Start Dev Server

For more info, see VSCODE_SETUP.md`;
                  navigator.clipboard.writeText(instructions);
                  alert('VSCode setup instructions copied to clipboard!');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
              >
                📋 Copy Setup Instructions
              </button>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end gap-3 pb-6">
          <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
            Reset to Defaults
          </button>
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
            💾 Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
