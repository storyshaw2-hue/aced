# ACED — Strategy & Go-To-Market

> Working strategy note for ACED. Drop this next to `README_CANONICAL.md` and
> `docs/GROWTH_BACKLOG.md`. Market figures are dated and should be re-verified
> before any pricing or launch decision — treat the same way the question banks
> treat ASC references.
>
> _Snapshot date: 2026-06-23._

---

## TL;DR

You have something real, but it is a **specific** something, and naming it
precisely is what changes how you make money.

ACED is a **gamified practice + calibration supplement** — the daily-habit layer
that sits on top of whatever primary course a candidate already bought. It is
**not** a full course, and it should never pretend to be. Priced as a habit
(not a course), built around the one thing competitors don't sell (calibration),
and spread through the communities candidates already live in, it's a strong
solo/indie business: realistically **low six figures, approaching seven** if it
nails multiple sections + distribution. It becomes venture-interesting only if
the exam-agnostic engine is pushed beyond CPA — and that bet should come *after*
a single-vertical proof, not before.

---

## 1. What you actually have

### The assets that matter

- **The core mechanic is the rare part.** Most "gamified" study apps are
  flashcards with points bolted on. ACED isn't: the doctrines *are* the
  accounting concepts. Matching pays out when REV+EXP land together,
  Conservatism doubles loss cards, PUFI / DEALOR are literally mnemonics that
  score. The game and the curriculum are the same object. Hard to copy.
- **317 original, standards-derived MCQs with engineered distractors** (every
  wrong answer is a specific named mistake). The most expensive, most defensible
  thing in the repo. The clean-IP story (nothing lifted from Becker / Wiley /
  Gleim / UWorld) means it can't be litigated and it's sellable.
- **Calibration as a headline.** Brier scoring + confidence betting. Candidates
  don't fail FAR because they can't learn it — they fail because they don't know
  what they don't know. ACED scores exactly that, and almost nobody else sells it.
- **The retention machinery is already built and theoretically sound** — Daily
  Close, streaks + freeze, Leitner spaced review, career ladder, daily objectives.
- **The pack architecture is section-agnostic** (the AUD starter proves it).

### The hard truths

- **It's a supplement, not a course — WTP is capped.** People pay ~$2,500 for the
  thing that licenses them and pocket change for the thing that keeps them
  studying. 317 questions vs. competitors' 8,000–12,000 is fine for a supplement
  and fatal for a "course" claim. (As of mid-2026: Becker ≈ $2,499–$6,349;
  Gleim ≈ $2,499–$3,499 list, 12,000+ MCQs; NINJA = $67/mo, full course,
  cancel-anytime.)
- **The market is real but small and shrinking.** CPA candidate counts have
  fallen for years (the "pipeline crisis"). NINJA — mature, respected, full
  course — serves on the order of **~7,000 candidates/year**. That's roughly the
  size of the entire budget segment you're fishing in.
- **Content depth and distribution are the two bottlenecks**, and both consume
  the scarce resource: founder hours.

### Verdict

A differentiated product in a small, defensible niche. Good indie business.
Not obviously venture-scale **as CPA-only** — see §5 for the bet that changes that.

---

## 2. Positioning reframe

**Stop competing with Becker. Be the daily-habit layer on top of it.**

The buyer is the candidate who *already* has Becker / UWorld / NINJA open in
another tab and can't make themselves grind. ACED is the reason they open *a*
course daily. This reframe drives pricing, marketing, and feature priority.

Brand the whole thing on **calibration**: _"Know what you actually know."_
It's differentiated, intellectually credible, generates endless content angles,
and it's the reason a *supplement* is worth paying for — not more questions,
better feedback.

---

## 3. Monetization (Duolingo model)

- **Free daily loop, forever** — Daily Close + a few runs. Never paywall the
  thing that spreads; it's marketing, not product.
- **Paywall the depth** — full question bank, unlimited runs, Mock Exam, all TBS,
  cross-device sync, readiness analytics.
- **Price as a habit, not a course** — ~$8–12/mo *or* a flat ~$29–39 per-section
  unlock. Offer both and test. Candidates think "I sit for FAR in 6 weeks," not
  "perpetual subscription," so a one-time per-section unlock may out-convert a sub.
- **No pay-to-win.** Candidates resent bought mechanical advantages in a study
  tool. Cosmetic deck skins / themes are fine; bought multipliers are not.

---

## 4. Marketing priorities (ranked)

Scored for a solo founder optimizing limited hours. Ship top-down.

