import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/Auth/AuthContext";
import "./Login.css";
import Button from "../Components/Buttons/Button";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(email, password);
        if (success) {
            navigate("/studentdashboard");
        } else {
            setError("Ongeldige login. Probeer opnieuw.");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-box login-video-box">
                <iframe
                    className="login-video"
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/PoQdedhOXwI?autoplay=1&mute=1&loop=1&playlist=PoQdedhOXwI"
                    title="IVA en Villa Vredestein video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                ></iframe>
            </div>

            <div className="login-box login-form-box">
                <h1>Log hier in</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mailadres"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Wachtwoord"
                        required
                    />
                    <Button type="submit" text="Login" variant="primary" />
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;