import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header/Header';
import PianoContainer from './components/Piano/PianoContainer';
import NowPlaying from './components/NowPlaying/NowPlaying';
import VolumeControl from './components/VolumeControl/VolumeControl';
import RecorderControls from './components/Recorder/RecorderControls';
import ToastContainer from './components/Toast/ToastContainer';
import InfoModal from './components/InfoModal/InfoModal';
import BeatSequencer from './components/Sequencer/BeatSequencer';

import { DEFAULT_PIANO_KEYS, SOUND_PACKS, detectChord, midiNoteToKeyId } from './config/pianoConfig';
import { audioManager } from './audio/audioManager';
import useLocalStorage from './hooks/useLocalStorage';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import useRecorder from './hooks/useRecorder';

// Lazy load SoundLibrary since it's a secondary panel
const SoundLibrary = lazy(() => import('./components/SoundLibrary/SoundLibrary'));

export default function App() {
  // ==================== STATE ====================

  // Config (persisted)
  const [keysConfig, setKeysConfig, resetKeysConfig] = useLocalStorage('meme_piano_keys_v3', DEFAULT_PIANO_KEYS);
  const [volume, setVolume] = useLocalStorage('meme_piano_vol', 0.8);
  const [theme, setTheme] = useLocalStorage('meme_piano_theme', 'dark');

  // Active state
  const [activeKeyIds, setActiveKeyIds] = useState(new Set());
  const [nowPlayingKey, setNowPlayingKey] = useState(null);
  const [activeTab, setActiveTab] = useState('piano');
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [sustainMode, setSustainMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [midiConnected, setMidiConnected] = useState(false);
  const [chord, setChord] = useState(null);

  // Effects state
  const [effects, setEffects] = useState({
    reverb: false, delay: false, filter: false,
    reverbMix: 0.3, delayTime: 0.3, delayFeedback: 0.4,
    filterFreq: 2000, filterType: 'lowpass'
  });

  // Toasts & Modals
  const [toasts, setToasts] = useState([]);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // ==================== TOAST HELPERS ====================

  const addToast = useCallback((toast) => {
    setToasts(prev => [...prev.slice(-3), { ...toast, id: toast.id || Date.now() + Math.random() }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ==================== KEY TRIGGER ====================

  const triggerKey = useCallback((keyConfig) => {
    if (!keyConfig) return;

    audioManager.playSound(keyConfig);

    setNowPlayingKey(keyConfig);
    setActiveKeyIds(prev => {
      const next = new Set(prev);
      next.add(keyConfig.id);

      // Detect chord when multiple keys active
      const chordName = detectChord(next, keysConfig);
      setChord(chordName);

      return next;
    });

    // Auto-clear visual highlight unless sustain mode
    if (!sustainMode) {
      setTimeout(() => {
        setActiveKeyIds(prev => {
          const next = new Set(prev);
          next.delete(keyConfig.id);
          if (next.size === 0) setChord(null);
          return next;
        });
      }, 200);
    }

    // Record if active
    if (recorder.isRecording) {
      recorder.recordNote(keyConfig);
    }
  }, [sustainMode, keysConfig]);

  const handleKeyRelease = useCallback((keyConfig) => {
    if (sustainMode) {
      audioManager.releaseKey(keyConfig.id);
      setActiveKeyIds(prev => {
        const next = new Set(prev);
        next.delete(keyConfig.id);
        if (next.size === 0) setChord(null);
        else setChord(detectChord(next, keysConfig));
        return next;
      });
    }
  }, [sustainMode, keysConfig]);

  // ==================== HOOKS ====================

  useKeyboardShortcuts(keysConfig, triggerKey, handleKeyRelease);
  const recorder = useRecorder(triggerKey);

  // ==================== AUDIO MANAGER SYNC ====================

  useEffect(() => {
    audioManager.setVolume(volume);
    audioManager.setMuted(isMuted);
    audioManager.setPlaybackSpeed(speed);
  }, [volume, isMuted, speed]);

  useEffect(() => {
    audioManager.setSustainMode(sustainMode);
  }, [sustainMode]);

  useEffect(() => {
    audioManager.setErrorCallback((path) => {
      addToast({
        type: 'warning',
        title: 'Sound file missing',
        message: `${path.split('/').pop()} could not be loaded. Using synthesized audio.`
      });
    });
    audioManager.preloadAll(keysConfig);
  }, []);

  // ==================== THEME ====================

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  // ==================== FULLSCREEN ====================

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ==================== MIDI ====================

  useEffect(() => {
    const keyMap = new Map(keysConfig.map(k => [k.id, k]));

    audioManager.initMIDI((type, midiNote, velocity) => {
      const keyId = midiNoteToKeyId(midiNote);
      const keyConfig = keyMap.get(keyId);

      if (type === 'noteOn' && keyConfig) {
        triggerKey(keyConfig);
      } else if (type === 'noteOff' && keyConfig) {
        handleKeyRelease(keyConfig);
      }
    }).then(success => {
      if (success) {
        setMidiConnected(true);
        addToast({
          type: 'info',
          title: 'MIDI Connected',
          message: 'MIDI keyboard detected and ready to play!'
        });
      }
    });
  }, []);

  // ==================== RECORDER HANDLERS ====================

  const handleToggleRecord = useCallback((recording) => {
    if (recording) {
      recorder.startRecording();
      addToast({ type: 'info', title: 'Recording started', message: 'Play keys to record your performance.' });
    } else {
      recorder.stopRecording();
      addToast({ type: 'info', title: 'Recording stopped', message: `Saved ${recorder.recordedNotes.length} notes.` });
    }
  }, [recorder, addToast]);

  const handleImportSequence = useCallback((code) => {
    return recorder.importRecording(code, keysConfig);
  }, [recorder, keysConfig]);

  // ==================== CONFIG HANDLERS ====================

  const handleResetConfig = useCallback(() => {
    if (window.confirm('Reset all sound mappings and shortcuts to default configuration?')) {
      resetKeysConfig();
      addToast({ type: 'info', title: 'Reset Complete', message: 'Sound configuration restored to defaults.' });
    }
  }, [resetKeysConfig, addToast]);

  const handleUpdateKeyConfig = useCallback((id, updates) => {
    setKeysConfig(prev => prev.map(k => k.id === id ? { ...k, ...updates } : k));
  }, [setKeysConfig]);

  const handleLoadPack = useCallback((packId) => {
    const pack = SOUND_PACKS[packId];
    if (!pack) return;
    if (pack.preset === 'default') {
      setKeysConfig(DEFAULT_PIANO_KEYS);
    } else if (pack.keys) {
      setKeysConfig(pack.keys);
    }
  }, [setKeysConfig]);

  // ==================== RENDER ====================

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetConfig={handleResetConfig}
        showInfoModal={showInfoModal}
        setShowInfoModal={setShowInfoModal}
        theme={theme}
        onToggleTheme={toggleTheme}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        midiConnected={midiConnected}
      />

      {/* Control Bar: Volume, Speed, Sustain, Effects */}
      <VolumeControl
        volume={volume}
        setVolume={setVolume}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        speed={speed}
        setSpeed={setSpeed}
        sustainMode={sustainMode}
        setSustainMode={setSustainMode}
        effects={effects}
        setEffects={setEffects}
      />

      {/* Now Playing HUD with chord detection */}
      <NowPlaying
        activeKey={nowPlayingKey}
        chord={chord}
        sustainMode={sustainMode}
      />

      {/* Main Piano */}
      <PianoContainer
        keysConfig={keysConfig}
        activeKeyIds={activeKeyIds}
        onTriggerKey={triggerKey}
      />

      {/* Recorder Controls */}
      <RecorderControls
        recordedNotes={recorder.recordedNotes}
        isRecording={recorder.isRecording}
        onToggleRecord={handleToggleRecord}
        onPlayRecording={recorder.playRecording}
        onClearRecording={recorder.clearRecording}
        onExportSequence={recorder.exportRecording}
        onImportSequence={handleImportSequence}
        addToast={addToast}
      />

      {/* Beat Sequencer */}
      {activeTab === 'sequencer' && (
        <BeatSequencer
          keysConfig={keysConfig}
          onTriggerKey={triggerKey}
        />
      )}

      {/* Sound Library (lazy loaded) */}
      {activeTab === 'library' && (
        <Suspense fallback={
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading Sound Library...
          </div>
        }>
          <SoundLibrary
            keysConfig={keysConfig}
            onUpdateKeyConfig={handleUpdateKeyConfig}
            onTriggerKey={triggerKey}
            onLoadPack={handleLoadPack}
            addToast={addToast}
          />
        </Suspense>
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Info Modal */}
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  );
}
