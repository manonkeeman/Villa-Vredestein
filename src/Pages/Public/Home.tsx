import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import "./Home.css";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import HeroImg from "../../Assets/Images/int-woonkamer.jpg";
import VillaImg from "../../Assets/Images/ext-villa-voorkant.jpg";
import VerbouwingVid from "../../Assets/Videos/home-verbouwing.mp4";
import ImgVerbouwen from "../../Assets/Images/rest-verbouwen.jpg";
import ImgVerblijven from "../../Assets/Images/tuin-logeren.jpg";
import TuinImg from "../../Assets/Images/ext-tuinfeest.jpg";
import KroonluchterImg from "../../Assets/Images/int-kroonluchter.jpg";
import LuchtballonImg from "../../Assets/Images/ext-luchtballon.png";

const VILLA_POS: [number, number] = [52.0431, 5.287];

const villaCardIcon = L.divIcon({
    className: "",
    html: `<div style="background:#FCBC2D;border-radius:50%;width:22px;height:22px;border:3px solid rgba(255,255,255,0.75);box-shadow:0 2px 14px rgba(252,188,45,0.75);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
});

const KENMERKEN = [
    { label: "1906", sub: "Gebouwd" },
    { label: "6", sub: "Slaapkamers" },
    { label: "Heuvelrug", sub: "Voor de deur" },
    { label: "15 min", sub: "Utrecht Centraal" },
    { label: "50 min", sub: "Schiphol" },
    { label: "680 m²", sub: "Grond" },
];

const HIGHLIGHTS = [
    {
        to: "/galerij-villa",
        toState: { cat: "De Verbouwing" },
        img: ImgVerbouwen,
        label: "De Verbouwing",
        titel: "De transformatie",
        sub: "Van verwaarloosde studentenhuis tot gerestaureerde trots. Stap voor stap, laag voor laag.",
    },
    {
        to: "/omgeving",
        map: true,
        label: "De Omgeving",
        titel: "Alles om de hoek",
        sub: "Bos, heuvelrug, dorpskern en Utrecht op een kwartiertje.",
    },
    {
        to: "/verblijven",
        img: ImgVerblijven,
        label: "Verblijven",
        titel: "Boek jouw verblijf",
        sub: "Een kort of lang verblijf in een bijzonder huis.",
    },
];

const Home = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";
    const parallaxRef = useRef(null);
    const revealRefs = useRef([]);

    const [parallaxY, setParallaxY] = useState(0);

    useEffect(() => {
        // Parallax uitgeschakeld op mobiel (voorkomt re-render jank en scroll-problemen)
        if (window.matchMedia("(max-width: 768px)").matches) return;
        const onScroll = () => {
            setParallaxY(window.scrollY * 0.3);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in-view")),
            { threshold: 0.12 }
        );
        revealRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const addRef = (el) => {
        if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
    };

    return (
        <main className="home-lux" role="main">
            <Helmet>
                <html lang={langCode} />
                <title>Villa Vredestein, Driebergen-Rijsenburg</title>
                <meta name="description" content="Villa Vredestein is een historische villa uit 1906 in het hart van Driebergen-Rijsenburg. Verblijf in een bijzonder pand op de Utrechtse Heuvelrug." />
                <link rel="canonical" href="https://villavredestein.nl/" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl/" />
                <meta property="og:title" content="Villa Vredestein, Driebergen-Rijsenburg" />
                <meta property="og:description" content="Historische villa uit 1906 op de Utrechtse Heuvelrug. Verblijf, verhuur en restauratie in het hart van Driebergen-Rijsenburg." />
                <meta property="og:image" content="https://villavredestein.nl/og-image.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Villa Vredestein, Driebergen-Rijsenburg" />
                <meta name="twitter:description" content="Historische villa uit 1906. Verblijf op de Utrechtse Heuvelrug." />
                <meta name="twitter:image" content="https://villavredestein.nl/og-image.jpg" />
            </Helmet>

            {/* ── Hero met parallax ── */}
            <section className="hero-lux" aria-label="Hero">
                <div
                    className="hero-bg"
                    style={{ backgroundImage: `url(${HeroImg})`, transform: `translateY(${parallaxY}px)` }}
                    role="img"
                    aria-label="Woonkamer Villa Vredestein"
                />
                <div className="hero-overlay" />
                <div className="hero-content">
                    <span className="hero-eyebrow">Driebergen-Rijsenburg · Utrechtse Heuvelrug</span>
                    <h1 className="hero-title">Villa Vredestein</h1>
                    <p className="hero-sub">
                        Een historische villa uit 1906 in het hart van Driebergen-Rijsenburg,
                        op de Utrechtse Heuvelrug. Verblijf, restauratie en een open deur.
                    </p>
                    <div className="hero-ctas">
                        <button className="hero-btn-primary" onClick={() => navigate("/verhaal")}>
                            Het Verhaal
                        </button>
                        <button className="hero-btn-ghost" onClick={() => navigate("/tijdlijn")}>
                            Tijdlijn
                        </button>
                    </div>
                </div>
                <div className="hero-scroll-hint" aria-hidden="true">
                    <span />
                </div>
            </section>

            {/* ── Kenmerken ── */}
            <section className="kenmerken-bar reveal-row" ref={addRef} aria-label="Kenmerken">
                {KENMERKEN.map((k) => (
                    <div key={k.label} className="kenmerk-item">
                        <strong className="kenmerk-val">{k.label}</strong>
                        <span className="kenmerk-sub">{k.sub}</span>
                    </div>
                ))}
            </section>

            {/* ── Intro split ── */}
            <section className="intro-split reveal-section" ref={addRef}>
                <div className="intro-img-col">
                    <video
                        src={VerbouwingVid}
                        autoPlay
                        muted
                        loop
                        playsInline
                        aria-label="Verbouwing Villa Vredestein"
                    />
                </div>
                <div className="intro-text-col">
                    <span className="section-eyebrow">Gebouwd in 1906</span>
                    <h2 className="section-title">Een huis met meer dan een eeuw verhaal</h2>
                    <p>
                        Villa Vredestein werd gebouwd als buitenverblijf voor de burgemeester
                        van Krimpen aan den IJssel. Sindsdien heeft het pand talloze bewoners
                        verwelkomd. Van christelijk pension tot studentenhuis, van verbouwproject
                        tot wat het wordt: een plek om trots op te zijn.
                    </p>
                    <p>
                        Achter de originele gevel schuilen hoge plafonds, een industriële gietvloer
                        beneden en gebrand grenenhout boven. Originele details komen stap voor stap
                        terug: glas-in-lood ramen, openslaande deuren, houtkachels. Manon en Maxim
                        wonen er midden in, terwijl het plan langzaam vorm krijgt.
                    </p>
                    <button className="text-link-btn" onClick={() => navigate("/tijdlijn")}>
                        Volg het verhaal op de tijdlijn →
                    </button>
                </div>
            </section>

            {/* ── Highlight cards ── */}
            <section className="highlights reveal-section" ref={addRef} aria-label="Hoogtepunten">
                <div className="highlights-header">
                    <h2>Ontdek de villa</h2>
                    <p>De verbouwing, de kamers en de omgeving.</p>
                </div>
                <div className="highlights-grid">
                    {HIGHLIGHTS.map((h) => (
                        <article
                            key={h.to}
                            className="hl-card"
                            onClick={() => navigate(h.to, (h as any).toState ? { state: (h as any).toState } : undefined)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate(h.to, (h as any).toState ? { state: (h as any).toState } : undefined)}
                            aria-label={h.titel}
                        >
                            <div className="hl-img-wrap">
                                {(h as any).map ? (
                                    <MapContainer
                                        center={VILLA_POS}
                                        zoom={14}
                                        zoomControl={false}
                                        dragging={false}
                                        scrollWheelZoom={false}
                                        doubleClickZoom={false}
                                        touchZoom={false}
                                        keyboard={false}
                                        style={{ width: "100%", height: "100%" }}
                                        attributionControl={false}
                                        aria-label="Kaart omgeving Villa Vredestein"
                                    >
                                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                        <Marker position={VILLA_POS} icon={villaCardIcon} />
                                    </MapContainer>
                                ) : (
                                    <img src={(h as any).img} alt={h.titel} loading="lazy" />
                                )}
                                <div className="hl-overlay" />
                            </div>
                            <div className="hl-body">
                                <span className="hl-label">{h.label}</span>
                                <h3 className="hl-title">{h.titel}</h3>
                                <p className="hl-sub">{h.sub}</p>
                                <span className="hl-cta">Bekijk meer →</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── Booking strip ── */}
            <section className="booking-strip reveal-section" ref={addRef}>
                <div className="booking-strip-inner">
                    <div className="booking-strip-text">
                        <h2>Interesse in een verblijf?</h2>
                        <p>
                            Schrijf je in of vraag beschikbaarheid op. We vertellen je graag
                            meer over de mogelijkheden.
                        </p>
                    </div>
                    <div className="booking-strip-actions">
                        <button className="book-btn" onClick={() => navigate("/verblijven")}>
                            Check beschikbaarheid
                        </button>
                        <button className="contact-btn" onClick={() => navigate("/contact")}>
                            Stuur een bericht
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Instagram-achtige sfeer strip ── */}
            <section className="sfeer-strip reveal-section" ref={addRef} aria-label="Sfeerbeelden">
                <div className="sfeer-strip-header">
                    <span>@villa.vredestein</span>
                    <h2>Het leven in de villa</h2>
                </div>
                <div className="sfeer-grid">
                    {[HeroImg, TuinImg, KroonluchterImg, LuchtballonImg].map((src, i) => (
                        <div key={i} className="sfeer-item">
                            <img src={src} alt="Villa sfeer" loading="lazy" />
                        </div>
                    ))}
                </div>
                <a
                    href="https://www.instagram.com/villa.vredestein"
                    target="_blank"
                    rel="noreferrer"
                    className="sfeer-ig-link"
                >
                    Volg ons op Instagram
                </a>
            </section>
        </main>
    );
};

export default Home;
