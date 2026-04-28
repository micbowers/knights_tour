// Hint controls panel: tier picker (Off / Show valid moves / Show counts)
// + one-shot "Hint" button with a 3-pip budget indicator.

import { HINT_TIERS, HINT_BUDGET } from '../../core/hints.js';

export function renderHintControls(container, opts) {
  const { tier, onTierChange, hintsUsed, onHintRequest, hintEnabled } = opts;
  const remaining = Math.max(0, HINT_BUDGET - hintsUsed);

  let tierHtml = '';
  for (const t of HINT_TIERS) {
    const checked = t.value === tier ? 'checked' : '';
    tierHtml += `
      <label class="hint-tier">
        <input type="radio" name="hint-tier" value="${t.value}" ${checked}>
        <span class="hint-tier__label">${t.label}</span>
      </label>
    `;
  }

  let pipsHtml = '';
  for (let i = 0; i < HINT_BUDGET; i++) {
    pipsHtml += `<span class="hint-pip${i < remaining ? '' : ' hint-pip--used'}"></span>`;
  }

  container.innerHTML = `
    <div class="sw-callout sw-callout-purple hint-controls">
      <p class="ts-label" style="color:var(--sw-purple);margin-bottom:8px">HINTS</p>
      <div class="hint-tiers">${tierHtml}</div>
      <p class="ts-caption hint-controls__help">${HINT_TIERS[tier]?.help ?? ''}</p>
      <div class="hint-controls__btn-row">
        <button id="hint-btn" class="sw-btn" type="button" ${(!hintEnabled || remaining === 0) ? 'disabled' : ''}>
          Give me a hint
        </button>
        <span class="hint-pips" aria-label="${remaining} hints left">${pipsHtml}</span>
      </div>
    </div>
  `;

  container.querySelectorAll('input[name="hint-tier"]').forEach((el) => {
    el.addEventListener('change', () => {
      const v = parseInt(el.value, 10);
      onTierChange(v);
    });
  });

  const btn = container.querySelector('#hint-btn');
  btn?.addEventListener('click', () => {
    if (btn.disabled) return;
    onHintRequest();
  });
}
