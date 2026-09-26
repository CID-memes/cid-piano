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
  // Octave 4 - Lower Octave
  {
    id: "C4",
    note: "C",
    octave: 4,
    type: "white",
    shortcut: "a",
    soundName: "Vine Boom",
    audio: "/sounds/vine-boom.mp3",
    emoji: "💥",
    freq: 261.63,
    category: "Meme"
  },
  {
    id: "C#4",
    note: "C#",
    octave: 4,
    type: "black",
    shortcut: "w",
    soundName: "Elevator Ding",
    audio: "/sounds/elevator-ding.mp3",
    emoji: "🔔",
    freq: 277.18,
    category: "SFX"
  },
  {
    id: "D4",
    note: "D",
    octave: 4,
    type: "white",
    shortcut: "s",
    soundName: "Bruh Sound",
    audio: "/sounds/bruh.mp3",
    emoji: "🗿",
    freq: 293.66,
    category: "Meme"
  },
  {
    id: "D#4",
    note: "D#",
    octave: 4,
    type: "black",
    shortcut: "e",
    soundName: "Fart Bass",
    audio: "/sounds/fart.mp3",
    emoji: "💨",
    freq: 311.13,
    category: "Funny"
  },
  {
    id: "E4",
    note: "E",
    octave: 4,
    type: "white",
    shortcut: "d",
    soundName: "Windows Error",
    audio: "/sounds/windows-error.mp3",
    emoji: "💻",
    freq: 329.63,
    category: "Retro"
  },
  {
    id: "F4",
    note: "F",
    octave: 4,
    type: "white",
    shortcut: "f",
    soundName: "Airhorn",
    audio: "/sounds/airhorn.mp3",
    emoji: "📢",
    freq: 349.23,
    category: "Hype"
  },
  {
    id: "F#4",
    note: "F#",
    octave: 4,
    type: "black",
    shortcut: "t",
    soundName: "Wow!",
    audio: "/sounds/wow.mp3",
    emoji: "😮",
    freq: 369.99,
    category: "Meme"
  },
  {
    id: "G4",
    note: "G",
    octave: 4,
    type: "white",
    shortcut: "g",
    soundName: "Quack",
    audio: "/sounds/quack.mp3",
    emoji: "🦆",
    freq: 392.00,
    category: "Funny"
  },
  {
    id: "G#4",
    note: "G#",
    octave: 4,
    type: "black",
    shortcut: "y",
    soundName: "Sad Trombone",
    audio: "/sounds/sad-trombone.mp3",
    emoji: "🎺",
    freq: 415.30,
    category: "Fail"
  },
  {
    id: "A4",
    note: "A",
    octave: 4,
    type: "white",
    shortcut: "h",
    soundName: "Roblox Oof",
    audio: "/sounds/roblox-oof.mp3",
    emoji: "💀",
    freq: 440.00,
    category: "Gaming"
  },
  {
    id: "A#4",
    note: "A#",
    octave: 4,
    type: "black",
    shortcut: "u",
    soundName: "Bonk",
    audio: "/sounds/bonk.mp3",
    emoji: "🔨",
    freq: 466.16,
    category: "SFX"
  },
  {
    id: "B4",
    note: "B",
    octave: 4,
    type: "white",
    shortcut: "j",
    soundName: "Illuminati",
    audio: "/sounds/illuminati.mp3",
    emoji: "👁️",
    freq: 493.88,
    category: "Mystery"
  },

  // Octave 5 - Upper Octave
  {
    id: "C5",
    note: "C",
    octave: 5,
    type: "white",
    shortcut: "k",
    soundName: "Coin Sound",
    audio: "/sounds/coin.mp3",
    emoji: "🪙",
    freq: 523.25,
    category: "Gaming"
  },
  {
    id: "C#5",
    note: "C#",
    octave: 5,
    type: "black",
    shortcut: "i",
    soundName: "Laser Zap",
    audio: "/sounds/laser.mp3",
    emoji: "🔫",
    freq: 554.37,
    category: "Sci-Fi"
  },
  {
    id: "D5",
    note: "D",
    octave: 5,
    type: "white",
    shortcut: "l",
    soundName: "Kick Drum",
    audio: "/sounds/drum-kick.mp3",
    emoji: "🥁",
    freq: 587.33,
    category: "Music"
  },
  {
    id: "D#5",
    note: "D#",
    octave: 5,
    type: "black",
    shortcut: "o",
    soundName: "Pew Pew",
    audio: "/sounds/pew.mp3",
    emoji: "⚡",
    freq: 622.25,
    category: "Sci-Fi"
  },
  {
    id: "E5",
    note: "E",
    octave: 5,
    type: "white",
    shortcut: ";",
    soundName: "Snare Drum",
    audio: "/sounds/drum-snare.mp3",
    emoji: "🥁",
    freq: 659.25,
    category: "Music"
  },
  {
    id: "F5",
    note: "F",
    octave: 5,
    type: "white",
    shortcut: "'",
    soundName: "Anime Wow",
    audio: "/sounds/anime-wow.mp3",
    emoji: "✨",
    freq: 698.46,
    category: "Anime"
  },
  {
    id: "F#5",
    note: "F#",
    octave: 5,
    type: "black",
    shortcut: "p",
    soundName: "Metal Pipe",
    audio: "/sounds/metal-pipe.mp3",
    emoji: "🔔",
    freq: 739.99,
    category: "Meme"
  },
  {
    id: "G5",
    note: "G",
    octave: 5,
    type: "white",
    shortcut: "z",
    soundName: "Sheesh",
    audio: "/sounds/sheesh.mp3",
    emoji: "🐍",
    freq: 783.99,
    category: "Hype"
  },
  {
    id: "G#5",
    note: "G#",
    octave: 5,
    type: "black",
    shortcut: "[",
    soundName: "Buzzer",
    audio: "/sounds/buzzer.mp3",
    emoji: "🚨",
    freq: 830.61,
    category: "SFX"
  },
  {
    id: "A5",
    note: "A",
    octave: 5,
    type: "white",
    shortcut: "x",
    soundName: "Cat Meow",
    audio: "/sounds/cat-meow.mp3",
    emoji: "🐱",
    freq: 880.00,
    category: "Animal"
  },
  {
    id: "A#5",
    note: "A#",
    octave: 5,
    type: "black",
    shortcut: "]",
    soundName: "Bleep",
    audio: "/sounds/bleep.mp3",
    emoji: "🤖",
    freq: 932.33,
    category: "SFX"
  },
  {
    id: "B5",
    note: "B",
    octave: 5,
    type: "white",
    shortcut: "c",
    soundName: "Tada Fanfare",
    audio: "/sounds/tada.mp3",
    emoji: "🎉",
    freq: 987.77,
    category: "Hype"
  }
];

