# Doctrine Design Methodology (Backlog Task 13)

How to turn **any exam blueprint into a deckbuilder** — the creative mapping that, not question-writing,
is the real bottleneck to going wide. This documents how CPA FAR was mapped, then generalizes it into a
repeatable method + a fill-in template.

---

## The core principle

**Every game object is a real concept, so playing well *is* understanding the domain.** Nothing is
"chocolate-covered broccoli" bolted on — the scoring math *is* the subject's logic. In FAR:

- **Elements** (the suits) = the categories the domain sorts things into.
- **Cards** = the atomic items in the domain, each tagged with the concepts it participates in.
- **Hands** = the *structural* patterns the domain rewards (how items legally combine).
- **Doctrines** = the *principles* that warp scoring — the "rules that fire when a condition is met."
- **Audit Moment** = a real MCQ + a confidence bet, so recall and calibration ride on top of the game.

When a doctrine reads `if (played has REV and EXP) +5 Mult`, the player is internalizing the matching
principle by *playing to trigger it*. That is the whole trick.

---

## The FAR mapping, decoded (worked reference)

| Layer | FAR instantiation | Data shape (from `packs/cpa-far.js` + `_schema.md`) |
|-------|-------------------|------|
| **Elements** | ASSET · LIAB · EQUITY · REV · EXP · OCI (financial-statement categories) | `elements: { REV:{label,color}, ... }` — 4–6 recommended |
| **Cards** | Individual accounts ("Deferred Revenue", "Bonds Payable"), each with a chip value, an element (suit), and concept **tags** | `{ n, v, el, tags:["def","loss","lease",...] }` — 35–60 cards |
| **Hands** | Journal-entry structures: Matched Entry (REV+EXP), Three-Account Entry, Full Consolidation (5 elements) | `hands: [{ name, condition:(cs)=>bool, mult }]` — increasing mult for more complete entries |
| **Doctrines** | GAAP principles as scoring modifiers, keyed to card tags/elements | `{ id, rarity, n, d, apply:(c)=>{ if(cond) c.addChips(x)/c.addMult(y) } }` — 20–40 |
| **Audit Moment** | A real MCQ from the weakest module + LOW/MED/HIGH confidence bet (Brier-scored) | reuses the shared MCQ bank + `ACEDCore.calibration` |

**The play-context `c`** a doctrine's `apply(c)` receives (the vocabulary you design against):
- `c.el.REV`, `c.el.ASSET`, … — count of played cards in each element
- `c.t("tag")` — count of played cards carrying a concept tag (e.g. `c.t("lease")`)
- `c.hasRev`, `c.hasExp` — convenience booleans
- `c.played` — the played cards (`.v` value, `.tags`)
- `c.handsThisBlind` — how many hands played this close (enables decay/ramp effects)
- `c.addChips(n, label)` / `c.addMult(n, label)` — the two levers, with a floating label for feedback

**Design patterns that emerged** (reuse these — they're domain-agnostic):
1. **Flat bonus** — "play concept X → +chips" (teaches *recognition*). e.g. Revenue Recognition: `+16 chips per REV`.
2. **Synergy** — "X *and* Y together → +Mult" (teaches *relationships*). e.g. Matching: `REV & EXP → +5 Mult`.
3. **Threshold** — "N+ of a thing → payoff" (teaches *materiality/aggregation*). e.g. LIFO: `2+ inventory → +30/ea`.
4. **Ramp / decay** — effect grows or shrinks per hand (teaches *time*: amortization, estimates).
5. **Risk** — randomized swing (teaches *uncertainty*: Fair Value mark-to-market `±chips`).
6. **Absence** — "did NOT play X → bonus" (teaches *purity rules*: Full Accrual = no Cash card).

Rarity (`common`/`uncommon`/`rare`) controls shop appearance and power budget.

---

## The repeatable method (do this for a new exam)

1. **Get the blueprint.** List the official content domains and their weights. These become your **modules**
   (question tags) and inform element/doctrine coverage.
2. **Pick 4–6 elements.** The domain's top-level sort. (FAR: statement categories. USMLE: body systems.
   LSAT: question types.) Fewer is better — they're the suits.
3. **Build the card pool (35–60).** Enumerate the domain's atomic items. Give each a chip value (rough
   importance), an element, and **tags** for every concept a doctrine might check. *Tags are the API doctrines
   design against — be generous.*
4. **Design 5–7 hands.** The legal *structures* the domain rewards, ordered by completeness → higher mult.
   This is where "good play" mirrors "correct method."
5. **Map 20–40 doctrines from the blueprint's principles.** For each high-yield concept, pick a pattern from
   the six above and write a one-sentence `d` + an `apply`. **One doctrine = one teachable principle.** Spread
   across rarities; don't let any single doctrine dominate the power budget.
