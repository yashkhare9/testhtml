/* ===================== CONFIG: edit these ===================== */
const CONFIG = {
  bride: "Nidhi", groom: "Shreeyash",
  target: "2027-02-28T11:30:00+05:30",            // countdown target (IST)
  grandparents: "Lt. Smt. Kamla & Lt. Shri I.B. Khare",
  brideParents: "Daughter of Smt. Archana & Lt. Shri Yogesh Khare",
  groomParents: "Son of Smt. Pallavi & Shri Sanjay Nage",
  familyName: "Khare",
  warmth: [],
  seek: ["Mrs. Archana Khare", "Mr. Yash Khare & Mrs. Tulika Shrivastava", "Mr. Rakesh & Mrs. Rita Khare", "Mr. Akhilesh & Mrs. Neeta Khare", "Mr. Apoorv Khare"],
  venue: "Pushp Vatika Resort & Lawns", address: "Pushp Vatika Resort & Lawns, Panvel, Navi Mumbai",
  // img = poster image shown on the card (the title is already printed on each poster)
  // Dress code wardrobe: one hanger per card (edit freely)
  wardrobe: [
    { day: 1, name: "Haldi",                 times: ["11:30 AM onwards"],                      dress: "Dress Code: Yellow with a Touch of Maharashtrian Tradition" },
    { day: 1, name: "Sangeet",               times: ["7:00 PM onwards"],                       dress: "Dress Code: Western Elegance" },
    { day: 2, name: "Phere & Mangalashtak",  times: ["Phere · 9:00 AM onwards","Mangalashtak · 11:30 AM"], dress: "Dress Code: Traditional Attire" }
  ],
  events: [
    { day: 1, cls: "haldi",   name: "Haldi",        img: "haldi_im.png",         tag: "The Golden Hour",     date: "Saturday, 27 February 2027", time: "11:30 AM onwards" },
    { day: 1, cls: "sangeet", name: "Sangeet",      img: "sangeet_im.jpeg",      tag: "The Rhythm Soirée",   date: "Saturday, 27 February 2027", time: "7:00 PM onwards" },
    { day: 2, cls: "phere",   name: "Phere",        img: "phere_im.png",         tag: "The Forever Chapter", date: "Sunday, 28 February 2027",   time: "9:00 AM onwards" },
    { day: 2, cls: "mangal",  name: "Mangalashtak", img: "mangalashtak_im.jpeg", tag: "The Floral Promise",  date: "Sunday, 28 February 2027",   time: "11:30 AM" }
  ]
};
/* ================================================================ */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const music = $("#music"), body = document.body;

  /* Fill text from CONFIG */
  $$("[data-bride]").forEach(e => e.textContent = CONFIG.bride);
  $$("[data-groom]").forEach(e => e.textContent = CONFIG.groom);
  $$("[data-couple]").forEach(e => e.textContent = CONFIG.bride + " & " + CONFIG.groom);
  $("[data-grand]").textContent = CONFIG.grandparents;
  $("[data-bparents]").textContent = CONFIG.brideParents;
  $("[data-gparents]").textContent = CONFIG.groomParents;
  $("#famTitle").textContent = `The ${CONFIG.familyName} Family invites you to celebrate`;
  const li = a => a.filter(Boolean).map(n => `<li>${n}</li>`).join("");
  $("#warmList").innerHTML = li(CONFIG.warmth); $("#seekList").innerHTML = li(CONFIG.seek);

  /* Petals */
  if (!reduce) {
    const box = $("#petals"), n = innerWidth < 600 ? 9 : 16;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span"); p.className = "petal";
      p.style.cssText = `left:${Math.random() * 100}%;--dx:${Math.random() * 120 - 60}px;animation-duration:${9 + Math.random() * 9}s;animation-delay:${-Math.random() * 14}s;transform:scale(${.6 + Math.random() * .8})`;
      box.appendChild(p);
    }
  }
  document.addEventListener("visibilitychange", () => body.classList.toggle("paused", document.hidden));

  /* Music */
  const mBtn = $("#musicBtn");
  const setMusic = on => { mBtn.setAttribute("aria-pressed", on); mBtn.setAttribute("aria-label", on ? "Pause background music" : "Play background music"); mBtn.textContent = on ? "♫" : "♪"; };
  const startMusic = () => music.play().then(() => setMusic(true)).catch(() => setMusic(false));
  mBtn.addEventListener("click", () => { if (music.paused) startMusic(); else { music.pause(); setMusic(false); } });
  music.addEventListener("error", () => setMusic(false));

  /* ===== Flow: envelope -> "You are invited" -> video -> invitation ===== */
  const env = $("#envelope"), intro = $("#intro"), invited = $("#invited"), film = $("#film"), vid = $("#introVideo");
  let opened = false, invTimer = 0, filmTimers = [], stage = "envelope";

  env.addEventListener("click", () => {
    if (opened) return; opened = true;
    env.classList.add("open"); env.disabled = true; startMusic(); intro.classList.add("opened");
    const sp = $("#cardSparks"); if (!reduce) {
      for (let i = 0; i < 70; i++) { const d = document.createElement("i"); d.className = "rs"; d.style.cssText = `left:${Math.random() * 100}%;top:${45 + Math.random() * 55}%;--d:${1.6 + Math.random() * 2}s;--dl:${.3 + Math.random() * 2.6}s;--h:${80 + Math.random() * 160}px;width:${2 + Math.random() * 5}px;height:${2 + Math.random() * 5}px`; sp.appendChild(d); }
      for (let i = 0; i < 12; i++) { const d = document.createElement("i"); d.className = "bk"; const z = 18 + Math.random() * 34; d.style.cssText = `left:${Math.random() * 100}%;top:${40 + Math.random() * 50}%;--d:${4 + Math.random() * 3}s;--dl:${Math.random() * 3}s;--h:${120 + Math.random() * 140}px;width:${z}px;height:${z}px`; sp.appendChild(d); }
    }
    setTimeout(() => { intro.classList.add("done"); startInvited(); setTimeout(() => { intro.hidden = true; }, 1100); }, reduce ? 300 : 0);
  });

  function startInvited() {
    stage = "invited"; body.classList.add("inviting");
    invited.hidden = false; void invited.offsetWidth; invited.classList.add("on");
    invTimer = setTimeout(startFilm, reduce ? 1500 : 5200);       // auto-advance to the video
  }
  $("#invitedSkip").addEventListener("click", startFilm);

  function startFilm() {
    if (stage !== "invited") return; stage = "film"; clearTimeout(invTimer);
    body.classList.remove("inviting"); body.classList.add("filming");
    film.hidden = false; void film.offsetWidth; film.classList.add("on");
    vid.play().catch(() => {});
    invited.classList.add("done"); setTimeout(() => { invited.hidden = true; }, 1200);
    [[200, "t1"], [reduce ? 300 : 4500, "t2"]].forEach(([ms, c]) => filmTimers.push(setTimeout(() => film.classList.add(c), ms)));
  }

  function endFilm() {
    if (stage !== "film") return; stage = "main"; filmTimers.forEach(clearTimeout);
    film.classList.add("done"); body.classList.remove("locked", "filming");
    scrollTo(0, 0); $$("#main .reveal").forEach(observe);
    setTimeout(() => { film.hidden = true; vid.pause(); }, 1300);
  }
  $("#filmEnter").addEventListener("click", endFilm);
  $("#filmSkip").addEventListener("click", endFilm);

  /* Nav */
  const menu = $("#menu"), menuBtn = $("#menuBtn");
  const closeMenu = () => { menu.classList.remove("show"); menuBtn.setAttribute("aria-expanded", false); };
  menuBtn.addEventListener("click", () => menuBtn.setAttribute("aria-expanded", menu.classList.toggle("show")));
  menu.addEventListener("click", e => { if (e.target.closest("a")) closeMenu(); });
  addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  /* Countdown */
  const target = new Date(CONFIG.target).getTime(), cd = { d: $("#cd-d"), h: $("#cd-h"), m: $("#cd-m"), s: $("#cd-s") };
  const set = (el, v) => { v = String(v).padStart(2, "0"); if (el.textContent !== v) { el.textContent = v; if (!reduce) { el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); } } };
  const timerId = setInterval(tickCd, 1000); tickCd();
  function tickCd() {
    const t = Math.max(0, target - Date.now());
    set(cd.d, Math.floor(t / 864e5)); set(cd.h, Math.floor(t / 36e5) % 24); set(cd.m, Math.floor(t / 6e4) % 60); set(cd.s, Math.floor(t / 1e3) % 60);
    if (t === 0) { clearInterval(timerId); $("#timer").hidden = true; $("#cd-done").hidden = false; }
  }

  /* Confetti */
  function confetti(el) {
    if (reduce) return;
    const r = el.getBoundingClientRect(), cols = ["#7A0F1A", "#B8872E", "#E6C77A", "#E8A317", "#C0394B"];
    for (let i = 0; i < 34; i++) {
      const c = document.createElement("i"); c.className = "confetti";
      c.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;background:${cols[i % 5]};--x:${Math.random() * 360 - 180}px;--y:${Math.random() * 300 - 200}px;--r:${Math.random() * 720}deg`;
      body.appendChild(c); setTimeout(() => c.remove(), 1700);
    }
  }

  /* Scratch cards */
  function paint(ctx, w, h, style) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    if (style === "gold") { g.addColorStop(0, "#B8872E"); g.addColorStop(.5, "#F3DC9B"); g.addColorStop(1, "#B8872E"); }
    else { g.addColorStop(0, "#7A0F1A"); g.addColorStop(.5, "#B03040"); g.addColorStop(1, "#5A0A13"); }
    ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,.25)";
    for (let i = 0; i < 90; i++) { ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, (style === "gold" ? 1.5 : 3) * (w / 400), 0, 7); ctx.fill(); }
    ctx.fillStyle = style === "gold" ? "#5A0A13" : "#F6E3B0"; ctx.textAlign = "center"; ctx.font = `600 ${w / 15}px Georgia,serif`;
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
      for (let i = 3; i < px.length; i += 64) { total++; if (px[i] < 128) clear++; }
      if (clear / total >= .4) finish();
    }
    function finish() { done = true; drawing = false; cv.classList.add("gone"); confetti(card); if (reset) reset.hidden = false; card.dispatchEvent(new CustomEvent("scratched", { bubbles: true })); }
    reset && reset.addEventListener("click", () => { done = started = false; cv.classList.remove("gone"); size(); reset.hidden = true; });
  });
  $("#save-date").addEventListener("scratched", () => {
    const sec = $("#countdown"); if (!sec.hidden) return;
    sec.hidden = false; $("#navCd").hidden = false; sec.classList.add("cd-in");
    setTimeout(() => sec.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }), reduce ? 0 : 900);
  });

  /* Function cards (poster image + details) and venue */
  const evBox = $("#eventList"), vBox = $("#venueList"); let day = 0;
  CONFIG.events.forEach(ev => {
    if (ev.day !== day) { day = ev.day; evBox.insertAdjacentHTML("beforeend", `<h3 class="day reveal">Day ${day} · ${ev.date.split(",")[0]}</h3>`); }
    evBox.insertAdjacentHTML("beforeend", `<article class="ev ${ev.cls} reveal"><span class="ic"><img src="${ev.img}" alt="${ev.name} invitation illustration" loading="lazy"></span>
      <div class="cap"><p class="tg">${ev.tag}</p><p class="when"><b>${ev.date}</b><br>${ev.time}</p><p class="vn">${CONFIG.venue}, Panvel, Navi Mumbai</p></div></article>`);
  });
  const url = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.address);
  const HANGER = '<svg class="hk" viewBox="0 -1 60 33" aria-hidden="true"><path d="M30 16V12C30 8 36 8 36 5A5 5 0 0 0 26 5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M30 16 3 29Q1 31 4 31H56Q59 31 57 29Z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg>';
  const days = [...new Set(CONFIG.wardrobe.map(e => e.day))];
  const dayName = d => CONFIG.events.find(e => e.day === d).date.split(",")[0];
  const shelves = days.map(d => { const es = CONFIG.wardrobe.filter(e => e.day === d);
    return `<div class="shelf reveal"><span class="shelf-day">Day ${d} · ${dayName(d)}</span><div class="rail${es.length === 1 ? " one" : ""}">${es.map(ev => `<div class="hg">${HANGER}<div class="hg-card"><b>${ev.name}</b>${ev.times.map(t => `<span class="hg-t">${t}</span>`).join("")}<p class="hg-d">${ev.dress}</p></div></div>`).join("")}</div></div>`; }).join("");
  vBox.innerHTML = `<article class="v"><h3>${CONFIG.venue}</h3><p>Panvel, Navi Mumbai</p>
    <p class="wd-head">The Wardrobe · Dress Code</p>
    <div class="wd">${shelves}</div>
    <a class="dir" href="${url}" target="_blank" rel="noopener">Get Directions</a></article>`;

  /* Scroll reveal */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 }) : null;
  function observe(el) { io ? io.observe(el) : el.classList.add("in"); }
})();
