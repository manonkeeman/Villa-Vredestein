import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText, FiCalendar,
    FiUser, FiUsers, FiDollarSign, FiClipboard, FiShield, FiPhone,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import "./StudentDashboard.css";
import "./NoodlijstPage.css";
import "../../Styles/Global.css";

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

export default function NoodlijstPage() {
    const { isLoggedIn, logout, user: authUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slow, setSlow] = useState(false);

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    useEffect(() => {
        const t = setTimeout(() => setSlow(true), 4000);
        api.get("/api/users/me")
            .then(res => setProfile(res.data))
            .catch(() => setProfile({}))
            .finally(() => { clearTimeout(t); setSlow(false); setLoading(false); });
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="StudentDashboard">
            <Helmet>
                <title>Noodlijst — Villa Vredestein</title>
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
                        <li><Link to="/student/noodlijst" className="active"><FiAlertCircle /> Noodlijst</Link></li>
                        <li><Link to="#"><FiFileText /> Huisregels</Link></li>
                        <li><Link to="#"><FiClipboard /> Schoonmaakschema</Link></li>
                        <li><Link to="#"><FiDollarSign /> Betalingen</Link></li>
                        <li><Link to="#"><FiFileText /> Huurcontract</Link></li>
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

            {/* ── Main infographic ── */}
            <main className="dashboard-main nood-main">

                {/* Hero alert */}
                <div className="nood-hero">
                    <span className="nood-hero-icon">🚨</span>
                    <div>
                        <strong>Bij calamiteiten</strong>
                        <p>Blijf rustig · Volg deze stappen · Waarschuw direct de juiste persoon</p>
                    </div>
                </div>

                {/* ── 1. NOODNUMMERS ── */}
                <section className="nood-block nood-block--red">
                    <div className="nood-block-header">
                        <span className="nood-block-icon">📞</span>
                        <h2>Noodnummers</h2>
                        <span className="nood-block-sub">Altijd bellen bij direct gevaar</span>
                    </div>

                    {/* 112 hero card */}
                    <a href="tel:112" className="nood-sos-card">
                        <span className="nood-sos-label">Brand · Ambulance · Politie</span>
                        <span className="nood-sos-number">112</span>
                        <span className="nood-sos-hint">Hoofdstraat 147, Villa Vredestein</span>
                    </a>

                    {/* overige nummers */}
                    <div className="nood-num-grid">
                        {[
                            { label: "Huisartsenpost",       sub: "Buiten kantooruren",         num: "0900-1515",        icon: "🏥" },
                            { label: "Spoed tandarts",        sub: "Acute pijn / trauma",        num: "030-3037509",      icon: "🦷" },
                            { label: "Maxim Staal",           sub: "Beheerder · 24/7",           num: "+31 6 25015299",   icon: "🏠" },
                            { label: "Scholman Servicebedrijf", sub: "CV · Water · Lekkage",    num: "030-6043073",      icon: "🔧" },
                            { label: "Manon Keeman",          sub: "Noodcontact · 24/7",         num: "+31 6 24766568",   icon: "👤" },
                        ].map(({ label, sub, num, icon }) => (
                            <a key={num} href={`tel:${num.replace(/[^0-9+]/g, "")}`} className="nood-num-card">
                                <span className="nood-num-icon">{icon}</span>
                                <span className="nood-num-label">{label}</span>
                                <span className="nood-num-sub">{sub}</span>
                                <span className="nood-num-number"><FiPhone /> {num}</span>
                            </a>
                        ))}

                        {/* Persoonlijk noodnummer */}
                        {loading ? (
                            <div className="nood-num-card nood-num-card--personal">
                                <span className="nood-num-icon">👤</span>
                                <span className="nood-num-label">Jouw noodnummer</span>
                                <span className="nood-num-sub">{slow ? "Server start op…" : "Laden…"}</span>
                            </div>
                        ) : profile?.emergencyPhoneNumber ? (
                            <a href={`tel:${profile.emergencyPhoneNumber.replace(/[^0-9+]/g, "")}`} className="nood-num-card nood-num-card--personal">
                                <span className="nood-num-icon">🆘</span>
                                <span className="nood-num-label">Jouw noodnummer</span>
                                <span className="nood-num-sub"><Link to="/student/profiel" onClick={e => e.stopPropagation()}>Wijzigen</Link></span>
                                <span className="nood-num-number"><FiPhone /> {profile.emergencyPhoneNumber}</span>
                            </a>
                        ) : (
                            <Link to="/student/profiel" className="nood-num-card nood-num-card--empty">
                                <span className="nood-num-icon">➕</span>
                                <span className="nood-num-label">Jouw noodnummer</span>
                                <span className="nood-num-sub">Nog niet ingesteld</span>
                                <span className="nood-num-number">Toevoegen via profiel →</span>
                            </Link>
                        )}
                    </div>
                </section>

                {/* ── 2 + 3. BRAND & WATER (2-koloms) ── */}
                <div className="nood-two-col">
                    <section className="nood-block nood-block--orange">
                        <div className="nood-block-header">
                            <span className="nood-block-icon">🔥</span>
                            <h2>Brandveiligheid</h2>
                        </div>
                        <ul className="nood-icon-list">
                            <li><span>🧯</span><span>Blusser & deken in keuken + elke verdieping naast de trap</span></li>
                            <li><span>🔔</span><span>Rookmelders in elke gang — test maandelijks</span></li>
                            <li><span>🚪</span><span>Nooduitgangen: hoofdingang, achterdeur, noodtrap tuinzijde</span></li>
                            <li><span>📍</span><span>Verzamelpunt: parkeerplaats bij de grote poort</span></li>
                            <li><span>⚠️</span><span>Gasgeur? Geen licht · ramen open · bel 112 + beheerder</span></li>
                        </ul>
                    </section>

                    <section className="nood-block nood-block--blue">
                        <div className="nood-block-header">
                            <span className="nood-block-icon">💧</span>
                            <h2>Stroom & Water</h2>
                        </div>
                        <ul className="nood-icon-list">
                            <li><span>⚡</span><span>Stroomkast: zekeringen & aardlek — 1e verdieping</span></li>
                            <li><span>🚿</span><span>Hoofdwaterkraan afsluiten: badkamer beneden in het gat</span></li>
                            <li><span>📱</span><span>Meld direct via WhatsApp aan beheerder</span></li>
                            <li><span>🔌</span><span>Geen elektrische apparaten bij vocht of overstroming</span></li>
                        </ul>
                    </section>
                </div>

                {/* ── 4. MEDISCH ── */}
                <section className="nood-block nood-block--green">
                    <div className="nood-block-header">
                        <span className="nood-block-icon">❤️</span>
                        <h2>Medische noodgevallen</h2>
                    </div>
                    <div className="nood-steps">
                        {[
                            { step: "1", icon: "🚨", text: "Bel 112 bij levensgevaar of bewusteloosheid" },
                            { step: "2", icon: "❤️", text: "AED: Dierenartspraktijk Hoofdstraat 123" },
                            { step: "3", icon: "🩹", text: "EHBO-koffer: keuken" },
                            { step: "4", icon: "📋", text: "Meld aan beheerder · noteer datum & tijd" },
                        ].map(({ step, icon, text }) => (
                            <div key={step} className="nood-step">
                                <span className="nood-step-num">{step}</span>
                                <span className="nood-step-icon">{icon}</span>
                                <span className="nood-step-text">{text}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 5 + 6. TOEGANG & NACHT (2-koloms) ── */}
                <div className="nood-two-col">
                    <section className="nood-block nood-block--yellow">
                        <div className="nood-block-header">
                            <span className="nood-block-icon">🔑</span>
                            <h2>Toegang & Sleutels</h2>
                        </div>
                        <ul className="nood-icon-list">
                            <li><span>🔑</span><span>Toegang via sleutel + app (bij contract)</span></li>
                            <li><span>📄</span><span>Account start & eindigt met je contract</span></li>
                            <li><span>🔒</span><span>Reservesleutel: kastje naast zij-deur · code via beheerder</span></li>
                            <li><span>🚫</span><span>Laat niemand binnen zonder toestemming</span></li>
                        </ul>
                    </section>

                    <section className="nood-block nood-block--purple">
                        <div className="nood-block-header">
                            <span className="nood-block-icon">🔇</span>
                            <h2>Nachtregels</h2>
                        </div>
                        <ul className="nood-icon-list">
                            <li><span>🌙</span><span>Stilteperiode: <strong>22:00 – 07:00</strong></span></li>
                            <li><span>🎵</span><span>Geen muziek · harde stemmen · deuren klapperen</span></li>
                            <li><span>⚠️</span><span>Overtreding = officiële waarschuwing</span></li>
                        </ul>
                    </section>
                </div>

                {/* ── 7. NOODCHECKLIJST ── */}
                <section className="nood-block nood-block--gray">
                    <div className="nood-block-header">
                        <span className="nood-block-icon">✅</span>
                        <h2>Noodchecklijst <span className="nood-badge">maandelijks · beheerder</span></h2>
                    </div>
                    <div className="nood-checklist-grid">
                        {[
                            { icon: "🔔", label: "Rookmelders werken" },
                            { icon: "🧯", label: "Blusdeken aanwezig" },
                            { icon: "🩹", label: "EHBO-koffer compleet" },
                            { icon: "🚪", label: "Vluchtroute vrij" },
                            { icon: "💡", label: "Noodverlichting werkt" },
                        ].map(({ icon, label }) => (
                            <div key={label} className="nood-check-tile">
                                <span className="nood-check-tile-icon">{icon}</span>
                                <span className="nood-check-tile-label">{label}</span>
                                <span className="nood-check-tile-mark">✓</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 8. OVERIG ── */}
                <section className="nood-block nood-block--dark">
                    <div className="nood-block-header">
                        <span className="nood-block-icon">📍</span>
                        <h2>Overige informatie</h2>
                    </div>
                    <div className="nood-location-cards">
                        <div className="nood-loc-card">
                            <span>💊</span>
                            <div>
                                <strong>Apotheek</strong>
                                <p>Servicepunt De Bosrand – Traaij 2</p>
                            </div>
                        </div>
                        <div className="nood-loc-card">
                            <span>🏥</span>
                            <div>
                                <strong>Ziekenhuis</strong>
                                <p>Diakonessenhuis Zeist – Jagersingel 1</p>
                            </div>
                        </div>
                    </div>
                    <p className="nood-footer-text">
                        Villa Vredestein – Veiligheid is van ons allemaal. Blijf alert, handel rustig en gebruik je gezonde verstand.
                    </p>
                </section>

            </main>
        </div>
    );
}
