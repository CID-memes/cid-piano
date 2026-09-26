import { useState, useCallback } from 'react';

export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {
      console.warn(`[useLocalStorage] Failed to load "${key}":`, e);
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });

  const setStoredValue = useCallback((newValue) => {
    setValue(prev => {
      const resolved = typeof newValue === 'function' ? newValue(prev) : newValue;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch (e) {
        console.warn(`[useLocalStorage] Failed to save "${key}":`, e);
      }
      return resolved;
    });
  }, [key]);

  const removeValue = useCallback(() => {
    localStorage.removeItem(key);
    setValue(typeof defaultValue === 'function' ? defaultValue() : defaultValue);
  }, [key, defaultValue]);

  return [value, setStoredValue, removeValue];
}
