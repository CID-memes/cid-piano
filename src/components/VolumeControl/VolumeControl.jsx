import React, { useState } from 'react';
import { Volume2, VolumeX, Gauge, Waves, Timer, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { audioManager } from '../../audio/audioManager';

export default function VolumeControl({
  volume, setVolume, isMuted, setIsMuted, speed, setSpeed,
  sustainMode, setSustainMode,
  effects, setEffects
}) {
  const [showEffects, setShowEffects] = useState(false);

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  const toggleEffect = (effect) => {
    const newEffects = { ...effects, [effect]: !effects[effect] };
    setEffects(newEffects);
    audioManager.setEffect(effect, newEffects[effect]);
  };

  return (
    <div className="controls-wrapper">
      <div className="controls-bar glass-panel-sm" style={{ padding: '0.75rem 1.25rem' }}>
        {/* Master Volume */}
        <div className="volume-control">
          <button 
            className="btn btn-icon" 
            style={{ padding: '0.4rem 0.6rem', border: 'none', background: 'transparent' }}
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={20} color="#ef4444" />
            ) : (
              <Volume2 size={20} color="var(--accent-primary)" />
            )}
          </button>

          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume} 
            onChange={handleVolumeChange} 
            className="volume-slider" 
            id="volume-slider"
          />

          <span className="volume-value">
            {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
          </span>
        </div>

        {/* Speed Control */}
        <div className="speed-control">
          <Gauge size={16} color="var(--accent-secondary)" />
          <span className="control-label">Speed:</span>
          <div className="speed-buttons">
            {speedOptions.map((s) => (
              <button
                key={s}
                className={`btn btn-sm ${speed === s ? 'btn-active' : ''}`}
                onClick={() => setSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Sustain Toggle */}
        <div className="sustain-control">
          <button
            className={`btn btn-sm ${sustainMode ? 'btn-active btn-sustain-active' : ''}`}
            onClick={() => setSustainMode(!sustainMode)}
            title="Hold notes while key is pressed"
          >
            <Timer size={14} />
            <span>Sustain</span>
          </button>
        </div>

        {/* Effects Toggle */}
        <button
          className={`btn btn-sm ${showEffects ? 'btn-active' : ''}`}
          onClick={() => setShowEffects(!showEffects)}
          title="Audio Effects"
        >
          <Waves size={14} />
          <span>FX</span>
          {showEffects ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Effects Panel */}
      {showEffects && (
        <div className="effects-panel glass-panel-sm" id="effects-panel">
          <div className="effects-header">
            <SlidersHorizontal size={16} color="var(--accent-secondary)" />
            <span>Audio Effects Chain</span>
          </div>

          <div className="effects-grid">
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
                  disabled={!effects.reverb}
                />
                <span className="effect-value">{Math.round((effects.reverbMix || 0.3) * 100)}%</span>
              </label>
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
                  disabled={!effects.delay}
                />
                <span className="effect-value">{((effects.delayTime || 0.3) * 1000).toFixed(0)}ms</span>
              </label>
              <label className="effect-slider-label">
                <span>Feedback</span>
                <input
                  type="range" min="0" max="0.8" step="0.05"
                  value={effects.delayFeedback || 0.4}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setEffects(prev => ({ ...prev, delayFeedback: val }));
                    audioManager.setEffectParam('delayFeedback', val);
                  }}
                  className="effect-slider"
                  disabled={!effects.delay}
                />
                <span className="effect-value">{Math.round((effects.delayFeedback || 0.4) * 100)}%</span>
              </label>
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
                  disabled={!effects.filter}
                />
                <span className="effect-value">{((effects.filterFreq || 2000) / 1000).toFixed(1)}kHz</span>
              </label>
              <div className="filter-type-buttons">
                {['lowpass', 'highpass', 'bandpass'].map(type => (
                  <button
                    key={type}
                    className={`btn btn-xs ${(effects.filterType || 'lowpass') === type ? 'btn-active' : ''}`}
                    onClick={() => {
                      setEffects(prev => ({ ...prev, filterType: type }));
                      audioManager.setEffectParam('filterType', type);
                    }}
                    disabled={!effects.filter}
                  >
                    {type === 'lowpass' ? 'LP' : type === 'highpass' ? 'HP' : 'BP'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
