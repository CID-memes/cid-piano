import React, { useCallback } from 'react';
import PianoKey from './PianoKey';

export default function PianoContainer({ keysConfig, activeKeyIds, onTriggerKey }) {
  // Dynamically determine which octaves exist
  const octaves = [...new Set(keysConfig.map(k => k.octave))].sort();

  // Helper to get key by note & octave
  const getKey = (note, octave) => {
    return keysConfig.find(k => k.note === note && k.octave === octave);
  };

  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const scrollToOctave = useCallback((octave) => {
    const container = document.getElementById('piano-scroll');
    if (octave === 'all') {
      container?.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    const octaveElem = document.getElementById(`octave-group-${octave}`);
    if (container && octaveElem) {
      const offsetLeft = octaveElem.offsetLeft;
      container.scrollTo({ left: offsetLeft - 12, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="piano-wrapper glass-panel">
      <div className="piano-scroll-container" id="piano-scroll">
        <div className="piano-keys-container">
          {octaves.map((oct, octIdx) => {
            // Only render white notes that exist in this octave
            const whiteKeysInOctave = whiteNotes.filter(note => getKey(note, oct));

            return (
              <div 
                key={oct} 
                id={`octave-group-${oct}`}
                className="piano-octave-group"
                style={{ 
                  display: 'flex', 
                  position: 'relative', 
                  marginRight: octIdx < octaves.length - 1 ? '12px' : '0',
                  paddingRight: octIdx < octaves.length - 1 ? '12px' : '0',
                  borderRight: octIdx < octaves.length - 1 ? '2px dashed rgba(255, 255, 255, 0.1)' : 'none'
                }}
              >
                {whiteKeysInOctave.map((note) => {
                  const keyData = getKey(note, oct);
                  if (!keyData) return null;
                  const isPressed = activeKeyIds.has(keyData.id);

                  // Check if this white note has a corresponding black note
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
    </div>
  );
}
