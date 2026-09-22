import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CATEGORIEEN, FOTOS } from "../../Data/galerijFotos";
import "./GalerijVilla.css";

const GalerijVilla = () => {
    const { i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";

    const aantal = (label: string) => FOTOS.filter((f) => f.cat === label).length;

    const galerijSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Galerij & Historisch Archief, Villa Vredestein",
        "url": "https://villavredestein.com/galerij",
        "hasPart": CATEGORIEEN.map((c) => ({
            "@type": "ImageGallery",
            "name": c.label,
            "url": `https://villavredestein.com/galerij/${c.slug}`,
        })),
    });

    return (
        <main className="galerij-villa-page">
            <Helmet>
                <html lang={langCode} />
                <title>Galerij & Historisch Archief, Villa Vredestein</title>
                <meta
                    name="description"
                    content="Fotogalerij en historisch archief van Villa Vredestein: samenleven, ansichtkaarten, geschiedenis, plattegrond en de verbouwing."
                />
                <link rel="canonical" href="https://villavredestein.com/galerij" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.com/galerij" />
                <meta property="og:title" content="Galerij & Historisch Archief, Villa Vredestein" />
                <meta property="og:description" content="Fotogalerij en historisch archief van Villa Vredestein. Ansichtkaarten, plattegronden, de verbouwing en een eeuw geschiedenis." />
                <meta property="og:image" content="https://villavredestein.com/og-image.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:alt" content="Villa Vredestein, historische villa uit 1906 in Driebergen-Rijsenburg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Galerij & Historisch Archief, Villa Vredestein" />
                <meta name="twitter:description" content="Fotogalerij en historisch archief van Villa Vredestein. Ansichtkaarten, plattegronden, de verbouwing en een eeuw geschiedenis." />
                <meta name="twitter:image" content="https://villavredestein.com/og-image.jpg" />
                <script type="application/ld+json">{galerijSchema}</script>
            </Helmet>

            <header className="gv-header">
                <h1>De villa in beeld</h1>
                <p>Van kroonluchter tot krantenartikel. Kies een categorie om alle foto's te bekijken.</p>
            </header>

            <div className="gv-overzicht" role="list">
                {CATEGORIEEN.map((c) => (
                    <Link key={c.slug} to={`/galerij/${c.slug}`} className="gv-cat-tile" role="listitem">
                        <div className="gv-cat-tile-img-wrap">
                            <img src={c.cover} alt={c.label} loading="lazy" decoding="async" />
                            <div className="gv-cat-tile-overlay" aria-hidden="true" />
                        </div>
                        <div className="gv-cat-tile-body">
                            <h2>{c.label}</h2>
                            <span className="gv-cat-tile-count">{aantal(c.label)} foto's</span>
                            <p>{c.intro}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
};

export default GalerijVilla;
