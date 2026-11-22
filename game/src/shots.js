// Ember Pact — deterministic staging for screenshots.
// ?scene=title | duel | win | loss builds one exact frame from the game's
// own code and state, so every screenshot is a real render, never a mock.
// The duel scene uses a fixed seed, so the same hand is dealt every time.

import { buildDeck, drawCards } from './deck.js';
import { DUELS } from './enemies.js';
import { logLine, renderDuel, renderEnd, renderTitle, showScreen } from './render.js';

export function sceneFromUrl() {
  const q = new URLSearchParams(window.location.search);
  return q.get('scene') || '';
}

function freshState(duelIndex, seed) {
  return {
    screen: 'duel',
    duelIndex,
    seed,
    turn: 1,
    playerLife: 30,
    enemyLife: DUELS[duelIndex].enemyLife,
    playerGuard: 0,
    enemyGuard: 0,
    embers: 3,
    deck: buildDeck(seed),
    discard: [],
    hand: [],
    playedThisTurn: [],
    playedElements: [],
    trinePaid: false,
    damageDealt: 0,
    duelsWon: 0,
    turnsPlayed: 0,
    over: false,
    justDealt: false,
    onPlayCard: () => {},
  };
}

// Title: the front door of the game.
export function stageTitle() {
  showScreen('title');
  renderTitle();
}

// A mid-duel frame: Duel II, turn 3, a full hand, two cards already played,
// the enemy's intent on show, both life totals dented, the log telling the story.
export function stageDuel() {
  const state = freshState(1, 20261122);
  state.turn = 3;
  state.playerLife = 22;
  state.enemyLife = 23;
  state.playerGuard = 5;
  state.enemyGuard = 0;
  state.embers = 4;
  state.damageDealt = 19;
  state.duelsWon = 1;
  state.turnsPlayed = 5;
  state.playedThisTurn = ['undertow', 'ember-fan'];
  state.playedElements = ['tide', 'flame'];
  drawCards(state, 5);
  // The two played cards are already in the discard pile.
  state.discard = ['undertow', 'ember-fan'];
  state.deck = state.deck.slice(2);
  showScreen('duel');
  renderDuel(state);
  logLine(state, 'Turn 3 — Tidecaller Mara stares you down.', '');
  logLine(state, 'You played Undertow: deals 5 damage, gains 5 guard.', 'you');
  logLine(state, 'Ember Fan: deals 2 damage, gains 1 ember. Resonance +2!', 'you');
  logLine(state, 'Mara raised 10 guard last turn. It is spent now.', 'foe');
}

// The win screen, after all three duels.
export function stageWin() {
  const state = freshState(2, 7);
  state.damageDealt = 96;
  state.duelsWon = 3;
  state.turnsPlayed = 14;
  showScreen('win');
  renderEnd(state, true);
}

// The loss screen, after falling to the Ember Queen.
export function stageLoss() {
  const state = freshState(2, 7);
  state.playerLife = 0;
  state.damageDealt = 61;
  state.duelsWon = 2;
  state.turnsPlayed = 11;
  showScreen('loss');
  renderEnd(state, false);
}

export function stageScene(scene) {
  if (scene === 'title') { stageTitle(); return true; }
  if (scene === 'duel') { stageDuel(); return true; }
  if (scene === 'win') { stageWin(); return true; }
  if (scene === 'loss') { stageLoss(); return true; }
  return false;
}
