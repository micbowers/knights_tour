// Singleton state container with localStorage persistence + a tiny
// pub/sub so screens can re-render on change. The shape is:
//
//   state = {
//     screen: 'home' | 'play' | 'done',
//     tour: Tour,                  // current tour (always present, even on home)
//     prefs: { hintTier, soundOn, lastBoardSize },
//     stats: { hintsUsed, undosUsed },
//   }
//
// Mutations are package-private — engine wrappers call setTour/setScreen.

import { createTour } from './engine.js';

const STORAGE_KEY = 'sparkworks.knightstour.v1';
const SCHEMA_VERSION = 1;

const DEFAULT_BOARD_SIZE = 5;

const listeners = new Set();

// Persistable subset of state. visitedIndices is serialized as an array
// because Set isn't JSON-friendly.
function serialize(s) {
  return {
    schemaVersion: SCHEMA_VERSION,
    screen: s.screen,
    tour: {
      size: s.tour.size,
      knightPos: s.tour.knightPos,
      visited: Array.from(s.tour.visitedIndices),
      history: s.tour.history,
      startedAt: s.tour.startedAt,
      completedAt: s.tour.completedAt,
    },
    prefs: { ...s.prefs },
    stats: { ...s.stats },
  };
}

function deserialize(raw) {
  if (!raw || raw.schemaVersion !== SCHEMA_VERSION) return null;
  return {
    screen: raw.screen ?? 'home',
    tour: {
      size: raw.tour.size,
      knightPos: raw.tour.knightPos ?? null,
      visitedIndices: new Set(raw.tour.visited ?? []),
      history: raw.tour.history ?? [],
      startedAt: raw.tour.startedAt ?? null,
      completedAt: raw.tour.completedAt ?? null,
    },
    prefs: {
      hintTier: raw.prefs?.hintTier ?? 0,
      soundOn: raw.prefs?.soundOn ?? true,
      lastBoardSize: raw.prefs?.lastBoardSize ?? DEFAULT_BOARD_SIZE,
    },
    stats: {
      hintsUsed: raw.stats?.hintsUsed ?? 0,
      undosUsed: raw.stats?.undosUsed ?? 0,
      toursCompleted: raw.stats?.toursCompleted ?? 0,
    },
  };
}

function freshState() {
  return {
    screen: 'home',
    tour: createTour(DEFAULT_BOARD_SIZE),
    prefs: { hintTier: 0, soundOn: true, lastBoardSize: DEFAULT_BOARD_SIZE },
    stats: { hintsUsed: 0, undosUsed: 0, toursCompleted: 0 },
  };
}

let state = freshState();

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const restored = deserialize(parsed);
    if (restored) state = restored;
  } catch {
    // Bad payload — ignore and keep fresh state.
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize(state)));
  } catch {
    // Quota exceeded or disabled — fail silently.
  }
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  for (const fn of listeners) fn(state);
}

// Mutators — keep the surface small and explicit.

export function setScreen(screen) {
  state = { ...state, screen };
  persist();
  notify();
}

export function setTour(tour) {
  state = { ...state, tour };
  persist();
  notify();
}

export function setPrefs(patch) {
  state = { ...state, prefs: { ...state.prefs, ...patch } };
  persist();
  notify();
}

export function bumpStat(key) {
  state = { ...state, stats: { ...state.stats, [key]: state.stats[key] + 1 } };
  persist();
  notify();
}

export function resetStats() {
  // Per-tour stats reset; toursCompleted is lifetime — leave it alone.
  state = {
    ...state,
    stats: { ...state.stats, hintsUsed: 0, undosUsed: 0 },
  };
  persist();
  notify();
}

export function startFreshTour(size) {
  state = {
    ...state,
    tour: createTour(size),
    stats: { ...state.stats, hintsUsed: 0, undosUsed: 0 },
    prefs: { ...state.prefs, lastBoardSize: size },
  };
  persist();
  notify();
}
