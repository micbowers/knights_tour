// Renders an N×N chessboard with file/rank labels, the knight piece,
// numbered visited squares, and an SVG trail overlay. Click handler is
// passed in — the screen wires it to engine actions. Hint highlighting
// is added in Phase C; for now the board accepts a `legalMoves` array
// to optionally glow valid squares.

import { knightSvg } from './knightSvg.js';
import { fileLabel, rankLabel, squareToIndex } from '../../core/board.js';
import { moveNumberFor, getLegalMoves } from '../../core/engine.js';

// Render the board into `container`. `opts`:
//   tour:               Tour from engine
//   onSquareClick(sq):  callback when a square is clicked
//   highlightLegal:     bool — glow valid moves (hint tier 1)
//   legalCounts:        Map<idx,count> | null — show Warnsdorff count chip
//                       on each legal square (hint tier 2). When set,
//                       implies highlightLegal.
//   highlightedSquare:  square|null — extra emphasis (hint button pulse)
export function renderBoard(container, opts) {
  const {
    tour, onSquareClick,
    highlightLegal = false,
    legalCounts = null,
    highlightedSquare = null,
  } = opts;
  const { size } = tour;

  const showLegal = highlightLegal || legalCounts !== null;
  let legalSet = null;
  if (showLegal && tour.knightPos) {
    legalSet = new Set(getLegalMoves(tour).map((sq) => squareToIndex(sq, size)));
  }

  let html = `<div class="board-wrap" style="--size:${size}">`;
  html += renderRankLabels(size);
  html += `<div class="board-area">`;
  html += `<div class="board-grid" role="grid" aria-label="${size} by ${size} chessboard">`;

  // Render top row first (rank = size-1) down to rank = 0.
  for (let rank = size - 1; rank >= 0; rank--) {
    for (let file = 0; file < size; file++) {
      const idx = rank * size + file;
      const isLight = (file + rank) % 2 === 1;
      const isVisited = tour.visitedIndices.has(idx);
      const isCurrent = tour.knightPos && tour.knightPos.file === file && tour.knightPos.rank === rank;
      const isLegal = legalSet ? legalSet.has(idx) : false;
      const isHighlighted = highlightedSquare && highlightedSquare.file === file && highlightedSquare.rank === rank;
      const num = isVisited ? moveNumberFor(tour, { file, rank }) : null;

      const cls = [
        'board-sq',
        isLight ? 'board-sq--light' : 'board-sq--dark',
        isVisited ? 'board-sq--visited' : '',
        isCurrent ? 'board-sq--current' : '',
        isLegal ? 'board-sq--legal' : '',
        isHighlighted ? 'board-sq--hint' : '',
      ].filter(Boolean).join(' ');

      const label = `${fileLabel(file)}${rankLabel(rank)}`;
      const count = (isLegal && legalCounts) ? legalCounts.get(idx) : null;
      const ariaExtra = isVisited ? `, move ${num}` : (count !== null ? `, ${count} onward moves` : '');
      html += `<button type="button" class="${cls}" data-file="${file}" data-rank="${rank}" aria-label="${label}${ariaExtra}" role="gridcell">`;
      if (isCurrent) {
        html += `<span class="board-sq__knight">${knightSvg()}</span>`;
        if (num !== null) html += `<span class="board-sq__num board-sq__num--current">${num}</span>`;
      } else if (num !== null) {
        html += `<span class="board-sq__num">${num}</span>`;
      } else if (count !== null) {
        html += `<span class="board-sq__count">${count}</span>`;
      }
      html += `</button>`;
    }
  }
  html += `</div>`; // close .board-grid
  html += renderTrailOverlay(tour);
  html += `</div>`; // close .board-area
  html += renderFileLabels(size);
  html += `</div>`; // close .board-wrap

  container.innerHTML = html;

  container.querySelectorAll('.board-sq').forEach((el) => {
    el.addEventListener('click', () => {
      const file = parseInt(el.dataset.file, 10);
      const rank = parseInt(el.dataset.rank, 10);
      onSquareClick({ file, rank });
    });
  });
}

function renderRankLabels(size) {
  let html = `<div class="board-ranks" aria-hidden="true">`;
  for (let rank = size - 1; rank >= 0; rank--) {
    html += `<span class="board-rank">${rankLabel(rank)}</span>`;
  }
  html += `</div>`;
  return html;
}

function renderFileLabels(size) {
  let html = `<div class="board-files" aria-hidden="true">`;
  for (let file = 0; file < size; file++) {
    html += `<span class="board-file">${fileLabel(file)}</span>`;
  }
  html += `</div>`;
  return html;
}

// SVG overlay drawing connector lines between visited squares 1 → 2 → 3 → ...
// Uses percentage coords so it scales with the board.
function renderTrailOverlay(tour) {
  if (tour.history.length < 2) return '';
  const n = tour.size;
  const points = tour.history.map((sq) => {
    const x = ((sq.file + 0.5) / n) * 100;
    const y = ((n - 1 - sq.rank + 0.5) / n) * 100;
    return `${x.toFixed(3)},${y.toFixed(3)}`;
  }).join(' ');
  return `
    <svg class="board-trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polyline points="${points}" fill="none" stroke="#1E2530" stroke-width="0.5" stroke-linejoin="round" stroke-linecap="round" opacity="0.45"/>
    </svg>
  `;
}
