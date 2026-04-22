import React, { useEffect, useState, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiUsers, FiRefreshCw, FiAlertTriangle, FiPlus,
    FiTrash2, FiUser, FiMail, FiHome, FiShield,
    FiX, FiSave, FiEye, FiEyeOff, FiTool, FiCheckCircle,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import { AdminSidebar } from "./AdminBetalingenMatrix.jsx";
import "./StudentDashboard.css";
import "./AdminPages.css";
import "./AdminBewonersPage.css";
import "../../Styles/Global.css";

// ── Helpers ───────────────────────────────────────────────────────────────
function resolveRoles(u) {
    let raw = u.roles || u.authorities || [];
    if (!Array.isArray(raw)) raw = [raw];
    if (raw.length === 0 && u.role) raw = Array.isArray(u.role) ? u.role : [u.role];
    return raw.map(r => {
        const s = typeof r === "string" ? r : (r?.authority || r?.name || r?.role || "");
        if (!s) return null;
        const up = s.trim().toUpperCase();
        return up.startsWith("ROLE_") ? up : `ROLE_${up}`;
    }).filter(Boolean);
}

function primaryRole(roles = []) {
    if (roles.some(r => r.includes("ADMIN")))   return { label: "Beheerder",  cls: "bew-role--admin",   icon: <FiShield /> };
    if (roles.some(r => r.includes("CLEANER"))) return { label: "Schoonmaak", cls: "bew-role--cleaner", icon: <FiTool /> };
    return { label: "Bewoner", cls: "bew-role--student", icon: <FiUser /> };
}

function resolveRoom(u) {
    return u.room?.name || u.roomName || u.assignedRoom || u.assignedRoomName
        || (typeof u.room === "string" ? u.room : "") || "";
}

// ── Bewoner-kaart ─────────────────────────────────────────────────────────
function BewonerCard({ bewoner, onDelete }) {
    const [confirming, setConfirming] = useState(false);
    const [deleting,   setDeleting]   = useState(false);
    const [deleteErr,  setDeleteErr]  = useState(null);

    const roles = resolveRoles(bewoner);
    const role  = primaryRole(roles);
    const room  = resolveRoom(bewoner);

    const handleDelete = async () => {
        setDeleting(true);
        setDeleteErr(null);
        try {
            await api.delete(`/api/users/${bewoner.id}`);
            onDelete(bewoner.id);
        } catch (ex) {
            const msg = ex.response?.data?.message || ex.response?.data?.error
                || `Verwijderen mislukt (HTTP ${ex.response?.status ?? "?"})`;
            setDeleteErr(msg);
            setDeleting(false);
        }
    };

    return (
        <div className="bew-card">
            <div className="bew-card-avatar">{role.icon}</div>
            <div className="bew-card-info">
                <strong className="bew-card-name">{bewoner.username}</strong>
                <span className="bew-card-email"><FiMail /> {bewoner.email}</span>
                {room && <span className="bew-card-room"><FiHome /> {room}</span>}
            </div>
            <span className={`bew-role-badge ${role.cls}`}>{role.label}</span>

            {deleteErr && (
                <span className="bew-delete-err" title={deleteErr}><FiAlertTriangle /></span>
            )}

            {confirming ? (
                <div className="bew-confirm-row">
                    <span className="bew-confirm-text">Zeker weten?</span>
                    <button
                        type="button"
                        className="admin-btn admin-btn--small admin-btn--danger"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? "Verwijderen…" : "Ja, verwijder"}
                    </button>
                    <button
                        type="button"
                        className="admin-btn admin-btn--small admin-btn--ghost"
                        onClick={() => { setConfirming(false); setDeleteErr(null); }}
                    >
                        <FiX /> Annuleer
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    className="admin-btn admin-btn--small admin-btn--danger"
                    onClick={() => setConfirming(true)}
                    title="Bewoner verwijderen"
                >
                    <FiTrash2 />
                </button>
            )}
        </div>
    );
}

