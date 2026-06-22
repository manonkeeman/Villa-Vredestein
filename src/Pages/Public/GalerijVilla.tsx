import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import "./GalerijVilla.css";

// Interieur
import ImgWoonkamer    from "../../Assets/Images/int-woonkamer.jpg";
import ImgWoonkamer2   from "../../Assets/Images/int-woonkamer2.jpg";
import ImgWijnkamer    from "../../Assets/Images/int-wijnkamer.jpg";
import ImgKroonluchter from "../../Assets/Images/int-kroonluchter.jpg";
import ImgDetail       from "../../Assets/Images/int-detail.jpg";
import ImgDetail2      from "../../Assets/Images/int-detail2.jpg";

// Exterieur (zonder persoonsfoto's)
import ImgVilla2024    from "../../Assets/Images/VillaVredestein2024.jpg";
import ImgRestauratie  from "../../Assets/Images/VillaVredesteinRestauratie.jpg";
import ImgNight        from "../../Assets/Images/VredesteineByNight.jpg";

// Tuin (zonder Gert)
import ImgTuin         from "../../Assets/Images/ext-tuinfeest.jpg";

// Leven
import ImgDiner        from "../../Assets/Images/life-diner.jpg";
import ImgMoestuin     from "../../Assets/Images/life-moestuin.jpg";

// Geschiedenis — krantenartikelen
import ImgK1912 from "../../Assets/Images/Krant1912.jpg";
import ImgK1913 from "../../Assets/Images/Krant1913.jpg";
import ImgK1916 from "../../Assets/Images/Krant1916.jpg";
import ImgK1918 from "../../Assets/Images/Krant1918.jpg";
import ImgK1919 from "../../Assets/Images/Krant1919.jpg";
import ImgK1921 from "../../Assets/Images/Krant1921.jpg";
import ImgK1926 from "../../Assets/Images/Krant1926.jpg";
import ImgK1927 from "../../Assets/Images/Krant1927.png";
import ImgK1928 from "../../Assets/Images/Krant1928.jpg";
import ImgK1930 from "../../Assets/Images/Krant1930.jpg";
import ImgK1932 from "../../Assets/Images/Krant1932.jpg";
import ImgK1934 from "../../Assets/Images/Krant1934.png";
import ImgK1935 from "../../Assets/Images/Krant1935.jpg";
import ImgK1954 from "../../Assets/Images/Krant1954.jpg";
import ImgK1959 from "../../Assets/Images/Krant1959.jpg";
import ImgK1965 from "../../Assets/Images/Krant1965.jpg";

const CATEGORIEEN = ["Alles", "Interieur", "Exterieur", "Tuin", "Leven", "Geschiedenis"];