6. **Wire the Audit Moment** to the existing MCQ bank + `ACEDCore.calibration` (no new code — it's shared).
7. **Balance pass.** Playtest: no dead doctrines, no auto-win combo, a losing board recoverable with the right
   shop buys. Aim for a ~40–60% first-run loss rate (losing is the retention hook).
8. **Verify content** (non-negotiable for licensure: medical/nursing/legal). A wrong answer in a trainer is a
   safety/credibility failure — qualified human review before ship.

---

## Fill-in template

```js
// packs/<exam>.js  (keep a content/<exam>.json twin in sync; run node tools/validate.js)
window.ACED_PACK = {
  id: "<exam-id>",
  name: "<EXAM> — <one-line>",
  modules: [ /* blueprint domains, e.g. "Pharmacology", "Cardiovascular", ... */ ],

  // 1) ELEMENTS — 4–6 suits (the domain's top-level sort)
  elements: {
    E1: { label: "<...>", color: "#22ff66" },
    E2: { label: "<...>", color: "#5cffea" },
    // ...
  },

  // 2) CARDS — 35–60 atomic items. v=chip value, el=element, tags=concept flags doctrines check
  cards: [
    { n: "<item>", v: 30, el: "E1", tags: ["<concept>", "<concept>"] },
    // ...
  ],

  // 3) HANDS — structural patterns, ascending mult for more complete/correct structures
  hands: [
    { name: "<basic>",     condition: (cs) => true,                 mult: 1 },
    { name: "<pair>",      condition: (cs) => maxElCount(cs) >= 2,  mult: 2 },
    { name: "<complete>",  condition: (cs) => /* domain rule */ true, mult: 4 },
  ],

  // 4) DOCTRINES — 20–40 principles as scoring modifiers (pick a pattern per concept)
  doctrines: [
    // FLAT:      { id:"", rarity:"common",   n:"", d:"+X chips per <tag> card.",           apply:c=>{ if(c.t("<tag>")) c.addChips(X*c.t("<tag>"),"<label>"); } },
    // SYNERGY:   { id:"", rarity:"common",   n:"", d:"<A> and <B> together: +Y Mult.",     apply:c=>{ if(cond(c)) c.addMult(Y,"<label>"); } },
    // THRESHOLD: { id:"", rarity:"uncommon", n:"", d:"N+ <tag> cards: +Z Mult.",           apply:c=>{ if(c.t("<tag>")>=N) c.addMult(Z,"<label>"); } },
    // RAMP:      { id:"", rarity:"uncommon", n:"", d:"+2 Mult, +1 more each hand.",         apply:c=>{ c.addMult(2+c.handsThisBlind,"<label>"); } },
    // RISK:      { id:"", rarity:"common",   n:"", d:"Each <tag>: ±chips, remeasured.",     apply:c=>{ /* random swing */ } },
    // ABSENCE:   { id:"", rarity:"common",   n:"", d:"No <tag> card played: +W Mult.",      apply:c=>{ if(!c.t("<tag>")) c.addMult(W,"<label>"); } },
  ],

  starting: { doctrines: ["<id>", "<id>"] }
};
```

---

## Two mini-examples (the mapping in action)

**USMLE Step 1 — pharmacology slice**
- Elements: Cardiovascular · Neuro · Renal · Endocrine · Antimicrobial.
- Cards: drugs/mediators ("Beta blocker", "ACE inhibitor", "Acetylcholine"), tagged `["receptor:beta","mech:sympatholytic","system:cv"]`.
- Hand: "Mechanism Match" = an agonist + its target receptor together → +Mult (teaches MoA pairing).
- Doctrine (synergy): *Contraindication* — "Beta blocker + asthma card together: −chips" (teaches a real safety rule).
- Doctrine (threshold): *Class Effect* — "2+ same-class drugs: +Mult."
- ⚠ Content **must be verified by a clinician** before ship.

**LSAT — logical reasoning slice**
- Elements: Assumption · Inference · Flaw · Strengthen/Weaken · Parallel.
- Cards: argument pieces ("Premise", "Conclusion", "Necessary condition", "Sufficient condition").
- Hand: "Valid Syllogism" = premises that entail the conclusion → high mult.
- Doctrine (synergy): *Necessary vs Sufficient* — "both A→B and B→A cards present: penalty" (the classic confusion the LSAT punishes).
- Doctrine (absence): *No Unstated Gap* — "conclusion card with a matching assumption card: +Mult."

---

## Guardrails

- **One doctrine, one concept.** If you can't name the principle a doctrine teaches, cut it.
- **Tags are the contract.** Doctrines can only check what cards are tagged with — tag richly up front.
- **Losing is the product.** Tune for a real loss rate; the comeback via shop synergies is the dopamine.
- **High-stakes content is verified content.** No exceptions for medical/nursing/legal.
- **Keep the twin in sync** (`.js` ↔ `content/<exam>.json`) and run `node tools/validate.js` before merge.
