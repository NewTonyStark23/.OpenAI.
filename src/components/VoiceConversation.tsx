import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Clock, AlertCircle } from 'lucide-react';

interface VoiceConversationProps {
  active: boolean;
  setActive: (active: boolean) => void;
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
}

export default function VoiceConversation({ active, setActive, ttsEnabled, setTtsEnabled }: VoiceConversationProps) {
  const [listeningWindow, setListeningWindow] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (listeningWindow && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setListeningWindow(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [listeningWindow, timeRemaining]);

  const handleWakeWord = () => {
    setListeningWindow(true);
    setTimeRemaining(60);
    setTranscript('');
  };

  const handleStopListening = () => {
    setListeningWindow(false);
    setTimeRemaining(60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate transcription
  useEffect(() => {
    if (listeningWindow) {
      const timeout = setTimeout(() => {
        setTranscript('Build me a fitness tracking app with workout logging...');
        setDetectedLanguage('en');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [listeningWindow]);

  // Simulate AI speaking
  useEffect(() => {
    if (transcript && !listeningWindow) {
      setIsSpeaking(true);
      const timeout = setTimeout(() => setIsSpeaking(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [transcript, listeningWindow]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic size={20} className="text-purple-400" />
            <h3 className="font-semibold text-white">Voice Conversation</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                ttsEnabled ? 'bg-purple-600/20 text-purple-400' : 'bg-gray-700 text-gray-500'
              }`}
            >
              {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          KittenTTS (47 voices) • Whistle STT (7 languages) • Wake word: "Hey Nexus"
        </p>
      </div>

      {/* Main Controls */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Wake Word Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActive(!active)}
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
            active
              ? 'bg-red-600/20 border-2 border-red-500 shadow-lg shadow-red-500/20'
              : 'bg-gray-800 border-2 border-gray-600 hover:border-purple-500'
          }`}
        >
          {active ? (
            <div className="text-center">
              <MicOff size={32} className="text-red-400 mx-auto mb-1" />
              <span className="text-xs text-red-300">Listening</span>
            </div>
          ) : (
            <div className="text-center">
              <Mic size={32} className="text-gray-400 mx-auto mb-1" />
              <span className="text-xs text-gray-500">Wake</span>
            </div>
          )}
        </motion.button>

        <p className="text-sm text-gray-400 mt-4">
          {active ? 'Say "Hey Nexus" to start talking' : 'Click to enable wake word detection'}
        </p>

        {/* Listening Window */}
        <AnimatePresence>
          {listeningWindow && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 w-full max-w-md"
            >
              <div className="bg-gray-800 rounded-xl border border-purple-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-white">Listening...</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-purple-400">
                    <Clock size={14} />
                    <span>{formatTime(timeRemaining)}</span>
                  </div>
                </div>

                {/* Waveform Visualization */}
                <div className="flex items-center justify-center gap-1 h-16 mb-4">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: listeningWindow ? [20, 40, 20] : 20,
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                      className="w-1 bg-purple-500 rounded-full"
                      style={{ height: 20 }}
                    />
                  ))}
                </div>

                {/* Transcript */}
                {transcript && (
                  <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-300">{transcript}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>Language: {detectedLanguage.toUpperCase()}</span>
                      <span>•</span>
                      <span>Auto-translated to English</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleStopListening}
                  className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                >
                  Stop Listening
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Speaking Indicator */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 flex items-center gap-2 text-sm text-purple-400"
            >
              <Volume2 size={16} className="animate-pulse" />
              <span>AI is speaking... (Bruno voice)</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-green-400">16.9MB</p>
            <p className="text-xs text-gray-500">Whistle STT</p>
          </div>
          <div>
            <p className="text-lg font-bold text-purple-400">47</p>
            <p className="text-xs text-gray-500">TTS Voices</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-400">7</p>
            <p className="text-xs text-gray-500">Languages</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
          <AlertCircle size={12} />
          <span>1-minute listening window • Extends on speech • Auto-closes on silence</span>
        </div>
      </div>
    </div>
  );
}
