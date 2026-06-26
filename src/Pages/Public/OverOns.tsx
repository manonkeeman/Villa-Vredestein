import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "./OverOns.css";

import ImgManonMaxim from "../../Assets/Images/Maxim_Manon_ChevroletSuburban.jpg";
import LuchtballonImg from "../../Assets/Images/ext-luchtballon.png";
import ImgCarpeDiem from "../../Assets/Images/PannenkoekenAvondVillaVredestein.jpg";
import CarpeDiemVideo from "../../Assets/Videos/carpe-diem.mp4";
import ImgBezoek from "../../Assets/Images/BezoekOnsVillaVredestein.jpg";
import ImgManonIT from "../../Assets/Images/manonit-og.jpg";

const SECTIONS = [
    {
        slug: "over-ons",
        img: ImgManonMaxim,
        imgAlt: "Manon & Maxim bij hun Chevrolet Suburban",
        theme: "dark",
        accent: "#FCBC2D",
        imgSide: "right",
        pullQuote: "Verre horizonten en een stevige basis. Dat is wat ze samen bouwen.",
    },
    {
        slug: "carpe-diem-design",
        img: ImgCarpeDiem,
        imgAlt: "Carpe Diem Design werkplaats",
        video: CarpeDiemVideo,
        theme: "dark",
        accent: "#e0853a",
        imgSide: "right",
        pullQuote: "Sindsdien is het geen spreuk meer voor hem.",
    },
    {
        slug: "manonit",
        img: ImgManonIT,
        imgAlt: "ManonIT — webdesign en development door Manon Keeman",
        theme: "dark",
        accent: "#FCBC2D",
        imgSide: "left",
        imgContain: true,
        pullQuote: "Van idee vastlopen op uitvoering naar: ik bouw het gewoon zelf.",
        link: "https://www.manonit.com",
        linkLabel: "Bekijk ManonIT.com →",
    },
    {
        slug: "bezoek-inspiratie",
        img: ImgBezoek,
        imgAlt: "Bezoek Villa Vredestein",
        theme: "light",
        accent: "#b89a5e",
        imgSide: "left",
        pullQuote: "Villa Vredestein is meer dan een adres. Het is een open deur.",
    },
];

const PREVIEW_PARAGRAPHS = 2;

