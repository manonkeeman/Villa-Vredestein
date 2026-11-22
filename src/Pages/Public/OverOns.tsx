import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "./OverOns.css";

import ImgChineseMuur from "../../Assets/Images/life-chinese-muur.jpg";
import ImgKLMStraalmotor from "../../Assets/Images/life-klm-straalmotor.jpg";
import ImgWaterval from "../../Assets/Images/life-waterval.jpg";
import ImgSuburban from "../../Assets/Images/Maxim_Manon_ChevroletSuburban.jpg";
import CarpeDiemVideo from "../../Assets/Videos/carpe-diem.mp4";
import ImgCafeRacerStaand from "../../Assets/Images/life-carpediem-cafe-racer.jpg";
import ImgCarpeDiemTekening from "../../Assets/Images/life-carpediem-tekening.jpg";
import ImgBezoek from "../../Assets/Images/BezoekOnsVillaVredestein.jpg";
import ImgManonIT from "../../Assets/Images/manonit-portrait.webp";
import { useContent } from "../../i18n/content";

interface Section {
    slug: string;
    img: string;
    imgAlt: string;
    theme: string;
    accent: string;
    pullQuote: string;
    extraImages?: { src: string; alt: string; ar: number; pos?: string }[];
    video?: string;
    showAll?: boolean;
    tallExtras?: boolean;
    imgContain?: boolean;
    links?: { href: string; label?: string }[];
}

const SECTIONS: Section[] = [
    {
        slug: "over-ons",
        img: ImgChineseMuur,
        imgAlt: "Manon & Maxim op de Chinese Muur",
        theme: "dark",
        accent: "#FCBC2D",
        pullQuote: "Verre horizonten en een stevige basis. Dat is wat ze samen bouwen.",
        extraImages: [
            { src: ImgWaterval, alt: "Manon & Maxim lachend bij een waterval", ar: 4 / 3 },
            { src: ImgKLMStraalmotor, alt: "Manon & Maxim in KLM-uniform voor een straalmotor", ar: 1273 / 1592 },
            { src: ImgSuburban, alt: "Manon & Maxim bij hun Chevrolet Suburban", ar: 1, pos: "50% 45%" },
        ],
    },
    {
        slug: "carpe-diem-design",
        img: ImgCarpeDiemTekening,
        imgAlt: "Carpe Diem, handgetekend",
        video: CarpeDiemVideo,
        theme: "dark",
        accent: "#e0853a",
        showAll: true,
        tallExtras: true,
        pullQuote: "Bring worlds together in one.",
        links: [
            { href: "https://carpediem-website.netlify.app/", label: "Bekijk Carpe Diem →" },
        ],
        extraImages: [
            { src: ImgCarpeDiemTekening, alt: "Carpe Diem, handgetekend", ar: 3024 / 4032, pos: "center" },
            { src: ImgCafeRacerStaand, alt: "Maxims cafe racer", ar: 828 / 1472, pos: "center" },
        ],
    },
    {
        slug: "manonit",
        img: ImgManonIT,
        imgAlt: "Manon Keeman, schrijft en bouwt verhalen",
        theme: "dark",
        accent: "#FCBC2D",
        showAll: true,
        pullQuote: "Geen twee rechterhanden, maar wel een verhaal te vertellen.",
        links: [
            { href: "https://www.manonit.com", label: "Bekijk ManonIT →" },
            { href: "https://www.casacrew.nl", label: "Bekijk CasaCrew →" },
        ],
    },
    {
        slug: "bezoek-inspiratie",
        img: ImgBezoek,
        imgAlt: "Bezoek Villa Vredestein",
        theme: "light",
        accent: "#b89a5e",
        pullQuote: "Villa Vredestein is meer dan een adres. Het is een open deur.",
    },
];

const PREVIEW_PARAGRAPHS = 2;

type Media = { kind: "img" | "video"; src: string; alt: string; poster?: string };

const mediaFor = (sec: Section): Media[] => {
    const list: Media[] = [];
    if (sec.video) list.push({ kind: "video", src: sec.video, alt: sec.imgAlt, poster: sec.img });
    else list.push({ kind: "img", src: sec.img, alt: sec.imgAlt });
    (sec.extraImages || []).forEach((e) => {
        if (e.src !== sec.img && !list.some((m) => m.src === e.src)) list.push({ kind: "img", src: e.src, alt: e.alt });
    });
    return list;
};

