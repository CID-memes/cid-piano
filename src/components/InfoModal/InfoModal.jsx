import React from 'react';
import { X, Keyboard, FolderPlus, Zap, Music, Usb, Waves, Grid3X3 } from 'lucide-react';

export default function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className="modal-title">
          <Keyboard size={22} color="var(--accent-primary)" />
          Piano Guide & Shortcuts
        </h2>

        <div className="modal-sections">
          {/* Keyboard Map */}
          <div className="modal-section">
            <h4 className="section-title">
              <Zap size={16} color="var(--accent-secondary)" /> Desktop Keyboard Map
            </h4>
            <p className="section-desc">
              Play sounds directly using your QWERTY keyboard:
            </p>
            <div className="keyboard-map-visual">
              <div className="kb-row">
                <span className="kb-label">Black:</span>
                {['W', 'E', '', 'T', 'Y', 'U', '', 'I', 'O', 'P'].map((k, i) => (
                  k ? <span key={i} className="kb-key black">{k}</span> : <span key={i} className="kb-spacer" />
                ))}
              </div>
              <div className="kb-row">
                <span className="kb-label">White:</span>
                {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Z', 'X', 'C'].map((k, i) => (
                  <span key={i} className="kb-key white">{k}</span>
                ))}
              </div>
            </div>
          </div>

          {/* New Features */}
          <div className="modal-section">
            <h4 className="section-title">
              <Music size={16} color="var(--accent-cyan)" /> Features
            </h4>
            <ul className="feature-list">
              <li><strong>🎹 Piano</strong> — 24 keys across 2 octaves with custom meme sounds</li>
              <li><strong>🎛️ Effects</strong> — Reverb, Delay, and Filter with adjustable parameters</li>
              <li><strong>⏯️ Sustain</strong> — Hold notes while the key is pressed</li>
              <li><strong>🎤 Recorder</strong> — Record performances and export as audio</li>
              <li><strong>🔗 Sharing</strong> — Export/import sequences as shareable codes</li>
              <li><strong>🎵 Sequencer</strong> — 16-step beat grid to create loops</li>
              <li><strong>📁 Sound Packs</strong> — Switch between preset sound collections</li>
              <li><strong>🎧 Drag & Drop</strong> — Drop audio files onto keys to customize</li>
              <li><strong>🌙 Themes</strong> — Toggle between dark and light mode</li>
            </ul>
          </div>

          {/* MIDI */}
          <div className="modal-section">
            <h4 className="section-title">
              <Usb size={16} color="#10b981" /> MIDI Controller Support
            </h4>
            <p className="section-desc">
              Connect a MIDI keyboard to play with hardware. MIDI notes C4–B5 are mapped automatically.
              Look for the <span className="tag" style={{ display: 'inline', fontSize: '0.7rem' }}>MIDI</span> badge in the header when connected.
            </p>
          </div>

          {/* Sequencer */}
          <div className="modal-section">
            <h4 className="section-title">
              <Grid3X3 size={16} color="#f59e0b" /> Beat Sequencer
            </h4>
            <p className="section-desc">
              Open the Sequencer tab to access the 16-step beat grid. Click cells to toggle sounds on/off.
              Adjust BPM to control tempo. Great for creating drum patterns and loops!
            </p>
          </div>

          {/* Custom Sounds */}
          <div className="modal-section">
            <h4 className="section-title">
              <FolderPlus size={16} color="var(--accent-cyan)" /> Adding Custom Sounds
            </h4>
            <p className="section-desc">
              1. Open <strong>Sound Library</strong> and drag audio files onto any row, or use the upload button.<br/>
              2. Use <strong>Learn Shortcut</strong> (⌨️ icon) to bind any keyboard key instantly.<br/>
              3. Try different <strong>Sound Packs</strong> for pre-built theme presets.<br/>
              4. All customizations are saved to your browser automatically.
            </p>
          </div>
        </div>

        <button 
          className="btn btn-primary"
          onClick={onClose}
          style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
        >
          Got it, let's play! 🎹
        </button>
      </div>
    </div>
  );
}
