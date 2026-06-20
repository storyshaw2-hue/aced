# Bringing Your Own Study Material into ACED

ACED is a roguelike-deckbuilder study engine. The game loop is hardcoded; **the content is not**. You bring your own subject — a CPA section, USMLE Step 1 pharm, LSAT logic games, the AWS Solutions Architect blueprint, your firm's internal training material — and ACED runs the same Balatro-style run on top of it.

This document covers the two paths for getting your material into the game:

1. **Pack Builder** (`importer.html`) — a form-based UI that compiles your material into a valid pack file. No coding.
2. **Direct authoring** — write a pack file by hand against the schema. More control, useful for power users.

Both produce the same artifact: a single JavaScript file in `packs/<your-slug>.js` that the engine loads via `study.html?pack=<your-slug>`.

---

## What a "pack" actually is

A pack is one JavaScript file that exposes a global `window.ACED_PACK` object. The engine knows nothing about your subject — it just reads this object and runs.

A pack contains six things:

| Field | What it is | Minimum |
|---|---|---|
| `elements` | The "suits" / categories your cards belong to | 3-6 |
| `modules` | The chapters / topics you want to track mastery on | 1+ |
| `cards` | The deck. Each card is one concept, tagged with an element and module | 30+ (35-60 recommended) |
| `doctrines` | The jokers. Concept-based scoring multipliers that teach a real rule | 6+ (20-40 recommended) |
| `questions` | Multiple-choice questions used during "Audit Moments" | 50+ (100-2000 ideal) |
| `bosses` + `consumables` + `handTypes` | Optional modifier challenges, one-shot items, and scoring rules | Defaults provided |

The full reference is in [`packs/_schema.md`](../packs/_schema.md).

---

## Path 1 — Pack Builder UI (recommended)

Open [`importer.html`](../importer.html) in the running app. It's a two-pane form: fill the left side, watch the right side assemble a valid pack file live.

### The form, field by field

**Exam name** — shown in the game header. Example: `USMLE · Step 1 — Pharm`.

**Pack ID** — URL slug, lowercase, no spaces. Becomes the filename. Example: `usmle-step1-pharm` produces `packs/usmle-step1-pharm.js`.

**Description** — one line of context. Shown in the library.

**Exam date** — optional `YYYY-MM-DD`. Drives the "exam readiness" calculation in the dashboard.

**Modules** — your topic list. One per line, format `KEY :: Label`. The key is used internally for mastery tracking and can be anything.

```
P.AUTO :: Autonomic Pharmacology
P.CV   :: Cardiovascular Drugs
P.CNS  :: CNS Agents
```

**Elements / Suits** — 3-6 categories your cards belong to. Format `KEY :: Label :: #hexcolor`. Color is optional; the builder auto-assigns from a palette if you skip it.

```
CNS       :: CNS        :: #ff5cb8
CARDIO    :: Cardio     :: #ff5238
AUTONOMIC :: Autonomic  :: #5cffea
```

**Cards** — the deck itself, CSV style, one card per line. Format: `name, ELEMENT, value, moduleKey, tag|tag`. Value is the chip points the card is worth when scored (typically 20-50). Tags are optional metadata that doctrines can check.

```
Acetylcholine, AUTONOMIC, 30, P.AUTO, agonist
Atropine,      AUTONOMIC, 35, P.AUTO, antagonist|antidote
Propranolol,   CARDIO,    35, P.CV,   beta-blocker
```

**Doctrines** — plain-English rules, one per line. Format `Name :: rule text`. The builder auto-generates a generic "matching element pair" multiplier for each; advanced players can hand-edit the `apply` function in the downloaded file for richer scoring.

```
Alpha-Beta Selectivity :: Beta-blocker played with a Cardio card: +5 Mult.
Receptor Match         :: Two or more cards of the same organ system: +4 Mult.
```

**MCQs** — JSON array. Format: `{moduleKey, q, choices, answer, explain}`. `answer` is the 0-indexed correct choice.

```json
[
  {
    "moduleKey": "P.CV",
    "q": "A patient with asthma needs a beta-blocker. Which is safest?",
    "choices": ["Propranolol", "Metoprolol", "Carvedilol", "Nadolol"],
    "answer": 1,
    "explain": "Metoprolol is beta-1 selective, sparing bronchial beta-2 receptors."
  }
]
```

