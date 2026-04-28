// Done screen — two-column layout so the celebration (board + trail
// animation) sits beside the actionable stats, fact reveal, and CTAs.
// User can see everything in one viewport without scrolling.

import { renderBoard } from '../components/board.js';
import { renderFactDeck } from '../components/factDeck.js';
import { isClosedTour, totalSquares } from '../../core/engine.js';
import { getState, setScreen, startFreshTour } from '../../core/state.js';

const NEXT_SIZE = { 5: 6, 6: 7, 7: 8, 8: 8 };

export function renderDone(root) {
  const { tour, stats } = getState();
  const closed = isClosedTour(tour);
  const total = totalSquares(tour);
  const elapsed = tour.completedAt && tour.startedAt
    ? Math.round((tour.completedAt - tour.startedAt) / 1000)
    : null;

  // Player just completed their toursCompleted-th tour, so they unlock fact[toursCompleted - 1].
  const factIndex = Math.max(0, stats.toursCompleted - 1);

  root.innerHTML = `
    <header class="play-header">
      <a class="play-header__brand sw-hero-mark sw-mark-link" href="https://www.sparkworks.kids" target="_blank" rel="noopener">
        <span class="a">SPARK</span><span class="b">WORKS</span>
      </a>
      <p class="ts-eyebrow done__header-eyebrow">${closed ? 'CLOSED TOUR ✦' : 'TOUR COMPLETE'}</p>
      <span class="done__header-spacer"></span>
    </header>

    <main class="done-main">
      <section class="done-board-pane">
        <h1 class="ts-h1 done__title">${closed ? 'You closed the loop.' : 'You did it.'}</h1>
        <p class="ts-quote done__sub">All ${total} squares visited.</p>
        <div class="done__board" id="done-board"></div>
        <div class="done__stats sw-card">
          <div class="done__stat">
            <span class="ts-label">Board</span>
            <span class="ts-h2">${tour.size} × ${tour.size}</span>
          </div>
          <div class="done__stat">
            <span class="ts-label">Time</span>
            <span class="ts-h2">${elapsed !== null ? `${elapsed}s` : '—'}</span>
          </div>
          <div class="done__stat">
            <span class="ts-label">Undos</span>
            <span class="ts-h2">${stats.undosUsed}</span>
          </div>
          <div class="done__stat">
            <span class="ts-label">Hints</span>
            <span class="ts-h2">${stats.hintsUsed}</span>
          </div>
        </div>
      </section>

      <aside class="done-rail">
        <div id="done-fact"></div>
        <div class="done__cta-row">
          <button id="next-size-btn" class="sw-btn sw-btn-primary" type="button">
            ${tour.size < 8 ? `Try ${NEXT_SIZE[tour.size]} × ${NEXT_SIZE[tour.size]}` : 'Same board again'}
          </button>
          ${tour.size < 8 ? `<button id="same-btn" class="sw-btn" type="button">Same board again</button>` : ''}
          <button id="home-btn" class="sw-btn" type="button">Pick a different board</button>
        </div>
      </aside>
    </main>
  `;

  const boardSlot = root.querySelector('#done-board');
  renderBoard(boardSlot, {
    tour,
    onSquareClick: () => {},
    highlightLegal: false,
  });

  // Compute polyline length so the trail draw-in animation works across all board sizes.
  const polyline = boardSlot.querySelector('.board-trail polyline');
  if (polyline) {
    try {
      const len = polyline.getTotalLength();
      polyline.style.setProperty('--len', String(Math.ceil(len)));
    } catch {
      /* fallback in CSS */
    }
  }

  // Fact reveal — expanded by default so the new fact reads as a reward.
  let factOpen = true;
  const factSlot = root.querySelector('#done-fact');
  const renderFact = () => {
    renderFactDeck(factSlot, {
      factIndex,
      expanded: factOpen,
      onToggle: () => { factOpen = !factOpen; renderFact(); },
    });
  };
  renderFact();

  root.querySelector('#next-size-btn').addEventListener('click', () => {
    const next = tour.size < 8 ? NEXT_SIZE[tour.size] : tour.size;
    startFreshTour(next);
    setScreen('play');
  });

  const sameBtn = root.querySelector('#same-btn');
  if (sameBtn) {
    sameBtn.addEventListener('click', () => {
      startFreshTour(tour.size);
      setScreen('play');
    });
  }

  root.querySelector('#home-btn').addEventListener('click', () => {
    setScreen('home');
  });
}
