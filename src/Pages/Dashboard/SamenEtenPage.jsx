import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText, FiCalendar,
    FiUser, FiUsers, FiDollarSign, FiClipboard, FiShield,
    FiCheck, FiX, FiPlus, FiMinus, FiHeart,
} from "react-icons/fi";
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
    date: new Date(2026, 4, 8),       // 8 mei 2026
    time: "18:30",
    theme: "Mediterraan 🫒",
    host: "Iedereen",
    location: "Woonkamer & Keuken",
    description:
        "Kook samen, eet samen. Deze maand: Mediterraan! Denk aan hummus, tabbouleh, falafel, pita en olijven. Iedereen brengt een gerecht mee — aanmelden is verplicht zodat we niet dubbel inkopen.",
    maxPersons: 8,
    signups: [
        { name: "Manon", dish: "Tabbouleh salade", emoji: "🥗" },
        { name: "Maxim", dish: "Falafel met saus", emoji: "🧆" },
        { name: "Lisa",  dish: "Pita-brood",       emoji: "🫓" },
    ],
};

const NL_DAYS_LONG   = ["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"];
const NL_MONTHS_LONG = ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];

function formatDate(date) {
    return `${NL_DAYS_LONG[date.getDay()]} ${date.getDate()} ${NL_MONTHS_LONG[date.getMonth()]}`;
}

// ── Dish ideas per theme ───────────────────────────────────────────────
const DISH_IDEAS = [
    { emoji: "🥗", label: "Salade" },
    { emoji: "🍲", label: "Soep / stoofpot" },
    { emoji: "🫓", label: "Brood / dips" },
    { emoji: "🍝", label: "Pasta / rijst" },
    { emoji: "🥩", label: "Vlees / BBQ" },
    { emoji: "🥦", label: "Groenten" },
    { emoji: "🧁", label: "Nagerecht" },
    { emoji: "🥤", label: "Drankjes" },
];

// ── Past dinners ───────────────────────────────────────────────────────
const PAST_DINNERS = [
    { month: "april 2026",    theme: "Italiaans 🍝",      persons: 7 },
    { month: "maart 2026",    theme: "Mexicaans 🌮",      persons: 8 },
    { month: "februari 2026", theme: "Aziatisch 🍜",      persons: 6 },
    { month: "januari 2026",  theme: "Comfort food 🍲",   persons: 7 },
];

