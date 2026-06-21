import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "./Plattegrond.css";

import WoonkamerImg  from "../../Assets/Images/int-woonkamer.jpg";
import WijnkamerImg  from "../../Assets/Images/int-wijnkamer.jpg";

const VERDIEPINGEN = [
    {
        label: "Bovenste verdieping",
        sub: "3 studentenkamers",
        icon: "🎓",
        beschrijving: "De bovenste verdieping is ingericht voor drie studenten. Rustig, hoog in de villa, elk met eigen karakter.",
    },
    {
        label: "Middelste verdieping",
        sub: "Desmond · Arwen · Medoc",
        icon: "👨‍👩‍👧‍👦",
        beschrijving: "De middelste verdieping is voor onze drie volwassen kinderen: Desmond (2001), Arwen (2006) en Medoc (2005). Elk hun eigen plek.",
    },
    {
        label: "Begane grond",
        sub: "Gedeelde ruimtes",
        icon: "🏡",
        beschrijving: "Woonkamer, keukens, badkamers en de wijnkamer. De begane grond is de gemeenschappelijke kern van de villa.",
    },
];

const KAMERS = [
    {
        id: "woonkamer",
        naam: "Woonkamer",
        verdieping: "Begane grond",
        icon: "🛋️",
        afmeting: "~45 m²",
        beschrijving: "De grote gemeenschappelijke woonkamer met hoge plafonds, erker, houtkachel en authentieke eiken vloer. Het hart van de villa.",
        kenmerken: ["Erker met tuinzicht", "Houtkachel", "Eiken vloer", "Hoge plafonds", "Gedeeld"],
        img: WoonkamerImg,
    },
    {
        id: "desmond",
        naam: "Kamer Desmond",
        verdieping: "Middelste verdieping",
        icon: "🛏️",
        afmeting: "~22 m²",
        beschrijving: "De grootste kamer op de middelste verdieping. Ruim, licht en rustig. Uitzicht op de Hoofdstraat.",
        kenmerken: ["Straatzijde", "Groot bureau", "Veel licht", "Hoge plafonds"],
        featured: true,
    },
    {
        id: "arwen",
        naam: "Kamer Arwen",
        verdieping: "Middelste verdieping",
        icon: "🌿",
        afmeting: "~18 m²",
        beschrijving: "Rustige kamer aan de tuinzijde. Zicht op het groen en de achtertuin.",
        kenmerken: ["Tuinzijde", "Stil", "Zicht op groen"],
    },
    {
        id: "medoc",
        naam: "Kamer Medoc",
        verdieping: "Middelste verdieping",
        icon: "🇮🇹",
        afmeting: "~15 m²",
        beschrijving: "Warm ingericht met details die aan Italië doen denken. De gezelligste kamer op deze verdieping.",
        kenmerken: ["Uniek interieur", "Gezellig", "Eigen sfeer"],
    },
    {
        id: "student1",
        naam: "Studentenkamer A",
        verdieping: "Bovenste verdieping",
        icon: "📚",
        afmeting: "~17 m²",
        beschrijving: "Ruime studentenkamer hoog in de villa. Goed licht overdag, stil in de nacht.",
        kenmerken: ["Eigen ruimte", "Rustig", "Hoog in de villa"],
    },
    {
        id: "student2",
        naam: "Studentenkamer B",
        verdieping: "Bovenste verdieping",
        icon: "🏔️",
        afmeting: "~16 m²",
        beschrijving: "Karakteristieke zolderkamer met daklichten en schuin dak. Eigen sfeer, hoog in de villa.",
        kenmerken: ["Daklichten", "Schuin dak", "Zolderkamer", "Aparte sfeer"],
    },
    {
        id: "student3",
        naam: "Studentenkamer C",
        verdieping: "Bovenste verdieping",
        icon: "🛏️",
        afmeting: "~16 m²",
        beschrijving: "Derde studentenkamer op de bovenste verdieping. Rustig en compact.",
        kenmerken: ["Rustig", "Compact", "Bovenste etage"],
    },
    {
        id: "aanbouw",
        naam: "Kamer 7 (in aanbouw)",
        verdieping: "In aanbouw",
        icon: "🔨",
        afmeting: "Nader te bepalen",
        beschrijving: "De zevende slaapkamer is momenteel nog in aanbouw. Wordt een volwaardige extra kamer.",
        kenmerken: ["In aanbouw", "Binnenkort beschikbaar"],
    },
    {
        id: "keuken1",
        naam: "Keuken 1",
        verdieping: "Begane grond",
        icon: "🍳",
        afmeting: "~20 m²",
        beschrijving: "Volledig uitgeruste gedeelde keuken met vaatwasser, oven en koelkast.",
        kenmerken: ["Volledige uitrusting", "Vaatwasser", "Oven", "Gedeeld"],
    },
    {
        id: "keuken2",
        naam: "Keuken 2",
        verdieping: "Begane grond",
        icon: "🍽️",
        afmeting: "~15 m²",
        beschrijving: "Tweede keuken in de villa. Extra kookmogelijkheid voor bewoners van de bovenste verdieping.",
        kenmerken: ["Tweede keuken", "Koelkast", "Kookplaat", "Gedeeld"],
    },
    {
        id: "keuken3",
        naam: "Keuken 3 (in aanbouw)",
        verdieping: "In aanbouw",
        icon: "🔨",
        afmeting: "Nader te bepalen",
        beschrijving: "Derde keuken is nog in aanbouw. Straks drie keukens voor maximale vrijheid per verdieping.",
        kenmerken: ["In aanbouw", "Binnenkort beschikbaar"],
    },
    {
        id: "wijnkamer",
        naam: "Wijnkamer",
        verdieping: "Begane grond",
        icon: "🍷",
        afmeting: "~12 m²",
        beschrijving: "Exclusieve ruimte met wijnrek, sfeerverlichting en een originele kroonluchter.",
        kenmerken: ["Wijnrek", "Sfeerverlichting", "Originele details"],
        img: WijnkamerImg,
    },
];

