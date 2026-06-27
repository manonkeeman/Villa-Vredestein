import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import { useGoogleLogin } from "@react-oauth/google";
import Spinner from "../../Components/Spinner/Spinner";
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

const ROOM_OPTIONS = ["Argentinië", "Frankrijk", "Italië", "Japan", "Thailand"];

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
    const [submitSlow, setSubmitSlow] = useState(false);
    const warmupDone = useRef(false);

    useEffect(() => {
        if (warmupDone.current) return;
        warmupDone.current = true;
        const slowTimer = setTimeout(() => setBackendSlow(true), 2500);
        fetch(`${API_BASE}/actuator/health`, { signal: AbortSignal.timeout(50000) })
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
        setSubmitSlow(false);
        const cleanEmail = email.trim();
        const slowTimer = setTimeout(() => setSubmitSlow(true), 2500);
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
        } catch (err) {
            const isTimeout = err?.code === "ECONNABORTED" || err?.message?.includes("timeout");
            setError(isTimeout
                ? "De server reageert niet, wacht even en probeer opnieuw."
                : "Er ging iets mis. Probeer het opnieuw."
            );
        } finally {
            clearTimeout(slowTimer);
            setSubmitSlow(false);
            setSubmitting(false);
        }
    };

    const handleGoogleSuccess = async (tokenResponse) => {
        setError("");
        setSubmitting(true);
        setSubmitSlow(false);
        const slowTimer = setTimeout(() => setSubmitSlow(true), 2500);
        try {
            if (loginMode === "STUDENT" && !room) { setError("Kies eerst je kamer."); return; }
            const res = await fetch(`${API_BASE}/api/auth/google-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken: tokenResponse.access_token, loginMode, room: room || null }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) { setError(data?.message || "Google login mislukt."); return; }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user ?? data));
            const user = safeParseUser();

            if (loginMode === "STUDENT" && user) {
                const assignedRoom = getUserRoomName(user);
                if (assignedRoom && norm(assignedRoom) !== norm(room)) {
                    setError(`Verkeerde kamer gekozen. Dit account hoort bij: ${assignedRoom}.`);
                    return;
                }
            }

            const fromPath = location.state?.from?.pathname;
            const fallback = defaultDashboardForMode(user, loginMode);
            navigate(
                isSafeRedirect(fromPath) && canAccessPathForMode(fromPath, loginMode) ? fromPath : fallback,
                { replace: true }
            );
        } catch { setError("Er ging iets mis bij Google login. Probeer opnieuw."); }
        finally { clearTimeout(slowTimer); setSubmitSlow(false); setSubmitting(false); }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => setError("Google login geannuleerd of mislukt."),
        flow: "implicit",
    });

    return (
        <main className="login-page">
            <Helmet>
                <title>Inloggen, Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            {/* Video kant — IVA: een dag op kamers */}
            <div className="login-media">
                <iframe
                    className="login-video"
                    src="https://www.youtube-nocookie.com/embed/p_YEM_X8QQs?autoplay=1&mute=1&loop=1&playlist=p_YEM_X8QQs&rel=0&playsinline=1"
                    title="Een dag op kamers bij IVA"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>

            {/* Formulier kant */}
            <div className="login-form-wrap">
                <div className={`login-card${submitting ? " login-card--loading" : ""}`}>
                    {submitting && (
                        <div className="login-overlay" aria-live="polite">
                            <div className="login-overlay__spinner" />
                            <span className="login-overlay__label">
                                {submitSlow ? "Server wordt opgestart… even geduld (±30 sec)." : "Bezig met inloggen…"}
                            </span>
                        </div>
                    )}
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
                                        disabled={submitting}
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
                                        disabled={submitting}
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
                                        disabled={submitting}
                                    />
                                    <button
                                        type="button"
                                        className="pw-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}
                                        disabled={submitting}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="forgot-link"
                                onClick={() => { setShowResetPanel(true); setResetEmail(email.trim()); setResetError(""); setResetInfo(""); }}
                                disabled={submitting}
                            >
                                Wachtwoord vergeten?
                            </button>

                            {error && <p className="login-error" role="alert">{error}</p>}

                            <button
                                type="submit"
                                className={`login-submit-btn${submitting ? " login-submit-btn--loading" : ""}`}
                                disabled={submitting}
                            >
                                {submitting ? <><Spinner />&nbsp;Inloggen…</> : "Inloggen"}
                            </button>

                            <div className="login-divider"><span>of</span></div>

                            <button
                                type="button"
                                className="login-google-btn"
                                onClick={() => googleLogin()}
                                disabled={submitting}
                            >
                                <svg className="login-google-icon" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Inloggen met Google
                            </button>

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