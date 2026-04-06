import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMail, FiUser, FiMessageCircle } from "react-icons/fi";
import Button from "../Buttons/Button.jsx";

const ContactForm = ({ onSuccess }) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const form = e.target;
        const data = new FormData(form);

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(data).toString(),
        })
            .then(() => {
                form.reset();
                onSuccess();
            })
            .catch(() => {
                setError(t("contact.form.error"));
            })
            .finally(() => setLoading(false));
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
            {/* Netlify vereiste velden */}
            <input type="hidden" name="form-name" value="contact" />
            <input type="hidden" name="subject" value={t("footer.subject")} />
            <input type="hidden" name="bot-field" />

            <div className="input-icon-wrapper">
                <label htmlFor="cf-naam" className="visually-hidden">{t("contact.form.name")}</label>
                <input
                    id="cf-naam"
                    type="text"
                    name="naam"
                    placeholder={t("contact.form.name")}
                    required
                    autoComplete="name"
                />
                <FiUser className="input-icon" aria-hidden="true" />
            </div>

            <div className="input-icon-wrapper">
                <label htmlFor="cf-email" className="visually-hidden">{t("contact.form.email")}</label>
                <input
                    id="cf-email"
                    type="email"
                    name="email"
                    placeholder={t("contact.form.email")}
                    required
                    autoComplete="email"
                />
                <FiMail className="input-icon" aria-hidden="true" />
            </div>

            <div className="textarea-icon-wrapper">
                <label htmlFor="cf-bericht" className="visually-hidden">{t("contact.form.message")}</label>
                <textarea
                    id="cf-bericht"
                    name="bericht"
                    rows="5"
                    placeholder={t("contact.form.message")}
                    required
                />
                <FiMessageCircle className="input-icon textarea-icon" aria-hidden="true" />
            </div>

            <Button
                type="submit"
                text={loading ? "..." : t("contact.form.submit")}
                variant="primary"
                disabled={loading}
            />

            {error && <p className="error-message" role="alert">❌ {error}</p>}
        </form>
    );
};

export default ContactForm;
