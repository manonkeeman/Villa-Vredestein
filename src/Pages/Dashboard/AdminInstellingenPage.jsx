import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiSettings, FiSave, FiUser, FiLock, FiBell, FiHome, FiRefreshCw,
} from "react-icons/fi";
import DashboardLayout from "./DashboardLayout.jsx";
import { AdminSidebar } from "./AdminBetalingenMatrix.jsx";
import "./StudentDashboard.css";
import "./AdminPages.css";
import "../../Styles/Global.css";

const AdminInstellingenPage = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const [saved, setSaved] = useState(false);

    // Villa info fields
    const [villaName,    setVillaName]    = useState("Villa Vredestein");
    const [villaAddress, setVillaAddress] = useState("Laan van Vredestein 1, Utrecht");
    const [villaEmail,   setVillaEmail]   = useState("beheer@villavredestein.nl");
    const [villaPhone,   setVillaPhone]   = useState("+31 6 12345678");

    // Notification settings
    const [notifyPayment,  setNotifyPayment]  = useState(true);
    const [notifyTicket,   setNotifyTicket]   = useState(true);
    const [notifyContract, setNotifyContract] = useState(true);

    // Password change
    const [currentPw,  setCurrentPw]  = useState("");
    const [newPw,      setNewPw]      = useState("");
    const [confirmPw,  setConfirmPw]  = useState("");
    const [pwMsg,      setPwMsg]      = useState(null);

    const handleSaveVilla = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (newPw !== confirmPw) {
            setPwMsg({ ok: false, text: "Wachtwoorden komen niet overeen." });
            return;
        }
        if (newPw.length < 8) {
            setPwMsg({ ok: false, text: "Wachtwoord moet minimaal 8 tekens zijn." });
            return;
        }
        // TODO: call /api/users/me/password when backend is ready
        setPwMsg({ ok: true, text: "Wachtwoord gewijzigd." });
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

            {/* Villa informatie */}
            <section className="admin-section" style={{ marginBottom: "2rem" }}>
                <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <FiHome /> Villa informatie
                </h2>
                <form className="comm-form" onSubmit={handleSaveVilla}>
                    <div className="comm-form-row">
                        <div className="comm-field comm-field--grow">
                            <label>Naam</label>
                            <input type="text" value={villaName} onChange={e => setVillaName(e.target.value)} />
                        </div>
                        <div className="comm-field comm-field--grow">
                            <label>Adres</label>
                            <input type="text" value={villaAddress} onChange={e => setVillaAddress(e.target.value)} />
                        </div>
                    </div>
                    <div className="comm-form-row">
                        <div className="comm-field comm-field--grow">
                            <label>E-mailadres</label>
                            <input type="email" value={villaEmail} onChange={e => setVillaEmail(e.target.value)} />
                        </div>
                        <div className="comm-field comm-field--grow">
                            <label>Telefoonnummer</label>
                            <input type="tel" value={villaPhone} onChange={e => setVillaPhone(e.target.value)} />
                        </div>
                    </div>
                    {saved && <p style={{ fontSize: 13, color: "#2ecc71" }}>Opgeslagen!</p>}
                    <button type="submit" className="admin-btn">
                        <FiSave /> Opslaan
                    </button>
                </form>
            </section>

            {/* Meldingen */}
            <section className="admin-section" style={{ marginBottom: "2rem" }}>
                <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <FiBell /> E-mailmeldingen
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    {[
                        ["Herinnering bij openstaande betaling", notifyPayment, setNotifyPayment],
                        ["Melding bij nieuw support-ticket",     notifyTicket,  setNotifyTicket],
                        ["Herinnering bij verlopen contract",    notifyContract,setNotifyContract],
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
            </section>

            {/* Wachtwoord wijzigen */}
            <section className="admin-section">
                <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <FiLock /> Wachtwoord wijzigen
                </h2>
                <form className="comm-form" onSubmit={handleChangePassword} style={{ maxWidth: 420 }}>
                    <div className="comm-field">
                        <label>Huidig wachtwoord</label>
                        <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} required />
                    </div>
                    <div className="comm-field">
                        <label>Nieuw wachtwoord</label>
                        <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={8} />
                    </div>
                    <div className="comm-field">
                        <label>Bevestig nieuw wachtwoord</label>
                        <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required />
                    </div>
                    {pwMsg && <p style={{ fontSize: 13, color: pwMsg.ok ? "#2ecc71" : "#e74c3c" }}>{pwMsg.text}</p>}
                    <button type="submit" className="admin-btn">
                        <FiRefreshCw /> Wachtwoord wijzigen
                    </button>
                </form>
            </section>
        </DashboardLayout>
    );
};

export default AdminInstellingenPage;
