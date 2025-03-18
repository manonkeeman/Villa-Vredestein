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
        rememberMe: false,
    });

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("formData:", formData);
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
                            <p>Welkom! Vul hier je gegevens in.</p>
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="input-group">
                                    <label>Emailadres</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                                           required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Wachtwoord</label>
                                    <input type="password"
                                           name="password"
                                           value={formData.password}
                                           onChange={handleChange}
                                           required
                                    />
                                </div>
                                    <div className="login-options">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="rememberMe"
                                                checked={formData.rememberMe}
                                                onChange={handleChange}
                                            />
                                            Onthoud mij
                                        </label>
                                        <a href="/forgot-password" className="forgot-password">
                                            Wachtwoord vergeten?</a>
                                    </div>
                                    <button type="submit" className="login-button">Log in</button>
                            </form>
                        </div>
                        <div className="box box2">
                            <div className="video-container"></div>
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