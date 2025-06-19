import React, { useState } from "react";

const Contact = () => {
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);

        try {
            await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(data).toString(),
            });
            form.reset();
            setStatus("✅ Bericht succesvol verzonden!");
        } catch (error) {
            console.error("Fout:", error);
            setStatus("❌ Er ging iets mis. Probeer het later opnieuw.");
        }
    };

    return (
        <main className="page-container">
            <form name="contact" netlify hidden>
                <input type="text" name="naam" />
                <input type="email" name="email" />
                <textarea name="bericht" />
            </form>

            <div className="card-wrapper">
                <div className="card text-card">
                    <h2 className="contact-title">Neem contact op</h2>
                    <p style={{ fontSize: "12px", marginBottom: "1rem" }}>
                        Heb je vragen over de woning, een studentenplek of schoonmaak? Stuur ons een berichtje via onderstaand formulier.
                    </p>

                    <form
                        className="contact-form"
                        name="contact"
                        method="POST"
                        data-netlify="true"
                        data-netlify-honeypot="bot-field"
                        onSubmit={handleSubmit}
                    >
                        <input type="hidden" name="form-name" value="contact" />
                        <input type="hidden" name="bot-field" />

                        <div className="form-group">
                            <input type="text" name="naam" placeholder="Je naam" required />
                        </div>
                        <div className="form-group">
                            <input type="email" name="email" placeholder="Je e-mailadres" required />
                        </div>
                        <div className="form-group">
                            <textarea name="bericht" rows="4" placeholder="Je bericht..." required />
                        </div>
                        <button type="submit" className="btn-primary">Versturen</button>
                        {status && <p style={{ fontSize: "12px", marginTop: "0.5rem" }}>{status}</p>}
                    </form>
                </div>

                <div className="card image-card">
                    <address>
                        <iframe
                            title="Villa Vredestein locatie"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2464.1955117746076!2d5.281023676560384!3d52.04548317193883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c663f87aa77a45%3A0x1c8d3b3ff7bb27f2!2sVilla%20Vredestein!5e0!3m2!1snl!2snl!4v1718711342657!5m2!1snl!2snl"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </address>
                </div>
            </div>
        </main>
    );
};

export default Contact;