import React from 'react';
import { 
  X, Volume2, VolumeX, Gauge, Waves, SlidersHorizontal, 
  RotateCcw, Sun, Moon 
} from 'lucide-react';
import { audioManager } from '../../audio/audioManager';

export default function MobileDrawer({
  isOpen, onClose,
  volume, setVolume, isMuted, setIsMuted,
  speed, setSpeed,
  effects, setEffects,
  onResetConfig,
  theme, onToggleTheme
}) {
  if (!isOpen) return null;

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) setIsMuted(true);
    else if (isMuted) setIsMuted(false);
  };

  const toggleEffect = (effect) => {
    const newEffects = { ...effects, [effect]: !effects[effect] };
    setEffects(newEffects);
    audioManager.setEffect(effect, newEffects[effect]);
  };

  return (
    <div className="mobile-drawer-overlay" onClick={onClose}>
      <div className="mobile-drawer-content glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="mobile-drawer-header">
          <div className="drawer-title">
            <SlidersHorizontal size={20} color="var(--accent-primary)" />
            <span>Controls & FX</span>
          </div>
          <button className="btn btn-icon btn-xs" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <div className="mobile-drawer-body">
          {/* Master Volume */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">Master Volume</h4>
            <div className="drawer-volume-row">
              <button 
                className="btn btn-icon"
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={18} color="#ef4444" />
                ) : (
                  <Volume2 size={18} color="var(--accent-primary)" />
                )}
              </button>

              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={isMuted ? 0 : volume} 
                onChange={handleVolumeChange} 
                className="volume-slider drawer-slider" 
              />

              <span className="volume-value">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
          </div>

          {/* Playback Speed & Theme */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">Settings & Playback</h4>
            <div className="drawer-row-flex">
              <button
                className="btn btn-sm"
                onClick={onToggleTheme}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>

            <div className="drawer-speed-row" style={{ marginTop: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Gauge size={14} />
                <span>Speed:</span>
              </div>
              <div className="speed-buttons">
                {speedOptions.map((s) => (
                  <button
                    key={s}
                    className={`btn btn-xs ${speed === s ? 'btn-active' : ''}`}
                    onClick={() => setSpeed(s)}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>


          {/* Audio FX Chain */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">
              <Waves size={14} color="var(--accent-cyan)" /> Audio FX Chain
            </h4>
            <div className="drawer-fx-list">
              {/* Reverb */}
              <div className={`effect-card ${effects.reverb ? 'active' : ''}`}>
                <div className="effect-card-header">
                  <button
                    className={`effect-toggle ${effects.reverb ? 'on' : ''}`}
                    onClick={() => toggleEffect('reverb')}
                  >
                    {effects.reverb ? 'ON' : 'OFF'}
                  </button>
                  <span className="effect-name">🏛️ Reverb</span>
                </div>
                {effects.reverb && (
                  <label className="effect-slider-label">
                    <span>Mix</span>
                    <input
                      type="range" min="0" max="1" step="0.05"
                      value={effects.reverbMix || 0.3}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setEffects(prev => ({ ...prev, reverbMix: val }));
                        audioManager.setEffectParam('reverbMix', val);
                      }}
                      className="effect-slider"
                    />
                    <span className="effect-value">{Math.round((effects.reverbMix || 0.3) * 100)}%</span>
                  </label>
                )}
              </div>

              {/* Delay */}
              <div className={`effect-card ${effects.delay ? 'active' : ''}`}>
                <div className="effect-card-header">
                  <button
                    className={`effect-toggle ${effects.delay ? 'on' : ''}`}
                    onClick={() => toggleEffect('delay')}
                  >
                    {effects.delay ? 'ON' : 'OFF'}
                  </button>
                  <span className="effect-name">🔁 Delay</span>
                </div>
                {effects.delay && (
                  <>
                    <label className="effect-slider-label">
                      <span>Time</span>
                      <input
                        type="range" min="0.05" max="1" step="0.05"
                        value={effects.delayTime || 0.3}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setEffects(prev => ({ ...prev, delayTime: val }));
                          audioManager.setEffectParam('delayTime', val);
                        }}
                        className="effect-slider"
                      />
                      <span className="effect-value">{((effects.delayTime || 0.3) * 1000).toFixed(0)}ms</span>
                    </label>
                  </>
                )}
              </div>

              {/* Filter */}
              <div className={`effect-card ${effects.filter ? 'active' : ''}`}>
                <div className="effect-card-header">
                  <button
                    className={`effect-toggle ${effects.filter ? 'on' : ''}`}
                    onClick={() => toggleEffect('filter')}
                  >
                    {effects.filter ? 'ON' : 'OFF'}
                  </button>
                  <span className="effect-name">🎛️ Filter</span>
                </div>
                {effects.filter && (
                  <label className="effect-slider-label">
                    <span>Freq</span>
                    <input
                      type="range" min="100" max="10000" step="100"
                      value={effects.filterFreq || 2000}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setEffects(prev => ({ ...prev, filterFreq: val }));
                        audioManager.setEffectParam('filterFreq', val);
                      }}
                      className="effect-slider"
                    />
                    <span className="effect-value">{((effects.filterFreq || 2000) / 1000).toFixed(1)}kHz</span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="mobile-drawer-footer">
          <button 
            className="btn btn-sm btn-secondary-glass"
            onClick={() => { onResetConfig(); onClose(); }}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <RotateCcw size={14} /> Reset Mappings
          </button>
        </div>
      </div>
    </div>
  );
}
