/**
 * Procedural Argentine Web Audio Music Synthesizer & Radio
 * Generates authentic Argentine styles:
 * - 92.4 FM: Tango de Salón & Bandoneón (Nostalgic minor tango with Chan-Chan accents)
 * - 98.7 FM: Cumbia Santafesina & Acordeón (Upbeat Los Palmeras vibe)
 * - 101.5 FM: Peña Criolla & Chacarera (3/4 - 6/8 arpeggios & bombo legüero)
 * - 104.3 FM: Rock Nacional Melódico (Serú / Charly / Spinetta vibe)
 */

export interface RadioStation {
  id: string;
  dial: string;
  name: string;
  genre: string;
  description: string;
  tempo: number;
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'tango',
    dial: '92.4 FM',
    name: 'Tango & Bandoneón',
    genre: 'Tango Clásico',
    description: 'Nostalgia porteña, acordes menores y el fuelle del bandoneón.',
    tempo: 105
  },
  {
    id: 'cumbia',
    dial: '98.7 FM',
    name: 'Cumbia Santafesina',
    genre: 'Cumbia y Acordeón',
    description: 'Ritmo popular santafesino para levantar el ánimo del ministerio.',
    tempo: 96
  },
  {
    id: 'folklore',
    dial: '101.5 FM',
    name: 'Peña Criolla',
    genre: 'Chacarera y Zamba',
    description: 'Bombo legüero, guitarras criollas y aire de campo federal.',
    tempo: 120
  },
  {
    id: 'rock',
    dial: '104.3 FM',
    name: 'Rock Nacional 80s',
    genre: 'Clásicos Argentos',
    description: 'Baladas y sintetizadores con la mística del rock nacional.',
    tempo: 84
  }
];

// Note frequencies (Hz)
const NOTES: Record<string, number> = {
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Ab5: 830.61, A5: 880.00, Bb5: 932.33, B5: 987.77,
  C6: 1046.50
};

interface StepNote {
  lead?: string;
  chords?: string[];
  bass?: string;
  perc?: 'bombo' | 'guiro' | 'chan' | 'hihat' | 'snare' | 'accent';
  length?: number; // in beats
}

