import { memo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "../../i18n/content";
import "./CinematicHero.css";

import Gevel from "../../Assets/Images/ext-villa-voorkant.jpg";
import Woonkamer from "../../Assets/Images/int-woonkamer.jpg";
import WoonkamerMobiel from "../../Assets/Images/int-woonkamer-mobiel.jpg";

// Scrollgestuurde opening: de scène blijft staan terwijl je scrolt. De gevel van de villa
// gaat open als een deur en onthult het interieur. --p (0 → 1) stuurt alles aan.
// Scrollwaarden gaan direct op het element (geen React-render per scrollstap).
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ramp = (p: number, from: number, to: number) => clamp((p - from) / (to - from));

function CinematicHero() {
    const tc = useContent();
    const navigate = useNavigate();
    const rootRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        let raf = 0;

        const update = () => {
            raf = 0;
            const rect = el.getBoundingClientRect();
            const total = rect.height - window.innerHeight;
            const p = clamp(-rect.top / Math.max(total, 1));
            const o = 0.012 + ramp(p, 0.12, 0.7) * 0.988;                  // deur: 0 → open
            const a = 1 - ramp(p, 0.2, 0.38);                               // intro-tekst weg
            const b = ramp(p, 0.5, 0.64) * (1 - ramp(p, 0.88, 0.99));       // tweede tekst
            const s = el.style;
            s.setProperty("--p", p.toFixed(4));
            s.setProperty("--o", o.toFixed(4));
            s.setProperty("--a", a.toFixed(3));
            s.setProperty("--b", b.toFixed(3));
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
        <section
            className="vv-cine"
            ref={rootRef}
            aria-label={tc("Hero")}
            style={{ "--p": 0, "--o": 0.012, "--a": 1, "--b": 0, "--img-int": `url(${Woonkamer})`, "--img-int-m": `url(${WoonkamerMobiel})` } as React.CSSProperties}
        >
            <div className="vv-cine-stage">
                <img className="vv-cine-ext" src={Gevel} alt={tc("Villa Vredestein, historische villa uit 1905 in Driebergen-Rijsenburg")} fetchPriority="high" />
                <div className="vv-cine-int" role="img" aria-label={tc("Woonkamer Villa Vredestein")} />
                <div className="vv-cine-seam" aria-hidden="true" />
                <div className="vv-cine-dim" aria-hidden="true" />
                <div className="vv-cine-vignette" aria-hidden="true" />

                <div className="vv-cine-copy vv-cine-copy--a">
                    <p className="vv-cine-eyebrow">{tc("Driebergen-Rijsenburg · Utrechtse Heuvelrug")}</p>
                    <h1 className="vv-cine-title">{tc("Villa Vredestein")}</h1>
                    <p className="vv-cine-sub">
                        {tc("Een historische villa uit 1905 in het hart van Driebergen-Rijsenburg, op de Utrechtse Heuvelrug. Verblijf, restauratie en een open deur.")}
                    </p>
                    <div className="vv-cine-ctas">
                        <button className="hero-btn-primary" onClick={() => navigate("/verhaal")}>{tc("Over ons")}</button>
                        <button className="hero-btn-ghost" onClick={() => navigate("/tijdlijn")}>{tc("Tijdlijn")}</button>
                    </div>
                </div>

                <div className="vv-cine-copy vv-cine-copy--b" aria-hidden="true">
                    <p className="vv-cine-eyebrow">{tc("Gebouwd in 1905")}</p>
                    <p className="vv-cine-statement">{tc("Een huis met meer dan een eeuw verhaal")}</p>
                </div>

                <div className="vv-cine-scroll" aria-hidden="true">
                    <span>Scroll</span>
                    <i />
                </div>
            </div>
        </section>
    );
}

export default memo(CinematicHero);
