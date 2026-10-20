class HorrorAudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private ambientGain: GainNode | null = null
  private musicInterval: any = null
  private isMusicPlaying: boolean = false
  private volume: number = 0.25

  public initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = this.volume
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public setVolume(val: number) {
    this.volume = val
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.05)
    }
  }

  public getVolume(): number {
    return this.volume
  }

  // --- Clean John Carpenter-Style Halloween Synth (No Drone) ---
  public toggleAmbientMusic(enable: boolean) {
    this.initCtx()
    if (!this.ctx || !this.masterGain) return

    if (!enable) {
      this.stopAmbientMusic()
      return
    }

    if (this.isMusicPlaying) return
    this.isMusicPlaying = true

    this.ambientGain = this.ctx.createGain()
    this.ambientGain.gain.value = 0.22
    this.ambientGain.connect(this.masterGain)

    // Creepy Minor Arpeggio Sequence (F Minor Motif)
    const notes = [174.61, 207.65, 174.61, 207.65, 174.61, 220.00, 174.61, 207.65] // F4, Ab4, F4, Ab4, F4, A4, F4, Ab4
    let noteIdx = 0

    // Play the first note immediately on trigger
    const now = this.ctx.currentTime
    const firstOsc = this.ctx.createOscillator()
    const firstGain = this.ctx.createGain()
    firstOsc.type = 'square'
    firstOsc.frequency.setValueAtTime(notes[0], now)
    firstGain.gain.setValueAtTime(0.18, now)
    firstGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16)
    firstOsc.connect(firstGain)
    firstGain.connect(this.ambientGain)
    firstOsc.start(now)
    firstOsc.stop(now + 0.17)
    noteIdx = 1

    // High Arpeggiated Synth Loop (160 BPM)
    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.ambientGain || !this.isMusicPlaying) return
      
      const currentTime = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const noteGain = this.ctx.createGain()

      osc.type = 'square'
      osc.frequency.setValueAtTime(notes[noteIdx], currentTime)

      noteGain.gain.setValueAtTime(0.18, currentTime)
      noteGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.16)

      osc.connect(noteGain)
      noteGain.connect(this.ambientGain)

      osc.start(currentTime)
      osc.stop(currentTime + 0.17)

      noteIdx = (noteIdx + 1) % notes.length
    }, 187)
  }

  public stopAmbientMusic() {
    this.isMusicPlaying = false
    if (this.musicInterval) {
      clearInterval(this.musicInterval)
      this.musicInterval = null
    }
  }

  // --- Sound Effects ---
  public playClick() {
    this.initCtx()
    if (!this.ctx || !this.masterGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(750, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04)

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.04)
  }

  public playTrapSnap() {
    this.initCtx()
    if (!this.ctx || !this.masterGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(180, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.35)

    gain.gain.setValueAtTime(0.45, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.35)
  }

  public playHeartbeat(urgencyFactor: number = 0.5) {
    this.initCtx()
    if (!this.ctx || !this.masterGain) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    const freq = 45 + urgencyFactor * 25
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(15, this.ctx.currentTime + 0.15)

    gain.gain.setValueAtTime(0.5 * Math.min(urgencyFactor + 0.2, 1), this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.15)
  }

  public playWin() {
    this.initCtx()
    if (!this.ctx || !this.masterGain) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.setValueAtTime(330, now + 0.1)
    osc.frequency.setValueAtTime(440, now + 0.2)
    osc.frequency.setValueAtTime(660, now + 0.3)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.5)
  }

  public playGameOver() {
    this.initCtx()
    if (!this.ctx || !this.masterGain) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.8)

    gain.gain.setValueAtTime(0.5, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.8)
  }
}

export const soundFx = new HorrorAudioEngine()