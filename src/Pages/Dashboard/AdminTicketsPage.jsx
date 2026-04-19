import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiTool, FiRefreshCw, FiAlertTriangle, FiCheckCircle,
    FiClock, FiChevronDown, FiChevronUp, FiMessageCircle,
    FiSend,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import { AdminSidebar } from "./AdminBetalingenMatrix.jsx";
import "./StudentDashboard.css";
import "./AdminPages.css";
import "./AdminTicketsPage.css";
import "../../Styles/Global.css";

// ── Mock data ────────────────────────────────────────────────────────────
const MOCK_TICKETS = [
    { id: 1, title: "Lekkende kraan badkamer", category: "loodgieterswerk", priority: "hoog",  status: "OPEN",        createdBy: "anna",  createdAt: "2026-04-10T09:00:00", description: "De kraan in de badkamer druppelt continu.", comments: [] },
    { id: 2, title: "Verwarming doet het niet", category: "verwarming",      priority: "hoog",  status: "IN_PROGRESS", createdBy: "bas",   createdAt: "2026-04-12T14:30:00", description: "Radiator kamer Japan geeft geen warmte.", comments: [{ author: "Beheerder", text: "Monteur gepland voor 15 april.", createdAt: "2026-04-13T10:00:00" }] },
    { id: 3, title: "Kapotte lamp gang",        category: "elektra",         priority: "laag",  status: "RESOLVED",    createdBy: "chloe", createdAt: "2026-04-05T11:00:00", description: "Lamp in de gang is kapot.", comments: [{ author: "Beheerder", text: "Vervangen.", createdAt: "2026-04-06T08:00:00" }] },
    { id: 4, title: "Wifi valt uit",            category: "overig",          priority: "middel",status: "OPEN",        createdBy: "david", createdAt: "2026-04-14T20:00:00", description: "Wifi valt regelmatig uit op de bovenverdieping.", comments: [] },
];

const CATEGORY_LABELS = {
    loodgieterswerk: "Loodgieterswerk",
    verwarming: "Verwarming",
    elektra: "Elektra",
    schoonmaak: "Schoonmaak",
    overig: "Overig",
};

const PRIORITY_META = {
    hoog:   { cls: "ticket-priority--high",   label: "Hoog" },
    middel: { cls: "ticket-priority--medium", label: "Middel" },
    laag:   { cls: "ticket-priority--low",    label: "Laag" },
};

const STATUS_META = {
    OPEN:        { cls: "ticket-status--open",     label: "Open",       icon: <FiClock /> },
    IN_PROGRESS: { cls: "ticket-status--progress", label: "In behandeling", icon: <FiTool /> },
    RESOLVED:    { cls: "ticket-status--resolved", label: "Opgelost",   icon: <FiCheckCircle /> },
    CLOSED:      { cls: "ticket-status--closed",   label: "Gesloten",   icon: <FiCheckCircle /> },
};

