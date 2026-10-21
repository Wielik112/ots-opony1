/* OTS Opony TIR Serwis — interakcje strony. Bez zależności, bez śledzenia. */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  let cfg = { tel: "", wa: "", godziny: [] };
  try { cfg = JSON.parse($("#cfg").textContent); } catch (e) { /* domyślne */ }
  const ruch = !matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nagłówek: cień po przewinięciu ---------- */
  const header = $("[data-header]");
  const onScroll = () => header && header.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobilne ---------- */
  const burger = $("[data-burger]");
  const nav = $("[data-nav]");
  const zamknijMenu = () => {
    if (!burger) return;
    burger.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };
  burger && burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") !== "true";
    // menu zaczyna się tuż pod nagłówkiem — pasek sezonowy może mieć 1 lub 2 linie albo być już przewinięty
    if (open) document.documentElement.style.setProperty("--nav-top", Math.max(0, header.getBoundingClientRect().bottom) + "px");
    burger.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  });

  /* ---------- Rozwijane „Usługi” ---------- */
  $$("[data-drop]").forEach((btn) => {
    const menu = document.getElementById(btn.getAttribute("aria-controls"));
    const ustaw = (open) => { btn.setAttribute("aria-expanded", String(open)); menu.classList.toggle("is-open", open); };
    btn.addEventListener("click", (e) => { e.stopPropagation(); ustaw(btn.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("click", (e) => { if (!menu.contains(e.target)) ustaw(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if (btn.getAttribute("aria-expanded") === "true") { ustaw(false); btn.focus(); } zamknijMenu(); } });
  });

  /* ---------- Opona toczy się razem z przewijaniem ---------- */
  const kolo = $("[data-kolo]");
  if (kolo && ruch) {
    let tick = false;
    const krec = () => { kolo.style.transform = `rotate(${scrollY * 0.25}deg)`; tick = false; };
    addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(krec); } }, { passive: true });
    // krótki obrót na start — jedno zaplanowane wejście
    kolo.animate([{ transform: "rotate(-120deg)" }, { transform: "rotate(0deg)" }], { duration: 1400, easing: "cubic-bezier(.2,.8,.2,1)" });
  }

  /* ---------- Pasek sezonowy (zależny od miesiąca) ---------- */
  const sezonTxt = $("[data-sezon-txt]");
  const sezonLink = $("[data-sezon-link]");
  if (sezonTxt) {
    const m = new Date().getMonth() + 1;
    let t = "Sezonowa wymiana opon — umów termin bez czekania.", l = ["Umów wizytę", "/umow-wizyte"];
    if (m >= 10 && m <= 11) t = "Sezon na opony zimowe trwa. Umów wymianę, zanim spadnie pierwszy śnieg.";
    else if (m === 12 || m <= 2) { t = "Zima na drodze? Sprawdź bieżnik — bezpiecznie to min. 4 mm w zimówkach."; l = ["Sprawdź w poradniku", "/poradnik"]; }
    else if (m >= 3 && m <= 4) t = "Czas na opony letnie. Umów wymianę w dogodnym terminie.";
    else { t = "Awaria opony w trasie? Dojeżdżamy do osobówek, ciężarówek i maszyn."; l = ["Zgłoś awarię", "/zglos-awarie"]; }
    sezonTxt.textContent = t;
    sezonLink.textContent = l[0];
    sezonLink.href = l[1];
  }

  /* ---------- Godziny otwarcia + status „Teraz otwarte” ---------- */
  const dni = ["poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"];
  const godziny = Array.isArray(cfg.godziny) ? cfg.godziny : [];
  if (godziny.length) {
    // czas w Polsce, niezależnie od strefy czasowej odwiedzającego
    const pl = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Warsaw" }));
    const dzis = ((pl.getDay() + 6) % 7) + 1;
    const min = pl.getHours() * 60 + pl.getMinutes();
    const doMin = (s) => { const [h, mm] = s.split(":").map(Number); return h * 60 + mm; };
    const zakres = (d) => godziny.find((g) => g.dni.includes(d));
    const z = zakres(dzis);
    const otwarte = !!z && min >= doMin(z.od) && min < doMin(z.do);
    const wiersze = dni.map((n, i) => {
      const g = zakres(i + 1);
      return `<tr${i + 1 === dzis ? ' class="is-dzis"' : ""}><td>${n}</td><td>${g ? `${g.od}–${g.do}` : "zamknięte"}</td></tr>`;
    }).join("");
    $$("[data-godziny-blok]").forEach((el) => {
      el.innerHTML = `<p class="status ${otwarte ? "is-otwarte" : "is-zamkniete"}">${otwarte ? "Teraz otwarte" : "Teraz zamknięte"}</p><table class="godziny"><tbody>${wiersze}</tbody></table>`;
    });
  }

  /* ---------- Mapa Google wczytywana po kliknięciu ---------- */
  $$("[data-mapa]").forEach((box) => {
    const btn = $("[data-mapa-btn]", box);
    btn && btn.addEventListener("click", () => {
      const f = document.createElement("iframe");
      f.src = "https://www.google.com/maps?q=" + encodeURIComponent(box.dataset.q) + "&z=14&output=embed";
      f.title = "Mapa dojazdu do warsztatu";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      f.allowFullscreen = true;
      box.innerHTML = "";
      box.appendChild(f);
    });
  });

  /* ---------- Filtry (galeria i opinie) ---------- */
  $$("[data-filtry]").forEach((grupa) => {
    const typ = grupa.dataset.filtry;
    const elementy = typ === "galeria" ? $$("[data-galeria] .galeria__el") : $$("[data-opinie] .opinia");
    const klucz = typ === "galeria" ? "kat" : "tag";
    grupa.addEventListener("click", (e) => {
      const b = e.target.closest("[data-f]");
      if (!b) return;
      $$("[data-f]", grupa).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      const f = b.dataset.f;
      elementy.forEach((el) => { el.hidden = f !== "*" && el.dataset[klucz] !== f; });
    });
  });

  /* ---------- Lightbox galerii ---------- */
  const lb = $("[data-lightbox]");
  if (lb) {
    const im = $("[data-lb-img]", lb), op = $("[data-lb-opis]", lb);
    let lista = [], idx = 0, wroc = null;
    const widoczne = () => $$("[data-lb]").filter((b) => !b.closest(".galeria__el").hidden);
    const pokaz = (i) => {
      idx = (i + lista.length) % lista.length;
      const b = lista[idx];
      im.src = b.dataset.src; im.alt = b.dataset.alt; op.textContent = b.dataset.alt;
    };
    const zamknij = () => { lb.classList.remove("is-open"); document.body.style.overflow = ""; wroc && wroc.focus(); };
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-lb]");
      if (!b) return;
      lista = widoczne(); wroc = b;
      pokaz(lista.indexOf(b));
      lb.classList.add("is-open"); document.body.style.overflow = "hidden";
      $("[data-lb-close]", lb).focus();
    });
    $("[data-lb-close]", lb).addEventListener("click", zamknij);
    $("[data-lb-prev]", lb).addEventListener("click", () => pokaz(idx - 1));
    $("[data-lb-next]", lb).addEventListener("click", () => pokaz(idx + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) zamknij(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") zamknij();
      if (e.key === "ArrowLeft") pokaz(idx - 1);
      if (e.key === "ArrowRight") pokaz(idx + 1);
      if (e.key === "Tab") { // pułapka fokusu
        const f = $$("button", lb); const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Formularze zgłoszeń → WhatsApp / SMS ---------- */
  $$("[data-zgloszenie]").forEach((form) => {
    const typ = form.dataset.zgloszenie;
    let pozycja = null;
    const blad = $("[data-blad]", form);
    const lokBtn = $("[data-lok]", form);
    const lokStatus = $("[data-lok-status]", form);

    if (lokBtn) lokBtn.addEventListener("click", () => {
      if (!("geolocation" in navigator)) { lokStatus.textContent = "Twoja przeglądarka nie udostępnia lokalizacji. Opisz miejsce poniżej."; lokStatus.className = "lok__status is-blad"; return; }
      lokStatus.textContent = "Ustalamy lokalizację…"; lokStatus.className = "lok__status";
      navigator.geolocation.getCurrentPosition(
        (p) => {
          pozycja = { lat: p.coords.latitude.toFixed(5), lng: p.coords.longitude.toFixed(5), acc: Math.round(p.coords.accuracy) };
          lokStatus.textContent = `Lokalizacja dołączona (dokładność ok. ${pozycja.acc} m).`;
          lokStatus.className = "lok__status is-ok";
        },
        () => { lokStatus.textContent = "Nie udało się pobrać lokalizacji. Zezwól na nią w przeglądarce albo opisz miejsce poniżej."; lokStatus.className = "lok__status is-blad"; },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
      );
    });

    // pole adresu tylko przy dojeździe
    const adresBox = $("[data-adres]", form);
    if (adresBox) form.addEventListener("change", (e) => {
      if (e.target.name === "gdzie") adresBox.hidden = !/dojazdem/.test(e.target.value);
    });

    // minimalna data = dziś
    const data = $('input[type="date"]', form);
    if (data) { const d = new Date(); data.min = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }

    let kanal = "wa";
    $$("[data-kanal]", form).forEach((b) => b.addEventListener("click", () => { kanal = b.dataset.kanal; }));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const v = (k) => (fd.get(k) || "").toString().trim();
      const brak = typ === "awaria"
        ? (!v("pojazd") ? "Wybierz rodzaj pojazdu." : !v("problem") ? "Wybierz, co się stało." : !pozycja && !v("miejsce") ? "Dołącz lokalizację albo opisz, gdzie jesteś." : "")
        : (!v("usluga") ? "Wybierz usługę." : !v("pojazd") ? "Wybierz pojazd." : !v("gdzie") ? "Wybierz, gdzie ma się odbyć usługa." : "");
      if (brak) { blad.textContent = brak; blad.hidden = false; return; }
      blad.hidden = true;

      const linie = [];
      if (typ === "awaria") {
        linie.push("ZGŁOSZENIE AWARII OPONY");
        linie.push(`Pojazd: ${v("pojazd")}`, `Problem: ${v("problem")}`);
        if (v("rozmiar")) linie.push(`Rozmiar: ${v("rozmiar")}`);
        if (v("ile")) linie.push(`Liczba kół: ${v("ile")}`);
        if (pozycja) linie.push(`Lokalizacja: https://maps.google.com/?q=${pozycja.lat},${pozycja.lng}`);
        if (v("miejsce")) linie.push(`Miejsce: ${v("miejsce")}`);
        if (v("nrrej")) linie.push(`Nr rej.: ${v("nrrej")}`);
      } else {
        linie.push("PROŚBA O TERMIN");
        linie.push(`Usługa: ${v("usluga")}`, `Pojazd: ${v("pojazd")}`, `Gdzie: ${v("gdzie")}`);
        if (v("adres")) linie.push(`Adres: ${v("adres")}`);
        if (v("data")) linie.push(`Dzień: ${v("data").split("-").reverse().join(".")}${v("pora") ? ", " + v("pora").toLowerCase() : ""}`);
        else if (v("pora")) linie.push(`Pora: ${v("pora")}`);
        if (v("rozmiar")) linie.push(`Rozmiar opon: ${v("rozmiar")}`);
      }
      if (v("uwagi")) linie.push(`Uwagi: ${v("uwagi")}`);
      if (v("imie")) linie.push(`Imię: ${v("imie")}`);
      const tekst = linie.join("\n");

      const url = kanal === "sms"
        ? `sms:+48${cfg.tel}?&body=${encodeURIComponent(tekst)}`
        : `https://wa.me/${cfg.wa}?text=${encodeURIComponent(tekst)}`;
      window.location.href = url;
    });
  });

  /* ---------- Dekoder rozmiaru opony ---------- */
  const LI = {60:250,61:257,62:265,63:272,64:280,65:290,66:300,67:307,68:315,69:325,70:335,71:345,72:355,73:365,74:375,75:387,76:400,77:412,78:425,79:437,80:450,81:462,82:475,83:487,84:500,85:515,86:530,87:545,88:560,89:580,90:600,91:615,92:630,93:650,94:670,95:690,96:710,97:730,98:750,99:775,100:800,101:825,102:850,103:875,104:900,105:925,106:950,107:975,108:1000,109:1030,110:1060,111:1090,112:1120,113:1150,114:1180,115:1215,116:1250,117:1285,118:1320,119:1360,120:1400,121:1450,122:1500,123:1550,124:1600,125:1650,126:1700,127:1750,128:1800,129:1850,130:1900,131:1950,132:2000,133:2060,134:2120,135:2180,136:2240,137:2300,138:2360,139:2430,140:2500,141:2575,142:2650,143:2725,144:2800,145:2900,146:3000,147:3075,148:3150,149:3250,150:3350,151:3450,152:3550,153:3650,154:3750,155:3875,156:4000,157:4125,158:4250,159:4375,160:4500};
  const SI = { J: 100, K: 110, L: 120, M: 130, N: 140, P: 150, Q: 160, R: 170, S: 180, T: 190, U: 200, H: 210, V: 240, W: 270, Y: 300 };
  const fmt = (n) => n.toLocaleString("pl-PL");
  const dekIn = $("[data-dekoder]");
  if (dekIn) {
    const kod = $("[data-dek-kod]"), wyn = $("[data-dek-wyniki]");
    const kol = { szer: "#ff8200", profil: "#ffb13b", felga: "#66b3ff", li: "#39d17f", si: "#e889ff" };
    const wiersz = (k, dt, dd) => `<div><dt>${k ? `<span class="kropka" data-kol="${k}"></span>` : ""}${dt}</dt><dd>${dd}</dd></div>`;
    const dekoduj = () => {
      const raw = dekIn.value.toUpperCase().replace(",", ".").replace(/\s+/g, " ").trim();
      const m = raw.match(/^(\d{3})\s*\/\s*(\d{2})\s*Z?R?F?\s*(\d{2}(?:\.5)?)\s*(C)?\s*(?:(\d{2,3})(?:\s*\/\s*(\d{2,3}))?\s*([A-Z])?)?/);
      if (!m) {
        kod.innerHTML = `<span>${raw.replace(/[<>&]/g, "") || "___/__ R__"}</span>`;
        wyn.innerHTML = wiersz("", "Format", "Wpisz np. 205/55 R16 91V");
        return;
      }
      const [, sz, pr, fe, c, li1, li2, si] = m;
      const s = +sz, p = +pr, r = parseFloat(fe);
      const sciana = Math.round((s * p) / 100);
      const sred = Math.round(r * 25.4 + 2 * sciana);
      const obw = Math.round(Math.PI * sred);
      kod.innerHTML = [
        `<span class="is-on" data-k="szer">${sz}</span>`, `<span>/</span>`, `<span class="is-on" data-k="profil">${pr}</span>`,
        `<span class="is-on" data-k="felga">R${fe}${c ? "C" : ""}</span>`,
        li1 ? `<span class="is-on" data-k="li">${li1}${li2 ? "/" + li2 : ""}</span>` : "",
        si ? `<span class="is-on" data-k="si">${si}</span>` : "",
      ].join("");
      let h = "";
      h += wiersz("szer", "Szerokość opony", `${s} mm`);
      h += wiersz("profil", "Wysokość ścianki bocznej", `${p}% szerokości = ${sciana} mm`);
      h += wiersz("felga", "Średnica felgi", `${fe.replace(".", ",")}″ (${Math.round(r * 25.4)} mm)${c ? ", opona dostawcza (C)" : ""}`);
      if (li1) {
        const kg = LI[+li1];
        h += wiersz("li", li2 ? "Nośność: pojedyncze / bliźniacze" : "Indeks nośności", kg ? `${li1} = ${fmt(kg)} kg${li2 && LI[+li2] ? ` / ${li2} = ${fmt(LI[+li2])} kg` : ""} na oponę` : li1);
      }
      if (si) h += wiersz("si", "Indeks prędkości", SI[si] ? `${si} = do ${SI[si]} km/h` : si);
      h += wiersz("", "Średnica całego koła", `ok. ${sred} mm`);
      h += wiersz("", "Obwód toczny", `ok. ${fmt(obw)} mm`);
      wyn.innerHTML = h;
      $$("[data-kol]", wyn).forEach((el) => { el.style.background = kol[el.dataset.kol]; });
    };
    dekIn.addEventListener("input", dekoduj);
    $$("[data-przyklad]").forEach((b) => b.addEventListener("click", () => { dekIn.value = b.dataset.przyklad; dekoduj(); }));
    dekoduj();
  }

  /* ---------- Wiek opony z kodu DOT ---------- */
  const dotIn = $("[data-dot]");
  if (dotIn) {
    const out = $("[data-dot-wynik]"), dk = $("[data-dot-kod]");
    dotIn.addEventListener("input", () => {
      dotIn.value = dotIn.value.replace(/\D/g, "").slice(0, 4);
      const v = dotIn.value;
      dk.textContent = v.padEnd(4, "_");
      if (v.length < 4) { out.textContent = "Wpisz cztery cyfry, a policzymy wiek opony."; return; }
      const tydz = +v.slice(0, 2), rok = 2000 + +v.slice(2);
      const teraz = new Date();
      if (tydz < 1 || tydz > 53) { out.textContent = "Pierwsze dwie cyfry to tydzień produkcji (01–53). Sprawdź kod jeszcze raz."; return; }
      const prod = new Date(rok, 0, 1 + (tydz - 1) * 7);
      if (prod > teraz) { out.textContent = "Ta data jest w przyszłości. Sprawdź, czy to na pewno ostatnie cztery cyfry kodu DOT."; return; }
      const lata = (teraz - prod) / (365.25 * 864e5);
      const l = Math.floor(lata), mies = Math.floor((lata - l) * 12);
      const wiek = `${l > 0 ? `${l} ${l === 1 ? "rok" : l % 10 >= 2 && l % 10 <= 4 && (l % 100 < 10 || l % 100 >= 20) ? "lata" : "lat"}` : ""}${l > 0 && mies ? " i " : ""}${mies || !l ? `${mies} mies.` : ""}`;
      let ocena = "Opona jest młoda — liczy się przede wszystkim bieżnik i ciśnienie.";
      if (lata >= 10) ocena = "Opona ma ponad 10 lat. Nie zalecamy jej używania, nawet jeśli bieżnik wygląda dobrze. Zadzwoń — dobierzemy nową.";
      else if (lata >= 6) ocena = "Guma starzeje się z czasem. Warto, żebyśmy obejrzeli oponę pod kątem pęknięć i twardnienia.";
      else if (lata >= 5) ocena = "Po 5 latach warto co roku kontrolować stan opony.";
      out.textContent = `Wyprodukowana w ${tydz}. tygodniu ${rok} roku. Wiek: ${wiek}${wiek.endsWith(".") ? "" : "."} ${ocena}`;
    });
  }
})();
