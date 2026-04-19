import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiMessageSquare, FiRefreshCw, FiAlertTriangle, FiSend,
    FiTrash2, FiUsers, FiCalendar, FiTool, FiRadio,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import { AdminSidebar } from "./AdminBetalingenMatrix.jsx";
import "./StudentDashboard.css";
import "./AdminPages.css";
import "./AdminCommunicatiePage.css";
import "../../Styles/Global.css";

// ── Mock data ────────────────────────────────────────────────────────────
const STATIC_ANNOUNCEMENTS = [
    { id: 1, type: "mededeling", title: "WiFi snelheid verhoogd",       body: "We hebben de WiFi geüpgraded naar 500 Mbit/s. Meld problemen bij de beheerder.",        createdAt: "2026-04-01T10:00:00", author: "Beheerder" },
    { id: 2, type: "onderhoud",  title: "CV-onderhoud 22 april",         body: "Een monteur controleert op 22 april de CV-ketel. Bewoners hoeven niets te doen.",       createdAt: "2026-04-10T09:00:00", author: "Beheerder" },
    { id: 3, type: "evenement",  title: "Villa BBQ — 18 juni",           body: "Zomerse BBQ in de tuin! Meld je aan via de Events-pagina of via Samen eten.",           createdAt: "2026-04-15T14:00:00", author: "Beheerder" },
];

const TYPE_META = {
    mededeling: { label: "Mededeling", icon: <FiRadio />,          cls: "comm-card--mededeling" },
    onderhoud:  { label: "Onderhoud",  icon: <FiTool />,           cls: "comm-card--onderhoud" },
    evenement:  { label: "Evenement",  icon: <FiCalendar />,       cls: "comm-card--evenement" },
};

// ── Announcement card ────────────────────────────────────────────────────
function AnnouncementCard({ ann, onDelete }) {
    const meta = TYPE_META[ann.type] || TYPE_META.mededeling;
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Mededeling verwijderen?")) return;
        setDeleting(true);
        try {
            await api.delete(`/api/announcements/${ann.id}`);
            onDelete?.(ann.id);
        } catch {
            onDelete?.(ann.id); // optimistic
        } finally {
            setDeleting(false);
        }
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
                <button
                    type="button"
                    className="admin-btn admin-btn--small admin-btn--danger"
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    <FiTrash2 /> {deleting ? "Verwijderen…" : "Verwijderen"}
                </button>
            </div>
        </article>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────
const AdminCommunicatiePage = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const [announcements, setAnnouncements] = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [isMock,        setIsMock]        = useState(false);

    // Post form
    const [type,     setType]     = useState("mededeling");
    const [title,    setTitle]    = useState("");
    const [body,     setBody]     = useState("");
    const [posting,  setPosting]  = useState(false);
    const [postMsg,  setPostMsg]  = useState(null);

    // Filter
    const [filter,   setFilter]   = useState("all");

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/announcements");
            setAnnouncements(res.data || []);
            setIsMock(false);
        } catch {
            setAnnouncements(STATIC_ANNOUNCEMENTS);
            setIsMock(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;
        setPosting(true); setPostMsg(null);
        try {
            const res = await api.post("/api/announcements", {
                type, title, body, author: user?.username || "Beheerder",
            });
            setAnnouncements(prev => [res.data, ...prev]);
            setTitle(""); setBody(""); setType("mededeling");
            setPostMsg({ ok: true, text: "Mededeling geplaatst!" });
        } catch {
            // Optimistic fallback
            const fakeItem = { id: Date.now(), type, title, body, author: user?.username || "Beheerder", createdAt: new Date().toISOString() };
            setAnnouncements(prev => [fakeItem, ...prev]);
            setTitle(""); setBody(""); setType("mededeling");
            setPostMsg({ ok: true, text: "Mededeling geplaatst (offline)." });
        } finally {
            setPosting(false);
        }
    };

    const handleDelete = (id) => {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
    };

    const filtered = filter === "all" ? announcements : announcements.filter(a => a.type === filter);

    const sidebar = <AdminSidebar active="communicatie" logout={logout} username={user?.username} />;

    return (
        <DashboardLayout sidebar={sidebar} mainClass="admin-main">
            <Helmet>
                <title>Communicatie — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="admin-page-header">
                <h1><FiMessageSquare /> Communicatieboard</h1>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={load} disabled={loading}>
                    <FiRefreshCw /> Verversen
                </button>
            </div>

            {isMock && (
                <div className="admin-alert admin-alert--amber">
                    <FiAlertTriangle /> Backend niet beschikbaar — voorbeelddata wordt getoond.
                </div>
            )}

            {/* Post form */}
            <div className="comm-form-card">
                <h2 className="comm-form-title"><FiSend /> Nieuwe mededeling</h2>
                <form className="comm-form" onSubmit={handlePost}>
                    <div className="comm-form-row">
                        <div className="comm-field">
                            <label>Type</label>
                            <select value={type} onChange={e => setType(e.target.value)}>
                                {Object.entries(TYPE_META).map(([k, v]) => (
                                    <option key={k} value={k}>{v.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="comm-field comm-field--grow">
                            <label>Titel</label>
                            <input
                                type="text"
                                placeholder="Bijv. 'CV-onderhoud woensdag'"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                maxLength={120}
                            />
                        </div>
                    </div>
                    <div className="comm-field">
                        <label>Bericht</label>
                        <textarea
                            rows={4}
                            placeholder="Schrijf hier de mededeling…"
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            required
                        />
                    </div>
                    {postMsg && (
                        <p style={{ fontSize: 13, color: postMsg.ok ? "#2ecc71" : "#e74c3c" }}>{postMsg.text}</p>
                    )}
                    <button type="submit" className="admin-btn" disabled={posting}>
                        <FiSend /> {posting ? "Plaatsen…" : "Plaatsen"}
                    </button>
                </form>
            </div>

            {/* Summary */}
            <div className="admin-summary-strip">
                {Object.entries(TYPE_META).map(([k, v]) => {
                    const cnt = announcements.filter(a => a.type === k).length;
                    return (
                        <div key={k} className="admin-summary-card admin-summary-card--blue">
                            {v.icon}
                            <div><span className="asc-num">{cnt}</span><span className="asc-label">{v.label}</span></div>
                        </div>
                    );
                })}
                <div className="admin-summary-card admin-summary-card--green">
                    <FiUsers />
                    <div><span className="asc-num">{announcements.length}</span><span className="asc-label">Totaal</span></div>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="admin-filter-tabs">
                <button
                    type="button"
                    className={`admin-filter-tab${filter === "all" ? " active" : ""}`}
                    onClick={() => setFilter("all")}
                >
                    Alle ({announcements.length})
                </button>
                {Object.entries(TYPE_META).map(([k, v]) => (
                    <button
                        key={k}
                        type="button"
                        className={`admin-filter-tab${filter === k ? " active" : ""}`}
                        onClick={() => setFilter(k)}
                    >
                        {v.label} ({announcements.filter(a => a.type === k).length})
                    </button>
                ))}
            </div>

            {/* Announcement grid */}
            <div className="admin-section">
                {loading && <p className="admin-loading">Laden…</p>}
                {!loading && filtered.length === 0 && (
                    <p className="admin-empty">Geen mededelingen gevonden.</p>
                )}
                <div className="comm-grid">
                    {filtered.map(a => (
                        <AnnouncementCard key={a.id} ann={a} onDelete={handleDelete} />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminCommunicatiePage;
