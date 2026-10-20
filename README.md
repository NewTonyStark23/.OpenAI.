# OpenAI — Intelligent App Factory

> Build Android apps, Windows apps, and web apps from conversation. 100% free, unlimited, local-first.

## 🚀 Quick Start (Auto-Setup)

### One-Command Setup

**Mac/Linux:**
```bash
chmod +x setup.sh && ./setup.sh
```

**Windows:**
```cmd
setup.bat
```

This will:
- ✅ Install Node.js dependencies
- ✅ Install recommended VSCode extensions
- ✅ Configure VSCode workspace
- ✅ Start the development server
- ✅ Open the app in your browser

---

## 📋 Manual Setup

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **VSCode** ([Download](https://code.visualstudio.com/))
- **Git** ([Download](https://git-scm.com/))

### Installation Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd openai-app-factory

# 2. Install dependencies
npm install

# 3. Install recommended VSCode extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension formulahendry.auto-rename-tag

# 4. Open in VSCode
code .

# 5. Start development server
npm run dev
```

---

## 🏗️ Project Structure

```
openai-app-factory/
├── src/
│   ├── components/          # React components
│   │   ├── Sidebar.tsx
│   │   ├── ChatPanel.tsx
│   │   ├── PreviewPanel.tsx
│   │   ├── MindPanel.tsx
│   │   ├── TerminalPanel.tsx
│   │   ├── VoiceControls.tsx
│   │   ├── AuthModal.tsx
│   │   ├── ProjectManager.tsx
│   │   ├── TemplateLibrary.tsx
│   │   ├── VettingPanel.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── BuildPipeline.tsx
│   │   ├── RamGraphStatus.tsx
│   │   ├── VoiceConversation.tsx
│   │   └── AutocorrectPanel.tsx
│   ├── utils/
│   │   └── codeGenerator.ts # Generates real HTML code
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── .vscode/
│   ├── extensions.json      # Recommended extensions
│   ├── settings.json        # Workspace settings
│   └── launch.json          # Debug configurations
├── public/                  # Static assets
├── index.html               # HTML entry
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tsconfig.json            # TypeScript config
├── setup.sh                 # Mac/Linux setup script
├── setup.bat                # Windows setup script
└── README.md                # This file
```

---

## 🎯 Features

### Core Panels
- **💬 Chat** — Unlimited conversation, brainstorm/code mode
- **👁️ Preview** — Live rendering with Web/Android/Windows modes
- **🧠 Mind** — Persistent memory with xerj graph integration
- **🖥️ Terminal** — Sandboxed command execution
- **📁 Projects** — Project management with progress tracking
- **📦 Templates** — 15+ pre-built app templates

### Advanced Tools
- **🚀 Build Pipeline** — 5-stage app generation
- **📊 RAM Graph** — Working memory with loop detection
- **🎤 Voice** — KittenTTS + Whistle STT integration
- **✨ Autocorrect** — Self-designed error detection
- **🔥 CRUCIBLE Vetting** — Adversarial validation system

### Key Capabilities
- ✅ 100% free & unlimited (no API costs)
- ✅ Local-first (Ollama, Needle, LM Studio)
- ✅ Dual framework (React Native + Flutter)
- ✅ Free backends (Firebase, Supabase, Appwrite)
- ✅ Smart publishing (Personal vs Google Play)
- ✅ Voice interface (47 voices, 7 languages)
- ✅ Auto-translator (mirror user's language)
- ✅ Hardware adaptive (detects specs)
- ✅ Repo import (adopt any repo as mind)

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Preview production build
npm run preview
```

---

## 🌐 Connecting to CLI (Advanced)

To enable real command execution in the terminal:

### Option 1: Local Backend Server

Create `server/server.js`:

```javascript
const express = require('express');
const { WebSocketServer } = require('ws');
const { spawn } = require('child_process');

const app = express();
const server = app.listen(3001);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const { command, cwd } = JSON.parse(message);
    const [cmd, ...args] = command.split(' ');
    
    const proc = spawn(cmd, args, { 
      cwd: cwd || process.cwd(),
      shell: true 
    });
    
    proc.stdout.on('data', (data) => {
      ws.send(JSON.stringify({ type: 'output',  data.toString() }));
    });
    
    proc.stderr.on('data', (data) => {
      ws.send(JSON.stringify({ type: 'error',  data.toString() }));
    });
    
    proc.on('close', (code) => {
      ws.send(JSON.stringify({ type: 'exit', code }));
    });
  });
});

console.log('Backend server running on ws://localhost:3001');
```

Then update `TerminalPanel.tsx` to connect via WebSocket.

### Option 2: WebContainers (Browser-based)

```bash
npm install @webcontainer/api
```

Run Node.js directly in the browser (no backend needed).

---

## 📱 Building Real Apps

### Android APK
```bash
# Install Android SDK
# Then in terminal panel:
npx react-native init MyApp
cd MyApp
npx react-native run-android
cd android && ./gradlew assembleRelease
```

### Windows EXE
```bash
# Install .NET SDK
# Then in terminal panel:
dotnet new wpf -n MyApp
cd MyApp
dotnet build -c Release
```

### Web App
```bash
npm run build
# Output in dist/ folder
```

---

## 🔐 Security

When enabling CLI access:
- ✅ Whitelist allowed commands
- ✅ Sandbox workspace directory
- ✅ Add timeouts for long processes
- ✅ Require user confirmation for dangerous ops
- ✅ Log all executed commands

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - feel free to use this for personal or commercial projects.

---

## 🙏 Acknowledgments

- **KittenTTS** — Text-to-speech engine
- **Needle** — Edge AI for tool calling
- **xerj** — Knowledge graph for memory
- **CRUCIBLE Protocol** — Adversarial validation
- **DumbTerm** — Terminal inspiration
- **xterm.js** — Terminal rendering

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/your-username/openai-app-factory/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-username/openai-app-factory/discussions)

---

**Built with ❤️ using React, TypeScript, Vite, and Tailwind CSS**
