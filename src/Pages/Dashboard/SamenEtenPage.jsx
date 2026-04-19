import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText, FiCalendar,
    FiUser, FiUsers, FiDollarSign, FiClipboard, FiShield,
    FiCheck, FiX, FiPlus, FiMinus, FiHeart,
} from "react-icons/fi";
import DashboardLayout from "./DashboardLayout.jsx";
import "./StudentDashboard.css";
import "./SamenEtenPage.css";
import "../../Styles/Global.css";

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

// ── Static dinner data — swap for API when backend is ready ────────────
const UPCOMING_DINNER = {
    date: new Date(2026, 5, 18),       // 18 juni 2026
    time: "17:00",
    theme: "BBQ 🔥",
    location: "Tuin",
    description:
        "Zomerse BBQ in de villa-tuin! Vlees, groenten en drankjes worden geregeld — jij hoeft alleen maar te komen genieten. Geef aan of je er bij bent, en of je iemand meeneemt zodat we genoeg inkopen.",
    maxPersons: 20,
    signups: [
        { name: "Manon", guests: 0, emoji: "👩" },
        { name: "Maxim", guests: 1, emoji: "👨" },
    ],
};

const NL_DAYS_LONG   = ["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"];
const NL_MONTHS_LONG = ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];

function formatDate(date) {
    return `${NL_DAYS_LONG[date.getDay()]} ${date.getDate()} ${NL_MONTHS_LONG[date.getMonth()]}`;
}

// ── Page ───────────────────────────────────────────────────────────────
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

