# Ember Pact — Make the best card game

[![make.fun](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/c/best-card-game-20261122-1826)
[![rank](https://make.fun/badge/best-card-game-20261122-1826/muse431/best-card-game-20261122-1826/rank.svg)](https://make.fun/c/best-card-game-20261122-1826)
[![reward](https://make.fun/badge/best-card-game-20261122-1826/muse431/best-card-game-20261122-1826/reward.svg)](https://make.fun/c/best-card-game-20261122-1826)

**Ember Pact** is an original card-duel game that runs entirely offline in a
desktop browser. Three duels, four elements, one pact to keep.

## How a duel works

- **Play cards** by clicking them (or keys 1–5). Each card costs embers — you
  gain **3 embers** every turn.
- **Resonance:** play two cards of the same element in one turn and the
  second hits **+2** harder.
- **Trine:** play three different elements in one turn to **draw a card**.
- The enemy's **intent** is always shown before you commit: guard a strike,
  or strike through a guard.
- Reduce the enemy to **0 life** to win the duel. Fall to 0 and the pact breaks.

## The duels

1. **Cinder Pup** — a young ember-whelp, all teeth and no patience (30 life).
2. **Tidecaller Mara** — answers every blow with a wall of water (42 life).
3. **The Ember Queen** — the pact itself, wearing a crown (56 life).

## The elements

| Element | Shape | Colour | Style |
|---------|-------|--------|-------|
| Flame | ▲ | red | raw attack |
| Tide | ● | blue | guard and flow |
| Gale | ◆ | green | draw and embers |
| Stone | ■ | amber | heavy guard, heavy hits |

24 original cards, 6 per element. Suits are told apart by colour **and**
shape, never by text alone.

## Play it

Serve `game/` with any static server and open `game/index.html`, or:

```sh
cd game && python3 -m http.server 8080   # open http://localhost:8080
```

Screenshots are staged deterministically with `?scene=title|duel|win|loss`.

## Layout

- `game/index.html` — page skeleton, HUD, screens
- `game/style.css` — table, cards, screens (all art is CSS)
- `game/src/main.js` — boot and the duel loop
- `game/src/cards.js` — the 24-card catalogue
- `game/src/deck.js` — deck, seeded shuffle, drawing
- `game/src/enemies.js` — the three duels and the enemy mind
- `game/src/combat.js` — playing cards, Resonance, Trine, turns
- `game/src/render.js` — the table, hands, cards, log
- `game/src/audio.js` — WebAudio synthesized sound effects
- `game/src/shots.js` — deterministic screenshot staging
- `main.ts` — the hand-in program (copies `game/` + `screenshots/`, writes
  `dossier.json`)
- `vendor/makefun-game.ts` — the kit's library, unchanged

## License

MIT — see [LICENSE](LICENSE).
