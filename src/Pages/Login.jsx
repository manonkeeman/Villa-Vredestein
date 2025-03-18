import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import BentoBox from "../Components/BentoBox/BentoBox.jsx";  // ✅ BentoBox importeren
import "./Login.css";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login();
        navigate("/recipe");
    };

    return (
        <div className="login-page">
            <BentoBox
                title="Welkom bij de Loginpagina"
                content={
                    <div className="bento-wrapper">
                        <div className="box box1">
                            <h2>Log in bij jouw account</h2>
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="input-group">
                                    <label>Emailadres</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                                           required/>
                                </div>
                                <div className="input-group">
                                    <label>Wachtwoord</label>
                                    <input type="password" name="password" value={formData.password}
                                           onChange={handleChange} required/>
                                    <a href="/forgot-password" className="forgot-password">Wachtwoord vergeten?</a>
                                </div>
                        <button type="submit" className="login-button">Log in</button>
                    </form>
                        </div>
                        <div className="box box2">
                            <iframe
                                src="https://www.youtube.com/embed/PoQdedhOXwI?autoplay=1&mute=1&controls=0&loop=1&playlist=PoQdedhOXwI"
                                title="YouTube video"
                                frameBorder="0"
                                allow="autoplay; encrypted-media; fullscreen"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default Login;