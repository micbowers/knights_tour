// Modal shown when the knight has no legal moves. Offers Back-up
// 3/6/9 or Restart. Encouragement copy tiers based on how close the
// player got to a complete tour.

export function showStuckOverlay(host, opts) {
  const { onBackUp, onRestart, onDismiss, visited, total } = opts;

  if (host.querySelector('.stuck-overlay')) return;

  const remaining = total - visited;
  const pct = visited / total;

  // Three tiers of copy. The brand voice is "rigorous mentor" — we
  // celebrate progress without gushing.
  let headlineHtml = '';
  let bodyHtml = '';
  if (pct >= 0.9) {
    headlineHtml = `<p class="ts-h2 stuck-overlay__cheer">So close — <strong>${visited} of ${total}</strong> squares.</p>`;
    bodyHtml = `Just ${remaining === 1 ? '1 square' : `${remaining} squares`} short of a complete tour. Where you got stuck tells you which paths to avoid next time. Back up and try a different L.`;
  } else if (pct >= 0.75) {
    headlineHtml = `<p class="ts-h2 stuck-overlay__cheer">Strong run — <strong>${visited} of ${total}</strong> squares.</p>`;
    bodyHtml = `You made it most of the way. Back up to an earlier branch and try a different path.`;
  } else if (pct >= 0.5) {
    headlineHtml = `<p class="ts-h2 stuck-overlay__cheer"><strong>${visited} of ${total}</strong> squares.</p>`;
    bodyHtml = `Halfway there. Stuck means information — back up to where you had options and try the other L.`;
  } else {
    bodyHtml = `You've reached a dead end. Where you got stuck tells you something about which paths don't work. Back up to an earlier branch and try a different L.`;
  }

  const overlay = document.createElement('div');
  overlay.className = 'stuck-overlay';
  overlay.innerHTML = `
    <div class="stuck-overlay__card sw-card">
      <p class="ts-eyebrow" style="color:var(--sw-red)">NO LEGAL MOVES</p>
      ${headlineHtml}
      <p class="ts-body stuck-overlay__body">${bodyHtml}</p>
      <div class="stuck-overlay__actions">
        <button data-back="3" class="sw-btn sw-btn-primary" type="button">Back up 3</button>
        <button data-back="6" class="sw-btn" type="button">Back up 6</button>
        <button data-back="9" class="sw-btn" type="button">Back up 9</button>
        <button id="stuck-restart" class="sw-btn sw-btn-subtle" type="button">Restart</button>
      </div>
    </div>
  `;
  host.appendChild(overlay);

  overlay.querySelectorAll('[data-back]').forEach((el) => {
    el.addEventListener('click', () => {
      const n = parseInt(el.dataset.back, 10);
      onBackUp(n);
      cleanup();
    });
  });
  overlay.querySelector('#stuck-restart').addEventListener('click', () => { onRestart(); cleanup(); });

  function onKey(e) {
    if (e.key === 'Escape') { onDismiss && onDismiss(); cleanup(); }
  }
  document.addEventListener('keydown', onKey);

  function cleanup() {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  }
}

export function dismissStuckOverlay(host) {
  const o = host.querySelector('.stuck-overlay');
  if (o) o.remove();
}
