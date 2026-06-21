import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "./InDePers.css";

const PERS_ITEMS = [
    {
        medium: "Vul hier de naam van het medium in",
        datum: "Vul hier de datum in",
        kop: "Vul hier de kop van het artikel in",
        samenvatting: "Vul hier een korte samenvatting of de openingszin van het artikel in. Dit is het stuk dat lezers als eerste zien.",
        url: null,
        tag: "Lokaal",
    },
    {
        medium: "Vul hier de naam van het medium in",
        datum: "Vul hier de datum in",
        kop: "Vul hier de kop van het artikel in",
        samenvatting: "Vul hier een korte samenvatting of de openingszin van het artikel in. Dit is het stuk dat lezers als eerste zien.",
        url: null,
        tag: "Regionaal",
    },
    {
        medium: "Vul hier de naam van het medium in",
        datum: "Vul hier de datum in",
        kop: "Vul hier de kop van het artikel in",
        samenvatting: "Vul hier een korte samenvatting of de openingszin van het artikel in. Dit is het stuk dat lezers als eerste zien.",
        url: null,
        tag: "Online",
    },
];

const InDePers = () => {
    const navigate = useNavigate();
    const cardRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => {
                    if (e.isIntersecting) e.target.classList.add("idp-visible");
                }),
            { threshold: 0.1 }
        );
        cardRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <main className="idp-page">
            <Helmet>
                <title>In de Pers — Villa Vredestein</title>
                <meta
                    name="description"
                    content="Villa Vredestein in het nieuws. Kranten, tijdschriften en online media over dit bijzondere historische pand in Driebergen-Rijsenburg."
                />
                <link rel="canonical" href="https://villavredestein.nl/in-de-pers" />
                <meta property="og:title" content="In de Pers — Villa Vredestein" />
                <meta property="og:description" content="Villa Vredestein in het nieuws." />
                <meta property="og:url" content="https://villavredestein.nl/in-de-pers" />
                <meta property="og:type" content="website" />
            </Helmet>

            {/* Hero */}
            <header className="idp-hero">
                <div className="idp-hero-inner">
                    <span className="idp-eyebrow">Pers & Media</span>
                    <h1 className="idp-title">In de pers</h1>
                    <p className="idp-sub">
                        Villa Vredestein in het nieuws. Een historisch pand dat verhalen aantrekt.
                    </p>
                </div>
            </header>

            {/* Perskaarten */}
            <section className="idp-grid-section" aria-label="Persberichten">
                <div className="idp-grid">
                    {PERS_ITEMS.map((item, i) => (
                        <article
                            key={i}
                            className="idp-card idp-reveal"
                            ref={(el) => (cardRefs.current[i] = el)}
                        >
                            <div className="idp-card-top">
                                <span className="idp-tag">{item.tag}</span>
                                <span className="idp-datum">{item.datum}</span>
                            </div>
                            <p className="idp-medium">{item.medium}</p>
                            <h2 className="idp-kop">{item.kop}</h2>
                            <p className="idp-samenvatting">{item.samenvatting}</p>
                            {item.url && (
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="idp-lees-link"
                                >
                                    Lees artikel →
                                </a>
                            )}
                        </article>
                    ))}
                </div>
            </section>

            {/* Pers CTA */}
            <section className="idp-cta">
                <div className="idp-cta-inner">
                    <span className="idp-cta-eyebrow">Pers & media</span>
                    <h2>Wil je schrijven over Villa Vredestein?</h2>
                    <p>
                        We staan open voor journalisten, bloggers en fotografen die het verhaal van
                        dit bijzondere pand willen vertellen. Neem contact op voor een bezoek of
                        meer informatie.
                    </p>
                    <button className="idp-cta-btn" onClick={() => navigate("/contact")}>
                        Neem contact op
                    </button>
                </div>
            </section>
        </main>
    );
};

export default InDePers;