const FOTOS = [
    // ── Interieur ──────────────────────────────────────────────────────────
    { src: ImgWoonkamer,    cat: "Interieur",   caption: "De woonkamer",          sub: "Hoge plafonds, authentieke stoelen, veel licht" },
    { src: ImgWoonkamer2,   cat: "Interieur",   caption: "Woonkamer hoek",        sub: "Knus hoekje naast de houtkachel" },
    { src: ImgKroonluchter, cat: "Interieur",   caption: "Kristallen kroonluchter", sub: "Origineel, meer dan een eeuw oud" },
    { src: ImgWijnkamer,    cat: "Interieur",   caption: "Oude woonkamer (voor renovatie)", sub: "De woonkamer zoals die er uitzag vóór de restauratie" },
    { src: ImgDetail,       cat: "Interieur",   caption: "Interieurdetail",       sub: "Authenticiteit in elk hoekje" },
    { src: ImgDetail2,      cat: "Interieur",   caption: "Interieurdetail II",    sub: "Historisch stucwerk en warme kleuren" },

    // ── Exterieur ──────────────────────────────────────────────────────────
    { src: ImgVilla2024,    cat: "Exterieur",   caption: "Villa Vredestein 2024", sub: "Gevel na restauratie, Hoofdstraat 147" },
    { src: ImgRestauratie,  cat: "Exterieur",   caption: "Restauratie 2021-2022", sub: "De villa in wording" },
    { src: ImgNight,        cat: "Exterieur",   caption: "Vredestein by night",   sub: "Sfeer als de zon ondergaat" },

    // ── Tuin ───────────────────────────────────────────────────────────────
    { src: ImgTuin,         cat: "Tuin",        caption: "Tuinfeest",             sub: "Buiten eten op het terras" },

    // ── Leven ──────────────────────────────────────────────────────────────
    { src: ImgDiner,        cat: "Leven",       caption: "Diner aan de grote tafel", sub: "Gedeeld eten zoals het hoort" },
    { src: ImgMoestuin,     cat: "Leven",       caption: "Oogst uit de moestuin", sub: "Eigen groenten van het perceel" },

    // ── Geschiedenis — krantenartikelen ────────────────────────────────────
    { src: ImgK1912,  cat: "Geschiedenis", caption: "Ingezonden stuk, 1912",     sub: "Over het pension na de overname door Familie Sluijter" },
    { src: ImgK1913,  cat: "Geschiedenis", caption: "Vacature keukenmeid, 1913", sub: "Het pension adverteert voor personeel" },
    { src: ImgK1916,  cat: "Geschiedenis", caption: "Ingezonden stuk, 1916",     sub: "Midden in de Eerste Wereldoorlog" },
    { src: ImgK1918,  cat: "Geschiedenis", caption: "Vacature juffrouw, 1918",   sub: "Gezocht: hulp voor huishoudelijke werkzaamheden" },
    { src: ImgK1919,  cat: "Geschiedenis", caption: "Rust- en herstellingsoorden, 1919", sub: "Vredestein vermeld als gerenommeerde bestemming" },
    { src: ImgK1921,  cat: "Geschiedenis", caption: "Krantenartikel, 1921",      sub: "Nieuws uit Driebergen in de jaren twintig" },
    { src: ImgK1926,  cat: "Geschiedenis", caption: "Familie Van de Bosch, 1926", sub: "Bericht over de oorspronkelijke bewoners" },
    { src: ImgK1927,  cat: "Geschiedenis", caption: "25 november 1927",          sub: "Nieuws uit Driebergen-Rijsenburg" },
    { src: ImgK1928,  cat: "Geschiedenis", caption: "Nieuws over inbraak, 1928", sub: "Zelfs in rustig Driebergen bleef de wereld niet buiten" },
    { src: ImgK1930,  cat: "Geschiedenis", caption: "Advertentie, 1930",         sub: "Bloeitijd van het christelijk pension" },
    { src: ImgK1932,  cat: "Geschiedenis", caption: "Krantenartikel, 1932",      sub: "Driebergen in de zomer van 1932" },
    { src: ImgK1934,  cat: "Geschiedenis", caption: "Krantenartikel, 1934",      sub: "Einde van het tijdperk-Sluijter nadert" },
    { src: ImgK1935,  cat: "Geschiedenis", caption: "Krantenartikel, 1935",      sub: "Na 23 jaar zoekt de villa nieuwe bewoners" },
    { src: ImgK1954,  cat: "Geschiedenis", caption: "Te huur-advertentie, 1954", sub: "Tijdperk mevrouw Elings, naoorlogse periode" },
    { src: ImgK1959,  cat: "Geschiedenis", caption: "Krantenartikel, 1959",      sub: "Nieuws uit de periode van mevrouw Elings" },
    { src: ImgK1965,  cat: "Geschiedenis", caption: "Vacature verpleeghulp, 1965", sub: "Villa Vredestein had in deze periode een zorgende functie" },
];

