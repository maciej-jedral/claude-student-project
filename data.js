/* ============ Buddy app — dane / treści ============
   Wszystkie teksty po polsku. Narzędzia psychometryczne to wersje
   DEMONSTRACYJNE (parafrazy) na potrzeby prototypu — do realnego użycia
   należałoby użyć oficjalnych, licencjonowanych adaptacji. */

/* ---------- Buddy Match: quiz dopasowania ---------- */
const BUDDY_QUIZ = [
  {
    id: "learn",
    q: "Jak najlepiej uczysz się nowych rzeczy na starcie?",
    options: [
      { label: "Obserwując, jak robi to ktoś doświadczony", emoji: "👀", tags: ["observational"] },
      { label: "Dopytując i rozmawiając", emoji: "🙋", tags: ["inquisitive"] },
      { label: "Czytając dokumentację po swojemu", emoji: "📖", tags: ["self-study"] },
      { label: "Próbując samodzielnie w praktyce", emoji: "🛠️", tags: ["hands-on"] }
    ]
  },
  {
    id: "stress",
    q: "Co najbardziej Cię teraz stresuje?",
    options: [
      { label: "Za dużo nowych informacji naraz", emoji: "🌊", tags: ["overload"] },
      { label: "Niejasne zasady i oczekiwania", emoji: "❓", tags: ["clarity"] },
      { label: "Nowi ludzie i obawa przed oceną", emoji: "😬", tags: ["social"] },
      { label: "Narzędzia i systemy firmowe", emoji: "🧩", tags: ["tools"] }
    ]
  },
  {
    id: "comm",
    q: "Twój styl komunikacji to raczej…",
    options: [
      { label: "Krótko i konkretnie", emoji: "⚡", tags: ["direct"] },
      { label: "Wolę porozmawiać na żywo", emoji: "🗣️", tags: ["talker"] },
      { label: "Pisemnie, we własnym tempie", emoji: "💬", tags: ["async"] },
      { label: "Luźno, z humorem", emoji: "😄", tags: ["casual"] }
    ]
  },
  {
    id: "need",
    q: "Czego najbardziej potrzebujesz od buddy'ego?",
    options: [
      { label: "Wsparcia i zrozumienia", emoji: "🤗", tags: ["emotional"] },
      { label: "Wiedzy technicznej i konkretów", emoji: "🔧", tags: ["technical"] },
      { label: "Wprowadzenia w relacje w zespole", emoji: "🌐", tags: ["network"] },
      { label: "Szczerego feedbacku", emoji: "🪞", tags: ["feedback"] }
    ]
  },
  {
    id: "area",
    q: "W jakim obszarze pracujesz?",
    options: [
      { label: "Inżynieria / IT", emoji: "💻", tags: ["eng"] },
      { label: "Produkt / Design", emoji: "🎨", tags: ["product"] },
      { label: "Sprzedaż / Marketing", emoji: "📈", tags: ["bizdev"] },
      { label: "Operacje / HR / Finanse", emoji: "🗂️", tags: ["ops"] }
    ]
  }
];

/* ---------- Pula buddych (peer, 1–2 lata stażu) ---------- */
const BUDDIES = [
  { id: "ola",   name: "Ola",   emoji: "👩‍💻", role: "Junior Analityk",   years: 1.5, tags: ["inquisitive", "social", "talker", "emotional", "product"],
    blurb: "Otwarta i cierpliwa — uwielbia tłumaczyć rzeczy „od zera” i przedstawiać ludzi sobie nawzajem." },
  { id: "kuba",  name: "Kuba",  emoji: "🧑‍🔧", role: "Specjalista ds. systemów", years: 2, tags: ["hands-on", "tools", "direct", "technical", "eng"],
    blurb: "Konkretny praktyk. Pokaże Ci narzędzia na żywym przykładzie i podrzuci skróty, które oszczędzają godziny." },
  { id: "maja",  name: "Maja",  emoji: "👩‍🏫", role: "Junior Product Manager", years: 1, tags: ["self-study", "clarity", "async", "network", "product"],
    blurb: "Mistrzyni porządku. Ma checklisty na wszystko i pomoże Ci ułożyć chaos pierwszych tygodni." },
  { id: "piotr", name: "Piotr", emoji: "🧑‍💼", role: "Account Specialist", years: 2, tags: ["observational", "social", "casual", "feedback", "bizdev"],
    blurb: "Luźny i bezpośredni. Da szczery feedback bez spinki i wprowadzi Cię w nieformalne zasady zespołu." },
  { id: "zofia", name: "Zofia", emoji: "👩‍💼", role: "Koordynatorka Operacji", years: 1.5, tags: ["inquisitive", "clarity", "talker", "network", "ops"],
    blurb: "Ogarnia procesy i formalności. Wie, kogo i o co zapytać, żeby sprawa ruszyła." }
];

