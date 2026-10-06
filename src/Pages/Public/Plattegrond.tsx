import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Plattegrond.css";
import { useContent } from "../../i18n/content";


/* ─────────────────────────────────────────────
   Verdiepingen (visueel overzicht)
───────────────────────────────────────────── */
type Ruimte = {
    naam: string;
    icon: string;
    afm: string;
    info: string;
    aanbouw?: boolean;
};

type Verdieping = {
    id: string;
    label: string;
    bewoners: string;
    icon: string;
    kleur: string;
    beschrijving: string;
    status: string;
    plattegrondCaption?: string;
    optieId?: string;
    ruimtes: Ruimte[];
};

const VERDIEPINGEN: Verdieping[] = [
    {
        id: "boven",
        label: "Bovenste verdieping",
        bewoners: "Studenten · Desmond",
        icon: "🎓",
        kleur: "#d4804a",
        beschrijving: "Drie studentenkamers met eigen gedeelde keuken, badkamer en woonruimte. Toekomstige eigen ingang gepland.",
        status: "beschikbaar",
        plattegrondCaption: "Tweede verdieping",
        optieId: "tijdelijk",
        ruimtes: [
            { naam: "Thailand (Desmond)", icon: "🇹🇭", afm: "~17 m²", info: "Airco, goed licht, rustig" },
            { naam: "Japan",              icon: "🇯🇵", afm: "~16 m²", info: "Airco, balkon (uitsluitend nooduitgang)" },
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
        plattegrondCaption: "Eerste verdieping",
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
        plattegrondCaption: "Begane grond",
        optieId: "villa",
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
            { naam: "Moestuin",                   icon: "🥦", afm: "",        info: "Al aangelegd, eigen groenten" },
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
    const tc = useContent();
    const { i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";
    const navigate = useNavigate();
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
                <html lang={langCode} />
                <title>{tc("De Ruimtes, Villa Vredestein")}</title>
                <meta
                    name="description"
                    content={tc("Villa Vredestein heeft drie verdiepingen: studenten (boven), kinderen Desmond/Arwen/Medoc (midden), woonkamer + keuken (onder). Sauna en sportkamer in aanbouw.")}
                />
                <link rel="canonical" href="https://villavredestein.com/ruimtes" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.com/ruimtes" />
                <meta property="og:title" content={tc("De Ruimtes, Villa Vredestein")} />
                <meta property="og:description" content={tc("Drie verdiepingen, elk met eigen karakter. 292 m² wonen op 680 m² perceel in Driebergen-Rijsenburg.")} />
                <meta property="og:image" content="https://villavredestein.com/og-image.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:alt" content={tc("Villa Vredestein, historische villa uit 1906 in Driebergen-Rijsenburg")} />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={tc("De Ruimtes, Villa Vredestein")} />
                <meta name="twitter:description" content={tc("Drie verdiepingen, elk met eigen karakter. 292 m² wonen op 680 m² perceel in Driebergen-Rijsenburg.")} />
                <meta name="twitter:image" content="https://villavredestein.com/og-image.jpg" />
            </Helmet>

            {/* ── Hero ── */}
            <header className="pg-hero reveal-section" ref={addRef}>
                <div className="pg-hero-inner">
                    <span className="pg-eyebrow">{tc("De ruimtes")}</span>
                    <h1>{tc("Drie verdiepingen. Elk met eigen leven.")}</h1>
                    <p>
                        {tc("Studenten bovenin, de kinderen op de luxe middenverdieping, en de woonkamer als gedeeld hart onderaan. Alles in beweging.")}
                    </p>
                </div>
                <div className="pg-hero-stats">
                    {STATS.map((s, i) => (
                        <React.Fragment key={s.label}>
                            {i > 0 && <div className="pg-stat-div" />}
                            <div className="pg-stat">
                                <strong>{tc(s.val)}</strong>
                                <span>{tc(s.label)}</span>
                                {s.sub && <small>{tc(s.sub)}</small>}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </header>

            {/* ── Verdiepingen (visuele cards) ── */}
            {VERDIEPINGEN.map((verd) => (
                <section
                    key={verd.id}
                    className="pg-verd reveal-section"
                    ref={addRef}
                    style={{ "--vkleur": verd.kleur } as React.CSSProperties}
                >
                    <div className="pg-inner">
                        <div className="pg-verd-header">
                            <div className="pg-verd-meta">
                                <span className="pg-verd-icon" aria-hidden="true">{tc(verd.icon)}</span>
                                <div>
                                    <h2 className="pg-verd-titel">{tc(verd.label)}</h2>
                                    <span className="pg-verd-bewoners">{tc(verd.bewoners)}</span>
                                </div>
                                <span className="pg-verd-badge">{tc(verd.status)}</span>
                            </div>
                            <p className="pg-verd-beschr">{tc(verd.beschrijving)}</p>
                        </div>

                        <div className="pg-ruimte-grid">
                            {verd.ruimtes.map((r) => (
                                <div
                                    key={r.naam}
                                    className={`pg-ruimte-card ${r.aanbouw ? "pg-aanbouw" : ""}`}
                                >
                                    <span className="pg-ruimte-icon" aria-hidden="true">{tc(r.icon)}</span>
                                    <div className="pg-ruimte-body">
                                        <strong>{tc(r.naam)}</strong>
                                        {r.afm && <span className="pg-ruimte-afm">{tc(r.afm)}</span>}
                                        <p>{tc(r.info)}</p>
                                    </div>
                                    {r.aanbouw && <span className="pg-aanbouw-chip">{tc("In aanbouw")}</span>}
                                </div>
                            ))}
                        </div>
                        {(verd.plattegrondCaption || verd.optieId) && (
                            <div className="pg-platt-link-wrap">
                                {verd.plattegrondCaption && (
                                    <button
                                        className="pg-platt-link"
                                        onClick={() => navigate("/galerij/plattegrond")}
                                    >
                                        {tc("Bekijk plattegrond")} {tc(verd.plattegrondCaption)} →
                                    </button>
                                )}
                                {verd.optieId && (
                                    <button
                                        className="pg-platt-link"
                                        onClick={() => navigate("/verblijven", { state: { optie: verd.optieId } })}
                                    >
                                        {tc("Bekijk verblijfsopties voor deze verdieping →")}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            ))}

            {/* ── CTA ── */}
            <section className="pg-cta reveal-section" ref={addRef}>
                <div className="pg-inner pg-cta-inner">
                    <div>
                        <h2>{tc("Interesse in verblijven?")}</h2>
                        <p>{tc("Studenten, korte verhuur of langdurig wonen. Vraag beschikbaarheid op.")}</p>
                    </div>
                    <button className="pg-cta-btn" onClick={() => navigate("/verblijven")}>
                        {tc("Bekijk verblijfsopties")}
                    </button>
                </div>
            </section>

        </main>
    );
};

export default Plattegrond;