export const CATEGORIES = ["All", "Meme", "SFX", "Funny", "Hype", "Gaming", "Music", "Sci-Fi", "Retro", "Fail", "Mystery", "Animal", "Anime"];

// Sound Packs / Presets
export const SOUND_PACKS = {
  'classic-memes': {
    name: '🗿 Classic Memes',
    description: 'The OG meme soundboard experience',
    preset: 'default'
  },
  'musical': {
    name: '🎵 Musical Instruments',
    description: 'Piano, drums, bass and more',
    keys: DEFAULT_PIANO_KEYS.map(k => ({
      ...k,
      category: 'Music',
      soundName: `${k.note}${k.octave} Piano`,
      emoji: k.type === 'black' ? '🎹' : '🎵',
      audio: '' // Will use synthesizer
    }))
  },
  'gaming': {
    name: '🎮 Gaming SFX',
    description: 'Retro arcade and gaming sounds',
    keys: DEFAULT_PIANO_KEYS.map((k, i) => {
      const gamingSounds = [
        { name: 'Jump', emoji: '🦘' }, { name: 'Coin', emoji: '🪙' },
        { name: 'Power Up', emoji: '⭐' }, { name: 'Level Up', emoji: '📈' },
        { name: 'Hit', emoji: '💥' }, { name: 'Miss', emoji: '❌' },
        { name: 'Laser', emoji: '🔫' }, { name: 'Explosion', emoji: '💣' },
        { name: 'Shield', emoji: '🛡️' }, { name: 'Heal', emoji: '💚' },
        { name: 'Victory', emoji: '🏆' }, { name: 'Game Over', emoji: '☠️' },
        { name: 'Select', emoji: '👆' }, { name: 'Cancel', emoji: '🚫' },
        { name: 'Combo', emoji: '🔥' }, { name: 'Ultra', emoji: '⚡' },
        { name: 'Spawn', emoji: '🌀' }, { name: 'Dash', emoji: '💨' },
        { name: 'Slam', emoji: '🔨' }, { name: 'Critical', emoji: '‼️' },
        { name: 'Quest', emoji: '📜' }, { name: 'Chest', emoji: '🎁' },
        { name: 'Portal', emoji: '🌀' }, { name: 'Boss', emoji: '👾' }
      ];
      const gs = gamingSounds[i % gamingSounds.length];
      return { ...k, soundName: gs.name, emoji: gs.emoji, category: 'Gaming', audio: '' };
    })
  },
  'animals': {
    name: '🐾 Animal Kingdom',
    description: 'Cute and wild animal sounds',
    keys: DEFAULT_PIANO_KEYS.map((k, i) => {
      const animalSounds = [
        { name: 'Dog Bark', emoji: '🐕' }, { name: 'Cat Purr', emoji: '🐱' },
        { name: 'Duck Quack', emoji: '🦆' }, { name: 'Cow Moo', emoji: '🐄' },
        { name: 'Horse Neigh', emoji: '🐴' }, { name: 'Pig Oink', emoji: '🐷' },
        { name: 'Rooster', emoji: '🐓' }, { name: 'Frog Ribbit', emoji: '🐸' },
        { name: 'Lion Roar', emoji: '🦁' }, { name: 'Wolf Howl', emoji: '🐺' },
        { name: 'Eagle Cry', emoji: '🦅' }, { name: 'Dolphin Click', emoji: '🐬' },
        { name: 'Monkey', emoji: '🐒' }, { name: 'Elephant', emoji: '🐘' },
        { name: 'Snake Hiss', emoji: '🐍' }, { name: 'Owl Hoot', emoji: '🦉' },
        { name: 'Parrot', emoji: '🦜' }, { name: 'Cricket', emoji: '🦗' },
        { name: 'Whale', emoji: '🐋' }, { name: 'Bee Buzz', emoji: '🐝' },
        { name: 'Penguin', emoji: '🐧' }, { name: 'Seal', emoji: '🦭' },
        { name: 'Goat Bleat', emoji: '🐐' }, { name: 'Kitten Meow', emoji: '🐈' }
      ];
      const as = animalSounds[i % animalSounds.length];
      return { ...k, soundName: as.name, emoji: as.emoji, category: 'Animal', audio: '' };
    })
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
