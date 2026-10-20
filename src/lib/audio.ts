'use client'

class SoundController {
  private ctx: AudioContext | null = null
  private ambientOsc: OscillatorNode | null = null
  private ambientGain: GainNode | null = null
  private isMuted: boolean = false
  private masterVolume: number = 0.2

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  setVolume(vol: number) {
    this.masterVolume = vol
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(vol * 0.15, this.ctx?.currentTime || 0)
    }
  }

  toggleAmbientMusic(enable: boolean) {
    this.init()
    if (!this.ctx) return

    if (enable) {
      if (this.ambientOsc) return
      this.ambientOsc = this.ctx.createOscillator()
      this.ambientGain = this.ctx.createGain()

      this.ambientOsc.type = 'sawtooth'
      this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime)

      this.ambientGain.gain.setValueAtTime(this.masterVolume * 0.15, this.ctx.currentTime)

      this.ambientOsc.connect(this.ambientGain)
      this.ambientGain.connect(this.ctx.destination)

      this.ambientOsc.start()
    } else {
      if (this.ambientOsc) {
        this.ambientOsc.stop()
        this.ambientOsc.disconnect()
        this.ambientOsc = null
      }
    }
  }

  playClick() {
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05)

    gain.gain.setValueAtTime(this.masterVolume * 0.4, now)
    gain.gain.linearRampToValueAtTime(0.01, now + 0.05)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)
  }

  playTrapSnap() {
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const bufferSize = this.ctx.sampleRate * 0.2
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1200, now)
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.2)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(this.masterVolume * 0.8, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(now)
  }

  playWin() {
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const notes = [261.63, 329.63, 392.0, 523.25]
    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + idx * 0.08)

      gain.gain.setValueAtTime(this.masterVolume * 0.3, now + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.3)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now + idx * 0.08)
      osc.stop(now + idx * 0.08 + 0.3)
    })
  }

  playGameOver() {
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 1.2)

    gain.gain.setValueAtTime(this.masterVolume * 0.5, now)
    gain.gain.linearRampToValueAtTime(0.01, now + 1.2)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 1.2)
  }

  // Double-thump low frequency heartbeat pulse
  playHeartbeat(urgencyFactor: number = 1) {
    this.init()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    // First thump (Lub)
    const osc1 = this.ctx.createOscillator()
    const gain1 = this.ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(60 + urgencyFactor * 10, now)
    osc1.frequency.exponentialRampToValueAtTime(25, now + 0.12)

    gain1.gain.setValueAtTime(this.masterVolume * (0.3 + urgencyFactor * 0.3), now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc1.connect(gain1)
    gain1.connect(this.ctx.destination)

    osc1.start(now)
    osc1.stop(now + 0.12)

    // Second thump (Dub) - 0.15s offset
    const osc2 = this.ctx.createOscillator()
    const gain2 = this.ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(50 + urgencyFactor * 10, now + 0.15)
    osc2.frequency.exponentialRampToValueAtTime(20, now + 0.25)

    gain2.gain.setValueAtTime(this.masterVolume * (0.2 + urgencyFactor * 0.25), now + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc2.connect(gain2)
    gain2.connect(this.ctx.destination)

    osc2.start(now + 0.15)
    osc2.stop(now + 0.25)
  }
}

export const soundFx = new SoundController()