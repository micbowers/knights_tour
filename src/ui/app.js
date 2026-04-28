// Top-level app router. Subscribes to state changes; re-renders the
// current screen when state.screen changes (and on initial mount).

import { renderHome } from './screens/home.js';
import { renderPlay } from './screens/play.js';
import { renderDone } from './screens/soloDone.js';
import { getState, loadState, subscribe } from '../core/state.js';
import { setMutedGetter } from '../core/audio.js';

let lastScreen = null;

export function mountApp(root) {
  // Wire audio's muted check to state.prefs.soundOn.
  setMutedGetter(() => !getState().prefs.soundOn);

  loadState();

  const render = () => {
    const screen = getState().screen;
    // Only re-render the shell if the screen changed. In-screen updates
    // re-render their own panes via the screen's local rerender().
    if (screen === lastScreen) return;
    lastScreen = screen;
    switch (screen) {
      case 'home': renderHome(root); break;
      case 'play': renderPlay(root); break;
      case 'done': renderDone(root); break;
      default:     renderHome(root);
    }
  };

  subscribe(() => render());
  render();
}
