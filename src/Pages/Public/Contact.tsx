import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiMapPin, FiMail } from "react-icons/fi";
import ContactForm from "../../Components/Contact/ContactForm";
import ModalContactForm from "../../Components/Contact/ModalContactForm";
import "./Contact.css";

const Contact = () => {
    const [showModal, setShowModal] = useState(false);
    const { t, i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";

    return (
        <main className="contact-page">
            <Helmet>
                <html lang={langCode} />
                <title>{t("contact.title")} — Villa Vredestein</title>
                <meta name="description" content="Neem contact op met Villa Vredestein in Driebergen-Rijsenburg. Stuur een bericht via het formulier of bezoek ons op Hoofdstraat 147." />
                <link rel="canonical" href="https://villavredestein.nl/contact" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl/contact" />
                <meta property="og:title" content={`${t("contact.title")} — Villa Vredestein`} />
                <meta property="og:description" content="Neem contact op met Villa Vredestein in Driebergen-Rijsenburg. Stuur een bericht of bezoek ons op Hoofdstraat 147." />
                <meta property="og:image" content="https://villavredestein.nl/og-image.jpg" />
                <meta property="og:image:alt" content="Villa Vredestein — Driebergen-Rijsenburg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="https://villavredestein.nl/og-image.jpg" />
            </Helmet>

            {/* Hero */}
            <header className="ct-hero">
                <div className="ct-hero-inner">
                    <span className="ct-eyebrow">Contact</span>
                    <h1>Kom in contact</h1>
                    <p>{t("contact.notice")}</p>
                </div>
            </header>

            {/* Body: form + info */}
            <div className="ct-body">
                <aside className="ct-info">
                    <div className="ct-info-block">
                        <FiMapPin className="ct-info-icon" aria-hidden="true" />
                        <div>
                            <h3>Bezoek ons</h3>
                            <p>Hoofdstraat 147<br />3975 ED Driebergen-Rijsenburg</p>
                        </div>
                    </div>
                    <div className="ct-info-block">
                        <FaWhatsapp className="ct-info-icon" aria-hidden="true" />
                        <div>
                            <h3>WhatsApp</h3>
                            <a href="https://wa.me/31625015299" target="_blank" rel="noreferrer">+31 6 25 01 52 99</a>
                        </div>
                    </div>
                    <div className="ct-info-block">
                        <FaInstagram className="ct-info-icon" aria-hidden="true" />
                        <div>
                            <h3>Instagram</h3>
                            <a href="https://www.instagram.com/villa.vredestein" target="_blank" rel="noreferrer">@villa.vredestein</a>
                        </div>
                    </div>
                    <div className="ct-info-block">
                        <FiMail className="ct-info-icon" aria-hidden="true" />
                        <div>
                            <h3>E-mail</h3>
                            <a href="mailto:info@villavredestein.nl">info@villavredestein.nl</a>
                        </div>
                    </div>
                </aside>

                <div className="ct-form-wrap">
                    <h2>Stuur een bericht</h2>
                    <ContactForm onSuccess={() => setShowModal(true)} />
                </div>
            </div>

            {/* Map */}
            <div className="ct-map-wrap">
                <iframe
                    title={t("contact.mapTitle")}
                    className="ct-map-iframe"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2460.1903295479915!2d5.287013376747164!3d52.04312207197006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c66d27b1c41c65%3A0x60714aaabf21804f!2sHoofdstraat%20147%2C%203975%20ED%20Driebergen-Rijsenburg!5e0!3m2!1snl!2snl!4v1719324930896!5m2!1snl!2snl"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>

            <ModalContactForm show={showModal} onClose={() => setShowModal(false)} />
        </main>
    );
};

export default Contact;
