import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./Tijdlijn.css";

const updates = [
    {
        datum: "1906",
        titel: "De villa wordt gebouwd",
        emoji: "🏛️",
        status: "gedaan",
        tekst: "Op Hoofdstraat in Driebergen-Rijsenburg verrijst een hervormd-christelijk logement. Hoge plafonds, dikke muren en een ziel die meer dan een eeuw later nog voelbaar is.",
        blogSlug: "geschiedenis",
        cta: "Lees de geschiedenis",
    },
    {
        datum: "2020",
        titel: "Manon & Maxim kopen de villa",
        emoji: "🗝️",
        status: "gedaan",
        tekst: "Midden in een pandemie slaat de sleutel in het slot. De villa was jarenlang studentenhuis voor IVA — verwaarloosde muren, begraven karakter. Maar wie goed keek, zag wat eronder lag.",
        blogSlug: "villa-vredestein",
        cta: "Lees het verhaal",
    },
    {
        datum: "2021 — 2022",
        titel: "De restauratie begint",
        emoji: "🔨",
        status: "gedaan",
        tekst: "Van kelder tot zolder. Originele houten vloeren, sierstucwerk, karakteristieke deuren — alles wat nog te redden viel, werd bewaard. Een balans tussen oud en nieuw.",
        blogSlug: "restauratie",
        cta: "Bekijk de restauratie",
    },
    {
        datum: "2023",
        titel: "De omgeving ontdekt",
        emoji: "🌳",
        status: "gedaan",
        tekst: "De villa staat niet op zichzelf. Driebergen-Rijsenburg biedt bos, rust en architectuur die je nergens anders vindt. De omgeving werd een bewuste keuze.",
        blogSlug: "omgeving",
        cta: "Ontdek de omgeving",
    },
    {
        datum: "2024",
        titel: "Woonkamer & interieur",
        emoji: "💡",
        status: "gedaan",
        tekst: "Nieuwe verlichting, doordachte indeling, sfeer gecreëerd. De woonkamer is nu het kloppende hart van de villa — waar 's avonds iedereen samenkomt.",
        detail: "Van de verlichting tot de keuze voor meubels: elk detail is afgestemd op het karakter van het pand. Modern comfort dat de historische ruimte niet verdringt, maar versterkt.",
    },
    {
        datum: "Vroegejaar 2025",
        titel: "De tuin wordt wakker",
        emoji: "🌱",
        status: "bezig",
        tekst: "Eerste planten, eerste plannen. Een terras in wording. Zodra de zon meewerkt, gaat de schop de grond in — en krijgt de tuin het verhaal dat het verdient.",
        detail: "De tuin wordt een verlengstuk van het huis: een plek om te zitten, te eten en de kinderen te laten rennen. Moestuin, borders en misschien een kleine vijver staan op de lijst.",
    },
    {
        datum: "Zomer 2025",
        titel: "Badkamer renovatie",
        emoji: "🚿",
        status: "gepland",
        tekst: "De grote klus op de eerste verdieping. Nieuwe tegels, nieuwe kranen — dit wordt het pronkstuk van boven.",
        detail: "Nog in voorbereiding. Materialen zijn gekozen, inspiratie is er genoeg. Zodra het werk begint, volgt een update.",
    },
    {
        datum: "Wordt vervolgd",
        titel: "Meer plannen onderweg",
        emoji: "✨",
        status: "toekomst",
        tekst: "Villa Vredestein is een werk in uitvoering. Er zijn altijd meer ideeën dan tijd — maar dat maakt het juist bijzonder.",
        detail: "Volg de tijdlijn. Er komen updates over de schuur, de voortuin, de kamers en veel meer.",
    },
];

const statusLabel = { gedaan: "Afgerond", bezig: "In uitvoering", gepland: "Gepland", toekomst: "Binnenkort" };

const Tijdlijn = () => {
    const navigate = useNavigate();
    const itemsRef = useRef([]);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
            { threshold: 0.15 }
        );
        itemsRef.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleKaartKlik = (item, i) => {
        if (item.blogSlug) {
            navigate(`/blog/${item.blogSlug}`);
        } else {
            setExpanded(expanded === i ? null : i);
        }
    };

    return (
        <main className="tijdlijn-page">
            <Helmet>
                <title>Tijdlijn — Villa Vredestein</title>
                <meta name="description" content="Volg de restauratie en geschiedenis van Villa Vredestein stap voor stap." />
            </Helmet>

            <header className="tijdlijn-header">
                <h1>De Verbouwtijdlijn</h1>
                <p>Van 1906 tot nu. De restauratie, de geschiedenis en de plannen — stap voor stap bijgehouden.</p>
            </header>

            <div className="tijdlijn-container">
                <div className="tijdlijn-lijn" />

                {updates.map((item, i) => (
                    <div
                        key={i}
                        className={`tijdlijn-item ${i % 2 === 0 ? "links" : "rechts"} fade-trigger`}
                        ref={(el) => (itemsRef.current[i] = el)}
                    >
                        <div className="tijdlijn-dot"><span>{item.emoji}</span></div>

                        <div
                            className={`tijdlijn-kaart ${item.blogSlug ? "kaart-link" : ""} ${expanded === i ? "kaart-open" : ""}`}
                            onClick={() => handleKaartKlik(item, i)}
                            role={item.blogSlug || item.detail ? "button" : undefined}
                            tabIndex={item.blogSlug || item.detail ? 0 : undefined}
                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleKaartKlik(item, i)}
                            aria-expanded={item.detail ? expanded === i : undefined}
                        >
                            <div className="tijdlijn-kaart-header">
                                <span className="tijdlijn-datum">{item.datum}</span>
                                <span className={`tijdlijn-badge badge-${item.status}`}>{statusLabel[item.status]}</span>
                            </div>
                            <h3>{item.titel}</h3>
                            <p className="tijdlijn-preview">{item.tekst}</p>

                            {item.detail && (
                                <div className={`tijdlijn-detail ${expanded === i ? "detail-open" : ""}`}>
                                    <p>{item.detail}</p>
                                </div>
                            )}

                            <div className="tijdlijn-kaart-footer">
                                {item.blogSlug && (
                                    <span className="tijdlijn-cta">{item.cta} →</span>
                                )}
                                {item.detail && !item.blogSlug && (
                                    <span className="tijdlijn-cta">
                                        {expanded === i ? "Minder lezen ↑" : "Lees meer ↓"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Tijdlijn;