const GEMEENSCHAPPELIJK = [
    { icon: "🚿", label: "Badkamers",       tekst: "2 volledig uitgeruste badkamers. Derde badkamer is in aanbouw." },
    { icon: "🌳", label: "Tuin & terras",   tekst: "Grote achtertuin met terras, barbecue en zitgelegenheid" },
    { icon: "🚲", label: "Fietsenstalling", tekst: "Overdekte fietsenstalling aan de zijkant van het pand" },
    { icon: "🅿️", label: "Parkeren",        tekst: "Oprit met ruimte voor meerdere auto's" },
    { icon: "📶", label: "Glasvezel wifi",  tekst: "Snel internet in de hele villa" },
    { icon: "🧺", label: "Wasmachine",      tekst: "Wasmachine en droger beschikbaar" },
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
            { threshold: 0.08 }
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
                    content="6 slaapkamers (1 in aanbouw), 2 keukens (3e in aanbouw), 2 badkamers (3e in aanbouw). Bovenste verdieping voor studenten, middelste voor de kinderen. Bekijk de indeling van Villa Vredestein."
                />
                <link rel="canonical" href="https://villavredestein.nl/ruimtes" />
            </Helmet>

            <header className="pg-hero reveal-section" ref={addRef as any}>
                <div className="pg-hero-inner">
                    <span className="pg-eyebrow">De ruimtes</span>
                    <h1>Zes kamers. Drie verdiepingen.</h1>
                    <p>
                        Bovenste verdieping voor studenten, middelste voor de kinderen, begane grond voor iedereen.
                        Twee keukens, twee badkamers — en allebei wordt het er drie.
                    </p>
                </div>
                <div className="pg-hero-stats">
                    <div className="pg-stat"><strong>6</strong><span>Slaapkamers</span></div>
                    <div className="pg-stat-div" />
                    <div className="pg-stat"><strong>2→3</strong><span>Keukens</span></div>
                    <div className="pg-stat-div" />
                    <div className="pg-stat"><strong>2→3</strong><span>Badkamers</span></div>
                    <div className="pg-stat-div" />
                    <div className="pg-stat"><strong>1906</strong><span>Bouwjaar</span></div>
                </div>
            </header>

            {/* Verdiepingen overzicht */}
            <section className="pg-verdiepingen reveal-section" ref={addRef as any}>
                <div className="pg-inner">
                    <h2 className="pg-section-title">De indeling per verdieping</h2>
                    <div className="verdieping-grid">
                        {VERDIEPINGEN.map((v) => (
                            <div key={v.label} className="verdieping-card">
                                <span className="verdieping-icon" aria-hidden="true">{v.icon}</span>
                                <div>
                                    <strong>{v.label}</strong>
                                    <em>{v.sub}</em>
                                    <p>{v.beschrijving}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Kamer cards */}
            <section className="pg-kamers reveal-section" ref={addRef as any}>
                <div className="pg-inner">
                    <h2 className="pg-section-title">Alle ruimtes</h2>
                    <div className="kamers-grid">
                        {KAMERS.map((kamer) => (
                            <article
                                key={kamer.id}
                                className={`kamer-card ${kamer.featured ? "kamer-featured" : ""} ${kamer.id === "aanbouw" || kamer.id === "keuken3" ? "kamer-aanbouw" : ""} ${actief === kamer.id ? "kamer-open" : ""}`}
                                onClick={() => setActief(actief === kamer.id ? null : kamer.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActief(actief === kamer.id ? null : kamer.id)}
                                aria-expanded={actief === kamer.id}
                            >
                                {kamer.featured && <div className="kamer-badge">Grootste kamer</div>}
                                {kamer.img && (
                                    <div className="kamer-img-wrap">
                                        <img src={kamer.img} alt={kamer.naam} loading="lazy" />
                                    </div>
                                )}

                                <div className="kamer-body">
                                    <div className="kamer-header-row">
                                        <span className="kamer-icon" aria-hidden="true">{kamer.icon}</span>
                                        <div>
                                            <h3 className="kamer-naam">{kamer.naam}</h3>
                                            <span className="kamer-verdieping">{kamer.verdieping}</span>
                                        </div>
                                        <span className="kamer-afmeting">{kamer.afmeting}</span>
                                    </div>

                                    <p className="kamer-beschrijving">{kamer.beschrijving}</p>

                                    <div className={`kamer-detail ${actief === kamer.id ? "detail-visible" : ""}`}>
                                        <ul className="kamer-features">
                                            {kamer.kenmerken.map((k) => (
                                                <li key={k}><span aria-hidden="true">✓</span> {k}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <span className="kamer-toggle">
                                        {actief === kamer.id ? "Minder ↑" : "Details ↓"}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gemeenschappelijke voorzieningen */}
            <section className="pg-voorzieningen reveal-section" ref={addRef as any}>
                <div className="pg-inner">
                    <h2 className="pg-section-title">Gemeenschappelijke voorzieningen</h2>
                    <div className="voorzienin-grid">
                        {GEMEENSCHAPPELIJK.map((v) => (
                            <div key={v.label} className="voorzienin-card">
                                <span className="voorzienin-icon" aria-hidden="true">{v.icon}</span>
                                <div>
                                    <strong>{v.label}</strong>
                                    <p>{v.tekst}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="pg-cta reveal-section" ref={addRef as any}>
                <div className="pg-inner pg-cta-inner">
                    <div>
                        <h2>Interesse in een kamer of de volledige villa?</h2>
                        <p>Vraag beschikbaarheid op en we bespreken de mogelijkheden.</p>
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
