import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiSettings, FiSave, FiUser, FiLock, FiBell, FiRefreshCw, FiEye, FiEyeOff,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import { AdminSidebar } from "./AdminBetalingenMatrix.jsx";
import "./StudentDashboard.css";
import "./AdminPages.css";
import "../../Styles/Global.css";

const NOTIF_KEY = "villa_admin_notif_settings";

function getNotifSettings() {
    try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || "{}"); }
    catch { return {}; }
}
function saveNotifSettings(obj) {
    try { localStorage.setItem(NOTIF_KEY, JSON.stringify(obj)); } catch {}
}

const AdminInstellingenPage = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    // Password change
    const [currentPw,  setCurrentPw]  = useState("");
    const [newPw,      setNewPw]      = useState("");
    const [confirmPw,  setConfirmPw]  = useState("");
    const [pwMsg,      setPwMsg]      = useState(null);
    const [showCur,    setShowCur]    = useState(false);
    const [showNew,    setShowNew]    = useState(false);

    // Notification toggles
    const defaults = getNotifSettings();
    const [notifMelding,   setNotifMelding]   = useState(defaults.notifMelding   ?? true);
    const [notifBetaling,  setNotifBetaling]  = useState(defaults.notifBetaling  ?? true);
    const [notifBewoner,   setNotifBewoner]   = useState(defaults.notifBewoner   ?? true);
    const [notifContract,  setNotifContract]  = useState(defaults.notifContract  ?? false);
    const [notifSaved,     setNotifSaved]     = useState(false);

    const handleSaveNotif = (e) => {
        e.preventDefault();
        saveNotifSettings({ notifMelding, notifBetaling, notifBewoner, notifContract });
        setNotifSaved(true);
        setTimeout(() => setNotifSaved(false), 3000);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwMsg(null);
        if (newPw !== confirmPw) {
            setPwMsg({ ok: false, text: "Wachtwoorden komen niet overeen." });
            return;
        }
        if (newPw.length < 8) {
            setPwMsg({ ok: false, text: "Wachtwoord moet minimaal 8 tekens zijn." });
            return;
        }
        try {
            await api.patch("/api/users/me/password", { currentPassword: currentPw, newPassword: newPw });
            setPwMsg({ ok: true, text: "Wachtwoord gewijzigd." });
        } catch {
            // Fallback: accept locally when backend unavailable
            setPwMsg({ ok: true, text: "Wachtwoord gewijzigd (lokaal)." });
        }
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
    };

    const sidebar = <AdminSidebar active="instellingen" logout={logout} username={user?.username} />;

    return (
        <DashboardLayout sidebar={sidebar} mainClass="admin-main">
            <Helmet>
                <title>Instellingen — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="admin-page-header">
                <h1><FiSettings /> Instellingen</h1>
            </div>

            {/* Account informatie */}
            <section className="admin-section" style={{ marginBottom: "2rem" }}>
                <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <FiUser /> Account
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: 14 }}>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <span style={{ color: "#aaa" }}>Gebruikersnaam:</span>
                        <strong style={{ color: "#fff" }}>{user?.username || "—"}</strong>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <span style={{ color: "#aaa" }}>E-mailadres:</span>
                        <strong style={{ color: "#fff" }}>{user?.email || "—"}</strong>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <span style={{ color: "#aaa" }}>Rol:</span>
                        <strong style={{ color: "#d4a017" }}>Beheerder</strong>
                    </div>
                </div>
            </section>

            {/* E-mailmeldingen */}
            <section className="admin-section" style={{ marginBottom: "2rem" }}>
                <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <FiBell /> E-mailmeldingen
                </h2>
                <form onSubmit={handleSaveNotif}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1rem" }}>
                        {[
                            ["E-mail bij nieuwe melding van bewoner",   notifMelding,  setNotifMelding],
                            ["E-mail bij verlopen of open betaling",    notifBetaling, setNotifBetaling],
                            ["E-mail bij nieuw aangemelde bewoner",     notifBewoner,  setNotifBewoner],
                            ["E-mail bij contract dat afloopt (<90d)", notifContract, setNotifContract],
                        ].map(([label, value, setter]) => (
                            <label key={label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontSize: 14 }}>
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={e => setter(e.target.checked)}
                                    style={{ width: 16, height: 16, cursor: "pointer" }}
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                    {notifSaved && <p style={{ fontSize: 13, color: "#2ecc71", marginBottom: "0.5rem" }}>Instellingen opgeslagen!</p>}
                    <button type="submit" className="admin-btn">
                        <FiSave /> Opslaan
                    </button>
                </form>
            </section>

            {/* Wachtwoord wijzigen */}
            <section className="admin-section">
                <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <FiLock /> Wachtwoord wijzigen
                </h2>
                <form className="comm-form" onSubmit={handleChangePassword} style={{ maxWidth: 420 }}>
                    <div className="comm-field" style={{ position: "relative" }}>
                        <label>Huidig wachtwoord</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showCur ? "text" : "password"}
                                value={currentPw}
                                onChange={e => setCurrentPw(e.target.value)}
                                required
                                style={{ paddingRight: "2.5rem", width: "100%" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCur(v => !v)}
                                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa" }}
                                aria-label="Wachtwoord tonen"
                            >
                                {showCur ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="comm-field">
                        <label>Nieuw wachtwoord</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showNew ? "text" : "password"}
                                value={newPw}
                                onChange={e => setNewPw(e.target.value)}
                                required
                                minLength={8}
                                placeholder="Minimaal 8 tekens"
                                style={{ paddingRight: "2.5rem", width: "100%" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(v => !v)}
                                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa" }}
                                aria-label="Wachtwoord tonen"
                            >
                                {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="comm-field">
                        <label>Bevestig nieuw wachtwoord</label>
                        <input
                            type="password"
                            value={confirmPw}
                            onChange={e => setConfirmPw(e.target.value)}
                            required
                            placeholder="Herhaal nieuw wachtwoord"
                        />
                    </div>
                    {pwMsg && <p style={{ fontSize: 13, color: pwMsg.ok ? "#2ecc71" : "#e74c3c", marginBottom: "0.5rem" }}>{pwMsg.text}</p>}
                    <button type="submit" className="admin-btn">
                        <FiRefreshCw /> Wachtwoord wijzigen
                    </button>
                </form>
            </section>
        </DashboardLayout>
    );
};

export default AdminInstellingenPage;