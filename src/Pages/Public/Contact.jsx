import React, { useState } from "react";
import ContactForm from "../../Components/Contact/ContactForm.jsx";
import ModalContactForm from "../../Components/Contact/ModalContactForm.jsx";
import "./Contact.css";

const Contact = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <main className="contact-wrapper">
            <section className="contact-box">
                <h1>Neem contact op</h1>
                <p className="notice">
                    Heb je vragen over Villa Vredestein of wil je iets bespreken met het beheer?
                    Laat gerust een bericht achter – we nemen spoedig contact met je op.
                </p>

                <ContactForm onSuccess={() => setShowModal(true)} />
                <ModalContactForm show={showModal} onClose={() => setShowModal(false)} />
            </section>

            <section className="map-box">
                <iframe
                    title="Locatie Villa Vredestein"
                    src="https://www.google.com/maps/embed?pb=!1m18!..."
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </section>

            <noscript>
                <form name="contact" data-netlify="true" hidden>
                    <input type="text" name="naam" />
                    <input type="email" name="email" />
                    <textarea name="bericht" />
                </form>
            </noscript>
        </main>
    );
};

export default Contact;