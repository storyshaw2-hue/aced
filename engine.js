/* =========================================================================
   ACED ENGINE v2 — Question Index, Mastery Tracking, Spaced Repetition (SM-2)
   =========================================================================
   Pure-logic library. No DOM. Plugs into:
     - index.html (roguelike run)
     - mockexam.html (30Q cumulative test)
     - dashboard.html (progress + mode-switcher)
     - drill.html (targeted module drill)
     - review.html (weak-module review)

   Persistence:
     - Primary: window.localStorage (key 'aced_v2_state')
     - Sandbox iframe fallback: in-memory window.ACED_STATE only
     - On every save we try both. UI never crashes if storage is blocked.

   Public API:
     ACEDEngine.init()                    -> initialises index + loads state
     ACEDEngine.modules                   -> [{section, module, label, count, questions:[refs]}]
     ACEDEngine.allQuestions              -> flat array with module-tagged refs
     ACEDEngine.mastery(moduleKey)        -> {seen, correct, accuracy, dueCount, masteryScore}
     ACEDEngine.sectionMastery(section)   -> aggregated across F1..F6
     ACEDEngine.recordAnswer(qref, ok)    -> updates card + persists
     ACEDEngine.dueQueue(moduleKey, n)    -> next n SR-due questions for module
     ACEDEngine.weakestModules(n)         -> n modules ranked by mastery ASC (with ≥3 seen)
     ACEDEngine.cumulativePool(n)         -> n random questions stratified by section
     ACEDEngine.tierShuffle(tier, n)      -> n random questions of a given tier
     ACEDEngine.export()                  -> JSON string of state
     ACEDEngine.import(jsonStr)           -> restores state
     ACEDEngine.reset()                   -> wipes mastery (asks confirm in UI)
     ACEDEngine.stats()                   -> {totalQ, seenQ, masteredQ, sectionsCovered}
   ========================================================================= */

