import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText, FiCalendar,
    FiUser, FiUsers, FiDollarSign, FiClipboard, FiShield, FiPhone,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import "./StudentDashboard.css";
import "./NoodlijstPage.css";
import "../../Styles/Global.css";

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

const NOODRUMMERS = [
    { situatie: "Brand / Ambulance / Politie",             nummer: "112",             opmerking: "Geef adres: Hoofdstraat 147, Villa Vredestein", icon: "🚨" },
    { situatie: "Huisartsenpost regio Utrechtse Heuvelrug", nummer: "0900-1515",       opmerking: "Buiten kantooruren",                            icon: "🏥" },
    { situatie: "Spoed tandarts Utrecht",                   nummer: "030-3037509",     opmerking: "Alleen bij acute pijn/trauma",                  icon: "🦷" },
    { situatie: "Maxim Staal (beheerder)",                  nummer: "+31 6 25015299",  opmerking: "24/7 bereikbaar",                               icon: "🏠" },
    { situatie: "Scholman Servicebedrijf (storingen)",      nummer: "030-6043073",     opmerking: "CV, verwarming, overstroming, lekkage",         icon: "🔧" },
    { situatie: "Manon Keeman (noodcontact)",               nummer: "+31 6 24766568",  opmerking: "24/7 bereikbaar",                               icon: "👤" },
];

