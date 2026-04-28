// Collapsible "Did You Know?" card. Defaults to collapsed; opens on
// click to reveal the fact. Used both in the play side rail (current
// fact = tours-completed-th in deck, modulo length) and on the Done
// screen (next fact unlocks on completion).

import { FACTS, getFact } from '../../data/facts.js';

export function renderFactDeck(container, opts) {
  const { factIndex, expanded = false, onToggle } = opts;
  const fact = getFact(factIndex);
  const total = FACTS.length;

  container.innerHTML = `
    <div class="sw-callout sw-callout-purple fact-deck${expanded ? ' fact-deck--open' : ''}">
      <button class="fact-deck__head" type="button" aria-expanded="${expanded}">
        <p class="ts-label" style="color:var(--sw-purple)">DID YOU KNOW?</p>
        <span class="fact-deck__index">${(factIndex % total) + 1} / ${total}</span>
        <span class="fact-deck__caret">${expanded ? '▾' : '▸'}</span>
      </button>
      <div class="fact-deck__body" hidden="${!expanded}">
        <h3 class="ts-h2 fact-deck__title">${escape(fact.title)}</h3>
        <p class="ts-body">${escape(fact.body)}</p>
      </div>
    </div>
  `;

  // Don't use `hidden` HTML attr correctly with string templating; toggle by class instead.
  const body = container.querySelector('.fact-deck__body');
  if (body) body.hidden = !expanded;

  container.querySelector('.fact-deck__head').addEventListener('click', onToggle);
}

function escape(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
