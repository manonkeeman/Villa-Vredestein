import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Experience.css";

// Beleving over de hele site (geïnspireerd op Aalto Digital Atelier):
//  1. laadscherm met percentage (eenmaal per sessie, alleen op de homepage)
//  2. scrollvoortgang (balk + percentage) op elke pagina
//  3. zachte reveal van koppen, tekst en blokken op elke pagina
// Alles wordt pas na de eerste render door JS toegevoegd, zodat de geprerenderde
// HTML voor zoekmachines volledig zichtbaar blijft.

const KEY = "vv-preloader-seen";

const reduceMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Preloader() {
    const { pathname } = useLocation();
    const [state, setState] = useState<"idle" | "show" | "out" | "done">("idle");
    const [pct, setPct] = useState(0);

    useLayoutEffect(() => {
        if (typeof window === "undefined") return;
        // Haal een overgebleven scrollblokkade weg (bijv. uit oude geprerenderde HTML).
        document.documentElement.style.overflow = "";
        if (pathname !== "/") return;
        let seen = false;
        try { seen = sessionStorage.getItem(KEY) === "1"; } catch { /* privémodus */ }
        if (seen || reduceMotion()) return;

        setState("show");
        document.documentElement.style.overflow = "hidden";
        const start = performance.now();
        const DUR = 1500;
        let raf = 0;
        let t: ReturnType<typeof setTimeout>;
        const tick = (now: number) => {
            const k = Math.min(1, (now - start) / DUR);
            setPct(Math.round((1 - Math.pow(1 - k, 2.2)) * 100));
            if (k < 1) raf = requestAnimationFrame(tick);
            else {
                try { sessionStorage.setItem(KEY, "1"); } catch { /* negeren */ }
                setState("out");
                t = setTimeout(() => {
                    setState("done");
                    document.documentElement.style.overflow = "";
                }, 800);
            }
        };
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(t);
            document.documentElement.style.overflow = "";
        };
    }, [pathname]);

    if (state === "idle" || state === "done") return null;
    return (
        <div className={`xp-preloader ${state === "out" ? "is-out" : ""}`} role="status" aria-live="polite" aria-label="Laden">
            <div className="xp-preloader-inner">
                <span className="xp-preloader-word">VILLA VREDESTEIN</span>
                <span className="xp-preloader-bar"><i style={{ transform: `scaleX(${pct / 100})` }} /></span>
                <span className="xp-preloader-pct">{String(pct).padStart(2, "0")}%</span>
            </div>
        </div>
    );
}

function ScrollProgress() {
    useEffect(() => {
        const bar = document.getElementById("xp-bar");
        const num = document.getElementById("xp-num");
        let raf = 0;
        const update = () => {
            raf = 0;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
            if (bar) bar.style.transform = `scaleX(${p})`;
            if (num) num.textContent = `${String(Math.round(p * 100)).padStart(2, "0")}%`;
        };
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <>
            <div className="xp-bar" aria-hidden="true"><i id="xp-bar" /></div>
            <div className="xp-num" aria-hidden="true">[ <span id="xp-num">00%</span> ]</div>
        </>
    );
}

// Elementen die zacht binnenkomen. Hero's, kaarten en interactieve onderdelen blijven met rust.
const REVEAL = "main h1, main h2, main h3, main p, main blockquote, main figure, main section > div, main article";
const SKIP = ".vv-cine, .leaflet-container, .reveal-section, .reveal-row, .xp-rv, [data-no-reveal]";

function useReveal() {
    const { pathname } = useLocation();
    useEffect(() => {
        if (reduceMotion()) return;
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("xp-in");
                    io.unobserve(e.target);
                }
            }),
            { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
        );
        // Wacht even tot de nieuwe pagina in de DOM staat
        const t = setTimeout(() => {
            const seen = new Set<Element>();
            document.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => {
                if (el.closest(SKIP) || el.matches(SKIP) || seen.has(el)) return;
                // geneste doelen overslaan: alleen het buitenste element animeert
                if (el.parentElement?.closest(".xp-rv")) return;
                seen.add(el);
                const idx = Array.prototype.indexOf.call(el.parentElement?.children ?? [], el);
                el.style.setProperty("--xp-d", `${Math.min(Math.max(idx, 0), 5) * 70}ms`);
                el.classList.add("xp-rv");
                io.observe(el);
            });
        }, 60);
        return () => { clearTimeout(t); io.disconnect(); };
    }, [pathname]);
}

// Parallax: grote foto's bewegen iets trager dan de pagina (alleen foto's met speelruimte in hun kader)
const PARALLAX = ".oo-section:not(.oo-section--video) .oo-img-wrap:not(.oo-img-wrap--contain) img.oo-img, .intro-img-col img";

function useParallax() {
    const { pathname } = useLocation();
    useEffect(() => {
        if (reduceMotion()) return;
        let els: HTMLElement[] = [];
        let raf = 0;
        const update = () => {
            raf = 0;
            const vh = window.innerHeight;
            els.forEach((el) => {
                const r = el.getBoundingClientRect();
                if (r.bottom < -120 || r.top > vh + 120) return;
                const k = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1
                el.style.setProperty("--py", `${(-k * 26).toFixed(1)}px`);
            });
        };
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
        const t = setTimeout(() => {
            els = Array.from(document.querySelectorAll<HTMLElement>(PARALLAX));
            els.forEach((el) => el.classList.add("xp-par"));
            update();
        }, 120);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            clearTimeout(t);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf) cancelAnimationFrame(raf);
            els.forEach((el) => { el.classList.remove("xp-par"); el.style.removeProperty("--py"); });
        };
    }, [pathname]);
}

export default function Experience() {
    useReveal();
    useParallax();
    return (
        <>
            <Preloader />
            <ScrollProgress />
        </>
    );
}
