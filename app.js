/* ============ Buddy app — logika ============ */
(function () {
  "use strict";

  var KEY = "buddyapp:v1";

  /* ---------- stan trwały ---------- */
  function defaultState() {
    return {
      buddy: { match: null, sessions: {} },           // sessions: {1:{done,support,safety,note,date}}
      week: { pss: [], uwes: [], cbt: [], selfcomp: [] },
      knowhow: { done: {}, checks: {} },              // done:{id:true}, checks:{id:{stepIdx:true}}
      expect: { canvas: null, checkins: [] }          // canvas:{role,priorities,success,updated}
    };
  }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); return s && s.buddy ? s : null; }
    catch (e) { return null; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  var state = load() || defaultState();
  if (!state.knowhow) state.knowhow = { done: {}, checks: {} };   // migracja starszych zapisów
  if (!state.expect) state.expect = { canvas: null, checkins: [] };

  /* ---------- stan ulotny (UI) ---------- */
  var ui = {
    startedQuiz: false, buddyStep: 0, buddyAnswers: {},
    openSession: null, sessErr: null,
    week: { mode: "home", answers: {}, lastTool: null },
    knowhow: { openId: null, quiz: null },
    expect: { mode: "home" }
  };

  /* ---------- pomocnicze ---------- */
  function esc(s) {
    return (s == null ? "" : String(s)).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function last(a) { return a && a.length ? a[a.length - 1] : null; }
  function fmtDate(ts) {
    try { return new Date(ts).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" }); }
    catch (e) { return ""; }
  }
  function findBand(bands, val) {
    for (var i = 0; i < bands.length; i++) if (val <= bands[i].max) return bands[i];
    return bands[bands.length - 1];
  }
  function whyBox(o) {
    return '<div class="why"><div class="why-title">' + ic("bulb") + ' ' + esc(o.title) + "</div><p>" + o.body + "</p>" +
      (o.cite ? '<cite style="font-size:12px;display:block;margin-top:6px">' + esc(o.cite) + "</cite>" : "") + "</div>";
  }

  /* ---------- scoring ---------- */
  function scorePSS(ans) {
    var s = 0;
    for (var i = 0; i < PSS10.items.length; i++) {
      var v = ans[i]; v = PSS10.items[i].r ? (4 - v) : v; s += v;
    }
    return s;
  }
  function scoreUWES(ans) {
    var s = 0; for (var i = 0; i < UWES9.items.length; i++) s += ans[i];
    return Math.round((s / UWES9.items.length) * 10) / 10;
  }
  function computeMatch(answers) {
    var tags = [];
    BUDDY_QUIZ.forEach(function (q) {
      var idx = answers[q.id];
      if (idx != null) q.options[idx].tags.forEach(function (t) { tags.push(t); });
    });
    var areaIdx = answers["area"];
    var area = areaIdx != null ? BUDDY_QUIZ[BUDDY_QUIZ.length - 1].options[areaIdx].tags[0] : "product";
    var best = BUDDIES[0], bestScore = -1, bestReasons = [];
    BUDDIES.forEach(function (b) {
      var inter = b.tags.filter(function (t) { return tags.indexOf(t) !== -1; });
      if (inter.length > bestScore) { bestScore = inter.length; best = b; bestReasons = inter; }
    });
    if (!SENIORS[area]) area = "product";
    return { buddyId: best.id, reasons: bestReasons.slice(0, 3), area: area };
  }

  /* ---------- widok: START ---------- */
  function viewStart() {
    var m = state.buddy.match;
    var buddy = m ? BUDDIES.filter(function (b) { return b.id === m.buddyId; })[0] : null;
    var ss = state.buddy.sessions;
    var khDone = Object.keys(state.knowhow.done).length;
    var steps = [
      { done: !!m, label: "Dopasuj buddy'ego", route: "buddy" },
      { done: !!(ss[1] && ss[1].done), label: "Sesja 1 — Poznajmy się", route: "buddy" },
      { done: !!(ss[2] && ss[2].done), label: "Sesja 2 — Rozkład jazdy", route: "buddy" },
      { done: !!(ss[4] && ss[4].done), label: "Sesja 4 — Co dalej", route: "buddy" },
      { done: state.week.pss.length > 0, label: "Pierwszy check-in PSS-10", route: "week" },
      { done: khDone > 0, label: "Pierwsza mikro-lekcja (Know-How)", route: "knowhow" },
      { done: !!state.expect.canvas, label: "Wypełnij kanwę oczekiwań", route: "expectations" }
    ];
    var doneCount = steps.filter(function (s) { return s.done; }).length;
    var pct = Math.round(doneCount / steps.length * 100);
    var lastP = last(state.week.pss), lastU = last(state.week.uwes);

    return '<div class="screen">' +
      '<div class="hero"><div class="hero-eyebrow">Buddy app</div>' +
      '<h1 class="hero-title">Cześć!</h1>' +
      '<p class="hero-sub">Przeprowadzimy Cię przez pierwsze tygodnie w nowej pracy — krok po kroku, bez przeciążenia.</p></div>' +

      '<div class="card"><div class="card-title">' + ic("chart") + ' Twój postęp pierwszych tygodni</div>' +
      '<div class="progress"><i style="width:' + pct + '%"></i></div>' +
      '<div class="progress-label">' + doneCount + " z " + steps.length + " kroków • " + pct + "%</div>" +
      '<ul style="list-style:none;padding:0;margin:12px 0 0;display:flex;flex-direction:column;gap:8px">' +
      steps.map(function (s) {
        return '<li style="' + (s.done ? "" : "opacity:.6") + '"><a href="#' + s.route +
          '" style="text-decoration:none;color:inherit">' + (s.done ? ic("check-circle") : ic("circle")) + " " + esc(s.label) + "</a></li>";
      }).join("") + "</ul></div>" +

      ((lastP || lastU) ?
        '<div class="card"><div class="card-title">' + ic("heart") + ' Ostatni pomiar</div>' +
        (lastP ? '<div class="list-meta" style="margin:4px 0"><span>Stres (PSS-10)</span><span><b>' + lastP.score + "/40</b> &nbsp;<span class=\"badge badge-" + lastP.cls + '">' + esc(lastP.label) + "</span></span></div>" : "") +
        (lastU ? '<div class="list-meta" style="margin:4px 0"><span>Zaangażowanie (UWES-9)</span><span><b>' + lastU.score + "/6</b> &nbsp;<span class=\"badge badge-" + lastU.cls + '">' + esc(lastU.label) + "</span></span></div>" : "") +
        "</div>" : "") +

      '<div class="section-label">Moduły</div>' +
      '<div class="tile-grid">' +
        '<a class="tile" href="#buddy"><div class="tile-ico">' + ic("users") + '</div><div class="tile-name">Buddy Match</div><div class="tile-desc">' +
          (m ? "Twój buddy: " + esc(buddy.name) : "Dobierz mentora i ucz się od kogoś bliskiego") + "</div></a>" +
        '<a class="tile" href="#knowhow"><div class="tile-ico">' + ic("book") + '</div><div class="tile-name">Know-How na teraz</div><div class="tile-desc">' + (khDone ? khDone + " z " + LESSONS.length + " mikro-lekcji" : "Wiedza w małych porcjach, gdy jej potrzebujesz") + "</div></a>" +
        '<a class="tile" href="#expectations"><div class="tile-ico">' + ic("target") + '</div><div class="tile-name">Jasne Oczekiwania</div><div class="tile-desc">' + (state.expect.canvas ? state.expect.checkins.length + " check-in(ów)" : "Kanwa oczekiwań i check-in z przełożonym") + "</div></a>" +
        '<a class="tile" href="#week"><div class="tile-ico">' + ic("heart") + '</div><div class="tile-name">Twój tydzień</div><div class="tile-desc">Krótki pomiar stresu i zaangażowania</div></a>' +
      "</div></div>";
  }

  /* ---------- widok: BUDDY MATCH ---------- */
  function viewBuddy() {
    if (state.buddy.match) return buddyMatchView();
    if (ui.startedQuiz) return buddyQuizView();
    return buddyIntroView();
  }
  function buddyIntroView() {
    return '<div class="screen">' +
      '<div class="hero"><div class="hero-eyebrow">Moduł 1</div><h1 class="hero-title">' + ic("users") + ' Buddy Match</h1>' +
      "<p class=\"hero-sub\">Dobierzemy Ci <b>buddy'ego</b> (kolega 1–2 lata stażu) i <b>seniora-eksperta</b>, a potem przeprowadzimy Was przez 3 krótkie sesje 1:1.</p></div>" +
      whyBox(THEORY.buddy) +
      '<div class="card"><div class="card-title">Jak to działa</div>' +
      '<ul class="agenda"><li>Wypełniasz krótki quiz (5 pytań)</li><li>Dostajesz dopasowanego buddy\'ego i seniora</li><li>Realizujecie sesje w tyg. 1, 2 i 4 wg gotowych scenariuszy</li></ul>' +
      '<button class="btn btn-primary btn-block" data-act="start-quiz">Znajdź swojego buddy\'ego →</button></div>' +
      '<p class="demo-note">To prototyp — buddy i senior są przykładowi (dane demo).</p></div>';
  }
  function buddyQuizView() {
    var step = ui.buddyStep, q = BUDDY_QUIZ[step], total = BUDDY_QUIZ.length;
    var chosen = ui.buddyAnswers[q.id];
    return '<div class="screen">' +
      '<div class="stepper">Pytanie ' + (step + 1) + " z " + total + "</div>" +
      '<div class="progress"><i style="width:' + Math.round(step / total * 100) + '%"></i></div>' +
      '<h2 class="q-title">' + esc(q.q) + "</h2>" +
      '<div class="choice-list">' +
      q.options.map(function (o, i) {
        return '<button class="choice ' + (chosen === i ? "selected" : "") + '" data-act="answer" data-q="' + q.id + '" data-i="' + i + '">' +
          "<span>" + esc(o.label) + '</span><span class="dot" style="margin-left:auto"></span></button>';
      }).join("") + "</div>" +
      '<div class="btn-row">' + (step > 0 ? '<button class="btn btn-ghost" data-act="quiz-back">← Wstecz</button>' : "") + "</div></div>";
  }
  function buddyMatchView() {
    var m = state.buddy.match;
    var b = BUDDIES.filter(function (x) { return x.id === m.buddyId; })[0];
    var s = SENIORS[m.area] || SENIORS.product;
    return '<div class="screen">' +
      '<div class="hero"><div class="hero-eyebrow">Moduł 1 · Buddy Match</div><h1 class="hero-title">Twoje dopasowanie ' + ic("sparkle") + '</h1>' +
      '<p class="hero-sub">Oto osoby, które przeprowadzą Cię przez start. Umów się na sesje wg planu poniżej.</p></div>' +

      '<div class="card"><div class="match-card"><div class="avatar"><span>' + esc(b.name.charAt(0)) + "</span></div>" +
      '<div class="match-meta"><div class="match-name">' + esc(b.name) + ' <span class="pill">buddy</span></div>' +
      '<div class="match-role">' + esc(b.role) + " • " + b.years + " roku stażu</div>" +
      '<p style="margin:8px 0 0;font-size:14px">' + esc(b.blurb) + "</p>" +
      (m.reasons.length ? '<ul class="reasons">' + m.reasons.map(function (t) { return "<li>" + esc(TAG_LABELS[t] || t) + "</li>"; }).join("") + "</ul>" : "") +
      "</div></div>" +
      '<hr class="divider">' +
      '<div class="match-card"><div class="avatar senior"><span>' + esc(s.name.charAt(0)) + "</span></div>" +
      '<div class="match-meta"><div class="match-name">' + esc(s.name) + ' <span class="pill">senior-ekspert</span></div>' +
      '<div class="match-role">' + esc(s.role) + "</div>" +
      '<p style="margin:8px 0 0;font-size:14px">Pomoże Ci w temacie: ' + esc(s.expertise) + ".</p></div></div></div>" +

      whyBox(THEORY.buddy) +

      '<div class="section-label">Plan 3 sesji 1:1</div>' +
      '<div class="session-list">' + SESSIONS.map(sessionCard).join("") + "</div>" +
      '<div class="btn-row" style="margin-top:14px"><button class="btn btn-secondary btn-sm" data-act="rematch">Dopasuj ponownie</button></div></div>';
  }
  function scale5(name, val) {
    var out = '<div class="scale">';
    for (var i = 1; i <= 5; i++)
      out += '<label class="scale-opt"><input type="radio" name="' + name + '" value="' + i + '" ' + (val == i ? "checked" : "") + "><span>" + i + "</span></label>";
    return out + "</div>";
  }
  function sessionForm(se, saved) {
    var sup = saved ? saved.support : 0, saf = saved ? saved.safety : 0, note = saved ? saved.note : "";
    return '<div class="card tight" style="margin-top:10px;background:var(--surface-2)">' +
      '<div class="field"><label>' + esc(POST_SESSION[0].label) + "</label>" + scale5("support", sup) + "</div>" +
      '<div class="field"><label>' + esc(POST_SESSION[1].label) + "</label>" + scale5("safety", saf) + "</div>" +
      '<div class="field"><label>' + esc(POST_SESSION[2].label) + '</label><textarea id="sess-note" placeholder="np. ustaliliśmy kolejny termin...">' + esc(note) + "</textarea></div>" +
      (ui.sessErr ? '<p style="color:var(--danger);font-size:13px;margin:0 0 8px">' + esc(ui.sessErr) + "</p>" : "") +
      '<div class="btn-row"><button class="btn btn-primary btn-sm" data-act="save-session" data-week="' + se.week + '">Zapisz</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="cancel-session">Anuluj</button></div></div>';
  }
  function sessionCard(se) {
    var saved = state.buddy.sessions[se.week];
    var done = saved && saved.done;
    var open = ui.openSession === se.week;
    var body =
      '<div class="session-goal">' + esc(se.goal) + "</div>" +
      '<div><b style="font-size:13px">Agenda</b><ul class="agenda">' + se.agenda.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul></div>" +
      '<div><b style="font-size:13px">Pytania „secure base”</b>' + se.secureBase.map(function (q) { return '<div class="sb-q">' + ic("chat") + ' ' + esc(q) + "</div>"; }).join("") + "</div>";
    var foot;
    if (open) foot = sessionForm(se, saved);
    else if (done) foot = '<div class="list-meta" style="margin-top:10px"><span>Wsparcie: ' + saved.support + "/5 • Bezpieczeństwo: " + saved.safety + "/5</span>" +
      '<button class="btn btn-ghost btn-sm" data-act="open-session" data-week="' + se.week + '">Edytuj</button></div>' +
      (saved.note ? '<p style="font-size:13px;color:var(--muted);margin:6px 0 0">„' + esc(saved.note) + "”</p>" : "");
    else foot = '<button class="btn btn-primary btn-sm" data-act="open-session" data-week="' + se.week + '" style="margin-top:10px">Po sesji: krótka ankieta →</button>';
    return '<div class="session ' + (done ? "done" : "") + '"><div class="session-head"><div>' +
      '<span class="session-week">Tydzień ' + se.week + "</span> — " + esc(se.title) +
      (done ? ' <span class="badge badge-low">odbyta</span>' : "") + "</div></div>" + body + foot + "</div>";
  }

  /* ---------- widok: moduły w budowie ---------- */
  function viewPreview(p) {
    return '<div class="screen">' +
      '<div class="hero"><div class="hero-eyebrow">Moduł • w budowie</div><h1 class="hero-title">' + p.emoji + " " + esc(p.name) + "</h1>" +
      '<p class="hero-sub">Ten moduł powstaje. Poniżej to, co się w nim znajdzie.</p></div>' +
      '<div class="card"><div class="card-title">Problem z raportu</div><p class="card-sub" style="margin:0">' + esc(p.problem) + "</p></div>" +
      '<div class="card"><div class="card-title">Co znajdzie się w module</div><ul class="agenda">' +
      p.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul></div>" +
      whyBox({ title: "Podstawa psychologiczna", body: esc(p.theory), cite: "" }) +
      '<a class="btn btn-secondary btn-block" href="#start">← Wróć na start</a></div>';
  }

  /* ---------- widok: JASNE OCZEKIWANIA ---------- */
  function valOf(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
  function exErr(m) { var e = document.getElementById("exErr"); if (e) e.textContent = m; }
  function clarityBand(v) { return v >= 75 ? { label: "wysoka", cls: "low" } : v >= 50 ? { label: "średnia", cls: "mid" } : { label: "niska", cls: "high" }; }
  function prefField(prefix, f, val) {
    var id = prefix + "-" + f.key;
    if (f.type === "range") {
      var v = (val == null ? 50 : val);
      return '<div class="field"><label>' + esc(f.label) + ': <span id="val-' + id + '">' + v + "</span>/100</label>" +
        '<input type="range" min="0" max="100" value="' + v + '" id="' + id + '" data-act="range" data-target="val-' + id + '" style="width:100%"></div>';
    }
    return '<div class="field"><label>' + esc(f.label) + '</label><textarea id="' + id + '" placeholder="' + esc(f.ph || "") + '">' + esc(val || "") + "</textarea></div>";
  }
  function viewExpect() {
    if (ui.expect.mode === "canvas") return expectCanvasView();
    if (ui.expect.mode === "checkin") return expectCheckinView();
    return expectHome();
  }
  function expectHome() {
    var c = state.expect.canvas, ch = state.expect.checkins;
    var lastC = ch.length ? ch[ch.length - 1] : null;
    var clarityArr = ch.map(function (e) { return { score: e.clarity, date: e.date }; });
    return '<div class="screen">' +
      '<div class="hero"><div class="hero-eyebrow">Moduł 3</div><h1 class="hero-title">' + ic("target") + ' Jasne Oczekiwania</h1>' +
      '<p class="hero-sub">Zamień mgłę w konkrety: ustal oczekiwania i prowadź 15-minutowe check-iny z przełożonym.</p></div>' +
      whyBox(EXPECT_THEORY) +
      (c ?
        '<div class="card"><div class="card-title">' + ic("compass") + ' Kanwa oczekiwań</div>' +
          '<p style="margin:.2em 0;font-size:14px"><b>Rola:</b> ' + esc(c.role) + "</p>" +
          (c.priorities ? '<p style="margin:.2em 0;font-size:14px"><b>Priorytety:</b> ' + esc(c.priorities) + "</p>" : "") +
          (c.success ? '<p style="margin:.2em 0;font-size:14px"><b>Sukces:</b> ' + esc(c.success) + "</p>" : "") +
          '<button class="btn btn-secondary btn-sm" data-act="ex-canvas" style="margin-top:8px">Edytuj kanwę</button></div>'
        : '<div class="card" style="border:1.5px solid var(--primary)"><div class="card-title">' + ic("compass") + ' Zacznij od kanwy oczekiwań</div>' +
          '<p class="card-sub" style="margin:0 0 10px">Nazwij swoją rolę, priorytety i kryteria sukcesu — to fundament jasności.</p>' +
          '<button class="btn btn-primary btn-block" data-act="ex-canvas">Wypełnij kanwę →</button></div>') +
      '<div class="card"><div class="card-title">' + ic("barchart") + ' Jasność zadań (0–100)</div>' +
        (lastC ? resultRow({ score: lastC.clarity, label: clarityBand(lastC.clarity).label, cls: clarityBand(lastC.clarity).cls }, "/100") + trendBars(clarityArr, 100, "accent")
               : '<p class="card-sub" style="margin:0">Zrób pierwszy check-in, aby zmierzyć jasność.</p>') + "</div>" +
      '<div class="card"><div class="card-title">' + ic("clipboard") + ' Weekly 15 — check-in z przełożonym</div>' +
        '<p class="card-sub">Struktura: co działa / co blokuje / co konkretnie zrobimy.</p>' +
        '<button class="btn btn-primary btn-block" data-act="ex-checkin">Nowy check-in →</button></div>' +
      (ch.length ? '<div class="section-label">Historia check-inów</div>' + ch.slice().reverse().slice(0, 6).map(function (e) {
        var b = clarityBand(e.clarity);
        return '<div class="card tight"><div class="list-meta"><span class="pill">' + fmtDate(e.date) + '</span><span class="badge badge-' + b.cls + '">jasność ' + e.clarity + "/100</span></div>" +
          (e.next ? '<p style="font-size:14px;margin:8px 0 0"><b>Następny krok:</b> ' + esc(e.next) + "</p>" : "") +
          (e.ifthen ? '<p style="font-size:13px;color:var(--muted);margin:6px 0 0">' + esc(e.ifthen) + "</p>" : "") + "</div>";
      }).join("") : "") +
      "</div>";
  }
  function expectCanvasView() {
    var c = state.expect.canvas || {};
    return '<div class="screen">' +
      '<button class="btn btn-ghost btn-sm" data-act="ex-home">← Wróć</button>' +
      '<div class="hero" style="margin-top:10px"><h1 class="hero-title" style="font-size:24px">' + ic("compass") + ' Kanwa oczekiwań</h1>' +
      '<p class="hero-sub">Uzupełnij raz na start, wracaj i aktualizuj.</p></div>' +
      '<div class="card">' + CANVAS_FORM.map(function (f) { return prefField("canvas", f, c[f.key]); }).join("") +
      '<p id="exErr" style="color:var(--danger);font-size:13px;min-height:18px;margin:0"></p>' +
      '<div class="btn-row"><button class="btn btn-primary" data-act="ex-canvas-save">Zapisz kanwę</button>' +
      '<button class="btn btn-ghost" data-act="ex-home">Anuluj</button></div></div></div>';
  }
  function expectCheckinView() {
    return '<div class="screen">' +
      '<button class="btn btn-ghost btn-sm" data-act="ex-home">← Wróć</button>' +
      '<div class="hero" style="margin-top:10px"><h1 class="hero-title" style="font-size:24px">' + ic("clipboard") + ' Weekly 15 — check-in</h1>' +
      '<p class="hero-sub">15-minutowy, ustrukturyzowany check-in. Wypełnij przed rozmową lub w jej trakcie.</p></div>' +
      whyBox(EXPECT_THEORY) +
      '<div class="card">' + CHECKIN_FORM.map(function (f) { return prefField("checkin", f, f.type === "range" ? null : ""); }).join("") +
      '<p id="exErr" style="color:var(--danger);font-size:13px;min-height:18px;margin:0"></p>' +
      '<div class="btn-row"><button class="btn btn-primary" data-act="ex-checkin-save">Zapisz check-in</button>' +
      '<button class="btn btn-ghost" data-act="ex-home">Anuluj</button></div></div></div>';
  }

  /* ---------- widok: KNOW-HOW NA TERAZ ---------- */
  function viewKnowhow() {
    if (ui.knowhow.openId) return knowhowLesson();
    return knowhowHome();
  }
  function lessonCard(l) {
    var done = state.knowhow.done[l.id];
    var s = (l.title + " " + l.category + " " + l.task).toLowerCase();
    return '<button class="kh-item session" data-act="kh-open" data-id="' + l.id + '" data-search="' + esc(s) + '" style="cursor:pointer;text-align:left;width:100%;font:inherit;display:block">' +
      '<div class="session-head"><div><span class="li-ico">' + ic(l.icon) + '</span> <span class="session-week">' + esc(l.title) + "</span></div>" +
      (done ? '<span class="badge badge-low">✓ zaliczone</span>' : '<span class="pill">' + l.time + " min</span>") + "</div>" +
      '<div style="margin-top:6px"><span class="chip">' + esc(l.category) + "</span>" + (l.top10 ? ' <span class="chip accent">TOP 10</span>' : "") + "</div></button>";
  }
  function knowhowHome() {
    var total = LESSONS.length;
    var doneCount = LESSONS.filter(function (l) { return state.knowhow.done[l.id]; }).length;
    var pct = Math.round(doneCount / total * 100);
    var next = LESSONS.filter(function (l) { return !state.knowhow.done[l.id]; })[0];
    return '<div class="screen">' +
      '<div class="hero"><div class="hero-eyebrow">Moduł 2</div><h1 class="hero-title">' + ic("book") + ' Know-How na teraz</h1>' +
      '<p class="hero-sub">Wiedza w małych porcjach — dokładnie wtedy, gdy masz realne zadanie. Bez całodniowych szkoleń.</p></div>' +
      whyBox(KH_THEORY) +
      (next ?
        '<div class="card" style="border:1.5px solid var(--primary)"><div class="card-title">' + ic("sparkle") + ' 1 rzecz na dziś</div>' +
        '<p class="card-sub" style="margin:0 0 10px">' + esc(next.task) + "</p>" +
        '<button class="btn btn-primary btn-block" data-act="kh-open" data-id="' + next.id + '">' + esc(next.title) + " • " + next.time + " min →</button></div>"
        : '<div class="card"><div class="card-title">' + ic("sparkle") + ' Wszystkie mikro-lekcje ukończone!</div><p class="card-sub" style="margin:0">Świetna robota. Wróć tu, gdy pojawi się nowe zadanie.</p></div>') +
      '<div class="card"><div class="card-title">Postęp nauki</div><div class="progress"><i style="width:' + pct + '%"></i></div>' +
      '<div class="progress-label">' + doneCount + " z " + total + " mikro-lekcji • " + pct + "%</div></div>" +
      '<div class="section-label">Baza wiedzy i mikro-lekcje</div>' +
      '<input id="khSearch" type="text" placeholder="Szukaj procedury lub tematu…" autocomplete="off" style="width:100%;font:inherit;padding:11px 12px;border:1.5px solid var(--line);border-radius:12px;margin-bottom:12px">' +
      '<div id="khList" class="session-list">' + LESSONS.map(lessonCard).join("") + "</div></div>";
  }
  function knowhowLesson() {
    var l = LESSONS.filter(function (x) { return x.id === ui.knowhow.openId; })[0];
    if (!l) { ui.knowhow.openId = null; return knowhowHome(); }
    var checks = state.knowhow.checks[l.id] || {};
    var done = state.knowhow.done[l.id];
    var q = l.quiz, qs = ui.knowhow.quiz;
    var stepsHtml = l.steps.map(function (s, i) {
      var on = !!checks[i];
      return '<label style="display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--line);cursor:pointer">' +
        '<input type="checkbox" data-act="kh-check" data-id="' + l.id + '" data-i="' + i + '" ' + (on ? "checked" : "") + ' style="margin-top:3px;flex:none">' +
        '<span style="' + (on ? "opacity:.6;text-decoration:line-through" : "") + '">' + esc(s) + "</span></label>";
    }).join("");
    var quizHtml;
    if (qs && qs.answered) {
      quizHtml = '<div class="why" style="border-left-color:' + (qs.correct ? "var(--ok)" : "var(--danger)") + '">' +
        '<p style="margin:0;font-weight:700">' + (qs.correct ? ic("check-circle") + " Dobrze!" : ic("x-circle") + " Niezupełnie") + "</p>" +
        '<p style="margin:6px 0 0;font-size:14px">Poprawna odpowiedź: <b>' + esc(q.options[q.correct]) + "</b></p>" +
        (qs.correct ? "" : '<button class="btn btn-secondary btn-sm" data-act="kh-retry" data-id="' + l.id + '" style="margin-top:10px">Spróbuj ponownie</button>') + "</div>";
    } else {
      quizHtml = '<div class="choice-list">' + q.options.map(function (o, i) {
        return '<button class="choice" data-act="kh-answer" data-id="' + l.id + '" data-i="' + i + '"><span class="dot"></span><span>' + esc(o) + "</span></button>";
      }).join("") + "</div>";
    }
    return '<div class="screen">' +
      '<button class="btn btn-ghost btn-sm" data-act="kh-back">← Wszystkie lekcje</button>' +
      '<div class="hero" style="margin-top:10px"><h1 class="hero-title" style="font-size:23px">' + ic(l.icon) + " " + esc(l.title) + "</h1>" +
      '<p class="hero-sub"><span class="chip">' + esc(l.category) + '</span> <span class="pill">' + l.time + " min</span>" + (done ? ' <span class="badge badge-low">✓ zaliczone</span>' : "") + "</p></div>" +
      '<div class="why"><div class="why-title">' + ic("clock") + ' Dlaczego teraz</div><p>' + esc(l.task) + " Ucz się tej jednej rzeczy w kontekście realnego zadania — to odciąża pamięć roboczą.</p></div>" +
      '<div class="card"><div class="card-title">Kroki</div>' + stepsHtml + "</div>" +
      '<div class="card"><div class="card-title">' + ic("feather") + ' Sprawdź się</div><p class="card-sub" style="margin:0 0 10px">' + esc(q.q) + "</p>" + quizHtml + "</div></div>";
  }

  /* ---------- widok: TYDZIEŃ ---------- */
  function viewWeek() {
    var mode = ui.week.mode;
    if (mode === "pss") return weekScaleView("pss", PSS10);
    if (mode === "uwes") return weekScaleView("uwes", UWES9);
    if (mode === "cbt") return weekFormView("cbt", CBT_FORM, THEORY.cbt, "Zapis myśli (CBT)", "feather");
    if (mode === "selfcomp") return weekFormView("selfcomp", SELFCOMP_FORM, THEORY.selfcomp, "Chwila życzliwości dla siebie", "heart");
    if (mode === "result") return weekResultView();
    return weekHome();
  }
  function resultRow(e, suf) {
    return '<div class="list-meta"><span><b style="font-size:20px;color:var(--text)">' + e.score +
      '<small style="color:var(--muted);font-weight:600">' + suf + '</small></b></span><span class="badge badge-' + e.cls + '">' + esc(e.label) + "</span></div>";
  }
  function trendBars(arr, maxv, cls) {
    var items = arr.slice(-6);
    if (items.length < 2) return '<p class="card-sub" style="margin:8px 0 0">Wypełnij kilka razy w różnych dniach, aby zobaczyć trend.</p>';
    return '<div class="trend">' + items.map(function (e) {
      var hh = Math.max(8, Math.round(e.score / maxv * 100));
      return '<div class="spark ' + cls + '" style="height:' + hh + '%"><b>' + e.score + "</b></div>";
    }).join("") + "</div><div class=\"trend-x\">" + items.map(function (e) { return "<span>" + fmtDate(e.date) + "</span>"; }).join("") + "</div>";
  }
  function weekHome() {
    var lastP = last(state.week.pss), lastU = last(state.week.uwes);
    return '<div class="screen">' +
      '<div class="hero"><div class="hero-eyebrow">Twój tydzień</div><h1 class="hero-title">' + ic("heart") + ' Jak się masz?</h1>' +
      '<p class="hero-sub">Krótkie, regularne pomiary i ćwiczenia. To Twoje prywatne dane — zapisane lokalnie w przeglądarce.</p></div>' +

      '<div class="card"><div class="card-title">' + ic("pulse") + ' PSS-10 — poziom stresu</div><p class="card-sub">10 pytań • ~2 min</p>' +
      (lastP ? resultRow(lastP, "/40") + trendBars(state.week.pss, 40, "") : '<p class="card-sub" style="margin:0">Jeszcze nie wypełniono.</p>') +
      '<button class="btn btn-primary btn-block" data-act="week-open" data-tool="pss" style="margin-top:12px">' + (lastP ? "Wypełnij ponownie" : "Wypełnij PSS-10") + "</button></div>" +

      '<div class="card"><div class="card-title">' + ic("flame") + ' UWES-9 — zaangażowanie</div><p class="card-sub">9 pytań • ~2 min</p>' +
      (lastU ? resultRow(lastU, "/6") + trendBars(state.week.uwes, 6, "accent") : '<p class="card-sub" style="margin:0">Jeszcze nie wypełniono.</p>') +
      '<button class="btn btn-primary btn-block" data-act="week-open" data-tool="uwes" style="margin-top:12px">' + (lastU ? "Wypełnij ponownie" : "Wypełnij UWES-9") + "</button></div>" +

      '<div class="section-label">Ćwiczenia</div><div class="tile-grid">' +
      '<button class="tile" data-act="week-open" data-tool="cbt" style="cursor:pointer;font:inherit"><div class="tile-ico">' + ic("feather") + '</div><div class="tile-name">Zapis myśli (CBT)</div><div class="tile-desc">Sprawdź stresującą myśl z faktami • ' + state.week.cbt.length + " wpis(ów)</div></button>" +
      '<button class="tile" data-act="week-open" data-tool="selfcomp" style="cursor:pointer;font:inherit"><div class="tile-ico">' + ic("heart") + '</div><div class="tile-name">Życzliwość dla siebie</div><div class="tile-desc">3 kroki self-compassion • ' + state.week.selfcomp.length + " wpis(ów)</div></button>" +
      "</div></div>";
  }
  function likertItem(tool, i, it, scale, val) {
    return '<div class="likert-item"><div class="likert-q"><span class="qnum">' + (i + 1) + ".</span>" + esc(it.t) +
      (it.sub ? ' <span class="pill">' + esc(it.sub) + "</span>" : "") + "</div><div class=\"scale\">" +
      scale.map(function (lab, v) {
        return '<label class="scale-opt"><input type="radio" name="' + tool + "-" + i + '" value="' + v + '" ' +
          (val === v ? "checked" : "") + ' data-act="week-pick"><span>' + esc(lab) + "</span></label>";
      }).join("") + "</div></div>";
  }
  function weekScaleView(tool, cfg) {
    var ans = ui.week.answers, total = cfg.items.length, answered = Object.keys(ans).length;
    return '<div class="screen">' +
      '<div class="stepper">' + (tool === "pss" ? "PSS-10 — stres" : "UWES-9 — zaangażowanie") + "</div>" +
      '<h2 class="q-title">' + esc(cfg.intro) + "</h2>" +
      '<div class="likert">' + cfg.items.map(function (it, i) { return likertItem(tool, i, it, cfg.scale, ans[i]); }).join("") + "</div>" +
      '<p class="err" id="weekErr" style="color:var(--danger);font-size:13px;min-height:18px;margin:10px 0 0"></p>' +
      '<div class="btn-row"><button class="btn btn-primary" data-act="week-score" data-tool="' + tool + '">Zobacz wynik →</button>' +
      '<button class="btn btn-ghost" data-act="week-home">Anuluj</button>' +
      '<span class="progress-label" id="weekCount">' + answered + "/" + total + " odpowiedzi</span></div></div>";
  }
  function interpretation(tool, e) {
    var t;
    if (tool === "pss") {
      t = e.cls === "low" ? "Stres pod kontrolą — świetnie. Utrzymuj rutyny, które Ci służą." :
        e.cls === "mid" ? "Umiarkowany stres — normalny na starcie. Pomocny bywa moduł Buddy i ćwiczenie CBT." :
          "Wysoki stres. Warto pogadać z buddym lub przełożonym i zrobić ćwiczenie życzliwości dla siebie. To nie znak słabości.";
    } else {
      t = e.cls === "low" ? "Wysokie zaangażowanie — dużo energii i sensu w pracy." :
        e.cls === "mid" ? "Umiarkowane zaangażowanie — bywa różnie, to naturalne na początku." :
          "Niskie zaangażowanie — sprawdź, co odbiera energię. Pomocny bywa check-in z przełożonym (moduł Oczekiwania).";
    }
    return '<p class="card-sub" style="margin:10px 0 0">' + esc(t) + "</p>";
  }
  function weekResultView() {
    var tool = ui.week.lastTool, arr = tool === "pss" ? state.week.pss : state.week.uwes;
    var e = last(arr), maxv = tool === "pss" ? 40 : 6, suf = tool === "pss" ? "/40" : "/6";
    var theory = tool === "pss" ? THEORY.pss : THEORY.uwes;
    return '<div class="screen">' +
      '<div class="hero"><h1 class="hero-title">' + (tool === "pss" ? "Twój wynik PSS-10" : "Twój wynik UWES-9") + "</h1></div>" +
      '<div class="card"><div class="result"><div class="result-score">' + e.score + "<small>" + suf + "</small></div>" +
      '<div style="margin-top:8px"><span class="badge badge-' + e.cls + '">' + (tool === "pss" ? "stres " : "zaangażowanie ") + esc(e.label) + "</span></div></div>" +
      interpretation(tool, e) + "</div>" +
      whyBox(theory) +
      '<div class="card"><div class="card-title">Trend</div>' + trendBars(arr, maxv, tool === "pss" ? "" : "accent") + "</div>" +
      '<div class="btn-row"><button class="btn btn-primary" data-act="week-home">Gotowe</button>' +
      (tool === "pss" ? '<button class="btn btn-secondary" data-act="week-open" data-tool="cbt">Spróbuj ćwiczenia CBT</button>' : "") + "</div></div>";
  }
  function formField(tool, f) {
    var id = tool + "-" + f.key;
    if (f.type === "range")
      return '<div class="field"><label>' + esc(f.label) + ': <span id="val-' + id + '">50</span>/100</label>' +
        '<input type="range" min="0" max="100" value="50" id="' + id + '" data-act="range" data-target="val-' + id + '" style="width:100%"></div>';
    return '<div class="field"><label>' + esc(f.label) + "</label><textarea id=\"" + id + '" placeholder="' + esc(f.ph || "") + '"></textarea></div>';
  }
  function pastEntries(tool) {
    var arr = (tool === "cbt" ? state.week.cbt : state.week.selfcomp).slice().reverse().slice(0, 5);
    if (!arr.length) return "";
    return '<div class="section-label">Wcześniejsze wpisy</div>' + arr.map(function (en) {
      var snip = tool === "cbt" ? (en.alt || en.thought || en.situation || "") : (en.kind || en.feel || "");
      var delta = (tool === "cbt" && en.before != null && en.after != null) ? '<span class="chip accent">' + en.before + "→" + en.after + "</span>" : "";
      return '<div class="card tight"><div class="list-meta"><span class="pill">' + fmtDate(en.date) + "</span>" + delta + "</div>" +
        '<p style="font-size:14px;margin:8px 0 0">' + esc(snip) + "</p></div>";
    }).join("");
  }
  function weekFormView(tool, form, theory, title, icon) {
    return '<div class="screen">' +
      '<div class="hero"><h1 class="hero-title">' + ic(icon) + " " + esc(title) + "</h1></div>" +
      whyBox(theory) +
      '<div class="card">' + form.map(function (f) { return formField(tool, f); }).join("") +
      '<p class="err" id="weekErr" style="color:var(--danger);font-size:13px;min-height:18px"></p>' +
      '<div class="btn-row"><button class="btn btn-primary" data-act="form-save" data-tool="' + tool + '">Zapisz wpis</button>' +
      '<button class="btn btn-ghost" data-act="week-home">Anuluj</button></div></div>' +
      pastEntries(tool) + "</div>";
  }

  /* ---------- router ---------- */
  function currentRoute() { return (location.hash.replace("#", "") || "start"); }
  function highlightTab(r) {
    var tabs = document.querySelectorAll(".tab");
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle("active", tabs[i].getAttribute("data-route") === r);
  }
  function render() {
    var r = currentRoute(), html;
    if (r === "buddy") html = viewBuddy();
    else if (r === "knowhow") html = viewKnowhow();
    else if (r === "expectations") html = viewExpect();
    else if (r === "week") html = viewWeek();
    else html = viewStart();
    var view = document.getElementById("view");
    view.innerHTML = html;
    highlightTab(r);
    try { view.focus({ preventScroll: true }); } catch (e) {}
    window.scrollTo(0, 0);
  }

  /* ---------- obsługa zdarzeń (delegacja) ---------- */
  function radioVal(name) {
    var el = document.querySelector('#view input[name="' + name + '"]:checked');
    return el ? +el.value : 0;
  }
  function onClick(e) {
    var t = e.target.closest("[data-act]");
    if (!t) return;
    var act = t.getAttribute("data-act"), d = t.dataset;

    if (act === "start-quiz") { ui.startedQuiz = true; ui.buddyStep = 0; ui.buddyAnswers = {}; render(); }
    else if (act === "answer") {
      ui.buddyAnswers[d.q] = +d.i;
      if (ui.buddyStep < BUDDY_QUIZ.length - 1) ui.buddyStep++;
      else { state.buddy.match = computeMatch(ui.buddyAnswers); state.buddy.sessions = {}; ui.startedQuiz = false; save(); }
      render();
    }
    else if (act === "quiz-back") { if (ui.buddyStep > 0) ui.buddyStep--; render(); }
    else if (act === "rematch") { state.buddy.match = null; state.buddy.sessions = {}; ui.startedQuiz = false; ui.buddyAnswers = {}; ui.buddyStep = 0; save(); render(); }
    else if (act === "open-session") { ui.openSession = +d.week; ui.sessErr = null; render(); }
    else if (act === "cancel-session") { ui.openSession = null; ui.sessErr = null; render(); }
    else if (act === "save-session") {
      var sup = radioVal("support"), saf = radioVal("safety");
      if (!sup || !saf) { ui.sessErr = "Zaznacz obie skale (wsparcie i bezpieczeństwo)."; render(); return; }
      var noteEl = document.getElementById("sess-note");
      state.buddy.sessions[+d.week] = { done: true, support: sup, safety: saf, note: noteEl ? noteEl.value.trim() : "", date: Date.now() };
      ui.openSession = null; ui.sessErr = null; save(); render();
    }
    else if (act === "week-open") { ui.week.mode = d.tool; ui.week.answers = {}; render(); }
    else if (act === "week-home") { ui.week.mode = "home"; ui.week.answers = {}; render(); }
    else if (act === "week-score") {
      var cfg = d.tool === "pss" ? PSS10 : UWES9, total = cfg.items.length;
      if (Object.keys(ui.week.answers).length < total) {
        var er = document.getElementById("weekErr");
        if (er) er.textContent = "Odpowiedz na wszystkie pytania (" + Object.keys(ui.week.answers).length + "/" + total + ").";
        return;
      }
      var sc, band, entry;
      if (d.tool === "pss") { sc = scorePSS(ui.week.answers); band = findBand(PSS10.bands, sc); }
      else { sc = scoreUWES(ui.week.answers); band = findBand(UWES9.bands, sc); }
      entry = { score: sc, label: band.label, cls: band.cls, date: Date.now() };
      state.week[d.tool].push(entry);
      ui.week.lastTool = d.tool; ui.week.mode = "result"; ui.week.answers = {}; save(); render();
    }
    else if (act === "form-save") {
      var tool = d.tool, form = tool === "cbt" ? CBT_FORM : SELFCOMP_FORM, entry2 = { date: Date.now() };
      form.forEach(function (f) {
        var el = document.getElementById(tool + "-" + f.key);
        if (!el) return;
        entry2[f.key] = f.type === "range" ? +el.value : el.value.trim();
      });
      var req = tool === "cbt" ? ["situation", "thought"] : ["feel"];
      var missing = req.some(function (k) { return !entry2[k]; });
      if (missing) { var er2 = document.getElementById("weekErr"); if (er2) er2.textContent = "Uzupełnij przynajmniej pierwsze pola, żeby zapisać."; return; }
      state.week[tool].push(entry2); ui.week.mode = "home"; save(); render();
    }
    else if (act === "kh-open") { ui.knowhow.openId = d.id; ui.knowhow.quiz = null; render(); }
    else if (act === "kh-back") { ui.knowhow.openId = null; ui.knowhow.quiz = null; render(); }
    else if (act === "kh-retry") { ui.knowhow.quiz = null; render(); }
    else if (act === "kh-answer") {
      var kl = LESSONS.filter(function (x) { return x.id === d.id; })[0];
      var correct = +d.i === kl.quiz.correct;
      ui.knowhow.quiz = { answered: true, picked: +d.i, correct: correct };
      if (correct) { state.knowhow.done[d.id] = true; save(); }
      render();
    }
    else if (act === "ex-canvas") { ui.expect.mode = "canvas"; render(); }
    else if (act === "ex-checkin") { ui.expect.mode = "checkin"; render(); }
    else if (act === "ex-home") { ui.expect.mode = "home"; render(); }
    else if (act === "ex-canvas-save") {
      var role = valOf("canvas-role");
      if (!role) { exErr("Wpisz przynajmniej swoją rolę."); return; }
      state.expect.canvas = { role: role, priorities: valOf("canvas-priorities"), success: valOf("canvas-success"), updated: Date.now() };
      save(); ui.expect.mode = "home"; render();
    }
    else if (act === "ex-checkin-save") {
      var works = valOf("checkin-works"), nxt = valOf("checkin-next");
      if (!works && !nxt) { exErr("Uzupełnij choć jedno pole (np. „co zrobimy”)."); return; }
      var cl = document.getElementById("checkin-clarity");
      state.expect.checkins.push({ date: Date.now(), works: works, blocks: valOf("checkin-blocks"), next: nxt, ifthen: valOf("checkin-ifthen"), clarity: cl ? +cl.value : 50 });
      save(); ui.expect.mode = "home"; render();
    }
  }
  function onChange(e) {
    var t = e.target;
    if (t.matches && t.matches('input[data-act="week-pick"]')) {
      var i = +t.name.split("-")[1];
      ui.week.answers[i] = +t.value;
      var cfg = ui.week.mode === "pss" ? PSS10 : UWES9;
      var c = document.getElementById("weekCount");
      if (c) c.textContent = Object.keys(ui.week.answers).length + "/" + cfg.items.length + " odpowiedzi";
      var er = document.getElementById("weekErr"); if (er) er.textContent = "";
    }
    if (t.matches && t.matches('input[data-act="kh-check"]')) {
      var id = t.dataset.id, ix = +t.dataset.i;
      if (!state.knowhow.checks[id]) state.knowhow.checks[id] = {};
      state.knowhow.checks[id][ix] = t.checked; save();
      var lab = t.closest("label"), sp = lab ? lab.querySelector("span") : null;
      if (sp) { sp.style.opacity = t.checked ? ".6" : ""; sp.style.textDecoration = t.checked ? "line-through" : ""; }
    }
  }
  function onInput(e) {
    var t = e.target;
    if (t.matches && t.matches('input[data-act="range"]')) {
      var tgt = document.getElementById(t.dataset.target);
      if (tgt) tgt.textContent = t.value;
    }
    if (t.id === "khSearch") {
      var qv = (t.value || "").toLowerCase();
      var items = document.querySelectorAll("#khList .kh-item");
      for (var i = 0; i < items.length; i++) {
        var sdata = items[i].getAttribute("data-search") || "";
        items[i].style.display = sdata.indexOf(qv) > -1 ? "" : "none";
      }
    }
  }
  function resetTransient() {
    ui.startedQuiz = false; ui.buddyStep = 0; ui.buddyAnswers = {};
    ui.openSession = null; ui.sessErr = null;
    ui.week = { mode: "home", answers: {}, lastTool: null };
    ui.knowhow = { openId: null, quiz: null };
    ui.expect = { mode: "home" };
  }

  /* ---------- init ---------- */
  function init() {
    var view = document.getElementById("view");
    view.addEventListener("click", onClick);
    view.addEventListener("change", onChange);
    view.addEventListener("input", onInput);
    var rb = document.getElementById("resetBtn");
    if (rb) rb.addEventListener("click", function () {
      if (confirm("Wyczyścić wszystkie dane demo?")) { try { localStorage.removeItem(KEY); } catch (e) {} state = defaultState(); resetTransient(); render(); }
    });
    window.addEventListener("hashchange", function () { resetTransient(); render(); });
    if (!location.hash) location.replace("#start");
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
