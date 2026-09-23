import { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CATEGORIEEN, FOTOS } from "../../Data/galerijFotos";
import NotFound from "./NotFound";
import "./GalerijVilla.css";

const GalerijCategorie = () => {
    const { i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";
    const { categorie } = useParams<{ categorie: string }>();
    const [lightbox, setLightbox] = useState<number | null>(null);
    const lightboxRef = useRef<HTMLDivElement>(null);
    const prevFocusRef = useRef<HTMLElement | null>(null);

    const cat = CATEGORIEEN.find((c) => c.slug === categorie);
    const fotos = cat ? FOTOS.filter((f) => f.cat === cat.label) : [];

    const open = useCallback((i: number) => {
        prevFocusRef.current = document.activeElement as HTMLElement;
        setLightbox(i);
        document.body.style.overflow = "hidden";
    }, []);

    const close = useCallback(() => {
        setLightbox(null);
        document.body.style.overflow = "";
        prevFocusRef.current?.focus();
    }, []);

    const prev = useCallback(() => setLightbox((i) => ((i ?? 0) - 1 + fotos.length) % fotos.length), [fotos.length]);
    const next = useCallback(() => setLightbox((i) => ((i ?? 0) + 1) % fotos.length), [fotos.length]);

    useEffect(() => {
        if (lightbox === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next();
            else if (e.key === "ArrowLeft") prev();
            else if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightbox, next, prev, close]);

    useEffect(() => { if (lightbox !== null) lightboxRef.current?.focus(); }, [lightbox]);

    useEffect(() => { setLightbox(null); }, [categorie]);

    if (!cat) return <NotFound />;

    const foto = lightbox !== null ? fotos[lightbox] : null;
    const canonicalUrl = `https://villavredestein.com/galerij/${cat.slug}`;

    return (
        <main className="galerij-villa-page">
            <Helmet>
                <html lang={langCode} />
                <title>{cat.label}, Galerij Villa Vredestein</title>
                <meta name="description" content={cat.intro} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={`${cat.label}, Galerij Villa Vredestein`} />
                <meta property="og:description" content={cat.intro} />
                <meta property="og:image" content="https://villavredestein.com/og-image.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:alt" content="Villa Vredestein, historische villa uit 1906 in Driebergen-Rijsenburg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${cat.label}, Galerij Villa Vredestein`} />
                <meta name="twitter:description" content={cat.intro} />
                <meta name="twitter:image" content="https://villavredestein.com/og-image.jpg" />
            </Helmet>

            <header className="gv-header">
                <Link to="/galerij" className="gv-back-link">← Alle categorieën</Link>
                <h1>{cat.label}</h1>
                <p>{cat.intro}</p>
            </header>

            <nav className="gv-filter" aria-label="Andere categorieën">
                {CATEGORIEEN.map((c) => (
                    <Link
                        key={c.slug}
                        to={`/galerij/${c.slug}`}
                        className={`gv-filter-btn ${c.slug === cat.slug ? "active" : ""}`}
                        aria-current={c.slug === cat.slug ? "page" : undefined}
                    >
                        {c.label}
                    </Link>
                ))}
            </nav>

            <div className="gv-grid" role="list">
                {fotos.map((f, i) => (
                    <article
                        key={`${f.src}-${i}`}
                        className="gv-item"
                        role="listitem"
                        onClick={() => open(i)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open(i)}
                        tabIndex={0}
                        aria-label={`${f.caption}, klik om te vergroten`}
                    >
                        <div className="gv-img-wrap">
                            <img src={f.src} alt={f.caption} loading="lazy" decoding="async" />
                            <div className="gv-overlay" aria-hidden="true">
                                <span className="gv-cat">{f.cat}</span>
                                <p className="gv-caption">{f.caption}</p>
                                <span className="gv-zoom">⊕</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {foto && (
                <div
                    className="gvlb-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Foto: ${foto.caption}`}
                    onClick={(e) => e.target === e.currentTarget && close()}
                >
                    <div className="gvlb-box" ref={lightboxRef} tabIndex={-1}>
                        <button className="gvlb-close" onClick={close} aria-label="Sluiten">✕</button>
                        <div className="gvlb-img-wrap">
                            <img src={foto.src} alt={foto.caption} className="gvlb-img" />
                        </div>
                        <div className="gvlb-info">
                            <span className="gvlb-cat">{foto.cat}</span>
                            <h2 className="gvlb-caption">{foto.caption}</h2>
                            <p className="gvlb-sub">{foto.sub}</p>
                            {foto.verhaal && <p className="gvlb-verhaal">{foto.verhaal}</p>}
                        </div>
                        <button className="gvlb-nav gvlb-prev" onClick={prev} aria-label="Vorige">‹</button>
                        <button className="gvlb-nav gvlb-next" onClick={next} aria-label="Volgende">›</button>
                        <div className="gvlb-counter" aria-live="polite">
                            {(lightbox ?? 0) + 1} / {fotos.length}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default GalerijCategorie;
