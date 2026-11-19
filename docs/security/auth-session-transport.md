# Authentication, session, token-storage, logging and database-transport hardening (Phase A)

Baseline: `main` @ `4a747d8aecd69a17755b31ee8f937a9646c2af86`, which includes PR #46 (merge commit `7ed7bf0`). Line numbers below refer to that baseline.

## 1. Findings

| ID | Finding | Verdict | Evidence on the baseline | What changed |
|---|---|---|---|---|
| A1 | A link scanner or preview can consume a sign-in link | **Confirmed** | `server/server.js:L214-L228`: `GET /auth/verify` looks up the token (`L219`), deletes it (`L222`), mints a 60-day session (`L225`) and redirects with it (`L228`). A mail scanner's GET burns the link, and the session JWT appears in the redirect `Location` header it receives. | The emailed link is `APP_URL/#signin=<token>`, a fragment that never reaches a server. Nothing happens until the user clicks **Sign in** in the browser that requested the link. That click POSTs `/auth/redeem` with the browser's pending states. `GET /auth/verify` now returns 410 and touches nothing. |
| A2 | Session tokens are valid for 60 days | **Confirmed** | `server/server.js:L225` `expiresIn: "60d"` | **Lifetime unchanged** (owner decision, §4). Sessions now carry a random `sid`, so a single session can be revoked. Verification pins `HS256` and rejects any session without `exp`. |
| A3 | Session tokens are in browser-readable storage | **Confirmed** | `aced-account.js:L29`, `L33`: `localStorage["aced_session"]` | **Not changed.** Moving to an HttpOnly cookie needs a hosting decision (§5). It is mitigated by server-side revocation on sign-out. |
| A4 | Server logs contain sign-in emails | **Confirmed** | `server/server.js:L210` logs the address in every environment. `server/email.js:L26` logs the recipient. `server/email.js:L45` puts the provider error body (which can echo the address) into an error that `server.js:L209` logs. `server.js:L333` logs raw error messages, and a malformed JSON body can be quoted in them. | Auth logs are JSON lines with only `ts`, `rid` (a random UUID per request), `route` and `outcome`, each from an allowlist. Emails, links, tokens, states, sessions, digests and error messages are never logged. |
| A5 | Development logs contain full sign-in links or raw auth material | **Confirmed** | `server/server.js:L210` appends the link when `NODE_ENV` is not `production`. `server/email.js:L27` logs the full email body, link included, whenever no email provider is set, **including in production**. `server/server.js:L211` returns the link to any caller when `NODE_ENV` is not `production`. | The console provider logs only "delivery skipped". The link is returned in the API response only when `NODE_ENV` is not production **and** `APP_URL` is localhost or 127.0.0.1. |
| A6 | One-time sign-in tokens are stored raw | **Confirmed** | `server/db.js:L41`, `L118` (`magic.token` primary key). `server/server.js:L204` stores the raw token. | `magic.token` now stores `SHA-256(token)`, and the additive column `magic.state_hash` stores `SHA-256(state)`. Redemption is an atomic `DELETE … RETURNING`, so a token works exactly once, even under concurrent requests. |
| A7 | Logout or revocation is incomplete | **Partially confirmed** | `aced-account.js:L195`: `signOut()` only drops the local copy. The token stays valid on the server for up to 60 days, and the core backend stays configured. `POST /auth/signout-all` (token_version) already worked. | `signOut()` clears the local session, unconfigures sync and calls the new `POST /auth/signout`, which records the session's `sid` in `revoked_sessions` until the token would have expired. |
| A8 | Account switching can leave queued auth or progress state | **Confirmed** | `aced-account.js:L163-L172`: any stored session pushes this browser's local progress (`L169`). After signing in as account B in a browser that held account A's progress, A's progress is uploaded into B, and B's pull can overwrite the local copy. | The first account to sync in a browser becomes its owner (`aced_sync_owner`). If a different account signs in there, sync is **held**: nothing is pushed or pulled, and local history is untouched. |
| A9 | Production database TLS verification is disabled | **Confirmed** | `server/db.js:L110` `ssl: … { rejectUnauthorized: false }` unless `PGSSL=off`. The comment says it was done because hosted providers' certificates "Node won't verify by default". | `server/db-tls.js`: production always verifies certificates and **refuses to start** on `PGSSL=off`, `PGSSL=no-verify`, an unknown `PGSSL`, or a URL `sslmode` of disable/allow/prefer/no-verify. Local development must opt in explicitly. |

## 2. Sign-in flow after this change

1. `signIn(email)` creates a random 256-bit `state` and keeps it in this browser (15 minutes, at most 5 pending). It POSTs `/auth/request {email, state}`.
2. The server stores `SHA-256(token)`, the email, the expiry and `SHA-256(state)`, then emails `APP_URL/#signin=<48-hex token>`. The state is **not** in the link.
3. Opening the link loads the static app. `aced-account.js` scrubs the fragment straight away with `history.replaceState` and keeps the code in memory only.
   - If this browser has no pending state, or the code is malformed, the link is refused locally. This covers another browser, a link preview and an automated fetch. The neutral PR #46 notice is shown and no request is sent.
   - Otherwise a dialog asks *"Finish signing in to ACED in this browser?"* with **Sign in** and **Cancel**. Sync is paused until the user chooses.
