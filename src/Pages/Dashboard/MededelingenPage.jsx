import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiRadio, FiTool, FiCalendar, FiRefreshCw,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import StudentSidebar from "../../Components/StudentSidebar/StudentSidebar.jsx";
import "./StudentDashboard.css";
import "./AdminCommunicatiePage.css";
import "../../Styles/Global.css";

const TYPE_META = {
    mededeling: { label: "Mededeling", icon: <FiRadio />,    cls: "comm-card--mededeling" },
    onderhoud:  { label: "Onderhoud",  icon: <FiTool />,     cls: "comm-card--onderhoud" },
    evenement:  { label: "Evenement",  icon: <FiCalendar />, cls: "comm-card--evenement" },
};

function AnnouncementCard({ ann }) {
    const meta = TYPE_META[ann.type] || TYPE_META.mededeling;
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
            </div>
        </article>
    );
}

const MededelingenPage = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const contractFile = user?.contractFile || null;

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/announcements");
            setAnnouncements(res.data || []);
        } catch {
            setAnnouncements([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = filter === "all"
        ? announcements
        : announcements.filter(a => a.type === filter);

    const sidebar = <StudentSidebar user={user} logout={logout} active="mededelingen" contractFile={contractFile} />;

    return (
        <DashboardLayout sidebar={sidebar} mainClass="admin-main">
            <Helmet>
                <title>Mededelingen — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="admin-page-header">
                <h1><FiRadio /> Mededelingen</h1>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={load}>
                    <FiRefreshCw /> Verversen
                </button>
            </div>

            <div className="admin-filter-tabs" style={{ marginBottom: "1.5rem" }}>
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

            <div className="admin-section">
                {loading && <p className="admin-loading">Laden…</p>}
                {!loading && filtered.length === 0 && (
                    <p className="admin-empty">Geen mededelingen gevonden.</p>
                )}
                <div className="comm-grid">
                    {filtered.map(a => <AnnouncementCard key={a.id} ann={a} />)}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MededelingenPage;