/* ---------- Senior-eksperci wg obszaru ---------- */
const SENIORS = {
  eng:     { name: "Tomasz", emoji: "👨‍🔬", role: "Tech Lead",             expertise: "systemy, narzędzia i dobre praktyki inżynierskie" },
  product: { name: "Anna",   emoji: "👩‍🎨", role: "Senior PM / Design",     expertise: "proces produktowy i pracę z wymaganiami" },
  bizdev:  { name: "Marek",  emoji: "🧔",   role: "Senior Account Manager", expertise: "relacje z klientem i sprzedaż" },
  ops:     { name: "Iwona",  emoji: "👩‍💼", role: "HR Business Partner",     expertise: "procesy, onboarding i sprawy formalne" }
};

/* ---------- Etykiety dopasowania (powody) ---------- */
const TAG_LABELS = {
  observational: "uczycie się przez obserwację",
  inquisitive: "lubicie dowiadywać się przez pytania",
  "self-study": "wolicie ogarniać rzeczy samodzielnie",
  "hands-on": "uczycie się działając w praktyce",
  overload: "znacie uczucie nadmiaru informacji",
  clarity: "cenicie jasne zasady i oczekiwania",
  social: "łatwo wchodzicie w relacje",
  tools: "dobrze czujecie się w narzędziach i systemach",
  direct: "komunikujecie się krótko i konkretnie",
  talker: "wolicie rozmowę na żywo",
  async: "lubicie kontakt pisemny we własnym tempie",
  casual: "macie luźny, pogodny styl",
  emotional: "stawiacie na wsparcie i zrozumienie",
  technical: "ciągnie Was strona techniczna",
  network: "ważne jest wejście w relacje w zespole",
  feedback: "cenicie szczery feedback",
  eng: "ten sam obszar: Inżynieria / IT",
  product: "ten sam obszar: Produkt / Design",
  bizdev: "ten sam obszar: Sprzedaż / Marketing",
  ops: "ten sam obszar: Operacje / HR / Finanse"
};

const AREA_LABELS = { eng: "Inżynieria / IT", product: "Produkt / Design", bizdev: "Sprzedaż / Marketing", ops: "Operacje / HR / Finanse" };

/* ---------- Trzy sesje 1:1 (tydz. 1, 2, 4) ---------- */
const SESSIONS = [
  {
    week: 1,
    title: "Poznajmy się",
    goal: "Zbudować bezpieczną relację i oswoić pierwszy tydzień.",
    agenda: [
      "Krótko o sobie — kim jesteście poza pracą",
      "Jak wygląda Twój pierwszy tydzień i kalendarz",
      "Ustalcie kanał i częstotliwość kontaktu",
      "Umówcie kolejną sesję"
    ],
    secureBase: [
      "Czego najbardziej się teraz obawiasz?",
      "Co już wiesz, a co jest jeszcze mgłą?",
      "Kogo w zespole warto poznać najpierw?"
    ]
  },
  {
    week: 2,
    title: "Rozkład jazdy",
    goal: "Ogarnąć procedury i narzędzia bez przeciążenia.",
    agenda: [
      "TOP 3 procedury, które przydadzą się najwcześniej",
      "Narzędzia do skonfigurowania (krok po kroku)",
      "Pierwsze realne zadanie i jak je ugryźć",
      "Gdzie szukać wiedzy, zanim zapytasz człowieka"
    ],
    secureBase: [
      "Które narzędzie sprawia najwięcej trudności?",
      "Co chcesz umieć do końca tygodnia?"
    ]
  },
  {
    week: 4,
    title: "Co dalej",
    goal: "Podsumować pierwszy miesiąc i wyznaczyć cele.",
    agenda: [
      "Co już działa, a co nadal blokuje",
      "Cele na kolejny miesiąc (konkretne i mierzalne)",
      "Jak prosić o feedback, żeby był pomocny",
      "Czego potrzebujesz, by czuć się pewniej"
    ],
    secureBase: [
      "Z czego jesteś dumny_ po pierwszym miesiącu?",
      "Co jednego zmieniłoby najwięcej?"
    ]
  }
];

/* ---------- Mini-ankieta po sesji ---------- */
const POST_SESSION = [
  { key: "support", label: "Na ile po tej sesji czujesz się wsparty_?", type: "scale5" },
  { key: "safety",  label: "Na ile czujesz, że możesz pytać bez obawy o ocenę?", type: "scale5" },
  { key: "note",    label: "Notatka / ustalenia (opcjonalnie)", type: "textarea" }
];

/* ---------- Teksty „dlaczego to działa” ---------- */
const THEORY = {
  buddy: {
    title: "Dlaczego to działa",
    body: "Wsparcie społeczne działa jak <b>bufor stresu</b> — obecność życzliwej, bardziej doświadczonej osoby osłabia wpływ stresorów na samopoczucie (Cohen i Wills, 1985). Relacja zaspokaja potrzebę <b>więzi</b> z teorii autodeterminacji (Deci i Ryan), a kontakt z „insiderem” przyspiesza adaptację do organizacji (Bauer i Erdogan, 2011).",
    cite: "Cohen & Wills (1985) · Deci & Ryan · Bauer & Erdogan (2011)"
  },
  pss: {
    title: "Co mierzy PSS-10",
    body: "PSS-10 bada <b>spostrzegany stres</b> — na ile sprawy wydają się nieprzewidywalne i przeciążające (Cohen i in., 1983). Regularny pomiar pozwala zauważyć trend, zanim przerodzi się w wypalenie.",
    cite: "Cohen, Kamarck & Mermelstein (1983)"
  },
  uwes: {
    title: "Co mierzy UWES-9",
    body: "UWES-9 bada <b>zaangażowanie w pracę</b> w trzech wymiarach: wigor, oddanie i zaabsorbowanie (Schaufeli i Bakker, 2006). Zdrowe zaangażowanie chroni przed wypaleniem.",
    cite: "Schaufeli & Bakker (2006)"
  },
  cbt: {
    title: "Dlaczego to działa",
    body: "<b>Restrukturyzacja poznawcza</b> (CBT) uczy wyłapywać myśli automatyczne i konfrontować je z faktami. Obniża napięcie wynikające z katastrofizacji typowej na starcie („wszyscy pomyślą, że się nie nadaję”).",
    cite: "nurt poznawczo-behawioralny (Beck)"
  },
  selfcomp: {
    title: "Dlaczego to działa",
    body: "<b>Współczucie dla siebie</b> (self-compassion) to traktowanie siebie z życzliwością, jaką dał_byś przyjacielowi. Zmniejsza samokrytykę i lęk przed oceną (Neff).",
    cite: "Neff (2003)"
  }
};

/* ---------- PSS-10 (parafraza demonstracyjna) ---------- */
const PSS10 = {
  intro: "Odpowiedz, jak często w OSTATNIM TYGODNIU czułeś_aś lub myślał_aś w dany sposób.",
  scale: ["Nigdy", "Prawie nigdy", "Czasami", "Dość często", "Bardzo często"],
  items: [
    { t: "…że zdenerwowało Cię coś nieoczekiwanego?", r: false },
    { t: "…że nie masz wpływu na ważne sprawy w pracy?", r: false },
    { t: "…że jesteś zestresowany_ i spięty_?", r: false },
    { t: "…pewność, że poradzisz sobie z obowiązkami?", r: true },
    { t: "…że sprawy idą po Twojej myśli?", r: true },
    { t: "…że nie nadążasz z zadaniami?", r: false },
    { t: "…że panujesz nad rozdrażnieniem?", r: true },
    { t: "…że masz sprawy pod kontrolą?", r: true },
    { t: "…złość z powodu rzeczy poza Twoją kontrolą?", r: false },
    { t: "…że trudności piętrzą się ponad Twoje siły?", r: false }
  ],
  // suma 0–40
  bands: [
    { max: 13, label: "niski", cls: "low" },
    { max: 26, label: "umiarkowany", cls: "mid" },
    { max: 40, label: "wysoki", cls: "high" }
  ]
};

/* ---------- UWES-9 (parafraza demonstracyjna) ---------- */
const UWES9 = {
  intro: "Jak często czujesz w pracy w ten sposób? (0 = nigdy, 6 = zawsze)",
  scale: ["Nigdy", "Prawie nigdy", "Rzadko", "Czasami", "Często", "Bardzo często", "Zawsze"],
  items: [
    { t: "W pracy rozpiera mnie energia.", sub: "Wigor" },
    { t: "Czuję się silny_ i pełen_ wigoru.", sub: "Wigor" },
    { t: "Mam ochotę iść do pracy, gdy rano wstaję.", sub: "Wigor" },
    { t: "Jestem entuzjastycznie nastawiony_ do swojej pracy.", sub: "Oddanie" },
    { t: "Moja praca mnie inspiruje.", sub: "Oddanie" },
    { t: "Jestem dumny_ z pracy, którą wykonuję.", sub: "Oddanie" },
    { t: "Czuję się szczęśliwy_, gdy intensywnie pracuję.", sub: "Zaabsorbowanie" },
    { t: "Jestem pochłonięty_ swoją pracą.", sub: "Zaabsorbowanie" },
    { t: "Gdy pracuję, czas płynie szybko.", sub: "Zaabsorbowanie" }
  ],
  // średnia 0–6 (wyższa = lepsza); kolory odwrócone wobec PSS
  bands: [
    { max: 2.0, label: "niskie", cls: "high" },
    { max: 4.0, label: "umiarkowane", cls: "mid" },
    { max: 6.0, label: "wysokie", cls: "low" }
  ]
};

/* ---------- Ćwiczenie CBT (zapis myśli) ---------- */
const CBT_FORM = [
  { key: "situation", label: "Sytuacja — co się wydarzyło?", type: "textarea", ph: "np. Nie wiedział_em, jak zrobić zadanie, i bał_em się zapytać." },
  { key: "thought",   label: "Myśl automatyczna", type: "textarea", ph: "np. „Wszyscy pomyślą, że się nie nadaję.”" },
  { key: "before",    label: "Siła emocji PRZED", type: "range" },
  { key: "for",       label: "Fakty ZA tą myślą", type: "textarea", ph: "Co realnie ją potwierdza?" },
  { key: "against",   label: "Fakty PRZECIW tej myśli", type: "textarea", ph: "Co jej przeczy? Jak było u innych?" },
  { key: "alt",       label: "Myśl bardziej zrównoważona", type: "textarea", ph: "np. „Pytanie na starcie jest normalne — tak się uczę.”" },
  { key: "after",     label: "Siła emocji PO", type: "range" }
];

/* ---------- Ćwiczenie self-compassion ---------- */
const SELFCOMP_FORM = [
  { key: "feel",  label: "Co teraz czujesz? (uważność, bez oceniania)", type: "textarea", ph: "Nazwij emocję i to, gdzie ją czujesz." },
  { key: "human", label: "Inni na Twoim miejscu też by tak mieli — napisz to", type: "textarea", ph: "np. Każdy na początku czegoś nie wie." },
  { key: "kind",  label: "Co powiedział_byś przyjacielowi w tej sytuacji?", type: "textarea", ph: "Napisz to ciepło — a potem skieruj do siebie." }
];

/* ---------- Zapowiedzi modułów w budowie ---------- */
const KNOWHOW_PREVIEW = {
  emoji: "📚", name: "Know-How na teraz",
  problem: "Przeciążenie informacyjne (80% badanych) i potrzeba jasnych procedur (śr. 93,2/100).",
  bullets: [
    "Baza procedur „krok po kroku” + TOP 10 offline",
    "Mikro-lekcje 5–10 min wyzwalane realnym zadaniem (just-in-time)",
    "Mini-quiz po lekcji (powtórki przywoławcze) i pasek postępu"
  ],
  theory: "Teoria obciążenia poznawczego (Sweller) + microlearning: dziel materiał na małe porcje uruchamiane dokładnie wtedy, gdy są potrzebne."
};

const EXPECT_PREVIEW = {
  emoji: "🎯", name: "Jasne Oczekiwania",
  problem: "Niejasność oczekiwań przełożonego (śr. 91,3/100).",
  bullets: [
    "Szablon 15-min check-inu: co działa / co blokuje / co zrobimy",
    "Kanwa oczekiwań: rola, priorytety, kryteria sukcesu",
    "Suwak „jasność zadań 0–100” z historią (jak w kwestionariuszu z raportu)"
  ],
  theory: "Teoria wyznaczania celów (Locke i Latham), jasność roli (Kahn i in.) oraz intencje implementacyjne „jeśli–to” (Gollwitzer)."
};

/* ---------- Know-How na teraz: teoria + mikro-lekcje ---------- */
const KH_THEORY = {
  title: "Dlaczego małe porcje",
  body: "Pamięć robocza ma ograniczoną pojemność — zbyt wiele informacji naraz przeciąża ją i utrudnia naukę (teoria obciążenia poznawczego, Sweller). Dlatego uczymy w <b>mikro-lekcjach</b> uruchamianych realnym zadaniem (<b>just-in-time</b>), a krótki quiz po lekcji wykorzystuje <b>efekt testowania</b> (retrieval practice) do trwalszego zapamiętania.",
  cite: "Sweller (obciążenie poznawcze) · microlearning · retrieval practice"
};

const LESSONS = [
  { id: "setup", icon: "lock", title: "Konfiguracja konta i logowanie (2FA)", time: 5, category: "Narzędzia", top10: true,
    task: "Mam dziś skonfigurować konto i bezpiecznie się logować.",
    steps: ["Ustaw silne, unikalne hasło do konta firmowego", "Włącz uwierzytelnianie dwuskładnikowe (2FA) w aplikacji authenticator", "Zapisz kody zapasowe w bezpiecznym miejscu", "Zaloguj się do poczty i komunikatora, sprawdzając czy działają", "Nigdy nie podawaj kodu 2FA osobom trzecim"],
    quiz: { q: "Co najbardziej zwiększa bezpieczeństwo logowania?", options: ["Włączone 2FA", "To samo hasło wszędzie", "Hasło na kartce na biurku"], correct: 0 } },

  { id: "access", icon: "key", title: "Jak poprosić o dostęp do systemu", time: 4, category: "Procedury", top10: true,
    task: "Mam dziś zdobyć dostęp do firmowego systemu.",
    steps: ["Ustal, który system jest potrzebny do Twojego zadania", "Znajdź właściciela systemu (intranet lub buddy)", "Złóż wniosek w portalu IT w kategorii „Dostęp”", "Dodaj krótkie uzasadnienie biznesowe (1 zdanie)", "Poinformuj przełożonego, że czekasz na nadanie dostępu"],
    quiz: { q: "Czego najczęściej brakuje we wniosku o dostęp?", options: ["Uzasadnienia biznesowego", "Twojego imienia", "Daty urodzenia"], correct: 0 } },

  { id: "leave", icon: "umbrella", title: "Jak złożyć wniosek urlopowy", time: 3, category: "Procedury", top10: true,
    task: "Chcę dziś zaplanować i złożyć wniosek o urlop.",
    steps: ["Sprawdź liczbę dostępnych dni w systemie kadrowym", "Uzgodnij termin z przełożonym i zespołem", "Złóż wniosek w systemie HR z wyprzedzeniem", "Sprawdź status wniosku (oczekuje / zaakceptowany)", "Ustaw odpowiedź automatyczną na czas nieobecności"],
    quiz: { q: "Co zrobić przed złożeniem wniosku o urlop?", options: ["Uzgodnić termin z przełożonym", "Nic — system zrobi wszystko", "Powiadomić klientów firmy"], correct: 0 } },

  { id: "firsttask", icon: "tasks", title: "Pierwsze zadanie: rozbij je na kroki", time: 6, category: "Organizacja", top10: false,
    task: "Dostał_em pierwsze zadanie i nie wiem, od czego zacząć.",
    steps: ["Zapisz cel zadania jednym zdaniem („gotowe, gdy…”)", "Podziel je na 3–5 mniejszych kroków", "Zaznacz, czego nie wiesz — to pytania do buddy'ego", "Zrób najmniejszy pierwszy krok już teraz", "Po każdym kroku odhacz postęp i zrób krótką przerwę"],
    quiz: { q: "Jak zmniejszyć przeciążenie przy nowym zadaniu?", options: ["Podzielić je na małe kroki", "Zrobić wszystko naraz wieczorem", "Odłożyć do terminu"], correct: 0 } },

  { id: "chat", icon: "chat", title: "Komunikator firmowy — kanały i etykieta", time: 4, category: "Komunikacja", top10: false,
    task: "Mam dziś zacząć korzystać z komunikatora w zespole.",
    steps: ["Dołącz do kanałów swojego zespołu i projektu", "Uzupełnij status i godziny pracy w profilu", "Pisz na kanale publicznym zamiast prywatnie — inni skorzystają", "Używaj wątków, by nie zaśmiecać kanału", "Pytania zadawaj konkretnie: cel + co już sprawdził_eś"],
    quiz: { q: "Gdzie najlepiej zadać pytanie o procedurę?", options: ["Na publicznym kanale zespołu", "W prywatnej wiadomości do prezesa", "Nigdzie — lepiej nie pytać"], correct: 0 } },

  { id: "knowledge", icon: "compass", title: "Gdzie szukać wiedzy, zanim zapytasz", time: 3, category: "Organizacja", top10: true,
    task: "Czegoś nie wiem i chcę najpierw poszukać sam_.",
    steps: ["Zajrzyj do bazy wiedzy / intranetu (wyszukiwarka)", "Sprawdź przypięte materiały na kanale zespołu", "Przejrzyj FAQ i instrukcje krok-po-kroku", "Jeśli nadal nie wiesz — sformułuj konkretne pytanie", "Zapytaj buddy'ego, dołączając co już sprawdził_eś"],
    quiz: { q: "Co zrobić tuż przed zadaniem pytania innym?", options: ["Sprawdzić bazę wiedzy i FAQ", "Zrestartować komputer", "Poczekać tydzień"], correct: 0 } },

  { id: "time", icon: "clock", title: "Ewidencja czasu pracy", time: 4, category: "Procedury", top10: false,
    task: "Mam dziś zaewidencjonować czas pracy.",
    steps: ["Otwórz system ewidencji czasu", "Wybierz właściwy projekt lub zadanie", "Wpisz godziny w odpowiednie dni", "Zapisz i sprawdź sumę tygodniową", "Zatwierdź wpis przed terminem rozliczenia"],
    quiz: { q: "Co zwykle trzeba wybrać przy wpisie czasu?", options: ["Projekt / zadanie", "Pogodę", "Ulubiony kolor"], correct: 0 } }
];

