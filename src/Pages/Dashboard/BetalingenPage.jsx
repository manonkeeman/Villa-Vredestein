import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiDollarSign, FiDownload, FiExternalLink, FiCheckCircle, FiClock, FiAlertTriangle,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import StudentSidebar from "../../Components/StudentSidebar/StudentSidebar.jsx";
import "./StudentDashboard.css";
import "./BetalingenPage.css";
import "../../Styles/Global.css";
import PropTypes from "prop-types";

const NL_MONTHS = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december",
];

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

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

const BetalingenPage = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const contractFile = user?.contractFile || null;
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    useEffect(() => {
        api.get("/api/invoices/me")
            .then(res => setInvoices(res.data))
            .catch(err => setError(err.response?.data?.message || "Kon facturen niet laden"))
            .finally(() => setLoading(false));
    }, []);

    const handleDownload = async (invoiceId, title) => {
        try {
            const res = await api.get(`/api/invoices/${invoiceId}/pdf`, { responseType: "blob" });
            const url = URL.createObjectURL(res.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = `factuur-${title || invoiceId}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            alert("Fout bij downloaden van de factuur.");
        }
    };

    const monthLabel = (month, year) =>
        `${NL_MONTHS[(month ?? 1) - 1] ?? "?"} ${year ?? ""}`;

    return (
        <>
            <Helmet>
                <title>Betalingen — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <DashboardLayout sidebar={<StudentSidebar user={user} logout={logout} active="betalingen" contractFile={contractFile} />}>
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
            </DashboardLayout>
        </>
    );
};

export default BetalingenPage;