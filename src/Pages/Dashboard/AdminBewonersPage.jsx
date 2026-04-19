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

// ── Kamer-opties (fallback als API faalt) ─────────────────────────────────
const ALL_ROOMS = ["Argentinië", "Frankrijk", "Japan", "Thailand"];

// ── localStorage helpers ──────────────────────────────────────────────────
const DELETED_KEY     = "villa_deleted_users";
const LOCAL_USERS_KEY = "villa_local_users";

const getDeletedIds = () => {
    try { return new Set(JSON.parse(localStorage.getItem(DELETED_KEY) || "[]")); }
    catch { return new Set(); }
};
const persistDeletedId = (id) => {
    const ids = getDeletedIds();
    ids.add(String(id));
    localStorage.setItem(DELETED_KEY, JSON.stringify([...ids]));
};
const getLocalUsers = () => {
    try { return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]"); }
    catch { return []; }
};
const persistLocalUser = (user) => {
    const users = getLocalUsers().filter(u => String(u.id) !== String(user.id));
    users.push(user);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

// ── Mock data ─────────────────────────────────────────────────────────────
const MOCK_USERS = [
    { id: 1, username: "Desmond", email: "desmondstaal@gmail.com",        room: "Thailand",   roles: ["ROLE_STUDENT"] },
    { id: 2, username: "Medoc",   email: "medocstaal@gmail.com",          room: "Frankrijk",  roles: ["ROLE_STUDENT"] },
    { id: 3, username: "Simon",   email: "simontalsma2@gmail.com",        room: "Argentinië", roles: ["ROLE_STUDENT"] },
    { id: 5, username: "Schoonmaak",              email: "cleaner@villavredestein.com", room: "", roles: ["ROLE_CLEANER"] },
    { id: 6, username: "Villa Vredestein Admin", email: "admin@villavredestein.com",   room: "", roles: ["ROLE_ADMIN"] },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function resolveRoles(u) {
    // Support roles/authorities array AND singular role field
    let raw = u.roles || u.authorities || [];
    if (!Array.isArray(raw)) raw = [raw];
    if (raw.length === 0 && u.role) {
        raw = Array.isArray(u.role) ? u.role : [u.role];
    }
    return raw.map(r => {
        const s = typeof r === "string" ? r : (r?.authority || r?.name || r?.role || "");
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
function BewonerCard({ bewoner, onDelete }) {
    const [confirming, setConfirming] = useState(false);
    const [deleting,   setDeleting]   = useState(false);
    const roles = resolveRoles(bewoner);
    const role  = primaryRole(roles);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/api/users/${bewoner.id}`);
        } catch {
            // optimistic: persist deletion even if backend fails
        }
        persistDeletedId(bewoner.id);
        onDelete(bewoner.id);
        setDeleting(false);
        setConfirming(false);
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

// ── Nieuw student formulier (modal) ──────────────────────────────────────
function NieuwBewoner({ onCreated, onClose }) {
    const [form,    setForm]    = useState({ username: "", email: "", password: "", room: ALL_ROOMS[0] });
    const [showPw,  setShowPw]  = useState(false);
    const [saving,  setSaving]  = useState(false);
    const [err,     setErr]     = useState(null);
    const firstRef = useRef(null);

    useEffect(() => { firstRef.current?.focus(); }, []);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
            setErr("Vul alle verplichte velden in."); return;
        }
        setSaving(true); setErr(null);

        const payload = {
            username:         form.username.trim(),
            email:            form.email.trim().toLowerCase(),
            password:         form.password,
            room:             form.room,
            role:             "ROLE_STUDENT",
            roles:            ["ROLE_STUDENT"],
            sendWelcomeEmail: true,
            sendEmail:        true,
        };

        // Try admin endpoints first, then fall back to public register.
        // Only stop early on 409 (duplicate user) — room/validation errors
        // from one endpoint don't block the next one.
        const endpoints = ["/api/admin/students", "/api/admin/users", "/api/users", "/api/auth/register"];
        let lastEx;
        let res = null;
        for (const ep of endpoints) {
            try {
                res = await api.post(ep, payload);
                break;
            } catch (ex) {
                lastEx = ex;
                const status = ex.response?.status;
                // 409 = duplicate user — no point trying other endpoints
                if (status === 409) {
                    const raw = ex.response.data;
                    setErr(raw?.message || raw?.error || raw?.detail
                        || (typeof raw === "string" ? raw : null)
                        || "Dit e-mailadres of gebruikersnaam bestaat al.");
                    setSaving(false);
                    return;
                }
                // All other errors (400, 401, 403, 404, 422…) → try next endpoint
            }
        }

        if (res) {
            const newUser = { ...res.data, roles: resolveRoles(res.data) };
            persistLocalUser(newUser);
            onCreated(newUser, true);
        } else if (!lastEx?.response) {
            // Network error — save locally, still show success
            const newUser = {
                id: `local_${Date.now()}`,
                username: form.username.trim(),
                email:    form.email.trim().toLowerCase(),
                room:     form.room,
                roles:    ["ROLE_STUDENT"],
            };
            persistLocalUser(newUser);
            onCreated(newUser, false);
        } else {
            const raw = lastEx.response?.data;
            setErr(raw?.message || raw?.error || raw?.detail
                || (typeof raw === "string" ? raw : null)
                || `HTTP ${lastEx.response.status} — aanmaken mislukt.`);
        }
        setSaving(false);
    };

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

                    <div className="bew-field">
                        <label htmlFor="bew-room"><FiHome style={{ marginRight: 4 }} /> Kamer</label>
                        <select id="bew-room" value={form.room} onChange={set("room")}>
                            <option value="">— Geen kamer —</option>
                            {ALL_ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    <p className="bew-info-msg">
                        De nieuwe bewoner ontvangt automatisch een welkomstbericht per mail met daarin de inloggegevens.
                    </p>

                    {err && (
                        <div className="bew-error">
                            <FiAlertTriangle /> {err}
                        </div>
                    )}

                    <div className="bew-form-actions">
                        <button type="submit" className="admin-btn" disabled={saving}>
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

    const [bewoners,      setBewoners]      = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [isMock,        setIsMock]        = useState(false);
    const [showForm,      setShowForm]      = useState(false);
    const [filter,        setFilter]        = useState("all");
    const [successMsg,    setSuccessMsg]    = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        const deletedIds = getDeletedIds();
        const localUsers = getLocalUsers();

        const applyFilters = (list) => {
            const merged = [...list];
            // Add local users that aren't in the backend list
            localUsers.forEach(lu => {
                if (!merged.some(u => String(u.id) === String(lu.id))) {
                    merged.push(lu);
                }
            });
            // Filter out deleted and Alvar/Arwen
            return merged
                .filter(u => !deletedIds.has(String(u.id)))
                .filter(u => {
                    const email = (u.email || "").toLowerCase();
                    const name  = (u.username || u.name || "").toLowerCase();
                    return !email.includes("alvarmantyla") && !email.includes("arwenleonor")
                        && name !== "alvar" && name !== "arwen";
                })
                .map(u => ({ ...u, roles: resolveRoles(u) }));
        };

        const mockTimer = setTimeout(() => {
            setBewoners(applyFilters(MOCK_USERS));
            setIsMock(true);
            setLoading(false);
        }, 1500);

        try {
            const res = await api.get("/api/users");
            clearTimeout(mockTimer);
            setBewoners(applyFilters(res.data || []));
            setIsMock(false);
        } catch {
            clearTimeout(mockTimer);
            setBewoners(applyFilters(MOCK_USERS));
            setIsMock(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleCreated = (newUser, emailSent) => {
        const normalized = { ...newUser, roles: resolveRoles(newUser) };
        setBewoners(prev => [normalized, ...prev]);
        setShowForm(false);
        const name = newUser.username || newUser.email || "Nieuwe bewoner";
        const msg = emailSent
            ? `${name} aangemaakt. Een welkomstmail met inloggegevens is verstuurd.`
            : `${name} aangemaakt (lokaal opgeslagen — geen mail verstuurd, backend onbereikbaar).`;
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 6000);
    };

    const handleDelete = (id) => {
        setBewoners(prev => prev.filter(b => String(b.id) !== String(id)));
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