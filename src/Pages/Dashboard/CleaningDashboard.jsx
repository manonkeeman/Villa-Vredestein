import React from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiClipboard, FiCheckSquare,
    FiAlertCircle, FiCalendar, FiUser,
} from "react-icons/fi";
import { MdOutlineCleaningServices } from "react-icons/md";
import "./StudentDashboard.css";
import "../../Styles/Global.css";

const CleaningDashboard = () => {
    const { isLoggedIn, logout, user } = useAuth();

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    return (
        <div className="StudentDashboard">
            <Helmet>
                <title>Schoonmaak — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <aside className="dashboard-sidebar" aria-label="Navigatie zijbalk">
                <header className="sidebar-profile">
                    <FiUser className="profile-icon" />
                </header>
                <h3 className="sidebar-title">Welkom {user?.username || "Schoonmaker"}</h3>

                <nav className="sidebar-nav">
                    <ul>
                        <li><Link to="#"><FiHome /> Dashboard</Link></li>
                        <li><Link to="/schoonmaakschema"><FiClipboard /> Mijn taken</Link></li>
                        <li><Link to="#"><FiCheckSquare /> Voltooide taken</Link></li>
                        <li><Link to="#"><FiCalendar /> Planning</Link></li>
                        <li><Link to="#"><FiAlertCircle /> Meldingen</Link></li>
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
                        <h2><MdOutlineCleaningServices /> Schoonmaakoverzicht</h2>
                        <p>
                            Hier vind je alle schoonmaaktaken voor Villa Vredestein, ingedeeld per week en ruimte.
                        </p>
                        <p>
                            Markeer taken als voltooid en meld bijzonderheden direct via dit dashboard.
                        </p>
                    </div>
                </section>

                <section className="dashboard-news">
                    <div className="dashboard-news-content">
                        <h2><FiClipboard /> Taken deze week</h2>
                        <p>Je weekoverzicht met alle toegewezen schoonmaaktaken wordt hier getoond.</p>
                        <p>Vink taken af zodra ze zijn afgerond.</p>
                        <Link to="/schoonmaakschema" style={{ marginTop: "0.75rem", display: "inline-block" }}>
                            Bekijk schoonmaakschema →
                        </Link>
                    </div>
                </section>

                <section className="dashboard-news">
                    <div className="dashboard-news-content">
                        <h2><FiAlertCircle /> Meldingen</h2>
                        <p>Bijzonderheden of schades kunnen hier worden gemeld aan de beheerder.</p>
                        <p>Alle meldingen worden direct doorgezet naar Manon & Maxim.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CleaningDashboard;
