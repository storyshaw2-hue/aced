/* Pure game rules, shared by the browser and Node tests. */
(function (root) {
  "use strict";
  var SUITS = { S: "♠", H: "♥", D: "♦", C: "♣" };
  var RANKS = { 11: "J", 12: "Q", 13: "K", 14: "A" };
  var HANDS = [
    { name: "Straight Flush", chips: 100, mult: 8, level: 9, how: "Five consecutive ranks, all one suit." },
    { name: "Four of a Kind", chips: 60, mult: 7, level: 8, how: "Four cards of the same rank." },
    { name: "Full House", chips: 40, mult: 4, level: 7, how: "Three of one rank and two of another." },
    { name: "Flush", chips: 35, mult: 4, level: 6, how: "Five cards of the same suit." },
    { name: "Straight", chips: 30, mult: 4, level: 5, how: "Five consecutive ranks. An ace can be low." },
    { name: "Three of a Kind", chips: 30, mult: 3, level: 4, how: "Three cards of the same rank." },
    { name: "Two Pair", chips: 20, mult: 2, level: 3, how: "Two different pairs." },
    { name: "Pair", chips: 10, mult: 2, level: 2, how: "Two cards of the same rank." },
    { name: "High Card", chips: 5, mult: 1, level: 1, how: "Any hand without a stronger combination." }
  ];
  function hash(value) {
    var h = 2166136261, s = String(value);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) || 123456789;
  }
  function random(holder) {
    var x = holder.seed || 123456789;
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    holder.seed = x >>> 0;
    return holder.seed / 4294967296;
  }
  function shuffle(input, holder) {
    var result = input.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(random(holder) * (i + 1));
      var value = result[i]; result[i] = result[j]; result[j] = value;
    }
    return result;
  }
  function deck(topics) {
    topics = topics && topics.length ? topics : ["General"];
    var result = [], i = 0;
    Object.keys(SUITS).forEach(function (suit) {
      for (var rank = 2; rank <= 14; rank++) {
        result.push({ id: suit + rank, rank: rank, el: suit, suit: suit,
          n: (RANKS[rank] || rank) + SUITS[suit], v: rank === 14 ? 11 : Math.min(10, rank),
          moduleKey: topics[i++ % topics.length], tags: [], weakness: false });
      }
    });
    return result;
  }
  function detect(cards) {
    if (!cards.length) return null;
    var ranks = Object.create(null), groups, straight = false;
    cards.forEach(function (c) { ranks[c.rank] = (ranks[c.rank] || 0) + 1; });
    groups = Object.values(ranks).sort(function (a, b) { return b - a; });
    var values = Object.keys(ranks).map(Number).sort(function (a, b) { return a - b; });
    if (values.length === 5) {
      straight = values[4] - values[0] === 4 || JSON.stringify(values) === "[2,3,4,5,14]";
    }
    var flush = cards.length === 5 && new Set(cards.map(function (c) { return c.el; })).size === 1;
    var index = straight && flush ? 0 : groups[0] === 4 ? 1 :
      groups[0] === 3 && groups[1] === 2 ? 2 : flush ? 3 : straight ? 4 :
      groups[0] === 3 ? 5 : groups[0] === 2 && groups[1] === 2 ? 6 : groups[0] === 2 ? 7 : 8;
    return Object.assign({}, HANDS[index]);
  }
  function score(cards, jokerIds, state, definitions, preview) {
    if (!Array.isArray(cards) || !cards.length || cards.length > 5) throw new Error("Select 1 to 5 cards.");
    var hand = detect(cards), work = preview ? JSON.parse(JSON.stringify(state)) : state;
    work.jokerState = work.jokerState || {};
    var effects = [], xMult = 1, earned = 0, errors = [], active = new Set(), depth = 0;
    var el = Object.create(null), topics = Array.from(new Set(cards.map(function (c) { return c.moduleKey; })));
    cards.forEach(function (c) { el[c.el] = (el[c.el] || 0) + 1; });
    var allDeck = deck(work.topics), deckCounts = Object.create(null);
    allDeck.forEach(function (c) { deckCounts[c.el] = (deckCounts[c.el] || 0) + 1; });
    var conv = work.conv || Object.create(null), topicValues = Object.values(conv);
    var ctx = {
      played: cards, hand: hand, el: el, topics: topics,
      chips: hand.chips + cards.reduce(function (n, c) { return n + c.v; }, 0),
      mult: hand.mult + 2 * ((work.boosts || {})[hand.name] || 0),
      money: work.money || 0, insight: work.insight || 0,
      topElCount: Math.max.apply(null, Object.values(el)), playedCats: Object.keys(el).length,
      deckSize: 52, deckCats: 4, deckElMax: 13, deckEl: function (key) { return deckCounts[key] || 0; },
      handsThisBlind: (work.handsPlayed || 0) + 1, handsLeft: work.handsLeft,
      discLeft: work.discards, isFirstHand: !work.handsPlayed, isLastHand: work.handsLeft === 1,
      isBoss: work.round % 3 === 2, roundsCleared: work.round,
      lastChallengeCorrect: !!work.lastCorrect, masteredCount: work.masteredCount || 0,
      conv: conv, convTotal: topicValues.reduce(function (n, v) { return n + v; }, 0),
      chargedCount: cards.filter(function (c) { return conv[c.moduleKey] > 0; }).length,
      redeemedCount: work.redeemedCount || 0, weaknessCount: 0, _avgMastery: work.recallPct || 0,
      jokerCount: jokerIds.length, jokerIndex: 0, leftRarity: null, rightRarity: null,
      addChips: function (amount, label) { ctx.chips += amount; if (amount) effects.push(label || "+" + amount + " chips"); },
      addMult: function (amount, label) { ctx.mult += amount; if (amount) effects.push(label || "+" + amount + " mult"); },
      xMult: function (amount, label) { xMult *= amount; effects.push(label || "×" + amount); },
      earn: function (amount) { earned += amount; ctx.money += amount; },
      st: function (id) { return work.jokerState[id] || (work.jokerState[id] = {}); },
      random: function () { return random(work); },
      _callout: function (message) { effects.push(message); }
    };
    function definition(id) { return definitions.find(function (j) { return j.id === id; }); }
    function applyAt(index) {
      if (index < 0 || index >= jokerIds.length || active.has(index) || depth > 10) return;
      var joker = definition(jokerIds[index]);
      if (!joker) return;
      var previous = ctx.jokerIndex, left = ctx.leftRarity, right = ctx.rightRarity;
      active.add(index); depth++; ctx.jokerIndex = index;
      ctx.leftRarity = index > 0 ? (definition(jokerIds[index - 1]) || {}).rarity : null;
      ctx.rightRarity = index + 1 < jokerIds.length ? (definition(jokerIds[index + 1]) || {}).rarity : null;
      try { joker.apply(ctx, joker); }
      catch (e) { errors.push(joker.id + ": " + e.message); }
      depth--; active.delete(index); ctx.jokerIndex = previous; ctx.leftRarity = left; ctx.rightRarity = right;
    }
    ctx.copyNeighbor = function (offset) { applyAt(ctx.jokerIndex + offset); };
    jokerIds.forEach(function (id, index) { applyAt(index); });
    if (work.boss === "toll") { ctx.mult = Math.max(1, ctx.mult - 2); effects.push("The Toll: −2 mult"); }
    var chips = Math.max(0, ctx.chips), mult = Math.max(1, ctx.mult) * xMult;
    return { hand: hand.name, chips: chips, mult: mult, total: Math.max(0, Math.floor(chips * mult)),
      earned: earned, effects: effects, errors: errors, state: work };
  }
  var api = { suits: SUITS, ranks: RANKS, hands: HANDS, hash: hash, random: random, shuffle: shuffle, deck: deck, detect: detect, score: score };
  root.ACEDGameRules = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
