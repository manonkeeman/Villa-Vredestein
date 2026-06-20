import React, { useState } from "react";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import Modal from "../Components/Modal/Modal.jsx";
import "./Contact.css";

const Contact = () => {
    const [showModal, setShowModal] = useState(false);
    const [naam, setNaam] = useState("");
    const [bericht, setBericht] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowModal(true);
        setNaam("");
        setBericht("");
    };

    return (
        <div className="contact-page">
            <div className="contact-header">
                <h1>Wil je meer weten?</h1>
                <p>
                    Neem gerust contact op. Of volg ons op Instagram voor een inkijkje
                    in het dagelijks leven bij Villa Vredestein.
                </p>
            </div>

            <div className="contact-grid">
                <div className="contact-socials">
                    <a
                        href="https://www.instagram.com/villa.vredestein"
                        target="_blank"
                        rel="noreferrer"
                        className="contact-social-card"
                    >
                        <FaInstagram className="social-icon" />
                        <div>
                            <span className="social-naam">Instagram</span>
                            <span className="social-handle">@villa.vredestein</span>
                        </div>
                    </a>

                    <a
                        href="https://wa.me/31625015299"
                        target="_blank"
                        rel="noreferrer"
                        className="contact-social-card"
                    >
                        <FaWhatsapp className="social-icon" />
                        <div>
                            <span className="social-naam">WhatsApp</span>
                            <span className="social-handle">Stuur ons een bericht</span>
                        </div>
                    </a>

                    <a
                        href="mailto:villa@vredestein.nl"
                        className="contact-social-card"
                    >
                        <FaEnvelope className="social-icon" />
                        <div>
                            <span className="social-naam">E-mail</span>
                            <span className="social-handle">villa@vredestein.nl</span>
                        </div>
                    </a>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <h2>Stuur een bericht</h2>
                    <input
                        type="text"
                        placeholder="Jouw naam"
                        value={naam}
                        onChange={(e) => setNaam(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Jouw bericht..."
                        rows={5}
                        value={bericht}
                        onChange={(e) => setBericht(e.target.value)}
                        required
                    />
                    <button type="submit" className="contact-submit">
                        Verstuur bericht
                    </button>
                </form>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default Contact;
