import React, { useState } from "react";
import axios from "../../Helpers/AxiosHelper.jsx";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/users", formData);
            navigate("/login"); // redirect na succesvolle registratie
        } catch (err) {
            setError("❌ Registratie mislukt. Probeer het opnieuw.");
            console.error(err);
        }
    };

    return (
        <div className="auth-form">
            <h2>Registreer</h2>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Gebruikersnaam" onChange={handleChange} required />
                <input type="email" name="email" placeholder="E-mailadres" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Wachtwoord" onChange={handleChange} required />
                <button type="submit">Registreer</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Register;