const GalerijVilla = () => {
    const [actieveCat, setActieveCat] = useState("Alles");
    const [lightbox, setLightbox] = useState<number | null>(null);
    const lightboxRef = useRef<HTMLDivElement>(null);
    const prevFocusRef = useRef<HTMLElement | null>(null);

    const gefilterd = actieveCat === "Alles" ? FOTOS : FOTOS.filter((f) => f.cat === actieveCat);

    const open = useCallback((i: number) => {
        prevFocusRef.current = document.activeElement as HTMLElement;
        setLightbox(i);
        document.body.style.overflow = "hidden";
    }, []);

    const close = useCallback(() => {
        setLightbox(null);
        document.body.style.overflow = "";
        prevFocusRef.current?.focus();
    }, []);

    const prev = useCallback(() => setLightbox((i) => ((i ?? 0) - 1 + gefilterd.length) % gefilterd.length), [gefilterd.length]);
    const next = useCallback(() => setLightbox((i) => ((i ?? 0) + 1) % gefilterd.length), [gefilterd.length]);

    useEffect(() => {
        if (lightbox === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next();
            else if (e.key === "ArrowLeft") prev();
            else if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightbox, next, prev, close]);

    useEffect(() => { if (lightbox !== null) lightboxRef.current?.focus(); }, [lightbox]);

    const foto = lightbox !== null ? gefilterd[lightbox] : null;

    return (
        <main className="galerij-villa-page">
            <Helmet>
                <title>Galerij — Villa Vredestein</title>
                <meta
                    name="description"
                    content="Fotogalerij van Villa Vredestein: interieur, exterieur, tuin en historische krantenartikelen van 1912 tot nu."
                />
                <link rel="canonical" href="https://villavredestein.nl/galerij-villa" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl/galerij-villa" />
                <meta property="og:title" content="De Villa in Beeld — Villa Vredestein" />
                <meta property="og:description" content="Fotogalerij van Villa Vredestein: interieur, exterieur en tuin van een historisch pand uit 1906 in Driebergen-Rijsenburg." />
                <meta property="og:image" content="https://villavredestein.nl/og-image.jpg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="https://villavredestein.nl/og-image.jpg" />
            </Helmet>

            <header className="gv-header">
                <h1>De villa in beeld</h1>
                <p>Van kroonluchter tot krantenartikel. Klik op een foto om te vergroten.</p>
            </header>

            <div className="gv-filter" role="group" aria-label="Filtercategorieën">
                {CATEGORIEEN.map((cat) => (
                    <button
                        key={cat}
                        className={`gv-filter-btn ${actieveCat === cat ? "active" : ""}`}
                        onClick={() => setActieveCat(cat)}
                        aria-pressed={actieveCat === cat}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="gv-grid" role="list">
                {gefilterd.map((foto, i) => (
                    <article
                        key={`${foto.src}-${i}`}
                        className="gv-item"
                        role="listitem"
                        onClick={() => open(i)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open(i)}
                        tabIndex={0}
                        aria-label={`${foto.caption} — klik om te vergroten`}
                    >
                        <div className="gv-img-wrap">
                            <img src={foto.src} alt={foto.caption} loading="lazy" decoding="async" />
                            <div className="gv-overlay" aria-hidden="true">
                                <span className="gv-cat">{foto.cat}</span>
                                <p className="gv-caption">{foto.caption}</p>
                                <span className="gv-zoom">⊕</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {foto && (
                <div
                    className="gvlb-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Foto: ${foto.caption}`}
                    onClick={(e) => e.target === e.currentTarget && close()}
                >
                    <div className="gvlb-box" ref={lightboxRef} tabIndex={-1}>
                        <button className="gvlb-close" onClick={close} aria-label="Sluiten">✕</button>
                        <div className="gvlb-img-wrap">
                            <img src={foto.src} alt={foto.caption} className="gvlb-img" />
                        </div>
                        <div className="gvlb-info">
                            <span className="gvlb-cat">{foto.cat}</span>
                            <h2 className="gvlb-caption">{foto.caption}</h2>
                            <p className="gvlb-sub">{foto.sub}</p>
                        </div>
                        <button className="gvlb-nav gvlb-prev" onClick={prev} aria-label="Vorige">‹</button>
                        <button className="gvlb-nav gvlb-next" onClick={next} aria-label="Volgende">›</button>
                        <div className="gvlb-counter" aria-live="polite">
                            {(lightbox ?? 0) + 1} / {gefilterd.length}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default GalerijVilla;
