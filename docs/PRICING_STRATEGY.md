# ACED — Pricing Strategy (for wide-scale growth)

**The decision, in one line:** a genuinely free core game, a **subscription (ACED Pro)**
as the revenue engine, and an optional **one-time Exam Pass** for candidates who won't
subscribe for a time-boxed goal. This reconciles the three prices that were floating
around ($9 PDF / $29 unlock / $49 proposal) into one coherent story.

Source of truth for the numbers is `window.ACED_PLANS` in `aced-config.js`; `pricing.html`
renders from it. Change prices there once and both the page and any future in-app surface
follow.

---

## Why this model (not one-time, not PDF-first)

Wide scale in consumer study apps is won by **freemium + subscription** (Duolingo,
Quizlet). The reasons map cleanly onto ACED:

1. **Free maximizes the funnel and word of mouth.** ACED's edge is a game that's fun with
   zero study content, and — once the importer ships — lets anyone study *their own*
   material free. Gating that would choke the exact thing that spreads.
2. **The retention you've already built justifies a subscription.** Leagues, streaks,
   streak-freeze, spaced repetition, readiness — these are recurring-value levers, not
   one-time-purchase features. That's the Duolingo playbook, and it monetizes via subs.
3. **One-time unlocks cap LTV.** A single $29–49 charge doesn't compound. A $59.99/yr
   subscriber is worth multiples of that over a CPA candidate's study window, and far more
   for a lifelong learner.
4. **But exam candidates are time-boxed.** Someone studying 10 weeks for FAR may refuse a
   subscription on principle. The **Exam Pass** captures that buyer without dragging the
   whole product down to one-time pricing.

## The tiers (recommended launch numbers)

| Tier | Price | What it's for |
|---|---|---|
| **Free** (forever) | $0 | The whole game + study your own uploads/paste + samples. The growth engine. |
| **ACED Pro** | **$8.99/mo** or **$59.99/yr** | All official exam packs, unlimited AI question generation, mock exams, full sims, analytics, unlimited streak freezes. The revenue core. |
| **Exam Pass** (one-time) | **$39 / exam track** | Lifetime access to one exam's full bank + sims. For the "pay once, pass, leave" candidate. |
| **FAR PDF** (live today) | **$9** | The existing Gumroad product — reframed as a cheap starter/tripwire while Pro is in the works. |

Rationale for the specific numbers:
- **$8.99/mo** sits in the consumer study band (familiar, impulse-friendly anchor).
- **$59.99/yr ≈ $5/mo (44% off)** — the annual discount is where subscription margin and
  low churn actually come from; push annual hard in the UI.
- **$39 one-time** is set *above* the annual-equivalent enough to nudge toward Pro, while
  staying a clean "just let me pay once." This is where the old $29 unlock lands after a
  modest raise, and it retires the $49 from the proposal (too high for a single track given
  the free tier does so much).
- **Keep the $9 PDF** as the only paid thing that's genuinely live today. Consider having it
  credit toward a first Pro month so it's a tripwire, not a competing product.

## What's honest to show *today* vs. what's "soon"

`pricing.html` already does this: **Free** and the **$9 PDF** render real CTAs (both are
live). **Pro** and **Exam Pass** render a get-notified capture (source-tagged
`pricing-pro` / `pricing-pass`) because subscription billing isn't wired yet. No button
implies a charge that can't be completed. As soon as Stripe is live, flip their
`status:"soon"` → `"live"` in `ACED_PLANS` and give each a real `cta.href`.

## Rollout

1. **Now (shipped):** pricing page live with the model; Free + PDF purchasable; Pro/Pass
   collect emails. Start building the waitlist.
2. **Backend / Stripe (Perplexity):** create the products/prices below, wire subscription
   checkout + webhook → entitlement (JWT), then flip the two tiers to `live`.
3. **At Pro launch:** email the waitlist; offer annual-first with a launch discount; migrate
   the current in-app `$29` unlock to the `$39` Exam Pass (grandfather anyone who paid $29).
4. **Later:** student pricing / regional pricing for scale; bundle multiple exam tracks.

## Exactly what the backend needs (hand-off for Perplexity)

Create in Stripe and mirror the ids into `server/.env` + the server `PRICES`/products map:

- `PRICE_PRO_MONTHLY` — recurring, $8.99/mo (USD)
- `PRICE_PRO_ANNUAL` — recurring, $59.99/yr (USD)
- `PRICE_EXAM_PASS_FAR` — one-time, $39 (USD) — the current FAR unlock, re-priced
  (`aced-config.js → ACED_MONETIZATION.price` is display-only; keep it in sync)
- (PDF stays on Gumroad; no Stripe change needed)

Then:
- Subscription entitlement = "pro" claim in the JWT; gate Pro-only content on that claim
  (reuse the existing unlock plumbing that already gates Mock/TBS).
- On go-live, set `ACED_PLANS.pro.status` and `ACED_PLANS.pass.status` to `"live"` and add
  each tier's real checkout `cta.href`.

## What NOT to do
- No "100% pass guarantee" or fake scarcity to push conversions (declined in the growth
  review — deceptive, and it torches trust). If you add a real money-back guarantee, badge
  that truthfully.
- Don't gate the free game or own-material study — that's the funnel.
