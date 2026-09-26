import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const soundsDir = path.join(__dirname, '..', 'public', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Function to generate a 16-bit Mono PCM WAV file Buffer
function createWavBuffer(sampleRate, durationSec, sampleGenerator) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2; // 16-bit mono = 2 bytes per sample
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size
  buffer.writeUInt16LE(1, 20);  // PCM format
  buffer.writeUInt16LE(1, 22);  // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32);  // block align
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sampleVal = sampleGenerator(t, durationSec, i, numSamples);
    // Clamp to -1.0 .. 1.0
    const clamped = Math.max(-1.0, Math.min(1.0, sampleVal));
    const int16 = Math.floor(clamped < 0 ? clamped * 32768 : clamped * 32767);
    buffer.writeInt16LE(int16, 44 + i * 2);
  }

  return buffer;
}

const sampleRate = 44100;

const soundGenerators = {
  'vine-boom': (t, dur) => {
    // Vine boom: Sub-bass pitch drop + heavy distortion / resonance
    const env = Math.exp(-3.5 * t);
    const freq = 130 * Math.exp(-6 * t) + 35;
    const wave = Math.sin(2 * Math.PI * freq * t) + 0.5 * Math.sin(2 * Math.PI * freq * 0.5 * t);
    return Math.tanh(wave * 2.5) * env * 0.9;
  },
  'bruh': (t, dur) => {
    // Bruh: Formant vocal synth drop
    const env = Math.sin(Math.PI * (t / dur)) * Math.exp(-1.5 * t);
    const f0 = 110 - 25 * (t / dur);
    const v1 = Math.sin(2 * Math.PI * f0 * t);
    const v2 = 0.6 * Math.sin(2 * Math.PI * (f0 * 2.2) * t);
    const v3 = 0.4 * Math.sin(2 * Math.PI * (f0 * 3.1) * t);
    return (v1 + v2 + v3) * env * 0.4;
  },
  'windows-error': (t, dur) => {
    // Windows Error: Chord chime
    const env = Math.exp(-8 * t);
    const s1 = Math.sin(2 * Math.PI * 1046.5 * t); // C6
    const s2 = Math.sin(2 * Math.PI * 1318.5 * t); // E6
    const s3 = Math.sin(2 * Math.PI * 1567.98 * t); // G6
    return (s1 + s2 + s3) * 0.3 * env;
  },
  'airhorn': (t, dur) => {
    // Airhorn: Rapid square wave triplets
    const step = Math.floor(t * 12) % 3;
    const f = step === 0 ? 466.16 : step === 1 ? 523.25 : 587.33;
    const square = Math.sin(2 * Math.PI * f * t) > 0 ? 0.7 : -0.7;
    const env = Math.exp(-2.5 * t);
    return square * env * 0.5;
  },
  'quack': (t, dur) => {
    // Duck quack: FM synth
    const env = Math.sin(Math.PI * (t / dur));
    const mod = Math.sin(2 * Math.PI * 40 * t) * 150;
    const car = Math.sin(2 * Math.PI * (320 + mod) * t);
    return car * env * 0.6;
  },
  'roblox-oof': (t, dur) => {
    // Roblox Oof: Pitch sweep 400Hz -> 200Hz
    const env = Math.sin(Math.PI * (t / dur));
    const freq = 450 - 250 * (t / dur);
    const wave = Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(2 * Math.PI * (freq * 2) * t);
    return wave * env * 0.5;
  },
  'illuminati': (t, dur) => {
    // X-Files synth bell
    const env = Math.exp(-4 * t);
    const f = 659.25; // E5
    const vibrato = Math.sin(2 * Math.PI * 6 * t) * 8;
    return Math.sin(2 * Math.PI * (f + vibrato) * t) * env * 0.6;
  },
  'elevator-ding': (t, dur) => {
    // Clean bell chime
    const env = Math.exp(-2.5 * t);
    const s1 = Math.sin(2 * Math.PI * 1046.5 * t);
    const s2 = 0.5 * Math.sin(2 * Math.PI * 2093 * t);
    return (s1 + s2) * env * 0.5;
  },
  'fart': (t, dur) => {
    // Sawtooth noise fart
    const env = Math.exp(-3 * t);
    const f = 65 + Math.random() * 25 - 12;
    const saw = (t * f) % 1 - 0.5;
    return saw * env * 0.7;
  },
  'wow': (t, dur) => {
    // Wow pitch rise
    const env = Math.sin(Math.PI * (t / dur));
    const f = 200 + 350 * (t / dur);
    return Math.sin(2 * Math.PI * f * t) * env * 0.6;
  },
  'sad-trombone': (t, dur) => {
    // Descending brass note
    const env = Math.exp(-3 * t);
    const f = 293.66 - 40 * (t / dur); // D4 down
    const saw = ((t * f) % 1 - 0.5) * 2;
    return saw * env * 0.5;
  },
  'bonk': (t, dur) => {
    // Wooden bonk
    const env = Math.exp(-15 * t);
    const f = 350 * Math.exp(-10 * t) + 120;
    return Math.sin(2 * Math.PI * f * t) * env * 0.8;
  },
  'coin': (t, dur) => {
    // 8-bit coin
    const p1 = t < 0.08 ? 987.77 : 1318.51; // B5 -> E6
    const env = Math.exp(-6 * t);
    const sq = Math.sin(2 * Math.PI * p1 * t) > 0 ? 0.5 : -0.5;
    return sq * env * 0.5;
  },
  'laser': (t, dur) => {
    // Laser zap
    const env = Math.exp(-8 * t);
    const f = 1800 * Math.exp(-20 * t) + 150;
    return Math.sin(2 * Math.PI * f * t) * env * 0.6;
  },
  'drum-kick': (t, dur) => {
    // Punchy kick
    const env = Math.exp(-12 * t);
    const f = 150 * Math.exp(-25 * t) + 40;
    return Math.sin(2 * Math.PI * f * t) * env * 0.9;
  },
  'pew': (t, dur) => {
    // Pew pew
    const env = Math.exp(-10 * t);
    const f = 1200 * Math.exp(-15 * t) + 200;
    return (Math.sin(2 * Math.PI * f * t) > 0 ? 0.6 : -0.6) * env * 0.5;
  },
  'drum-snare': (t, dur) => {
    // Snare noise
    const env = Math.exp(-10 * t);
    const noise = Math.random() * 2 - 1;
    const tone = Math.sin(2 * Math.PI * 180 * t);
    return (noise * 0.7 + tone * 0.3) * env * 0.7;
  },
  'anime-wow': (t, dur) => {
    // High sparkle chime
    const env = Math.exp(-4 * t);
    const f = 1396.91; // F6
    const trill = Math.sin(2 * Math.PI * 15 * t) * 50;
    return Math.sin(2 * Math.PI * (f + trill) * t) * env * 0.5;
  },
  'metal-pipe': (t, dur) => {
    // Metallic impact
    const env = Math.exp(-6 * t);
    const s1 = Math.sin(2 * Math.PI * 523 * t);
    const s2 = Math.sin(2 * Math.PI * 870 * t);
    const s3 = Math.sin(2 * Math.PI * 1420 * t);
    return Math.tanh((s1 + s2 + s3) * 1.5) * env * 0.6;
  },
  'sheesh': (t, dur) => {
    // High whistle bend
    const env = Math.sin(Math.PI * (t / dur));
    const f = 800 + 600 * (t / dur);
    return Math.sin(2 * Math.PI * f * t) * env * 0.5;
  },
  'buzzer': (t, dur) => {
    // Game show buzzer
    const env = Math.exp(-4 * t);
    const f = 150;
    const sq = Math.sin(2 * Math.PI * f * t) > 0 ? 0.6 : -0.6;
    return sq * env * 0.6;
  },
  'cat-meow': (t, dur) => {
    // Meow pitch arc
    const env = Math.sin(Math.PI * (t / dur));
    const f = 400 + 250 * Math.sin(Math.PI * (t / dur));
    const wave = Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * (f * 1.5) * t);
    return wave * env * 0.5;
  },
  'bleep': (t, dur) => {
    // Censorship bleep 1000Hz
    const env = Math.exp(-3 * t);
    return Math.sin(2 * Math.PI * 1000 * t) * env * 0.5;
  },
  'tada': (t, dur) => {
    // Fanfare triad chord (C5 - E5 - G5 - C6)
    const env = Math.exp(-2.5 * t);
    const s1 = Math.sin(2 * Math.PI * 523.25 * t);
    const s2 = Math.sin(2 * Math.PI * 659.25 * t);
    const s3 = Math.sin(2 * Math.PI * 783.99 * t);
    const s4 = Math.sin(2 * Math.PI * 1046.50 * t);
    return (s1 + s2 + s3 + s4) * 0.2 * env;
  }
};

// Generate all sound files in both .mp3 and .wav extensions (or alias them)
// Note: Web browsers play WAV buffers directly via Web Audio API decodeAudioData!
console.log('Generating sample audio files into public/sounds/...');

for (const [name, generator] of Object.entries(soundGenerators)) {
  const duration = name === 'illuminati' || name === 'tada' || name === 'elevator-ding' ? 1.5 : 0.8;
  const wavBuf = createWavBuffer(sampleRate, duration, generator);
  
  // Save as .mp3 and .wav so both path requests resolve!
  const mp3Path = path.join(soundsDir, `${name}.mp3`);
  const wavPath = path.join(soundsDir, `${name}.wav`);
  
  fs.writeFileSync(mp3Path, wavBuf);
  fs.writeFileSync(wavPath, wavBuf);
  console.log(`Created ${name}.mp3 (${wavBuf.length} bytes)`);
}

console.log('Audio file generation complete!');
