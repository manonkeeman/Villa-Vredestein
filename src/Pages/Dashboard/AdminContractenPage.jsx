import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiUsers, FiDollarSign, FiClipboard,
    FiFileText, FiShield, FiTool, FiMessageSquare, FiGrid,
    FiRefreshCw, FiAlertTriangle, FiCheckCircle, FiUpload,
    FiDownload, FiUser, FiCalendar, FiX,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import { AdminSidebar } from "./AdminBetalingenMatrix.jsx";
import "./StudentDashboard.css";
import "./AdminPages.css";
import "../../Styles/Global.css";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

// ── Helpers ──────────────────────────────────────────────────────────────
function daysUntil(dateStr) {
    if (!dateStr) return null;
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / 86_400_000);
}

function formatDate(dateStr) {
    if (!dateStr) return "–";
    return new Date(dateStr).toLocaleDateString("nl-NL");
}

// ── Mock data ────────────────────────────────────────────────────────────
const MOCK_USERS = [
    { id: 1, username: "anna",  email: "anna@example.com",   room: "Japan",      contractStart: "2025-09-01", contractEnd: "2026-08-31", deposit: 750, contractFile: null },
    { id: 2, username: "bas",   email: "bas@example.com",    room: "Argentinië", contractStart: "2025-09-01", contractEnd: "2026-06-30", deposit: 750, contractFile: "bas_contract.pdf" },
    { id: 3, username: "chloe", email: "chloe@example.com",  room: "Thailand",   contractStart: "2025-02-01", contractEnd: "2026-01-31", deposit: 750, contractFile: null },
    { id: 4, username: "david", email: "david@example.com",  room: "Frankrijk",  contractStart: "2024-09-01", contractEnd: "2026-08-31", deposit: 750, contractFile: "david_contract.pdf" },
];

// ── Contract card ────────────────────────────────────────────────────────
function ContractCard({ tenant, onUpload }) {
    const days      = daysUntil(tenant.contractEnd);
    const hasFile   = !!tenant.contractFile;
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState(null);

    let urgency = "green";
    if (days != null && days <= 0)   urgency = "red";
    else if (days != null && days <= 30) urgency = "red";
    else if (days != null && days <= 90) urgency = "orange";
    else if (!hasFile)                urgency = "gray";

    const badgeLabel =
        days == null            ? "Onbekend" :
        days <= 0               ? "Verlopen!" :
        days <= 7               ? `${days}d resterend` :
        days <= 90              ? `${days}d` :
        `nog ${days} dagen`;

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
            <div className="contract-card-header">
                <div className="contract-card-title">
                    <FiUser className="contract-icon" />
                    <div>
                        <strong>{tenant.username}</strong>
                        <span className="contract-email">{tenant.email}</span>
                    </div>
                </div>
                <span className={`contract-expiry-badge contract-expiry-badge--${urgency}`}>
                    {urgency === "red" && <FiAlertTriangle />}
                    {urgency === "green" && <FiCheckCircle />}
                    {badgeLabel}
                </span>
            </div>

            <div className="contract-card-body">
                <div className="contract-meta-row">
                    <span><FiCalendar /> Kamer: <strong>{tenant.room || "–"}</strong></span>
                    <span>Start: <strong>{formatDate(tenant.contractStart)}</strong></span>
                    <span>Einde: <strong>{formatDate(tenant.contractEnd)}</strong></span>
                    <span>Borg: <strong>€{tenant.deposit ?? "–"}</strong></span>
                </div>

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
                    <p style={{ fontSize: 13, marginTop: 6, color: uploadMsg.includes("!") ? "#2ecc71" : "#e74c3c" }}>
                        {uploadMsg}
                    </p>
                )}
            </div>
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────
const AdminContractenPage = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const [tenants,  setTenants]  = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [isMock,   setIsMock]   = useState(false);
    const [filter,   setFilter]   = useState("all"); // all | expiring | missing

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/users");
            const students = (res.data || []).filter(u =>
                (u.roles || []).some(r => r === "ROLE_STUDENT")
            );
            setTenants(students);
            setIsMock(false);
        } catch {
            setTenants(MOCK_USERS);
            setIsMock(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = tenants.filter(t => {
        if (filter === "expiring") {
            const d = daysUntil(t.contractEnd);
            return d != null && d <= 90;
        }
        if (filter === "missing") return !t.contractFile;
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

            {/* Summary strip */}
            <div className="admin-summary-strip">
                <div className="admin-summary-card admin-summary-card--blue">
                    <FiUsers />
                    <div>
                        <span className="asc-num">{tenants.length}</span>
                        <span className="asc-label">Bewoners</span>
                    </div>
                </div>
                <div className="admin-summary-card admin-summary-card--amber">
                    <FiAlertTriangle />
                    <div>
                        <span className="asc-num">{expiringSoon}</span>
                        <span className="asc-label">Loopt af (&lt;90d)</span>
                    </div>
                </div>
                <div className="admin-summary-card admin-summary-card--red">
                    <FiX />
                    <div>
                        <span className="asc-num">{missingFile}</span>
                        <span className="asc-label">Geen bestand</span>
                    </div>
                </div>
            </div>

            {/* Filter tabs */}
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

            {/* Contract cards */}
            <div className="admin-section">
                {loading && <p className="admin-loading">Laden…</p>}
                {!loading && filtered.length === 0 && (
                    <p className="admin-empty">Geen contracten gevonden.</p>
                )}
                <div className="contract-list">
                    {filtered.map(t => (
                        <ContractCard key={t.id} tenant={t} onUpload={load} />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminContractenPage;
