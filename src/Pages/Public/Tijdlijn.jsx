import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import "./Tijdlijn.css";

const updates = [
    { datum: "Zomer 2024",       titel: "Het begin",             emoji: "🗝️", status: "gedaan",   tekst: "De sleutel ging in het slot. Vier mensen, een villa uit 1906 en een lijst met plannen die bij de voordeur al begon te groeien." },
    { datum: "Herfst 2024",      titel: "De grote schoonmaak",   emoji: "🧹", status: "gedaan",   tekst: "Alles uit, alles schoon. Lagen verf, jarenlange spullen en een paar verrassingen achter de plinten. Een frisse start." },
    { datum: "Winter 2024",      titel: "Woonkamer aanpak",      emoji: "💡", status: "gedaan",   tekst: "Nieuwe verlichting, andere indeling, sfeer gecreëerd. De woonkamer voelt nu eindelijk als een plek om echt te zijn." },
    { datum: "Vroegejaar 2025",  titel: "De tuin wordt wakker",  emoji: "🌱", status: "bezig",    tekst: "Eerste planten, eerste plannen voor buiten. Een terras in wording. Zodra de zon meewerkt, gaat de schop de grond in." },
    { datum: "Zomer 2025",       titel: "Badkamer renovatie",    emoji: "🚿", status: "gepland",  tekst: "De grote klus. Nieuwe tegels, nieuwe kranen, minder schimmel. Dit wordt het pronkstuk van de eerste verdieping." },
    { datum: "Nog te plannen",   titel: "???",                   emoji: "✨", status: "toekomst", tekst: "Er zijn altijd meer ideeën dan tijd. Volg de tijdlijn — er komt meer." },
];

const statusLabel = { gedaan: "Afgerond", bezig: "In uitvoering", gepland: "Gepland", toekomst: "Binnenkort" };

const Tijdlijn = () => {
    const itemsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
            { threshold: 0.2 }
        );
        itemsRef.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <main className="tijdlijn-page">
            <Helmet>
                <title>Tijdlijn — Villa Vredestein</title>
                <meta name="description" content="Volg de verbouw en restauratie van Villa Vredestein stap voor stap." />
            </Helmet>

            <header className="tijdlijn-header">
                <h1>De Verbouwtijdlijn</h1>
                <p>Villa Vredestein verandert langzaam maar zeker. Hier houden we bij wat er is gebeurd, wat er loopt en wat er nog gaat komen.</p>
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
                        <div className="tijdlijn-kaart">
                            <div className="tijdlijn-kaart-header">
                                <span className="tijdlijn-datum">{item.datum}</span>
                                <span className={`tijdlijn-badge badge-${item.status}`}>{statusLabel[item.status]}</span>
                            </div>
                            <h3>{item.titel}</h3>
                            <p>{item.tekst}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Tijdlijn;