4. **Sign in** POSTs `/auth/redeem {token, states}`. The request carries no `Authorization` header. The server refuses when:
   - the token's shape is wrong;
   - no row matches the token digest;
   - the token has expired;
   - no pending state's digest matches the stored digest (the comparison is constant-time).

   Refusals before the consume step leave the token unconsumed. The consume is atomic, so a concurrent replay loses. Every refusal is the same `400 {"error":"link_unusable"}`.
5. On success the client stores the session, clears the pending states and starts sync, subject to the account-switch guard. On any refusal it keeps the existing session, uploads nothing and shows the neutral notice.

Why a fetch can't authenticate: the link's only secret is in the fragment, which HTTP clients never send. Even a scanner that runs JavaScript lacks the requesting browser's state, so its redeem is refused. A *leaked* link is also useless without that state, because the state never appears in the link.

## 3. Logging contract

Allowed fields: `ts`, `rid`, `route` (`auth_request`, `auth_redeem`, `auth_verify_legacy`, `auth_signout`, `auth_signout_all`, `auth_session`, `server`) and `outcome` (the allowlist in `server/auth-flow.js`, `LOG_OUTCOMES`). Any other value is replaced with `other`. Token and state digests are never logged, so they can't become tracking identifiers. `rid` is random per request and is also returned as `X-Request-Id` for support correlation. Boot-time DB failures log only an error code. Billing/Stripe log lines are out of Phase A scope and unchanged.

## 4. Session lifetime (A2): current and options

- **Current, and kept:** a 60-day bearer JWT with no refresh.
- **Options for the owner:** (a) 30 days, or (b) 14 days with re-sign-in prompts. Either is a one-line change (`SESSION_TTL` in `server/server.js`). User impact: more frequent sign-in emails. Compatibility: existing tokens keep their original expiry. Rollback: restore the constant.
- **Added now:** per-session revocation (`sid`), pinned algorithm, and a mandatory `exp`.
- **Pre-deploy sessions** have no `sid`. They stay valid until expiry or `signout-all`. Signing out of one clears it locally, but `/auth/signout` reports `revoked:false`. An owner can force a one-time re-sign-in by rejecting sid-less tokens. That isn't done here because it would sign everyone out.

## 5. Browser storage (A3): alternatives, not implemented

`localStorage` is readable by any script on the origin. Safe alternatives:

1. **HttpOnly, Secure, SameSite cookie on a same-site API host** (for example `api.<app domain>`). This is the strongest option. It needs DNS and a custom domain on the API host, CORS with credentials, and CSRF protection (SameSite plus an Origin check).
2. **A short-lived access token in memory plus a refresh cookie.** This needs the same hosting change, plus a refresh endpoint and rotation.
3. **`sessionStorage`.** It is smaller in time than localStorage but still script-readable, and it breaks sign-in across tabs. It is not recommended.

All three need owner decisions about hosting, domains and UX, so none is implemented. The XSS-adjacent risks noted in the audit (the CSP is report-only, and `importer-classic.html` loads CDN scripts without SRI) raise the priority.

## 6. Database TLS (A9)

Production verifies the server certificate against Node's trust store. If the provider's CA isn't publicly trusted, supply it through Node's standard `NODE_EXTRA_CA_CERTS=/path/to/ca.pem`, from a secret file mount. **Don't commit the certificate.** Local development must opt in explicitly with `PGSSL=no-verify` (TLS without verification) or `PGSSL=off` (no TLS). Both print a warning and are refused in production. Errors never include the connection string.

**Deployment blocker:** before deploying, confirm that the production database's certificate chain validates from the API host. The repository can't show whether Render's (or Neon's or Supabase's) certificate is publicly trusted, or whether Render's internal connection string uses TLS. If validation fails, the API refuses to start (fail closed), so it won't silently fall back to an insecure connection.

**Render finding (November 2026):** Render documents that its internal (private-network) Postgres connections use self-signed certificates and don't support `verify-ca` or `verify-full` ([Render docs](https://render.com/docs/postgresql-creating-connecting)). A Blueprint `fromDatabase.connectionString` is that internal URL, so the API would refuse to start with it. `render.yaml` therefore takes `DATABASE_URL` as a dashboard secret pointing at a host with a publicly trusted certificate (Neon by default). A local run of the production configuration against Postgres 17 over verified TLS started and logged the `application_connection_verified` marker; the same run against an untrusted certificate exited with `database_tls_not_verified`. That local run does not replace the check on the real host: the blocker is cleared only when the deployed API starts and logs the marker.

### 6a. Supported runtimes and hosting on Vercel (November 2026)

