// ============================================================================
// ACED — TBS ENGINE
// Renders TBS modal, captures input, grades, awards score.
// Globals: window.TBS_LIBRARY (data), window.openTBS(tbsId, onComplete)
// ============================================================================
(function(){
  let activeTbs = null;     // current TBS data
  let userAnswers = {};     // { rowNum: {account, amount, debit, credit, noEntry} }
  let openExhibit = null;   // currently expanded exhibit name
  let graded = false;
  let onCompleteCb = null;
  let gradeResult = null;   // { cellsCorrect, totalCells, awarded, perCellResults }

  function el(tag, attrs, children){
    const e = document.createElement(tag);
    if(attrs){
      for(const k in attrs){
        if(k === 'className') e.className = attrs[k];
        else if(k === 'onClick') e.addEventListener('click', attrs[k]);
        else if(k === 'onChange') e.addEventListener('change', attrs[k]);
        else if(k === 'onInput') e.addEventListener('input', attrs[k]);
        else if(k === 'html') e.innerHTML = attrs[k];
        else e.setAttribute(k, attrs[k]);
      }
    }
    if(children){
      (Array.isArray(children) ? children : [children]).forEach(c => {
        if(c == null || c === false) return;
        if(typeof c === 'string') e.appendChild(document.createTextNode(c));
        else e.appendChild(c);
      });
    }
    return e;
  }

  function fmtMoney(n){
    if(n == null || n === '' || isNaN(n)) return '';
    const abs = Math.abs(n);
    const s = '$' + abs.toLocaleString();
    return n < 0 ? '(' + s + ')' : s;
  }

  function parseAmount(str){
    if(!str) return null;
    str = String(str).trim();
    if(str === '') return null;
    // (123,456) => -123456
    const neg = /^\(.+\)$/.test(str);
    let num = str.replace(/[\$,\s\(\)]/g, '');
    const n = parseFloat(num);
    if(isNaN(n)) return null;
    return neg ? -n : n;
  }

  function autoSum(rows, idxList){
    let total = 0;
    let allPresent = true;
    idxList.forEach(rn => {
      const row = rows.find(r => r.row === rn);
      if(!row) return;
      // For locked rows use the row's amount; for user rows use userAnswers
      if(row.locked && (row.amount != null)) {
        total += row.amount;
      } else if(row.isTotal && row._cachedTotal != null) {
        total += row._cachedTotal;
      } else {
        const ans = userAnswers[rn];
        if(ans && ans.amount != null) total += ans.amount;
        else allPresent = false;
      }
    });
    return total;
  }

  // ---------- RENDERING ----------
  function render(){
    const overlay = document.getElementById('tbs-overlay');
    overlay.innerHTML = '';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';

    const modal = el('div', {className:'tbs-modal'});
    overlay.appendChild(modal);

    // Header
    modal.appendChild(el('div', {className:'tbs-header'}, [
      el('div', {}, [
        el('span', {className:'tbs-tag'}, 'TBS BOSS'),
        el('span', {className:'tbs-title'}, activeTbs.title.toUpperCase()),
      ]),
      el('div', {className:'tbs-meta'}, [
        activeTbs.tbsId + ' · ' + activeTbs.module,
      ]),
    ]));

    modal.appendChild(el('div', {className:'tbs-prompt', html: activeTbs.prompt}));

    // Layout: sheet + exhibits
    const layout = el('div', {className:'tbs-layout'});
    modal.appendChild(layout);

    layout.appendChild(renderSheet());
    layout.appendChild(renderExhibits());

    // Actions
    const actions = el('div', {className:'tbs-actions'});
    const score = graded
      ? `${gradeResult.cellsCorrect}/${gradeResult.totalCells} CORRECT · +${gradeResult.awarded} CHIPS`
      : 'EXHIBITS REVEAL THE TRUTH';
    actions.appendChild(el('div', {className:'tbs-score'}, score));

    if(!graded){
      actions.appendChild(el('button', {className:'tbs-btn', onClick: grade}, 'SUBMIT ANSWER'));
    } else {
      actions.appendChild(el('button', {className:'tbs-btn', onClick: closeAndReturn}, 'CONTINUE'));
    }
    modal.appendChild(actions);

    if(graded){
      modal.appendChild(renderExplanations());
    }
  }

  function renderSheet(){
    const wrap = el('div', {className:'tbs-sheet'});
    const table = el('table');
    wrap.appendChild(table);
    const tbs = activeTbs;

    // Header row
    const thead = el('thead');
    table.appendChild(thead);
    const headRow = el('tr');
    headRow.appendChild(el('th', {className:'row-num'}, '#'));
    if(tbs.columns){
      tbs.columns.forEach(col => {
        headRow.appendChild(el('th', {}, col.label || col.col));
      });
    } else {
      headRow.appendChild(el('th', {className:'col-a'}, 'A'));
      headRow.appendChild(el('th', {className:'col-b'}, 'B'));
    }
    thead.appendChild(headRow);

    const tbody = el('tbody');
    table.appendChild(tbody);

    tbs.rows.forEach(row => {
      if(row.hidden) return;
      const tr = el('tr');
      // Classify
      const classes = [];
      if(row.locked) classes.push('locked');
      if(row.section) classes.push('section');
      if(row.isTotal) classes.push('total');
      if(row.isHeader) classes.push('header-row');

      // Grading visualization
      if(graded && gradeResult.perCellResults[row.row]) {
        const r = gradeResult.perCellResults[row.row];
        if(r.allCorrect) classes.push('graded-correct');
        else if(r.anyWrong) classes.push('graded-wrong');
      }

      tr.className = classes.join(' ');
      tr.appendChild(el('td', {className:'row-num'}, String(row.row)));

      // Header row: spans columns
      if(row.isHeader){
        const colspan = (tbs.columns ? tbs.columns.length : 2);
        const td = el('td', {colspan: colspan}, row.label || '');
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
      }

      // Section row: spans 2
      if(row.section){
        const colspan = (tbs.columns ? tbs.columns.length : 2);
        const td = el('td', {colspan: colspan, className: 'indent-'+(row.indent||0)}, row.label || '');
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
      }

      // Multi-column TBS (e.g. Year 1 / Year 2)
      if(tbs.columns && tbs.columns.length > 1){
        const labelTd = el('td', {className: 'col-a indent-'+(row.indent||0)}, row.label || '');
        tr.appendChild(labelTd);

        for(let i=1; i<tbs.columns.length; i++){
          const colKey = i === 1 ? 'Y1' : 'Y2';
          const td = el('td', {className:'col-b'});
          if(row.isTotal){
            // Compute total for this column
            let total = 0;
            tbs.rows.forEach(r => {
              if(r === row || r.isTotal) return;
              const exp = colKey === 'Y1' ? r.expectedY1 : r.expectedY2;
              const ans = userAnswers[r.row];
              if(ans && ans[colKey] != null && exp !== undefined) {
                total += ans[colKey];
              }
            });
            td.textContent = fmtMoney(total);
          } else if(row.locked) {
            const v = colKey === 'Y1' ? row.amountY1 : row.amountY2;
            td.textContent = v != null ? fmtMoney(v) : '';
          } else {
            const inp = el('input', {
              className:'amount',
              type:'text',
              placeholder:'0',
              value: (userAnswers[row.row] && userAnswers[row.row][colKey] != null) ? userAnswers[row.row][colKey] : '',
              onInput: (e) => {
                const v = parseAmount(e.target.value);
                userAnswers[row.row] = userAnswers[row.row] || {};
                userAnswers[row.row][colKey] = v;
              }
            });
            if(graded) inp.disabled = true;
            td.appendChild(inp);
          }
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
        return;
      }

      // Standard 2-column TBS: col A (account) + col B (amount)
      const aTd = el('td', {className:'col-a indent-'+(row.indent||0)});
      const bTd = el('td', {className:'col-b'});

      if(row.locked){
        // Pre-filled label + amount
        aTd.textContent = row.label || row.account || '';
        if(row.isTotal && row.autoSum){
          const total = autoSum(tbs.rows, row.autoSum);
          row._cachedTotal = total;
          bTd.textContent = fmtMoney(total);
        } else {
          bTd.textContent = row.amount != null ? fmtMoney(row.amount) : '';
        }
      } else if(row.isTotal){
        aTd.textContent = row.label || '';
        if(row.autoSum){
          const total = autoSum(tbs.rows, row.autoSum);
          row._cachedTotal = total;
          bTd.textContent = fmtMoney(total);
        } else {
          bTd.textContent = '';
        }
      } else {
        // Editable: account dropdown (if available) + amount input
        if(tbs.accountOptions && row.expectedAccount !== undefined){
          const sel = el('select');
          sel.appendChild(el('option', {value:''}, '— Select account —'));
          tbs.accountOptions.forEach(opt => {
            const o = el('option', {value: opt}, opt);
            if(userAnswers[row.row] && userAnswers[row.row].account === opt) o.selected = true;
            sel.appendChild(o);
          });
          sel.addEventListener('change', (e) => {
            userAnswers[row.row] = userAnswers[row.row] || {};
            userAnswers[row.row].account = e.target.value;
          });
          if(graded) sel.disabled = true;
          aTd.appendChild(sel);
        } else {
          aTd.textContent = row.label || '';
        }

        if(row.expectedAmount !== undefined){
          const inp = el('input', {
            className:'amount',
            type:'text',
            placeholder:'$0',
            value: (userAnswers[row.row] && userAnswers[row.row].amount != null) ? userAnswers[row.row].amount : '',
            onInput: (e) => {
              const v = parseAmount(e.target.value);
              userAnswers[row.row] = userAnswers[row.row] || {};
              userAnswers[row.row].amount = v;
            }
          });
          if(graded) inp.disabled = true;
          bTd.appendChild(inp);
        }
      }
      tr.appendChild(aTd);
      tr.appendChild(bTd);
      tbody.appendChild(tr);
    });

    return wrap;
  }

  function renderExhibits(){
    const wrap = el('div', {className:'tbs-exhibits'});
    wrap.appendChild(el('h3', {}, 'EXHIBITS'));
    activeTbs.exhibits.forEach(ex => {
      const tab = el('button', {
        className: 'tbs-exhibit-tab' + (openExhibit === ex.name ? ' open' : ''),
        onClick: () => {
          openExhibit = (openExhibit === ex.name) ? null : ex.name;
          render();
        }
      }, (openExhibit === ex.name ? '▼ ' : '▶ ') + ex.name);
      wrap.appendChild(tab);
      if(openExhibit === ex.name){
        wrap.appendChild(el('div', {className:'tbs-exhibit-body'}, ex.body));
      }
    });
    return wrap;
  }

  function renderExplanations(){
    const wrap = el('div', {className:'tbs-explain'});
    wrap.appendChild(el('h4', {}, 'EXPLANATIONS'));
    if(activeTbs.explanations){
      activeTbs.explanations.forEach(ex => {
        const div = el('div', {className:'e-row'});
        const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
        div.innerHTML = '<b>Row ' + esc(ex.row) + ':</b> ' + esc(ex.text);
        wrap.appendChild(div);
      });
    }
    return wrap;
  }

  // ---------- GRADING ----------
  function grade(){
    const tbs = activeTbs;
    let cellsCorrect = 0;
    let totalCells = 0;
    const perCellResults = {};

    tbs.rows.forEach(row => {
      if(row.locked || row.isTotal || row.isHeader || row.section) return;

      // Multi-column TBS
      if(tbs.columns && tbs.columns.length > 1){
        const ans = userAnswers[row.row] || {};
        let rowAllCorrect = true, rowAnyWrong = false;
        if(row.expectedY1 !== undefined){
          totalCells++;
          if(Number(ans.Y1) === Number(row.expectedY1)){
            cellsCorrect++;
          } else { rowAllCorrect = false; rowAnyWrong = true; }
        }
        if(row.expectedY2 !== undefined){
          totalCells++;
          if(Number(ans.Y2) === Number(row.expectedY2)){
            cellsCorrect++;
          } else { rowAllCorrect = false; rowAnyWrong = true; }
        }
        perCellResults[row.row] = { allCorrect: rowAllCorrect, anyWrong: rowAnyWrong };
        return;
      }

      // Standard TBS
      const ans = userAnswers[row.row] || {};
      let rowAllCorrect = true, rowAnyWrong = false;
      if(row.expectedAccount !== undefined && row.expectedAccount !== null){
        totalCells++;
        if(ans.account === row.expectedAccount){
          cellsCorrect++;
        } else { rowAllCorrect = false; rowAnyWrong = true; }
      } else if(row.expectedAccount === null && row.allowBlank){
        totalCells++;
        if(!ans.account || ans.account === '') {
          cellsCorrect++;
        } else { rowAllCorrect = false; rowAnyWrong = true; }
      }
      if(row.expectedAmount !== undefined && row.expectedAmount !== null){
        totalCells++;
        if(Number(ans.amount) === Number(row.expectedAmount)){
          cellsCorrect++;
        } else { rowAllCorrect = false; rowAnyWrong = true; }
      } else if(row.expectedAmount === null && row.allowBlank){
        totalCells++;
        if(ans.amount == null) {
          cellsCorrect++;
        } else { rowAllCorrect = false; rowAnyWrong = true; }
      }
      perCellResults[row.row] = { allCorrect: rowAllCorrect, anyWrong: rowAnyWrong };
    });

    const sc = tbs.scoring || { basePerCell: 25, mult: 5, bonusAllCorrect: 200 };
    let awarded = cellsCorrect * sc.basePerCell * sc.mult;
    if(cellsCorrect === totalCells && totalCells > 0) awarded += sc.bonusAllCorrect;

    gradeResult = { cellsCorrect, totalCells, awarded, perCellResults };
    graded = true;
    render();
  }

  function closeAndReturn(){
    const overlay = document.getElementById('tbs-overlay');
    overlay.style.display = 'none';
    overlay.innerHTML = '';
    document.body.style.overflow = '';
    const result = gradeResult;
    // Reset
    activeTbs = null; userAnswers = {}; openExhibit = null; graded = false; gradeResult = null;
    if(onCompleteCb) {
      const cb = onCompleteCb; onCompleteCb = null;
      cb(result);
    }
  }

  // ---------- PUBLIC ----------
  window.openTBS = function(tbsIdOrObj, onComplete){
    if(typeof tbsIdOrObj === 'string'){
      activeTbs = window.TBS_BY_ID[tbsIdOrObj];
    } else {
      activeTbs = tbsIdOrObj;
    }
    if(!activeTbs){
      console.error('TBS not found:', tbsIdOrObj);
      return;
    }
    userAnswers = {};
    openExhibit = activeTbs.exhibits[0] ? activeTbs.exhibits[0].name : null;
    graded = false;
    gradeResult = null;
    onCompleteCb = onComplete || null;
    render();
  };

  window.pickRandomTBS = function(){
    const lib = window.TBS_LIBRARY || [];
    if(!lib.length) return null;
    return lib[Math.floor(Math.random() * lib.length)];
  };
})();
