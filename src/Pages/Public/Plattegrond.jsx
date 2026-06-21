import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "./Plattegrond.css";

import WoonkamerImg from "../../Assets/Images/int-woonkamer.jpg";
import WijnkamerImg from "../../Assets/Images/int-wijnkamer.jpg";
import KroonluchterImg from "../../Assets/Images/int-kroonluchter.jpg";

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
        id: "kamer1",
        naam: "Kamer 1 — Groot",
        verdieping: "Eerste verdieping",
        icon: "🛏️",
        afmeting: "~22 m²",
        beschrijving: "De grootste slaapkamer van de villa. Ruim, licht en rustig. Uitzicht op de Hoofdstraat en de bomen.",
        kenmerken: ["Straatzijde", "Groot bureau", "Licht", "Hoge plafonds"],
        featured: true,
    },
    {
        id: "kamer2",
        naam: "Kamer 2 — Tuinzijde",
        verdieping: "Eerste verdieping",
        icon: "🌿",
        afmeting: "~18 m²",
        beschrijving: "Rustige kamer aan de tuinzijde. Zicht op het groen en de achtertuin. Lekker stil.",
        kenmerken: ["Tuinzijde", "Stil", "Privé ingang mogelijk", "Zicht op groen"],
    },
    {
        id: "kamer3",
        naam: "Kamer 3 — Zolder",
        verdieping: "Tweede verdieping",
        icon: "🏔️",
        afmeting: "~16 m²",
        beschrijving: "Karakteristieke zolderkamer met daklichten en schuin dak. Perfect voor wie van sfeer houdt.",
        kenmerken: ["Daklichten", "Schuin dak", "Aparte sfeer", "Hoog in de villa"],
    },
    {
        id: "kamer4",
        naam: "Kamer 4",
        verdieping: "Eerste verdieping",
        icon: "🛏️",
        afmeting: "~17 m²",
        beschrijving: "Comfortabele kamer midden in de villa. Goed licht overdag, rustig in de nacht.",
        kenmerken: ["Centraal gelegen", "Goed licht", "Rustig"],
    },
    {
        id: "kamer5",
        naam: "Kamer 5 — Italië",
        verdieping: "Eerste verdieping",
        icon: "🇮🇹",
        afmeting: "~15 m²",
        beschrijving: "De gezelligste kamer van de villa. Warm ingericht met details die aan Italië doen denken.",
        kenmerken: ["Uniek interieur", "Gezellig", "Details"],
    },
    {
        id: "keuken",
        naam: "Keuken",
        verdieping: "Begane grond",
        icon: "🍳",
        afmeting: "~20 m²",
        beschrijving: "Volledig uitgeruste gedeelde keuken. Van koelkast tot oven, alles aanwezig voor zelf koken.",
        kenmerken: ["Volledige uitrusting", "Vaatwasser", "Oven", "Gedeeld"],
    },
    {
        id: "wijnkamer",
        naam: "Wijnkamer",
        verdieping: "Begane grond",
        icon: "🍷",
        afmeting: "~12 m²",
        beschrijving: "Exclusieve kamer met wijnrek, sfeerverlichting en een originele kroonluchter. Voor de avonduren.",
        kenmerken: ["Wijnrek", "Sfeerverlichting", "Originele details"],
        img: WijnkamerImg,
    },
];

const GEMEENSCHAPPELIJK = [
    { icon: "🚿", label: "Badkamers", tekst: "2 volledig uitgeruste badkamers op de eerste verdieping" },
    { icon: "🌳", label: "Tuin & terras", tekst: "Grote achtertuin met terras, barbecue en zitgelegenheid" },
    { icon: "🚲", label: "Fietsenstalling", tekst: "Overdekte fietsenstalling aan de zijkant van het pand" },
    { icon: "🅿️", label: "Parkeren", tekst: "Oprit met ruimte voor meerdere auto's" },
    { icon: "📶", label: "Glasvezel wifi", tekst: "Snel internet in de hele villa" },
    { icon: "🧺", label: "Wasmachine", tekst: "Wasmachine en droger beschikbaar" },
];

const Plattegrond = () => {
    const navigate = useNavigate();
    const [actief, setActief] = React.useState(null);
    const revealRefs = useRef([]);
    const addRef = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

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
                <meta name="description" content="Vijf slaapkamers, gemeenschappelijke woonkamer, volledig uitgeruste keuken en een grote tuin. Bekijk de indeling van Villa Vredestein." />
                <link rel="canonical" href="https://villavredestein.nl/ruimtes" />
            </Helmet>

            <header className="pg-hero reveal-section" ref={addRef}>
                <div className="pg-hero-inner">
                    <span className="pg-eyebrow">De ruimtes</span>
                    <h1>Vijf kamers. Één villa.</h1>
                    <p>
                        Elke kamer heeft zijn eigen karakter en sfeer. Samen delen ze de prachtige
                        woonkamer, volledig ingerichte keuken, twee badkamers en een grote tuin.
                    </p>
                </div>
                <div className="pg-hero-stats">
                    <div className="pg-stat"><strong>5</strong><span>Kamers</span></div>
                    <div className="pg-stat-div" />
                    <div className="pg-stat"><strong>2</strong><span>Badkamers</span></div>
                    <div className="pg-stat-div" />
                    <div className="pg-stat"><strong>450 m²</strong><span>Perceel</span></div>
                    <div className="pg-stat-div" />
                    <div className="pg-stat"><strong>1906</strong><span>Bouwjaar</span></div>
                </div>
            </header>

            {/* Kamer cards */}
            <section className="pg-kamers reveal-section" ref={addRef}>
                <div className="pg-inner">
                    <h2 className="pg-section-title">Alle ruimtes</h2>
                    <div className="kamers-grid">
                        {KAMERS.map((kamer) => (
                            <article
                                key={kamer.id}
                                className={`kamer-card ${kamer.featured ? "kamer-featured" : ""} ${actief === kamer.id ? "kamer-open" : ""}`}
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
            <section className="pg-voorzieningen reveal-section" ref={addRef}>
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
            <section className="pg-cta reveal-section" ref={addRef}>
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
