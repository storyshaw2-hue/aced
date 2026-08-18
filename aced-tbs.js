/* ACED TBS ENGINE
   Pure validation + grading for task-based simulation items.
   Browser: window.ACEDTBS
   Node:    require("./aced-tbs")

   Supported item types:
     select       response: option index
     numeric      response: number/string
     multi_select   response: array of option indexes (exact set)
     journal_entry  response: [{account,debit,credit}, ...] (line order does not matter)
     table_grid     response: {rowId:{columnKey:value}, ...}
     text_response  response: short string; exact match after normalization
*/
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ACEDTBS = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  var TYPES = ["select", "numeric", "multi_select", "journal_entry", "table_grid", "text_response"];

  function finiteNumber(v) {
    if (typeof v === "number") return Number.isFinite(v) ? v : null;
    if (v == null || String(v).trim() === "") return null;
    var n = Number(String(v).replace(/[,$%\s]/g, "").replace(/^\((.*)\)$/, "-$1"));
    return Number.isFinite(n) ? n : null;
  }

  function normalizedText(v) {
    return String(v == null ? "" : v)
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  function numberEqual(actual, expected, tolerance) {
    var a = finiteNumber(actual);
    var e = finiteNumber(expected);
    if (a == null || e == null) return false;
    return Math.abs(a - e) <= Math.abs(finiteNumber(tolerance) || 0);
  }

  function sortedUniqueIndexes(v) {
    if (!Array.isArray(v)) return [];
    return Array.from(new Set(v.map(Number).filter(Number.isInteger))).sort(function (a, b) {
      return a - b;
    });
  }

  function sameIndexSet(actual, expected) {
    var a = sortedUniqueIndexes(actual);
    var e = sortedUniqueIndexes(expected);
    return a.length === e.length && a.every(function (v, i) { return v === e[i]; });
  }

  function cleanJournalLines(lines) {
    return (Array.isArray(lines) ? lines : [])
      .map(function (r) {
        return {
          account: normalizedText(r && r.account),
          debit: finiteNumber(r && r.debit) || 0,
          credit: finiteNumber(r && r.credit) || 0
        };
      })
      .filter(function (r) { return r.account || r.debit || r.credit; });
  }

  function journalLineEqual(a, e, tolerance) {
    return a.account === normalizedText(e.account) &&
      numberEqual(a.debit, e.debit || 0, tolerance) &&
      numberEqual(a.credit, e.credit || 0, tolerance);
  }

  /* Match expected journal lines without depending on row order. Duplicate accounts
     are supported because each expected line consumes at most one response line. */
  function gradeJournal(item, response) {
    var actual = cleanJournalLines(response);
    var expected = cleanJournalLines(item.answer || item.lines);
    var used = new Array(actual.length).fill(false);
    var matched = 0;
    expected.forEach(function (e) {
      var idx = actual.findIndex(function (a, i) {
        return !used[i] && journalLineEqual(a, e, item.tolerance);
      });
      if (idx >= 0) { used[idx] = true; matched++; }
    });
    var balanced = actual.reduce(function (s, r) { return s + r.debit - r.credit; }, 0);
    var balanceOk = Math.abs(balanced) <= (finiteNumber(item.tolerance) || 0);
    var structureOk = balanceOk && actual.length === expected.length && actual.every(function (r) {
      return r.account && ((r.debit > 0) !== (r.credit > 0));
    });
    return {
      correct: matched === expected.length && actual.length === expected.length,
      // A correct debit paired with a spurious/unbalanced credit is not a usable entry.
      // Partial line credit is available only after the response balances and has no extras.
      earned: structureOk ? matched : 0,
      possible: expected.length,
      detail: { balanced: balanceOk, difference: balanced }
    };
  }

  function tableExpected(item, row, col) {
    if (row && row.answer && Object.prototype.hasOwnProperty.call(row.answer, col.key)) {
      return row.answer[col.key];
    }
    return undefined;
  }

  function gradeTable(item, response) {
    response = response && typeof response === "object" ? response : {};
    var earned = 0, possible = 0, cells = {};
    (item.rows || []).forEach(function (row, ri) {
      var rowId = String(row.id != null ? row.id : ri);
      cells[rowId] = {};
      (item.columns || []).forEach(function (col) {
        if (col.readonly) return;
        possible++;
        var expected = tableExpected(item, row, col);
        var actual = response[rowId] && response[rowId][col.key];
        var ok;
        if (col.type === "numeric") ok = numberEqual(actual, expected, col.tolerance != null ? col.tolerance : item.tolerance);
        else if (col.type === "select") ok = Number(actual) === Number(expected);
        else ok = normalizedText(actual) === normalizedText(expected);
        cells[rowId][col.key] = ok;
        if (ok) earned++;
      });
    });
    return { correct: possible > 0 && earned === possible, earned: earned, possible: possible, detail: { cells: cells } };
  }

  function gradeText(item, response) {
    var accepted = Array.isArray(item.answers) ? item.answers : [item.answer];
    var actual = normalizedText(response);
    var ok = actual !== "" && accepted.some(function (a) { return actual === normalizedText(a); });
    return { correct: ok, earned: ok ? 1 : 0, possible: 1 };
  }

  function gradeItem(item, response) {
    item = item || {};
    var type = item.type || "select";
    var ok;
    if (type === "numeric") {
      ok = numberEqual(response, item.answer, item.tolerance);
      return { correct: ok, earned: ok ? 1 : 0, possible: 1 };
    }
    if (type === "multi_select") {
      ok = sameIndexSet(response, item.answer);
      return { correct: ok, earned: ok ? 1 : 0, possible: 1 };
    }
    if (type === "journal_entry") return gradeJournal(item, response);
    if (type === "table_grid") return gradeTable(item, response);
    if (type === "text_response") return gradeText(item, response);
    ok = Number(response) === Number(item.answer);
    return { correct: ok, earned: ok ? 1 : 0, possible: 1 };
  }

  function gradeSimulation(sim, responses) {
    var items = (sim && sim.items) || [];
    responses = Array.isArray(responses) ? responses : [];
    var results = items.map(function (item, i) { return gradeItem(item, responses[i]); });
    var earned = results.reduce(function (s, r) { return s + r.earned; }, 0);
    var possible = results.reduce(function (s, r) { return s + r.possible; }, 0);
    return {
      results: results,
      earned: earned,
      possible: possible,
      pct: possible ? Math.round(100 * earned / possible) : 0,
      allCorrect: possible > 0 && earned === possible
    };
  }

  function validateItem(item, path) {
    var errors = [];
    path = path || "item";
    if (!item || typeof item !== "object") return [path + " must be an object"];
    var type = item.type || "select";
    if (TYPES.indexOf(type) < 0) errors.push(path + ".type unsupported: " + type);
    if (!String(item.prompt || "").trim()) errors.push(path + ".prompt is required");
    if (!String(item.explain || "").trim()) errors.push(path + ".explain is required");

    if (type === "select" || type === "multi_select") {
      if (!Array.isArray(item.choices) || item.choices.length < 2) errors.push(path + ".choices needs at least 2 options");
      if (type === "select" && !Number.isInteger(item.answer)) errors.push(path + ".answer must be an option index");
      if (type === "multi_select" && (!Array.isArray(item.answer) || !item.answer.length)) errors.push(path + ".answer must be a non-empty index array");
      sortedUniqueIndexes(type === "multi_select" ? item.answer : [item.answer]).forEach(function (i) {
        if (!item.choices || i < 0 || i >= item.choices.length) errors.push(path + ".answer index out of range: " + i);
      });
    } else if (type === "numeric") {
      if (finiteNumber(item.answer) == null) errors.push(path + ".answer must be numeric");
    } else if (type === "journal_entry") {
      if (!Array.isArray(item.accounts) || item.accounts.length < 2) errors.push(path + ".accounts needs at least 2 accounts");
      var accountIds = (item.accounts || []).map(function (a) {
        return normalizedText(a && typeof a === "object" ? (a.id || a.label) : a);
      });
      if (new Set(accountIds).size !== accountIds.length) errors.push(path + ".accounts must be unique");
      var lines = item.answer || item.lines;
      if (!Array.isArray(lines) || !lines.length) errors.push(path + ".answer needs journal lines");
      else {
        var clean = cleanJournalLines(lines);
        var rowCount = Number(item.rowCount) || (clean.length + 1);
        if (rowCount < 2 || rowCount > 8 || clean.length > rowCount) errors.push(path + ".rowCount must be 2–8 and fit the answer lines");
        clean.forEach(function (line, li) {
          if (accountIds.indexOf(line.account) < 0) errors.push(path + ".answer[" + li + "] uses an unknown account");
          if ((line.debit > 0) === (line.credit > 0)) errors.push(path + ".answer[" + li + "] needs exactly one positive debit or credit");
          if (line.debit < 0 || line.credit < 0) errors.push(path + ".answer[" + li + "] amounts cannot be negative");
        });
        var d = clean.reduce(function (s, r) { return s + r.debit; }, 0);
        var c = clean.reduce(function (s, r) { return s + r.credit; }, 0);
        if (Math.abs(d - c) > (finiteNumber(item.tolerance) || 0)) errors.push(path + ".answer journal entry is not balanced");
      }
    } else if (type === "table_grid") {
      if (!Array.isArray(item.columns) || !item.columns.some(function (c) { return c && !c.readonly; })) errors.push(path + ".columns needs a graded column");
      if (!Array.isArray(item.rows) || !item.rows.length) errors.push(path + ".rows is required");
      (item.columns || []).forEach(function (col, ci) {
        if (!col || !col.key || !col.label) errors.push(path + ".columns[" + ci + "] needs key + label");
        if (col && col.type === "select" && (!Array.isArray(col.choices) || col.choices.length < 2)) errors.push(path + ".columns[" + ci + "].choices needs at least 2 options");
      });
      (item.rows || []).forEach(function (row, ri) {
        (item.columns || []).forEach(function (col) {
          if (!col || col.readonly) return;
          if (!row.answer || !Object.prototype.hasOwnProperty.call(row.answer, col.key)) errors.push(path + ".rows[" + ri + "].answer." + col.key + " is required");
        });
      });
    } else if (type === "text_response") {
      var accepted = Array.isArray(item.answers) ? item.answers : [item.answer];
      if (!accepted.some(function (a) { return normalizedText(a); })) errors.push(path + " needs answer or answers");
      if (!item.authority || !String(item.authority.title || "").trim() || !/^https:\/\//i.test(String(item.authority.url || ""))) {
        errors.push(path + ".authority needs title + https URL");
      }
    }
    return errors;
  }

  function validateSimulation(sim, path) {
    path = path || "simulation";
    var errors = [];
    if (!sim || typeof sim !== "object") return [path + " must be an object"];
    if (!String(sim.title || "").trim()) errors.push(path + ".title is required");
    if (!String(sim.source || "").trim()) errors.push(path + ".source is required");
    if (!String(sim.scenario || "").trim()) errors.push(path + ".scenario is required");
    if (sim.exhibits != null && !Array.isArray(sim.exhibits)) errors.push(path + ".exhibits must be an array");
    (sim.exhibits || []).forEach(function (x, i) {
      if (!x || !String(x.label || "").trim() || !String(x.content || "").trim()) {
        errors.push(path + ".exhibits[" + i + "] needs label + content");
      }
    });
    if (sim.references != null && (!Array.isArray(sim.references) || sim.references.some(function (u) { return !/^https:\/\//i.test(String(u)); }))) {
      errors.push(path + ".references must contain only https URLs");
    }
    if (!Array.isArray(sim.items) || !sim.items.length) errors.push(path + ".items is required");
    (sim.items || []).forEach(function (item, i) {
      errors = errors.concat(validateItem(item, path + ".items[" + i + "]"));
    });
    return errors;
  }

  return {
    TYPES: TYPES.slice(),
    finiteNumber: finiteNumber,
    normalizedText: normalizedText,
    gradeItem: gradeItem,
    gradeSimulation: gradeSimulation,
    validateItem: validateItem,
    validateSimulation: validateSimulation
  };
});
