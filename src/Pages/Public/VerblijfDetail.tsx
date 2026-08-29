import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { OPTIES } from "../../Data/verblijfOpties";
import "./VerblijfDetail.css";

const VerblijfDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";
    const revealRefs = useRef([]);
    const addRef = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

    const optie = OPTIES.find((o) => o.id === id);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in-view")),
            { threshold: 0.08 }
        );
        revealRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, [optie]);

    if (!optie) {
        return (
            <main className="vd-page">
                <div className="vd-not-found">
                    <h1>Deze verblijfsoptie bestaat niet (meer)</h1>
                    <Link to="/verblijven" className="vd-cta-btn">← Bekijk alle verblijfsopties</Link>
                </div>
            </main>
        );
    }

    const canonicalUrl = `https://villavredestein.nl/verblijven/${optie.id}`;
    const [hero, ...rest] = optie.afbeeldingen;

    const vraagBeschikbaarheid = () => {
        navigate("/verblijven", { state: { optie: optie.id, scrollTo: "formulier" } });
    };

    return (
        <main className="vd-page">
            <Helmet>
                <html lang={langCode} />
                <title>{optie.titel}, Verblijven, Villa Vredestein</title>
                <meta name="description" content={optie.beschrijving} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={`${optie.titel}, Villa Vredestein`} />
                <meta property="og:description" content={optie.beschrijving} />
                <meta property="og:image" content={hero.src} />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${optie.titel}, Villa Vredestein`} />
                <meta name="twitter:description" content={optie.beschrijving} />
                <meta name="twitter:image" content={hero.src} />
            </Helmet>

            {/* Hero */}
            <header className="vd-hero">
                <div className="vd-hero-bg" style={{ backgroundImage: `url(${hero.src})` }} />
                <div className="vd-hero-overlay" />
                <div className="vd-hero-content">
                    <Link to="/verblijven" className="vd-back">← Alle verblijfsopties</Link>
                    <span className="vd-eyebrow">{optie.icon} {optie.sub}</span>
                    <h1>{optie.titel}</h1>
                    <p>{optie.beschrijving}</p>
                </div>
            </header>

            {/* Inhoud */}
            <section className="vd-body reveal-section" ref={addRef}>
                <div className="vd-inner vd-body-grid">
                    <div className="vd-tekst">
                        <h2 className="vd-section-title">Over dit verblijf</h2>
                        {optie.langeBeschrijving.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}

                        <h3 className="vd-kenmerken-titel">Wat is inbegrepen</h3>
                        <ul className="vd-kenmerken">
                            {optie.kenmerken.map((k) => (
                                <li key={k}>
                                    <span aria-hidden="true">✓</span> {k}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <aside className="vd-sidebar">
                        <div className="vd-prijs-kaart">
                            <span className="vd-prijs-label">Prijs</span>
                            <strong className="vd-prijs-waarde">{optie.vanaf}</strong>
                            <button className="vd-cta-btn" onClick={vraagBeschikbaarheid}>
                                Vraag beschikbaarheid aan
                            </button>
                            <p className="vd-prijs-note">Persoonlijk antwoord binnen 24 uur.</p>
                        </div>
                    </aside>
                </div>
            </section>

            {/* Galerij */}
            {rest.length > 0 && (
                <section className="vd-galerij reveal-section" ref={addRef}>
                    <div className="vd-inner">
                        <h2 className="vd-section-title">Foto&apos;s</h2>
                        <div className="vd-galerij-grid">
                            {rest.map((img) => (
                                <div key={img.src} className="vd-galerij-item">
                                    <img src={img.src} alt={img.alt} loading="lazy" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA onderaan */}
            <section className="vd-onderaan-cta reveal-section" ref={addRef}>
                <div className="vd-inner vd-onderaan-cta-inner">
                    <div>
                        <h2>Interesse in {optie.titel.toLowerCase()}?</h2>
                        <p>Vul het formulier in en we nemen binnen 24 uur contact met je op.</p>
                    </div>
                    <button className="vd-cta-btn" onClick={vraagBeschikbaarheid}>
                        Vraag beschikbaarheid aan
                    </button>
                </div>
            </section>
        </main>
    );
};

export default VerblijfDetail;
