/* ===================== CONFIG: edit these ===================== */
const CONFIG = {
  bride: "Nidhi", groom: "Shreeyash", initials: "N & S",
  // Countdown target, fixed to IST (UTC+05:30) so it is right in any timezone
  target: "2027-02-28T11:30:00+05:30",
  // Fill venue + address; "Get Directions" then opens Google Maps for that address
  // Names of guests who have confirmed. Add them here (comma-separated) to show them to everyone.
  confirmedGuests: [],
  // Names in the invitation text (replace the placeholders)
  grandparents: "Lt. Smt. Kamla & Lt. Shri I. B. Khare",
  brideParents: "Daughter of Smt. Archana & Lt. Shri Yogesh Khare", groomParents: "Son of Smt. Pallavi & Shri Sanjay Nage",
  // Closing family section
  familyName: "Khare",
  warmth: ["Mrs. Archana Khare"],                                  // "With warmth & affection"
  seek: ["Mr. Yash Khare & Mrs. Tulika Shrivastava", "Mr. Rakesh & Mrs. Rita Khare", "Mr. Akhilesh & Mrs. Neeta Khare", "Mr. Apoorv Khare"],      // "We humbly seek your gracious presence..."
  venue: "Pushpa Vatika Resort & Lawns", address: "Pushpa Vatika Resort & Lawns, Panvel, Navi Mumbai",
  events: [
    { day: 1, cls: "haldi",   icon: "🌼", name: "Haldi",       tag: "The Golden Hour",       date: "Saturday, 27 February 2027", time: "11:30 AM onwards" },
    { day: 1, cls: "sangeet", icon: "🎶", name: "Sangeet",     tag: "The Rhythm Soirée",     date: "Saturday, 27 February 2027", time: "7:00 PM onwards" },
    { day: 2, cls: "phere",   icon: "🪔", name: "Phere",       tag: "The Forever Chapter",   date: "Sunday, 28 February 2027",   time: "9:00 AM onwards" },
    { day: 2, cls: "mangal",  icon: "🌺", name: "Mangalashtak", tag: "The Floral Promise",    date: "Sunday, 28 February 2027",   time: "11:30 AM" }
  ]
};
/* ================================================================ */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const video = $("#bgVideo"), music = $("#music");

  /* Names / initials */
  $$("[data-bride]").forEach(e => e.textContent = CONFIG.bride);
  $$("[data-groom]").forEach(e => e.textContent = CONFIG.groom);
  $$("[data-initials],[data-initials-text]").forEach(e => e.textContent = CONFIG.initials);
  $("[data-grand]").textContent = CONFIG.grandparents; $("[data-bparents]").textContent = CONFIG.brideParents; $("[data-gparents]").textContent = CONFIG.groomParents;
  $$("[data-couple]").forEach(e => e.textContent = CONFIG.bride + " & " + CONFIG.groom);
  $(".card small").textContent = CONFIG.bride + " & " + CONFIG.groom;

  /* Video: try autoplay muted; poster/gradient stays if blocked or missing */
  const tryPlay = () => video.play && video.play().catch(() => {});
  tryPlay();
  video.addEventListener("error", () => video.removeAttribute("src"), true);
  $("source", video).addEventListener("error", () => { video.style.opacity = 0; });
  addEventListener("pointerdown", () => { if (video.paused) tryPlay(); }, { once: true });

  /* Petals (few, paused when tab hidden) */
  if (!reduce) {
    const box = $("#petals"), n = innerWidth < 600 ? 9 : 16;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span"); p.className = "petal";
      p.style.cssText = `left:${Math.random() * 100}%;--dx:${Math.random() * 120 - 60}px;animation-duration:${9 + Math.random() * 9}s;animation-delay:${-Math.random() * 14}s;transform:scale(${.6 + Math.random() * .8})`;
      box.appendChild(p);
    }
  }
  document.addEventListener("visibilitychange", () => document.body.classList.toggle("paused", document.hidden));

  /* Envelope: opens once */
  const env = $("#envelope"), intro = $("#intro"); let opened = false;
  env.addEventListener("click", () => {
    if (opened) return; opened = true;
    env.classList.add("open"); env.disabled = true;
    startMusic();
    setTimeout(() => {
      intro.classList.add("done"); document.body.classList.remove("locked"); $$("#main .reveal").forEach(observe);
      setTimeout(() => { intro.hidden = true; }, 1100);
    }, reduce ? 300 : 2300);
  });

  /* Sound controls */
  const mBtn = $("#musicBtn"), vBtn = $("#vidSoundBtn");
  function setMusic(on) { mBtn.setAttribute("aria-pressed", on); mBtn.setAttribute("aria-label", on ? "Pause background music" : "Play background music"); mBtn.textContent = on ? "♫" : "♪"; }
  function startMusic() { music.play().then(() => setMusic(true)).catch(() => setMusic(false)); }
  mBtn.addEventListener("click", () => { if (music.paused) startMusic(); else { music.pause(); setMusic(false); } });
  music.addEventListener("error", () => setMusic(false));
  vBtn.addEventListener("click", () => {
    video.muted = !video.muted; const on = !video.muted;
    vBtn.setAttribute("aria-pressed", on); vBtn.setAttribute("aria-label", on ? "Mute video" : "Unmute video"); vBtn.textContent = on ? "🔊" : "🔇";
    if (on && !music.paused) { music.pause(); setMusic(false); }   // avoid two audio tracks at once
    tryPlay();
  });

  /* Nav */
  const menu = $("#menu"), menuBtn = $("#menuBtn");
  const closeMenu = () => { menu.classList.remove("show"); menuBtn.setAttribute("aria-expanded", false); };
  menuBtn.addEventListener("click", () => menuBtn.setAttribute("aria-expanded", menu.classList.toggle("show")));
  menu.addEventListener("click", e => { if (e.target.closest("a")) closeMenu(); });

  /* Countdown (clears itself at zero) */
  const target = new Date(CONFIG.target).getTime(), cd = { d: $("#cd-d"), h: $("#cd-h"), m: $("#cd-m"), s: $("#cd-s") };
  const set = (el, v) => { v = String(v).padStart(2, "0"); if (el.textContent !== v) { el.textContent = v; if (!reduce) { el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); } } };
  const timerId = setInterval(tickCd, 1000); tickCd();
  function tickCd() {
    let t = Math.max(0, target - Date.now());
    set(cd.d, Math.floor(t / 864e5)); set(cd.h, Math.floor(t / 36e5) % 24); set(cd.m, Math.floor(t / 6e4) % 60); set(cd.s, Math.floor(t / 1e3) % 60);
    if (t === 0) { clearInterval(timerId); $("#timer").hidden = true; $("#cd-done").hidden = false; }
  }

  /* Confetti */
  function confetti(el) {
    if (reduce) return;
    const r = el.getBoundingClientRect(), cols = ["#F2A900", "#E0457B", "#0E7C86", "#EF6C1A", "#7B2CBF"];
    for (let i = 0; i < 34; i++) {
      const c = document.createElement("i"); c.className = "confetti";
      c.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;background:${cols[i % 5]};--x:${Math.random() * 360 - 180}px;--y:${Math.random() * 300 - 200}px;--r:${Math.random() * 720}deg`;
      document.body.appendChild(c); setTimeout(() => c.remove(), 1700);
    }
  }

  /* Scratch cards (pointer events: mouse, touch, pen) */
  function paint(ctx, w, h, style) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    if (style === "gold") { g.addColorStop(0, "#E0A100"); g.addColorStop(.5, "#FFE08A"); g.addColorStop(1, "#E0457B"); }
    else { g.addColorStop(0, "#2AA5AE"); g.addColorStop(.5, "#F8BBD0"); g.addColorStop(1, "#7B2CBF"); }
    ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,.28)";
    for (let i = 0; i < 90; i++) { ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, (style === "gold" ? 1.5 : 4) * (w / 400), 0, 7); ctx.fill(); }
    ctx.fillStyle = "#4A1238"; ctx.textAlign = "center"; ctx.font = `600 ${w / 15}px Georgia,serif`;
    ctx.fillText(style === "gold" ? "✦ Scratch here ✦" : "Scratch to reveal", w / 2, h / 2 + w / 45);
  }
  $$(".scratch-card").forEach(card => {
    const cv = $(".cover", card), ctx = cv.getContext("2d", { willReadFrequently: true }), reset = $("[data-reset]", card.parentElement);
    let w, h, drawing = false, last = null, started = false, done = false, lastCheck = 0;
    const size = () => { const r = cv.getBoundingClientRect(), d = devicePixelRatio || 1; w = cv.width = Math.round(r.width * d); h = cv.height = Math.round(r.height * d); paint(ctx, w, h, cv.dataset.style); };
    new ResizeObserver(() => { if (!started && !done && cv.clientWidth) size(); }).observe(cv);
    const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * w / r.width, (e.clientY - r.top) * h / r.height]; };
    const line = (a, b) => { ctx.globalCompositeOperation = "destination-out"; ctx.lineCap = ctx.lineJoin = "round"; ctx.lineWidth = w / 9; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
    cv.addEventListener("pointerdown", e => { if (done) return; drawing = started = true; cv.setPointerCapture(e.pointerId); last = pos(e); line(last, last); e.preventDefault(); });
    cv.addEventListener("pointermove", e => {
      if (!drawing) return; const p = pos(e); line(last, p); last = p;
      const now = performance.now(); if (now - lastCheck > 120) { lastCheck = now; check(); }
    });
    ["pointerup", "pointercancel"].forEach(ev => cv.addEventListener(ev, () => { drawing = false; if (!done) check(); }));
    function check() {
      const px = ctx.getImageData(0, 0, w, h).data; let clear = 0, total = 0;
      for (let i = 3; i < px.length; i += 64) { total++; if (px[i] < 128) clear++; }   // sample every 16th pixel
      if (clear / total >= .4) finish();
    }
    function finish() { done = true; drawing = false; cv.classList.add("gone"); confetti(card); if (reset) reset.hidden = false; }
    reset && reset.addEventListener("click", () => { done = started = false; cv.classList.remove("gone"); size(); reset.hidden = true; });
  });

  /* Family names */
  $("#famTitle").textContent = `The ${CONFIG.familyName} Family invites you to celebrate`;
  const li = a => a.map(n => `<li>${n}</li>`).join("");
  $("#warmList").innerHTML = li(CONFIG.warmth); $("#seekList").innerHTML = li(CONFIG.seek);


  /* Illustrated scene banners (inline SVG, no image files needed) */
  const sag = (n, x0, x1, y0, dip, fn) => Array.from({ length: n }, (_, i) => { const t = i / (n - 1), x = x0 + (x1 - x0) * t; return fn(x, y0 + dip * Math.sin(Math.PI * t), i); }).join("");
  const bloom = (x, y, r, a, b) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${a}"/><circle cx="${x}" cy="${y}" r="${r * .55}" fill="${b}"/>`;
  const svg = (bg1, bg2, body) => `<svg viewBox="0 0 120 64" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${body}</svg>`;
  const note = (x, y, c) => `<g fill="${c}"><ellipse cx="${x}" cy="${y}" rx="4.5" ry="3.3" transform="rotate(-20 ${x} ${y})"/><rect x="${x + 3.3}" y="${y - 17}" width="1.8" height="17"/><path d="M${x + 5} ${y - 17}q6 2 5 8q-2-4-5-4z"/></g>`;
  const ICONS = {
    haldi: svg("#FFE27A", "#F5A623",
      sag(13, 6, 114, 6, 9, (x, y, i) => bloom(x, y, 4.2, i % 2 ? "#FF9F1C" : "#FFC107", "#E4541B")) +
      `<ellipse cx="60" cy="55" rx="32" ry="6" fill="#8C5A12"/><ellipse cx="60" cy="52" rx="32" ry="6" fill="#E8B04A"/><ellipse cx="60" cy="51" rx="26" ry="4.5" fill="#C98A1A"/>` +
      `<path d="M36 51Q60 18 84 51Z" fill="#F2B705"/><path d="M44 49Q60 26 76 49Z" fill="#FFD34D"/>` +
      bloom(18, 50, 5, "#FF9F1C", "#E4541B") + bloom(102, 50, 5, "#FFC107", "#E4541B")),
    sangeet: svg("#3B1A6E", "#B0388F",
      `<path d="M0 12Q30 26 60 12T120 12" stroke="#5B1F4E" stroke-width="1.2" fill="none"/>` +
      sag(11, 4, 116, 14, 6, (x, y) => `<circle cx="${x}" cy="${y}" r="6" fill="#FFC107" opacity=".35"/><circle cx="${x}" cy="${y}" r="2.8" fill="#F2A900"/>`) +
      note(36, 54, "#7B2CBF") + note(62, 48, "#E0457B") + note(86, 54, "#0E7C86") +
      `<g fill="#F2A900"><path d="M14 34l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z"/><path d="M106 30l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z"/></g>`),
    phere: svg("#FFD7A8", "#E4541B",
      `<path d="M14 24Q60 -2 106 24Z" fill="#B8324A"/><path d="M14 24H106" stroke="#F2A900" stroke-width="3"/>` +
      sag(9, 20, 100, 24, 0, x => `<path d="M${x} 24v7" stroke="#F2A900" stroke-width="1.4"/>${bloom(x, 33, 2.6, "#FFC107", "#E4541B")}`) +
      [22, 38, 82, 98].map(x => `<rect x="${x - 2}" y="26" width="4" height="30" fill="#F2C766"/><rect x="${x - 4}" y="54" width="8" height="4" fill="#B8741A"/>`).join("") +
      `<path d="M60 30c6 6 8 10 6 15-2 4-10 4-12 0-2-5 2-9 6-15z" fill="#FF9F1C"/><path d="M60 38c3 3 3 5 2 7-1 2-5 2-6 0-1-2 1-4 4-7z" fill="#FFF3A0"/>` +
      `<path d="M44 52H76L72 58H48Z" fill="#B8741A"/>`),
    mangal: svg("#FFD0DF", "#F48FB1",
      `<rect x="0" y="7" width="120" height="5" fill="#B8324A"/><rect x="0" y="7" width="120" height="1.6" fill="#F2A900"/>` +
      Array.from({ length: 12 }, (_, i) => { const x = 8 + i * 9.5; return `<path d="M${x} 12c-5 6-5 14 0 22 5-8 5-16 0-22z" fill="${i % 2 ? "#2F7A35" : "#4FA653"}"/>`; }).join("") +
      Array.from({ length: 11 }, (_, i) => bloom(12.7 + i * 9.5, 39, 3.8, i % 2 ? "#FF9F1C" : "#FFC107", "#E4541B")).join("") +
      `<path d="M40 56h40l-3 6H43z" fill="#F2A900"/><circle cx="60" cy="52" r="5" fill="#8C5A12"/><path d="M60 40c-6 4-8 8-5 11 3-1 5-5 5-11zm0 0c6 4 8 8 5 11-3-1-5-5-5-11z" fill="#4FA653"/>`)
  };

  /* Events + venues from CONFIG (Google Maps link only when an address exists) */
  const evBox = $("#eventList"), vBox = $("#venueList"); let day = 0;
  CONFIG.events.forEach(ev => {
    if (ev.day !== day) { day = ev.day; evBox.insertAdjacentHTML("beforeend", `<h3 class="day reveal">Day ${day} · ${ev.date.split(",")[0]}</h3>`); }
    evBox.insertAdjacentHTML("beforeend", `<article class="ev ${ev.cls} reveal"><span class="ic"><img src="assets/${ev.cls}.png" data-k="${ev.cls}" alt=""></span><h3>${ev.name}</h3><p class="tg">${ev.tag}</p><p class="when"><b>${ev.date}</b><br>${ev.time}</p><p class="vn">Venue: ${CONFIG.venue}, Panvel, Navi Mumbai</p></article>`);
  });

  evBox.addEventListener("error", e => { const k = e.target.dataset && e.target.dataset.k; if (k) e.target.parentNode.innerHTML = ICONS[k]; }, true);   // no PNG in assets/? use drawn cutout
  $$("img[data-k]", evBox).forEach(i => { if (i.complete && !i.naturalWidth) i.parentNode.innerHTML = ICONS[i.dataset.k]; });
  const url = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.address);
  vBox.innerHTML = `<article class="v"><h3>${CONFIG.venue}</h3><p>Panvel, Navi Mumbai</p>
    <ul class="vl">${CONFIG.events.map(ev => `<li class="${ev.cls}"><b>${ev.name}</b><span>${ev.date}, ${ev.time}</span></li>`).join("")}</ul>
    <a class="dir" href="${url}" target="_blank" rel="noopener">Get Directions</a></article>`;

  /* Scroll reveal (reveal elements added above are observed once the envelope opens) */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 }) : null;
  function observe(el) { io ? io.observe(el) : el.classList.add("in"); }

  addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  /* RSVP names: CONFIG list + names saved in THIS browser only (no backend) */
  const KEY = "wedding-rsvp-names"; let saved = [];
  try { saved = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
  const gl = $("#guestList");
  function renderGuests() {
    const all = [...new Set([...CONFIG.confirmedGuests, ...saved])];
    gl.innerHTML = ""; all.forEach(n => { const li = document.createElement("li"); li.textContent = n; gl.appendChild(li); });
    $("#guestEmpty").hidden = all.length > 0;
  }
  renderGuests();

  /* RSVP (front-end demo: nothing is sent to a server) */
  const form = $("#rsvpForm");
  form.addEventListener("submit", e => {
    e.preventDefault(); const f = new FormData(form), errs = {};
    if (!f.get("name").trim()) errs.name = "Please enter your name.";
    const c = f.get("contact").trim(); if (c && !/^\S+@\S+\.\S+$/.test(c) && !/^[+\d][\d\s-]{6,}$/.test(c)) errs.contact = "Enter a valid email or phone number, or leave it blank.";
    const g = +f.get("guests"); if (!Number.isInteger(g) || g < 1 || g > 20) errs.guests = "Enter a number of guests from 1 to 20.";
    if (!f.get("attend")) errs.attend = "Please choose Joyfully Accept or Regretfully Decline.";
    $$(".err", form).forEach(el => el.textContent = errs[el.dataset.for] || "");
    const first = Object.keys(errs)[0]; if (first) { form.elements[first].focus ? form.elements[first].focus() : form.elements[first][0].focus(); return; }
    $("#rsvpMsg").textContent = f.get("attend") === "accept" ? `Thank you, ${f.get("name").trim()}! We can’t wait to celebrate with you (${g} guest${g > 1 ? "s" : ""}).` : `Thank you, ${f.get("name").trim()}. We’ll miss you and are grateful you let us know.`;
    if (f.get("attend") === "accept") { saved.push(f.get("name").trim()); try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {} renderGuests(); }
    form.hidden = true; const ok = $("#rsvpOk"); ok.hidden = false; ok.focus(); confetti(ok);
  });
})();
