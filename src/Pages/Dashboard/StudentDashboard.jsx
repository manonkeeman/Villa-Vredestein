import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText,
    FiCalendar, FiUser, FiUsers, FiDollarSign,
    FiClipboard, FiBookOpen
} from "react-icons/fi";
import "./StudentDashboard.css";
import "../../Styles/Global.css";

const StudentDashboard = () => {
    const { isLoggedIn, logout } = useAuth();
    const [openMenu] = useState(false);
    const [secureData, setSecureData] = useState(null);

    useEffect(() => {
        const fetchSecureData = async () => {
            try {
                const response = await axios.get("https://api.datavortex.nl/VillaVredesteinLogin", {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Api-Key": "villavredesteinlogin:2NkpAp3ZiXKfSlM4fwxW"
                    },
                });
                setSecureData(response.data);
            } catch (error) {
                console.error("❌ Mislukt om beveiligde data op te halen:", error);
                setSecureData({ message: "Toegang geweigerd of server fout" });
            }
        };

        fetchSecureData();
    }, []);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="StudentDashboard">
            <aside className="dashboard-sidebar" aria-label="Navigatie zijbalk">
                <header className="sidebar-profile">
                    <FiUser className="profile-icon" />
                </header>
                <h3 className="sidebar-title">Welkom Vredesteiner</h3>

                <nav className={`sidebar-nav ${openMenu ? "open" : ""}`}>
                    <ul>
                        <li><Link to="#"><FiHome /> Dashboard</Link></li>
                        <li><Link to="#"><FiAlertCircle /> NOODLIJST</Link></li>
                        <li><Link to="#"><FiFileText /> Huisregels</Link></li>
                        <li><Link to="#"><FiClipboard /> Schoonmaakschema</Link></li>
                        <li><Link to="#"><FiDollarSign /> Betalingen</Link></li>
                        <li><Link to="#"><FiFileText /> Huurcontract</Link></li>
                        <li><Link to="/receptenzoeker"><FiBookOpen /> Recepten</Link></li>
                        <li><Link to="#"><FiUsers /> Samen eten?</Link></li>
                        <li><Link to="#"><FiCalendar /> Events</Link></li>
                        <li>
                            <button onClick={logout} type="button" className="logout-button">
                                <FiLogOut /> Log uit
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="dashboard-main">
                <section className="image-box" aria-label="Introductievideo">
                    <iframe
                        className="dashboard-video"
                        src="https://www.youtube.com/embed/B7UmUX68KtE?autoplay=1&mute=1&loop=1&playlist=B7UmUX68KtE"
                        title="Welkom bij Villa Vredestein"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </section>

                <section className="secure-data" aria-label="Beveiligde gegevens">
                    <h2>Beveiligde Data</h2>
                    {secureData ? (
                        <pre>{JSON.stringify(secureData, null, 2)}</pre>
                    ) : (
                        <p>Beveiligde data wordt geladen...</p>
                    )}
                </section>
            </main>
        </div>
    );
};

export default StudentDashboard;