/* =========================================================================
   TYNDALLA — logika strony
   Dane pochodzą z songs.js (ARTIST_LINKS, ALBUM, SONGS).
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- Ikony (inline SVG) ---------- */
  var ICONS = {
    spotify:
      '<circle cx="12" cy="12" r="10"/>' +
      '<path d="M6.8 9.4c3.6-1.1 7.7-.7 10.6 1.1"/>' +
      '<path d="M7.4 12.6c3-.8 6.2-.5 8.7 1"/>' +
      '<path d="M8 15.6c2.3-.6 4.7-.4 6.6.7"/>',
    youtube:
      '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/>' +
      '<path class="fill" d="M10.2 9.3v5.4l4.6-2.7z"/>',
    tiktok:
      '<path d="M13.5 3.5v11a3.5 3.5 0 1 1-3.5-3.5"/>' +
      '<path d="M13.5 3.5c.4 2.6 2.4 4.6 5 4.8"/>',
    instagram:
      '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/>' +
      '<circle cx="12" cy="12" r="3.8"/>' +
      '<circle class="fill" cx="17.2" cy="6.8" r=".9"/>'
  };
  var NAMES = { spotify: "Spotify", youtube: "YouTube", tiktok: "TikTok", instagram: "Instagram" };

  function svg(name) {
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICONS[name] + "</svg>";
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function hasLink(url) {
    return typeof url === "string" && /^https?:\/\//i.test(url.trim());
  }

  function iconLink(name, url, label) {
    return '<a class="icon-link" href="' + esc(url.trim()) + '" target="_blank" rel="noopener" aria-label="' +
      esc(label) + '">' + svg(name) + "</a>";
  }

  /* ---------- Daty (strefa Europe/Warsaw) ---------- */

  // Dzisiejsza data w Polsce jako "RRRR-MM-DD".
  function warsawToday() {
    // Parametr ?today=RRRR-MM-DD działa tylko lokalnie (do testów).
    var host = location.hostname;
    var isLocal = location.protocol === "file:" || host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host === "";
    if (isLocal) {
      var q = new URLSearchParams(location.search).get("today");
      if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q;
    }
    try {
      var parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit"
      }).formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      return o.year + "-" + o.month + "-" + o.day;
    } catch (e) {
      var d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }
  }

  // "2026-11-27" -> "27.11.2026"
  function fmt(iso) {
    var p = String(iso).split("-");
    return p.length === 3 ? p[2] + "." + p[1] + "." + p[0] : iso;
  }

  // Premiera o 00:00 czasu polskiego w dniu releaseDate = dzień releaseDate <= dziś (w Polsce).
  function isReleased(iso, today) { return iso <= today; }

  var today = warsawToday();
  var artist = typeof ARTIST_LINKS === "object" ? ARTIST_LINKS : {};
  var album = typeof ALBUM === "object" ? ALBUM : {};
  var songs = Array.isArray(typeof SONGS !== "undefined" ? SONGS : null) ? SONGS : [];

  /* ---------- Album ---------- */

  var dateEl = document.querySelector("[data-album-date]");
  if (dateEl && album.releaseDate) dateEl.textContent = fmt(album.releaseDate);

  var albumLinks = document.querySelector("[data-album-links]");
  if (albumLinks) {
    if (album.releaseDate && !isReleased(album.releaseDate, today)) {
      albumLinks.innerHTML = '<span class="label">premiera albumu · ' + esc(fmt(album.releaseDate)) + "</span>";
    } else {
      var t = album.title || "album";
      albumLinks.innerHTML =
        (hasLink(album.spotify) ? iconLink("spotify", album.spotify, "Album „" + t + "” w Spotify") : "") +
        (hasLink(album.youtube) ? iconLink("youtube", album.youtube, "Album „" + t + "” w YouTube") : "");
    }
  }

  /* ---------- Lista utworów ---------- */

  var list = document.querySelector("[data-tracklist]");
  if (list) {
    // Najbliższa przyszła data premiery (może dotyczyć kilku utworów).
    var nextDate = null;
    songs.forEach(function (s) {
      if (s.releaseDate && !isReleased(s.releaseDate, today) && (nextDate === null || s.releaseDate < nextDate)) {
        nextDate = s.releaseDate;
      }
    });

    list.innerHTML = songs.map(function (s, i) {
      var num = String(i + 1).padStart(2, "0");
      var released = s.releaseDate ? isReleased(s.releaseDate, today) : false;
      var isNext = !released && s.releaseDate === nextDate;
      var cls = "track reveal" + (released ? " is-released" : " is-upcoming") + (isNext ? " is-next" : "");
      var links;
      if (released) {
        links =
          (hasLink(s.spotify) ? iconLink("spotify", s.spotify, "„" + s.title + "” w Spotify") : "") +
          (hasLink(s.youtube) ? iconLink("youtube", s.youtube, "„" + s.title + "” w YouTube") : "");
      } else if (isNext) {
        links = '<span class="label label--next">następny · ' + esc(fmt(s.releaseDate)) + "</span>";
      } else {
        links = '<span class="label">wkrótce</span>';
      }
      return (
        '<li class="' + cls + '">' +
          '<span class="track__num" aria-hidden="true">' + num + "</span>" +
          '<span class="track__title">' + esc(s.title) + "</span>" +
          '<span class="track__meta">' +
            '<time class="track__date" datetime="' + esc(s.releaseDate || "") + '">' + esc(fmt(s.releaseDate || "")) + "</time>" +
            '<span class="track__links">' + links + "</span>" +
          "</span>" +
        "</li>"
      );
    }).join("");
  }

  /* ---------- Słuchaj ---------- */

  var listenMain = document.querySelector("[data-listen-main]");
  if (listenMain) {
    listenMain.innerHTML = ["spotify", "youtube"].map(function (k) {
      if (hasLink(artist[k])) {
        return '<a class="listen__big" href="' + esc(artist[k].trim()) + '" target="_blank" rel="noopener" aria-label="Tyndalla w ' +
          NAMES[k] + '">' + svg(k) + "<span>" + NAMES[k] + "</span></a>";
      }
      return '<div class="listen__big is-soon">' + svg(k) + "<span>" + NAMES[k] + '</span><span class="label">wkrótce</span></div>';
    }).join("");
  }

  var listenSocial = document.querySelector("[data-listen-social]");
  if (listenSocial) {
    listenSocial.innerHTML = ["tiktok", "instagram"].filter(function (k) { return hasLink(artist[k]); })
      .map(function (k) { return iconLink(k, artist[k], "Tyndalla na " + NAMES[k]); }).join("");
  }

  /* ---------- Stopka ---------- */

  var footer = document.querySelector("[data-footer-links]");
  if (footer) {
    var fl = ["spotify", "youtube", "tiktok", "instagram"].filter(function (k) { return hasLink(artist[k]); });
    footer.innerHTML = fl.map(function (k) {
      return iconLink(k, artist[k], "Tyndalla " + (k === "spotify" || k === "youtube" ? "w " : "na ") + NAMES[k]);
    }).join("");
    if (!fl.length) footer.hidden = true;
  }

  /* ---------- E-mail (składany w JS — ochrona przed botami) ---------- */

  var mail = document.querySelector("[data-mail]");
  if (mail) {
    var addr = mail.getAttribute("data-u") + "@" + mail.getAttribute("data-d") + "." + mail.getAttribute("data-t");
    var a = document.createElement("a");
    a.href = "mai" + "lto:" + addr;
    a.textContent = addr;
    mail.textContent = "";
    mail.appendChild(a);
  }

  /* ---------- Pojawianie się przy przewijaniu ---------- */

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var idx = Array.prototype.indexOf.call(e.target.parentNode.children, e.target);
          e.target.style.transitionDelay = Math.min(idx, 6) * 70 + "ms";
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Kurz w snopie światła (canvas) ---------- */

  var canvas = document.querySelector(".hero__dust");
  if (!canvas || reduceMotion || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var hero = canvas.parentElement;
  var W = 0, H = 0, DPR = 1, beamW = 0, cx = 0;
  var particles = [];
  var running = false, heroVisible = true, rafId = 0, last = 0;

  // Oś snopa = położenie kreski światła w logo.
  function alignBeam() {
    var lb = document.querySelector(".logo__beam");
    var hr = hero.getBoundingClientRect();
    cx = lb ? lb.getBoundingClientRect().left + 1 - hr.left : W / 2;
    hero.style.setProperty("--beam-x", cx + "px");
  }
  var lastW = -1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth;
    H = hero.clientHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    beamW = Math.max(60, Math.min(170, W * 0.12));
    alignBeam();
    if (W === lastW) return;                  // zmiana samej wysokości (pasek adresu) — bez resetu
    lastW = W;
    var count = W < 640 ? 38 : 64;
    particles = [];
    for (var i = 0; i < count; i++) particles.push(spawn(true));
  }

  function gauss() {
    return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  }

  function spawn(anywhere) {
    return {
      x: cx + gauss() * beamW,
      y: anywhere ? Math.random() * H : H + 10,
      r: 0.5 + Math.random() * 1.3,
      vy: -(4 + Math.random() * 10),          // px/s — bardzo wolno w górę
      vx: (Math.random() - 0.5) * 4,
      phase: Math.random() * Math.PI * 2,
      tw: 0.3 + Math.random() * 0.9
    };
  }

  function frame(t) {
    if (!running) return;
    var dt = last ? Math.min((t - last) / 1000, 0.05) : 0.016;
    last = t;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.phase += dt * p.tw;
      p.x += (p.vx + Math.sin(p.phase) * 3) * dt;
      p.y += p.vy * dt;
      if (p.y < -10) { particles[i] = spawn(false); continue; }
      var dist = Math.abs(p.x - cx) / beamW;                // odległość od osi snopa
      var inBeam = Math.max(0, 1 - dist * dist);
      var vertical = 0.35 + 0.65 * (1 - p.y / H);           // jaśniej u góry, bliżej źródła
      var a = inBeam * vertical * (0.45 + 0.35 * Math.sin(p.phase * 2));
      if (a <= 0.02) continue;
      ctx.beginPath();
      ctx.fillStyle = "rgba(244,241,234," + a.toFixed(3) + ")";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    rafId = requestAnimationFrame(frame);
  }

  function update() {
    var should = heroVisible && !document.hidden;
    if (should && !running) {
      running = true; last = 0;
      rafId = requestAnimationFrame(frame);
    } else if (!should && running) {
      running = false;
      cancelAnimationFrame(rafId);
    }
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  document.addEventListener("visibilitychange", update);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; update(); }).observe(hero);
  }

  resize();
  update();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { lastW = -1; resize(); });
  }
})();
