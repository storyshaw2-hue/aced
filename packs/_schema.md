# ACED Exam Pack Schema v1

An **exam pack** is a single JS file that defines everything ACED needs to teach a subject. The engine (`study.html`) is content-agnostic — it loads a pack and runs the same Balatro-style loop on top.

## File location

`packs/<slug>.js` — for example `packs/cpa-far.js`, `packs/usmle-step1.js`, `packs/lsat.js`.

Each file exposes a single global:

```js
window.ACED_PACK = {
  id: "cpa-far",
  // ...full pack object below
};
```

To load: `study.html?pack=cpa-far` — the engine fetches `packs/cpa-far.js`.

## Required fields

```js
window.ACED_PACK = {
  id: "cpa-far",                          // URL slug, no spaces
  name: "CPA · FAR",                       // displayed in header
  description: "Financial Accounting & Reporting · 4-hour CPA exam section",
  examDate: "2026-06-25",                 // optional, drives "exam readiness" calc
  
  // ELEMENTS — the suits/categories of cards. 4–6 recommended.
  // Each element has a label and a CSS color. The engine renders cards
  // tinted by element color and uses elements to detect hand types.
  elements: {
    REV:    { label: "Revenue",   color: "#5cffea" },
    EXP:    { label: "Expense",   color: "#ff8a5c" },
    ASSET:  { label: "Asset",     color: "#7dff9e" },
    LIAB:   { label: "Liability", color: "#ff5cb8" },
    EQUITY: { label: "Equity",    color: "#ffd23f" },
  },
  
  // MODULES — the chapters/topics. Used for mastery tracking and audit moments.
  // Keys can be anything ("F1.M1", "CH3", "Topic.07"). Engine treats them as opaque.
  modules: {
    "F1.M1": "Income Statement",
    "F1.M2": "Balance Sheet",
    "F2.M1": "Revenue Recognition (ASC 606)",
    // ...
  },
  
  // CARDS — the deck. Min 30, recommended 35–60. Each card maps to a module.
  // `value` (v) = chip points when scored. `element` (el) = which suit.
  // `tags` (optional) = extra metadata doctrines can check for.
  cards: [
    { n: "Sales Revenue", el: "REV", v: 35, moduleKey: "F2.M1" },
    { n: "Cash",          el: "ASSET", v: 30, moduleKey: "F1.M1", tags: ["cash"] },
    // ...
  ],
  
  // DOCTRINES — the jokers. Concept-based scoring multipliers.
  // Each doctrine teaches a real concept. Apply function gets the play context
  // and can add chips/mult. Keep doctrine text short (1 sentence).
  doctrines: [
    {
      id: "match",
      n: "Matching Principle",
      d: "REV+EXP together: +5 Mult.",
      teaches: "Match expenses to the period that produced the revenue.",
      apply: c => { if (c.hasRev && c.hasExp) c.addMult(5, "Matching"); }
    },
    // ...20-40 doctrines recommended
  ],
  
  // CONSUMABLES — adjusting entries, one-shot deck modifiers
  consumables: [
    {
      id: "capitalize",
      n: "Capitalize",
      d: "Turn a selected Expense into an Asset.",
      type: "target",
      ok: c => c.el === "EXP",
      act: c => { c.el = "ASSET"; }
    },
  ],
  
  // BOSSES — modifier challenges that appear at boss blinds
  bosses: [
    { id: "audit", n: "THE AUDIT", d: "Hand size reduced to 7." },
    // ...
  ],
  
  // HAND TYPES — the Balatro poker hands, adapted for the subject.
  // For accounting: matching pairs by element, "matched entry" REV+EXP, etc.
  // For medicine: matching by organ system, "differential diagnosis" 3+ symptoms, etc.
  // `condition` runs at detection time. Returns score multiplier.
  handTypes: [
    { name: "Single Posting",        condition: (cs) => true,                              mult: 1 },
    { name: "Matching Pair",         condition: (cs) => maxElCount(cs) >= 2,               mult: 2 },
    { name: "Matched Entry",         condition: (cs) => hasRev(cs) && hasExp(cs),          mult: 3 },
    { name: "Three-Account Entry",   condition: (cs) => maxElCount(cs) >= 3,               mult: 4 },
    { name: "Ledger Flush",          condition: (cs) => maxElCount(cs) >= 4,               mult: 6 },
    { name: "Full Consolidation",    condition: (cs) => maxElCount(cs) >= 5,               mult: 9 },
  ],
  
  // QUESTIONS — the MCQ bank for Audit Moments
  // moduleKey lets the engine pick a question for the player's weakest topic.
  questions: [
    {
      moduleKey: "F2.M1",
      q: "Under ASC 606, revenue is recognized when...",
      choices: ["A...", "B...", "C...", "D..."],
      answer: 2,
      explain: "The control of the asset transfers to the customer..."
    },
    // 100–2000 questions ideal
  ],
  
  // OPTIONAL: TARGETS per ante/blind (default = TARGETS from engine)
  // OPTIONAL: starting doctrines/consumables/money
  starter: {
    doctrines: ["match", "compound"],  // doctrine IDs equipped at run start
    money: 4
  }
};
```

## Building a pack from material

Use `importer.html` to convert your textbook + question banks into a pack. The importer:

1. Accepts: textbook PDFs (chapter list extraction), MCQ PDFs (question parsing), or flat JSON arrays
2. Calls Perplexity LLM to:
   - Extract module list from textbook TOC
   - Generate card pool from key concepts (e.g. for USMLE: "Acetylcholine", "Beta blocker", "Glomerulus", each tagged with a system)
   - Generate doctrines from chapter-end summaries (e.g. for LSAT: "Necessary vs Sufficient Conditions" → if argument has both A→B and B→A cards, +mult)
   - Tag MCQs with their module
3. Outputs a `pack.js` file you can save and load.

## Sharing packs

Drop a pack file into the `packs/` directory and it appears in `library.html`. Community packs go to `packs/community/<slug>.js`.

## Example: building a "USMLE Step 1 — Pharmacology" pack

```js
elements: {
  AUTONOMIC: { label: "Autonomic", color: "#5cffea" },
  CARDIO:    { label: "Cardio",    color: "#ff5238" },
  CNS:       { label: "CNS",       color: "#ff5cb8" },
  ANTIBIO:   { label: "Antibiotic", color: "#7dff9e" },
  // etc.
},
cards: [
  { n: "Acetylcholine", el: "AUTONOMIC", v: 30, moduleKey: "P.AUTO" },
  { n: "Propranolol",   el: "CARDIO",    v: 35, moduleKey: "P.CV", tags: ["beta-blocker"] },
  // ...
],
doctrines: [
  { id: "alpha-beta", n: "Alpha-Beta Selectivity", d: "Beta-blocker + cardiac card: +5 Mult",
    teaches: "Beta-1 selective agents preferred in cardio patients with asthma.",
    apply: c => { if (c.t("beta-blocker") && c.el.CARDIO) c.addMult(5); } },
  // ...
],
```

Same engine. Same loop. Different exam.
