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
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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
      '<div class="foot-links"><a href="research.html">Research</a><a href="projects.html">Projects</a><a href="publications.html">Publications</a><a href="honors.html">Honors</a></div>' +
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
      '<div class="sim-chip"><span class="pulse"></span>Live · Verlet mass–spring lattice — drag to deform</div>' +
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
          '<span class="book-pub">' + b.venue + " · " + b.details + "</span>" +
          '<span class="book-title">' + b.title + "</span>" +
          '<span class="book-auth">' + b.authors + "</span></a>";
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
                chapter: T.chapter || counts.chapter, review: T.review || counts.review };
    var peer = tot.journal + tot.conference;
    mount("pub-summary",
      tot.book + " books · " + peer + " peer-reviewed papers (" + tot.journal + " journal, " + tot.conference +
      " conference) · " + tot.chapter + " book chapters · " + tot.review + " under review");

    mount("pub-stats",
      statCells([
        { num: String(tot.book), label: "Books" },
        { num: String(peer), label: "Peer-reviewed Papers", sub: tot.journal + " journal · " + tot.conference + " conference" },
        { num: String(tot.chapter), label: "Book Chapters" },
        { num: String(tot.review), label: "Under Review" }
      ]));
    var missJ = tot.journal - counts.journal, missR = tot.review - counts.review;
    mount("pub-note", (missJ > 0 || missR > 0)
      ? "Totals follow the CV. The list below is still being completed: " + counts.journal + " of " + tot.journal +
        " journal papers and " + counts.review + " of " + tot.review + " manuscripts under review are listed so far."
      : "");

    function pubGroup(key, icon, title, unit, list) {
      if (!list.length) return "";
      var items = list.map(function (p, i) {
        var num = list.length - i;
        var tag = p.tag ? '<span class="tag ' + (p.tagClass || "") + '">' + p.tag + "</span>" : "";
        var titleHtml = p.href
          ? '<a href="' + p.href + '" target="_blank" rel="noopener">' + p.title + "</a>"
          : p.title;
        var venue = p.venue + (p.details ? " · " + p.details : "");
        if (p.href) venue += ' · <a href="' + p.href + '" target="_blank" rel="noopener">link ↗</a>';
        return '<div class="pub-item"><span class="pub-num">' + (num < 10 ? "0" : "") + num + "</span>" +
          '<div class="pub-body"><p class="p-title">' + titleHtml + tag + "</p>" +
          '<p class="p-meta">' + p.authors + '</p><p class="p-venue">' + venue + "</p></div></div>";
      }).join("");
      var anchor = { book: "books", journal: "journals", chapter: "chapters", conference: "conference", review: "review" }[key] || key;
      return '<section class="pub-group" id="' + anchor + '" data-group="' + key + '" data-reveal>' +
        '<div class="pub-group-head"><span class="g-icon">' + icon + "</span><h2>" + title + "</h2>" +
        '<span class="g-count">' + list.length + " " + unit + "</span></div>" + items + "</section>";
    }

    mount("pub-sections",
      pubGroup("book", "§", "Graduate Textbooks", counts.book === 1 ? "volume" : "volumes", P.books) +
      pubGroup("review", "∴", "Under Review", counts.review === 1 ? "manuscript" : "manuscripts", P.review) +
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

  /* ============ 4 · HERO PHYSICS — Verlet mass–spring lattice ====== */
  /* A pinned-boundary elastic lattice. Springs are colored by strain.
     The pointer applies a radial force field (drag to deform); an
     ambient traveling load keeps the sheet alive when idle.           */
  (function heroSim() {
    var canvas = el("simCanvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    var pts = [], springs = [], cols = 0, rows = 0, spacing = 46;
    var W = 0, H = 0;
    var pointer = { x: -9999, y: -9999, px: -9999, py: -9999, down: false, active: false };
    var running = true, inView = true;
    var accent = { r: 43, g: 60, b: 240 }, base = { r: 23, g: 23, b: 28 }, baseAlpha = 0.10;

    function readColors() {
      var cs = getComputedStyle(document.documentElement);
      var a = (cs.getPropertyValue("--accent") || "#2b3cf0").trim();
      var m = a.match(/^#([0-9a-f]{6})$/i);
      if (m) {
        accent.r = parseInt(m[1].slice(0, 2), 16);
        accent.g = parseInt(m[1].slice(2, 4), 16);
        accent.b = parseInt(m[1].slice(4, 6), 16);
      }
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      base = dark ? { r: 236, g: 237, b: 237 } : { r: 23, g: 23, b: 28 };
      baseAlpha = dark ? 0.13 : 0.10;
    }
    readColors();
    document.addEventListener("themechange", readColors);

    function build() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      spacing = W < 700 ? 40 : 48;
      cols = Math.floor(W / spacing) + 2;
      rows = Math.floor(H / spacing) + 2;

      pts = []; springs = [];
      var ox = (W - (cols - 1) * spacing) / 2;
      var oy = (H - (rows - 1) * spacing) / 2;
      for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols; i++) {
          pts.push({
            x: ox + i * spacing, y: oy + j * spacing,
            ox: ox + i * spacing, oy: oy + j * spacing,
            px: ox + i * spacing, py: oy + j * spacing,
            pin: i === 0 || j === 0 || i === cols - 1 || j === rows - 1
          });
        }
      }
      function idx(i, j) { return j * cols + i; }
      for (var j2 = 0; j2 < rows; j2++) {
        for (var i2 = 0; i2 < cols; i2++) {
          if (i2 < cols - 1) springs.push({ a: idx(i2, j2), b: idx(i2 + 1, j2), rest: spacing, draw: true });
          if (j2 < rows - 1) springs.push({ a: idx(i2, j2), b: idx(i2, j2 + 1), rest: spacing, draw: true });
          if (i2 < cols - 1 && j2 < rows - 1) {
            var d = spacing * Math.SQRT2;
            springs.push({ a: idx(i2, j2), b: idx(i2 + 1, j2 + 1), rest: d, draw: false });
            springs.push({ a: idx(i2 + 1, j2), b: idx(i2, j2 + 1), rest: d, draw: false });
          }
        }
      }
    }

    var t = 0;
    function step() {
      t += 0.008;
      // ambient traveling load (Lissajous path) so the sheet is alive when idle
      var ax = W * (0.62 + 0.30 * Math.sin(t * 1.3));
      var ay = H * (0.50 + 0.36 * Math.sin(t * 2.1 + 1.2));

      var damp = 0.965;
      for (var k = 0; k < pts.length; k++) {
        var p = pts[k];
        if (p.pin) continue;
        var vx = (p.x - p.px) * damp;
        var vy = (p.y - p.py) * damp;
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy;

        // spring back toward rest position (keeps sheet taut)
        p.x += (p.ox - p.x) * 0.012;
        p.y += (p.oy - p.y) * 0.012;

        // ambient force
        var dx = p.x - ax, dy = p.y - ay;
        var d2 = dx * dx + dy * dy;
        var r = 130;
        if (d2 < r * r && d2 > 1) {
          var d = Math.sqrt(d2);
          var f = (1 - d / r) * 0.55;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }

        // pointer force field
        if (pointer.active) {
          var pdx = p.x - pointer.x, pdy = p.y - pointer.y;
          var pd2 = pdx * pdx + pdy * pdy;
          var pr = pointer.down ? 190 : 120;
          if (pd2 < pr * pr && pd2 > 1) {
            var pd = Math.sqrt(pd2);
            var fall = 1 - pd / pr;
            if (pointer.down) {
              // drag: pull material along with the pointer
              p.x += (pointer.x - pointer.px) * fall * 0.9;
              p.y += (pointer.y - pointer.py) * fall * 0.9;
            } else {
              // hover: gentle push away
              p.x += (pdx / pd) * fall * 1.6;
              p.y += (pdy / pd) * fall * 1.6;
            }
          }
        }
      }
      pointer.px = pointer.x; pointer.py = pointer.y;

      // constraint relaxation
      for (var it = 0; it < 3; it++) {
        for (var s = 0; s < springs.length; s++) {
          var sp = springs[s];
          var A = pts[sp.a], B = pts[sp.b];
          var ddx = B.x - A.x, ddy = B.y - A.y;
          var dist = Math.sqrt(ddx * ddx + ddy * ddy) || 0.0001;
          var diff = (dist - sp.rest) / dist * 0.5;
          var mx = ddx * diff, my = ddy * diff;
          if (!A.pin) { A.x += mx * 0.9; A.y += my * 0.9; }
          if (!B.pin) { B.x -= mx * 0.9; B.y -= my * 0.9; }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      for (var s = 0; s < springs.length; s++) {
        var sp = springs[s];
        if (!sp.draw) continue;
        var A = pts[sp.a], B = pts[sp.b];
        var dx = B.x - A.x, dy = B.y - A.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var strain = Math.min(Math.abs(dist - sp.rest) / sp.rest * 9, 1);
        var rr = Math.round(base.r + (accent.r - base.r) * strain);
        var gg = Math.round(base.g + (accent.g - base.g) * strain);
        var bb = Math.round(base.b + (accent.b - base.b) * strain);
        var al = baseAlpha + strain * 0.75;
        ctx.strokeStyle = "rgba(" + rr + "," + gg + "," + bb + "," + al.toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      }
    }

    function frame() {
      if (running && inView && !document.hidden) { step(); draw(); }
      requestAnimationFrame(frame);
    }

    build();
    if (reduceMotion) { draw(); running = false; }
    else frame();

    var rT;
    window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(function () { build(); if (reduceMotion) draw(); }, 180); });
    new IntersectionObserver(function (en) { inView = en[0].isIntersecting; }, { threshold: 0.02 }).observe(canvas);

    function setPointer(e) {
      var rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      if (!pointer.active) { pointer.px = pointer.x; pointer.py = pointer.y; pointer.active = true; }
    }
    var hero = canvas.parentElement;
    hero.addEventListener("pointermove", setPointer);
    hero.addEventListener("pointerdown", function (e) {
      // don't hijack clicks on links/buttons
      if (e.target.closest("a, button")) return;
      setPointer(e); pointer.down = true;
    });
    window.addEventListener("pointerup", function () { pointer.down = false; });
    hero.addEventListener("pointerleave", function () { pointer.active = false; pointer.down = false; pointer.x = pointer.px = -9999; });
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
  window.__siteReady = true; // set only if every renderer above ran without throwing
})();
