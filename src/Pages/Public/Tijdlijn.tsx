import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./Tijdlijn.css";

const historisch = [
    {
        datum: "1906",
        titel: "De villa wordt gebouwd",
        emoji: "🏛️",
        status: "historisch",
        tekst: "Burgemeester Baltus Koker van Krimpen aan den IJssel laat aan de Hoofdstraat in Driebergen-Rijsenburg een statig buitenhuis bouwen. Hoge plafonds, dikke muren en een ziel die meer dan een eeuw later nog voelbaar is.",
        detail: "Koker koos voor vakmanschap dat generaties zou meegaan: sierstucwerk aan de plafonds, hoge paneeldeuren, een imposante schouw en forse houten balken. De locatie aan de Hoofdstraat was geen toeval — Driebergen was in die tijd een geliefde villawijk voor gegoede burgers uit de steden.",
    },
    {
        datum: "1906 — 1912",
        titel: "Gezusters van de Bosch",
        emoji: "🏨",
        status: "historisch",
        tekst: "De eerste bewoners zijn de Gezusters van de Bosch, die het pand inrichten als hervormd-christelijk logement. De villa opent haar deuren voor gasten die rust en bezinning zoeken in de bossen van Driebergen.",
    },
    {
        datum: "1912 — 1935",
        titel: "Familie Sluijter",
        emoji: "📰",
        status: "historisch",
        tekst: "Familie Sluijter zet de traditie voort als protestants christelijk pension. Krantenartikelen uit die periode getuigen van een druk en actief huis: vacatures voor keukenmeiden, ingezonden stukken en advertenties.",
        detail: "De krantenknipsels lopen van 1912 tot diep in de jaren dertig. Vacatures, bijeenkomsten en af en toe nieuws over de inbraak in 1928 schilderen een levendig beeld van het pension in zijn bloeitijd.",
    },
    {
        datum: "Tweede Wereldoorlog",
        titel: "Oorlogsjaren",
        emoji: "⚔️",
        status: "historisch",
        tekst: "Over de oorlogsjaren van Vredestein is weinig gedocumenteerd. Driebergen-Rijsenburg bleef relatief gespaard, maar de bezettingsjaren lieten overal hun sporen na.",
    },
    {
        datum: "1945 — 1963",
        titel: "Mevrouw Elings",
        emoji: "🌺",
        status: "historisch",
        tekst: "Na de bevrijding neemt mevrouw Elings het pand over. Bijna twee decennia lang is Vredestein onder haar hoede een vertrouwde plek. Krantenberichten uit 1959 en een vacature voor verpleegdames uit 1965 getuigen van een actief huis.",
    },
    {
        datum: "1964 — 1971",
        titel: "Familie Roelofsen",
        emoji: "🏡",
        status: "historisch",
        tekst: "Familie Roelofsen bewoont de villa gedurende bijna een decennium. Het pand blijft een vertrouwd gezicht aan de Hoofdstraat in Driebergen.",
    },
    {
        datum: "1971 — 1972",
        titel: "Ortholab",
        emoji: "🔬",
        status: "historisch",
        tekst: "Ortholab betrekt de villa voor korte tijd. Een bijzondere wending in het leven van het pand: na bijna vijf decennia residentieel gebruik wordt het gebouw even iets anders.",
    },
    {
        datum: "1973 — 2019",
        titel: "Familie Blooij",
        emoji: "🎓",
        status: "historisch",
        tekst: "Familie Blooij brengt de villa nieuw leven in. Bijna vijf decennia lang is het pand een studentenhuis voor de IVA-opleiding in Driebergen. Generaties studenten wonen, leren en leven aan de Hoofdstraat.",
        detail: "Ruim 46 jaar lang draait Vredestein op studenten. Laag na laag verf trekt over de muren, vloeren verdwijnen onder tapijt, en het originele karakter van de villa raakt diep begraven.",
    },
];

