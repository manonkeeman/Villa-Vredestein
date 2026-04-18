import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText, FiCalendar,
    FiUser, FiUsers, FiDollarSign, FiClipboard,
    FiShield, FiDownload, FiExternalLink, FiCheckCircle, FiClock, FiAlertTriangle,
} from "react-icons/fi";
import "./StudentDashboard.css";
import "./BetalingenPage.css";
import "../../Styles/Global.css";
import PropTypes from "prop-types";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

const NL_MONTHS = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december",
];

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

const formatBedrag = (amount) => {
    if (amount == null) return "—";
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(amount);
};

const StatusBadge = ({ status }) => {
    const map = {
        PAID: { label: "Betaald", icon: <FiCheckCircle />, cls: "status-paid" },
        OPEN: { label: "Open", icon: <FiClock />, cls: "status-open" },
        OVERDUE: { label: "Verlopen", icon: <FiAlertTriangle />, cls: "status-overdue" },
        CANCELLED: { label: "Geannuleerd", icon: <FiAlertTriangle />, cls: "status-cancelled" },
    };
    const s = map[status] || { label: status, icon: null, cls: "" };
    return (
        <span className={`payment-status-badge ${s.cls}`}>
            {s.icon} {s.label}
        </span>
    );
};
StatusBadge.propTypes = { status: PropTypes.string.isRequired };

const BetalingenPage = () => {
    const { isLoggedIn, logout, user, token } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/invoices/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Kon facturen niet laden");
                const data = await res.json();
                setInvoices(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, [token]);

    const handleDownload = async (invoiceId, title) => {
        try {
            const res = await fetch(`${BASE_URL}/api/invoices/${invoiceId}/pdf`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("PDF kon niet worden gedownload");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `factuur-${title || invoiceId}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert("Fout bij downloaden: " + err.message);
        }
    };

    const monthLabel = (month, year) =>
        `${NL_MONTHS[(month ?? 1) - 1] ?? "?"} ${year ?? ""}`;

    return (
        <div className="StudentDashboard">
            <Helmet>
                <title>Betalingen — Villa Vredestein</title>
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
                        <li><Link to="/student/betalingen" className="active-nav-link"><FiDollarSign /> Betalingen</Link></li>
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
                        <h2><FiDollarSign /> Mijn betaalschema</h2>
                        <p>Hier zie je een overzicht van al je huurbetalingen. Open facturen kun je direct betalen via iDEAL.</p>
                        {!loading && !error && invoices.length > 0 && (() => {
                            const totalOpen = invoices
                                .filter(i => i.status === "OPEN" || i.status === "OVERDUE")
                                .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
                            const totalPaid = invoices
                                .filter(i => i.status === "PAID")
                                .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
                            const overdueCount = invoices.filter(i => i.status === "OVERDUE").length;
                            const openCount = invoices.filter(i => i.status === "OPEN" || i.status === "OVERDUE").length;
                            return (
                                <div className="payments-summary">
                                    <div className="payments-summary-item">
                                        <span className="summary-label"><FiCheckCircle /> Betaald</span>
                                        <span className="summary-value summary-paid">{formatBedrag(totalPaid)}</span>
                                    </div>
                                    <div className="payments-summary-divider" />
                                    <div className="payments-summary-item">
                                        <span className="summary-label">
                                            {overdueCount > 0 ? <FiAlertTriangle /> : <FiClock />}
                                            {overdueCount > 0 ? " Verlopen" : " Openstaand"}
                                        </span>
                                        <span className={`summary-value ${overdueCount > 0 ? "summary-overdue" : openCount > 0 ? "summary-open" : "summary-paid"}`}>
                                            {openCount > 0 ? formatBedrag(totalOpen) : "—"}
                                        </span>
                                    </div>
                                    <div className="payments-summary-divider" />
                                    <div className="payments-summary-item">
                                        <span className="summary-label"><FiFileText /> Facturen</span>
                                        <span className="summary-value">{invoices.length} totaal</span>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </section>

                {loading && (
                    <section className="dashboard-news">
                        <div className="dashboard-news-content">
                            <p className="payments-loading">Facturen laden…</p>
                        </div>
                    </section>
                )}

                {error && (
                    <section className="dashboard-news">
                        <div className="dashboard-news-content payments-error">
                            <FiAlertTriangle /> {error}
                        </div>
                    </section>
                )}

                {!loading && !error && invoices.length === 0 && (
                    <section className="dashboard-news">
                        <div className="dashboard-news-content">
                            <p className="payments-empty">Er zijn nog geen facturen voor jou beschikbaar.</p>
                        </div>
                    </section>
                )}

                {!loading && !error && invoices.length > 0 && (
                    <section className="dashboard-news payments-section">
                        <div className="dashboard-news-content">
                            <table className="payments-table">
                                <thead>
                                    <tr>
                                        <th>Maand</th>
                                        <th>Bedrag</th>
                                        <th>Vervaldatum</th>
                                        <th>Status</th>
                                        <th>Acties</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((inv) => (
                                        <tr key={inv.id} className={`payment-row payment-row-${(inv.status || "").toLowerCase()}`}>
                                            <td className="payment-month">
                                                {monthLabel(inv.invoiceMonth, inv.invoiceYear)}
                                            </td>
                                            <td className="payment-amount">{formatBedrag(inv.amount)}</td>
                                            <td className="payment-due">
                                                {inv.dueDate
                                                    ? new Date(inv.dueDate).toLocaleDateString("nl-NL")
                                                    : "—"}
                                            </td>
                                            <td><StatusBadge status={inv.status} /></td>
                                            <td className="payment-actions">
                                                {(inv.status === "OPEN" || inv.status === "OVERDUE") && inv.checkoutUrl && (
                                                    <a
                                                        href={inv.checkoutUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="payment-btn payment-btn-pay"
                                                        title="Betaal via iDEAL"
                                                    >
                                                        <FiExternalLink /> Betaal
                                                    </a>
                                                )}
                                                {inv.status === "PAID" && (
                                                    <button
                                                        type="button"
                                                        className="payment-btn payment-btn-pdf"
                                                        onClick={() => handleDownload(inv.id, `${inv.invoiceMonth}-${inv.invoiceYear}`)}
                                                        title="Download factuur als PDF"
                                                    >
                                                        <FiDownload /> PDF
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default BetalingenPage;