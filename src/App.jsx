import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header/Header';
import PianoContainer from './components/Piano/PianoContainer';
import VolumeControl from './components/VolumeControl/VolumeControl';
import RotateScreenOverlay from './components/Piano/RotateScreenOverlay';
import MobileDrawer from './components/Mobile/MobileDrawer';

import { DEFAULT_PIANO_KEYS, midiNoteToKeyId } from './config/pianoConfig';
import { audioManager } from './audio/audioManager';
import useLocalStorage from './hooks/useLocalStorage';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

export default function App() {
  // ==================== STATE ====================

  // Config (persisted)
  const [keysConfig, setKeysConfig, resetKeysConfig] = useLocalStorage('meme_piano_keys_v24', DEFAULT_PIANO_KEYS);
  const [volume, setVolume] = useLocalStorage('meme_piano_vol', 0.8);
  const [theme, setTheme] = useLocalStorage('meme_piano_theme', 'dark');

  // Auto-sync if user has cached config with fewer keys than DEFAULT_PIANO_KEYS
  useEffect(() => {
    if (keysConfig.length < DEFAULT_PIANO_KEYS.length) {
      setKeysConfig(DEFAULT_PIANO_KEYS);
    }
  }, [keysConfig, setKeysConfig]);

  // Active state
  const [activeKeyIds, setActiveKeyIds] = useState(new Set());
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [midiConnected, setMidiConnected] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Effects state
  const [effects, setEffects] = useState({
    reverb: false, delay: false, filter: false,
    reverbMix: 0.3, delayTime: 0.3, delayFeedback: 0.4,
    filterFreq: 2000, filterType: 'lowpass'
  });

  // ==================== KEY TRIGGER ====================

  const triggerKey = useCallback((keyConfig) => {
    if (!keyConfig) return;

    audioManager.playSound(keyConfig);

    setActiveKeyIds(prev => {
      const next = new Set(prev);
      next.add(keyConfig.id);
      return next;
    });

    // Auto-clear visual highlight
    setTimeout(() => {
      setActiveKeyIds(prev => {
        const next = new Set(prev);
        next.delete(keyConfig.id);
        return next;
      });
    }, 200);
  }, []);

  const handleKeyRelease = useCallback((keyConfig) => {
    setActiveKeyIds(prev => {
      const next = new Set(prev);
      next.delete(keyConfig.id);
      return next;
    });
  }, []);

  // ==================== HOOKS ====================

  useKeyboardShortcuts(keysConfig, triggerKey, handleKeyRelease);

  // ==================== AUDIO MANAGER SYNC ====================

  useEffect(() => {
    audioManager.setVolume(volume);
    audioManager.setMuted(isMuted);
    audioManager.setPlaybackSpeed(speed);
  }, [volume, isMuted, speed]);

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

    audioManager.initMIDI((type, midiNote) => {
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
      }
    });
  }, []);

  // ==================== CONFIG HANDLERS ====================

  const handleResetConfig = useCallback(() => {
    if (window.confirm('Reset all sound mappings to default?')) {
      resetKeysConfig();
    }
  }, [resetKeysConfig]);

  // ==================== RENDER ====================

  return (
    <div className="app-container">
      {/* Mobile Portrait Rotate Overlay */}
      <RotateScreenOverlay />

      {/* Header */}
      <Header
        onResetConfig={handleResetConfig}
        theme={theme}
        onToggleTheme={toggleTheme}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        midiConnected={midiConnected}
        onRotateScreen={handleRotateScreen}
        onToggleMobileMenu={() => setShowMobileMenu(prev => !prev)}
      />

      {/* Mobile Sidebar / Controls Drawer */}
      <MobileDrawer
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        volume={volume}
        setVolume={setVolume}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        speed={speed}
        setSpeed={setSpeed}
        effects={effects}
        setEffects={setEffects}
        onResetConfig={handleResetConfig}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Desktop Control Bar: Volume, Speed, Effects */}
      <VolumeControl
        volume={volume}
        setVolume={setVolume}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        speed={speed}
        setSpeed={setSpeed}
        effects={effects}
        setEffects={setEffects}
      />

      {/* Main Piano */}
      <PianoContainer
        keysConfig={keysConfig}
        activeKeyIds={activeKeyIds}
        onTriggerKey={triggerKey}
      />
    </div>
  );
}
