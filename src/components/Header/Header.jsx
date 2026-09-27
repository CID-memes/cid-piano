import React from 'react';
import { Music, SlidersHorizontal, Mic, RotateCcw, Info, Maximize, Minimize, Sun, Moon, Grid3X3, Usb, RotateCw } from 'lucide-react';

export default function Header({
  activeTab, setActiveTab, onResetConfig,
  showInfoModal, setShowInfoModal,
  theme, onToggleTheme,
  isFullscreen, onToggleFullscreen,
  midiConnected, onRotateScreen
}) {
  return (
    <header className="header glass-panel">
      <div className="brand-title">
        <div className="brand-logo">
          <Music size={24} color="#ffffff" />
        </div>
        <div>
          <h1>MEME PIANO</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Your Sounds. Your Keys. Zero Latency.</p>
        </div>
        <span className="brand-badge">PRO v3.0</span>
        {midiConnected && (
          <span className="brand-badge midi-badge">
            <Usb size={10} /> MIDI
          </span>
        )}
      </div>

      <div className="header-actions">
        {onRotateScreen && (
          <button
            className="btn btn-icon btn-rotate-header"
            title="Rotate Screen to Landscape"
            onClick={onRotateScreen}
            id="btn-rotate"
          >
            <RotateCw size={16} />
            <span className="btn-label-mobile">Rotate</span>
          </button>
        )}

        <button 
          className="btn btn-icon"
          title="Reset Sound Mappings"
          onClick={onResetConfig}
          id="btn-reset"
        >
          <RotateCcw size={16} />
        </button>

        <button
          className="btn btn-icon"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onClick={onToggleTheme}
          id="btn-theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          className="btn btn-icon"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          onClick={onToggleFullscreen}
          id="btn-fullscreen"
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>

        <button 
          className="btn btn-icon"
          title="Keyboard Shortcuts & Info"
          onClick={() => setShowInfoModal(true)}
          id="btn-info"
        >
          <Info size={16} />
        </button>
      </div>
    </header>
  );
}
