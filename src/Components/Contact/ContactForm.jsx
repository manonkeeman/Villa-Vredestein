import React, { useState } from "react";
import { FiMail, FiUser, FiMessageCircle } from "react-icons/fi";
import Button from "../Buttons/Button.jsx";

const ContactForm = ({ onSuccess }) => {
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        const form = e.target;
        const data = new FormData(form);

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(data).toString(),
        })
            .then(() => {
                form.reset();
                onSuccess(); // toon modal
            })
            .catch(() => {
                setError("Er ging iets mis bij het versturen. Probeer het later opnieuw.");
            });
    };

    return (
        <form
            name="contact"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            className="contact-form"
            onSubmit={handleSubmit}
        >
            <input type="hidden" name="form-name" value="contact" />
            <input type="hidden" name="bot-field" />

            <div className="input-icon-wrapper">
                <input type="text" name="naam" placeholder="Je naam" required />
                <FiUser className="input-icon" />
            </div>

            <div className="input-icon-wrapper">
                <input type="email" name="email" placeholder="Je e-mailadres" required />
                <FiMail className="input-icon" />
            </div>

            <div className="textarea-icon-wrapper">
                <textarea name="bericht" rows="4" placeholder="Je bericht..." required />
                <FiMessageCircle className="input-icon textarea-icon" />
            </div>

            <Button type="submit" text="Verstuur bericht" variant="primary" />

            {error && <p className="error-message">❌ {error}</p>}
        </form>
    );
};

export default ContactForm;