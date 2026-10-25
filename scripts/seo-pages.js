#!/usr/bin/env node
/* ============================================================================
   ACED — scripts/seo-pages.js
   Programmatic SEO generator for long-tail exam search traffic.

   WHY THIS IS NOT THE ORIGINAL "BLUR THE ANSWER FOR CRAWLERS" DESIGN
   ------------------------------------------------------------------
   The proposed Module 1 rendered the correct answer into the HTML for search
   engines but hid it from humans behind a CSS blur. That is textbook *cloaking*
   (serving crawlers content you deny users). Google's spam policies treat it as
   a violation that can DE-INDEX THE WHOLE DOMAIN — the opposite of the goal.
   It also doesn't protect anything: the blur is removed in one DevTools click,
   view-source, or reader mode. So it's a real business risk for zero benefit.

   This generator instead builds pages that are honestly useful to everyone:
   a curated SAMPLE of real practice questions per topic, each with its answer
   and a genuine explanation shown in plain sight. That's what actually ranks
   (real content, real dwell time) and it's fully within search guidelines. The
   paid product is the *adaptive system* (spaced repetition, mastery, runs,
   readiness) — not a hidden answer key — so we can give a taste and still sell.

   WHAT IT DOES
   ------------
   - Reads content/cpa-far/*.json (schema: {id,source,diff,q,choices,answer,explain,ref}).
   - Groups questions by module code (e.g. "F1.M1").
   - Emits one static page per module under /learn/, capped at CAP questions
     (a free sample, not the full bank), plus a /learn/ hub that links them all.
   - Adds valid, non-deceptive JSON-LD (BreadcrumbList) + canonical + OG tags.
   - Idempotently appends the new URLs to sitemap.xml.

   RUN:  node scripts/seo-pages.js         (from repo root)
   ============================================================================ */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "cpa-far");
const OUT_DIR = path.join(ROOT, "learn");
const SITEMAP = path.join(ROOT, "sitemap.xml");
const ORIGIN = "https://acedhq.com";
const CAP = 8;            // questions shown per page (a genuine free sample)
const MIN_Q = 3;          // skip modules too thin to make a non-empty page

/* FAR blueprint area names (top-level F1–F4). Accurate, not overstated. */
const AREA = {
  F1: "Conceptual Framework & Financial Reporting",
  F2: "Select Financial Statement Accounts",
  F3: "Select Transactions",
  F4: "State & Local Government Accounting"
};

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---- load + group questions ------------------------------------------------ */
function loadQuestions() {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => /\.json$/.test(f) && !/_dedupe/.test(f));
  const byModule = {};
  for (const f of files) {
    let data;
    try { data = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8")); }
    catch (e) { console.warn("skip (bad JSON):", f); continue; }
    const arr = Array.isArray(data) ? data : (data.questions || data.items || []);
    for (const q of arr) {
      if (!q || !q.source || !q.q || !Array.isArray(q.choices)) continue;
      (byModule[q.source] = byModule[q.source] || []).push(q);
    }
  }
  return byModule;
}

const slugFor = (mod) => "far-" + mod.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const areaOf = (mod) => AREA[mod.split(".")[0]] || "CPA FAR";

