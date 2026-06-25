import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import Button from "../../Components/Buttons/Button";
import "./Blog.css";

import Villa1 from "../../Assets/Images/VillaVredestein2024.jpg";
import Villa2 from "../../Assets/Images/VillaVredestein1910.jpg";
import Villa3 from "../../Assets/Images/VillaVredesteinRestauratie.jpg";
import Villa6 from "../../Assets/Images/DeOmgevingVillaVredestein.jpg";
import Villa7 from "../../Assets/Images/PannenkoekenAvondVillaVredestein.jpg";
import Villa8 from "../../Assets/Images/Maxim_Manon_ChevroletSuburban.jpg";
import LuchtballonImg from "../../Assets/Images/ext-luchtballon.png";
import Villa9 from "../../Assets/Images/BezoekOnsVillaVredestein.jpg";
import CarpeDiemVideo from "../../Assets/Videos/carpe-diem.mp4";
import CafeRacer1 from "../../Assets/Images/cafe-racer-1.jpg";

const imageMap = {
    "villa-vredestein": Villa1,
    "geschiedenis": Villa2,
    "restauratie": Villa3,
    "omgeving": Villa6,
    "carpe-diem-design": Villa7,
    "over-ons": LuchtballonImg,
    "bezoek-inspiratie": Villa9,
};

const videoMap: Record<string, string> = {
    "carpe-diem-design": CarpeDiemVideo,
};

const inlineMediaMap: Record<string, { afterParagraph: number; src: string; alt: string }[]> = {
    "carpe-diem-design": [
        { afterParagraph: 2, src: CafeRacer1, alt: "De cafe racer van Maxim, gebouwd van onderdelen uit de hele wereld" },
    ],
};

const Blog = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const blogs = t("blogs", { returnObjects: true });
    const blog = Array.isArray(blogs) ? blogs.find((b) => b.slug === slug) : null;
    const image = imageMap[slug];

    if (!blog) {
        return (
            <main className="blog-page">
                <div className="blog-not-found">
                    <h1>{t("about.back")}</h1>
                    <Button text={t("about.back")} variant="primary" onClick={() => navigate(-1 as any)} />
                </div>
            </main>
        );
    }

    const langCode = i18n.language?.split("-")[0] || "nl";
    const canonicalUrl = `https://villavredestein.nl/blog/${slug}`;
    const ogImage = `https://villavredestein.nl/og-image.jpg`;
    const video = videoMap[slug] || null;
    const inlineMedia = inlineMediaMap[slug] || [];

    const articleSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": blog.title,
        "description": blog.summary,
        "datePublished": blog.date,
        "author": { "@type": "Person", "name": "Manon Keeman" },
        "publisher": {
            "@type": "Organization",
            "name": "Villa Vredestein",
            "logo": { "@type": "ImageObject", "url": "https://villavredestein.nl/VVLogo.png" }
        },
        "url": canonicalUrl,
        "image": ogImage,
        "mainEntityOfPage": canonicalUrl
    });

    return (
        <main className="blog-page" role="main">
            <Helmet>
                <html lang={langCode} />
                <title>{blog.title}, Villa Vredestein</title>
                <meta name="description" content={blog.summary} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={`${blog.title}, Villa Vredestein`} />
                <meta property="og:description" content={blog.summary} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="article:published_time" content={blog.date} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${blog.title}, Villa Vredestein`} />
                <meta name="twitter:description" content={blog.summary} />
                <meta name="twitter:image" content={ogImage} />
                <script type="application/ld+json">{articleSchema}</script>
            </Helmet>

            <article className="blog-article">
                <header className="blog-header">
                    <button
                        className="blog-back-btn"
                        onClick={() => navigate(-1 as any)}
                        aria-label={t("about.back")}
                    >
                        {t("about.back")}
                    </button>
                    <h1 className="blog-title">{blog.title}</h1>
                    <div className="blog-meta">
                        <time dateTime={blog.date}>{t("about.published")} {blog.date}</time>
                        <span aria-hidden="true"> · </span>
                        <span>{blog.readTime} {t("about.readTime")}</span>
                    </div>
                </header>

                {video ? (
                    <figure className="blog-hero">
                        <video
                            src={video}
                            className="blog-hero-img"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            poster={image}
                            aria-label={blog.title}
                        />
                    </figure>
                ) : image ? (
                    <figure className="blog-hero">
                        <img src={image} alt={blog.title} className="blog-hero-img" loading="lazy" />
                    </figure>
                ) : null}

                <div className="blog-body">
                    {Array.isArray(blog.content) && blog.content.map((paragraph, i) => (
                        <React.Fragment key={i}>
                            <p>{paragraph}</p>
                            {inlineMedia.filter((m) => m.afterParagraph === i).map((m, j) => (
                                <figure key={j} className="blog-inline-media">
                                    <img src={m.src} alt={m.alt} loading="lazy" />
                                </figure>
                            ))}
                        </React.Fragment>
                    ))}
                </div>

                <footer className="blog-footer">
                    <Button
                        text={t("about.back")}
                        variant="primary"
                        onClick={() => navigate(-1 as any)}
                    />
                </footer>
            </article>
        </main>
    );
};

export default Blog;