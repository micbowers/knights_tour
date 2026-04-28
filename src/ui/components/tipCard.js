// Rotating tip card. Single tip displayed; user taps "↻" to shuffle,
// or auto-rotates every 30 seconds. The screen owns the index state
// and re-calls render after rotating.

import { TIPS } from '../../data/tips.js';

export function renderTipCard(container, opts) {
  const { index, onShuffle } = opts;
  const tip = TIPS[index % TIPS.length];

  container.innerHTML = `
    <div class="sw-callout sw-callout-purple tip-card">
      <div class="tip-card__head">
        <p class="ts-label" style="color:var(--sw-purple)">TIP</p>
        <button id="tip-shuffle" class="tip-card__shuffle" type="button" aria-label="Show another tip">↻</button>
      </div>
      <p class="ts-body tip-card__body">${escape(tip)}</p>
    </div>
  `;

  container.querySelector('#tip-shuffle').addEventListener('click', onShuffle);
}

function escape(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
