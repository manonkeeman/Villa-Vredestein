import React, { useState } from "react";
import ModalContact from "../Components/Modal/ModalContact.jsx";
import "./Contact.css";
import "../Styles/Global.css";

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <Fonts />
            <div className="contact-page">
                <div className="contact-container">
                    <div className="contact-form-section">
                        <h1>Wij vinden het leuk van je te horen!</h1>
                        <p>Heb je vragen, zoek je contact of wil je samenwerken?</p>
                        <p>Laat je gegevens achter en wij nemen contact met je op.</p>

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Voornaam"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Achternaam"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Emailadres"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <textarea
                                    name="message"
                                    placeholder="Bericht"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn-primary">Verstuur</button>
                        </form>
                    </div>

                    <div className="contact-map-section">
                        <div className="location-card">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2453.571372380421!2d5.2805443904470115!3d52.051119099596725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c65decd0beb145%3A0x91a0779ee9a6307f!2sVilla%20Vredestein!5e0!3m2!1snl!2snl!4v1744454158527!5m2!1snl!2snl"
                                width="100%"
                                height="500"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Google Maps locatie"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {showModal && <ModalContact show={showModal} onClose={closeModal} />}
            </div>
        </>
    );
};

export default Contact;