const OverOns = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const blogs = t("blogs", { returnObjects: true });
    const sectionRefs = useRef([]);
    const heroRef = useRef(null);
    const [activeSection, setActiveSection] = useState(null);
    const [expanded, setExpanded] = useState({});

    const toggleExpanded = (slug) =>
        setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));

    const getBlog = (slug) => Array.isArray(blogs) ? blogs.find((b) => b.slug === slug) : null;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add("oo-visible");
                        setActiveSection(e.target.dataset.slug);
                    }
                }),
            { threshold: 0.18 }
        );
        if (heroRef.current) observer.observe(heroRef.current);
        sectionRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <main className="over-ons-page">
            <Helmet>
                <title>Ons Verhaal, Villa Vredestein</title>
                <meta
                    name="description"
                    content="De mensen achter Villa Vredestein. Het verhaal van Manon & Maxim, Carpe Diem Design en de open deur voor bezoekers en gelijkgestemden."
                />
                <link rel="canonical" href="https://villavredestein.nl/verhaal" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl/verhaal" />
                <meta property="og:title" content="Ons Verhaal, Villa Vredestein" />
                <meta property="og:description" content="De mensen achter Villa Vredestein. Het verhaal van Manon & Maxim, Carpe Diem Design en de open deur voor bezoekers." />
                <meta property="og:image" content="https://villavredestein.nl/og-image.jpg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Ons Verhaal, Villa Vredestein" />
                <meta name="twitter:description" content="De mensen achter Villa Vredestein. Het verhaal van Manon & Maxim, Carpe Diem Design en de open deur voor bezoekers." />
                <meta name="twitter:image" content="https://villavredestein.nl/og-image.jpg" />
            </Helmet>

            {/* Hero */}
            <header className="oo-hero oo-reveal" ref={heroRef}>
                <div
                    className="oo-hero-bg"
                    style={{ backgroundImage: `url(${LuchtballonImg})` }}
                    role="img"
                    aria-label="Villa Vredestein met luchtballon"
                />
                <div className="oo-hero-overlay" aria-hidden="true" />
                <div className="oo-hero-inner">
                    <span className="oo-hero-eyebrow">Veel verhalen. Één huis.</span>
                    <h1 className="oo-hero-title">De mensen achter de villa</h1>
                    <p className="oo-hero-sub">
                        Manon & Maxim, Carpe Diem Design en een open deur voor iedereen die het wil zien.
                    </p>
                    <div className="oo-hero-scroll" aria-hidden="true">
                        <span>Scroll</span>
                        <div className="oo-scroll-arrow" />
                    </div>
                </div>
            </header>

            {/* Scroll-indicator dots */}
            <nav className="oo-dot-nav" aria-label="Secties">
                {SECTIONS.map((s) => (
                    <button
                        key={s.slug}
                        className={`oo-dot ${activeSection === s.slug ? "active" : ""}`}
                        onClick={() => {
                            const el = sectionRefs.current[SECTIONS.indexOf(s)];
                            el?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        aria-label={getBlog(s.slug)?.title || s.slug}
                        title={getBlog(s.slug)?.title}
                    />
                ))}
            </nav>

            {/* Story sections */}
            {SECTIONS.map((sec, i) => {
                const blog = getBlog(sec.slug);
                if (!blog) return null;

                return (
                    <section
                        key={sec.slug}
                        className={`oo-section oo-section--${sec.imgSide} oo-theme--${sec.theme} oo-reveal${sec.video ? " oo-section--video" : ""}`}
                        ref={(el) => (sectionRefs.current[i] = el)}
                        data-slug={sec.slug}
                        style={{ "--accent": sec.accent }}
                    >
                        {/* Image / Video column */}
                        <div className="oo-img-col">
                            <figure className={`oo-img-wrap${sec.imgContain ? " oo-img-wrap--contain" : ""}`}>
                                {sec.video ? (
                                    <video
                                        src={sec.video}
                                        className="oo-img"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        poster={sec.img}
                                        aria-label={sec.imgAlt}
                                    />
                                ) : (
                                    <img
                                        src={sec.img}
                                        alt={sec.imgAlt}
                                        loading="lazy"
                                        className="oo-img"
                                    />
                                )}
                                <div className="oo-img-overlay" aria-hidden="true" />
                            </figure>
                        </div>

                        {/* Text column */}
                        <div className="oo-text-col">
                            <div className="oo-text-inner">
                                <span className="oo-section-num">0{i + 1}</span>

                                <h2 className="oo-section-title">{blog.title}</h2>

                                <blockquote className="oo-pull-quote">
                                    {sec.pullQuote}
                                </blockquote>

                                <div className="oo-body-text">
                                    {Array.isArray(blog.content) &&
                                        (expanded[sec.slug]
                                            ? blog.content
                                            : blog.content.slice(0, PREVIEW_PARAGRAPHS)
                                        ).map((paragraph, j) => (
                                            <p key={j}>{paragraph}</p>
                                        ))}
                                </div>

                                {Array.isArray(blog.content) && blog.content.length > PREVIEW_PARAGRAPHS && (
                                    <button
                                        className="oo-lees-meer-btn"
                                        onClick={() => toggleExpanded(sec.slug)}
                                        style={{ "--btn-accent": sec.accent }}
                                    >
                                        {expanded[sec.slug] ? "Tekst inklappen ↑" : "Tekst uitklappen ↓"}
                                    </button>
                                )}

                                {sec.link && (
                                    <a
                                        href={sec.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="oo-external-link"
                                        style={{ "--btn-accent": sec.accent }}
                                    >
                                        {sec.linkLabel || sec.link}
                                    </a>
                                )}

                            </div>
                        </div>
                    </section>
                );
            })}

            {/* Call to action */}
            <section className="oo-cta">
                <div className="oo-cta-inner">
                    <h2>Zin om kennis te maken?</h2>
                    <p>
                        Stuur een bericht, kom langs, of volg ons op Instagram. We staan
                        altijd open voor een goed gesprek over Villa Vredestein, over wonen,
                        over dromen en hoe je die werkelijkheid maakt.
                    </p>
                    <div className="oo-cta-buttons">
                        <button className="oo-cta-primary" onClick={() => navigate("/contact")}>
                            Neem contact op
                        </button>
                        <button className="oo-cta-secondary" onClick={() => navigate("/tijdlijn")}>
                            Bekijk de tijdlijn
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default OverOns;
