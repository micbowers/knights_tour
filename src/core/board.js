// Board geometry. No state, no DOM — just coordinate math.
//
// A square is { file, rank } with file 0 = A and rank 0 = bottom row,
// matching the worksheet (A1 in the bottom-left, E5 in the top-right on 5×5).
// Internally we also index squares as a flat int = rank * size + file
// for O(1) Set membership in `visited`.

export const KNIGHT_OFFSETS = [
  [ 1,  2], [ 2,  1], [ 2, -1], [ 1, -2],
  [-1, -2], [-2, -1], [-2,  1], [-1,  2],
];

export const FILE_LABELS = ['A','B','C','D','E','F','G','H'];

export function squareToIndex({ file, rank }, size) {
  return rank * size + file;
}

export function indexToSquare(i, size) {
  return { file: i % size, rank: Math.floor(i / size) };
}

export function inBounds({ file, rank }, size) {
  return file >= 0 && file < size && rank >= 0 && rank < size;
}

export function squaresEqual(a, b) {
  if (!a || !b) return false;
  return a.file === b.file && a.rank === b.rank;
}

export function fileLabel(file) {
  return FILE_LABELS[file] ?? '?';
}

export function rankLabel(rank) {
  return String(rank + 1);
}

export function squareLabel({ file, rank }) {
  return `${fileLabel(file)}${rankLabel(rank)}`;
}

// All in-bounds squares a knight could jump to from `from`. Does not
// consider visited state — use engine.getLegalMoves for that.
export function knightTargets(from, size) {
  const targets = [];
  for (const [df, dr] of KNIGHT_OFFSETS) {
    const sq = { file: from.file + df, rank: from.rank + dr };
    if (inBounds(sq, size)) targets.push(sq);
  }
  return targets;
}

// True if `b` is a knight's move away from `a`, regardless of bounds.
export function isKnightMove(a, b) {
  const df = Math.abs(a.file - b.file);
  const dr = Math.abs(a.rank - b.rank);
  return (df === 1 && dr === 2) || (df === 2 && dr === 1);
}
