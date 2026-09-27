import React, { memo, useState, useCallback } from 'react';
import { CATEGORY_COLORS } from '../../config/pianoConfig';

const PianoKey = memo(({ keyConfig, isPressed, onTrigger }) => {
  const isWhite = keyConfig.type === 'white';
  const [ripples, setRipples] = useState([]);
  const catColor = CATEGORY_COLORS[keyConfig.category] || CATEGORY_COLORS.Meme;

  const createRipple = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX || rect.width / 2) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY || rect.height / 2) - rect.top;
    const ripple = { id: Date.now() + Math.random(), x, y };
    setRipples(prev => [...prev.slice(-2), ripple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);
  }, []);

  const handlePointerDown = (e) => {
    e.preventDefault();
    createRipple(e);
    onTrigger(keyConfig);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    createRipple(e);
    onTrigger(keyConfig);
  };

  const activeGlowStyle = isPressed ? {
    boxShadow: `0 0 20px ${catColor.glow}, 0 0 40px ${catColor.glow}, inset 0 0 10px ${catColor.glow}`,
    borderColor: catColor.primary
  } : {};

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Play ${keyConfig.soundName || keyConfig.id} note ${keyConfig.id} keyboard shortcut ${keyConfig.shortcut}`}
      className={`piano-key ${isWhite ? 'piano-key-white' : 'piano-key-black'} ${isPressed ? 'active' : ''}`}
      onMouseDown={handlePointerDown}
      onTouchStart={handleTouchStart}
      style={activeGlowStyle}
      data-category={keyConfig.category}
    >
      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="key-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            background: isWhite
              ? `radial-gradient(circle, ${catColor.primary}40, transparent 70%)`
              : `radial-gradient(circle, ${catColor.primary}60, transparent 70%)`
          }}
        />
      ))}

      <div className="key-press-label">
        {(keyConfig.shortcut || keyConfig.note).toUpperCase()}
      </div>
    </div>
  );
});

PianoKey.displayName = 'PianoKey';

export default PianoKey;
