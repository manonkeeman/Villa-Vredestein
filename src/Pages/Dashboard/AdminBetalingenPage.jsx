import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiDollarSign, FiChevronLeft, FiChevronRight,
    FiCheckCircle, FiClock, FiAlertTriangle, FiSave,
    FiMail, FiRefreshCw, FiSend, FiPlus, FiX,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import { AdminSidebar } from "./AdminBetalingenMatrix.jsx";
import "./StudentDashboard.css";
import "./AdminBetalingenPage.css";
import "./AdminPages.css";
import "../../Styles/Global.css";
import PropTypes from "prop-types";

const NL_MONTHS = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december",
];

const TEMPLATE_LABELS = {
    PAYMENT_NEW:        "Nieuwe factuur (1e van de maand)",
    PAYMENT_REMINDER_1: "Eerste herinnering (3e van de maand)",
    PAYMENT_REMINDER_2: "Tweede herinnering (7e van de maand)",
};

// ── Mock students list ────────────────────────────────────────────────────
const MOCK_STUDENTS = [
    { id: 1, username: "Desmond",  email: "desmond@example.com",  room: "Japan" },
    { id: 2, username: "Medoc",    email: "medoc@example.com",    room: "Argentinië" },
    { id: 3, username: "Simon",    email: "simon@example.com",    room: "Thailand" },
    { id: 4, username: "François", email: "francois@example.com", room: "Frankrijk" },
];

// ── Generate mock invoices for all months in 2026 ─────────────────────────
const MOCK_INVOICES = (() => {
    const invoices = [];
    let idCounter = 1;
    for (let month = 1; month <= 12; month++) {
        MOCK_STUDENTS.forEach(s => {
            const isDesmond = s.username === "Desmond";
            invoices.push({
                id: idCounter++,
                studentId:   s.id,
                studentName: s.username,
                studentEmail: s.email,
                invoiceMonth: month,
                invoiceYear:  2026,
                amount: 550,
                status:   isDesmond ? "OVERDUE" : "PAID",
                dueDate:  `2026-${String(month).padStart(2,"0")}-05`,
                paidAt:   isDesmond ? null : `2026-${String(month).padStart(2,"0")}-03`,
                checkoutUrl: isDesmond ? "https://checkout.mollie.com/mock-desmond" : null,
                reminderCount: isDesmond ? Math.min(month, 2) : 0,
            });
        });
    }
    return invoices;
})();

const MOCK_TEMPLATES = [
    { type: "PAYMENT_NEW",        subject: "Je factuur voor {{maand}} staat klaar", body: "Beste {{naam}},\n\nJe huurrekening van {{bedrag}} voor {{maand}} is klaar. Betaal vóór {{vervaldatum}} via de betaallink:\n\n{{betaalLink}}\n\nMet vriendelijke groet,\nVilla Vredestein" },
    { type: "PAYMENT_REMINDER_1", subject: "Herinnering: openstaande betaling {{maand}}", body: "Beste {{naam}},\n\nJe betaling van {{bedrag}} voor {{maand}} staat nog open. Betaal via:\n\n{{betaalLink}}\n\nMet vriendelijke groet,\nVilla Vredestein" },
    { type: "PAYMENT_REMINDER_2", subject: "2e herinnering: betaling {{maand}} verlopen", body: "Beste {{naam}},\n\nJe betaling van {{bedrag}} is verlopen. Neem direct contact op of betaal via:\n\n{{betaalLink}}\n\nMet vriendelijke groet,\nVilla Vredestein" },
];

const formatBedrag = (amount) => {
    if (amount == null) return "—";
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(amount);
};

