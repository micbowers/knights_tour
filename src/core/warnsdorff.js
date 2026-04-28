// Warnsdorff's heuristic: from each candidate square, count how many
// onward unvisited squares the knight could reach. The lowest count is
// usually the safest move. Used by hint tiers (counts overlay, "give
// me a hint" button) and by the closed-tour-detection helper.

import { knightTargets, squareToIndex } from './board.js';

// `visited` is a Set<int> of square indices.
// Returns the count of in-bounds, unvisited knight targets reachable
// from `square`, treating `square` itself as visited (the kid will be
// standing on it after the move).
export function scoreSquare(square, visited, size) {
  const sqIdx = squareToIndex(square, size);
  let count = 0;
  for (const target of knightTargets(square, size)) {
    const ti = squareToIndex(target, size);
    if (ti === sqIdx) continue;
    if (visited.has(ti)) continue;
    count++;
  }
  return count;
}

// Picks the legal move with the lowest Warnsdorff score. Ties broken
// deterministically by board index (lowest first) so kids see the same
// suggestion across hits in the same position.
export function bestNextMove(legalMoves, visited, size) {
  if (legalMoves.length === 0) return null;
  let best = null;
  let bestScore = Infinity;
  for (const sq of legalMoves) {
    const score = scoreSquare(sq, visited, size);
    if (
      score < bestScore ||
      (score === bestScore && best && squareToIndex(sq, size) < squareToIndex(best, size))
    ) {
      best = sq;
      bestScore = score;
    }
  }
  return best;
}
