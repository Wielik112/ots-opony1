# OTS Opony TIR Serwis — strona internetowa

Szybka, bezpieczna strona statyczna dla **OTS Opony TIR Serwis Bartłomiej Adamczyk** (Przyborów, Nowa Sól).
Bez WordPressa, bez bazy danych, bez wtyczek — nie ma czego zhakować ani aktualizować.

## Wdrożenie: GitHub → Vercel

1. Rozpakuj ZIP i wrzuć **całą zawartość** do nowego repozytorium na GitHubie
   (na github.com: *New repository* → *uploading an existing file* → przeciągnij pliki).
2. Na [vercel.com](https://vercel.com) kliknij **Add New → Project**, wybierz to repozytorium i **Deploy**.
   Nic nie trzeba ustawiać — konfiguracja jest w `vercel.json` (polecenie `node build.js`, folder `dist`).
3. Własna domena: w Vercel → *Settings → Domains* dodaj np. `otsopony.pl`, a potem wpisz ją w
   `content/firma.json` w polu `"siteUrl"` (np. `"https://www.otsopony.pl"`). Dzięki temu mapa strony
   i adresy dla Google wskażą właściwą domenę.

Każda zmiana wypchnięta na GitHub sama się opublikuje w ~20 sekund.

## Jak zmieniać treści (bez programowania)

Wszystkie treści są w folderze **`content/`** — edytujesz tekst w pliku i zapisujesz (można bezpośrednio na github.com, ikonka ołówka).

| Plik | Co zawiera |
|---|---|
| `content/firma.json` | telefon, adres, **godziny otwarcia**, ocena, linki, miejscowości dojazdu |
| `content/uslugi.json` | usługi i ich podstrony (opisy, zakres, kroki) |
| `content/opinie.json` | opinie klientów (dodaj nowy wpis, aby pojawił się na stronie) |
| `content/faq.json` | pytania i odpowiedzi |
| `content/galeria.json` | zdjęcia w galerii |

**Godziny otwarcia** — pole `"godziny"` jest puste, bo nie znamy ich dokładnie. Po wpisaniu, np.:

```json
"godziny": [
  { "dni": [1,2,3,4,5], "od": "08:00", "do": "17:00" },
  { "dni": [6], "od": "08:00", "do": "13:00" }
]
```

strona sama pokaże tabelę godzin, znacznik „Teraz otwarte / zamknięte” i przekaże godziny do Google.

**Nowe zdjęcie** — wrzuć plik `.webp` do `src/assets/img/` (najlepiej szerokość do 1200 px) i dopisz go w `content/galeria.json`
z wymiarami `w` i `h`. Jeśli zdjęcie jest szersze niż 420 px, dodaj też mniejszą wersję `nazwa-420.webp` (dla telefonów).

## Podgląd na komputerze (opcjonalnie)

Wymaga Node.js 18+:

```bash
npm run dev     # zbuduje stronę i uruchomi podgląd na http://localhost:3000
```

## Co jest w środku

- **17 podstron**: strona główna, 5 podstron usług + przegląd, Zgłoś awarię, Umów wizytę, Poradnik (dekoder rozmiaru opony i kalkulator wieku DOT), Galeria, Opinie, O nas, FAQ, Kontakt, Polityka prywatności, 404.
- **Samoobsługa**: formularze awarii i wizyty składają gotową wiadomość i wysyłają ją przez WhatsApp lub SMS (z lokalizacją GPS przy awarii). Żadne dane nie trafiają na serwer.
- **SEO**: unikalne tytuły i opisy, dane strukturalne Google (TireShop/AutoRepair, usługi, FAQ, okruszki), `sitemap.xml`, `robots.txt`, Open Graph do udostępnień.
- **Wydajność**: brak zewnętrznych skryptów i czcionek, obrazy WebP w dwóch rozmiarach, pliki CSS/JS z hashem i wieczną pamięcią podręczną.
- **Bezpieczeństwo**: ścisłe nagłówki (CSP, HSTS, X-Frame-Options, Permissions-Policy), brak plików cookie, mapa Google ładowana dopiero po kliknięciu (RODO).
- **Dostępność**: nawigacja klawiaturą, widoczny fokus, opisy zdjęć, obsługa „ogranicz ruch”.

## Struktura

```
content/        ← treści do edycji
src/            ← szablony stron, style i skrypty
  assets/       ← css, js, czcionki, zdjęcia
public/         ← favicony
build.js        ← generator strony (bez zależności)
vercel.json     ← konfiguracja Vercel + nagłówki bezpieczeństwa
```
