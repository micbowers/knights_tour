// Play screen — board + counter + controls + side rail (hints, tip, fact).
// Stuck overlay slides in when no legal moves remain.

import { renderBoard } from '../components/board.js';
import { moveCounterHtml } from '../components/moveCounter.js';
import { renderHintControls } from '../components/hintControls.js';
import { renderTipCard } from '../components/tipCard.js';
import { renderFactDeck } from '../components/factDeck.js';
import { showStuckOverlay, dismissStuckOverlay } from '../components/stuckOverlay.js';
import {
  placeKnight, moveKnight, undoMove, backUp,
  isComplete, isStuck, isPlaced, isLegalMove, isLegalPlacement,
} from '../../core/engine.js';
import { suggestBestMove, legalMoveCounts, HINT_BUDGET } from '../../core/hints.js';
import {
  getState, setTour, setScreen, setPrefs, bumpStat, startFreshTour,
} from '../../core/state.js';
import { playSFX } from '../../core/audio.js';
import { TIPS } from '../../data/tips.js';

const TIP_ROTATE_MS = 30000;

export function renderPlay(root) {
  // Per-screen ephemeral state.
  let tipIndex = Math.floor(Math.random() * TIPS.length);
  let factExpanded = true; // Default open — kids should see the cool facts.
  let highlightedSquare = null;     // briefly set when "Hint" pressed
  let highlightTimer = null;
  let tipTimer = null;

  root.innerHTML = `
    <header class="play-header">
      <a class="play-header__brand sw-hero-mark sw-mark-link" href="https://www.sparkworks.kids" target="_blank" rel="noopener">
        <span class="a">SPARK</span><span class="b">WORKS</span>
      </a>
      <div id="move-counter-slot"></div>
      <button id="quit-btn" class="sw-btn sw-btn-subtle" type="button">Home</button>
    </header>

    <main class="play-main">
      <section class="play-board-pane">
        <div id="board-slot"></div>
        <div class="play-controls">
          <button id="undo-btn" class="sw-btn" type="button">Undo</button>
          <button id="restart-btn" class="sw-btn" type="button">Restart</button>
          <button id="sound-btn" class="sw-btn sw-btn-subtle" type="button" aria-pressed="true">Sound: on</button>
        </div>
        <p class="ts-caption play-hint">Click a square to place the knight.</p>
      </section>

      <aside class="play-rail">
        <div id="hint-slot"></div>
        <div id="tip-slot"></div>
        <div id="fact-slot"></div>
      </aside>
    </main>
  `;

  const boardSlot = root.querySelector('#board-slot');
  const counterSlot = root.querySelector('#move-counter-slot');
  const hintSlot = root.querySelector('#hint-slot');
  const tipSlot = root.querySelector('#tip-slot');
  const factSlot = root.querySelector('#fact-slot');
  const undoBtn = root.querySelector('#undo-btn');
  const restartBtn = root.querySelector('#restart-btn');
  const quitBtn = root.querySelector('#quit-btn');
  const soundBtn = root.querySelector('#sound-btn');
  const playHint = root.querySelector('.play-hint');
  const mainEl = root.querySelector('.play-main');

  function rerender() {
    const { tour, prefs, stats } = getState();
    const tier = prefs.hintTier;
    const counts = (tier === 2 && tour.knightPos) ? legalMoveCounts(tour) : null;

    renderBoard(boardSlot, {
      tour,
      onSquareClick: handleSquareClick,
      highlightLegal: tier >= 1,
      legalCounts: counts,
      highlightedSquare,
    });
    counterSlot.innerHTML = moveCounterHtml(tour);
    undoBtn.disabled = tour.history.length === 0;

    renderHintControls(hintSlot, {
      tier,
      onTierChange: (t) => { setPrefs({ hintTier: t }); rerender(); },
      hintsUsed: stats.hintsUsed,
      hintEnabled: isPlaced(tour) && !isComplete(tour),
      onHintRequest: handleHintRequest,
    });
    renderTipCard(tipSlot, {
      index: tipIndex,
      onShuffle: () => { tipIndex = (tipIndex + 1) % TIPS.length; rerender(); },
    });
    renderFactDeck(factSlot, {
      factIndex: stats.toursCompleted,
      expanded: factExpanded,
      onToggle: () => { factExpanded = !factExpanded; rerender(); },
    });

    soundBtn.textContent = prefs.soundOn ? 'Sound: on' : 'Sound: off';
    soundBtn.setAttribute('aria-pressed', String(prefs.soundOn));

    if (!isPlaced(tour)) {
      playHint.textContent = 'Click any square to place the knight.';
    } else if (isComplete(tour)) {
      playHint.textContent = 'Tour complete!';
    } else if (isStuck(tour)) {
      playHint.textContent = "No legal moves. Use the buttons below or the popup to back up.";
      // Trigger the overlay once per stuck-state entry.
      showStuckOverlay(mainEl, {
        visited: tour.history.length,
        total: tour.size * tour.size,
        onBackUp: (n) => { setTour(backUp(getState().tour, n)); rerender(); },
        onRestart: () => { startFreshTour(getState().tour.size); rerender(); },
        onDismiss: () => {},
      });
    } else {
      playHint.textContent = 'Click any glowing square to keep going.';
      dismissStuckOverlay(mainEl);
    }
  }

  function handleSquareClick(square) {
    const { tour } = getState();
    if (isComplete(tour)) return;

    if (!isPlaced(tour)) {
      if (!isLegalPlacement(tour, square)) return;
      setTour(placeKnight(tour, square));
      playSFX('move');
      rerender();
      return;
    }

    if (!isLegalMove(tour, square)) {
      playSFX('illegal');
      flashIllegal(square);
      return;
    }

    const next = moveKnight(tour, square);
    setTour(next);

    if (isComplete(next)) {
      playSFX('tour-complete');
      bumpStat('toursCompleted');
      setTimeout(() => setScreen('done'), 500);
      rerender();
      return;
    }

    if (isStuck(next)) playSFX('stuck');
    else playSFX('move');
    rerender();
  }

  function handleHintRequest() {
    const { tour, stats } = getState();
    if (!isPlaced(tour) || isComplete(tour)) return;
    if (stats.hintsUsed >= HINT_BUDGET) return;
    const best = suggestBestMove(tour);
    if (!best) return;
    bumpStat('hintsUsed');
    playSFX('hint');
    highlightedSquare = best;
    if (highlightTimer) clearTimeout(highlightTimer);
    highlightTimer = setTimeout(() => {
      highlightedSquare = null;
      if (getState().screen === 'play') rerender();
    }, 1800);
    rerender();
  }

  function flashIllegal(square) {
    const sel = `.board-sq[data-file="${square.file}"][data-rank="${square.rank}"]`;
    const el = boardSlot.querySelector(sel);
    if (!el) return;
    el.classList.add('board-sq--shake');
    setTimeout(() => el.classList.remove('board-sq--shake'), 350);
  }

  undoBtn.addEventListener('click', () => {
    const { tour } = getState();
    if (tour.history.length === 0) return;
    setTour(undoMove(tour));
    bumpStat('undosUsed');
    rerender();
  });

  restartBtn.addEventListener('click', () => {
    const { tour } = getState();
    startFreshTour(tour.size);
    rerender();
  });

  quitBtn.addEventListener('click', () => {
    if (tipTimer) clearInterval(tipTimer);
    setScreen('home');
  });

  soundBtn.addEventListener('click', () => {
    setPrefs({ soundOn: !getState().prefs.soundOn });
    rerender();
  });

  // Auto-rotate the tip every 30 seconds. Self-cleans when the user
  // leaves the play screen (interval keeps firing otherwise).
  tipTimer = setInterval(() => {
    if (getState().screen !== 'play') {
      clearInterval(tipTimer);
      return;
    }
    tipIndex = (tipIndex + 1) % TIPS.length;
    rerender();
  }, TIP_ROTATE_MS);

  rerender();
}
