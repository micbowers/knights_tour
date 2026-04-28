// Quick smoke test for the engine. Run with: node test-engine.mjs
// Not a real test suite — just sanity checks before manual UI testing.

import {
  createTour, placeKnight, moveKnight, undoMove,
  getLegalMoves, isLegalMove, isComplete, isStuck, isPlaced,
  isClosedTour, moveNumberFor, totalSquares,
} from './src/core/engine.js';
import { squareLabel, isKnightMove } from './src/core/board.js';
import { scoreSquare, bestNextMove } from './src/core/warnsdorff.js';

let passed = 0, failed = 0;
function check(label, cond) {
  if (cond) { passed++; console.log(`  ✓ ${label}`); }
  else      { failed++; console.log(`  ✗ ${label}`); }
}

console.log('=== createTour(5) ===');
let t = createTour(5);
check('size is 5', t.size === 5);
check('knightPos is null', t.knightPos === null);
check('history empty', t.history.length === 0);
check('not placed', !isPlaced(t));
check('totalSquares = 25', totalSquares(t) === 25);

console.log('\n=== placeKnight at A1 (0,0) ===');
t = placeKnight(t, { file: 0, rank: 0 });
check('knight at A1', t.knightPos.file === 0 && t.knightPos.rank === 0);
check('history has 1', t.history.length === 1);
check('startedAt set', t.startedAt !== null);

console.log('\n=== legal moves from A1 ===');
const legal = getLegalMoves(t);
const labels = legal.map(squareLabel).sort();
check('exactly 2 legal moves', legal.length === 2);
check('moves are B3 and C2', JSON.stringify(labels) === JSON.stringify(['B3','C2']));

console.log('\n=== move to C2 ===');
t = moveKnight(t, { file: 2, rank: 1 });
check('knight now at C2', t.knightPos.file === 2 && t.knightPos.rank === 1);
check('history has 2', t.history.length === 2);
check('A1 still visited', t.visitedIndices.has(0));
check('C2 visited', t.visitedIndices.has(7));

console.log('\n=== illegal move attempt (D2 — too far) ===');
const before = t.history.length;
t = moveKnight(t, { file: 3, rank: 1 });
check('history unchanged after illegal', t.history.length === before);

console.log('\n=== undo ===');
t = undoMove(t);
check('back at A1', t.knightPos.file === 0 && t.knightPos.rank === 0);
check('history has 1 again', t.history.length === 1);

console.log('\n=== Warnsdorff score for B3 from A1 ===');
// From B3 (file 1, rank 2), knight could go to:
// (0,0)=A1 [visited], (2,1)=C2, (3,2)=D3, (3,4)=D5, (2,4)=C5, (0,4)=A5
// Excluding A1 → 5 onward moves
const score = scoreSquare({ file: 1, rank: 2 }, t.visitedIndices, 5);
check(`B3 score = 5 (got ${score})`, score === 5);

console.log('\n=== bestNextMove from A1 ===');
// Both B3 and C2 are equivalent corners. Either should score the same on an empty 5×5.
const best = bestNextMove(getLegalMoves(t), t.visitedIndices, 5);
check('bestNextMove returns a move', best !== null);
check('best is one of {B3, C2}', squareLabel(best) === 'B3' || squareLabel(best) === 'C2');

console.log('\n=== isKnightMove sanity ===');
check('A1 → C2 is a knight move', isKnightMove({file:0,rank:0}, {file:2,rank:1}));
check('A1 → A2 is NOT a knight move', !isKnightMove({file:0,rank:0}, {file:0,rank:1}));

console.log('\n=== Force a stuck on tiny 4×4 ===');
// On 4×4 there are no closed tours and many starts get stuck.
let s = createTour(4);
s = placeKnight(s, { file: 0, rank: 0 });
// From A1 on 4×4, legal: B3=(1,2), C2=(2,1)
let safety = 0;
while (!isComplete(s) && !isStuck(s) && safety++ < 50) {
  const moves = getLegalMoves(s);
  if (moves.length === 0) break;
  s = moveKnight(s, moves[0]); // greedy first move — will get stuck
}
check('terminates (stuck or complete)', isStuck(s) || isComplete(s));

console.log(`\n=== ${passed} passed, ${failed} failed ===`);
process.exit(failed === 0 ? 0 : 1);
