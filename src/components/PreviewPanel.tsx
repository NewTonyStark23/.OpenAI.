import { useState } from 'react';
import { motion } from 'framer-motion';
import { Power, RefreshCw, Download, Smartphone, Monitor, Globe, Copy, ExternalLink, Code } from 'lucide-react';

interface PreviewPanelProps {
  generatedCode: string;
}

export default function PreviewPanel({ generatedCode }: PreviewPanelProps) {
  const [previewMode, setPreviewMode] = useState<'web' | 'android' | 'windows'>('web');
  const [isRunning, setIsRunning] = useState(false);

  const hasCode = generatedCode.trim().length > 0;

  const handleDownload = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  const handleOpenNew = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

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
            <Globe size={12} className="inline mr-1" />
            Web
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
          {hasCode && (
            <>
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                title="Copy HTML"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={handleOpenNew}
                className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                title="Open in new tab"
              >
                <ExternalLink size={14} />
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                title="Download HTML"
              >
                <Download size={14} />
              </button>
            </>
          )}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            <Power size={12} className="inline mr-1" />
            {isRunning ? 'Stop' : 'Run'}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden bg-gray-950">
        {!hasCode ? (
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code size={40} className="text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Code Generated Yet</h3>
            <p className="text-gray-500 text-sm mb-4">
              Describe what you want to build in the Chat panel.
              Code will appear here in real-time as a live preview.
            </p>
            <div className="flex items-center gap-2 justify-center text-xs text-gray-600">
              <span className="px-2 py-1 bg-gray-800 rounded">💬 Chat → Code</span>
              <span>→</span>
              <span className="px-2 py-1 bg-gray-800 rounded">👁️ Live Preview</span>
            </div>
          </div>
        ) : isRunning ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`overflow-hidden bg-white ${
              previewMode === 'android'
                ? 'w-[375px] h-[667px] rounded-[2rem] border-4 border-gray-700 shadow-2xl'
                : previewMode === 'windows'
                ? 'w-full max-w-[900px] h-full max-h-[600px] border border-gray-600 rounded-lg overflow-hidden'
                : 'w-full h-full rounded-lg overflow-hidden border border-gray-700'
            }`}
          >
            {/* Android notch */}
            {previewMode === 'android' && (
              <div className="h-7 bg-black flex items-center justify-center rounded-t-[1.5rem]">
                <div className="w-16 h-3 bg-gray-800 rounded-full" />
              </div>
            )}
            {/* Windows title bar */}
            {previewMode === 'windows' && (
              <div className="h-8 bg-gray-100 flex items-center justify-between px-3 border-b">
                <span className="text-xs text-gray-600">Generated App</span>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                </div>
              </div>
            )}
            {/* Live iframe */}
            <iframe
              srcDoc={generatedCode}
              className="w-full border-0"
              style={{
                height: previewMode === 'android' ? 'calc(100% - 28px)' :
                        previewMode === 'windows' ? 'calc(100% - 32px)' : '100%',
              }}
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </motion.div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Power size={32} className="text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Preview Stopped</h3>
            <p className="text-gray-500 text-sm mb-4">
              Code is ready. Click "Run" to render the preview.
            </p>
            <button
              onClick={() => setIsRunning(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
            >
              ▶ Run Preview
            </button>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3 text-xs">
          <span className={hasCode && isRunning ? 'text-green-400' : 'text-gray-500'}>
            {hasCode && isRunning ? '● Live' : hasCode ? '● Ready' : '○ No code'}
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">
            {previewMode === 'android' ? 'Android (375×667)' :
             previewMode === 'windows' ? 'Windows Desktop' : 'Web (Full Width)'}
          </span>
          {hasCode && (
            <>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400">{generatedCode.length.toLocaleString()} chars</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>iframe sandboxed</span>
          <span>•</span>
          <span>scripts allowed</span>
        </div>
      </div>
    </div>
  );
}
