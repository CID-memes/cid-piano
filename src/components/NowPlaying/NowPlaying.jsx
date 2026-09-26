import React from 'react';
import Visualizer from '../SoundVisualizer/Visualizer';
import { CATEGORY_COLORS } from '../../config/pianoConfig';

export default function NowPlaying({ activeKey, chord, sustainMode }) {
  const catColor = activeKey
    ? (CATEGORY_COLORS[activeKey.category] || CATEGORY_COLORS.Meme)
    : CATEGORY_COLORS.Meme;

  return (
    <div
      className="now-playing-container glass-panel"
      style={activeKey ? { borderColor: `${catColor.primary}40` } : {}}
    >
      {/* Animated accent bar using category color */}
      <div
        className="now-playing-accent-bar"
        style={{ background: activeKey ? catColor.gradient : 'linear-gradient(to bottom, #6366f1, #a855f7)' }}
      />

      <div className="now-playing-left">
        <div className={`now-playing-emoji ${activeKey ? 'pop' : ''}`}
          style={activeKey ? {
            borderColor: `${catColor.primary}30`,
            boxShadow: `0 0 20px ${catColor.glow}`
          } : {}}
        >
          {activeKey ? activeKey.emoji : '🎹'}
        </div>
        <div className="now-playing-info">
          <div className="now-playing-status">
            <span className={`status-dot ${activeKey ? 'active' : ''}`}
              style={activeKey ? { background: catColor.primary } : {}}
            />
            {activeKey ? 'NOW PLAYING' : 'PIANO READY'}
          </div>
          <h3>
            {activeKey ? activeKey.soundName : 'Press any key or shortcut'}
          </h3>
          <div className="now-playing-details">
            {activeKey && (
              <>
                <span className="tag" style={{ background: `${catColor.primary}25`, color: catColor.primary, border: `1px solid ${catColor.primary}40` }}>
                  Note: {activeKey.id}
                </span>
                <span className="tag tag-shortcut">Key [ {activeKey.shortcut.toUpperCase()} ]</span>
                <span className="tag" style={{ background: `${catColor.primary}20`, color: catColor.primary }}>
                  {activeKey.category || 'Meme'}
                </span>
                {chord && (
                  <span className="tag tag-chord">
                    🎵 {chord}
                  </span>
                )}
                {sustainMode && (
                  <span className="tag tag-sustain">SUSTAIN</span>
                )}
              </>
            )}
            {!activeKey && (
              <span className="tag">Use Mouse, Touch, Keyboard (A-L, W-P) or MIDI</span>
            )}
          </div>
        </div>
      </div>

      <div className="now-playing-right">
        <Visualizer isPlaying={!!activeKey} />
      </div>
    </div>
  );
}
