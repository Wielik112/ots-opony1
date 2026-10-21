import { esc, ikona } from "./layout.js";
import { okruszki, mapa, faqHtml } from "./pages-main.js";

const radio = (name, opcje, wymagane = false) =>
  `<div class="wybor">${opcje
    .map((o, i) => {
      const id = `${name}-${i}`;
      return `<input type="radio" id="${id}" name="${name}" value="${esc(o)}"${wymagane && i === 0 ? " required" : ""}><label for="${id}">${esc(o)}</label>`;
    })
    .join("")}</div>`;

const wysylka = (f) => `<div class="form__wyslij">
  <button class="btn btn--wa btn--duzy" type="submit" data-kanal="wa">${ikona.wa} Wyślij przez WhatsApp</button>
  <button class="btn btn--duzy" type="submit" data-kanal="sms">${ikona.sms} Wyślij SMS-em</button>
  <a class="btn btn--ghost btn--duzy" href="tel:+48${f.telefon}" data-tel>${ikona.tel} Zadzwoń</a>
</div>
<p class="form__blad" data-blad role="alert" hidden></p>
<p class="form__info">Formularz nie wysyła danych na żaden serwer. Przygotowuje gotową wiadomość, którą sam wysyłasz z telefonu przez WhatsApp lub SMS.</p>`;

/* ================= ZGŁOŚ AWARIĘ ================= */
export function zglosAwarie(ctx) {
  const f = ctx.firma;
  const ok = okruszki(ctx, [{ n: "Zgłoś awarię", p: "/zglos-awarie" }]);
  return {
    path: "/zglos-awarie",
    title: "Zgłoś awarię opony — pomoc drogowa i serwis mobilny",
    description: `Awaria opony w trasie, w polu albo na budowie? Wyślij zgłoszenie z lokalizacją w 30 sekund lub zadzwoń: ${f.telefonWyswietlany}. Osobowe, dostawcze, TIR, maszyny.`,
    schema: [ok.schema],
    body: `
<header class="ph"><div class="wrap">${ok.html}
  <div class="ph__grid">
    <div>
      <h1>Zgłoś awarię opony</h1>
      <p class="lead">Najszybciej przez telefon. Jeśli nie możesz rozmawiać, wypełnij zgłoszenie — wyślesz je jednym kliknięciem razem z lokalizacją.</p>
    </div>
    <div><a class="tel-duzy" href="tel:+48${f.telefon}" data-tel>${f.telefonWyswietlany}</a></div>
  </div>
</div></header>
<section class="sekcja"><div class="wrap dwie-kol">
  <form class="form panel" data-zgloszenie="awaria" novalidate>
    <fieldset class="pole"><legend>Jaki pojazd?</legend>${radio("pojazd", ["Osobowy / SUV", "Dostawczy", "Ciężarowy / ciągnik", "Naczepa / przyczepa", "Rolniczy", "Budowlany"], true)}</fieldset>
    <fieldset class="pole"><legend>Co się stało?</legend>${radio("problem", ["Przebita opona", "Opona rozerwana", "Uchodzi powietrze", "Uszkodzona felga", "Inny problem"], true)}</fieldset>
    <div class="siatka-2">
      <div class="pole"><label for="rozmiar">Rozmiar opony</label><input class="input" id="rozmiar" name="rozmiar" placeholder="np. 385/65 R22.5" autocomplete="off"><p class="pole__hint">Jeśli nie wiesz, pomiń. Możesz dosłać zdjęcie.</p></div>
      <div class="pole"><label for="ile">Ile kół?</label><input class="input" id="ile" name="ile" inputmode="numeric" placeholder="np. 1"></div>
    </div>
    <div class="pole">
      <span class="pole__label">Gdzie jesteś?</span>
      <div class="lok">
        <button class="btn btn--ghost" type="button" data-lok>${ikona.lok} Dołącz moją lokalizację</button>
        <span class="lok__status" data-lok-status aria-live="polite">Lokalizacja nie została dołączona.</span>
      </div>
      <label class="sr-only" for="miejsce">Opis miejsca</label>
      <input class="input" id="miejsce" name="miejsce" placeholder="np. S3, parking MOP, kierunek Zielona Góra" autocomplete="off">
    </div>
    <div class="siatka-2">
      <div class="pole"><label for="imie">Imię</label><input class="input" id="imie" name="imie" autocomplete="given-name"></div>
      <div class="pole"><label for="nrrej">Nr rejestracyjny (opcjonalnie)</label><input class="input" id="nrrej" name="nrrej" autocomplete="off"></div>
    </div>
    <div class="pole"><label for="uwagi">Dodatkowe informacje</label><textarea class="input" id="uwagi" name="uwagi" placeholder="np. firma transportowa, potrzebna faktura, auto stoi na poboczu"></textarea></div>
    ${wysylka(f)}
  </form>
  <aside>
    <div class="panel panel--sticky">
      <h2>Zanim zadzwonisz</h2>
      <ol class="kroki">
        <li class="krok"><div><h3>Zjedź bezpiecznie</h3><p>Jak najdalej od pasa ruchu. Na autostradzie i drodze ekspresowej — na pas awaryjny lub MOP.</p></div></li>
        <li class="krok"><div><h3>Zabezpiecz miejsce</h3><p>Światła awaryjne, kamizelka odblaskowa i trójkąt ostrzegawczy.</p></div></li>
        <li class="krok"><div><h3>Wyjdź za barierki</h3><p>Pasażerowie czekają poza pojazdem, w bezpiecznym miejscu.</p></div></li>
      </ol>
      <p class="form__info odstep-g">W sytuacji zagrożenia życia dzwoń na numer alarmowy 112.</p>
    </div>
  </aside>
</div></section>
<div class="sr-only" aria-live="polite" data-podglad-live></div>`,
  };
}

