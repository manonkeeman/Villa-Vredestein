import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import ContactForm from "../../Components/Contact/ContactForm";
import ModalContactForm from "../../Components/Contact/ModalContactForm";
import "./Contact.css";
import { useContent } from "../../i18n/content";

const Contact = () => {
    const tc = useContent();
    const [showModal, setShowModal] = useState(false);
    const { t, i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";

    return (
        <main className="contact-page">
            <Helmet>
                <html lang={langCode} />
                <title>{`${t("contact.title")}, Villa Vredestein`}</title>
                <meta name="description" content={tc("Neem contact op met Villa Vredestein in Driebergen-Rijsenburg. Stuur een bericht via het formulier of bezoek ons op Hoofdstraat 147.")} />
                <link rel="canonical" href="https://villavredestein.com/contact" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.com/contact" />
                <meta property="og:title" content={`${t("contact.title")}, Villa Vredestein`} />
                <meta property="og:description" content={tc("Neem contact op met Villa Vredestein in Driebergen-Rijsenburg. Stuur een bericht of bezoek ons op Hoofdstraat 147.")} />
                <meta property="og:image" content="https://villavredestein.com/og-image.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:alt" content={tc("Villa Vredestein, Driebergen-Rijsenburg")} />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={tc("Contact, Villa Vredestein")} />
                <meta name="twitter:description" content={tc("Neem contact op met Villa Vredestein in Driebergen-Rijsenburg. Stuur een bericht of bezoek ons op Hoofdstraat 147.")} />
                <meta name="twitter:image" content="https://villavredestein.com/og-image.jpg" />
            </Helmet>

            {/* Hero */}
            <header className="ct-hero">
                <div className="ct-hero-inner">
                    <span className="ct-eyebrow">{tc("Contact")}</span>
                    <h1>{tc("Kom in contact")}</h1>
                    <p>{t("contact.notice")}</p>
                </div>
            </header>

            {/* Body: form + info */}
            <div className="ct-body">
                <aside className="ct-info">
                    <div className="ct-info-block">
                        <FiMapPin className="ct-info-icon" aria-hidden="true" />
                        <div>
                            <h3>{tc("Bezoek ons")}</h3>
                            <p>{tc("Hoofdstraat 147")}<br />{tc("3975 ED Driebergen-Rijsenburg")}</p>
                        </div>
                    </div>
                    <a
                        href="https://wa.me/31625015299"
                        target="_blank"
                        rel="noreferrer"
                        className="ct-info-block ct-info-block--icon-only"
                        aria-label={tc("Contact via WhatsApp: +31 6 25 01 52 99")}
                    >
                        <FaWhatsapp className="ct-info-icon ct-info-icon--lg" aria-hidden="true" />
                    </a>
                    <div className="ct-info-block">
                        <FaInstagram className="ct-info-icon" aria-hidden="true" />
                        <div>
                            <h3>{tc("Instagram")}</h3>
                            <a href="https://www.instagram.com/villa.vredestein" target="_blank" rel="noreferrer">{tc("@villa.vredestein")}</a>
                        </div>
                    </div>

                </aside>

                <div className="ct-form-wrap">
                    <h2>{tc("Stuur een bericht")}</h2>
                    <ContactForm onSuccess={() => setShowModal(true)} />
                </div>
            </div>

<ModalContactForm show={showModal} onClose={() => setShowModal(false)} />
        </main>
    );
};

export default Contact;
