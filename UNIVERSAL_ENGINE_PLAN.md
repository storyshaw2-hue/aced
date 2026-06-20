# ACED Universal Engine Refactor — Plan

## Goal
Make study.html content-agnostic so users can plug in ANY exam (USMLE, LSAT, bar, AP exams, etc.) just by writing a pack file.

## Files to create

### 1. `/home/user/workspace/aced/packs/cpa-far.js`
Extract these from study.html into a single `window.ACED_PACK = {...}` object:
- POOL (35 cards) → `pack.cards`
- ALLJK (30 doctrines) → `pack.doctrines`
- CONSUMABLES (6) → `pack.consumables`
- BOSSES (4) → `pack.bosses`
- TARGETS, MAXANTE, BLINDLBL → `pack.targets`, `pack.maxAnte`, `pack.blindLabels`
- TAGINFO → `pack.tagInfo`
- STARTER_UNLOCKS, CODEX_HINT → `pack.starterUnlocks`, `pack.codexHints`
- The `checkUnlocks` condition map → `pack.unlockConditions`
- ELEMENTS schema (REV/EXP/ASSET/LIAB/EQUITY with colors) → `pack.elements`
- MODULE_LABELS (the F1.M1 → "Income Statement" map currently embedded in render code) → `pack.modules`

Add metadata: `id: "cpa-far"`, `name: "CPA · FAR"`, `description: "..."`, `examDate: "2026-06-25"`, `questionBank: "far_combined.js"` (which questions.js file provides the bank — engine loads it).

Also include all of `pack.handTypes` (Single Posting / Matching Pair / Matched Entry / Three-Account Entry / Ledger Flush / Full Consolidation with mults 1/2/3/4/6/9).

### 2. `/home/user/workspace/aced/study.html` — refactor
Replace all hardcoded FAR-specific constants with reads from `window.ACED_PACK`:

```js
// Top of script section, replacing all those const blocks:
const PACK = window.ACED_PACK;
if (!PACK) {
  document.body.innerHTML = '<div style="color:#ff5238;padding:20px;font-family:monospace">No exam pack loaded. Pass ?pack=cpa-far in URL.</div>';
  throw new Error('No pack');
}
const POOL = PACK.cards;
const ALLJK = PACK.doctrines;
const CONSUMABLES = PACK.consumables;
const BOSSES = PACK.bosses;
const TARGETS = PACK.targets;
const MAXANTE = PACK.maxAnte || 4;
const BLINDLBL = PACK.blindLabels || ["Q1 CLOSE","MID-YEAR CLOSE","YEAR-END CLOSE"];
const TAGINFO = PACK.tagInfo || {};
const ELEMENTS = PACK.elements;
const STARTER_UNLOCKS = PACK.starterUnlocks || [];
const CODEX_HINT = PACK.codexHints || {};
const MODULE_LABELS = PACK.modules || {};
const HAND_TYPES = PACK.handTypes;
const WEAKNESS_CARD = PACK.weaknessCard || {n:"Unstudied Topic",el:"EXP",v:0,tags:["weakness"],moduleKey:null,weakness:true};
```

Add URL param loader at the very top:
```html
<script>
(function loadPack() {
  const params = new URLSearchParams(window.location.search);
  const packId = params.get('pack') || 'cpa-far';
  const packScript = document.createElement('script');
  packScript.src = 'packs/' + packId + '.js';
  packScript.onerror = () => {
    document.body.innerHTML = '<div style="color:#ff5238;padding:40px;font-family:monospace;background:#000;height:100vh">Pack not found: ' + packId + '. Try ?pack=cpa-far</div>';
  };
  document.head.appendChild(packScript);
  packScript.onload = () => {
    // also load the question bank specified by the pack
    if (window.ACED_PACK && window.ACED_PACK.questionBank) {
      const qScript = document.createElement('script');
      qScript.src = window.ACED_PACK.questionBank;
      qScript.onload = () => window._packReady && window._packReady();
      document.head.appendChild(qScript);
    } else {
      window._packReady && window._packReady();
    }
  };
})();
</script>
```