The database transport (`server/db-tls-transport.js`) refuses every Node major that is not in its `SUPPORTED_NODE_MAJORS` list. It was written against Node 20 only. Node 20 reached end-of-life on April 30, 2026, no longer receives security fixes, and Vercel stopped accepting it for new deployments on October 1, 2026 ([Vercel changelog](https://vercel.com/changelog/node-js-20-is-being-deprecated)). Node 24 is now also listed. Every other major, including 22 and 26, is still refused before the driver is resolved.

Evidence for Node 24 (local, against Postgres 17 with a private test CA; `NODE_ENV=production`):

| Check | Result |
|---|---|
| Unit suite (`db-tls.test.js`, which runs the transport unit tests) on Node 20.20.2 and 24.22.3 | 19 + 51 passed, 0 failed on each |
| Certificate signed by a trusted CA, matching hostname | Connected; `application_connection_verified` marker logged; `/health` reported `db: postgres`; a write succeeded |
| Certificate from an untrusted CA | Refused: `database_tls_not_verified` |
| Trusted CA but hostname mismatch (connecting by IP to a certificate issued for a name) | Refused: `database_tls_not_verified` |
| Connection string in the form Neon issues (`sslmode=require&channel_binding=require`), with `PG*` variables also set | Connected and verified |

**Not done:** the standalone native driver suite (`db-tls-transport.test.js --baseline`) needs the separately prepared, source-inspected dependency fixture, which is not in the repository. It has not been re-run on Node 24, and the pg driver source inspection has not been repeated for Node 24. The transport's own runtime checks (`socket.authorized`, peer certificate identity, and the rest of `verified()`) still run on every connection and fail closed if a field is missing or different.

**Serverless behaviour.** `server/server.js` now exports the Express app. Run directly it boots as before. Imported by a serverless host, the first request initialises the database; until that succeeds every request, including CORS preflights and `/health`, gets `503 service unavailable`. So `/health` returning `ok: true` on the deployed host still means the database connection was verified.

**Rate limits.** The `express-rate-limit` counters are in memory, so on a serverless host they are per instance. The per-address sign-in cap is therefore also enforced in the database: at most 5 unredeemed, unexpired links per address (`MAX_ACTIVE_LINKS_PER_EMAIL` in `server/auth-flow.js`). The per-IP limits remain best-effort on a serverless host.

**Email delivery.** A serverless host pauses a function once its response is sent, and work still in flight may not resume ([Vercel email guide](https://vercel.com/kb/guide/sending-emails-from-an-application-on-vercel)). `/auth/request` used to answer first and send the email afterwards. On the first Vercel test (November 18, 2026) the request logged `link_issued` and neither `email_sent` nor `email_send_failed`. The request now waits for the provider call to settle before answering, for at most 10 seconds (`EMAIL_WAIT_MS`); the Resend call itself gives up after 8 seconds. The answer is identical whether delivery succeeded, failed or is still pending, so it reveals nothing; the outcome is logged as a code only (`email_sent`, `email_send_failed`, or the new `email_send_pending`). Delivery is still a single attempt with no retry: a failed send means the user requests another link.

## 7. Compatibility and migration

- **Schema:** additive only. It adds `magic.state_hash` and a new `revoked_sessions` table, both idempotent at boot. No rows are deleted or rewritten. Pre-deploy `magic` rows (raw tokens) can't be matched by digest; they expire within 15 minutes and the hourly gc purges them.
- **Outstanding links:** links emailed before the deploy stop working. They point at `GET /auth/verify`, which now answers 410 with "request a new sign-in link". Every link is valid for at most 15 minutes, so the impact window is about 15 minutes.
- **Clients:** the client and server must deploy together. A cached pre-deploy page that receives a new `#signin=` link won't recognise it. The user reloads, or requests a new link from an updated page. A pre-deploy client can't complete a new sign-in, and nothing is consumed in that case.
- **Existing sessions:** they keep working. The account-switch guard adopts the first session seen as owner, so existing users keep syncing.
- **Anonymous local play:** unchanged. Without a session, no network request is made.

## 8. Deployment sequencing

1. Confirm the database certificate validates (§6), or set `NODE_EXTRA_CA_CERTS`. Confirm that `PGSSL` is unset and that `DATABASE_URL` has no insecure `sslmode`.
2. Confirm `NODE_ENV=production` (already in `render.yaml`).
3. Deploy the API, then the static site, back to back.
4. Smoke test: request a link, open it in the same browser, click **Sign in**, sync, sign out, then confirm the old token gets a 401.

## 9. Rollback

Revert the Phase A commit and redeploy the API and the static site together. The additive column and table can stay; the old code ignores them. Links issued while Phase A was live become unusable after the rollback, because the old code looks up raw tokens. That window is at most 15 minutes. Sessions minted under Phase A stay valid on the old code (its `tv` check ignores `sid`), but revocations recorded in `revoked_sessions` stop being enforced. No user data needs repair.

## 10. Remaining risks

- A3: the session is still script-readable (§5).
- A2: the 60-day lifetime is unchanged, and pre-deploy sessions can't be revoked individually.
- The session JWT still carries the email address (`ACEDAccount.email()` reads it), and that address is base64 in localStorage.
- Held sync after an account switch has no UI explanation yet. The progress stays local until the owner decides on a "switch account" flow.
- The `#token=` capture path from PR #46 stays for compatibility, state-bound as before. The server no longer issues such links, so removing that path and its tests needs owner approval.
- Rate limits stay in-memory per instance.
