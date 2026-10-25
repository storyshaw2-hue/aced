(function () {
  "use strict";
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function download(pack) {
    var blob = new Blob([ACEDLibrary.exportText(pack)], { type: "application/json" });
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url;
    a.download = pack.name.replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").slice(0, 80) + ".aced.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function storageNotice() {
    var el = document.getElementById("storage-notice");
    if (!el || !window.ACEDLibrary) return;
    var available = ACEDLibrary.isPersistent();
    el.hidden = available;
    el.textContent = available ? "" : "Browser storage is unavailable. Packs and progress last only in this tab; export your pack before leaving. Open ACED in its own tab to enable browser saving.";
  }
  var lastFocus;
  function dialog(title, html) {
    var el = document.getElementById("app-dialog");
    if (!el) {
      el = document.createElement("dialog"); el.id = "app-dialog"; el.className = "app-dialog";
      document.body.appendChild(el);
    }
    lastFocus = document.activeElement;
    el.innerHTML = '<div class="dialog-head"><h2 id="dialog-title">' + esc(title) + '</h2><button class="icon-button" data-close aria-label="Close dialog">×</button></div>' + html;
    el.setAttribute("aria-labelledby", "dialog-title");
    el.querySelector("[data-close]").onclick = function () { el.close(); };
    el.onclick = function (event) { if (event.target === el) el.close(); };
    el.onclose = function () { if (lastFocus && lastFocus.isConnected) lastFocus.focus(); };
    el.showModal(); return el;
  }
  function share(pack) {
    var url, error;
    try { url = ACEDLibrary.shareUrl(pack); } catch (e) { error = e.message; }
    var el = dialog("Share " + pack.name, error
      ? '<p>' + esc(error) + '</p><button class="button primary" id="share-export">Export pack file</button>'
      : '<p>This link contains your questions and answers. Anyone you send it to can import a copy. Your progress is not included.</p><label class="field-label" for="share-url">Pack link</label><input id="share-url" readonly><div class="button-row"><button class="button primary" id="share-copy">Copy link</button><button class="button" id="share-export">Export file instead</button></div><p id="copy-result" class="hint" aria-live="polite"></p>');
    var exportButton = el.querySelector("#share-export");
    if (exportButton) exportButton.onclick = function () { download(pack); };
    if (url) {
      el.querySelector("#share-url").value = url;
      el.querySelector("#share-copy").onclick = async function () {
        try {
          await navigator.clipboard.writeText(url);
          el.querySelector("#copy-result").textContent = "Link copied.";
        } catch (e) {
          el.querySelector("#share-url").select();
          el.querySelector("#copy-result").textContent = "Copy the selected link with your keyboard.";
        }
      };
    }
  }
  function init() {
    storageNotice();
    document.querySelectorAll("[data-daily]").forEach(function (link) {
      link.href = "study.html?pack=" + encodeURIComponent(ACEDLibrary.lastPack()) + "&daily=1";
    });
    var homeForm = document.getElementById("quick-pack-form");
    if (homeForm) {
      homeForm.onsubmit = function (event) {
        event.preventDefault();
        var value = document.getElementById("quick-notes").value;
        if (!value.trim()) { document.getElementById("quick-notes").focus(); return; }
        var saved = ACEDLibrary.stashDraft({ text: value, name: "", subject: "" });
        location.href = "importer.html?boot=1" + (saved ? "" : "#notes=" + ACEDLibrary.encode(value));
      };
    }
    var recent = document.getElementById("home-recent");
    if (recent) {
      var id = ACEDLibrary.lastPack(), pack = ACEDLibrary.get(id) || ACEDLibrary.starter(id);
      if (pack && ACEDLibrary.activity()[id]) {
        recent.hidden = false;
        recent.innerHTML = 'YOUR LAST PACK <a href="study.html?pack=' + encodeURIComponent(id) + '">' + esc(pack.name) + ' →</a>';
      }
    }
  }
  window.ACEDUI = { esc: esc, download: download, dialog: dialog, share: share, storageNotice: storageNotice };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
