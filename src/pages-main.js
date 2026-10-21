import { esc, ikona, gwiazdki, opona } from "./layout.js";

// Obrazek responsywny na podstawie galeria.json (wymiary) — zapobiega przesunięciom układu
export function img(ctx, plik, alt, { sizes = "(min-width: 960px) 50vw, 100vw", eager = false, cls = "" } = {}) {
  const d = ctx.wymiary[plik] || { w: 680, h: 510 };
  const srcset = d.w > 420 ? ` srcset="/assets/img/${plik}-420.webp 420w, /assets/img/${plik}.webp ${d.w}w" sizes="${sizes}"` : "";
  return `<img${cls ? ` class="${cls}"` : ""} src="/assets/img/${plik}.webp"${srcset} width="${d.w}" height="${d.h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

export const okruszki = (ctx, items) => {
  const html = `<ol class="okruszki" aria-label="Okruszki"><li><a href="/">Start</a></li>${items
    .map((it, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(it.n)}</li>` : `<li><a href="${it.p}">${esc(it.n)}</a></li>`))
    .join("")}</ol>`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ n: "Start", p: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem", position: i + 1, name: it.n, item: ctx.siteUrl + (it.p === "/" ? "/" : it.p),
    })),
  };
  return { html, schema };
};

export const opiniaHtml = (o) => `<blockquote class="opinia" data-tag="${esc(o.tag)}">
  ${gwiazdki()}
  <p>${esc(o.tekst)}</p>
  <footer><strong>${esc(o.autor)}</strong><span>${esc(o.tag)} • Google, ${esc(o.kiedy)}</span></footer>
</blockquote>`;

export function faqHtml(lista) {
  return `<div class="faq">${lista
    .map((f) => `<details><summary>${esc(f.p)}</summary><div class="odp"><p>${esc(f.o)}</p></div></details>`)
    .join("")}</div>`;
}

const tel = (f) => `tel:+48${f.telefon}`;

