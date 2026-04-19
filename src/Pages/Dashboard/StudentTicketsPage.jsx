import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiTool, FiSend, FiChevronDown, FiChevronUp, FiCheckCircle,
    FiClock, FiImage, FiX,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import StudentSidebarShared from "../../Components/StudentSidebar/StudentSidebar.jsx";
import "./StudentDashboard.css";
import "./StudentTicketsPage.css";
import "../../Styles/Global.css";

const CATEGORIES = ["loodgieterswerk","verwarming","elektra","schoonmaak","overig"];
const CATEGORY_LABELS = { loodgieterswerk:"Loodgieterswerk", verwarming:"Verwarming", elektra:"Elektra", schoonmaak:"Schoonmaak", overig:"Overig" };
const PRIORITIES = ["laag","middel","hoog"];
const PRIORITY_LABELS = { laag:"Laag",middel:"Middel",hoog:"Hoog" };

const STATUS_META = {
    OPEN:        { label: "Open",             icon: <FiClock />,       cls: "sticket-status--open" },
    IN_PROGRESS: { label: "In behandeling",   icon: <FiTool />,        cls: "sticket-status--progress" },
    RESOLVED:    { label: "Opgelost",         icon: <FiCheckCircle />, cls: "sticket-status--resolved" },
    CLOSED:      { label: "Gesloten",         icon: <FiCheckCircle />, cls: "sticket-status--closed" },
};

const MOCK_MY_TICKETS = [
    { id: 10, title: "Wifi valt uit", category: "overig", priority: "middel", status: "OPEN", createdAt: "2026-04-14T20:00:00", description: "Wifi valt uit op de bovenverdieping.", comments: [] },
];

