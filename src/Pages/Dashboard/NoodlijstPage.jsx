import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import { FiAlertCircle, FiPhone, FiEdit2, FiTrash2, FiSave, FiX, FiPlus } from "react-icons/fi";
import DashboardLayout from "./DashboardLayout.jsx";
import StudentSidebar from "../../Components/StudentSidebar/StudentSidebar.jsx";
import { AdminSidebar } from "./AdminBetalingenMatrix.jsx";
import "./StudentDashboard.css";
import "./NoodlijstPage.css";
import "../../Styles/Global.css";

const NOOD_KEY = "villa_noodcontacten_v1";

const DEFAULT_CONTACTS = [
    { id: 1, label: "Huisartsenpost",          sub: "Buiten kantooruren",         num: "0900-1515",       icon: "🏥" },
    { id: 2, label: "Spoed tandarts",           sub: "Acute pijn / trauma",        num: "030-3037509",     icon: "🦷" },
    { id: 3, label: "Maxim Staal",              sub: "Beheerder · 24/7",           num: "+31 6 25015299",  icon: "🏠" },
    { id: 4, label: "Scholman Servicebedrijf",  sub: "CV · Water · Lekkage",       num: "030-6043073",     icon: "🔧" },
    { id: 5, label: "Manon Keeman",             sub: "Noodcontact · 24/7",         num: "+31 6 24766568",  icon: "👤" },
];

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

export default function NoodlijstPage() {
    const { isLoggedIn, logout, user: authUser } = useAuth();
    const isAdmin = hasRole(authUser, "ADMIN");
    const profile = authUser;

    const [contacts, setContacts] = useState(() => {
        try { const s = localStorage.getItem(NOOD_KEY); return s ? JSON.parse(s) : DEFAULT_CONTACTS; }
        catch { return DEFAULT_CONTACTS; }
    });
    const [editId,   setEditId]   = useState(null);
    const [editData, setEditData] = useState({});

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const saveContacts = (next) => {
        setContacts(next);
        try { localStorage.setItem(NOOD_KEY, JSON.stringify(next)); } catch {}
    };
    const startEdit = (c) => { setEditId(c.id); setEditData({ ...c }); };
    const cancelEdit = () => setEditId(null);
    const saveEdit = () => {
        saveContacts(contacts.map(c => c.id === editId ? editData : c));
        setEditId(null);
    };
    const deleteContact = (id) => {
        if (!window.confirm("Contact verwijderen?")) return;
        saveContacts(contacts.filter(c => c.id !== id));
    };
    const addContact = () => {
        const newC = { id: Date.now(), label: "Nieuw contact", sub: "Omschrijving", num: "000", icon: "📞" };
        const next = [...contacts, newC];
        saveContacts(next);
        setEditId(newC.id); setEditData({ ...newC });
    };

    return (
        <>
            <Helmet>
                <title>Noodlijst — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <DashboardLayout sidebar={
                isAdmin
                    ? <AdminSidebar active="noodlijst" logout={logout} username={authUser?.username} />
                    : <StudentSidebar user={authUser} logout={logout} active="noodlijst" contractFile={profile?.contractFile} />
            } mainClass="nood-main">

                {/* Hero alert */}
                <div className="nood-hero">
                    <span className="nood-hero-icon">🚨</span>
                    <div>
                        <strong>Bij calamiteiten</strong>
                        <p>Blijf rustig · Volg deze stappen · Waarschuw direct de juiste persoon</p>
                    </div>
                </div>

                {/* ── 1. NOODNUMMERS ── */}
                <section className="nood-block nood-block--red">
                    <div className="nood-block-header">
                        <span className="nood-block-icon">📞</span>
                        <h2>Noodnummers</h2>
                        <span className="nood-block-sub">Altijd bellen bij direct gevaar</span>
                    </div>

                    {/* 112 hero card */}
                    <a href="tel:112" className="nood-sos-card">
                        <span className="nood-sos-label">Brand · Ambulance · Politie</span>
                        <span className="nood-sos-number">112</span>
                        <span className="nood-sos-hint">Hoofdstraat 147, Villa Vredestein</span>
                    </a>

                    {/* overige nummers */}
                    <div className="nood-num-grid">
                        {contacts.map((c) => editId === c.id ? (
                            <div key={c.id} className="nood-num-card" style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                <input value={editData.icon} onChange={e => setEditData(p => ({...p, icon: e.target.value}))} style={{ width: 40, fontSize: 18, background: "transparent", border: "none", textAlign: "center" }} />
                                <input value={editData.label} onChange={e => setEditData(p => ({...p, label: e.target.value}))} placeholder="Naam" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 5, padding: "3px 6px", color: "#fff", fontSize: 13 }} />
                                <input value={editData.sub} onChange={e => setEditData(p => ({...p, sub: e.target.value}))} placeholder="Omschrijving" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 5, padding: "3px 6px", color: "#ccc", fontSize: 12 }} />
                                <input value={editData.num} onChange={e => setEditData(p => ({...p, num: e.target.value}))} placeholder="Nummer" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 5, padding: "3px 6px", color: "#fff", fontSize: 13 }} />
                                <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.3rem" }}>
                                    <button type="button" onClick={saveEdit} style={{ flex: 1, background: "rgba(34,197,94,0.3)", border: "none", borderRadius: 5, padding: "4px", cursor: "pointer", color: "#86efac" }}><FiSave size={12} /></button>
                                    <button type="button" onClick={cancelEdit} style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 5, padding: "4px", cursor: "pointer", color: "#fff" }}><FiX size={12} /></button>
                                </div>
                            </div>
                        ) : (
                            <div key={c.id} style={{ position: "relative" }}>
                                <a href={`tel:${c.num.replace(/[^0-9+]/g, "")}`} className="nood-num-card">
                                    <span className="nood-num-icon">{c.icon}</span>
                                    <span className="nood-num-label">{c.label}</span>
                                    <span className="nood-num-sub">{c.sub}</span>
                                    <span className="nood-num-number"><FiPhone /> {c.num}</span>
                                </a>
                                {isAdmin && (
                                    <div style={{ position: "absolute", top: 6, right: 6, display: "flex", gap: "0.2rem" }}>
                                        <button type="button" onClick={() => startEdit(c)} style={{ background: "rgba(0,0,0,0.5)", border: "none", borderRadius: 4, padding: "3px 5px", cursor: "pointer", color: "#fff" }}><FiEdit2 size={11} /></button>
                                        <button type="button" onClick={() => deleteContact(c.id)} style={{ background: "rgba(239,68,68,0.4)", border: "none", borderRadius: 4, padding: "3px 5px", cursor: "pointer", color: "#fff" }}><FiTrash2 size={11} /></button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Persoonlijk noodnummer */}
                        {false ? (
                            <div className="nood-num-card nood-num-card--personal">
                                <span className="nood-num-icon">👤</span>
                                <span className="nood-num-label">Jouw noodnummer</span>
                                <span className="nood-num-sub">Laden…</span>
                            </div>
                        ) : profile?.emergencyPhoneNumber ? (
                            <a href={`tel:${profile.emergencyPhoneNumber.replace(/[^0-9+]/g, "")}`} className="nood-num-card nood-num-card--personal">
                                <span className="nood-num-icon">🆘</span>
                                <span className="nood-num-label">Jouw noodnummer</span>
                                <span className="nood-num-sub"><Link to="/student/profiel" onClick={e => e.stopPropagation()}>Wijzigen</Link></span>
                                <span className="nood-num-number"><FiPhone /> {profile.emergencyPhoneNumber}</span>
                            </a>
                        ) : (
                            <Link to="/student/profiel" className="nood-num-card nood-num-card--empty">
                                <span className="nood-num-icon">➕</span>
                                <span className="nood-num-label">Jouw noodnummer</span>
                                <span className="nood-num-sub">Nog niet ingesteld</span>
                                <span className="nood-num-number">Toevoegen via profiel →</span>
                            </Link>
                        )}
                    </div>
                    {isAdmin && (
                        <button type="button" onClick={addContact} className="dashboard-schema-btn" style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <FiPlus /> Contact toevoegen
                        </button>
                    )}
                </section>

                {/* ── 2 + 3. BRAND & WATER (2-koloms) ── */}
                <div className="nood-two-col">
                    <section className="nood-block nood-block--orange">
                        <div className="nood-block-header">
                            <span className="nood-block-icon">🔥</span>
                            <h2>Brandveiligheid</h2>
                        </div>
                        <ul className="nood-icon-list">
                            <li><span>🧯</span><span>Blusser & deken in keuken + elke verdieping naast de trap</span></li>
                            <li><span>🔔</span><span>Rookmelders in elke gang — test maandelijks</span></li>
                            <li><span>🚪</span><span>Nooduitgangen: hoofdingang, achterdeur, noodtrap tuinzijde</span></li>
                            <li><span>📍</span><span>Verzamelpunt: parkeerplaats bij de grote poort</span></li>
                            <li><span>⚠️</span><span>Gasgeur? Geen licht · ramen open · bel 112 + beheerder</span></li>
                        </ul>
                    </section>

                    <section className="nood-block nood-block--blue">
                        <div className="nood-block-header">
                            <span className="nood-block-icon">💧</span>
                            <h2>Stroom & Water</h2>
                        </div>
                        <ul className="nood-icon-list">
                            <li><span>⚡</span><span>Stroomkast: zekeringen & aardlek — 1e verdieping</span></li>
                            <li><span>🚿</span><span>Hoofdwaterkraan afsluiten: badkamer beneden in het gat</span></li>
                            <li><span>📱</span><span>Meld direct via WhatsApp aan beheerder</span></li>
                            <li><span>🔌</span><span>Geen elektrische apparaten bij vocht of overstroming</span></li>
                        </ul>
                    </section>
                </div>

                {/* ── 4. MEDISCH ── */}
                <section className="nood-block nood-block--green">
                    <div className="nood-block-header">
                        <span className="nood-block-icon">❤️</span>
                        <h2>Medische noodgevallen</h2>
                    </div>
                    <div className="nood-steps">
                        {[
                            { step: "1", icon: "🚨", text: "Bel 112 bij levensgevaar of bewusteloosheid" },
                            { step: "2", icon: "❤️", text: "AED: Dierenartspraktijk Hoofdstraat 123" },
                            { step: "3", icon: "🩹", text: "EHBO-koffer: keuken" },
                            { step: "4", icon: "📋", text: "Meld aan beheerder · noteer datum & tijd" },
                        ].map(({ step, icon, text }) => (
                            <div key={step} className="nood-step">
                                <span className="nood-step-num">{step}</span>
                                <span className="nood-step-icon">{icon}</span>
                                <span className="nood-step-text">{text}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 5 + 6. TOEGANG & NACHT (2-koloms) ── */}
                <div className="nood-two-col">
                    <section className="nood-block nood-block--yellow">
                        <div className="nood-block-header">
                            <span className="nood-block-icon">🔑</span>
                            <h2>Toegang & Sleutels</h2>
                        </div>
                        <ul className="nood-icon-list">
                            <li><span>🔑</span><span>Toegang via sleutel + app (bij contract)</span></li>
                            <li><span>📄</span><span>Account start & eindigt met je contract</span></li>
                            <li><span>🔒</span><span>Reservesleutel: kastje naast zij-deur · code via beheerder</span></li>
                            <li><span>🚫</span><span>Laat niemand binnen zonder toestemming</span></li>
                        </ul>
                    </section>

                    <section className="nood-block nood-block--purple">
                        <div className="nood-block-header">
                            <span className="nood-block-icon">🔇</span>
                            <h2>Nachtregels</h2>
                        </div>
                        <ul className="nood-icon-list">
                            <li><span>🌙</span><span>Stilteperiode: <strong>22:00 – 07:00</strong></span></li>
                            <li><span>🎵</span><span>Geen muziek · harde stemmen · deuren klapperen</span></li>
                            <li><span>⚠️</span><span>Overtreding = officiële waarschuwing</span></li>
                        </ul>
                    </section>
                </div>

                {/* ── 7. NOODCHECKLIJST ── */}
                <section className="nood-block nood-block--gray">
                    <div className="nood-block-header">
                        <span className="nood-block-icon">✅</span>
                        <h2>Noodchecklijst <span className="nood-badge">maandelijks · beheerder</span></h2>
                    </div>
                    <div className="nood-checklist-grid">
                        {[
                            { icon: "🔔", label: "Rookmelders werken" },
                            { icon: "🧯", label: "Blusdeken aanwezig" },
                            { icon: "🩹", label: "EHBO-koffer compleet" },
                            { icon: "🚪", label: "Vluchtroute vrij" },
                            { icon: "💡", label: "Noodverlichting werkt" },
                        ].map(({ icon, label }) => (
                            <div key={label} className="nood-check-tile">
                                <span className="nood-check-tile-icon">{icon}</span>
                                <span className="nood-check-tile-label">{label}</span>
                                <span className="nood-check-tile-mark">✓</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 8. OVERIG ── */}
                <section className="nood-block nood-block--dark">
                    <div className="nood-block-header">
                        <span className="nood-block-icon">📍</span>
                        <h2>Overige informatie</h2>
                    </div>
                    <div className="nood-location-cards">
                        <div className="nood-loc-card">
                            <span>💊</span>
                            <div>
                                <strong>Apotheek</strong>
                                <p>Servicepunt De Bosrand – Traaij 2</p>
                            </div>
                        </div>
                        <div className="nood-loc-card">
                            <span>🏥</span>
                            <div>
                                <strong>Ziekenhuis</strong>
                                <p>Diakonessenhuis Zeist – Jagersingel 1</p>
                            </div>
                        </div>
                    </div>
                    <p className="nood-footer-text">
                        Villa Vredestein – Veiligheid is van ons allemaal. Blijf alert, handel rustig en gebruik je gezonde verstand.
                    </p>
                </section>

            </DashboardLayout>
        </>
    );
}
