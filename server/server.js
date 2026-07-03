/* server/server.js — ACED reference backend (accounts · sync · Stripe entitlements)
   ============================================================================
   Implements docs/BACKEND_SPEC.md. Pairs with the client contract in aced-core.js
   (ACEDCore.backend / ACEDCore.sync) and the glue in aced-account.js.

   Storage is durable and pluggable via server/db.js:
     DATABASE_URL set   -> Postgres (Neon/Supabase/Render — free tiers exist)
     DATABASE_URL unset -> SQLite at DB_PATH (mount a persistent disk in prod!)
   Email (magic links) is pluggable via server/email.js (Resend, else console).

   Quick start:
     cd server && cp .env.example .env   # fill in values
     npm install
     npm start                            # http://localhost:8787

   Endpoints:
     POST /auth/request   {email}                 -> emails a magic link (dev: also returns it)
     GET  /auth/verify?token=...                  -> mints a session JWT, redirects to APP_URL#token=...
     GET  /state                                  -> merged state for the authed user+pack   (Bearer)
     POST /sync           <snapshot>              -> merge + persist                          (Bearer)
     GET  /entitlements                           -> { packs:[...] }                          (Bearer)
     POST /billing/checkout {pack}                -> { url } Stripe Checkout                   (Bearer)
     POST /billing/webhook                        -> Stripe -> grant entitlement (raw body)
     GET  /leaderboard?pack=cpa-far               -> public opt-in stats
     POST /leaderboard/optin {handle}             -> show on the public board       (Bearer)
     POST /leaderboard/optout                     -> hide from the public board     (Bearer)
     POST /auth/signout-all                       -> revoke ALL sessions for user   (Bearer)
   ============================================================================ */
"use strict";
require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { rateLimit } = require("express-rate-limit");
const { mergeState } = require("./merge");
const { leaderboardMetrics } = require("./leaderboard");
const db = require("./db");
const { sendMagicLink, providerName } = require("./email");

const PORT = process.env.PORT || 8787;
const APP_URL = process.env.APP_URL || "http://localhost:5500";          // where index.html is served
const API_URL = process.env.API_URL || ("http://localhost:" + PORT);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const DEV = process.env.NODE_ENV !== "production";

// Linear email validation (no backtracking regex — avoids ReDoS). Length-capped,
// exactly one '@', non-empty local part, a dotted domain, no whitespace.
function isValidEmail(s) {
  if (typeof s !== "string" || s.length > 254) return false;
  if (/\s/.test(s)) return false;
  const at = s.indexOf("@");
  if (at <= 0 || at !== s.lastIndexOf("@")) return false;
  const domain = s.slice(at + 1);
  if (!domain || domain.length > 253) return false;
  const dot = domain.lastIndexOf(".");
  return dot > 0 && dot < domain.length - 1;
}

// Fail closed: a forgeable signing key in prod = trivial account takeover + free
// entitlements. The render.yaml blueprint generates this for you; this guard
// protects every other deploy path (incl. the documented `cp .env.example`).
if (!DEV && (!process.env.JWT_SECRET ||
    process.env.JWT_SECRET === "dev-secret-change-me" ||
    process.env.JWT_SECRET.length < 32)) {
  console.error("FATAL: set a strong JWT_SECRET (32+ chars) before running in production.");
  process.exit(1);
}

const stripe = process.env.STRIPE_SECRET_KEY ? require("stripe")(process.env.STRIPE_SECRET_KEY) : null;
// pack -> Stripe Price id (one-time per-section unlock). Configure in .env.
const PRICES = { "cpa-far": process.env.PRICE_CPA_FAR, "cpa-aud": process.env.PRICE_CPA_AUD };

const uid = () => crypto.randomBytes(9).toString("hex");

/* ---------- app ---------- */
const app = express();

// Render (and most PaaS) put exactly ONE proxy hop in front of us. This MUST be a
// specific hop count, not `true` — in express-rate-limit v8, `trust proxy: true`
// throws a validation error and then silently lets every request through, so the
// rate limiting below would be a no-op. `1` makes req.ip the real client IP.
app.set("trust proxy", 1);

// Stripe webhook needs the RAW body for signature verification — mount before express.json.
app.post("/billing/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(501).end();
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET); }
  catch (e) { console.error("[stripe] webhook signature verification failed:", e.message); return res.status(400).send("bad signature"); }
  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    const userId = s.metadata && s.metadata.user_id, packId = s.metadata && s.metadata.pack_id;
    if (userId && packId) {
      try { await db.entitlements.grant(userId, packId, Date.now()); }
      catch (e) { console.error("[webhook] grant failed:", e.message); return res.status(500).end(); }
    }
  }
  res.json({ received: true });
});

app.use(express.json({ limit: "2mb" }));
// permissive CORS for the static site (lock APP_URL down in prod)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", APP_URL);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