const renovatie = [
    {
        datum: "2020",
        titel: "Manon & Maxim kopen de villa",
        emoji: "🗝️",
        status: "gedaan",
        tekst: "Midden in een pandemie slaat de sleutel in het slot. De villa had jarenlang dienst gedaan als studentenhuis voor IVA, met verwaarloosde muren en een begraven karakter. Maar wie goed keek, zag wat eronder lag.",
        detail: "Na decennia als studentenhuis stond de villa er verwaarloosd bij. Lagen verf, verborgen plafonds en begraven vloeren. Maar de botten waren sterk: hoge plafonds, dikke muren, origineel sierstucwerk dat wachtte om bevrijd te worden.",
    },
    {
        datum: "2021 — 2022",
        titel: "De restauratie begint",
        emoji: "🔨",
        status: "gedaan",
        tekst: "Van kelder tot zolder. De originele houten vloeren, het sierstucwerk, de karakteristieke deuren: alles wat nog te redden viel werd zorgvuldig bewaard en teruggeplaatst. Oud en nieuw vonden elkaar.",
        detail: "Elke kamer werd teruggestript naar de basis. De eiken vloerdelen kwamen terug. Het sierstucwerk werd millimeter voor millimeter gerestaureerd. De hoge paneeldeuren — met hun oorspronkelijke beslag — keerden terug op hun plek.",
    },
    {
        datum: "2023",
        titel: "De omgeving ontdekt",
        emoji: "🌳",
        status: "gedaan",
        tekst: "De villa staat niet op zichzelf. Driebergen-Rijsenburg biedt bos, rust en architectuur die je nergens anders vindt. De omgeving werd een bewuste keuze.",
        detail: "Het Nationaal Park Utrechtse Heuvelrug begint letterlijk aan de achterdeur. Utrecht ligt op een kwartier, Amsterdam op veertig minuten. Driebergen werd geen compromis maar een bewuste keuze — en dat verschil voel je.",
    },
    {
        datum: "2024",
        titel: "Woonkamer & interieur",
        emoji: "💡",
        status: "gedaan",
        tekst: "Nieuwe verlichting, doordachte indeling, sfeer gecreëerd. De woonkamer is nu het kloppende hart van de villa, de plek waar 's avonds iedereen samenkomt.",
        detail: "Van de verlichting tot de keuze voor meubels: elk detail is afgestemd op het karakter van het pand. Modern comfort dat de historische ruimte niet verdringt, maar versterkt.",
    },
    {
        datum: "Vroegejaar 2025",
        titel: "De tuin wordt wakker",
        emoji: "🌱",
        status: "bezig",
        tekst: "Eerste planten, eerste plannen. Een terras in wording. Zodra de zon meewerkt, gaat de schop de grond in. Dan krijgt de tuin eindelijk het verhaal dat het verdient.",
        detail: "De tuin wordt een verlengstuk van het huis: een plek om te zitten, te eten en de kinderen te laten rennen. Moestuin, borders en misschien een kleine vijver staan op de lijst.",
    },
    {
        datum: "Zomer 2025",
        titel: "Badkamer renovatie",
        emoji: "🚿",
        status: "gepland",
        tekst: "De grote klus op de eerste verdieping. Nieuwe tegels, nieuwe kranen, nieuwe energie. Dit wordt het pronkstuk van boven.",
        detail: "Nog in voorbereiding. Materialen zijn gekozen, inspiratie is er genoeg. Zodra het werk begint, volgt een update.",
    },
    {
        datum: "Wordt vervolgd",
        titel: "Meer plannen onderweg",
        emoji: "✨",
        status: "toekomst",
        tekst: "Villa Vredestein is een werk in uitvoering. Er zijn altijd meer ideeën dan tijd. En juist dat maakt dit huis zo bijzonder.",
        detail: "Volg de tijdlijn. Er komen updates over de schuur, de voortuin, de kamers en veel meer.",
    },
];

const statusLabel = {
    historisch: "Geschiedenis",
    gedaan: "Afgerond",
    bezig: "In uitvoering",
    gepland: "Gepland",
    toekomst: "Binnenkort",
};

