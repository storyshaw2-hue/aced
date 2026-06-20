# ACED v6 — STUDY MODE Spec

## Goal
Single HTML file `study.html` that fuses Ledger Engine v5's roguelike deckbuilder loop with the 1,436-MCQ FAR question bank, mastery tracking, and a meta-progression system. The whole point: **the game makes you ENJOY studying for FAR**, while teaching real concepts through mechanic-level synergies.

## File location
`/home/user/workspace/aced/study.html` — single self-contained file. Loads `far_combined.js` and `questions.js` via relative script tags (these exist already in the same dir).

## Visual identity
- Reuse Ledger Engine v5 CSS (CRT green/amber/magenta, Press Start 2P + VT323 fonts).
- Top banner gets a new "EXAM READINESS" progress bar (0-100%) above the blind banner.
- New right-side rail: "MASTERY" panel showing top 3 strongest topics and bottom 3 weakest, color-coded.

## Core loop (changed from v5)
1. Run starts at FY1 Small Blind. Standard roguelike deckbuilder loop with 4 hands / 3 discards.
2. **Each card is tagged with a FAR module key (e.g. "F1.M1", "F2.M3").** Used to compute mastery.
3. When player plays a hand:
   - Each scored card → +1 mastery in its module.
   - Bonus mastery (+2) if doctrines that match the module fired this hand (e.g. "Revenue Recognition" + REV card from F2.M1 gives bonus mastery in F2.M1).
4. Blind clears → instead of going straight to cashout, **trigger an "Audit Moment"**:
   - Pull 1 MCQ from `window.ACED_FAR_COMBINED` filtered to the player's WEAKEST module (lowest mastery score) — if all 0, random.
   - Show full question UI with confidence picker (LOW ×1 / MED ×1.5 / HIGH ×2.5).
   - Correct → +$5 cash bonus, +5 mastery on that topic, doctrine shop is 1 cheaper.
   - Wrong → +1 mastery still (you learned something), but shop is 1 more expensive AND a "Weakness Card" gets shuffled into your deck (a card that scores 0 chips but counts toward hand size — annoying drag that motivates restudying).
   - Always show the explanation after.
5. Cashout + shop as normal in v5.

## Mastery model
- Keep an in-memory `MASTERY = {moduleKey: integerScore}`.
- After every Audit Moment AND every blind clear, persist to a backend `/api/mastery` endpoint via fetch (POST {moduleKey, delta}) — wrap in try/catch so offline still works.
- Display mastery as 0-100 scale: `Math.min(100, Math.round(score * 2))`.
- 3 weakest topics shown in red; 3 strongest in green.

**Note: localStorage is blocked in iframe.** Use in-memory only, but ALSO POST to a tiny endpoint at `/api/aced/mastery` that the existing index page doesn't have. Skip persistence for v1 — keep state in `window._ACED_STATE` only, document that as a known limitation in the file header.

## Doctrine Codex (NEW)
- New "CODEX" button on top bar (next to DECK).
- Opens a modal grid of all 28 doctrines.
- Locked ones show silhouette + hint about how to unlock (e.g. "Play 3 hands containing both REV and EXP cards").
- Unlocks tracked in-memory for now. List of starter unlocks: Matching Principle, Compounding Interest, Revenue Recognition. Rest progressively unlock when player triggers their condition naturally during play OR clears a specific Audit Moment.

## Exam Readiness Meter
- Header bar: thin progress bar 0-100%.
- Formula: `Math.min(100, (sum of all module mastery scores) / 5)`. With 1,436 MCQs across ~20 modules, hitting 100% means playing meaningfully across all modules.
- At 60% unlock the "MOCK EXAM" link (gated until then with lock icon).
- At 90% show callout "EXAM READY" with confetti.

## Concept weaving (CRITICAL — this is the user's main ask)
Add new doctrines that are exam-mnemonics in disguise:

- **"PUFI"** — Pension, Unrealized AFS gains, FX translation, Instrument-specific credit risk. Play any 2 OCI-tagged cards → +30 chips and a tooltip pops: "PUFI: these go to OCI not Net Income."
- **"FOB Shipping Point"** — If you have Inventory + Cash card together → +5 mult and "Title transfers at shipping; revenue recognized."
- **"Going Concern Threshold"** — 12-month-look-forward window. Already exists, refresh tooltip.
- **"DEALOR"** — Discontinued ops, Extraordinary (legacy), Accounting changes, Loss from operations, Other gains, Regular tax. If you play a hand with 4+ different elements → triggers callout "DEALOR — income statement structure."

Add at minimum 3 new mnemonic-themed doctrines. Keep originals.

## Audit Moment UI spec
Modal with:
- Header: "AUDIT MOMENT — [Module label like 'F2.M3 — Revenue Recognition']"
- Question text in white.
- 4 choice buttons (A-D).
- Confidence picker BEFORE answering: 3 buttons LOW / MED / HIGH (locked styling).
- On submit: result toast + explanation + "CONTINUE TO SHOP" button.

## New cards
Tag every card in POOL with a moduleKey. Examples:
- Sales Revenue → "F2.M1"
- Service Revenue → "F2.M1"
- Cost of Goods Sold → "F2.M1"
- Cash → "F1.M1"
- Accounts Receivable → "F2.M2"
- Inventory → "F2.M3"
- Equipment → "F2.M4"
- Patent / Goodwill → "F2.M5"
- AFS Debt Securities → "F2.M7"
- Bonds Payable → "F3.M4"
- Lease Liability / ROU Asset → "F3.M5"
- Pension Liability → "F3.M5"
- Deferred Tax Liability → "F4.M4"
- Common Stock / Retained Earnings / Treasury Stock / AOCI → "F4.M1"

(Use your best mapping — don't agonize, get them roughly right.)

## Splash menu integration
After building `study.html`, update `/home/user/workspace/aced/index.html`:
- Find the existing "🆕 LEDGER ENGINE" link in the menu (search for `ledger.html`).
- ABOVE it add: `<a class="big" href="study.html" style="display:inline-block;text-decoration:none;color:var(--gold);border-color:var(--gold);text-shadow:0 0 8px var(--gold);box-shadow:0 0 18px rgba(255,210,63,0.45);font-size:1.1em">[ ⭐ STUDY MODE — v6 ]</a>`
- Move the older LEDGER ENGINE link below it (demote to "LEDGER ENGINE — sandbox").

## Deploy
After building:
```bash
cd /home/user/workspace/aced && pplx-tool deploy_website <<'JSON'
{"project_path":"/home/user/workspace/aced","site_name":"ACED — CPA Roguelike","entry_point":"index.html","should_validate":false}
JSON
```
with `api_credentials=["pplx-tool:deploy_website"]`.

## Validation
After deploy, screenshot the splash menu (should show ⭐ STUDY MODE as the topmost button) and screenshot study.html itself.

## Constraints
- DO NOT use localStorage / sessionStorage / indexedDB / cookies — they crash the iframe.
- Use only in-memory state (window-scoped vars).
- Keep file under 2,500 lines.
- VT323 + Press Start 2P fonts loaded from Google Fonts (same CDN as v5).
- All inline styles & scripts (no external CSS/JS files other than the existing far_combined.js + questions.js).
