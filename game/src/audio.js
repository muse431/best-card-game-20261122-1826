// Ember Pact — sound, synthesized live with WebAudio. No audio files,
// no network: every effect is a few oscillators shaped in code.

let ctx = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type = 'sine', vol = 0.12, when = 0) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function sweep(from, to, dur, type = 'triangle', vol = 0.1) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  // A card snapping onto the table.
  play() { tone(520, 0.09, 'triangle', 0.14); tone(780, 0.08, 'sine', 0.08, 0.03); },
  // A hit landing: low thud plus a bright crack.
  hit() { tone(140, 0.16, 'sawtooth', 0.12); tone(880, 0.06, 'square', 0.05, 0.02); },
  // Guard rising: soft glassy rise.
  guard() { sweep(300, 620, 0.18, 'sine', 0.09); },
  // Embers gained: warm shimmer.
  ember() { tone(660, 0.1, 'sine', 0.07); tone(990, 0.12, 'sine', 0.06, 0.05); },
  // A card drawn: quick paper flick.
  draw() { sweep(900, 1400, 0.07, 'triangle', 0.06); },
  // The enemy's turn: a low warning drum.
  foe() { tone(98, 0.22, 'sawtooth', 0.12); tone(65, 0.3, 'sine', 0.14, 0.08); },
  // Winning a duel: a rising three-note flourish.
  win() { tone(523, 0.16, 'triangle', 0.12); tone(659, 0.16, 'triangle', 0.12, 0.12); tone(784, 0.3, 'triangle', 0.14, 0.24); },
  // Losing: a slow fall.
  lose() { tone(392, 0.25, 'sine', 0.11); tone(311, 0.3, 'sine', 0.11, 0.18); tone(233, 0.5, 'sine', 0.12, 0.36); },
  // The whole pact won: a full arpeggio.
  fanfare() {
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.28, 'triangle', 0.12, i * 0.11));
  },
};
