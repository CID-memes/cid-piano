import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Square, SkipBack, Trash2, Plus, Minus } from 'lucide-react';

const STEPS = 16;
const DEFAULT_BPM = 120;

export default function BeatSequencer({ keysConfig, onTriggerKey }) {
  // Use first 8 keys as sequencer rows
  const seqKeys = keysConfig.slice(0, 8);
  const [grid, setGrid] = useState(() => {
    return seqKeys.map(() => new Array(STEPS).fill(false));
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const intervalRef = useRef(null);
  const stepRef = useRef(-1);

  // Update grid if keys change
  useEffect(() => {
    setGrid(prev => {
      const newGrid = seqKeys.map((_, rowIdx) => {
        return prev[rowIdx] || new Array(STEPS).fill(false);
      });
      return newGrid;
    });
  }, [seqKeys.length]);

  const toggleCell = (row, col) => {
    setGrid(prev => {
      const newGrid = prev.map(r => [...r]);
      newGrid[row][col] = !newGrid[row][col];
      return newGrid;
    });
  };

  const clearGrid = () => {
    setGrid(seqKeys.map(() => new Array(STEPS).fill(false)));
  };

  const startPlayback = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    stepRef.current = -1;

    const intervalMs = (60 / bpm) * 1000 / 4; // 16th notes

    intervalRef.current = setInterval(() => {
      stepRef.current = (stepRef.current + 1) % STEPS;
      setCurrentStep(stepRef.current);

      // Trigger sounds for active cells
      grid.forEach((row, rowIdx) => {
        if (row[stepRef.current] && seqKeys[rowIdx]) {
          onTriggerKey(seqKeys[rowIdx]);
        }
      });
    }, intervalMs);
  }, [isPlaying, bpm, grid, seqKeys, onTriggerKey]);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(-1);
    stepRef.current = -1;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Restart when bpm changes during playback
  useEffect(() => {
    if (isPlaying) {
      stopPlayback();
      // Small delay then restart
      setTimeout(() => startPlayback(), 50);
    }
  }, [bpm]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="sequencer-panel glass-panel">
      <div className="sequencer-header">
        <div>
          <h3 className="sequencer-title">🎛️ Beat Sequencer</h3>
          <p className="sequencer-desc">Create loops by toggling cells on the grid</p>
        </div>

        <div className="sequencer-controls">
          <div className="bpm-control">
            <button
              className="btn btn-xs btn-icon"
              onClick={() => setBpm(prev => Math.max(40, prev - 5))}
            >
              <Minus size={12} />
            </button>
            <span className="bpm-display">{bpm} BPM</span>
            <button
              className="btn btn-xs btn-icon"
              onClick={() => setBpm(prev => Math.min(300, prev + 5))}
            >
              <Plus size={12} />
            </button>
          </div>

          <button
            className={`btn ${isPlaying ? 'btn-recording' : 'btn-primary'}`}
            onClick={isPlaying ? stopPlayback : startPlayback}
          >
            {isPlaying ? <Square size={14} fill="#fff" /> : <Play size={14} fill="#fff" />}
            <span>{isPlaying ? 'Stop' : 'Play'}</span>
          </button>

          <button className="btn btn-xs" onClick={() => { stopPlayback(); setCurrentStep(-1); }}>
            <SkipBack size={14} />
          </button>

          <button className="btn btn-xs" onClick={clearGrid} title="Clear grid">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Step indicator */}
      <div className="seq-step-indicators">
        <div className="seq-row-label" />
        {Array.from({ length: STEPS }, (_, i) => (
          <div
            key={i}
            className={`seq-step-num ${currentStep === i ? 'active' : ''} ${i % 4 === 0 ? 'beat-start' : ''}`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="seq-grid">
        {seqKeys.map((key, rowIdx) => (
          <div key={key.id} className="seq-row">
            <div className="seq-row-label" title={key.soundName}>
              <span className="seq-emoji">{key.emoji}</span>
              <span className="seq-name">{key.soundName}</span>
            </div>
            {Array.from({ length: STEPS }, (_, colIdx) => {
              const isActive = grid[rowIdx]?.[colIdx];
              const isCurrent = currentStep === colIdx;
              const isBeatStart = colIdx % 4 === 0;

              return (
                <button
                  key={colIdx}
                  className={`seq-cell ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''} ${isBeatStart ? 'beat-start' : ''}`}
                  onClick={() => toggleCell(rowIdx, colIdx)}
                  style={isActive ? {
                    background: `var(--accent-primary)`,
                    boxShadow: isCurrent ? '0 0 12px var(--accent-glow)' : 'none'
                  } : {}}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
