import React from "react";
import { Navigate, Link, useParams } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText, FiCalendar,
    FiUser, FiUsers, FiDollarSign, FiClipboard, FiBookOpen, FiShield,
} from "react-icons/fi";
import Maxim_Manon_ChevroletSuburban from "../../Assets/Images/Maxim_Manon_ChevroletSuburban.jpg";
import PannenkoekenAvondVillaVredestein from "../../Assets/Images/PannenkoekenAvondVillaVredestein.jpg";
import "./StudentDashboard.css";
import "../../Styles/Global.css";

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

const StudentDashboard = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const { id } = useParams();

    const currentId = user?.id ?? user?.userId;
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (id && currentId && String(id) !== String(currentId)) return <Navigate to="/unauthorized" replace />;

    return (
        <div className="StudentDashboard">
            <aside className="dashboard-sidebar" aria-label="Navigatie zijbalk">
                <header className="sidebar-profile">
                    <FiUser className="profile-icon" />
                </header>
                <h3 className="sidebar-title">Welkom {user?.username || "Vredesteiner"}</h3>

                <nav className="sidebar-nav">
                    <ul>
                        <li><Link to="#"><FiHome /> Dashboard</Link></li>
                        <li><Link to="#"><FiAlertCircle /> Noodlijst</Link></li>
                        <li><Link to="#"><FiFileText /> Huisregels</Link></li>
                        <li><Link to="#"><FiClipboard /> Schoonmaakschema</Link></li>
                        <li><Link to="#"><FiDollarSign /> Betalingen</Link></li>
                        <li><Link to="#"><FiFileText /> Huurcontract</Link></li>
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
                            Je dashboard wordt stap voor stap uitgebreider: huisregels, schoonmaak, betalingen en documenten.
                        </p>
                        <p>
                            Mis je iets? Laat het ons weten via <Link to="/contact">Contact</Link>.
                        </p>
                    </div>
                </section>

                <section className="dashboard-news">
                    <img src={Maxim_Manon_ChevroletSuburban} alt="Dashboard komt eraan!" />
                    <div className="dashboard-news-content">
                        <h2><FiClipboard /> Dashboard komt eraan!</h2>
                        <p>
                            We zijn druk bezig met de ontwikkeling van een gloednieuwe Dashboard online en App voor Villa Vredestein.
                            Denk aan huurbetalingen, schoonmaakschema’s en contractbeheer – allemaal op één plek.
                        </p>
                        <p>
                            Naar verwachting gaan we in november live. Tot die tijd kun je alvast de receptenfunctie gebruiken.
                        </p>
                    </div>
                </section>

                <section className="dashboard-news">
                    <img src={PannenkoekenAvondVillaVredestein} alt="Pannenkoekenavond sfeerbeeld" />
                    <div className="dashboard-news-content">
                        <h2><FiCalendar /> Pannenkoekenavond 20 mei</h2>
                        <p>Wat een heerlijke avond vol pannenkoeken, muziek en goed gezelschap</p>
                        <p>Bekijk de foto’s en sfeerbeelden in de groepsapp of op <a href="https://www.instagram.com/villa.vredestein" target="_blank" rel="noopener noreferrer" style={{ color: "#fcbc2d", textDecoration: "underline", fontWeight: "bold" }}>
                            Instagram
                        </a>.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default StudentDashboard;