export default function NoodlijstPage() {
    const { isLoggedIn, logout, user: authUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slow, setSlow]       = useState(false);

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    useEffect(() => {
        const t = setTimeout(() => setSlow(true), 4000);
        api.get("/api/users/me")
            .then(res => setProfile(res.data))
            .catch(() => setProfile({}))
            .finally(() => { clearTimeout(t); setSlow(false); setLoading(false); });
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="StudentDashboard">
            <Helmet>
                <title>Noodlijst — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <aside className="dashboard-sidebar" aria-label="Navigatie zijbalk">
                <header className="sidebar-profile">
                    <FiUser className="profile-icon" />
                </header>
                <h3 className="sidebar-title">{authUser?.username || "Vredesteiner"}</h3>
                <nav className="sidebar-nav">
                    <ul>
                        <li><Link to="/student"><FiHome /> Dashboard</Link></li>
                        <li><Link to="/student/profiel"><FiUser /> Mijn profiel</Link></li>
                        <li><Link to="/student/noodlijst" className="active"><FiAlertCircle /> Noodlijst</Link></li>
                        <li><Link to="#"><FiFileText /> Huisregels</Link></li>
                        <li><Link to="#"><FiClipboard /> Schoonmaakschema</Link></li>
                        <li><Link to="#"><FiDollarSign /> Betalingen</Link></li>
                        <li><Link to="#"><FiFileText /> Huurcontract</Link></li>
                        <li><Link to="#"><FiUsers /> Samen eten?</Link></li>
                        <li><Link to="#"><FiCalendar /> Events</Link></li>
                        {hasRole(authUser, "ADMIN") && (
                            <li><Link to="/admin" className="admin-link"><FiShield /> Admin Dashboard</Link></li>
                        )}
                        <li>
                            <button onClick={logout} type="button" className="logout-button">
                                <FiLogOut /> Log uit
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="dashboard-main">

                {/* Alert banner */}
                <div className="nood-alert">
                    🚨 Bij calamiteiten: blijf rustig, volg deze stappen en waarschuw direct de juiste persoon.
                </div>

                {/* 1. Noodnummers */}
                <section className="nood-section">
                    <h2 className="nood-section-title">1. Noodnummers</h2>
                    <div className="nood-table">
                        {NOODRUMMERS.map(({ situatie, nummer, opmerking, icon }) => (
                            <div key={nummer} className="nood-row">
                                <span className="nood-icon">{icon}</span>
                                <span className="nood-situatie">{situatie}</span>
                                <a href={`tel:${nummer.replace(/[^0-9+]/g, "")}`} className="nood-tel">
                                    <FiPhone /> {nummer}
                                </a>
                                <span className="nood-opmerking">{opmerking}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Persoonlijk noodnummer */}
                <section className="nood-section">
                    <h2 className="nood-section-title">Jouw noodnummer</h2>
                    {loading ? (
                        <p className="nood-loading">{slow ? "Server wordt opgestart… even geduld." : "Laden…"}</p>
                    ) : profile?.emergencyPhoneNumber ? (
                        <div className="nood-row">
                            <span className="nood-icon">👤</span>
                            <span className="nood-situatie">Jouw opgegeven noodnummer</span>
                            <a href={`tel:${profile.emergencyPhoneNumber.replace(/[^0-9+]/g, "")}`} className="nood-tel">
                                <FiPhone /> {profile.emergencyPhoneNumber}
                            </a>
                            <span className="nood-opmerking">
                                <Link to="/student/profiel">Wijzigen via profiel</Link>
                            </span>
                        </div>
                    ) : (
                        <p className="nood-empty">
                            Je hebt nog geen noodnummer ingesteld.{" "}
                            <Link to="/student/profiel">Voeg het toe via Mijn profiel →</Link>
                        </p>
                    )}
                </section>

                {/* 2. Brandveiligheid */}
                <section className="nood-section">
                    <h2 className="nood-section-title">2. Brandveiligheid</h2>
                    <ul className="nood-info-list">
                        <li>🧯 Blusmiddelen: brandblusser en branddeken in de keuken en op elke verdieping naast de trap.</li>
                        <li>🔔 Rookmelders: elke gang heeft een werkende rookmelder. Test maandelijks.</li>
                        <li>🚪 Nooduitgangen: via hoofdingang, achterdeur en noodtrap aan tuinzijde.</li>
                        <li>📍 Verzamelpunt: parkeerplaats bij de grote poort.</li>
                        <li>⚠️ Gasgeur? Geen lichtschakelaars gebruiken, ramen open, bel direct 112 en beheerder.</li>
                    </ul>
                </section>

                {/* 3. Stroom- en waterschade */}
                <section className="nood-section">
                    <h2 className="nood-section-title">3. Stroom- en waterschade</h2>
                    <ul className="nood-info-list">
                        <li>⚡ Controleer eerst de stroomkast (zekeringen en aardlekschakelaar — 1e verdieping).</li>
                        <li>💧 Bij waterlekkage: hoofdwaterkraan afsluiten (locatie: badkamer beneden in het gat).</li>
                        <li>📱 Meld altijd direct via WhatsApp aan de beheerder.</li>
                        <li>🔌 Gebruik geen elektrische apparaten bij vocht of overstroming.</li>
                    </ul>
                </section>

                {/* 4. Medische noodgevallen */}
                <section className="nood-section">
                    <h2 className="nood-section-title">4. Medische noodgevallen</h2>
                    <ul className="nood-info-list">
                        <li>🚨 Bel 112 bij levensgevaar of bewusteloosheid.</li>
                        <li>❤️ AED locatie: Dierenartspraktijk Hoofdstraat 123.</li>
                        <li>🩹 Kleine verwondingen: EHBO-koffer in de keuken.</li>
                        <li>📋 Meld elk ongeval aan de beheerder en noteer datum/tijd.</li>
                    </ul>
                </section>

                {/* 5. Toegang & Sleutels */}
                <section className="nood-section">
                    <h2 className="nood-section-title">5. Toegang & Sleutels</h2>
                    <ul className="nood-info-list">
                        <li>🔑 Toegang via sleutel + app (toegewezen bij contract).</li>
                        <li>📄 Je wordt toegevoegd en verwijderd zodra je contract start/eindigt.</li>
                        <li>🔒 Reservesleutel in vergrendeld kastje naast de zij-deur — code via beheerder.</li>
                        <li>🚫 Laat niemand binnen die je niet kent of die geen toestemming heeft.</li>
                    </ul>
                </section>

                {/* 6. Geluids- en nachtregels */}
                <section className="nood-section">
                    <h2 className="nood-section-title">6. Geluids- en nachtregels</h2>
                    <ul className="nood-info-list">
                        <li>🔇 Stilteperiode: 22:00 – 07:00 uur (geen muziek, harde stemmen of kletteren met deuren).</li>
                        <li>⚠️ Respecteer de rust van andere bewoners en buren; overtreding = officiële waarschuwing.</li>
                    </ul>
                </section>

                {/* 8. Overige informatie */}
                <section className="nood-section">
                    <h2 className="nood-section-title">7. Overige informatie</h2>
                    <ul className="nood-info-list">
                        <li>💊 Dichtstbijzijnde apotheek: Servicepunt De Bosrand – Traaij 2.</li>
                        <li>🏥 Dichtstbijzijnde ziekenhuis: Diakonessenhuis Zeist, Jagersingel 1.</li>
                    </ul>
                    <p className="nood-footer-text">
                        Villa Vredestein – Veiligheid is van ons allemaal. Blijf alert, handel rustig en gebruik je gezonde verstand.
                    </p>
                </section>

            </main>
        </div>
    );
}
