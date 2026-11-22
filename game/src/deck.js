// Ember Pact — deck, draw pile and discard pile.
// A duel deck is two copies of every card in the catalogue (48 cards),
// shuffled with a seeded shuffle so a staged screenshot is repeatable.

import { CARDS } from './cards.js';

export function buildDeck(seed) {
  const ids = [];
  for (const card of CARDS) {
    ids.push(card.id, card.id);
  }
  return shuffle(ids, seed);
}

// Mulberry32: a tiny deterministic PRNG, so ?scene= shots always deal the same hand.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(list, seed) {
  const rand = mulberry32(seed);
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = out[i]; out[i] = out[j]; out[j] = tmp;
  }
  return out;
}

export function drawCards(state, count) {
  for (let i = 0; i < count; i++) {
    if (state.deck.length === 0) {
      if (state.discard.length === 0) break;
      state.deck = shuffle(state.discard, (state.seed ^ state.turn) >>> 0);
      state.discard = [];
    }
    state.hand.push(state.deck.pop());
  }
}

export function handSize(state) {
  return state.hand.length;
}
