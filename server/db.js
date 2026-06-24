/* server/db.js — durable storage for ACED, with two interchangeable backends.
   ============================================================================
   WHY THIS EXISTS: the original server wrote SQLite to a relative path on the
   host's disk. On Render/Fly/most PaaS that disk is EPHEMERAL — every deploy and
   every idle spin-down WIPES it, silently erasing every account's synced
   progress. This module makes storage durable two ways, and you pick by env:

     DATABASE_URL set   ->  Postgres   (Neon / Supabase / Render PG — free tiers exist)
     DATABASE_URL unset ->  SQLite at DB_PATH (default ./aced.db; on Render mount a
                            persistent disk and set DB_PATH=/data/aced.db)

   Both expose the SAME async repository API, so server.js doesn't care which is
   live. Timestamps are epoch-ms integers; the synced blob is stored as TEXT in
   both backends (no jsonb semantics to diverge). Schemas are identical in shape.

   TEST STATUS: the SQLite path is exercised by a local smoke test. The Postgres
   path uses standard SQL (ON CONFLICT upserts that both engines support) but
   should get one live smoke-test against your real DATABASE_URL before you flip
   accounts on in production.
   ============================================================================ */
"use strict";

const USE_PG = !!process.env.DATABASE_URL;

/* ---------------- SQLite backend (default; great for local dev) ------------- */
function makeSqlite() {
  let Database;
  try { Database = require("better-sqlite3"); }
  catch (e) {
    throw new Error(
      "SQLite backend requested but 'better-sqlite3' is not installed. " +
      "Set DATABASE_URL to use Postgres (recommended for hosting), or run " +
      "`npm install better-sqlite3` for local SQLite. Original error: " + e.message
    );
  }
  const path = process.env.DB_PATH || "aced.db";
  const db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users        (id TEXT PRIMARY KEY, email TEXT UNIQUE, created_at INTEGER);
    CREATE TABLE IF NOT EXISTS magic        (token TEXT PRIMARY KEY, email TEXT, expires INTEGER);
    CREATE TABLE IF NOT EXISTS state        (user_id TEXT, pack_id TEXT, updated_at INTEGER, json TEXT, PRIMARY KEY(user_id,pack_id));
    CREATE TABLE IF NOT EXISTS entitlements (user_id TEXT, pack_id TEXT, granted_at INTEGER, PRIMARY KEY(user_id,pack_id));
    CREATE TABLE IF NOT EXISTS leaderboard  (user_id TEXT, pack_id TEXT, handle TEXT, best_streak INTEGER, readiness INTEGER, mock_best INTEGER, updated_at INTEGER, PRIMARY KEY(user_id,pack_id));
  `);
  // better-sqlite3 is synchronous; wrap results in resolved promises so the API
  // matches the async Postgres backend exactly.
  const P = (v) => Promise.resolve(v);
  return {
    kind: "sqlite (" + path + ")",
    async init() { return; },
    users: {
      findByEmail: (email) => P(db.prepare("SELECT id,email FROM users WHERE email=?").get(email) || null),
      create: (id, email, ts) => P(db.prepare("INSERT INTO users(id,email,created_at) VALUES(?,?,?)").run(id, email, ts))
    },
    magic: {
      create: (token, email, expires) => P(db.prepare("INSERT INTO magic(token,email,expires) VALUES(?,?,?)").run(token, email, expires)),
      find: (token) => P(db.prepare("SELECT token,email,expires FROM magic WHERE token=?").get(token) || null),
      remove: (token) => P(db.prepare("DELETE FROM magic WHERE token=?").run(token))
    },
    state: {
      get: (userId, packId) => P(db.prepare("SELECT json, updated_at FROM state WHERE user_id=? AND pack_id=?").get(userId, packId) || null),
      upsert: (userId, packId, ts, json) => P(db.prepare(
        "INSERT INTO state(user_id,pack_id,updated_at,json) VALUES(?,?,?,?) " +
        "ON CONFLICT(user_id,pack_id) DO UPDATE SET updated_at=excluded.updated_at, json=excluded.json"
      ).run(userId, packId, ts, json))
    },
    entitlements: {
      grant: (userId, packId, ts) => P(db.prepare("INSERT OR IGNORE INTO entitlements(user_id,pack_id,granted_at) VALUES(?,?,?)").run(userId, packId, ts)),
      listPacks: (userId) => P(db.prepare("SELECT pack_id FROM entitlements WHERE user_id=?").all(userId).map(r => r.pack_id))
    },
    leaderboard: {
      upsert: (userId, packId, handle, bestStreak, readiness, mockBest, ts) => P(db.prepare(
        "INSERT INTO leaderboard(user_id,pack_id,handle,best_streak,readiness,mock_best,updated_at) VALUES(?,?,?,?,?,?,?) " +
        "ON CONFLICT(user_id,pack_id) DO UPDATE SET best_streak=excluded.best_streak, readiness=excluded.readiness, mock_best=excluded.mock_best, updated_at=excluded.updated_at"
      ).run(userId, packId, handle, bestStreak, readiness, mockBest, ts)),
      top: (packId, limit) => P(db.prepare(
        "SELECT handle, best_streak, readiness, mock_best FROM leaderboard WHERE pack_id=? AND handle IS NOT NULL ORDER BY best_streak DESC, readiness DESC LIMIT ?"
      ).all(packId, limit))
    }
  };
}

/* ---------------- Postgres backend (durable, free tiers available) ---------- */
function makePg() {
  const { Pool } = require("pg");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Most hosted Postgres (Neon/Supabase/Render) require TLS; they use certs that
    // Node won't verify by default, so relax verification unless told otherwise.
    ssl: process.env.PGSSL === "off" ? false : { rejectUnauthorized: false }
  });
  const q = (text, params) => pool.query(text, params);
  return {
    kind: "postgres",
    async init() {
      await q(`
        CREATE TABLE IF NOT EXISTS users        (id TEXT PRIMARY KEY, email TEXT UNIQUE, created_at BIGINT);
        CREATE TABLE IF NOT EXISTS magic        (token TEXT PRIMARY KEY, email TEXT, expires BIGINT);
        CREATE TABLE IF NOT EXISTS state        (user_id TEXT, pack_id TEXT, updated_at BIGINT, json TEXT, PRIMARY KEY(user_id,pack_id));
        CREATE TABLE IF NOT EXISTS entitlements (user_id TEXT, pack_id TEXT, granted_at BIGINT, PRIMARY KEY(user_id,pack_id));
        CREATE TABLE IF NOT EXISTS leaderboard  (user_id TEXT, pack_id TEXT, handle TEXT, best_streak INTEGER, readiness INTEGER, mock_best INTEGER, updated_at BIGINT, PRIMARY KEY(user_id,pack_id));
      `);
    },
    users: {
      findByEmail: async (email) => (await q("SELECT id,email FROM users WHERE email=$1", [email])).rows[0] || null,
      create: (id, email, ts) => q("INSERT INTO users(id,email,created_at) VALUES($1,$2,$3)", [id, email, ts])
    },
    magic: {
      create: (token, email, expires) => q("INSERT INTO magic(token,email,expires) VALUES($1,$2,$3)", [token, email, expires]),
      find: async (token) => (await q("SELECT token,email,expires FROM magic WHERE token=$1", [token])).rows[0] || null,
      remove: (token) => q("DELETE FROM magic WHERE token=$1", [token])
    },
    state: {
      get: async (userId, packId) => {
        const r = (await q("SELECT json, updated_at FROM state WHERE user_id=$1 AND pack_id=$2", [userId, packId])).rows[0];
        return r ? { json: r.json, updated_at: Number(r.updated_at) } : null;
      },
      upsert: (userId, packId, ts, json) => q(
        "INSERT INTO state(user_id,pack_id,updated_at,json) VALUES($1,$2,$3,$4) " +
        "ON CONFLICT(user_id,pack_id) DO UPDATE SET updated_at=EXCLUDED.updated_at, json=EXCLUDED.json",
        [userId, packId, ts, json]
      )
    },
    entitlements: {
      grant: (userId, packId, ts) => q("INSERT INTO entitlements(user_id,pack_id,granted_at) VALUES($1,$2,$3) ON CONFLICT(user_id,pack_id) DO NOTHING", [userId, packId, ts]),
      listPacks: async (userId) => (await q("SELECT pack_id FROM entitlements WHERE user_id=$1", [userId])).rows.map(r => r.pack_id)
    },
    leaderboard: {
      upsert: (userId, packId, handle, bestStreak, readiness, mockBest, ts) => q(
        "INSERT INTO leaderboard(user_id,pack_id,handle,best_streak,readiness,mock_best,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7) " +
        "ON CONFLICT(user_id,pack_id) DO UPDATE SET best_streak=EXCLUDED.best_streak, readiness=EXCLUDED.readiness, mock_best=EXCLUDED.mock_best, updated_at=EXCLUDED.updated_at",
        [userId, packId, handle, bestStreak, readiness, mockBest, ts]
      ),
      top: async (packId, limit) => (await q(
        "SELECT handle, best_streak, readiness, mock_best FROM leaderboard WHERE pack_id=$1 AND handle IS NOT NULL ORDER BY best_streak DESC, readiness DESC LIMIT $2",
        [packId, limit]
      )).rows
    }
  };
}

const db = USE_PG ? makePg() : makeSqlite();
module.exports = db;
