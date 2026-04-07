import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText, FiCalendar,
    FiUser, FiUsers, FiDollarSign, FiClipboard, FiShield,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import "./StudentDashboard.css";
import "./HuisregelsPage.css";
import "../../Styles/Global.css";

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

export default function HuisregelsPage() {
    const { isLoggedIn, logout, user: authUser } = useAuth();
    const [contractFile, setContractFile] = useState(null);

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    useEffect(() => {
        api.get("/api/users/me")
            .then(res => setContractFile(res.data.contractFile || null))
            .catch(() => {});
    }, []);

    return (
        <div className="StudentDashboard">
            <Helmet>
                <title>Huisregels — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* ── Sidebar ── */}
            <aside className="dashboard-sidebar" aria-label="Navigatie zijbalk">
                <header className="sidebar-profile">
                    <FiUser className="profile-icon" />
                </header>
                <h3 className="sidebar-title">{authUser?.username || "Vredesteiner"}</h3>
                <nav className="sidebar-nav">
                    <ul>
                        <li><Link to="/student"><FiHome /> Dashboard</Link></li>
                        <li><Link to="/student/profiel"><FiUser /> Mijn profiel</Link></li>
                        <li><Link to="/student/noodlijst"><FiAlertCircle /> Noodlijst</Link></li>
                        <li><Link to="/student/huisregels" className="active"><FiFileText /> Huisregels</Link></li>
                        <li><Link to="#"><FiClipboard /> Schoonmaakschema</Link></li>
                        <li><Link to="#"><FiDollarSign /> Betalingen</Link></li>
                        <li>
                            {contractFile
                                ? <a href={`${BASE_URL}/uploads/${encodeURIComponent(contractFile)}`} target="_blank" rel="noopener noreferrer"><FiFileText /> Huurcontract</a>
                                : <Link to="#"><FiFileText /> Huurcontract</Link>
                            }
                        </li>
                        <li><Link to="#"><FiUsers /> Samen eten?</Link></li>
                        <li><Link to="#"><FiCalendar /> Events</Link></li>
                        {hasRole(authUser, "ADMIN") && (
                            <li><Link to="/admin" className="admin-link"><FiShield /> Admin Dashboard</Link></li>
                        )}
                        <li>
                            <button onClick={logout} type="button" className="logout-button">
                                <FiLogOut /> Log uit
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* ── Main ── */}
            <main className="dashboard-main huis-main">

                {/* Hero */}
                <div className="huis-hero">
                    <span className="huis-hero-icon">🏛️</span>
                    <div>
                        <strong>Huisregels Villa Vredestein 2025</strong>
                        <p>Rust · Verantwoordelijkheid · Respect — de basis van ons samenleven</p>
                    </div>
                </div>

                {/* 1. Over Villa Vredestein */}
                <section className="huis-intro">
                    <p>Villa Vredestein is een woonhuis waar bewoners de ruimte krijgen om te studeren, te wonen en zich te ontwikkelen. De beheerder streeft naar een balans tussen vrijheid en gezamenlijke zorg voor de woning. Iedere bewoner draagt actief bij aan orde, netheid en een goede sfeer.</p>
                </section>

                {/* Kernwaarden */}
                <div className="huis-values">
                    {[
                        { icon: "🤝", label: "Respect" },
                        { icon: "📚", label: "Studie" },
                        { icon: "🏠", label: "Zorg" },
                        { icon: "🌿", label: "Rust" },
                    ].map(({ icon, label }) => (
                        <div key={label} className="huis-value-tile">
                            <span>{icon}</span>
                            <strong>{label}</strong>
                        </div>
                    ))}
                </div>

                {/* 2 + 3. Gedrag & Rust (2-col) */}
                <div className="huis-two-col">
                    <section className="huis-block huis-block--gold">
                        <div className="huis-block-header">
                            <span>🤝</span><h2>Gedrag & Samenleven</h2>
                        </div>
                        <ul className="huis-list">
                            <li><span>✊</span><span>Behandel elkaar met respect, ongeacht achtergrond, geslacht of overtuiging</span></li>
                            <li><span>🍽️</span><span>Gebruik gemeenschappelijke ruimtes op een manier die rekening houdt met anderen</span></li>
                            <li><span>💬</span><span>Houd de toon vriendelijk — conflicten bespreek je rustig, nooit via berichten of roddels</span></li>
                        </ul>
                    </section>

                    <section className="huis-block huis-block--purple">
                        <div className="huis-block-header">
                            <span>🔇</span><h2>Rust & Geluid</h2>
                        </div>
                        <div className="huis-time-badge">
                            <span className="huis-time">22:00</span>
                            <span className="huis-time-sep">→</span>
                            <span className="huis-time">07:00</span>
                            <span className="huis-time-label">Geluidsstilte</span>
                        </div>
                        <ul className="huis-list">
                            <li><span>🎵</span><span>Geen muziek, feestjes of geluidsoverlast</span></li>
                            <li><span>⚠️</span><span>Overtreding wordt direct gemeld aan de beheerder</span></li>
                        </ul>
                    </section>
                </div>

                {/* 4 + 5. Bezoek & Schoonmaak (2-col) */}
                <div className="huis-two-col">
                    <section className="huis-block huis-block--blue">
                        <div className="huis-block-header">
                            <span>🚪</span><h2>Bezoek & Logees</h2>
                        </div>
                        <ul className="huis-list">
                            <li><span>☀️</span><span>Bezoek is welkom overdag</span></li>
                            <li><span>🛏️</span><span>Logeren is niet toegestaan zonder toestemming van de beheerder</span></li>
                            <li><span>📋</span><span>Elke overnachting zonder melding = overtreding van de huisregels</span></li>
                        </ul>
                    </section>

                    <section className="huis-block huis-block--green">
                        <div className="huis-block-header">
                            <span>🧹</span><h2>Schoonmaak & Hygiëne</h2>
                        </div>
                        <ul className="huis-list">
                            <li><span>📅</span><span>Volg het schoonmaakrooster en voer taken tijdig uit</span></li>
                            <li><span>✨</span><span>Laat gedeelde ruimtes altijd netjes achter</span></li>
                            <li><span>♻️</span><span>Afval scheiden: plastic · papier · rest · GFT</span></li>
                            <li><span>🐛</span><span>Insecten, schimmel of stank door nalatigheid = bewoners verantwoordelijkheid</span></li>
                        </ul>
                    </section>
                </div>

                {/* 6. Veiligheid */}
                <section className="huis-block huis-block--red">
                    <div className="huis-block-header">
                        <span>🛡️</span><h2>Veiligheid</h2>
                    </div>
                    <div className="huis-safety-grid">
                        {[
                            { icon: "🔔", text: "Brandmelders aanwezig — test maandelijks" },
                            { icon: "🚪", text: "Vluchtwegen & gangen te allen tijde vrij" },
                            { icon: "🔌", text: "Alleen goedgekeurde elektrische apparaten" },
                            { icon: "🚭", text: "Open vuur, kaarsen en roken verboden" },
                        ].map(({ icon, text }) => (
                            <div key={text} className="huis-safety-tile">
                                <span className="huis-safety-icon">{icon}</span>
                                <span className="huis-safety-text">{text}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 7. Betalingen */}
                <section className="huis-block huis-block--gold">
                    <div className="huis-block-header">
                        <span>💶</span><h2>Betalingen</h2>
                    </div>
                    <div className="huis-payment-row">
                        <div className="huis-rent-card">
                            <span className="huis-rent-amount">€ 550</span>
                            <span className="huis-rent-label">per maand</span>
                            <span className="huis-rent-sub">incl. nutsvoorzieningen & internet</span>
                        </div>
                        <ul className="huis-list huis-list--flex">
                            <li><span>📅</span><span>Betaling vóór of op de <strong>1e van de maand</strong></span></li>
                            <li><span>✅</span><span>Geen aparte servicekosten of voorschotten</span></li>
                        </ul>
                    </div>
                </section>

                {/* 8 + 9. Onderhoud & Communicatie (2-col) */}
                <div className="huis-two-col">
                    <section className="huis-block huis-block--orange">
                        <div className="huis-block-header">
                            <span>🔧</span><h2>Onderhoud & Schade</h2>
                        </div>
                        <ul className="huis-list">
                            <li><span>📱</span><span>Meld schade of defecten direct via de app of bij de beheerder</span></li>
                            <li><span>💸</span><span>Kleine schade door nalatigheid wordt verhaald op de huurder</span></li>
                            <li><span>🔍</span><span>Houd je kamer in goede staat — inspectie kan plaatsvinden</span></li>
                        </ul>
                    </section>

                    <section className="huis-block huis-block--dark">
                        <div className="huis-block-header">
                            <span>📞</span><h2>Communicatie & Overlast</h2>
                        </div>
                        <ul className="huis-list">
                            <li><span>📱</span><span>Vragen & meldingen via de app of telefonisch</span></li>
                            <li><span>🚨</span><span>Noodsituaties: onmiddellijk telefonisch melden</span></li>
                            <li><span>⛔</span><span>Herhaaldelijke overtredingen kunnen leiden tot beëindiging huurcontract</span></li>
                        </ul>
                        <a href="tel:+31625015299" className="huis-contact-card">
                            <span className="huis-contact-icon">🏠</span>
                            <div>
                                <strong>Maxim Staal</strong>
                                <span>Beheerder · +31 6 250 152 99</span>
                            </div>
                        </a>
                    </section>
                </div>

                <p className="huis-footer">
                    Villa Vredestein 2025 — Door in te trekken ga je akkoord met deze huisregels.
                </p>

            </main>
        </div>
    );
}
