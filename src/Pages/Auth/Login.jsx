import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Login.css";
import Button from "../../Components/Buttons/Button.jsx";

const hasRole = (user, role) => {
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const normalized = (role.startsWith("ROLE_") ? role : `ROLE_${role}`)
        .trim()
        .toUpperCase();

    return roles.map((r) => String(r).trim().toUpperCase()).includes(normalized);
};

const norm = (s) => String(s ?? "").trim().toLowerCase();

const isSafeRedirect = (path) => {
    if (!path) return false;
    if (!path.startsWith("/")) return false;
    if (path === "/login" || path === "/register") return false;
    return true;
};

const canAccessPathForMode = (path, loginMode) => {
    if (!path) return false;
    if (loginMode === "ADMIN") return path.startsWith("/admin");
    if (loginMode === "CLEANER") return path.startsWith("/cleaning");
    if (loginMode === "STUDENT") return path.startsWith("/student");
    return false;
};

const defaultDashboardForMode = (user, loginMode) => {
    if (loginMode === "ADMIN") return "/admin";
    if (loginMode === "CLEANER") return "/cleaning";

    const id = user?.id ?? user?.userId;
    return id ? `/student/${id}` : "/student";
};

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { login, user: authUser, reloadUser } = useAuth();

    const API_BASE = useMemo(() => {
        return (import.meta?.env?.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");
    }, []);

    const isDev = Boolean(import.meta?.env?.DEV);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const [submitting, setSubmitting] = useState(false);

    const [loginMode, setLoginMode] = useState("STUDENT"); // STUDENT | CLEANER | ADMIN
    const [room, setRoom] = useState("");

    const [showResetPanel, setShowResetPanel] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [resetInfo, setResetInfo] = useState("");
    const [resetError, setResetError] = useState("");
    const [devToken, setDevToken] = useState("");
    const [resetLoading, setResetLoading] = useState(false);

    const ROOM_OPTIONS = ["Japan", "Argentinië", "Thailand", "Italië", "Frankrijk", "Oekraïne"];

    const getUserRoomName = (u) => {
        return (
            u?.room?.name ||
            u?.roomName ||
            u?.room ||
            u?.assignedRoom ||
            u?.assignedRoomName ||
            ""
        );
    };

    const safeParseUser = () => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    };

    const handleForgotPassword = async (e) => {
        if (e?.preventDefault) e.preventDefault();
        setResetInfo("");
        setResetError("");
        setDevToken("");

        const emailToUse = (resetEmail || email).trim();
        if (!emailToUse) {
            setResetError("❌ Vul je e-mailadres in.");
            return;
        }

        try {
            setResetLoading(true);
            const res = await fetch(`${API_BASE}/api/password-reset/forgot`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailToUse }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setResetError(`❌ ${data?.message || "Reset aanvragen is niet gelukt."}`);
                return;
            }

            if (data?.token) {
                setDevToken(String(data.token));
                setResetToken(String(data.token));
            }

            setResetInfo(
                "✅ Als dit e-mailadres bestaat, is er een reset gestart. Vul je token in en kies een nieuw wachtwoord."
            );
        } catch {
            setResetError("❌ Netwerkfout bij reset aanvragen.");
        } finally {
            setResetLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        if (e?.preventDefault) e.preventDefault();
        setResetInfo("");
        setResetError("");

        const token = resetToken.trim();
        if (!token) {
            setResetError("❌ Vul je token in.");
            return;
        }
        if (!newPassword || newPassword.length < 8) {
            setResetError("❌ Nieuw wachtwoord moet minimaal 8 tekens zijn.");
            return;
        }

        try {
            setResetLoading(true);
            const res = await fetch(`${API_BASE}/api/password-reset/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setResetError(`❌ ${data?.message || "Wachtwoord resetten is niet gelukt."}`);
                return;
            }

            setResetInfo("✅ Wachtwoord aangepast. Je kunt nu inloggen met je nieuwe wachtwoord.");
            if (resetEmail) setEmail(resetEmail);
            setShowResetPanel(false);
            setPassword("");
            setNewPassword("");
            setResetToken("");
        } catch {
            setResetError("❌ Netwerkfout bij wachtwoord resetten.");
        } finally {
            setResetLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        const cleanEmail = email.trim();

        try {
            if (!cleanEmail || !password) {
                setError("❌ Vul e-mail en wachtwoord in.");
                return;
            }

            if (loginMode === "STUDENT" && !room) {
                setError("❌ Kies eerst je kamer.");
                return;
            }

            const success = await login(cleanEmail, password, { loginMode, room });

            console.log("login() returned:", success);
            console.log("localStorage user:", localStorage.getItem("user"));
            console.log("localStorage authToken:", localStorage.getItem("authToken"));

            if (!success) {
                setError("❌ Ongeldige gegevens of geen toegang.");
                return;
            }

            // Zorg dat we de meest recente user hebben (AuthContext + fallback localStorage)
            let user = authUser || safeParseUser();
            try {
                // login() doet dit meestal al; maar dit maakt het robuuster
                const refreshed = await reloadUser?.();
                if (refreshed) user = refreshed;
            } catch {
                // ignore
            }
            if (!user) user = safeParseUser();

            // Role checks per gekozen mode
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

            // Student kamer check (robust)
            if (loginMode === "STUDENT") {
                const assignedRoom = getUserRoomName(user);
                if (!assignedRoom) {
                    setError("❌ Voor dit account is nog geen kamer gekoppeld. Neem contact op met beheer.");
                    return;
                }
                if (norm(assignedRoom) !== norm(room)) {
                    setError(`❌ Verkeerde kamer gekozen. Dit account hoort bij: ${assignedRoom}.`);
                    return;
                }
            }

            // Redirect logic: terug naar originele protected route als die past
            const fromPath = location.state?.from?.pathname;
            const fallback = defaultDashboardForMode(user, loginMode);

            if (isSafeRedirect(fromPath) && canAccessPathForMode(fromPath, loginMode)) {
                return navigate(fromPath, { replace: true });
            }

            return navigate(fallback, { replace: true });
        } catch (err) {
            console.error("❌ handleSubmit crash:", err);
            setError("❌ Er ging iets mis tijdens inloggen. Kijk console/network voor details.");
        } finally {
            setSubmitting(false);
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
                />
            </div>

            <div className="login-box login-form-box">
                <h1>Log in</h1>
                <p className="login-subtext">
                    Welkom terug! Deze inlog is bestemd voor bewoners van Villa Vredestein.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="login-mode-row">
                        <label className="login-label" htmlFor="loginMode">Inloggen als</label>
                        {loginMode === "STUDENT" ? (
                            <label className="login-label" htmlFor="roomSelect">Kamer</label>
                        ) : (
                            <span className="login-label" aria-hidden="true" />
                        )}

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
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mailadres"
                        autoComplete="email"
                        required
                    />

                    <div className="password-field">
                        <input
                            id="password"
                            name="password"
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

                    <div className="login-links-row">
                        <button
                            type="button"
                            className="linklike"
                            onClick={() => {
                                const nextOpen = !showResetPanel;
                                setShowResetPanel(nextOpen);
                                setResetError("");
                                setResetInfo("");
                                setDevToken("");
                                setResetEmail((email || "").trim());
                            }}
                        >
                            Wachtwoord vergeten?
                        </button>
                    </div>

                    <button type="submit" className="login-submit" disabled={submitting}>
                        {submitting ? "Bezig…" : "Login"}
                    </button>
                    {error && <p className="error">{error}</p>}

                    <p className="register-link">
                        Nog geen account? <Link to="/register">Nieuwe bewoner? Registreer hier.</Link>
                    </p>
                </form>

                {showResetPanel && (
                    <div className="reset-panel" aria-live="polite">
                        <div className="reset-title">Wachtwoord resetten</div>
                        <p className="reset-hint">
                            Vul je e-mailadres in. (Zolang mail nog niet hangt, kan je backend in dev een token teruggeven.)
                        </p>

                        <div className="reset-form">
                            <label className="reset-label" htmlFor="resetEmail">E-mailadres</label>
                            <input
                                id="resetEmail"
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                placeholder="jij@voorbeeld.nl"
                                autoComplete="email"
                                required
                            />
                            <Button
                                text={resetLoading ? "Bezig…" : "Stuur reset"}
                                type="button"
                                variant="secondary"
                                className="reset-submit"
                                onClick={handleForgotPassword}
                            />
                        </div>

                        {isDev && devToken && (
                            <div className="dev-token-box">
                                <label className="reset-label" htmlFor="devToken">Dev token (alleen dev)</label>
                                <input
                                    id="devToken"
                                    type="text"
                                    value={devToken}
                                    readOnly
                                    onFocus={(e) => e.target.select()}
                                />
                                <p className="reset-hint small">Zodra mail werkt: dit weg of alleen tonen in dev.</p>
                            </div>
                        )}

                        <div className="reset-divider" />

                        <div className="reset-form">
                            <label className="reset-label" htmlFor="resetToken">Token</label>
                            <input
                                id="resetToken"
                                type="text"
                                value={resetToken}
                                onChange={(e) => setResetToken(e.target.value)}
                                placeholder="Plak je token hier…"
                                required
                            />

                            <label className="reset-label" htmlFor="newPassword">Nieuw wachtwoord</label>
                            <div className="password-field">
                                <input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Minimaal 8 tekens"
                                    autoComplete="new-password"
                                    required
                                />
                                <span
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="toggle-password"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") setShowNewPassword(!showNewPassword);
                                    }}
                                >
                                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                                </span>
                            </div>

                            <Button
                                text={resetLoading ? "Bezig…" : "Nieuw wachtwoord instellen"}
                                type="button"
                                variant="primary"
                                className="reset-submit"
                                onClick={handleResetPassword}
                            />

                            {resetError && <p className="error">{resetError}</p>}
                            {resetInfo && <p className="reset-success">{resetInfo}</p>}

                            <button
                                type="button"
                                className="linklike"
                                onClick={() => {
                                    setShowResetPanel(false);
                                    setResetError("");
                                    setResetInfo("");
                                }}
                            >
                                Terug naar login
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;