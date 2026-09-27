// Category color mapping for per-key/per-category color coding
export const CATEGORY_COLORS = {
  Meme:    { primary: '#6366f1', glow: 'rgba(99, 102, 241, 0.5)',  gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
  SFX:     { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.5)',   gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
  Funny:   { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)',  gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  Hype:    { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)',   gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
  Gaming:  { primary: '#10b981', glow: 'rgba(16, 185, 129, 0.5)',  gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  Music:   { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.5)',  gradient: 'linear-gradient(135deg, #a855f7, #c084fc)' },
  'Sci-Fi': { primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.5)', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
  Retro:   { primary: '#14b8a6', glow: 'rgba(20, 184, 166, 0.5)',  gradient: 'linear-gradient(135deg, #14b8a6, #2dd4bf)' },
  Fail:    { primary: '#f43f5e', glow: 'rgba(244, 63, 94, 0.5)',   gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)' },
  Mystery: { primary: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.5)',  gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
  Animal:  { primary: '#22c55e', glow: 'rgba(34, 197, 94, 0.5)',   gradient: 'linear-gradient(135deg, #22c55e, #4ade80)' },
  Anime:   { primary: '#ec4899', glow: 'rgba(236, 72, 153, 0.5)',  gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
};

export const DEFAULT_PIANO_KEYS = [
  // 15 Keys: C4 through G5 (9 white + 6 black = 15 keys, spanning ~1.5 octaves)
  {
    id: "C4", note: "C", octave: 4, type: "white", shortcut: "a",
    soundName: "Sound 1", audio: "/sounds/AUD-20260926-WA0022.mp3",
    emoji: "🎵", freq: 261.63, category: "Meme"
  },
  {
    id: "C#4", note: "C#", octave: 4, type: "black", shortcut: "w",
    soundName: "Sound 2", audio: "/sounds/AUD-20260926-WA0023.mp3",
    emoji: "🎶", freq: 277.18, category: "SFX"
  },
  {
    id: "D4", note: "D", octave: 4, type: "white", shortcut: "s",
    soundName: "Sound 3", audio: "/sounds/AUD-20260926-WA0024.mp3",
    emoji: "🔊", freq: 293.66, category: "Meme"
  },
  {
    id: "D#4", note: "D#", octave: 4, type: "black", shortcut: "e",
    soundName: "Sound 4", audio: "/sounds/AUD-20260926-WA0025.mp3",
    emoji: "💥", freq: 311.13, category: "Funny"
  },
  {
    id: "E4", note: "E", octave: 4, type: "white", shortcut: "d",
    soundName: "Sound 5", audio: "/sounds/AUD-20260927-WA0102.mp3",
    emoji: "⚡", freq: 329.63, category: "Hype"
  },
  {
    id: "F4", note: "F", octave: 4, type: "white", shortcut: "f",
    soundName: "Sound 6", audio: "/sounds/AUD-20260927-WA0104.mp3",
    emoji: "🔥", freq: 349.23, category: "Hype"
  },
  {
    id: "F#4", note: "F#", octave: 4, type: "black", shortcut: "t",
    soundName: "Sound 7", audio: "/sounds/AUD-20260927-WA0105.mp3",
    emoji: "🎤", freq: 369.99, category: "Music"
  },
  {
    id: "G4", note: "G", octave: 4, type: "white", shortcut: "g",
    soundName: "Sound 8", audio: "/sounds/AUD-20260927-WA0106.mp3",
    emoji: "🗿", freq: 392.00, category: "Meme"
  },
  {
    id: "G#4", note: "G#", octave: 4, type: "black", shortcut: "y",
    soundName: "Sound 9", audio: "/sounds/AUD-20260927-WA0108.mp3",
    emoji: "😂", freq: 415.30, category: "Funny"
  },
  {
    id: "A4", note: "A", octave: 4, type: "white", shortcut: "h",
    soundName: "Sound 10", audio: "/sounds/AUD-20260927-WA0111.mp3",
    emoji: "💀", freq: 440.00, category: "Meme"
  },
  {
    id: "A#4", note: "A#", octave: 4, type: "black", shortcut: "u",
    soundName: "Sound 11", audio: "/sounds/AUD-20260927-WA0112.mp3",
    emoji: "🎹", freq: 466.16, category: "Music"
  },
  {
    id: "B4", note: "B", octave: 4, type: "white", shortcut: "j",
    soundName: "Sound 12", audio: "/sounds/AUD-20260927-WA0114.mp3",
    emoji: "🎺", freq: 493.88, category: "SFX"
  },
  {
    id: "C5", note: "C", octave: 5, type: "white", shortcut: "k",
    soundName: "Sound 13", audio: "/sounds/AUD-20260927-WA0115.mp3",
    emoji: "🪙", freq: 523.25, category: "Gaming"
  },
  {
    id: "C#5", note: "C#", octave: 5, type: "black", shortcut: "i",
    soundName: "Sound 14", audio: "/sounds/AUD-20260927-WA0116.mp3",
    emoji: "🔔", freq: 554.37, category: "SFX"
  },
  {
    id: "D5", note: "D", octave: 5, type: "white", shortcut: "l",
    soundName: "Sound 15", audio: "/sounds/AUD-20260927-WA0117.mp3",
    emoji: "🎉", freq: 587.33, category: "Hype"
  },
  {
    id: "D#5", note: "D#", octave: 5, type: "black", shortcut: "o",
    soundName: "Sound 16", audio: "/sounds/AUD-20260927-WA0118.mp3",
    emoji: "✨", freq: 622.25, category: "SFX"
  },
  {
    id: "E5", note: "E", octave: 5, type: "white", shortcut: "z",
    soundName: "Sound 17", audio: "/sounds/AUD-20260927-WA0119.mp3",
    emoji: "🔮", freq: 659.25, category: "Funny"
  },
  {
    id: "F5", note: "F", octave: 5, type: "white", shortcut: "x",
    soundName: "Sound 18", audio: "/sounds/AUD-20260927-WA0120.mp3",
    emoji: "⭐", freq: 698.46, category: "Meme"
  },
  {
    id: "F#5", note: "F#", octave: 5, type: "black", shortcut: "p",
    soundName: "Sound 19", audio: "/sounds/AUD-20260927-WA0121.mp3",
    emoji: "🚀", freq: 739.99, category: "Hype"
  },
  {
    id: "G5", note: "G", octave: 5, type: "white", shortcut: "c",
    soundName: "Sound 20", audio: "/sounds/AUD-20260927-WA0122.mp3",
    emoji: "💎", freq: 783.99, category: "Gaming"
  }
];

export const CATEGORIES = ["All", "Meme", "SFX", "Funny", "Hype", "Gaming", "Music"];

// Sound Packs / Presets
export const SOUND_PACKS = {
  'default': {
    name: '🗿 Default Sounds',
    description: 'Your custom sound collection',
    preset: 'default'
  }
};

// Chord detection helpers
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function detectChord(activeKeyIds, keysConfig) {
  if (!activeKeyIds || activeKeyIds.size < 2) return null;

  const activeKeys = keysConfig.filter(k => activeKeyIds.has(k.id));
  if (activeKeys.length < 2) return null;

  // Get note indices (ignoring octave)
  const noteIndices = [...new Set(activeKeys.map(k => NOTE_NAMES.indexOf(k.note)))].sort((a, b) => a - b);
  if (noteIndices.length < 2) return null;

  // Calculate intervals from root
  const root = noteIndices[0];
  const intervals = noteIndices.map(n => (n - root + 12) % 12).sort((a, b) => a - b);
  const intervalsStr = intervals.join(',');

  // Common chord patterns (intervals from root)
  const CHORD_MAP = {
    '0,4,7': 'Major',
    '0,3,7': 'Minor',
    '0,3,6': 'Diminished',
    '0,4,8': 'Augmented',
    '0,4,7,11': 'Major 7th',
    '0,3,7,10': 'Minor 7th',
    '0,4,7,10': 'Dominant 7th',
    '0,5,7': 'Sus4',
    '0,2,7': 'Sus2',
    '0,4': 'Major (no 5th)',
    '0,3': 'Minor (no 5th)',
    '0,7': 'Power Chord',
  };

  const chordType = CHORD_MAP[intervalsStr];
  if (chordType) {
    return `${NOTE_NAMES[root]} ${chordType}`;
  }

  return `${NOTE_NAMES[root]} + ${noteIndices.length - 1} notes`;
}

// MIDI note number to piano key mapping
export function midiNoteToKeyId(midiNote) {
  const octave = Math.floor(midiNote / 12) - 1;
  const noteIndex = midiNote % 12;
  const note = NOTE_NAMES[noteIndex];
  return `${note}${octave}`;
}
