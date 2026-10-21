// Wspólny szablon strony: <head>, nagłówek, stopka, ikony, grafika opony.

export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const svg = (path, vb = "0 0 24 24", extra = "") =>
  `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${path}</svg>`;

export const ikona = {
  tel: svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
  wa: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3z"/></svg>`,
  trasa: svg('<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/>'),
  strzalka: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  dol: svg('<path d="m6 9 6 6 6-6"/>'),
  x: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
  lewo: svg('<path d="m15 18-6-6 6-6"/>'),
  prawo: svg('<path d="m9 18 6-6-6-6"/>'),
  sms: svg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
  lok: svg('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="7"/>'),
  fb: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3a5 5 0 0 0-5 5v2H7v4h2v8h4v-8h3l1-4h-4V9a1 1 0 0 1 1-1z"/></svg>`,
  zegar: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  pin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2z"/></svg>`,
  gwiazda: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>`,
};

export const gwiazdki = (n = 5) => `<span class="gwiazdki" aria-hidden="true">${ikona.gwiazda.repeat(n)}</span>`;

// Znak firmowy: opona z pomarańczowym rantem
export const znak = `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#1d1f23"/><circle cx="24" cy="24" r="22" fill="none" stroke="#ff8200" stroke-width="3" stroke-dasharray="5 3.2"/><circle cx="24" cy="24" r="12.5" fill="none" stroke="#f3f2ee" stroke-width="2.5"/><g stroke="#f3f2ee" stroke-width="2.2" stroke-linecap="round"><path d="M24 15.5v5M24 27.5v5M15.5 24h5M27.5 24h5"/></g><circle cx="24" cy="24" r="3" fill="#ff8200"/></svg>`;

// Duża opona w hero — napis jak na boku opony, obraca się podczas przewijania
export function opona(f) {
  const r = (n) => Math.round(n * 100) / 100;
  // bieżnik: klocki na obwodzie
  let klocki = "";
  const N = 44;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * 360;
    klocki += `<rect x="291" y="10" width="18" height="34" rx="3" transform="rotate(${r(a)} 300 300)"/>`;
  }
  // szprychy felgi
  let szprychy = "";
  for (let i = 0; i < 10; i++) {
    const a = i * 36;
    szprychy += `<path d="M291 222 L283 152 Q300 140 317 152 L309 222 Z" transform="rotate(${a} 300 300)"/>`;
  }
  let sruby = "";
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    sruby += `<circle cx="${r(300 + Math.cos(a) * 30)}" cy="${r(300 + Math.sin(a) * 30)}" r="6" fill="#141518"/>`;
  }
  const napis = `${f.nazwa.toUpperCase()} • PRZYBORÓW • ${f.telefonWyswietlany} • SERWIS MOBILNY •`;
  return `<div class="opona" aria-hidden="true">
<svg viewBox="0 0 600 600">
  <defs>
    <path id="luk-zew" d="M300 300 m-232 0 a232 232 0 1 1 464 0 a232 232 0 1 1 -464 0"/>
    <path id="luk-wew" d="M300 300 m-196 0 a196 196 0 1 1 392 0 a196 196 0 1 1 -392 0"/>
    <radialGradient id="guma" cx="50%" cy="45%" r="55%"><stop offset="0.6" stop-color="#26292e"/><stop offset="1" stop-color="#16171a"/></radialGradient>
    <radialGradient id="felga" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#f3f2ee"/><stop offset="1" stop-color="#9aa0a8"/></radialGradient>
  </defs>
  <g class="opona__kolo" data-kolo>
    <circle cx="300" cy="300" r="282" fill="url(#guma)"/>
    <g fill="#141518">${klocki}</g>
    <circle cx="300" cy="300" r="256" fill="none" stroke="#2f3238" stroke-width="2"/>
    <text class="opona__napis opona__napis--jasny" font-size="27"><textPath href="#luk-zew" startOffset="0">${napis} ${napis}</textPath></text>
    <text class="opona__napis" font-size="13"><textPath href="#luk-wew" startOffset="0">DOT OTS 4026 • TUBELESS • RADIAL • M+S • 3PMSF • MADE FOR ROAD AND FIELD • DOT OTS 4026 • TUBELESS • RADIAL • M+S • 3PMSF •</textPath></text>
    <circle cx="300" cy="300" r="178" fill="#ff8200"/>
    <circle cx="300" cy="300" r="170" fill="#0f1012"/>
    <circle cx="300" cy="300" r="160" fill="#1b1d21"/>
    <g fill="url(#felga)">${szprychy}</g>
    <circle cx="300" cy="300" r="80" fill="#0f1012"/>
    <circle cx="300" cy="300" r="62" fill="url(#felga)"/>
    ${sruby}
    <circle cx="300" cy="300" r="15" fill="#ff8200"/>
  </g>
</svg>
<div class="opona__plakietka"><span class="kogut"></span>Dojeżdżamy do klienta</div>
</div>`;
}

const navUslugi = (uslugi) =>
  uslugi.map((u) => `<li><a href="/uslugi/${u.slug}"><strong>${esc(u.nazwa)}</strong><span>${esc(u.krotko.split(".")[0])}.</span></a></li>`).join("");

export function layout(ctx, page) {
  const { firma, uslugi, assets, siteUrl } = ctx;
  const url = siteUrl + (page.path === "/" ? "/" : page.path);
  const tytul = page.path === "/" ? page.title : `${page.title} | ${firma.nazwa}`;
  const tel = `tel:+48${firma.telefon}`;
  const wa = `https://wa.me/${firma.whatsapp}`;
  const trasa = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(firma.mapaZapytanie)}`;
  const akt = (p) => (page.path === p || (p !== "/" && page.path.startsWith(p + "/")) ? ' aria-current="page"' : "");
  const ogImg = siteUrl + (page.ogImage || "/assets/img/og-image.jpg");
  const schemas = (page.schema || []).map((s) => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, "\\u003c")}</script>`).join("\n");

  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(tytul)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${page.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}">
<meta name="theme-color" content="#141518">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:locale" content="pl_PL">
<meta property="og:site_name" content="${esc(firma.nazwa)}">
<meta property="og:title" content="${esc(tytul)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImg}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/archivo-latin-ext-wdth-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/archivo-latin-wdth-normal.woff2" as="font" type="font/woff2" crossorigin>
${page.preloadImg ? `<link rel="preload" as="image" href="${page.preloadImg}" fetchpriority="high">` : ""}
<link rel="stylesheet" href="${assets.css}">
<script src="${assets.js}" defer></script>
${schemas}
</head>
<body>
<a class="skip" href="#tresc">Przejdź do treści</a>
<div class="sezon" data-sezon><div class="wrap"><span data-sezon-txt>Sezonowa wymiana opon — umów termin bez czekania.</span> <a href="/umow-wizyte" data-sezon-link>Umów wizytę</a></div></div>
<header class="header" data-header>
  <div class="wrap header__in">
    <a class="logo" href="/" aria-label="${esc(firma.nazwa)} — strona główna">${znak}<span class="logo__txt"><span class="logo__ots">OTS</span><span class="logo__sub">Opony TIR Serwis</span></span></a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="nav" data-burger><span></span><span class="sr-only">Menu</span></button>
    <nav class="nav" id="nav" aria-label="Główna nawigacja" data-nav>
      <ul class="nav__list">
        <li class="nav__item--drop">
          <button class="nav__link" type="button" aria-expanded="false" aria-controls="drop-uslugi" data-drop${page.path.startsWith("/uslugi") ? ' aria-current="page"' : ""}>Usługi ${ikona.dol}</button>
          <ul class="drop" id="drop-uslugi">${navUslugi(uslugi)}<li><a href="/uslugi"><strong>Wszystkie usługi</strong><span>Przegląd całej oferty w jednym miejscu.</span></a></li></ul>
        </li>
        <li><a class="nav__link" href="/zglos-awarie"${akt("/zglos-awarie")}>Pomoc drogowa</a></li>
        <li><a class="nav__link" href="/poradnik"${akt("/poradnik")}>Poradnik</a></li>
        <li><a class="nav__link" href="/galeria"${akt("/galeria")}>Galeria</a></li>
        <li><a class="nav__link" href="/opinie"${akt("/opinie")}>Opinie</a></li>
        <li><a class="nav__link" href="/o-nas"${akt("/o-nas")}>O nas</a></li>
        <li><a class="nav__link" href="/kontakt"${akt("/kontakt")}>Kontakt</a></li>
      </ul>
      <div class="nav__mobile-cta">
        <a class="btn btn--duzy" href="${tel}">${ikona.tel} Zadzwoń ${firma.telefonWyswietlany}</a>
        <a class="btn btn--ghost" href="/umow-wizyte">Umów wizytę</a>
      </div>
    </nav>
    <a class="btn header__cta" href="${tel}" data-tel>${ikona.tel} ${firma.telefonWyswietlany}</a>
  </div>
