import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import "./GalerijVilla.css";

import ImgWoonkamer from "../../Assets/Images/int-woonkamer.jpg";
import ImgWoonkamer2 from "../../Assets/Images/int-woonkamer2.jpg";
import ImgWijnkamer from "../../Assets/Images/int-wijnkamer.jpg";
import ImgKroonluchter from "../../Assets/Images/int-kroonluchter.jpg";
import ImgDetail from "../../Assets/Images/int-detail.jpg";
import ImgDetail2 from "../../Assets/Images/int-detail2.jpg";
import ImgGevel from "../../Assets/Images/ext-villa-gevel.jpg";
import ImgGevel2 from "../../Assets/Images/ext-villa2.jpg";
import ImgTuin from "../../Assets/Images/ext-tuinfeest.jpg";
import ImgTuin2 from "../../Assets/Images/ext-tuinfeest2.jpg";
import ImgDiner from "../../Assets/Images/life-diner.jpg";
import ImgBuiten from "../../Assets/Images/life-buiten-eten.jpg";
import ImgBloemen from "../../Assets/Images/life-bloemen-fiets.jpg";
import ImgMoestuin from "../../Assets/Images/life-moestuin.jpg";
import ImgGrot from "../../Assets/Images/omg-grot.jpg";
import ImgVilla2024 from "../../Assets/Images/VillaVredestein2024.jpg";
import ImgRestauratie from "../../Assets/Images/VillaVredesteinRestauratie.jpg";
import ImgNight from "../../Assets/Images/VredesteineByNight.jpg";

const CATEGORIEEN = ["Alles", "Interieur", "Exterieur", "Tuin", "Leven", "Omgeving"];

const FOTOS = [
    { src: ImgWoonkamer,  cat: "Interieur", caption: "De woonkamer", sub: "Hoge plafonds, authentieke stoelen, veel licht" },
    { src: ImgWoonkamer2, cat: "Interieur", caption: "Woonkamer hoek", sub: "Knus hoekje naast de houtkachel" },
    { src: ImgKroonluchter, cat: "Interieur", caption: "Kristallen kroonluchter", sub: "Origineel, meer dan een eeuw oud" },
    { src: ImgWijnkamer, cat: "Interieur", caption: "Wijnkamer", sub: "Sfeervolle ruimte met eigen karakter" },
    { src: ImgDetail,    cat: "Interieur", caption: "Interieurdetail", sub: "Authenticiteit in elk hoekje" },
    { src: ImgDetail2,   cat: "Interieur", caption: "Interieurdetail II", sub: "Historisch stucwerk en warme kleuren" },
    { src: ImgVilla2024, cat: "Exterieur", caption: "Villa Vredestein — 2024", sub: "Gevel na restauratie, Hoofdstraat 147" },
    { src: ImgGevel,     cat: "Exterieur", caption: "Het aanzicht", sub: "Karakteristieke baksteen en glas-in-lood" },
    { src: ImgGevel2,    cat: "Exterieur", caption: "Exterieur gevel", sub: "Details van de originele bouw in 1906" },
    { src: ImgRestauratie, cat: "Exterieur", caption: "Restauratie 2021-2022", sub: "De villa in wording" },
    { src: ImgNight,     cat: "Exterieur", caption: "Vredestein by night", sub: "Sfeer als de zon ondergaat" },
    { src: ImgTuin,      cat: "Tuin", caption: "Tuinfeest", sub: "Buiten eten op het terras" },
    { src: ImgTuin2,     cat: "Tuin", caption: "Tuinfeest II", sub: "Slingers, bloemen, gezelligheid" },
    { src: ImgDiner,     cat: "Leven", caption: "Diner aan de grote tafel", sub: "Gedeeld eten zoals het hoort" },
    { src: ImgBuiten,    cat: "Leven", caption: "Buiten ontbijten", sub: "Zonnige ochtenden op het terras" },
    { src: ImgBloemen,   cat: "Leven", caption: "Bloemen van de markt", sub: "Het echte Driebergen-leven" },
    { src: ImgMoestuin,  cat: "Leven", caption: "Oogst uit de moestuin", sub: "Eigen groenten van het perceel" },
    { src: ImgGrot,      cat: "Omgeving", caption: "Lourdesgrot Driebergen", sub: "Op wandelafstand van de villa" },
];

const GalerijVilla = () => {
    const [actieveCat, setActieveCat] = useState("Alles");
    const [lightbox, setLightbox] = useState(null);
    const lightboxRef = useRef(null);
    const prevFocusRef = useRef(null);

    const gefilterd = actieveCat === "Alles" ? FOTOS : FOTOS.filter((f) => f.cat === actieveCat);

    const open = useCallback((i) => {
        prevFocusRef.current = document.activeElement;
        setLightbox(i);
        document.body.style.overflow = "hidden";
    }, []);

    const close = useCallback(() => {
        setLightbox(null);
        document.body.style.overflow = "";
        prevFocusRef.current?.focus();
    }, []);

    const prev = useCallback(() => setLightbox((i) => (i - 1 + gefilterd.length) % gefilterd.length), [gefilterd.length]);
    const next = useCallback(() => setLightbox((i) => (i + 1) % gefilterd.length), [gefilterd.length]);

    useEffect(() => {
        if (lightbox === null) return;
        const onKey = (e) => {
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
                <meta name="description" content="Fotogalerij van Villa Vredestein: interieur, exterieur, tuin en het dagelijkse leven in het historische pand in Driebergen-Rijsenburg." />
                <link rel="canonical" href="https://villavredestein.nl/galerij-villa" />
            </Helmet>

            <header className="gv-header">
                <h1>De villa in beeld</h1>
                <p>Van kroonluchter tot moestuin. Klik op een foto om te vergroten.</p>
            </header>

            {/* Categorie filter */}
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

            {/* Masonry grid */}
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
                            <img
                                src={foto.src}
                                alt={foto.caption}
                                loading="lazy"
                                decoding="async"
                            />
                            <div className="gv-overlay" aria-hidden="true">
                                <span className="gv-cat">{foto.cat}</span>
                                <p className="gv-caption">{foto.caption}</p>
                                <span className="gv-zoom">⊕</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Lightbox */}
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
                            {lightbox + 1} / {gefilterd.length}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default GalerijVilla;
