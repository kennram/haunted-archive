// Web Audio API Sound Synthesizer for IFI@Home Archival Experience
class SoundFX {
  private ctx: AudioContext | null = null
  private ambientGain: GainNode | null = null
  private projectorOsc: OscillatorNode | null = null
  private projectorNoise: AudioBufferSourceNode | null = null
  private isAmbientPlaying: boolean = false
  private volume: number = 0.25

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public setVolume(vol: number) {
    this.volume = vol
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(vol * 0.3, this.ctx.currentTime, 0.1)
    }
  }

  // --- 35MM VINTAGE PROJECTOR AMBIENT LOOP ---
  public toggleAmbientMusic(enable: boolean) {
    this.initCtx()
    if (!this.ctx) return

    if (enable && !this.isAmbientPlaying) {
      this.isAmbientPlaying = true

      // Master Ambient Gain
      this.ambientGain = this.ctx.createGain()
      this.ambientGain.gain.setValueAtTime(this.volume * 0.3, this.ctx.currentTime)
      this.ambientGain.connect(this.ctx.destination)

      // 1. Low Motor Hum (35mm Motor)
      this.projectorOsc = this.ctx.createOscillator()
      this.projectorOsc.type = 'sawtooth'
      this.projectorOsc.frequency.setValueAtTime(48, this.ctx.currentTime)

      const humFilter = this.ctx.createBiquadFilter()
      humFilter.type = 'lowpass'
      humFilter.frequency.setValueAtTime(120, this.ctx.currentTime)

      this.projectorOsc.connect(humFilter)
      humFilter.connect(this.ambientGain)
      this.projectorOsc.start()

      // 2. Film Mechanical Clatter / Flutter Noise
      const bufferSize = this.ctx.sampleRate * 2
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)

      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.ctx.sampleRate
        const shutterPulse = Math.sin(2 * Math.PI * 24 * t) > 0.7 ? 1 : 0.05 // 24 FPS shutter pulse
        output[i] = (Math.random() * 2 - 1) * shutterPulse
      }

      this.projectorNoise = this.ctx.createBufferSource()
      this.projectorNoise.buffer = noiseBuffer
      this.projectorNoise.loop = true

      const noiseFilter = this.ctx.createBiquadFilter()
      noiseFilter.type = 'bandpass'
      noiseFilter.frequency.setValueAtTime(800, this.ctx.currentTime)
      noiseFilter.Q.setValueAtTime(2.0, this.ctx.currentTime)

      this.projectorNoise.connect(noiseFilter)
      noiseFilter.connect(this.ambientGain)
      this.projectorNoise.start()

    } else if (!enable && this.isAmbientPlaying) {
      this.isAmbientPlaying = false
      if (this.projectorOsc) {
        this.projectorOsc.stop()
        this.projectorOsc.disconnect()
      }
      if (this.projectorNoise) {
        this.projectorNoise.stop()
        this.projectorNoise.disconnect()
      }
    }
  }

  // --- UI SOUND EFFECTS ---
  public playClick() {
    this.initCtx()
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04)
    gain.gain.setValueAtTime(this.volume * 0.4, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.04)
  }

  public playTrapSnap() {
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // 1. Mechanical Metal Snap
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15)
    gain.gain.setValueAtTime(this.volume * 0.8, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.15)

    // 2. High-Frequency Film Arc / Tear Noise Burst
    const bufferSize = this.ctx.sampleRate * 0.1
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1)
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = noiseBuffer
    const noiseGain = this.ctx.createGain()
    noiseGain.gain.setValueAtTime(this.volume * 0.6, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

    noise.connect(noiseGain)
    noiseGain.connect(this.ctx.destination)
    noise.start(now)
  }

  public playHeartbeat(urgency: number) {
    this.initCtx()
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    const freq = 55 + urgency * 35
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.12)
    gain.gain.setValueAtTime(this.volume * (0.5 + urgency * 0.4), this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.12)
  }

  public playWin() {
    this.initCtx()
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const notes = [261.63, 329.63, 392.00, 523.25]
    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + idx * 0.08)
      gain.gain.setValueAtTime(this.volume * 0.5, now + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.3)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now + idx * 0.08)
      osc.stop(now + idx * 0.08 + 0.3)
    })
  }

  public playGameOver() {
    this.initCtx()
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(180, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.8)
    gain.gain.setValueAtTime(this.volume * 0.8, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.8)
  }
}

export const soundFx = new SoundFX()