const OverOns = () => {
    const tc = useContent();
    const { t, i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";
    const navigate = useNavigate();
    const blogs = t("blogs", { returnObjects: true });
    const [reduceMotion] = useState(
        () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    );
    const [active, setActive] = useState<string>(SECTIONS[0].slug);
    const [photo, setPhoto] = useState<Record<string, number>>({});
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [zoom, setZoom] = useState<Media | null>(null);

    const getBlog = (slug: string) => (Array.isArray(blogs) ? blogs.find((b) => b.slug === slug) : null);

    // Tab volgt de URL-hash, zodat een tab te delen is (bijv. /verhaal#manonit)
    useEffect(() => {
        const fromHash = () => {
            const h = window.location.hash.replace("#", "");
            if (SECTIONS.some((x) => x.slug === h)) setActive(h);
        };
        fromHash();
        window.addEventListener("hashchange", fromHash);
        return () => window.removeEventListener("hashchange", fromHash);
    }, []);

    useEffect(() => {
        if (!zoom) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [zoom]);

    const select = (slug: string) => {
        setActive(slug);
        try { window.history.replaceState(null, "", `#${slug}`); } catch { /* ignore */ }
    };
    const onTabKey = (e: React.KeyboardEvent, i: number) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const n = (i + (e.key === "ArrowRight" ? 1 : -1) + SECTIONS.length) % SECTIONS.length;
        select(SECTIONS[n].slug);
        document.getElementById(`oo-tab-${SECTIONS[n].slug}`)?.focus();
    };

    const aboutSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AboutPage",
                "@id": "https://villavredestein.com/verhaal#page",
                "url": "https://villavredestein.com/verhaal",
                "name": "Over ons, Villa Vredestein",
                "description": "De mensen achter Villa Vredestein: het verhaal van Manon & Maxim, Project Carpe Diem en ManonIT.",
                "inLanguage": langCode,
                "isPartOf": { "@id": "https://villavredestein.com/#website" },
                "about": { "@id": "https://villavredestein.com/#business" },
                "mainEntity": [
                    { "@id": "https://villavredestein.com/verhaal#manon" },
                    { "@id": "https://villavredestein.com/verhaal#maxim" },
                ],
            },
            {
                "@type": "Person",
                "@id": "https://villavredestein.com/verhaal#manon",
                "name": "Manon Keeman",
                "description": "Mede-eigenaar van Villa Vredestein en oprichter van ManonIT, een webdesign- en ontwikkelbedrijf.",
                "worksFor": { "@type": "Organization", "name": "ManonIT", "url": "https://www.manonit.com" },
                "affiliation": { "@id": "https://villavredestein.com/#business" },
                "sameAs": ["https://www.manonit.com", "https://www.casacrew.nl"],
            },
            {
                "@type": "Person",
                "@id": "https://villavredestein.com/verhaal#maxim",
                "name": "Maxim Staal",
                "description": "Mede-eigenaar van Villa Vredestein, intercontinentaal piloot en oprichter van Project Carpe Diem.",
                "affiliation": { "@id": "https://villavredestein.com/#business" },
            },
        ],
    });

    return (
        <main className="over-ons-page">
            <Helmet>
                <html lang={langCode} />
                <title>{tc("Over ons, Villa Vredestein")}</title>
                <meta
                    name="description"
                    content={tc("De mensen achter Villa Vredestein. Het verhaal van Manon & Maxim, Carpe Diem Design en de open deur voor bezoekers en gelijkgestemden.")}
                />
                <link rel="canonical" href="https://villavredestein.com/verhaal" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.com/verhaal" />
                <meta property="og:title" content={tc("Over ons, Villa Vredestein")} />
                <meta property="og:description" content={tc("De mensen achter Villa Vredestein. Het verhaal van Manon & Maxim, Carpe Diem Design en de open deur voor bezoekers.")} />
                <meta property="og:image" content="https://villavredestein.com/og-image.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:alt" content={tc("Villa Vredestein, historische villa uit 1905 in Driebergen-Rijsenburg")} />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={tc("Over ons, Villa Vredestein")} />
                <meta name="twitter:description" content={tc("De mensen achter Villa Vredestein. Het verhaal van Manon & Maxim, Carpe Diem Design en de open deur voor bezoekers.")} />
                <meta name="twitter:image" content="https://villavredestein.com/og-image.jpg" />
                <script type="application/ld+json">{aboutSchema}</script>
            </Helmet>

            <h1 className="oo-sr">{tc("De mensen achter de villa")}</h1>

            {/* Tabs */}
            <div className="oo-tabs-wrap">
                <div className="oo-tabs" role="tablist" aria-label={tc("Secties")}>
                    {SECTIONS.map((sec, i) => {
                        const blog = getBlog(sec.slug);
                        return (
                            <button
                                key={sec.slug}
                                id={`oo-tab-${sec.slug}`}
                                role="tab"
                                aria-selected={active === sec.slug}
                                aria-controls={`oo-panel-${sec.slug}`}
                                tabIndex={active === sec.slug ? 0 : -1}
                                className={`oo-tab${active === sec.slug ? " is-active" : ""}`}
                                style={{ "--accent": sec.accent } as React.CSSProperties}
                                onClick={() => select(sec.slug)}
                                onKeyDown={(e) => onTabKey(e, i)}
                            >
                                <img src={sec.img} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                                <span>{tc(blog?.title || sec.slug)}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Panelen: alleen het actieve is zichtbaar; alle tekst blijft voor zoekmachines in de pagina */}
            <div className="oo-panels">
                {SECTIONS.map((sec, i) => {
                    const blog = getBlog(sec.slug);
                    if (!blog) return null;
                    const media = mediaFor(sec);
                    const cur = Math.min(photo[sec.slug] ?? 0, media.length - 1);
                    const m = media[cur];
                    const paragraphs: string[] = Array.isArray(blog.content) ? blog.content : [];
                    const open = expanded[sec.slug];
                    const shown = open ? paragraphs : paragraphs.slice(0, PREVIEW_PARAGRAPHS);
                    const next = SECTIONS[(i + 1) % SECTIONS.length];
                    const nextBlog = getBlog(next.slug);
                    return (
                        <section
                            key={sec.slug}
                            id={`oo-panel-${sec.slug}`}
                            role="tabpanel"
                            aria-labelledby={`oo-tab-${sec.slug}`}
                            hidden={active !== sec.slug}
                            className="oo-panel"
                            style={{ "--accent": sec.accent } as React.CSSProperties}
                        >
                            <div className="oo-media">
                                <div className="oo-stage">
                                    {m.kind === "video" ? (
                                        <video
                                            key={m.src}
                                            src={m.src}
                                            autoPlay={!reduceMotion}
                                            controls={reduceMotion}
                                            muted
                                            loop
                                            playsInline
                                            preload="metadata"
                                            poster={m.poster}
                                            aria-label={tc(m.alt)}
                                        />
                                    ) : (
                                        <button className="oo-zoom" onClick={() => setZoom(m)} aria-label={`${tc("Vergroot foto")}: ${tc(m.alt)}`}>
                                            <img key={m.src} src={m.src} alt={tc(m.alt)} />
                                            <span className="oo-zoom-icon" aria-hidden="true">⤢</span>
                                        </button>
                                    )}
                                </div>
                                {media.length > 1 && (
                                    <div className="oo-thumbs" role="group" aria-label={tc("Foto's")}>
                                        {media.map((x, k) => (
                                            <button
                                                key={x.src}
                                                className={`oo-thumb${k === cur ? " is-active" : ""}`}
                                                onClick={() => setPhoto((p) => ({ ...p, [sec.slug]: k }))}
                                                aria-label={tc(x.alt)}
                                                aria-pressed={k === cur}
                                            >
                                                <img src={x.kind === "video" ? x.poster : x.src} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                                                {x.kind === "video" && <span className="oo-thumb-play" aria-hidden="true">▶</span>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="oo-copy">
                                <h2>{tc(blog.title)}</h2>
                                <blockquote className="oo-quote">{tc(sec.pullQuote)}</blockquote>
                                <div className="oo-text">
                                    {shown.map((paragraph, j) => <p key={j}>{tc(paragraph)}</p>)}
                                </div>
                                {paragraphs.length > PREVIEW_PARAGRAPHS && !sec.showAll && (
                                    <button className="oo-more" onClick={() => setExpanded((e) => ({ ...e, [sec.slug]: !e[sec.slug] }))} aria-expanded={!!open}>
                                        {open ? tc("Tekst inklappen ↑") : tc("Tekst uitklappen ↓")}
                                    </button>
                                )}
                                {Array.isArray(sec.links) && sec.links.length > 0 && (
                                    <div className="oo-links">
                                        {sec.links.map((l) => (
                                            <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{tc(l.label || l.href)}</a>
                                        ))}
                                    </div>
                                )}
                                <button className="oo-next" onClick={() => select(next.slug)}>
                                    {tc("Volgende")}: {tc(nextBlog?.title || next.slug)} →
                                </button>
                            </div>
                        </section>
                    );
                })}
            </div>

            {zoom && zoom.kind === "img" && (
                <div className="oo-lightbox" role="dialog" aria-modal="true" aria-label={tc(zoom.alt)} onClick={() => setZoom(null)}>
                    <button className="oo-lightbox-close" onClick={() => setZoom(null)} aria-label={tc("Sluiten")}>✕</button>
                    <img src={zoom.src} alt={tc(zoom.alt)} onClick={(e) => e.stopPropagation()} />
                </div>
            )}

            {/* Compacte afsluiting */}
            <section className="oo-cta">
                <h2>{tc("Zin om kennis te maken?")}</h2>
                <div className="oo-cta-buttons">
                    <button className="oo-cta-primary" onClick={() => navigate("/contact")}>{tc("Neem contact op")}</button>
                    <button className="oo-cta-secondary" onClick={() => navigate("/tijdlijn")}>{tc("Bekijk de tijdlijn")}</button>
                </div>
            </section>
        </main>
    );
};

export default OverOns;
