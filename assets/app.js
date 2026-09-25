/* ══════════════════════════════════════════════════════════════
   ROBIX — shared behaviour
   Loaded on every page after data.js. Everything is guarded, so a
   page that lacks a given element simply skips that renderer.
   ══════════════════════════════════════════════════════════════ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => "$" + n.toLocaleString("en-US");

/* ─── UI strings the scripts write themselves ──────────────────
   English defaults live here so the repair pages (which don't load
   i18n.js) keep working. i18n.js supplies UI_JA for bilingual pages. */
const UI_EN = {
  menu: "Menu", close: "Close",
  stepMissing: "One required field on this screen is still empty.",
  anyMissing: "One required field is still empty.",
  restored: "Draft restored.", saved: "Draft saved.", sending: "Sending…",
  failed: "That didn't send. Email {email} — your answers are still saved in this browser."
};
const curLang = () => (document.documentElement.lang || "en").slice(0, 2) === "ja" ? "ja" : "en";
function ui(k){
  const ja = curLang() === "ja" && typeof UI_JA !== "undefined" ? UI_JA[k] : null;
  return ja || UI_EN[k];
}

/* ─── schematic sprite ─────────────────────────────────────────
   Injected into the document so <use href="#id"> resolves — this
   also works from file://, which a CDN-hosted sprite would not. */
document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML("afterbegin", SPRITE);
  boot();
});

function boot(){
  renderLogos();
  renderGallery();
  i18n();          /* after renderers, so rendered nodes get translated too */
  nav();
  theme();
  renderPlatforms();
  renderServices();
  renderZones();
  renderBench();
  finder();
  wizards();
  workOrderId();
}

/* ─── nav: current page + mobile drawer ──────────────────────── */
function nav(){
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".nav a.lnk").forEach(a => {
    const href = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
    if(href === here) a.setAttribute("aria-current", "page");
  });
  const b = $(".burger"), menu = $(".nav");
  if(b && menu){
    b.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      b.setAttribute("aria-expanded", String(open));
      b.textContent = open ? ui("close") : ui("menu");
    });
  }
}

/* ─── language: JA (default, written in the HTML) ⇄ EN (i18n.js) ─
   Only runs on pages with a .lang switcher. ?lang=en forces English,
   which is what a colleague pastes into an email. */
function i18n(){
  const sw = $$(".lang [data-lang]");
  if(!sw.length || typeof I18N === "undefined") return;
  const text = $$("[data-i18n]"), ph = $$("[data-i18n-ph]"), ct = $$("[data-i18n-content]");
  text.forEach(n => n._ja = n.innerHTML);
  ph.forEach(n => n._ja = n.getAttribute("placeholder"));
  ct.forEach(n => n._ja = n.getAttribute("content"));

  let cur = "ja";
  try { cur = localStorage.getItem("rbx-lang") || "ja"; } catch(e){}
  const q = new URLSearchParams(location.search).get("lang");
  if(q === "en" || q === "ja") cur = q;
  set(cur);
  sw.forEach(b => b.addEventListener("click", () => set(b.dataset.lang)));

  function set(l){
    const en = l === "en", E = I18N.en;
    const pick = (n, k) => en && E[k] != null ? E[k] : n._ja;
    document.documentElement.lang = l;
    text.forEach(n => { n.innerHTML = pick(n, n.dataset.i18n); });
    ph.forEach(n => n.setAttribute("placeholder", pick(n, n.dataset.i18nPh)));
    ct.forEach(n => n.setAttribute("content", pick(n, n.dataset.i18nContent)));
    sw.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === l)));
    $$('input[name="lang"]').forEach(i => { i.value = l; });
    const b = $(".burger");
    if(b) b.textContent = $(".nav.open") ? ui("close") : ui("menu");
    try { localStorage.setItem("rbx-lang", l); } catch(e){}
  }
}

