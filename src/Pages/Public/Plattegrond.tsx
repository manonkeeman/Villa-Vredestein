import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "./Plattegrond.css";

import WoonkamerImg from "../../Assets/Images/int-woonkamer.jpg";

/* ─────────────────────────────────────────────
   Verdiepingen (visueel overzicht)
───────────────────────────────────────────── */
const VERDIEPINGEN = [
    {
        id: "boven",
        label: "Bovenste verdieping",
        bewoners: "Studenten · Desmond",
        icon: "🎓",
        kleur: "#7c9ef8",
        beschrijving: "Drie studentenkamers met eigen gedeelde keuken, badkamer en woonruimte. Toekomstige eigen ingang gepland.",
        status: "beschikbaar",
        ruimtes: [
            { naam: "Thailand (Desmond)", icon: "🇹🇭", afm: "~17 m²", info: "Goed licht, rustig" },
            { naam: "Japan",              icon: "🇯🇵", afm: "~16 m²", info: "Zolderkamer, daklichten" },
            { naam: "Argentinië",         icon: "🇦🇷", afm: "~16 m²", info: "Compact en stil" },
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
            { naam: "Italië (Arwen 2006)",               icon: "🇮🇹", afm: "~22 m²", info: "Balkon, straatzijde, grootste kamer" },
            { naam: "Frankrijk (Medoc 2005)",             icon: "🇫🇷", afm: "~18 m²", info: "Balkon, tuinzijde, veel groen" },
            { naam: "Oekraïne (straks logeerkamer)",      icon: "🇺🇦", afm: "~15 m²", info: "Nu: Manon & Maxim. Wordt logeerkamer." },
            { naam: "Badkamer",              icon: "🚿", afm: "~9 m²",  info: "Eigen badkamer voor deze verdieping" },
            { naam: "Kitchenette",           icon: "☕", afm: "~8 m²",  info: "Kleine keukenunit per verdieping" },
            { naam: "Sportkamer",            icon: "🏋️", afm: "~20 m²", info: "In aanbouw", aanbouw: true },
        ],
    },
    {
        id: "onder",
        label: "Onderste verdieping",
        bewoners: "Manon & Maxim",
        icon: "🏡",
        kleur: "#c8a46e",
        beschrijving: "Ruime woonkamer met open keuken en eetkamer — het gemeenschappelijk hart. Slaapkamer en badkamer in aanbouw. Verbonden met de tuin.",
        status: "in ontwikkeling",
        ruimtes: [
            { naam: "Woonkamer",              icon: "🛋️", afm: "~45 m²", info: "Open plan, hoge plafonds, erker, houtkachel" },
            { naam: "Open keuken + eetkamer", icon: "🍽️", afm: "~28 m²", info: "Volledig uitgerust, eiken tafel" },
            { naam: "Slaapkamer",             icon: "🛏️", afm: "~18 m²", info: "In aanbouw", aanbouw: true },
            { naam: "Badkamer",               icon: "🚿", afm: "~10 m²", info: "In aanbouw", aanbouw: true },
        ],
    },
    {
        id: "tuin",
        label: "Tuin & buitenruimte",
        bewoners: "Gedeeld",
        icon: "🌿",
        kleur: "#4caf50",
        beschrijving: "Groot perceel (450 m²) met veel potentieel. Sauna, dompelbad en groenvoorziening in aanbouw. De schuur en het autopark verhuizen zodra de verbouwing dit toelaat.",
        status: "in aanbouw",
        ruimtes: [
            { naam: "Terras",               icon: "☀️", afm: "~40 m²", info: "Achtertuin, barbecue, zitgelegenheid" },
            { naam: "Sauna",                icon: "🧖", afm: "~15 m²", info: "In aanbouw", aanbouw: true },
            { naam: "Dompelbad",            icon: "🛁", afm: "",       info: "In aanbouw naast sauna", aanbouw: true },
            { naam: "Groenvoorziening",     icon: "🌳", afm: "",       info: "Tuin in aanbouw", aanbouw: true },
            { naam: "Schuur",               icon: "🏚️", afm: "",       info: "Wordt verplaatst naar betere locatie", aanbouw: true },
            { naam: "Openslaande deuren",   icon: "🚪", afm: "",       info: "Worden teruggebouwd (origineel)", aanbouw: true },
        ],
    },
];

const STATS = [
    { val: "6",    label: "Slaapkamers", sub: "(+1 in aanbouw)" },
    { val: "2→3",  label: "Keukens",     sub: "(3e in aanbouw)" },
    { val: "2→3",  label: "Badkamers",   sub: "(3e in aanbouw)" },
    { val: "450",  label: "m² perceel",  sub: "" },
];

const Plattegrond = () => {
    const navigate = useNavigate();
    const [actief, setActief] = React.useState<string | null>(null);
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

    return (
        <main className="plattegrond-page">
            <Helmet>
                <title>De Ruimtes — Villa Vredestein</title>
                <meta
                    name="description"
                    content="Villa Vredestein heeft drie verdiepingen: studenten (boven), kinderen Desmond/Arwen/Medoc (midden), woonkamer + keuken (onder). Sauna en sportkamer in aanbouw."
                />
                <link rel="canonical" href="https://villavredestein.nl/ruimtes" />
                <meta property="og:title" content="De Ruimtes — Villa Vredestein" />
                <meta property="og:description" content="Drie verdiepingen, elk met eigen karakter. Studenten bovenin, kinderen middenin, woon- en leefruimte onderaan." />
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

            {/* ── Afbeelding referentie ── */}
            <section className="pg-fotos reveal-section" ref={addRef as any}>
                <div className="pg-inner pg-fotos-grid">
                    <img src={WoonkamerImg} alt="Woonkamer Villa Vredestein" loading="lazy" />
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
        </main>
    );
};

export default Plattegrond;