/* ================= UMÓW WIZYTĘ ================= */
export function umowWizyte(ctx) {
  const f = ctx.firma;
  const ok = okruszki(ctx, [{ n: "Umów wizytę", p: "/umow-wizyte" }]);
  return {
    path: "/umow-wizyte",
    title: "Umów wizytę — wymiana opon, wyważanie, zakup opon",
    description: `Umów sezonową wymianę opon, wyważanie lub zakup opon w Przyborowie koło Nowej Soli albo z dojazdem do Ciebie. Wybierz termin i wyślij zgłoszenie.`,
    schema: [ok.schema],
    body: `
<header class="ph"><div class="wrap">${ok.html}
  <h1>Umów wizytę</h1>
  <p class="lead">Wybierz usługę i dogodny termin. Potwierdzimy go telefonicznie lub w wiadomości zwrotnej.</p>
</div></header>
<section class="sekcja"><div class="wrap dwie-kol">
  <form class="form panel" data-zgloszenie="wizyta" novalidate>
    <fieldset class="pole"><legend>Usługa</legend>${radio("usluga", ["Wymiana sezonowa", "Zakup i montaż opon", "Wyważanie kół", "Naprawa opony", "Felgi", "Inna usługa"], true)}</fieldset>
    <fieldset class="pole"><legend>Pojazd</legend>${radio("pojazd", ["Osobowy", "SUV / 4x4", "Dostawczy", "Ciężarowy", "Rolniczy / budowlany"], true)}</fieldset>
    <fieldset class="pole"><legend>Gdzie?</legend>${radio("gdzie", ["W warsztacie w Przyborowie", "Z dojazdem do mnie"], true)}</fieldset>
    <div class="pole" data-adres hidden><label for="adres">Adres dojazdu</label><input class="input" id="adres" name="adres" autocomplete="street-address" placeholder="Miejscowość, ulica"></div>
    <div class="siatka-2">
      <div class="pole"><label for="data">Preferowany dzień</label><input class="input" type="date" id="data" name="data"></div>
      <fieldset class="pole"><legend>Pora dnia</legend>${radio("pora", ["Rano", "Południe", "Popołudnie"])}</fieldset>
    </div>
    <div class="siatka-2">
      <div class="pole"><label for="rozmiar2">Rozmiar opon</label><input class="input" id="rozmiar2" name="rozmiar" placeholder="np. 205/55 R16 91V" autocomplete="off"></div>
      <div class="pole"><label for="imie2">Imię</label><input class="input" id="imie2" name="imie" autocomplete="given-name"></div>
    </div>
    <div class="pole"><label for="uwagi2">Uwagi</label><textarea class="input" id="uwagi2" name="uwagi" placeholder="np. mam własne opony, potrzebuję nowych zimówek w budżecie do…"></textarea></div>
    ${wysylka(f)}
  </form>
  <aside>
    <div class="panel panel--sticky">
      <h2>Wolisz porozmawiać?</h2>
      <p class="muted">Ustalimy termin w minutę.</p>
      <a class="panel__tel" href="tel:+48${f.telefon}" data-tel>${f.telefonWyswietlany}</a>
      <div data-godziny-blok></div>
      <p class="form__info odstep-g">${esc(f.adres.ulica)}, ${esc(f.adres.kod)} ${esc(f.adres.miejscowosc)}</p>
    </div>
  </aside>
</div></section>`,
  };
}

