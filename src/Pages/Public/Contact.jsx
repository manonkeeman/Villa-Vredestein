import React, { useState } from "react";
import { FiMail, FiUser, FiMessageCircle } from "react-icons/fi";
import "./Contact.css";

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(data).toString(),
        })
            .then(() => setSubmitted(true))
            .catch((error) => alert("Fout bij verzenden: " + error));
    };

    return (
        <main className="contact-wrapper">
            <section className="contact-box">
                <h1>Neem contact op</h1>
                <p className="notice">
                    Heb je vragen over Villa Vredestein of wil je iets bespreken met het beheer? Laat gerust een bericht achter, we nemen spoedig contact met je op.
                </p>

                {submitted ? (
                    <p className="success-message">
                        ✅ Je bericht is succesvol verstuurd. We nemen snel contact met je op. <br /> Met vriendelijke groet, Manon & Maxim
                    </p>
                ) : (
                    <form
                        name="contact"
                        method="POST"
                        data-netlify="true"
                        data-netlify-honeypot="bot-field"
                        onSubmit={handleSubmit}
                        className="contact-form"
                    >
                        <input type="hidden" name="form-name" value="contact" />
                        <input type="hidden" name="bot-field" />

                        <div className="input-icon-wrapper">
                            <input
                                type="text"
                                name="naam"
                                placeholder="Je naam"
                                required
                            />
                            <FiUser className="input-icon" />
                        </div>

                        <div className="input-icon-wrapper">
                            <input
                                type="email"
                                name="email"
                                placeholder="Je e-mailadres"
                                required
                            />
                            <FiMail className="input-icon" />
                        </div>

                        <div className="textarea-icon-wrapper">
                            <textarea
                                name="bericht"
                                rows="4"
                                placeholder="Je bericht..."
                                required
                            />
                            <FiMessageCircle className="input-icon textarea-icon" />
                        </div>

                        <button type="submit" className="btn-primary">
                            Verstuur bericht
                        </button>
                    </form>
                )}
            </section>

            <section className="map-box">
                <iframe
                    title="Locatie Villa Vredestein"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4907.142736815647!2d5.282840376689255!3d52.05111917194189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c65d1f8db89b0f%3A0x1c73aae8f1ad085e!2sHoofdstraat%20147%2C%203971%20KJ%20Driebergen-Rijsenburg!5e0!3m2!1snl!2snl!4v1750363544454!5m2!1snl!2snl"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </section>

            <noscript>
                <form name="contact" netlify hidden>
                    <input type="text" name="naam" />
                    <input type="email" name="email" />
                    <textarea name="bericht" />
                </form>
            </noscript>
        </main>
    );
};

export default Contact;