/* ─── partner wordmarks ──────────────────────────────────────── */
function renderLogos(){
  $$("[data-logos]").forEach(h => {
    h.innerHTML = LOGOS.filter(l => l.kind === h.dataset.logos).map(l =>
      '<li class="logo">' + (l.img
        ? '<img src="' + l.img + '" alt="' + l.name + '" loading="lazy">'
        : '<span>' + l.name + '</span>') + '</li>').join("");
  });
}

/* ─── in-the-wild gallery ────────────────────────────────────── */
function renderGallery(){
  $$("[data-gallery]").forEach(h => {
    h.innerHTML = GALLERY.filter(g => g.set === h.dataset.gallery).map(g =>
      '<figure class="shot"><picture>' +
        '<source srcset="assets/img/' + g.img + '.webp" type="image/webp">' +
        '<img src="assets/img/' + g.img + '.jpg" alt="" loading="lazy"></picture>' +
      '<figcaption data-i18n="scene.' + g.scene + '">' + SCENES[g.scene] + '</figcaption></figure>'
    ).join("");
  });
}

/* ─── theme: system → light → dark ───────────────────────────── */
function theme(){
  const root = document.documentElement, t = $("#tog");
  let m = "system";
  try { m = localStorage.getItem("rbx-theme") || "system"; } catch(e){}
  set(m);
  function set(v){
    m = v;
    if(v === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", v);
    if(t) t.textContent = "Theme · " + (v === "system" ? "auto" : v);
    try { localStorage.setItem("rbx-theme", v); } catch(e){}
  }
  if(t) t.addEventListener("click", () =>
    set(m === "system" ? "light" : m === "light" ? "dark" : "system"));
}

/* ─── figure block: photo if supplied, else schematic ────────── */
/* viewBox must be repeated on the outer <svg> so width:auto can
   compute from the aspect ratio — a <use> alone gives no intrinsic size */
const ART_VB = {
  "rb-biped-tall": "0 0 112 206",
  "rb-biped-mid":  "0 0 112 170",
  "rb-biped-light":"0 0 100 146",
  "rb-quad":       "0 0 184 126",
  "rb-hand3":      "0 0 104 118",
  "rb-grip":       "0 0 104 108",
  "rb-joint":      "0 0 140 104"
};
function figure(p){
  if(p.photo){
    return '<div class="fig ' + p.size + '"><span class="tag">Photo</span>' +
      '<img src="' + p.photo + '" alt="' + p.name.replace(/"/g,"&quot;") + '"></div>';
  }
  return '<div class="fig ' + p.size + '"><span class="tag">Schematic</span>' +
    '<svg viewBox="' + (ART_VB[p.art] || "0 0 112 170") + '" role="img" ' +
    'aria-label="Line drawing of ' + p.name.replace(/"/g,"&quot;") + '">' +
    '<use href="#' + p.art + '"></use></svg></div>';
}

/* ─── platforms ──────────────────────────────────────────────── */
function renderPlatforms(){
  const card = p =>
    '<article class="card" id="p-' + p.id + '">' +
      figure(p) +
      '<div class="card-b">' +
        '<div><h3>' + p.name + '</h3>' +
        '<span class="card-sub">' + p.sub + '</span></div>' +
        '<dl class="spec">' + p.specs.map(s =>
          '<dt>' + s[0] + '</dt><dd>' + s[1] + '</dd>').join("") + '</dl>' +
        '<div><span class="lab fault-head">What we see fail</span>' +
        '<div class="chips">' + p.faults.map(f =>
          '<span class="mini">' + f + '</span>').join("") + '</div></div>' +
        (p.note ? '<p class="card-note">' + p.note + '</p>' : '') +
      '</div>' +
      '<div class="card-f"><span class="micro">$' + CONFIG.DIAG_FEE + ' on-site diagnosis</span>' +
        '<a class="btn btn-p btn-sm" href="quote.html?platform=' + p.id + '">Get a quote</a></div>' +
    '</article>';

  const r = $("#platRobots"), c = $("#platParts"), f = $("#platFeatured");
  if(r) r.innerHTML = PLATFORMS.filter(p => p.group === "robot").map(card).join("");
  if(c) c.innerHTML = PLATFORMS.filter(p => p.group === "part").map(card).join("");
  if(f) f.innerHTML = ["g1","g1edu","dex3","h2"]
    .map(id => PLATFORMS.find(p => p.id === id)).filter(Boolean).map(card).join("");
}

/* ─── service catalog + filter ───────────────────────────────── */
function renderServices(){
  const host = $("#svcCards");
  if(!host) return;

  host.innerHTML = SERVICES.map(s => {
    const cmp = s.oem
      ? '<span class="save">Repair, not replace <s>' + money(s.oem) + " " + s.oemLabel + '</s></span>'
      : (s.oemLabel ? '<span class="save">Repair, not replace <s>' + s.oemLabel + '</s></span>' : '');
    return '<article class="card" data-cat="' + s.cat + '">' +
      '<div class="card-b">' +
        '<span class="card-cat">' + s.cat + '</span>' +
        '<h3>' + s.t + '</h3>' + cmp +
        '<div class="chips">' + s.plats.map(p =>
          '<span class="mini">' + p + '</span>').join("") + '</div>' +
      '</div>' +
      '<div class="nums">' +
        '<div><span class="k">From</span><span class="v acc">' + money(s.from) + '</span></div>' +
        '<div><span class="k">Turnaround</span><span class="v' +
          (/[a-z]/i.test(s.days) ? ' txt' : '') + '">' + s.days + '</span></div>' +
      '</div></article>';
  }).join("");

  const pills = $("#svcPills");
  if(pills){
    pills.innerHTML = CATS.map((c, i) =>
      '<button class="pill" data-f="' + c.f + '" aria-pressed="' + (i === 0) + '">' +
      c.n + '</button>').join("");
    pills.addEventListener("click", ev => {
      const b = ev.target.closest(".pill");
      if(b) applyFilter(b.dataset.f);
    });
  }
  const preset = new URLSearchParams(location.search).get("cat");
  if(preset) applyFilter(preset);
  else count();

  function applyFilter(f){
    $$(".pill", pills || document).forEach(p =>
      p.setAttribute("aria-pressed", String(p.dataset.f === f)));
    $$(".card", host).forEach(c =>
      c.classList.toggle("hide", !(f === "all" || c.dataset.cat === f)));
    count();
  }
  function count(){
    const el = $("#svcCount");
    if(!el) return;
    const n = $$(".card", host).filter(c => !c.classList.contains("hide")).length;
    el.textContent = n + (n === 1 ? " service" : " services");
  }
}

/* ─── coverage board ─────────────────────────────────────────── */
function renderZones(){
  const b = $("#board");
  if(!b) return;
  b.innerHTML =
    '<div class="brow h"><span>Zone</span><span>On-site</span><span>Bench</span><span></span></div>' +
    ZONES.map(z =>
      '<div class="brow"><span class="zone">' + z.z + '<small>' + z.n + '</small></span>' +
      '<span class="eta">' + z.eta + '</span>' +
      '<span><span class="badge ' + (z.live ? "live" : "rec") + '">' +
        (z.live ? "Active" : "Recruiting") + '</span></span>' +
      '<span><a class="btn btn-gh btn-sm" href="quote.html">Quote</a></span></div>'
    ).join("");
}

/* ─── bench capability cards ─────────────────────────────────── */
function renderBench(){
  const h = $("#benchCards");
  if(!h) return;
  h.innerHTML = BENCH.map(b =>
    '<article class="bcard"><div class="bcard-h">' +
      '<span class="glyph"><svg aria-hidden="true"><use href="#' + b.i + '"></use></svg></span>' +
      '<span><h3>' + b.t + '</h3><span class="who">' + b.who + '</span></span></div>' +
    '<div class="chips">' + b.s.map(s => '<span class="mini">' + s + '</span>').join("") + '</div>' +
    '<div class="bcard-f"><span class="badge ' + (b.live ? "live" : "rec") + '">' +
      (b.live ? "Active" : "Recruiting") + '</span><span>' + b.zone + '</span>' +
      '<a class="btn btn-gh btn-sm push" href="join.html">Join</a></div>' +
    '</article>'
  ).join("");
}

/* ─── hero finder → quote page with params ───────────────────── */
function finder(){
  const go = $("#findGo");
  if(!go) return;
  go.addEventListener("click", () => {
    const p = $("#findPlatform").value, f = $("#findFault").value;
    const q = new URLSearchParams();
    if(p) q.set("platform", p);
    if(f) q.set("fault", f);
    location.href = "quote.html" + (q.toString() ? "?" + q : "");
  });
}

/* ─── work order id ──────────────────────────────────────────── */
function workOrderId(){
  const el = $("#woId");
  if(!el) return;
  const d = new Date();
  el.textContent = "WO-" + String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0") + "-" +
    Math.floor(Math.random() * 900 + 100);
}

/* ═══ MULTI-STEP FORMS ═════════════════════════════════════════ */
function collect(form){
  const o = {};
  new FormData(form).forEach((v, k) => {
    if(v === "" || v == null) return;
    if(o[k] === undefined) o[k] = v;
    else if(Array.isArray(o[k])) o[k].push(v);
    else o[k] = [o[k], v];
  });
  Object.keys(o).forEach(k => { if(Array.isArray(o[k])) o[k] = o[k].join("; "); });
  return o;
}

function wizards(){
  $$("form[data-wizard]").forEach(form => wizard(form));
}

function wizard(form){
  const panes = $$(".pane", form);
  const dots  = $("#" + form.dataset.dots);
  const bar   = $("#" + form.dataset.bar);
  const done  = $("#" + form.dataset.done);
  const err   = $(".err", form.parentNode) || $("#" + form.dataset.err);
  const saved = $(".saved", form);
  const back  = $("[data-back]", form);
  const next  = $("[data-next]", form);
  const send  = form.querySelector('button[type="submit"]');
  const fine  = $("[data-fine]", form);
  const key   = form.dataset.key;
  let i = 0;

  function paint(){
    panes.forEach((p, n) => p.classList.toggle("on", n === i));
    if(dots) [...dots.children].forEach((d, n) => {
      d.classList.toggle("on", n === i);
      d.classList.toggle("past", n < i);
    });
    if(bar) bar.style.width = ((i + 1) / panes.length * 100) + "%";
    back.hidden = i === 0;
    next.hidden = i === panes.length - 1;
    send.hidden = i !== panes.length - 1;
    if(fine) fine.hidden = i !== panes.length - 1;
    err.classList.remove("on");
  }
  function stepValid(){
    const bad = panes[i].querySelector(":invalid");
    if(bad){
      bad.focus();
      bad.scrollIntoView({block:"center", behavior:"smooth"});
      err.textContent = ui("stepMissing");
      err.classList.add("on");
      return false;
    }
    return true;
  }

  next.addEventListener("click", () => {
    if(!stepValid()) return;
    i++; paint();
    form.scrollIntoView({block:"nearest", behavior:"smooth"});
  });
  back.addEventListener("click", () => { i--; paint(); });

  /* draft persistence — a four-screen form must survive a closed tab */
  try{
    const raw = localStorage.getItem(key);
    if(raw){
      const d = JSON.parse(raw);
      Object.keys(d).forEach(name => {
        const vals = String(d[name]).split("; ");
        $$('[name="' + name + '"]', form).forEach(n => {
          if(n.type === "checkbox" || n.type === "radio"){
            if(vals.indexOf(n.value) !== -1) n.checked = true;
          } else n.value = d[name];
        });
      });
      if(saved) saved.textContent = ui("restored");
    }
  }catch(e){}

  let t = null;
  form.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      try{
        localStorage.setItem(key, JSON.stringify(collect(form)));
        if(saved) saved.textContent = ui("saved");
      }catch(e){}
    }, 600);
  });

  form.addEventListener("submit", ev => {
    ev.preventDefault();
    if(!form.checkValidity()){
      const bad = form.querySelector(":invalid");
      const pane = bad && bad.closest(".pane");
      if(pane){
        i = panes.indexOf(pane); paint();
        bad.focus(); bad.scrollIntoView({block:"center", behavior:"smooth"});
        err.textContent = ui("anyMissing");
        err.classList.add("on");
      }
      return;
    }
    const data = collect(form);
    data.submitted_at = new Date().toISOString();
    data.page_url = location.href;
    if("lang" in data) data.lang = curLang();   /* the language they were reading at submit */

    const ok = () => {
      try{ localStorage.removeItem(key); }catch(e){}
      form.classList.add("gone");
      if(dots) dots.classList.add("gone");
      if(saved) saved.textContent = "";
      done.classList.add("on");
      done.scrollIntoView({block:"center", behavior:"smooth"});
    };

    if(!CONFIG.ENDPOINT || CONFIG.ENDPOINT === "PASTE_YOUR_ENDPOINT_HERE"){
      const body = Object.keys(data)
        .map(k => k.replace(/_/g, " ") + ": " + data[k]).join("\n");
      location.href = "mailto:" + CONFIG.FALLBACK_EMAIL +
        "?subject=" + encodeURIComponent(form.dataset.subject) +
        "&body=" + encodeURIComponent(body);
      ok();
      return;
    }

    send.disabled = true;
    const lbl = send.textContent;
    send.textContent = ui("sending");
    /* Both wizards post to the same endpoint. Send the per-form subject so a
       work order and a bench application are distinguishable in the inbox.
       `subject` is Formspree's special field for the Subject header (NOT
       `_subject`, which is not recognised and would show up as a body field).
       Set here, not in `data` above, to keep the mailto fallback body clean. */
    if(form.dataset.subject) data.subject = form.dataset.subject;
    fetch(CONFIG.ENDPOINT, {
      method: "POST",
      headers: {"Content-Type":"application/json", Accept:"application/json"},
      body: JSON.stringify(data)
    })
      .then(r => { if(!r.ok) throw 0; ok(); })
      .catch(() => {
        send.disabled = false;
        send.textContent = lbl;
        err.innerHTML = ui("failed").replace("{email}", '<a href="mailto:' +
          CONFIG.FALLBACK_EMAIL + '">' + CONFIG.FALLBACK_EMAIL + '</a>');
        err.classList.add("on");
      });
  });

  /* prefill from the hero finder */
  const q = new URLSearchParams(location.search);
  const PLAT = {g1:"Unitree G1 (base)", g1edu:"Unitree G1 EDU", g1pro:"Unitree G1 Pro",
    r1:"Unitree R1 / R1 Air", h1:"Unitree H1", h2:"Unitree H2 / H2 Plus",
    quad:"Unitree Go2 / B2", booster:"Booster T1", other:"Other"};
  const SYM = {hand:"Hand: finger won't actuate", joint:"Joint won't move",
    fall:"Fall damage", power:"Won't power on", sensor:"LiDAR / camera",
    compute:"Won't boot"};
  const sel = $("#i_model", form);
  if(sel && q.get("platform") && PLAT[q.get("platform")]){
    [...sel.options].forEach(o => { if(o.text === PLAT[q.get("platform")]) sel.value = o.value; });
  }
  if(q.get("fault") && SYM[q.get("fault")]){
    const box = form.querySelector('input[value="' + SYM[q.get("fault")] + '"]');
    if(box) box.checked = true;
    const st = form.querySelector('input[name="status"][value="Down — unusable"]');
    if(st) st.checked = true;
  }

  paint();
}
