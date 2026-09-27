import React, { useState, useEffect, useCallback } from 'react';
import { RotateCw, Smartphone, Check, X } from 'lucide-react';

export default function RotateScreenOverlay() {
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [lockStatusMessage, setLockStatusMessage] = useState('');

  const checkOrientation = useCallback(() => {
    // Determine if device is mobile or tablet screen size
    const isMobileWidth = window.innerWidth <= 850;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isPortrait = window.innerHeight > window.innerWidth || 
                       (window.screen?.orientation?.type?.includes('portrait') ?? false);

    // Only prompt on mobile/tablet view in portrait
    if ((isMobileWidth || isTouch) && isPortrait) {
      setIsPortraitMobile(true);
    } else {
      setIsPortraitMobile(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => checkOrientation();
    const handleOrientation = () => checkOrientation();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientation);

    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientation);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientation);
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientation);
      }
    };
  }, [checkOrientation]);

  const handleRotateScreen = async () => {
    setLockStatusMessage('');
    try {
      // 1. Attempt Fullscreen first (required by many browsers for orientation lock)
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen().catch(err => {
          console.warn('Fullscreen request bypassed:', err);
        });
      }

      // 2. Attempt Screen Orientation Lock API
      if (window.screen?.orientation?.lock) {
        await window.screen.orientation.lock('landscape')
          .then(() => {
            setLockStatusMessage('Screen locked to Landscape! 🎹');
          })
          .catch(err => {
            console.warn('Orientation lock notice:', err);
            setLockStatusMessage('Please turn your phone sideways to auto-switch!');
          });
      } else {
        setLockStatusMessage('Please turn your phone 90° sideways to Landscape mode!');
      }
    } catch {
      setLockStatusMessage('Please rotate your device to Landscape mode.');
    }
  };

  if (!isPortraitMobile || dismissed) {
    return null;
  }

  return (
    <div className="rotate-screen-overlay" id="rotate-screen-modal">
      <div className="rotate-screen-card glass-panel">
        <button 
          className="rotate-close-btn"
          onClick={() => setDismissed(true)}
          title="Continue in Portrait"
          aria-label="Close landscape recommendation"
        >
          <X size={20} />
        </button>

        {/* Animated Phone Graphic */}
        <div className="phone-rotate-animation">
          <div className="phone-icon-wrapper">
            <Smartphone size={56} className="phone-icon" />
            <RotateCw size={28} className="rotate-arrow-icon" />
          </div>
        </div>

        <div className="rotate-badge">
          <Smartphone size={12} /> MOBILE PORTRAIT DETECTED
        </div>

        <h2>Rotate Your Screen</h2>
        <p>
          For the <strong>best Meme Piano experience</strong> with full key access and touch controls, 
          please turn your device 90° sideways to <strong>Landscape mode</strong>.
        </p>

        {lockStatusMessage && (
          <div className="rotate-status-msg">
            {lockStatusMessage}
          </div>
        )}

        <div className="rotate-actions">
          <button 
            className="btn btn-primary btn-rotate-cta"
            onClick={handleRotateScreen}
          >
            <RotateCw size={18} /> Rotate to Landscape
          </button>
          
          <button 
            className="btn btn-secondary-glass"
            onClick={() => setDismissed(true)}
          >
            <Check size={16} /> Continue in Portrait
          </button>
        </div>
      </div>
    </div>
  );
}
