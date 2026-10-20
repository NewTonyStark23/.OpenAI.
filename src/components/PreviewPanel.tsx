import { useState } from 'react';
import { motion } from 'framer-motion';
import { Power, AlertTriangle, RefreshCw, Download, Smartphone, Monitor } from 'lucide-react';

export default function PreviewPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [previewMode, setPreviewMode] = useState<'web' | 'android' | 'windows'>('web');

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Preview Toolbar */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode('web')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              previewMode === 'web' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            🌐 Web
          </button>
          <button
            onClick={() => setPreviewMode('android')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              previewMode === 'android' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <Smartphone size={12} className="inline mr-1" />
            Android
          </button>
          <button
            onClick={() => setPreviewMode('windows')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              previewMode === 'windows' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <Monitor size={12} className="inline mr-1" />
            Windows
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            <Power size={12} className="inline mr-1" />
            {isRunning ? 'Kill' : 'Run'}
          </button>
          <button className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
            <RefreshCw size={14} />
          </button>
          <button className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        {isRunning ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`bg-white rounded-lg shadow-2xl overflow-hidden ${
              previewMode === 'android' ? 'w-[375px] h-[667px] rounded-[2rem] border-4 border-gray-700' :
              previewMode === 'windows' ? 'w-[800px] h-[500px] border border-gray-600' :
              'w-full h-full max-w-4xl'
            }`}
          >
            {/* Device Frame for Android */}
            {previewMode === 'android' && (
              <div className="h-6 bg-black flex items-center justify-center">
                <div className="w-20 h-3 bg-gray-800 rounded-full" />
              </div>
            )}
            {/* Windows Title Bar */}
            {previewMode === 'windows' && (
              <div className="h-8 bg-gray-100 flex items-center justify-between px-3 border-b">
                <span className="text-xs text-gray-600">My App</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                </div>
              </div>
            )}
            {/* App Content Placeholder */}
            <div className="flex-1 p-6 bg-gradient-to-br from-purple-50 to-blue-50 h-full">
              <div className="space-y-4">
                <div className="h-8 bg-purple-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="h-24 bg-purple-100 rounded-lg" />
                  <div className="h-24 bg-blue-100 rounded-lg" />
                </div>
                <div className="h-10 bg-purple-600 rounded-lg w-32 mt-4" />
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={40} className="text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Preview Not Running</h3>
            <p className="text-gray-500 text-sm mb-4">
              Click "Run" to start the preview in a sandboxed environment
            </p>
            <div className="flex items-center gap-2 justify-center text-xs text-gray-600">
              <span className="px-2 py-1 bg-gray-800 rounded">🔒 Sandboxed</span>
              <span className="px-2 py-1 bg-gray-800 rounded">⚡ Kill Switch Ready</span>
              <span className="px-2 py-1 bg-gray-800 rounded">🖥️ Hardware Adaptive</span>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3 text-xs">
          <span className={isRunning ? 'text-green-400' : 'text-gray-500'}>
            {isRunning ? '● Running' : '○ Stopped'}
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">
            {previewMode === 'android' ? 'Android Emulator' : 
             previewMode === 'windows' ? 'Windows Preview' : 'Web Browser'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>RAM: 2.4GB / 8GB</span>
          <span>CPU: 12%</span>
        </div>
      </div>
    </div>
  );
}
