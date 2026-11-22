// Ember Pact — combat resolution: playing a card, Resonance, Trine,
// and what a turn costs. All numbers live here, so the rules are in one place.

import { cardById } from './cards.js';

// Resonance: the second card of an element played in a turn hits +2.
// It boosts the card's attack, or its guard when the card has no attack.
// Trine: three different elements played in one turn draws a card.
export function playCard(state, handIndex) {
  const cardId = state.hand[handIndex];
  const card = cardById(cardId);
  if (!card) return { ok: false, why: 'no such card' };
  if (card.cost > state.embers) return { ok: false, why: 'not enough embers' };

  state.embers -= card.cost;
  state.hand.splice(handIndex, 1);
  state.discard.push(cardId);

  const sameElementPlayed = state.playedElements.includes(card.element);
  const resonance = sameElementPlayed ? 2 : 0;
  if (!sameElementPlayed) state.playedElements.push(card.element);

  const atk = card.atk + (card.atk > 0 ? resonance : 0);
  const guard = card.guard + (card.guard > 0 && card.atk === 0 ? resonance : 0);

  let dealt = 0;
  let blockedNote = '';
  if (atk > 0) {
    const blocked = Math.min(state.enemyGuard, atk);
    dealt = atk - blocked;
    state.enemyGuard -= blocked;
    state.enemyLife -= dealt;
    state.damageDealt += dealt;
    if (blocked > 0) blockedNote = ` (${blocked} soaked by guard)`;
  }
  if (guard > 0) state.playerGuard += guard;
  if (card.ember > 0) state.embers = Math.min(9, state.embers + card.ember);

  let draws = card.draw;
  const trine = state.playedElements.length >= 3 && !state.trinePaid;
  if (trine) {
    state.trinePaid = true;
    draws += 1;
  }

  const bits = [];
  if (atk > 0) bits.push(`deals ${atk} damage${blockedNote}`);
  if (guard > 0) bits.push(`gains ${guard} guard`);
  if (card.ember > 0) bits.push(`gains ${card.ember} ember${card.ember > 1 ? 's' : ''}`);
  if (card.draw > 0) bits.push(`draws ${card.draw}`);
  if (resonance > 0) bits.push(`Resonance +${resonance}`);
  if (trine) bits.push('Trine! draws 1 more');

  return {
    ok: true,
    card,
    resonance,
    trine,
    dealt,
    draws,
    summary: `${card.name} ${bits.join(' · ')}`,
  };
}

// Start a fresh turn: the player's guard fades, embers refill, hand tops up.
// The enemy's guard stays: it was raised to block this turn's attacks, and
// only expires when the enemy acts again (see enemyAct).
export function startTurn(state) {
  state.playerGuard = 0;
  state.embers = Math.min(9, state.embers + 3);
  state.playedElements = [];
  state.trinePaid = false;
  state.playedThisTurn = [];
  return state;
}

export function duelWon(state) {
  return state.enemyLife <= 0;
}

export function duelLost(state) {
  return state.playerLife <= 0;
}

// Score: damage dealt plus a bonus per duel won, so a fast win scores higher.
export function scoreFor(state) {
  return state.damageDealt + state.duelsWon * 50 + state.turnsPlayed * 0;
}
