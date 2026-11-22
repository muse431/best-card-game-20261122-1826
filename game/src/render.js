// Ember Pact — everything the player sees: the table, the hands, the cards,
// the life bars, the log. Rendering is plain DOM so every card stays crisp
// and clickable, and CSS transitions give the deal, the play and the hit
// their weight. Nothing here knows the rules; it only shows the state.

import { ELEMENTS, cardById, describeCard } from './cards.js';
import { DUELS, describeIntent, intentFor } from './enemies.js';

const $ = (id) => document.getElementById(id);

export function showScreen(name) {
  for (const id of ['screen-title', 'screen-duel', 'screen-win', 'screen-loss']) {
    $(id).classList.toggle('hidden', id !== `screen-${name}`);
  }
}

// ---------- title ----------
export function renderTitle() {
  const list = $('duel-list');
  list.innerHTML = '';
  for (const duel of DUELS) {
    const chip = document.createElement('div');
    chip.className = 'duel-chip';
    const num = document.createElement('div');
    num.className = 'd-num';
    num.textContent = duel.short.toUpperCase();
    const name = document.createElement('div');
    name.className = 'd-name';
    name.textContent = `${duel.enemyGlyph} ${duel.enemy}`;
    const desc = document.createElement('div');
    desc.className = 'd-desc';
    desc.textContent = duel.flavor;
    chip.append(num, name, desc);
    list.appendChild(chip);
  }
}

// ---------- one card ----------
export function cardElement(cardId, opts = {}) {
  const card = cardById(cardId);
  const el = ELEMENTS[card.element];
  const node = document.createElement('div');
  node.className = `card el-${card.element}`;
  if (opts.played) node.classList.add('played');
  if (opts.dealt) node.classList.add('dealt');

  const cost = document.createElement('div');
  cost.className = 'cost';
  cost.textContent = card.cost;

  const glyph = document.createElement('div');
  glyph.className = 'elem';
  glyph.textContent = el.glyph;

  const elemName = document.createElement('div');
  elemName.className = 'elem-name';
  elemName.textContent = el.name;

  const art = document.createElement('div');
  art.className = 'art';
  art.textContent = card.glyph;

  const name = document.createElement('div');
  name.className = 'card-name';
  name.textContent = card.name;

  const text = document.createElement('div');
  text.className = 'card-text';
  text.textContent = card.text;

  const stats = document.createElement('div');
  stats.className = 'card-stats';
  if (card.atk) stats.appendChild(statBadge('atk', `⚔ ${card.atk}`));
  if (card.guard) stats.appendChild(statBadge('grd', `🛡 ${card.guard}`));
  if (card.ember) stats.appendChild(statBadge('emb', `+${card.ember} ember`));
  if (card.draw) stats.appendChild(statBadge('drw', `Draw ${card.draw}`));
  if (!card.atk && !card.guard && !card.ember && !card.draw) {
    stats.appendChild(statBadge('drw', describeCard(card)));
  }

  node.append(cost, glyph, elemName, art, name, text, stats);
  return node;
}

function statBadge(kind, label) {
  const s = document.createElement('span');
  s.className = `stat ${kind}`;
  s.textContent = label;
  return s;
}

