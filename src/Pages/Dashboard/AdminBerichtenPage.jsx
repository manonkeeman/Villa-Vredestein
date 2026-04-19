import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiMessageSquare, FiTool, FiRefreshCw, FiAlertTriangle,
    FiSend, FiTrash2, FiUsers, FiCalendar, FiRadio,
    FiClock, FiCheckCircle, FiChevronDown, FiChevronUp, FiMessageCircle,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import { AdminSidebar } from "./AdminBetalingenMatrix.jsx";
import "./StudentDashboard.css";
import "./AdminPages.css";
import "./AdminCommunicatiePage.css";
import "./AdminTicketsPage.css";
import "../../Styles/Global.css";

// ── Communicatie mock data ───────────────────────────────────────────────
const STATIC_ANNOUNCEMENTS = [
    { id: 1, type: "mededeling", title: "WiFi snelheid verhoogd",  body: "We hebben de WiFi geüpgraded naar 500 Mbit/s. Meld problemen bij de beheerder.", createdAt: "2026-04-01T10:00:00", author: "Beheerder" },
    { id: 2, type: "onderhoud",  title: "CV-onderhoud 22 april",    body: "Een monteur controleert op 22 april de CV-ketel. Bewoners hoeven niets te doen.", createdAt: "2026-04-10T09:00:00", author: "Beheerder" },
    { id: 3, type: "evenement",  title: "Villa BBQ — 18 juni",      body: "Zomerse BBQ in de tuin! Meld je aan via de Events-pagina.", createdAt: "2026-04-15T14:00:00", author: "Beheerder" },
];

const TYPE_META = {
    mededeling: { label: "Mededeling", icon: <FiRadio />,    cls: "comm-card--mededeling" },
    onderhoud:  { label: "Onderhoud",  icon: <FiTool />,     cls: "comm-card--onderhoud" },
    evenement:  { label: "Evenement",  icon: <FiCalendar />, cls: "comm-card--evenement" },
};

// ── Tickets mock data ────────────────────────────────────────────────────
const MOCK_TICKETS = [
    { id: 1, title: "Lekkende kraan badkamer", category: "loodgieterswerk", priority: "hoog",   status: "OPEN",        createdBy: "Desmond", createdAt: "2026-04-10T09:00:00", description: "De kraan in de badkamer druppelt continu.", comments: [] },
    { id: 2, title: "Verwarming doet het niet", category: "verwarming",     priority: "hoog",   status: "IN_PROGRESS", createdBy: "Medoc",   createdAt: "2026-04-12T14:30:00", description: "Radiator kamer Japan geeft geen warmte.", comments: [{ author: "Beheerder", text: "Monteur gepland voor 15 april.", createdAt: "2026-04-13T10:00:00" }] },
    { id: 3, title: "Kapotte lamp gang",        category: "elektra",        priority: "laag",   status: "RESOLVED",    createdBy: "Simon",   createdAt: "2026-04-05T11:00:00", description: "Lamp in de gang is kapot.", comments: [{ author: "Beheerder", text: "Vervangen.", createdAt: "2026-04-06T08:00:00" }] },
    { id: 4, title: "Wifi valt uit",            category: "overig",         priority: "middel", status: "OPEN",        createdBy: "Desmond", createdAt: "2026-04-14T20:00:00", description: "Wifi valt regelmatig uit op de bovenverdieping.", comments: [] },
];

const CATEGORY_LABELS = { loodgieterswerk: "Loodgieterswerk", verwarming: "Verwarming", elektra: "Elektra", schoonmaak: "Schoonmaak", overig: "Overig" };
const PRIORITY_META = {
    hoog:   { cls: "ticket-priority--high",   label: "Hoog" },
    middel: { cls: "ticket-priority--medium", label: "Middel" },
    laag:   { cls: "ticket-priority--low",    label: "Laag" },
};
const STATUS_META = {
    OPEN:        { cls: "ticket-status--open",     label: "Open",           icon: <FiClock /> },
    IN_PROGRESS: { cls: "ticket-status--progress", label: "In behandeling", icon: <FiTool /> },
    RESOLVED:    { cls: "ticket-status--resolved", label: "Opgelost",       icon: <FiCheckCircle /> },
    CLOSED:      { cls: "ticket-status--closed",   label: "Gesloten",       icon: <FiCheckCircle /> },
};

