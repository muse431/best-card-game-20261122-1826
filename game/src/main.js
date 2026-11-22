// Ember Pact — boot and the duel loop: title → duels I–III → win or loss.
// Owns the state object and wires every button; the rules live in combat.js
// and enemies.js, the drawing in render.js, the sound in audio.js.

import { buildDeck, drawCards } from './deck.js';
import { DUELS, enemyAct, intentFor } from './enemies.js';
import { duelLost, duelWon, playCard, startTurn } from './combat.js';
import { cardById } from './cards.js';
import {
  clearLog, logLine, renderDuel, renderEnd, renderTitle,
  shakeTable, showScreen,
} from './render.js';
import { sfx, toggleMute } from './audio.js';
import { sceneFromUrl, stageScene } from './shots.js';

const $ = (id) => document.getElementById(id);

const state = {
  screen: 'title',
  duelIndex: 0,
  seed: (Date.now() % 2147483647) || 1,
  turn: 1,
  playerLife: 30,
  enemyLife: DUELS[0].enemyLife,
  playerGuard: 0,
  enemyGuard: 0,
  embers: 3,
  deck: [],
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
  onPlayCard: (i) => playFromHand(i),
};

function newDuel(duelIndex) {
  const duel = DUELS[duelIndex];
  state.duelIndex = duelIndex;
  state.turn = 1;
  state.playerLife = 30;
  state.enemyLife = duel.enemyLife;
  state.playerGuard = 0;
  state.enemyGuard = 0;
  state.embers = 0;
  state.deck = buildDeck(state.seed + duelIndex * 7919);
  state.discard = [];
  state.hand = [];
  state.playedThisTurn = [];
  state.playedElements = [];
  state.trinePaid = false;
  state.over = false;
  state.justDealt = true;
  startTurn(state);
  drawCards(state, 5);
  clearLog();
  logLine(state, `${duel.name} — ${duel.flavor}`, '');
  logLine(state, `${duel.enemy} has ${duel.enemyLife} life. Your move.`, 'foe');
  showScreen('duel');
  renderDuel(state);
}

function playFromHand(index) {
  if (state.over || state.screen !== 'duel') return;
  const cardId = state.hand[index];
  const card = cardById(cardId);
  if (!card) return;
  if (card.cost > state.embers) {
    logLine(state, `Not enough embers for ${card.name} (${card.cost} needed).`, 'bad');
    return;
  }
  const result = playCard(state, index);
  if (!result.ok) return;
  state.playedThisTurn.push(cardId);
  if (result.draws > 0) {
    drawCards(state, result.draws);
    sfx.draw();
  }
  if (result.dealt > 0) { sfx.hit(); shakeTable(); }
  else if (card.guard > 0) sfx.guard();
  else sfx.play();
  if (card.ember > 0) sfx.ember();
  logLine(state, `You played ${result.summary}.`, 'you');
  if (result.resonance > 0) logLine(state, `Resonance! Same element twice — +${result.resonance}.`, 'good');
  if (result.trine) logLine(state, 'Trine! Three elements in one turn — draw a card.', 'good');
  renderDuel(state);
  checkDuelEnd();
}

function endTurn() {
  if (state.over || state.screen !== 'duel') return;
  const duel = DUELS[state.duelIndex];
  const intent = intentFor(duel, state.turn);
  sfx.foe();
  const outcome = enemyAct(state, duel, intent);
  logLine(state, outcome.text, 'foe');
  state.turnsPlayed += 1;
  renderDuel(state);
  if (duelLost(state)) return finishDuel(false);
  state.turn += 1;
  state.playedThisTurn = [];
  startTurn(state);
  drawCards(state, 5 - state.hand.length);
  state.justDealt = true;
  logLine(state, `Turn ${state.turn} — ${duel.enemy} ${describeNextIntent(duel, state.turn)}.`, '');
  renderDuel(state);
}

function describeNextIntent(duel, turn) {
  const intent = intentFor(duel, turn);
  return intent.kind === 'attack'
    ? `plans to strike for ${intent.value}`
    : `plans to raise ${intent.value} guard`;
}

function checkDuelEnd() {
  if (duelWon(state)) finishDuel(true);
  else if (duelLost(state)) finishDuel(false);
}

function finishDuel(won) {
  state.over = true;
  const duel = DUELS[state.duelIndex];
  if (won) {
    state.duelsWon += 1;
    logLine(state, `${duel.enemy} falls! Duel won.`, 'good');
    if (state.duelIndex + 1 < DUELS.length) {
      sfx.win();
      setTimeout(() => {
        logLine(state, `On to ${DUELS[state.duelIndex + 1].name}.`, 'good');
        newDuel(state.duelIndex + 1);
      }, 1400);
      renderDuel(state);
      return;
    }
    sfx.fanfare();
    showScreen('win');
    renderEnd(state, true);
  } else {
    sfx.lose();
    showScreen('loss');
    renderEnd(state, false);
  }
}

function backToTitle() {
  state.screen = 'title';
  showScreen('title');
  renderTitle();
}

function bindButtons() {
  $('btn-begin').addEventListener('click', () => {
    state.screen = 'duel';
    state.damageDealt = 0;
    state.duelsWon = 0;
    state.turnsPlayed = 0;
    state.seed = (Date.now() % 2147483647) || 1;
    sfx.play();
    newDuel(0);
  });
  $('btn-end-turn').addEventListener('click', endTurn);
  $('btn-mute').addEventListener('click', () => {
    const muted = toggleMute();
    $('btn-mute').textContent = muted ? 'Sound: Off' : 'Sound: On';
  });
  $('btn-quit').addEventListener('click', backToTitle);
  $('btn-again-win').addEventListener('click', () => {
    state.screen = 'duel';
    state.damageDealt = 0;
    state.duelsWon = 0;
    state.turnsPlayed = 0;
    newDuel(0);
  });
  $('btn-title-win').addEventListener('click', backToTitle);
  $('btn-retry').addEventListener('click', () => {
    state.screen = 'duel';
    newDuel(state.duelIndex);
  });
  $('btn-title-loss').addEventListener('click', backToTitle);

  // Keyboard: 1–5 play a hand card, Space / Enter ends the turn.
  document.addEventListener('keydown', (e) => {
    if (state.screen !== 'duel' || state.over) return;
    if (e.key >= '1' && e.key <= '5') {
      const i = Number(e.key) - 1;
      if (i < state.hand.length) playFromHand(i);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      endTurn();
    }
  });
}

function boot() {
  bindButtons();
  renderTitle();
  const scene = sceneFromUrl();
  if (scene && stageScene(scene)) {
    state.screen = scene === 'title' ? 'title' : scene === 'duel' ? 'duel' : scene;
    return;
  }
  showScreen('title');
}

boot();