function TicketCard({ ticket, onUpdate }) {
    const [expanded, setExpanded]   = useState(false);
    const [comment,  setComment]    = useState("");
    const [sending,  setSending]    = useState(false);
    const [status,   setStatus]     = useState(ticket.status);

    const sm = STATUS_META[status]   || STATUS_META.OPEN;
    const pm = PRIORITY_META[ticket.priority] || PRIORITY_META.laag;

    const sendComment = async () => {
        if (!comment.trim()) return;
        setSending(true);
        try {
            await api.post(`/api/tickets/${ticket.id}/comment`, { text: comment });
            setComment("");
            onUpdate?.();
        } catch {
            // offline fallback — just clear
            setComment("");
        } finally {
            setSending(false);
        }
    };

    const changeStatus = async (newStatus) => {
        try {
            await api.put(`/api/tickets/${ticket.id}/status`, { status: newStatus });
            setStatus(newStatus);
        } catch {
            setStatus(newStatus); // optimistic update
        }
    };

    return (
        <article className={`ticket-card ticket-card--${status.toLowerCase()}`}>
            <div className="ticket-card-header" onClick={() => setExpanded(e => !e)}>
                <div className="ticket-card-meta">
                    <span className={`ticket-priority ${pm.cls}`}>{pm.label}</span>
                    <span className={`ticket-status ${sm.cls}`}>{sm.icon} {sm.label}</span>
                    <span className="ticket-category">{CATEGORY_LABELS[ticket.category] || ticket.category}</span>
                </div>
                <div className="ticket-card-title-row">
                    <h3 className="ticket-title">{ticket.title}</h3>
                    <span className="ticket-expand-icon">{expanded ? <FiChevronUp /> : <FiChevronDown />}</span>
                </div>
                <div className="ticket-card-submeta">
                    <span>Door: <strong>{ticket.createdBy}</strong></span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString("nl-NL")}</span>
                </div>
            </div>

            {expanded && (
                <div className="ticket-card-body">
                    <p className="ticket-description">{ticket.description}</p>

                    {/* Status wijzigen */}
                    <div className="ticket-status-change">
                        <label className="ticket-field-label">Status wijzigen:</label>
                        <div className="ticket-status-btns">
                            {Object.entries(STATUS_META).map(([k, v]) => (
                                <button
                                    key={k}
                                    type="button"
                                    className={`admin-btn admin-btn--small${status === k ? "" : " admin-btn--ghost"}`}
                                    onClick={() => changeStatus(k)}
                                >
                                    {v.icon} {v.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comments */}
                    {ticket.comments?.length > 0 && (
                        <div className="ticket-comments">
                            <h4 className="ticket-field-label"><FiMessageCircle /> Reacties</h4>
                            {ticket.comments.map((c, i) => (
                                <div key={i} className="ticket-comment">
                                    <strong>{c.author}</strong>
                                    <span className="ticket-comment-date">{new Date(c.createdAt).toLocaleDateString("nl-NL")}</span>
                                    <p>{c.text}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add comment */}
                    <div className="ticket-comment-form">
                        <textarea
                            className="ticket-textarea"
                            rows={3}
                            placeholder="Reactie toevoegen…"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        <button
                            type="button"
                            className="admin-btn admin-btn--small"
                            onClick={sendComment}
                            disabled={sending || !comment.trim()}
                        >
                            <FiSend /> {sending ? "Versturen…" : "Versturen"}
                        </button>
                    </div>
                </div>
            )}
        </article>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────
const AdminTicketsPage = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMock,  setIsMock]  = useState(false);
    const [filter,  setFilter]  = useState("all");

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/tickets");
            setTickets(res.data || []);
            setIsMock(false);
        } catch {
            setTickets(MOCK_TICKETS);
            setIsMock(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = filter === "all" ? tickets : tickets.filter(t => t.status === filter);

    const counts = {
        OPEN:        tickets.filter(t => t.status === "OPEN").length,
        IN_PROGRESS: tickets.filter(t => t.status === "IN_PROGRESS").length,
        RESOLVED:    tickets.filter(t => t.status === "RESOLVED").length,
    };

    const sidebar = <AdminSidebar active="tickets" logout={logout} username={user?.username} />;

    return (
        <DashboardLayout sidebar={sidebar} mainClass="admin-main">
            <Helmet>
                <title>Meldingen — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="admin-page-header">
                <h1><FiTool /> Meldingen & Onderhoud</h1>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={load} disabled={loading}>
                    <FiRefreshCw /> Verversen
                </button>
            </div>

            {isMock && (
                <div className="admin-alert admin-alert--amber">
                    <FiAlertTriangle /> Backend niet beschikbaar — voorbeelddata wordt getoond.
                </div>
            )}

            <div className="admin-summary-strip">
                <div className="admin-summary-card admin-summary-card--amber">
                    <FiClock />
                    <div><span className="asc-num">{counts.OPEN}</span><span className="asc-label">Open</span></div>
                </div>
                <div className="admin-summary-card admin-summary-card--blue">
                    <FiTool />
                    <div><span className="asc-num">{counts.IN_PROGRESS}</span><span className="asc-label">In behandeling</span></div>
                </div>
                <div className="admin-summary-card admin-summary-card--green">
                    <FiCheckCircle />
                    <div><span className="asc-num">{counts.RESOLVED}</span><span className="asc-label">Opgelost</span></div>
                </div>
            </div>

            <div className="admin-filter-tabs">
                {[
                    { key: "all",        label: `Alle (${tickets.length})` },
                    { key: "OPEN",       label: `Open (${counts.OPEN})` },
                    { key: "IN_PROGRESS",label: `In behandeling (${counts.IN_PROGRESS})` },
                    { key: "RESOLVED",   label: `Opgelost (${counts.RESOLVED})` },
                ].map(tab => (
                    <button
                        key={tab.key}
                        type="button"
                        className={`admin-filter-tab${filter === tab.key ? " active" : ""}`}
                        onClick={() => setFilter(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="admin-section">
                {loading && <p className="admin-loading">Laden…</p>}
                {!loading && filtered.length === 0 && <p className="admin-empty">Geen meldingen gevonden.</p>}
                <div className="ticket-list">
                    {filtered.map(t => <TicketCard key={t.id} ticket={t} onUpdate={load} />)}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminTicketsPage;