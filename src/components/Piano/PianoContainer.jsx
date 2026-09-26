import React from 'react';
import PianoKey from './PianoKey';

export default function PianoContainer({ keysConfig, activeKeyIds, onTriggerKey }) {
  // Group keys by Octave
  const octaves = [4, 5];

  // Helper to get key by note & octave
  const getKey = (note, octave) => {
    return keysConfig.find(k => k.note === note && k.octave === octave);
  };

  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  return (
    <div className="piano-wrapper glass-panel">
      <div className="piano-octave-legend">
        <span>OCTAVE 4 (LOWER)</span>
        <span>OCTAVE 5 (UPPER)</span>
      </div>

      <div className="piano-scroll-container" id="piano-scroll">
        <div className="piano-keys-container">
          {octaves.map(oct => {
            return (
              <div 
                key={oct} 
                className="piano-octave-group"
                style={{ 
                  display: 'flex', 
                  position: 'relative', 
                  marginRight: oct === 4 ? '12px' : '0',
                  paddingRight: oct === 4 ? '12px' : '0',
                  borderRight: oct === 4 ? '2px dashed rgba(255, 255, 255, 0.1)' : 'none'
                }}
              >
                {/* White Keys in Octave */}
                {whiteNotes.map((note) => {
                  const keyData = getKey(note, oct);
                  if (!keyData) return null;
                  const isPressed = activeKeyIds.has(keyData.id);

                  // Check if this white note has a corresponding black note to its right
                  const blackNoteMap = { 'C': 'C#', 'D': 'D#', 'F': 'F#', 'G': 'G#', 'A': 'A#' };
                  const blackNote = blackNoteMap[note];
                  const blackKeyData = blackNote ? getKey(blackNote, oct) : null;
                  const isBlackPressed = blackKeyData ? activeKeyIds.has(blackKeyData.id) : false;

                  return (
                    <div key={keyData.id} style={{ position: 'relative', display: 'flex' }}>
                      <PianoKey
                        keyConfig={keyData}
                        isPressed={isPressed}
                        onTrigger={onTriggerKey}
                      />
                      
                      {/* Black Key Overlay */}
                      {blackKeyData && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: '-17px',
                            zIndex: 10
                          }}
                        >
                          <PianoKey
                            keyConfig={blackKeyData}
                            isPressed={isBlackPressed}
                            onTrigger={onTriggerKey}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile swipe hint */}
      <div className="swipe-hint" id="swipe-hint">
        <span>← Swipe to see all keys →</span>
      </div>
    </div>
  );
}
