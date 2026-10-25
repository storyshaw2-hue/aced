"use strict";
/* Interactive QA helpers. Pass an existing Playwright browser; no synthetic state writes. */
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
const OUT = path.resolve(__dirname, "..", "..", "aced-qa");
fs.mkdirSync(OUT, { recursive: true });
async function session(browser, base, viewport) {
  const context = await browser.newContext({ viewport: viewport || { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await context.newPage(), errors = [], failed = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("response", response => { if (response.status() >= 400 && response.url().startsWith(base)) failed.push(response.status() + " " + response.url()); });
  return { context, page, errors, failed, base, checks: [] };
}
async function snap(s, name) {
  await s.page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await s.page.screenshot({ path: path.join(OUT, name + ".png"), fullPage: false });
}
async function check(s, name, fn) { await fn(); s.checks.push(name); }
async function gameState(page) { return JSON.parse(await page.evaluate(() => window.render_game_to_text())); }
async function finishRecall(page, correct) {
  await page.locator('[data-confidence="HIGH"]').click();
  await page.locator("#reveal-answer").click();
  await page.locator(correct ? "#recall-correct" : "#recall-again").click();
  await page.locator("#after-answer").waitFor({ state: "visible" });
}
async function finishMCQ(page, correct) {
  const prompt = await page.locator(".challenge-prompt").innerText();
  const answer = await page.evaluate(prompt => {
    const q = window.ACED_QUESTIONS.find(q => q.q === prompt); return { correct: q.answer, count: q.choices.length };
  }, prompt);
  await page.locator('[data-confidence="HIGH"]').click();
  await page.locator('[data-answer="' + (correct ? answer.correct : (answer.correct + 1) % answer.count) + '"]').click();
  await page.locator("#submit-answer").click();
  await page.locator("#after-answer").waitFor({ state: "visible" });
}
async function collection(browser, base) {
  const s = await session(browser, base), p = s.page;
  await check(s, "homepage paste reaches editable review unchanged", async () => {
    await p.goto(base + "/index.html");
    await p.locator("#quick-notes").fill("Alpha: First answer\nBeta: Second answer\nGamma: Third answer");
    await snap(s, "home-desktop");
    await p.getByRole("button", { name: "Review my questions →", exact: true }).click();
    await p.locator("#save-play").waitFor({ state: "visible" });
    assert.equal(await p.locator(".question-editor").count(), 3);
    assert.equal(await p.locator("#q-answer-0").inputValue(), "First answer");
    await p.locator("#pack-name").fill("Memory Lab");
    await p.locator("#pack-subject").fill("General knowledge");
    await p.locator("#q-explain-0").fill("An authored explanation.");
    await p.getByText("Run settings", { exact: false }).click();
    await p.locator('input[value="casual"]').check();
    await snap(s, "review-desktop");
    await p.locator("#save-play").click();
    await p.locator("#intro-title").waitFor({ state: "visible" });
    assert.equal(await p.locator("#intro-title").innerText(), "Memory Lab");
    s.recallId = new URL(p.url()).searchParams.get("pack");
  });
  await check(s, "second uploaded MCQ pack does not overwrite first", async () => {
    await p.goto(base + "/importer.html");
    await p.locator("#pack-name").fill("Choice Lab"); await p.locator("#pack-subject").fill("Technology");
    const fixture = { name: "Choice Lab", questions: [
      { q: "Which answer is first?", choices: ["First", "Second", "Third"], answer: 0, source: "Ordering", explain: "First is the first choice." },
      { q: "Which answer is second?", choices: ["First", "Second", "Third"], answer: 1, source: "Ordering" }
    ] };
    await p.locator("#pack-file").setInputFiles({ name: "choice.aced.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(fixture)) });
    await p.locator("#save-library").waitFor({ state: "visible" });
    assert.equal(await p.locator(".question-editor").count(), 2);
    await p.locator("#save-library").click(); s.choiceId = new URL(p.url()).searchParams.get("edit");
    await p.getByRole("link", { name: "Library", exact: true }).click();
    await p.locator(".pack-card").first().waitFor({ state: "visible" });
    assert.equal(await p.locator(".pack-card").count(), 2);
    await p.reload(); await p.locator(".pack-card").first().waitFor({ state: "visible" });
    assert.equal(await p.locator(".pack-card").count(), 2);
    await snap(s, "library-desktop");
  });
  await check(s, "search, sort, tab switching and starter copy", async () => {
    await p.locator("#pack-search").fill("Technology"); assert.equal(await p.locator(".pack-card").count(), 1);
    await p.locator("#pack-search").fill("No such subject"); assert.ok(await p.locator("#empty-state").isVisible());
    await p.locator("#clear-search").click(); assert.equal(await p.locator(".pack-card").count(), 2);
    await p.locator("#pack-sort").selectOption("name");
    assert.equal(await p.locator(".pack-card h2").first().innerText(), "Choice Lab");
    await p.locator("#starter-tab").click(); assert.equal(await p.locator(".pack-card").count(), 2);
    await p.locator('[data-pack="spanish-1k"] [data-action="copy"]').click();
    await p.locator('[data-tab="mine"][aria-selected="true"]').waitFor();
    assert.equal(await p.locator(".pack-card").count(), 3);
  });
  await check(s, "editing retains identities, content and multiple packs", async () => {
    await p.locator('[data-pack="' + s.recallId + '"] a').filter({ hasText: "Edit" }).click();
    await p.locator("#questions-section").waitFor({ state: "visible" });
    assert.equal(await p.locator(".question-editor").count(), 3);
    await p.locator("#pack-name").fill("Memory Lab edited");
    await p.locator("#q-prompt-0").fill("What is Alpha?");
    await p.locator("#save-library").click();
    assert.equal(new URL(p.url()).searchParams.get("edit"), s.recallId);
    await p.goto(base + "/library.html");
    await p.locator(".pack-card").first().waitFor({ state: "visible" });
    assert.equal(await p.locator(".pack-card").count(), 3);
    assert.equal(await p.locator('[data-pack="' + s.recallId + '"] h2').innerText(), "Memory Lab edited");
  });
  await check(s, "export/import keeps answers but creates an independent pack", async () => {
    const card = p.locator('[data-pack="' + s.choiceId + '"]');
    const downloadPromise = p.waitForEvent("download"); await card.locator('[data-action="export"]').click();
    const download = await downloadPromise; s.exportFile = path.join(OUT, download.suggestedFilename()); await download.saveAs(s.exportFile);
    assert.equal(JSON.parse(fs.readFileSync(s.exportFile, "utf8")).questions[0].answer, 0);
    await p.goto(base + "/importer.html"); await p.locator("#pack-name").fill("Imported copy");
    await p.locator("#pack-file").setInputFiles(s.exportFile);
    await p.locator("#save-library").waitFor({ state: "visible" }); await p.locator("#save-library").click();
    assert.notEqual(new URL(p.url()).searchParams.get("edit"), s.choiceId);
    await p.goto(base + "/library.html"); await p.locator(".pack-card").first().waitFor({ state: "visible" });
    assert.equal(await p.locator(".pack-card").count(), 4);
  });
  await check(s, "sharing exposes content warning and copyable pack link", async () => {
    await p.locator('[data-pack="' + s.choiceId + '"] [data-action="share"]').click();
    await p.locator("#share-url").waitFor({ state: "visible" }); s.shareUrl = await p.locator("#share-url").inputValue();
    assert.ok(s.shareUrl.includes("#pack=")); await p.locator("#share-copy").click();
    await p.waitForFunction(() => document.getElementById("copy-result").textContent.length > 0);
    assert.ok(/copied|selected link/i.test(await p.locator("#copy-result").innerText()));
    await p.locator("#app-dialog [data-close]").click();
  });
  await check(s, "cancel and confirm deletion affect only the selected pack", async () => {
    await p.locator('[data-pack="' + s.choiceId + '"] [data-action="delete"]').click();
    await p.locator("#cancel-delete").click(); assert.equal(await p.locator(".pack-card").count(), 4);
    const target = p.locator(".pack-card").filter({ hasText: "Imported copy" });
    await target.locator('[data-action="delete"]').click(); await p.locator("#confirm-delete").click();
    assert.equal(await p.locator(".pack-card").count(), 3);
    assert.ok(await p.locator('[data-pack="' + s.choiceId + '"]').isVisible());
  });
  assert.deepEqual(s.errors, []); assert.deepEqual(s.failed, []);
  return s;
}
async function recallGame(s) {
  const p = s.page;
  await p.goto(s.base + "/study.html?pack=" + s.recallId + "&difficulty=casual&seed=qa-repeatable");
  await p.locator("#start-run").click();
  await check(s, "game startup, selection, sorting, discard and help", async () => {
    assert.equal((await gameState(p)).recall, 0);
    const card = p.locator("[data-card]").first(), cardId = await card.getAttribute("data-card");
    await card.click(); assert.equal(await p.locator('[data-card="' + cardId + '"]').getAttribute("aria-pressed"), "true");
    await p.locator('[data-card="' + cardId + '"]').click(); assert.equal((await gameState(p)).selected.length, 0);
    await p.locator("#sort-rank").click(); assert.equal(await p.locator("#sort-rank").getAttribute("aria-pressed"), "true");
    await p.locator("#sort-suit").click(); assert.equal(await p.locator("#sort-rank").getAttribute("aria-pressed"), "false");
    await p.locator("[data-card]").first().click(); await p.locator("#discard-hand").click();
    assert.equal((await gameState(p)).discards, 2);
    await p.locator("#show-help").click(); assert.equal(await p.locator(".hand-table tbody tr").count(), 9);
    await p.locator("#help-back").click();
    const before = await p.locator("#sound-toggle").getAttribute("aria-pressed"); await p.locator("#sound-toggle").click(); await p.locator("#sound-toggle").click();
    assert.equal(await p.locator("#sound-toggle").getAttribute("aria-pressed"), before);
    await snap(s, "game-desktop");
  });
  await check(s, "recall is explicit, mistakes queue and review changes only answer progress", async () => {
    await p.locator("#take-challenge").click();
    assert.equal(await p.locator("#reveal-answer").isDisabled(), true);
    await finishRecall(p, false); assert.equal((await gameState(p)).recall, 0);
    await snap(s, "recall-feedback-desktop"); await p.locator("#after-answer").click();
    await p.locator("#review-questions").click(); await p.locator("#practice-missed").click();
    await finishRecall(p, true); assert.ok((await gameState(p)).recall > 0);
    await p.locator("#after-answer").click();
    await p.locator("#show-progress").click(); assert.ok((await p.locator("#game-dialog").innerText()).includes("self-rated"));
    await p.locator("#progress-back").click();
  });
  await check(s, "a scored hand clears a round, answer earns Insight, shop purchases and reordering work", async () => {
    const ids = (await gameState(p)).hand.slice(0, 5).map(c => c.id);
    for (const id of ids) await p.locator('[data-card="' + id + '"]').click();
    await p.locator("#play-hand").click();
    assert.equal((await gameState(p)).phase, "challenge");
    await finishRecall(p, true); await p.locator("#after-answer").click();
    assert.equal((await gameState(p)).phase, "shop");
    const before = await gameState(p); await p.locator("[data-buy]:enabled").first().click();
    assert.equal((await gameState(p)).jokers.length, before.jokers.length + 1);
    assert.ok((await gameState(p)).cash < before.cash);
    await p.locator("#shop-reroll").click();
    await p.locator("details.advanced summary").click();
    await p.locator('[data-move="0"][data-direction="1"]').click();
    await snap(s, "shop-desktop");
    await p.locator("#shop-next").click(); assert.equal((await gameState(p)).round, 2);
    await p.locator("[data-card]").first().click();
    const insight = (await gameState(p)).insight; assert.ok(insight >= 2);
    await p.locator("#power-up").click(); assert.equal((await gameState(p)).insight, insight - 2);
  });
  await check(s, "end-run cancellation, summary, restart and saved progress", async () => {
    await p.locator("#end-run").click(); await p.locator("#cancel-end").click(); assert.equal((await gameState(p)).phase, "playing");
    await p.locator("#end-run").click(); await p.locator("#confirm-end").click(); assert.equal((await gameState(p)).phase, "ended");
    await p.locator("#restart-run").click(); assert.equal((await gameState(p)).round, 1);
    assert.ok((await gameState(p)).recall > 0);
    await p.getByRole("link", { name: "Library", exact: true }).click();
    assert.ok((await p.locator('[data-pack="' + s.recallId + '"] .pack-meta').innerText()).includes("practiced"));
  });
  assert.deepEqual(s.errors, []); assert.deepEqual(s.failed, []);
}
async function sharedAndMCQ(browser, s) {
  const t = await session(browser, s.base), p = t.page;
  await check(t, "shared pack is reviewed before saving in a fresh browser", async () => {
    await p.goto(s.shareUrl); await p.locator("#save-play").waitFor({ state: "visible" });
    assert.equal(await p.locator(".question-editor").count(), 2);
    assert.equal(await p.evaluate(() => ACEDLibrary.list().length), 0);
    await p.locator("#save-play").click(); await p.locator("#start-run").click();
    assert.equal((await gameState(p)).recall, 0);
  });
  await check(t, "MCQ confidence, correct answer, explanation and progress are graded", async () => {
    await p.locator("#take-challenge").click(); assert.equal(await p.locator("#submit-answer").isDisabled(), true);
    await finishMCQ(p, true); assert.ok((await gameState(p)).recall > 0);
    await snap(t, "mcq-feedback-desktop"); await p.locator("#after-answer").click();
    await p.reload(); await p.locator("#start-run").click(); assert.ok((await gameState(p)).recall > 0);
  });
  assert.deepEqual(t.errors, []); assert.deepEqual(t.failed, []); return t;
}
async function edges(browser, base) {
  const s = await session(browser, base), p = s.page;
  await check(s, "invalid JSON, prose, incomplete pairs and unsupported files are explained", async () => {
    for (const [input, message] of [["{bad json", "JSON"], ["An unstructured paragraph.", "not a question"], ["Q: No answer?", "needs an A:"]]) {
      await p.goto(base + "/importer.html"); await p.locator("#pack-notes").fill(input); await p.locator("#review-button").click();
      assert.ok((await p.locator("#import-status").innerText()).includes(message));
    }
    await p.locator("#pack-file").setInputFiles({ name: "notes.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-") });
    assert.ok((await p.locator("#import-status").innerText()).includes("PDF"));
    await p.locator("#pack-file").setInputFiles({ name: "huge.txt", mimeType: "text/plain", buffer: Buffer.alloc(5 * 1024 * 1024 + 1, "a") });
    assert.ok((await p.locator("#import-status").innerText()).includes("5 MB"));
  });
  await check(s, "CSV, TSV, TXT, Markdown and example/add/remove controls work", async () => {
    for (const [name, text] of [
      ["pack.csv", 'question,answer,topic,explanation\n"Question, one?","Answer ""one""",Topic,Reason'],
      ["pack.tsv", "Front\tBack\nQuestion\tAnswer"],
      ["pack.txt", "Q: A question?\nA: An answer"],
      ["pack.md", "# Topic\n- Term: definition"]
    ]) {
      await p.goto(base + "/importer.html"); await p.locator("#pack-name").fill(name);
      await p.locator("#pack-file").setInputFiles({ name, mimeType: "text/plain", buffer: Buffer.from(text) });
      await p.locator("#save-library").waitFor({ state: "visible" }); assert.equal(await p.locator(".question-editor").count(), 1);
    }
    await p.goto(base + "/importer.html"); await p.locator("#example-button").click(); await p.locator("#review-button").click();
    await p.locator("#add-question").click(); assert.equal(await p.locator(".question-editor").count(), 4);
    await p.locator('[data-remove="3"]').click(); assert.equal(await p.locator(".question-editor").count(), 3);
    for (let i = 0; i < 3; i++) await p.locator('[data-remove="0"]').click();
    await p.locator("#save-library").click(); assert.ok((await p.locator("#import-status").innerText()).includes("no questions"));
    await p.locator("#back-input").click(); assert.ok(await p.locator("#pack-notes").isVisible());
  });
  await check(s, "authored HTML is inert text and prototype-like topics are safe", async () => {
    await p.goto(base + "/importer.html"); await p.locator("#pack-name").fill("<img src=x onerror=window.xss=1>");
    await p.locator("#pack-notes").fill(JSON.stringify({ questions: [{ q: "<script>window.xss=1</script>", choices: ["Safe", "Other"], answer: 0, source: "__proto__" }] }));
    await p.locator("#review-button").click(); await p.locator("#save-play").click(); await p.locator("#start-run").click();
    await p.locator("#take-challenge").click(); assert.equal(await p.locator(".challenge-prompt script").count(), 0);
    await finishMCQ(p, true); assert.equal(await p.evaluate(() => window.xss), undefined);
    assert.equal(await p.evaluate(() => ({}).n), undefined); await p.locator("#after-answer").click();
  });
  await check(s, "oversized sharing offers export instead of an unusable link", async () => {
    await p.goto(base + "/importer.html"); await p.locator("#pack-name").fill("Large pack");
    await p.locator("#pack-notes").fill(JSON.stringify({ questions: Array.from({ length: 3 }, (_, i) => ({ q: "Question " + i + " " + "x".repeat(4500), answer: "Answer" })) }));
    await p.locator("#review-button").click(); await p.locator("#save-library").click();
    await p.goto(base + "/library.html");
    await p.locator(".pack-card").filter({ hasText: "Large pack" }).locator('[data-action="share"]').click();
    assert.equal(await p.locator("#share-url").count(), 0); assert.ok(await p.locator("#share-export").isVisible());
    await p.locator("#app-dialog [data-close]").click();
  });
  await check(s, "missing and retired pack IDs recover without a blank game", async () => {
    for (const id of ["not-in-this-browser", "cp" + "a-far"]) {
      await p.goto(base + "/study.html?pack=" + id); await p.locator("#game-error").waitFor({ state: "visible" });
      assert.ok((await p.locator("#game-error-message").innerText()).includes("not saved"));
    }
  });
  await check(s, "delayed starter loading and failed-load retry initialize exactly once", async () => {
    let release, intercepted;
    const interceptedPromise = new Promise(resolve => { intercepted = resolve; });
    await p.route("**/packs/world-capitals.js", route => new Promise(resolve => {
      release = () => route.continue().then(resolve); intercepted();
    }));
    await p.goto(base + "/study.html?pack=world-capitals", { waitUntil: "domcontentloaded" });
    await interceptedPromise;
    await p.waitForFunction(() => !document.getElementById("game-loading").hidden);
    assert.ok(release); await release(); await p.locator("#intro-title").waitFor({ state: "visible" });
    await p.unroute("**/packs/world-capitals.js");
    assert.equal(await p.locator("#start-run").count(), 1);
    await p.route("**/packs/spanish-1k.js", route => route.abort());
    await p.goto(base + "/study.html?pack=spanish-1k"); await p.locator("#game-error").waitFor({ state: "visible" });
    await p.unroute("**/packs/spanish-1k.js"); await p.locator("#retry-load").click();
    await p.locator("#intro-title").waitFor({ state: "visible" }); assert.equal(await p.locator("#intro-title").innerText(), "Everyday Spanish");
  });
  // The intentionally aborted request produces an expected browser network error.
  assert.deepEqual(s.errors.filter(e => !e.includes("ERR_FAILED")), []);
  assert.deepEqual(s.failed, []);
  const t = await session(browser, base), blocked = t.page;
  await blocked.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new DOMException("blocked", "SecurityError"); } }));
  await check(t, "blocked storage warns, carries a temporary pack and records answers in this tab", async () => {
    await blocked.goto(base + "/importer.html"); assert.ok(await blocked.locator("#storage-notice").isVisible());
    await blocked.locator("#pack-name").fill("Temporary pack");
    await blocked.locator("#pack-notes").fill(JSON.stringify({ questions: [{ q: "Which is correct?", choices: ["Yes", "No"], answer: 0 }] }));
    await blocked.locator("#review-button").click(); await blocked.locator("#save-play").click();
    await blocked.locator("#start-run").click(); assert.ok(blocked.url().includes("#pack="));
    await blocked.locator("#take-challenge").click(); await finishMCQ(blocked, true);
    assert.equal((await gameState(blocked)).recall, 50);
  });
  assert.deepEqual(t.errors, []); assert.deepEqual(t.failed, []);
  return { regular: s, blocked: t };
}
async function responsive(s) {
  const p = s.page, results = [];
  for (const [url, name] of [["index.html", "home"], ["library.html", "library"], ["importer.html", "importer"]]) {
    await p.goto(s.base + "/" + url); await p.evaluate(() => scrollTo(0, 0));
    for (const [width, height, label] of [[1440, 900, "desktop"], [375, 812, "mobile"], [1440, 900, "desktop-return"]]) {
      await p.setViewportSize({ width, height }); await p.evaluate(() => scrollTo(0, 0));
      const size = await p.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
      assert.ok(size.scroll <= size.width + 1, name + " horizontal overflow at " + width);
      if (label !== "desktop-return") await snap(s, name + "-" + label);
      results.push(name + " " + label + ": no overflow");
    }
  }
  await p.goto(s.base + "/study.html?pack=" + s.recallId + "&difficulty=casual");
  await p.locator("#start-run").click(); await p.setViewportSize({ width: 375, height: 812 });
  assert.equal(await p.locator("#game-tools-menu").getAttribute("open"), null);
  await p.locator("#game-tools-menu > summary").click(); assert.ok(await p.locator("#sound-toggle").isVisible());
  await p.locator("#sound-toggle").click();
  assert.equal(await p.locator("#game-tools-menu").getAttribute("open"), null);
  await p.locator("#game-tools-menu > summary").click(); await p.locator("#sound-toggle").click();
  await p.evaluate(() => scrollTo(0, 0)); await snap(s, "game-mobile-top");
  assert.ok(await p.locator("[data-card]").first().isVisible());
  await p.locator("#play-hand").scrollIntoViewIfNeeded(); await snap(s, "game-mobile-controls");
  assert.ok((await p.locator("#play-hand").boundingBox()).width >= 44);
  await p.locator("#take-challenge").click(); await snap(s, "challenge-mobile");
  assert.ok((await p.locator("#game-dialog").boundingBox()).width <= 375);
  await p.locator("#skip-question").click();
  await p.setViewportSize({ width: 1440, height: 550 }); await p.evaluate(() => scrollTo(0, 0)); await snap(s, "game-short-desktop");
  await p.setViewportSize({ width: 1440, height: 900 }); await p.locator("#sort-rank").click();
  const size = await p.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
  assert.ok(size.scroll <= size.width + 1); results.push("game mobile, short desktop and desktop return: controls usable");
  s.checks.push(...results); return results;
}
async function bestHand(page) {
  return page.evaluate(() => {
    const S = JSON.parse(window.render_game_to_text()), R = window.ACEDGameRules, J = window.ACED_CORE_JOKERS.jokers;
    const cards = S.hand.map(c => ({ id: c.id, rank: c.rank, el: c.suit, suit: c.suit, moduleKey: c.topic, v: c.rank === 14 ? 11 : Math.min(c.rank, 10), tags: [], weakness: false }));
    let best = { ids: [], total: -1 };
    function choose(start, selected) {
      if (selected.length) {
        const score = R.score(selected, S.jokers, S.scoring, J, true);
        if (score.total > best.total) best = { ids: selected.map(c => c.id), total: score.total };
      }
      if (selected.length === 5) return;
      for (let i = start; i < cards.length; i++) choose(i + 1, selected.concat(cards[i]));
    }
    choose(0, []); return best;
  });
}
async function completion(s, packId) {
  const p = s.page;
  await check(s, "defeat, selling jokers and card-only play do not inflate recall", async () => {
    await p.goto(s.base + "/study.html?pack=" + packId + "&difficulty=casual&seed=qa-loss"); await p.locator("#start-run").click();
    const recall = (await gameState(p)).recall;
    for (const id of (await bestHand(p)).ids) await p.locator('[data-card="' + id + '"]').click();
    await p.locator("#play-hand").click(); await p.locator("#skip-question").click();
    while ((await gameState(p)).jokers.length) {
      await p.locator("details.advanced summary").click(); await p.locator("[data-sell]").first().click();
    }
    await p.locator("#shop-next").click();
    while ((await gameState(p)).phase === "playing") { await p.locator("[data-card]").first().click(); await p.locator("#play-hand").click(); }
    assert.equal((await gameState(p)).phase, "complete"); assert.equal((await gameState(p)).recall, recall);
    assert.ok((await p.locator("#game-dialog-title").innerText()).includes("Run over"));
    await snap(s, "defeat-desktop");
  });
  await check(s, "a complete six-round run can be won through real controls", async () => {
    await p.goto(s.base + "/study.html?pack=" + packId + "&difficulty=casual&seed=qa-win"); await p.locator("#start-run").click();
    for (let steps = 0; steps < 100; steps++) {
      const S = await gameState(p);
      if (S.phase === "complete") break;
      if (S.phase === "playing") {
        if (await p.locator("#take-challenge").isEnabled()) {
          await p.locator("#take-challenge").click(); await finishMCQ(p, true); await p.locator("#after-answer").click();
        }
        const best = await bestHand(p);
        for (const id of best.ids) await p.locator('[data-card="' + id + '"]').click();
        if (await p.locator("#power-up").isEnabled()) await p.locator("#power-up").click();
        await p.locator("#play-hand").click();
      } else if (S.phase === "challenge") {
        await finishMCQ(p, true); await p.locator("#after-answer").click();
      } else if (S.phase === "shop") {
        for (let buys = 0; buys < 3; buys++) {
          const offers = await p.locator("[data-buy]:enabled").evaluateAll(buttons => buttons.map(b => ({ id: b.dataset.buy, price: Number(b.dataset.price) })));
          if (!offers.length) break;
          const best = await bestHand(p);
          const candidate = await p.evaluate(({ offers, ids }) => {
            const S = JSON.parse(window.render_game_to_text()), R = ACEDGameRules, J = ACED_CORE_JOKERS.jokers;
            const cards = S.hand.filter(c => ids.includes(c.id)).map(c => ({ rank: c.rank, el: c.suit, moduleKey: c.topic, v: c.rank === 14 ? 11 : Math.min(c.rank, 10), tags: [] }));
            const base = R.score(cards, S.jokers, S.scoring, J, true).total;
            return offers.map(o => ({ id: o.id, gain: R.score(cards, S.jokers.concat(o.id), S.scoring, J, true).total - base, price: o.price }))
              .filter(o => o.gain > 0).sort((a, b) => b.gain / b.price - a.gain / a.price)[0]?.id || null;
          }, { offers, ids: best.ids });
          if (!candidate) break;
          await p.locator('[data-buy="' + candidate + '"]').click();
        }
        await p.locator("#shop-next").click();
      } else throw new Error("Unexpected run phase: " + S.phase);
    }
    assert.ok((await p.locator("#game-dialog-title").innerText()).includes("Run cleared"), "a playable build should be able to win");
    assert.equal((await gameState(p)).round, 6); assert.ok((await gameState(p)).correct >= 6);
    await snap(s, "victory-desktop");
  });
  await check(s, "daily link uses the active pack and restart replays the same deal", async () => {
    await p.goto(s.base + "/study.html?pack=" + packId); await p.locator("#start-run").click();
    await p.getByRole("link", { name: "Daily run", exact: true }).click();
    await p.locator("#start-run").waitFor({ state: "visible" });
    assert.equal(new URL(p.url()).searchParams.get("pack"), packId); assert.equal(new URL(p.url()).searchParams.get("daily"), "1");
    assert.ok((await p.locator("#intro-meta").innerText()).startsWith("DAILY RUN"));
    await p.locator("#start-run").click(); const deal = (await gameState(p)).hand;
    await p.locator("#end-run").click(); await p.locator("#confirm-end").click(); await p.locator("#restart-run").click();
    assert.deepEqual((await gameState(p)).hand, deal);
  });
  assert.deepEqual(s.errors, []); assert.deepEqual(s.failed, []);
}
module.exports = { session, collection, recallGame, sharedAndMCQ, edges, responsive, completion, finishRecall, finishMCQ, gameState, snap, OUT };