/* ---- one topic page -------------------------------------------------------- */
function pageHTML(mod, qs) {
  const slug = slugFor(mod), area = areaOf(mod), url = `${ORIGIN}/learn/${slug}.html`;
  const title = `CPA FAR ${esc(mod)} Practice Questions — ${esc(area)} | ACED`;
  const desc = `Free ${esc(mod)} practice questions with full explanations (${esc(area)}). ` +
               `Then drill the full adaptive set free in ACED — spaced repetition, mastery checks, and a growing FAR bank.`;
  const sample = qs.slice(0, CAP);

  const cards = sample.map((q, i) => {
    const choices = q.choices.map((c, j) => {
      const correct = j === q.answer;
      return `<li class="${correct ? "correct" : ""}">${correct ? "\u2713 " : ""}${esc(c)}</li>`;
    }).join("");
    return `<article class="q">
      <div class="qmeta">Q${i + 1}${q.diff ? " · " + esc(q.diff) : ""}${q.ref ? " · " + esc(q.ref) : ""}</div>
      <h2>${esc(q.q)}</h2>
      <ul class="choices">${choices}</ul>
      ${q.explain ? `<div class="explain"><b>Why:</b> ${esc(q.explain)}</div>` : ""}
    </article>`;
  }).join("\n");

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "ACED", "item": ORIGIN + "/" },
      { "@type": "ListItem", "position": 2, "name": "Learn", "item": ORIGIN + "/learn/" },
      { "@type": "ListItem", "position": 3, "name": `CPA FAR ${mod}`, "item": url }
    ]
  };

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<link rel="canonical" href="${url}"/>
<meta property="og:type" content="article"/><meta property="og:title" content="${title}"/>
<meta property="og:description" content="${desc}"/><meta property="og:url" content="${url}"/>
<meta name="twitter:card" content="summary"/>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>
 :root{--green:#22ff66;--amber:#ffb627;--cyan:#5cffea;--gold:#ffd23f;--money:#9be36b;--white:#d8f5d8;--grey:#5a7058;--red:#ff5238;--bg:#070b08;--panel:#0a160a;--panel2:#06100a;--border:#16291a}
 *{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--white);font-family:'VT323',ui-monospace,monospace;font-size:20px;line-height:1.35}
 body{background:radial-gradient(ellipse at center,#0d1409,#000),var(--bg);min-height:100vh}
 body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:9;background:repeating-linear-gradient(0deg,rgba(0,0,0,.15) 0,rgba(0,0,0,.15) 1px,transparent 1px,transparent 3px)}
 a{color:inherit;text-decoration:none}.wrap{max-width:780px;margin:0 auto;padding:0 18px;position:relative;z-index:1}
 header{position:sticky;top:0;z-index:20;background:linear-gradient(180deg,var(--bg),rgba(7,11,8,.85));border-bottom:1px solid var(--border)}
 .nav{display:flex;align-items:center;justify-content:space-between;height:52px}
 .brand{font-family:'Press Start 2P';font-size:14px;color:var(--green)}
 .navlinks a{font-family:'Press Start 2P';font-size:8px;border:1px solid var(--border);background:var(--panel);color:var(--grey);padding:7px 9px;margin-left:6px}
 .navlinks a:hover{color:var(--green)}
 main{padding:26px 0 60px}
 .crumb{font-size:15px;color:var(--grey);margin-bottom:8px}.crumb a{color:var(--cyan)}
 h1{font-family:'Press Start 2P';font-size:clamp(15px,3.4vw,20px);line-height:1.5;margin:6px 0 8px}
 .intro{color:var(--white);font-size:18px;margin:0 0 18px;border-left:2px solid var(--border);padding-left:12px}
 .q{border:1px solid var(--border);background:var(--panel2);padding:16px;margin:0 0 14px}
 .qmeta{font-family:'Press Start 2P';font-size:8px;color:var(--grey);letter-spacing:1px;margin-bottom:8px}
 .q h2{font-family:'VT323';font-weight:normal;font-size:22px;margin:0 0 10px;color:#eafff0}
 .choices{list-style:none;padding:0;margin:0 0 10px}
 .choices li{padding:7px 10px;border:1px solid var(--border);margin:5px 0;color:var(--white)}
 .choices li.correct{border-color:var(--green);color:var(--green);background:rgba(34,255,102,.07)}
 .explain{font-size:17px;color:#bfe8c6;border-top:1px dashed var(--border);padding-top:9px}
 .explain b{color:var(--cyan)}
 .cta{border:1px solid var(--gold);background:#140f02;padding:18px;margin:22px 0;text-align:center}
 .cta p{margin:0 0 12px;color:var(--white);font-size:18px}
 .cta .btn{font-family:'Press Start 2P';font-size:11px;padding:14px 16px;border:1px solid var(--gold);background:var(--gold);color:#1a1402;display:inline-block;box-shadow:0 4px 0 #8a6d00}
 .cta .btn.ghost{background:transparent;color:var(--gold);box-shadow:none;margin-left:8px}
 .more{margin:24px 0 0}.more a{color:var(--cyan);text-decoration:underline;text-underline-offset:3px;font-size:17px;display:inline-block;margin:3px 10px 3px 0}
 footer{border-top:1px solid var(--border);margin-top:30px;padding:22px 0;color:var(--grey);font-size:15px;text-align:center}
 footer a{color:var(--grey);text-decoration:underline}
</style></head><body>
<header><div class="wrap nav">
 <a class="brand" href="/index.html">ACED_</a>
 <nav class="navlinks"><a href="/learn/index.html">LEARN</a><a href="/aced-arcade.html">PLAY</a><a href="/store.html">STORE</a></nav>
</div></header>
<main><div class="wrap">
 <div class="crumb"><a href="/">ACED</a> › <a href="/learn/index.html">Learn</a> › CPA FAR ${esc(mod)}</div>
 <h1>CPA FAR ${esc(mod)} — Practice Questions</h1>
 <p class="intro">${esc(area)}. Below are ${sample.length} real practice questions with worked explanations — a free sample of the ${esc(mod)} set. The full adaptive version (spaced repetition, mastery checks, and the wider FAR bank) lives in the app.</p>
 ${cards}
 <div class="cta">
   <p>Drill this topic the way it actually sticks — adaptive review that resurfaces what you miss, inside a game loop.</p>
   <a class="btn" href="/aced-arcade.html?pack=cpa-far&study=1">▶ PRACTICE FREE IN ACED</a>
   <a class="btn ghost" href="/store.html">STUDY PACKS</a>
 </div>
 <div class="more"><b style="font-family:'Press Start 2P';font-size:8px;color:var(--grey)">MORE FAR TOPICS</b><br>__MORELINKS__</div>
</div></main>
<footer><div class="wrap">ACED · practice questions &amp; explanations · <a href="/learn/index.html">all topics</a> · <a href="/">home</a><br>Study samples for learning. Not affiliated with AICPA/NASBA.</div></footer>
</body></html>`;
}

/* ---- hub page -------------------------------------------------------------- */
function hubHTML(mods) {
  const url = `${ORIGIN}/learn/`;
  const byArea = {};
  mods.forEach(m => { const a = m.mod.split(".")[0]; (byArea[a] = byArea[a] || []).push(m); });
  const sections = Object.keys(byArea).sort().map(a => {
    const links = byArea[a].map(m => `<li><a href="/learn/${m.slug}.html">CPA FAR ${esc(m.mod)}</a> <span class="ct">${m.count} questions</span></li>`).join("");
    return `<section><h2>${esc(a)} · ${esc(AREA[a] || "")}</h2><ul class="topics">${links}</ul></section>`;
  }).join("\n");
  const total = mods.reduce((n, m) => n + m.count, 0);
  const title = "CPA FAR Practice Questions by Topic — Free Samples | ACED";
  const desc = `Free CPA FAR practice questions with explanations, organized by exam topic (${mods.length} modules, ${total}+ questions). Then study the full adaptive set in ACED.`;
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title><meta name="description" content="${desc}"/>
<link rel="canonical" href="${url}"/>
<meta property="og:title" content="${title}"/><meta property="og:description" content="${desc}"/><meta property="og:url" content="${url}"/>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
<style>
 :root{--green:#22ff66;--cyan:#5cffea;--gold:#ffd23f;--white:#d8f5d8;--grey:#5a7058;--bg:#070b08;--panel:#0a160a;--panel2:#06100a;--border:#16291a}
 *{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--white);font-family:'VT323',monospace;font-size:20px;line-height:1.35}
 body{background:radial-gradient(ellipse at center,#0d1409,#000),var(--bg);min-height:100vh}
 a{color:inherit;text-decoration:none}.wrap{max-width:760px;margin:0 auto;padding:0 18px}
 header{border-bottom:1px solid var(--border)}.nav{display:flex;justify-content:space-between;align-items:center;height:52px}
 .brand{font-family:'Press Start 2P';font-size:14px;color:var(--green)}
 .navlinks a{font-family:'Press Start 2P';font-size:8px;border:1px solid var(--border);background:var(--panel);color:var(--grey);padding:7px 9px;margin-left:6px}
 main{padding:26px 0 60px}h1{font-family:'Press Start 2P';font-size:clamp(15px,3.4vw,20px);line-height:1.5}
 .intro{color:var(--white);font-size:18px;border-left:2px solid var(--border);padding-left:12px;margin:0 0 22px}
 section{margin:0 0 22px}section h2{font-family:'Press Start 2P';font-size:10px;color:var(--cyan);line-height:1.6}
 ul.topics{list-style:none;padding:0;margin:6px 0}ul.topics li{padding:9px 0;border-bottom:1px solid var(--border)}
 ul.topics a{color:var(--white)}ul.topics a:hover{color:var(--green)}.ct{color:var(--grey);font-size:15px;float:right}
 .cta{border:1px solid var(--gold);background:#140f02;padding:16px;margin:20px 0;text-align:center}
 .cta a{font-family:'Press Start 2P';font-size:11px;padding:13px 16px;border:1px solid var(--gold);background:var(--gold);color:#1a1402;display:inline-block}
 footer{border-top:1px solid var(--border);margin-top:24px;padding:22px 0;color:var(--grey);font-size:15px;text-align:center}footer a{color:var(--grey);text-decoration:underline}
</style></head><body>
<header><div class="wrap nav"><a class="brand" href="/index.html">ACED_</a>
 <nav class="navlinks"><a href="/aced-arcade.html">PLAY</a><a href="/store.html">STORE</a></nav></div></header>
<main><div class="wrap">
 <h1>CPA FAR Practice Questions by Topic</h1>
 <p class="intro">Free FAR practice questions with worked explanations, grouped by exam area. Each page is a sample — the full adaptive experience (spaced repetition, mastery checks, runs, readiness) is in the app.</p>
 ${sections}
 <div class="cta"><a href="/aced-arcade.html?pack=cpa-far&study=1">▶ PLAY THE FULL FAR SET FREE</a></div>
</div></main>
<footer><div class="wrap">ACED · <a href="/">home</a> · Study samples for learning. Not affiliated with AICPA/NASBA.</div></footer>
</body></html>`;
}

/* ---- sitemap (idempotent append) ------------------------------------------ */
function updateSitemap(urls) {
  let xml;
  try { xml = fs.readFileSync(SITEMAP, "utf8"); }
  catch (e) { xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n`; }
  let added = 0;
  const entries = urls.filter(u => xml.indexOf(u) === -1)
    .map(u => `  <url><loc>${u}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
  if (entries.length) {
    xml = xml.replace(/<\/urlset>\s*$/, entries.join("\n") + "\n</urlset>\n");
    added = entries.length;
    fs.writeFileSync(SITEMAP, xml);
  }
  return added;
}

/* ---- main ------------------------------------------------------------------ */
function main() {
  if (!fs.existsSync(CONTENT_DIR)) { console.error("No content dir:", CONTENT_DIR); process.exit(1); }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const byModule = loadQuestions();
  const mods = Object.keys(byModule).filter(m => byModule[m].length >= MIN_Q).sort()
    .map(m => ({ mod: m, slug: slugFor(m), count: byModule[m].length }));

  // sibling links (same area) for each page
  const siblingsByArea = {};
  mods.forEach(m => { const a = m.mod.split(".")[0]; (siblingsByArea[a] = siblingsByArea[a] || []).push(m); });

  const written = [];
  for (const m of mods) {
    const area = m.mod.split(".")[0];
    const links = siblingsByArea[area].filter(s => s.mod !== m.mod)
      .map(s => `<a href="/learn/${s.slug}.html">FAR ${esc(s.mod)}</a>`).join("");
    const html = pageHTML(m.mod, byModule[m.mod]).replace("__MORELINKS__", links || `<a href="/learn/index.html">All topics</a>`);
    fs.writeFileSync(path.join(OUT_DIR, m.slug + ".html"), html);
    written.push(`${ORIGIN}/learn/${m.slug}.html`);
  }
  fs.writeFileSync(path.join(OUT_DIR, "index.html"), hubHTML(mods));
  written.push(`${ORIGIN}/learn/`);

  const added = updateSitemap(written);
  console.log(`Generated ${mods.length} topic pages + hub in /learn/`);
  console.log(`Sitemap: +${added} new URLs (total refs now include /learn/)`);
  console.log("Pages:", mods.map(m => m.slug).join(", "));
}
main();
