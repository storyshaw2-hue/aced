# ACED — Review & Decisions (growth/monetization proposal + universal-repositioning note)

Reviewed against the **live** architecture (raw HTML/CSS/vanilla JS, IIFE-scoped,
`aced-config.js → aced-core.js → aced-fx.js`) — and against what's already shipped.

Important context that changes two verdicts: **ACED already has a real backend and
paywall.** `aced-api.onrender.com` (Node/Express, Postgres, JWT, Resend) is live, and
`aced-config.js` ships a safe-by-default one-time **$29 "Full FAR" unlock** (gated only
when the backend + Stripe are live; free tier never locked). So some proposed modules
reinvent — more weakly — something you've already built better.

---

## Document 1 — five monetization/growth modules

### Module 1 · Programmatic SEO — BUILT, but WITHOUT the cloaking
**Declined:** rendering the correct answer into the HTML for crawlers while hiding it
from users behind a CSS blur. That's **cloaking** (serving search engines content you
deny humans). Google's spam policies treat it as a violation that can **de-index the
whole domain** — the exact opposite of the goal. It also protects nothing: the blur
comes off in one DevTools click / view-source / reader mode.

**Built instead:** `scripts/json-to-html`-style generator (`scripts/seo-pages.js`) that
emits genuinely useful pages — a curated **sample** of real questions per FAR module,
each with its answer and explanation **visible to everyone** — plus a `/learn/` hub and
sitemap entries. Real content is what actually ranks, and it's fully within guidelines.
The paid product stays the *adaptive system* (spaced repetition, mastery, runs), not a
hidden answer key, so you can give a taste and still sell. → 20 topic pages + hub, live-ready.

### Module 2 · 5-question "frictionless try" interceptor — REFINED (not shipped as-is)
Freemium metering is legitimate, and the clean way to add it is a **decoupled event/hook**,
not edits inside the render loop. But two cautions:
1. **Don't meter the free arcade.** ACED's whole edge is a genuinely free, fun game that
   spreads by word of mouth. Gating it at 5 questions kills the top of the funnel. Meter
   *premium study content* (mock exam / full TBS) — which your existing `ACED_MONETIZATION`
   already does, more cleanly, via the backend.
2. If you want a metered taste on a *specific* premium surface, I'll add a small
   `aced-gate.js` that listens for a `aced:question-answered` event and opens the existing
   unlock modal at N — zero coupling. Say the word and I'll wire it to that surface only.

### Module 3 · Static Stripe + `localStorage` unlock — DECLINED (you have better)
As written, `success.html?session_id=X → localStorage.unlocked=true` isn't just
"spoofable by savvy users" — **anyone** who visits that URL unlocks for free, since nothing
is verified. More to the point, you already have a backend that can verify the Stripe
session and issue a real entitlement (JWT). Use that path (it's the Task 4 work already in
flight). A no-backend client unlock would be a strict downgrade from what's deployed.

### Module 4 · White-label config object — BUILT
Good engineering and a real revenue path (institutional resale). Shipped:
- `aced-config.js` extended with an optional `window.ACED_BRAND` block (defaults = ACED,
  so nothing changes until a client overrides it).
- `aced-brand.js` — applies colors as CSS variables on `<html>` **synchronously** so
  they're set before first paint (no FOUC), then swaps `[data-brand-name]` /
  `[data-brand-logo]` / `[data-brand-tagline]` text at DOMContentLoaded.
- **FOUC answer:** load order in `<head>` is `aced-config.js → aced-brand.js → stylesheet`.
  An inline custom property on `<html>` overrides the stylesheet `:root{}`, so the first
  paint already uses the client palette. (Functionally tested: an override reskins colors,
  title, and wordmark.)

### Module 5 · Trust & scarcity injector — SPLIT
- **Dynamic year — BUILT.** Appended to `aced-fx.js`: fills `[data-year]` / `.dynamic-year`
  with the real current year. Honest, zero-maintenance.
- **"Iron-Clad 100% Pass Guarantee" badge — DECLINED.** No prep tool can guarantee a pass;
  for anxious test-takers this is a deceptive, unsubstantiated advertising claim and it
  contradicts ACED's own honesty principle. If you offer a genuine money-back guarantee,
  we badge *that* truthfully ("30-day money-back") — happy to build it.
- **Manufactured scarcity — DECLINED.** Fake "N seats left" is a dark pattern that torches
  trust the instant users notice. Honest alternatives I'll build on request: a real exam-date
  countdown, "updated for {year}", or true user/among-friends counts.

---

## Document 2 — "universal study engine / upload-first" repositioning

Largely **agree**, and much is **already done**:
- **"Study anything" repositioning — SHIPPED.** Landing, manifest, and roadmap already lead
  with the universal framing; CPA FAR is positioned as the flagship demo, not the identity.
- **Importer as the core / front door — agree.** Worth making `importer.html` a true
  "what are you studying? upload / paste / sample" entry. I can do the front-door redesign
  and the manual + paste paths next (focused pass, so it's done well).
- **Real PDF/notes → pack pipeline — agree it's the #1 strategic build.** But automatic
  extraction/question-generation needs an LLM behind a server proxy + an API key, which is
  the deploy/secrets side (Perplexity / the backend). The client seam is ready — the importer
  already produces packs and the arcade already loads any pack — so the missing piece is
  specifically the AI extraction service. I won't fake AI output; I'll scaffold the UX and
  the request seam so it lights up the moment the proxy exists.
- **Subject-neutral default language (Boss Check vs Audit Moment, etc.) — agree in principle,
  do it carefully.** A sweeping rename across the 247 KB CPA engine is high-risk and CPA is the
  flagship skin. Best done as a deliberate label-map pass (neutral defaults + CPA as a skin),
  not a find/replace. Flagged as its own task rather than rushed here.

---

## Shipped this pass (all syntax-checked + tested)
- `scripts/seo-pages.js` + `/learn/` (20 topic pages + hub) + `sitemap.xml` (14 → 35 URLs)
- `aced-config.js` (adds `ACED_BRAND`) + `aced-brand.js` (FOUC-safe injector)
- `aced-fx.js` (dynamic year)

## Deploy notes
- Static-only; no backend redeploy needed for any of this.
- To use white-label on a page, add `<script src="aced-brand.js"></script>` in `<head>`
  right after `aced-config.js` (before the stylesheet), and tag brand text with
  `data-brand-name` / `data-brand-logo` / `data-brand-tagline`.
- `/learn/` pages are self-contained; just publish the folder.

## Still open (unchanged)
- **Pricing story:** $9 Gumroad PDF vs $29 in-app unlock vs the $49 floated in Doc 1 — pick
  one narrative. The $29 unlock and the $9 PDF are different products; the $49 isn't wired anywhere.
- Backend/Stripe go-live (Task 4), importer LLM proxy (Task 14) — both Perplexity/secrets side.
