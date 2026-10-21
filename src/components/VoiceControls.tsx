import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceControlsProps {
  active: boolean;
  setActive: (active: boolean) => void;
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
}

export default function VoiceControls({ active, setActive, ttsEnabled, setTtsEnabled }: VoiceControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Wake Word / Listening Toggle */}
      <button
        onClick={() => setActive(!active)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          active
            ? 'bg-red-600/20 text-red-300 border border-red-500/50 animate-pulse'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        {active ? <Mic size={14} /> : <MicOff size={14} />}
        {active ? 'Listening...' : 'Voice'}
      </button>

      {/* TTS Toggle */}
      <button
        onClick={() => setTtsEnabled(!ttsEnabled)}
        className={`p-1.5 rounded-lg transition-colors ${
          ttsEnabled ? 'text-purple-400' : 'text-gray-500'
        } hover:bg-gray-700`}
        title={ttsEnabled ? 'TTS Enabled (KittenTTS)' : 'TTS Disabled'}
      >
        {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      {/* Status Indicator */}
      {active && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span>Whistle STT active</span>
        </div>
      )}
    </div>
  );
}
