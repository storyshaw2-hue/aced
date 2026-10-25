(function () {
  "use strict";
  var route = document.body.dataset.route, query = new URLSearchParams(location.search), target;
  if (route === "daily") {
    target = "study.html?pack=" + encodeURIComponent(window.ACEDLibrary ? ACEDLibrary.lastPack() : "world-capitals") + "&daily=1";
  } else if (route === "game") {
    var next = new URLSearchParams();
    ["pack", "seed", "difficulty", "daily"].forEach(function (key) { if (query.has(key)) next.set(key, query.get(key)); });
    target = "study.html" + (next.toString() ? "?" + next : "");
  } else if (route === "create") {
    var create = new URLSearchParams();
    ["edit", "boot"].forEach(function (key) { if (query.has(key)) create.set(key, query.get(key)); });
    target = "importer.html" + (create.toString() ? "?" + create : "") + location.hash;
  } else target = "library.html";
  location.replace(target);
})();
