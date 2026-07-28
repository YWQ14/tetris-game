class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // Lazy initialization on first gesture
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn("Audio Context not supported in this browser environment.", e);
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, gainStart: number = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // Resume if suspended (browser security)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainStart, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio errors
    }
  }

  playMove() {
    this.playTone(150, 'triangle', 0.08, 0.15);
  }

  playRotate() {
    this.playTone(300, 'triangle', 0.1, 0.15);
  }

  playDrop() {
    this.playTone(100, 'sine', 0.15, 0.25);
  }

  playHold() {
    this.playTone(440, 'triangle', 0.12, 0.1);
  }

  playLineClear(lines: number) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const now = this.ctx.currentTime;
      // High-pitched retro sweep
      const freqs = lines === 4 ? [400, 600, 800, 1200] : [523.25, 659.25, 783.99]; // C5, E5, G5 major triad or sweep for Tetris!
      const duration = lines === 4 ? 0.4 : 0.25;

      freqs.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + index * 0.06);

        gain.gain.setValueAtTime(0.08, now + index * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.06 + duration);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + index * 0.06);
        osc.stop(now + index * 0.06 + duration);
      });
    } catch (e) {
      // Ignore
    }
  }

  playLevelUp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 triumphant arpeggio
      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + index * 0.1);

        gain.gain.setValueAtTime(0.06, now + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.1 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + 0.3);
      });
    } catch (e) {
      // Ignore
    }
  }

  playGameOver() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [220, 207.65, 196, 174.61]; // A3, Ab3, G3, F3 descending sad scale
      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.18);

        gain.gain.setValueAtTime(0.12, now + index * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.18 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + index * 0.18);
        osc.stop(now + index * 0.18 + 0.5);
      });
    } catch (e) {
      // Ignore
    }
  }
}

export const audio = new SoundController();
