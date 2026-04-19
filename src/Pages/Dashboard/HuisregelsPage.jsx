import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import { FiFileText, FiEdit2, FiTrash2, FiSave, FiX, FiPlus } from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import StudentSidebar from "../../Components/StudentSidebar/StudentSidebar.jsx";
import { AdminSidebar } from "./AdminBetalingenMatrix.jsx";
import "./StudentDashboard.css";
import "./HuisregelsPage.css";
import "../../Styles/Global.css";

const STORAGE_KEY = "villa_huisregels_v1";

const DEFAULT_RULES = [
    { id: "gedrag", icon: "🤝", title: "Gedrag & Samenleven", color: "gold", items: [
        "Behandel elkaar met respect, ongeacht achtergrond, geslacht of overtuiging",
        "Gebruik gemeenschappelijke ruimtes op een manier die rekening houdt met anderen",
        "Houd de toon vriendelijk — conflicten bespreek je rustig, nooit via berichten of roddels",
    ]},
    { id: "rust", icon: "🔇", title: "Rust & Geluid", color: "purple", items: [
        "Geluidsstilte: 22:00 – 07:00",
        "Geen muziek, feestjes of geluidsoverlast na 22:00",
        "Overtreding wordt direct gemeld aan de beheerder",
    ]},
    { id: "bezoek", icon: "🚪", title: "Bezoek & Logees", color: "blue", items: [
        "Bezoek is welkom overdag",
        "Logeren is niet toegestaan zonder toestemming van de beheerder",
        "Elke overnachting zonder melding = overtreding van de huisregels",
    ]},
    { id: "schoonmaak", icon: "🧹", title: "Schoonmaak & Hygiëne", color: "green", items: [
        "Volg het schoonmaakrooster en voer taken tijdig uit",
        "Laat gedeelde ruimtes altijd netjes achter",
        "Afval scheiden: plastic · papier · rest · GFT",
        "Insecten, schimmel of stank door nalatigheid = bewoners verantwoordelijkheid",
    ]},
    { id: "veiligheid", icon: "🛡️", title: "Veiligheid", color: "red", items: [
        "Brandmelders aanwezig — test maandelijks",
        "Vluchtwegen & gangen te allen tijde vrij",
        "Alleen goedgekeurde elektrische apparaten",
        "Open vuur, kaarsen en roken verboden",
    ]},
    { id: "betalingen", icon: "💶", title: "Betalingen", color: "gold", items: [
        "Huurprijs: € 550 per maand incl. nutsvoorzieningen & internet",
        "Betaling vóór of op de 1e van de maand",
        "Geen aparte servicekosten of voorschotten",
    ]},
    { id: "onderhoud", icon: "🔧", title: "Onderhoud & Schade", color: "orange", items: [
        "Meld schade of defecten direct via de app of bij de beheerder",
        "Kleine schade door nalatigheid wordt verhaald op de huurder",
        "Houd je kamer in goede staat — inspectie kan plaatsvinden",
    ]},
    { id: "communicatie", icon: "📞", title: "Communicatie & Overlast", color: "dark", items: [
        "Vragen & meldingen via de app of telefonisch",
        "Noodsituaties: onmiddellijk telefonisch melden",
        "Herhaaldelijke overtredingen kunnen leiden tot beëindiging huurcontract",
    ]},
];

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