| # | Move | Why it's high-leverage | Depends on |
|---|---|---|---|
| 1 | **Shareable result card + friend-challenge seed** | The only free distribution flywheel. A spoiler-free Wordle-style grid with the URL in the footer turns every daily player into a billboard inside r/CPA and the CPA Discords. Already #1 in `GROWTH_BACKLOG.md`. | `social.js` scaffold + Daily Close |
| 2 | **Plant in candidate communities** | r/CPA, CPA Discord servers, studygram / #cpaexam. Don't advertise — show up. One useful free artifact (a "FAR silent-defaults cheat sheet," which the bank already encodes) beats paid ads in this niche. | A lead-magnet artifact |
| 3 | **Calibration as the brand** | Content engine + the justification for paying for a supplement. Threads like "the 7 silent defaults FAR loves to test" map directly onto existing question patterns. | Copy / positioning only |
| 4 | **Email capture → warm launch list** | The roadmap capture exists; add a lead magnet so anonymous visitors convert. The list is how AUD/REG/BAR launch to a warm audience instead of cold. | Lead magnet + provider |

### Prerequisites before charging money

- **Accounts + cross-device sync — the #1 technical unlock.** localStorage-only
  means a phone+laptop studier loses progress: a conversion and retention killer.
  `docs/BACKEND_SPEC.md` already anticipates this — wire it, add Stripe + a thin
  license check, then charge.
- **Get FAR to ~600+ questions** so the paid tier feels like *months* of value,
  not days. (Still a fraction of NINJA/Gleim — and that's fine for a supplement.)
- **Guide the first run.** Balatro is niche; many accountants won't recognize the
  format. A 30-second "how a run works" so the mechanic doesn't lose first-timers.

---

## 5. Expanding to the other CPA sections

Architecturally you're **done** — section-agnostic packs, proven by the AUD
starter. Each new section = define blueprint/modules → design doctrines (the
creative part) → author the bank (the expensive part) → author TBS.

### Current exam structure (CPA Evolution, still in force 2026)

- **3 Core sections everyone takes:** AUD, FAR, REG.
- **1 Discipline, candidate's choice:** BAR, ISC, or TCP.
- Adjacencies: **FAR → BAR**, **REG → TCP**, **AUD → ISC** (Discipline content
  builds on the related Core).

### Sequencing call: go FAR → BAR, not FAR → AUD

The instinct is "do AUD/REG next — Core = biggest audience." Push back:

- **BAR is built on FAR.** Revenue, leases, and reporting overlap heavily, and
  some content (goodwill, indefinite-lived intangibles) literally **moved out of
  FAR into BAR** under CPA Evolution. So existing cards and some questions are
  partly reusable.
- **Your FAR users are the exact people who'll sit for BAR** — a warm, natural
  upsell ("you just finished FAR, here's BAR"). The current roadmap has this
  backwards (AUD/REG "next," BAR "in the lab"). **Flip it.**
- **Depth-first beats breadth.** A candidate who loves your FAR *and* can get BAR
  from you is worth far more than shallow coverage of all six. Own the
  financial-reporting candidate completely; add AUD/REG later — the engine won't
  care.

### Cost realities

- **Doctrine design is the per-section creative bottleneck** and where the product's
  soul lives. FAR maps gorgeously to a deckbuilder. AUD is conceptual (risk model,
  evidence reliability, independence) — doable, but you *invent* the mechanic, not
  reskin FAR. REG (brackets, basis, deductions) maps fairly cleanly. Budget real
  design time each time.
- **Content hours gate the whole roadmap.** Each section ≈ the lift that produced
  the 300+ FAR items. LLM-draft + CPA-verify (the existing workflow) is the only
  tractable path. **Keep insisting on original / standards-derived content** — it's
  the moat *and* the legal safety. Don't trade it for speed.
- **Tailwind:** FAR has the lowest pass rate of the Core sections (~42% recent).
  The hardest, most-dreaded section is exactly where a "study without the dread"
  product has the most pull — which is why FAR is the right wedge.

---

## 6. The bigger swing (only if the goal is "go big")

The README already says it: **the engine is exam-agnostic.** The valuable asset
isn't "CPA FAR questions" — it's a roguelike study engine + a pipeline that turns
any blueprint into a playable deck. If the loop is shown to measurably lift
retention or pass rates on CPA, that's a wedge into **Bar, NCLEX, USMLE, CFA** —
individually bigger markets with the same gamified-active-recall gap. *That's* the
venture-scale story; CPA is the proof.

**But don't chase it yet.** One great single-vertical proof beats six half-built
ones. Keep the importer ("bring your own deck") alive as the platform seed, prove
FAR (+BAR), *then* decide.

### The fork

- **Bootstrap-and-keep:** ignore §6 entirely. Go deep on FAR → BAR + distribution.
  Target a clean low-six-to-seven-figure indie business.
- **Raise-and-scale:** treat CPA as the proof point, instrument retention/outcome
  metrics hard, and line up the multi-vertical engine narrative — but only once the
  CPA loop demonstrably works.

---

## Immediate next actions

1. Ship the **shareable result card + friend-challenge seed** (free distribution).
2. Wire **accounts + cross-device sync + Stripe** (prerequisite to charging).
3. Grow **FAR to ~600+ questions**; guide the first run.
4. Stand up the **calibration-led positioning** + one free lead magnet; start the
   email list.
5. Then begin **BAR** (doctrines first, then bank), marketed to existing FAR users.