(function(){
  'use strict';

  // ---- FAR Blueprint module labels (full set; will fill in as modules land) ----
  const MODULE_LABELS = {
    'F1.M1':'Standard-Setting & Conceptual Framework',
    'F1.M2':'Income Statement & Net Income',
    'F1.M3':'Discontinued Operations',
    'F1.M4':'Comprehensive Income',
    'F1.M5':'Statement of Changes in Equity',
    'F1.M6':'Balance Sheet & Disclosures',
    'F1.M7':'Notes to Financial Statements',
    'F1.M8':'Risks & Uncertainties / Subsequent Events',
    'F1.M9':'Going Concern',
    'F1.M10':'Public Co. Reporting (10-K/10-Q)',
    'F2.M1':'Cash & Equivalents',
    'F2.M2':'Trade & Bank Reconciliations',
    'F2.M3':'Receivables (incl. CECL)',
    'F2.M4':'Inventory',
    'F2.M5':'PP&E — Acquisition',
    'F2.M6':'Depreciation · Depletion · Impairment · Held-for-Sale',
    'F2.M7':'Intangible Assets',
    'F2.M8':'Payables & Accrued Liabilities',
    'F2.M9':'Contingencies & Commitments',
    'F2.M10':'Long-Term Debt & Notes',
    'F3.M1':'Investments — Trading/AFS/HTM',
    'F3.M2':'Equity Method',
    'F3.M3':'Business Combinations',
    'F3.M4':'Consolidations & NCI',
    'F3.M5':'Bonds — Issuance & Amortization',
    'F3.M6':'Bonds — Special Situations',
    'F3.M7':'Leases — Lessee',
    'F3.M8':'Leases — Lessor',
    'F3.M9':'Income Tax — Current & Deferred',
    'F3.M10':'Pensions & Postretirement',
    'F4.M1':'Stockholders Equity — Issuance & Treasury',
    'F4.M2':'Dividends & Stock Splits',
    'F4.M3':'EPS — Basic & Diluted',
    'F4.M4':'Revenue Recognition (ASC 606)',
    'F4.M5':'Compensation — Stock-Based',
    'F4.M6':'Statement of Cash Flows',
    'F4.M7':'Foreign Currency',
    'F4.M8':'Derivatives & Hedging',
    'F5.M1':'Govt Accounting — Fund Structure',
    'F5.M2':'Govt — General/Special Revenue Funds',
    'F5.M3':'Govt — Other Governmental Funds',
    'F5.M4':'Govt — Proprietary & Fiduciary',
    'F5.M5':'Govt — Government-Wide Statements',
    'F5.M6':'Govt — Reconciliation & MD&A',
    'F6.M1':'NFP — Net Asset Classification',
    'F6.M2':'NFP — Contributions',
    'F6.M3':'NFP — Statement of Activities',
    'F6.M4':'NFP — Healthcare & Universities',
  };

  const SECTION_LABELS = {
    F1:'Conceptual Framework & Financial Reporting',
    F2:'Financial Statement Accounts — Assets & Liabilities',
    F3:'Select Transactions',
    F4:'Equity, Revenue, Cash Flow',
    F5:'State & Local Governments',
    F6:'Not-for-Profit'
  };

  // ---- STATE ----
  const STATE_KEY = 'aced_v2_state';
  const DEFAULT_STATE = {
    version:2,
    cards:{},        // qref -> {seen, correct, ef, interval, due, lastSeen, history:[]}
    streak:0,
    lastStudy:null,
    settings:{srEnabled:true}
  };

  function loadState(){
    try{
      const raw = localStorage.getItem(STATE_KEY);
      if(raw){
        const s = JSON.parse(raw);
        if(s && s.version===2) return s;
      }
    }catch(e){ /* sandbox blocks storage */ }
    if(window.ACED_STATE && window.ACED_STATE.version===2) return window.ACED_STATE;
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
  function saveState(s){
    try{ localStorage.setItem(STATE_KEY, JSON.stringify(s)); }catch(e){}
    window.ACED_STATE = s;
  }

  // ---- INDEX BUILD ----
  // Each question gets a globally unique reference: `<section>.<module>.<tier>.<idx>`
  // We tag a `moduleKey` like 'F2.M6'. If a question's `source` field is missing,
  // module = 'UNKNOWN' so it still appears in the cumulative pool.

  let _modules = null;      // {key: {section, module, label, count, refs:[]}}
  let _all = null;          // array of {ref, q, choices, answer, explain, topic, tier, moduleKey}
  let _byRef = null;        // ref -> question

  function buildIndex(){
    if(_all) return;
    _modules = {};
    _all = [];
    _byRef = {};
    const Q = window.QUESTIONS || {};
    for(const tierKey of Object.keys(Q)){
      const tier = parseInt(tierKey, 10);
      const arr = (Q[tierKey] && Q[tierKey].questions) || [];
      arr.forEach((q, idx)=>{
        // Module key: prefer explicit source, fall back to topic heuristic
        let moduleKey = 'UNKNOWN';
        if(q.source && /^F[1-6]\.M\d+/.test(q.source)){
          const m = q.source.match(/^(F[1-6]\.M\d+)/);
          if(m) moduleKey = m[1];
        }
        const ref = `${moduleKey}.T${tier}.${idx}`;
        const entry = {
          ref, q:q.q, choices:q.choices, answer:q.answer,
          explain:q.explain, topic:q.topic||'', tier, moduleKey,
          source:q.source||''
        };
        _all.push(entry);
        _byRef[ref] = entry;
        if(!_modules[moduleKey]){
          _modules[moduleKey] = {
            key:moduleKey,
            section:moduleKey.split('.')[0],
            module:moduleKey.split('.')[1],
            label:MODULE_LABELS[moduleKey] || moduleKey,
            count:0, refs:[]
          };
        }
        _modules[moduleKey].count++;
        _modules[moduleKey].refs.push(ref);
      });
    }

    // ---- COMBINED BANK (401 MCQs from F1.M1-F4.M5 PDF) ----
    if(window.ACED_FAR_COMBINED && Array.isArray(window.ACED_FAR_COMBINED)){
      window.ACED_FAR_COMBINED.forEach((q, idx)=>{
        let moduleKey = 'UNKNOWN';
        if(q.source && /^F[1-6]\.M\d+/.test(q.source)){
          const m = q.source.match(/^(F[1-6]\.M\d+)/);
          if(m) moduleKey = m[1];
        }
        const tier = q.tier || 4;
        const ref = `${moduleKey}.COMBINED.${idx}`;
        const entry = {
          ref, q:q.q, choices:q.choices, answer:q.answer,
          explain:q.explain, topic:q.topic||'', tier, moduleKey,
          source:q.source||'', mcqId:q.mcqId||''
        };
        _all.push(entry);
        _byRef[ref] = entry;
        if(!_modules[moduleKey]){
          _modules[moduleKey] = {
            key:moduleKey,
            section:moduleKey.split('.')[0],
            module:moduleKey.split('.')[1],
            label:MODULE_LABELS[moduleKey] || moduleKey,
            count:0, refs:[]
          };
        }
        _modules[moduleKey].count++;
        _modules[moduleKey].refs.push(ref);
      });
    }
  }

  // ---- SR (SM-2 simplified) ----
  // ef: ease factor (start 2.5)
  // interval: days until next due (0 = new)
  // grade: ok ? 4 : 1 (correct = good recall, wrong = forgotten)
  function ensureCard(ref, state){
    if(!state.cards[ref]){
      state.cards[ref] = {
        seen:0, correct:0, ef:2.5, interval:0,
        due:Date.now(), lastSeen:null, history:[]
      };
    }
    return state.cards[ref];
  }

  function updateCard(card, ok){
    card.seen++;
    if(ok) card.correct++;
    card.lastSeen = Date.now();
    card.history.push({t:card.lastSeen, ok});
    if(card.history.length > 50) card.history = card.history.slice(-50);

    const grade = ok ? 4 : 1;
    // SM-2 ease factor update
    card.ef = Math.max(1.3, card.ef + (0.1 - (5-grade)*(0.08 + (5-grade)*0.02)));

    // Interval progression
    if(!ok){
      card.interval = 0;       // reset on failure
    }else if(card.interval === 0){
      card.interval = 1;       // 1 day
    }else if(card.interval === 1){
      card.interval = 3;       // 3 days
    }else{
      card.interval = Math.round(card.interval * card.ef);
    }
    card.due = Date.now() + card.interval * 86400000;
    return card;
  }

  // ---- PUBLIC API ----
  let _state = null;

  const API = {
    init(){
      buildIndex();
      _state = loadState();
      return API;
    },
    get modules(){ buildIndex(); return _modules; },
    get allQuestions(){ buildIndex(); return _all; },
    get sectionLabels(){ return SECTION_LABELS; },
    get moduleLabels(){ return MODULE_LABELS; },

    moduleList(){
      buildIndex();
      // Return sorted: section asc, module number asc, then any UNKNOWN last
      const list = Object.values(_modules);
      list.sort((a,b)=>{
        if(a.key==='UNKNOWN') return 1;
        if(b.key==='UNKNOWN') return -1;
        const [sa, ma] = a.key.split('.');
        const [sb, mb] = b.key.split('.');
        if(sa!==sb) return sa.localeCompare(sb);
        return parseInt(ma.replace('M',''),10) - parseInt(mb.replace('M',''),10);
      });
      return list;
    },

    sections(){
      buildIndex();
      const map = {};
      this.moduleList().forEach(m=>{
        if(!map[m.section]){
          map[m.section] = {
            section:m.section,
            label:SECTION_LABELS[m.section] || m.section,
            modules:[], totalQ:0
          };
        }
        map[m.section].modules.push(m);
        map[m.section].totalQ += m.count;
      });
      return Object.values(map);
    },

    mastery(moduleKey){
      if(!_state) this.init();
      const mod = _modules[moduleKey];
      if(!mod) return {seen:0, correct:0, accuracy:0, dueCount:0, masteryScore:0, total:0};
      let seen=0, correct=0, dueCount=0, totalSeenQ=0;
      const now = Date.now();
      for(const ref of mod.refs){
        const c = _state.cards[ref];
        if(c){
          seen += c.seen;
          correct += c.correct;
          if(c.seen>0) totalSeenQ++;
          if(c.due <= now) dueCount++;
        }
      }
      const accuracy = seen>0 ? correct/seen : 0;
      // mastery score: blend of coverage (how many distinct Qs seen) and accuracy
      const coverage = mod.count>0 ? totalSeenQ/mod.count : 0;
      const masteryScore = Math.round(100 * (0.4*coverage + 0.6*accuracy));
      return {seen, correct, accuracy, dueCount, masteryScore, total:mod.count, distinctSeen:totalSeenQ};
    },

    sectionMastery(section){
      if(!_state) this.init();
      let seen=0, correct=0, total=0, distinctSeen=0;
      this.moduleList().filter(m=>m.section===section).forEach(m=>{
        const ms = this.mastery(m.key);
        seen += ms.seen; correct += ms.correct;
        total += ms.total; distinctSeen += ms.distinctSeen;
      });
      const accuracy = seen>0 ? correct/seen : 0;
      const coverage = total>0 ? distinctSeen/total : 0;
      return {seen, correct, accuracy, total, distinctSeen, coverage,
              masteryScore: Math.round(100*(0.4*coverage+0.6*accuracy))};
    },

    recordAnswer(qref, ok){
      if(!_state) this.init();
      const card = ensureCard(qref, _state);
      updateCard(card, ok);
      // Streak: bump if studied today, reset if yesterday's streak lapsed
      const today = new Date(); today.setHours(0,0,0,0);
      const last = _state.lastStudy ? new Date(_state.lastStudy) : null;
      if(last){
        last.setHours(0,0,0,0);
        const diffDays = Math.round((today-last)/86400000);
        if(diffDays===0){ /* same day, streak stable */ }
        else if(diffDays===1){ _state.streak++; }
        else { _state.streak = 1; }
      }else{
        _state.streak = 1;
      }
      _state.lastStudy = Date.now();
      saveState(_state);
      return card;
    },

    dueQueue(moduleKey, n){
      if(!_state) this.init();
      const mod = _modules[moduleKey];
      if(!mod) return [];
      const now = Date.now();
      const items = mod.refs.map(ref=>{
        const c = _state.cards[ref];
        return {ref, due: c ? c.due : 0, seen: c ? c.seen : 0, q:_byRef[ref]};
      });
      // Priority: never-seen first (Leitner box 0), then due-now (oldest first)
      items.sort((a,b)=>{
        if(a.seen===0 && b.seen>0) return -1;
        if(b.seen===0 && a.seen>0) return 1;
        return a.due - b.due;
      });
      return items.slice(0, n||10).map(i=>i.q);
    },

    weakestModules(n){
      if(!_state) this.init();
      const list = this.moduleList()
        .filter(m=>m.key!=='UNKNOWN')
        .map(m=>({mod:m, mastery:this.mastery(m.key)}))
        .filter(x=>x.mastery.seen >= 3)         // need ≥3 attempts to rank
        .sort((a,b)=>a.mastery.masteryScore - b.mastery.masteryScore);
      return list.slice(0, n||5);
    },

    cumulativePool(n){
      buildIndex();
      // Stratified random sample: try to draw proportionally from each section
      const sections = this.sections();
      const totalQ = sections.reduce((s,sec)=>s+sec.totalQ, 0);
      const out = [];
      sections.forEach(sec=>{
        const take = Math.max(1, Math.round((sec.totalQ/totalQ) * n));
        const sectionQs = _all.filter(q=>q.moduleKey.startsWith(sec.section));
        // shuffle
        for(let i=sectionQs.length-1;i>0;i--){
          const j = Math.floor(Math.random()*(i+1));
          [sectionQs[i], sectionQs[j]] = [sectionQs[j], sectionQs[i]];
        }
        out.push(...sectionQs.slice(0, take));
      });
      // truncate or pad to n with random fills
      while(out.length < n){
        const q = _all[Math.floor(Math.random()*_all.length)];
        if(!out.includes(q)) out.push(q);
      }
      out.length = Math.min(out.length, n);
      // final shuffle
      for(let i=out.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },

    tierShuffle(tier, n){
      buildIndex();
      const arr = _all.filter(q=>q.tier===tier);
      for(let i=arr.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.slice(0, n||arr.length);
    },

    questionByRef(ref){
      buildIndex();
      return _byRef[ref];
    },

    stats(){
      if(!_state) this.init();
      const totalQ = _all.length;
      let seenQ = 0, masteredQ = 0;
      for(const ref of Object.keys(_state.cards)){
        const c = _state.cards[ref];
        if(c.seen>0) seenQ++;
        if(c.interval >= 7 && c.correct/c.seen >= 0.8) masteredQ++;
      }
      const sectionsCovered = this.sections().filter(s=>{
        return s.modules.some(m=>this.mastery(m.key).seen>0);
      }).length;
      return {totalQ, seenQ, masteredQ, sectionsCovered, streak:_state.streak,
              lastStudy:_state.lastStudy};
    },

    export(){
      if(!_state) this.init();
      return JSON.stringify(_state);
    },
    import(jsonStr){
      try{
        const s = JSON.parse(jsonStr);
        if(s && s.version===2){ _state = s; saveState(_state); return true; }
      }catch(e){}
      return false;
    },
    reset(){
      _state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      saveState(_state);
    }
  };

  window.ACEDEngine = API;
})();
