import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "./Plattegrond.css";

import ImgPercelen      from "../../Assets/Images/archief-kadaster-percelen.jpg";
import ImgHoofdstraat   from "../../Assets/Images/archief-kadaster-hoofdstraat.jpg";
import ImgKaartBlauw    from "../../Assets/Images/archief-kadasterkaart-blauw-1.jpg";
import ImgRegister      from "../../Assets/Images/archief-register-1.jpg";
import ImgBouwreg       from "../../Assets/Images/archief-bouwregister-1.jpg";

/* ─────────────────────────────────────────────
   Verdiepingen (visueel overzicht)
───────────────────────────────────────────── */
const VERDIEPINGEN = [
    {
        id: "boven",
        label: "Bovenste verdieping",
        bewoners: "Studenten · Desmond",
        icon: "🎓",
        kleur: "#d4804a",
        beschrijving: "Drie studentenkamers met eigen gedeelde keuken, badkamer en woonruimte. Toekomstige eigen ingang gepland.",
        status: "beschikbaar",
        ruimtes: [
            { naam: "Thailand (Desmond)", icon: "🇹🇭", afm: "~17 m²", info: "Airco, goed licht, rustig" },
            { naam: "Japan",              icon: "🇯🇵", afm: "~16 m²", info: "Airco, balkon (uitsluitend nooduitgang), daklichten" },
            { naam: "Argentinië",         icon: "🇦🇷", afm: "~16 m²", info: "Airco, compact en stil" },
            { naam: "Gedeelde badkamer", icon: "🚿", afm: "~8 m²", info: "1 badkamer voor 3 kamers" },
            { naam: "Studentenkeuken", icon: "🍳", afm: "~12 m²", info: "Eigen keuken, gedeeld" },
            { naam: "Gedeelde zitruimte", icon: "🛋️", afm: "~14 m²", info: "Ontspan- en studeerruimte" },
        ],
    },
    {
        id: "midden",
        label: "Middelste verdieping",
        bewoners: "Arwen · Medoc · Logeerkamer",
        icon: "✨",
        kleur: "#FCBC2D",
        beschrijving: "Drie luxe slaapkamers waarvan twee met balkon, eigen badkamer, kitchenette en eigen ingang. Oekraïne is nu de slaapkamer van Manon & Maxim, wordt straks logeerkamer. Sportkamer in aanbouw.",
        status: "eigen ingang",
        ruimtes: [
            { naam: "Italië (Arwen 2006)",               icon: "🇮🇹", afm: "~22 m²", info: "Airco, balkon tuinzijde, grootste kamer" },
            { naam: "Frankrijk (Medoc 2005)",             icon: "🇫🇷", afm: "~18 m²", info: "Airco, balkon straatzijde" },
            { naam: "Oekraïne (straks logeerkamer)",      icon: "🇺🇦", afm: "~15 m²", info: "Nu: Manon & Maxim. Wordt logeerkamer." },
            { naam: "Badkamer",    icon: "🚿", afm: "~9 m²",  info: "In aanbouw", aanbouw: true },
            { naam: "Kitchenette", icon: "☕", afm: "~8 m²",  info: "In aanbouw", aanbouw: true },
            { naam: "Sportkamer",  icon: "🏋️", afm: "~20 m²", info: "In aanbouw", aanbouw: true },
        ],
    },
    {
        id: "onder",
        label: "Onderste verdieping",
        bewoners: "Manon & Maxim",
        icon: "🏡",
        kleur: "#c8a46e",
        beschrijving: "Woonkamer met keukeneiland en bar, aparte eetkamer. Slaapkamer en badkamer zijn nog in aanbouw.",
        status: "in ontwikkeling",
        ruimtes: [
            { naam: "Woonkamer",           icon: "🛋️", afm: "~45 m²", info: "Hoge plafonds, erker, houtkachel" },
            { naam: "Keukeneiland met bar", icon: "🍳", afm: "~28 m²", info: "Open keuken met bar" },
            { naam: "Eetkamer",            icon: "🍽️", afm: "~18 m²", info: "Aparte eetkamer" },
            { naam: "Slaapkamer",          icon: "🛏️", afm: "~18 m²", info: "In aanbouw", aanbouw: true },
            { naam: "Badkamer",            icon: "🚿", afm: "~10 m²", info: "In aanbouw", aanbouw: true },
        ],
    },
    {
        id: "tuin",
        label: "Tuin & buitenruimte",
        bewoners: "Gedeeld",
        icon: "🌿",
        kleur: "#9e8c6e",
        beschrijving: "Groot perceel van 680 m² met een woonoppervlakte van 292 m². In ontwikkeling. Moestuin is er al. Sauna, dompelbad, buitenkeuken en veranda aan de schuur zijn in aanbouw.",
        status: "deels beschikbaar",
        ruimtes: [
            { naam: "Terras",                     icon: "☀️", afm: "~40 m²", info: "Achtertuin, barbecue, zitgelegenheid" },
            { naam: "Moestuin",                   icon: "🥦", afm: "",        info: "Al aangelegd — eigen groenten" },
            { naam: "Sauna",                      icon: "🧖", afm: "~15 m²", info: "In aanbouw", aanbouw: true },
            { naam: "Dompelbad",                  icon: "🛁", afm: "",        info: "In aanbouw naast sauna", aanbouw: true },
            { naam: "Buitenkeuken",               icon: "🔥", afm: "",        info: "In aanbouw", aanbouw: true },
            { naam: "Veranda aan schuur",          icon: "🏗️", afm: "",        info: "In aanbouw", aanbouw: true },
        ],
    },
];

