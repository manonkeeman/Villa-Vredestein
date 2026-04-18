import React from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiUsers, FiDollarSign, FiClipboard,
    FiFileText, FiSettings, FiShield, FiUser, FiTool,
} from "react-icons/fi";
import "./StudentDashboard.css";
import "../../Styles/Global.css";

const AdminDashboard = () => {
    const { isLoggedIn, logout, user } = useAuth();

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    return (
        <div className="StudentDashboard">
            <Helmet>
                <title>Beheer — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <aside className="dashboard-sidebar" aria-label="Navigatie zijbalk">
                <header className="sidebar-profile">
                    <FiShield className="profile-icon" />
                </header>
                <h3 className="sidebar-title">Welkom {user?.username || "Beheerder"}</h3>

                <nav className="sidebar-nav">
                    <ul>
                        <li><Link to="#"><FiHome /> Dashboard</Link></li>
                        <li><Link to="#"><FiUsers /> Bewoners</Link></li>
                        <li><Link to="/admin/betalingen"><FiDollarSign /> Betalingen</Link></li>
                        <li><Link to="/student/huisregels"><FiFileText /> Huisregels</Link></li>
                        <li><Link to="#"><FiFileText /> Documenten</Link></li>
                        <li><Link to="/schoonmaakschema"><FiClipboard /> Schoonmaakschema</Link></li>
                        <li><Link to="#"><FiTool /> Onderhoud</Link></li>
                        <li><Link to="#"><FiSettings /> Instellingen</Link></li>
                        <li>
                            <button onClick={logout} type="button" className="logout-button">
                                <FiLogOut /> Log uit
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="dashboard-main dashboard-grid">
                {/* Beheerdersomgeving — wide */}
                <article className="dash-card dash-card--wide">
                    <h2><FiShield /> Beheerdersomgeving</h2>
                    <p>Hier beheer je alle bewoners, betalingen, documenten en schoonmaaktaken van Villa Vredestein.</p>
                    <p>Het volledige beheer-dashboard wordt stap voor stap uitgebreid.</p>
                </article>

                {/* Bewoners */}
                <article className="dash-card">
                    <h2><FiUsers /> Bewoners</h2>
                    <p>Overzicht van alle huidige bewoners, kamers en contactgegevens.</p>
                    <p>Beheer accounts, wijs kamers toe en bekijk profielen.</p>
                </article>

                {/* Betalingen */}
                <article className="dash-card">
                    <h2><FiDollarSign /> Betalingen & Facturen</h2>
                    <p>Bekijk openstaande en voldane huurbetalingen per bewoner.</p>
                    <div className="dashboard-cleaning-meta">
                        <Link to="/admin/betalingen" className="dashboard-schema-btn">
                            <FiDollarSign /> Bekijk
                        </Link>
                    </div>
                </article>

                {/* Schoonmaakschema */}
                <article className="dash-card">
                    <h2><FiClipboard /> Schoonmaakschema</h2>
                    <p>Beheer taken, rooster en voltooiingen voor alle schoonmakers.</p>
                    <div className="dashboard-cleaning-meta">
                        <Link to="/schoonmaakschema" className="dashboard-schema-btn">
                            <FiClipboard /> Bekijk
                        </Link>
                    </div>
                </article>

                {/* Documenten */}
                <article className="dash-card">
                    <h2><FiFileText /> Documenten</h2>
                    <p>Huurcontracten, huisregels en andere documenten op één plek.</p>
                </article>
            </main>
        </div>
    );
};

export default AdminDashboard;
