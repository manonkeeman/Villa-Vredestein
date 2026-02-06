import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Login.css";
import Button from "../../Components/Buttons/Button.jsx";

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

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

        const success = await login(email.trim(), password);

        if (!success) {
            setError("❌ Ongeldige gegevens of geen toegang.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "null");

        if (hasRole(user, "ADMIN")) {
            navigate("/admin", { replace: true });
            return;
        }

        if (hasRole(user, "CLEANER")) {
            navigate("/cleaning", { replace: true });
            return;
        }

        if (hasRole(user, "STUDENT")) {
            const id = user?.id ?? user?.userId;
            if (id) {
                navigate(`/student/${id}`, { replace: true });
            } else {
                navigate("/student", { replace: true });
            }
            return;
        }

        navigate("/unauthorized", { replace: true });
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
                <p className="login-subtext">Welkom terug! Log in om je dashboard te bekijken.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mailadres"
                        autoComplete="email"
                        required
                    />

                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Wachtwoord"
                            autoComplete="current-password"
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="toggle-password"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") setShowPassword(!showPassword);
                            }}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    <Button text="Login" type="submit" variant="primary" className="login-submit" />
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