// ---------- the duel table ----------
export function renderDuel(state) {
  const duel = DUELS[state.duelIndex];
  $('hud-duel-name').textContent = duel.name;
  $('hud-turn').textContent = `Turn ${state.turn}`;
  $('hud-score').textContent = `Score ${state.damageDealt + state.duelsWon * 50}`;
  $('hud-deck').textContent = `Deck ${state.deck.length}`;
  $('hud-discard').textContent = `Discard ${state.discard.length}`;

  // Enemy side
  $('enemy-portrait').textContent = duel.enemyGlyph;
  $('enemy-name').textContent = duel.enemy;
  setLife('enemy', state.enemyLife, duel.enemyLife);
  setGuard('enemy', state.enemyGuard);
  const intent = intentFor(duel, state.turn);
  $('enemy-intent').textContent = `${duel.enemy} ${describeIntent(intent)}.`;
  renderMiniHand($('enemy-hand'), duel.enemyHandSize);

  // Player side
  setLife('player', state.playerLife, 30);
  setGuard('player', state.playerGuard);
  renderEmbers(state.embers);
  $('btn-end-turn').disabled = state.over;

  // Hand
  const hand = $('player-hand');
  hand.innerHTML = '';
  state.hand.forEach((cardId, i) => {
    const card = cardById(cardId);
    const node = cardElement(cardId, { dealt: state.justDealt });
    if (card.cost > state.embers || state.over) node.classList.add('unaffordable');
    else node.classList.add('playable');
    node.addEventListener('click', () => state.onPlayCard(i));
    hand.appendChild(node);
  });
  state.justDealt = false;

  // Played this turn
  const zone = $('played-zone');
  zone.innerHTML = '';
  if (state.playedThisTurn.length === 0) {
    const note = document.createElement('div');
    note.className = 'empty-note';
    note.textContent = 'Your played cards land here.';
    zone.appendChild(note);
  } else {
    for (const cardId of state.playedThisTurn) {
      zone.appendChild(cardElement(cardId, { played: true }));
    }
  }
}

function setLife(who, life, max) {
  const fill = $(`${who}-life-fill`);
  const text = $(`${who}-life-text`);
  const shown = Math.max(0, life);
  fill.style.width = `${Math.max(0, Math.min(100, (shown / max) * 100))}%`;
  text.textContent = `${shown} / ${max}`;
}

function setGuard(who, guard) {
  const badge = $(`${who}-guard`);
  badge.classList.toggle('hidden', guard <= 0);
  badge.textContent = `Guard ${guard}`;
}

function renderEmbers(embers) {
  const pips = $('ember-pips');
  pips.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const pip = document.createElement('span');
    pip.className = 'ember-pip' + (i < embers ? '' : ' spent');
    pips.appendChild(pip);
  }
  $('ember-text').textContent = embers;
}

function renderMiniHand(container, count) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const back = document.createElement('div');
    back.className = 'mini-card';
    back.textContent = '✦';
    container.appendChild(back);
  }
}

// ---------- log ----------
export function logLine(state, text, kind = '') {
  const log = $('log');
  const line = document.createElement('div');
  if (kind) line.className = `log-${kind}`;
  line.textContent = text;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
  while (log.children.length > 40) log.removeChild(log.firstChild);
}

export function clearLog() {
  $('log').innerHTML = '';
}

// ---------- end screens ----------
export function renderEnd(state, won) {
  const stats = [
    { v: state.duelsWon, k: 'DUELS WON' },
    { v: state.damageDealt, k: 'DAMAGE DEALT' },
    { v: state.turnsPlayed, k: 'TURNS PLAYED' },
    { v: state.damageDealt + state.duelsWon * 50, k: 'FINAL SCORE' },
  ];
  const box = won ? $('win-stats') : $('loss-stats');
  box.innerHTML = '';
  for (const s of stats) {
    const cell = document.createElement('div');
    cell.className = 'end-stat';
    const v = document.createElement('div');
    v.className = 'v';
    v.textContent = s.v;
    const k = document.createElement('div');
    k.className = 'k';
    k.textContent = s.k;
    cell.append(v, k);
    box.appendChild(cell);
  }
  if (won) {
    $('win-text').textContent = `All three duels are won — ${DUELS.map((d) => d.enemy).join(', ')} all bow. The embers are yours.`;
  } else {
    const duel = DUELS[state.duelIndex];
    const turns = Math.max(1, state.turnsPlayed);
    $('loss-text').textContent = `${duel.enemy} takes the duel in ${turns} turn${turns === 1 ? '' : 's'}. The pact breaks — for now.`;
  }
}

// Shake the table when a big hit lands.
export function shakeTable() {
  const table = $('table');
  table.classList.remove('struck');
  void table.offsetWidth;
  table.classList.add('struck');
}
