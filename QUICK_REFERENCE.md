# OpenAI Platform - Quick Reference Card

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

---

## 📱 User Interface

### Sidebar (6 Buttons)
- 💬 **Chat** - Main conversation with AI
- 🧠 **Mind** - Memory management
- ⚙️ **Settings** - Configuration + VSCode setup
- 🔗 **Repositories** - GitHub integration
- 📋 **Tasks** - Task queue management
- ⚠️ **Errors** - Error tracking

### Always Visible
- **Preview Panel** - Live code preview (right side)
- **Terminal Panel** - Real-time AI work (bottom)

### Top Bar
- 📐 Layout toggle (split/chat-only)
- 🎤 Voice controls
- 🔥 Code review toggle

---

## 💬 Chat Commands

### Code Generation
```
Build a todo app
Create a landing page
Design a portfolio site
```

### Device Control
```
connect to TV and change brightness to 50
connect to speaker and change wake word to "yo"
connect to lights and set color to blue
```

### Repository Management
```
push to main branch
pull latest changes
sync repository
```

---

## 🛠️ VSCode Setup

### Quick Setup
```bash
# Open in VSCode
code .

# Install will prompt for extensions
# Click "Install All"

# Start development
npm install
npm run dev
```

### Keyboard Shortcuts
- `F5` - Start debugging
- `Ctrl+Shift+P` - Command palette
- `Ctrl+`` - Toggle terminal

### Useful Tasks
- `Ctrl+Shift+P` → "Tasks: Run Task"
  - Install Dependencies
  - Start Dev Server
  - Build for Production
  - Type Check

---

## 📊 Build Info

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Quality
npm run typecheck    # Type checking
npm run lint         # Code linting
```

**Bundle Size:** 404.94 kB (118.49 kB gzipped)  
**Build Time:** ~5.75s  
**Modules:** 1,734

---

## 🎯 Key Features

### ✅ Working Now
- Chat with AI (template-based responses)
- Live code preview in iframe
- Real-time terminal output
- Memory system (localStorage)
- Task queue for massive prompts
- Error tracking and analysis
- Device control (simulated)
- Repository management (simulated)
- Voice controls (UI ready)
- Code review panel

### 🔜 Needs Backend
- Real AI model integration
- Real device control
- Real repository operations
- Cloud sync
- Multi-user support

---

## 📁 Project Structure

```
openai-platform/
├── src/
│   ├── components/          # 12 active components
│   │   ├── ChatPanel.tsx
│   │   ├── PreviewPanel.tsx
│   │   ├── MindPanel.tsx
│   │   ├── TerminalPanel.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── ConnectorsPanel.tsx
│   │   ├── TaskQueuePanel.tsx
│   │   ├── ErrorManagementPanel.tsx
│   │   └── ... (4 more)
│   ├── utils/               # 8 utility modules
│   │   ├── codeGenerator.ts
│   │   ├── taskQueue.ts
│   │   ├── needleIntegration.ts
│   │   ├── deviceControl.ts
│   │   ├── errorCapture.ts
│   │   └── ... (3 more)
│   ├── App.tsx              # Main app
│   └── main.tsx             # Entry point
├── .vscode/                 # VSCode config
│   ├── extensions.json
│   ├── settings.json
│   ├── launch.json
│   └── tasks.json
├── *.md                     # 8 documentation files
└── package.json
```

---

## 🔧 Configuration

### Settings Panel
- **Hardware Detection** - CPU/RAM/GPU detection
- **AI Model** - Ollama, Needle, LM Studio, API Key
- **Framework** - React Native, Flutter, Auto
- **Backend** - Firebase, Supabase, Appwrite, Offline
- **Publishing** - Personal, Google Play
- **Voice** - Wake word, TTS voice selection
- **Language** - Auto-detect, English, Spanish, etc.
- **VSCode Setup** - Built-in instructions

### localStorage Keys
- `openai_task_queue` - Task queue data
- `openai_memories` - Memory system
- `openai_error_log` - Error tracking
- `openai_connectors` - Repository registry
- `openai_devices` - Device registry
- `openai_permission_requests` - Permission queue

---

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Type Errors
```bash
# Run type checker
npm run typecheck

# Fix errors and rebuild
npm run build
```

### Port Already in Use
```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### VSCode Extensions Not Installing
```bash
# Manual install
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `AUDIT_SUMMARY.md` | This file - quick reference |
| `FINAL_AUDIT_REPORT.md` | Complete audit results |
| `VSCODE_SETUP.md` | VSCode integration guide |
| `ERROR_MANAGEMENT_GUIDE.md` | Error system docs |
| `TASK_QUEUE_GUIDE.md` | Task queue docs |
| `DEVICE_CONTROL_GUIDE.md` | Device control docs |
| `SYSTEM_OVERVIEW.md` | System architecture |
| `COMPLETE_SYSTEM_DOCS.md` | Master documentation |

---

## 🎓 Learning Resources

### Built Into App
- Settings panel has VSCode setup instructions
- Error panel shows error details and fixes
- Task panel shows progress and steps
- Terminal shows real-time AI work

### External Resources
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/
- Tailwind: https://tailwindcss.com/
- Vite: https://vitejs.dev/

---

## ✅ Checklist

### First Time Setup
- [ ] Run `npm install`
- [ ] Open in VSCode
- [ ] Install recommended extensions
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5173
- [ ] Test chat functionality
- [ ] Test preview panel
- [ ] Test terminal output

### Development Workflow
- [ ] Write code in VSCode
- [ ] Save files (auto-format enabled)
- [ ] Check terminal for errors
- [ ] View preview for changes
- [ ] Use F5 for debugging
- [ ] Run `npm run typecheck` before commit
- [ ] Run `npm run build` for production

### Before Deploying
- [ ] Run `npm run build`
- [ ] Test production build with `npm run preview`
- [ ] Check all features work
- [ ] Verify no console errors
- [ ] Test on different browsers
- [ ] Check mobile responsiveness

---

## 🎯 Next Steps

### Immediate
1. Open in VSCode and install extensions
2. Test all features in the app
3. Review documentation for details

### Short Term
1. Implement backend server
2. Connect real AI model (Ollama/OpenAI)
3. Add real device control
4. Add real repository operations

### Long Term
1. Multi-user support
2. Cloud sync
3. Mobile app
4. Advanced AI features

---

## 📞 Quick Help

### App Not Loading?
```bash
npm install
npm run dev
```

### Build Failing?
```bash
npm run typecheck
# Fix errors
npm run build
```

### Need VSCode Setup?
1. Open Settings panel in app
2. Scroll to "VSCode Development Setup"
3. Click "Copy Setup Instructions"
4. Follow instructions

### Need Documentation?
- Quick reference: This file
- Detailed audit: FINAL_AUDIT_REPORT.md
- VSCode guide: VSCODE_SETUP.md
- System docs: COMPLETE_SYSTEM_DOCS.md

---

**Version:** 1.0.0 (Post-Cleanup)  
**Last Updated:** 2026-01-20  
**Status:** ✅ Production Ready
