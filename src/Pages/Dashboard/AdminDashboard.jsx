import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiUsers, FiDollarSign, FiFileText, FiClipboard, FiPlus,
    FiShield, FiMessageSquare, FiGrid,
    FiAlertTriangle, FiCheckCircle, FiClock, FiCalendar,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import { AdminSidebar } from "./AdminBetalingenMatrix.jsx";
import "./StudentDashboard.css";
import "./AdminPages.css";
import "../../Styles/Global.css";

const AdminDashboard = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const [stats, setStats] = useState({
        totalStudents: 4,
        openInvoices: 2,
        overdueInvoices: 1,
        openTickets: 2,
        expiringContracts: 1,
    });

    useEffect(() => {
        // Try to fetch real stats; silently use defaults on failure
        Promise.allSettled([
            api.get("/api/invoices"),
            api.get("/api/tickets"),
            api.get("/api/users"),
        ]).then(([inv, tick, users]) => {
            const invoices = inv.status === "fulfilled" ? (inv.value.data || []) : [];
            const tickets  = tick.status === "fulfilled" ? (tick.value.data || []) : [];
            const tenants  = users.status === "fulfilled"
                ? (users.value.data || []).filter(u => (u.roles||[]).includes("ROLE_STUDENT"))
                : [];

            const now = new Date();
            setStats({
                totalStudents:     tenants.length || 4,
                openInvoices:      invoices.filter(i => i.status === "OPEN").length,
                overdueInvoices:   invoices.filter(i => i.status === "OVERDUE").length,
                openTickets:       tickets.filter(t => t.status === "OPEN").length,
                expiringContracts: tenants.filter(t => {
                    if (!t.contractEnd) return false;
                    const d = Math.ceil((new Date(t.contractEnd) - now) / 86_400_000);
                    return d <= 90 && d > 0;
                }).length,
            });
        });
    }, []);

    const sidebar = <AdminSidebar active="" logout={logout} username={user?.username} />;

    return (
        <DashboardLayout sidebar={sidebar} mainClass="dashboard-grid">
            <Helmet>
                <title>Beheer — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Welcome card */}
            <article className="dash-card dash-card--gold dash-card--wide">
                <h2><FiShield /> Beheerdersomgeving</h2>
                <p>Overzicht van alle activiteiten in Villa Vredestein. Beheer bewoners, betalingen, contracten en meer.</p>
            </article>

            {/* Bewoners */}
            <article className="dash-card dash-card--blue">
                <h2><FiUsers /> Bewoners</h2>
                <p style={{ fontSize: 13, color: "#aaa", marginBottom: "0.5rem" }}>
                    {stats.totalStudents} actieve bewoner{stats.totalStudents !== 1 ? "s" : ""}
                </p>
                <div className="dashboard-cleaning-meta">
                    <Link to="/admin/bewoners" className="dashboard-schema-btn">
                        <FiPlus /> Bewoners beheren
                    </Link>
                </div>
            </article>

            {/* Betaal-matrix */}
            <article className={`dash-card ${stats.overdueInvoices > 0 ? "dash-card--red" : stats.openInvoices > 0 ? "dash-card--yellow" : "dash-card--green"}`}>
                <h2><FiGrid /> Betaal-matrix</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "0.5rem" }}>
                    {stats.overdueInvoices > 0 && (
                        <span style={{ fontSize: 13, color: "#ef4444", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <FiAlertTriangle /> {stats.overdueInvoices} verlopen betaling{stats.overdueInvoices !== 1 ? "en" : ""}
                        </span>
                    )}
                    {stats.openInvoices > 0 && (
                        <span style={{ fontSize: 13, color: "#f59e0b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <FiClock /> {stats.openInvoices} open factuur{stats.openInvoices !== 1 ? "en" : ""}
                        </span>
                    )}
                    {stats.overdueInvoices === 0 && stats.openInvoices === 0 && (
                        <span style={{ fontSize: 13, color: "#22c55e", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <FiCheckCircle /> Alle betalingen in orde
                        </span>
                    )}
                </div>
                <div className="dashboard-cleaning-meta">
                    <Link to="/admin/betalingen" className="dashboard-schema-btn">
                        <FiGrid /> Betalingen &amp; matrix
                    </Link>
                </div>
            </article>

            {/* Contracten */}
            <article className={`dash-card ${stats.expiringContracts > 0 ? "dash-card--orange" : "dash-card--green"}`}>
                <h2><FiFileText /> Contracten</h2>
                <p style={{ fontSize: 13, color: "#aaa", marginBottom: "0.5rem" }}>
                    {stats.expiringContracts > 0
                        ? <span style={{ color: "#f97316" }}><FiAlertTriangle /> {stats.expiringContracts} contract{stats.expiringContracts !== 1 ? "en" : ""} verloopt binnenkort</span>
                        : <span style={{ color: "#22c55e" }}><FiCheckCircle /> Alle contracten actueel</span>
                    }
                </p>
                <div className="dashboard-cleaning-meta">
                    <Link to="/admin/contracten" className="dashboard-schema-btn">
                        <FiFileText /> Contract-dashboard
                    </Link>
                </div>
            </article>

            {/* Berichten & Meldingen */}
            <article className="dash-card dash-card--purple">
                <h2><FiMessageSquare /> Berichten &amp; Meldingen</h2>
                <p style={{ fontSize: 13, color: "#aaa", marginBottom: "0.5rem" }}>
                    Stuur mededelingen naar bewoners en beheer openstaande meldingen.
                </p>
                <div className="dashboard-cleaning-meta">
                    <Link to="/admin/berichten" className="dashboard-schema-btn">
                        <FiMessageSquare /> Berichten &amp; Meldingen
                    </Link>
                </div>
            </article>

            {/* Schoonmaak */}
            <article className="dash-card dash-card--blue">
                <h2><FiClipboard /> Schoonmaakschema</h2>
                <p style={{ fontSize: 13, color: "#aaa", marginBottom: "0.5rem" }}>
                    Beheer taken, rooster en voltooiingen voor alle bewoners.
                </p>
                <div className="dashboard-cleaning-meta">
                    <Link to="/schoonmaakschema" className="dashboard-schema-btn">
                        <FiClipboard /> Bekijk schema
                    </Link>
                </div>
            </article>

            {/* Events & Nieuws */}
            <article className="dash-card dash-card--gold">
                <h2><FiCalendar /> Events & Nieuws</h2>
                <p style={{ fontSize: 13, color: "#aaa", marginBottom: "0.5rem" }}>
                    Bekijk en beheer aankomende events en nieuwsberichten voor de bewoners.
                </p>
                <div className="dashboard-cleaning-meta">
                    <Link to="/student/events" className="dashboard-schema-btn">
                        <FiCalendar /> Events bekijken
                    </Link>
                </div>
            </article>

        </DashboardLayout>
    );
};

export default AdminDashboard;