const StatusBadge = ({ status }) => {
    const map = {
        PAID:      { label: "Betaald",      icon: <FiCheckCircle />, cls: "status-paid" },
        OPEN:      { label: "Open",         icon: <FiClock />,       cls: "status-open" },
        OVERDUE:   { label: "Verlopen",     icon: <FiAlertTriangle />, cls: "status-overdue" },
        CANCELLED: { label: "Geannuleerd",  icon: <FiAlertTriangle />, cls: "status-cancelled" },
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
    const [viewYear,  setViewYear]  = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);

    // ── Invoices
    const [invoices,        setInvoices]        = useState([]);
    const [loadingInvoices, setLoadingInvoices] = useState(true);
    const [invoiceError,    setInvoiceError]    = useState(null);

    // ── Create invoice form
    const [showCreateForm,  setShowCreateForm]  = useState(false);
    const [newInvStudentId, setNewInvStudentId] = useState("");
    const [newInvAmount,    setNewInvAmount]    = useState("550");
    const [newInvDueDate,   setNewInvDueDate]   = useState("");
    const [creatingInv,     setCreatingInv]     = useState(false);
    const [createInvMsg,    setCreateInvMsg]    = useState(null);

    // ── Email templates
    const [templates,         setTemplates]         = useState([]);
    const [loadingTemplates,  setLoadingTemplates]  = useState(true);
    const [editingType,       setEditingType]       = useState(null);
    const [editSubject,       setEditSubject]       = useState("");
    const [editBody,          setEditBody]          = useState("");
    const [saving,            setSaving]            = useState(false);
    const [saveMsg,           setSaveMsg]           = useState(null);

    // ── Job trigger
    const [triggerMsg,  setTriggerMsg]  = useState(null);
    const [triggering,  setTriggering]  = useState(false);

    // ── Send per-template state
    const [sendStudentId, setSendStudentId] = useState("");
    const [sendStudents,  setSendStudents]  = useState([]);
    const [sending,       setSending]       = useState(false);
    const [sendMsg,       setSendMsg]       = useState(null);

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    // ── Fetch students list
    useEffect(() => {
        api.get("/api/users")
            .then(res => {
                const students = (res.data || []).filter(u => (u.roles||[]).some(r => String(r).includes("STUDENT")));
                setSendStudents(students.length > 0 ? students : MOCK_STUDENTS);
            })
            .catch(() => setSendStudents(MOCK_STUDENTS));
    }, []);

    // ── Fetch invoices for selected month
    const fetchInvoices = useCallback(async () => {
        setLoadingInvoices(true);
        setInvoiceError(null);
        const mockTimer = setTimeout(() => {
            const mock = MOCK_INVOICES.filter(i => i.invoiceMonth === viewMonth && i.invoiceYear === viewYear);
            setInvoices(mock);
            setLoadingInvoices(false);
        }, 1500);
        try {
            const res = await api.get("/api/invoices");
            clearTimeout(mockTimer);
            const filtered = (res.data || []).filter(
                (inv) => inv.invoiceMonth === viewMonth && inv.invoiceYear === viewYear
            );
            filtered.sort((a, b) => (a.studentName || "").localeCompare(b.studentName || ""));
            setInvoices(filtered.length > 0 ? filtered : MOCK_INVOICES.filter(i => i.invoiceMonth === viewMonth && i.invoiceYear === viewYear));
        } catch {
            clearTimeout(mockTimer);
            setInvoices(MOCK_INVOICES.filter(i => i.invoiceMonth === viewMonth && i.invoiceYear === viewYear));
        } finally {
            setLoadingInvoices(false);
        }
    }, [viewMonth, viewYear]);

    useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

    // ── Fetch email templates
    useEffect(() => {
        const mockTimer = setTimeout(() => {
            setTemplates(MOCK_TEMPLATES);
            setLoadingTemplates(false);
        }, 1500);
        api.get("/api/admin/email-templates")
            .then(res => { clearTimeout(mockTimer); setTemplates(res.data || MOCK_TEMPLATES); })
            .catch(() => { clearTimeout(mockTimer); setTemplates(MOCK_TEMPLATES); })
            .finally(() => setLoadingTemplates(false));
    }, []);

    // ── Month navigation
    const prevMonth = () => {
        if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    // ── Create invoice
    const createInvoice = async () => {
        if (!newInvStudentId || !newInvAmount) {
            setCreateInvMsg("Kies een student en vul een bedrag in."); return;
        }
        setCreatingInv(true); setCreateInvMsg(null);
        try {
            await api.post("/api/invoices", {
                userId:    newInvStudentId,
                amount:    parseFloat(newInvAmount),
                dueDate:   newInvDueDate || undefined,
                sendEmail: true,
            });
            setCreateInvMsg("Factuur aangemaakt en e-mail met betaallink verzonden!");
            setShowCreateForm(false);
            setNewInvStudentId(""); setNewInvAmount("550"); setNewInvDueDate("");
            fetchInvoices();
        } catch {
            setCreateInvMsg("Fout bij aanmaken (backend niet bereikbaar). Mollie-link wordt aangemaakt door backend.");
        } finally {
            setCreatingInv(false);
        }
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
        setSaving(true); setSaveMsg(null);
        api.put(`/api/admin/email-templates/${editingType}`, { subject: editSubject, body: editBody })
            .then(res => {
                setTemplates(prev => prev.map(t => t.type === editingType ? res.data : t));
                setSaveMsg("Opgeslagen!");
                setEditingType(null);
            })
            .catch(err => setSaveMsg("Fout: " + (err.response?.data?.message || err.message)))
            .finally(() => setSaving(false));
    };

    // ── Send reminder
    const sendReminder = async (templateType) => {
        if (!sendStudentId) { setSendMsg("Kies eerst een student."); return; }
        setSending(true); setSendMsg(null);
        try {
            await api.post("/api/admin/email/send", { userId: sendStudentId, templateType });
            setSendMsg("E-mail verzonden!");
        } catch {
            setSendMsg("Fout bij verzenden (backend niet bereikbaar).");
        } finally {
            setSending(false);
        }
    };

    // ── Trigger job
    const triggerJob = async (path, label) => {
        setTriggering(true); setTriggerMsg(null);
        api.post(`/api/admin/jobs/${path}`)
            .then(res => setTriggerMsg(res.data?.message || label + " gestart"))
            .catch(() => setTriggerMsg("Fout bij starten van job"))
            .finally(() => setTriggering(false));
    };

    const monthHeader = `${NL_MONTHS[viewMonth - 1]} ${viewYear}`;
    const sidebar = <AdminSidebar active="betalingen" logout={logout} username={user?.username} />;

    return (
        <DashboardLayout sidebar={sidebar} mainClass="admin-main">
            <Helmet>
                <title>Betalingen beheer — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* ── Invoice overview ── */}
            <section className="dashboard-news admin-payments-section">
                <div className="dashboard-news-content" style={{ overflowX: "auto" }}>
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
                                            {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("nl-NL") : "—"}
                                        </td>
                                        <td className="payment-paidat">
                                            {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString("nl-NL") : "—"}
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

            {/* ── Factuur aanmaken ── */}
            <section className="dashboard-news">
                <div className="dashboard-news-content">
                    <div className="factuur-header">
                        <h2><FiPlus /> Factuur aanmaken</h2>
                        <button
                            type="button"
                            className="admin-btn admin-btn--ghost admin-btn--small"
                            onClick={() => { setShowCreateForm(v => !v); setCreateInvMsg(null); }}
                        >
                            {showCreateForm ? <><FiX /> Sluiten</> : <><FiPlus /> Nieuw</>}
                        </button>
                    </div>
                    <p style={{ fontSize: 13, color: "#888", marginBottom: "0.75rem" }}>
                        Maak een factuur voor een specifieke student aan. De backend stuurt automatisch een e-mail met Mollie-betaallink naar het gekoppelde e-mailadres.
                    </p>

                    {showCreateForm && (
                        <div className="factuur-form">
                            <div className="factuur-form-row">
                                <div className="bew-field" style={{ flex: 2 }}>
                                    <label>Student</label>
                                    <select
                                        value={newInvStudentId}
                                        onChange={e => { setNewInvStudentId(e.target.value); setCreateInvMsg(null); }}
                                        className="template-input"
                                    >
                                        <option value="">— Kies student —</option>
                                        {sendStudents.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.username} ({s.email || s.room || ""})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="bew-field" style={{ flex: 1 }}>
                                    <label>Bedrag (€)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        value={newInvAmount}
                                        onChange={e => setNewInvAmount(e.target.value)}
                                        className="template-input"
                                        placeholder="550.00"
                                    />
                                </div>
                                <div className="bew-field" style={{ flex: 1 }}>
                                    <label>Vervaldatum</label>
                                    <input
                                        type="date"
                                        value={newInvDueDate}
                                        onChange={e => setNewInvDueDate(e.target.value)}
                                        className="template-input"
                                    />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "0.5rem" }}>
                                <button
                                    type="button"
                                    className="admin-btn"
                                    disabled={creatingInv || !newInvStudentId || !newInvAmount}
                                    onClick={createInvoice}
                                >
                                    <FiSend /> {creatingInv ? "Aanmaken…" : "Aanmaken & stuur e-mail"}
                                </button>
                            </div>
                            {createInvMsg && (
                                <p style={{ fontSize: 13, marginTop: "0.5rem", color: createInvMsg.startsWith("Fout") ? "#ef4444" : "#22c55e" }}>
                                    {createInvMsg}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Job triggers ── */}
            <section className="admin-section" style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FiRefreshCw /> Automatische jobs
                </h2>
                <p className="jobs-hint">Start een job om facturen voor alle bewoners aan te maken of herinneringen te sturen.</p>
                <div className="jobs-row">
                    <button type="button" className="admin-btn" disabled={triggering} onClick={() => triggerJob("monthly-invoices/trigger", "Maandfacturen")}>
                        Facturen aanmaken (1e)
                    </button>
                    <button type="button" className="admin-btn admin-btn--ghost" disabled={triggering} onClick={() => triggerJob("payment-reminder-1/trigger", "Eerste herinnering")}>
                        Eerste herinnering (3e)
                    </button>
                    <button type="button" className="admin-btn admin-btn--ghost" disabled={triggering} onClick={() => triggerJob("payment-reminder-2/trigger", "Tweede herinnering")}>
                        Tweede herinnering (7e)
                    </button>
                </div>
                {triggerMsg && <p style={{ fontSize: 13, color: "#22c55e", marginTop: "0.5rem" }}>{triggerMsg}</p>}
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
                                    <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                                        <select
                                            value={sendStudentId}
                                            onChange={e => { setSendStudentId(e.target.value); setSendMsg(null); }}
                                            className="template-input"
                                            style={{ minWidth: 160, fontSize: 13 }}
                                        >
                                            <option value="">— Kies student —</option>
                                            {sendStudents.map(s => (
                                                <option key={s.id} value={s.id}>{s.username}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn--small"
                                            disabled={sending || !sendStudentId}
                                            onClick={() => sendReminder(tpl.type)}
                                        >
                                            <FiSend /> {sending ? "Versturen…" : "Verstuur"}
                                        </button>
                                    </div>
                                    {sendMsg && tpl.type === templates.find(t => t.type === templates[templates.length - 1]?.type)?.type && (
                                        <p style={{ fontSize: 12, marginTop: "0.3rem", color: sendMsg.startsWith("Fout") ? "#ef4444" : "#22c55e" }}>{sendMsg}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {sendMsg && !loadingTemplates && (
                        <p style={{ fontSize: 13, marginTop: "0.25rem", color: sendMsg.startsWith("Fout") ? "#ef4444" : "#22c55e" }}>{sendMsg}</p>
                    )}
                </div>
            </section>

        </DashboardLayout>
    );
};

export default AdminBetalingenPage;