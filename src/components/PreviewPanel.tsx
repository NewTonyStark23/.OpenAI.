import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, ExternalLink, Smartphone, Monitor, Globe } from 'lucide-react';

interface PreviewPanelProps {
  generatedCode: string;
  compact?: boolean;
}

export default function PreviewPanel({ generatedCode, compact = false }: PreviewPanelProps) {
  const [previewMode, setPreviewMode] = useState<'web' | 'android' | 'windows'>('web');

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

  if (!hasCode) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0d0d0d] p-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👁️</span>
          </div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Live Preview</h3>
          <p className="text-xs text-gray-500">
            Describe what you want to build in chat. The preview will update automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0d0d0d]">
      {/* Device Mode Switcher */}
      {!compact && (
        <div className="h-9 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPreviewMode('web')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                previewMode === 'web' ? 'bg-[#2a2a2a] text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Globe size={12} className="inline mr-1" />Web
            </button>
            <button
              onClick={() => setPreviewMode('android')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                previewMode === 'android' ? 'bg-[#2a2a2a] text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Smartphone size={12} className="inline mr-1" />Android
            </button>
            <button
              onClick={() => setPreviewMode('windows')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                previewMode === 'windows' ? 'bg-[#2a2a2a] text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Monitor size={12} className="inline mr-1" />Windows
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleCopy} className="p-1 hover:bg-[#2a2a2a] rounded transition-colors" title="Copy code">
              <Copy size={12} className="text-gray-400" />
            </button>
            <button onClick={handleOpenNew} className="p-1 hover:bg-[#2a2a2a] rounded transition-colors" title="Open in new tab">
              <ExternalLink size={12} className="text-gray-400" />
            </button>
            <button onClick={handleDownload} className="p-1 hover:bg-[#2a2a2a] rounded transition-colors" title="Download HTML">
              <Download size={12} className="text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-3 overflow-hidden bg-[#111]">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`overflow-hidden bg-white ${
            previewMode === 'android'
              ? 'w-[320px] h-[568px] rounded-[1.5rem] border-[3px] border-gray-700 shadow-2xl'
              : previewMode === 'windows'
              ? 'w-full h-full max-w-[800px] max-h-[500px] border border-gray-700 rounded-lg overflow-hidden'
              : 'w-full h-full rounded overflow-hidden'
          }`}
        >
          {/* Android notch */}
          {previewMode === 'android' && (
            <div className="h-5 bg-black flex items-center justify-center rounded-t-[1rem]">
              <div className="w-12 h-2 bg-gray-800 rounded-full" />
            </div>
          )}
          {/* Windows title bar */}
          {previewMode === 'windows' && (
            <div className="h-7 bg-gray-100 flex items-center justify-between px-2 border-b">
              <span className="text-[10px] text-gray-600">App</span>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
                <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
                <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
              </div>
            </div>
          )}
          {/* Live iframe */}
          <iframe
            srcDoc={generatedCode}
            className="w-full border-0"
            style={{
              height: previewMode === 'android' ? 'calc(100% - 20px)' :
                      previewMode === 'windows' ? 'calc(100% - 28px)' : '100%',
            }}
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </motion.div>
      </div>
    </div>
  );
}