// ── Page ───────────────────────────────────────────────────────────────
const SamenEtenPage = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const [signedUp, setSignedUp]   = useState(false);
    const [dish, setDish]           = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [persons, setPersons]     = useState(1);

    const dinner  = UPCOMING_DINNER;
    const spotsLeft = dinner.maxPersons - dinner.signups.length;
    const spotsPercent = Math.round((dinner.signups.length / dinner.maxPersons) * 100);

    const handleSignup = (e) => {
        e.preventDefault();
        if (!dish.trim()) return;
        setSubmitted(true);
        setSignedUp(true);
    };

    return (
        <div className="StudentDashboard">
            <Helmet>
                <title>Samen eten — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* ── Sidebar ── */}
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

            {/* ── Main ── */}
            <main className="dashboard-main se-main">

                {/* Hero */}
                <div className="se-hero">
                    <span className="se-hero-icon">🍽️</span>
                    <div className="se-hero-text">
                        <strong>Samen eten bij Villa Vredestein</strong>
                        <p>Elke maand koken en eten we samen. Iedereen brengt een gerecht mee — gezelligheid gegarandeerd!</p>
                    </div>
                    <div className="se-hero-date">
                        <span className="se-hero-date-label">Volgende etentje</span>
                        <span className="se-hero-date-value">{formatDate(dinner.date)}</span>
                        <span className="se-hero-date-time">🕡 {dinner.time}</span>
                    </div>
                </div>

                {/* Details + aanmelden */}
                <div className="se-two-col">

                    {/* Left: event details */}
                    <section className="se-block se-block--gold">
                        <div className="se-block-header">
                            <span>🫒</span>
                            <h2>Details — {dinner.theme}</h2>
                        </div>

                        <div className="se-detail-row">
                            <span className="se-detail-icon">📍</span>
                            <span>{dinner.location}</span>
                        </div>
                        <div className="se-detail-row">
                            <span className="se-detail-icon">🕡</span>
                            <span>{dinner.time} · {formatDate(dinner.date)}</span>
                        </div>
                        <div className="se-detail-row">
                            <span className="se-detail-icon">👥</span>
                            <span>{dinner.maxPersons} plekken · nog {spotsLeft} vrij</span>
                        </div>

                        <p className="se-description">{dinner.description}</p>

                        {/* Progress bar */}
                        <div className="se-progress-wrap">
                            <div className="se-progress-bar">
                                <div className="se-progress-fill" style={{ width: `${spotsPercent}%` }} />
                            </div>
                            <span className="se-progress-label">
                                {dinner.signups.length} / {dinner.maxPersons} aangemeld
                            </span>
                        </div>

                        {/* Dish ideas */}
                        <div className="se-dish-ideas">
                            <span className="se-dish-ideas-title">Gerecht-ideeën:</span>
                            <div className="se-dish-chips">
                                {DISH_IDEAS.map(d => (
                                    <span key={d.label} className="se-dish-chip">{d.emoji} {d.label}</span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Right: aanmeldlijst + form */}
                    <div className="se-right-col">

                        {/* Aangemeld */}
                        <section className="se-block se-block--dark">
                            <div className="se-block-header">
                                <span>✅</span>
                                <h2>Aangemeld ({dinner.signups.length + (submitted ? 1 : 0)})</h2>
                            </div>
                            <ul className="se-signup-list">
                                {dinner.signups.map((s, i) => (
                                    <li key={i} className="se-signup-item">
                                        <span className="se-signup-emoji">{s.emoji}</span>
                                        <div>
                                            <strong>{s.name}</strong>
                                            <span>{s.dish}</span>
                                        </div>
                                        <FiCheck className="se-check-icon" />
                                    </li>
                                ))}
                                {submitted && (
                                    <li className="se-signup-item se-signup-item--new">
                                        <span className="se-signup-emoji">🍽️</span>
                                        <div>
                                            <strong>{user?.username || "Jij"}</strong>
                                            <span>{dish}</span>
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
                                    <span>🖊️</span>
                                    <h2>Meld je aan</h2>
                                </div>
                                <form className="se-form" onSubmit={handleSignup}>
                                    <label className="se-label">
                                        Wat breng jij mee?
                                        <input
                                            type="text"
                                            className="se-input"
                                            placeholder="bijv. Hummus met pitabrood"
                                            value={dish}
                                            onChange={e => setDish(e.target.value)}
                                            required
                                        />
                                    </label>
                                    <label className="se-label">
                                        Aantal personen
                                        <div className="se-counter">
                                            <button type="button" className="se-counter-btn" onClick={() => setPersons(p => Math.max(1, p - 1))}><FiMinus /></button>
                                            <span className="se-counter-val">{persons}</span>
                                            <button type="button" className="se-counter-btn" onClick={() => setPersons(p => Math.min(spotsLeft, p + 1))}><FiPlus /></button>
                                        </div>
                                    </label>
                                    <button type="submit" className="se-submit-btn">
                                        <FiCheck /> Aanmelden
                                    </button>
                                </form>
                            </section>
                        ) : (
                            <section className="se-block se-block--success">
                                <div className="se-success-inner">
                                    <span className="se-success-icon">🎉</span>
                                    <strong>Je bent aangemeld!</strong>
                                    <p>We zien je op {formatDate(dinner.date)} om {dinner.time}.</p>
                                    <p className="se-success-dish">Jouw gerecht: <em>{dish}</em></p>
                                    <button
                                        type="button"
                                        className="se-cancel-btn"
                                        onClick={() => { setSubmitted(false); setSignedUp(false); setDish(""); }}
                                    >
                                        <FiX /> Afmelden
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
                        <h2>Spelregels</h2>
                    </div>
                    <div className="se-rules-grid">
                        {[
                            { icon: "🍽️", rule: "Iedereen brengt één gerecht mee" },
                            { icon: "📅", rule: "Aanmelden vóór 3 dagen van tevoren" },
                            { icon: "🧹", rule: "Keuken en woonkamer samen opruimen na afloop" },
                            { icon: "🤝", rule: "Gezelligheid boven alles — telefoon weg!" },
                            { icon: "🔔", rule: "Afmelden kan tot 24 uur van tevoren" },
                            { icon: "🚫", rule: "Geen allergieën vergeten te melden!" },
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
                        {PAST_DINNERS.map((d, i) => (
                            <div key={i} className="se-past-tile">
                                <span className="se-past-theme">{d.theme}</span>
                                <span className="se-past-month">{d.month}</span>
                                <span className="se-past-persons">👥 {d.persons} personen</span>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
};

export default SamenEtenPage;
