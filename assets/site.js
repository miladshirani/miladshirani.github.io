/* =====================================================================
   SITE ENGINE — builds every page from window.SITE (assets/data.js).
   Edit data.js for content; this file only handles rendering + motion.

   Modules:
     1. Theme (light/dark, persisted)
     2. Nav + footer injection
     3. Page renderers (home / projects / research / publications / honors)
     4. Hero physics — interactive Verlet mass–spring lattice
     5. Scroll reveal + count-up stats
   ===================================================================== */
(function () {
  "use strict";

  var S = window.SITE;
  if (!S) { console.error("assets/data.js did not load before site.js"); return; }

  var page = document.body.getAttribute("data-page") || "home";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(id) { return document.getElementById(id); }
  function mount(id, html) { var n = el(id); if (n) n.innerHTML = html; }

  /* =========================== 1 · THEME =========================== */
  function currentTheme() {
    try { var t = localStorage.getItem("theme"); if (t) return t; } catch (e) {}
    return "light";   // light by default; the toggle remembers a visitor's choice
  }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch (e) {}
    document.dispatchEvent(new CustomEvent("themechange"));
  }
  applyTheme(currentTheme());

  /* ====================== 2 · NAV + FOOTER ========================= */
  var navLinks = S.nav.map(function (l) {
    var active = l.key === page ? ' class="active"' : "";
    return "<li><a href=\"" + l.href + "\"" + active + ">" + l.label + "</a></li>";
  }).join("");

  mount("site-nav",
    '<div class="nav-inner">' +
      '<a class="nav-logo" href="index.html"><span class="dot"></span>' + S.profile.shortName + "</a>" +
      '<ul class="nav-links" id="navLinks">' + navLinks + "</ul>" +
      '<div class="nav-tools">' +
        '<button class="theme-toggle" id="themeToggle" type="button" aria-label="Toggle dark mode">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.4"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19"/></svg>' +
        "</button>" +
        '<button class="nav-burger" id="navBurger" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      "</div>" +
    "</div>");

  var toggleBtn = el("themeToggle");
  if (toggleBtn) toggleBtn.addEventListener("click", function () {
    applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
  var burger = el("navBurger"), navUl = el("navLinks");
  if (burger && navUl) burger.addEventListener("click", function () {
    var open = navUl.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  var L = S.profile.links || {};
  var footLinks = [
    ["Email", "mailto:" + S.profile.email],
    ["GitHub", L.github],
    ["Google Scholar", L.scholar],
    ["LinkedIn", L.linkedin],
    ["ORCID", L.orcid],
    ["CV (PDF)", L.cv]
  ].filter(function (x) { return x[1]; }).map(function (x) {
    var ext = x[1].indexOf("http") === 0 ? ' target="_blank" rel="noopener"' : "";
    return '<a href="' + x[1] + '"' + ext + ">" + x[0] + "</a>";
  }).join("");

  mount("site-footer",
    '<div class="wrap foot-cta" data-reveal>' +
      "<h2>Building models <em>provable</em> enough to ship.</h2>" +
      '<a class="btn btn-primary" href="mailto:' + S.profile.email + '">Get in touch <span class="arr">→</span></a>' +
    "</div>" +
    '<div class="wrap foot-grid"><div class="foot-links">' + footLinks + "</div>" +
      '<div class="foot-links"><a href="research.html">Research</a><a href="projects.html">Projects</a><a href="publications.html">Publications</a><a href="honors.html">Honors</a><a href="beyond-research.html">Beyond Research</a></div>' +
    "</div>" +
    '<div class="wrap foot-base"><span>© ' + new Date().getFullYear() + " " + S.profile.name + "</span>" +
      "<span>Continuum Mechanics × Physics AI · New Haven, CT</span></div>");

  /* ===================== 3 · PAGE RENDERERS ======================== */
  function statCells(stats) {
    return stats.map(function (s, i) {
      var tag = s.href ? "a" : "div";
      return "<" + tag + ' class="stat' + (s.href ? " is-link" : "") + '"' + (s.href ? ' href="' + s.href + '"' : "") +
        ' data-reveal style="--d:' + (i * 0.07) + 's"><b data-count="' + s.num + '">' + s.num + "</b><span>" + s.label + "</span>" +
        (s.sub ? '<em class="stat-sub">' + s.sub + "</em>" : "") + "</" + tag + ">";
    }).join("");
  }

  // Math typesetting, serialized behind MathJax's own start-up pass. Calling
  // typesetPromise while the start-up typeset is still running makes the two
  // passes fight over the same text nodes (equations then stay as raw \( \) text).
  function typeset(nodes) {
    var MJ = window.MathJax;
    if (!MJ || !MJ.typesetPromise || !MJ.startup || !MJ.startup.promise) return;   // not loaded yet: its start-up pass will do it
    MJ.startup.promise = MJ.startup.promise
      .then(function () { return MJ.typesetPromise(nodes); })
      .catch(function (e) { if (window.console) console.warn("MathJax:", e && e.message); });
  }

  function romanize(n) {
    var map = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]], out = "";
    map.forEach(function (m) { while (n >= m[0]) { out += m[1]; n -= m[0]; } });
    return out;
  }
  // Items sorted by the order of SITE.categories (stable within a category).
  function byCategory(items) {
    var order = (S.categories || []).map(function (c) { return c.id; });
    return items.map(function (x, i) { return { x: x, i: i }; }).sort(function (a, b) {
      var d = order.indexOf(a.x.cat) - order.indexOf(b.x.cat);
      return d || a.i - b.i;
    }).map(function (o) { return o.x; });
  }

  /* ---------- PROJECTS (shared by home + projects page) ---------- */
  function catLabel(id) {
    var c = (S.categories || []).filter(function (x) { return x.id === id; })[0];
    return c ? c.label : id;
  }
  // The four levels used across the site: what problem, what method, what
  // physics / mathematics makes it work, what quantitative result.
  var STRUCT_LABELS = [
    ["problem", "Problem"], ["method", "Method"], ["physics", "Physics &amp; math"], ["result", "Result"]
  ];
  function projectCard(p, i) {
    var tags = (p.cats || []).map(function (c, k) {
      return '<span class="p-tag' + (k === 0 ? " main" : "") + '">' + catLabel(c) + "</span>";
    }).join("");
    var status = p.status
      ? '<span class="p-status s-' + (p.status.kind || "done") + '">' + p.status.label + "</span>" : "";
    var foot = '<span class="t-more">' + (p.year ? p.year + " · " : "") + "Read →</span>";
    var attrs = 'href="' + p.href + '" data-cats="' + (p.cats || []).join(" ") +
      '" data-reveal style="--d:' + ((i % 3) * 0.07) + 's"';
    if (p.struct) {
      var lab = p.labels || {};
      var rows = STRUCT_LABELS.filter(function (r) { return p.struct[r[0]]; }).map(function (r) {
        return "<div><dt>" + (lab[r[0]] || r[1]) + "</dt><dd>" + p.struct[r[0]] + "</dd></div>";
      }).join("");
      // structured cards show only the main field next to the status, so the heading row stays aligned
      var mainTag = '<span class="p-tag main">' + catLabel((p.cats || [])[0]) + "</span>";
      return '<a class="theme-card theme-link proj-card proj-struct" ' + attrs + ">" +
        '<div class="p-tags">' + mainTag + status + "</div><h3>" + p.title + "</h3>" +
        '<p class="why">' + p.why + '</p><dl class="pstruct">' + rows + "</dl>" + foot + "</a>";
    }
    return '<a class="theme-card theme-link proj-card" ' + attrs + ">" +
      '<div class="p-tags">' + tags + status + "</div><h3>" + p.title + "</h3><p>" + p.summary + "</p>" + foot + "</a>";
  }
  // The one pipeline: theory → simulation → differentiable computation → Physics AI → deployment.
  // mode "research": links open a tab on this page; "home": links go to anchors / pages.
  function pipelineHtml(mode) {
    return (S.pipeline || []).map(function (a, i) {
      var links = a.links.map(function (l) {
        if (mode === "research" && l.tab) return '<a href="#' + l.tab + '" data-open-tab="' + l.tab + '">' + l.text + "</a>";
        return '<a href="' + (l.href || "research.html#" + l.tab) + '">' + l.text + "</a>";
      }).join("");
      return '<div class="arch-stage" data-reveal style="--d:' + (i * 0.06) + 's"><span class="arch-n">' + a.n + "</span>" +
        "<h3>" + a.title + '</h3><ul class="arch-items">' +
        a.items.map(function (x) { return "<li>" + x + "</li>"; }).join("") +
        '</ul><div class="arch-links">' + links + "</div></div>";
    }).join("");
  }
  function statusBlock(st, label) {
    if (!st) return "";
    var cols = [["completed", "Completed", "done"], ["ongoing", "Ongoing", "ongoing"], ["next", "Next", "next"]]
      .filter(function (c) { return st[c[0]] && st[c[0]].length; });
    return '<div class="status-wrap"><p class="kp-label">' + (label || "Status") + '</p><div class="status-block">' +
      cols.map(function (c) {
        return '<div class="status-col s-' + c[2] + '"><h4>' + c[1] + "</h4><ul>" +
          st[c[0]].map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>";
      }).join("") + "</div></div>";
  }

  /* ---------- HOME ---------- */
  if (page === "home") {
    mount("home-hero",
      '<canvas class="hero-canvas" id="simCanvas" aria-hidden="true"></canvas>' +
      '<div class="hero-fade" aria-hidden="true"></div>' +
      '<div class="hero-inner wrap"><div class="hero-grid">' +
        '<p class="kicker" data-reveal>' + S.profile.role + "</p>" +
        '<h1 class="hero-name" data-reveal style="--d:.08s">Milad<br />Shirani<em>.</em></h1>' +
        '<p class="hero-sub is-headline" data-reveal style="--d:.16s">' + S.hero.headline + "</p>" +
        '<p class="hero-tagline" data-reveal style="--d:.2s">' + S.hero.tagline + "</p>" +
        '<p class="hero-desc" data-reveal style="--d:.24s">' + S.hero.desc + "</p>" +
        '<div class="hero-chain" data-reveal style="--d:.3s" aria-label="From continuum mechanics to Physics AI">' +
          S.hero.chain.map(function (n) { return '<span class="node">' + n + "</span>"; }).join('<span class="arr" aria-hidden="true">→</span>') +
        "</div>" +
        '<div class="hero-cta" data-reveal style="--d:.36s">' +
          S.hero.cta.map(function (c) {
            var cls = c.style === "primary" ? "btn btn-primary" : "btn btn-ghost";
            return '<a class="' + cls + '" href="' + c.href + '">' + c.label + ' <span class="arr">→</span></a>';
          }).join("") +
        "</div>" +
        '<div class="hero-meta" data-reveal style="--d:.44s">' +
          '<a href="mailto:' + S.profile.email + '">' + S.profile.email + "</a>" +
          (L.github ? '<span class="sep">/</span><a href="' + L.github + '" target="_blank" rel="noopener">GitHub</a>' : "") +
          (L.scholar ? '<span class="sep">/</span><a href="' + L.scholar + '" target="_blank" rel="noopener">Scholar</a>' : "") +
          (L.linkedin ? '<span class="sep">/</span><a href="' + L.linkedin + '" target="_blank" rel="noopener">LinkedIn</a>' : "") +
        "</div>" +
      "</div></div>" +
      '<div class="sim-chip">' +
        '<div class="sim-tabs" role="group" aria-label="Hero simulation">' +
          '<button type="button" data-mode="static" aria-pressed="true">Static</button>' +
          '<button type="button" data-mode="film" aria-pressed="false">Film</button>' +
          '<button type="button" data-mode="mesh" aria-pressed="false">Mesh</button>' +
          '<button type="button" data-mode="gr" aria-pressed="false">Spacetime</button>' +
          '<button type="button" data-mode="field" aria-pressed="false">Electric</button>' +
          '<button type="button" data-mode="magnet" aria-pressed="false">Magnet</button>' +
          '<button type="button" data-mode="lattice" aria-pressed="false">Plate</button>' +
          '<button type="button" data-mode="fluid" aria-pressed="false">Fluid</button>' +
          '<button type="button" data-mode="pend" aria-pressed="false">Balance</button>' +
        "</div>" +
        '<div class="sim-cap"><span class="pulse"></span><span id="simCap"></span></div>' +
      "</div>" +
      '<div class="scroll-hint" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 4v15m0 0-5.5-5.5M12 19l5.5-5.5"/></svg></div>');

    /* credibility strip: same numbers as SITE.stats, so they never drift */
    mount("home-cred",
      '<div class="wrap cred-inner">' +
        '<div class="cred-lead" data-reveal><p class="kicker">' + S.credibility.label + "</p><p>" + S.credibility.text + "</p></div>" +
        '<div class="stat-grid">' + statCells(S.stats) + "</div>" +
      "</div>");

    /* What I Build: cards 01–03, then the wide foundation card */
    function buildCard(b, i) {
      return '<a class="build-card' + (b.base ? " is-base" : "") + (b.flagship ? " is-flagship" : "") + '" href="' + b.href + '" data-reveal style="--d:' + (i * 0.07) + 's">' +
        '<div class="b-head"><span class="b-num">' + b.num + '</span><span class="b-label">' + b.label + "</span>" +
        (b.flagship ? '<span class="b-flag">Flagship</span>' : "") + "</div>" +
        "<h3>" + b.title + "</h3><p>" + b.desc + "</p>" +
        '<div class="k-chips">' + b.chips.map(function (c) { return '<span class="k-chip">' + c + "</span>"; }).join("") + "</div>" +
        '<span class="t-more">' + b.more + "</span></a>";
    }
    mount("home-build",
      '<div class="build-grid">' + S.build.map(buildCard).join("") + "</div>" +
      '<div class="caps" data-reveal><p class="caps-label">' + S.capabilitiesLabel + "</p><div><ul>" +
        S.capabilities.map(function (c) { return "<li>" + c + "</li>"; }).join("") + "</ul>" +
        '<p class="caps-rel">' + S.relevance + "</p></div></div>");

    mount("home-pipeline", '<div class="arch">' + pipelineHtml("home") + "</div>");

    /* the two graduate textbooks, straight from the publications list */
    mount("home-books",
      (S.publications.books || []).map(function (b, i) {
        return '<a class="book" href="publications.html#books" data-reveal style="--d:' + (i * 0.08) + 's">' +
          (b.cover ? '<img class="book-cover" src="' + b.cover + '" alt="Cover of ' + b.title + '" width="72" height="108" loading="lazy" decoding="async" />' : "") +
          '<span class="book-text"><span class="book-pub">' + b.venue + " · " + b.details + "</span>" +
          '<span class="book-title">' + b.title + "</span>" +
          '<span class="book-auth">' + b.authors + "</span></span></a>";
      }).join(""));

    var visibleAff = S.affiliations.filter(function (a) { return !a.hidden; });
    mount("home-profile",
      '<div class="profile-grid">' +
        '<div data-reveal><div class="photo-frame"><span class="corner tl"></span><span class="corner br"></span>' +
          '<img src="' + S.profile.photo + '" alt="Portrait of ' + S.profile.name + '" onerror="this.onerror=null;this.src=\'' + S.profile.photoFallback + '\'" />' +
        '</div><p class="photo-cap">' + S.profile.roleLine + "</p></div>" +
        '<div><p class="profile-bio" data-reveal>' + S.profile.bio + "</p><div class=\"aff-list\">" +
          visibleAff.map(function (a, i) {
            return '<div class="aff-item" data-reveal style="--d:' + (i * 0.08) + 's"><span class="aff-title">' + a.title + " · <span>" + a.org + "</span></span>" +
                   '<span class="aff-sub">' + a.sub + "</span></div>";
          }).join("") +
        "</div>" +
        '<div class="product" data-reveal><p class="kp-label">' + S.product.label + "</p><p class=\"product-lead\">" + S.product.lead + "</p><ul>" +
          S.product.items.map(function (x) { return "<li>" + x + "</li>"; }).join("") +
        '</ul><a class="t-link" href="' + S.product.href + '">' + S.product.more + "</a></div>" +
        "</div>" +
      "</div>");

    var themeN = 0;
    mount("home-themes",
      (S.categories || []).map(function (c) {
        var items = S.researchThemes.filter(function (t) { return t.cat === c.id; });
        if (!items.length) return "";
        return '<div class="theme-group" data-reveal>' +
          '<div class="group-head"><h3 class="group-title">' + c.label + '</h3><span class="group-count">' + items.length + "</span>" +
          '<a class="group-link" href="projects.html#' + c.id + '">Projects →</a></div>' +
          '<div class="themes-grid">' + items.map(function (t, i) {
            themeN += 1;
            var num = (themeN < 10 ? "0" : "") + themeN;
            return '<article class="theme-card"><span class="t-num">' + num + '</span><span class="t-icon">' + t.icon + "</span>" +
              "<h3>" + t.title + "</h3><p>" + t.desc + "</p></article>";
          }).join("") + "</div></div>";
      }).join(""));

    // the four projects shown as full blocks above are not repeated here
    mount("home-projects",
      (S.projects || []).filter(function (p) { return p.featured && !p.inFeatures; }).map(projectCard).join(""));

    mount("home-timeline",
      S.journey.filter(function (j) { return !j.hidden; }).map(function (j, i) {
        return '<div class="tl-item" data-reveal style="--d:' + (i * 0.06) + 's"><p class="tl-years">' + j.years + "</p>" +
               '<p class="tl-title">' + j.title + '</p><p class="tl-sub">' + j.sub + "</p></div>";
      }).join(""));
  }

  /* ---------- PROJECTS PAGE ---------- */
  if (page === "projects") {
    var projs = S.projects || [];
    var used = (S.categories || []).filter(function (c) {
      return projs.some(function (p) { return (p.cats || []).indexOf(c.id) > -1; });
    });
    mount("projects-filter",
      '<button type="button" class="chip active" data-cat="all">All <b>' + projs.length + "</b></button>" +
      used.map(function (c) {
        var n = projs.filter(function (p) { return (p.cats || []).indexOf(c.id) > -1; }).length;
        return '<button type="button" class="chip" data-cat="' + c.id + '">' + c.label + " <b>" + n + "</b></button>";
      }).join(""));
    mount("projects-grid", projs.map(projectCard).join(""));

    var chips = document.querySelectorAll("#projects-filter .chip");
    function applyFilter(cat) {
      var known = cat === "all" || used.some(function (c) { return c.id === cat; });
      if (!known) cat = "all";
      chips.forEach(function (c) { c.classList.toggle("active", c.getAttribute("data-cat") === cat); });
      document.querySelectorAll("#projects-grid .proj-card").forEach(function (card) {
        var cats = (card.getAttribute("data-cats") || "").split(" ");
        card.hidden = !(cat === "all" || cats.indexOf(cat) > -1);
      });
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        var cat = c.getAttribute("data-cat");
        applyFilter(cat);
        try { history.replaceState(null, "", cat === "all" ? "projects.html" : "#" + cat); } catch (e) {}
      });
    });
    applyFilter((location.hash || "").replace("#", "") || "all");
    window.addEventListener("hashchange", function () { applyFilter((location.hash || "").replace("#", "") || "all"); });
  }

  /* ---------- RESEARCH ---------- */
  if (page === "research") {
    mount("research-intro", S.researchIntro);
    mount("research-arch", pipelineHtml("research"));

    var tabs = byCategory(S.researchTabs);
    var lastCat = null;
    mount("research-tabnav",
      tabs.map(function (t, i) {
        var head = "";
        if (t.cat !== lastCat) {
          lastCat = t.cat;
          head = '<p class="tab-group">' + catLabel(t.cat) + "</p>";
        }
        return head + '<button class="tab-btn' + (i === 0 ? " active" : "") + '" role="tab" id="btn-' + t.id +
          '" aria-controls="panel-' + t.id + '" aria-selected="' + (i === 0) + '">' +
          '<span class="roman">' + romanize(i + 1) + "</span><span>" + t.label + "</span></button>";
      }).join(""));

    mount("research-panels",
      tabs.map(function (t, i) {
        var body = t.body.map(function (p) { return "<p>" + p + "</p>"; }).join("");
        var lv = t.levels;
        var glance = lv ? '<div class="glance"><p class="kp-label">At a glance</p><dl class="pstruct">' +
          STRUCT_LABELS.filter(function (r) { return lv[r[0]]; }).map(function (r) {
            return "<div><dt>" + r[1] + "</dt><dd>" + lv[r[0]] + "</dd></div>";
          }).join("") + "</dl></div>" : "";
        var kp = t.keyPoints && t.keyPoints.length
          ? '<div class="kp-block"><p class="kp-label">' + (t.keyLabel || "Key Contributions") + '</p><ul class="kp-list">' +
            t.keyPoints.map(function (k) { return "<li>" + k + "</li>"; }).join("") + "</ul></div>"
          : "";
        var full = lv
          ? '<details class="deep"><summary>Full technical account</summary><div class="deep-body">' + body + "</div></details>"
          : body;
        var status = statusBlock(t.status, t.statusLabel);
        var table = "";
        if (t.table) {
          table = '<div class="tab-table"><table><caption>' + t.table.label + "</caption><thead><tr>" +
            t.table.head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" +
            t.table.rows.map(function (r) {
              return "<tr" + (r.highlight ? ' class="hl"' : "") + ">" +
                r.cells.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
            }).join("") + "</tbody></table></div>";
        }
        var links = t.links && t.links.length
          ? '<div class="tab-links">' + t.links.map(function (lk) {
              if (lk.comingSoon) return "<span>" + lk.text + "</span>";
              var ext = lk.external ? ' target="_blank" rel="noopener"' : "";
              return '<a href="' + lk.href + '"' + ext + ">" + lk.text + " ↗</a>";
            }).join("") + "</div>"
          : "";
        return '<div class="tab-panel' + (i === 0 ? " active" : "") + '" role="tabpanel" id="panel-' + t.id + '" aria-labelledby="btn-' + t.id + '">' +
          "<h2>" + t.title + '</h2><div class="panel-rule"></div>' + glance + kp + status + full + table + links + "</div>";
      }).join(""));

    var btns = document.querySelectorAll(".tab-btn");
    function openTab(b, scroll) {
      btns.forEach(function (x) { x.classList.remove("active"); x.setAttribute("aria-selected", "false"); });
      document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
      b.classList.add("active");
      b.setAttribute("aria-selected", "true");
      var panel = el(b.getAttribute("aria-controls"));
      if (panel) {
        panel.classList.add("active");
        typeset([panel]);
      }
      if (scroll) {
        var wrapEl = el("research-tabnav");
        if (wrapEl) wrapEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    }
    btns.forEach(function (b) { b.addEventListener("click", function () { openTab(b, false); }); });
    // keyboard: arrows / Home / End move between the themes (WAI-ARIA tabs pattern)
    var tabNav = el("research-tabnav");
    if (tabNav) tabNav.addEventListener("keydown", function (e) {
      var keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
      if (keys.indexOf(e.key) < 0) return;
      var list = Array.prototype.slice.call(btns), i = list.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var n = e.key === "Home" ? 0 : e.key === "End" ? list.length - 1 :
              (e.key === "ArrowDown" || e.key === "ArrowRight") ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
      list[n].focus(); openTab(list[n], false);
    });
    // links from the architecture overview (and #tN in the URL) open a tab
    document.querySelectorAll("[data-open-tab]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        var b = el("btn-" + a.getAttribute("data-open-tab"));
        if (b) { e.preventDefault(); openTab(b, true); }
      });
    });
    var hashTab = (location.hash || "").replace("#", "");
    if (hashTab && el("btn-" + hashTab)) openTab(el("btn-" + hashTab), false);
    typeset();
  }

  /* ---------- PUBLICATIONS ---------- */
  if (page === "publications") {
    var P = S.publications;
    var counts = { book: P.books.length, journal: P.journals.length, chapter: P.chapters.length,
                   conference: P.conference.length, review: P.review.length };

    var T = S.publicationTotals || {};
    var tot = { book: counts.book, journal: T.journal || counts.journal, conference: T.conference || counts.conference,
                chapter: T.chapter || counts.chapter };
    mount("pub-summary",
      tot.book + " books · " + tot.journal + " peer-reviewed journal papers (8 MSc · 22 PhD · 3 postdoc) · " +
      tot.conference + " conference paper · " + tot.chapter + " book chapters");

    mount("pub-stats",
      statCells([
        { num: String(tot.book), label: "Books" },
        { num: String(tot.journal), label: "Journal Papers", sub: "8 MSc · 22 PhD · 3 postdoc" },
        { num: String(tot.chapter), label: "Book Chapters" },
        { num: String(tot.conference), label: "Conference Paper" }
      ]));
    var parts = [];
    if (tot.journal > counts.journal) parts.push(counts.journal + " of " + tot.journal + " journal papers");
    mount("pub-note", parts.length ? "Totals follow the CV. The list below is still being completed: " + parts.join(" and ") + " are listed so far." : "");

    function pubGroup(key, icon, title, unit, list) {
      if (!list.length) return "";
      var items = list.map(function (p, i) {
        var num = list.length - i;
        var tag = p.tag ? '<span class="tag ' + (p.tagClass || "") + '">' + p.tag + "</span>" : "";
        var titleHtml = p.href
          ? '<a href="' + p.href + '" target="_blank" rel="noopener">' + p.title + "</a>"
          : p.title;
        var venue = [p.venue, p.details].filter(Boolean).join(" · ");
        if (p.href) venue += (venue ? " · " : "") + '<a href="' + p.href + '" target="_blank" rel="noopener">' + (p.linkLabel || "link") + ' ↗</a>';
        var cover = p.cover
          ? '<a class="pub-cover" href="' + p.href + '" target="_blank" rel="noopener"><img src="' + p.cover + '" alt="Cover of ' + p.title + '" width="84" height="126" loading="lazy" decoding="async" /></a>' : "";
        return '<div class="pub-item' + (p.cover ? " has-cover" : "") + '"><span class="pub-num">' + (num < 10 ? "0" : "") + num + "</span>" +
          '<div class="pub-body"><p class="p-title">' + titleHtml + tag + "</p>" +
          '<p class="p-meta">' + p.authors + '</p><p class="p-venue">' + venue + "</p></div>" + cover + "</div>";
      }).join("");
      var anchor = { book: "books", journal: "journals", chapter: "chapters", conference: "conference", review: "review" }[key] || key;
      return '<section class="pub-group" id="' + anchor + '" data-group="' + key + '">' +
        '<div class="pub-group-head"><span class="g-icon">' + icon + "</span><h2>" + title + "</h2>" +
        '<span class="g-count">' + list.length + " " + unit + "</span></div>" + items + "</section>";
    }

    mount("pub-sections",
      pubGroup("book", "§", "Graduate Textbooks", counts.book === 1 ? "volume" : "volumes", P.books) +
      pubGroup("journal", "∂", "Refereed Journal Publications", "papers", P.journals) +
      pubGroup("chapter", "◈", "Refereed Book Chapters", "chapters", P.chapters) +
      pubGroup("conference", "◇", "Conference Paper", counts.conference === 1 ? "paper" : "papers", P.conference));

    document.querySelectorAll(".filter-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll(".filter-btn").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        var f = b.getAttribute("data-filter");
        document.querySelectorAll(".pub-group").forEach(function (g) {
          g.style.display = (f === "all" || g.getAttribute("data-group") === f) ? "" : "none";
        });
      });
    });
  }

  /* ---------- HONORS ---------- */
  if (page === "honors") {
    var years = S.honors.map(function (h) { return parseInt(h.year, 10); });
    mount("honors-summary",
      S.honors.length + " awards · fellowships, travel grants & scholarships · " +
      Math.min.apply(null, years) + " – " + Math.max.apply(null, years));
    mount("honors-cards",
      S.honors.map(function (h, i) {
        return '<article class="honor-card" data-reveal style="--d:' + ((i % 3) * 0.07) + 's">' +
          '<div class="honor-year">' + h.year + '</div><p class="honor-name">' + h.name + "</p>" +
          '<p class="honor-inst">' + h.inst + '</p><p class="honor-loc">' + h.loc + "</p>" +
          (h.tag ? '<span class="tag ' + (h.tagClass || "") + '">' + h.tag + "</span>" : "") +
          "</article>";
      }).join(""));
  }

  /* ============ 4 · HERO PHYSICS — the cursor is the source ========= */
  /* No clicking, no dragging: the (smoothed) cursor IS the physical object,
     and a typeset-equation layer behind the canvas lights up around it.
       gr      — you are a planet: curved spacetime, bent light, slingshots
       field   — you are a charge near a conducting cylinder (exact images)
       magnet  — you are a bar magnet: a field of compass needles follows B
       lattice — you are an indenter on an elastic mass–spring sheet
     When the cursor is away, a ghost cursor wanders so the page stays alive. */
  (function heroSim() {
    var canvas = el("simCanvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var hero = canvas.parentElement;

    var W = 0, H = 0;
    var pointer = { x: -9999, y: -9999, active: false };
    var src = { x: 0, y: 0, vx: 0, vy: 0 };          // smoothed source (cursor or ghost)
    var running = true, inView = true, frameNo = 0, ghostT = 0;
    var accent = { r: 43, g: 60, b: 240 }, base = { r: 23, g: 23, b: 28 }, baseAlpha = 0.10;
    var warm = { r: 217, g: 72, b: 15 }, inset = "#e9e9e2", dark = false;

    function readColors() {
      var cs = getComputedStyle(document.documentElement);
      var m = (cs.getPropertyValue("--accent") || "#2b3cf0").trim().match(/^#([0-9a-f]{6})$/i);
      if (m) {
        accent.r = parseInt(m[1].slice(0, 2), 16);
        accent.g = parseInt(m[1].slice(2, 4), 16);
        accent.b = parseInt(m[1].slice(4, 6), 16);
      }
      dark = document.documentElement.getAttribute("data-theme") === "dark";
      base = dark ? { r: 236, g: 237, b: 237 } : { r: 23, g: 23, b: 28 };
      warm = dark ? { r: 255, g: 169, b: 77 } : { r: 217, g: 72, b: 15 };
      baseAlpha = dark ? 0.13 : 0.10;
      inset = (cs.getPropertyValue("--bg-inset") || inset).trim();
    }
    readColors();
    document.addEventListener("themechange", function () { readColors(); if (reduceMotion || (cur && cur.still)) draw(); });

    function rgba(c, a) { return "rgba(" + c.r + "," + c.g + "," + c.b + "," + a.toFixed(3) + ")"; }
    function lerpC(a, b, s) {
      return { r: Math.round(a.r + (b.r - a.r) * s), g: Math.round(a.g + (b.g - a.g) * s), b: Math.round(a.b + (b.b - a.b) * s) };
    }
    /* strain-style ramp shared by every model: ink → accent */
    function ramp(s, a0, a1) { return rgba(lerpC(base, accent, s), a0 + s * a1); }
    var TAU = 6.2832;

    /* generic field-line tracer: RK2 along ±F/|F|, `field(x,y)` fills fx,fy */
    var fx = 0, fy = 0;
    function traceLine(field, x, y, dir, out, stop, maxN, h) {
      out.push(x, y);
      for (var n = 0; n < maxN; n++) {
        field(x, y); var m = Math.sqrt(fx * fx + fy * fy) || 1e-9;
        var ux = dir * fx / m, uy = dir * fy / m;
        field(x + ux * h * 0.5, y + uy * h * 0.5); m = Math.sqrt(fx * fx + fy * fy) || 1e-9;
        x += dir * fx / m * h; y += dir * fy / m * h;
        if (x < -20 || x > W + 20 || y < -20 || y > H + 20 || stop(x, y)) break;
        out.push(x, y);
      }
    }
    function strokePts(pts, rev) {
      ctx.beginPath();
      for (var i = 0; i < pts.length; i += 2) { if (i === 0) ctx.moveTo(pts[i], pts[i + 1]); else ctx.lineTo(pts[i], pts[i + 1]); }
      ctx.stroke();
    }

    /* ---------------------------------------------------------------
       MODEL 1 · SPACETIME — the cursor is a planet
       Sheet height h = −k GM / √(r²+ε²) is the weak-field metric
       g₀₀ ≈ −(1+2Φ/c²) drawn as an embedding. Light rays are null
       geodesics (deflection 4GM/c²b, twice the Newtonian value); dust
       bodies follow the Schwarzschild orbit equation
         r̈ − L²/r³ = −GM/r² − 3GM L²/(c² r⁴).
       --------------------------------------------------------------- */
    function spacetimeSim() {
      var F = 1000, D = 1000, EL = 50 * Math.PI / 180, sinE = Math.sin(EL), cosE = Math.cos(EL);
      var GM = 576, K = 19, EPS = 10, EPSV = 56, C2 = 103, TL = 90, DS = 7, NR = 18, ND = 11;
      var cx0 = 0, cy0 = 0, gx = 0, y0 = 0, y1 = 0, sc = 1, N = 0;
      var m = { x: 0, y: 0 }, dust = [], rays = [], rayY = [];
      var sx_ = 0, sy_ = 0, sc_ = 1;

      function height(x, y) { var a = x - m.x, b = y - m.y; return -K * GM / Math.sqrt(a * a + b * b + EPSV * EPSV); }
      function proj(x, y, z) {
        var dep = D + y * cosE - z * sinE; sc_ = F / dep;
        sx_ = cx0 + x * sc_; sy_ = cy0 - (y * sinE + z * cosE) * sc_;
      }
      function unproj(sx, sy, z, out) {
        var u = (sx - cx0) / F, w = (cy0 - sy) / F;
        var y = (w * (D - z * sinE) - z * cosE) / (sinE - w * cosE);
        out.x = u * (D + y * cosE - z * sinE); out.y = y;
      }

      function spawn(p, anywhere) {
        p.x = anywhere ? -gx * 0.9 + Math.random() * gx * 1.3 : -gx * 0.95;
        p.y = m.y + (Math.random() * 2 - 1) * 300 * sc;
        p.vx = 2.6 + Math.random(); p.vy = (Math.random() - 0.5) * 0.3; p.trail = [];
      }
      function accel(p, out) {
        var dx = p.x - m.x, dy = p.y - m.y, r2 = Math.max(dx * dx + dy * dy, 100), r = Math.sqrt(r2);
        var L = dx * p.vy - dy * p.vx;
        var k = GM / Math.pow(r2 + EPS * EPS, 1.5) + 3 * GM * L * L / (C2 * r2 * r2 * r);
        out.x = -k * dx; out.y = -k * dy;
      }
      var acc = { x: 0, y: 0 };
      function integrate(dt) {
        for (var i = 0; i < dust.length; i++) {
          var p = dust[i]; accel(p, acc);
          p.vx += acc.x * dt; p.vy += acc.y * dt; p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.x > gx * 0.95 || p.y < y0 || p.y > y1 * 0.8 || Math.hypot(p.x - m.x, p.y - m.y) < 14) spawn(p, false);
        }
      }

      function castRays() {
        for (var k = 0; k < NR; k++) {
          var r = rays[k], x = -gx * 0.95, y = rayY[k], dx = 1, dy = 0, n = 0;
          for (var i = 0; i < N; i++) {
            r.p[2 * i] = x; r.p[2 * i + 1] = y; n = i + 1;
            var rx = x - m.x, ry = y - m.y, r2 = rx * rx + ry * ry + 144;
            var a = -2 * GM / (C2 * Math.pow(r2, 1.5)) * DS;
            dx += a * rx; dy += a * ry; var l = Math.sqrt(dx * dx + dy * dy); dx /= l; dy /= l;
            x += dx * DS; y += dy * DS;
            if (x > gx) break;
          }
          r.n = n;
        }
      }

      function track() {
        var tg = { x: 0, y: 0 }, z = height(m.x, m.y);
        for (var i = 0; i < 3; i++) { unproj(src.x, src.y, z, tg); z = height(tg.x, tg.y); }
        m.x = Math.max(-gx * 0.6, Math.min(gx * 0.5, tg.x));
        m.y = Math.max(y0 * 0.5, Math.min(y1 * 0.6, tg.y));
      }

      function build() {
        var narrow = W < 700; sc = narrow ? 0.72 : 1;
        cx0 = W * (narrow ? 0.6 : 0.68); cy0 = H * 0.4;
        gx = W * 1.15; y0 = -H * 0.9; y1 = H * 1.25;
        N = Math.ceil(2 * gx / DS) + 2;
        rays = []; rayY = [];
        for (var k = 0; k < NR; k++) { rays.push({ p: new Float32Array(2 * N), n: 0 }); rayY.push(-H * 0.45 + (k + 0.5) / NR * H * 1.5); }
        m.x = 0; m.y = 0; track();
        dust = [];
        for (var i = 0; i < ND; i++) { var p = {}; spawn(p, true); dust.push(p); }
        for (var s = 0; s < 120; s++) stepOnce();
      }

      function stepOnce() {
        for (var k = 0; k < 4; k++) integrate(0.25);
        for (var i = 0; i < dust.length; i++) {
          var p = dust[i]; p.trail.push(p.x, p.y);
          if (p.trail.length > TL * 2) p.trail.splice(0, 2);
        }
      }
      function step() { track(); stepOnce(); }

      function drawGrid() {
        var LS = 44, SS = 18, B = 8, P = [], b;
        for (b = 0; b < B; b++) P.push(new Path2D());
        function line(fixed, alongX) {
          var a0 = alongX ? -gx : y0, a1 = alongX ? gx : y1, pa = 0, pb = 0, ph = 0, first = true;
          for (var a = a0; a <= a1; a += SS) {
            var x = alongX ? a : fixed, y = alongX ? fixed : a, h = height(x, y);
            proj(x, y, h);
            if (!first) {
              var s = Math.min(1, Math.abs(h - ph) / SS / 0.9);
              var p = P[Math.min(B - 1, Math.floor(Math.pow(s, 0.8) * B))];
              p.moveTo(pa, pb); p.lineTo(sx_, sy_);
            }
            pa = sx_; pb = sy_; ph = h; first = false;
          }
        }
        var xa = Math.ceil(-gx / LS) * LS, ya = Math.ceil(y0 / LS) * LS, v;
        for (v = xa; v <= gx; v += LS) line(v, false);
        for (v = ya; v <= y1; v += LS) line(v, true);
        ctx.lineWidth = 1; ctx.lineCap = "butt";
        for (b = 0; b < B; b++) {
          ctx.strokeStyle = ramp((b + 0.5) / B, baseAlpha * 1.1, 0.7);
          ctx.stroke(P[b]);
        }
      }

      function draw() {
        drawGrid();
        var i, j;
        // light: null geodesics + photon pulses riding them
        ctx.lineCap = "round"; ctx.lineWidth = 1.2; ctx.strokeStyle = rgba(accent, dark ? 0.55 : 0.5);
        ctx.beginPath();
        for (i = 0; i < NR; i++) {
          var r = rays[i];
          for (j = 0; j < r.n; j++) {
            var x = r.p[2 * j], y = r.p[2 * j + 1]; proj(x, y, height(x, y) + 1);
            if (j === 0) ctx.moveTo(sx_, sy_); else ctx.lineTo(sx_, sy_);
          }
        }
        ctx.stroke();
        ctx.fillStyle = rgba(accent, 1);
        for (i = 0; i < NR; i++) {
          var rr = rays[i]; if (rr.n < 2) continue;
          var q = Math.floor(frameNo * 3 + i * 61) % rr.n, x2 = rr.p[2 * q], y2 = rr.p[2 * q + 1];
          proj(x2, y2, height(x2, y2) + 1); ctx.beginPath(); ctx.arc(sx_, sy_, 2.4 * sc_ + 0.6, 0, TAU); ctx.fill();
        }
        // massive test bodies with trails (older = fainter)
        ctx.lineWidth = 1.7;
        for (i = 0; i < dust.length; i++) {
          var tr = dust[i].trail, n = tr.length / 2, chunk = Math.max(1, Math.floor(n / 5));
          for (var c = 0; c < n - 1; c += chunk) {
            ctx.strokeStyle = rgba(warm, 0.06 + 0.8 * (c / n));
            ctx.beginPath();
            for (j = c; j <= Math.min(c + chunk, n - 1); j++) {
              var tx = tr[2 * j], ty = tr[2 * j + 1]; proj(tx, ty, height(tx, ty) + 1.5);
              if (j === c) ctx.moveTo(sx_, sy_); else ctx.lineTo(sx_, sy_);
            }
            ctx.stroke();
          }
          var p = dust[i]; proj(p.x, p.y, height(p.x, p.y) + 1.5);
          ctx.fillStyle = rgba(warm, 1); ctx.beginPath(); ctx.arc(sx_, sy_, 2.8 * sc_, 0, TAU); ctx.fill();
        }
        // the planet, sitting at the bottom of its own well
        proj(m.x, m.y, height(m.x, m.y));
        var rp = 10 * sc_, g = ctx.createRadialGradient(sx_, sy_, rp * 0.4, sx_, sy_, rp * 3.4);
        g.addColorStop(0, rgba(accent, 0.38)); g.addColorStop(1, rgba(accent, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx_, sy_, rp * 3.4, 0, TAU); ctx.fill();
        var g2 = ctx.createRadialGradient(sx_ - rp * 0.35, sy_ - rp * 0.4, rp * 0.1, sx_, sy_, rp);
        g2.addColorStop(0, rgba(lerpC(accent, { r: 255, g: 255, b: 255 }, 0.55), 1)); g2.addColorStop(1, rgba(accent, 1));
        ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(sx_, sy_, rp, 0, TAU); ctx.fill();
      }

      return { build: build, step: step, draw: draw,
        caption: "Live · you are a planet — curved spacetime bends light and orbits" };
    }

    /* ---------------------------------------------------------------
       MODEL 2 · ELECTROSTATICS — the cursor is a point charge
       2D: E = q r̂/r for a line charge q. A neutral isolated conducting
       cylinder (radius R) in a uniform field E0 with a charge q outside
       is solved EXACTLY by images: −q at R²(c−o)/|c−o|², +q at the center
       (net charge zero), plus the dipole E0R²(x²−y², 2xy)/r⁴.
       Surface charge density is σ = E·n̂ (ε = 1). Click flips the sign.
       --------------------------------------------------------------- */
    function fieldSim() {
      var R = 60, cx = 0, cy = 0, E0 = 0.34, Q = 58, SOFT = 36, GS = 34, sign = 1;
      var charge = { x: 0, y: 0, q: Q };

      function build() {
        var narrow = W < 700;
        R = narrow ? 42 : 60; cx = W * (narrow ? 0.62 : 0.69); cy = H * 0.5;
      }
      function fieldAt(x, y) {
        var rx = x - cx, ry = y - cy, r2 = rx * rx + ry * ry, R2 = R * R, r4 = r2 * r2;
        var ex = E0 * (1 + R2 * (rx * rx - ry * ry) / r4);
        var ey = E0 * R2 * 2 * rx * ry / r4;
        var q = charge.q, dx = x - charge.x, dy = y - charge.y, d2 = dx * dx + dy * dy + SOFT;
        ex += q * dx / d2; ey += q * dy / d2;                           // the charge
        var cdx = charge.x - cx, cdy = charge.y - cy, k = R2 / (cdx * cdx + cdy * cdy);
        dx = x - (cx + cdx * k); dy = y - (cy + cdy * k); d2 = dx * dx + dy * dy + SOFT;
        ex -= q * dx / d2; ey -= q * dy / d2;                           // image −q
        ex += q * rx / r2; ey += q * ry / r2;                           // +q at center
        fx = ex; fy = ey;
      }
      function step() {
        charge.q = sign * Q;
        var dx = src.x - cx, dy = src.y - cy, d = Math.sqrt(dx * dx + dy * dy), mn = R + 16;
        if (d < mn) { if (d < 1e-3) { dx = 1; dy = 0; d = 1; } dx = dx / d * mn; dy = dy / d * mn; }
        charge.x = cx + dx; charge.y = cy + dy;
      }
      function arrow(path, x, y, ex, ey, L) {
        var mm = Math.sqrt(ex * ex + ey * ey) || 1e-6, ux = ex / mm, uy = ey / mm;
        var x1 = x + ux * L * 0.5, y1 = y + uy * L * 0.5;
        path.moveTo(x - ux * L * 0.5, y - uy * L * 0.5); path.lineTo(x1, y1);
        var h = 3.6;
        path.moveTo(x1 - ux * h - uy * h * 0.7, y1 - uy * h + ux * h * 0.7);
        path.lineTo(x1, y1);
        path.lineTo(x1 - ux * h + uy * h * 0.7, y1 - uy * h - ux * h * 0.7);
      }
      function glyph(x, y, s, sg) {
        ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x + s, y);
        if (sg > 0) { ctx.moveTo(x, y - s); ctx.lineTo(x, y + s); }
        ctx.stroke();
      }
      function draw() {
        var P = [], b, i;
        for (b = 0; b < 6; b++) P.push(new Path2D());
        var R2 = (R + 5) * (R + 5);
        for (var y = GS / 2; y < H; y += GS) {
          for (var x = GS / 2; x < W; x += GS) {
            var dx = x - cx, dy = y - cy;
            if (dx * dx + dy * dy < R2) continue;
            if ((x - charge.x) * (x - charge.x) + (y - charge.y) * (y - charge.y) < 400) continue;
            fieldAt(x, y);
            var mg = Math.sqrt(fx * fx + fy * fy);
            arrow(P[Math.min(5, Math.floor(Math.min(1, mg / 1.6) * 6))], x, y, fx, fy, 6 + 17 * Math.tanh(mg * 1.1));
          }
        }
        ctx.lineWidth = 1.2; ctx.lineCap = "round"; ctx.lineJoin = "round";
        for (b = 0; b < 6; b++) { ctx.strokeStyle = ramp((b + 0.5) / 6, baseAlpha * 1.7, 0.6); ctx.stroke(P[b]); }

        // field lines leaving (or arriving at) the charge, bent by the conductor
        var col = sign > 0 ? accent : warm;
        ctx.strokeStyle = rgba(col, 0.8); ctx.lineWidth = 1.5;
        function stopF(px, py) {
          if ((px - cx) * (px - cx) + (py - cy) * (py - cy) < R * R) return true;
          return false;
        }
        for (i = 0; i < 16; i++) {
          var a = (i + 0.5) / 16 * TAU, pts = [];
          traceLine(fieldAt, charge.x + Math.cos(a) * 11, charge.y + Math.sin(a) * 11, sign, pts, stopF, 420, 6);
          strokePts(pts);
        }

        // conductor: E = 0 inside
        ctx.fillStyle = inset; ctx.globalAlpha = 0.96;
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
        ctx.strokeStyle = rgba(base, dark ? 0.55 : 0.5); ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = rgba(base, 0.45); ctx.font = "500 10px 'IBM Plex Mono', monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("E = 0", cx, cy - 7); ctx.fillText("conductor", cx, cy + 8);

        // induced surface charge σ = E·n̂
        ctx.lineWidth = 1.6;
        for (var j = 0; j < 44; j++) {
          var th = j / 44 * TAU, nx = Math.cos(th), ny = Math.sin(th);
          fieldAt(cx + nx * (R + 0.6), cy + ny * (R + 0.6));
          var sg = fx * nx + fy * ny;
          ctx.strokeStyle = sg > 0 ? rgba(accent, 0.95) : rgba(warm, 0.95);
          glyph(cx + nx * (R + 9), cy + ny * (R + 9), Math.min(1.3 + Math.abs(sg) * 1.7, 4.2), sg);
        }

        // you: the charge
        var g = ctx.createRadialGradient(charge.x, charge.y, 2, charge.x, charge.y, 30);
        g.addColorStop(0, rgba(col, 0.32)); g.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(charge.x, charge.y, 30, 0, TAU); ctx.fill();
        ctx.fillStyle = rgba(col, 1); ctx.beginPath(); ctx.arc(charge.x, charge.y, 9.5, 0, TAU); ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.9; glyph(charge.x, charge.y, 4.2, sign);
      }
      return { build: build, step: step, draw: draw, click: function () { sign = -sign; },
        caption: "Live · you are a charge near a conductor — click flips the sign" };
    }

    /* ---------------------------------------------------------------
       MODEL 3 · MAGNETOSTATICS — the cursor is a bar magnet
       B = (μ0/4π)(3(m·r̂)r̂ − m)/r³ + B0 (dipole in a weak uniform
       field). Each compass needle is a damped rigid rotor with torque
       τ = m×B:  θ̈ = −k sin(θ − φ_B) − cθ̇. The magnet points the way
       you move (like a compass), and field lines close through it.
       --------------------------------------------------------------- */
    function magnetSim() {
      var MM = 600000, B0x = 0.09, B0y = -0.05, SP = 32, ang = 0;
      var cols = 0, rows = 0, th = null, om = null;
      var bx = 0, by = 0;

      function build() {
        cols = Math.floor(W / SP) + 1; rows = Math.floor(H / SP) + 1;
        th = new Float32Array(cols * rows); om = new Float32Array(cols * rows);
        for (var i = 0; i < th.length; i++) th[i] = Math.atan2(B0y, B0x);
      }
      function bAt(x, y) {
        var mx = Math.cos(ang), my = Math.sin(ang);
        var dx = x - src.x, dy = y - src.y, r2 = dx * dx + dy * dy + 196, md = mx * dx + my * dy;
        var k = MM / Math.pow(r2, 1.5);
        fx = B0x + k * (3 * md * dx / r2 - mx); fy = B0y + k * (3 * md * dy / r2 - my);
      }
      function step() {
        var sp = Math.hypot(src.vx, src.vy);
        if (sp > 1.1) {
          var t = Math.atan2(src.vy, src.vx), d = t - ang;
          d = Math.atan2(Math.sin(d), Math.cos(d)); ang += d * Math.min(0.12, sp * 0.02);
        } else ang += 0.004;
        for (var j = 0; j < rows; j++) {
          for (var i = 0; i < cols; i++) {
            var k = j * cols + i; bAt(i * SP, j * SP);
            var phi = Math.atan2(fy, fx), mg = Math.sqrt(fx * fx + fy * fy);
            om[k] += (0.05 + 0.12 * Math.min(1, mg)) * Math.sin(phi - th[k]) - 0.26 * om[k];
            th[k] += om[k];
          }
        }
      }
      function draw() {
        var NP = [], SPh = [], b, i, j;
        for (b = 0; b < 3; b++) { NP.push(new Path2D()); SPh.push(new Path2D()); }
        for (j = 0; j < rows; j++) {
          for (i = 0; i < cols; i++) {
            var x = i * SP, y = j * SP, dx = x - src.x, dy = y - src.y;
            if (dx * dx + dy * dy < 900) continue;
            bAt(x, y); var s = Math.min(1, Math.sqrt(fx * fx + fy * fy) / 0.9);
            b = s < 0.25 ? 0 : s < 0.6 ? 1 : 2;
            var k = j * cols + i, c = Math.cos(th[k]), sn = Math.sin(th[k]), L = 8;
            NP[b].moveTo(x, y); NP[b].lineTo(x + c * L, y + sn * L);
            SPh[b].moveTo(x, y); SPh[b].lineTo(x - c * L, y - sn * L);
          }
        }
        ctx.lineWidth = 2.2; ctx.lineCap = "round";
        var al = [0.28, 0.55, 0.9];
        for (b = 0; b < 3; b++) {
          ctx.strokeStyle = rgba(warm, al[b]); ctx.stroke(NP[b]);
          ctx.strokeStyle = rgba(base, al[b] * (dark ? 0.55 : 0.5)); ctx.stroke(SPh[b]);
        }
        // field lines through a ring around the magnet
        ctx.strokeStyle = rgba(accent, 0.6); ctx.lineWidth = 1.2;
        function stopM(px, py) { return (px - src.x) * (px - src.x) + (py - src.y) * (py - src.y) < 160; }
        for (i = 0; i < 12; i++) {
          var a = (i + 0.5) / 12 * TAU, pa = [], pb = [];
          traceLine(bAt, src.x + Math.cos(a) * 26, src.y + Math.sin(a) * 26, 1, pa, stopM, 360, 5);
          traceLine(bAt, src.x + Math.cos(a) * 26, src.y + Math.sin(a) * 26, -1, pb, stopM, 360, 5);
          strokePts(pa); strokePts(pb);
        }
        // you: the magnet (N toward your direction of travel)
        var mx = Math.cos(ang), my = Math.sin(ang);
        var g = ctx.createRadialGradient(src.x, src.y, 4, src.x, src.y, 46);
        g.addColorStop(0, rgba(accent, 0.2)); g.addColorStop(1, rgba(accent, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(src.x, src.y, 46, 0, TAU); ctx.fill();
        ctx.save(); ctx.translate(src.x, src.y); ctx.rotate(ang);
        ctx.fillStyle = rgba(accent, 1); ctx.fillRect(-23, -8.5, 23, 17);
        ctx.fillStyle = rgba(warm, 1); ctx.fillRect(0, -8.5, 23, 17);
        ctx.strokeStyle = "rgba(255,255,255,0.65)"; ctx.lineWidth = 1; ctx.strokeRect(-23, -8.5, 46, 17);
        ctx.restore();
        ctx.fillStyle = "#fff"; ctx.font = "600 10px 'IBM Plex Mono', monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("N", src.x + mx * 12, src.y + my * 12); ctx.fillText("S", src.x - mx * 12, src.y - my * 12);
      }
      return { build: build, step: step, draw: draw,
        caption: "Live · you are a magnet — move to turn it, compasses follow B" };
    }

    /* ---------------------------------------------------------------
       MODEL 4 · VERY SOFT INFINITE PLATE — the cursor is a small pressure patch
       Kirchhoff–Love plate on a soft Winkler foundation, unbounded in the
       plane:   D∇⁴w + k_f w + ρh ẅ = q,   q = Q·Gaussian(σ) at the cursor.
       Fourier-diagonal: each wavevector k is a damped oscillator
         ẍ_k + 2ζω_k ẋ_k + ω_k² x_k = q̂_k/ρh,   ω_k² = (D k⁴ + k_f)/ρh,
       advanced with the exact closed-form step (unconditionally stable) on a
       periodic domain far larger than the page, so no edge or image is seen.
       Static limit: w = (Pℓ²/2πD) kei(r/ℓ), ℓ = (D/k_f)^¼.
       Rendered as one continuous lit surface: every low-res screen pixel
       ray-marches the deformed height field (2 fixed-point passes), is shaded
       by its slope, tinted by depth, with faint iso-deflection contours.
       --------------------------------------------------------------- */
    function plateSim() {
      var F = 1000, DZ = 1000, EL = 52 * Math.PI / 180, sE = Math.sin(EL), cE = Math.cos(EL);
      var NX = 128, NY = 64, N = NX * NY, HC = 18, LX = NX * HC, LY = NY * HC;
      var SIG = 30, SQD = 90, ELL = 72, TARGET = 100;
      var cx0 = 0, cy0 = 0, y0v = 0, wl = 0, lxw = 0, lyw = 0, gx = 0;
      var Xr, Xi, Vr, Vi, Er, Cc, Ss, IV, AA, W2, IW2, GQ, KX, KY, Wr, Wi, wgrid, wxG, wyG;
      var pxr = new Float64Array(NX), pxi = new Float64Array(NX), pyr = new Float64Array(NY), pyi = new Float64Array(NY);
      var sx_ = 0, sy_ = 0, ready = false, iy1 = NY - 2;
      var RS = 10, cw = 0, ch = 0, mapU, mapV, mapF, mapGI, mapGJ, blk, offc, offx, offimg;

      function tables(n) {
        var rev = new Uint16Array(n), c = new Float64Array(n / 2), sn = new Float64Array(n / 2), bits = Math.log2(n) | 0, i, j, r;
        for (i = 0; i < n; i++) { r = 0; for (j = 0; j < bits; j++) if (i & (1 << j)) r |= 1 << (bits - 1 - j); rev[i] = r; }
        for (i = 0; i < n / 2; i++) { c[i] = Math.cos(2 * Math.PI * i / n); sn[i] = Math.sin(2 * Math.PI * i / n); }
        return { rev: rev, c: c, s: sn };
      }
      var TX = tables(NX), TY = tables(NY);
      function fft1(re, im, off, st, n, sign, T) {
        var i, j, len, half, step, a, b, wr, wi, tr, ti, t, rev = T.rev, c = T.c, sn = T.s;
        for (i = 0; i < n; i++) { j = rev[i]; if (j > i) { a = off + i * st; b = off + j * st; t = re[a]; re[a] = re[b]; re[b] = t; t = im[a]; im[a] = im[b]; im[b] = t; } }
        for (len = 2; len <= n; len <<= 1) {
          half = len >> 1; step = n / len;
          for (i = 0; i < n; i += len) for (j = 0; j < half; j++) {
            wr = c[j * step]; wi = sign * sn[j * step]; a = off + (i + j) * st; b = off + (i + j + half) * st;
            tr = re[b] * wr - im[b] * wi; ti = re[b] * wi + im[b] * wr;
            re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
          }
        }
      }
      function fft2(re, im, sign) {
        var j, i;
        for (j = 0; j < NY; j++) fft1(re, im, j * NX, 1, NX, sign, TX);
        for (i = 0; i < NX; i++) fft1(re, im, i, NX, NY, sign, TY);
      }

      function proj(x, y, z) {
        var dep = DZ + y * cE - z * sE, k = F / dep;
        sx_ = cx0 + x * k; sy_ = cy0 - (y * sE + z * cE) * k;
      }
      function unproj(sx, sy, z, out) {
        var u = (sx - cx0) / F, w = (cy0 - sy) / F;
        var y = (w * (DZ - z * sE) - z * cE) / (sE - w * cE);
        out.x = u * (DZ + y * cE - z * sE); out.y = y;
      }
      function clamp(x, lo, hi) { return x < lo ? lo : x > hi ? hi : x; }

      function build() {
        cx0 = W * 0.5; cy0 = H * 0.5; gx = Math.min(W * 1.15, LX / 2 - 40); y0v = -H * 0.45;
        var i, j, m;
        Xr = new Float64Array(N); Xi = new Float64Array(N); Vr = new Float64Array(N); Vi = new Float64Array(N);
        Er = new Float64Array(N); Cc = new Float64Array(N); Ss = new Float64Array(N); IV = new Float64Array(N);
        AA = new Float64Array(N); W2 = new Float64Array(N); IW2 = new Float64Array(N); GQ = new Float64Array(N);
        Wr = new Float64Array(N); Wi = new Float64Array(N); wgrid = new Float32Array(N); wxG = new Float32Array(N); wyG = new Float32Array(N);
        KX = new Float64Array(NX); KY = new Float64Array(NY);
        for (i = 0; i < NX; i++) KX[i] = 2 * Math.PI / LX * (i <= NX / 2 ? i : i - NX);
        for (j = 0; j < NY; j++) KY[j] = 2 * Math.PI / LY * (j <= NY / 2 ? j : j - NY);
        var D = SQD * SQD, kf = D / Math.pow(ELL, 4), sumGW = 0;
        for (j = 0; j < NY; j++) for (i = 0; i < NX; i++) {
          m = j * NX + i; var k2 = KX[i] * KX[i] + KY[j] * KY[j];
          var w2 = D * k2 * k2 + kf, om = Math.sqrt(w2);
          var ze = Math.min(0.98, 0.025 + 0.975 / (1 + (om / 0.05) * (om / 0.05)));
          var wd = om * Math.sqrt(1 - ze * ze);
          W2[m] = w2; IW2[m] = 1 / w2; AA[m] = ze * om; Er[m] = Math.exp(-ze * om);
          Cc[m] = Math.cos(wd); Ss[m] = Math.sin(wd); IV[m] = 1 / wd;
          var g = Math.exp(-SIG * SIG * k2 / 2); GQ[m] = g; sumGW += g / w2;
        }
        var Q = TARGET * N * HC * HC / sumGW;                               // static dimple depth ≈ TARGET px
        for (m = 0; m < N; m++) GQ[m] *= Q / (HC * HC);
        // screen → ray parameters, and far-edge fog
        cw = Math.ceil(W / RS); ch = Math.ceil(H / RS);
        mapU = new Float32Array(cw * ch); mapV = new Float32Array(cw * ch); mapF = new Float32Array(cw * ch); mapGI = new Float32Array(cw * ch); mapGJ = new Float32Array(cw * ch); blk = new Uint8Array((NX >> 2) * (NY >> 2));
        offc = document.createElement("canvas"); offc.width = cw; offc.height = ch; offx = offc.getContext("2d"); offimg = offx.createImageData(cw, ch);
        proj(0, iy1 * HC - LY / 2, 0); var syFar = sy_;
        for (j = 0; j < ch; j++) for (i = 0; i < cw; i++) {
          var q = j * cw + i, sxp = (i + 0.5) * RS, syp = (j + 0.5) * RS;
          mapU[q] = (sxp - cx0) / F; mapV[q] = (cy0 - syp) / F;
          mapF[q] = clamp((syp - syFar) / 240, 0, 1);
          var yy = (mapV[q] * DZ) / (sE - mapV[q] * cE), xx = mapU[q] * (DZ + yy * cE);
          mapGI[q] = (xx + LX / 2) / HC; mapGJ[q] = (yy + LY / 2) / HC;
        }
        wl = 0; lxw = 0; lyw = 200; ready = true;
        for (i = 0; i < 40; i++) step();
      }

      function step() {
        if (!ready) return;
        var tg = { x: 0, y: 0 }, i, j, m;
        unproj(src.x, src.y, -wl, tg);
        lxw = clamp(tg.x, -gx * 0.92, gx * 0.92); lyw = clamp(tg.y, y0v * 0.85, (LY / 2) * 0.88);
        var x0 = lxw + LX / 2, y0 = lyw + LY / 2;
        for (i = 0; i < NX; i++) { var t = KX[i] * x0; pxr[i] = Math.cos(t); pxi[i] = -Math.sin(t); }
        for (j = 0; j < NY; j++) { var u = KY[j] * y0; pyr[j] = Math.cos(u); pyi[j] = -Math.sin(u); }
        for (j = 0; j < NY; j++) {
          var yr = pyr[j], yi = pyi[j];
          for (i = 0; i < NX; i++) {
            m = j * NX + i;
            var fr = GQ[m] * (pxr[i] * yr - pxi[i] * yi), fi = GQ[m] * (pxr[i] * yi + pxi[i] * yr);
            var sr = fr * IW2[m], si = fi * IW2[m];
            var a = AA[m], e = Er[m], c = Cc[m], sn = Ss[m], iv = IV[m], w2 = W2[m];
            var dr = Xr[m] - sr, di = Xi[m] - si, vr = Vr[m], vi = Vi[m];
            Xr[m] = e * (dr * c + (vr + a * dr) * iv * sn) + sr;
            Xi[m] = e * (di * c + (vi + a * di) * iv * sn) + si;
            Vr[m] = e * (vr * c - (w2 * dr + a * vr) * iv * sn);
            Vi[m] = e * (vi * c - (w2 * di + a * vi) * iv * sn);
          }
        }
        Wr.set(Xr); Wi.set(Xi); fft2(Wr, Wi, 1);
        for (m = 0; m < N; m++) wgrid[m] = Wr[m] / N;
        var gi = clamp(Math.round(x0 / HC), 0, NX - 1), gj = clamp(Math.round(y0 / HC), 0, NY - 1);
        wl = wgrid[gj * NX + gi];
      }

      function bil(f, gi, gj) {
        var i = gi | 0, j = gj | 0, fx = gi - i, fy = gj - j, m = j * NX + i;
        return (f[m] * (1 - fx) + f[m + 1] * fx) * (1 - fy) + (f[m + NX] * (1 - fx) + f[m + NX + 1] * fx) * fy;
      }

      function draw() {
        var i, j, m, q, ih = 0.5 / HC;
        for (j = 1; j < NY - 1; j++) for (i = 1; i < NX - 1; i++) {
          m = j * NX + i; wxG[m] = (wgrid[m + 1] - wgrid[m - 1]) * ih; wyG[m] = (wgrid[m + NX] - wgrid[m - NX]) * ih;
        }
        var d = offimg.data, Lx = -0.62, Ly = -0.34, Lz = 0.48, ln = Math.sqrt(Lx * Lx + Ly * Ly + Lz * Lz); Lx /= ln; Ly /= ln; Lz /= ln;
        var HX = LX / 2, HY = LY / 2, gmaxX = NX - 3, gmaxY = NY - 3, ink = { r: base.r + (accent.r - base.r) * 0.55, g: base.g + (accent.g - base.g) * 0.55, b: base.b + (accent.b - base.b) * 0.55 }, dk = dark ? 1 : 0;
        // coarse activity mask: where is the sheet visibly displaced or tilted?
        var BW = NX >> 2, BH = NY >> 2, bi, bj;
        blk.fill(0);
        for (j = 1; j < NY - 1; j++) for (i = 1; i < NX - 1; i++) {
          m = j * NX + i;
          if ((wgrid[m] > 0.6 || wgrid[m] < -0.6) || (wxG[m] > 0.01 || wxG[m] < -0.01 || wyG[m] > 0.01 || wyG[m] < -0.01)) {
            bi = i >> 2; bj = j >> 2;
            for (var dj = -1; dj <= 1; dj++) for (var di = -1; di <= 1; di++) { var ii = bi + di, jj = bj + dj; if (ii >= 0 && ii < BW && jj >= 0 && jj < BH) blk[jj * BW + ii] = 1; }
          }
        }
        for (q = 0; q < cw * ch; q++) {
          var o = 4 * q, gi = mapGI[q], gj = mapGJ[q];
          if (gi < 2 || gi > gmaxX || gj < 2 || gj > gmaxY) { d[o + 3] = 0; continue; }
          if (!blk[(gj >> 2) * BW + (gi >> 2)]) {                        // flat sheet: constant soft tint
            d[o] = accent.r; d[o + 1] = accent.g; d[o + 2] = accent.b; d[o + 3] = 255 * 0.09 * mapF[q]; continue;
          }
          var U = mapU[q], V = mapV[q], z = -bil(wgrid, gi, gj), x, y;   // first march step from the flat plane
          y = (V * (DZ - z * sE) - z * cE) / (sE - V * cE); x = U * (DZ + y * cE - z * sE);
          gi = (x + HX) / HC; gj = (y + HY) / HC;
          if (gi < 2 || gi > gmaxX || gj < 2 || gj > gmaxY) { d[o + 3] = 0; continue; }
          z = -bil(wgrid, gi, gj);
          var w = -z, wx = bil(wxG, gi, gj), wy = bil(wyG, gi, gj);
          var lam = (wx * Lx + wy * Ly + Lz) / Math.sqrt(wx * wx + wy * wy + 1);
          var sh = (Lz - lam) * 2.4; sh = sh < 0 ? 0 : sh > 1 ? 1 : sh;          // facing away from the light
          var hl = (lam - Lz) * 2.4; hl = hl < 0 ? 0 : hl > 1 ? 1 : hl;            // facing the light
          var t = w / TARGET; t = t < 0 ? 0 : t > 1 ? 1 : t;
          var a1, c1;                                                    // soft depth tint: blue where sagged, warm where hogged
          if (w >= 0) { a1 = 0.09 + 0.26 * t; c1 = accent; } else { var hg = -w / (TARGET * 0.4); hg = hg > 1 ? 1 : hg; var mw = -w / 4; mw = mw > 1 ? 1 : mw; a1 = 0.09 + 0.14 * hg; c1 = { r: accent.r + (warm.r - accent.r) * mw, g: accent.g + (warm.g - accent.g) * mw, b: accent.b + (warm.b - accent.b) * mw }; }
          var a2 = Math.min(0.5, 0.3 * sh + 0.16 * t), a3 = (0.3 + 0.1 * dk) * hl;               // shadow (ink) over tint, highlight (white) over that
          var A = a2 + a1 * (1 - a2), r = (ink.r * a2 + c1.r * a1 * (1 - a2)) / A, g = (ink.g * a2 + c1.g * a1 * (1 - a2)) / A, b = (ink.b * a2 + c1.b * a1 * (1 - a2)) / A;
          var A2 = a3 + A * (1 - a3);
          r = (255 * a3 + r * A * (1 - a3)) / A2; g = (255 * a3 + g * A * (1 - a3)) / A2; b = (255 * a3 + b * A * (1 - a3)) / A2;
          d[o] = r; d[o + 1] = g; d[o + 2] = b; d[o + 3] = 255 * A2 * mapF[q];
        }
        offx.putImageData(offimg, 0, 0);
        ctx.imageSmoothingEnabled = true; ctx.drawImage(offc, 0, 0, cw, ch, 0, 0, cw * RS, ch * RS);
        // iso-deflection contours (marching squares on the grid), drawn on the deformed, projected sheet
        var CP = new Path2D(), STEP = 10, ci, cj, v0, v1, v2, v3, mn, mxv, k0, k1, kk, L, idx, tt;
        var jlo = 2, jhi = NY - 3;
        function ept(e, X, Y, a, b, c, d2, L2) {
          if (e === 0) { tt = (L2 - a) / (b - a); return [X + tt * HC, Y]; }
          if (e === 1) { tt = (L2 - b) / (c - b); return [X + HC, Y + tt * HC]; }
          if (e === 2) { tt = (L2 - c) / (d2 - c); return [X + HC - tt * HC, Y + HC]; }
          tt = (L2 - d2) / (a - d2); return [X, Y + HC - tt * HC];
        }
        var SEG = [[], [3, 0], [0, 1], [3, 1], [1, 2], [3, 2, 0, 1], [0, 2], [3, 2], [3, 2], [0, 2], [3, 0, 1, 2], [1, 2], [3, 1], [0, 1], [3, 0], []];
        for (cj = jlo; cj < jhi; cj++) for (ci = 2; ci < NX - 3; ci++) {
          m = cj * NX + ci; v0 = wgrid[m]; v1 = wgrid[m + 1]; v2 = wgrid[m + NX + 1]; v3 = wgrid[m + NX];
          mxv = Math.max(v0, v1, v2, v3); if (mxv < STEP) continue; mn = Math.min(v0, v1, v2, v3);
          k0 = Math.max(1, Math.ceil(mn / STEP)); k1 = Math.floor(mxv / STEP);
          for (kk = k0; kk <= k1; kk++) {
            L = kk * STEP; idx = (v0 > L ? 1 : 0) | (v1 > L ? 2 : 0) | (v2 > L ? 4 : 0) | (v3 > L ? 8 : 0);
            var sg = SEG[idx]; if (!sg.length) continue;
            var X0 = ci * HC - LX / 2, Y0 = cj * HC - LY / 2;
            for (var si = 0; si < sg.length; si += 2) {
              var P1 = ept(sg[si], X0, Y0, v0, v1, v2, v3, L), P2 = ept(sg[si + 1], X0, Y0, v0, v1, v2, v3, L);
              proj(P1[0], P1[1], -L); CP.moveTo(sx_, sy_); proj(P2[0], P2[1], -L); CP.lineTo(sx_, sy_);
            }
          }
        }
        ctx.lineWidth = 1.1; ctx.lineCap = "round"; ctx.strokeStyle = rgba(lerpC(base, accent, 0.45), dark ? 0.5 : 0.42); ctx.stroke(CP);
        // the distributed load: footprint ring on the surface + five arrows
        var r0 = SIG * 1.6, k, ang;
        ctx.setLineDash([3, 4]); ctx.strokeStyle = rgba(accent, 0.9); ctx.lineWidth = 1.4; ctx.beginPath();
        for (k = 0; k <= 36; k++) { ang = k / 36 * TAU; proj(lxw + r0 * Math.cos(ang), lyw + r0 * Math.sin(ang), -wl); if (k === 0) ctx.moveTo(sx_, sy_); else ctx.lineTo(sx_, sy_); }
        ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = rgba(accent, 1); ctx.fillStyle = rgba(accent, 1); ctx.lineWidth = 1.8; ctx.lineCap = "round";
        for (k = 0; k < 5; k++) {
          var rr = k ? r0 * 0.62 : 0, a2 = k * 1.5708; proj(lxw + rr * Math.cos(a2), lyw + rr * Math.sin(a2), -wl); var bx = sx_, by = sy_;
          proj(lxw + rr * Math.cos(a2), lyw + rr * Math.sin(a2), -wl + 70); var tx = sx_, ty = sy_;
          ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(bx, by - 4); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - 4, by - 8); ctx.lineTo(bx + 4, by - 8); ctx.closePath(); ctx.fill();
        }
        proj(lxw, lyw, -wl + 78); ctx.font = "600 12px 'IBM Plex Mono', monospace"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText("q", sx_ + 9, sy_ - 3);
      }
      return { build: build, step: step, draw: draw, 
        caption: "Live · you load a very soft infinite plate — it sags like a gravity well" };
    }

    /* ---------------------------------------------------------------
       MODEL 5 · FLUID FLOW — the cursor is a cylinder in a viscous stream
       Incompressible Navier–Stokes (Stam's stable fluids): semi-Lagrangian
       advection + vorticity confinement, then a pressure projection
       ∇²p = ∇·u so that ∇·u = 0, with the cylinder as a moving no-slip
       solid. Uniform inflow on the left, outflow on the right. Color is
       vorticity ω = ∂ₓv − ∂ᵧu; streaks are tracer particles.
       --------------------------------------------------------------- */
    function fluidSim() {
      var hc = 9, N = 0, M = 0, u, v, u0, v0, pr, om, sol;
      var U0 = 0.5, RC = 5.5, EPSC = 0.08, ox = 0, oy = 0, ovx = 0, ovy = 0;
      var NP = 2600, qx, qy, off, octx, img;

      function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
      function build() {
        hc = W < 700 ? 9 : 8; RC = W < 700 ? 2.6 : 3.4;
        N = Math.ceil(W / hc); M = Math.ceil(H / hc);
        var n = N * M;
        u = new Float32Array(n); v = new Float32Array(n); u0 = new Float32Array(n); v0 = new Float32Array(n);
        pr = new Float32Array(n); om = new Float32Array(n); sol = new Uint8Array(n);
        for (var i = 0; i < n; i++) u[i] = U0;
        off = document.createElement("canvas"); off.width = N; off.height = M;
        octx = off.getContext("2d"); img = octx.createImageData(N, M);
        ox = clamp(src.x / hc, RC + 4, N - RC - 8); oy = clamp(src.y / hc, RC + 2, M - RC - 2); ovx = ovy = 0;
        qx = new Float32Array(NP); qy = new Float32Array(NP);
        for (var k = 0; k < NP; k++) { qx[k] = Math.random() * N; qy[k] = Math.random() * M; }
        for (var t = 0; t < 40; t++) physics();
      }

      function sample(f, x, y) {
        x = clamp(x, 0, N - 1.001); y = clamp(y, 0, M - 1.001);
        var i = x | 0, j = y | 0, fx = x - i, fy = y - j, k = j * N + i;
        return (f[k] * (1 - fx) + f[k + 1] * fx) * (1 - fy) + (f[k + N] * (1 - fx) + f[k + N + 1] * fx) * fy;
      }

      function physics() {
        var i, j, k, n = N * M;
        // obstacle: follows the (smoothed) cursor; its velocity drives the fluid around it
        var tx = clamp(src.x / hc, RC + 4, N - RC - 8), ty = clamp(src.y / hc, RC + 2, M - RC - 2);
        ovx = clamp(tx - ox, -1.2, 1.2); ovy = clamp(ty - oy, -1.2, 1.2); ox = tx; oy = ty;
        sol.fill(0);
        var x0 = Math.max(0, Math.floor(ox - RC - 1)), x1 = Math.min(N - 1, Math.ceil(ox + RC + 1));
        var y0 = Math.max(0, Math.floor(oy - RC - 1)), y1 = Math.min(M - 1, Math.ceil(oy + RC + 1));
        for (j = y0; j <= y1; j++) for (i = x0; i <= x1; i++) {
          if ((i - ox) * (i - ox) + (j - oy) * (j - oy) <= RC * RC) { k = j * N + i; sol[k] = 1; u[k] = ovx; v[k] = ovy; }
        }
        // vorticity confinement keeps small eddies alive on a coarse grid
        for (j = 1; j < M - 1; j++) for (i = 1; i < N - 1; i++) {
          k = j * N + i; om[k] = 0.5 * ((v[k + 1] - v[k - 1]) - (u[k + N] - u[k - N]));
        }
        for (j = 2; j < M - 2; j++) for (i = 2; i < N - 2; i++) {
          k = j * N + i; if (sol[k]) continue;
          var gx = 0.5 * (Math.abs(om[k + 1]) - Math.abs(om[k - 1])), gy = 0.5 * (Math.abs(om[k + N]) - Math.abs(om[k - N]));
          var mg = Math.sqrt(gx * gx + gy * gy) + 1e-5;
          u[k] += EPSC * (gy / mg) * om[k]; v[k] -= EPSC * (gx / mg) * om[k];
        }
        // semi-Lagrangian advection of velocity
        u0.set(u); v0.set(v);
        for (j = 0; j < M; j++) for (i = 0; i < N; i++) {
          k = j * N + i; if (sol[k]) continue;
          var bx = i - u0[k], by = j - v0[k];
          u[k] = sample(u0, bx, by); v[k] = sample(v0, bx, by);
        }
        for (j = 0; j < M; j++) { u[j * N] = U0; v[j * N] = 0; }               // inflow
        // pressure projection (Gauss–Seidel): ∇²p = ∇·u, Neumann at solids/walls, p = 0 at outflow
        for (j = 0; j < M; j++) for (i = 0; i < N; i++) {
          k = j * N + i; if (sol[k]) { om[k] = 0; continue; }
          var uL = i > 0 ? u[k - 1] : U0, uR = i < N - 1 ? u[k + 1] : u[k];
          var vB = j > 0 ? v[k - N] : 0, vT = j < M - 1 ? v[k + N] : 0;
          om[k] = 0.5 * (uR - uL + vT - vB);                                    // divergence (reused buffer)
        }
        for (var it = 0; it < 28; it++) {
          for (j = 0; j < M; j++) for (i = 0; i < N; i++) {
            k = j * N + i; if (sol[k]) continue;
            var sum = 0, cnt = 0;
            if (i > 0 && !sol[k - 1]) { sum += pr[k - 1]; cnt++; }
            if (i < N - 1) { if (!sol[k + 1]) { sum += pr[k + 1]; cnt++; } } else cnt++;
            if (j > 0 && !sol[k - N]) { sum += pr[k - N]; cnt++; }
            if (j < M - 1 && !sol[k + N]) { sum += pr[k + N]; cnt++; }
            if (cnt) pr[k] = (sum - om[k]) / cnt;
          }
        }
        for (j = 0; j < M; j++) for (i = 0; i < N; i++) {
          k = j * N + i; if (sol[k]) continue;
          var pc = pr[k];
          var pL = i > 0 && !sol[k - 1] ? pr[k - 1] : pc;
          var pR = i < N - 1 ? (sol[k + 1] ? pc : pr[k + 1]) : 0;
          var pB = j > 0 && !sol[k - N] ? pr[k - N] : pc, pT = j < M - 1 && !sol[k + N] ? pr[k + N] : pc;
          u[k] -= 0.5 * (pR - pL); v[k] -= 0.5 * (pT - pB);
        }
        for (i = 0; i < N; i++) { v[i] = 0; v[(M - 1) * N + i] = 0; }
        for (k = 0; k < n; k++) if (sol[k]) { u[k] = ovx; v[k] = ovy; }
        // tracers
        for (var q = 0; q < NP; q++) {
          var x = qx[q] + sample(u, qx[q], qy[q]), y = qy[q] + sample(v, qx[q], qy[q]);
          var ci = x | 0, cj = y | 0;
          if (x < 0 || x >= N - 1 || y < 0 || y >= M - 1 || sol[cj * N + ci]) { x = Math.random() * 1.5; y = Math.random() * M; }
          qx[q] = x; qy[q] = y;
        }
      }

      function step() { physics(); }

      function draw() {
        var i, j, k, d = img.data, sc = dark ? 0.72 : 0.62;
        for (j = 0; j < M; j++) for (i = 0; i < N; i++) {
          k = j * N + i; var o = 4 * k;
          if (sol[k] || i < 1 || j < 1 || i > N - 2 || j > M - 2) { d[o + 3] = 0; continue; }
          var w = 0.5 * ((v[k + 1] - v[k - 1]) - (u[k + N] - u[k - N]));
          var a = Math.min(1, Math.pow(Math.abs(w) / 0.2, 0.75)) * sc, c = w > 0 ? accent : warm;
          d[o] = c.r; d[o + 1] = c.g; d[o + 2] = c.b; d[o + 3] = a * 255;
        }
        octx.putImageData(img, 0, 0);
        ctx.imageSmoothingEnabled = true; ctx.drawImage(off, 0, 0, N, M, 0, 0, N * hc, M * hc);
        // tracer streaks, three speed classes
        var P = [new Path2D(), new Path2D(), new Path2D()];
        for (var q = 0; q < NP; q++) {
          var x = qx[q], y = qy[q], uu = sample(u, x, y), vv = sample(v, x, y);
          var sp = Math.sqrt(uu * uu + vv * vv), b = sp < U0 * 0.8 ? 0 : sp < U0 * 1.25 ? 1 : 2;
          P[b].moveTo((x - uu * 2.6) * hc, (y - vv * 2.6) * hc); P[b].lineTo(x * hc, y * hc);
        }
        ctx.lineWidth = 1.1; ctx.lineCap = "round";
        for (var b2 = 0; b2 < 3; b2++) { ctx.strokeStyle = rgba(base, [0.16, 0.3, 0.5][b2] * (dark ? 1.15 : 1)); ctx.stroke(P[b2]); }
        // the cylinder
        var cx = ox * hc, cy = oy * hc, R = RC * hc;
        var g = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R + 22);
        g.addColorStop(0, rgba(accent, 0.25)); g.addColorStop(1, rgba(accent, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R + 22, 0, TAU); ctx.fill();
        var g2 = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
        g2.addColorStop(0, rgba(lerpC(accent, { r: 255, g: 255, b: 255 }, 0.5), 1)); g2.addColorStop(1, rgba(accent, 1));
        ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
      }
      return { build: build, step: step, draw: draw,
        caption: "Live · you are a cylinder in a viscous flow — vorticity sheds in your wake" };
    }

    /* ---------------------------------------------------------------
       MODEL 6 (DISABLED — kept for later; re-enable by adding `top: topSim()` to `sims`,
       a <button data-mode="top"> to the tab bar, and `top` to the eq lists)
       RIGID BODY — the cursor holds the pivot of a Lagrange top
       Heavy symmetric top (I₁ = I₂, I₃), fixed point at the tip, torque
       from gravity about the pivot. Integrated as the Euler–Poisson
       system in the body frame (RK4 on a unit quaternion q, R = R(q)):
         I ω̇ + ω × Iω = r_c × F,     q̇ = ½ q ⊗ (0, ω).
       Moving the pivot is exact: in the pivot's frame the COM feels the
       effective force F = m(g − a_pivot), so jerking the cursor excites
       nutation. A small drag on ω₁,ω₂ and a spin motor on ω₃ keep it alive.
       The trace is the path of the axis tip (cusps/loops = nutation).
       --------------------------------------------------------------- */
    function topSim() {
      var LU = 58, E = 28 * Math.PI / 180, sE = Math.sin(E), cE = Math.cos(E);
      var G = 9.8, M = 1, LC = 0.7, I1 = 0.58, I3 = 0.15, W3 = 46, DAMP = 0.1, MOTOR = 0.6;
      var s = [1, 0, 0, 0, 0, 0, W3];          // q0..q3, ω1..ω3 (body frame)
      var ap = [0, 0, 0], apf = [0, 0], pvx = 0, pvy = 0, trail = [], px_ = 0, py_ = 0;
      var prof = [[0, 0], [0.5, 0.82], [0.5, 1.0], [0.14, 1.0], [0.1, 1.38]], NS = 28;
      var Rm = new Float64Array(9), ds = new Float64Array(7), k1 = new Float64Array(7), k2 = new Float64Array(7), k3 = new Float64Array(7), k4 = new Float64Array(7), tmp = new Float64Array(7);

      function rot(q, R) {
        var a = q[0], b = q[1], c = q[2], d = q[3];
        R[0] = 1 - 2 * (c * c + d * d); R[1] = 2 * (b * c - a * d); R[2] = 2 * (b * d + a * c);
        R[3] = 2 * (b * c + a * d); R[4] = 1 - 2 * (b * b + d * d); R[5] = 2 * (c * d - a * b);
        R[6] = 2 * (b * d - a * c); R[7] = 2 * (c * d + a * b); R[8] = 1 - 2 * (b * b + c * c);
      }
      function deriv(y, out) {
        rot(y, Rm);
        var a = y[0], b = y[1], c = y[2], d = y[3], w1 = y[4], w2 = y[5], w3 = y[6];
        out[0] = 0.5 * (-b * w1 - c * w2 - d * w3); out[1] = 0.5 * (a * w1 + c * w3 - d * w2);
        out[2] = 0.5 * (a * w2 + d * w1 - b * w3); out[3] = 0.5 * (a * w3 + b * w2 - c * w1);
        // effective force on the COM in world coordinates (gravity − pivot acceleration)
        var Fx = -M * ap[0], Fy = -M * ap[1], Fz = -M * G - M * ap[2];
        var cz = Rm[8];
        if (cz < 0.2) Fz += 300 * (0.2 - cz);                          // the floor
        var fbx = Rm[0] * Fx + Rm[3] * Fy + Rm[6] * Fz, fby = Rm[1] * Fx + Rm[4] * Fy + Rm[7] * Fz;   // Rᵀ F
        var t1 = -LC * fby, t2 = LC * fbx;                             // r_c × F with r_c = (0,0,l)
        out[4] = (t1 + (I1 - I3) * w2 * w3) / I1 - DAMP * w1;
        out[5] = (t2 + (I3 - I1) * w3 * w1) / I1 - DAMP * w2;
        out[6] = MOTOR * (W3 - w3);
      }
      function rk4(dt) {
        var i;
        deriv(s, k1);
        for (i = 0; i < 7; i++) tmp[i] = s[i] + 0.5 * dt * k1[i]; deriv(tmp, k2);
        for (i = 0; i < 7; i++) tmp[i] = s[i] + 0.5 * dt * k2[i]; deriv(tmp, k3);
        for (i = 0; i < 7; i++) tmp[i] = s[i] + dt * k3[i]; deriv(tmp, k4);
        for (i = 0; i < 7; i++) s[i] += dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
        var n = Math.sqrt(s[0] * s[0] + s[1] * s[1] + s[2] * s[2] + s[3] * s[3]);
        for (i = 0; i < 4; i++) s[i] /= n;
      }
      function build() {
        var th = 0.42;
        s = [Math.cos(th / 2), Math.sin(th / 2), 0, 0, 0, 0, W3];
        trail = []; apf[0] = apf[1] = 0; pvx = src.vx; pvy = src.vy;
        for (var i = 0; i < 90; i++) { advance(true); }
      }
      function advance(quiet) {
        // pivot acceleration (px/frame² → LU/s²), low-passed and capped
        var ax = quiet ? 0 : src.vx - pvx, ay = quiet ? 0 : src.vy - pvy;
        pvx = src.vx; pvy = src.vy;
        apf[0] += (ax - apf[0]) * 0.4; apf[1] += (ay - apf[1]) * 0.4;
        var k = 3600 / LU, X = apf[0] * k, Y = -apf[1] * k / sE, m = Math.sqrt(X * X + Y * Y);
        if (m > 60) { X *= 60 / m; Y *= 60 / m; }
        ap[0] = X; ap[1] = Y; ap[2] = 0;
        for (var i = 0; i < 6; i++) rk4(1 / 360);
        rot(s, Rm);
        trail.push(Rm[2] * 1.62, Rm[5] * 1.62, Rm[8] * 1.62);
        if (trail.length > 3 * 360) trail.splice(0, 3);
      }
      function step() { advance(false); }

      function P(X, Y, Z) { px_ = ppx + X * LU; py_ = ppy - (Z * cE + Y * sE) * LU; }
      var ppx = 0, ppy = 0;
      function arrow(X, Y, Z, col, label) {
        P(0, 0, 0); var x0 = px_, y0 = py_; P(X, Y, Z); var x1 = px_, y1 = py_;
        var dx = x1 - x0, dy = y1 - y0, l = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / l, uy = dy / l;
        ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.8; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - ux * 8 - uy * 4, y1 - uy * 8 + ux * 4); ctx.lineTo(x1 - ux * 8 + uy * 4, y1 - uy * 8 - ux * 4); ctx.closePath(); ctx.fill();
        ctx.font = "500 11px 'IBM Plex Mono', monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(label, x1 + ux * 12, y1 + uy * 12);
      }

      function draw() {
        ppx = Math.max(60, Math.min(W - 60, src.x)); ppy = Math.max(190, Math.min(H - 50, src.y));
        rot(s, Rm); var i, j;
        // floor disc under the pivot
        ctx.fillStyle = rgba(base, 0.05); ctx.strokeStyle = rgba(base, 0.22); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(ppx, ppy, LU * 0.78, LU * 0.78 * sE, 0, 0, TAU); ctx.fill(); ctx.stroke();
        // axis-tip trace (nutation cusps / loops)
        ctx.lineWidth = 1.6; ctx.lineCap = "round";
        var nt = trail.length / 3, ch = Math.max(1, Math.floor(nt / 8));
        for (var c = 0; c < nt - 1; c += ch) {
          ctx.strokeStyle = rgba(warm, 0.05 + 0.85 * (c / nt)); ctx.beginPath();
          for (j = c; j <= Math.min(c + ch, nt - 1); j++) { P(trail[3 * j], trail[3 * j + 1], trail[3 * j + 2]); if (j === c) ctx.moveTo(px_, py_); else ctx.lineTo(px_, py_); }
          ctx.stroke();
        }
        // solid of revolution, painter-sorted quads
        var quads = [], R = Rm, Lx = -0.4, Ly = -0.5, Lz = 0.75, ln = Math.sqrt(Lx * Lx + Ly * Ly + Lz * Lz); Lx /= ln; Ly /= ln; Lz /= ln;
        var vtx = [];
        for (var pi = 0; pi < prof.length; pi++) {
          var row = [];
          for (j = 0; j <= NS; j++) {
            var a = j / NS * TAU, bx = prof[pi][0] * Math.cos(a), by = prof[pi][0] * Math.sin(a), bz = prof[pi][1];
            row.push([R[0] * bx + R[1] * by + R[2] * bz, R[3] * bx + R[4] * by + R[5] * bz, R[6] * bx + R[7] * by + R[8] * bz]);
          }
          vtx.push(row);
        }
        for (var band = 0; band < prof.length - 1; band++) {
          for (j = 0; j < NS; j++) {
            var A = vtx[band][j], B = vtx[band][j + 1], C = vtx[band + 1][j + 1], D = vtx[band + 1][j];
            var ux = C[0] - A[0], uy = C[1] - A[1], uz = C[2] - A[2], vx = D[0] - B[0], vy = D[1] - B[1], vz = D[2] - B[2];
            var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
            nx /= nl; ny /= nl; nz /= nl;
            if (nx * 0 + ny * (-cE) + nz * sE < 0) { nx = -nx; ny = -ny; nz = -nz; }
            var dep = ((A[1] + C[1]) / 2) * cE - ((A[2] + C[2]) / 2) * sE;
            quads.push({ A: A, B: B, C: C, D: D, band: band, j: j, dep: dep, lit: Math.max(0, nx * Lx + ny * Ly + nz * Lz) });
          }
        }
        quads.sort(function (p, q) { return q.dep - p.dep; });
        for (i = 0; i < quads.length; i++) {
          var qd = quads[i], col;
          if (qd.band === 0) col = lerpC(base, accent, 0.45);
          else if (qd.band === 1) col = (qd.j % 2) ? warm : accent;
          else if (qd.band === 2) col = lerpC(accent, { r: 255, g: 255, b: 255 }, 0.25);
          else col = lerpC(base, accent, 0.25);
          var sh = 0.68 + 0.55 * qd.lit;
          ctx.fillStyle = "rgb(" + Math.min(255, Math.round(col.r * sh)) + "," + Math.min(255, Math.round(col.g * sh)) + "," + Math.min(255, Math.round(col.b * sh)) + ")";
          ctx.strokeStyle = "rgba(255,255,255,0.16)"; ctx.lineWidth = 0.6;
          ctx.beginPath(); P(qd.A[0], qd.A[1], qd.A[2]); ctx.moveTo(px_, py_);
          P(qd.B[0], qd.B[1], qd.B[2]); ctx.lineTo(px_, py_); P(qd.C[0], qd.C[1], qd.C[2]); ctx.lineTo(px_, py_);
          P(qd.D[0], qd.D[1], qd.D[2]); ctx.lineTo(px_, py_); ctx.closePath(); ctx.fill(); ctx.stroke();
        }
        // ω and L (≈ along the axis; their difference is the nutation), and mg
        var w1 = s[4], w2 = s[5], w3 = s[6], wl = Math.sqrt(w1 * w1 + w2 * w2 + w3 * w3) || 1;
        var Wx = R[0] * w1 + R[1] * w2 + R[2] * w3, Wy = R[3] * w1 + R[4] * w2 + R[5] * w3, Wz = R[6] * w1 + R[7] * w2 + R[8] * w3;
        var l1 = I1 * w1, l2 = I1 * w2, l3 = I3 * w3, Ll = Math.sqrt(l1 * l1 + l2 * l2 + l3 * l3) || 1;
        var Lxw = R[0] * l1 + R[1] * l2 + R[2] * l3, Lyw = R[3] * l1 + R[4] * l2 + R[5] * l3, Lzw = R[6] * l1 + R[7] * l2 + R[8] * l3;
        var sw = 2.2 * wl / W3 / wl, sl = 2.0 * Ll / (I3 * W3) / Ll;
        arrow(Wx * sw * 0.9, Wy * sw * 0.9, Wz * sw * 0.9, rgba(accent, 0.95), "ω");
        arrow(Lxw * sl * 1.15, Lyw * sl * 1.15, Lzw * sl * 1.15, rgba(warm, 0.95), "L");
        // gravity at the COM
        P(R[2] * LC, R[5] * LC, R[8] * LC); var gx = px_, gy = py_;
        ctx.strokeStyle = rgba(base, 0.55); ctx.fillStyle = rgba(base, 0.55); ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + 46); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(gx, gy + 52); ctx.lineTo(gx - 4, gy + 44); ctx.lineTo(gx + 4, gy + 44); ctx.closePath(); ctx.fill();
        ctx.font = "500 11px 'IBM Plex Mono', monospace"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText("mg", gx + 7, gy + 40);
        // the pivot you hold
        ctx.fillStyle = rgba(base, 0.85); ctx.beginPath(); ctx.arc(ppx, ppy, 3.2, 0, TAU); ctx.fill();
        ctx.strokeStyle = rgba(accent, 0.8); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ppx, ppy, 9, 0, TAU); ctx.stroke();
      }
      return { build: build, step: step, draw: draw,
        caption: "Live · you hold the pivot of a Lagrange top — jerk it to excite nutation" };
    }

    /* ---------------------------------------------------------------
       MODEL 7 · INVERTED PENDULUM — you drive the cart, balance the rod
       Planar pendulum on a horizontal rail, ℓ = 190 px, ω₀ = √(g/ℓ) = 2.9 s⁻¹
       (e-folding time 1/ω₀ ≈ 0.35 s, like balancing a broom):
         θ̈ = (g/ℓ) sin θ − (a/ℓ) cos θ − c θ̇        (θ from the upright)
       where a is the cart's acceleration. The cart follows your cursor
       through a critically-damped servo (bounded acceleration). The upright
       is a saddle of the linearization: λ = ±ω₀. Away from the cursor an
       autopilot balances it with a = g(K₁θ + K₂θ̇/ω₀), K₁ > 1.
       --------------------------------------------------------------- */
    function pendulumSim() {
      var L = 190, W0 = 2.9, G = W0 * W0 * L, WC = 22, CD = 0.12, THF = 1.25;
      var railY = 0, xc = 0, x = 0, v = 0, th = 0.03, w = 0, tBal = 0, best = 0, fallT = 0, auto = true, wasActive = false, t = 0;
      var trail = [], phase = [], ptsB = [];

      function reset(px) {
        x = px; v = 0; th = (Math.random() < 0.5 ? -1 : 1) * (0.03 + Math.random() * 0.03); w = 0;
        tBal = 0; fallT = 0; trail = []; phase = [];
      }
      function build() {
        var narrow = W < 700;
        L = narrow ? 130 : 190; G = W0 * W0 * L;
        railY = Math.min(H * (narrow ? 0.5 : 0.6), 620); xc = W * (narrow ? 0.5 : 0.62);
        reset(xc); auto = true; wasActive = false; t = 0;
      }
      function clamp(a, lo, hi) { return a < lo ? lo : a > hi ? hi : a; }
      function accTheta(thv, wv, a) { return (G / L) * Math.sin(thv) - (a / L) * Math.cos(thv) - CD * wv; }

      function step() {
        var dt = 1 / 60, i;
        t += dt;
        if (pointer.active && !wasActive) { reset(clamp(pointer.x, 70, W - 70)); }
        if (!pointer.active && wasActive) { reset(x); }
        wasActive = pointer.active; auto = !pointer.active;
        for (i = 0; i < 6; i++) {
          var h = dt / 6, a;
          if (fallT > 0) a = 0.0; else if (!auto) a = WC * WC * (clamp(pointer.x, 70, W - 70) - x) - 2 * WC * v;
          else {
            var tgt = xc + 130 * Math.sin(t * 0.45);
            var thr = clamp(-0.0009 * (x - tgt) - 0.0007 * v, -0.14, 0.14);
            a = G * (3.2 * (th - thr) + 2.4 * w / W0);
          }
          a = clamp(a, -4.5 * G, 4.5 * G);
          if (fallT > 0) { a = WC * WC * (clamp(auto ? xc : pointer.x, 70, W - 70) - x) - 2 * WC * v; a = clamp(a, -4.5 * G, 4.5 * G); }
          // cart (kinematic servo) and pendulum, RK4 on (θ, ω) with cart acceleration a held over the substep
          var k1t = w, k1w = accTheta(th, w, a);
          var k2t = w + 0.5 * h * k1w, k2w = accTheta(th + 0.5 * h * k1t, w + 0.5 * h * k1w, a);
          var k3t = w + 0.5 * h * k2w, k3w = accTheta(th + 0.5 * h * k2t, w + 0.5 * h * k2w, a);
          var k4t = w + h * k3w, k4w = accTheta(th + h * k3t, w + h * k3w, a);
          th += h / 6 * (k1t + 2 * k2t + 2 * k3t + k4t); w += h / 6 * (k1w + 2 * k2w + 2 * k3w + k4w);
          v += a * h; x += v * h;
          if (x < 50) { x = 50; v = 0; } if (x > W - 50) { x = W - 50; v = 0; }
        }
        if (th > Math.PI) th -= 2 * Math.PI; if (th < -Math.PI) th += 2 * Math.PI;
        if (fallT > 0) { fallT += dt; if (fallT > 1.6) reset(x); }
        else {
          tBal += dt; if (!auto && tBal > best) best = tBal;
          if (Math.abs(th) > THF) { fallT = dt; }
        }
        trail.push(x + L * Math.sin(th), railY - L * Math.cos(th)); if (trail.length > 160) trail.splice(0, 2);
        phase.push(th, w); if (phase.length > 360) phase.splice(0, 2);
      }

      function draw() {
        var i, bx = x + L * Math.sin(th), by = railY - L * Math.cos(th), lean = Math.min(1, Math.abs(th) / 0.45);
        // rail
        ctx.strokeStyle = rgba(base, dark ? 0.35 : 0.3); ctx.lineWidth = 2; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(40, railY + 17); ctx.lineTo(W - 40, railY + 17); ctx.stroke();
        ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(40, railY + 9); ctx.lineTo(40, railY + 25); ctx.moveTo(W - 40, railY + 9); ctx.lineTo(W - 40, railY + 25); ctx.stroke();
        // the unstable equilibrium: upright line and target ring
        ctx.setLineDash([4, 5]); ctx.strokeStyle = rgba(accent, 0.4); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x, railY); ctx.lineTo(x, railY - L - 34); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, railY - L, 21, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = rgba(base, 0.5); ctx.font = "500 9.5px 'IBM Plex Mono', monospace"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText("unstable equilibrium", x + 27, railY - L - 4);
        // bob trail
        ctx.lineWidth = 1.6; var nt = trail.length / 2, ch = Math.max(1, Math.floor(nt / 6));
        for (i = 0; i < nt - 1; i += ch) {
          ctx.strokeStyle = rgba(warm, 0.04 + 0.5 * (i / nt)); ctx.beginPath();
          for (var j = i; j <= Math.min(i + ch, nt - 1); j++) { if (j === i) ctx.moveTo(trail[2 * j], trail[2 * j + 1]); else ctx.lineTo(trail[2 * j], trail[2 * j + 1]); }
          ctx.stroke();
        }
        // angle arc
        ctx.strokeStyle = rgba(warm, 0.8); ctx.lineWidth = 1.6; ctx.beginPath();
        ctx.arc(x, railY, 44, -Math.PI / 2, -Math.PI / 2 + th, th < 0); ctx.stroke();
        // rod
        ctx.strokeStyle = rgba(base, dark ? 0.85 : 0.8); ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(x, railY); ctx.lineTo(bx, by); ctx.stroke();
        // bob
        var col = lerpC(accent, warm, lean), g = ctx.createRadialGradient(bx, by, 4, bx, by, 38);
        g.addColorStop(0, rgba(col, 0.35)); g.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, 38, 0, TAU); ctx.fill();
        var g2 = ctx.createRadialGradient(bx - 5, by - 6, 2, bx, by, 16);
        g2.addColorStop(0, rgba(lerpC(col, { r: 255, g: 255, b: 255 }, 0.5), 1)); g2.addColorStop(1, rgba(col, 1));
        ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(bx, by, 15, 0, TAU); ctx.fill();
        // cart
        ctx.fillStyle = rgba(accent, 1); ctx.beginPath();
        ctx.moveTo(x - 30, railY - 11); ctx.lineTo(x + 30, railY - 11); ctx.lineTo(x + 36, railY - 5); ctx.lineTo(x + 36, railY + 7); ctx.lineTo(x - 36, railY + 7); ctx.lineTo(x - 36, railY - 5); ctx.closePath(); ctx.fill();
        ctx.fillStyle = rgba(base, 0.9); ctx.beginPath(); ctx.arc(x - 20, railY + 12, 5, 0, TAU); ctx.arc(x + 20, railY + 12, 5, 0, TAU); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x, railY, 3.4, 0, TAU); ctx.fill();
        // status line
        ctx.textAlign = "center"; ctx.font = "500 11px 'IBM Plex Mono', monospace";
        var msg, mc = rgba(base, 0.6);
        if (fallT > 0) { msg = "fell at " + tBal.toFixed(1) + " s — resetting"; mc = rgba(warm, 0.95); }
        else if (auto) { msg = "autopilot balancing — move your cursor to take over"; mc = rgba(accent, 0.8); }
        else msg = "balanced " + tBal.toFixed(1) + " s   ·   best " + best.toFixed(1) + " s";
        ctx.fillStyle = mc; ctx.fillText(msg, x, railY + 42);
        // phase portrait (θ, θ̇): the upright is a saddle with manifolds θ̇ = ±ω₀θ
        if (W >= 700) {
          var bw = 150, bh = 150, bx0 = W - bw - 40, by0 = 92, sx = bw / 2 / 1.4, sy = bh / 2 / 6.5, cx = bx0 + bw / 2, cy = by0 + bh / 2;
          ctx.fillStyle = rgba(base, dark ? 0.06 : 0.04); ctx.strokeStyle = rgba(base, 0.25); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.rect(bx0, by0, bw, bh); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(bx0, cy); ctx.lineTo(bx0 + bw, cy); ctx.moveTo(cx, by0); ctx.lineTo(cx, by0 + bh); ctx.strokeStyle = rgba(base, 0.18); ctx.stroke();
          ctx.lineWidth = 1.4; ctx.strokeStyle = rgba(accent, 0.7); ctx.beginPath(); ctx.moveTo(cx - 1.4 * sx, cy + 1.4 * W0 * sy); ctx.lineTo(cx + 1.4 * sx, cy - 1.4 * W0 * sy); ctx.stroke();
          ctx.strokeStyle = rgba(warm, 0.7); ctx.beginPath(); ctx.moveTo(cx - 1.4 * sx, cy - 1.4 * W0 * sy); ctx.lineTo(cx + 1.4 * sx, cy + 1.4 * W0 * sy); ctx.stroke();
          ctx.strokeStyle = rgba(base, 0.7); ctx.lineWidth = 1.2; ctx.beginPath();
          for (i = 0; i < phase.length; i += 2) { var qx = clamp(cx + phase[i] * sx, bx0, bx0 + bw), qy = clamp(cy - phase[i + 1] * sy, by0, by0 + bh); if (i === 0) ctx.moveTo(qx, qy); else ctx.lineTo(qx, qy); }
          ctx.stroke();
          ctx.fillStyle = rgba(accent, 1); ctx.beginPath(); ctx.arc(clamp(cx + th * sx, bx0, bx0 + bw), clamp(cy - w * sy, by0, by0 + bh), 3.6, 0, TAU); ctx.fill();
          ctx.fillStyle = rgba(base, 0.6); ctx.font = "500 9.5px 'IBM Plex Mono', monospace"; ctx.textAlign = "left";
          ctx.fillText("phase plane  (θ, θ̇)", bx0, by0 - 8); ctx.fillText("saddle", cx + 5, cy + 11);
          ctx.fillStyle = rgba(accent, 0.9); ctx.fillText("unstable", bx0 + bw - 46, by0 + 12); ctx.fillStyle = rgba(warm, 0.9); ctx.fillText("stable", bx0 + bw - 40, by0 + bh - 8);
        }
      }
      return { build: build, step: step, draw: draw,
        caption: "Live · you drive the cart — keep the rod balanced on its unstable equilibrium" };
    }

    /* ---------------------------------------------------------------
       MODELS 8–9 · STATIC — no simulation at all, drawn once
         static : the plain page (CSS grid background only)
         mesh   : a triangulated finite-element-style mesh, lightly jittered
       `still` tells the host to skip the animation loop for these.
       --------------------------------------------------------------- */
    function staticSim() {
      /* a lit height-field in perspective: z = Σ Gaussian bumps + a gentle swell.
         Quads are painter-sorted (far → near), shaded by n·l, tinted by height,
         and faded with distance. Drawn once. */
      var F = 1000, DZ = 1000, EL = 36 * Math.PI / 180, sE = Math.sin(EL), cE = Math.cos(EL);
      var cx0 = 0, cy0 = 0;
      function height(x, y) {
        return 150 * Math.exp(-((x - 120) * (x - 120) + (y - 80) * (y - 80)) / (2 * 170 * 170))
             + 95 * Math.exp(-((x + 300) * (x + 300) + (y - 160) * (y - 160)) / (2 * 135 * 135))
             - 75 * Math.exp(-((x - 360) * (x - 360) + (y + 110) * (y + 110)) / (2 * 105 * 105))
             + 55 * Math.exp(-((x - 20) * (x - 20) + (y - 420) * (y - 420)) / (2 * 190 * 190))
             + 12 * Math.sin(x / 75) * Math.cos(y / 95);
      }
      function draw() {
        var narrow = W < 700, st = narrow ? 30 : 26;
        cx0 = W * (narrow ? 0.55 : 0.64); cy0 = H * 0.58;
        var gx = W * 1.25, y0 = -H * 0.55, y1 = H * 1.7;
        var nx = Math.ceil(2 * gx / st), ny = Math.ceil((y1 - y0) / st), G = nx + 1, i, j, n;
        var X = new Float32Array(G * (ny + 1)), Y = new Float32Array(G * (ny + 1)), Z = new Float32Array(G * (ny + 1));
        var PX = new Float32Array(G * (ny + 1)), PY = new Float32Array(G * (ny + 1)), DP = new Float32Array(G * (ny + 1));
        for (j = 0; j <= ny; j++) for (i = 0; i <= nx; i++) {
          n = j * G + i; var x = -gx + i * st, y = y0 + j * st, z = height(x, y);
          X[n] = x; Y[n] = y; Z[n] = z;
          var dep = DZ + y * cE - z * sE, k = F / dep;
          PX[n] = cx0 + x * k; PY[n] = cy0 - (y * sE + z * cE) * k; DP[n] = dep;
        }
        var Lx = -0.5, Ly = -0.35, Lz = 0.8, ln = Math.sqrt(Lx * Lx + Ly * Ly + Lz * Lz); Lx /= ln; Ly /= ln; Lz /= ln;
        for (j = ny - 1; j >= 0; j--) {                                   // far rows first
          for (i = 0; i < nx; i++) {
            n = j * G + i;
            var xs = [PX[n], PX[n + 1], PX[n + G + 1], PX[n + G]], ys = [PY[n], PY[n + 1], PY[n + G + 1], PY[n + G]];
            var minx = Math.min(xs[0], xs[1], xs[2], xs[3]), maxx = Math.max(xs[0], xs[1], xs[2], xs[3]);
            var miny = Math.min(ys[0], ys[1], ys[2], ys[3]), maxy = Math.max(ys[0], ys[1], ys[2], ys[3]);
            if (maxx < 0 || minx > W || maxy < 0 || miny > H) continue;
            var zx = (Z[n + 1] - Z[n] + Z[n + G + 1] - Z[n + G]) / (2 * st), zy = (Z[n + G] - Z[n] + Z[n + G + 1] - Z[n + 1]) / (2 * st);
            var nl = Math.sqrt(zx * zx + zy * zy + 1), lam = Math.max(0, (-zx * Lx - zy * Ly + Lz) / nl);
            var zc = (Z[n] + Z[n + 1] + Z[n + G] + Z[n + G + 1]) / 4, t = Math.max(0, Math.min(1, (zc + 75) / 225));
            var fog = Math.max(0.15, Math.min(1, 1.25 - DP[n] / 1900));
            var col = lerpC(base, accent, Math.pow(t, 0.8));
            ctx.fillStyle = rgba(col, (0.035 + 0.27 * lam + 0.22 * t) * fog);
            ctx.strokeStyle = rgba(base, (dark ? 0.17 : 0.14) * fog);
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(xs[0], ys[0]); ctx.lineTo(xs[1], ys[1]); ctx.lineTo(xs[2], ys[2]); ctx.lineTo(xs[3], ys[3]); ctx.closePath();
            ctx.fill(); ctx.stroke();
          }
        }
      }
      return { still: true, build: function () {}, step: function () {}, draw: draw,
        caption: "Static · 3D surface — no simulation" };
    }
    function meshSim() {
      var sp = 46;
      function jit(i, j, k) { var h = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453; return h - Math.floor(h) - 0.5; }
      function draw() {
        sp = W < 700 ? 36 : 46;
        var rh = sp * 0.866, cols = Math.ceil(W / sp) + 2, rows = Math.ceil(H / rh) + 2, i, j, nodes = [];
        for (j = 0; j < rows; j++) {
          nodes.push([]);
          for (i = 0; i < cols; i++) {
            nodes[j].push([(i - 1) * sp + (j % 2 ? sp / 2 : 0) + jit(i, j, 1) * sp * 0.22, (j - 1) * rh + jit(i, j, 2) * sp * 0.22]);
          }
        }
        var E = new Path2D(), D = new Path2D();
        function seg(path, a, b) { path.moveTo(a[0], a[1]); path.lineTo(b[0], b[1]); }
        for (j = 0; j < rows; j++) for (i = 0; i < cols; i++) {
          var a = nodes[j][i];
          if (i < cols - 1) seg(E, a, nodes[j][i + 1]);
          if (j < rows - 1) {
            var o = j % 2 ? 0 : -1, dn = nodes[j + 1];
            if (i + o >= 0 && i + o < cols) seg(E, a, dn[i + o]);
            if (i + o + 1 >= 0 && i + o + 1 < cols) seg(E, a, dn[i + o + 1]);
          }
          seg(D, [a[0] - 1.4, a[1]], [a[0] + 1.4, a[1]]);
        }
        ctx.lineWidth = 1; ctx.lineCap = "butt"; ctx.strokeStyle = rgba(base, baseAlpha * 1.7); ctx.stroke(E);
        ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.strokeStyle = rgba(accent, dark ? 0.45 : 0.4); ctx.stroke(D);
      }
      return { still: true, build: function () {}, step: function () {}, draw: draw,
        caption: "Static · triangulated mesh — no simulation" };
    }

    /* ---------------------------------------------------------------
       MODEL 10 · SOAP FILM — the Static surface, pulled by the cursor
       A soap film has zero mean curvature (∇·(∇h/√(1+|∇h|²)) = 0 ≈ ∇²h = 0).
       Pulled at one point inside a ring of radius R it takes the harmonic
       shape h = h₀(x,y) − D·ln(R/ρ)/ln(R/a)·(1 − r²/R²), ρ = √(r²+a²).
       Same lit height-field as Static, drawn as a ray-marched texture plus
       a light line mesh, so it is cheap enough to move with the cursor.
       --------------------------------------------------------------- */
    function filmSim() {
      var F = 1000, DZ = 1000, EL = 36 * Math.PI / 180, sE = Math.sin(EL), cE = Math.cos(EL);
      var HC = 28, RS = 8, R = 300, AC = 26, D0 = 150, MARG = 170;
      var cx0 = 0, cy0 = 0, gx = 0, y0 = 0, y1 = 0, nx = 0, ny = 0, G = 0;
      var hs, hd, hxs, hys, hx, hy, px, py, cw = 0, ch = 0, mapU, mapV, mapWX, mapWY, baseImg, offc, offx, offimg;
      var xc = 0, yc = 300, prev = null, sx_ = 0, sy_ = 0, apexZ = 0;

      function heightS(x, y) {
        return 150 * Math.exp(-((x - 120) * (x - 120) + (y - 80) * (y - 80)) / (2 * 170 * 170))
             + 95 * Math.exp(-((x + 300) * (x + 300) + (y - 160) * (y - 160)) / (2 * 135 * 135))
             - 75 * Math.exp(-((x - 360) * (x - 360) + (y + 110) * (y + 110)) / (2 * 105 * 105))
             + 55 * Math.exp(-((x - 20) * (x - 20) + (y - 420) * (y - 420)) / (2 * 190 * 190))
             + 12 * Math.sin(x / 75) * Math.cos(y / 95);
      }
      function proj(x, y, z) {
        var dep = DZ + y * cE - z * sE, k = F / dep;
        sx_ = cx0 + x * k; sy_ = cy0 - (y * sE + z * cE) * k;
      }
      function unproj(sx, sy, z, out) {
        var u = (sx - cx0) / F, w = (cy0 - sy) / F;
        var y = (w * (DZ - z * sE) - z * cE) / (sE - w * cE);
        out.x = u * (DZ + y * cE - z * sE); out.y = y;
      }
      function clamp(a, lo, hi) { return a < lo ? lo : a > hi ? hi : a; }
      function bil(f, gi, gj) {
        var i = gi | 0, j = gj | 0, fx = gi - i, fy = gj - j, m = j * G + i;
        return (f[m] * (1 - fx) + f[m + 1] * fx) * (1 - fy) + (f[m + G] * (1 - fx) + f[m + G + 1] * fx) * fy;
      }

      function shade(h, hx_, hy_, dep, d, o, m) {
        var nl = Math.sqrt(hx_ * hx_ + hy_ * hy_ + 1), lam = (-hx_ * -0.5 - hy_ * -0.35 + 0.8) / nl / 1.0;
        lam = lam < 0 ? 0 : lam;
        var t = (h + 75) / 225; t = t < 0 ? 0 : t > 1 ? 1 : t;
        var fog = 1.25 - dep / 1900; fog = fog < 0.15 ? 0.15 : fog > 1 ? 1 : fog; var tt = Math.pow(t, 0.8);
        d[o] = base.r + (accent.r - base.r) * tt; d[o + 1] = base.g + (accent.g - base.g) * tt; d[o + 2] = base.b + (accent.b - base.b) * tt;
        d[o + 3] = 255 * (0.035 + 0.27 * lam + 0.22 * t) * fog * m;
      }
      function march(q, U, V, harr, hxa, hya, d) {
        var o = 4 * q, z = 0, x = 0, y = 0, gi, gj, it;
        for (it = 0; it < 3; it++) {
          y = (V * (DZ - z * sE) - z * cE) / (sE - V * cE); x = U * (DZ + y * cE - z * sE);
          gi = (x + gx) / HC; gj = (y - y0) / HC;
          if (gi < 1 || gi > nx - 2 || gj < 1 || gj > ny - 2) { d[o + 3] = 0; return; }
          z = bil(harr, gi, gj);
        }
        var edge = (ny - 3 - gj) / 8; edge = edge < 0 ? 0 : edge > 1 ? 1 : edge;                  // soft far boundary
        shade(z, bil(hxa, gi, gj), bil(hya, gi, gj), DZ + y * cE - z * sE, d, o, edge);
      }

      function build() {
        var narrow = W < 700, i, j, k;
        cx0 = W * (narrow ? 0.55 : 0.64); cy0 = H * 0.58; gx = W * 1.25; y0 = -H * 0.55; y1 = H * 1.7;
        nx = Math.ceil(2 * gx / HC); ny = Math.ceil((y1 - y0) / HC); G = nx + 1;
        var n = G * (ny + 1);
        hs = new Float32Array(n); hd = new Float32Array(n); hxs = new Float32Array(n); hys = new Float32Array(n); hx = new Float32Array(n); hy = new Float32Array(n);
        px = new Float32Array(n); py = new Float32Array(n);
        for (j = 0; j <= ny; j++) for (i = 0; i <= nx; i++) hs[j * G + i] = heightS(-gx + i * HC, y0 + j * HC);
        hd.set(hs);
        for (j = 1; j < ny; j++) for (i = 1; i < nx; i++) { k = j * G + i; hxs[k] = (hs[k + 1] - hs[k - 1]) / (2 * HC); hys[k] = (hs[k + G] - hs[k - G]) / (2 * HC); }
        hx.set(hxs); hy.set(hys);
        cw = Math.ceil(W / RS); ch = Math.ceil(H / RS);
        mapU = new Float32Array(cw * ch); mapV = new Float32Array(cw * ch); mapWX = new Float32Array(cw * ch); mapWY = new Float32Array(cw * ch);
        offc = document.createElement("canvas"); offc.width = cw; offc.height = ch; offx = offc.getContext("2d"); offimg = offx.createImageData(cw, ch);
        for (j = 0; j < ch; j++) for (i = 0; i < cw; i++) {
          var q = j * cw + i; mapU[q] = ((i + 0.5) * RS - cx0) / F; mapV[q] = (cy0 - (j + 0.5) * RS) / F;
        }
        paintBase();
        xc = 120; yc = 260; prev = null;
      }
      function paintBase() {
        var d = offimg.data, q, tmp = { x: 0, y: 0 };
        for (q = 0; q < cw * ch; q++) {
          march(q, mapU[q], mapV[q], hs, hxs, hys, d);
          // remember where the undeformed surface sits, to know which pixels the film can touch
          var z = 0, y, x, it;
          for (it = 0; it < 3; it++) { y = (mapV[q] * (DZ - z * sE) - z * cE) / (sE - mapV[q] * cE); x = mapU[q] * (DZ + y * cE - z * sE); var gi = (x + gx) / HC, gj = (y - y0) / HC; if (gi < 1 || gi > nx - 2 || gj < 1 || gj > ny - 2) break; z = bil(hs, gi, gj); }
          mapWX[q] = x; mapWY[q] = y;
        }
        baseImg = new Uint8ClampedArray(d);
      }

      function step() {
        var tg = { x: 0, y: 0 }, i, j, k;
        unproj(src.x, src.y, heightS(xc, yc) - D0 * 0.6, tg);
        xc = clamp(tg.x, -gx * 0.9, gx * 0.9); yc = clamp(tg.y, y0 * 0.7, y1 * 0.7);
        // restore the previous dirty rectangle, then apply the film dip around the cursor
        var span = Math.ceil(R / HC) + 2, ci = Math.round((xc + gx) / HC), cj = Math.round((yc - y0) / HC);
        var i0 = Math.max(1, ci - span), i1 = Math.min(nx - 1, ci + span), j0 = Math.max(1, cj - span), j1 = Math.min(ny - 1, cj + span);
        if (prev) for (j = prev[2]; j <= prev[3]; j++) for (i = prev[0]; i <= prev[1]; i++) { k = j * G + i; hd[k] = hs[k]; hx[k] = hxs[k]; hy[k] = hys[k]; }
        var lnr = Math.log(R / AC);
        for (j = j0; j <= j1; j++) for (i = i0; i <= i1; i++) {
          k = j * G + i; var X = -gx + i * HC - xc, Y = y0 + j * HC - yc, r2 = X * X + Y * Y;
          if (r2 >= R * R) continue;
          var rho = Math.sqrt(r2 + AC * AC), v = Math.log(R / rho) / lnr, tp = 1 - r2 / (R * R);
          hd[k] = hs[k] - D0 * v * tp;
        }
        for (j = j0; j <= j1; j++) for (i = i0; i <= i1; i++) { k = j * G + i; hx[k] = (hd[k + 1] - hd[k - 1]) / (2 * HC); hy[k] = (hd[k + G] - hd[k - G]) / (2 * HC); }
        prev = [i0, i1, j0, j1];
        apexZ = heightS(xc, yc) - D0;
      }

      function draw() {
        var d = offimg.data, q, i, j, k, n;
        d.set(baseImg);
        var lim = (R + MARG) * (R + MARG);
        for (q = 0; q < cw * ch; q++) {
          var dx = mapWX[q] - xc, dy = mapWY[q] - yc;
          if (dx * dx + dy * dy < lim) march(q, mapU[q], mapV[q], hd, hx, hy, d);
        }
        offx.putImageData(offimg, 0, 0);
        ctx.imageSmoothingEnabled = true; ctx.drawImage(offc, 0, 0, cw, ch, 0, 0, cw * RS, ch * RS);
        // fine line mesh on the deformed film, in four depth bands
        for (j = 0; j <= ny; j++) for (i = 0; i <= nx; i++) { k = j * G + i; proj(-gx + i * HC, y0 + j * HC, hd[k]); px[k] = sx_; py[k] = sy_; }
        var NBd = 4, bands = [], b, P;
        for (b = 0; b < NBd; b++) bands.push(new Path2D());
        for (j = 0; j <= ny; j += 1) {
          var yy = y0 + j * HC, fog = 1.25 - (DZ + yy * cE) / 1900; fog = fog < 0.15 ? 0.15 : fog > 1 ? 1 : fog;
          P = bands[Math.min(NBd - 1, Math.floor((1 - (fog - 0.15) / 0.85) * NBd))];
          k = j * G; P.moveTo(px[k], py[k]); for (i = 1; i <= nx; i++) { k = j * G + i; P.lineTo(px[k], py[k]); }
        }
        for (i = 0; i <= nx; i++) {
          var cur = -1, Pc = null;
          for (j = 0; j <= ny; j++) {
            k = j * G + i; var y2 = y0 + j * HC, f2 = 1.25 - (DZ + y2 * cE) / 1900; f2 = f2 < 0.15 ? 0.15 : f2 > 1 ? 1 : f2;
            var bd = Math.min(NBd - 1, Math.floor((1 - (f2 - 0.15) / 0.85) * NBd));
            if (bd !== cur) { Pc = bands[bd]; if (j > 0) { Pc.moveTo(px[k - G], py[k - G]); Pc.lineTo(px[k], py[k]); } else Pc.moveTo(px[k], py[k]); cur = bd; }
            else Pc.lineTo(px[k], py[k]);
          }
        }
        ctx.lineWidth = 0.7; ctx.lineCap = "butt"; ctx.lineJoin = "round";
        for (b = 0; b < NBd; b++) { ctx.strokeStyle = rgba(base, (dark ? 0.2 : 0.16) * (1 - b * 0.22)); ctx.stroke(bands[b]); }
        // the finger pulling the film
        proj(xc, yc, apexZ); var ax = sx_, ay = sy_; proj(xc, yc, apexZ + 120); var tx = sx_, ty = sy_;
        ctx.strokeStyle = rgba(accent, 0.75); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
        var g = ctx.createRadialGradient(ax, ay, 1, ax, ay, 20); g.addColorStop(0, rgba(accent, 0.45)); g.addColorStop(1, rgba(accent, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ax, ay, 20, 0, TAU); ctx.fill();
        ctx.fillStyle = rgba(accent, 1); ctx.beginPath(); ctx.arc(ax, ay, 4.5, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(tx, ty, 3, 0, TAU); ctx.fill();
      }
      return { build: build, step: step, draw: draw,
        caption: "Live · a soap film pulled by your cursor — harmonic (ln r) shape" };
    }

    /* ---------------------------------------------------------------
       equations behind the canvas (KaTeX, loaded lazily). Each model has
       a dim layer and a bright copy revealed by a mask around the source.
       --------------------------------------------------------------- */
    var EQ = {
      gr: [
        ["G_{\\mu\\nu}+\\Lambda g_{\\mu\\nu}=\\frac{8\\pi G}{c^{4}}\\,T_{\\mu\\nu}", 44, 5, 1.7],
        ["\\frac{d^{2}x^{\\mu}}{d\\tau^{2}}+\\Gamma^{\\mu}{}_{\\alpha\\beta}\\frac{dx^{\\alpha}}{d\\tau}\\frac{dx^{\\beta}}{d\\tau}=0", 6, 21, 1.4],
        ["\\Gamma^{\\lambda}{}_{\\mu\\nu}=\\tfrac12 g^{\\lambda\\sigma}\\left(\\partial_{\\mu}g_{\\sigma\\nu}+\\partial_{\\nu}g_{\\sigma\\mu}-\\partial_{\\sigma}g_{\\mu\\nu}\\right)", 38, 17, 1.3, 1],
        ["R^{\\rho}{}_{\\sigma\\mu\\nu}=\\partial_{\\mu}\\Gamma^{\\rho}{}_{\\nu\\sigma}-\\partial_{\\nu}\\Gamma^{\\rho}{}_{\\mu\\sigma}+\\Gamma^{\\rho}{}_{\\mu\\lambda}\\Gamma^{\\lambda}{}_{\\nu\\sigma}-\\Gamma^{\\rho}{}_{\\nu\\lambda}\\Gamma^{\\lambda}{}_{\\mu\\sigma}", 22, 36, 1.2, 1],
        ["ds^{2}=-\\left(1-\\frac{r_s}{r}\\right)c^{2}dt^{2}+\\left(1-\\frac{r_s}{r}\\right)^{-1}dr^{2}+r^{2}d\\Omega^{2}", 30, 52, 1.35, 1],
        ["\\nabla_{\\mu}G^{\\mu\\nu}=0", 76, 28, 1.5],
        ["\\frac{d^{2}u}{d\\varphi^{2}}+u=\\frac{GM}{L^{2}}+\\frac{3GM}{c^{2}}u^{2}", 8, 66, 1.4],
        ["\\Delta\\varphi=\\frac{6\\pi GM}{c^{2}a(1-e^{2})}", 62, 66, 1.5],
        ["\\alpha=\\frac{4GM}{c^{2}b}", 82, 47, 1.6],
        ["g_{00}\\approx-\\left(1+\\frac{2\\Phi}{c^{2}}\\right),\\;\\nabla^{2}\\Phi=4\\pi G\\rho", 44, 80, 1.35, 1],
        ["T^{\\mu\\nu}=(\\rho+p)\\,u^{\\mu}u^{\\nu}+p\\,g^{\\mu\\nu}", 10, 90, 1.35]
      ],
      field: [
        ["\\nabla\\cdot\\mathbf{E}=\\rho/\\varepsilon_{0}", 48, 6, 1.7],
        ["\\nabla\\times\\mathbf{E}=\\mathbf{0},\\quad\\mathbf{E}=-\\nabla\\varphi", 8, 20, 1.4],
        ["\\nabla^{2}\\varphi=-\\rho/\\varepsilon_{0}", 62, 18, 1.5],
        ["\\partial_{\\mu}F^{\\mu\\nu}=\\mu_{0}J^{\\nu}", 30, 31, 1.5],
        ["F_{\\mu\\nu}=\\partial_{\\mu}A_{\\nu}-\\partial_{\\nu}A_{\\mu}", 66, 38, 1.4],
        ["T_{ij}=\\varepsilon_{0}\\left(E_{i}E_{j}-\\tfrac12\\delta_{ij}E^{2}\\right)", 10, 48, 1.4],
        ["\\sigma=\\varepsilon_{0}\\,\\mathbf{E}\\cdot\\hat{\\mathbf{n}},\\quad\\varphi\\big|_{\\partial\\Omega}=\\text{const}", 40, 62, 1.4, 1],
        ["\\varphi=-\\frac{\\lambda}{2\\pi\\varepsilon_{0}}\\ln r", 74, 60, 1.5],
        ["q'=-q,\\quad\\mathbf{r}'=\\frac{R^{2}}{|\\mathbf{r}|^{2}}\\,\\mathbf{r}", 8, 74, 1.4],
        ["F^{\\mu\\nu}=\\begin{pmatrix}0&-E_x/c&-E_y/c&-E_z/c\\\\E_x/c&0&-B_z&B_y\\\\E_y/c&B_z&0&-B_x\\\\E_z/c&-B_y&B_x&0\\end{pmatrix}", 48, 82, 1.1, 1]
      ],
      magnet: [
        ["\\nabla\\cdot\\mathbf{B}=0", 46, 6, 1.7],
        ["\\nabla\\times\\mathbf{B}=\\mu_{0}\\mathbf{J}", 8, 20, 1.5],
        ["\\mathbf{B}(\\mathbf{r})=\\frac{\\mu_{0}}{4\\pi}\\,\\frac{3(\\mathbf{m}\\cdot\\hat{\\mathbf{r}})\\hat{\\mathbf{r}}-\\mathbf{m}}{r^{3}}", 44, 20, 1.5, 1],
        ["\\boldsymbol{\\tau}=\\mathbf{m}\\times\\mathbf{B}", 76, 32, 1.6],
        ["U=-\\mathbf{m}\\cdot\\mathbf{B},\\quad\\mathbf{F}=\\nabla(\\mathbf{m}\\cdot\\mathbf{B})", 12, 42, 1.4],
        ["\\partial_{\\mu}\\tilde F^{\\mu\\nu}=0", 56, 48, 1.5],
        ["\\mathbf{B}=\\nabla\\times\\mathbf{A}", 82, 62, 1.5],
        ["I\\ddot\\theta=-mB\\sin\\theta", 8, 62, 1.5],
        ["T_{ij}=\\frac{1}{\\mu_{0}}\\left(B_{i}B_{j}-\\tfrac12\\delta_{ij}B^{2}\\right)", 40, 72, 1.35, 1],
        ["\\mathbf{F}=q\\,\\mathbf{v}\\times\\mathbf{B}", 10, 86, 1.5],
        ["\\oint\\mathbf{B}\\cdot d\\mathbf{S}=0", 64, 88, 1.5]
      ],
      fluid: [
        ["\\nabla\\cdot\\mathbf{u}=0", 46, 6, 1.7],
        ["\\rho\\left(\\partial_{t}\\mathbf{u}+\\mathbf{u}\\cdot\\nabla\\mathbf{u}\\right)=-\\nabla p+\\mu\\nabla^{2}\\mathbf{u}", 30, 18, 1.4, 1],
        ["\\rho\\left(\\partial_{t}u_{i}+u_{j}\\partial_{j}u_{i}\\right)=\\partial_{j}\\sigma_{ij}", 8, 31, 1.35, 1],
        ["\\sigma_{ij}=-p\\,\\delta_{ij}+\\mu\\left(\\partial_{i}u_{j}+\\partial_{j}u_{i}\\right)", 44, 42, 1.4, 1],
        ["\\frac{\\partial\\omega}{\\partial t}+\\mathbf{u}\\cdot\\nabla\\omega=\\nu\\nabla^{2}\\omega", 8, 53, 1.4, 1],
        ["\\omega=\\partial_{x}v-\\partial_{y}u", 70, 30, 1.5],
        ["\\nabla^{2}p=-\\rho\\,\\partial_{i}u_{j}\\,\\partial_{j}u_{i}", 64, 62, 1.4],
        ["\\mathrm{Re}=\\frac{\\rho U D}{\\mu}", 14, 68, 1.6],
        ["\\mathrm{St}=\\frac{fD}{U}\\approx0.2", 44, 76, 1.5],
        ["F_{D}=\\tfrac12\\rho U^{2}C_{D}A", 70, 84, 1.5],
        ["u=\\partial_{y}\\psi,\\;v=-\\partial_{x}\\psi", 10, 88, 1.45]
      ],
      film: [
        ["\\nabla^{2}h=0", 48, 5, 1.8],
        ["\\nabla\\cdot\\left(\\frac{\\nabla h}{\\sqrt{1+|\\nabla h|^{2}}}\\right)=0", 8, 20, 1.45],
        ["\\mathcal{A}[h]=\\int_{\\Omega}\\sqrt{1+|\\nabla h|^{2}}\\,dA\\;\\to\\;\\min", 40, 32, 1.35, 1],
        ["\\Delta p=\\gamma\\left(\\frac{1}{R_{1}}+\\frac{1}{R_{2}}\\right)=2\\gamma H", 62, 44, 1.45],
        ["H=\\tfrac12(\\kappa_{1}+\\kappa_{2})=0", 8, 50, 1.6],
        ["h(r)=-\\frac{D\\ln(R/r)}{\\ln(R/a)}", 10, 66, 1.55],
        ["K=\\kappa_{1}\\kappa_{2}\\le0", 66, 62, 1.6],
        ["r=a\\cosh\\!\\left(z/a\\right)\\;\\text{(catenoid)}", 40, 76, 1.45],
        ["\\delta\\mathcal{A}=\\int 2H\\,\\delta n\\,dA=0", 12, 88, 1.5],
        ["g_{ij}=\\delta_{ij}+\\partial_{i}h\\,\\partial_{j}h", 62, 86, 1.45]
      ],
      pend: [
        ["\\ddot\\theta=\\frac{g}{\\ell}\\sin\\theta-\\frac{\\ddot{x}_{p}}{\\ell}\\cos\\theta", 46, 5, 1.6],
        ["\\mathcal{L}=\\tfrac12 m\\ell^{2}\\dot\\theta^{2}+m\\ell\\,\\dot{x}_{p}\\dot\\theta\\cos\\theta+mg\\ell\\cos\\theta", 8, 18, 1.4, 1],
        ["\\frac{d}{dt}\\frac{\\partial\\mathcal{L}}{\\partial\\dot\\theta}-\\frac{\\partial\\mathcal{L}}{\\partial\\theta}=0", 56, 22, 1.5],
        ["\\frac{d}{dt}\\begin{pmatrix}\\theta\\\\\\dot\\theta\\end{pmatrix}\\approx\\begin{pmatrix}0&1\\\\ \\omega_{0}^{2}&0\\end{pmatrix}\\begin{pmatrix}\\theta\\\\\\dot\\theta\\end{pmatrix}-\\begin{pmatrix}0\\\\ \\ddot{x}_{p}/\\ell\\end{pmatrix}", 30, 34, 1.3, 1],
        ["\\lambda_{\\pm}=\\pm\\omega_{0},\\quad\\omega_{0}=\\sqrt{g/\\ell}", 70, 46, 1.5],
        ["\\theta(t)\\sim\\theta_{0}\\,e^{\\omega_{0}t}", 8, 50, 1.6],
        ["\\ddot{x}_{p}=g\\left(K_{1}\\theta+K_{2}\\dot\\theta/\\omega_{0}\\right),\\; K_{1}>1", 40, 60, 1.45, 1],
        ["E=\\tfrac12 m\\ell^{2}\\dot\\theta^{2}+mg\\ell\\cos\\theta", 10, 70, 1.5],
        ["a^{2}\\Omega^{2}>2g\\ell\\;\\Rightarrow\\;\\text{Kapitza stabilization}", 44, 78, 1.35, 1],
        ["\\det\\begin{pmatrix}-\\lambda&1\\\\ \\omega_{0}^{2}&-\\lambda\\end{pmatrix}=\\lambda^{2}-\\omega_{0}^{2}=0", 10, 86, 1.4, 1],
        ["\\tau=1/\\omega_{0}\\approx0.35\\,\\mathrm{s}", 66, 90, 1.5]
      ],
      top: [
        ["\\mathbf{I}\\,\\dot{\\boldsymbol{\\omega}}+\\boldsymbol{\\omega}\\times\\mathbf{I}\\boldsymbol{\\omega}=\\boldsymbol{\\tau}", 46, 5, 1.55],
        ["I_{ij}\\dot\\omega_{j}+\\varepsilon_{ijk}\\,\\omega_{j}I_{kl}\\omega_{l}=\\tau_{i}", 8, 18, 1.4, 1],
        ["\\dot{\\mathbf{R}}=\\mathbf{R}\\,[\\boldsymbol{\\omega}]_{\\times},\\quad\\mathbf{R}^{T}\\mathbf{R}=\\mathbf{1}", 52, 17, 1.4, 1],
        ["\\dot{\\boldsymbol{\\gamma}}=\\boldsymbol{\\gamma}\\times\\boldsymbol{\\omega}", 76, 30, 1.5],
        ["\\mathcal{L}=\\tfrac12 I_{1}(\\dot\\theta^{2}+\\dot\\varphi^{2}\\sin^{2}\\theta)+\\tfrac12 I_{3}(\\dot\\psi+\\dot\\varphi\\cos\\theta)^{2}-Mgl\\cos\\theta", 14, 33, 1.25, 1],
        ["p_{\\psi}=I_{3}\\omega_{3},\\quad p_{\\varphi}=I_{1}\\dot\\varphi\\sin^{2}\\theta+p_{\\psi}\\cos\\theta", 38, 48, 1.35, 1],
        ["\\Omega_{\\mathrm{prec}}\\approx\\frac{Mgl}{I_{3}\\omega_{3}}", 10, 58, 1.6],
        ["\\omega_{3}^{2}>\\frac{4I_{1}Mgl}{I_{3}^{2}}", 64, 62, 1.6],
        ["\\mathbf{L}=\\mathbf{I}\\boldsymbol{\\omega},\\quad\\dot{\\mathbf{L}}=\\mathbf{r}_{c}\\times M\\mathbf{g}", 10, 74, 1.45],
        ["\\tfrac12 I_{1}\\dot\\theta^{2}+U_{\\mathrm{eff}}(\\theta)=E", 52, 82, 1.45],
        ["T=\\tfrac12\\,\\omega_{i}I_{ij}\\omega_{j}", 14, 90, 1.5]
      ],
      lattice: [
        ["D\\nabla^{4}w+k_{f}\\,w+\\rho h\\,\\ddot w=q", 40, 5, 1.7],
        ["D=\\frac{Eh^{3}}{12(1-\\nu^{2})},\\quad\\ell=\\left(D/k_{f}\\right)^{1/4}", 62, 18, 1.4, 1],
        ["\\kappa_{\\alpha\\beta}=-w_{,\\alpha\\beta}", 8, 20, 1.5],
        ["M_{\\alpha\\beta}=-D\\left[(1-\\nu)\\,w_{,\\alpha\\beta}+\\nu\\,\\delta_{\\alpha\\beta}\\,w_{,\\gamma\\gamma}\\right]", 24, 32, 1.35, 1],
        ["w(r)=\\frac{P\\ell^{2}}{2\\pi D}\\,\\mathrm{kei}\\!\\left(r/\\ell\\right)", 66, 42, 1.5],
        ["\\sigma_{\\alpha\\beta}=-\\frac{Ez}{1-\\nu^{2}}\\left[(1-\\nu)\\,w_{,\\alpha\\beta}+\\nu\\,\\delta_{\\alpha\\beta}\\,w_{,\\gamma\\gamma}\\right]", 8, 50, 1.3, 1],
        ["\\hat w(\\mathbf{k},t):\;\\ddot{\\hat w}+2\\zeta\\omega\\dot{\\hat w}+\\omega^{2}\\hat w=\\hat q/\\rho h", 22, 62, 1.35, 1],
        ["\\omega(k)=\\sqrt{\\left(Dk^{4}+k_{f}\\right)/\\rho h}", 66, 70, 1.5],
        ["q=\\frac{Q}{2\\pi\\sigma^{2}}\\,e^{-|\\mathbf{x}-\\mathbf{x}_{0}|^{2}/2\\sigma^{2}}", 8, 78, 1.45],
        ["U=\\frac{D}{2}\\int\\left[(\\nabla^{2}w)^{2}-2(1-\\nu)\\left(w_{xx}w_{yy}-w_{xy}^{2}\\right)\\right]dA+\\frac{k_{f}}{2}\\int w^{2}dA", 20, 88, 1.2, 1]
      ]
    };
    var eqRoot = null, eqSets = {};
    function mountEquations() {
      if (eqRoot || !window.katex) return;
      eqRoot = document.createElement("div"); eqRoot.className = "hero-eq"; eqRoot.setAttribute("aria-hidden", "true");
      Object.keys(EQ).forEach(function (key) {
        var set = document.createElement("div"); set.className = "eq-set";
        var dim = document.createElement("div"); dim.className = "eq-layer dim";
        EQ[key].forEach(function (e) {
          var d = document.createElement("div"); d.className = "eq" + (e[4] ? " long" : "");
          d.style.left = e[1] + "%"; d.style.top = e[2] + "%"; d.style.setProperty("--k", e[3]);
          try { katex.render(e[0], d, { throwOnError: false, displayMode: false }); } catch (err) { return; }
          dim.appendChild(d);
        });
        var lit = dim.cloneNode(true); lit.className = "eq-layer lit";
        set.appendChild(dim); set.appendChild(lit); eqRoot.appendChild(set); eqSets[key] = set;
      });
      hero.insertBefore(eqRoot, hero.firstChild);
      showEq();
    }
    function showEq() { Object.keys(eqSets).forEach(function (k) { eqSets[k].classList.toggle("is-on", k === mode); }); }
    function loadKatex() {
      if (window.katex) return mountEquations();
      var l = document.createElement("link"); l.rel = "stylesheet";
      l.href = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.css";
      l.integrity = "sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"; l.crossOrigin = "anonymous";
      document.head.appendChild(l);
      var s = document.createElement("script"); s.async = true; s.crossOrigin = "anonymous";
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.11/katex.min.js";
      s.integrity = "sha384-7zkQWkzuo3B5mTepMUcHkMB5jZaolc2xDwL6VFqjFALcbeS9Ggm/Yr2r3Dy4lfFg";
      s.onload = mountEquations; document.head.appendChild(s);
    }

    /* ---------------------------------------------------------------
       host: canvas sizing, source tracking, mode switch, loop, pointer
       --------------------------------------------------------------- */
    var sims = { gr: spacetimeSim(), field: fieldSim(), magnet: magnetSim(), lattice: plateSim(), fluid: fluidSim(), pend: pendulumSim(), static: staticSim(), film: filmSim(), mesh: meshSim() /*, top: topSim() */ };
    var mode = "static", cur = sims.static;
    var capEl = el("simCap"), tabs = document.querySelectorAll(".sim-tabs button");

    function resize() {
      var rect = hero.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw() { ctx.clearRect(0, 0, W, H); cur.draw(); }

    function updateSrc() {
      ghostT += 0.006;
      var tx, ty, k;
      if (pointer.active) { tx = pointer.x; ty = pointer.y; k = 0.3; }
      else { tx = W * (0.64 + 0.24 * Math.sin(ghostT * 1.3)); ty = H * (0.5 + 0.3 * Math.sin(ghostT * 2.1 + 1.2)); k = 0.07; }
      var ox = src.x, oy = src.y;
      src.x += (tx - src.x) * k; src.y += (ty - src.y) * k;
      src.vx = src.x - ox; src.vy = src.y - oy;
      if (eqRoot && frameNo % 2 === 0) { hero.style.setProperty("--mx", src.x.toFixed(0) + "px"); hero.style.setProperty("--my", src.y.toFixed(0) + "px"); }
    }

    function setMode(name) {
      mode = name; cur = sims[name];
      cur.build();
      if (capEl) capEl.textContent = cur.caption;
      tabs.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === name)); });
      showEq();
      hero.setAttribute("data-bg", name);
      if (cur.still) draw(); else if (reduceMotion) { updateSrc(); draw(); }
    }
    tabs.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); }); });

    function frame() {
      if (running && inView && !document.hidden && !cur.still) { frameNo++; updateSrc(); cur.step(); draw(); }
      requestAnimationFrame(frame);
    }

    resize(); src.x = W * 0.64; src.y = H * 0.5; setMode("static");
    if (reduceMotion) { running = false; hero.style.setProperty("--mx", "-999px"); } else frame();
    if ("requestIdleCallback" in window) requestIdleCallback(loadKatex, { timeout: 1500 }); else setTimeout(loadKatex, 300);

    var rT;
    window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(function () { resize(); cur.build(); if (reduceMotion || cur.still) draw(); }, 180); });
    new IntersectionObserver(function (en) { inView = en[0].isIntersecting; }, { threshold: 0.02 }).observe(canvas);

    function setPointer(e) {
      var rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left; pointer.y = e.clientY - rect.top; pointer.active = true;
    }
    hero.addEventListener("pointermove", setPointer);
    hero.addEventListener("pointerdown", function (e) { if (!e.target.closest("a, button")) setPointer(e); });
    hero.addEventListener("pointerleave", function () { pointer.active = false; pointer.x = -9999; });
    window.addEventListener("pointerup", function (e) { if (e.pointerType !== "mouse") pointer.active = false; });
    hero.addEventListener("click", function (e) {
      if (e.target.closest("a, button") || String(window.getSelection()).length) return;
      if (cur.click) cur.click();
    });
  })();

  /* ============== 4b · LAZY GIFS (poster → animation) =============== */
  // <img src="poster.jpg" data-gif="anim.gif">: the poster is shown at once; the
  // animation is fetched only near the viewport, and never for reduced-motion users
  // (they get a "Play animation" button instead).
  document.querySelectorAll("img[data-gif]").forEach(function (img) {
    var fig = img.closest("figure");
    var btn = null;
    function play() { img.src = img.getAttribute("data-gif"); img.removeAttribute("data-gif"); if (btn) btn.remove(); }
    if (reduceMotion) {
      btn = document.createElement("button");
      btn.type = "button"; btn.className = "gif-play"; btn.textContent = "▶ Play animation";
      btn.addEventListener("click", play);
      if (fig) fig.appendChild(btn);
      return;
    }
    new IntersectionObserver(function (en, obs) {
      if (en[0].isIntersecting) { play(); obs.disconnect(); }
    }, { rootMargin: "300px 0px" }).observe(img);
  });

  /* ============== 5 · REVEAL + COUNT-UP ============================ */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion) {
    revealEls.forEach(function (n) { n.classList.add("revealed"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("revealed"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (n) { io.observe(n); });
  }

  var counters = document.querySelectorAll("[data-count]");
  if (!reduceMotion && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var node = en.target;
        var raw = node.getAttribute("data-count");
        var num = parseInt(raw, 10);
        if (isNaN(num)) return;
        var suffix = raw.replace(String(num), "");
        var start = null, dur = 1100;
        function tick(ts) {
          if (!start) start = ts;
          var q = Math.min((ts - start) / dur, 1);
          q = 1 - Math.pow(1 - q, 3); // ease-out cubic
          node.textContent = Math.round(num * q) + suffix;
          if (q < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (n) { cio.observe(n); });
  }
  /* ---------- Beyond research: photo filter + lightbox ---------- */
(function () {
  var filter = document.getElementById("shot-filter"), grid = document.getElementById("shots");
  var lb = document.getElementById("lightbox");
  if (!filter || !grid) return;
  filter.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-cat]"); if (!b) return;
    var cat = b.getAttribute("data-cat");
    filter.querySelectorAll("button").forEach(function (x) {
      var on = x === b; x.classList.toggle("active", on); x.setAttribute("aria-pressed", on);
    });
    grid.querySelectorAll(".shot").forEach(function (f) { f.hidden = cat !== "all" && f.getAttribute("data-cat") !== cat; });
  });
  if (!lb || !lb.showModal) return;
  grid.addEventListener("click", function (e) {
    var b = e.target.closest(".shot-btn"); if (!b) return;
    var img = b.querySelector("img");
    document.getElementById("lb-img").src = img.src;
    document.getElementById("lb-img").alt = img.alt;
    document.getElementById("lb-cap").textContent = img.alt;
    lb.showModal();
  });
  lb.addEventListener("click", function () { lb.close(); });
})();

window.__siteReady = true; // set only if every renderer above ran without throwing
})();
