// AudioManager with effects chain and MIDI support
class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.buffers = new Map();
    this.loadingPromises = new Map();
    this.volume = 0.8;
    this.isMuted = false;
    this.playbackSpeed = 1.0;

    // Effects nodes
    this.reverbNode = null;
    this.delayNode = null;
    this.delayFeedback = null;
    this.filterNode = null;
    this.reverbGain = null;
    this.dryGain = null;
    this.effectsEnabled = { reverb: false, delay: false, filter: false };
    this.effectsParams = {
      reverbMix: 0.3,
      delayTime: 0.3,
      delayFeedback: 0.4,
      filterFreq: 2000,
      filterType: 'lowpass'
    };

    // MIDI
    this.midiAccess = null;
    this.midiCallback = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Build effects chain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.82;

      // Filter
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = this.effectsParams.filterType;
      this.filterNode.frequency.setValueAtTime(this.effectsParams.filterFreq, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(1, this.ctx.currentTime);

      // Delay
      this.delayNode = this.ctx.createDelay(2);
      this.delayNode.delayTime.setValueAtTime(this.effectsParams.delayTime, this.ctx.currentTime);
      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.setValueAtTime(this.effectsParams.delayFeedback, this.ctx.currentTime);
      this.delayGain = this.ctx.createGain();
      this.delayGain.gain.setValueAtTime(0, this.ctx.currentTime);

      // Reverb (convolver with generated impulse)
      this.reverbNode = this.ctx.createConvolver();
      this.reverbGain = this.ctx.createGain();
      this.reverbGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.dryGain = this.ctx.createGain();
      this.dryGain.gain.setValueAtTime(1, this.ctx.currentTime);

      this._generateImpulseResponse();

      // Chain: masterGain -> filterNode -> dryGain -> analyser -> destination
      //                                -> reverbNode -> reverbGain -> analyser
      //                                -> delayNode -> delayFeedback -> delayNode (loop)
      //                                             -> delayGain -> analyser
      this.masterGain.connect(this.filterNode);

      // Dry path
      this.filterNode.connect(this.dryGain);
      this.dryGain.connect(this.analyser);

      // Reverb path
      this.filterNode.connect(this.reverbNode);
      this.reverbNode.connect(this.reverbGain);
      this.reverbGain.connect(this.analyser);

      // Delay path
      this.filterNode.connect(this.delayNode);
      this.delayNode.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode); // feedback loop
      this.delayNode.connect(this.delayGain);
      this.delayGain.connect(this.analyser);

      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  _generateImpulseResponse() {
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 2.5; // 2.5 second reverb
    const impulse = this.ctx.createBuffer(2, length, sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const channelData = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    this.reverbNode.buffer = impulse;
  }

  // --- Effects Controls ---
  setEffect(effect, enabled) {
    this.init();
    this.effectsEnabled[effect] = enabled;
    const now = this.ctx.currentTime;

    switch (effect) {
      case 'reverb':
        this.reverbGain.gain.setTargetAtTime(enabled ? this.effectsParams.reverbMix : 0, now, 0.05);
        this.dryGain.gain.setTargetAtTime(enabled ? 1 - this.effectsParams.reverbMix * 0.5 : 1, now, 0.05);
        break;
      case 'delay':
        this.delayGain.gain.setTargetAtTime(enabled ? 0.6 : 0, now, 0.05);
        this.delayFeedback.gain.setTargetAtTime(enabled ? this.effectsParams.delayFeedback : 0, now, 0.05);
        break;
      case 'filter':
        if (!enabled) {
          this.filterNode.frequency.setTargetAtTime(20000, now, 0.05);
        } else {
          this.filterNode.frequency.setTargetAtTime(this.effectsParams.filterFreq, now, 0.05);
        }
        break;
    }
  }

  setEffectParam(param, value) {
    this.init();
    this.effectsParams[param] = value;
    const now = this.ctx.currentTime;

    switch (param) {
      case 'reverbMix':
        if (this.effectsEnabled.reverb) {
          this.reverbGain.gain.setTargetAtTime(value, now, 0.05);
          this.dryGain.gain.setTargetAtTime(1 - value * 0.5, now, 0.05);
        }
        break;
      case 'delayTime':
        this.delayNode.delayTime.setTargetAtTime(value, now, 0.05);
        break;
      case 'delayFeedback':
        if (this.effectsEnabled.delay) {
          this.delayFeedback.gain.setTargetAtTime(value, now, 0.05);
        }
        break;
      case 'filterFreq':
        if (this.effectsEnabled.filter) {
          this.filterNode.frequency.setTargetAtTime(value, now, 0.05);
        }
        break;
      case 'filterType':
        this.filterNode.type = value;
        break;
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.02);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.02);
    }
  }

  setPlaybackSpeed(speed) {
    this.playbackSpeed = speed;
  }

  async preload(audioPath) {
    if (!audioPath) return null;
    if (this.buffers.has(audioPath)) {
      const b = this.buffers.get(audioPath);
      return b === 'FAILED' ? null : b;
    }
    if (this.loadingPromises.has(audioPath)) {
      return this.loadingPromises.get(audioPath);
    }

    const promise = (async () => {
      try {
        const response = await fetch(audioPath);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        this.init();
        const decoded = await this.ctx.decodeAudioData(arrayBuffer);
        this.buffers.set(audioPath, decoded);
        return decoded;
      } catch (err) {
        console.warn(`[AudioManager] Could not load audio from ${audioPath}:`, err.message);
        this.buffers.set(audioPath, 'FAILED');
        return null;
      } finally {
        this.loadingPromises.delete(audioPath);
      }
    })();

    this.loadingPromises.set(audioPath, promise);
    return promise;
  }

  async preloadAll(keysConfig) {
    const paths = keysConfig.map(k => k.audio).filter(Boolean);
    await Promise.all(paths.map(p => this.preload(p)));
  }

  // Play sound from buffer or synthesizer fallback
  playSound(keyConfig) {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const audioPath = keyConfig.audio;
    const buffer = this.buffers.get(audioPath);

    if (buffer && buffer !== 'FAILED') {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = this.playbackSpeed;

        const keyGain = this.ctx.createGain();
        keyGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

        source.connect(keyGain);
        keyGain.connect(this.masterGain);

        source.start(0);
        return true;
      } catch (err) {
        console.error('[AudioManager] Error playing buffer:', err);
      }
    }

    // Fallback: Synthesize rich piano sound live using Web Audio oscillators
    this.playSynthesizedKey(keyConfig.freq || 440);

    // If buffer was missing, attempt background load
    if (audioPath && !this.buffers.has(audioPath) && !this.loadingPromises.has(audioPath)) {
      this.preload(audioPath);
    }

    return false;
  }

  playSynthesizedKey(freq) {
    if (!this.ctx) this.init();
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, now);

    const duration = 1.5;

    gainNode.gain.setValueAtTime(0.6, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    osc3.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    osc3.stop(now + duration);
  }

  // --- MIDI Support ---
  async initMIDI(callback) {
    this.midiCallback = callback;
    if (!navigator.requestMIDIAccess) {
      console.warn('[AudioManager] Web MIDI API not supported');
      return false;
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      this.midiAccess.inputs.forEach((input) => {
        input.onmidimessage = this._handleMIDIMessage.bind(this);
      });

      // Listen for new MIDI devices
      this.midiAccess.onstatechange = () => {
        this.midiAccess.inputs.forEach((input) => {
          input.onmidimessage = this._handleMIDIMessage.bind(this);
        });
      };

      return true;
    } catch (err) {
      console.warn('[AudioManager] MIDI access denied:', err);
      return false;
    }
  }

  _handleMIDIMessage(event) {
    const [status, note, velocity] = event.data;
    const command = status & 0xf0;

    if (command === 0x90 && velocity > 0) {
      // Note On
      if (this.midiCallback) {
        this.midiCallback('noteOn', note, velocity / 127);
      }
    } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
      // Note Off
      if (this.midiCallback) {
        this.midiCallback('noteOff', note, 0);
      }
    }
  }
}

export const audioManager = new AudioManager();