// 1. Tango Sequence (32 steps loop)
const TANGO_SCORE: StepNote[] = [
  // Measure 1 - Dm
  { lead: 'D4', chords: ['F4', 'A4'], bass: 'D3', perc: 'chan', length: 1 },
  { lead: 'F4', chords: ['F4', 'A4'], bass: 'A3', perc: 'hihat', length: 0.5 },
  { lead: 'A4', chords: ['F4', 'A4'], bass: 'D3', perc: 'chan', length: 0.5 },
  { lead: 'D5', chords: ['F4', 'A4'], bass: 'A3', perc: 'hihat', length: 1 },
  // Measure 2 - Gm
  { lead: 'C5', chords: ['G4', 'Bb4'], bass: 'G3', perc: 'chan', length: 0.75 },
  { lead: 'Bb4', chords: ['G4', 'Bb4'], bass: 'D3', perc: 'hihat', length: 0.25 },
  { lead: 'A4', chords: ['G4', 'Bb4'], bass: 'G3', perc: 'chan', length: 0.5 },
  { lead: 'G4', chords: ['G4', 'Bb4'], bass: 'D3', perc: 'hihat', length: 0.5 },
  // Measure 3 - A7
  { lead: 'Fs4', chords: ['E4', 'G4', 'A4'], bass: 'A3', perc: 'chan', length: 1 },
  { lead: 'G4', chords: ['E4', 'G4', 'A4'], bass: 'E3', perc: 'hihat', length: 0.5 },
  { lead: 'Bb4', chords: ['E4', 'G4', 'A4'], bass: 'A3', perc: 'chan', length: 0.5 },
  { lead: 'A4', chords: ['E4', 'G4', 'A4'], bass: 'E3', perc: 'hihat', length: 1 },
  // Measure 4 - Dm (Chan-chan final)
  { lead: 'D4', chords: ['F4', 'A4', 'D5'], bass: 'D3', perc: 'accent', length: 0.5 },
  { lead: 'F4', chords: ['F4', 'A4'], bass: 'A3', length: 0.5 },
  { lead: 'D5', chords: ['D4', 'F4', 'A4'], bass: 'D3', perc: 'accent', length: 1 },
  // Measure 5 - Melodic run
  { lead: 'E5', chords: ['E4', 'G4', 'Bb4'], bass: 'C3', perc: 'chan', length: 0.5 },
  { lead: 'D5', chords: ['E4', 'G4', 'Bb4'], bass: 'G3', perc: 'hihat', length: 0.5 },
  { lead: 'C5', chords: ['E4', 'G4', 'Bb4'], bass: 'C3', perc: 'chan', length: 0.5 },
  { lead: 'Bb4', chords: ['D4', 'F4', 'A4'], bass: 'D3', perc: 'hihat', length: 0.5 },
  // Measure 6 - Fuerte tango
  { lead: 'A4', chords: ['D4', 'F4'], bass: 'D3', perc: 'chan', length: 1 },
  { lead: 'G4', chords: ['E4', 'G4', 'A4'], bass: 'A3', perc: 'chan', length: 0.5 },
  { lead: 'F4', chords: ['E4', 'G4', 'A4'], bass: 'E3', perc: 'hihat', length: 0.5 },
  { lead: 'E4', chords: ['E4', 'G4', 'A4'], bass: 'A3', perc: 'chan', length: 1 },
  // Measure 7 & 8 - Grand Chan-Chan
  { lead: 'D4', chords: ['D4', 'F4', 'A4'], bass: 'D3', perc: 'accent', length: 1 },
  { lead: 'A4', chords: ['E4', 'G4', 'A4'], bass: 'A3', perc: 'accent', length: 0.5 },
  { lead: 'D4', chords: ['D4', 'F4', 'A4', 'D5'], bass: 'D3', perc: 'accent', length: 1.5 }
];

// 2. Cumbia Score (16 steps upbeat loop)
const CUMBIA_SCORE: StepNote[] = [
  // C major / G major / Am / F
  { lead: 'E5', chords: ['C4', 'E4', 'G4'], bass: 'C3', perc: 'guiro', length: 0.5 },
  { lead: 'G5', chords: ['C4', 'E4', 'G4'], bass: 'G3', perc: 'hihat', length: 0.5 },
  { lead: 'A5', chords: ['C4', 'E4', 'G4'], bass: 'C3', perc: 'guiro', length: 0.5 },
  { lead: 'G5', chords: ['C4', 'E4', 'G4'], bass: 'G3', perc: 'snare', length: 0.5 },

  { lead: 'D5', chords: ['B3', 'D4', 'G4'], bass: 'G3', perc: 'guiro', length: 0.5 },
  { lead: 'F5', chords: ['B3', 'D4', 'G4'], bass: 'D3', perc: 'hihat', length: 0.5 },
  { lead: 'E5', chords: ['B3', 'D4', 'G4'], bass: 'G3', perc: 'guiro', length: 0.5 },
  { lead: 'D5', chords: ['B3', 'D4', 'G4'], bass: 'D3', perc: 'snare', length: 0.5 },

  { lead: 'C5', chords: ['A3', 'C4', 'E4'], bass: 'A3', perc: 'guiro', length: 0.5 },
  { lead: 'E5', chords: ['A3', 'C4', 'E4'], bass: 'E3', perc: 'hihat', length: 0.5 },
  { lead: 'D5', chords: ['A3', 'C4', 'E4'], bass: 'A3', perc: 'guiro', length: 0.5 },
  { lead: 'C5', chords: ['A3', 'C4', 'E4'], bass: 'E3', perc: 'snare', length: 0.5 },

  { lead: 'F5', chords: ['A3', 'C4', 'F4'], bass: 'F3', perc: 'guiro', length: 0.5 },
  { lead: 'E5', chords: ['B3', 'D4', 'G4'], bass: 'G3', perc: 'hihat', length: 0.5 },
  { lead: 'D5', chords: ['B3', 'D4', 'G4'], bass: 'G3', perc: 'guiro', length: 0.5 },
  { lead: 'C5', chords: ['C4', 'E4', 'G4'], bass: 'C3', perc: 'snare', length: 0.5 }
];

