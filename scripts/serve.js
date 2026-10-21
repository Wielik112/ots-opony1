// Lokalny podgląd strony (działa jak Vercel: adresy bez .html). Uruchom: npm run dev
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = fileURLToPath(new URL("../dist", import.meta.url));
const PORT = process.env.PORT || 3000;
const TYPY = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain", ".webmanifest": "application/manifest+json" };

const istnieje = async (p) => { try { return (await stat(p)).isFile(); } catch { return false; } };

createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  p = normalize(p).replace(/^(\.\.[/\\])+/, "");
  let plik = join(DIST, p);
  if (p === "/") plik = join(DIST, "index.html");
  else if (!(await istnieje(plik)) && (await istnieje(plik + ".html"))) plik += ".html";
  if (!plik.startsWith(DIST) || !(await istnieje(plik))) {
    res.writeHead(404, { "content-type": TYPY[".html"] });
    return res.end(await readFile(join(DIST, "404.html")));
  }
  res.writeHead(200, { "content-type": TYPY[extname(plik)] || "application/octet-stream" });
  res.end(await readFile(plik));
}).listen(PORT, () => console.log(`Podgląd: http://localhost:${PORT}`));
