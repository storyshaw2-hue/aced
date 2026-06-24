# ACED — Accounts, Sync & Stripe

_Added 2026-06-23. The reference backend that turns ACED from a local-only app into a
multi-device product you can charge for. Implements `docs/BACKEND_SPEC.md` and pairs with the
existing client contract in `aced-core.js` (`ACEDCore.backend` / `ACEDCore.sync`)._

## What this is — and isn't

- **Is:** a small, correct, runnable server (`server/`) + a thin client glue file
  (`aced-account.js`) that add email sign-in, cross-device sync, and Stripe per-section
  unlocks. SQLite for zero-infra local dev.
- **Isn't:** one-click. It needs deploying somewhere, your Stripe keys, and (for production
  sign-in emails) an email provider. Until you set `window.ACED_API_URL` on a page, the client
  glue is a **no-op** — every page keeps working exactly as today (localStorage only). Nothing
  about the static site breaks while the backend is unconfigured.

## The pieces

```
server/
  server.js         Express + better-sqlite3 + Stripe. All endpoints below.
  merge.js          PURE sync-merge (mastery=max, bestStreak=max, review by larger seen, else LWW).
  merge.test.js     Zero-dep tests for the merge (node merge.test.js → 6 passed).
  package.json      deps: express, better-sqlite3, jsonwebtoken, stripe, dotenv
  .env.example      copy to .env and fill in
aced-account.js     client glue (load AFTER aced-core.js). No-op until ACED_API_URL is set.
```

| Endpoint | Auth | Purpose |
|---|---|---|
| `POST /auth/request {email}` | — | Create a 15-min magic link. Dev returns the link; prod emails it. |
| `GET /auth/verify?token=` | — | Mint a 60-day session JWT, redirect to `APP_URL/#token=…`. |
| `GET /state?pack=` | Bearer | Return the merged state snapshot for this user+pack. |
| `POST /sync` (snapshot body) | Bearer | Merge the client snapshot into stored state (see merge rules). |
| `GET /entitlements` | Bearer | `{ packs:[…] }` — pack ids the user owns. |
| `POST /billing/checkout {pack}` | Bearer | Create a Stripe Checkout session → `{ url }`. |
| `POST /billing/webhook` | Stripe sig | On `checkout.session.completed`, grant the entitlement. |
| `GET /leaderboard?pack=` | — | Opt-in public stats (best streak / readiness). |

## Run it locally

```bash
cd server
cp .env.example .env
# set JWT_SECRET:  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npm install
npm start            # → http://localhost:8787   (Stripe disabled until keys are set)
npm test             # → 6 passed  (the merge logic)
```

Sync + accounts work with **no Stripe keys** — billing endpoints simply return 501 until you
add them, so you can validate sign-in and cross-device sync first.

## Wire the client (per page that should sync)

Add the config line **before** the core, then the glue **after** it:

```html
<script>window.ACED_API_URL = "https://api.youraced.app";</script>
<script src="aced-core.js"></script>
<script src="aced-progress.js"></script>
<script src="aced-fx.js"></script>
<script src="aced-account.js"></script>   <!-- new -->
```

A minimal sign-in control anywhere in the UI:

```js
// prompt → magic link. In dev the link auto-opens; in prod the user checks their email.
ACEDAccount.signIn(prompt("Email for sync + unlocks:"));
// after they return via the link, aced-account.js captures the token from the URL fragment,
// configures ACEDCore.backend, and hydrates with push-then-pull (offline progress is merged,
// never lost — mastery and streaks take the max server-side).
```

## The auth flow (no passwords)

1. `signIn(email)` → `POST /auth/request` → server stores a one-time token, emails the link.
2. User clicks `…/auth/verify?token=…` → server mints a JWT and redirects to `APP_URL/#token=…`.
3. `aced-account.js` reads the `#token` fragment, stores it, strips the URL, configures the
   backend, and runs `sync.push()` then `sync.pull()` so the device ends on merged state.

The token rides in the URL **fragment**, which browsers don't send to servers or put in logs.

## Charge for it (Stripe)

1. In the Stripe dashboard create a Product + one-time **Price** per section (e.g. FAR unlock
   at your `STRATEGY.md` price point). Put the price ids in `.env` (`PRICE_CPA_FAR`, …).
2. Add `STRIPE_SECRET_KEY` and, for the webhook, `STRIPE_WEBHOOK_SECRET`
   (`stripe listen --forward-to localhost:8787/billing/webhook` in test mode).
3. Buy flow: `ACEDAccount.checkout("cpa-far")` → redirects to Checkout → on success Stripe
   calls the webhook → the entitlement row is written → `ACEDAccount.has("cpa-far")` is true.

### Gating the free/paid split

Per `STRATEGY.md` the free tier is the Daily Close + a few full runs; depth and other sections
are paid. Gate a paid surface like this (it's a no-op on unconfigured builds, so it won't lock
anyone out before you're ready):

```js
// at the top of a paid page/section:
ACEDAccount.requireEntitlement("cpa-far", { redirect: "/?upgrade=cpa-far" })
  .then(function (ok) { if (!ok) return; /* …render the paid content… */ });
```

Keep `daily.html` and the first runs ungated — that's the funnel. Gate Mock Exam depth, full
question access, and additional packs (AUD/BAR) behind `requireEntitlement`.

## Before production

- Swap SQLite → Postgres (replace the three `db.prepare(...)` helpers; shapes are identical) for
  durability and concurrent writes.
- Lock CORS to your real `APP_URL` (already wired from env).
- Plug a real email provider into `/auth/request` (Postmark/SES/Resend) and set
  `NODE_ENV=production` so the magic link stops being returned in the API response.
- Verify the Stripe webhook secret is set in the deployed env, not just locally.