// 3. Chacarera Folklore Score (3/4 6/8 syncopation)
const FOLKLORE_SCORE: StepNote[] = [
  // Em - B7 - Em
  { lead: 'B4', chords: ['E4', 'G4', 'B4'], bass: 'E3', perc: 'bombo', length: 0.5 },
  { lead: 'G4', chords: ['E4', 'G4', 'B4'], bass: 'B3', perc: 'hihat', length: 0.5 },
  { lead: 'E4', chords: ['E4', 'G4', 'B4'], bass: 'E3', perc: 'bombo', length: 0.5 },
  { lead: 'Fs4', chords: ['Ds4', 'Fs4', 'B4'], bass: 'B3', perc: 'hihat', length: 0.5 },
  { lead: 'G4', chords: ['Ds4', 'Fs4', 'B4'], bass: 'B3', perc: 'bombo', length: 0.5 },
  { lead: 'A4', chords: ['Ds4', 'Fs4', 'B4'], bass: 'Fs3', perc: 'bombo', length: 0.5 },

  { lead: 'B4', chords: ['E4', 'G4', 'B4'], bass: 'E3', perc: 'bombo', length: 0.5 },
  { lead: 'D5', chords: ['G4', 'B4', 'D5'], bass: 'G3', perc: 'hihat', length: 0.5 },
  { lead: 'C5', chords: ['A3', 'C4', 'E4'], bass: 'A3', perc: 'bombo', length: 0.5 },
  { lead: 'B4', chords: ['E4', 'G4', 'B4'], bass: 'E3', perc: 'hihat', length: 0.5 },
  { lead: 'A4', chords: ['Ds4', 'Fs4', 'B4'], bass: 'B3', perc: 'bombo', length: 0.5 },
  { lead: 'G4', chords: ['E4', 'G4', 'B4'], bass: 'E3', perc: 'bombo', length: 0.5 }
];

// 4. Rock Nacional Score
const ROCK_SCORE: StepNote[] = [
  // C - G/B - Am - Fmaj7
  { lead: 'C5', chords: ['C4', 'E4', 'G4'], bass: 'C3', perc: 'hihat', length: 1 },
  { lead: 'E5', chords: ['C4', 'E4', 'G4'], bass: 'G3', perc: 'snare', length: 1 },
  { lead: 'D5', chords: ['B3', 'D4', 'G4'], bass: 'B3', perc: 'hihat', length: 1 },
  { lead: 'B4', chords: ['B3', 'D4', 'G4'], bass: 'G3', perc: 'snare', length: 1 },

  { lead: 'A4', chords: ['A3', 'C4', 'E4'], bass: 'A3', perc: 'hihat', length: 1 },
  { lead: 'C5', chords: ['A3', 'C4', 'E4'], bass: 'E3', perc: 'snare', length: 1 },
  { lead: 'G4', chords: ['A3', 'C4', 'F4'], bass: 'F3', perc: 'hihat', length: 1 },
  { lead: 'F4', chords: ['A3', 'C4', 'F4'], bass: 'C3', perc: 'snare', length: 1 }
];

class ArgentineRadioEngine {
  private ctx: AudioContext | null = null;
  private currentStationIndex: number = 0;
  private isPlaying: boolean = false;
  private volume: number = 0.35;
  private timer: number | null = null;
  private stepIndex: number = 0;
  private listeners: Array<() => void> = [];

