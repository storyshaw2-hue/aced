# ACED — Backend & Sync Spec (scaffold)

ACED is a **static, client-only** app today: all progress lives in `localStorage`
under the namespace `aced:<packId>:` (e.g. `aced:cpa-far:`). That is enough to
ship and to validate the learning loop. This document specifies the optional
backend that `aced-core.js` is already wired to talk to, so accounts, cross-device
sync, and a leaderboard can be added **without touching the game code**.

Nothing here is required to run ACED. Until an endpoint is configured, every
backend call resolves locally and the app behaves exactly as it does now.

---

## 1. The client contract (already implemented)

`aced-core.js` exposes `ACEDCore.backend`:

```js
ACEDCore.backend.configure({ endpoint: "https://api.youraced.app", token: "<jwt>" });
ACEDCore.backend.isEnabled();          // -> true once an endpoint is set
ACEDCore.backend.push(payload);        // -> POST {endpoint}/sync   (Bearer token)
ACEDCore.backend.pull();               // -> GET  {endpoint}/state  (Bearer token)
```

Both `push` and `pull` return Promises and **never throw**: on network failure or
when no endpoint is configured they resolve to a local/no-op result, so callers
can fire-and-forget.

To turn sync on, call `configure(...)` once at boot (e.g. after a user signs in)
from a small inline script on each page — no engine change needed.

### Local state the client owns (the sync payload)

All of these are JSON values already maintained by `aced-core.js` / the pages:

| Key (under `aced:<packId>:`) | Written by | Meaning |
|---|---|---|
| `mastery` | study.html | `{ moduleKey: points }` — drives Exam Readiness |
| `calib`   | aced-core (calibration) | Brier samples + per-module aggregates |
| `review`  | aced-core (review)      | Leitner boxes per question (`{ qKey: {seen,miss,ok,box,last} }`) |
| `dailyV1` | daily.html              | streak, freezes, per-date results |
| `events`  | aced-core (analytics)   | rolling buffer of product events |
| `subscribers` | index.html          | locally-captured emails (pre-provider) |

A recommended `push` payload:

```json
{
  "packId": "cpa-far",
  "updatedAt": 1719000000000,
  "mastery":   { "F2.M1": 120, "F3.M5": 64 },
  "calib":     { "samples": [], "byModule": {} },
  "review":    { "F2.M1:abc": { "seen": 3, "miss": 1, "ok": 2, "box": 2 } },
  "dailyV1":   { "currentStreak": 5, "bestStreak": 9, "freezes": 1, "results": {} }
}
```

---

## 2. Server endpoints (to build)

Minimum viable sync server. Auth is a Bearer token (JWT or opaque session).

### `POST /sync`
Upsert the authenticated user's state. Body = the push payload above.
**Merge rule:** last-write-wins per top-level key using `updatedAt`, EXCEPT:
- `mastery`: take the **max** per module (progress is monotonic; never regress a learner).
- `dailyV1.bestStreak`: take the **max**. `currentStreak`: trust the client's value for the most recent date.
- `review`: per `qKey`, keep the record with the larger `seen`.

Response: `{ "ok": true, "serverUpdatedAt": <ms> }`.

### `GET /state`
Return the merged server state in the same shape as the payload, or `204`/`null`
for a brand-new user. The client hydrates local storage from this on login,
applying the same merge rules so a device that was offline doesn't clobber newer data.

### `GET /leaderboard?pack=cpa-far` (optional, for the social loop)
Return ranked public stats only — never raw answers:
```json
[ { "handle": "storyshaw", "bestStreak": 22, "readiness": 87, "mockBest": 84 } ]
```
Opt-in: a user is only listed if they set a public handle.

---

## 3. Accounts (to build)

- **Sign-in:** email magic-link or OAuth. On success, mint a token and call
  `ACEDCore.backend.configure({endpoint, token})`, then `pull()` to hydrate.
- **Anonymous → account migration:** on first sign-in, `push()` the existing
  local state so a learner keeps the streak/mastery they built while logged out.
- **Sign-out:** drop the token (`configure({endpoint, token:null})`); local play continues.

Suggested storage: any small Postgres/SQLite table keyed by `user_id + packId`
holding a single JSONB `state` blob plus `updated_at`. The payload is small
(kilobytes), so a document-style row per user-pack is sufficient; no need to
normalize every Leitner box into its own row.

---

## 4. Analytics sink (optional)

`aced-core.js` calls `window.ACED_ANALYTICS_SINK(event, props)` if defined, in
addition to buffering events locally. To send to a provider, define that hook
once at boot:

```js
window.ACED_ANALYTICS_SINK = (event, props) => {
  // e.g. plausible(event, { props }) or posthog.capture(event, props)
};
```

Events currently emitted: `study_opened`, `audit_answered`, `confidence_bet_placed`,
`review_started`, `review_item`, `review_completed`, `mock_exam_started`,
`mock_completed`, `tbs_menu_opened`, `tbs_completed`, `tab_nudge_shown`,
`landing_viewed`, `email_captured`.

---

## 5. Monetization (scaffold only — not built)

ACED has no payment code. When ready, the cleanest seams are:
- **Free vs paid sections:** the section roadmap on the landing page already frames
  FAR as live and AUD/REG/Disciplines as upcoming. Gate a pack behind an
  entitlement check in the same boot script that configures the backend
  (`if (!entitlements.includes(packId)) redirect-to-paywall`).
- **Pro features:** unlimited mock exams, full TBS library, cross-device sync,
  and the leaderboard are natural Pro lines; all already run through `aced-core`,
  so the entitlement check lives in one place rather than in the engine.
- **Billing:** Stripe Checkout + webhook that sets the entitlement the `/state`
  endpoint returns. No engine change required.

This section is intentionally a plan, not an implementation.
