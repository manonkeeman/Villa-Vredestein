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

    const [loginMode, setLoginMode] = useState("STUDENT"); // STUDENT | CLEANER | ADMIN
    const [room, setRoom] = useState("");

    const ROOM_OPTIONS = ["Japan", "Argentinië", "Thailand", "Italië", "Frankrijk", "Oekraïne"];

    const getUserRoomName = (u) => {
        // Try a few likely shapes; adjust backend mapping later if needed
        return (
            u?.room?.name ||
            u?.roomName ||
            u?.room ||
            u?.assignedRoom ||
            u?.assignedRoomName ||
            ""
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (loginMode === "STUDENT" && !room) {
            setError("❌ Kies eerst je kamer.");
            return;
        }

        const success = await login(email.trim(), password);

        if (!success) {
            setError("❌ Ongeldige gegevens of geen toegang.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "null");

        // Extra check: chosen login mode must match the account role
        if (loginMode === "ADMIN" && !hasRole(user, "ADMIN")) {
            setError("❌ Dit account is geen beheerder.");
            return;
        }
        if (loginMode === "CLEANER" && !hasRole(user, "CLEANER")) {
            setError("❌ Dit account heeft geen schoonmaak-toegang.");
            return;
        }
        if (loginMode === "STUDENT" && !hasRole(user, "STUDENT")) {
            setError("❌ Dit account is geen student.");
            return;
        }

        // Extra check: student must match their assigned room
        if (loginMode === "STUDENT") {
            const assignedRoom = getUserRoomName(user);
            if (!assignedRoom) {
                setError("❌ Voor dit account is nog geen kamer gekoppeld. Neem contact op met beheer.");
                return;
            }
            if (assignedRoom !== room) {
                setError(`❌ Verkeerde kamer gekozen. Dit account hoort bij: ${assignedRoom}.`);
                return;
            }
        }

        if (loginMode === "ADMIN") {
            navigate("/admin", { replace: true });
            return;
        }

        if (loginMode === "CLEANER") {
            navigate("/cleaning", { replace: true });
            return;
        }

        if (loginMode === "STUDENT") {
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
                <p className="login-subtext">Welkom terug! Deze inlog is bestemd voor bewoners van Villa Vredestein.</p>

                <form onSubmit={handleSubmit}>
                    <div className="login-mode-row">
                        <label className="login-label" htmlFor="loginMode"></label>
                        <select
                            id="loginMode"
                            value={loginMode}
                            onChange={(e) => {
                                const next = e.target.value;
                                setLoginMode(next);
                                if (next !== "STUDENT") setRoom("");
                            }}
                        >
                            <option value="STUDENT">Student (bewoner)</option>
                            <option value="CLEANER">Schoonmaak</option>
                            <option value="ADMIN">Beheerder</option>
                        </select>
                    </div>

                    {loginMode === "STUDENT" && (
                        <div className="login-mode-row">
                            <label className="login-label" htmlFor="roomSelect"></label>
                            <select
                                id="roomSelect"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                                required
                            >
                                <option value="">Kies je kamer…</option>
                                {ROOM_OPTIONS.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

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
                        Nog geen account? <Link to="/register">Nieuwe bewoner? Registreer hier.</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;