  constructor() {
    const savedStation = localStorage.getItem('el_sello_radio_station');
    if (savedStation) {
      const idx = parseInt(savedStation, 10);
      if (!isNaN(idx) && idx >= 0 && idx < RADIO_STATIONS.length) {
        this.currentStationIndex = idx;
      }
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(fn: () => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getStation(): RadioStation {
    return RADIO_STATIONS[this.currentStationIndex];
  }

  public getStationIndex(): number {
    return this.currentStationIndex;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.notify();
  }

  public playStaticBurst() {
    this.initCtx();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, t);
    filter.Q.setValueAtTime(2.0, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  public play() {
    this.initCtx();
    this.isPlaying = true;
    this.stepIndex = 0;
    this.playStaticBurst();
    this.scheduleNextStep();
    this.notify();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  public setStation(index: number) {
    if (index === this.currentStationIndex) return;
    this.currentStationIndex = (index + RADIO_STATIONS.length) % RADIO_STATIONS.length;
    localStorage.setItem('el_sello_radio_station', String(this.currentStationIndex));
    this.stepIndex = 0;
    if (this.isPlaying) {
      this.playStaticBurst();
    }
    this.notify();
  }

  public nextStation() {
    this.setStation(this.currentStationIndex + 1);
  }

  public prevStation() {
    this.setStation(this.currentStationIndex - 1);
  }

  private getActiveScore(): StepNote[] {
    const st = this.getStation().id;
    if (st === 'tango') return TANGO_SCORE;
    if (st === 'cumbia') return CUMBIA_SCORE;
    if (st === 'folklore') return FOLKLORE_SCORE;
    return ROCK_SCORE;
  }

  private scheduleNextStep() {
    if (!this.isPlaying) return;
    const score = this.getActiveScore();
    const station = this.getStation();
    const note = score[this.stepIndex % score.length];

    this.playStepSound(note, station.id);

    const beatDurationMs = (60 / station.tempo) * 1000 * (note.length || 0.5);
    this.stepIndex = (this.stepIndex + 1) % score.length;

    this.timer = window.setTimeout(() => {
      this.scheduleNextStep();
    }, Math.max(120, beatDurationMs));
  }

  private playStepSound(step: StepNote, genreId: string) {
    if (!this.ctx || this.volume <= 0.01) return;
    const t = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.45, t);
    masterGain.connect(this.ctx.destination);

    // 1. Percussion / Chan-Chan / Guiro / Bombo
    if (step.perc) {
      if (step.perc === 'chan' || step.perc === 'accent') {
        // Tango Chan-Chan staccato accent
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.08);
        g.gain.setValueAtTime(0.6, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.1);
      } else if (step.perc === 'bombo') {
        // Bombo legüero deep resonance
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(95, t);
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.22);
        g.gain.setValueAtTime(0.7, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.25);
      } else if (step.perc === 'guiro') {
        // Guiro scrape
        const bufferSize = this.ctx.sampleRate * 0.04;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * (i % 8 < 4 ? 0.6 : -0.6);
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3200, t);
        filter.Q.setValueAtTime(3.0, t);
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.35, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
        noise.connect(filter);
        filter.connect(g);
        g.connect(masterGain);
        noise.start(t);
      } else if (step.perc === 'hihat') {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(6000, t);
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.04);
      } else if (step.perc === 'snare') {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.07);
        g.gain.setValueAtTime(0.4, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.09);
      }
    }

    // 2. Bass note
    if (step.bass && NOTES[step.bass]) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = genreId === 'tango' ? 'sawtooth' : 'triangle';
      bassOsc.frequency.setValueAtTime(NOTES[step.bass], t);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(genreId === 'tango' ? 300 : 200, t);