/* ================= STRONA GŁÓWNA ================= */
export function home(ctx) {
  const { firma: f, uslugi, opinie, faq } = ctx;
  const wyr = opinie.filter((o) => o.wyrozniona);
  const glowna = wyr[0];
  return {
    path: "/",
    title: `${f.nazwa} — mobilny serwis opon i wulkanizacja | Przyborów, Nowa Sól`,
    description: `Wulkanizacja w Przyborowie koło Nowej Soli i mobilny serwis opon z dojazdem: osobowe, dostawcze, TIR, naczepy, rolnicze i budowlane. Ocena ${f.ocena.wartosc} w Google. Tel. ${f.telefonWyswietlany}.`,
    body: `
<section class="hero">
  <div class="wrap hero__grid">
    <div>
      <h1><span class="linia">Złapałeś gumę?</span><span class="linia linia--ton">Jedziemy do Ciebie.</span></h1>
      <p class="lead">Wulkanizacja w Przyborowie koło Nowej Soli i mobilny serwis opon, który dojeżdża na trasę, pole, budowę i pod dom. Osobówki, busy, ciężarówki, naczepy, ciągniki i koparki.</p>
      <div class="btn-row">
        <a class="btn btn--duzy" href="${tel(f)}" data-tel>${ikona.tel} Zadzwoń ${f.telefonWyswietlany}</a>
        <a class="btn btn--ghost btn--duzy" href="/zglos-awarie">Zgłoś awarię online</a>
      </div>
      <div class="hero__zaufanie">
        <div><strong>${f.ocena.wartosc}${gwiazdki()}</strong>${f.ocena.liczba} opinii w Google</div>
        <div><strong>${f.obserwujacyFacebook}</strong>obserwujących na Facebooku</div>
        <div><strong>6 typów</strong>pojazdów, od osobówki po koparkę</div>
      </div>
    </div>
    ${opona(f)}
  </div>
</section>

<nav class="szewrony" aria-label="Rodzaje pojazdów">
  <div class="szewrony__in">
    <a href="/uslugi/opony-osobowe-i-dostawcze">Osobowe</a>
    <a href="/uslugi/opony-osobowe-i-dostawcze">Dostawcze</a>
    <a href="/uslugi/opony-ciezarowe-tir">TIR</a>
    <a href="/uslugi/opony-ciezarowe-tir">Naczepy</a>
    <a href="/uslugi/opony-rolnicze-i-budowlane">Rolnicze</a>
    <a href="/uslugi/opony-rolnicze-i-budowlane">Budowlane</a>
  </div>
</nav>

<section class="sekcja" aria-labelledby="tryby-h">
  <div class="wrap">
    <div class="sekcja__head sekcja__head--split">
      <h2 id="tryby-h">Przyjedź do nas albo my przyjedziemy do Ciebie</h2>
      <p class="lead">Ten sam fachowiec i te same standardy — w warsztacie i w terenie. Wybierasz to, co szybsze dla Ciebie.</p>
    </div>
    <div class="tryby">
      <article class="tryb">
        <div class="tryb__foto">${img(ctx, "warsztat-wymiana-opon", "Wymiana opon w warsztacie OTS w Przyborowie")}</div>
        <div class="tryb__tresc">
          <h3>Warsztat w Przyborowie</h3>
          <p class="tryb__adres">${esc(f.adres.ulica)}, ${esc(f.adres.kod)} ${esc(f.adres.miejscowosc)} — tuż obok Nowej Soli</p>
          <ul>
            <li>Sezonowa wymiana opon i wyważanie kół</li>
            <li>Naprawa przebić i montaż felg aluminiowych</li>
            <li>Sprzedaż opon z montażem od ręki</li>
          </ul>
          <a class="btn" href="/umow-wizyte">Umów wizytę</a>
        </div>
      </article>
      <article class="tryb">
        <div class="tryb__foto">${img(ctx, "serwis-mobilny-dojazd", "Mobilny serwis opon OTS pod domem klienta")}</div>
        <div class="tryb__tresc">
          <h3>Serwis mobilny</h3>
          <p class="tryb__adres">Nowa Sól, trasa S3 i okolice — zasięg potwierdzamy telefonicznie</p>
          <ul>
            <li>Awaria opony w trasie, także ciężarówki i naczepy</li>
            <li>Opony maszyn w polu i na budowie</li>
            <li>Wymiana sezonowa pod domem lub w firmie</li>
          </ul>
          <a class="btn" href="/zglos-awarie">Zgłoś awarię</a>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="sekcja sekcja--beton" aria-labelledby="uslugi-h">
  <div class="wrap">
    <div class="sekcja__head sekcja__head--split">
      <h2 id="uslugi-h">Co robimy</h2>
      <p class="lead">Od małego hatchbacka po zestaw z naczepą. Każdą usługę możesz zamówić w warsztacie albo z dojazdem.</p>
    </div>
    <ul class="indeks">
      ${uslugi
        .map(
          (u) => `<li class="indeks__row"><a class="indeks__link" href="/uslugi/${u.slug}">
        <span class="indeks__nazwa">${esc(u.nazwa)}</span>
        <span><span class="indeks__opis">${esc(u.krotko)}</span><span class="indeks__dla">${u.dla.map((d) => `<span class="chip">${esc(d)}</span>`).join("")}</span></span>
        <span class="indeks__strz">${ikona.strzalka}</span>
      </a></li>`
        )
        .join("")}
    </ul>
  </div>
</section>

<section class="sekcja noc" aria-labelledby="noc-h">
  <div class="noc__foto">${img(ctx, "serwis-mobilny-noc", "", { sizes: "100vw" })}</div>
  <div class="wrap noc__grid">
    <div>
      <h2 id="noc-h">Awaria w trasie? Trzy kroki i wracasz na drogę.</h2>
      <p class="lead">Zjedź w bezpieczne miejsce, włącz światła awaryjne i ustaw trójkąt. Resztą zajmiemy się my.</p>
      <a class="tel-duzy" href="${tel(f)}" data-tel>${f.telefonWyswietlany}</a>
      <div class="btn-row">
        <a class="btn" href="/zglos-awarie">${ikona.lok} Wyślij zgłoszenie z lokalizacją</a>
      </div>
    </div>
    <ol class="kroki">
      <li class="krok"><div><h3>Dzwonisz lub wysyłasz zgłoszenie</h3><p>Pojazd, rozmiar opony i miejsce. Formularz sam dołączy Twoją lokalizację z telefonu.</p></div></li>
      <li class="krok"><div><h3>Mówimy, kiedy będziemy</h3><p>Od razu wiesz, ile czekasz i czy wieziemy nową oponę.</p></div></li>
      <li class="krok"><div><h3>Naprawiamy na miejscu</h3><p>Wymiana lub naprawa, ciśnienie i kontrola dokręcenia kół. Bez holowania.</p></div></li>
    </ol>
  </div>
</section>

<section class="sekcja" aria-labelledby="opinie-h">
  <div class="wrap opinie-top">
    <div class="ocena">
      <h2 id="opinie-h" class="sr-only">Opinie klientów</h2>
      <div class="ocena__liczba">${f.ocena.wartosc}</div>
      ${gwiazdki()}
      <p class="ocena__src">${f.ocena.liczba} opinii w ${f.ocena.zrodlo}<br>${f.ocenaDodatkowa.wartosc} z ${f.ocenaDodatkowa.liczba} opinii w ${f.ocenaDodatkowa.zrodlo}</p>
      <a class="btn btn--ghost" href="/opinie">Przeczytaj wszystkie opinie</a>
    </div>
    <div>
      <blockquote class="cytat-glowny"><p>„${esc(glowna.tekst)}”</p><footer>${esc(glowna.autor)}, opinia w Google</footer></blockquote>
      <div class="opinie-lista">${wyr.slice(1, 5).map(opiniaHtml).join("")}</div>
    </div>
  </div>
</section>

<section class="sekcja sekcja--guma" aria-labelledby="gal-h">
  <div class="wrap">
    <div class="sekcja__head sekcja__head--split">
      <h2 id="gal-h">Prosto z warsztatu i z trasy</h2>
      <p class="lead">Naczepy na placu, koparki na budowie, ciągniki w polu i auta pod domem. Tak wygląda nasz zwykły tydzień.</p>
    </div>
    <div class="galeria" data-galeria>
      ${ctx.galeria.slice(0, 6).map((g, i) => galeriaEl(ctx, g, i)).join("")}
    </div>
    <p class="odstep-g"><a class="btn btn--ghost" href="/galeria">Zobacz całą galerię</a></p>
  </div>
</section>

${obszarSekcja(ctx)}

<section class="sekcja" aria-labelledby="faq-h">
  <div class="wrap">
    <div class="sekcja__head"><h2 id="faq-h">Najczęstsze pytania</h2></div>
    ${faqHtml(faq.slice(0, 5))}
    <p class="odstep-g"><a class="btn btn--ghost" href="/faq">Wszystkie pytania</a></p>
  </div>
</section>`,
  };
}

export function galeriaEl(ctx, g, i) {
  return `<figure class="galeria__el" data-kat="${esc(g.kategoria)}">
  <button class="galeria__btn" type="button" data-lb="${i}" data-src="/assets/img/${g.plik}.webp" data-alt="${esc(g.alt)}" aria-label="Powiększ zdjęcie: ${esc(g.alt)}">
    ${img(ctx, g.plik, g.alt, { sizes: "(min-width: 960px) 33vw, (min-width: 600px) 50vw, 100vw" })}
    <span class="galeria__opis">${esc(g.kategoria)}</span>
  </button>
</figure>`;
}

export function lightbox() {
  return `<div class="lightbox" role="dialog" aria-modal="true" aria-label="Podgląd zdjęcia" data-lightbox>
  <button class="lightbox__btn lightbox__zamknij" type="button" data-lb-close aria-label="Zamknij">${ikona.x}</button>
  <button class="lightbox__btn lightbox__prev" type="button" data-lb-prev aria-label="Poprzednie zdjęcie">${ikona.lewo}</button>
  <figure><img src="" alt="" data-lb-img><figcaption class="lightbox__opis" data-lb-opis></figcaption></figure>
  <button class="lightbox__btn lightbox__next" type="button" data-lb-next aria-label="Następne zdjęcie">${ikona.prawo}</button>
</div>`;
}

export function obszarSekcja(ctx) {
  const f = ctx.firma;
  return `<section class="sekcja sekcja--beton" aria-labelledby="obszar-h">
  <div class="wrap obszar">
    <div>
      <h2 id="obszar-h">Gdzie dojeżdżamy</h2>
      <p class="lead">Warsztat stoi w Przyborowie, kilka minut od Nowej Soli i trasy S3. Mobilnie obsługujemy powiat nowosolski i okolice.</p>
      <ul class="miejscowosci">${f.obszar.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
      <p class="muted">Nie ma Twojej miejscowości? Zadzwoń — często dojeżdżamy dalej, szczególnie do ciężarówek i maszyn.</p>
      <div class="btn-row">
        <a class="btn btn--ciemny" href="https://www.google.com/maps/dir/?api=1&amp;destination=${encodeURIComponent(f.mapaZapytanie)}" target="_blank" rel="noopener">${ikona.trasa} Wyznacz trasę</a>
      </div>
    </div>
    ${mapa(f)}
  </div>
</section>`;
}

export function mapa(f) {
  return `<div class="mapa" data-mapa data-q="${esc(f.mapaZapytanie)}">
  <div class="mapa__fasada">
    <span class="mapa__pin">${ikona.pin}</span>
    <strong>${esc(f.adres.ulica)}, ${esc(f.adres.kod)} ${esc(f.adres.miejscowosc)}</strong>
    <button class="btn btn--ciemny" type="button" data-mapa-btn>Pokaż mapę Google</button>
    <p>Mapa wczytuje się dopiero po kliknięciu. Wtedy Google może zapisać pliki cookie.</p>
  </div>
</div>`;
}

/* ================= USŁUGI ================= */
export function uslugiIndex(ctx) {
  const { uslugi } = ctx;
  const ok = okruszki(ctx, [{ n: "Usługi", p: "/uslugi" }]);
  return {
    path: "/uslugi",
    title: "Usługi — wulkanizacja, serwis mobilny, opony TIR i rolnicze",
    description: "Pełna oferta OTS: mobilny serwis opon, opony ciężarowe i TIR, osobowe i dostawcze, rolnicze i budowlane, sprzedaż opon i felg. Przyborów koło Nowej Soli.",
    schema: [ok.schema],
    body: `
<header class="ph"><div class="wrap">${ok.html}
  <h1>Usługi</h1>
  <p class="lead">Każda z nich w warsztacie w Przyborowie albo z dojazdem do Ciebie. Wybierz rodzaj pojazdu lub usługi.</p>
</div></header>
<section class="sekcja sekcja--beton"><div class="wrap">
  <ul class="indeks">
    ${uslugi
      .map(
        (u) => `<li class="indeks__row"><a class="indeks__link" href="/uslugi/${u.slug}">
      <span class="indeks__nazwa">${esc(u.nazwa)}</span>
      <span><span class="indeks__opis">${esc(u.krotko)}</span><span class="indeks__dla">${u.dla.map((d) => `<span class="chip">${esc(d)}</span>`).join("")}</span></span>
      <span class="indeks__strz">${ikona.strzalka}</span></a></li>`
      )
      .join("")}
  </ul>
</div></section>`,
  };
}

export function uslugaStrona(ctx, u) {
  const { firma: f, uslugi, opinie } = ctx;
  const ok = okruszki(ctx, [{ n: "Usługi", p: "/uslugi" }, { n: u.nazwa, p: `/uslugi/${u.slug}` }]);
  const powiazane = opinie.filter((o) => u.slug === "opony-ciezarowe-tir" ? /TIR|mobilny|drogowa/.test(o.tag)
    : u.slug === "mobilny-serwis-opon" ? /mobilny|drogowa|Naprawa/.test(o.tag)
    : u.slug === "sprzedaz-opon-i-felg" ? /Sprzedaż|Doradztwo/.test(o.tag)
    : u.slug === "opony-rolnicze-i-budowlane" ? /mobilny/.test(o.tag)
    : /Osobowe|Naprawa/.test(o.tag)).slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: u.nazwa,
    description: u.seoOpis,
    serviceType: u.nazwa,
    provider: { "@id": ctx.siteUrl + "/#firma" },
    areaServed: f.obszar.filter((m) => !m.startsWith("trasa")).map((m) => ({ "@type": "Place", name: m })),
    url: `${ctx.siteUrl}/uslugi/${u.slug}`,
  };
  return {
    path: `/uslugi/${u.slug}`,
    title: u.seoTytul,
    description: u.seoOpis,
    schema: [schema, ok.schema],
    preloadImg: `/assets/img/${u.zdjecie}.webp`,
    body: `
<header class="ph"><div class="wrap">${ok.html}
  <div class="ph__grid">
    <div>
      <h1>${esc(u.nazwa)}</h1>
      <p class="lead">${esc(u.lead)}</p>
      <div class="btn-row odstep-g">
        <a class="btn btn--duzy" href="tel:+48${f.telefon}" data-tel>${ikona.tel} ${f.telefonWyswietlany}</a>
        <a class="btn btn--ghost btn--duzy" href="${u.slug === "mobilny-serwis-opon" ? "/zglos-awarie" : "/umow-wizyte"}">${u.slug === "mobilny-serwis-opon" ? "Zgłoś awarię" : "Umów wizytę"}</a>
      </div>
    </div>
    <div class="ph__foto">${img(ctx, u.zdjecie, u.zdjecieAlt, { eager: true, sizes: "(min-width: 960px) 40vw, 100vw" })}</div>
  </div>
</div></header>

<section class="sekcja"><div class="wrap dwie-kol">
  <div>
    <h2>Zakres usługi</h2>
    <ul class="lista-zakres">${u.zakres.map((z) => `<li>${esc(z)}</li>`).join("")}</ul>
    <h2 class="odstep-g">Obsługujemy</h2>
    <div class="indeks__dla">${u.dla.map((d) => `<span class="chip">${esc(d)}</span>`).join("")}</div>
  </div>
  <aside class="panel panel--sticky" aria-label="Kontakt w sprawie usługi">
    <h2>Szybka wycena</h2>
    <p class="muted">Zadzwoń albo napisz na WhatsApp. Najszybciej pomoże zdjęcie boku opony z rozmiarem.</p>
    <a class="panel__tel" href="tel:+48${f.telefon}" data-tel>${f.telefonWyswietlany}</a>
    <div class="btn-row">
      <a class="btn" href="tel:+48${f.telefon}">${ikona.tel} Zadzwoń teraz</a>
      <a class="btn btn--wa" href="https://wa.me/${f.whatsapp}?text=${encodeURIComponent(`Dzień dobry, pytam o usługę: ${u.nazwa}.`)}" target="_blank" rel="noopener">${ikona.wa} Napisz na WhatsApp</a>
    </div>
  </aside>
</div></section>

<section class="sekcja sekcja--beton" aria-labelledby="jak-h"><div class="wrap">
  <div class="sekcja__head"><h2 id="jak-h">Jak to wygląda</h2></div>
  <ol class="kroki siatka-3">${u.kroki.map((k) => `<li class="krok"><div><h3>${esc(k.t)}</h3><p>${esc(k.o)}</p></div></li>`).join("")}</ol>
</div></section>

${powiazane.length ? `<section class="sekcja" aria-labelledby="op-h"><div class="wrap">
  <div class="sekcja__head sekcja__head--split"><h2 id="op-h">Co mówią klienci</h2><p class="lead">${f.ocena.wartosc} na ${f.ocena.liczba} opiniach w Google.</p></div>
  <div class="opinie-lista">${powiazane.map(opiniaHtml).join("")}</div>
</div></section>` : ""}

<section class="sekcja sekcja--guma" aria-labelledby="inne-h"><div class="wrap">
  <div class="sekcja__head"><h2 id="inne-h">Pozostałe usługi</h2></div>
  <ul class="inne-uslugi">${uslugi.filter((x) => x.slug !== u.slug).map((x) => `<li><a href="/uslugi/${x.slug}"><strong>${esc(x.nazwa)}</strong><span>${esc(x.krotko)}</span></a></li>`).join("")}</ul>
</div></section>`,
  };
}

/* ================= O NAS ================= */
export function oNas(ctx) {
  const f = ctx.firma;
  const ok = okruszki(ctx, [{ n: "O nas", p: "/o-nas" }]);
  return {
    path: "/o-nas",
    title: "O nas — rodzinna wulkanizacja Bartłomieja Adamczyka",
    description: `Poznaj ${f.nazwa}: rodzinną firmę Bartłomieja Adamczyka z Przyborowa koło Nowej Soli. Warsztat stacjonarny i mobilny serwis opon dla aut, ciężarówek i maszyn.`,
    schema: [ok.schema],
    body: `
<header class="ph"><div class="wrap">${ok.html}
  <h1>Rodzinna firma z Przyborowa</h1>
  <p class="lead">Za OTS stoi Bartłomiej Adamczyk — człowiek, którego klienci w opiniach nazywają po imieniu. To chyba najlepiej mówi o tym, jak pracujemy.</p>
</div></header>
<section class="sekcja"><div class="wrap dwie-kol">
  <div class="prose">
    <h2>Warsztat i serwis na kołach</h2>
    <p>OTS to warsztat wulkanizacyjny w Przyborowie i mobilny serwis opon w jednym. Dużą część pracy wykonujemy poza warsztatem: dzwonią kierowcy ciężarówek, rolnicy i firmy budowlane, których pojazdy nie mogą do nas przyjechać. Dlatego nasz bus jest wyposażony tak, żeby na miejscu zrobić to, co w warsztacie.</p>
    <p>Dziś obsługujemy wszystko, co ma opony: od miejskiego auta, przez dostawczaki i zestawy z naczepą, po ciągniki i koparki kołowe. W warsztacie w Przyborowie albo tam, gdzie akurat stoi pojazd.</p>
    <h2>Jak pracujemy</h2>
    <ul>
      <li><strong>Szybko, ale bez skrótów.</strong> Postój kosztuje, więc działamy sprawnie — a koła dokręcamy i wyważamy tak, jak trzeba.</li>
      <li><strong>Uczciwie o cenach.</strong> Mówimy, ile to będzie kosztować, zanim zaczniemy. Przy zakupie opon pokazujemy kilka wariantów.</li>
      <li><strong>Po ludzku.</strong> Doradzimy, nawet jeśli wynikiem rozmowy jest to, że nowa opona nie jest jeszcze potrzebna.</li>
    </ul>
  </div>
  <div>
    <div class="logo-duze">${img(ctx, "logo-ots", `Logo ${f.nazwa}`, { sizes: "(min-width: 960px) 40vw, 100vw" })}</div>
  </div>
</div></section>
<section class="sekcja sekcja--guma"><div class="wrap">
  <div class="fakty">
    <div class="fakt"><strong>${f.ocena.wartosc}</strong><span>średnia z ${f.ocena.liczba} opinii w Google</span></div>
    <div class="fakt"><strong>${f.obserwujacyFacebook}</strong><span>obserwujących na Facebooku</span></div>
    <div class="fakt"><strong>2 tryby</strong><span>warsztat stacjonarny i serwis mobilny</span></div>
    <div class="fakt"><strong>6 typów</strong><span>pojazdów: osobowe, dostawcze, TIR, naczepy, rolnicze, budowlane</span></div>
  </div>
</div></section>`,
  };
}