### Three buttons

- **★ USE STARTER TEMPLATE** — loads a complete USMLE Step 1 Pharmacology example into every field. Edit it to learn the format quickly.
- **⚙ GENERATE PACK** — assembles the JS file in the preview pane. Re-validates on every keystroke too.
- **⬇ DOWNLOAD packs/<id>.js** — saves the file. Enabled only when the pack passes validation.

### What "valid" means

The download button stays disabled until your pack has at least:
- 1 module
- 1 element
- 4 cards (35+ recommended for real play)
- Valid JSON in the MCQ field (an empty `[]` is fine; broken JSON is not)

Errors show in red at the top of the preview pane.

### Installing the pack

1. Click download. Browser saves `<your-pack-id>.js`.
2. Drop the file into your local `packs/` directory.
3. Open `study.html?pack=<your-pack-id>` — your pack runs.

That's it. No build step, no rebuild, no deploy. The file is the deliverable.

---

## Path 2 — Direct authoring

Open [`packs/_schema.md`](../packs/_schema.md) for the full reference. The short version:

```js
window.ACED_PACK = {
  id: "your-slug",
  name: "Your Exam",
  description: "One line.",
  elements:  { /* 3-6 entries */ },
  modules:   { /* 1+ entries */ },
  cards:     [ /* 30+ entries */ ],
  doctrines: [ /* 6+ entries, each with id/n/d/teaches/apply */ ],
  questions: [ /* 50+ MCQs */ ],
  // optional: consumables, bosses, handTypes, targets, starter
};
```

Wrap the whole thing in an IIFE and save as `packs/<your-slug>.js`. See [`packs/cpa-far.js`](../packs/cpa-far.js) for a working example.

Direct authoring is the only path if you want **custom `apply` functions** on doctrines — the form-based builder generates a generic multiplier; hand-written packs can do anything (check tags, check play history, modify the deck, etc.).

---

## Generator (paste-text → pack, experimental)

`engine.html` ships with a built-in generator that turns raw text into a pack using your own LLM API key. Open the engine, click "GEN," paste your study notes (textbook chapter, lecture transcript, blueprint document), provide an OpenAI or Anthropic key, and it will chunk the text, extract concepts, and emit a pack.

Limits today:
- Chunks text at ~7,000 characters
- Quality depends on the model you pick
- The key is stored in your browser's local storage on your own machine — never sent anywhere except directly to the LLM provider

This is the path for a "drop your PDF, get a game" experience. PDF parsing is on the roadmap; for now, paste the text yourself.

---

## Tips for a pack that plays well

A pack that compiles isn't necessarily a pack that's fun. Things I've learned building the CPA FAR pack:

- **35-60 cards is the sweet spot.** Fewer than 30 and the deck recycles too fast. More than 80 and weak cards never get cycled out.
- **Aim for 20+ doctrines.** Doctrines are the engine's joker pool. Players want variety in the shop.
- **Doctrine text should teach.** "REV+EXP together: +5 Mult" is fine. "Matching Principle: match expenses to the period that produced the revenue, +5 Mult when both elements are in your hand" is better — players read these dozens of times per run, so make them earn it.
- **Question depth matters.** Under 100 questions, runs get repetitive within an hour. Aim for 300+ for a "real" pack, 1,000+ for a sellable one.
- **Tag aggressively.** Tags (`agonist`, `beta-blocker`, `antidote`) unlock the most interesting doctrines. The CPA pack uses 80+ tags to power its mid-game synergies.
- **Test the boss blinds.** Default bosses work for any subject, but custom ones ("THE AUDIT: hand size reduced to 7") add personality.

---

## Roadmap: Gumroad paywall for premium packs

ACED's runtime is free and open. The monetization model is **paid pack downloads via Gumroad**: free engine, paid content. This section is the plan, not a finished feature.

### The product