// ── Nieuw student formulier (modal) ──────────────────────────────────────
function NieuwBewoner({ onCreated, onClose }) {
    const [form,           setForm]           = useState({ username: "", email: "", password: "", room: "", rentAmount: "350" });
    const [showPw,         setShowPw]         = useState(false);
    const [saving,         setSaving]         = useState(false);
    const [err,            setErr]            = useState(null);
    const [availableRooms, setAvailableRooms] = useState(null); // null = loading
    const firstRef = useRef(null);

    useEffect(() => {
        firstRef.current?.focus();
        api.get("/api/admin/rooms/available")
            .then(res => {
                const rooms = res.data || [];
                setAvailableRooms(rooms);
                if (rooms.length > 0) setForm(f => ({ ...f, room: rooms[0] }));
            })
            .catch(() => setAvailableRooms([]));
    }, []);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
            setErr("Vul alle verplichte velden in."); return;
        }
        if (!form.rentAmount || isNaN(Number(form.rentAmount)) || Number(form.rentAmount) < 1) {
            setErr("Vul een geldig huurbedrag in."); return;
        }
        setSaving(true); setErr(null);

        try {
            const res = await api.post("/api/admin/students", {
                username:         form.username.trim(),
                email:            form.email.trim().toLowerCase(),
                password:         form.password,
                room:             form.room,
                rentAmount:       Number(form.rentAmount),
                sendWelcomeEmail: true,
            });
            onCreated({ ...res.data, roles: resolveRoles(res.data) });
        } catch (ex) {
            const raw    = ex.response?.data;
            const status = ex.response?.status;
            let msg = raw?.message || raw?.error || raw?.detail
                || (typeof raw === "string" ? raw : null)
                || `HTTP ${status ?? "?"} — aanmaken mislukt.`;
            if (status === 409) msg = "Dit e-mailadres bestaat al in het systeem.";
            setErr(msg);
        } finally {
            setSaving(false);
        }
    };

    const allOccupied = availableRooms !== null && availableRooms.length === 0;

    return (
        <div className="bew-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bew-modal" role="dialog" aria-modal="true" aria-label="Nieuwe student aanmaken">
                <div className="bew-modal-header">
                    <h2><FiPlus /> Nieuwe student aanmaken</h2>
                    <button type="button" className="bew-modal-close" onClick={onClose} aria-label="Sluiten">
                        <FiX />
                    </button>
                </div>

                <form className="bew-form" onSubmit={handleSubmit}>
                    <div className="bew-field">
                        <label htmlFor="bew-username">Naam / gebruikersnaam <span aria-hidden>*</span></label>
                        <input
                            id="bew-username"
                            ref={firstRef}
                            type="text"
                            placeholder="bijv. Lisa"
                            value={form.username}
                            onChange={set("username")}
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div className="bew-field">
                        <label htmlFor="bew-email">E-mailadres <span aria-hidden>*</span></label>
                        <input
                            id="bew-email"
                            type="email"
                            placeholder="student@example.com"
                            value={form.email}
                            onChange={set("email")}
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div className="bew-field">
                        <label htmlFor="bew-password">Tijdelijk wachtwoord <span aria-hidden>*</span></label>
                        <div className="bew-pw-wrap">
                            <input
                                id="bew-password"
                                type={showPw ? "text" : "password"}
                                placeholder="Min. 8 tekens"
                                value={form.password}
                                onChange={set("password")}
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="bew-pw-toggle"
                                onClick={() => setShowPw(v => !v)}
                                tabIndex={-1}
                                aria-label={showPw ? "Verberg wachtwoord" : "Toon wachtwoord"}
                            >
                                {showPw ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    <div className="bew-form-row">
                        <div className="bew-field">
                            <label htmlFor="bew-room">
                                <FiHome style={{ marginRight: 4 }} />
                                Lege kamer
                                {availableRooms === null && (
                                    <span style={{ fontSize: 11, color: "#888", marginLeft: 6 }}>laden…</span>
                                )}
                            </label>
                            {availableRooms === null ? null : availableRooms.length > 0 ? (
                                <select id="bew-room" value={form.room} onChange={set("room")}>
                                    <option value="">— Geen kamer —</option>
                                    {availableRooms.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            ) : (
                                <p className="bew-info" style={{ color: "#f87171", margin: 0 }}>
                                    Alle kamers zijn bezet.
                                </p>
                            )}
                        </div>

                        <div className="bew-field">
                            <label htmlFor="bew-rent">Huur per maand (€) <span aria-hidden>*</span></label>
                            <input
                                id="bew-rent"
                                type="number"
                                min="1"
                                step="0.01"
                                placeholder="bijv. 350"
                                value={form.rentAmount}
                                onChange={set("rentAmount")}
                                required
                            />
                        </div>
                    </div>

                    <p className="bew-info-msg">
                        De student ontvangt een welkomstmail met inloggegevens, kamernummer en info over Villa Vredestein.
                        Er wordt direct een factuur + Mollie betaallink aangemaakt. Het schoonmaakrooster wordt automatisch bijgewerkt.
                    </p>

                    {err && (
                        <div className="bew-error">
                            <FiAlertTriangle /> {err}
                        </div>
                    )}

                    <div className="bew-form-actions">
                        <button
                            type="submit"
                            className="admin-btn"
                            disabled={saving || allOccupied}
                        >
                            <FiSave /> {saving ? "Aanmaken…" : "Student aanmaken"}
                        </button>
                        <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
                            Annuleren
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────
const AdminBewonersPage = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const [bewoners,   setBewoners]   = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [loadErr,    setLoadErr]    = useState(null);
    const [showForm,   setShowForm]   = useState(false);
    const [filter,     setFilter]     = useState("all");
    const [successMsg, setSuccessMsg] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setLoadErr(null);
        try {
            const res = await api.get("/api/users");
            const all = (res.data || [])
                .filter(u => {
                    const email = (u.email || "").toLowerCase();
                    const name  = (u.username || u.name || "").toLowerCase();
                    // filter only known test/ghost accounts
                    return !email.includes("alvarmantyla") && name !== "alvar";
                })
                .map(u => ({ ...u, roles: resolveRoles(u) }));
            setBewoners(all);
        } catch {
            setLoadErr("Kon bewonerslijst niet laden. Controleer de verbinding en probeer het opnieuw.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleCreated = () => {
        setShowForm(false);
        setSuccessMsg("Nieuwe student aangemaakt. Welkomstmail verstuurd. Schoonmaakrooster bijgewerkt.");
        setTimeout(() => setSuccessMsg(null), 8000);
        load(); // herlaad om backend-state te spiegelen
    };

    const handleDelete = () => {
        load(); // herlaad na verwijdering
    };

    const filtered = bewoners.filter(b => {
        if (filter === "student") return b.roles.some(r => r.includes("STUDENT"));
        if (filter === "cleaner") return b.roles.some(r => r.includes("CLEANER"));
        if (filter === "admin")   return b.roles.some(r => r.includes("ADMIN"));
        return true;
    });

    const counts = {
        all:     bewoners.length,
        student: bewoners.filter(b => b.roles.some(r => r.includes("STUDENT"))).length,
        cleaner: bewoners.filter(b => b.roles.some(r => r.includes("CLEANER"))).length,
        admin:   bewoners.filter(b => b.roles.some(r => r.includes("ADMIN"))).length,
    };

    const sidebar = <AdminSidebar active="bewoners" logout={logout} username={user?.username} />;

    return (
        <DashboardLayout sidebar={sidebar} mainClass="admin-main">
            <Helmet>
                <title>Bewoners — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="admin-page-header">
                <h1><FiUsers /> Bewoners</h1>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                    <button type="button" className="admin-btn admin-btn--ghost" onClick={load} disabled={loading}>
                        <FiRefreshCw /> Verversen
                    </button>
                    <button type="button" className="admin-btn" onClick={() => setShowForm(true)}>
                        <FiPlus /> Nieuwe bewoner
                    </button>
                </div>
            </div>

            {successMsg && (
                <div className="admin-alert admin-alert--green">
                    <FiCheckCircle /> {successMsg}
                </div>
            )}

            {loadErr && (
                <div className="admin-alert admin-alert--amber">
                    <FiAlertTriangle /> {loadErr}
                </div>
            )}

            {/* Summary */}
            <div className="admin-summary-strip">
                <div className="admin-summary-card admin-summary-card--blue">
                    <FiUsers />
                    <div><span className="asc-num">{counts.all}</span><span className="asc-label">Totaal</span></div>
                </div>
                <div className="admin-summary-card admin-summary-card--green">
                    <FiUser />
                    <div><span className="asc-num">{counts.student}</span><span className="asc-label">Bewoners</span></div>
                </div>
                <div className="admin-summary-card admin-summary-card--amber">
                    <FiTool />
                    <div><span className="asc-num">{counts.cleaner}</span><span className="asc-label">Schoonmaak</span></div>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="admin-filter-tabs">
                {[
                    { key: "all",     label: `Alle (${counts.all})` },
                    { key: "student", label: `Bewoners (${counts.student})` },
                    { key: "cleaner", label: `Schoonmaak (${counts.cleaner})` },
                    { key: "admin",   label: `Beheerders (${counts.admin})` },
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

            {/* List */}
            <div className="admin-section">
                {loading && <p className="admin-loading">Laden…</p>}
                {!loading && !loadErr && filtered.length === 0 && (
                    <p className="admin-empty">Geen bewoners gevonden.</p>
                )}
                <div className="bew-list">
                    {filtered.map(b => (
                        <BewonerCard key={b.id} bewoner={b} onDelete={handleDelete} />
                    ))}
                </div>
            </div>

            {/* Create modal */}
            {showForm && (
                <NieuwBewoner
                    onCreated={handleCreated}
                    onClose={() => setShowForm(false)}
                />
            )}
        </DashboardLayout>
    );
};

export default AdminBewonersPage;