// ── Announcement card ────────────────────────────────────────────────────
function AnnouncementCard({ ann, onDelete }) {
    const meta = TYPE_META[ann.type] || TYPE_META.mededeling;
    const [deleting, setDeleting] = useState(false);
    const handleDelete = async () => {
        if (!window.confirm("Mededeling verwijderen?")) return;
        setDeleting(true);
        try { await api.delete(`/api/announcements/${ann.id}`); } catch { /* ignore */ }
        onDelete?.(ann.id);
        setDeleting(false);
    };
    return (
        <article className={`comm-card ${meta.cls}`}>
            <div className="comm-card-header">
                <span className="comm-type-badge">{meta.icon} {meta.label}</span>
                <span className="comm-date">{new Date(ann.createdAt).toLocaleDateString("nl-NL")}</span>
            </div>
            <h3 className="comm-title">{ann.title}</h3>
            <p className="comm-body">{ann.body}</p>
            <div className="comm-footer">
                <span className="comm-author">Door: {ann.author || "Beheerder"}</span>
                <button type="button" className="admin-btn admin-btn--small admin-btn--danger" onClick={handleDelete} disabled={deleting}>
                    <FiTrash2 /> {deleting ? "Verwijderen…" : "Verwijderen"}
                </button>
            </div>
        </article>
    );
}

