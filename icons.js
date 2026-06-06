/* ============ Buddy app — zestaw ikon liniowych (inline SVG) ============
   Eleganckie, spójne ikony konturowe. Dziedziczą kolor (currentColor)
   i rozmiar (1em) z otoczenia. Brak zależności zewnętrznych. */
var ICONS = {
  sun: `<circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.4 5.4l1.7 1.7M16.9 16.9l1.7 1.7M18.6 5.4l-1.7 1.7M7.1 16.9l-1.7 1.7"/>`,
  home: `<path d="M3.2 11.8 12 4l8.8 7.8"/><path d="M5.2 10.3V19a1 1 0 0 0 1 1h11.6a1 1 0 0 0 1-1v-8.7"/><path d="M9.8 20v-5.2h4.4V20"/>`,
  users: `<circle cx="9" cy="8.5" r="3.1"/><path d="M3.4 19a5.6 5.6 0 0 1 11.2 0"/><path d="M15.8 5.7a3 3 0 0 1 0 5.6"/><path d="M17 13.4a5.6 5.6 0 0 1 3.6 5.2"/>`,
  book: `<path d="M5 4.6A1.6 1.6 0 0 1 6.6 3H19v14.5H6.6A1.6 1.6 0 0 0 5 19z"/><path d="M5 19a1.6 1.6 0 0 0 1.6 1.5H19"/><path d="M9 7.5h6M9 10.5h5"/>`,
  target: `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1"/>`,
  heart: `<path d="M12 20.2C7.6 17 4 14 4 10.4 4 8 5.9 6.2 8.2 6.2c1.5 0 2.9.8 3.8 2 .9-1.2 2.3-2 3.8-2C20.1 6.2 22 8 22 10.4c0 3.6-3.6 6.6-8 9.8z"/>`,
  chart: `<path d="M4 16.5 9.5 11l3.5 3.5L20 7"/><path d="M15.5 7H20v4.5"/>`,
  compass: `<circle cx="12" cy="12" r="8.5"/><path d="M15.6 8.4 13 13l-4.6 2.6L11 11z"/>`,
  barchart: `<path d="M3.5 20.5h17"/><rect x="5.5" y="11" width="3.2" height="7" rx="1"/><rect x="10.4" y="6.5" width="3.2" height="11.5" rx="1"/><rect x="15.3" y="13" width="3.2" height="5" rx="1"/>`,
  clipboard: `<rect x="5" y="4.5" width="14" height="16.5" rx="2.2"/><rect x="8.4" y="2.6" width="7.2" height="3.8" rx="1.4"/><path d="M8.6 11h6.8M8.6 14.5h6.8M8.6 18h4"/>`,
  sparkle: `<path d="M12 3.2l1.7 4.9 4.9 1.7-4.9 1.7L12 16.4l-1.7-4.9L5.4 9.8l4.9-1.7z"/><path d="M18.6 15.4l.6 1.8 1.8.6-1.8.6-.6 1.8-.6-1.8-1.8-.6 1.8-.6z"/>`,
  pulse: `<path d="M3 12.5h3.6l2-5.2 3.3 10 2.2-6.1 1.3 1.3H21"/>`,
  flame: `<path d="M12 3.5c.6 2.7 2.2 3.8 3.4 5.4a5.2 5.2 0 1 1-8.5 1.7C7.6 12.4 9 12 9.6 9.7c1.6.8 2.6-.2 2.4-2.2z"/>`,
  chat: `<path d="M5 5.5h14a1.4 1.4 0 0 1 1.4 1.4v8a1.4 1.4 0 0 1-1.4 1.4H10l-4 3.2V16.3H5A1.4 1.4 0 0 1 3.6 14.9V6.9A1.4 1.4 0 0 1 5 5.5z"/>`,
  clock: `<circle cx="12" cy="12" r="8.4"/><path d="M12 7.2V12l3.4 2"/>`,
  bulb: `<path d="M9 17.5h6"/><path d="M10 20.5h4"/><path d="M8.2 14.4A5.6 5.6 0 1 1 17.6 10c0 1.9-1 3-1.6 3.8-.5.6-.9 1.1-1 2H10.6c-.1-.9-.5-1.4-1-2z"/>`,
  feather: `<path d="M20 4.5c-5.5-.6-12 3.2-13.2 10.8L5.5 19l3.7-1.3C16.6 16.5 20.5 10 20 4.5z"/><path d="M6 18.5 12 12"/><path d="M11 9.5h4.5M9.5 13h4"/>`,
  "check-circle": `<circle cx="12" cy="12" r="8.4"/><path d="M8.5 12.3l2.4 2.4 4.6-5.1"/>`,
  "x-circle": `<circle cx="12" cy="12" r="8.4"/><path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6"/>`,
  circle: `<circle cx="12" cy="12" r="8.2"/>`,
  lock: `<rect x="5" y="10.5" width="14" height="9.5" rx="2.2"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/><path d="M12 14.6v2.2"/>`,
  key: `<circle cx="8" cy="12" r="3.4"/><path d="M11.3 11.4H20.5"/><path d="M17.8 11.4v3M20.5 11.4v3.2"/>`,
  umbrella: `<path d="M12 3.4c4.4 0 8 3.3 8.4 7.6H3.6C4 6.7 7.6 3.4 12 3.4z"/><path d="M12 11v7.2a2.2 2.2 0 0 0 4.4 0"/>`,
  tasks: `<path d="M4 6.6 5.5 8 8.4 5.1"/><path d="M4 13 5.5 14.4 8.4 11.5"/><path d="M4 19.4 5.5 20.8 8.4 17.9"/><path d="M12 6.6h8M12 13h8M12 19.4h6"/>`
};

/* Zwraca gotowy element <svg> dla danej nazwy ikony. */
function ic(name, size) {
  var s = size || "1em";
  return '<svg class="ico" viewBox="0 0 24 24" width="' + s + '" height="' + s +
    '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    (ICONS[name] || "") + "</svg>";
}
