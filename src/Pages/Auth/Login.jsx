import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Button from "../../Components/Buttons/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const success = await login(email.trim(), password.trim());

        if (success) {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user?.role === "ADMIN") {
                navigate("/admin");
            } else if (user?.role === "USER") {
                navigate(`/student/${user.userId}`);
            } else {
                navigate("/unauthorized");
            }
        } else {
            setError("❌ Ongeldige gegevens of geen toegang.");
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
                    title="Villa Vredestein sfeer"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                ></iframe>
            </div>

            <div className="login-box login-form-box">
                <h1>Log in</h1>
                <p className="login-subtext">
                    Welkom terug! Log in om je dashboard te bekijken.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mailadres"
                        required
                    />

                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Wachtwoord"
                            required
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    <Button type="submit" text="Login" variant="primary" />
                    {error && <p className="error">{error}</p>}

                    <p className="register-link">
                        Nog geen account? <Link to="/register">Registreer hier</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;