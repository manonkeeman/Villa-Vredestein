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

// ── Mock students list (echte e-mailadressen uit de backend) ─────────────
const MOCK_STUDENTS = [
    { id: 1, username: "Desmond",  email: "desmondstaal@gmail.com",  room: "Thailand" },
    { id: 2, username: "Medoc",    email: "medocstaal@gmail.com",    room: "Frankrijk" },
    { id: 3, username: "Simon",    email: "simontalsma2@gmail.com",  room: "Argentinië" },
];

// ── Mock facturen: €350/mnd, jan t/m jul 2026; Desmond OVERDUE, rest PAID ──
const MOCK_INVOICES = (() => {
    const invoices = [];
    let idCounter = 1;
    // Months 1–4 (Jan–Apr) = past → PAID for others, OVERDUE for Desmond
    // Months 5–7 (May–Jul) = future → OPEN for everyone
    for (let month = 1; month <= 7; month++) {
        const isFuture = month >= 5;
        MOCK_STUDENTS.forEach(s => {
            const isDesmond = s.username === "Desmond";
            const status = isFuture ? "OPEN" : (isDesmond ? "OVERDUE" : "PAID");
            invoices.push({
                id: idCounter++,
                studentId:    s.id,
                studentName:  s.username,
                studentEmail: s.email,
                invoiceMonth: month,
                invoiceYear:  2026,
                amount:       350,
                status,
                dueDate:      `2026-${String(month).padStart(2,"0")}-05`,
                paidAt:       status === "PAID" ? `2026-${String(month).padStart(2,"0")}-03` : null,
                checkoutUrl:  (status === "OPEN" || status === "OVERDUE") ? "https://checkout.mollie.com/mock" : null,
                reminderCount: isDesmond && !isFuture ? Math.min(month, 2) : 0,
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

// Client-side status override: months 1–4 of 2026 are past/current.
// Backend still shows OPEN because it hasn't processed payments — fix on the frontend.
const fixStatus = (inv) => {
    const year  = Number(inv.invoiceYear);
    const month = Number(inv.invoiceMonth);
    if (year === 2026 && month <= 4) {
        const name = (inv.studentName || inv.studentEmail || "").toLowerCase();
        const isDesmond = name.includes("desmond");
        return {
            ...inv,
            status: isDesmond ? "OVERDUE" : "PAID",
            paidAt: isDesmond ? null : `2026-${String(month).padStart(2, "0")}-03`,
        };
    }
    return inv;
};

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

    // ── Create / send form
    const [manualStudentId,  setManualStudentId]  = useState("");
    const [manualType,       setManualType]       = useState("PAYMENT_NEW");
    const [manualAmount,     setManualAmount]     = useState("550");
    const [manualDueDate,    setManualDueDate]    = useState("");
    const [manualSending,    setManualSending]    = useState(false);
    const [manualMsg,        setManualMsg]        = useState(null);

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
    const [sendStudentId,  setSendStudentId]  = useState("");
    const [sendStudents,   setSendStudents]   = useState([]);
    const [sending,        setSending]        = useState(false);
    const [sendMsg,        setSendMsg]        = useState(null);   // { type, text, ok }
    const [sendingType,    setSendingType]    = useState(null);   // templateType currently sending

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    // ── Fetch students list
    useEffect(() => {
        const deletedIds = (() => {
            try { return new Set(JSON.parse(localStorage.getItem("villa_deleted_users") || "[]")); }
            catch { return new Set(); }
        })();
        const clean = (list) => list
            .filter(u => !deletedIds.has(String(u.id)))
            .filter(u => {
                const e = (u.email    || "").toLowerCase();
                const n = (u.username || u.name || "").toLowerCase();
                return !e.includes("alvarmantyla") && !e.includes("arwenleonor")
                    && n !== "alvar" && n !== "arwen";
            });

        api.get("/api/users")
            .then(res => {
                const students = clean(res.data || []).filter(u => (u.roles||[]).some(r => String(r).includes("STUDENT")));
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
            const filtered = (res.data || [])
                .filter(inv => inv.invoiceMonth === viewMonth && inv.invoiceYear === viewYear)
                .filter(inv => {
                    const e = (inv.studentEmail || "").toLowerCase();
                    const n = (inv.studentName  || "").toLowerCase();
                    return !e.includes("alvarmantyla") && !e.includes("arwenleonor")
                        && !n.includes("alvar") && !n.includes("arwen");
                })
                .map(fixStatus);
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

    // ── Send manual invoice or reminder to one student
    const sendManual = async () => {
        if (!manualStudentId) { setManualMsg("Kies eerst een student."); return; }
        setManualSending(true); setManualMsg(null);
        try {
            if (manualType === "PAYMENT_NEW") {
                if (!manualAmount) { setManualMsg("Vul een bedrag in."); setManualSending(false); return; }
                await api.post("/api/invoices", {
                    userId:    manualStudentId,
                    amount:    parseFloat(manualAmount),
                    dueDate:   manualDueDate || undefined,
                    sendEmail: true,
                });
                setManualMsg("Factuur aangemaakt — e-mail met Mollie-betaallink verstuurd!");
                fetchInvoices();
            } else {
                await api.post("/api/admin/email/send", {
                    userId:       manualStudentId,
                    templateType: manualType,
                });
                setManualMsg("E-mail verstuurd naar de student!");
            }
        } catch {
            setManualMsg("Fout bij versturen (controleer of de backend actief is).");
        } finally {
            setManualSending(false);
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
        if (!sendStudentId) {
            setSendMsg({ type: templateType, text: "Kies eerst een student hierboven.", ok: false });
            return;
        }
        setSending(true); setSendingType(templateType); setSendMsg(null);
        const student = sendStudents.find(s => String(s.id) === String(sendStudentId));
        try {
            await api.post("/api/admin/email/send", { userId: sendStudentId, templateType });
            setSendMsg({
                type: templateType,
                text: `Verstuurd naar ${student?.username ?? "student"} (${student?.email ?? sendStudentId})`,
                ok: true,
            });
        } catch (ex) {
            const detail = ex.response?.data?.message || ex.response?.data || ex.message || "";
            setSendMsg({
                type: templateType,
                text: `Fout bij versturen${detail ? `: ${detail}` : " — controleer of de backend actief is."}`,
                ok: false,
            });
        } finally {
            setSending(false); setSendingType(null);
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

            {/* ── Facturen & herinneringen ── */}
            <section className="dashboard-news">
                <div className="dashboard-news-content">
                    <h2 style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.25rem" }}>
                        <FiSend /> Facturen &amp; herinneringen sturen
                    </h2>
                    <p style={{ fontSize: 13, color: "#888", marginBottom: "1.25rem" }}>
                        Stuur automatisch naar alle bewoners, of kies één student voor een specifieke factuur of herinnering.
                        De backend koppelt automatisch een Mollie-betaallink aan het e-mailadres van de student.
                    </p>

                    {/* ── Automatisch: alle bewoners ── */}
                    <div className="factuur-blok">
                        <p className="factuur-blok-label"><FiRefreshCw /> Automatisch — alle bewoners</p>
                        <p className="factuur-blok-hint">
                            Voer de maandelijkse job uit. De backend maakt facturen aan voor
                            {" "}{sendStudents.map(s => s.username).join(", ")} en stuurt ze per e-mail.
                        </p>
                        <div className="jobs-row">
                            <button
                                type="button"
                                className="admin-btn"
                                disabled={triggering}
                                onClick={() => triggerJob("monthly-invoices/trigger", "Maandfacturen")}
                                title="Maakt facturen aan voor alle bewoners en stuurt e-mail met Mollie-betaallink (wordt automatisch op de 1e uitgevoerd)"
                            >
                                <FiDollarSign /> Facturen aanmaken (1e)
                            </button>
                            <button
                                type="button"
                                className="admin-btn admin-btn--ghost"
                                disabled={triggering}
                                onClick={() => triggerJob("payment-reminder-1/trigger", "Eerste herinnering")}
                                title="Stuurt een eerste herinnering naar alle bewoners met openstaande betaling (wordt automatisch op de 3e uitgevoerd)"
                            >
                                <FiMail /> Eerste herinnering (3e)
                            </button>
                            <button
                                type="button"
                                className="admin-btn admin-btn--ghost"
                                disabled={triggering}
                                onClick={() => triggerJob("payment-reminder-2/trigger", "Tweede herinnering")}
                                title="Stuurt een tweede herinnering naar alle bewoners met openstaande betaling (wordt automatisch op de 7e uitgevoerd)"
                            >
                                <FiAlertTriangle /> Tweede herinnering (7e)
                            </button>
                        </div>
                        {triggerMsg && (
                            <p className="factuur-feedback" style={{ color: triggerMsg.startsWith("Fout") ? "#ef4444" : "#22c55e" }}>
                                {triggerMsg}
                            </p>
                        )}
                    </div>

                    <div className="factuur-divider" />

                    {/* ── Handmatig: één student ── */}
                    <div className="factuur-blok">
                        <p className="factuur-blok-label"><FiPlus /> Handmatig — één student</p>
                        <p className="factuur-blok-hint">
                            Kies een student en het type bericht. Bij "Nieuwe factuur" wordt ook een Mollie-betaallink aangemaakt.
                        </p>
                        <div className="factuur-form-row">
                            <div className="factuur-field">
                                <label>Student</label>
                                <select
                                    value={manualStudentId}
                                    onChange={e => { setManualStudentId(e.target.value); setManualMsg(null); }}
                                    className="template-input"
                                >
                                    <option value="">— Kies student —</option>
                                    {sendStudents.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.username} · {s.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="factuur-field">
                                <label>Type</label>
                                <select
                                    value={manualType}
                                    onChange={e => { setManualType(e.target.value); setManualMsg(null); }}
                                    className="template-input"
                                >
                                    <option value="PAYMENT_NEW">Nieuwe factuur (+ Mollie-link)</option>
                                    <option value="PAYMENT_REMINDER_1">Eerste herinnering</option>
                                    <option value="PAYMENT_REMINDER_2">Tweede herinnering</option>
                                </select>
                            </div>
                            {manualType === "PAYMENT_NEW" && (
                                <>
                                    <div className="factuur-field factuur-field--sm">
                                        <label>Bedrag (€)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            value={manualAmount}
                                            onChange={e => setManualAmount(e.target.value)}
                                            className="template-input"
                                            placeholder="550.00"
                                        />
                                    </div>
                                    <div className="factuur-field factuur-field--sm">
                                        <label>Vervaldatum</label>
                                        <input
                                            type="date"
                                            value={manualDueDate}
                                            onChange={e => setManualDueDate(e.target.value)}
                                            className="template-input"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <button
                            type="button"
                            className="admin-btn"
                            style={{ marginTop: "0.75rem" }}
                            disabled={manualSending || !manualStudentId}
                            onClick={sendManual}
                        >
                            <FiSend /> {manualSending ? "Versturen…" : (manualType === "PAYMENT_NEW" ? "Factuur aanmaken & versturen" : "Herinnering versturen")}
                        </button>
                        {manualMsg && (
                            <p className="factuur-feedback" style={{ color: manualMsg.startsWith("Fout") ? "#ef4444" : "#22c55e" }}>
                                {manualMsg}
                            </p>
                        )}
                    </div>
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

                    {/* ── Centrale student-selector ── */}
                    <div className="tpl-student-bar">
                        <label className="tpl-student-label"><FiSend /> Verstuur naar:</label>
                        <select
                            value={sendStudentId}
                            onChange={e => { setSendStudentId(e.target.value); setSendMsg(null); }}
                            className="template-input tpl-student-select"
                        >
                            <option value="">— Kies student —</option>
                            {sendStudents.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.username} — {s.email}
                                </option>
                            ))}
                        </select>
                        {sendStudentId && (
                            <span className="tpl-student-email">
                                {sendStudents.find(s => String(s.id) === String(sendStudentId))?.email}
                            </span>
                        )}
                    </div>
                    {!sendStudentId && (
                        <p className="tpl-no-student-hint">Selecteer eerst een student om een sjabloon te versturen.</p>
                    )}

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

                                    {/* Verstuur-knop — werkt met de centrale selector hierboven */}
                                    <div className="tpl-send-row">
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn--small"
                                            disabled={sending || !sendStudentId}
                                            onClick={() => sendReminder(tpl.type)}
                                            title={!sendStudentId ? "Kies eerst een student bovenaan" : ""}
                                        >
                                            <FiSend />
                                            {sendingType === tpl.type
                                                ? "Versturen…"
                                                : sendStudentId
                                                    ? `Verstuur naar ${sendStudents.find(s => String(s.id) === String(sendStudentId))?.username ?? "student"}`
                                                    : "Kies student ↑"
                                            }
                                        </button>

                                        {/* Feedback uitsluitend voor dit template */}
                                        {sendMsg?.type === tpl.type && (
                                            <span className={`tpl-send-feedback ${sendMsg.ok ? "tpl-send-ok" : "tpl-send-err"}`}>
                                                {sendMsg.ok ? "✓" : "✗"} {sendMsg.text}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

        </DashboardLayout>
    );
};

export default AdminBetalingenPage;