import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Link, useParams } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText, FiCalendar,
    FiUser, FiUsers, FiDollarSign, FiClipboard, FiBookOpen, FiShield,
} from "react-icons/fi";
import Watetenwevandaag from "../../Assets/Images/Watetenwevandaag.jpg";
import WonenenWerkeninVredestein from "../../Assets/Images/WonenenWerkeninVredestein.jpg";
import PannenkoekenAvondVillaVredestein from "../../Assets/Images/PannenkoekenAvondVillaVredestein.jpg";
import "./StudentDashboard.css";
import "../../Styles/Global.css";

const StudentDashboard = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const { id } = useParams();
    const [secureData, setSecureData] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem("accessToken");

            try {
                const response = await axios.get("https://api.datavortex.nl/VillaVredesteinLogin", {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Api-Key": "villavredesteinlogin:2NkpAp3ZiXKfSlM4fwxW",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                setSecureData(response.data);
            } catch (err) {
                console.warn("Admin data ophalen mislukt:", err?.response?.status);
            }
        };

        if (user?.sub === "admin@villavredestein.com") {
            fetchAdminData();
        }
    }, [user]);

    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (id && parseInt(id) !== user?.userId) return <Navigate to="/unauthorized" replace />;

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
                        <li><Link to="/recipes"><FiBookOpen /> Recepten</Link></li>
                        <li><Link to="#"><FiUsers /> Samen eten?</Link></li>
                        <li><Link to="#"><FiCalendar /> Events</Link></li>

                        {user?.sub === "admin@villavredestein.com" && (
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
                    <img src={Watetenwevandaag} alt="Wat eten we vandaag?" />
                    <div className="dashboard-news-content">
                        <h2><FiBookOpen /> Nieuw: Receptenzoeker</h2>
                        <p>
                            We hebben iets nieuws! Met de <Link to="/recipes">Receptenzoeker</Link> kun je nu eenvoudig filteren op maaltijdtype, dieet en wereldkeuken.
                        </p>
                        <p>
                            Ideaal om inspiratie op te doen met je huisgenoten of iets lekkers voor jezelf te maken.
                            Ingrediëntenlijst klaar? Deel het recept direct via WhatsApp.
                        </p>
                    </div>
                </section>

                <section className="dashboard-news">
                    <img src={WonenenWerkeninVredestein} alt="Dashboard komt eraan!" />
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

                {user?.sub === "admin@villavredestein.com" && secureData && (
                    <section className="dashboard-data">
                        <h4>Ingelogde gegevens:</h4>
                        <pre>{JSON.stringify(secureData, null, 2)}</pre>
                    </section>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;