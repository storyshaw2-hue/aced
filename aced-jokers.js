/* ACED — aced-jokers.js
   ============================================================================
   JOKERS: rule-bending scoring modifiers, the Balatro-style depth layer for the
   arcade. Subject-agnostic — every joker triggers on GENERIC signals the engine
   already has (conviction, streak, the family/type of the card via aced-cards,
   the family chain via aced-synergy, comebacks, mastery, ante), never on any
   subject's content. So the same jokers work for a Spanish deck, a biology deck,
   or your own notes.

   Scoring model (Balatro): each answered card resolves as CHIPS x MULT.
     - baseChips comes from the card (e.g. difficulty)
     - baseMult comes from conviction x streak
     - owned jokers then add chips, add mult, or xMult in loadout order
     - final score for the hand = round(chips) x mult
   score() returns the full breakdown so the UI can show each joker firing
   (that visible "my engine works" moment is the whole point).

   This module is pure logic (no DOM, no storage). The run holds which jokers
   are owned; you pass their ids into score(). Shop offers are rarity-weighted.

   Vanilla ES5 IIFE, attaches to window.ACEDJokers. aced-cards / aced-synergy are
   optional — jokers just read whatever ctx fields you pass.
   ============================================================================ */
(function () {
  "use strict";

  var RARITY = {
    common:   { label: "COMMON",   color: "#5cffea", weight: 0.64 },
    uncommon: { label: "UNCOMMON", color: "#22ff66", weight: 0.29 },
    rare:     { label: "RARE",     color: "#ffd23f", weight: 0.07 }
  };

  function clampInt(v, d) { v = parseInt(v, 10); return isNaN(v) ? (d || 0) : v; }

  /* --- the deck of jokers. apply(ctx) mutates the scoring accumulator. --------
     ctx fields the engine passes: correct, conviction ("low"|"med"|"high"),
     family (RECALL|MECHANISM|JUDGMENT|FORMULA|SORT|null), chain, streak, ante,
     mastered, distinctFamilies, justRecovered. Plus ctx.addChips / addMult /
     xMult. Most jokers only fire on a correct answer. */
  var CATALOG = [
    { id:"steady",   rarity:"common", cost:4, name:"Steady Hand",
      desc:"+15 chips every hand.",
      apply:function(c){ if(c.correct) c.addChips(15,"Steady Hand"); } },

    { id:"streaker", rarity:"common", cost:5, name:"Streaker",
      desc:"+3 mult for each answer in your current streak (max +24).",
      apply:function(c){ if(c.correct) c.addMult(3*Math.min(c.streak,8),"Streaker"); } },

    { id:"sure",     rarity:"common", cost:5, name:"Sure Thing",
      desc:"+35 chips when you answer on CERTAIN.",
      apply:function(c){ if(c.correct && c.conviction==="high") c.addChips(35,"Sure Thing"); } },

    { id:"warmup",   rarity:"common", cost:4, name:"Warm-Up",
      desc:"+2 mult, and +2 more each ante.",
      apply:function(c){ if(c.correct) c.addMult(2*Math.max(1,c.ante),"Warm-Up"); } },

    { id:"analyst",  rarity:"uncommon", cost:7, name:"Analyst",
      desc:"+7 mult on Judgment cards (comparisons, exceptions, application).",
      apply:function(c){ if(c.correct && c.family==="JUDGMENT") c.addMult(7,"Analyst"); } },

    { id:"mechanic", rarity:"uncommon", cost:7, name:"The Mechanic",
      desc:"+7 mult on Mechanism cards (process, sequence, cause/effect).",
      apply:function(c){ if(c.correct && c.family==="MECHANISM") c.addMult(7,"The Mechanic"); } },

    { id:"highroll", rarity:"uncommon", cost:8, name:"High Roller",
      desc:"x1.5 mult when you answer on CERTAIN.",
      apply:function(c){ if(c.correct && c.conviction==="high") c.xMult(1.5,"High Roller"); } },

    { id:"chain",    rarity:"uncommon", cost:8, name:"Chain Reaction",
      desc:"x mult scales with your family chain (up to x2 at chain 5).",
      apply:function(c){ if(c.correct && c.chain>=2) c.xMult(1+0.2*Math.min(c.chain,5),"Chain Reaction"); } },

    { id:"comeback", rarity:"uncommon", cost:6, name:"Comeback Kid",
      desc:"+60 chips on a correct answer right after a miss.",
      apply:function(c){ if(c.correct && c.justRecovered) c.addChips(60,"Comeback Kid"); } },

    { id:"scholar",  rarity:"rare", cost:9, name:"Scholar",
      desc:"+5 chips for every question you've mastered this run.",
      apply:function(c){ if(c.correct) c.addChips(5*Math.max(0,c.mastered),"Scholar"); } },

    { id:"polymath", rarity:"rare", cost:9, name:"Polymath",
      desc:"+5 mult for each different card type you've played this run.",
      apply:function(c){ if(c.correct) c.addMult(5*Math.max(0,c.distinctFamilies),"Polymath"); } },

    { id:"glass",    rarity:"rare", cost:9, name:"Glass Cannon",
      desc:"x2 mult — but a miss costs double (handled by the run).",
      apply:function(c){ if(c.correct) c.xMult(2,"Glass Cannon"); } }
  ];

  function def(id){ for(var i=0;i<CATALOG.length;i++){ if(CATALOG[i].id===id) return CATALOG[i]; } return null; }

  /* --- shop: rarity-weighted offers. rng optional (for tests/seeding). ------- */
  function rollShop(n, opts){
    opts = opts || {};
    var rng = (typeof opts.rng === "function") ? opts.rng : Math.random;
    var exclude = {}; (opts.exclude||[]).forEach(function(id){ exclude[id]=1; });
    var pool = CATALOG.filter(function(j){ return !exclude[j.id]; });
    n = Math.max(0, Math.min(clampInt(n,3), pool.length));
    var picked = [], used = {};
    var guard = 0;
    while (picked.length < n && guard < 500){
      guard++;
      // choose a rarity by weight, then a random joker of that rarity from pool
      var r = rng(), acc = 0, chosenRarity = "common";
      for (var k in RARITY){ if(RARITY.hasOwnProperty(k)){ acc += RARITY[k].weight; if(r <= acc){ chosenRarity = k; break; } } }
      var band = pool.filter(function(j){ return j.rarity===chosenRarity && !used[j.id]; });
      if (!band.length) band = pool.filter(function(j){ return !used[j.id]; }); // fall back to any unused
      if (!band.length) break;
      var pick = band[Math.floor(rng()*band.length) % band.length];
      used[pick.id] = 1; picked.push(pick);
    }
    return picked;
  }

  /* --- score one answered card through the owned jokers. --------------------- */
  function score(input){
    input = input || {};
    var acc = {
      chips: (typeof input.baseChips === "number") ? input.baseChips : 10,
      mult:  (typeof input.baseMult  === "number") ? input.baseMult  : 1,
      correct: !!input.correct,
      conviction: input.conviction || "med",
      family: input.family || null,
      chain: clampInt(input.chain,0),
      streak: clampInt(input.streak,0),
      ante: clampInt(input.ante,0),
      mastered: clampInt(input.mastered,0),
      distinctFamilies: clampInt(input.distinctFamilies,0),
      justRecovered: !!input.justRecovered,
      fired: [],
      addChips:function(nv,why){ this.chips += nv; this.fired.push({type:"chips",n:nv,why:why}); },
      addMult: function(nv,why){ this.mult  += nv; this.fired.push({type:"mult", n:nv,why:why}); },
      xMult:   function(nv,why){ this.mult  *= nv; this.fired.push({type:"xmult",n:nv,why:why}); }
    };
    var ids = input.jokers || [];
    for (var i=0;i<ids.length;i++){
      var d = def(ids[i]);
      if (d && d.apply){ try { d.apply(acc); } catch(e){} }
    }
    var chips = Math.max(0, Math.round(acc.chips));
    var mult = Math.max(0, acc.mult);
    return { chips: chips, mult: mult, total: Math.round(chips*mult),
             fired: acc.fired.map(function(f){ return { type:f.type, n:f.n, why:f.why }; }) };
  }

  window.ACEDJokers = {
    version: 1,
    RARITY: RARITY,
    CATALOG: CATALOG,
    def: def,
    rollShop: rollShop,
    score: score
  };
})();