</header>
<main id="tresc">
${page.body}
</main>
${page.bezCta ? "" : ctaKoniec(firma)}
<footer class="stopka">
  <div class="wrap">
    <div class="stopka__grid">
      <div>
        <img class="stopka__logo" src="/assets/img/logo-ots-420.webp" width="420" height="280" alt="Logo ${esc(firma.nazwa)}" loading="lazy" decoding="async">
        <p class="muted">Wulkanizacja stacjonarna i mobilny serwis opon: osobowe, dostawcze, ciężarowe, rolnicze i budowlane.</p>
      </div>
      <div>
        <h2>Usługi</h2>
        <ul>${uslugi.map((u) => `<li><a href="/uslugi/${u.slug}">${esc(u.nazwa)}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h2>Na skróty</h2>
        <ul>
          <li><a href="/zglos-awarie">Zgłoś awarię</a></li>
          <li><a href="/umow-wizyte">Umów wizytę</a></li>
          <li><a href="/poradnik">Poradnik i dekoder opon</a></li>
          <li><a href="/galeria">Galeria</a></li>
          <li><a href="/opinie">Opinie klientów</a></li>
          <li><a href="/faq">Pytania i odpowiedzi</a></li>
          <li><a href="/o-nas">O nas</a></li>
        </ul>
      </div>
      <div>
        <h2>Kontakt</h2>
        <ul>
          <li><a class="ikona-tekst" href="${tel}">${ikona.tel} ${firma.telefonWyswietlany}</a></li>
          <li><a class="ikona-tekst" href="${wa}" rel="noopener" target="_blank">${ikona.wa} WhatsApp</a></li>
          ${firma.email ? `<li><a href="mailto:${esc(firma.email)}">${esc(firma.email)}</a></li>` : ""}
          <li><a class="ikona-tekst" href="${trasa}" rel="noopener" target="_blank">${ikona.trasa} ${esc(firma.adres.ulica)}, ${esc(firma.adres.kod)} ${esc(firma.adres.miejscowosc)}</a></li>
          <li><a class="ikona-tekst" href="${firma.linki.facebook}" rel="noopener" target="_blank">${ikona.fb} Facebook</a></li>
        </ul>
      </div>
    </div>
    <div class="stopka__dol">
      <span>© <span data-rok>${new Date().getFullYear()}</span> ${esc(firma.nazwaPelna)}</span>
      <a href="/polityka-prywatnosci">Polityka prywatności</a>
    </div>
  </div>
</footer>
<nav class="akcje" aria-label="Szybki kontakt">
  <a class="akcje__tel" href="${tel}">${ikona.tel} Zadzwoń</a>
  <a class="akcje__wa" href="${wa}" rel="noopener" target="_blank">${ikona.wa} WhatsApp</a>
  <a class="akcje__trasa" href="${trasa}" rel="noopener" target="_blank">${ikona.trasa} Trasa</a>
</nav>
<script type="application/json" id="cfg">${JSON.stringify({ tel: firma.telefon, wa: firma.whatsapp, godziny: firma.godziny }).replace(/</g, "\\u003c")}</script>
</body>
</html>`;
}

function ctaKoniec(firma) {
  return `<section class="cta-final" aria-labelledby="cta-h">
  <div class="wrap cta-final__in">
    <div>
      <h2 id="cta-h">Opona nie poczeka. Ty też nie musisz.</h2>
      <p>Zadzwoń — powiemy od razu, kiedy możemy przyjąć auto albo dojechać na miejsce.</p>
    </div>
    <div class="btn-row">
      <a class="btn btn--ciemny btn--duzy" href="tel:+48${firma.telefon}">${ikona.tel} ${firma.telefonWyswietlany}</a>
      <a class="btn btn--ghost btn--duzy cta-final__ghost" href="/umow-wizyte">Umów wizytę</a>
    </div>
  </div>
</section>`;
}
