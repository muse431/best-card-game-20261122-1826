// Ember Pact — the three duels and the enemy mind.
// Each duel names one opponent with its own life, hand size and intent table.
// The enemy's next move is always shown before the player commits cards,
// so every turn is a readable decision: guard the strike, or strike through
// the guard. Intents cycle on a fixed pattern the player can learn.

export const DUELS = [
  {
    name: 'Duel I — Cinder Pup',
    short: 'Duel I',
    enemy: 'Cinder Pup',
    enemyGlyph: '🐺',
    enemyLife: 30,
    enemyHandSize: 4,
    flavor: 'A young ember-whelp, all teeth and no patience.',
    // pattern repeats: [intent, intent, ...]
    pattern: [
      { kind: 'attack', value: 6 },
      { kind: 'attack', value: 7 },
      { kind: 'guard', value: 8 },
      { kind: 'attack', value: 8 },
    ],
  },
  {
    name: 'Duel II — Tidecaller Mara',
    short: 'Duel II',
    enemy: 'Tidecaller Mara',
    enemyGlyph: '🧜',
    enemyLife: 42,
    enemyHandSize: 5,
    flavor: 'She answers every blow with a wall of water.',
    pattern: [
      { kind: 'attack', value: 8 },
      { kind: 'guard', value: 10 },
      { kind: 'attack', value: 9 },
      { kind: 'guard', value: 10 },
      { kind: 'attack', value: 11 },
    ],
  },
  {
    name: 'Duel III — The Ember Queen',
    short: 'Duel III',
    enemy: 'The Ember Queen',
    enemyGlyph: '👑',
    enemyLife: 56,
    enemyHandSize: 6,
    flavor: 'The pact itself, wearing a crown. She hits like a wildfire.',
    pattern: [
      { kind: 'attack', value: 11 },
      { kind: 'attack', value: 12 },
      { kind: 'guard', value: 14 },
      { kind: 'attack', value: 13 },
      { kind: 'guard', value: 12 },
      { kind: 'attack', value: 15 },
    ],
  },
];

// The intent for a given turn number (1-based), cycling the duel's pattern.
export function intentFor(duel, turn) {
  return duel.pattern[(turn - 1) % duel.pattern.length];
}

export function describeIntent(intent) {
  if (intent.kind === 'attack') return `plans to strike for ${intent.value} damage`;
  if (intent.kind === 'guard') return `plans to raise ${intent.value} guard`;
  return 'plans something unknown';
}

// What the enemy actually does when its turn comes. Its old guard expires
// first — a guard only ever blocks the one player turn after it was raised.
export function enemyAct(state, duel, intent) {
  state.enemyGuard = 0;
  if (intent.kind === 'attack') {
    let dmg = intent.value;
    const blocked = Math.min(state.playerGuard, dmg);
    dmg -= blocked;
    state.playerGuard -= blocked;
    state.playerLife -= dmg;
    return { text: `${duel.enemy} strikes for ${intent.value} — ${blocked} blocked, ${dmg} gets through.`, blocked, dealt: dmg };
  }
  state.enemyGuard += intent.value;
  return { text: `${duel.enemy} raises ${intent.value} guard.`, blocked: 0, dealt: 0 };
}
