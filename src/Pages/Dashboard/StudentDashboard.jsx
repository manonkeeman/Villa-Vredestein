import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link, useParams } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText, FiCalendar,
    FiUser, FiUsers, FiDollarSign, FiClipboard, FiBookOpen, FiShield,
} from "react-icons/fi";
import { MdOutlineCleaningServices } from "react-icons/md";
import api from "../../Helpers/AxiosHelper.js";
import "./StudentDashboard.css";
import "../../Styles/Global.css";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

// ISO week number (ISO 8601)
const getIsoWeek = (date = new Date()) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// 6-week rotation cycle: ((isoWeek - 1) % 6) + 1
const getCurrentRotationWeek = () => ((getIsoWeek() - 1) % 6) + 1;

const StudentDashboard = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const { id } = useParams();
    const [contractFile, setContractFile] = useState(null);
    const [scheduleInfo, setScheduleInfo] = useState(null);

    const currentId = user?.id ?? user?.userId;
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (id && currentId && String(id) !== String(currentId)) return <Navigate to="/unauthorized" replace />;

    const rotationWeek = getCurrentRotationWeek();

    useEffect(() => {
        setContractFile(user?.contractFile || null);
    }, [user?.contractFile]);

    useEffect(() => {
        api.get("/api/cleaning/schedule/info")
            .then(res => setScheduleInfo(res.data))
            .catch(() => {});
    }, []);

    return (
        <div className="StudentDashboard">
            <Helmet>
                <title>Mijn Dashboard — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <aside className="dashboard-sidebar" aria-label="Navigatie zijbalk">
                <header className="sidebar-profile">
                    <FiUser className="profile-icon" />
                </header>
                <h3 className="sidebar-title">Welkom {user?.username || "Vredesteiner"}</h3>

                <nav className="sidebar-nav">
                    <ul>
                        <li><Link to="/student"><FiHome /> Dashboard</Link></li>
                        <li><Link to="/student/profiel"><FiUser /> Mijn profiel</Link></li>
                        <li><Link to="/student/noodlijst"><FiAlertCircle /> Noodlijst</Link></li>
                        <li><Link to="/student/huisregels"><FiFileText /> Huisregels</Link></li>
                        <li><Link to="/schoonmaakschema"><FiClipboard /> Schoonmaakschema</Link></li>
                        <li><Link to="#"><FiDollarSign /> Betalingen</Link></li>
                        <li>
                            {contractFile
                                ? <a href={`${BASE_URL}/uploads/${encodeURIComponent(contractFile)}`} target="_blank" rel="noopener noreferrer"><FiFileText /> Huurcontract</a>
                                : <Link to="#"><FiFileText /> Huurcontract</Link>
                            }
                        </li>
                        <li><Link to="#"><FiUsers /> Samen eten?</Link></li>
                        <li><Link to="#"><FiCalendar /> Events</Link></li>

                        {hasRole(user, "ADMIN") && (
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
                <section className="dashboard-news">
                    <div className="dashboard-news-content">
                        <h2><FiBookOpen /> Fijn dat je er bent!</h2>
                        <p>
                            Dit is jouw plek in de villa. Hier vind je alles terug: je schema, huisregels, contract en meer.
                        </p>
                        <p>
                            Kom je er niet uit of heb je een vraag? Stuur gerust een berichtje via <Link to="/contact">Contact</Link>.
                        </p>
                    </div>
                </section>

                <section className="dashboard-news">
                    <div className="dashboard-news-content">
                        <h2><FiDollarSign /> Betalingen</h2>
                        <p>Bekijk je openstaande en voldane huurbetalingen en ontvang een herinnering wanneer iets afloopt.</p>
                        <p>Alle facturen staan overzichtelijk voor je klaar.</p>
                    </div>
                </section>

                <section className="dashboard-news">
                    <div className="dashboard-news-content">
                        <h2><MdOutlineCleaningServices /> Schoonmaakschema</h2>
                        <p>Bekijk jouw taken voor deze week en vink ze af zodra ze gedaan zijn.</p>
                        <p>Het rooster wisselt wekelijks zodat iedereen gelijk bijdraagt.</p>
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
                        <h2><FiCalendar /> Events & nieuws</h2>
                        <p>Blijf op de hoogte van activiteiten, etentjes en andere momenten in en rondom de villa.</p>
                        <p>Volg ook <a href="https://www.instagram.com/villa.vredestein" target="_blank" rel="noopener noreferrer">@villa.vredestein</a> op Instagram.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default StudentDashboard;