- **Free**: the engine itself (`study.html`, `engine.html`, `importer.html`), the World Geography demo pack, a small CPA FAR Starter pack. Plus the BYO-material flow above.
- **Paid ($29 one-time, Gumroad)**: deep professionally-curated packs:
  - CPA · FAR Pro (1,500+ MCQs, 30+ doctrines, custom bosses)
  - CPA · AUD Pro
  - CPA · REG Pro
  - CPA · BAR Pro
  - USMLE Step 1 Pharm (planned)
  - Bar Exam · MEE Essentials (planned)
  - MCAT · CARS (planned)
- **Pro Bundle**: all four CPA sections, $79.

Pricing is one-time, no subscription. Customers get the pack files; the runtime is theirs forever.

### How a buyer extends ACED immediately after purchase

After Gumroad checkout the buyer receives:

1. A ZIP containing the pack files: `cpa-far-pro.js`, `cpa-far-pro-questions.js` (split for lazy-load), and a short `README-CPA-FAR-PRO.md`.
2. A license key tied to their email (for offline activation — see "Activation" below).
3. A one-page install guide that's literally three steps:

   ```
   1. Unzip the download.
   2. Drop every .js file into your aced/packs/ directory.
   3. Open study.html?pack=cpa-far-pro — you're in.
   ```

Because packs are plain files, install requires zero permissions, zero build step, zero account. The buyer owns the file; the engine just loads it.

### Activation (anti-piracy, light-touch)

The plan is **license-key gated, not DRM**. Pirated packs would work, but legitimate buyers get something pirates don't: pack updates and the in-game "verified license" badge that shows up in shared screenshots.

Implementation sketch:

- Each premium pack's loader checks for a license key in `localStorage` under `aced_license_<pack-id>`.
- The key is an HMAC of the buyer's Gumroad email + pack ID, signed with a private key on a tiny server endpoint (Cloudflare Worker, free tier).
- Without a key, the pack still loads but shows a banner "Unlicensed copy — pack updates disabled."
- The key check is intentionally bypassable. Goal is friction for casual sharing, not enforcement. Real protection is the constant content updates legitimate buyers receive.

This is **deliberately weak DRM.** The pitch to buyers is "support the work, get updates, support the engine." The pitch to pirates is "go ahead, but you'll be six months behind on content."

### Why this monetization model fits ACED

- **Engine + content split mirrors how the game already works.** No re-architecture.
- **One-time pricing beats subscription for exam prep.** Customers study for 3-6 months then leave; subscription rage-churn would hurt reviews.
- **Gumroad handles everything painful**: payments, tax (VAT/sales tax in 50+ jurisdictions), refunds, EU compliance, fraud, chargebacks. ~10% take rate; the rest is yours.
- **The free tier is genuinely useful.** The BYO-pack flow (this document) means the free engine is a complete product for anyone willing to author their own content. Paid packs are a convenience upgrade, not a paywall on functionality.
- **Buyers can extend their purchase**: someone who buys CPA FAR Pro can still use `importer.html` to add their firm's internal training as a side pack. The premium content lives alongside their own. Both work.

### Roadmap, ordered

1. **Now** — finish the public engine + clean importer (this document). Ship the free build to GitHub. [done]
2. **Week 1-2** — write CPA FAR Pro pack from public AICPA blueprint topics (original content, no prep-provider material).
3. **Week 3** — Gumroad listing, sales page, screenshots, demo video. Sales page hosted at `getaced.com` (Cloudflare Pages, free tier).
4. **Week 4** — soft launch. Post to r/CPA, r/Accounting. Measure conversion with Cloudflare Web Analytics (free, no cookie banner).
5. **Month 2** — add CPA AUD Pro, REG Pro, BAR Pro. Bundle pricing live.
6. **Month 3-4** — add USMLE Step 1 Pharm or Bar Exam MEE based on which has the warmest interest.
7. **Month 5-6** — community pack submissions, optional revenue share with contributors.

The endgame: ACED becomes the engine that other exam-prep creators build on top of. They author packs, sell through Gumroad, and ACED takes a small platform cut. That's the version that gets listed on Acquire.com.

---

## Help and feedback

If you build a pack and want to share it, drop the file into `packs/community/<your-slug>.js` and open a pull request. Bug reports and pack ideas: open an issue on the repo.
