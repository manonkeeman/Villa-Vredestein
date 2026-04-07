import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import "./Login.css";

const hasRole = (user, role) => {
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const normalized = (role.startsWith("ROLE_") ? role : `ROLE_${role}`).trim().toUpperCase();
    return roles.map((r) => String(r).trim().toUpperCase()).includes(normalized);
};

const norm = (s) => String(s ?? "").trim().toLowerCase();

const isSafeRedirect = (path) => {
    if (!path || !path.startsWith("/")) return false;
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

const getUserRoomName = (u) =>
    u?.room?.name || u?.roomName || u?.room || u?.assignedRoom || u?.assignedRoomName || "";

const safeParseUser = () => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
};

const MODES = [
    { value: "STUDENT", label: "Bewoner" },
    { value: "CLEANER", label: "Schoonmaak" },
    { value: "ADMIN", label: "Beheerder" },
];

const ROOM_OPTIONS = ["Japan", "Argentinië", "Thailand", "Italië", "Frankrijk", "Oekraïne"];

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user: authUser } = useAuth();

    const API_BASE = useMemo(
        () => (import.meta?.env?.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, ""),
        []
    );
    const isDev = Boolean(import.meta?.env?.DEV);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loginMode, setLoginMode] = useState("STUDENT");
    const [room, setRoom] = useState("");

    const [backendReady, setBackendReady] = useState(false);
    const [backendSlow, setBackendSlow] = useState(false);
    const warmupDone = useRef(false);

    useEffect(() => {
        if (warmupDone.current) return;
        warmupDone.current = true;
        const slowTimer = setTimeout(() => setBackendSlow(true), 4000);
        fetch(`${API_BASE}/actuator/health`, { signal: AbortSignal.timeout(60000) })
            .then(() => { setBackendReady(true); setBackendSlow(false); })
            .catch(() => { setBackendReady(true); setBackendSlow(false); })
            .finally(() => clearTimeout(slowTimer));
        return () => clearTimeout(slowTimer);
    }, [API_BASE]);

    const [showResetPanel, setShowResetPanel] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [resetInfo, setResetInfo] = useState("");
    const [resetError, setResetError] = useState("");
    const [devToken, setDevToken] = useState("");
    const [resetLoading, setResetLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        if (e?.preventDefault) e.preventDefault();
        setResetInfo(""); setResetError(""); setDevToken("");
        const emailToUse = (resetEmail || email).trim();
        if (!emailToUse) { setResetError("Vul je e-mailadres in."); return; }
        try {
            setResetLoading(true);
            const res = await fetch(`${API_BASE}/api/password-reset/forgot`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailToUse }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) { setResetError(data?.message || "Reset aanvragen is niet gelukt."); return; }
            if (data?.token) { setDevToken(String(data.token)); setResetToken(String(data.token)); }
            setResetInfo("Als dit e-mailadres bestaat, is een reset gestart. Vul je token en nieuw wachtwoord in.");
        } catch { setResetError("Netwerkfout bij reset aanvragen."); }
        finally { setResetLoading(false); }
    };

    const handleResetPassword = async (e) => {
        if (e?.preventDefault) e.preventDefault();
        setResetInfo(""); setResetError("");
        if (!resetToken.trim()) { setResetError("Vul je token in."); return; }
        if (!newPassword || newPassword.length < 8) { setResetError("Wachtwoord moet minimaal 8 tekens zijn."); return; }
        try {
            setResetLoading(true);
            const res = await fetch(`${API_BASE}/api/password-reset/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: resetToken.trim(), newPassword }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) { setResetError(data?.message || "Wachtwoord resetten is niet gelukt."); return; }
            setResetInfo("Wachtwoord aangepast. Je kunt nu inloggen.");
            if (resetEmail) setEmail(resetEmail);
            setShowResetPanel(false);
            setPassword(""); setNewPassword(""); setResetToken("");
        } catch { setResetError("Netwerkfout bij wachtwoord resetten."); }
        finally { setResetLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        const cleanEmail = email.trim();
        try {
            if (!cleanEmail || !password) { setError("Vul e-mail en wachtwoord in."); return; }
            if (loginMode === "STUDENT" && !room) { setError("Kies eerst je kamer."); return; }

            const success = await login(cleanEmail, password, { loginMode, room });
            if (!success) { setError("Ongeldige gegevens of geen toegang."); return; }

            // login() already called loadMe() internally, so localStorage is fresh
            const user = safeParseUser();

            if (loginMode === "ADMIN" && !hasRole(user, "ADMIN")) { setError("Dit account is geen beheerder."); return; }
            if (loginMode === "CLEANER" && !hasRole(user, "CLEANER")) { setError("Dit account heeft geen schoonmaak-toegang."); return; }
            if (loginMode === "STUDENT" && !hasRole(user, "STUDENT")) { setError("Dit account is geen bewoner."); return; }

            if (loginMode === "STUDENT") {
                const assignedRoom = getUserRoomName(user);
                if (!assignedRoom) { setError("Voor dit account is nog geen kamer gekoppeld. Neem contact op met beheer."); return; }
                if (norm(assignedRoom) !== norm(room)) { setError(`Verkeerde kamer gekozen. Dit account hoort bij: ${assignedRoom}.`); return; }
            }

            const fromPath = location.state?.from?.pathname;
            const fallback = defaultDashboardForMode(user, loginMode);
            return navigate(
                isSafeRedirect(fromPath) && canAccessPathForMode(fromPath, loginMode) ? fromPath : fallback,
                { replace: true }
            );
        } catch {
            setError("Er ging iets mis. Probeer het opnieuw.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="login-page">
            <Helmet>
                <title>Inloggen — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            {/* Video kant */}
            <div className="login-media">
                <iframe
                    className="login-video"
                    src="https://www.youtube.com/embed/PoQdedhOXwI?autoplay=1&mute=1&loop=1&playlist=PoQdedhOXwI"
                    title="Villa Vredestein sfeer"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            </div>

            {/* Formulier kant */}
            <div className="login-form-wrap">
                <div className="login-card">
                    <img src="/VVLogo.png" alt="Villa Vredestein" className="login-logo" />
                    <h1 className="login-title">Welkom terug</h1>
                    <p className="login-sub">
                        Inloggen is alleen mogelijk als bewoner, gast of eigenaar van Villa Vredestein.
                        Heb je een account ontvangen? Kies hieronder je rol en log in met je gegevens.
                    </p>

                    {backendSlow && !backendReady && (
                        <p className="login-error" style={{ background: "#1a1a1a", color: "#fcbc2d", border: "1px solid #fcbc2d" }}>
                            Server wordt opgestart… even geduld (±30 sec).
                        </p>
                    )}

                    {!showResetPanel ? (
                        <form onSubmit={handleSubmit} noValidate>
                            {/* Mode selector */}
                            <div className="login-modes" role="group" aria-label="Kies je rol">
                                {MODES.map((m) => (
                                    <button
                                        key={m.value}
                                        type="button"
                                        className={`mode-btn ${loginMode === m.value ? "active" : ""}`}
                                        onClick={() => { setLoginMode(m.value); setRoom(""); setError(""); }}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>

                            {/* Kamer selector */}
                            {loginMode === "STUDENT" && (
                                <div className="login-field">
                                    <label htmlFor="roomSelect" className="login-label">Jouw kamer</label>
                                    <select
                                        id="roomSelect"
                                        value={room}
                                        onChange={(e) => setRoom(e.target.value)}
                                        required
                                        className="login-select"
                                    >
                                        <option value="">Kies je kamer…</option>
                                        {ROOM_OPTIONS.map((r) => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* E-mail */}
                            <div className="login-field">
                                <label htmlFor="login-email" className="login-label">E-mailadres</label>
                                <div className="login-input-wrap">
                                    <FiMail className="login-icon" aria-hidden="true" />
                                    <input
                                        id="login-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="jij@voorbeeld.nl"
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Wachtwoord */}
                            <div className="login-field">
                                <label htmlFor="login-password" className="login-label">Wachtwoord</label>
                                <div className="login-input-wrap">
                                    <FiLock className="login-icon" aria-hidden="true" />
                                    <input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="pw-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="forgot-link"
                                onClick={() => { setShowResetPanel(true); setResetEmail(email.trim()); setResetError(""); setResetInfo(""); }}
                            >
                                Wachtwoord vergeten?
                            </button>

                            {error && <p className="login-error" role="alert">{error}</p>}

                            <button type="submit" className="login-submit-btn" disabled={submitting}>
                                {submitting ? "Bezig…" : "Inloggen"}
                            </button>

                            <p className="login-register">
                                Nieuwe bewoner?{" "}
                                <Link to="/registeruser">Registreer hier</Link>
                            </p>
                        </form>
                    ) : (
                        <div className="reset-panel" aria-live="polite">
                            <h2 className="reset-heading">Wachtwoord resetten</h2>

                            <div className="reset-section">
                                <label htmlFor="resetEmail" className="login-label">E-mailadres</label>
                                <div className="login-input-wrap">
                                    <FiMail className="login-icon" aria-hidden="true" />
                                    <input
                                        id="resetEmail"
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder="jij@voorbeeld.nl"
                                        autoComplete="email"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="login-submit-btn"
                                    onClick={handleForgotPassword}
                                    disabled={resetLoading}
                                >
                                    {resetLoading ? "Bezig…" : "Stuur reset-link"}
                                </button>
                            </div>

                            {isDev && devToken && (
                                <div className="dev-token">
                                    <label className="login-label">Dev token</label>
                                    <input type="text" value={devToken} readOnly onFocus={(e) => e.target.select()} />
                                </div>
                            )}

                            <div className="reset-divider" />

                            <div className="reset-section">
                                <label htmlFor="resetToken" className="login-label">Token</label>
                                <input
                                    id="resetToken"
                                    type="text"
                                    value={resetToken}
                                    onChange={(e) => setResetToken(e.target.value)}
                                    placeholder="Plak je token hier…"
                                    className="login-plain-input"
                                />

                                <label htmlFor="newPassword" className="login-label">Nieuw wachtwoord</label>
                                <div className="login-input-wrap">
                                    <FiLock className="login-icon" aria-hidden="true" />
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimaal 8 tekens"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="pw-toggle"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        aria-label="Toon nieuw wachtwoord"
                                    >
                                        {showNewPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="login-submit-btn"
                                    onClick={handleResetPassword}
                                    disabled={resetLoading}
                                >
                                    {resetLoading ? "Bezig…" : "Wachtwoord instellen"}
                                </button>
                            </div>

                            {resetError && <p className="login-error" role="alert">{resetError}</p>}
                            {resetInfo && <p className="reset-success" role="status">{resetInfo}</p>}

                            <button
                                type="button"
                                className="forgot-link"
                                onClick={() => { setShowResetPanel(false); setResetError(""); setResetInfo(""); }}
                            >
                                ← Terug naar inloggen
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Login;