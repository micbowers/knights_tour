// "MOVE 14 / 25" pill using the brand label type.

import { totalSquares, moveCount } from '../../core/engine.js';

export function moveCounterHtml(tour) {
  const cur = moveCount(tour);
  const total = totalSquares(tour);
  return `
    <div class="move-counter">
      <span class="ts-label move-counter__label">Move</span>
      <span class="move-counter__num"><strong>${cur}</strong> / ${total}</span>
    </div>
  `;
}
