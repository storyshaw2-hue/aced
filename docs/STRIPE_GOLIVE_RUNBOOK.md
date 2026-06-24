# ACED — Backend + Stripe Go-Live Runbook

A complete, ordered checklist to get accounts, cross-device sync, and the **"Full FAR"
one-time unlock** fully wired and tested — then flip a single switch to start charging.

**The model:** when it's all done, going live is one change in `aced-config.js`
(`enabled: true`). Until then everything stays dormant and the app is 100% free.

> **You keep all accounts and secrets.** Never paste a Stripe **secret** key (`sk_...`) or
> webhook secret (`whsec_...`) into chat, into the GitHub repo, or anywhere in the app's
> client code. They live ONLY in your host's environment variables. The **Price ID**
> (`price_...`) and **publishable** key (`pk_...`) are safe to share.

---

## The flow you're building

```
player clicks UNLOCK
  -> app calls YOUR backend  (/billing/checkout)
  -> backend creates a Stripe Checkout Session
  -> player pays on Stripe's hosted page
  -> Stripe calls YOUR backend  (/billing/webhook)  and records the unlock
  -> app reads /entitlements -> Mock Exam + full TBS library unlock, synced across devices
```

The backend (`server/`) is the required middle layer. Stripe cannot talk to a static
site directly, which is why **Step 1 (host the backend) is the real prerequisite.**

---

## Step 0 — What you already have ✅

- Stripe account created (test/sandbox mode). Good — stay in test mode for all of Steps 1–7.
- The dormant paywall shipped in `aced-config.js` + `study.html` (off by default).
- The backend code in `server/` (Express + SQLite + Stripe + JWT), implementing
  `docs/BACKEND_SPEC.md`.

---

## Step 1 — Host the backend on Render (the prerequisite)

Render is the simplest reliable option and connects straight to your GitHub repo.

1. Go to **https://render.com** and sign up (use **Sign in with GitHub** so it can see the repo).
2. Click **New +** → **Web Service** → connect **storyshaw2-hue/aced**.
3. Configure the service:
   - **Name:** `aced-api`
   - **Region:** Oregon (US-West) or Ohio (US-East) — pick what's near you.
   - **Root Directory:** `server`  ← important; the backend lives in the `server/` subfolder.
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`  (runs `node server.js`)
   - **Instance type:** Free works to test. **For real use, pick the cheapest paid tier**
     (~$7/mo) so the service doesn't sleep and so the disk persists (see the SQLite note).
4. **Add a persistent disk** (Render → your service → **Disks** → Add Disk):
   - **Name:** `aced-data`, **Mount path:** `/data`, **Size:** 1 GB.
   - This is required because the app stores data in SQLite. Without a disk, the database
     resets on every deploy/restart (you'd lose accounts + unlock records).
   - You'll point `DB_PATH` at this disk in Step 3.
5. Don't deploy successfully yet — it needs env vars first (Step 3). Adding them will
   trigger a deploy. After it deploys, note your service URL, e.g.
   `https://aced-api.onrender.com`. **This is your `API_URL`.**

> **SQLite caveat:** the reference backend uses SQLite on one instance. That's fine for
> launch and a single web service **with the persistent disk above**. If you ever scale to
> multiple instances, migrate to Postgres (the code comments call this out). Not needed now.

---

## Step 2 — Create the Stripe Product + Price

In your Stripe dashboard (still **test mode**):

1. Left sidebar → **Product catalog** → **+ Add product**.
2. **Name:** `Full FAR`  ·  **Description:** "One-time unlock — Mock Exam + full
   task-based simulation library."
3. **Pricing:** **One-time** (NOT recurring), amount e.g. **$29.00 USD**.
4. **Save**, then open the product and **copy the Price ID** — it looks like
   `price_1Q...`. This is `PRICE_CPA_FAR`.
5. (Optional, later) repeat for an AUD unlock → `PRICE_CPA_AUD`. Skip for now.

---

## Step 3 — Set environment variables on Render

Render → your `aced-api` service → **Environment** → add each of these.
**Use your Stripe TEST keys** for now (`sk_test_...`). Find them at Stripe → Developers →
API keys.

| Key | Value | Notes |
| --- | --- | --- |
| `APP_URL` | `https://aced.pplx.app` | Where the app is served. Used for CORS + Stripe return URLs. **Must be exact, no trailing slash.** |
| `API_URL` | `https://aced-api.onrender.com` | Your Render URL from Step 1. |
| `PORT` | `8787` | The app's default; Render also injects its own — leaving this is fine. |
| `JWT_SECRET` | (random 64-hex) | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `DB_PATH` | `/data/aced.db` | Points at the persistent disk from Step 1.4. |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Your Stripe **test** secret key. |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | From Step 4 (add after creating the webhook). |
| `PRICE_CPA_FAR` | `price_1Q...` | From Step 2. |
| `NODE_ENV` | `production` | Stops the API echoing the magic-link in responses. |

