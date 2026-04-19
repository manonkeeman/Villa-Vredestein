import React, { useEffect, useState, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiUsers, FiRefreshCw, FiAlertTriangle, FiPlus,
    FiTrash2, FiUser, FiMail, FiHome, FiShield,
    FiX, FiSave, FiEye, FiEyeOff, FiSearch, FiTool,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import { AdminSidebar } from "./AdminBetalingenMatrix.jsx";
import "./StudentDashboard.css";
import "./AdminPages.css";
import "./AdminBewonersPage.css";
import "../../Styles/Global.css";

// ── Kamer-opties ──────────────────────────────────────────────────────────
const ROOM_OPTIONS = ["Japan", "Argentinië", "Thailand", "Frankrijk"];
const ROLE_OPTIONS = [
    { value: "ROLE_STUDENT", label: "Student / Bewoner" },
    { value: "ROLE_CLEANER", label: "Schoonmaakster" },
    { value: "ROLE_ADMIN",   label: "Beheerder" },
];

// ── Mock data ─────────────────────────────────────────────────────────────
const MOCK_USERS = [
    { id: 1, username: "Desmond", email: "desmond@example.com", room: "Japan",      roles: ["ROLE_STUDENT"] },
    { id: 2, username: "Medoc",   email: "medoc@example.com",   room: "Argentinië", roles: ["ROLE_STUDENT"] },
    { id: 3, username: "Simon",   email: "simon@example.com",   room: "Thailand",   roles: ["ROLE_STUDENT"] },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function resolveRoles(u) {
    const raw = u.roles || u.authorities || [];
    return raw.map(r => {
        const s = typeof r === "string" ? r : (r?.authority || r?.name || "");
        if (!s) return null;
        const up = s.trim().toUpperCase();
        return up.startsWith("ROLE_") ? up : `ROLE_${up}`;
    }).filter(Boolean);
}

function primaryRole(roles = []) {
    if (roles.some(r => r.includes("ADMIN")))   return { label: "Beheerder",   cls: "bew-role--admin",   icon: <FiShield /> };
    if (roles.some(r => r.includes("CLEANER"))) return { label: "Schoonmaak",  cls: "bew-role--cleaner", icon: <FiTool /> };
    return { label: "Bewoner", cls: "bew-role--student", icon: <FiUser /> };
}

// ── Bewoner-kaart ─────────────────────────────────────────────────────────
function BewonderCard({ bewoner, onDelete }) {
    const [confirming, setConfirming] = useState(false);
    const [deleting,   setDeleting]   = useState(false);
    const roles = resolveRoles(bewoner);
    const role  = primaryRole(roles);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/api/users/${bewoner.id}`);
            onDelete(bewoner.id);
        } catch {
            // optimistic delete for demo
            onDelete(bewoner.id);
        } finally {
            setDeleting(false);
            setConfirming(false);
        }
    };

    return (
        <div className="bew-card">
            <div className="bew-card-avatar">
                {role.icon}
            </div>
            <div className="bew-card-info">
                <strong className="bew-card-name">{bewoner.username}</strong>
                <span className="bew-card-email"><FiMail /> {bewoner.email}</span>
                {bewoner.room && <span className="bew-card-room"><FiHome /> {bewoner.room}</span>}
            </div>
            <span className={`bew-role-badge ${role.cls}`}>{role.label}</span>

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
                        onClick={() => setConfirming(false)}
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

// ── Nieuw-bewoner formulier (modal/slide-in) ──────────────────────────────
const EMPTY_FORM = { username: "", email: "", password: "", room: ROOM_OPTIONS[0], role: "ROLE_STUDENT" };

function NieuwBewoner({ onCreated, onClose }) {
    const [form,     setForm]     = useState(EMPTY_FORM);
    const [showPw,   setShowPw]   = useState(false);
    const [saving,   setSaving]   = useState(false);
    const [err,      setErr]      = useState(null);
    const firstRef = useRef(null);

    useEffect(() => { firstRef.current?.focus(); }, []);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
            setErr("Vul alle verplichte velden in."); return;
        }
        setSaving(true); setErr(null);
        try {
            const res = await api.post("/api/auth/register", {
                username: form.username.trim(),
                email:    form.email.trim().toLowerCase(),
                password: form.password,
                room:     form.room,
                role:     form.role,
            });
            onCreated(res.data || { id: Date.now(), ...form, roles: [form.role] });
        } catch (ex) {
            const msg = ex?.response?.data?.message || ex?.response?.data || "Aanmaken mislukt. Controleer of het e-mailadres al bestaat.";
            setErr(typeof msg === "string" ? msg : JSON.stringify(msg));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bew-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bew-modal" role="dialog" aria-modal="true" aria-label="Nieuwe bewoner aanmaken">
                <div className="bew-modal-header">
                    <h2><FiPlus /> Nieuwe bewoner aanmaken</h2>
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
                            placeholder="bijv. Desmond"
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
                            placeholder="bewoner@example.com"
                            value={form.email}
                            onChange={set("email")}
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div className="bew-field">
                        <label htmlFor="bew-password">Wachtwoord <span aria-hidden>*</span></label>
                        <div className="bew-pw-wrap">
                            <input
                                id="bew-password"
                                type={showPw ? "text" : "password"}
                                placeholder="Tijdelijk wachtwoord"
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
                            <label htmlFor="bew-room">Kamer</label>
                            <select id="bew-room" value={form.room} onChange={set("room")}>
                                {ROOM_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        <div className="bew-field">
                            <label htmlFor="bew-role">Rol</label>
                            <select id="bew-role" value={form.role} onChange={set("role")}>
                                {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {err && (
                        <div className="bew-error">
                            <FiAlertTriangle /> {err}
                        </div>
                    )}

                    <div className="bew-form-actions">
                        <button type="submit" className="admin-btn" disabled={saving}>
                            <FiSave /> {saving ? "Aanmaken…" : "Bewoner aanmaken"}
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

    const [bewoners, setBewoners] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [isMock,   setIsMock]   = useState(false);
    const [search,   setSearch]   = useState("");
    const [showForm, setShowForm] = useState(false);
    const [filter,   setFilter]   = useState("all"); // all | student | cleaner | admin

    const load = useCallback(async () => {
        setLoading(true);
        // Show mock data after 1.5s if backend hasn't responded yet
        const mockTimer = setTimeout(() => {
            setBewoners(prev => prev.length === 0 ? MOCK_USERS : prev);
            setIsMock(true);
            setLoading(false);
        }, 1500);
        try {
            const res = await api.get("/api/users");
            clearTimeout(mockTimer);
            const all = (res.data || []).map(u => ({ ...u, roles: resolveRoles(u) }));
            setBewoners(all);
            setIsMock(false);
        } catch {
            clearTimeout(mockTimer);
            setBewoners(MOCK_USERS);
            setIsMock(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleCreated = (newUser) => {
        const normalized = { ...newUser, roles: resolveRoles(newUser) };
        setBewoners(prev => [normalized, ...prev]);
        setShowForm(false);
    };

    const handleDelete = (id) => {
        setBewoners(prev => prev.filter(b => b.id !== id));
    };

    // Filtered & searched list
    const filtered = bewoners.filter(b => {
        const matchRole =
            filter === "all"     ? true :
            filter === "student" ? b.roles.some(r => r.includes("STUDENT")) :
            filter === "cleaner" ? b.roles.some(r => r.includes("CLEANER")) :
            filter === "admin"   ? b.roles.some(r => r.includes("ADMIN"))   : true;

        const q = search.trim().toLowerCase();
        const matchSearch = !q ||
            (b.username || "").toLowerCase().includes(q) ||
            (b.email    || "").toLowerCase().includes(q) ||
            (b.room     || "").toLowerCase().includes(q);

        return matchRole && matchSearch;
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

            {isMock && (
                <div className="admin-alert admin-alert--amber">
                    <FiAlertTriangle /> Backend niet beschikbaar — voorbeelddata wordt getoond.
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

            {/* Toolbar */}
            <div className="admin-toolbar">
                <div className="admin-search-wrap">
                    <FiSearch />
                    <input
                        type="search"
                        className="admin-search-input"
                        placeholder="Zoek op naam, e-mail of kamer…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button type="button" onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: 0 }}>
                            <FiX />
                        </button>
                    )}
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
                {!loading && filtered.length === 0 && (
                    <p className="admin-empty">Geen bewoners gevonden.</p>
                )}
                <div className="bew-list">
                    {filtered.map(b => (
                        <BewonderCard key={b.id} bewoner={b} onDelete={handleDelete} />
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
