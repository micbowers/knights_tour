// Four selectable cards: 5×5, 6×6, 7×7, 8×8. Each shows a tiny preview
// grid + difficulty word. Emits onSelect(size).

const SIZES = [
  { size: 5, label: 'Warm-up', squares: 25 },
  { size: 6, label: 'Steady',  squares: 36 },
  { size: 7, label: 'Tricky',  squares: 49 },
  { size: 8, label: 'Master',  squares: 64 },
];

export function renderSizePicker(container, opts) {
  const { selected, onSelect } = opts;
  let html = `<div class="size-picker">`;
  for (const item of SIZES) {
    const isSel = item.size === selected;
    html += `
      <button type="button"
              class="size-picker__card${isSel ? ' size-picker__card--selected' : ''}"
              data-size="${item.size}"
              aria-pressed="${isSel}"
              aria-label="${item.size} by ${item.size} board, ${item.label}, ${item.squares} squares">
        ${miniGrid(item.size)}
        <span class="size-picker__dim">${item.size}×${item.size}</span>
        <span class="size-picker__diff">${item.label}</span>
        <span class="size-picker__sq">${item.squares} squares</span>
      </button>
    `;
  }
  html += `</div>`;
  container.innerHTML = html;

  container.querySelectorAll('.size-picker__card').forEach((el) => {
    el.addEventListener('click', () => {
      const size = parseInt(el.dataset.size, 10);
      onSelect(size);
    });
  });
}

function miniGrid(n) {
  let html = `<svg class="size-picker__mini" viewBox="0 0 ${n} ${n}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">`;
  for (let r = 0; r < n; r++) {
    for (let f = 0; f < n; f++) {
      const isLight = (f + r) % 2 === 1;
      const fill = isLight ? '#F2EFE8' : '#FFFFFF';
      html += `<rect x="${f}" y="${r}" width="1" height="1" fill="${fill}" stroke="#1E2530" stroke-width="0.04"/>`;
    }
  }
  html += `</svg>`;
  return html;
}
