/* The subject-neutral run controller. A pack is data; game rules live elsewhere. */
(function () {
  "use strict";
  var L = window.ACEDLibrary, R = window.ACEDGameRules, C = window.ACEDCore, U = window.ACEDUI;
  var esc = U.esc, $ = function (id) { return document.getElementById(id); };
  var params = new URLSearchParams(location.search), pack = null, G = null, learning, runStats;
  var id = params.get("pack") || "world-capitals";
  var difficulty = ["casual", "standard", "brutal"].indexOf(params.get("difficulty")) >= 0 ? params.get("difficulty") : "standard";
  var daily = params.get("daily") === "1", today = localDate(), seedText;
  var JOKERS = window.ACED_CORE_JOKERS.jokers, chosen = new Set(), overlayClose = null, lastFocus = null;
  var dialog = $("game-dialog"), audio = null, musicTimer = null, musicStep = 0;
  var toolMenu = $("game-tools-menu"), smallScreen = window.matchMedia("(max-width: 760px)");
  function fitTools() { toolMenu.open = !smallScreen.matches; }
  fitTools();
  smallScreen.addEventListener("change", fitTools);
  toolMenu.addEventListener("click", function (event) {
    if (smallScreen.matches && event.target.closest("button")) toolMenu.open = false;
  });
  document.addEventListener("click", function (event) {
    if (smallScreen.matches && toolMenu.open && !toolMenu.contains(event.target)) toolMenu.open = false;
  });
  var muted = C.store.get("muted", false), frameId = null, frameCount = 0, frameTime = performance.now();
  var TARGETS = [300, 600, 1000, 1200, 1800, 2800, 3500, 5000, 7500];
  var BOSSES = [
    { id: "squeeze", name: "The Squeeze", rule: "You draw 6 cards instead of 8." },
    { id: "toll", name: "The Toll", rule: "Every hand loses 2 multiplier." },
    { id: "no-safety", name: "No Safety Net", rule: "Only 1 discard this round." }
  ];
  function localDate() {
    var now = new Date();
    return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  }
  function number(value) { return Math.floor(value).toLocaleString(); }
  function definition(jokerId) { return JOKERS.find(function (j) { return j.id === jokerId; }); }
  function topics() { return Array.from(new Set(pack.questions.map(function (q) { return q.source; }))); }
  function updateStorage() {
    L.saveLearning(id, learning);
    C.store.set("runStats_v1", runStats);
    U.storageNotice();
  }
  function tone(frequency, duration, volume, type) {
    if (muted) return;
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      var oscillator = audio.createOscillator(), gain = audio.createGain(), t = audio.currentTime;
      oscillator.type = type || "triangle"; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(volume || .035, t); gain.gain.exponentialRampToValueAtTime(.0001, t + duration);
      oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(t); oscillator.stop(t + duration + .02);
    } catch (e) { /* Audio is optional if the browser blocks it. */ }
  }
  function music() {
    if (musicTimer) clearInterval(musicTimer);
    if (muted || !G || ["complete", "ended"].indexOf(G.phase) >= 0) return;
    var notes = [130.81, 164.81, 196, 164.81, 146.83, 174.61, 220, 174.61];
    tone(notes[musicStep++ % notes.length], .5, .012, "sine");
    musicTimer = setInterval(function () { tone(notes[musicStep++ % notes.length], .5, .012, "sine"); }, 700);
  }
  function log(message) { $("game-log").textContent = message; }
  function openDialog(title, html, onClose) {
    lastFocus = document.activeElement;
    overlayClose = onClose || closeDialog;
    dialog.innerHTML = '<div class="dialog-head"><h2 id="game-dialog-title" tabindex="-1">' + esc(title) + '</h2><button id="game-dialog-close" class="icon-button" aria-label="Close dialog">×</button></div>' + html;
    dialog.querySelector("#game-dialog-close").onclick = function () { if (overlayClose) overlayClose(); };
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    dialog.querySelector("#game-dialog-title").focus({ preventScroll: true });
  }
  function closeDialog() {
    overlayClose = null; dialog.close();
    if (lastFocus && lastFocus.isConnected && lastFocus.getClientRects().length) lastFocus.focus();
    else if (smallScreen.matches) toolMenu.querySelector("summary").focus({ preventScroll: true });
  }
  dialog.addEventListener("cancel", function (event) { event.preventDefault(); if (overlayClose) overlayClose(); });
  function level() {
    var xp = runStats.xp || 0;
    return xp >= 3500 ? "LEGEND" : xp >= 1500 ? "RUNBREAKER" : xp >= 600 ? "STRATEGIST" : xp >= 200 ? "COMBO MAKER" : "ROOKIE";
  }
  function draw() {
    var size = G.boss === "squeeze" ? 6 : 8;
    while (G.hand.length < size && G.drawPile.length) G.hand.push(G.drawPile.pop());
  }
  function startRound() {
    var boss = G.round % 3 === 2 ? BOSSES[Math.floor(G.round / 3) % BOSSES.length] : null;
    G.boss = boss ? boss.id : null;
    G.target = Math.round(TARGETS[G.round] * (difficulty === "casual" ? .75 : difficulty === "brutal" ? 1.35 : 1));
    G.score = 0; G.handsLeft = 4 + (G.nextExtraHand || 0); G.nextExtraHand = 0;
    G.discards = G.boss === "no-safety" ? 1 : 3; G.handsPlayed = 0; G.challengeTaken = false;
    G.drawPile = R.shuffle(R.deck(G.topics), G); G.hand = []; chosen.clear();
    if (G.jokerState.momentum) G.jokerState.momentum.n = 0;
    draw(); G.phase = "playing"; closeDialog(); render();
    log(boss ? boss.name + ": " + boss.rule : "A fresh round. Make your first hand count.");
  }
  function start() {
    seedText = daily ? today + ":" + id + ":daily" : (params.get("seed") || Date.now() + ":" + Math.random());
    G = {
      seed: R.hash(seedText), phase: "playing", round: 0, runLength: pack.questions.length < 12 ? 6 : 9,
      questionRng: { seed: R.hash(seedText + ":questions") },
      money: difficulty === "casual" ? 8 : 4, insight: 0, totalScore: 0,
      jokers: ["warmup", "deepbreath"], jokerState: {}, boosts: {}, conv: Object.create(null), topics: topics(),
      questionsSeen: [], answered: 0, correct: 0, redeemedCount: 0, lastCorrect: false, bestHand: 0,
      finished: false, sort: null, masteredCount: 0, recallPct: 0, nextExtraHand: 0
    };
    $("game-intro").hidden = true; $("game").hidden = false; $("game-title").textContent = pack.name;
    L.touch(id); runStats.runs = (runStats.runs || 0) + 1; updateStorage();
    document.querySelectorAll("[data-daily]").forEach(function (link) {
      link.href = "study.html?pack=" + encodeURIComponent(id) + "&daily=1";
    });
    startRound(); music();
  }
  function selected() { return G.hand.filter(function (c) { return chosen.has(c.id); }); }
  function scoreContext() {
    var progress = L.progress(id, pack.questions);
    G.recallPct = progress.pct;
    G.masteredCount = G.topics.filter(function (topic) {
      var qs = pack.questions.filter(function (q) { return q.source === topic; });
      return qs.every(function (q) { return learning.answers[q.id] && learning.answers[q.id].strength >= 2; });
    }).length;
    return G;
  }
  function render() {
    if (!G) return;
    var canPlay = G.phase === "playing", selection = selected(), preview = null;
    if (selection.length) preview = R.score(selection, G.jokers, scoreContext(), JOKERS, true);
    $("stage-label").textContent = "STAGE " + (Math.floor(G.round / 3) + 1) + (daily ? " · DAILY" : "");
    $("round-number").textContent = Math.min(G.round + 1, G.runLength) + " / " + G.runLength;
    $("run-cash").textContent = "$" + G.money; $("run-insight").textContent = G.insight;
    $("player-level").textContent = level(); $("game-xp").textContent = number(runStats.xp || 0);
    $("hands-left").textContent = G.handsLeft; $("discards-left").textContent = G.discards;
    var progress = L.progress(id, pack.questions);
    $("recall-count").textContent = progress.practiced + "/" + pack.questions.length + " practiced";
    $("recall-pct").textContent = progress.pct + "%"; $("recall-bar").style.width = progress.pct + "%";
    $("self-rated-note").textContent = progress.selfRated ? progress.selfRated + " self-rated recall answers included." :
      progress.attempts ? "Automatically graded multiple-choice answers only." : "Your first challenge is a good place to start.";
    var boss = BOSSES.find(function (b) { return b.id === G.boss; });
    $("round-title").textContent = boss ? "BOSS · " + boss.name : G.round % 3 ? "Big blind" : "Small blind";
    $("round-rule").textContent = boss ? boss.rule : "Build hands to reach the target.";
    $("round-score").textContent = number(G.score); $("round-target").textContent = number(G.target);
    var percent = Math.min(100, Math.round(G.score / G.target * 100));
    $("round-bar").style.width = percent + "%";
    document.querySelector(".score-track").setAttribute("aria-valuenow", String(percent));
    $("joker-count").textContent = G.jokers.length + " / 5";
    $("joker-tray").innerHTML = G.jokers.length ? G.jokers.map(function (jokerId) {
      var j = definition(jokerId);
      return '<button class="joker-card" data-joker="' + esc(j.id) + '" aria-label="Inspect ' + esc(j.n) + '"><strong>' + esc(j.n) + '</strong><p>' + esc(j.d) + '</p></button>';
    }).join("") : '<p class="hint">No jokers equipped. Find a new strategy in the next shop.</p>';
    $("playing-hand").innerHTML = G.hand.map(function (c) {
      return '<button class="playing-card" data-card="' + c.id + '" data-suit="' + c.el + '" aria-pressed="' + String(chosen.has(c.id)) + '" aria-label="' + esc(c.n + ", " + c.v + " chips, " + c.moduleKey) + '"' + (!canPlay ? " disabled" : "") + '><span class="card-rank">' + (R.ranks[c.rank] || c.rank) + '</span><span class="card-suit" aria-hidden="true">' + R.suits[c.el] + '</span><span class="card-topic">' + esc(c.moduleKey) + '</span></button>';
    }).join("");
    $("selected-count").textContent = chosen.size ? chosen.size + " / 5 selected" : "Select up to 5 cards";
    $("combo-preview").innerHTML = preview
      ? '<strong>' + esc(preview.hand) + '</strong><span>' + number(preview.chips) + ' chips × ' + Number(preview.mult.toFixed(2)) + ' = <strong>' + number(preview.total) + '</strong></span>'
      : "<span>Select cards to see your combo.</span>";
    $("play-hand").disabled = !canPlay || !chosen.size;
    $("discard-hand").disabled = !canPlay || !chosen.size || G.discards < 1;
    $("take-challenge").disabled = !canPlay || G.challengeTaken;
    $("take-challenge").textContent = G.challengeTaken ? "Study boost used this round" : "Study boost: take a question";
    $("power-up").disabled = !canPlay || !preview || G.insight < 2;
    $("power-up").textContent = "Power up " + (preview ? preview.hand : "hand") + " · 2 Insight";
    $("sort-rank").setAttribute("aria-pressed", String(G.sort === "rank"));
    $("sort-suit").setAttribute("aria-pressed", String(G.sort === "suit"));
    $("sound-toggle").textContent = muted ? "Sound off" : "Sound on";
    $("sound-toggle").setAttribute("aria-pressed", String(!muted));
    U.storageNotice();
  }
  $("playing-hand").onclick = function (event) {
    var button = event.target.closest("[data-card]");
    if (!button || !G || G.phase !== "playing") return;
    var cardId = button.dataset.card, wasSelected = chosen.has(cardId);
    if (wasSelected) chosen.delete(cardId);
    else if (chosen.size < 5) chosen.add(cardId);
    else { log("Five cards is the limit. Deselect one first."); return; }
    tone(wasSelected ? 380 : 520, .05, .025, "square"); render();
    var next = $("playing-hand").querySelector('[data-card="' + cardId + '"]'); if (next) next.focus({ preventScroll: true });
  };
  $("sort-rank").onclick = function () { if (!G || G.phase !== "playing") return; G.hand.sort(function (a, b) { return b.rank - a.rank || a.el.localeCompare(b.el); }); G.sort = "rank"; render(); };
  $("sort-suit").onclick = function () { if (!G || G.phase !== "playing") return; G.hand.sort(function (a, b) { return a.el.localeCompare(b.el) || b.rank - a.rank; }); G.sort = "suit"; render(); };
  $("discard-hand").onclick = function () {
    if (!G || G.phase !== "playing" || !chosen.size || !G.discards) return;
    var count = chosen.size; G.hand = G.hand.filter(function (c) { return !chosen.has(c.id); });
    G.discards--; chosen.clear(); draw(); G.sort = null; render();
    log("Discarded " + count + " card" + (count > 1 ? "s" : "") + ". New options, same target."); tone(240, .1, .04);
  };
  $("play-hand").onclick = function () {
    if (!G || G.phase !== "playing" || !chosen.size) return;
    G.phase = "scoring";
    var result = R.score(selected(), G.jokers, scoreContext(), JOKERS, false);
    if (result.errors.length) console.error("Joker scoring errors:", result.errors);
    G.score += result.total; G.totalScore += result.total; G.bestHand = Math.max(G.bestHand, result.total);
    G.money += result.earned; G.handsLeft--; G.handsPlayed++;
    G.hand = G.hand.filter(function (c) { return !chosen.has(c.id); });
    chosen.clear(); draw(); G.sort = null;
    runStats.xp = (runStats.xp || 0) + 5; updateStorage();
    tone(660, .1, .05); tone(990, .2, .025);
    if (G.score >= G.target) {
      G.money += 4 + G.handsLeft; runStats.xp += 20; G.phase = "challenge"; render(); updateStorage();
      log(result.hand + " scored " + number(result.total) + ". Round cleared!");
      challenge({ afterRound: true });
    } else if (!G.handsLeft || !G.hand.length) {
      G.phase = "complete"; render(); finish(false);
    } else {
      G.phase = "playing"; render();
      log(result.hand + ": " + number(result.chips) + " chips × " + Number(result.mult.toFixed(2)) + " = " + number(result.total) + ". " + (result.effects.length ? result.effects.slice(0, 4).join(" · ") : ""));
    }
  };
  $("power-up").onclick = function () {
    var hand = G && R.detect(selected());
    if (!G || G.phase !== "playing" || !hand || G.insight < 2) return;
    G.insight -= 2; G.boosts[hand.name] = (G.boosts[hand.name] || 0) + 1;
    render(); log(hand.name + " now gets +2 multiplier for the rest of this run."); tone(880, .18, .04);
  };
  function chooseQuestion(pool) {
    pool = pool || pack.questions;
    var unseen = pool.filter(function (q) { return G.questionsSeen.indexOf(q.id) === -1; });
    if (!unseen.length) { G.questionsSeen = []; unseen = pool.slice(); }
    var weakest = Math.min.apply(null, unseen.map(function (q) { return (learning.answers[q.id] || {}).strength || 0; }));
    var candidates = unseen.filter(function (q) { return ((learning.answers[q.id] || {}).strength || 0) === weakest; });
    var q = candidates[Math.floor(R.random(G.questionRng) * candidates.length)]; G.questionsSeen.push(q.id); return q;
  }
  function recordAnswer(q, correct, confidence) {
    var previous = learning.answers[q.id] || { attempts: 0, correct: 0, strength: 0 };
    if (correct && previous.lastCorrect === false) G.redeemedCount++;
    var entry = {
      attempts: previous.attempts + 1, correct: previous.correct + (correct ? 1 : 0),
      strength: correct ? Math.min(2, (previous.strength || 0) + 1) : 0,
      lastCorrect: correct, lastAt: Date.now(), selfRated: q.kind === "recall"
    };
    learning.answers[q.id] = entry; learning.attempts++; if (correct) learning.correct++;
    if (q.kind === "recall") learning.selfRated++;
    G.answered++; if (correct) G.correct++; G.lastCorrect = correct;
    if (correct) {
      G.insight++; G.money += confidence === "HIGH" ? 3 : confidence === "MED" ? 2 : 1;
      G.conv[q.source] = (G.conv[q.source] || 0) + 1;
    } else G.money = Math.max(0, G.money - (confidence === "HIGH" ? 2 : confidence === "MED" ? 1 : 0));
    runStats.xp = (runStats.xp || 0) + (correct ? 15 : 5);
    C.review.record(q, correct);
    if (q.kind === "choice") C.calibration.record({ confidence: confidence, correct: correct, source: q.source });
    updateStorage(); render();
  }
  function challenge(options) {
    options = options || {};
    var q = chooseQuestion(options.pool), confidence = null, answer = null, revealed = false, submitted = false;
    G.phase = "challenge";
    function done() {
      if (options.afterRound) {
        if (G.round + 1 >= G.runLength) finish(true); else shop();
      } else { G.phase = "playing"; closeDialog(); render(); }
    }
    var choices = q.choices.map(function (choice, i) { return { value: choice, index: i }; });
    if (choices.length) choices = R.shuffle(choices, G.questionRng);
    openDialog(options.review ? "Review challenge" : options.afterRound ? "Round cleared. Make it count." : "Study boost", '<p class="question-topic">' + esc(pack.name) + " / " + esc(q.source) + (q.kind === "recall" ? " · SELF-RATED RECALL" : " · MULTIPLE CHOICE") + '</p>' +
      '<p class="challenge-prompt">' + esc(q.q) + '</p><span class="field-label">How sure are you? Choose before answering.</span>' +
      '<div class="confidence-row" role="group" aria-label="Confidence"><button data-confidence="LOW" aria-pressed="false">Low</button><button data-confidence="MED" aria-pressed="false">Medium</button><button data-confidence="HIGH" aria-pressed="false">High</button></div>' +
      '<p class="hint">Correct: +$1 / +$2 / +$3. Miss: $0 / −$1 / −$2. Higher confidence means higher stakes; a correct answer always earns 1 Insight.</p>' +
      (choices.length ? '<div class="choice-list">' + choices.map(function (choice, i) { return '<button class="choice-button" data-answer="' + choice.index + '" aria-pressed="false"><span class="choice-letter">' + String.fromCharCode(65 + i) + '</span><span>' + esc(choice.value) + '</span></button>'; }).join("") + '</div>' :
        '<p class="hint">Say or write your answer before you reveal it. You will rate your own recall honestly.</p><button class="button" id="reveal-answer" disabled>Reveal answer</button><div id="recall-reveal" hidden></div>') +
      '<div class="button-row">' + (choices.length ? '<button id="submit-answer" class="button primary" disabled>Check answer</button>' : "") + '<button id="skip-question" class="button quiet">Continue without bonus</button></div>', done);
    function updateControls() {
      dialog.querySelectorAll("[data-confidence]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.confidence === confidence)); });
      dialog.querySelectorAll("[data-answer]").forEach(function (b) { b.setAttribute("aria-pressed", String(Number(b.dataset.answer) === answer)); });
      var submit = dialog.querySelector("#submit-answer"), reveal = dialog.querySelector("#reveal-answer");
      if (submit) submit.disabled = !confidence || answer == null;
      if (reveal) reveal.disabled = !confidence;
    }
    dialog.querySelectorAll("[data-confidence]").forEach(function (button) {
      button.onclick = function () { if (!revealed && !submitted) { confidence = button.dataset.confidence; updateControls(); } };
    });
    dialog.querySelectorAll("[data-answer]").forEach(function (button) {
      button.onclick = function () { if (!submitted) { answer = Number(button.dataset.answer); updateControls(); } };
    });
    dialog.querySelector("#skip-question").onclick = done;
    var submit = dialog.querySelector("#submit-answer");
    function grade(correct) {
      if (submitted || !confidence) return; submitted = true;
      var beforeCash = G.money;
      recordAnswer(q, correct, confidence);
      G.phase = "feedback";
      var correctAnswer = q.kind === "choice" ? q.choices[q.answer] : q.answer;
      var bonus = correct ? "You earned 1 Insight and $" + (confidence === "HIGH" ? 3 : confidence === "MED" ? 2 : 1) + "." :
        "Saved for review; scheduled to return in about 10 minutes." + (beforeCash > G.money ? " Your confidence wager cost $" + (beforeCash - G.money) + "." : "");
      var selfRating = q.kind === "recall" ? " Self-rated recall is tracked separately from graded multiple-choice answers." : "";
      openDialog(correct ? "Nice recall." : "One to come back to.", '<p class="feedback-title' + (correct ? "" : " wrong") + '">' + (correct ? "Knowledge → firepower." : "Not yet. Now you know.") + '</p><p class="question-topic">' + esc(q.source) + '</p><p><strong>Answer:</strong> ' + esc(correctAnswer) + '</p>' +
        (q.explain ? '<p class="feedback-explanation">' + esc(q.explain) + '</p>' : "") +
        '<p class="hint">' + esc(bonus + selfRating) + '</p><button id="after-answer" class="button primary">' + (options.afterRound ? G.round + 1 >= G.runLength ? "See run summary →" : "Visit the shop →" : "Back to your run →") + '</button>', done);
      dialog.querySelector("#after-answer").onclick = done;
      tone(correct ? 880 : 220, .25, .05);
    }
    if (submit) submit.onclick = function () { if (answer != null && confidence) grade(answer === q.answer); };
    var reveal = dialog.querySelector("#reveal-answer");
    if (reveal) reveal.onclick = function () {
      if (!confidence || revealed) return; revealed = true; reveal.hidden = true;
      dialog.querySelectorAll("[data-confidence]").forEach(function (button) { button.disabled = true; });
      var box = dialog.querySelector("#recall-reveal"); box.hidden = false;
      box.innerHTML = '<div class="recall-answer">' + esc(q.answer) + '</div><p class="hint">Did you recall this before revealing it? This is self-rated, not automatically graded.</p><div class="button-row"><button class="button primary" id="recall-correct">I recalled it</button><button class="button" id="recall-again">Practice again</button></div>';
      dialog.querySelector("#recall-correct").onclick = function () { grade(true); };
      dialog.querySelector("#recall-again").onclick = function () { grade(false); };
    };
  }
  $("take-challenge").onclick = function () {
    if (!G || G.phase !== "playing" || G.challengeTaken) return;
    G.challengeTaken = true; render(); challenge({});
  };
  function offers() {
    var pool = JOKERS.filter(function (j) { return G.jokers.indexOf(j.id) === -1; });
    return R.shuffle(pool, G).slice(0, 3).map(function (j) { return j.id; });
  }
  function shop() {
    G.phase = "shop"; G.offers = offers(); drawShop();
  }
  function drawShop() {
    function next() { G.round++; startRound(); }
    openDialog("The shop · $" + G.money, '<p class="hint">Build your strategy. Up to five jokers; their effects stack throughout the run.</p><div class="shop-grid">' +
      G.offers.map(function (jokerId) {
        var j = definition(jokerId), price = j.rarity === "rare" ? 8 : j.rarity === "uncommon" ? 6 : 4, owned = G.jokers.indexOf(j.id) >= 0;
        return '<article class="shop-item"><h3>' + esc(j.n) + '<span class="tag">' + esc(j.rarity) + '</span></h3><p>' + esc(j.d) + '</p><button class="button" data-buy="' + esc(j.id) + '" data-price="' + price + '"' + (owned || G.money < price || G.jokers.length >= 5 ? " disabled" : "") + '>' + (owned ? "Equipped" : "Buy · $" + price) + '</button></article>';
      }).join("") + '</div><div class="button-row"><button id="shop-next" class="button primary">Next round →</button><button id="shop-reroll" class="button"' + (G.money < 2 ? " disabled" : "") + '>Reroll · $2</button></div>' +
      (G.jokers.length ? '<details class="advanced"><summary>Your jokers · reorder or sell</summary><div class="shop-grid">' + G.jokers.map(function (jokerId, i) {
        return '<div class="shop-item"><strong>' + esc(definition(jokerId).n) + '</strong><div class="button-row"><button class="button quiet" data-move="' + i + '" data-direction="-1"' + (i === 0 ? " disabled" : "") + '>← Left</button><button class="button quiet" data-move="' + i + '" data-direction="1"' + (i === G.jokers.length - 1 ? " disabled" : "") + '>Right →</button><button class="button quiet" data-sell="' + esc(jokerId) + '">Sell · $2</button></div></div>';
      }).join("") + '</div></details>' : ""), next);
    dialog.querySelector("#shop-next").onclick = next;
    dialog.querySelector("#shop-reroll").onclick = function () { if (G.money < 2) return; G.money -= 2; G.offers = offers(); render(); drawShop(); };
    dialog.querySelectorAll("[data-buy]").forEach(function (button) {
      button.onclick = function () {
        var price = Number(button.dataset.price), jokerId = button.dataset.buy;
        if (G.money < price || G.jokers.length >= 5 || G.jokers.indexOf(jokerId) >= 0) return;
        G.money -= price; G.jokers.push(jokerId); tone(660, .13, .04); render(); drawShop();
      };
    });
    dialog.querySelectorAll("[data-sell]").forEach(function (button) {
      button.onclick = function () { G.jokers = G.jokers.filter(function (j) { return j !== button.dataset.sell; }); G.money += 2; render(); drawShop(); };
    });
    dialog.querySelectorAll("[data-move]").forEach(function (button) {
      button.onclick = function () {
        var from = Number(button.dataset.move), to = from + Number(button.dataset.direction);
        if (to < 0 || to >= G.jokers.length) return;
        var item = G.jokers.splice(from, 1)[0]; G.jokers.splice(to, 0, item); render(); drawShop();
      };
    });
    render();
  }
  $("joker-tray").onclick = function (event) {
    var button = event.target.closest("[data-joker]"); if (!button || G.phase !== "playing") return;
    var j = definition(button.dataset.joker);
    openDialog(j.n, '<p>' + esc(j.d) + '</p><p class="hint">' + esc(j.rarity) + ' joker. Equipped for this run. Reorder or sell jokers in the shop between rounds.</p><button class="button primary" id="joker-back">Back to run</button>');
    dialog.querySelector("#joker-back").onclick = closeDialog;
  };
  function finish(won, ended) {
    if (!G.finished) {
      G.finished = true;
      runStats.bestScore = Math.max(runStats.bestScore || 0, G.totalScore);
      runStats.bestRound = Math.max(runStats.bestRound || 0, G.round + (won ? 1 : 0));
      if (won) { runStats.wins = (runStats.wins || 0) + 1; runStats.xp = (runStats.xp || 0) + 100; }
      if (daily) {
        var results = C.store.get("dailyRuns_v1", {});
        var previous = results[today];
        if (!previous || G.totalScore > previous.score) results[today] = { score: G.totalScore, won: !!won, round: G.round + 1 };
        C.store.set("dailyRuns_v1", results);
      }
      updateStorage();
    }
    G.phase = ended ? "ended" : "complete"; render(); if (musicTimer) clearInterval(musicTimer);
    openDialog(won ? "Run cleared." : ended ? "Run ended." : "Run over. Run it back.", '<p class="feedback-title">' + (won ? "That build worked." : "The next run starts smarter.") + '</p><p>Your questions and recall progress stay with you, even when the run ends.</p>' +
      '<div class="summary-stats"><div class="summary-stat"><strong>' + number(G.totalScore) + '</strong><span>Total score</span></div><div class="summary-stat"><strong>' + G.correct + "/" + G.answered + '</strong><span>Answers recalled</span></div><div class="summary-stat"><strong>' + L.progress(id, pack.questions).pct + '%</strong><span>Recall progress</span></div></div>' +
      '<p class="hint">Self-rated recall cards are included in the answer count. This is practice progress, not a prediction of performance outside the game.</p><div class="button-row"><button id="restart-run" class="button primary">' + (daily ? "Replay today's seed" : "Start another run") + '</button><a class="button" href="library.html">Your library</a><button id="summary-export" class="button quiet">Export pack</button></div>', function () { closeDialog(); log("Run finished. Use Start another run to play again."); $("end-run").textContent = "Start another run"; });
    dialog.querySelector("#restart-run").onclick = function () { closeDialog(); $("end-run").textContent = "End run"; start(); };
    dialog.querySelector("#summary-export").onclick = function () { U.download(pack); };
    if (won) { tone(523, .35, .04); tone(659, .4, .035); tone(784, .5, .025); }
  }
  $("end-run").onclick = function () {
    if (!G || G.finished) { closeDialog(); start(); $("end-run").textContent = "End run"; return; }
    if (G.phase !== "playing") return;
    openDialog("End this run?", '<p>Your saved pack and question progress stay in your library. The current hand and build will be left behind.</p><div class="button-row"><button id="confirm-end" class="button danger">End run</button><button id="cancel-end" class="button">Keep playing</button></div>');
    dialog.querySelector("#confirm-end").onclick = function () { finish(false, true); };
    dialog.querySelector("#cancel-end").onclick = closeDialog;
  };
  $("sound-toggle").onclick = function () {
    muted = !muted; C.store.set("muted", muted); render(); music();
    if (muted && audio) audio.suspend(); else if (audio) audio.resume();
  };
  $("show-help").onclick = function () {
    openDialog("Make a hand. Make it count.", '<p>Choose 1 to 5 cards and play. All selected cards add chips; your poker hand sets the base multiplier. Jokers add chips, add multiplier, or multiply the final result.</p><table class="hand-table"><thead><tr><th>Hand</th><th>Base chips × mult</th></tr></thead><tbody>' +
      R.hands.map(function (h) { return '<tr><td>' + esc(h.name) + '<br><span class="hint">' + esc(h.how) + '</span></td><td>' + h.chips + " × " + h.mult + '</td></tr>'; }).join("") +
      '</tbody></table><p class="hint">Beat each target in four hands. Discard to find better cards. Answer challenges for cash and Insight; 2 Insight adds +2 multiplier to a chosen hand type for the rest of the run. A boss appears every third round.</p><button class="button primary" id="help-back">Back to run</button>');
    dialog.querySelector("#help-back").onclick = closeDialog;
  };
  $("show-progress").onclick = function () {
    var report = L.progress(id, pack.questions), calibration = C.calibration.summary();
    openDialog("Your recall, not your score.", '<p>Progress tracks two consecutive correct recalls per question. A miss resets that question. Card plays never increase it; it is not a forecast or a certification.</p>' +
      '<p class="hint">' + report.attempts + ' answers practiced · ' + report.selfRated + ' self-rated · ' + (calibration.n ? calibration.accuracy + "% graded MCQ accuracy across " + calibration.n + " recent answers" : "No graded multiple-choice answers yet") + '</p>' +
      topics().map(function (topic) {
        var rows = pack.questions.filter(function (q) { return q.source === topic; }), amount = 0, count = 0;
        rows.forEach(function (q) { var a = learning.answers[q.id]; if (a) { count++; amount += a.strength || 0; } });
        var pct = Math.round(amount / (rows.length * 2) * 100);
        return '<div class="report-topic"><div class="stat-pair"><span>' + esc(topic) + '</span><strong>' + pct + '%</strong></div><div class="pack-progress"><span style="width:' + pct + '%"></span></div><span class="hint">' + count + "/" + rows.length + ' questions practiced</span></div>';
      }).join("") + '<div class="button-row"><button id="progress-back" class="button primary">Back to run</button></div>');
    dialog.querySelector("#progress-back").onclick = closeDialog;
  };
  $("review-questions").onclick = function () {
    if (!G || G.phase !== "playing") return;
    var missed = pack.questions.filter(function (q) { return learning.answers[q.id] && learning.answers[q.id].lastCorrect === false; });
    var due = C.review.queue(pack.questions, 2000);
    openDialog("Come back for the ones you missed.", '<p>' + (missed.length ? missed.length + " missed questions are available to practice." : "Nothing missed yet. Take a challenge during your run to start practicing.") + '</p><p class="hint">' + due.length + ' are currently due on your spaced-review schedule. You can practice sooner if you want.</p><div class="button-row">' + (missed.length ? '<button id="practice-missed" class="button primary">Practice a missed question</button>' : "") + '<button id="review-back" class="button">Back to run</button></div>');
    dialog.querySelector("#review-back").onclick = closeDialog;
    var practice = dialog.querySelector("#practice-missed");
    if (practice) practice.onclick = function () { challenge({ pool: missed, review: true }); };
  };
  function tick(now) {
    frameCount++;
    if (now - frameTime >= 1000) {
      $("runtime-status").textContent = Math.round(frameCount * 1000 / (now - frameTime)) + " FPS · turn-based · " + (L.isPersistent() ? "browser saves on" : "temporary session");
      frameCount = 0; frameTime = now;
    }
    frameId = requestAnimationFrame(tick);
  }
  async function boot() {
    $("game-loading").hidden = false; $("game-error").hidden = true; $("game-intro").hidden = true;
    try {
      if (!L.starter(id) && !L.get(id) && location.hash) {
        var payload = new URLSearchParams(location.hash.slice(1)).get("pack");
        if (payload) {
          pack = L.normalize(JSON.parse(L.decode(payload)), { id: id });
          if (pack.id !== id) throw new Error("This temporary pack link has an invalid identity. Import its JSON file instead.");
          L.save(pack);
        }
      }
      pack = pack || await L.load(id);
      document.title = pack.name + " | ACED";
      window.ACED_PACK = pack; window.ACED_QUESTIONS = pack.questions;
      learning = L.learning(id);
      learning.answers = learning.answers || {};
      learning.attempts = learning.attempts || 0; learning.correct = learning.correct || 0; learning.selfRated = learning.selfRated || 0;
      runStats = C.store.get("runStats_v1", { xp: 0, runs: 0, wins: 0, bestScore: 0 });
      C.review.migrateIds(pack.questions);
      $("intro-title").textContent = pack.name;
      $("intro-meta").textContent = (daily ? "DAILY RUN · " + today + " / " : "aced.run / ") + pack.subject + " · " + pack.questions.length + " questions";
      $("game-loading").hidden = true; $("game-intro").hidden = false;
      U.storageNotice(); window._ACED_BOOTED = true;
    } catch (e) {
      $("game-loading").hidden = true; $("game-error").hidden = false;
      $("game-error-message").textContent = e.message; window._ACED_BOOTED = false;
    }
  }
  $("retry-load").onclick = boot;
  $("start-run").onclick = start;
  window.render_game_to_text = function () {
    return JSON.stringify(!G ? { phase: pack ? "intro" : "loading", pack: pack ? pack.name : id } : {
      phase: G.phase, pack: pack.name, round: G.round + 1, rounds: G.runLength, target: G.target,
      score: G.score, totalScore: G.totalScore, cash: G.money, insight: G.insight, handsLeft: G.handsLeft,
      discards: G.discards, selected: Array.from(chosen), jokers: G.jokers, boss: G.boss,
      hand: G.hand.map(function (c) { return { id: c.id, rank: c.rank, suit: c.el, topic: c.moduleKey }; }),
      answers: G.answered, correct: G.correct, recall: L.progress(id, pack.questions).pct,
      scoring: {
        seed: G.seed, topics: G.topics, money: G.money, insight: G.insight,
        handsLeft: G.handsLeft, handsPlayed: G.handsPlayed, discards: G.discards,
        round: G.round, boss: G.boss, jokerState: G.jokerState, boosts: G.boosts,
        conv: G.conv, lastCorrect: G.lastCorrect, masteredCount: G.masteredCount,
        redeemedCount: G.redeemedCount, recallPct: G.recallPct
      },
      dialog: dialog.open ? dialog.querySelector("h2").textContent : null,
      layout: "DOM card game; card order is left-to-right, then top-to-bottom on narrow screens."
    });
  };
  // Turn-based rules change only on input; time advances cosmetic frames, not scores.
  window.advanceTime = function () { return Promise.resolve(); };
  window.addEventListener("beforeunload", function () {
    if (musicTimer) clearInterval(musicTimer);
    if (frameId) cancelAnimationFrame(frameId);
    if (audio) audio.close();
  });
  frameId = requestAnimationFrame(tick);
  boot();
})();
