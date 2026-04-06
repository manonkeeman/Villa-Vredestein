import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import ContactForm from "../../Components/Contact/ContactForm.jsx";
import ModalContactForm from "../../Components/Contact/ModalContactForm.jsx";
import "./Contact.css";

const Contact = () => {
    const [showModal, setShowModal] = useState(false);
    const { t, i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";

    return (
        <main className="contact-wrapper">
            <Helmet>
                <html lang={langCode} />
                <title>{t("contact.title")} — Villa Vredestein</title>
                <meta
                    name="description"
                    content="Neem contact op met Villa Vredestein in Driebergen-Rijsenburg. Stuur een bericht via het formulier of bezoek ons op Hoofdstraat 147."
                />
                <link rel="canonical" href="https://villavredestein.nl/contact" />
                <meta property="og:title" content={`${t("contact.title")} — Villa Vredestein`} />
                <meta property="og:description" content="Neem contact op met Villa Vredestein in Driebergen-Rijsenburg. Stuur een bericht via het formulier of bezoek ons op Hoofdstraat 147." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl/contact" />
                <meta property="og:image" content="https://villavredestein.nl/og-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${t("contact.title")} — Villa Vredestein`} />
                <meta name="twitter:description" content="Neem contact op met Villa Vredestein in Driebergen-Rijsenburg. Stuur een bericht via het formulier of bezoek ons op Hoofdstraat 147." />
                <meta name="twitter:image" content="https://villavredestein.nl/og-image.jpg" />
            </Helmet>

            <div className="contact-layout">
                <section className="contact-box contact-panel">
                    <h1>{t("contact.title")}</h1>
                    <p className="notice">{t("contact.notice")}</p>

                    <ContactForm onSuccess={() => setShowModal(true)} />
                    <ModalContactForm show={showModal} onClose={() => setShowModal(false)} />
                </section>

                <section className="map-box map-panel">
                    <div className="map-frame">
                        <iframe
                            title={t("contact.mapTitle")}
                            className="map-iframe"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2460.1903295479915!2d5.287013376747164!3d52.04312207197006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c66d27b1c41c65%3A0x60714aaabf21804f!2sHoofdstraat%20147%2C%203975%20ED%20Driebergen-Rijsenburg!5e0!3m2!1snl!2snl!4v1719324930896!5m2!1snl!2snl"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </section>
            </div>

        </main>
    );
};

export default Contact;