/* ================= PORADNIK ================= */
export function poradnik(ctx) {
  const ok = okruszki(ctx, [{ n: "Poradnik", p: "/poradnik" }]);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Jak czytać oznaczenia opony — rozmiar, indeks nośności, indeks prędkości i DOT",
    author: { "@id": ctx.siteUrl + "/#firma" },
    publisher: { "@id": ctx.siteUrl + "/#firma" },
    inLanguage: "pl-PL",
    dateModified: ctx.dzis,
  };
  return {
    path: "/poradnik",
    title: "Poradnik: jak odczytać rozmiar opony i sprawdzić jej wiek (DOT)",
    description: "Interaktywny dekoder opon: wpisz rozmiar, np. 205/55 R16 91V, i sprawdź szerokość, profil, średnicę, nośność i prędkość. Kalkulator wieku opony z kodu DOT.",
    schema: [schema, ok.schema],
    body: `
<header class="ph"><div class="wrap">${ok.html}
  <h1>Poradnik oponiarza</h1>
  <p class="lead">Wpisz oznaczenie z boku opony, a pokażemy, co oznacza każda liczba. Sprawdzisz też, ile lat ma Twoja opona.</p>
</div></header>

<section class="sekcja" aria-labelledby="dek-h"><div class="wrap dekoder">
  <div>
    <h2 id="dek-h">Dekoder rozmiaru opony</h2>
    <p class="muted">Oznaczenie znajdziesz na boku opony. Działa dla opon osobowych, dostawczych i ciężarowych.</p>
    <div class="pole odstep-g">
      <label for="dek-in">Oznaczenie opony</label>
      <input class="input dekoder__input" id="dek-in" value="205/55 R16 91V" autocomplete="off" spellcheck="false" data-dekoder>
      <div class="przyklady" aria-label="Przykłady">
        <button type="button" data-przyklad="195/65 R15 91H">Osobowa</button>
        <button type="button" data-przyklad="235/50 R19 103V">SUV</button>
        <button type="button" data-przyklad="215/65 R16C 109/107R">Dostawcza</button>
        <button type="button" data-przyklad="385/65 R22.5 160K">Naczepa</button>
        <button type="button" data-przyklad="315/70 R22.5 154/150L">Ciężarowa</button>
      </div>
    </div>
  </div>
  <div class="bok" aria-live="polite">
    <div class="bok__kod" data-dek-kod></div>
    <dl class="wyniki" data-dek-wyniki></dl>
  </div>
</div></section>

<section class="sekcja sekcja--guma" aria-labelledby="dot-h"><div class="wrap dekoder">
  <div>
    <h2 id="dot-h">Ile lat ma opona?</h2>
    <p class="muted">Na boku opony znajdź napis DOT, a po nim ciąg znaków. Wpisz ostatnie cztery cyfry, np. 3523.</p>
    <div class="pole odstep-g">
      <label for="dot-in">Ostatnie 4 cyfry kodu DOT</label>
      <input class="input dekoder__input" id="dot-in" inputmode="numeric" maxlength="4" placeholder="3523" autocomplete="off" data-dot>
    </div>
  </div>
  <div class="bok" aria-live="polite">
    <div class="bok__kod"><span class="is-on">DOT</span><span>XXXX</span><span>XXXX</span><span class="is-on" data-dot-kod>____</span></div>
    <p class="dot-wynik" data-dot-wynik>Wpisz cztery cyfry, a policzymy wiek opony.</p>
  </div>
</div></section>

<section class="sekcja sekcja--beton" aria-labelledby="wiedza-h"><div class="wrap">
  <div class="sekcja__head"><h2 id="wiedza-h">Liczby, które warto znać</h2></div>
  <div class="karty-wiedzy">
    <div class="karta-w"><div class="karta-w__duza">1,6 mm</div><h3>Minimalny bieżnik</h3><p>Tyle wymagają przepisy w Polsce. Bezpieczniej zmienić opony zimowe przy ok. 4 mm, a letnie przy ok. 3 mm.</p></div>
    <div class="karta-w"><div class="karta-w__duza">7°C</div><h3>Pora na zmianę</h3><p>Gdy średnia temperatura dobowa spada poniżej 7°C, opony zimowe hamują skuteczniej niż letnie.</p></div>
    <div class="karta-w"><div class="karta-w__duza">co miesiąc</div><h3>Ciśnienie</h3><p>Sprawdzaj na zimnych oponach. Właściwe wartości znajdziesz na naklejce w drzwiach kierowcy lub klapce wlewu paliwa.</p></div>
    <div class="karta-w"><div class="karta-w__duza">5–10 lat</div><h3>Wiek opony</h3><p>Po 5 latach warto co roku sprawdzać stan opony. Opon starszych niż 10 lat nie zaleca się używać, nawet przy dobrym bieżniku.</p></div>
  </div>
</div></section>

<section class="sekcja" aria-labelledby="pf-h"><div class="wrap">
  <div class="sekcja__head"><h2 id="pf-h">Częste pytania o opony</h2></div>
  ${faqHtml(ctx.faq.filter((q) => /zimowe|bieżnika|lat ma/.test(q.p)))}
</div></section>`,
  };
}

