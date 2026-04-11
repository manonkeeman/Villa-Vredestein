import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiClipboard, FiCheckSquare,
    FiAlertCircle, FiCalendar, FiUser,
} from "react-icons/fi";
import { MdOutlineCleaningServices } from "react-icons/md";
import api from "../../Helpers/AxiosHelper.js";
import "./StudentDashboard.css";
import "../../Styles/Global.css";

// ISO week number (ISO 8601)
const getIsoWeek = (date = new Date()) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// 6-week rotation cycle: ((isoWeek - 1) % 6) + 1
const getCurrentRotationWeek = () => ((getIsoWeek() - 1) % 6) + 1;

const CleaningDashboard = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const [scheduleInfo, setScheduleInfo] = useState(null);

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const rotationWeek = getCurrentRotationWeek();

    useEffect(() => {
        api.get("/api/cleaning/schedule/info")
            .then(res => setScheduleInfo(res.data))
            .catch(() => {});
    }, []);

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
                        <div className="dashboard-cleaning-meta">
                            <span className="dashboard-rotation-badge">
                                Rotatieweek {rotationWeek}
                                <span className="week-current-badge">nu</span>
                            </span>
                            {scheduleInfo && (
                                <span className="week-iso-label">
                                    ISO week {scheduleInfo.isoWeek} · {scheduleInfo.year}
                                </span>
                            )}
                            <Link to="/schoonmaakschema" className="dashboard-schema-btn">
                                <FiClipboard /> Bekijk schema
                            </Link>
                        </div>
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
