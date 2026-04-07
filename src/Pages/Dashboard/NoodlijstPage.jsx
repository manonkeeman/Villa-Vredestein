import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText, FiCalendar,
    FiUser, FiUsers, FiDollarSign, FiClipboard, FiShield, FiPhone,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import "./StudentDashboard.css";
import "./NoodlijstPage.css";
import "../../Styles/Global.css";

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

const VASTE_NUMMERS = [
    { label: "Ambulance / Brandweer / Politie", number: "112", icon: "🚨" },
    { label: "Politie (geen spoed)", number: "0900-8844", icon: "🚔" },
    { label: "Huisartsenpraktijk Driebergen", number: "0343-512345", icon: "🏥" },
    { label: "Vergiftigingen Informatiecentrum", number: "030-2748888", icon: "☠️" },
    { label: "Manon Keeman (eigenaar)", number: "06-12345678", icon: "🏠" },
];

export default function NoodlijstPage() {
    const { isLoggedIn, logout, user: authUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slow, setSlow]       = useState(false);

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    useEffect(() => {
        const t = setTimeout(() => setSlow(true), 4000);
        api.get("/api/users/me")
            .then(res => setProfile(res.data))
            .catch(() => setProfile({}))
            .finally(() => { clearTimeout(t); setSlow(false); setLoading(false); });
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="StudentDashboard">
            <Helmet>
                <title>Noodlijst — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <aside className="dashboard-sidebar" aria-label="Navigatie zijbalk">
                <header className="sidebar-profile">
                    <FiUser className="profile-icon" />
                </header>
                <h3 className="sidebar-title">{authUser?.username || "Vredesteiner"}</h3>

                <nav className="sidebar-nav">
                    <ul>
                        <li><Link to="/student"><FiHome /> Dashboard</Link></li>
                        <li><Link to="/student/profiel"><FiUser /> Mijn profiel</Link></li>
                        <li><Link to="/student/noodlijst" className="active"><FiAlertCircle /> Noodlijst</Link></li>
                        <li><Link to="#"><FiFileText /> Huisregels</Link></li>
                        <li><Link to="#"><FiClipboard /> Schoonmaakschema</Link></li>
                        <li><Link to="#"><FiDollarSign /> Betalingen</Link></li>
                        <li><Link to="#"><FiFileText /> Huurcontract</Link></li>
                        <li><Link to="#"><FiUsers /> Samen eten?</Link></li>
                        <li><Link to="#"><FiCalendar /> Events</Link></li>

                        {hasRole(authUser, "ADMIN") && (
                            <li>
                                <Link to="/admin" className="admin-link">
                                    <FiShield /> Admin Dashboard
                                </Link>
                            </li>
                        )}
                        <li>
                            <button onClick={logout} type="button" className="logout-button">
                                <FiLogOut /> Log uit
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="dashboard-main">

                {/* Persoonlijk noodnummer */}
                <section className="dashboard-news nood-card">
                    <div className="dashboard-news-content">
                        <h2><FiUser /> Jouw noodnummer</h2>
                        {loading ? (
                            <p className="nood-loading">
                                {slow ? "Server wordt opgestart… even geduld." : "Laden…"}
                            </p>
                        ) : profile?.emergencyPhoneNumber ? (
                            <>
                                <p className="nood-number">
                                    <FiPhone /> {profile.emergencyPhoneNumber}
                                </p>
                                <p className="nood-sub">
                                    Dit noodnummer staat op jouw profiel. Je kunt het aanpassen via{" "}
                                    <Link to="/student/profiel">Mijn profiel</Link>.
                                </p>
                            </>
                        ) : (
                            <p className="nood-empty">
                                Je hebt nog geen noodnummer ingesteld.{" "}
                                <Link to="/student/profiel">Voeg het toe via Mijn profiel →</Link>
                            </p>
                        )}
                    </div>
                </section>

                {/* Vaste noodreparaties */}
                <section className="dashboard-news nood-card">
                    <div className="dashboard-news-content">
                        <h2><FiAlertCircle /> Belangrijke nummers</h2>
                        <ul className="nood-list">
                            {VASTE_NUMMERS.map(({ label, number, icon }) => (
                                <li key={number} className="nood-item">
                                    <span className="nood-icon">{icon}</span>
                                    <span className="nood-label">{label}</span>
                                    <a href={`tel:${number.replace(/[^0-9+]/g, "")}`} className="nood-tel">
                                        <FiPhone /> {number}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

            </main>
        </div>
    );
}
