let audioCtx: AudioContext | null = null;
let masterVolume = 0.25;

let isMusicPlaying = false;
let omenLoopInterval: ReturnType<typeof setInterval> | null = null;
let omenStep = 0;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const soundFx = {
  setVolume: (vol: number) => {
    masterVolume = Math.max(0, Math.min(1, vol));
  },

  playClick: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.2 * masterVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      console.error('Audio click error:', e);
    }
  },

  playTrapSnap: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.4 * masterVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.error('Audio trap error:', e);
    }
  },

  playHeartbeat: (urgency: number = 0.5) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(65 + urgency * 20, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime((0.3 + urgency * 0.3) * masterVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.error('Audio heartbeat error:', e);
    }
  },

  playWin: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2 * masterVolume, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch (e) {
      console.error('Audio win error:', e);
    }
  },

  playGameOver: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [150, 130, 110, 80].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(0.3 * masterVolume, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.3);
      });
    } catch (e) {
      console.error('Audio gameover error:', e);
    }
  },

  toggleAmbientMusic: async (enable: boolean) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (enable && !isMusicPlaying) {
        isMusicPlaying = true;
        omenStep = 0;

        // Omen-style Gregorian/Gothic rhythm sequence in C minor
        // Frequencies: C2 (65.41 Hz), Eb2 (77.78 Hz), F2 (87.31 Hz), G2 (98.00 Hz), Ab2 (103.83 Hz)
        const sequence = [
          { bass: 65.41, organ: 130.81 }, // C2 / C3
          { bass: 65.41, organ: 130.81 },
          { bass: 77.78, organ: 155.56 }, // Eb2 / Eb3
          { bass: 65.41, organ: 130.81 },
          { bass: 87.31, organ: 174.61 }, // F2 / F3
          { bass: 77.78, organ: 155.56 },
          { bass: 103.83, organ: 207.65 }, // Ab2 / Ab3 (dissonant peak)
          { bass: 98.00, organ: 196.00 }   // G2 / G3
        ];

        omenLoopInterval = setInterval(() => {
          if (!isMusicPlaying || !audioCtx) return;

          const now = audioCtx.currentTime;
          const note = sequence[omenStep % sequence.length];
          omenStep++;

          // 1. Low Guttural Bass March (Sawtooth with Low-Pass filter)
          const bassOsc = audioCtx.createOscillator();
          const bassFilter = audioCtx.createBiquadFilter();
          const bassGain = audioCtx.createGain();

          bassOsc.type = 'sawtooth';
          bassOsc.frequency.setValueAtTime(note.bass, now);

          bassFilter.type = 'lowpass';
          bassFilter.frequency.setValueAtTime(220, now);

          bassGain.gain.setValueAtTime(0.25 * masterVolume, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

          bassOsc.connect(bassFilter);
          bassFilter.connect(bassGain);
          bassGain.connect(audioCtx.destination);

          bassOsc.start(now);
          bassOsc.stop(now + 0.45);

          // 2. Staccato Gothic Organ / Choir Accent (Square wave)
          const organOsc = audioCtx.createOscillator();
          const organGain = audioCtx.createGain();

          organOsc.type = 'square';
          organOsc.frequency.setValueAtTime(note.organ, now);

          organGain.gain.setValueAtTime(0.12 * masterVolume, now);
          organGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          organOsc.connect(organGain);
          organGain.connect(audioCtx.destination);

          organOsc.start(now);
          organOsc.stop(now + 0.35);

        }, 500); // 120 BPM martial pulse

      } else if (!enable && isMusicPlaying) {
        isMusicPlaying = false;
        if (omenLoopInterval) {
          clearInterval(omenLoopInterval);
          omenLoopInterval = null;
        }
      }
    } catch (e) {
      console.error('Ambient music error:', e);
    }
  }
};