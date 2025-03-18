import React, { useState } from "react";
import "../Styles/BentoGrid.css";
import "./Contact.css";
import "../Styles/BentoGrid.css"; // ✅ Import de gedeelde grid-stijlen

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("https://your-api-endpoint.com/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Je bericht is succesvol verzonden!");
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                message: "",
            });
        } else {
            alert("Er ging iets mis. Probeer het opnieuw.");
        }
    };

    return (
        <div className="contact-page">
            <div className="bento-grid">
                <div className="box box1">
                    <h2>Neem contact met ons op</h2>
                    <p>Laat hieronder je bericht achter, dan nemen we zo snel mogelijk contact met je op.</p>

                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="input-group">
                            <label>Voornaam</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>

                        <div className="input-group">
                            <label>Achternaam</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>

                        <div className="input-group">
                            <label>Emailadres</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="input-group">
                            <label>Bericht</label>
                            <textarea name="message" value={formData.message} onChange={handleChange} rows="4" required />
                        </div>

                        <button type="submit" className="contact-button">Verstuur</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;