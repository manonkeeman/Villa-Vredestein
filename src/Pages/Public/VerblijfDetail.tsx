import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { OPTIES } from "../../Data/verblijfOpties";
import NotFound from "./NotFound";
import "./VerblijfDetail.css";
import { useContent } from "../../i18n/content";

const VerblijfDetail = () => {
    const tc = useContent();
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

    if (!optie) return <NotFound />;

    const canonicalUrl = `https://villavredestein.com/verblijven/${optie.id}`;
    const [hero, ...rest] = optie.afbeeldingen;

    const vraagBeschikbaarheid = () => {
        navigate("/verblijven", { state: { optie: optie.id, scrollTo: "formulier" } });
    };

    return (
        <main className="vd-page">
            <Helmet>
                <html lang={langCode} />
                <title>{`${tc(optie.titel)}, ${tc("Verblijven")}, Villa Vredestein`}</title>
                <meta name="description" content={tc(optie.beschrijving)} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={`${tc(optie.titel)}, Villa Vredestein`} />
                <meta property="og:description" content={tc(optie.beschrijving)} />
                <meta property="og:image" content={hero.src} />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${tc(optie.titel)}, Villa Vredestein`} />
                <meta name="twitter:description" content={tc(optie.beschrijving)} />
                <meta name="twitter:image" content={hero.src} />
            </Helmet>

            {/* Hero */}
            <header className="vd-hero">
                <div
                    className="vd-hero-bg"
                    style={{ backgroundImage: `url(${hero.src})`, backgroundPosition: hero.pos || "center" }}
                />
                <div className="vd-hero-overlay" />
                <div className="vd-hero-content">
                    <Link to="/verblijven" className="vd-back">{tc("← Alle verblijfsopties")}</Link>
                    <span className="vd-eyebrow">{tc(optie.icon)} {tc(optie.sub)}</span>
                    <h1>{tc(optie.titel)}</h1>
                    <p>{tc(optie.beschrijving)}</p>
                </div>
            </header>

            {/* Inhoud */}
            <section className="vd-body reveal-section" ref={addRef}>
                <div className="vd-inner vd-body-grid">
                    <div className="vd-tekst">
                        <h2 className="vd-section-title">{tc("Over dit verblijf")}</h2>
                        {optie.langeBeschrijving.map((p, i) => (
                            <p key={i}>{tc(p)}</p>
                        ))}

                        <h3 className="vd-kenmerken-titel">{tc("Wat is inbegrepen")}</h3>
                        <ul className="vd-kenmerken">
                            {optie.kenmerken.map((k) => (
                                <li key={k}>
                                    <span aria-hidden="true">✓</span> {tc(k)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <aside className="vd-sidebar">
                        <div className="vd-prijs-kaart">
                            <span className="vd-prijs-label">{tc("Prijs")}</span>
                            <strong className="vd-prijs-waarde">{tc(optie.vanaf)}</strong>
                            <button className="vd-cta-btn" onClick={vraagBeschikbaarheid}>
                                {tc("Vraag beschikbaarheid aan")}
                            </button>
                            <p className="vd-prijs-note">{tc("Persoonlijk antwoord binnen 24 uur.")}</p>
                        </div>
                    </aside>
                </div>
            </section>

            {/* Galerij */}
            {rest.length > 0 && (
                <section className="vd-galerij reveal-section" ref={addRef}>
                    <div className="vd-inner">
                        <h2 className="vd-section-title">{tc("Foto's")}</h2>
                        <div className="vd-galerij-grid">
                            {rest.map((img) => (
                                <div key={img.src} className="vd-galerij-item">
                                    <img
                                        src={img.src}
                                        alt={tc(img.alt)}
                                        loading="lazy"
                                        style={img.pos ? { objectPosition: img.pos } : undefined}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
};

export default VerblijfDetail;
