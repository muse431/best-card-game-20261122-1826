// Ember Pact — the card catalogue. 24 original cards in four elements.
// Every card is data: name, element, ember cost, and what it does when played.
// Elements are told apart by colour AND shape: Flame ▲ red, Tide ● blue,
// Gale ◆ green, Stone ■ amber. No card copies any commercial game.

export const ELEMENTS = {
  flame: { name: 'FLAME', glyph: '▲', color: '#e4572e' },
  tide:  { name: 'TIDE',  glyph: '●', color: '#3d8bfd' },
  gale:  { name: 'GALE',  glyph: '◆', color: '#37b24d' },
  stone: { name: 'STONE', glyph: '■', color: '#e8a13c' },
};

// atk = damage to the enemy. guard = block you gain. ember = embers gained.
// draw = cards drawn. Resonance adds +2 to a card's atk or guard when it is
// the second card of its element played in the same turn.
export const CARDS = [
  // ---- FLAME: raw attack ----
  { id: 'cinder-slash', name: 'Cinder Slash', element: 'flame', cost: 1, atk: 4, guard: 0, ember: 0, draw: 0, glyph: '🗡', text: 'Deal 4 damage.' },
  { id: 'wildfire', name: 'Wildfire', element: 'flame', cost: 2, atk: 7, guard: 0, ember: 0, draw: 0, glyph: '🔥', text: 'Deal 7 damage.' },
  { id: 'ember-fan', name: 'Ember Fan', element: 'flame', cost: 1, atk: 2, guard: 0, ember: 1, draw: 0, glyph: '✦', text: 'Deal 2 damage. Gain 1 ember.' },
  { id: 'pyre-pact', name: 'Pyre Pact', element: 'flame', cost: 3, atk: 11, guard: 0, ember: 0, draw: 0, glyph: '☀', text: 'Deal 11 damage. The big one.' },
  { id: 'spark-spray', name: 'Spark Spray', element: 'flame', cost: 0, atk: 2, guard: 0, ember: 0, draw: 0, glyph: '✧', text: 'Deal 2 damage. Free.' },
  { id: 'ashen-guard', name: 'Ashen Guard', element: 'flame', cost: 1, atk: 2, guard: 4, ember: 0, draw: 0, glyph: '🛡', text: 'Deal 2 damage. Gain 4 guard.' },
  // ---- TIDE: guard and flow ----
  { id: 'tide-wall', name: 'Tide Wall', element: 'tide', cost: 1, atk: 0, guard: 7, ember: 0, draw: 0, glyph: '🌊', text: 'Gain 7 guard.' },
  { id: 'undertow', name: 'Undertow', element: 'tide', cost: 2, atk: 5, guard: 5, ember: 0, draw: 0, glyph: '🌀', text: 'Deal 5 damage. Gain 5 guard.' },
  { id: 'still-pool', name: 'Still Pool', element: 'tide', cost: 0, atk: 0, guard: 3, ember: 1, draw: 0, glyph: '💧', text: 'Gain 3 guard. Gain 1 ember.' },
  { id: 'crashing-wave', name: 'Crashing Wave', element: 'tide', cost: 2, atk: 6, guard: 0, ember: 0, draw: 1, glyph: '🌊', text: 'Deal 6 damage. Draw a card.' },
  { id: 'deep-current', name: 'Deep Current', element: 'tide', cost: 1, atk: 3, guard: 3, ember: 0, draw: 0, glyph: '🐚', text: 'Deal 3 damage. Gain 3 guard.' },
  { id: 'floodgate', name: 'Floodgate', element: 'tide', cost: 3, atk: 4, guard: 12, ember: 0, draw: 0, glyph: '🌧', text: 'Deal 4 damage. Gain 12 guard.' },
  // ---- GALE: draw and embers ----
  { id: 'tailwind', name: 'Tailwind', element: 'gale', cost: 1, atk: 0, guard: 0, ember: 2, draw: 1, glyph: '🍃', text: 'Gain 2 embers. Draw a card.' },
  { id: 'razor-gust', name: 'Razor Gust', element: 'gale', cost: 1, atk: 3, guard: 0, ember: 0, draw: 1, glyph: '💨', text: 'Deal 3 damage. Draw a card.' },
  { id: 'storm-kite', name: 'Storm Kite', element: 'gale', cost: 2, atk: 6, guard: 0, ember: 1, draw: 0, glyph: '🪁', text: 'Deal 6 damage. Gain 1 ember.' },
  { id: 'whisper-step', name: 'Whisper Step', element: 'gale', cost: 0, atk: 0, guard: 2, ember: 0, draw: 1, glyph: '👣', text: 'Gain 2 guard. Draw a card.' },
  { id: 'cyclone', name: 'Cyclone', element: 'gale', cost: 3, atk: 9, guard: 0, ember: 0, draw: 1, glyph: '🌪', text: 'Deal 9 damage. Draw a card.' },
  { id: 'feather-drift', name: 'Feather Drift', element: 'gale', cost: 1, atk: 1, guard: 4, ember: 1, draw: 0, glyph: '🪶', text: 'Deal 1 damage. Gain 4 guard and 1 ember.' },
  // ---- STONE: heavy guard and heavy hits ----
  { id: 'boulder-fist', name: 'Boulder Fist', element: 'stone', cost: 2, atk: 8, guard: 0, ember: 0, draw: 0, glyph: '✊', text: 'Deal 8 damage.' },
  { id: 'granite-stand', name: 'Granite Stand', element: 'stone', cost: 1, atk: 0, guard: 9, ember: 0, draw: 0, glyph: '🧱', text: 'Gain 9 guard.' },
  { id: 'pebble-toss', name: 'Pebble Toss', element: 'stone', cost: 0, atk: 3, guard: 0, ember: 0, draw: 0, glyph: '🪨', text: 'Deal 3 damage. Free.' },
  { id: 'mountain-oath', name: 'Mountain Oath', element: 'stone', cost: 3, atk: 6, guard: 10, ember: 0, draw: 0, glyph: '⛰', text: 'Deal 6 damage. Gain 10 guard.' },
  { id: 'gravel-spray', name: 'Gravel Spray', element: 'stone', cost: 1, atk: 4, guard: 2, ember: 0, draw: 0, glyph: '💥', text: 'Deal 4 damage. Gain 2 guard.' },
  { id: 'keystone', name: 'Keystone', element: 'stone', cost: 2, atk: 0, guard: 6, ember: 2, draw: 0, glyph: '🔶', text: 'Gain 6 guard. Gain 2 embers.' },
];

export function cardById(id) {
  return CARDS.find((c) => c.id === id);
}

export function describeCard(card) {
  const parts = [];
  if (card.atk) parts.push(`${card.atk} damage`);
  if (card.guard) parts.push(`${card.guard} guard`);
  if (card.ember) parts.push(`+${card.ember} ember${card.ember > 1 ? 's' : ''}`);
  if (card.draw) parts.push(`draw ${card.draw}`);
  return parts.join(', ');
}
