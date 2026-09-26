import { useState, useRef, useCallback } from 'react';

export default function useRecorder(triggerKey) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState([]);
  const recordStartTimeRef = useRef(null);

  const startRecording = useCallback(() => {
    setRecordedNotes([]);
    recordStartTimeRef.current = Date.now();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    return recordedNotes;
  }, [recordedNotes]);

  const recordNote = useCallback((keyConfig) => {
    if (!recordStartTimeRef.current) {
      recordStartTimeRef.current = Date.now();
    }
    const elapsed = Date.now() - recordStartTimeRef.current;
    setRecordedNotes(prev => [...prev, { keyConfig, time: elapsed }]);
  }, []);

  const playRecording = useCallback(async () => {
    if (recordedNotes.length === 0) return;

    return new Promise((resolve) => {
      recordedNotes.forEach((item, index) => {
        setTimeout(() => {
          triggerKey(item.keyConfig);
          if (index === recordedNotes.length - 1) {
            setTimeout(resolve, 500);
          }
        }, item.time);
      });
    });
  }, [recordedNotes, triggerKey]);

  const clearRecording = useCallback(() => {
    setRecordedNotes([]);
    recordStartTimeRef.current = null;
  }, []);

  // Export recording as shareable JSON
  const exportRecording = useCallback(() => {
    const data = {
      version: 1,
      name: `Recording ${new Date().toLocaleString()}`,
      notes: recordedNotes.map(n => ({
        id: n.keyConfig.id,
        time: n.time
      }))
    };
    return btoa(JSON.stringify(data));
  }, [recordedNotes]);

  // Import recording from shareable JSON
  const importRecording = useCallback((encoded, keysConfig) => {
    try {
      const data = JSON.parse(atob(encoded));
      if (!data.notes || !Array.isArray(data.notes)) throw new Error('Invalid format');
      
      const keyMap = new Map(keysConfig.map(k => [k.id, k]));
      const notes = data.notes
        .filter(n => keyMap.has(n.id))
        .map(n => ({ keyConfig: keyMap.get(n.id), time: n.time }));
      
      setRecordedNotes(notes);
      return { success: true, name: data.name, count: notes.length };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, []);

  return {
    isRecording,
    recordedNotes,
    startRecording,
    stopRecording,
    recordNote,
    playRecording,
    clearRecording,
    exportRecording,
    importRecording,
    setIsRecording
  };
}
