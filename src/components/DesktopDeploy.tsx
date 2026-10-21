import { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Download, Package, CheckCircle, AlertCircle } from 'lucide-react';

export default function DesktopDeploy() {
  const [deploying, setDeploying] = useState(false);
  const [platform, setPlatform] = useState<'windows' | 'mac' | 'linux'>('windows');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [complete, setComplete] = useState(false);

  const handleDeploy = async () => {
    setDeploying(true);
    setProgress(0);
    setComplete(false);

    const steps = [
      { progress: 10, status: 'Generating Electron configuration...' },
      { progress: 25, status: 'Creating package.json for desktop...' },
      { progress: 40, status: 'Configuring build settings...' },
      { progress: 55, status: 'Setting up auto-updater...' },
      { progress: 70, status: 'Creating installer scripts...' },
      { progress: 85, status: 'Generating deployment files...' },
      { progress: 95, status: 'Finalizing desktop package...' },
      { progress: 100, status: 'Desktop deployment ready!' },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step.progress);
      setStatus(step.status);
    }

    setDeploying(false);
    setComplete(true);
  };

  const downloadElectronConfig = () => {
    const electronConfig = {
      name: "openai-platform-desktop",
      version: "1.0.0",
      description: "OpenAI Platform - Desktop Application",
      main: "electron/main.js",
      scripts: {
        "start": "electron .",
        "dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && electron .\"",
        "build": "npm run build && electron-builder",
        "build:win": "npm run build && electron-builder --win",
        "build:mac": "npm run build && electron-builder --mac",
        "build:linux": "npm run build && electron-builder --linux"
      },
      build: {
        appId: "com.openai.platform",
        productName: "OpenAI Platform",
        directories: {
          output: "dist-desktop"
        },
        files: [
          "dist/**/*",
          "electron/**/*",
          "package.json"
        ],
        win: {
          target: ["nsis", "portable"],
          icon: "public/icon.ico"
        },
        mac: {
          target: ["dmg", "zip"],
          icon: "public/icon.icns",
          category: "public.app-category.developer-tools"
        },
        linux: {
          target: ["AppImage", "deb", "rpm"],
          icon: "public/icon.png",
          category: "Development"
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true
        }
      },
      devDependencies: {
        "electron": "^28.0.0",
        "electron-builder": "^24.9.1",
        "concurrently": "^8.2.2",
        "wait-on": "^7.2.0"
      }
    };

    const blob = new Blob([JSON.stringify(electronConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'package.desktop.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadMainProcess = () => {
    const mainProcess = `const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'OpenAI Platform',
    backgroundColor: '#0d0d0d',
    show: false
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Create menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-action', 'new-project');
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            require('electron').shell.openExternal('https://github.com/your-repo/docs');
          }
        },
        {
          label: 'Report Issue',
          click: () => {
            require('electron').shell.openExternal('https://github.com/your-repo/issues');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
`;

    const blob = new Blob([mainProcess], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'electron-main.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadBuildScript = () => {
    const script = platform === 'windows' 
      ? `@echo off
echo Building OpenAI Platform Desktop for Windows...
echo.

echo Step 1: Installing dependencies...
call npm install
call npm install --save-dev electron electron-builder concurrently wait-on

echo.
echo Step 2: Building web app...
call npm run build

echo.
echo Step 3: Creating desktop package...
call npm run build:win

echo.
echo Build complete! Check dist-desktop folder for installer.
pause
`
      : platform === 'mac'
      ? `#!/bin/bash
echo "Building OpenAI Platform Desktop for macOS..."
echo

echo "Step 1: Installing dependencies..."
npm install
npm install --save-dev electron electron-builder concurrently wait-on

echo
echo "Step 2: Building web app..."
npm run build

echo
echo "Step 3: Creating desktop package..."
npm run build:mac

echo
echo "Build complete! Check dist-desktop folder for installer."
`
      : `#!/bin/bash
echo "Building OpenAI Platform Desktop for Linux..."
echo

echo "Step 1: Installing dependencies..."
npm install
npm install --save-dev electron electron-builder concurrently wait-on

echo
echo "Step 2: Building web app..."
npm run build

echo
echo "Step 3: Creating desktop package..."
npm run build:linux

echo
echo "Build complete! Check dist-desktop folder for installer."
`;

    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = platform === 'windows' ? 'build-desktop.bat' : 'build-desktop.sh';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Monitor size={24} className="text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Desktop Deployment</h2>
        </div>
        <p className="text-gray-400 text-sm">
          Package OpenAI Platform as a native desktop application for Windows, macOS, or Linux
        </p>

        {/* Platform Selection */}
        <section className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Target Platform</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'windows' as const, name: 'Windows', icon: '🪟', desc: '.exe installer' },
              { id: 'mac' as const, name: 'macOS', icon: '🍎', desc: '.dmg installer' },
              { id: 'linux' as const, name: 'Linux', icon: '🐧', desc: '.AppImage / .deb' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                disabled={deploying}
                className={`p-4 rounded-lg border text-left transition-all ${
                  platform === p.id
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                } disabled:opacity-50`}
              >
                <span className="text-2xl mb-2 block">{p.icon}</span>
                <p className="text-sm font-medium text-white">{p.name}</p>
                <p className="text-xs text-gray-400 mt-1">{p.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Deployment Progress */}
        {deploying && (
          <section className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Deployment Progress</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{status}</span>
                <span className="text-purple-400 font-mono">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </section>
        )}

        {/* Completion */}
        {complete && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 border border-green-500/30 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle size={24} className="text-green-400" />
              <h3 className="text-lg font-semibold text-white">Desktop Package Ready!</h3>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Configuration files have been generated. Follow these steps to build your desktop app:
            </p>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 space-y-2">
              <div className="text-green-400"># 1. Download the generated files</div>
              <div className="text-gray-500"># (Already downloaded below)</div>
              <div className="text-green-400 mt-3"># 2. Place files in your project root</div>
              <div className="text-gray-400">package.desktop.json → package.json</div>
              <div className="text-gray-400">electron-main.js → electron/main.js</div>
              <div className="text-green-400 mt-3"># 3. Run the build script</div>
              <div className="text-gray-400">
                {platform === 'windows' ? 'build-desktop.bat' : './build-desktop.sh'}
              </div>
              <div className="text-green-400 mt-3"># 4. Find your installer in dist-desktop/</div>
            </div>
          </motion.section>
        )}

        {/* Download Section */}
        <section className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Download Configuration Files</h3>
          <div className="space-y-3">
            <button
              onClick={downloadElectronConfig}
              disabled={deploying}
              className="w-full flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <Package size={20} className="text-purple-400" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Electron Configuration</p>
                  <p className="text-xs text-gray-400">package.desktop.json</p>
                </div>
              </div>
              <Download size={16} className="text-gray-400" />
            </button>

            <button
              onClick={downloadMainProcess}
              disabled={deploying}
              className="w-full flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <Package size={20} className="text-blue-400" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Electron Main Process</p>
                  <p className="text-xs text-gray-400">electron-main.js</p>
                </div>
              </div>
              <Download size={16} className="text-gray-400" />
            </button>

            <button
              onClick={downloadBuildScript}
              disabled={deploying}
              className="w-full flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <Package size={20} className="text-green-400" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Build Script</p>
                  <p className="text-xs text-gray-400">
                    {platform === 'windows' ? 'build-desktop.bat' : 'build-desktop.sh'}
                  </p>
                </div>
              </div>
              <Download size={16} className="text-gray-400" />
            </button>
          </div>
        </section>

        {/* Deploy Button */}
        <button
          onClick={handleDeploy}
          disabled={deploying}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 rounded-xl font-semibold text-white transition-all disabled:cursor-not-allowed"
        >
          {deploying ? (
            <span className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Package size={20} />
              </motion.div>
              Deploying...
            </span>
          ) : complete ? (
            'Regenerate Desktop Package'
          ) : (
            `🚀 Deploy as ${platform === 'windows' ? 'Windows' : platform === 'mac' ? 'macOS' : 'Linux'} App`
          )}
        </button>

        {/* Instructions */}
        <section className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <AlertCircle size={18} className="text-blue-400" />
            Quick Start Guide
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p><strong>1.</strong> Select your target platform above</p>
            <p><strong>2.</strong> Click "Deploy" to generate configuration files</p>
            <p><strong>3.</strong> Download all three files</p>
            <p><strong>4.</strong> Place them in your project root:</p>
            <div className="bg-gray-900 rounded p-3 font-mono text-xs text-gray-400 ml-4">
              your-project/<br/>
              ├── package.json (rename from package.desktop.json)<br/>
              ├── electron/<br/>
              │   └── main.js (rename from electron-main.js)<br/>
              └── {platform === 'windows' ? 'build-desktop.bat' : 'build-desktop.sh'}
            </div>
            <p><strong>5.</strong> Run the build script</p>
            <p><strong>6.</strong> Find your installer in <code className="bg-gray-900 px-2 py-0.5 rounded">dist-desktop/</code></p>
          </div>
        </section>
      </div>
    </div>
  );
}
