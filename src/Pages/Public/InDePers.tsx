import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "./InDePers.css";

import PersAdFoto from "../../Assets/Images/pers-ad-foto.jpeg";
import PersAdArtikel from "../../Assets/Images/pers-ad-artikel.jpeg";

const PERS_ITEMS = [
    {
        medium: "Algemeen Dagblad",
        sectie: "GELD",
        datum: "2024",
        kop: "Motorfiets van onderdelen uit de hele wereld",
        samenvatting: "Maxim Staal (49), piloot uit Driebergen, tilt het repareren naar een hoger niveau. Als piloot reist hij de wereld over en neemt hij overal onderdelen mee. Een zadel uit Bogota, een tank uit Kuala Lumpur, onderdelen uit Shanghai.",
        url: null,
        tag: "Nationaal",
        imgs: [PersAdFoto, PersAdArtikel],
    },
];

const InDePers = () => {
    const navigate = useNavigate();
    const cardRefs = useRef([]);
    const [lightbox, setLightbox] = useState<{ src: string; index: number } | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("idp-visible"); }),
            { threshold: 0.1 }
        );
        cardRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
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

            {/* Persartikelen */}
            <section className="idp-articles-section" aria-label="Persberichten">
                {PERS_ITEMS.map((item, i) => (
                    <article
                        key={i}
                        className="idp-article idp-reveal"
                        ref={(el) => (cardRefs.current[i] = el)}
                    >
                        {/* Foto's */}
                        {item.imgs && item.imgs.length > 0 && (
                            <div className="idp-imgs">
                                {item.imgs.map((src, j) => (
                                    <button
                                        key={j}
                                        className="idp-img-btn"
                                        onClick={() => setLightbox({ src, index: j })}
                                        aria-label={`Bekijk afbeelding ${j + 1} van ${item.kop}`}
                                    >
                                        <img
                                            src={src}
                                            alt={j === 0 ? `Foto bij: ${item.kop}` : `Artikel: ${item.kop}`}
                                            className="idp-img"
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Tekst */}
                        <div className="idp-article-body">
                            <div className="idp-meta-row">
                                <span className="idp-tag">{item.tag}</span>
                                {item.sectie && <span className="idp-sectie">{item.sectie}</span>}
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
                        </div>
                    </article>
                ))}
            </section>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="idp-lightbox"
                    onClick={() => setLightbox(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Afbeelding vergroot"
                >
                    <button className="idp-lightbox-close" onClick={() => setLightbox(null)} aria-label="Sluiten">
                        ✕
                    </button>
                    <img
                        src={lightbox.src}
                        alt="Persartikel vergroot"
                        className="idp-lightbox-img"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* CTA */}
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