      const dur = Math.min(0.4, (step.length || 0.5) * (60 / this.getStation().tempo));
      bassGain.gain.setValueAtTime(0.35, t);
      bassGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      bassOsc.connect(filter);
      filter.connect(bassGain);
      bassGain.connect(masterGain);
      bassOsc.start(t);
      bassOsc.stop(t + dur + 0.01);
    }

    // 3. Harmony Chords
    if (step.chords && step.chords.length > 0) {
      step.chords.forEach((chordNote) => {
        if (!NOTES[chordNote] || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = genreId === 'tango' || genreId === 'cumbia' ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(NOTES[chordNote], t);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(genreId === 'tango' ? 800 : 600, t);

        const dur = Math.min(0.35, (step.length || 0.5) * (60 / this.getStation().tempo));
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);

        osc.connect(filter);
        filter.connect(g);
        g.connect(masterGain);
        osc.start(t);
        osc.stop(t + dur + 0.01);
      });
    }

    // 4. Lead Melody (Bandoneón with vibrato for Tango, Accordeon for Cumbia, Guitar/Flute for Folklore, Synth for Rock)
    if (step.lead && NOTES[step.lead]) {
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();

      if (genreId === 'tango') {
        // Bandoneón sound: sawtooth with slight vibrato LFO and bandpass filter
        leadOsc.type = 'sawtooth';
        leadOsc.frequency.setValueAtTime(NOTES[step.lead], t);

        // Vibrato
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(5.5, t); // 5.5 Hz vibrato
        lfoGain.gain.setValueAtTime(3.5, t);
        lfo.connect(leadOsc.frequency);
        lfo.start(t);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(950, t);
        filter.Q.setValueAtTime(2.2, t);

        const dur = Math.min(0.6, (step.length || 0.5) * (60 / this.getStation().tempo));
        leadGain.gain.setValueAtTime(0.01, t);
        leadGain.gain.linearRampToValueAtTime(0.24, t + 0.04);
        leadGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        leadOsc.connect(filter);
        filter.connect(leadGain);
        leadGain.connect(masterGain);
        leadOsc.start(t);
        leadOsc.stop(t + dur + 0.01);
        lfo.stop(t + dur + 0.01);
      } else if (genreId === 'cumbia') {
        // Acordeón santafesino: dual detuned square/sawtooth
        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(NOTES[step.lead], t);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, t);

        const dur = Math.min(0.45, (step.length || 0.5) * (60 / this.getStation().tempo));
        leadGain.gain.setValueAtTime(0.18, t);
        leadGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        leadOsc.connect(filter);
        filter.connect(leadGain);
        leadGain.connect(masterGain);
        leadOsc.start(t);
        leadOsc.stop(t + dur + 0.01);
      } else if (genreId === 'folklore') {
        // Criolla / Quena / Flute
        leadOsc.type = 'triangle';
        leadOsc.frequency.setValueAtTime(NOTES[step.lead], t);

        const dur = Math.min(0.5, (step.length || 0.5) * (60 / this.getStation().tempo));
        leadGain.gain.setValueAtTime(0.01, t);
        leadGain.gain.linearRampToValueAtTime(0.25, t + 0.03);
        leadGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        leadOsc.connect(leadGain);
        leadGain.connect(masterGain);
        leadOsc.start(t);
        leadOsc.stop(t + dur + 0.01);
      } else {
        // Rock 80s warm synth
        leadOsc.type = 'sawtooth';
        leadOsc.frequency.setValueAtTime(NOTES[step.lead], t);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, t);
        filter.frequency.exponentialRampToValueAtTime(400, t + 0.4);

        const dur = Math.min(0.8, (step.length || 1) * (60 / this.getStation().tempo));
        leadGain.gain.setValueAtTime(0.2, t);
        leadGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        leadOsc.connect(filter);
        filter.connect(leadGain);
        leadGain.connect(masterGain);
        leadOsc.start(t);
        leadOsc.stop(t + dur + 0.01);
      }
    }
  }
}

export const radio = new ArgentineRadioEngine();
