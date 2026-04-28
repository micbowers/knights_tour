// Home screen — wordmark hero, title, board-size picker, Start CTA.

import { renderSizePicker } from '../components/boardSizePicker.js';
import { getState, setPrefs, setScreen, startFreshTour } from '../../core/state.js';
import { unlockAudio } from '../../core/audio.js';

export function renderHome(root) {
  const { prefs } = getState();
  const selected = prefs.lastBoardSize ?? 5;

  root.innerHTML = `
    <header class="sw-hero" style="text-align:center">
      <div class="sw-page">
        <div class="sw-hero-mark"><span class="a">SPARK</span><span class="b">WORKS</span></div>
        <p class="sw-foot-tag" style="margin-top:6px">Think through anything.</p>
      </div>
    </header>

    <main class="sw-page sw-body home">
      <p class="ts-eyebrow home__eyebrow">SECTION 1 · PATTERNS</p>
      <h1 class="ts-display home__title">KNIGHT'S TOUR</h1>
      <p class="ts-quote home__sub">Can you visit every square exactly once?</p>

      <div class="sw-callout sw-callout-purple home__how">
        <p class="ts-label" style="color:var(--sw-purple);margin-bottom:6px">HOW IT WORKS</p>
        <p class="ts-body">
          A knight moves in an L-shape: two squares in one direction, then one square to the side.
          Starting from any square, visit every square exactly once. If you get stuck — that's the point.
          Back up and try a different path.
        </p>
      </div>

      <p class="ts-label home__pick-label">Pick your board</p>
      <div id="size-picker"></div>

      <div class="home__cta-row">
        <button id="start-btn" class="sw-btn sw-btn-primary" disabled>Start Tour</button>
      </div>
    </main>

    <footer class="sw-foot">
      <div class="sw-foot-mark"><span class="a">SPARK</span><span class="b">WORKS</span></div>
      <div class="sw-foot-tag">School teaches content. We train how to think.</div>
    </footer>
  `;

  const pickerEl = root.querySelector('#size-picker');
  const startBtn = root.querySelector('#start-btn');

  let chosen = selected;
  const renderPicker = () => {
    renderSizePicker(pickerEl, {
      selected: chosen,
      onSelect: (size) => {
        chosen = size;
        setPrefs({ lastBoardSize: size });
        startBtn.disabled = false;
        renderPicker();
      },
    });
  };
  renderPicker();

  // If a previous size was chosen, enable Start immediately.
  startBtn.disabled = !chosen;

  startBtn.addEventListener('click', () => {
    unlockAudio();
    startFreshTour(chosen);
    setScreen('play');
  });
}
