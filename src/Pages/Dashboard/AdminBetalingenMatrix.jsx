import React, { useEffect, useState, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiUsers, FiDollarSign, FiClipboard,
    FiFileText, FiShield, FiTool, FiMessageSquare, FiGrid,
    FiRefreshCw, FiMail, FiAlertTriangle, FiCheckCircle, FiClock,
    FiX,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import "./StudentDashboard.css";
import "./AdminPages.css";
import "../../Styles/Global.css";

const NL_MONTHS_SHORT = ["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"];

// ── Shared admin sidebar ─────────────────────────────────────────────────
export function AdminSidebar({ active, logout, username }) {
    return (
        <aside className="dashboard-sidebar" aria-label="Navigatie zijbalk">
            <header className="sidebar-profile"><FiShield className="profile-icon" /></header>
            <h3 className="sidebar-title">Welkom {username || "Beheerder"}</h3>
            <nav className="sidebar-nav">
                <ul>
                    <li><Link to="/admin"><FiHome /> Dashboard</Link></li>
                    <li><Link to="/admin/bewoners"><FiUsers /> Bewoners</Link></li>
                    <li>
                        <Link to="/admin/betaalmatrix" className={active === "matrix" ? "active-nav-link" : ""}>
                            <FiGrid /> Betaal-matrix
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/betalingen" className={active === "betalingen" ? "active-nav-link" : ""}>
                            <FiDollarSign /> Betalingen
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/contracten" className={active === "contracten" ? "active-nav-link" : ""}>
                            <FiFileText /> Contracten
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/tickets" className={active === "tickets" ? "active-nav-link" : ""}>
                            <FiTool /> Meldingen
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/communicatie" className={active === "communicatie" ? "active-nav-link" : ""}>
                            <FiMessageSquare /> Communicatie
                        </Link>
                    </li>
                    <li><Link to="/schoonmaakschema"><FiClipboard /> Schoonmaakschema</Link></li>
                    <li><Link to="/student/huisregels"><FiFileText /> Huisregels</Link></li>
                    <li>
                        <button onClick={logout} type="button" className="logout-button">
                            <FiLogOut /> Log uit
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

// ── Static fallback data ─────────────────────────────────────────────────
const MOCK_MATRIX = {
    students: ["Anna de Vries", "Bas Jansen", "Chloé Müller", "David Bakker"],
    months: [
        { year: 2026, month: 1 }, { year: 2026, month: 2 }, { year: 2026, month: 3 },
        { year: 2026, month: 4 }, { year: 2026, month: 5 }, { year: 2026, month: 6 },
    ],
    cells: {
        "Anna de Vries": { "2026-1": "PAID","2026-2":"PAID","2026-3":"PAID","2026-4":"PAID","2026-5":"OPEN","2026-6":null },
        "Bas Jansen":    { "2026-1": "PAID","2026-2":"PAID","2026-3":"OVERDUE","2026-4":"OVERDUE","2026-5":"OVERDUE","2026-6":null },
        "Chloé Müller":  { "2026-1": "PAID","2026-2":"PAID","2026-3":"PAID","2026-4":"PAID","2026-5":"PAID","2026-6":null },
        "David Bakker":  { "2026-1": "PAID","2026-2":"OPEN","2026-3":"OPEN","2026-4":null,"2026-5":null,"2026-6":null },
    },
};

function buildMatrix(invoices) {
    if (!invoices.length) return null;
    const studentMap = {};
    const monthSet   = {};
    for (const inv of invoices) {
        const key = `${inv.invoiceYear}-${inv.invoiceMonth}`;
        studentMap[inv.studentName] = studentMap[inv.studentName] || {};
        studentMap[inv.studentName][key] = inv.status;
        monthSet[key] = { year: inv.invoiceYear, month: inv.invoiceMonth };
    }
    const months   = Object.values(monthSet).sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
    const students = Object.keys(studentMap).sort();
    return { students, months, cells: studentMap };
}

const STATUS_META = {
    PAID:      { label: "✓", cls: "matrix-cell--paid",      tip: "Betaald" },
    OPEN:      { label: "○", cls: "matrix-cell--open",      tip: "Open" },
    OVERDUE:   { label: "!", cls: "matrix-cell--overdue",   tip: "Verlopen" },
    CANCELLED: { label: "×", cls: "matrix-cell--cancelled", tip: "Geannuleerd" },
};

// ── Reminder panel (slide-in) ────────────────────────────────────────────
function ReminderPanel({ student, onClose }) {
    const [sending, setSending] = useState(false);
    const [msg, setMsg]         = useState(null);

    const send = async () => {
        setSending(true);
        try {
            await api.post(`/api/invoices/reminder`, { studentName: student });
            setMsg({ ok: true, text: "Herinnering verstuurd!" });
        } catch {
            setMsg({ ok: false, text: "Kon herinnering niet versturen." });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="matrix-reminder-panel">
            <div className="matrix-reminder-header">
                <strong><FiMail /> Herinnering sturen</strong>
                <button type="button" onClick={onClose} aria-label="Sluiten"><FiX /></button>
            </div>
            <p>Stuur een betalingsherinnering naar <strong>{student}</strong>.</p>
            {msg && <p style={{ color: msg.ok ? "#2ecc71" : "#e74c3c", fontSize: 13 }}>{msg.text}</p>}
            {!msg && (
                <button type="button" className="admin-btn" onClick={send} disabled={sending}>
                    {sending ? "Versturen…" : <><FiMail /> Verstuur herinnering</>}
                </button>
            )}
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────
const AdminBetalingenMatrix = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const [invoices, setInvoices] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);
    const [reminder, setReminder] = useState(null); // student name
    const panelRef = useRef(null);

    const now = new Date();
    const thisKey = `${now.getFullYear()}-${now.getMonth() + 1}`;

    const load = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const res = await api.get("/api/invoices");
            setInvoices(res.data || []);
        } catch {
            setError("Kon facturen niet laden — mock-data wordt getoond.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const matrix = invoices.length ? buildMatrix(invoices) : MOCK_MATRIX;
    const isMock = !invoices.length;

    // Summary counts
    const allCells = Object.values(matrix.cells).flatMap(row => Object.values(row).filter(Boolean));
    const paid    = allCells.filter(s => s === "PAID").length;
    const open    = allCells.filter(s => s === "OPEN").length;
    const overdue = allCells.filter(s => s === "OVERDUE").length;

    // Close panel on outside click
    useEffect(() => {
        if (!reminder) return;
        const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setReminder(null); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [reminder]);

    const sidebar = <AdminSidebar active="matrix" logout={logout} username={user?.username} />;

    return (
        <DashboardLayout sidebar={sidebar} mainClass="admin-main">
            <Helmet>
                <title>Betaal-matrix — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Header */}
            <div className="admin-page-header">
                <h1><FiGrid /> Betaal-matrix</h1>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={load} disabled={loading}>
                    <FiRefreshCw /> Verversen
                </button>
            </div>

            {isMock && (
                <div className="admin-alert admin-alert--amber">
                    <FiAlertTriangle /> Backend niet beschikbaar — voorbeelddata wordt getoond.
                </div>
            )}

            {/* Summary strip */}
            <div className="admin-summary-strip">
                <div className="admin-summary-card admin-summary-card--green">
                    <FiCheckCircle />
                    <div>
                        <span className="asc-num">{paid}</span>
                        <span className="asc-label">Betaald</span>
                    </div>
                </div>
                <div className="admin-summary-card admin-summary-card--amber">
                    <FiClock />
                    <div>
                        <span className="asc-num">{open}</span>
                        <span className="asc-label">Open</span>
                    </div>
                </div>
                <div className="admin-summary-card admin-summary-card--red">
                    <FiAlertTriangle />
                    <div>
                        <span className="asc-num">{overdue}</span>
                        <span className="asc-label">Verlopen</span>
                    </div>
                </div>
            </div>

            {/* Matrix table */}
            <div className="admin-section">
                {loading && <p className="admin-loading">Laden…</p>}
                {error   && <p className="admin-error"><FiAlertTriangle /> {error}</p>}

                {!loading && (
                    <div style={{ overflowX: "auto" }}>
                        <table className="matrix-table">
                            <thead>
                                <tr>
                                    <th className="matrix-th-name">Student</th>
                                    {matrix.months.map(m => {
                                        const k = `${m.year}-${m.month}`;
                                        return (
                                            <th key={k} className={k === thisKey ? "matrix-th matrix-th--current" : "matrix-th"}>
                                                {NL_MONTHS_SHORT[m.month - 1]}<br />
                                                <span style={{ fontSize: 10, opacity: 0.6 }}>{m.year}</span>
                                            </th>
                                        );
                                    })}
                                    <th className="matrix-th">Actie</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matrix.students.map(student => {
                                    const row = matrix.cells[student] || {};
                                    const hasOverdue = Object.values(row).some(s => s === "OVERDUE");
                                    return (
                                        <tr key={student} className={hasOverdue ? "matrix-row--alert" : ""}>
                                            <td className="matrix-td-name">
                                                <span>{student}</span>
                                                {hasOverdue && <FiAlertTriangle className="matrix-alert-icon" title="Achterstallige betaling" />}
                                            </td>
                                            {matrix.months.map(m => {
                                                const k = `${m.year}-${m.month}`;
                                                const status = row[k] || null;
                                                const meta = STATUS_META[status] || { label: "–", cls: "matrix-cell--empty", tip: "Geen factuur" };
                                                return (
                                                    <td key={k} className={`matrix-cell ${meta.cls}${k === thisKey ? " matrix-cell--current" : ""}`} title={meta.tip}>
                                                        {meta.label}
                                                    </td>
                                                );
                                            })}
                                            <td className="matrix-td-action">
                                                <button
                                                    type="button"
                                                    className="admin-btn admin-btn--small admin-btn--ghost"
                                                    onClick={() => setReminder(student)}
                                                >
                                                    <FiMail />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="matrix-legend">
                {Object.entries(STATUS_META).map(([k, v]) => (
                    <span key={k} className={`matrix-cell ${v.cls}`} style={{ borderRadius: 6, padding: "4px 10px", fontSize: 13 }}>
                        {v.label} {v.tip}
                    </span>
                ))}
                <span className="matrix-cell matrix-cell--empty" style={{ borderRadius: 6, padding: "4px 10px", fontSize: 13 }}>– Geen factuur</span>
            </div>

            {/* Reminder panel */}
            {reminder && (
                <div className="matrix-reminder-overlay">
                    <div ref={panelRef}>
                        <ReminderPanel student={reminder} onClose={() => setReminder(null)} />
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminBetalingenMatrix;
