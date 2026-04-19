import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiCalendar, FiMapPin, FiClock, FiChevronDown, FiChevronUp, FiRadio,
} from "react-icons/fi";
import DashboardLayout from "./DashboardLayout.jsx";
import StudentSidebar from "../../Components/StudentSidebar/StudentSidebar.jsx";
import { NEWS_ITEMS } from "./StudentDashboard.jsx";
import "./StudentDashboard.css";
import "./EventsPage.css";
import "../../Styles/Global.css";

const NL_MONTHS_SHORT = ["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"];
const NL_DAYS_SHORT   = ["zo","ma","di","wo","do","vr","za"];

// ── Static events — swap for an API call when backend is ready ──────────
const EVENTS = [
    {
        id: 1,
        title: "Villa BBQ",
        category: "activiteit",
        emoji: "🔥",
        date: new Date(2026, 5, 18),   // 18 juni 2026
        time: "17:00",
        location: "Tuin",
        description: "Zomerse BBQ in de villa-tuin! Vlees, groenten en drankjes worden geregeld — jij hoeft alleen maar te komen genieten. Meld je aan via Samen eten en geef aan of je iemand meeneemt.",
        color: "#f97316",
        bg: "#1a0e00",
    },
];

const CATEGORY_LABELS = {
    activiteit: "Activiteit",
    borrel:     "Borrel",
    eten:       "Samen eten",
    schoonmaak: "Schoonmaak",
};

// ── Single event card ────────────────────────────────────────────────────
function EventCard({ event, past }) {
    const [expanded, setExpanded] = useState(false);
    const day     = event.date.getDate();
    const month   = NL_MONTHS_SHORT[event.date.getMonth()];
    const weekday = NL_DAYS_SHORT[event.date.getDay()];

    return (
        <article
            className={`ev-card${past ? " ev-card--past" : ""}`}
            style={{ borderColor: past ? "#2a2a2a" : event.color, background: past ? "#0d0d0d" : event.bg }}
        >
            {/* Date block */}
            <div
                className="ev-date-block"
                style={{
                    background: past ? "rgba(255,255,255,0.03)" : event.color + "22",
                    border: `1px solid ${past ? "#2a2a2a" : event.color + "55"}`,
                }}
            >
                <span className="ev-date-day"   style={{ color: past ? "#444" : event.color }}>{day}</span>
                <span className="ev-date-month" style={{ color: past ? "#3a3a3a" : event.color + "cc" }}>{month}</span>
                <span className="ev-date-weekday">{weekday}</span>
            </div>

            {/* Content */}
            <div className="ev-content">
                <div className="ev-top-row">
                    <span
                        className="ev-category-badge"
                        style={{
                            background: past ? "rgba(255,255,255,0.04)" : event.color + "22",
                            color: past ? "#444" : event.color,
                            border: `1px solid ${past ? "#2a2a2a" : event.color + "44"}`,
                        }}
                    >
                        {event.emoji} {CATEGORY_LABELS[event.category] || event.category}
                    </span>
                    {past && <span className="ev-past-badge">Afgelopen</span>}
                </div>

                <h3 className="ev-title" style={{ color: past ? "#444" : "white" }}>{event.title}</h3>

                <div className="ev-meta">
                    <span><FiClock /> {event.time}</span>
                    <span><FiMapPin /> {event.location}</span>
                </div>

                {expanded && <p className="ev-description">{event.description}</p>}

                <button
                    type="button"
                    className="ev-toggle-btn"
                    onClick={() => setExpanded(e => !e)}
                    style={{ color: past ? "#555" : event.color }}
                >
                    {expanded ? <><FiChevronUp /> Minder</> : <><FiChevronDown /> Meer info</>}
                </button>
            </div>
        </article>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────
const EventsPage = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const contractFile = user?.contractFile || null;

    const now   = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const sorted   = useMemo(() => [...EVENTS].sort((a, b) => a.date - b.date), []);
    const upcoming = sorted.filter(e => e.date >= today);
    const past     = sorted.filter(e => e.date < today).reverse();

    const nextEvent  = upcoming[0] ?? null;
    const daysUntil  = nextEvent
        ? Math.ceil((nextEvent.date - today) / 86_400_000)
        : null;

    const countdownLabel =
        daysUntil === 0 ? "Vandaag!" :
        daysUntil === 1 ? "Morgen!"  :
        daysUntil != null ? `${daysUntil} dagen` : null;

    return (
        <>
            <Helmet>
                <title>Events — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <DashboardLayout sidebar={<StudentSidebar user={user} logout={logout} active="events" contractFile={contractFile} />} mainClass="ev-main">

                {/* Hero */}
                <div className="ev-hero">
                    <div className="ev-hero-left">
                        <span className="ev-hero-icon">🎉</span>
                        <div>
                            <strong>Events & Activiteiten</strong>
                            <p>Borrels, etentjes, schoonmaakdagen en meer — alles wat er speelt in Villa Vredestein.</p>
                        </div>
                    </div>

                    {nextEvent && countdownLabel && (
                        <div className="ev-countdown">
                            <span className="ev-countdown-num" style={{ color: nextEvent.color }}>
                                {countdownLabel}
                            </span>
                            <span className="ev-countdown-label">
                                tot {nextEvent.emoji} {nextEvent.title}
                            </span>
                        </div>
                    )}
                </div>

                {/* Categorie legenda */}
                <div className="ev-legend">
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                        const match = EVENTS.find(e => e.category === key);
                        return (
                            <span key={key} className="ev-legend-chip" style={{ borderColor: match?.color + "55", color: match?.color }}>
                                {match?.emoji} {label}
                            </span>
                        );
                    })}
                </div>

                {/* Aankomende events */}
                <section className="ev-section">
                    <h2 className="ev-section-title"><FiCalendar /> Aankomende events</h2>
                    {upcoming.length === 0 ? (
                        <div className="ev-empty">
                            <span>📭</span>
                            <p>Geen aankomende events gepland. Kom later terug of stel zelf een event voor!</p>
                        </div>
                    ) : (
                        <div className="ev-list">
                            {upcoming.map(ev => <EventCard key={ev.id} event={ev} past={false} />)}
                        </div>
                    )}
                </section>

                {/* Afgelopen events */}
                {past.length > 0 && (
                    <section className="ev-section">
                        <h2 className="ev-section-title ev-section-title--past">Afgelopen events</h2>
                        <div className="ev-list">
                            {past.map(ev => <EventCard key={ev.id} event={ev} past />)}
                        </div>
                    </section>
                )}

                {/* ── Nieuws ── */}
                <section className="ev-section">
                    <h2 className="ev-section-title"><FiRadio /> Nieuws &amp; Mededelingen</h2>
                    <div className="ev-news-list">
                        {NEWS_ITEMS.map(n => (
                            <div key={n.id} className="ev-news-card">
                                <span className="ev-news-emoji">{n.emoji}</span>
                                <div className="ev-news-body">
                                    <strong>{n.title}</strong>
                                    <p>{n.body}</p>
                                </div>
                                <span className="ev-news-date">{n.date}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="ev-suggest">
                    <span>💡</span>
                    <div>
                        <strong>Heb je een leuk idee?</strong>
                        <p>
                            Stel een event voor via de beheerder of stuur een berichtje via{" "}
                            <Link to="/contact">Contact</Link>.
                        </p>
                    </div>
                </div>

            </DashboardLayout>
        </>
    );
};

export default EventsPage;