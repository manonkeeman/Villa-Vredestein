import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "./FAQ.css";

const FAQS = [
    {
        vraag: "Wat voor soort verblijf kan ik boeken bij Villa Vredestein?",
        antwoord: "Drie opties: een privékamer in de villa met gedeelde woonkamer, keuken en tuin; een tijdelijk verblijf van kortere of langere duur (ook geschikt voor IVA-studenten); of de volledige villa exclusief, met alle zes slaapkamers en de hele tuin, bijvoorbeeld voor een familie of tijdens een verbouwing elders.",
    },
    {
        vraag: "Wat kost een verblijf in de villa?",
        antwoord: "De prijs is op aanvraag en hangt af van het type verblijf en de periode. Vul het formulier op de pagina Verblijven in en je krijgt binnen 24 uur persoonlijk antwoord, zonder verborgen kosten.",
    },
    {
        vraag: "Waar ligt Villa Vredestein precies?",
        antwoord: "Aan de Hoofdstraat 147 in Driebergen-Rijsenburg, op de Utrechtse Heuvelrug. Utrecht Centraal is ongeveer 15 minuten reizen en Schiphol ligt op ongeveer 50 minuten.",
    },
    {
        vraag: "Wat is er inbegrepen bij een verblijf?",
        antwoord: "Snel internet, een parkeerplaats, toegang tot de tuin, het terras en de moestuin, en een eigen sleutel. De villa dateert uit 1906 en is gerestaureerd met behoud van de historische details.",
    },
    {
        vraag: "Hoe vraag ik beschikbaarheid aan?",
        antwoord: "Via het boekingsformulier op de pagina Verblijven, of via het contactformulier. Manon en Maxim reageren persoonlijk binnen 24 uur met informatie over beschikbaarheid, voorwaarden en prijs.",
    },
    {
        vraag: "Is annuleren mogelijk?",
        antwoord: "Flexibele annulering is bespreekbaar. Neem dit mee in je aanvraag of bespreek het rechtstreeks via het contactformulier of WhatsApp.",
    },
    {
        vraag: "Kan ik de hele villa huren voor een groep of familie?",
        antwoord: "Ja. Villa Vredestein telt zes slaapkamers verdeeld over drie verdiepingen, een grote woonkamer en een ruime tuin. De volledige villa is exclusief te boeken via de optie 'Volledige villa' op de pagina Verblijven.",
    },
    {
        vraag: "Hoe neem ik contact op?",
        antwoord: "Via het contactformulier, per WhatsApp of via Instagram. De contactgegevens staan onderaan iedere pagina in de footer.",
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (i: number) => setOpenIndex((current) => (current === i ? null : i));

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((item) => ({
            "@type": "Question",
            name: item.vraag,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.antwoord,
            },
        })),
    };

    return (
        <main className="faq-page">
            <Helmet>
                <title>Veelgestelde vragen, Villa Vredestein</title>
                <meta
                    name="description"
                    content="Antwoorden op veelgestelde vragen over verblijven bij Villa Vredestein: prijzen, beschikbaarheid, ligging, wat is inbegrepen en hoe je een aanvraag doet."
                />
                <link rel="canonical" href="https://villavredestein.nl/faq" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl/faq" />
                <meta property="og:title" content="Veelgestelde vragen, Villa Vredestein" />
                <meta property="og:description" content="Antwoorden op veelgestelde vragen over verblijven bij Villa Vredestein: prijzen, beschikbaarheid, ligging en meer." />
                <meta property="og:image" content="https://villavredestein.nl/og-image.jpg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Veelgestelde vragen, Villa Vredestein" />
                <meta name="twitter:description" content="Antwoorden op veelgestelde vragen over verblijven bij Villa Vredestein: prijzen, beschikbaarheid, ligging en meer." />
                <meta name="twitter:image" content="https://villavredestein.nl/og-image.jpg" />
                <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
            </Helmet>

            <header className="faq-hero">
                <div className="faq-hero-inner">
                    <span className="faq-eyebrow">Vragen &amp; antwoorden</span>
                    <h1>Veelgestelde vragen</h1>
                    <p>Alles wat je wilt weten voordat je een verblijf aanvraagt.</p>
                </div>
            </header>

            <div className="faq-body">
                <div className="faq-list">
                    {FAQS.map((item, i) => {
                        const open = openIndex === i;
                        const panelId = `faq-panel-${i}`;
                        return (
                            <div className={`faq-item ${open ? "faq-item-open" : ""}`} key={item.vraag}>
                                <button
                                    className="faq-question"
                                    onClick={() => toggle(i)}
                                    aria-expanded={open}
                                    aria-controls={panelId}
                                >
                                    <span>{item.vraag}</span>
                                    <span className="faq-caret" aria-hidden="true">{open ? "−" : "+"}</span>
                                </button>
                                {open && (
                                    <div className="faq-answer" id={panelId} role="region">
                                        <p>{item.antwoord}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="faq-cta">
                    <p>Staat je vraag er niet bij?</p>
                    <Link to="/contact" className="faq-cta-btn">Stel je vraag →</Link>
                </div>
            </div>
        </main>
    );
};

export default FAQ;
