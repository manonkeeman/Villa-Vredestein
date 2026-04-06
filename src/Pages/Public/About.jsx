import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import "./About.css";

import Villa1 from "../../Assets/Images/VillaVredestein2024.jpg";
import Villa2 from "../../Assets/Images/VillaVredestein1910.jpg";
import Villa3 from "../../Assets/Images/VillaVredesteinRestauratie.jpg";
import Villa6 from "../../Assets/Images/DeOmgevingVillaVredestein.jpg";
import Villa8 from "../../Assets/Images/Maxim_Manon_ChevroletSuburban.jpg";
import Villa9 from "../../Assets/Images/BezoekOnsVillaVredestein.jpg";

const imageMap = {
    "villa-vredestein": Villa1,
    "geschiedenis": Villa2,
    "restauratie": Villa3,
    "omgeving": Villa6,
    "over-ons": Villa8,
    "bezoek-inspiratie": Villa9,
};

const About = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";

    const blogs = t("blogs", { returnObjects: true });

    return (
        <main className="about-page">
            <Helmet>
                <html lang={langCode} />
                <title>{t("about.title")} — Villa Vredestein</title>
                <meta
                    name="description"
                    content="Ontdek de verhalen achter Villa Vredestein: de geschiedenis, restauratie, omgeving en de mensen achter dit bijzondere woonproject in Driebergen."
                />
                <link rel="canonical" href="https://villavredestein.nl/about" />
                <meta property="og:title" content={`${t("about.title")} — Villa Vredestein`} />
                <meta property="og:description" content="Ontdek de verhalen achter Villa Vredestein: de geschiedenis, restauratie, omgeving en de mensen achter dit bijzondere woonproject in Driebergen." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl/about" />
                <meta property="og:image" content="https://villavredestein.nl/og-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${t("about.title")} — Villa Vredestein`} />
                <meta name="twitter:description" content="Ontdek de verhalen achter Villa Vredestein: de geschiedenis, restauratie, omgeving en de mensen achter dit bijzondere woonproject in Driebergen." />
                <meta name="twitter:image" content="https://villavredestein.nl/og-image.jpg" />
            </Helmet>

            <header>
                <h1 className="about-title">{t("about.title")}</h1>
            </header>

            <section
                className="about-grid"
                aria-label={t("about.title")}
            >
                {Array.isArray(blogs) && blogs.map((blog) => {
                    const image = imageMap[blog.slug];
                    return (
                        <article
                            key={blog.slug}
                            className="blog-card"
                            onClick={() => navigate(`/blog/${blog.slug}`)}
                            role="button"
                            tabIndex={0}
                            aria-label={blog.title}
                            onKeyDown={(e) => e.key === "Enter" && navigate(`/blog/${blog.slug}`)}
                        >
                            {image && (
                                <div
                                    className="blog-card-image"
                                    style={{ backgroundImage: `url(${image})` }}
                                    aria-hidden="true"
                                />
                            )}
                            <div className="blog-card-content">
                                <h2>{blog.title}</h2>
                                <p>{blog.summary}</p>
                                <div className="blog-card-meta">
                                    <span>{blog.date}</span>
                                    <span>{blog.readTime} {t("about.readTime")}</span>
                                </div>
                                <span className="blog-card-cta" aria-hidden="true">
                                    {t("about.readMore")} →
                                </span>
                            </div>
                        </article>
                    );
                })}
            </section>
        </main>
    );
};

export default About;