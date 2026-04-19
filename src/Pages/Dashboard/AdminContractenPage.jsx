import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiFileText, FiRefreshCw, FiAlertTriangle, FiCheckCircle,
    FiUpload, FiDownload, FiUser, FiX, FiUsers,
    FiEdit2, FiSave,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import { AdminSidebar } from "./AdminBetalingenMatrix.jsx";
import "./StudentDashboard.css";
import "./AdminPages.css";
import "../../Styles/Global.css";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");
const ROOM_OPTIONS = ["Argentinië", "Frankrijk", "Japan", "Thailand"];
const OVERRIDES_KEY = "villa_contract_overrides";

// ── Helpers ───────────────────────────────────────────────────────────────
function daysUntil(dateStr) {
    if (!dateStr) return null;
    return Math.ceil((new Date(dateStr) - new Date()) / 86_400_000);
}
function formatDate(dateStr) {
    if (!dateStr) return "–";
    return new Date(dateStr).toLocaleDateString("nl-NL");
}
function getOverrides() {
    try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}"); }
    catch { return {}; }
}
function saveOverride(id, patch) {
    const all = getOverrides();
    all[String(id)] = { ...(all[String(id)] || {}), ...patch };
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
}
function applyOverrides(list) {
    const all = getOverrides();
    return list.map(t => ({ ...t, ...(all[String(t.id)] || {}) }));
}

// ── Mock data ─────────────────────────────────────────────────────────────
const MOCK_USERS = [
    { id: 1, username: "Desmond", email: "desmondstaal@gmail.com", room: "Thailand",   contractStart: "2025-09-01", contractEnd: "2026-08-31", deposit: 750, contractFile: null },
    { id: 2, username: "Medoc",   email: "medocstaal@gmail.com",   room: "Frankrijk",  contractStart: "2025-09-01", contractEnd: "2026-08-31", deposit: 750, contractFile: null },
    { id: 3, username: "Simon",   email: "simontalsma2@gmail.com", room: "Argentinië", contractStart: "2025-09-01", contractEnd: "2026-08-31", deposit: 750, contractFile: null },
];

const getDeletedIds = () => {
    try { return new Set(JSON.parse(localStorage.getItem("villa_deleted_users") || "[]")); }
    catch { return new Set(); }
};
function resolveContractFile(u) {
    return u.contractFile || u.contractFileName || u.contract || u.contractPath || null;
}