/* ================= KONTAKT ================= */
export function kontakt(ctx) {
  const f = ctx.firma;
  const ok = okruszki(ctx, [{ n: "Kontakt", p: "/kontakt" }]);
  const trasa = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(f.mapaZapytanie)}`;
  return {
    path: "/kontakt",
    title: "Kontakt i dojazd — Podgórna 3, Przyborów koło Nowej Soli",
    description: `Kontakt z ${f.nazwa}: telefon ${f.telefonWyswietlany}, WhatsApp, adres ${f.adres.ulica}, ${f.adres.kod} ${f.adres.miejscowosc}. Wyznacz trasę lub zamów serwis mobilny.`,
    schema: [ok.schema],
    body: `
<header class="ph"><div class="wrap">${ok.html}
  <h1>Kontakt</h1>
  <p class="lead">Najszybciej złapiesz nas telefonicznie. W trasie lub w terenie oddzwaniamy, gdy tylko skończymy pracę przy kole.</p>
</div></header>
<section class="sekcja"><div class="wrap">
  <div class="kontakt-grid">
    <div class="k-karta"><h2>Telefon</h2><a class="k-karta__wart" href="tel:+48${f.telefon}" data-tel>${f.telefonWyswietlany}</a><p class="muted">Wycena, terminy, pomoc drogowa.</p><a class="btn" href="tel:+48${f.telefon}">${ikona.tel} Zadzwoń</a></div>
    <div class="k-karta"><h2>WhatsApp</h2><span class="k-karta__wart">${f.telefonWyswietlany}</span><p class="muted">Wyślij zdjęcie opony lub lokalizację.</p><a class="btn btn--wa" href="https://wa.me/${f.whatsapp}" target="_blank" rel="noopener">${ikona.wa} Napisz</a></div>
    <div class="k-karta"><h2>Warsztat</h2><span class="k-karta__wart">${esc(f.adres.ulica)}<br>${esc(f.adres.kod)} ${esc(f.adres.miejscowosc)}</span><p class="muted">${esc(f.adres.gmina)}, woj. ${esc(f.adres.wojewodztwo)}</p><a class="btn btn--ghost" href="${trasa}" target="_blank" rel="noopener">${ikona.trasa} Wyznacz trasę</a></div>
    <div class="k-karta"><h2>Godziny</h2><div data-godziny-blok><p>Pracujemy elastycznie — zadzwoń, a ustalimy dogodny termin.</p></div>${f.email ? `<p><a href="mailto:${esc(f.email)}">${esc(f.email)}</a></p>` : ""}<a class="btn btn--ghost" href="${f.linki.facebook}" target="_blank" rel="noopener">${ikona.fb} Facebook</a></div>
  </div>
</div></section>
<section class="sekcja sekcja--beton"><div class="wrap">${mapa(f)}</div></section>`,
  };
}

/* ================= POLITYKA PRYWATNOŚCI ================= */
export function polityka(ctx) {
  const f = ctx.firma;
  return {
    path: "/polityka-prywatnosci",
    title: "Polityka prywatności",
    description: `Polityka prywatności strony ${f.nazwa}. Strona nie używa plików cookie ani narzędzi śledzących.`,
    bezCta: true,
    body: `
<header class="ph"><div class="wrap"><h1>Polityka prywatności</h1><p class="lead">Krótko: ta strona nie śledzi Cię i nie zbiera danych.</p></div></header>
<section class="sekcja"><div class="wrap prose">
  <h2>Administrator</h2>
  <p>Administratorem danych przekazanych w kontakcie z firmą jest ${esc(f.nazwaPelna)}, ${esc(f.adres.ulica)}, ${esc(f.adres.kod)} ${esc(f.adres.miejscowosc)}, tel. ${f.telefonWyswietlany}.</p>
  <h2>Pliki cookie i analityka</h2>
  <p>Strona nie używa plików cookie, narzędzi analitycznych ani reklamowych. Czcionki i grafiki są ładowane z naszego serwera, a nie z serwisów zewnętrznych.</p>
  <h2>Formularze</h2>
  <p>Formularze „Zgłoś awarię” i „Umów wizytę” nie wysyłają danych na serwer strony. Przygotowują treść wiadomości w Twojej przeglądarce, którą następnie samodzielnie wysyłasz przez WhatsApp lub SMS. Lokalizacja jest pobierana wyłącznie po kliknięciu przycisku i za Twoją zgodą wyrażoną w przeglądarce.</p>
  <p>Dane z wiadomości (np. imię, numer telefonu, lokalizacja, opis pojazdu) wykorzystujemy tylko do obsługi zgłoszenia i kontaktu z Tobą (art. 6 ust. 1 lit. b RODO). Przechowujemy je tak długo, jak to potrzebne do realizacji usługi i rozliczeń.</p>
  <h2>Mapa Google</h2>
  <p>Mapa Google wczytuje się dopiero po kliknięciu przycisku „Pokaż mapę Google”. Od tego momentu obowiązuje polityka prywatności Google, a Google może zapisywać pliki cookie.</p>
  <h2>Serwisy zewnętrzne</h2>
  <p>Kontakt przez WhatsApp lub Facebook podlega regulaminom i politykom prywatności tych serwisów.</p>
  <h2>Twoje prawa</h2>
  <p>Masz prawo do dostępu do swoich danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania, a także prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych. W sprawie danych skontaktuj się z nami telefonicznie.</p>
</div></section>`,
  };
}

/* ================= 404 ================= */
export function blad404(ctx) {
  return {
    path: "/404",
    title: "Nie znaleziono strony",
    description: "Ta strona nie istnieje.",
    noindex: true,
    bezCta: true,
    body: `<section class="blad-404"><div class="wrap">
  <p class="h1">404</p>
  <h1 class="h2">Tu złapaliśmy gumę</h1>
  <p class="lead" >Strona, której szukasz, nie istnieje albo zmieniła adres.</p>
  <div class="btn-row odstep-g" data-center>
    <a class="btn" href="/">Wróć na stronę główną</a>
    <a class="btn btn--ghost" href="tel:+48${ctx.firma.telefon}">${ikona.tel} ${ctx.firma.telefonWyswietlany}</a>
  </div>
</div></section>`,
  };
}
