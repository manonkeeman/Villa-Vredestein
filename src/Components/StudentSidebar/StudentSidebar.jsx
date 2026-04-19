/**
 * Gedeelde student-sidebar — één bron voor alle student-pagina's.
 * Props:
 *   user        — authUser object
 *   logout      — logout functie
 *   active      — sleutelwoord voor actieve link:
 *                 "dashboard" | "profiel" | "noodlijst" | "huisregels" |
 *                 "schema"    | "betalingen" | "events" | "meldingen"
 *   contractFile — bestandsnaam van huurcontract (of null)
 */
import React from "react";
import { Link } from "react-router-dom";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText,
    FiUser, FiDollarSign, FiClipboard, FiShield,
    FiCalendar, FiTool,
} from "react-icons/fi";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

export default function StudentSidebar({ user, logout, active = "", contractFile = null }) {
    const cls = (key) => active === key ? "active-nav-link" : undefined;

    return (
        <aside className="dashboard-sidebar" aria-label="Navigatie zijbalk">
            <header className="sidebar-profile">
                <FiUser className="profile-icon" />
            </header>
            <h3 className="sidebar-title">Welkom {user?.username || "Vredesteiner"}</h3>
            <nav className="sidebar-nav">
                <ul>
                    <li><Link to="/student"             className={cls("dashboard")}><FiHome />         Dashboard</Link></li>
                    <li><Link to="/student/profiel"     className={cls("profiel")}><FiUser />           Mijn profiel</Link></li>
                    <li><Link to="/student/noodlijst"   className={cls("noodlijst")}><FiAlertCircle />  Noodlijst</Link></li>
                    <li><Link to="/student/huisregels"  className={cls("huisregels")}><FiFileText />    Huisregels</Link></li>
                    <li><Link to="/schoonmaakschema"    className={cls("schema")}><FiClipboard />       Schoonmaakschema</Link></li>
                    <li><Link to="/student/betalingen"  className={cls("betalingen")}><FiDollarSign /> Betalingen</Link></li>
                    {contractFile && (
                        <li>
                            <a
                                href={`${BASE_URL}/uploads/${encodeURIComponent(contractFile)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FiFileText /> Huurcontract
                            </a>
                        </li>
                    )}
                    <li><Link to="/student/events"    className={cls("events")}><FiCalendar />  Events &amp; Nieuws</Link></li>
                    <li><Link to="/student/meldingen" className={cls("meldingen")}><FiTool />   Iets melden</Link></li>

                    {hasRole(user, "ADMIN") && (
                        <li>
                            <Link to="/admin" className="admin-link">
                                <FiShield /> Admin Dashboard
                            </Link>
                        </li>
                    )}
                    <li>
                        <button onClick={logout} type="button" className="logout-button">
                            <FiLogOut /> Log uit
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