const STATS = [
    { val: "6",    label: "Slaapkamers", sub: "(+1 in aanbouw)" },
    { val: "2→3",  label: "Keukens",     sub: "(3e in aanbouw)" },
    { val: "2→3",  label: "Badkamers",   sub: "(3e in aanbouw)" },
    { val: "680",  label: "m² perceel",  sub: "" },
    { val: "292",  label: "m² wonen",    sub: "" },
];

const Plattegrond = () => {
    const navigate = useNavigate();
    const [actief, setActief] = React.useState<string | null>(null);
    const [lightboxDoc, setLightboxDoc] = useState<string | null>(null);
    const revealRefs = useRef<HTMLElement[]>([]);
    const addRef = (el: HTMLElement | null) => {
        if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in-view")),
            { threshold: 0.07 }
        );
        revealRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!lightboxDoc) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxDoc(null); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [lightboxDoc]);

    return (
        <main className="plattegrond-page">
            <Helmet>
                <title>De Ruimtes — Villa Vredestein</title>
                <meta
                    name="description"
                    content="Villa Vredestein heeft drie verdiepingen: studenten (boven), kinderen Desmond/Arwen/Medoc (midden), woonkamer + keuken (onder). Sauna en sportkamer in aanbouw."
                />
                <link rel="canonical" href="https://villavredestein.nl/ruimtes" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl/ruimtes" />
                <meta property="og:title" content="De Ruimtes — Villa Vredestein" />
                <meta property="og:description" content="Drie verdiepingen, elk met eigen karakter. 292 m² wonen op 680 m² perceel in Driebergen-Rijsenburg." />
                <meta property="og:image" content="https://villavredestein.nl/og-image.jpg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="https://villavredestein.nl/og-image.jpg" />
            </Helmet>

            {/* ── Hero ── */}
            <header className="pg-hero reveal-section" ref={addRef as any}>
                <div className="pg-hero-inner">
                    <span className="pg-eyebrow">De ruimtes</span>
                    <h1>Drie verdiepingen. Elk met eigen leven.</h1>
                    <p>
                        Studenten bovenin, de kinderen op de luxe middenverdieping,
                        en de woonkamer als gedeeld hart onderaan. Alles in beweging.
                    </p>
                </div>
                <div className="pg-hero-stats">
                    {STATS.map((s, i) => (
                        <React.Fragment key={s.label}>
                            {i > 0 && <div className="pg-stat-div" />}
                            <div className="pg-stat">
                                <strong>{s.val}</strong>
                                <span>{s.label}</span>
                                {s.sub && <small>{s.sub}</small>}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </header>

            {/* ── Verdiepingen (visuele cards) ── */}
            {VERDIEPINGEN.map((verd, vi) => (
                <section
                    key={verd.id}
                    className="pg-verd reveal-section"
                    ref={addRef as any}
                    style={{ "--vkleur": verd.kleur } as React.CSSProperties}
                >
                    <div className="pg-inner">
                        <div className="pg-verd-header">
                            <div className="pg-verd-meta">
                                <span className="pg-verd-icon" aria-hidden="true">{verd.icon}</span>
                                <div>
                                    <h2 className="pg-verd-titel">{verd.label}</h2>
                                    <span className="pg-verd-bewoners">{verd.bewoners}</span>
                                </div>
                                <span className="pg-verd-badge">{verd.status}</span>
                            </div>
                            <p className="pg-verd-beschr">{verd.beschrijving}</p>
                        </div>

                        <div className="pg-ruimte-grid">
                            {verd.ruimtes.map((r) => (
                                <div
                                    key={r.naam}
                                    className={`pg-ruimte-card ${r.aanbouw ? "pg-aanbouw" : ""}`}
                                >
                                    <span className="pg-ruimte-icon" aria-hidden="true">{r.icon}</span>
                                    <div className="pg-ruimte-body">
                                        <strong>{r.naam}</strong>
                                        {r.afm && <span className="pg-ruimte-afm">{r.afm}</span>}
                                        <p>{r.info}</p>
                                    </div>
                                    {r.aanbouw && <span className="pg-aanbouw-chip">In aanbouw</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* ── Historisch archief ── */}
            <section className="pg-archief reveal-section" ref={addRef as any}>
                <div className="pg-inner">
                    <h2 className="pg-section-title">Historische documenten</h2>
                    <p className="pg-archief-sub">
                        Kadasterkaarten en handgeschreven registers uit het gemeentearchief.
                        Ze bevatten de oorspronkelijke maatvoering en perceelligging van Hoofdstraat 147 —
                        vóór de huidige verbouwing.
                    </p>
                    <div className="pg-archief-grid">
                        {[
                            { src: ImgPercelen,    titel: "Kadastrale perceelkaart",        sub: "Bouwnummers 2253-2256, Hoofdstraat" },
                            { src: ImgHoofdstraat, titel: "Situatiekaart Hoofdstraat",      sub: "Historische bebouwingskaart" },
                            { src: ImgKaartBlauw,  titel: "Blauwdrukkaart Driebergen",      sub: "Historische kadasterkaart" },
                            { src: ImgRegister,    titel: "Kamerafmetingen (register)",     sub: "Handgeschreven archiefregister" },
                            { src: ImgBouwreg,     titel: "Bouwregister Hfdstr. 147",       sub: "Oppervlakten & aantekeningen" },
                        ].map((doc) => (
                            <figure
                                key={doc.titel}
                                className="pg-archief-item"
                                onClick={() => setLightboxDoc(doc.src)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setLightboxDoc(doc.src)}
                                aria-label={`${doc.titel} — klik om te vergroten`}
                            >
                                <img src={doc.src} alt={doc.titel} loading="lazy" />
                                <figcaption>
                                    <strong>{doc.titel}</strong>
                                    <span>{doc.sub}</span>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="pg-cta reveal-section" ref={addRef as any}>
                <div className="pg-inner pg-cta-inner">
                    <div>
                        <h2>Interesse in verblijven?</h2>
                        <p>Studenten, korte verhuur of langdurig wonen — vraag beschikbaarheid op.</p>
                    </div>
                    <button className="pg-cta-btn" onClick={() => navigate("/verblijven")}>
                        Bekijk verblijfsopties
                    </button>
                </div>
            </section>

            {/* ── Lightbox historische documenten ── */}
            {lightboxDoc && (
                <div
                    className="pg-lightbox"
                    onClick={() => setLightboxDoc(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Document vergroot"
                >
                    <button
                        className="pg-lightbox-close"
                        onClick={() => setLightboxDoc(null)}
                        aria-label="Sluiten"
                    >
                        ✕
                    </button>
                    <img
                        src={lightboxDoc}
                        alt="Historisch document"
                        className="pg-lightbox-img"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </main>
    );
};

export default Plattegrond;
