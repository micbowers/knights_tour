// Knight's Tour engine. Pure functions; no DOM, no localStorage.
// Mutations return new tour objects so callers can use them with any
// state container. state.js wraps these and persists.

import {
  knightTargets,
  squareToIndex,
  squaresEqual,
  isKnightMove,
} from './board.js';

// Tour shape:
//   {
//     size: 5..8,
//     knightPos: { file, rank } | null,   // null means "not placed yet"
//     visitedIndices: Set<int>,            // index = rank*size + file
//     history: [{ file, rank }, ...],      // ordered list of squares visited
//     startedAt: epoch ms | null,
//     completedAt: epoch ms | null,
//   }

export function createTour(size) {
  return {
    size,
    knightPos: null,
    visitedIndices: new Set(),
    history: [],
    startedAt: null,
    completedAt: null,
  };
}

export function totalSquares(tour) {
  return tour.size * tour.size;
}

export function moveCount(tour) {
  return tour.history.length;
}

export function isPlaced(tour) {
  return tour.knightPos !== null;
}

export function isComplete(tour) {
  return tour.history.length === totalSquares(tour);
}

// True iff knight is placed, tour not complete, and no legal moves remain.
export function isStuck(tour) {
  if (!isPlaced(tour) || isComplete(tour)) return false;
  return getLegalMoves(tour).length === 0;
}

// Closed tour: complete AND last square is a knight's move from first.
export function isClosedTour(tour) {
  if (!isComplete(tour)) return false;
  const first = tour.history[0];
  const last = tour.history[tour.history.length - 1];
  return isKnightMove(first, last);
}

// Legal moves from current knight position, excluding visited squares.
// Returns [] if knight not yet placed.
export function getLegalMoves(tour) {
  if (!isPlaced(tour)) return [];
  return knightTargets(tour.knightPos, tour.size).filter((sq) => {
    return !tour.visitedIndices.has(squareToIndex(sq, tour.size));
  });
}

export function isLegalPlacement(tour, square) {
  if (isPlaced(tour)) return false;
  return !tour.visitedIndices.has(squareToIndex(square, tour.size));
}

export function isLegalMove(tour, square) {
  if (!isPlaced(tour)) return false;
  return getLegalMoves(tour).some((sq) => squaresEqual(sq, square));
}

// Place the knight on its starting square (move 1).
export function placeKnight(tour, square) {
  if (!isLegalPlacement(tour, square)) return tour;
  const next = cloneTour(tour);
  next.knightPos = { ...square };
  next.visitedIndices.add(squareToIndex(square, tour.size));
  next.history.push({ ...square });
  next.startedAt = Date.now();
  return next;
}

// Move the knight to a legal square (move N+1).
export function moveKnight(tour, square) {
  if (!isLegalMove(tour, square)) return tour;
  const next = cloneTour(tour);
  next.knightPos = { ...square };
  next.visitedIndices.add(squareToIndex(square, tour.size));
  next.history.push({ ...square });
  if (next.history.length === totalSquares(next)) {
    next.completedAt = Date.now();
  }
  return next;
}

// Step back one move. If we undo back to before placement, knightPos
// becomes null and the tour is "fresh placement" again.
export function undoMove(tour) {
  if (tour.history.length === 0) return tour;
  const next = cloneTour(tour);
  const last = next.history.pop();
  next.visitedIndices.delete(squareToIndex(last, tour.size));
  next.knightPos = next.history.length > 0 ? next.history[next.history.length - 1] : null;
  next.completedAt = null; // any undo invalidates completion
  return next;
}

// Reset tour to fresh state at the same size.
export function resetTour(tour) {
  return createTour(tour.size);
}

// Step back N moves at once (used by stuck overlay's "back up 3").
// If N >= history length, resets to fresh.
export function backUp(tour, n) {
  if (n >= tour.history.length) return resetTour(tour);
  let t = tour;
  for (let i = 0; i < n; i++) t = undoMove(t);
  return t;
}

function cloneTour(tour) {
  return {
    size: tour.size,
    knightPos: tour.knightPos ? { ...tour.knightPos } : null,
    visitedIndices: new Set(tour.visitedIndices),
    history: tour.history.map((sq) => ({ ...sq })),
    startedAt: tour.startedAt,
    completedAt: tour.completedAt,
  };
}

// Returns the move number (1-indexed) of a visited square, or null.
export function moveNumberFor(tour, square) {
  for (let i = 0; i < tour.history.length; i++) {
    if (squaresEqual(tour.history[i], square)) return i + 1;
  }
  return null;
}
