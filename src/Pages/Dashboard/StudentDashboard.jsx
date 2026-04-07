import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link, useParams } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText, FiCalendar,
    FiUser, FiUsers, FiDollarSign, FiClipboard, FiBookOpen, FiShield,
} from "react-icons/fi";
import "./StudentDashboard.css";
import "../../Styles/Global.css";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

const StudentDashboard = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const { id } = useParams();
    const [contractFile, setContractFile] = useState(null);

    const currentId = user?.id ?? user?.userId;
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (id && currentId && String(id) !== String(currentId)) return <Navigate to="/unauthorized" replace />;

    useEffect(() => {
        setContractFile(user?.contractFile || null);
    }, [user?.contractFile]);

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
                        <h2><FiBookOpen /> Welkom in Villa Vredestein</h2>
                        <p>
                            Dit is jouw persoonlijke omgeving. Hier vind je alles wat je nodig hebt als bewoner van Villa Vredestein.
                        </p>
                        <p>
                            Mis je iets of heb je een vraag? Neem contact op via <Link to="/contact">Contact</Link>.
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
                        <h2><FiClipboard /> Schoonmaakschema</h2>
                        <p>Bekijk jouw taken voor deze week en vink ze af zodra ze gedaan zijn.</p>
                        <p>Het rooster wisselt wekelijks zodat iedereen gelijk bijdraagt.</p>
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