Save → Render redeploys. Then verify it's up: visit
`https://aced-api.onrender.com/health` — you should see `{"ok":true,"stripe":true}`.
(`stripe:true` confirms the secret key is loaded.)

---

## Step 4 — Create the Stripe webhook

1. Stripe → **Developers** → **Webhooks** → **+ Add endpoint**.
2. **Endpoint URL:** `https://aced-api.onrender.com/billing/webhook`
3. **Events to send:** at minimum `checkout.session.completed` (the unlock trigger).
4. **Add endpoint**, then click it and **reveal the Signing secret** (`whsec_...`).
5. Put that value into Render as `STRIPE_WEBHOOK_SECRET` (Step 3) → save → redeploy.

> The webhook is how an unlock actually gets recorded. If this secret is missing or wrong,
> payments succeed but the app never unlocks — so don't skip it.

---

## Step 5 — Point the app at the backend

This is the only repo change, and **I (your assistant) can do this part for you** —
just give me your Render `API_URL`. It's a one-line edit in `aced-config.js`:

```js
window.ACED_API_URL = "https://aced-api.onrender.com";
```

After this, sign-in + cross-device sync go live (still **free** — no paywall yet).
I'll commit, push, redeploy aced.pplx.app, and confirm `/health` + sign-in work.

---

## Step 6 — Test the WHOLE flow in test mode (paywall still OFF, then ON in test)

1. With `ACED_API_URL` set but `ACED_MONETIZATION` still off: confirm you can sign in on
   the live site and that progress syncs phone ↔ laptop. This validates the backend alone.
2. Now temporarily enable the paywall **in test mode** to rehearse buying. In
   `aced-config.js` uncomment and set:
   ```js
   window.ACED_MONETIZATION = { enabled:true, pack:"cpa-far", price:"$29",
                                lockMock:true, lockTbs:true, freeTbs:5 };
   ```
   (I can stage this behind a quick toggle so it's easy to flip back.)
3. On the live site, open the **Mock Exam** → the **UNLOCK FULL FAR** modal appears →
   **UNLOCK** → Stripe Checkout. Pay with a **test card**: `4242 4242 4242 4242`, any
   future expiry, any CVC, any ZIP.
4. Confirm: checkout succeeds → you're returned to `study.html?paid=1` → the Mock Exam and
   full TBS library are now unlocked, and stay unlocked after refresh / on another device.
5. In Stripe → Developers → **Events**, confirm `checkout.session.completed` fired and your
   webhook returned 200.

If all of that works, the system is **fully wired and proven** — sitting dormant, one switch from live.

---

## Step 7 — Flip to live (only when you actually want to charge)

1. In Stripe, complete **Activate payments / business verification** (bank account, tax,
   identity). Required before real payouts.
2. Swap the **test** keys for **live** keys on Render: `STRIPE_SECRET_KEY=sk_live_...`,
   and create a **live-mode** webhook → new `STRIPE_WEBHOOK_SECRET=whsec_...`, and a
   **live-mode** Price → new `PRICE_CPA_FAR=price_...`. (Test and live objects are separate
   in Stripe — you recreate the product/webhook in live mode.)
3. Make sure `ACED_MONETIZATION.enabled` is `true` in `aced-config.js` (re-enable if you
   toggled it off after testing). Push + redeploy.
4. Do one real low-risk purchase yourself to confirm, then you're live.

---

## Quick reference — what stays where

| Secret / value | Lives in | Safe to share? |
| --- | --- | --- |
| `sk_test_` / `sk_live_` (secret key) | Render env vars only | **No** |
| `whsec_` (webhook secret) | Render env vars only | **No** |
| `JWT_SECRET` | Render env vars only | **No** |
| `price_...` (Price ID) | Render env var + git is fine | Yes |
| `pk_...` (publishable key) | not needed by this backend | Yes |
| `ACED_API_URL`, `ACED_MONETIZATION` | `aced-config.js` (in the repo) | Yes |

---

## What I can do for you vs. what only you can do

**I can:** edit `aced-config.js` (Step 5, and the Step 6 toggle), commit/push, redeploy
aced.pplx.app, verify `/health` and the end-to-end flow, and adjust the paywall copy/price
display. **Only you can:** create the Render + Stripe accounts, enter secret keys into
Render, and complete Stripe business verification — because those require your identity and
must hold secrets I should never see.

**Fastest path:** do Steps 1–4, then send me your Render `API_URL` and tell me you're ready
— I'll handle Step 5 and walk the Step 6 test with you.
