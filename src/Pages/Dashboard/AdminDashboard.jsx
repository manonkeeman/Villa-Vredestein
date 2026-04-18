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

            <main className="dashboard-main">
                <section className="dashboard-news">
                    <div className="dashboard-news-content">
                        <h2><FiShield /> Beheerdersomgeving</h2>
                        <p>
                            Hier beheer je alle bewoners, betalingen, documenten en schoonmaaktaken van Villa Vredestein.
                        </p>
                        <p>
                            Het volledige beheer-dashboard wordt stap voor stap uitgebreid.
                        </p>
                    </div>
                </section>

                <section className="dashboard-news">
                    <div className="dashboard-news-content">
                        <h2><FiUsers /> Bewoners</h2>
                        <p>Overzicht van alle huidige bewoners, gekoppelde kamers en contactgegevens.</p>
                        <p>Beheer accounts, wijs kamers toe en bekijk profielen.</p>
                    </div>
                </section>

                <section className="dashboard-news">
                    <div className="dashboard-news-content">
                        <h2><FiDollarSign /> Betalingen & Facturen</h2>
                        <p>Bekijk openstaande en voldane huurbetalingen per bewoner.</p>
                        <p>Stuur herinneringen en exporteer overzichten.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;