const SamenEtenPage = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const contractFile = user?.contractFile || null;
    const [submitted, setSubmitted] = useState(false);
    const [guests, setGuests]       = useState(0);

    const dinner = UPCOMING_DINNER;

    // Total persons already signed up (person + their guests)
    const totalPersons = dinner.signups.reduce((sum, s) => sum + 1 + s.guests, 0);
    const spotsLeft    = dinner.maxPersons - totalPersons;
    const spotsPercent = Math.round((totalPersons / dinner.maxPersons) * 100);
    const totalCount   = dinner.signups.length + (submitted ? 1 : 0);

    const handleSignup = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <>
            <Helmet>
                <title>Samen eten — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <DashboardLayout sidebar={
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
                        <li><Link to="/student/betalingen"><FiDollarSign /> Betalingen</Link></li>
                        <li>
                            {contractFile
                                ? <a href={`${BASE_URL}/uploads/${encodeURIComponent(contractFile)}`} target="_blank" rel="noopener noreferrer"><FiFileText /> Huurcontract</a>
                                : <Link to="#"><FiFileText /> Huurcontract</Link>
                            }
                        </li>
                        <li>
                            <Link to="/student/samen-eten" className="active-nav-link">
                                <FiUsers /> Samen eten?
                            </Link>
                        </li>
                        <li><Link to="/student/events"><FiCalendar /> Events</Link></li>

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
            } mainClass="se-main">

                {/* Hero */}
                <div className="se-hero">
                    <span className="se-hero-icon">🔥</span>
                    <div className="se-hero-text">
                        <strong>Villa BBQ — samen genieten!</strong>
                        <p>Vlees, groenten en drankjes zijn geregeld. Kom gezellig langs en neem gerust iemand mee!</p>
                    </div>
                    <div className="se-hero-date">
                        <span className="se-hero-date-label">Datum</span>
                        <span className="se-hero-date-value">{formatDate(dinner.date)}</span>
                        <span className="se-hero-date-time">🕔 {dinner.time}</span>
                    </div>
                </div>

                {/* Details + aanmelden */}
                <div className="se-two-col">

                    {/* Left: event details */}
                    <section className="se-block se-block--gold">
                        <div className="se-block-header">
                            <span>🔥</span>
                            <h2>Details — {dinner.theme}</h2>
                        </div>

                        <div className="se-detail-row">
                            <span className="se-detail-icon">📍</span>
                            <span>{dinner.location}</span>
                        </div>
                        <div className="se-detail-row">
                            <span className="se-detail-icon">🕔</span>
                            <span>{dinner.time} · {formatDate(dinner.date)}</span>
                        </div>
                        <div className="se-detail-row">
                            <span className="se-detail-icon">👥</span>
                            <span>{totalPersons} personen aangemeld · nog {spotsLeft} plekken vrij</span>
                        </div>

                        <p className="se-description">{dinner.description}</p>

                        {/* Progress bar */}
                        <div className="se-progress-wrap">
                            <div className="se-progress-bar">
                                <div className="se-progress-fill" style={{ width: `${spotsPercent}%` }} />
                            </div>
                            <span className="se-progress-label">
                                {totalPersons} / {dinner.maxPersons} personen
                            </span>
                        </div>
                    </section>

                    {/* Right: aanmeldlijst + form */}
                    <div className="se-right-col">

                        {/* Aangemeld */}
                        <section className="se-block se-block--dark">
                            <div className="se-block-header">
                                <span>✅</span>
                                <h2>Aangemeld ({totalCount})</h2>
                            </div>
                            <ul className="se-signup-list">
                                {dinner.signups.map((s, i) => (
                                    <li key={i} className="se-signup-item">
                                        <span className="se-signup-emoji">{s.emoji}</span>
                                        <div>
                                            <strong>{s.name}</strong>
                                            <span>
                                                {s.guests === 0
                                                    ? "Komt alleen"
                                                    : `Neemt ${s.guests} gast${s.guests > 1 ? "en" : ""} mee`}
                                            </span>
                                        </div>
                                        <FiCheck className="se-check-icon" />
                                    </li>
                                ))}
                                {submitted && (
                                    <li className="se-signup-item se-signup-item--new">
                                        <span className="se-signup-emoji">🙋</span>
                                        <div>
                                            <strong>{user?.username || "Jij"}</strong>
                                            <span>
                                                {guests === 0
                                                    ? "Komt alleen"
                                                    : `Neemt ${guests} gast${guests > 1 ? "en" : ""} mee`}
                                            </span>
                                        </div>
                                        <FiHeart className="se-heart-icon" />
                                    </li>
                                )}
                            </ul>
                        </section>

                        {/* Aanmeld-form */}
                        {!submitted ? (
                            <section className="se-block se-block--green">
                                <div className="se-block-header">
                                    <span>🙋</span>
                                    <h2>Kom je?</h2>
                                </div>
                                <form className="se-form" onSubmit={handleSignup}>
                                    <label className="se-label">
                                        Neem je iemand mee?
                                        <div className="se-counter">
                                            <button
                                                type="button"
                                                className="se-counter-btn"
                                                onClick={() => setGuests(g => Math.max(0, g - 1))}
                                            >
                                                <FiMinus />
                                            </button>
                                            <span className="se-counter-val">{guests}</span>
                                            <button
                                                type="button"
                                                className="se-counter-btn"
                                                onClick={() => setGuests(g => Math.min(spotsLeft - 1, g + 1))}
                                            >
                                                <FiPlus />
                                            </button>
                                        </div>
                                        <span className="se-counter-hint">
                                            {guests === 0 ? "Alleen jijzelf" : `Jij + ${guests} gast${guests > 1 ? "en" : ""}`}
                                        </span>
                                    </label>
                                    <button type="submit" className="se-submit-btn">
                                        <FiCheck /> Ik kom!
                                    </button>
                                </form>
                            </section>
                        ) : (
                            <section className="se-block se-block--success">
                                <div className="se-success-inner">
                                    <span className="se-success-icon">🎉</span>
                                    <strong>Super, je staat erbij!</strong>
                                    <p>We zien je op {formatDate(dinner.date)} om {dinner.time} in de tuin.</p>
                                    <p className="se-success-dish">
                                        {guests === 0
                                            ? "Je komt alleen — tot dan! 🔥"
                                            : `Je neemt ${guests} gast${guests > 1 ? "en" : ""} mee — hoe gezellig!`}
                                    </p>
                                    <button
                                        type="button"
                                        className="se-cancel-btn"
                                        onClick={() => { setSubmitted(false); setGuests(0); }}
                                    >
                                        <FiX /> Toch niet
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* Spelregels */}
                <section className="se-block se-block--rules">
                    <div className="se-block-header">
                        <span>📋</span>
                        <h2>Handig om te weten</h2>
                    </div>
                    <div className="se-rules-grid">
                        {[
                            { icon: "🔥", rule: "Vlees, groenten en drankjes worden geregeld" },
                            { icon: "👥", rule: "Je mag gerust iemand meenemen — meld het wel even aan" },
                            { icon: "📅", rule: "Aanmelden vóór 14 juni zodat we genoeg inkopen" },
                            { icon: "🧹", rule: "Na afloop ruimen we de tuin samen op" },
                            { icon: "🤝", rule: "Gezelligheid boven alles — telefoon weg!" },
                            { icon: "🔔", rule: "Afmelden kan tot 24 uur van tevoren" },
                        ].map(({ icon, rule }) => (
                            <div key={rule} className="se-rule-tile">
                                <span>{icon}</span>
                                <p>{rule}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Eerdere etentjes */}
                <section className="se-block se-block--dark">
                    <div className="se-block-header">
                        <span>📖</span>
                        <h2>Eerdere etentjes</h2>
                    </div>
                    <div className="se-past-grid">
                        {[
                            { date: "20 mei 2025",  theme: "Pannenkoekenavond 🥞", location: "Tuin" },
                            { date: "1 juni 2024",  theme: "Frituuravond 🍟",       location: "Woonkamer Vredestein" },
                        ].map((d, i) => (
                            <div key={i} className="se-past-tile">
                                <span className="se-past-theme">{d.theme}</span>
                                <span className="se-past-month">{d.date}</span>
                                <span className="se-past-persons">📍 {d.location}</span>
                            </div>
                        ))}
                    </div>
                </section>

            </DashboardLayout>
        </>
    );
};

export default SamenEtenPage;
