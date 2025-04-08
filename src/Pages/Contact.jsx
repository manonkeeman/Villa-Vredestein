import React, { useState } from "react";
import "../Styles/BentoGrid.css";
import "./Contact.css";
import Button from "../Components/Buttons/Button.jsx";
import Modal from "../Components/Modal/Modal.jsx";

const Contact = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowModal(true);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            message: "",
        });
    };

    return (
        <div className="contact-page">
            <div className="bento-grid">
                <div className="box box1">
                    <h1>Neem contact met ons op</h1>
                    <p>
                        Heb je vragen, wil je meer informatie over Villa Vredestein, of ben
                        je benieuwd naar onze missie en visie? <br />
                        Vul het contactformulier hieronder in en we nemen zo snel mogelijk
                        contact met je op.
                    </p>

                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="name-fields">
                            <div className="input-group">
                                <label>Voornaam</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Achternaam</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Emailadres</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Bericht</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                required
                            />
                        </div>
                        <Button type="submit" text="Verstuur" variant="primary" />
                    </form>
                </div>

                <div className="box box2 location-box">
                    <div className="location">
                        <iframe
                            src="https://storage.googleapis.com/maps-solutions-sw132nzda1/commutes/e0od/commutes.html"
                            className="location-map"
                            loading="lazy"
                            allowFullScreen
                            title="Locatie Villa Vredestein"
                        />
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default Contact;