/* ---------- Jasne Oczekiwania: teoria + formularze ---------- */
const EXPECT_THEORY = {
  title: "Dlaczego to działa",
  body: "Jasno nazwane oczekiwania zmniejszają <b>niejasność roli</b> (role ambiguity, Kahn i in.) — częste źródło stresu na starcie. Konkretne, mierzalne cele działają lepiej niż „rób dobrze” (teoria wyznaczania celów, Locke i Latham), a plany <b>„jeśli–to”</b> (intencje implementacyjne, Gollwitzer) zwiększają szansę, że ustalenia zamienisz w działanie.",
  cite: "Kahn i in. (jasność roli) · Locke & Latham · Gollwitzer"
};

const CANVAS_FORM = [
  { key: "role", label: "Moja rola — po co tu jestem (1–2 zdania)", type: "textarea", ph: "np. Wspieram zespół X w… Odpowiadam za…" },
  { key: "priorities", label: "Priorytety na najbliższy miesiąc", type: "textarea", ph: "2–3 najważniejsze rzeczy" },
  { key: "success", label: "Po czym poznam sukces (kryteria)", type: "textarea", ph: "np. „gotowe, gdy…”, mierzalne efekty" }
];

const CHECKIN_FORM = [
  { key: "works", label: "Co działa / co poszło dobrze", type: "textarea", ph: "Konkretne sytuacje z ostatniego tygodnia" },
  { key: "blocks", label: "Co blokuje / czego nie wiem", type: "textarea", ph: "Przeszkody, niejasności, brakujące dostępy" },
  { key: "next", label: "Co konkretnie zrobimy do następnego razu", type: "textarea", ph: "Ustalenia + kto co robi" },
  { key: "ifthen", label: "„Jeśli–to” — plan na przeszkodę", type: "textarea", ph: "Jeśli [sytuacja], to [moje działanie]." },
  { key: "clarity", label: "Jak jasne są dla Ciebie zadania i oczekiwania?", type: "range" }
];
