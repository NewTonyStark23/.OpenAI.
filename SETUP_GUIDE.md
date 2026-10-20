# 🚀 Complete Setup Guide

This guide will walk you through setting up OpenAI App Factory from scratch, including connecting it to CLI tools for building real applications.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Manual Setup](#manual-setup)
3. [Connecting to CLI](#connecting-to-cli)
4. [Building Real Apps](#building-real-apps)
5. [Troubleshooting](#troubleshooting)
6. [Advanced Configuration](#advanced-configuration)

---

## 🎯 Quick Start

### One-Command Setup

**Mac/Linux:**
```bash
chmod +x setup.sh && ./setup.sh
```

**Windows:**
```cmd
setup.bat
```

This automatically:
- ✅ Checks for Node.js, npm, Git
- ✅ Installs all dependencies
- ✅ Installs VSCode extensions
- ✅ Opens VSCode with the project
- ✅ Starts the dev server
- ✅ Opens your browser

---

## 🔧 Manual Setup

### Step 1: Install Prerequisites

#### Node.js (Required)
- Download from: https://nodejs.org/
- Version: 18 or higher
- Verify: `node -v` and `npm -v`

#### VSCode (Recommended)
- Download from: https://code.visualstudio.com/
- The setup script will auto-install recommended extensions

#### Git (Optional)
- Download from: https://git-scm.com/
- Verify: `git --version`

### Step 2: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd openai-app-factory

# Install dependencies
npm install

# Open in VSCode
code .

# Start development server
npm run dev
```

### Step 3: Install VSCode Extensions

If the setup script didn't install them:

```bash
# Core extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss

# React extensions
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension formulahendry.auto-rename-tag

# Quality of life
code --install-extension christian-kohler.path-intellisense
code --install-extension usernamehw.errorlens
code --install-extension aaron-bond.better-comments
```

---

## 🔗 Connecting to CLI

The web app can execute real commands on your machine through a local backend server.

### Option 1: Local Backend Server (Recommended)

#### Step 1: Create Backend Server

Create a `server/` folder and add `server.js`:

```bash
mkdir server
cd server
npm init -y
npm install express ws
```

Create `server/server.js`:

```javascript
const express = require('express');
const { WebSocketServer } = require('ws');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;
const server = app.listen(PORT);
const wss = new WebSocketServer({ server });

// Allowed commands whitelist
const ALLOWED_COMMANDS = [
  'npm', 'node', 'npx', 'git', 'ls', 'dir', 'cd',
  'gradle', 'flutter', 'dotnet', 'echo', 'cat', 'type'
];

console.log(`🚀 Backend server running on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  console.log('✅ Client connected');
  
  ws.on('message', (message) => {
    try {
      const { command, cwd } = JSON.parse(message);
      console.log(`📝 Executing: ${command}`);
      
      // Security check
      const cmd = command.split(' ')[0];
      if (!ALLOWED_COMMANDS.includes(cmd)) {
        ws.send(JSON.stringify({ 
          type: 'error', 
           `Command not allowed: ${cmd}` 
        }));
        return;
      }
      
      // Execute command
      const [cmdName, ...args] = command.split(' ');
      const proc = spawn(cmdName, args, { 
        cwd: cwd || process.cwd(),
        shell: true 
      });
      
      // Stream output
      proc.stdout.on('data', (data) => {
        ws.send(JSON.stringify({ 
          type: 'output', 
           data.toString() 
        }));
      });
      
      proc.stderr.on('data', (data) => {
        ws.send(JSON.stringify({ 
          type: 'error', 
           data.toString() 
        }));
      });
      
      proc.on('close', (code) => {
        ws.send(JSON.stringify({ 
          type: 'exit', 
          code 
        }));
      });
      
      proc.on('error', (err) => {
        ws.send(JSON.stringify({ 
          type: 'error', 
           `Failed to execute: ${err.message}` 
        }));
      });
      
    } catch (err) {
      ws.send(JSON.stringify({ 
        type: 'error', 
         `Invalid message: ${err.message}` 
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('❌ Client disconnected');
  });
});
```

#### Step 2: Update TerminalPanel.tsx

Replace the terminal component to connect via WebSocket:

```typescript
// src/components/TerminalPanel.tsx
import { useEffect, useRef, useState } from 'react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
}

export default function TerminalPanel() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to backend
    ws.current = new WebSocket('ws://localhost:3001');
    
    ws.current.onopen = () => {
      setLines([{
        id: crypto.randomUUID(),
        type: 'system',
        content: '✅ Connected to backend server'
      }]);
    };
    
    ws.current.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      setLines(prev => [...prev, {
        id: crypto.randomUUID(),
        type,
        content: data
      }]);
    };
    
    ws.current.onerror = () => {
      setLines([{
        id: crypto.randomUUID(),
        type: 'error',
        content: '❌ Failed to connect to backend. Run: node server/server.js'
      }]);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const executeCommand = (command: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      setLines(prev => [...prev, {
        id: crypto.randomUUID(),
        type: 'error',
        content: '❌ Not connected to backend'
      }]);
      return;
    }

    setLines(prev => [...prev, {
      id: crypto.randomUUID(),
      type: 'input',
      content: command
    }]);

    ws.current.send(JSON.stringify({
      command,
      cwd: process.cwd()
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input.trim());
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-black font-mono">
      {/* Terminal header */}
      <div className="h-10 bg-gray-900 border-b border-gray-700 flex items-center px-4">
        <span className="text-xs text-gray-400">openai-terminal — connected</span>
      </div>

      {/* Terminal content */}
      <div className="flex-1 overflow-y-auto p-4 text-sm">
        {lines.map(line => (
          <div key={line.id} className={`mb-1 ${
            line.type === 'input' ? 'text-green-400' :
            line.type === 'error' ? 'text-red-400' :
            line.type === 'system' ? 'text-blue-400' :
            'text-gray-300'
          }`}>
            {line.type === 'input' && <span className="text-purple-400">$ </span>}
            {line.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-800 p-3 flex gap-2">
        <span className="text-purple-400">$</span>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 bg-transparent text-green-400 focus:outline-none"
          placeholder="Enter command..."
        />
      </form>
    </div>
  );
}
```

#### Step 3: Run Both Servers

Open two terminals:

**Terminal 1 - Backend:**
```bash
node server/server.js
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Now your terminal panel can execute real commands!

### Option 2: WebContainers (No Backend Needed)

For a simpler setup that runs Node.js in the browser:

```bash
npm install @webcontainer/api
```

Update `TerminalPanel.tsx`:

```typescript
import { WebContainer } from '@webcontainer/api';

export default function TerminalPanel() {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);

  useEffect(() => {
    WebContainer.boot().then(setWebcontainer);
  }, []);

  const executeCommand = async (command: string) => {
    if (!webcontainer) return;
    
    const [cmd, ...args] = command.split(' ');
    const process = await webcontainer.spawn(cmd, args);
    
    process.output.pipeTo(new WritableStream({
      write(data) {
        // Add to terminal lines
      }
    }));
  };

  // ... rest of component
}
```

---

## 📱 Building Real Apps

### Android APK

#### Prerequisites
1. Install Android Studio: https://developer.android.com/studio
2. Install Android SDK
3. Set environment variables:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

#### Build Process
In the terminal panel:

```bash
# Create React Native app
npx react-native init MyApp

# Navigate to project
cd MyApp

# Run on emulator
npx react-native run-android

# Build release APK
cd android
./gradlew assembleRelease

# APK location
ls app/build/outputs/apk/release/
```

### Windows EXE

#### Prerequisites
1. Install .NET SDK: https://dotnet.microsoft.com/download
2. Verify: `dotnet --version`

#### Build Process
In the terminal panel:

```bash
# Create WPF app
dotnet new wpf -n MyApp

# Navigate to project
cd MyApp

# Build release
dotnet build -c Release

# EXE location
ls bin/Release/net6.0-windows/
```

### Web App

```bash
# Build for production
npm run build

# Output in dist/ folder
ls dist/

# Deploy to hosting service
# (Vercel, Netlify, GitHub Pages, etc.)
```

---

## 🐛 Troubleshooting

### "Node.js is not installed"
- Download from: https://nodejs.org/
- Restart terminal after installation
- Verify: `node -v`

### "npm install fails"
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "VSCode extensions not installing"
```bash
# Install manually
code --install-extension <extension-id>

# Or install from VSCode marketplace UI
```

### "WebSocket connection failed"
- Make sure backend server is running: `node server/server.js`
- Check port 3001 is not blocked
- Verify URL: `ws://localhost:3001`

### "Android build fails"
- Check Android SDK is installed
- Verify `ANDROID_HOME` environment variable
- Accept Android licenses: `sdkmanager --licenses`

### "Port already in use"
```bash
# Find process using port
lsof -i :5173  # Mac/Linux
netstat -ano | findstr :5173  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

---

## ⚙️ Advanced Configuration

### Custom AI Model

Edit `.env`:

```bash
# Use local Ollama
VITE_AI_PROVIDER=ollama
VITE_OLLAMA_URL=http://localhost:11434

# Or use API key
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-...
```

### Custom Backend Port

Edit `server/server.js`:

```javascript
const PORT = 3002;  // Change this
```

Update `TerminalPanel.tsx`:

```typescript
ws.current = new WebSocket('ws://localhost:3002');
```

### Add More Allowed Commands

Edit `server/server.js`:

```javascript
const ALLOWED_COMMANDS = [
  'npm', 'node', 'npx', 'git',
  'python', 'pip',  // Add Python
  'docker',         // Add Docker
  // ... more commands
];
```

### Enable File System Access

Add to `server/server.js`:

```javascript
app.get('/api/files', (req, res) => {
  const files = fs.readdirSync(req.query.path || '.');
  res.json(files);
});

app.post('/api/files/write', (req, res) => {
  fs.writeFileSync(req.body.path, req.body.content);
  res.json({ success: true });
});
```

---

## 🎓 Next Steps

1. **Explore the app** — Try all the panels and features
2. **Build your first app** — Start with a simple todo list
3. **Customize templates** — Modify the template library
4. **Add your own features** — Extend the platform
5. **Connect real AI** — Integrate Ollama or API keys

---

## 📚 Resources

- **React Docs:** https://react.dev/
- **Vite Docs:** https://vitejs.dev/
- **Tailwind CSS:** https://tailwindcss.com/
- **React Native:** https://reactnative.dev/
- **Flutter:** https://flutter.dev/
- **Node.js:** https://nodejs.org/

---

## 💬 Support

- **Issues:** [GitHub Issues](https://github.com/your-username/openai-app-factory/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-username/openai-app-factory/discussions)

---

**Happy building! 🚀**
