import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./Tijdlijn.css";

const historisch = [
    {
        datum: "1906",
        titel: "De villa wordt gebouwd",
        emoji: "🏛️",
        status: "historisch",
        tekst: "Burgemeester Baltus Koker van Krimpen aan den IJssel laat aan de Hoofdstraat in Driebergen-Rijsenburg een statig buitenhuis bouwen. Hoge plafonds, dikke muren — een fundament voor meer dan een eeuw geschiedenis.",
        blogSlug: "geschiedenis",
        cta: "Lees de geschiedenis",
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
        tekst: "Ortholab betrekt de villa voor korte tijd — een bijzondere wending in het leven van het pand. Een zakelijk intermezzo in een anders residentieel verhaal.",
    },
    {
        datum: "1973 — 2019",
        titel: "Familie Blooij",
        emoji: "🎓",
        status: "historisch",
        tekst: "Familie Blooij brengt de villa nieuw leven in. Bijna vijf decennia lang is het pand een studentenhuis voor de IVA-opleiding in Driebergen. Generaties studenten wonen, leren en leven aan de Hoofdstraat.",
        detail: "Ruim 46 jaar lang draait Vredestein op studenten. De villa raakt aan het oog onttrokken achter laag in laag geschilderde muren en afgedekte vloeren — het originele karakter begraven onder decennia gebruik.",
    },
];

const renovatie = [
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

const statusLabel = {
    historisch: "Geschiedenis",
    gedaan: "Afgerond",
    bezig: "In uitvoering",
    gepland: "Gepland",
    toekomst: "Binnenkort",
};

function TijdlijnItem({ item, index, globalIndex, expanded, onKlik, innerRef }) {
    const navigate = useNavigate();

    const handleKlik = () => {
        if (item.blogSlug) {
            navigate(`/blog/${item.blogSlug}`);
        } else {
            onKlik(globalIndex);
        }
    };

    return (
        <div
            className={`tijdlijn-item ${index % 2 === 0 ? "links" : "rechts"} fade-trigger`}
            ref={innerRef}
        >
            <div className="tijdlijn-dot"><span>{item.emoji}</span></div>

            <div
                className={`tijdlijn-kaart ${item.blogSlug ? "kaart-link" : ""} ${expanded === globalIndex ? "kaart-open" : ""}`}
                onClick={handleKlik}
                role={item.blogSlug || item.detail ? "button" : undefined}
                tabIndex={item.blogSlug || item.detail ? 0 : undefined}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleKlik()}
                aria-expanded={item.detail ? expanded === globalIndex : undefined}
            >
                <div className="tijdlijn-kaart-header">
                    <span className="tijdlijn-datum">{item.datum}</span>
                    <span className={`tijdlijn-badge badge-${item.status}`}>{statusLabel[item.status]}</span>
                </div>
                <h3>{item.titel}</h3>
                <p className="tijdlijn-preview">{item.tekst}</p>

                {item.detail && (
                    <div className={`tijdlijn-detail ${expanded === globalIndex ? "detail-open" : ""}`}>
                        <p>{item.detail}</p>
                    </div>
                )}

                <div className="tijdlijn-kaart-footer">
                    {item.blogSlug && (
                        <span className="tijdlijn-cta">{item.cta} →</span>
                    )}
                    {item.detail && !item.blogSlug && (
                        <span className="tijdlijn-cta">
                            {expanded === globalIndex ? "Minder lezen ↑" : "Lees meer ↓"}
                        </span>
                    )}
                </div>
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
                <meta name="description" content="Volg de restauratie en geschiedenis van Villa Vredestein stap voor stap — van 1906 tot nu." />
            </Helmet>

            <header className="tijdlijn-header">
                <h1>Tijdlijn Villa Vredestein</h1>
                <p>Van 1906 tot nu. De volledige geschiedenis van het pand — de bewoners door de jaren heen, de restauratie en de plannen voor de toekomst.</p>
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
