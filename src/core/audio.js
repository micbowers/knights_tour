// Minimal Web Audio scaffold. SFX are synthesized — no MP3 assets in v1.
// Lazy AudioContext (created on first user gesture) handles iOS unlock.
// Mute persistence lives in state.prefs.soundOn but this module reads it
// via a getter to avoid an import cycle with state.js.

let ctx = null;
let unlocked = false;
let mutedGetter = () => false;

export function setMutedGetter(fn) {
  mutedGetter = fn;
}

function getCtx() {
  if (ctx) return ctx;
  const Klass = window.AudioContext || window.webkitAudioContext;
  if (!Klass) return null;
  ctx = new Klass();
  return ctx;
}

// Call once on the first user gesture (e.g., a click on the home screen).
export function unlockAudio() {
  if (unlocked) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') c.resume();
  unlocked = true;
}

// Tiny synth: a quick envelope on a sine/square at a given pitch.
function tone({ freq = 440, dur = 0.08, type = 'sine', gain = 0.15 } = {}) {
  if (mutedGetter()) return;
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.005);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

const SFX = {
  move:          () => tone({ freq: 660, dur: 0.07, type: 'sine',     gain: 0.12 }),
  illegal:       () => tone({ freq: 180, dur: 0.12, type: 'square',   gain: 0.08 }),
  hint:          () => tone({ freq: 880, dur: 0.10, type: 'triangle', gain: 0.10 }),
  stuck:         () => tone({ freq: 220, dur: 0.20, type: 'square',   gain: 0.08 }),
  'tour-complete': () => {
    // Three-note arpeggio.
    tone({ freq: 523.25, dur: 0.12, type: 'sine', gain: 0.14 });
    setTimeout(() => tone({ freq: 659.25, dur: 0.12, type: 'sine', gain: 0.14 }), 110);
    setTimeout(() => tone({ freq: 783.99, dur: 0.22, type: 'sine', gain: 0.14 }), 220);
  },
};

export function playSFX(name) {
  const fn = SFX[name];
  if (fn) fn();
}