// ── Admin-bewerkbare sectie ──────────────────────────────────────────────
function RuleSection({ section, isAdmin, onUpdate, onDelete }) {
    const [editing,  setEditing]  = useState(false);
    const [title,    setTitle]    = useState(section.title);
    const [icon,     setIcon]     = useState(section.icon);
    const [items,    setItems]    = useState([...section.items]);
    const [newItem,  setNewItem]  = useState("");

    const save = () => {
        onUpdate({ ...section, title, icon, items });
        setEditing(false);
    };
    const cancel = () => {
        setTitle(section.title); setIcon(section.icon); setItems([...section.items]);
        setEditing(false);
    };
    const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));
    const addItem = () => {
        if (!newItem.trim()) return;
        setItems(prev => [...prev, newItem.trim()]);
        setNewItem("");
    };

    return (
        <section className={`huis-block huis-block--${section.color}`}>
            <div className="huis-block-header" style={{ justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {editing
                        ? <input value={icon} onChange={e => setIcon(e.target.value)} style={{ width: 40, fontSize: 20, background: "transparent", border: "none", textAlign: "center" }} />
                        : <span>{section.icon}</span>
                    }
                    {editing
                        ? <input value={title} onChange={e => setTitle(e.target.value)} style={{ fontSize: 16, fontWeight: 600, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "2px 8px", color: "#fff" }} />
                        : <h2>{section.title}</h2>
                    }
                </div>
                {isAdmin && !editing && (
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button type="button" onClick={() => setEditing(true)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#fff" }} title="Bewerken">
                            <FiEdit2 size={13} />
                        </button>
                        <button type="button" onClick={() => { if(window.confirm("Sectie verwijderen?")) onDelete(section.id); }} style={{ background: "rgba(239,68,68,0.25)", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#fca5a5" }} title="Verwijderen">
                            <FiTrash2 size={13} />
                        </button>
                    </div>
                )}
                {isAdmin && editing && (
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button type="button" onClick={save} style={{ background: "rgba(34,197,94,0.3)", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#86efac" }}><FiSave size={13} /> Opslaan</button>
                        <button type="button" onClick={cancel} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#fff" }}><FiX size={13} /></button>
                    </div>
                )}
            </div>
            <ul className="huis-list">
                {items.map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                        {editing
                            ? <>
                                <input value={item} onChange={e => setItems(prev => prev.map((x, idx) => idx === i ? e.target.value : x))} style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "3px 8px", color: "#fff", fontSize: 13 }} />
                                <button type="button" onClick={() => removeItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fca5a5" }}><FiTrash2 size={12} /></button>
                              </>
                            : <><span>▸</span><span>{item}</span></>
                        }
                    </li>
                ))}
            </ul>
            {editing && (
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <input
                        value={newItem}
                        onChange={e => setNewItem(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addItem()}
                        placeholder="Nieuw punt toevoegen…"
                        style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "4px 10px", color: "#fff", fontSize: 13 }}
                    />
                    <button type="button" onClick={addItem} style={{ background: "rgba(34,197,94,0.3)", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#86efac" }}><FiPlus size={13} /></button>
                </div>
            )}
        </section>
    );
}

export default function HuisregelsPage() {
    const { isLoggedIn, logout, user: authUser } = useAuth();
    const [contractFile, setContractFile] = useState(null);
    const isAdmin = hasRole(authUser, "ADMIN");

    // Load rules from localStorage or defaults
    const [rules, setRules] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : DEFAULT_RULES;
        } catch { return DEFAULT_RULES; }
    });

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    useEffect(() => {
        api.get("/api/users/me")
            .then(res => setContractFile(res.data.contractFile || null))
            .catch(() => {});
    }, []);

    const updateRule = (updated) => {
        const next = rules.map(r => r.id === updated.id ? updated : r);
        setRules(next);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
        // Also try to save to backend
        api.put(`/api/huisregels/${updated.id}`, updated).catch(() => {});
    };

    const deleteRule = (id) => {
        const next = rules.filter(r => r.id !== id);
        setRules(next);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
        api.delete(`/api/huisregels/${id}`).catch(() => {});
    };

    const addRule = () => {
        const newRule = { id: `regel_${Date.now()}`, icon: "📌", title: "Nieuwe sectie", color: "blue", items: ["Nieuw punt"] };
        const next = [...rules, newRule];
        setRules(next);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    };

    const sidebar = isAdmin
        ? <AdminSidebar active="huisregels" logout={logout} username={authUser?.username} />
        : <StudentSidebar user={authUser} logout={logout} active="huisregels" contractFile={contractFile} />;

    return (
        <>
            <Helmet>
                <title>Huisregels — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <DashboardLayout sidebar={sidebar} mainClass="huis-main">

                {/* Hero */}
                <div className="huis-hero">
                    <span className="huis-hero-icon">🏛️</span>
                    <div>
                        <strong>Huisregels Villa Vredestein 2025</strong>
                        <p>Rust · Verantwoordelijkheid · Respect — de basis van ons samenleven</p>
                    </div>
                </div>

                {/* Kernwaarden */}
                <div className="huis-values">
                    {["🤝 Respect","📚 Studie","🏠 Zorg","🌿 Rust"].map(v => {
                        const [icon, label] = v.split(" ");
                        return (
                            <div key={label} className="huis-value-tile">
                                <span>{icon}</span><strong>{label}</strong>
                            </div>
                        );
                    })}
                </div>

                {/* Dynamische regelblokken */}
                {rules.map(section => (
                    <RuleSection
                        key={section.id}
                        section={section}
                        isAdmin={isAdmin}
                        onUpdate={updateRule}
                        onDelete={deleteRule}
                    />
                ))}

                {/* Admin: sectie toevoegen */}
                {isAdmin && (
                    <button
                        type="button"
                        onClick={addRule}
                        className="dashboard-schema-btn"
                        style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
                    >
                        <FiPlus /> Sectie toevoegen
                    </button>
                )}

                <p className="huis-footer">
                    Villa Vredestein 2025 — Door in te trekken ga je akkoord met deze huisregels.
                </p>

            </DashboardLayout>
        </>
    );
}