Refactor `detectHand` to use `PACK.handTypes` (an array of {name, condition, mult}). The condition becomes a function that takes the played cards array.

Make the page wait for `_packReady` before initializing — wrap the existing init code:
```js
window._packReady = function() {
  // existing init code (start(), render(), etc.)
};
```

Update the title bar `// STUDY MODE v6` to show `// ${PACK.name}` instead.

### 3. `/home/user/workspace/aced/library.html` — pack browser
List available packs by reading a hardcoded array (we don't have a backend to enumerate files):

```js
const AVAILABLE_PACKS = [
  { id: "cpa-far", name: "CPA · FAR", description: "Financial Accounting & Reporting", emoji: "📊", status: "ready", cards: 35, doctrines: 30, questions: 449 },
  { id: "cpa-aud", name: "CPA · AUD", description: "Auditing & Attestation", emoji: "🔍", status: "stub", cards: 0, doctrines: 0, questions: 0 },
  { id: "cpa-reg", name: "CPA · REG", description: "Regulation (Tax + Law)", emoji: "⚖️", status: "stub", cards: 0, doctrines: 0, questions: 0 },
  { id: "usmle-step1", name: "USMLE · Step 1", description: "Medical licensing — basic sciences", emoji: "🩺", status: "stub", cards: 0, doctrines: 0, questions: 0 },
  { id: "lsat", name: "LSAT", description: "Law school admission test", emoji: "⚖️", status: "stub", cards: 0, doctrines: 0, questions: 0 },
];
```

Each pack gets a card with: name, description, status badge (READY / STUB / IMPORTING), stats (X cards · Y doctrines · Z questions), and either a "PLAY" button (links to study.html?pack=ID) or a "BUILD THIS PACK" button (links to importer.html?target=ID).

Style: same CRT/Press Start 2P aesthetic.

### 4. `/home/user/workspace/aced/importer.html` — pack builder
This is the killer feature. A page where users:

1. Enter exam name + ID + description
2. Paste a list of modules/chapters (textarea, one per line in "ID :: Label" format)
3. Drop in elements/suits (textarea, "ID :: Label :: #hexcolor", 3-6 lines)
4. Paste a CSV/JSON of cards: "name, element, value, moduleKey, tags"
5. Paste MCQs JSON or use existing parser
6. Click "GENERATE PACK" → builds a downloadable `pack-id.js` file

For doctrine generation: a textarea where they paste "concept rules" in plain English (e.g. "When student plays 2+ cells of the same organ system, +5 mult"), and the importer translates to apply functions.

Manual route only for v1 — no LLM yet, that's a stretch goal. The user fills the form, the page assembles the pack JS string, and offers download.

Add a "STARTER PACK" template button that pre-fills the form with a USMLE Step 1 — Pharmacology example (CNS / Cardio / Autonomic elements; 10 sample cards: Acetylcholine, Propranolol, etc; 3 sample doctrines: Alpha-Beta selectivity, etc.).

Add an "IMPORT FROM PDF" section that for now just shows a placeholder: "Coming soon: paste a textbook PDF and we'll auto-build the pack. For now, use the form above."

### 5. Update `/home/user/workspace/aced/index.html` splash menu
Add two new buttons above STUDY MODE:
- `[ 📚 PACK LIBRARY ]` → library.html
- `[ 🔧 BUILD A PACK ]` → importer.html

And change the STUDY MODE button to default to `study.html?pack=cpa-far`.

## Validation

After all changes:
1. Visit study.html?pack=cpa-far — should work identically to current study.html
2. Visit study.html with no param — should default to cpa-far
3. Visit study.html?pack=fake — should show "Pack not found"
4. Visit library.html — should show all packs with FAR marked READY
5. Visit importer.html — should show the form

## Deploy
```bash
cd /home/user/workspace/aced && pplx-tool deploy_website <<'JSON'
{"project_path":"/home/user/workspace/aced","site_name":"ACED — Universal Exam Engine","entry_point":"index.html","should_validate":false}
JSON
```
with `api_credentials=["pplx-tool:deploy_website"]`.

Screenshot library.html and importer.html after deploy. Verify study.html?pack=cpa-far still plays correctly.
