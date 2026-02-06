import React, { useState } from "react";
import ContactForm from "../../Components/Contact/ContactForm.jsx";
import ModalContactForm from "../../Components/Contact/ModalContactForm.jsx";
import "./Contact.css";

const Contact = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <main className="contact-wrapper">
            <div className="contact-layout">
                <section className="contact-box contact-panel">
                    <h1>Neem contact op</h1>
                    <p className="notice">
                        Heb je vragen over Villa Vredestein of wil je iets bespreken met het beheer?
                        Laat gerust een bericht achter. We nemen spoedig contact met je op.
                    </p>

                    <ContactForm onSuccess={() => setShowModal(true)} />
                    <ModalContactForm show={showModal} onClose={() => setShowModal(false)} />
                </section>

                <section className="map-box map-panel">
                    <div className="map-frame">
                        <iframe
                            title="Locatie Villa Vredestein"
                            className="map-iframe"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2460.1903295479915!2d5.287013376747164!3d52.04312207197006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c66d27b1c41c65%3A0x60714aaabf21804f!2sHoofdstraat%20147%2C%203975%20ED%20Driebergen-Rijsenburg!5e0!3m2!1snl!2snl!4v1719324930896!5m2!1snl!2snl"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </section>
            </div>

            <form name="contact" data-netlify="true" hidden>
                <input type="text" name="naam" />
                <input type="email" name="email" />
                <textarea name="bericht" />
            </form>
        </main>
    );
};

export default Contact;