// ── Ticket card ──────────────────────────────────────────────────────────
function TicketCard({ ticket, onUpdate }) {
    const [expanded, setExpanded] = useState(false);
    const [comment,  setComment]  = useState("");
    const [sending,  setSending]  = useState(false);
    const [status,   setStatus]   = useState(ticket.status);

    const sm = STATUS_META[status] || STATUS_META.OPEN;
    const pm = PRIORITY_META[ticket.priority] || PRIORITY_META.laag;

    const sendComment = async () => {
        if (!comment.trim()) return;
        setSending(true);
        try {
            await api.post(`/api/tickets/${ticket.id}/comment`, { text: comment });
        } catch { /* ignore */ }
        setSending(false);
        setComment("");
    };

    const changeStatus = async (newStatus) => {
        try { await api.patch(`/api/tickets/${ticket.id}`, { status: newStatus }); } catch { /* ignore */ }
        setStatus(newStatus);
        onUpdate?.(ticket.id, { status: newStatus });
    };

    return (
        <article className="ticket-card">
            <div className="ticket-card-header" onClick={() => setExpanded(e => !e)} style={{ cursor: "pointer" }}>
                <div className="ticket-card-top">
                    <span className={`ticket-priority-badge ${pm.cls}`}>{pm.label}</span>
                    <span className={`ticket-status-badge ${sm.cls}`}>{sm.icon} {sm.label}</span>
                </div>
                <h3 className="ticket-title">{ticket.title}</h3>
                <div className="ticket-meta">
                    <span>{CATEGORY_LABELS[ticket.category] || ticket.category}</span>
                    <span>Door: {ticket.createdBy}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString("nl-NL")}</span>
                    {expanded ? <FiChevronUp /> : <FiChevronDown />}
                </div>
            </div>
            {expanded && (
                <div className="ticket-card-body">
                    <p className="ticket-description">{ticket.description}</p>
                    <div className="ticket-status-row">
                        <span>Status wijzigen:</span>
                        {["OPEN","IN_PROGRESS","RESOLVED","CLOSED"].map(s => (
                            <button
                                key={s}
                                type="button"
                                className={`ticket-status-btn${status === s ? " active" : ""}`}
                                onClick={() => changeStatus(s)}
                            >
                                {STATUS_META[s].label}
                            </button>
                        ))}
                    </div>
                    {ticket.comments?.length > 0 && (
                        <div className="ticket-comments">
                            {ticket.comments.map((c, i) => (
                                <div key={i} className="ticket-comment">
                                    <strong>{c.author}</strong>
                                    <span className="ticket-comment-date">{new Date(c.createdAt).toLocaleDateString("nl-NL")}</span>
                                    <p>{c.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="ticket-comment-form">
                        <input
                            type="text"
                            placeholder="Reactie toevoegen…"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendComment()}
                        />
                        <button type="button" className="admin-btn admin-btn--small" onClick={sendComment} disabled={sending || !comment.trim()}>
                            <FiSend /> {sending ? "…" : "Stuur"}
                        </button>
                    </div>
                </div>
            )}
        </article>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────
const AdminBerichtenPage = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const [tab, setTab] = useState("communicatie");

    // Communicatie state
    const [announcements, setAnnouncements] = useState([]);
    const [annLoading,    setAnnLoading]    = useState(true);
    const [isMock,        setIsMock]        = useState(false);
    const [annType,       setAnnType]       = useState("mededeling");
    const [annTitle,      setAnnTitle]      = useState("");
    const [annBody,       setAnnBody]       = useState("");
    const [posting,       setPosting]       = useState(false);
    const [postMsg,       setPostMsg]       = useState(null);
    const [annFilter,     setAnnFilter]     = useState("all");

    // Tickets state
    const [tickets,       setTickets]       = useState([]);
    const [tickLoading,   setTickLoading]   = useState(true);
    const [tickMock,      setTickMock]      = useState(false);
    const [tickFilter,    setTickFilter]    = useState("all");

    const loadAnnouncements = useCallback(async () => {
        setAnnLoading(true);
        try {
            const res = await api.get("/api/announcements");
            setAnnouncements(res.data || []);
            setIsMock(false);
        } catch {
            setAnnouncements(STATIC_ANNOUNCEMENTS);
            setIsMock(true);
        } finally { setAnnLoading(false); }
    }, []);

    const loadTickets = useCallback(async () => {
        setTickLoading(true);
        try {
            const res = await api.get("/api/tickets");
            setTickets(res.data || []);
            setTickMock(false);
        } catch {
            setTickets(MOCK_TICKETS);
            setTickMock(true);
        } finally { setTickLoading(false); }
    }, []);

    useEffect(() => { loadAnnouncements(); loadTickets(); }, [loadAnnouncements, loadTickets]);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!annTitle.trim() || !annBody.trim()) return;
        setPosting(true); setPostMsg(null);
        try {
            const res = await api.post("/api/announcements", {
                type: annType, title: annTitle, body: annBody, author: user?.username || "Beheerder",
            });
            setAnnouncements(prev => [res.data, ...prev]);
        } catch {
            const fake = { id: Date.now(), type: annType, title: annTitle, body: annBody, author: user?.username || "Beheerder", createdAt: new Date().toISOString() };
            setAnnouncements(prev => [fake, ...prev]);
        } finally {
            setAnnTitle(""); setAnnBody(""); setAnnType("mededeling");
            setPostMsg({ ok: true, text: "Mededeling geplaatst!" });
            setPosting(false);
        }
    };

    const handleDeleteAnn = (id) => setAnnouncements(prev => prev.filter(a => a.id !== id));
    const handleUpdateTicket = (id, patch) => setTickets(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));

    const filteredAnn = annFilter === "all" ? announcements : announcements.filter(a => a.type === annFilter);
    const filteredTick = tickFilter === "all" ? tickets : tickets.filter(t => t.status === tickFilter);
    const openTickets = tickets.filter(t => t.status === "OPEN" || t.status === "IN_PROGRESS").length;

    const sidebar = <AdminSidebar active="berichten" logout={logout} username={user?.username} />;

    return (
        <DashboardLayout sidebar={sidebar} mainClass="admin-main">
            <Helmet>
                <title>Berichten &amp; Meldingen — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="admin-page-header">
                <h1><FiMessageSquare /> Berichten &amp; Meldingen</h1>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { loadAnnouncements(); loadTickets(); }}>
                    <FiRefreshCw /> Verversen
                </button>
            </div>

            {/* Tabs */}
            <div className="admin-filter-tabs" style={{ marginBottom: "1.5rem" }}>
                <button
                    type="button"
                    className={`admin-filter-tab${tab === "communicatie" ? " active" : ""}`}
                    onClick={() => setTab("communicatie")}
                >
                    <FiMessageSquare /> Communicatie ({announcements.length})
                </button>
                <button
                    type="button"
                    className={`admin-filter-tab${tab === "meldingen" ? " active" : ""}`}
                    onClick={() => setTab("meldingen")}
                >
                    <FiTool /> Meldingen {openTickets > 0 && <span className="admin-badge">{openTickets}</span>}
                </button>
            </div>

            {/* ── Communicatie tab ── */}
            {tab === "communicatie" && (
                <>
                    {isMock && (
                        <div className="admin-alert admin-alert--amber">
                            <FiAlertTriangle /> Backend niet beschikbaar — voorbeelddata wordt getoond.
                        </div>
                    )}
                    <div className="comm-form-card">
                        <h2 className="comm-form-title"><FiSend /> Nieuwe mededeling</h2>
                        <form className="comm-form" onSubmit={handlePost}>
                            <div className="comm-form-row">
                                <div className="comm-field">
                                    <label>Type</label>
                                    <select value={annType} onChange={e => setAnnType(e.target.value)}>
                                        {Object.entries(TYPE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                    </select>
                                </div>
                                <div className="comm-field comm-field--grow">
                                    <label>Titel</label>
                                    <input type="text" placeholder="Bijv. 'CV-onderhoud woensdag'" value={annTitle} onChange={e => setAnnTitle(e.target.value)} required maxLength={120} />
                                </div>
                            </div>
                            <div className="comm-field">
                                <label>Bericht</label>
                                <textarea rows={4} placeholder="Schrijf hier de mededeling…" value={annBody} onChange={e => setAnnBody(e.target.value)} required />
                            </div>
                            {postMsg && <p style={{ fontSize: 13, color: "#2ecc71" }}>{postMsg.text}</p>}
                            <button type="submit" className="admin-btn" disabled={posting}>
                                <FiSend /> {posting ? "Plaatsen…" : "Plaatsen"}
                            </button>
                        </form>
                    </div>

                    <div className="admin-filter-tabs">
                        <button type="button" className={`admin-filter-tab${annFilter === "all" ? " active" : ""}`} onClick={() => setAnnFilter("all")}>Alle ({announcements.length})</button>
                        {Object.entries(TYPE_META).map(([k, v]) => (
                            <button key={k} type="button" className={`admin-filter-tab${annFilter === k ? " active" : ""}`} onClick={() => setAnnFilter(k)}>
                                {v.label} ({announcements.filter(a => a.type === k).length})
                            </button>
                        ))}
                    </div>

                    <div className="admin-section">
                        {annLoading && <p className="admin-loading">Laden…</p>}
                        {!annLoading && filteredAnn.length === 0 && <p className="admin-empty">Geen mededelingen gevonden.</p>}
                        <div className="comm-grid">
                            {filteredAnn.map(a => <AnnouncementCard key={a.id} ann={a} onDelete={handleDeleteAnn} />)}
                        </div>
                    </div>
                </>
            )}

            {/* ── Meldingen tab ── */}
            {tab === "meldingen" && (
                <>
                    {tickMock && (
                        <div className="admin-alert admin-alert--amber">
                            <FiAlertTriangle /> Backend niet beschikbaar — voorbeelddata wordt getoond.
                        </div>
                    )}
                    <div className="admin-summary-strip">
                        {[["OPEN","open"],["IN_PROGRESS","in behandeling"],["RESOLVED","opgelost"]].map(([s, label]) => {
                            const cnt = tickets.filter(t => t.status === s).length;
                            return (
                                <div key={s} className={`admin-summary-card ${s === "OPEN" ? "admin-summary-card--red" : s === "IN_PROGRESS" ? "admin-summary-card--amber" : "admin-summary-card--green"}`}>
                                    {STATUS_META[s].icon}
                                    <div><span className="asc-num">{cnt}</span><span className="asc-label">{label}</span></div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="admin-filter-tabs">
                        {[["all","Alle"],["OPEN","Open"],["IN_PROGRESS","In behandeling"],["RESOLVED","Opgelost"],["CLOSED","Gesloten"]].map(([k, label]) => (
                            <button key={k} type="button" className={`admin-filter-tab${tickFilter === k ? " active" : ""}`} onClick={() => setTickFilter(k)}>
                                {label} {k !== "all" && `(${tickets.filter(t => t.status === k).length})`}
                            </button>
                        ))}
                    </div>

                    <div className="admin-section">
                        {tickLoading && <p className="admin-loading">Laden…</p>}
                        {!tickLoading && filteredTick.length === 0 && <p className="admin-empty">Geen meldingen gevonden.</p>}
                        <div className="tickets-list">
                            {filteredTick.map(t => <TicketCard key={t.id} ticket={t} onUpdate={handleUpdateTicket} />)}
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default AdminBerichtenPage;
