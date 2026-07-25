# ACED — jokers system (aced-jokers.js)

A subject-agnostic joker engine — the Balatro depth layer. Every joker triggers on
GENERIC signals (conviction, streak, card family, family chain, comeback, mastery,
round), never on a subject's content, so the same 12 jokers work for any deck.

## Files
- `aced-jokers.js` — the engine (pure logic, no DOM/storage). `window.ACEDJokers`.
- `aced-jokers.test.js` — 9 suites, all passing (`node aced-jokers.test.js`).
- `aced-jokers-demo.html` — playable: buy jokers from a shop with $, then watch them
  fire as chips × mult with a live breakdown. **Play this first to feel it.**

## How it pairs with what you already shipped
- Reads the card's **family** from `aced-cards.js` (Analyst/Mechanic jokers).
- Reads the **family chain** from `aced-synergy.js` (Chain Reaction joker).
- Reads **conviction / streak** the arcade already tracks (High Roller, Streaker, Sure Thing).
So jokers make the card-types and the chain *matter more* — the systems reinforce.

## Scoring model
Each answered card resolves as **chips × mult**:
`baseChips` (card difficulty) and `baseMult` (conviction × streak) → owned jokers
add chips / add mult / ×mult in loadout order → `total = round(chips) × mult`.
`ACEDJokers.score(ctx)` returns `{chips, mult, total, fired[]}` — `fired[]` lets the
UI show each joker triggering (the "my engine works" moment).

## Arcade wiring (OUTLINE — I'll send the exact surgical patch once you like the demo)
This is a bigger change than the synergy patch, so feel it first. When wiring:
1. **Run state:** add `jokers:[]` (owned ids) and a `$` currency.
2. **Scoring in `pick()`:** replace the flat `gained = BASE_CHIPS × conv × streak`
   with `ACEDJokers.score({ baseChips, baseMult: conv.mult*streakMult, correct,
   conviction, family: ACEDCards.normalize(q).cardFamily, chain: ACEDSynergy.state().chainCount,
   streak, ante, mastered, distinctFamilies, justRecovered, jokers: state.jokers })`
   and bank `.total`; render `.fired` in the result readout.
3. **Shop at ante clear:** in `renderAnteClear`, offer `ACEDJokers.rollShop(3,{exclude:state.jokers})`
   to buy with `$`; award `$` per ante.
4. **HUD:** show owned jokers (their names, rarity color).
Boss blinds can stay as-is, or let jokers apply there too later.

## Tuning
Edit the `CATALOG` array (costs, effects, rarity) and `RARITY` weights at the top of
`aced-jokers.js`. Nothing else needs changing.
