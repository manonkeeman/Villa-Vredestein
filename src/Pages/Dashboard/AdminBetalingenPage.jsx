import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiUsers, FiDollarSign, FiClipboard,
    FiFileText, FiSettings, FiShield, FiTool, FiChevronLeft,
    FiChevronRight, FiCheckCircle, FiClock, FiAlertTriangle, FiSave,
    FiMail, FiRefreshCw,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import "./StudentDashboard.css";
import "./AdminBetalingenPage.css";
import "../../Styles/Global.css";
import PropTypes from "prop-types";

const NL_MONTHS = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december",
];

const TEMPLATE_LABELS = {
    PAYMENT_NEW: "Nieuwe factuur (1e van de maand)",
    PAYMENT_REMINDER_1: "Eerste herinnering (3e van de maand)",
    PAYMENT_REMINDER_2: "Tweede herinnering (7e van de maand)",
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

const AdminBetalingenPage = () => {
    const { isLoggedIn, logout, user } = useAuth();

    // ── Month navigation
    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth() + 1); // 1-12

    // ── Data
    const [invoices, setInvoices] = useState([]);
    const [loadingInvoices, setLoadingInvoices] = useState(true);
    const [invoiceError, setInvoiceError] = useState(null);

    // ── Email templates
    const [templates, setTemplates] = useState([]);
    const [loadingTemplates, setLoadingTemplates] = useState(true);
    const [templateError, setTemplateError] = useState(null);
    const [editingType, setEditingType] = useState(null);
    const [editSubject, setEditSubject] = useState("");
    const [editBody, setEditBody] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState(null);

    // ── Job trigger
    const [triggerMsg, setTriggerMsg] = useState(null);
    const [triggering, setTriggering] = useState(false);

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    // ── Fetch invoices for selected month
    const fetchInvoices = useCallback(async () => {
        setLoadingInvoices(true);
        setInvoiceError(null);
        api.get("/api/invoices")
            .then(res => {
                const filtered = res.data.filter(
                    (inv) => inv.invoiceMonth === viewMonth && inv.invoiceYear === viewYear
                );
                filtered.sort((a, b) => (a.studentName || "").localeCompare(b.studentName || ""));
                setInvoices(filtered);
            })
            .catch(err => setInvoiceError(err.response?.data?.message || "Kon facturen niet laden"))
            .finally(() => setLoadingInvoices(false));
    }, [viewMonth, viewYear]);

    useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

    // ── Fetch email templates
    useEffect(() => {
        api.get("/api/admin/email-templates")
            .then(res => setTemplates(res.data))
            .catch(err => setTemplateError(err.response?.data?.message || "Kon templates niet laden"))
            .finally(() => setLoadingTemplates(false));
    }, []);

    // ── Month navigation
    const prevMonth = () => {
        if (viewMonth === 1) { setViewMonth(12); setViewYear((y) => y - 1); }
        else setViewMonth((m) => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 12) { setViewMonth(1); setViewYear((y) => y + 1); }
        else setViewMonth((m) => m + 1);
    };

    // ── Edit template
    const startEdit = (tpl) => {
        setEditingType(tpl.type);
        setEditSubject(tpl.subject);
        setEditBody(tpl.body);
        setSaveMsg(null);
    };
    const cancelEdit = () => { setEditingType(null); setSaveMsg(null); };

    const saveTemplate = async () => {
        setSaving(true);
        setSaveMsg(null);
        api.put(`/api/admin/email-templates/${editingType}`, { subject: editSubject, body: editBody })
            .then(res => {
                setTemplates((prev) => prev.map((t) => (t.type === editingType ? res.data : t)));
                setSaveMsg("Opgeslagen!");
                setEditingType(null);
            })
            .catch(err => setSaveMsg("Fout: " + (err.response?.data?.message || err.message)))
            .finally(() => setSaving(false));
    };

    // ── Trigger monthly invoice job
    const triggerJob = async (path, label) => {
        setTriggering(true);
        setTriggerMsg(null);
        api.post(`/api/admin/jobs/${path}`)
            .then(res => setTriggerMsg(res.data?.message || label + " gestart"))
            .catch(() => setTriggerMsg("Fout bij starten van job"))
            .finally(() => setTriggering(false));
    };

    const monthHeader = `${NL_MONTHS[viewMonth - 1]} ${viewYear}`;

    return (
        <div className="StudentDashboard">
            <Helmet>
                <title>Betalingen beheer — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <aside className="dashboard-sidebar" aria-label="Navigatie zijbalk">
                <header className="sidebar-profile">
                    <FiShield className="profile-icon" />
                </header>
                <h3 className="sidebar-title">Welkom {user?.username || "Beheerder"}</h3>

                <nav className="sidebar-nav">
                    <ul>
                        <li><Link to="/admin"><FiHome /> Dashboard</Link></li>
                        <li><Link to="#"><FiUsers /> Bewoners</Link></li>
                        <li><Link to="/admin/betalingen" className="active-nav-link"><FiDollarSign /> Betalingen</Link></li>
                        <li><Link to="/student/huisregels"><FiFileText /> Huisregels</Link></li>
                        <li><Link to="#"><FiFileText /> Documenten</Link></li>
                        <li><Link to="/schoonmaakschema"><FiClipboard /> Schoonmaakschema</Link></li>
                        <li><Link to="#"><FiTool /> Onderhoud</Link></li>
                        <li><Link to="#"><FiSettings /> Instellingen</Link></li>
                        <li>
                            <button onClick={logout} type="button" className="logout-button">
                                <FiLogOut /> Log uit
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="dashboard-main">

                {/* ── Invoice overview ── */}
                <section className="dashboard-news admin-payments-section">
                    <div className="dashboard-news-content">
                        <div className="admin-month-nav">
                            <button type="button" onClick={prevMonth} className="month-nav-btn" aria-label="Vorige maand">
                                <FiChevronLeft />
                            </button>
                            <h2 className="admin-month-title">
                                <FiDollarSign /> Betalingen — <span className="month-label">{monthHeader}</span>
                            </h2>
                            <button type="button" onClick={nextMonth} className="month-nav-btn" aria-label="Volgende maand">
                                <FiChevronRight />
                            </button>
                        </div>

                        {loadingInvoices && <p className="payments-loading">Laden…</p>}
                        {invoiceError && <p className="payments-error"><FiAlertTriangle /> {invoiceError}</p>}

                        {!loadingInvoices && !invoiceError && invoices.length === 0 && (
                            <p className="payments-empty">Geen facturen gevonden voor {monthHeader}.</p>
                        )}

                        {!loadingInvoices && !invoiceError && invoices.length > 0 && (
                            <table className="payments-table">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Bedrag</th>
                                        <th>Vervaldatum</th>
                                        <th>Betaald op</th>
                                        <th>Status</th>
                                        <th>Herinneringen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((inv) => (
                                        <tr key={inv.id} className={`payment-row payment-row-${(inv.status || "").toLowerCase()}`}>
                                            <td className="payment-student">
                                                <strong>{inv.studentName || "—"}</strong>
                                                <br />
                                                <span className="payment-email">{inv.studentEmail}</span>
                                            </td>
                                            <td className="payment-amount">{formatBedrag(inv.amount)}</td>
                                            <td className="payment-due">
                                                {inv.dueDate
                                                    ? new Date(inv.dueDate).toLocaleDateString("nl-NL")
                                                    : "—"}
                                            </td>
                                            <td className="payment-paidat">
                                                {inv.paidAt
                                                    ? new Date(inv.paidAt).toLocaleDateString("nl-NL")
                                                    : "—"}
                                            </td>
                                            <td><StatusBadge status={inv.status} /></td>
                                            <td className="payment-reminders">
                                                {inv.reminderCount ?? 0}×
                                                {inv.lastReminderSentAt && (
                                                    <span className="reminder-date">
                                                        {" "}({new Date(inv.lastReminderSentAt).toLocaleDateString("nl-NL")})
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>

                {/* ── Job triggers ── */}
                <section className="dashboard-news">
                    <div className="dashboard-news-content">
                        <h2><FiRefreshCw /> Jobs handmatig starten</h2>
                        <p className="jobs-hint">Start een job handmatig om facturen aan te maken of herinneringen te sturen.</p>
                        <div className="jobs-row">
                            <button
                                type="button"
                                className="job-btn"
                                disabled={triggering}
                                onClick={() => triggerJob("monthly-invoices/trigger", "Maandfacturen")}
                            >
                                Facturen aanmaken (1e)
                            </button>
                            <button
                                type="button"
                                className="job-btn"
                                disabled={triggering}
                                onClick={() => triggerJob("payment-reminder-1/trigger", "Eerste herinnering")}
                            >
                                Eerste herinnering (3e)
                            </button>
                            <button
                                type="button"
                                className="job-btn"
                                disabled={triggering}
                                onClick={() => triggerJob("payment-reminder-2/trigger", "Tweede herinnering")}
                            >
                                Tweede herinnering (7e)
                            </button>
                        </div>
                        {triggerMsg && <p className="trigger-msg">{triggerMsg}</p>}
                    </div>
                </section>

                {/* ── Email template editor ── */}
                <section className="dashboard-news">
                    <div className="dashboard-news-content">
                        <h2><FiMail /> E-mail sjablonen</h2>
                        <p className="template-hint">
                            Gebruik <code>{"{{naam}}"}</code>, <code>{"{{bedrag}}"}</code>, <code>{"{{maand}}"}</code>,{" "}
                            <code>{"{{betaalLink}}"}</code>, <code>{"{{vervaldatum}}"}</code> als placeholders.
                        </p>

                        {loadingTemplates && <p className="payments-loading">Sjablonen laden…</p>}
                        {templateError && <p className="payments-error"><FiAlertTriangle /> {templateError}</p>}

                        {!loadingTemplates && templates.map((tpl) => (
                            <div key={tpl.type} className="template-card">
                                <div className="template-card-header">
                                    <strong>{TEMPLATE_LABELS[tpl.type] || tpl.type}</strong>
                                    {editingType !== tpl.type && (
                                        <button type="button" className="template-edit-btn" onClick={() => startEdit(tpl)}>
                                            Bewerken
                                        </button>
                                    )}
                                </div>

                                {editingType === tpl.type ? (
                                    <div className="template-editor">
                                        <label className="template-field-label">Onderwerp</label>
                                        <input
                                            type="text"
                                            className="template-input"
                                            value={editSubject}
                                            onChange={(e) => setEditSubject(e.target.value)}
                                        />
                                        <label className="template-field-label">Berichttekst</label>
                                        <textarea
                                            className="template-textarea"
                                            rows={10}
                                            value={editBody}
                                            onChange={(e) => setEditBody(e.target.value)}
                                        />
                                        <div className="template-actions">
                                            <button type="button" className="template-save-btn" onClick={saveTemplate} disabled={saving}>
                                                <FiSave /> {saving ? "Opslaan…" : "Opslaan"}
                                            </button>
                                            <button type="button" className="template-cancel-btn" onClick={cancelEdit}>
                                                Annuleren
                                            </button>
                                        </div>
                                        {saveMsg && <p className="save-msg">{saveMsg}</p>}
                                    </div>
                                ) : (
                                    <div className="template-preview">
                                        <p className="template-subject-preview">
                                            <span className="template-label-inline">Onderwerp:</span> {tpl.subject}
                                        </p>
                                        <pre className="template-body-preview">{tpl.body}</pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
};

export default AdminBetalingenPage;