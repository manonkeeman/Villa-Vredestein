// Prerendert elke route uit public/sitemap.xml naar statische HTML in dist/,
// zodat elke pagina zijn eigen (react-helmet-async) title/canonical/og-tags
// al in de ruwe HTML heeft staan — nodig voor crawlers die geen JS uitvoeren
// (WhatsApp, Facebook, X, LinkedIn) en om dubbele/tegenstrijdige canonical-
// signalen voor Google te voorkomen.

import { preview } from "vite";
import puppeteer from "puppeteer";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");

function getRoutesFromSitemap() {
    const xml = readFileSync(join(root, "public/sitemap.xml"), "utf-8");
    const matches = [...xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)];
    return matches.map((m) => new URL(m[1]).pathname);
}

async function main() {
    const routes = getRoutesFromSitemap();
    console.log(`Prerendering ${routes.length} routes...`);

    const server = await preview({
        root,
        preview: { port: 4173, strictPort: false },
    });
    const base = server.resolvedUrls.local[0].replace(/\/$/, "");

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    let page = await browser.newPage();

    const failed = [];
    // Eerst alles in het geheugen opbouwen, pas na de hele crawl wegschrijven.
    // Anders overschrijft route "/" halverwege dist/index.html, en Vite's
    // SPA-fallback serveert die (al gerenderde) versie als basisdocument aan
    // nog te bezoeken routes — waardoor hun react-helmet-async-tags zich
    // opstapelen bovenop de allang aanwezige tags van "/".
    const rendered = [];

    for (const route of routes) {
        const url = base + route;
        try {
            // "domcontentloaded" i.p.v. "networkidle0": pagina's met veel/grote
            // afbeeldingen (bv. /galerij) houden het netwerk lang bezig, terwijl
            // React (en dus react-helmet-async) allang klaar is met renderen.
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });

            // Wacht tot zowel het AANTAL <title>-tags als de TEKST ervan een
            // paar metingen op rij gelijk blijven. react-helmet-async +
            // async taaldetectie (i18next) renderen na de eerste commit nog
            // een paar keer opnieuw: eerst met een lege/voorlopige vertaling,
            // daarna met de definitieve tekst in dezelfde node. Alleen op het
            // aantal nodes wachten mist die tekst-update.
            await page.waitForFunction(
                () => document.querySelector('link[rel="canonical"]') !== null,
                { timeout: 10000 }
            ).catch(() => {});

            let lastSignature = null;
            let stableChecks = 0;
            for (let i = 0; i < 20 && stableChecks < 3; i++) {
                const signature = await page.evaluate(() => {
                    const titles = [...document.querySelectorAll("title")].map((t) => t.textContent);
                    return JSON.stringify(titles);
                });
                stableChecks = signature === lastSignature ? stableChecks + 1 : 0;
                lastSignature = signature;
                await new Promise((r) => setTimeout(r, 150));
            }

            const html = await page.content();
            rendered.push({ route, html });
            console.log(`  ✓ ${route}`);
        } catch (err) {
            console.error(`  ✗ ${route}: ${err.message}`);
            failed.push(route);
            // pagina/frame kan corrupt zijn na een crash — begin vers voor de
            // volgende route zodat één kapotte pagina de rest niet meesleurt
            await page.close().catch(() => {});
            page = await browser.newPage();
        }
    }

    await browser.close();
    await new Promise((resolve, reject) => {
        server.httpServer.close((err) => (err ? reject(err) : resolve()));
    });

    for (const { route, html } of rendered) {
        const outDir = route === "/" ? distDir : join(distDir, route);
        mkdirSync(outDir, { recursive: true });
        writeFileSync(join(outDir, "index.html"), html, "utf-8");
    }

    if (failed.length > 0) {
        console.error(`\nPrerendering klaar met ${failed.length} fout(en): ${failed.join(", ")}`);
        process.exit(1);
    }

    console.log(`Prerendering klaar: ${rendered.length} pagina's weggeschreven.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
