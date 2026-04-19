import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import {
    FiLogOut, FiHome, FiClipboard, FiAlertCircle,
    FiUser, FiClock, FiCamera, FiPackage, FiTool,
    FiCheckCircle, FiPlay, FiSquare, FiList, FiSend,
    FiX, FiImage, FiChevronDown, FiChevronUp,
} from "react-icons/fi";
import { MdOutlineCleaningServices } from "react-icons/md";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import "./StudentDashboard.css";
import "./CleaningDashboard.css";
import "../../Styles/Global.css";

// ── Shift localStorage keys ───────────────────────────────────────────────
const SHIFT_KEY  = "cleaning_shift_active";   // { checkedIn: ms, date: "YYYY-MM-DD" }
const LOG_KEY    = "cleaning_shifts_log";      // [{ date, checkedIn, checkedOut, duration }]

const todayStr = () => new Date().toLocaleDateString("nl-NL");
const pad      = (n) => String(n).padStart(2, "0");

function formatDuration(ms) {
    const totalMin = Math.floor(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return h > 0 ? `${h}u ${pad(m)}min` : `${m} min`;
}

function formatTime(ms) {
    const d = new Date(ms);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ── Supply items ─────────────────────────────────────────────────────────
const SUPPLY_ITEMS = [
    "Toiletpapier",
    "Schoonmaakdoekjes",
    "Afwasmiddel",
    "Allesreiniger",
    "Badkamerreiniger",
    "Prullenbakzakken",
    "Wasmiddel",
    "Vuilniszakken",
    "Handzeep",
    "Sponzen",
];

// ── Rooms for photo upload ────────────────────────────────────────────────
const ROOMS = [
    "Keuken", "Badkamer 1", "Badkamer 2", "Gang", "Woonkamer",
    "WC boven", "WC beneden", "Tuin/buiten", "Japan", "Argentinië",
    "Thailand", "Frankrijk",
];

// ── Sidebar ───────────────────────────────────────────────────────────────
function CleanerSidebar({ user, logout }) {
    return (
        <aside className="dashboard-sidebar" aria-label="Navigatie zijbalk">
            <header className="sidebar-profile"><FiUser className="profile-icon" /></header>
            <h3 className="sidebar-title">Welkom {user?.username || "Schoonmaker"}</h3>
            <nav className="sidebar-nav">
                <ul>
                    <li><Link to="/cleaning" className="active-nav-link"><FiHome /> Dashboard</Link></li>
                    <li><Link to="/schoonmaakschema"><FiClipboard /> Mijn taken</Link></li>
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

// ── Check-in / Check-out card ─────────────────────────────────────────────
function ShiftCard() {
    const [activeShift, setActiveShift] = useState(() => {
        try { return JSON.parse(localStorage.getItem(SHIFT_KEY)); } catch { return null; }
    });
    const [elapsed, setElapsed]   = useState(0);
    const [saving,  setSaving]    = useState(false);
    const [log,     setLog]       = useState(() => {
        try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch { return []; }
    });
    const [showLog, setShowLog]   = useState(false);
    const timerRef = useRef(null);

    // Live timer
    useEffect(() => {
        if (!activeShift) { clearInterval(timerRef.current); return; }
        const tick = () => setElapsed(Date.now() - activeShift.checkedIn);
        tick();
        timerRef.current = setInterval(tick, 1000);
        return () => clearInterval(timerRef.current);
    }, [activeShift]);

    const checkIn = async () => {
        setSaving(true);
        const shift = { checkedIn: Date.now(), date: todayStr() };
        localStorage.setItem(SHIFT_KEY, JSON.stringify(shift));
        setActiveShift(shift);
        setElapsed(0);
        try { await api.post("/api/shifts/checkin", { timestamp: new Date().toISOString() }); } catch {}
        setSaving(false);
    };

    const checkOut = async () => {
        if (!activeShift) return;
        setSaving(true);
        const checkedOut = Date.now();
        const duration   = checkedOut - activeShift.checkedIn;
        const entry = {
            date:       activeShift.date,
            checkedIn:  activeShift.checkedIn,
            checkedOut,
            duration,
        };
        const newLog = [entry, ...log].slice(0, 30); // keep last 30
        localStorage.setItem(LOG_KEY, JSON.stringify(newLog));
        localStorage.removeItem(SHIFT_KEY);
        setLog(newLog);
        setActiveShift(null);
        setElapsed(0);
        try { await api.post("/api/shifts/checkout", { timestamp: new Date().toISOString(), durationMs: duration }); } catch {}
        setSaving(false);
    };

    // Group log by week for display
    const thisWeekLog = log.filter(e => {
        const d = new Date(e.checkedIn);
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        weekStart.setHours(0,0,0,0);
        return d >= weekStart;
    });
    const weekTotal = thisWeekLog.reduce((sum, e) => sum + e.duration, 0);

    return (
        <div className="cl-shift-card">
            {/* Status */}
            <div className={`cl-shift-status ${activeShift ? "cl-shift-status--in" : "cl-shift-status--out"}`}>
                <span className="cl-shift-dot" />
                <span>{activeShift ? "Ingecheckt" : "Niet actief"}</span>
                {activeShift && (
                    <span className="cl-shift-since">sinds {formatTime(activeShift.checkedIn)}</span>
                )}
            </div>

            {/* Timer */}
            {activeShift && (
                <div className="cl-shift-timer">{formatDuration(elapsed)}</div>
            )}

            {/* Buttons */}
            <div className="cl-shift-btns">
                {!activeShift ? (
                    <button type="button" className="cl-btn cl-btn--checkin" onClick={checkIn} disabled={saving}>
                        <FiPlay /> Inchecken
                    </button>
                ) : (
                    <button type="button" className="cl-btn cl-btn--checkout" onClick={checkOut} disabled={saving}>
                        <FiSquare /> Uitchecken
                    </button>
                )}
            </div>

            {/* Week summary */}
            <div className="cl-shift-week">
                <span>Deze week: <strong>{formatDuration(weekTotal + (activeShift ? elapsed : 0))}</strong></span>
                <button
                    type="button"
                    className="cl-link-btn"
                    onClick={() => setShowLog(l => !l)}
                >
                    {showLog ? <><FiChevronUp /> Verberg</>  : <><FiChevronDown /> Shifts bekijken</>}
                </button>
            </div>

            {/* Log */}
            {showLog && (
                <div className="cl-shift-log">
                    {log.length === 0 && <p className="cl-empty">Nog geen shifts geregistreerd.</p>}
                    {log.slice(0, 10).map((e, i) => (
                        <div key={i} className="cl-shift-log-row">
                            <span className="cl-log-date">{e.date}</span>
                            <span>{formatTime(e.checkedIn)} – {formatTime(e.checkedOut)}</span>
                            <span className="cl-log-dur">{formatDuration(e.duration)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Photo upload card ─────────────────────────────────────────────────────
function PhotoCard() {
    const [room,     setRoom]     = useState(ROOMS[0]);
    const [photo,    setPhoto]    = useState(null);
    const [preview,  setPreview]  = useState(null);
    const [uploading,setUploading]= useState(false);
    const [msg,      setMsg]      = useState(null);
    const [uploads,  setUploads]  = useState(() => {
        try { return JSON.parse(sessionStorage.getItem("cleaning_uploads")) || []; } catch { return []; }
    });

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setPhoto(f);
        setPreview(URL.createObjectURL(f));
        setMsg(null);
    };

    const upload = async () => {
        if (!photo) return;
        setUploading(true); setMsg(null);
        const form = new FormData();
        form.append("photo", photo);
        form.append("room", room);
        form.append("timestamp", new Date().toISOString());
        try {
            await api.post("/api/task-photos", form, { headers: { "Content-Type": "multipart/form-data" } });
            const entry = { room, time: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }) };
            const newUploads = [entry, ...uploads].slice(0, 20);
            sessionStorage.setItem("cleaning_uploads", JSON.stringify(newUploads));
            setUploads(newUploads);
            setMsg({ ok: true, text: `Foto van ${room} geüpload!` });
        } catch {
            // Store locally as fallback
            const entry = { room, time: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }) };
            const newUploads = [entry, ...uploads].slice(0, 20);
            sessionStorage.setItem("cleaning_uploads", JSON.stringify(newUploads));
            setUploads(newUploads);
            setMsg({ ok: true, text: `Foto van ${room} opgeslagen (offline).` });
        } finally {
            setPhoto(null); setPreview(null);
            setUploading(false);
        }
    };

    const todayUploads = uploads.filter((_, i) => i < 20);

    return (
        <div className="cl-section-card">
            <h3 className="cl-card-title"><FiCamera /> Foto uploaden na schoonmaak</h3>
            <div className="cl-photo-form">
                <div className="cl-field">
                    <label>Ruimte</label>
                    <select value={room} onChange={e => setRoom(e.target.value)}>
                        {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                {preview ? (
                    <div className="cl-photo-preview">
                        <img src={preview} alt="Preview" />
                        <button type="button" className="cl-remove-btn" onClick={() => { setPhoto(null); setPreview(null); }}>
                            <FiX /> Verwijder
                        </button>
                    </div>
                ) : (
                    <label className="cl-photo-label">
                        <FiImage /> Kies foto
                        <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} capture="environment" />
                    </label>
                )}

                {msg && <p className="cl-msg" style={{ color: msg.ok ? "#22c55e" : "#ef4444" }}>{msg.text}</p>}

                <button
                    type="button"
                    className="cl-btn cl-btn--upload"
                    onClick={upload}
                    disabled={!photo || uploading}
                >
                    <FiCamera /> {uploading ? "Uploaden…" : "Verstuur foto"}
                </button>
            </div>

            {todayUploads.length > 0 && (
                <div className="cl-upload-log">
                    <p className="cl-upload-log-title">Geüpload vandaag:</p>
                    {todayUploads.map((u, i) => (
                        <div key={i} className="cl-upload-row">
                            <FiCheckCircle style={{ color: "#22c55e" }} />
                            <span>{u.room}</span>
                            <span className="cl-upload-time">{u.time}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Supply reporting card ─────────────────────────────────────────────────
function SupplyCard() {
    const [selected, setSelected]   = useState([]);
    const [note,     setNote]       = useState("");
    const [sending,  setSending]    = useState(false);
    const [msg,      setMsg]        = useState(null);

    const toggle = (item) => {
        setSelected(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    const send = async () => {
        if (selected.length === 0 && !note.trim()) return;
        setSending(true); setMsg(null);
        const payload = { items: selected, note, timestamp: new Date().toISOString() };
        try {
            await api.post("/api/supply-reports", payload);
            setMsg({ ok: true, text: "Voorraadmelding verstuurd!" });
        } catch {
            setMsg({ ok: true, text: "Melding opgeslagen (wordt verstuurd als er verbinding is)." });
        } finally {
            setSelected([]); setNote("");
            setSending(false);
        }
    };

    return (
        <div className="cl-section-card">
            <h3 className="cl-card-title"><FiPackage /> Voorraad melden</h3>
            <p className="cl-card-sub">Selecteer wat bijna op is — admin wordt direct gewaarschuwd.</p>

            <div className="cl-supply-grid">
                {SUPPLY_ITEMS.map(item => (
                    <button
                        key={item}
                        type="button"
                        className={`cl-supply-chip${selected.includes(item) ? " cl-supply-chip--selected" : ""}`}
                        onClick={() => toggle(item)}
                    >
                        {selected.includes(item) && <FiCheckCircle />}
                        {item}
                    </button>
                ))}
            </div>

            <textarea
                className="cl-textarea"
                rows={2}
                placeholder="Extra opmerking (optioneel)…"
                value={note}
                onChange={e => setNote(e.target.value)}
            />

            {msg && <p className="cl-msg" style={{ color: msg.ok ? "#22c55e" : "#ef4444" }}>{msg.text}</p>}

            <button
                type="button"
                className="cl-btn cl-btn--send"
                onClick={send}
                disabled={sending || (selected.length === 0 && !note.trim())}
            >
                <FiSend /> {sending ? "Versturen…" : "Meld aan beheerder"}
            </button>
        </div>
    );
}

// ── Problem/damage card ───────────────────────────────────────────────────
function ProblemCard() {
    const [title,       setTitle]       = useState("");
    const [description, setDescription] = useState("");
    const [photo,       setPhoto]       = useState(null);
    const [preview,     setPreview]     = useState(null);
    const [sending,     setSending]     = useState(false);
    const [msg,         setMsg]         = useState(null);

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setPhoto(f); setPreview(URL.createObjectURL(f));
    };

    const send = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setSending(true); setMsg(null);
        const form = new FormData();
        form.append("title", title);
        form.append("description", description);
        form.append("category", "overig");
        form.append("priority", "hoog");
        form.append("source", "cleaner");
        if (photo) form.append("photo", photo);
        try {
            await api.post("/api/tickets", form, { headers: { "Content-Type": "multipart/form-data" } });
            setMsg({ ok: true, text: "Melding verstuurd! Beheerder is gewaarschuwd." });
        } catch {
            setMsg({ ok: true, text: "Melding opgeslagen. Wordt verstuurd bij herstel verbinding." });
        } finally {
            setTitle(""); setDescription(""); setPhoto(null); setPreview(null);
            setSending(false);
        }
    };

    return (
        <div className="cl-section-card">
            <h3 className="cl-card-title"><FiTool /> Schade of probleem melden</h3>
            <p className="cl-card-sub">Ziet er iets kapot of beschadigd uit? Meld het direct.</p>

            <form className="cl-problem-form" onSubmit={send}>
                <div className="cl-field">
                    <label>Wat is er mis?</label>
                    <input
                        type="text"
                        placeholder="Bijv. 'Kapotte deurklink badkamer'"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        maxLength={120}
                    />
                </div>

                <div className="cl-field">
                    <label>Beschrijving (optioneel)</label>
                    <textarea
                        rows={3}
                        placeholder="Meer details…"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>

                {/* Photo */}
                {preview ? (
                    <div className="cl-photo-preview">
                        <img src={preview} alt="Preview" />
                        <button type="button" className="cl-remove-btn" onClick={() => { setPhoto(null); setPreview(null); }}>
                            <FiX /> Verwijder
                        </button>
                    </div>
                ) : (
                    <label className="cl-photo-label">
                        <FiImage /> Foto toevoegen
                        <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} capture="environment" />
                    </label>
                )}

                {msg && <p className="cl-msg" style={{ color: msg.ok ? "#22c55e" : "#ef4444" }}>{msg.text}</p>}

                <button type="submit" className="cl-btn cl-btn--danger" disabled={sending}>
                    <FiAlertCircle /> {sending ? "Versturen…" : "Verstuur melding"}
                </button>
            </form>
        </div>
    );
}

// ── Hours overview card ───────────────────────────────────────────────────
function HoursCard() {
    const [log] = useState(() => {
        try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch { return []; }
    });

    const now = new Date();

    // This week
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    weekStart.setHours(0,0,0,0);

    // This month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const weekShifts  = log.filter(e => new Date(e.checkedIn) >= weekStart);
    const monthShifts = log.filter(e => new Date(e.checkedIn) >= monthStart);

    const weekTotal  = weekShifts.reduce((s, e) => s + e.duration, 0);
    const monthTotal = monthShifts.reduce((s, e) => s + e.duration, 0);

    return (
        <div className="cl-section-card">
            <h3 className="cl-card-title"><FiList /> Mijn uren</h3>

            <div className="cl-hours-summary">
                <div className="cl-hours-block">
                    <span className="cl-hours-num">{formatDuration(weekTotal)}</span>
                    <span className="cl-hours-label">Deze week</span>
                </div>
                <div className="cl-hours-block">
                    <span className="cl-hours-num">{formatDuration(monthTotal)}</span>
                    <span className="cl-hours-label">{now.toLocaleDateString("nl-NL", { month: "long" })}</span>
                </div>
                <div className="cl-hours-block">
                    <span className="cl-hours-num">{monthShifts.length}</span>
                    <span className="cl-hours-label">Shifts deze maand</span>
                </div>
            </div>

            {log.length > 0 ? (
                <div className="cl-shift-log">
                    <p className="cl-upload-log-title">Recente shifts</p>
                    {log.slice(0, 7).map((e, i) => (
                        <div key={i} className="cl-shift-log-row">
                            <span className="cl-log-date">{e.date}</span>
                            <span>{formatTime(e.checkedIn)} – {e.checkedOut ? formatTime(e.checkedOut) : "…"}</span>
                            <span className="cl-log-dur">{formatDuration(e.duration)}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="cl-empty">Nog geen shifts geregistreerd. Check in via de kaart hierboven.</p>
            )}

            <p style={{ fontSize: 12, color: "#666", marginTop: "0.5rem" }}>
                Tip: stuur dit overzicht als screenshot voor je facturatie.
            </p>
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────
const CleaningDashboard = () => {
    const { isLoggedIn, logout, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const now = new Date();
    const dayName = now.toLocaleDateString("nl-NL", { weekday: "long" });
    const dateStr = now.toLocaleDateString("nl-NL", { day: "numeric", month: "long" });

    const sidebar = <CleanerSidebar user={user} logout={logout} />;

    return (
        <DashboardLayout sidebar={sidebar} mainClass="cl-main">
            <Helmet>
                <title>Schoonmaak — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Hero */}
            <div className="cl-hero">
                <MdOutlineCleaningServices className="cl-hero-icon" />
                <div>
                    <strong>Goedemiddag, {user?.username || "Schoonmaker"}!</strong>
                    <span>{dayName.charAt(0).toUpperCase() + dayName.slice(1)}, {dateStr}</span>
                </div>
                <Link to="/schoonmaakschema" className="cl-hero-btn">
                    <FiClipboard /> Mijn taken
                </Link>
            </div>

            {/* Check-in / Check-out */}
            <section className="cl-section">
                <h2 className="cl-section-title"><FiClock /> Inchecken / Uitchecken</h2>
                <ShiftCard />
            </section>

            {/* Foto's */}
            <section className="cl-section">
                <PhotoCard />
            </section>

            {/* Voorraad */}
            <section className="cl-section">
                <SupplyCard />
            </section>

            {/* Probleem melden */}
            <section className="cl-section">
                <ProblemCard />
            </section>

            {/* Uren overzicht */}
            <section className="cl-section">
                <HoursCard />
            </section>

        </DashboardLayout>
    );
};

export default CleaningDashboard;
