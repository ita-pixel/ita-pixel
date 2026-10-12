// Enhanced kid-friendly Audio & Child-Voice Engine with bilingual support (ID & EN)
import { Language } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  public soundEnabled: boolean = true;
  public speechEnabled: boolean = true;
  public currentLanguage: Language = 'id';
  private voices: SpeechSynthesisVoice[] = [];
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Auto-unlock audio context on first user interaction
      const unlock = () => {
        this.unlockAudio();
        if (this.isUnlocked) {
          window.removeEventListener('pointerdown', unlock);
          window.removeEventListener('touchstart', unlock);
          window.removeEventListener('click', unlock);
          window.removeEventListener('keydown', unlock);
        }
      };

      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('touchstart', unlock, { passive: true });
      window.addEventListener('click', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });

      // Pre-load speech synthesis voices
      if ('speechSynthesis' in window) {
        this.loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
      }
    }
  }

  public setLanguage(lang: Language) {
    this.currentLanguage = lang;
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      this.voices = window.speechSynthesis.getVoices();
    } catch {
      this.voices = [];
    }
  }

  public unlockAudio(): void {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx
          .resume()
          .then(() => {
            this.isUnlocked = true;
          })
          .catch(() => {});
      } else if (this.ctx && this.ctx.state === 'running') {
        this.isUnlocked = true;
      }

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    } catch (e) {
      console.warn('Audio unlock warning:', e);
    }
  }

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Pentatonic scale frequencies for numbers 1 to 10 (C4 to C6)
  private numberPitches: number[] = [
    261.63, // 1: C4
    293.66, // 2: D4
    329.63, // 3: E4
    392.0, // 4: G4
    440.0, // 5: A4
    523.25, // 6: C5
    587.33, // 7: D5
    659.25, // 8: E5
    783.99, // 9: G5
    1046.5, // 10: C6
  ];

  public playNumberTone(num: number) {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const clamped = Math.max(1, Math.min(10, num));
      const freq = this.numberPitches[clamped - 1] || 440;

      // Rich dual oscillator (Triangle + Sine for cheerful marimba sound)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.55);
      osc2.stop(ctx.currentTime + 0.55);
    } catch {
      // Fallback silently
    }
  }

  public playPop(frequencyOffset: number = 0) {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const baseFreq = 380 + (frequencyOffset % 10) * 45;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Fallback
    }
  }

  public playSuccess() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.5);
      });
    } catch {
      // Fallback
    }
  }

  public playTryAgain() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [440.0, 349.23]; // A4 to F4
      notes.forEach((freq, idx) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.14 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.14 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.14);
        osc.stop(ctx.currentTime + idx * 0.14 + 0.35);
      });
    } catch {
      // Fallback
    }
  }

  /**
   * Speak using child-like vocal modulation:
   * Higher pitch (1.45) creates a cheerful child's vocal tract formant.
   * Moderate pace (0.90) ensures preschoolers can understand easily.
   */
  public speak(text: string, lang?: Language) {
    if (!this.speechEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const selectedLang = lang || this.currentLanguage;

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text.toLowerCase());
      utterance.lang = selectedLang === 'id' ? 'id-ID' : 'en-US';
      // Child-like voice parameters:
      utterance.rate = 0.90; // Gentle, clear preschool pacing
      utterance.pitch = 1.48; // Higher pitch simulating bright child voice
      utterance.volume = 1.0;

      if (this.voices.length === 0) {
        this.loadVoices();
      }

      // Voice selection: find matching language voice with high natural quality
      if (selectedLang === 'id') {
        const idVoice = this.voices.find(
          (v) =>
            v.lang.toLowerCase().includes('id') ||
            v.name.toLowerCase().includes('indonesia')
        );
        if (idVoice) utterance.voice = idVoice;
      } else {
        const enVoice = this.voices.find(
          (v) =>
            (v.lang.toLowerCase().includes('en-us') ||
              v.lang.toLowerCase().includes('en-gb') ||
              v.lang.toLowerCase().startsWith('en')) &&
            (v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('child') ||
              v.name.toLowerCase().includes('natural') ||
              v.name.toLowerCase().includes('samantha'))
        ) || this.voices.find((v) => v.lang.toLowerCase().startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      }

      setTimeout(() => {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          window.speechSynthesis.speak(utterance);
        } catch {
          // Fallback
        }
      }, 30);
    } catch {
      // Fallback
    }
  }

  public speakNumber(num: number, word: string, lang?: Language) {
    this.playNumberTone(num);
    const selectedLang = lang || this.currentLanguage;
    this.speak(`${num}. ${word}`, selectedLang);
  }

  public testAudio(lang?: Language) {
    this.unlockAudio();
    this.playSuccess();
    const selectedLang = lang || this.currentLanguage;
    setTimeout(() => {
      if (selectedLang === 'id') {
        this.speak('halo teman-teman! suara anak sudah aktif dan siap berhitung bersama!');
      } else {
        this.speak('hello friends! kid voice is ready to count together!');
      }
    }, 400);
  }
}

export const sound = new SoundEngine();