function TijdlijnItem({ item, index, globalIndex, expanded, onKlik, innerRef }) {
    const isOpen = expanded === globalIndex;

    return (
        <div
            className={`tijdlijn-item ${index % 2 === 0 ? "links" : "rechts"} fade-trigger`}
            ref={innerRef}
        >
            <div className="tijdlijn-dot"><span>{item.emoji}</span></div>

            <div className={`tijdlijn-kaart ${item.detail ? "kaart-expandable" : ""} ${isOpen ? "kaart-open" : ""}`}>
                <div className="tijdlijn-kaart-header">
                    <span className="tijdlijn-datum">{item.datum}</span>
                    <span className={`tijdlijn-badge badge-${item.status}`}>{statusLabel[item.status]}</span>
                </div>
                <h3>{item.titel}</h3>
                <p className="tijdlijn-preview">{item.tekst}</p>

                {item.detail && (
                    <div className={`tijdlijn-detail ${isOpen ? "detail-open" : ""}`}>
                        <div className="tijdlijn-detail-inner">
                            <p>{item.detail}</p>
                        </div>
                    </div>
                )}

                {item.detail && (
                    <button
                        className="tijdlijn-lees-meer"
                        onClick={() => onKlik(globalIndex)}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? "Minder lezen" : "Lees meer"}
                        <span className={`lees-meer-pijl ${isOpen ? "pijl-omhoog" : ""}`} aria-hidden="true">↓</span>
                    </button>
                )}
            </div>
        </div>
    );
}

const Tijdlijn = () => {
    const itemsRef = useRef([]);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
            { threshold: 0.12 }
        );
        itemsRef.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleKlik = (i) => setExpanded(expanded === i ? null : i);

    return (
        <main className="tijdlijn-page">
            <Helmet>
                <title>Tijdlijn — Villa Vredestein</title>
                <meta name="description" content="Van 1906 tot nu: de volledige geschiedenis van Villa Vredestein. De bewoners, de restauratie en de plannen voor de toekomst." />
                <link rel="canonical" href="https://villavredestein.nl/tijdlijn" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl/tijdlijn" />
                <meta property="og:title" content="Tijdlijn — Villa Vredestein" />
                <meta property="og:description" content="Van 1906 tot nu: de volledige geschiedenis van Villa Vredestein. De bewoners, de restauratie en de plannen voor de toekomst." />
                <meta property="og:image" content="https://villavredestein.nl/og-image.jpg" />
                <meta property="og:image:alt" content="Villa Vredestein — historische villa in Driebergen-Rijsenburg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="https://villavredestein.nl/og-image.jpg" />
            </Helmet>

            <header className="tijdlijn-header">
                <h1>Tijdlijn Villa Vredestein</h1>
                <p>Van 1906 tot nu: de volledige geschiedenis van het pand, de bewoners door de jaren heen, de restauratie en de plannen voor de toekomst.</p>
            </header>

            <div className="tijdlijn-sectie-label">📜 Geschiedenis</div>

            <div className="tijdlijn-container">
                <div className="tijdlijn-lijn tijdlijn-lijn--historisch" />
                {historisch.map((item, i) => (
                    <TijdlijnItem
                        key={`h-${i}`}
                        item={item}
                        index={i}
                        globalIndex={i}
                        expanded={expanded}
                        onKlik={handleKlik}
                        innerRef={(el) => (itemsRef.current[i] = el)}
                    />
                ))}
            </div>

            <div className="tijdlijn-sectie-label">🔨 Renovatie & toekomst</div>

            <div className="tijdlijn-container">
                <div className="tijdlijn-lijn" />
                {renovatie.map((item, i) => {
                    const globalIndex = historisch.length + i;
                    return (
                        <TijdlijnItem
                            key={`r-${i}`}
                            item={item}
                            index={i}
                            globalIndex={globalIndex}
                            expanded={expanded}
                            onKlik={handleKlik}
                            innerRef={(el) => (itemsRef.current[globalIndex] = el)}
                        />
                    );
                })}
            </div>
        </main>
    );
};

export default Tijdlijn;
