import React, { useEffect, useRef, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "./InDePers.css";

import PersBoek    from "../../Assets/Images/pers-vredestein-in-boek.jpg";
import PersAdVilla1 from "../../Assets/Images/pers-ad-villa-1.jpeg";
import PersAdVilla2 from "../../Assets/Images/pers-ad-villa-2.jpeg";
import PersAdVilla3 from "../../Assets/Images/pers-ad-villa-3.jpeg";

import KrantReclame from "../../Assets/Images/hist-krant-reclame.jpg";
import Krant1912    from "../../Assets/Images/Krant1912.jpg";
import Krant1913    from "../../Assets/Images/Krant1913.jpg";
import Krant1916    from "../../Assets/Images/Krant1916.jpg";
import Krant1918    from "../../Assets/Images/Krant1918.jpg";
import Krant1919    from "../../Assets/Images/Krant1919.jpg";
import Krant1921    from "../../Assets/Images/Krant1921.jpg";
import Krant1926    from "../../Assets/Images/Krant1926.jpg";
import Krant1927    from "../../Assets/Images/Krant1927.png";
import Krant1928    from "../../Assets/Images/Krant1928.jpg";
import Krant1930    from "../../Assets/Images/Krant1930.jpg";
import Krant1932    from "../../Assets/Images/Krant1932.jpg";
import Krant1934    from "../../Assets/Images/Krant1934.png";
import Krant1935    from "../../Assets/Images/Krant1935.jpg";
import Krant1954    from "../../Assets/Images/Krant1954.jpg";
import Krant1959    from "../../Assets/Images/Krant1959.jpg";
import Krant1965    from "../../Assets/Images/Krant1965.jpg";

const PERS_ITEMS = [
    {
        medium: "Publicatie",
        sectie: "BOEK",
        datum: "2024",
        kop: "Villa Vredestein in een boek",
        samenvatting: "Villa Vredestein heeft een plek gekregen in een publicatie. Het historische pand aan de Hoofdstraat 147 in Driebergen-Rijsenburg, gebouwd in 1906, wordt beschreven als een bijzonder voorbeeld van villabouw uit het begin van de twintigste eeuw.",
        url: null,
        tag: "Publicatie",
        imgs: [PersBoek],
    },
    {
        medium: "Algemeen Dagblad",
        sectie: "GELD",
        datum: "2024",
        kop: "Motorfiets van onderdelen uit de hele wereld",
        samenvatting: "Maxim Staal (49), piloot uit Driebergen, tilt het repareren naar een hoger niveau. Als piloot reist hij de wereld over en neemt hij overal onderdelen mee, een zadel uit Bogota, een tank uit Kuala Lumpur, onderdelen uit Shanghai. Zijn grootste reparatieproject: samen met zijn vriendin kocht hij een oud pension in Driebergen, het herenhuis Vredestein, om eigenhandig te renoveren en terug te brengen in de stijl van rond 1900.",
        url: null,
        tag: "Nationaal",
        imgs: [PersAdVilla3, PersAdVilla1, PersAdVilla2],
    },
    {
        medium: "Regionale pers",
        sectie: "ARCHIEF",
        datum: "1912-1935",
        kop: "Pension Vredestein in de krant",
        samenvatting: "Pension Vredestein adverteerde trouw in de regionale krant en werd regelmatig vermeld in nieuws en ingezonden stukken. Van vacatures voor personeel tot gidsen voor herstellingsoorden: het pension was een begrip in Driebergen. De advertenties, vacatures en vermeldingen uit deze periode geven een levendig beeld van hoe het er hier meer dan een eeuw geleden aan toe ging.",
        url: null,
        tag: "Historisch",
        imgs: [KrantReclame, Krant1912, Krant1913, Krant1916, Krant1918, Krant1919, Krant1921, Krant1926, Krant1927, Krant1928, Krant1930, Krant1932, Krant1934, Krant1935],
    },
    {
        medium: "Regionale pers",
        sectie: "ARCHIEF",
        datum: "1954-1965",
        kop: "Villa Vredestein na de oorlog",
        samenvatting: "Ook in de naoorlogse jaren bleef Villa Vredestein in de krant. Van te-huur-advertenties tot personeelsvacatures: het pand had in die periode ook een zorgende functie en bleef een bekend adres in Driebergen.",
        url: null,
        tag: "Historisch",
        imgs: [Krant1954, Krant1959, Krant1965],
    },
];

const InDePers = () => {
    const navigate = useNavigate();
    const cardRefs = useRef<(HTMLElement | null)[]>([]);
    const [viewer, setViewer] = useState<{ imgs: string[]; startIndex: number } | null>(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
    const viewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("idp-visible"); }),
            { threshold: 0.1 }
        );
        cardRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const openViewer = useCallback((imgs: string[], index: number) => {
        setViewer({ imgs, startIndex: index });
        setActiveSlide(index);
        document.body.style.overflow = "hidden";
    }, []);

    const closeViewer = useCallback(() => {
        setViewer(null);
        document.body.style.overflow = "";
    }, []);

    // Escape key
    useEffect(() => {
        if (!viewer) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeViewer(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [viewer, closeViewer]);

    // Scroll to start slide after opening
    useEffect(() => {
        if (!viewer) return;
        const el = slidesRef.current[viewer.startIndex];
        if (el) el.scrollIntoView({ behavior: "instant", inline: "start", block: "nearest" });
    }, [viewer]);

    // Track which slide is visible via IntersectionObserver
    useEffect(() => {
        if (!viewer) return;
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        const idx = slidesRef.current.indexOf(e.target as HTMLDivElement);
                        if (idx !== -1) setActiveSlide(idx);
                    }
                });
            },
            { root: viewerRef.current, threshold: 0.5 }
        );
        slidesRef.current.forEach((el) => el && obs.observe(el));
        return () => obs.disconnect();
    }, [viewer]);

    return (
        <main className="idp-page">
            <Helmet>
                <title>In de Pers, Villa Vredestein</title>
                <meta
                    name="description"
                    content="Villa Vredestein in het nieuws. Kranten, tijdschriften en online media over dit bijzondere historische pand in Driebergen-Rijsenburg."
                />
                <link rel="canonical" href="https://villavredestein.nl/in-de-pers" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl/in-de-pers" />
                <meta property="og:title" content="In de Pers, Villa Vredestein" />
                <meta property="og:description" content="Villa Vredestein in het nieuws. Artikelen in kranten en magazines over dit bijzondere historische pand in Driebergen-Rijsenburg." />
                <meta property="og:image" content="https://villavredestein.nl/og-image.jpg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="In de Pers, Villa Vredestein" />
                <meta name="twitter:description" content="Villa Vredestein in het nieuws. Artikelen in kranten en magazines over dit bijzondere historische pand in Driebergen-Rijsenburg." />
                <meta name="twitter:image" content="https://villavredestein.nl/og-image.jpg" />
            </Helmet>

            {/* Hero */}
            <header className="idp-hero">
                <div className="idp-hero-inner">
                    <span className="idp-eyebrow">Pers & Media</span>
                    <h1 className="idp-title">In de pers</h1>
                    <p className="idp-sub">
                        Villa Vredestein in het nieuws. Een historisch pand dat verhalen aantrekt.
                    </p>
                </div>
            </header>

            {/* Persartikelen */}
            <section className="idp-articles-section" aria-label="Persberichten">
                {PERS_ITEMS.map((item, i) => (
                    <article
                        key={i}
                        className="idp-article idp-reveal"
                        ref={(el) => (cardRefs.current[i] = el)}
                        onClick={() => item.imgs?.length && openViewer(item.imgs, 0)}
                        role={item.imgs?.length ? "button" : undefined}
                        tabIndex={item.imgs?.length ? 0 : undefined}
                        onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && item.imgs?.length) openViewer(item.imgs, 0); }}
                        aria-label={item.imgs?.length ? `Bekijk artikel: ${item.kop}` : undefined}
                        style={{ cursor: item.imgs?.length ? "zoom-in" : "default" }}
                    >
                        {/* Één thumbnail */}
                        {item.imgs && item.imgs.length > 0 && (
                            <div className="idp-thumb-col">
                                <div
                                    className="idp-thumb-btn"
                                    aria-hidden="true"
                                >
                                    <img
                                        src={item.imgs[0]}
                                        alt={`Foto bij: ${item.kop}`}
                                        className="idp-thumb-img"
                                        loading="lazy"
                                    />
                                    {item.imgs.length > 1 && (
                                        <span className="idp-foto-count">
                                            📷 {item.imgs.length} foto's
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tekst */}
                        <div className="idp-article-body">
                            <div className="idp-meta-row">
                                <span className="idp-tag">{item.tag}</span>
                                {item.sectie && <span className="idp-sectie">{item.sectie}</span>}
                                <span className="idp-datum">{item.datum}</span>
                            </div>
                            <p className="idp-medium">{item.medium}</p>
                            <h2 className="idp-kop">{item.kop}</h2>
                            <p className="idp-samenvatting">{item.samenvatting}</p>
                            {item.url && (
                                <a href={item.url} target="_blank" rel="noreferrer" className="idp-lees-link">
                                    Lees artikel →
                                </a>
                            )}
                        </div>
                    </article>
                ))}
            </section>

            {/* Scroll-viewer */}
            {viewer && (
                <div
                    className="idp-viewer"
                    ref={viewerRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Foto's bekijken"
                >
                    <div className="idp-viewer-bar">
                        <span className="idp-viewer-counter">
                            {activeSlide + 1} / {viewer.imgs.length}
                        </span>
                        <button className="idp-viewer-close" onClick={closeViewer} aria-label="Sluiten">✕</button>
                    </div>

                    {viewer.imgs.map((src, idx) => (
                        <div
                            key={idx}
                            className="idp-viewer-slide"
                            ref={(el) => (slidesRef.current[idx] = el)}
                        >
                            <img src={src} alt={`Foto ${idx + 1}`} className="idp-viewer-img" />
                        </div>
                    ))}

                    {activeSlide > 0 && (
                        <button
                            className="idp-viewer-arrow idp-viewer-arrow--prev"
                            aria-label="Vorige foto"
                            onClick={() => slidesRef.current[activeSlide - 1]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })}
                        >‹</button>
                    )}
                    {activeSlide < viewer.imgs.length - 1 && (
                        <button
                            className="idp-viewer-arrow idp-viewer-arrow--next"
                            aria-label="Volgende foto"
                            onClick={() => slidesRef.current[activeSlide + 1]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })}
                        >›</button>
                    )}
                </div>
            )}

            {/* CTA */}
            <section className="idp-cta">
                <div className="idp-cta-inner">
                    <span className="idp-cta-eyebrow">Pers & media</span>
                    <h2>Wil je schrijven over Villa Vredestein?</h2>
                    <p>
                        We staan open voor journalisten, bloggers en fotografen die het verhaal van
                        dit bijzondere pand willen vertellen. Neem contact op voor een bezoek of
                        meer informatie.
                    </p>
                    <button className="idp-cta-btn" onClick={() => navigate("/contact")}>
                        Neem contact op
                    </button>
                </div>
            </section>
        </main>
    );
};

export default InDePers;
