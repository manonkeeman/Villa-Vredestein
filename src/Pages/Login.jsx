import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import ReactPlayer from 'react-player/youtube';
import BentoBox from "../Components/BentoBox/BentoBox.jsx";
import Button from "../Components/Buttons/Button.jsx";
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
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Wachtwoord</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="login-options">
                                    <label className="remember-me">
                                        <input
                                            type="checkbox"
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                        />
                                        <span>Onthoud mij</span>
                                    </label>
                                    <a href="/forgot-password" className="forgot-password">
                                        Wachtwoord vergeten?
                                    </a>
                                </div>

                                <Button type="submit" text="Log in" />
                            </form>
                        </div>
                        <div className="box box2">
                            <div className="video-wrapper">
                                <ReactPlayer
                                    className="react-player"
                                    url="https://www.youtube.com/watch?v=PoQdedhOXwI"
                                    width="100%"
                                    height="100%"
                                    playing
                                    loop
                                    muted
                                    controls={false}
                                    style={{ borderRadius: '10px', overflow: 'hidden' }}
                                />
                            </div>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default Login;