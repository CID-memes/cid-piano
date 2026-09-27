import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header/Header';
import PianoContainer from './components/Piano/PianoContainer';
import NowPlaying from './components/NowPlaying/NowPlaying';
import VolumeControl from './components/VolumeControl/VolumeControl';
import ToastContainer from './components/Toast/ToastContainer';
import InfoModal from './components/InfoModal/InfoModal';
import BeatSequencer from './components/Sequencer/BeatSequencer';
import RotateScreenOverlay from './components/Piano/RotateScreenOverlay';
import ParticleCanvas from './components/SoundVisualizer/ParticleCanvas';

import { DEFAULT_PIANO_KEYS, SOUND_PACKS, detectChord, midiNoteToKeyId } from './config/pianoConfig';
import { audioManager } from './audio/audioManager';
import useLocalStorage from './hooks/useLocalStorage';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

// Lazy load SoundLibrary since it's a secondary panel
const SoundLibrary = lazy(() => import('./components/SoundLibrary/SoundLibrary'));

export default function App() {
  // ==================== STATE ====================

  // Config (persisted)
  const [keysConfig, setKeysConfig, resetKeysConfig] = useLocalStorage('meme_piano_keys_v6', DEFAULT_PIANO_KEYS);
  const [volume, setVolume] = useLocalStorage('meme_piano_vol', 0.8);
  const [theme, setTheme] = useLocalStorage('meme_piano_theme', 'dark');

  // Auto-sync if new default keys were added
  useEffect(() => {
    if (!keysConfig || keysConfig.length < DEFAULT_PIANO_KEYS.length) {
      setKeysConfig(DEFAULT_PIANO_KEYS);
    }
  }, [keysConfig, setKeysConfig]);

  // Active state
  const [activeKeyIds, setActiveKeyIds] = useState(new Set());
  const [nowPlayingKey, setNowPlayingKey] = useState(null);
  const [lastTriggeredKey, setLastTriggeredKey] = useState(null);
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

  const addToast = useCallback(() => {}, []);
  const removeToast = useCallback(() => {}, []);

  // ==================== KEY TRIGGER ====================

  const triggerKey = useCallback((keyConfig) => {
    if (!keyConfig) return;

    audioManager.playSound(keyConfig);

    setNowPlayingKey(keyConfig);
    setLastTriggeredKey({ keyConfig, timestamp: Date.now() });
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
    audioManager.preloadAll(keysConfig);
  }, []);

  // ==================== THEME ====================

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      return nextTheme;
    });
  }, [setTheme]);

  // ==================== FULLSCREEN & ROTATE ====================

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  const handleRotateScreen = useCallback(async () => {
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen().catch(() => {});
      }
      if (window.screen?.orientation?.lock) {
        await window.screen.orientation.lock('landscape').catch(() => {});
      }
    } catch (e) {
      console.log('Rotate error:', e);
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
      {/* Fullscreen Neon Particle Explosions on Key Hit */}
      <ParticleCanvas triggeredKey={lastTriggeredKey} />

      {/* Mobile Portrait Rotate Overlay */}
      <RotateScreenOverlay />

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
        onRotateScreen={handleRotateScreen}
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
