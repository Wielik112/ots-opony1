// Generator strony — czysty Node.js, bez zależności.
// Uruchom: node build.js  →  wynik w folderze dist/
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { layout } from "./src/layout.js";
import * as M from "./src/pages-main.js";
import * as T from "./src/pages-tools.js";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, "dist");
const czytaj = (p) => JSON.parse(readFileSync(join(ROOT, "content", p), "utf8"));

const firma = czytaj("firma.json");
const uslugi = czytaj("uslugi.json");
const opinie = czytaj("opinie.json");
const faq = czytaj("faq.json");
const galeria = czytaj("galeria.json");

// Adres strony: firma.json → zmienna Vercel → localhost
const siteUrl = (
  firma.siteUrl ||
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

// Czysty start
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(ROOT, "src/assets"), join(DIST, "assets"), { recursive: true });
cpSync(join(ROOT, "public"), DIST, { recursive: true });

// Nazwy plików z hashem — przeglądarka trzyma je w cache „na zawsze”, a każda zmiana od razu dociera do klientów
const hashuj = (rel) => {
  const src = join(DIST, rel);
  const buf = readFileSync(src);
  const h = createHash("sha256").update(buf).digest("hex").slice(0, 10);
  const out = rel.replace(/\.(\w+)$/, `.${h}.$1`);
  writeFileSync(join(DIST, out), minify(buf.toString(), rel.endsWith(".css")));
  rmSync(src);
  return "/" + out;
};
function minify(code, css) {
  if (!css) return code; // JS zostaje czytelny; Vercel i tak kompresuje (brotli)
  return code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").replace(/;}/g, "}").trim();
}
const assets = { css: hashuj("assets/css/style.css"), js: hashuj("assets/js/main.js") };

const wymiary = Object.fromEntries(galeria.map((g) => [g.plik, { w: g.w, h: g.h }]));
wymiary["logo-ots"] = { w: 1536, h: 1024 };
const dzis = new Date().toISOString().slice(0, 10);
const ctx = { firma, uslugi, opinie, faq, galeria, siteUrl, assets, wymiary, dzis };

// Dane firmy dla Google (LocalBusiness)
const godzinySchema = (firma.godziny || []).map((g) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: g.dni.map((d) => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][d - 1]),
  opens: g.od, closes: g.do,
}));
const firmaSchema = {
  "@context": "https://schema.org",
  "@type": ["TireShop", "AutoRepair"],
  "@id": siteUrl + "/#firma",
  name: firma.nazwaPelna,
  alternateName: firma.nazwa,
  url: siteUrl + "/",
  telephone: "+48" + firma.telefon,
  ...(firma.email ? { email: firma.email } : {}),
  image: [siteUrl + "/assets/img/og-image.jpg", siteUrl + "/assets/img/serwis-mobilny-naczepa.webp"],
  logo: siteUrl + "/assets/img/logo-ots.webp",
  founder: { "@type": "Person", name: firma.wlasciciel },
  address: {
    "@type": "PostalAddress",
    streetAddress: firma.adres.ulica,
    postalCode: firma.adres.kod,
    addressLocality: firma.adres.miejscowosc,
    addressRegion: firma.adres.wojewodztwo,
    addressCountry: firma.adres.kraj,
  },
  areaServed: firma.obszar.filter((m) => !m.startsWith("trasa")).map((m) => ({ "@type": "City", name: m })),
  sameAs: [firma.linki.facebook],
  ...(godzinySchema.length ? { openingHoursSpecification: godzinySchema } : {}),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Usługi oponiarskie",
    itemListElement: uslugi.map((u) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: u.nazwa, url: `${siteUrl}/uslugi/${u.slug}` } })),
  },
};
const webSchema = { "@context": "https://schema.org", "@type": "WebSite", "@id": siteUrl + "/#www", url: siteUrl + "/", name: firma.nazwa, inLanguage: "pl-PL", publisher: { "@id": siteUrl + "/#firma" } };

// Lista stron
const strony = [
  M.home(ctx),
  M.uslugiIndex(ctx),
  ...uslugi.map((u) => M.uslugaStrona(ctx, u)),
  T.zglosAwarie(ctx),
  T.umowWizyte(ctx),
  T.poradnik(ctx),
  M.galeriaStrona(ctx),
  M.opinieStrona(ctx),
  M.oNas(ctx),
  M.faqStrona(ctx),
  T.kontakt(ctx),
  T.polityka(ctx),
  T.blad404(ctx),
];

for (const s of strony) {
  s.schema = [firmaSchema, ...(s.path === "/" ? [webSchema] : []), ...(s.schema || [])];
  if (s.body.includes("data-galeria")) s.body += M.lightbox();
  const html = layout(ctx, s).replace(/\n\s*\n/g, "\n");
  const plik = s.path === "/" ? "index.html" : s.path.slice(1) + ".html";
  mkdirSync(dirname(join(DIST, plik)), { recursive: true });
  writeFileSync(join(DIST, plik), html);
}

// Sitemap + robots
const priorytet = (p) => (p === "/" ? "1.0" : p.startsWith("/uslugi") || p === "/zglos-awarie" ? "0.9" : "0.7");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${strony.filter((s) => !s.noindex).map((s) => `  <url><loc>${siteUrl}${s.path === "/" ? "/" : s.path}</loc><lastmod>${dzis}</lastmod><priority>${priorytet(s.path)}</priority></url>`).join("\n")}
</urlset>
`;
writeFileSync(join(DIST, "sitemap.xml"), sitemap);
writeFileSync(join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

// Manifest (dodanie do ekranu głównego telefonu)
writeFileSync(join(DIST, "site.webmanifest"), JSON.stringify({
  name: firma.nazwa, short_name: "OTS Opony", lang: "pl", start_url: "/", display: "standalone",
  background_color: "#141518", theme_color: "#141518",
  icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png" }],
}, null, 2));

console.log(`✔ Zbudowano ${strony.length} stron → dist/  (adres: ${siteUrl})`);
if (!existsSync(join(DIST, "index.html"))) process.exit(1);