// ── Contract card ─────────────────────────────────────────────────────────
function ContractCard({ tenant, onUpload, onUpdate }) {
    const days    = daysUntil(tenant.contractEnd);
    const hasFile = !!tenant.contractFile;

    const [editing,   setEditing]   = useState(false);
    const [draft,     setDraft]     = useState({});
    const [saving,    setSaving]    = useState(false);
    const [saveMsg,   setSaveMsg]   = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState(null);

    let urgency = "green";
    if (days != null && days <= 0)   urgency = "red";
    else if (days != null && days <= 30) urgency = "red";
    else if (days != null && days <= 90) urgency = "orange";
    else if (!hasFile)               urgency = "gray";

    const badgeLabel =
        days == null  ? "Onbekend" :
        days <= 0     ? "Verlopen!" :
        days <= 7     ? `${days}d resterend` :
        days <= 90    ? `${days}d` :
        `nog ${days} dagen`;

    const startEdit = () => {
        setDraft({
            room:          tenant.room          || "",
            contractStart: tenant.contractStart || "",
            contractEnd:   tenant.contractEnd   || "",
            deposit:       tenant.deposit != null ? String(tenant.deposit) : "",
        });
        setSaveMsg(null);
        setEditing(true);
    };

    const cancelEdit = () => { setEditing(false); setSaveMsg(null); };

    const handleSave = async () => {
        setSaving(true); setSaveMsg(null);
        const patch = {
            room:          draft.room || null,
            contractStart: draft.contractStart || null,
            contractEnd:   draft.contractEnd   || null,
            deposit:       draft.deposit !== "" ? Number(draft.deposit) : null,
        };

        // Try API endpoints; fall back to localStorage
        let backendSaved = false;
        for (const ep of [`/api/admin/users/${tenant.id}`, `/api/users/${tenant.id}`]) {
            try { await api.patch(ep, patch); backendSaved = true; break; }
            catch { /* try next */ }
        }
        saveOverride(tenant.id, patch);
        onUpdate?.({ ...tenant, ...patch });
        setEditing(false);
        setSaveMsg(backendSaved ? "Opgeslagen!" : "Lokaal opgeslagen.");
        setTimeout(() => setSaveMsg(null), 4000);
        setSaving(false);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true); setUploadMsg(null);
        const form = new FormData();
        form.append("file", file);
        try {
            await api.post(`/api/users/${tenant.id}/contract`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUploadMsg("Contract geüpload!");
            onUpload?.();
        } catch {
            setUploadMsg("Upload mislukt.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`contract-card contract-card--${urgency}`}>
            {/* ── Header ── */}
            <div className="contract-card-header">
                <div className="contract-card-title">
                    <FiUser className="contract-icon" />
                    <div>
                        <strong>{tenant.username}</strong>
                        <span className="contract-email">{tenant.email}</span>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span className={`contract-expiry-badge contract-expiry-badge--${urgency}`}>
                        {urgency === "red"   && <FiAlertTriangle />}
                        {urgency === "green" && <FiCheckCircle />}
                        {badgeLabel}
                    </span>
                    {!editing && (
                        <button type="button" className="admin-btn admin-btn--small admin-btn--ghost" onClick={startEdit}>
                            <FiEdit2 /> Bewerken
                        </button>
                    )}
                </div>
            </div>

            {/* ── Body ── */}
            <div className="contract-card-body">
                {editing ? (
                    <div className="contract-edit-form">
                        <div className="contract-edit-grid">
                            <div className="contract-edit-field">
                                <label>Kamer</label>
                                <select value={draft.room} onChange={e => setDraft(d => ({ ...d, room: e.target.value }))}>
                                    <option value="">— Geen kamer —</option>
                                    {ROOM_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className="contract-edit-field">
                                <label>Startdatum</label>
                                <input type="date" value={draft.contractStart} onChange={e => setDraft(d => ({ ...d, contractStart: e.target.value }))} />
                            </div>
                            <div className="contract-edit-field">
                                <label>Einddatum</label>
                                <input type="date" value={draft.contractEnd} onChange={e => setDraft(d => ({ ...d, contractEnd: e.target.value }))} />
                            </div>
                            <div className="contract-edit-field">
                                <label>Borg (€)</label>
                                <input type="number" min="0" step="50" value={draft.deposit} onChange={e => setDraft(d => ({ ...d, deposit: e.target.value }))} placeholder="0" />
                            </div>
                        </div>
                        <div className="contract-edit-actions">
                            <button type="button" className="admin-btn admin-btn--small" onClick={handleSave} disabled={saving}>
                                <FiSave /> {saving ? "Opslaan…" : "Opslaan"}
                            </button>
                            <button type="button" className="admin-btn admin-btn--small admin-btn--ghost" onClick={cancelEdit} disabled={saving}>
                                <FiX /> Annuleren
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="contract-meta-row">
                        <span>Kamer: <strong>{tenant.room || "–"}</strong></span>
                        <span>Start: <strong>{formatDate(tenant.contractStart)}</strong></span>
                        <span>Einde: <strong>{formatDate(tenant.contractEnd)}</strong></span>
                        <span>Borg: <strong>{tenant.deposit != null ? `€${tenant.deposit}` : "–"}</strong></span>
                    </div>
                )}

                {saveMsg && (
                    <p className="contract-save-msg">{saveMsg}</p>
                )}

                <div className="contract-actions">
                    {hasFile ? (
                        <a
                            href={`${BASE_URL}/uploads/${encodeURIComponent(tenant.contractFile)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn admin-btn--small"
                        >
                            <FiDownload /> Contract bekijken
                        </a>
                    ) : (
                        <span className="contract-no-file"><FiX /> Geen contract geüpload</span>
                    )}
                    <label className="admin-btn admin-btn--small admin-btn--ghost" style={{ cursor: "pointer" }}>
                        <FiUpload /> {uploading ? "Uploaden…" : "Contract uploaden"}
                        <input type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={handleFileUpload} />
                    </label>
                </div>

                {uploadMsg && (
                    <p style={{ fontSize: 13, marginTop: 6, color: uploadMsg.includes("!") ? "#22c55e" : "#ef4444" }}>
                        {uploadMsg}
                    </p>
                )}
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────
const AdminContractenPage = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMock,  setIsMock]  = useState(false);
    const [filter,  setFilter]  = useState("all");

    const load = useCallback(async () => {
        setLoading(true);
        const deletedIds = getDeletedIds();

        const filterUsers = (list) =>
            list
                .filter(u => !deletedIds.has(String(u.id)))
                .filter(u => {
                    const email = (u.email || "").toLowerCase();
                    const name  = (u.username || "").toLowerCase();
                    return !email.includes("alvarmantyla") && !email.includes("arwenleonor")
                        && name !== "alvar" && name !== "arwen";
                });

        try {
            const res = await api.get("/api/users");
            const all = res.data || [];
            const isNonStudent = (u) => {
                const roles = u.roles || u.authorities || [];
                return roles.some(r => {
                    const s = typeof r === "string" ? r : (r?.authority || r?.name || "");
                    return s.toUpperCase().includes("ADMIN") || s.toUpperCase().includes("CLEANER");
                });
            };
            const normalized = filterUsers(all.filter(u => !isNonStudent(u))).map(u => ({
                ...u,
                contractFile: resolveContractFile(u),
            }));
            setTenants(applyOverrides(normalized));
            setIsMock(false);
        } catch {
            setTenants(applyOverrides(filterUsers(MOCK_USERS)));
            setIsMock(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleUpdate = (updated) => {
        setTenants(prev => prev.map(t => String(t.id) === String(updated.id) ? updated : t));
    };

    const filtered = tenants.filter(t => {
        if (filter === "expiring") { const d = daysUntil(t.contractEnd); return d != null && d <= 90; }
        if (filter === "missing")  return !t.contractFile;
        return true;
    });

    const expiringSoon = tenants.filter(t => { const d = daysUntil(t.contractEnd); return d != null && d <= 90; }).length;
    const missingFile  = tenants.filter(t => !t.contractFile).length;

    const sidebar = <AdminSidebar active="contracten" logout={logout} username={user?.username} />;

    return (
        <DashboardLayout sidebar={sidebar} mainClass="admin-main">
            <Helmet>
                <title>Contracten — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="admin-page-header">
                <h1><FiFileText /> Contract-dashboard</h1>
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
                <div className="admin-summary-card admin-summary-card--blue">
                    <FiUsers />
                    <div><span className="asc-num">{tenants.length}</span><span className="asc-label">Bewoners</span></div>
                </div>
                <div className="admin-summary-card admin-summary-card--amber">
                    <FiAlertTriangle />
                    <div><span className="asc-num">{expiringSoon}</span><span className="asc-label">Loopt af (&lt;90d)</span></div>
                </div>
                <div className="admin-summary-card admin-summary-card--red">
                    <FiX />
                    <div><span className="asc-num">{missingFile}</span><span className="asc-label">Geen bestand</span></div>
                </div>
            </div>

            <div className="admin-filter-tabs">
                {[
                    { key: "all",      label: `Alle (${tenants.length})` },
                    { key: "expiring", label: `Verloopt binnenkort (${expiringSoon})` },
                    { key: "missing",  label: `Geen bestand (${missingFile})` },
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
                {!loading && filtered.length === 0 && (
                    <p className="admin-empty">Geen contracten gevonden.</p>
                )}
                <div className="contract-list">
                    {filtered.map(t => (
                        <ContractCard key={t.id} tenant={t} onUpload={load} onUpdate={handleUpdate} />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminContractenPage;