import { useEffect, useRef } from 'react';

export default function useKeyboardShortcuts(keysConfig, triggerKey, onKeyRelease) {
  const shortcutMapRef = useRef(new Map());

  useEffect(() => {
    const map = new Map();
    keysConfig.forEach(key => {
      if (key.shortcut) {
        map.set(key.shortcut.toLowerCase(), key);
      }
    });
    shortcutMapRef.current = map;
  }, [keysConfig]);

  useEffect(() => {
    const pressedKeysMap = new Set();

    const handleKeyDown = (e) => {
      const targetTag = e.target.tagName.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select' || e.target.isContentEditable) {
        return;
      }

      const keyChar = e.key.toLowerCase();
      const matchedKey = shortcutMapRef.current.get(keyChar);

      if (matchedKey) {
        e.preventDefault();
        if (!pressedKeysMap.has(keyChar)) {
          pressedKeysMap.add(keyChar);
          triggerKey(matchedKey);
        }
      }
    };

    const handleKeyUp = (e) => {
      const keyChar = e.key.toLowerCase();
      pressedKeysMap.delete(keyChar);
      const matchedKey = shortcutMapRef.current.get(keyChar);
      if (matchedKey && onKeyRelease) {
        onKeyRelease(matchedKey);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerKey, onKeyRelease]);

  return shortcutMapRef;
}