// ── Own ticket card ──────────────────────────────────────────────────────
function MyTicketCard({ ticket }) {
    const [expanded, setExpanded] = useState(false);
    const sm = STATUS_META[ticket.status] || STATUS_META.OPEN;

    return (
        <article className="sticket-card">
            <div className="sticket-card-header" onClick={() => setExpanded(e => !e)}>
                <div className="sticket-card-top">
                    <span className={`sticket-status ${sm.cls}`}>{sm.icon} {sm.label}</span>
                    <span className="sticket-category">{CATEGORY_LABELS[ticket.category] || ticket.category}</span>
                    <span className="sticket-expand">{expanded ? <FiChevronUp /> : <FiChevronDown />}</span>
                </div>
                <h3 className="sticket-title">{ticket.title}</h3>
                <span className="sticket-date">{new Date(ticket.createdAt).toLocaleDateString("nl-NL")}</span>
            </div>

            {expanded && (
                <div className="sticket-card-body">
                    <p className="sticket-description">{ticket.description}</p>
                    {ticket.comments?.length > 0 && (
                        <div className="sticket-comments">
                            <h4 className="sticket-label">Reacties van beheerder</h4>
                            {ticket.comments.map((c, i) => (
                                <div key={i} className="sticket-comment">
                                    <strong>{c.author}</strong> · {new Date(c.createdAt).toLocaleDateString("nl-NL")}
                                    <p>{c.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </article>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────
const StudentTicketsPage = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const contractFile = user?.contractFile || null;

    // Form state
    const [category,    setCategory]    = useState("overig");
    const [priority,    setPriority]    = useState("laag");
    const [title,       setTitle]       = useState("");
    const [description, setDescription] = useState("");
    const [photo,       setPhoto]       = useState(null);
    const [preview,     setPreview]     = useState(null);
    const [submitting,  setSubmitting]  = useState(false);
    const [submitMsg,   setSubmitMsg]   = useState(null);

    // Own tickets
    const [myTickets,   setMyTickets]   = useState([]);
    const [loading,     setLoading]     = useState(true);

    const loadMyTickets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/tickets/me");
            setMyTickets(res.data || []);
        } catch {
            setMyTickets(MOCK_MY_TICKETS);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadMyTickets(); }, [loadMyTickets]);

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhoto(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;
        setSubmitting(true); setSubmitMsg(null);
        try {
            const form = new FormData();
            form.append("title",       title);
            form.append("description", description);
            form.append("category",    category);
            form.append("priority",    priority);
            if (photo) form.append("photo", photo);

            await api.post("/api/tickets", form, { headers: { "Content-Type": "multipart/form-data" } });
            setSubmitMsg({ ok: true, text: "Melding verstuurd! We nemen zo snel mogelijk contact op." });
            setTitle(""); setDescription(""); setCategory("overig"); setPriority("laag");
            setPhoto(null); setPreview(null);
            loadMyTickets();
        } catch {
            setSubmitMsg({ ok: false, text: "Kon melding niet versturen. Probeer het later opnieuw." });
        } finally {
            setSubmitting(false);
        }
    };

    const sidebar = <StudentSidebarShared user={user} logout={logout} active="meldingen" contractFile={contractFile} />;

    return (
        <DashboardLayout sidebar={sidebar} mainClass="sticket-main">
            <Helmet>
                <title>Iets melden — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Hero */}
            <div className="sticket-hero">
                <span className="sticket-hero-icon">🔧</span>
                <div>
                    <strong>Iets melden</strong>
                    <p>Heb je een klacht, defect of onderhoudsvraag? Meld het hier en we zorgen dat het wordt opgepakt.</p>
                </div>
            </div>

            {/* Submit form */}
            <div className="sticket-form-card">
                <h2 className="sticket-form-title"><FiSend /> Nieuwe melding</h2>
                <form className="sticket-form" onSubmit={handleSubmit}>
                    <div className="sticket-form-row">
                        <div className="sticket-field">
                            <label>Categorie</label>
                            <select value={category} onChange={e => setCategory(e.target.value)}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                            </select>
                        </div>
                        <div className="sticket-field">
                            <label>Prioriteit</label>
                            <select value={priority} onChange={e => setPriority(e.target.value)}>
                                {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="sticket-field sticket-field--full">
                        <label>Titel</label>
                        <input
                            type="text"
                            placeholder="Kort omschrijven (bijv. 'Lekkende kraan badkamer')"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            maxLength={120}
                        />
                    </div>

                    <div className="sticket-field sticket-field--full">
                        <label>Beschrijving</label>
                        <textarea
                            rows={4}
                            placeholder="Beschrijf het probleem zo duidelijk mogelijk…"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* Photo upload */}
                    <div className="sticket-field sticket-field--full">
                        <label>Foto (optioneel)</label>
                        {preview ? (
                            <div className="sticket-photo-preview">
                                <img src={preview} alt="Preview" />
                                <button type="button" className="sticket-remove-photo" onClick={() => { setPhoto(null); setPreview(null); }}>
                                    <FiX /> Verwijderen
                                </button>
                            </div>
                        ) : (
                            <label className="sticket-photo-label">
                                <FiImage /> Foto toevoegen
                                <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
                            </label>
                        )}
                    </div>

                    {submitMsg && (
                        <p className="sticket-submit-msg" style={{ color: submitMsg.ok ? "#2ecc71" : "#e74c3c" }}>
                            {submitMsg.text}
                        </p>
                    )}

                    <button type="submit" className="sticket-submit-btn" disabled={submitting}>
                        <FiSend /> {submitting ? "Versturen…" : "Melding versturen"}
                    </button>
                </form>
            </div>

            {/* My tickets */}
            <div className="sticket-my-section">
                <h2 className="sticket-section-title"><FiTool /> Mijn meldingen</h2>
                {loading && <p className="sticket-loading">Laden…</p>}
                {!loading && myTickets.length === 0 && (
                    <p className="sticket-empty">Je hebt nog geen meldingen gedaan.</p>
                )}
                <div className="sticket-list">
                    {myTickets.map(t => <MyTicketCard key={t.id} ticket={t} />)}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentTicketsPage;