async function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const tok = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!tok) return res.status(401).json({ error: "no token" });
  let payload;
  try { payload = jwt.verify(tok, JWT_SECRET); }
  catch (e) { return res.status(401).json({ error: "bad token" }); }
  try {
    const u = await db.users.get(payload.sub);
    if (!u) return res.status(401).json({ error: "no account" });
    // Session revocation: bumping users.token_version (POST /auth/signout-all)
    // invalidates every previously-issued JWT. Tokens minted before this feature
    // carry no `tv`, which reads as 0 and matches a fresh account — so old sessions
    // keep working until a deliberate bump.
    if (Number(u.token_version || 0) !== Number(payload.tv || 0)) return res.status(401).json({ error: "session revoked" });
    req.user = payload; req.userRow = u;   // stash so downstream routes skip a re-query
    next();
  } catch (e) { next(e); }                 // DB error -> error middleware (clean 500)
}
function packId(req) { return String(req.query.pack || (req.body && req.body.pack) || "cpa-far").replace(/[^a-z0-9._-]/gi, ""); }

// Express 4 does NOT catch rejected promises from async route handlers — an
// unguarded await that rejects leaves the request hanging with no response. wrap()
// forwards any rejection to the error middleware below, so a transient DB error
// returns a clean 500 instead of a hung connection.
function wrap(fn){ return function(req,res,next){ Promise.resolve(fn(req,res,next)).catch(next); }; }

/* ---------- rate limiting ---------- */
// In-memory store: correct for a single instance (the free-tier setup). If you
// ever scale to >1 instance, swap in rate-limit-redis so buckets are shared.

// Broad backstop on the whole API, per IP. Generous enough that normal sync
// traffic never notices; skips /health so Render's health checks aren't throttled.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 300,
  standardHeaders: true, legacyHeaders: false,
  skip: (req) => req.path === "/health",
  message: { error: "rate_limited" }
});
// Tighter cap on the auth surface, per IP — stops one machine hammering sign-in.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 20,
  standardHeaders: true, legacyHeaders: false,
  message: { error: "too_many_auth_attempts" }
});
// Per *email*, not per IP — the email-bomb defense. At most 5 magic links per hour
// to any single address, regardless of source. Key is normalized to match how
// /auth/request lowercases+trims, so casing/whitespace can't dodge the limit.
const magicLinkLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 5,
  standardHeaders: true, legacyHeaders: false,
  keyGenerator: (req) => String((req.body && req.body.email) || "").trim().toLowerCase(),
  message: { error: "too_many_link_requests" }
});

app.use(apiLimiter);

/* ---------- accounts (magic-link) ---------- */
app.post("/auth/request", authLimiter, magicLinkLimiter, async (req, res) => {
  const email = String((req.body && req.body.email) || "").trim().toLowerCase();
  // Linear, length-capped validation (avoids ReDoS from backtracking regexes).
  if (!isValidEmail(email)) return res.status(400).json({ error: "invalid email" });
  const token = crypto.randomBytes(24).toString("hex");
  try { await db.magic.create(token, email, Date.now() + 15 * 60 * 1000); }
  catch (e) { console.error("[auth] magic create failed:", e.message); return res.status(500).json({ error: "server error" }); }
  const link = API_URL + "/auth/verify?token=" + token;
  // Deliver via the configured provider. Never block the response on delivery, and
  // NEVER leak the link in the API response outside dev (it's a bearer credential).
  sendMagicLink(email, link).catch(err => console.error("[auth] email send failed:", err.message));
  console.log("[auth] magic link issued for " + email + (DEV ? (": " + link) : ""));
  res.json({ ok: true, devLink: DEV ? link : undefined });
});

app.get("/auth/verify", authLimiter, wrap(async (req, res) => {
  let row;
  try { row = await db.magic.find(String(req.query.token || "")); }
  catch (e) { console.error("[auth] verify lookup failed:", e.message); return res.status(500).send("server error"); }
  if (!row || Number(row.expires) < Date.now()) return res.status(400).send("Link expired — request a new one.");
  await db.magic.remove(row.token);
  let user = await db.users.findByEmail(row.email);
  if (!user) { const id = uid(); await db.users.create(id, row.email, Date.now()); user = { id, email: row.email, token_version: 0 }; }
  const session = jwt.sign({ sub: user.id, email: user.email, tv: Number(user.token_version || 0) }, JWT_SECRET, { expiresIn: "60d" });
  // hand the token back to the static app via the URL fragment (not logged by servers)
  res.redirect(APP_URL + "/#token=" + session);
}));

// Revoke every active session for the caller (lost/shared device). Bumps the
// stored token_version so all outstanding JWTs fail the check in auth().
app.post("/auth/signout-all", auth, wrap(async (req, res) => {
  await db.users.bumpVersion(req.user.sub);
  res.json({ ok: true });
}));

/* ---------- sync ---------- */
app.get("/state", auth, wrap(async (req, res) => {
  const pid = packId(req);
  const row = await db.state.get(req.user.sub, pid);
  if (!row) return res.json({ v: 1, pack: pid, updatedAt: 0, data: {} });
  res.json({ v: 1, pack: pid, updatedAt: Number(row.updated_at), data: JSON.parse(row.json) });
}));

app.post("/sync", auth, wrap(async (req, res) => {
  const pid = packId(req);
  const incoming = req.body || {};
  const row = await db.state.get(req.user.sub, pid);
  const stored = row ? { updatedAt: Number(row.updated_at), data: JSON.parse(row.json) } : null;
  const merged = mergeState(stored, incoming);
  const now = Date.now();
  await db.state.upsert(req.user.sub, pid, now, JSON.stringify(merged));
  // opportunistically refresh the public leaderboard row from the merged state,
  // with server-side sanity caps (the snapshot is client-controlled — see leaderboard.js).
  try {
    const u = req.userRow || await db.users.get(req.user.sub);
    const mx = leaderboardMetrics(merged, u && Number(u.created_at), now);
    // handle is null unless the user opted in (POST /leaderboard/optin); null rows
    // are filtered out of the public board, so syncing never exposes anyone.
    await db.leaderboard.upsert(req.user.sub, pid, (u && u.handle) || null, mx.bestStreak, mx.readiness, mx.mockBest, now);
  } catch (e) { /* leaderboard is best-effort */ }
  res.json({ ok: true, serverUpdatedAt: now });
}));

/* ---------- entitlements + billing ---------- */
app.get("/entitlements", auth, wrap(async (req, res) => {
  const packs = await db.entitlements.listPacks(req.user.sub);
  res.json({ packs });
}));

app.post("/billing/checkout", auth, async (req, res) => {
  if (!stripe) return res.status(501).json({ error: "billing not configured" });
  const pid = packId(req); const price = PRICES[pid];
  if (!price) return res.status(400).json({ error: "no price for pack " + pid });
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",                                   // one-time per-section unlock
      line_items: [{ price, quantity: 1 }],
      customer_email: req.user.email,
      success_url: APP_URL + "/study.html?paid=1&pack=" + pid,
      cancel_url: APP_URL + "/?canceled=1",
      metadata: { user_id: req.user.sub, pack_id: pid }
    });
    res.json({ url: session.url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ---------- leaderboard (opt-in public stats only) ---------- */
app.get("/leaderboard", wrap(async (req, res) => {
  const pid = String(req.query.pack || "cpa-far").replace(/[^a-z0-9._-]/gi, "");
  const rows = await db.leaderboard.top(pid, 50);
  res.json(rows.map(r => ({ handle: r.handle, bestStreak: r.best_streak, readiness: r.readiness, mockBest: r.mock_best })));
}));

// Public-handle opt in/out. A user is INVISIBLE on the board until they set a
// handle here. Sanitize to a safe display charset and cap length; 2-char floor
// stops empty/emoji-only handles from squatting the top rows.
function cleanHandle(h) { return String(h || "").trim().replace(/[^A-Za-z0-9 _-]/g, "").slice(0, 24); }
app.post("/leaderboard/optin", auth, wrap(async (req, res) => {
  const handle = cleanHandle(req.body && req.body.handle);
  if (handle.length < 2) return res.status(400).json({ error: "handle must be 2-24 characters (letters, digits, space, _ or -)" });
  await db.users.setHandle(req.user.sub, handle);
  await db.leaderboard.setHandleForUser(req.user.sub, handle);   // reflect on existing rows now
  res.json({ ok: true, handle });
}));
app.post("/leaderboard/optout", auth, wrap(async (req, res) => {
  await db.users.setHandle(req.user.sub, null);
  await db.leaderboard.setHandleForUser(req.user.sub, null);
  res.json({ ok: true });
}));

app.get("/health", (req, res) => res.json({ ok: true, stripe: !!stripe, db: db.kind, email: providerName }));

// Final error handler: any rejection forwarded by wrap() (or next(err)) lands here
// and returns a clean 500 instead of leaking a stack trace or hanging the request.
app.use((err, req, res, next) => {
  console.error("[unhandled]", (err && err.message) || err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "server error" });
});

/* ---------- boot ---------- */
db.init().then(() => {
  if (!DEV && providerName === "console") {
    console.warn("[WARN] NODE_ENV=production but no email provider is configured (RESEND_API_KEY unset).");
    console.warn("[WARN] Magic links will NOT be delivered — set RESEND_API_KEY or sign-in will silently fail.");
  }
  app.listen(PORT, () => console.log(
    "ACED API on " + API_URL +
    "  · db: " + db.kind +
    "  · email: " + providerName +
    (stripe ? "" : "  · Stripe disabled (set STRIPE_SECRET_KEY)")
  ));
}).catch(e => { console.error("FATAL: db init failed:", e.message); process.exit(1); });
