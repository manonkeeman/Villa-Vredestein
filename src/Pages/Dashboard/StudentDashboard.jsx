import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link, useParams } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText, FiCalendar,
    FiUser, FiUsers, FiDollarSign, FiClipboard, FiBookOpen, FiShield,
    FiCheckCircle, FiClock,
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

// Monday–Sunday date range for a given ISO week + year
const getWeekDates = (isoWeek, year) => {
    const jan4 = new Date(year, 0, 4);
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (isoWeek - 1) * 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: monday, end: sunday };
};

const NL_MONTHS = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];

const formatWeekRange = (isoWeek, year) => {
    const { start, end } = getWeekDates(isoWeek, year);
    const sameMonth = start.getMonth() === end.getMonth();
    return sameMonth
        ? `${start.getDate()}–${end.getDate()} ${NL_MONTHS[start.getMonth()]}`
        : `${start.getDate()} ${NL_MONTHS[start.getMonth()]}–${end.getDate()} ${NL_MONTHS[end.getMonth()]}`;
};

const StudentDashboard = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const { id } = useParams();
    const [contractFile, setContractFile] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [invoicesLoading, setInvoicesLoading] = useState(true);

    const currentId = user?.id ?? user?.userId;
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (id && currentId && String(id) !== String(currentId)) return <Navigate to="/unauthorized" replace />;

    const now = new Date();
    const currentIsoWeek = getIsoWeek(now);
    const currentYear = now.getFullYear();
    const weekRange = formatWeekRange(currentIsoWeek, currentYear);

    const openInvoices = invoices.filter(i => i.status === "OPEN" || i.status === "OVERDUE");
    const hasOverdue = openInvoices.some(i => i.status === "OVERDUE");
    const nextInvoice = [...openInvoices].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
    const formatBedrag = (amount) =>
        amount != null ? new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(amount) : "—";

    useEffect(() => {
        setContractFile(user?.contractFile || null);
    }, [user?.contractFile]);

    useEffect(() => {
        api.get("/api/invoices/me")
            .then(res => setInvoices(res.data))
            .catch(() => {})
            .finally(() => setInvoicesLoading(false));
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
                        <li><Link to="/student/betalingen"><FiDollarSign /> Betalingen</Link></li>
                        <li>
                            {contractFile
                                ? <a href={`${BASE_URL}/uploads/${encodeURIComponent(contractFile)}`} target="_blank" rel="noopener noreferrer"><FiFileText /> Huurcontract</a>
                                : <Link to="#"><FiFileText /> Huurcontract</Link>
                            }
                        </li>
                        <li><Link to="#"><FiUsers /> Samen eten?</Link></li>
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

            <main className="dashboard-main dashboard-grid">
                {/* Welkom — wide */}
                <article className="dash-card dash-card--wide">
                    <h2><FiBookOpen /> Fijn dat je er bent!</h2>
                    <p>Dit is jouw plek in de villa. Hier vind je alles terug: je schema, huisregels, contract en meer.</p>
                    <p>Kom je er niet uit of heb je een vraag? Stuur gerust een berichtje via <Link to="/contact">Contact</Link>.</p>
                </article>

                {/* Betalingen */}
                <article className="dash-card">
                    <h2><FiDollarSign /> Betalingen</h2>
                    <p>Openstaande en voldane huurbetalingen in één overzicht.</p>
                    <div className="dashboard-cleaning-meta">
                        {!invoicesLoading && openInvoices.length === 0 && (
                            <span className="dashboard-rotation-badge dashboard-invoice-paid">
                                <FiCheckCircle /> Alles betaald
                            </span>
                        )}
                        {!invoicesLoading && openInvoices.length > 0 && (
                            <span className={`dashboard-rotation-badge ${hasOverdue ? "dashboard-invoice-overdue" : "dashboard-invoice-open"}`}>
                                {hasOverdue ? <FiAlertCircle /> : <FiClock />}
                                {openInvoices.length} openstaand
                            </span>
                        )}
                        {!invoicesLoading && nextInvoice && (
                            <span className="week-iso-label">
                                {formatBedrag(nextInvoice.amount)} · vervalt {new Date(nextInvoice.dueDate).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                            </span>
                        )}
                        <Link to="/student/betalingen" className="dashboard-schema-btn">
                            <FiDollarSign /> Bekijk
                        </Link>
                    </div>
                </article>

                {/* Schoonmaakschema */}
                <article className="dash-card">
                    <h2><MdOutlineCleaningServices /> Schoonmaakschema</h2>
                    <p>Jouw taken voor deze week. Het rooster wisselt wekelijks.</p>
                    <div className="dashboard-cleaning-meta">
                        <span className="dashboard-rotation-badge">
                            Week {currentIsoWeek}
                            <span className="week-current-badge">nu</span>
                        </span>
                        <span className="week-iso-label">{weekRange}</span>
                        <Link to="/schoonmaakschema" className="dashboard-schema-btn">
                            <FiClipboard /> Bekijk
                        </Link>
                    </div>
                </article>

                {/* Events */}
                <article className="dash-card">
                    <h2><FiCalendar /> Events & nieuws</h2>
                    <p>Borrels, etentjes en activiteiten in de villa.</p>
                    <div className="dashboard-cleaning-meta">
                        <Link to="/student/events" className="dashboard-schema-btn">
                            <FiCalendar /> Bekijk
                        </Link>
                    </div>
                </article>

                {/* Huisregels */}
                <article className="dash-card">
                    <h2><FiFileText /> Huisregels</h2>
                    <p>Bekijk de afspraken en regels die gelden binnen Villa Vredestein.</p>
                    <div className="dashboard-cleaning-meta">
                        <Link to="/student/huisregels" className="dashboard-schema-btn">
                            <FiFileText /> Bekijk
                        </Link>
                    </div>
                </article>
            </main>
        </div>
    );
};

export default StudentDashboard;
