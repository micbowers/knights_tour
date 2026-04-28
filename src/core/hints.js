// Hint system. Two pieces:
//   - Tier setting (state.prefs.hintTier 0|1|2): controls always-on
//     visual hints rendered by the board.
//   - One-shot "Give me a hint" button: returns the Warnsdorff-best
//     square; budget tracked per tour (3 per tour by default).

import { getLegalMoves } from './engine.js';
import { bestNextMove, scoreSquare } from './warnsdorff.js';

export const HINT_TIERS = [
  { value: 0, label: 'Off',               help: 'Try cold — no visual help.' },
  { value: 1, label: 'Show valid moves',  help: 'Reachable squares glow.' },
  { value: 2, label: 'Show counts',       help: 'Each glow shows how many onward moves it has. Lower is usually safer.' },
];

export const HINT_BUDGET = 3;

// Returns the best next square (Warnsdorff) or null if no legal moves.
export function suggestBestMove(tour) {
  const legal = getLegalMoves(tour);
  return bestNextMove(legal, tour.visitedIndices, tour.size);
}

// Returns map of squareIndex → onward count for legal moves. Used by
// board renderer when hintTier === 2.
export function legalMoveCounts(tour) {
  const out = new Map();
  for (const sq of getLegalMoves(tour)) {
    const idx = sq.rank * tour.size + sq.file;
    out.set(idx, scoreSquare(sq, tour.visitedIndices, tour.size));
  }
  return out;
}