/* ================= GALERIA ================= */
export function galeriaStrona(ctx) {
  const ok = okruszki(ctx, [{ n: "Galeria", p: "/galeria" }]);
  const kat = [...new Set(ctx.galeria.map((g) => g.kategoria))];
  return {
    path: "/galeria",
    title: "Galeria — serwis opon w warsztacie i w terenie",
    description: "Zdjęcia z pracy OTS Opony TIR Serwis: mobilny serwis przy naczepach, koparkach i ciągnikach, wymiana opon w warsztacie w Przyborowie.",
    schema: [ok.schema],
    body: `
<header class="ph"><div class="wrap">${ok.html}
  <h1>Galeria</h1>
  <p class="lead">Naczepy, koparki, ciągniki i auta osobowe — w warsztacie i w terenie.</p>
</div></header>
<section class="sekcja"><div class="wrap">
  <div class="filtry" role="group" aria-label="Filtruj zdjęcia" data-filtry="galeria">
    <button class="filtr" type="button" aria-pressed="true" data-f="*">Wszystkie</button>
    ${kat.map((k) => `<button class="filtr" type="button" aria-pressed="false" data-f="${esc(k)}">${esc(k)}</button>`).join("")}
  </div>
  <div class="galeria" data-galeria>${ctx.galeria.map((g, i) => galeriaEl(ctx, g, i)).join("")}</div>
  <p class="odstep-g muted">Więcej zdjęć i bieżące realizacje znajdziesz na naszym <a href="${ctx.firma.linki.facebook}" target="_blank" rel="noopener">profilu na Facebooku</a>.</p>
</div></section>`,
  };
}

/* ================= OPINIE ================= */
export function opinieStrona(ctx) {
  const { firma: f, opinie } = ctx;
  const ok = okruszki(ctx, [{ n: "Opinie", p: "/opinie" }]);
  const tagi = [...new Set(opinie.map((o) => o.tag))];
  return {
    path: "/opinie",
    title: `Opinie klientów — ${f.ocena.wartosc} w Google`,
    description: `Co klienci mówią o ${f.nazwa}? Średnia ${f.ocena.wartosc} z ${f.ocena.liczba} opinii w Google. Szybko, fachowo i w uczciwej cenie.`,
    schema: [ok.schema],
    body: `
<header class="ph"><div class="wrap">${ok.html}
  <h1>${f.ocena.liczba} opinii, średnia ${f.ocena.wartosc}</h1>
  <p class="lead">Wybraliśmy opinie z Google, w których klienci opisali swoją wizytę. Pełną listę zobaczysz w naszej wizytówce.</p>
  <div class="btn-row odstep-g">
    <a class="btn" href="${f.linki.opinieGoogle}" target="_blank" rel="noopener">Zobacz w Google</a>
    <a class="btn btn--ghost" href="${f.linki.opinieGoogle}" target="_blank" rel="noopener">Wystaw opinię</a>
  </div>
</div></header>
<section class="sekcja"><div class="wrap">
  <div class="filtry" role="group" aria-label="Filtruj opinie" data-filtry="opinie">
    <button class="filtr" type="button" aria-pressed="true" data-f="*">Wszystkie</button>
    ${tagi.map((t) => `<button class="filtr" type="button" aria-pressed="false" data-f="${esc(t)}">${esc(t)}</button>`).join("")}
  </div>
  <div class="opinie-lista" data-opinie>${opinie.map(opiniaHtml).join("")}</div>
</div></section>`,
  };
}

/* ================= FAQ ================= */
export function faqStrona(ctx) {
  const ok = okruszki(ctx, [{ n: "Pytania i odpowiedzi", p: "/faq" }]);
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ctx.faq.map((q) => ({ "@type": "Question", name: q.p, acceptedAnswer: { "@type": "Answer", text: q.o } })),
  };
  return {
    path: "/faq",
    title: "Pytania i odpowiedzi — wymiana opon, serwis mobilny, ceny",
    description: "Odpowiedzi na najczęstsze pytania: dojazd do klienta, awaria opony w trasie, ceny, wiek opony, minimalny bieżnik i termin zmiany opon na zimowe.",
    schema: [schema, ok.schema],
    body: `
<header class="ph"><div class="wrap">${ok.html}
  <h1>Pytania i odpowiedzi</h1>
  <p class="lead">Nie ma tu Twojego pytania? Zadzwoń pod <a href="tel:+48${ctx.firma.telefon}">${ctx.firma.telefonWyswietlany}</a>.</p>
</div></header>
<section class="sekcja"><div class="wrap">${faqHtml(ctx.faq)}</div></section>`,
  };
}
