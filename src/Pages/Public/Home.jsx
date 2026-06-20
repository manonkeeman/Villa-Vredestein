import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import Button from "../../Components/Buttons/Button.jsx";
import "../../Styles/Global.css";
import "./Home.css";
import VillaVredestein from "../../Assets/Images/VillaVredestein.jpg";

const Home = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://snapwidget.com/js/snapwidget.js";
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    return (
        <main className="home" role="main" aria-labelledby="home-title">
            <Helmet>
                <html lang={langCode} />
                <title>Villa Vredestein — Driebergen-Rijsenburg</title>
                <meta
                    name="description"
                    content="Villa Vredestein is een historische villa uit 1906 in Driebergen-Rijsenburg. Ontdek de geschiedenis, restauratie en het unieke woonproject van Manon en Maxim."
                />
                <link rel="canonical" href="https://villavredestein.nl" />
                <meta property="og:title" content="Villa Vredestein — Driebergen-Rijsenburg" />
                <meta
                    property="og:description"
                    content="Villa Vredestein is een historische villa uit 1906 in Driebergen-Rijsenburg. Ontdek de geschiedenis, restauratie en het unieke woonproject van Manon en Maxim."
                />
                <meta property="og:image" content="https://villavredestein.nl/VVLogo.png" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl" />
                <meta name="twitter:card" content="summary_large_image" />
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "LodgingBusiness",
                    "name": "Villa Vredestein",
                    "description": "Historische villa uit 1906 in Driebergen-Rijsenburg",
                    "url": "https://villavredestein.nl",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Hoofdstraat 147",
                        "addressLocality": "Driebergen-Rijsenburg",
                        "postalCode": "3975 ED",
                        "addressCountry": "NL"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": 52.04312,
                        "longitude": 5.28701
                    },
                    "image": "https://villavredestein.nl/VVLogo.png",
                    "telephone": "+31625015299",
                    "sameAs": ["https://www.instagram.com/villa.vredestein"]
                })}</script>
            </Helmet>

            <div className="home-facts">
                <div className="fact-card">
                    <span className="fact-number">1906</span>
                    <span className="fact-label">Bouwjaar</span>
                </div>
                <div className="fact-divider" />
                <div className="fact-card">
                    <span className="fact-number">120</span>
                    <span className="fact-label">Jaar oud</span>
                </div>
                <div className="fact-divider" />
                <div className="fact-card">
                    <span className="fact-number">6</span>
                    <span className="fact-label">Bewoners</span>
                </div>
                <div className="fact-divider" />
                <div className="fact-card">
                    <span className="fact-number">3</span>
                    <span className="fact-label">Kinderen</span>
                </div>
                <div className="fact-divider" />
                <div className="fact-card">
                    <span className="fact-number">1</span>
                    <span className="fact-label">Kat</span>
                </div>
                <div className="fact-divider" />
                <div className="fact-card">
                    <span className="fact-number">∞</span>
                    <span className="fact-label">Plannen</span>
                </div>
            </div>

            <section className="card-wrapper home-animate">
                <figure className="card image-card home-image home-img-animate">
                    <img
                        src={VillaVredestein}
                        alt={t("home.imageAlt")}
                        className="home-image-full"
                        width="800"
                        height="600"
                    />
                </figure>

                <section className="card text-card home-text home-text-animate">
                    <header>
                        <h1 id="home-title">{t("home.title")}</h1>
                    </header>
                    <p>{t("home.p1")}</p>
                    <p>{t("home.p2")}</p>
                    <p>{t("home.p3")}</p>
                    <p>{t("home.p4")}</p>
                    <div className="home-buttons">
                        <Button
                            text={t("home.readMore")}
                            variant="secundary"
                            onClick={() => navigate("/about")}
                        />
                        <Button
                            text="Tijdlijn"
                            variant="secundary"
                            onClick={() => navigate("/tijdlijn")}
                        />
                    </div>
                </section>
            </section>

        </main>
    );
};

export default Home;