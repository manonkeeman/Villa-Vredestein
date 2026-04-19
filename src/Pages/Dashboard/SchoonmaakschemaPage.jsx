import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import Spinner from "../../Components/Spinner/Spinner.jsx";
import {
    FiAlertCircle, FiClipboard,
    FiUser, FiCalendar,
    FiCheckSquare, FiSquare, FiPlus, FiTrash2,
    FiChevronLeft, FiChevronRight,
    FiMessageSquare, FiAlertTriangle, FiEdit2, FiSave, FiX,
} from "react-icons/fi";
import { MdOutlineCleaningServices } from "react-icons/md";
import api from "../../Helpers/AxiosHelper.js";
import DashboardLayout from "./DashboardLayout.jsx";
import { AdminSidebar } from "./AdminBetalingenMatrix.jsx";
import StudentSidebarShared from "../../Components/StudentSidebar/StudentSidebar.jsx";
import "./StudentDashboard.css";
import "./SchoonmaakschemaPage.css";
import "../../Styles/Global.css";

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

// ISO week number (ISO 8601)
const getIsoWeek = (date = new Date()) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const getIsoYear = (date = new Date()) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    return d.getUTCFullYear();
};

const getIsoWeeksInYear = (year) => getIsoWeek(new Date(year, 11, 28));

const addWeeks = (isoWeek, year, delta) => {
    let w = isoWeek + delta;
    let y = year;
    while (w < 1) { y--; w += getIsoWeeksInYear(y); }
    while (w > getIsoWeeksInYear(y)) { w -= getIsoWeeksInYear(y); y++; }
    return { isoWeek: w, year: y };
};

const getWeekDates = (isoWeek, year) => {
    const jan4 = new Date(year, 0, 4);
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (isoWeek - 1) * 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: monday, end: sunday };
};

const NL_MONTHS = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];

const formatWeekRange = (isoWeek, year) => {
    const { start, end } = getWeekDates(isoWeek, year);
    const sameMonth = start.getMonth() === end.getMonth();
    return sameMonth
        ? `${start.getDate()}–${end.getDate()} ${NL_MONTHS[start.getMonth()]}`
        : `${start.getDate()} ${NL_MONTHS[start.getMonth()]}–${end.getDate()} ${NL_MONTHS[end.getMonth()]}`;
};

const toRotationWeek = (isoWeek) => ((isoWeek - 1) % 4) + 1;

// ─── CleanerSidebar (only for cleaners, not shown to admin/student) ──────────

function CleanerSidebar({ user, logout }) {
    return (
        <aside className="dashboard-sidebar" aria-label="Navigatie zijbalk">
            <header className="sidebar-profile"><FiUser className="profile-icon" /></header>
            <h3 className="sidebar-title">Welkom {user?.username || "Schoonmaker"}</h3>
            <nav className="sidebar-nav">
                <ul>
                    <li><span className="active"><FiClipboard /> Mijn taken</span></li>
                    <li><button onClick={logout} type="button" className="logout-button">Log uit</button></li>
                </ul>
            </nav>
        </aside>
    );
}

CleanerSidebar.propTypes = { user: PropTypes.object, logout: PropTypes.func.isRequired };

// ─── TaskCard ────────────────────────────────────────────────────────────────

function TaskCard({ task, isAdmin, isCleaner, onToggle, onDelete, onEdit, onComment, onIncident }) {
    const [commentInput,     setCommentInput]     = useState("");
    const [incidentInput,    setIncidentInput]    = useState("");
    const [showCommentForm,  setShowCommentForm]  = useState(false);
    const [showIncidentForm, setShowIncidentForm] = useState(false);
    const [showEditForm,     setShowEditForm]     = useState(false);
    const [editName,         setEditName]         = useState(task.name);
    const [editDesc,         setEditDesc]         = useState(task.description || "");
    const [saving,           setSaving]           = useState(false);

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentInput.trim()) return;
        setSaving(true);
        await onComment(task.id, commentInput.trim());
        setCommentInput(""); setShowCommentForm(false); setSaving(false);
    };

    const handleIncident = async (e) => {
        e.preventDefault();
        if (!incidentInput.trim()) return;
        setSaving(true);
        await onIncident(task.id, incidentInput.trim());
        setIncidentInput(""); setShowIncidentForm(false); setSaving(false);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!editName.trim()) return;
        setSaving(true);
        await onEdit(task.id, { name: editName.trim(), description: editDesc.trim() || undefined });
        setShowEditForm(false); setSaving(false);
    };

    return (
        <div className={`cleaning-task-card${task.completed ? " completed" : ""}`}>
            <div className="task-card-header">
                <button
                    className="task-toggle-btn"
                    onClick={() => onToggle(task.id)}
                    aria-label={task.completed ? "Markeer als ongedaan" : "Markeer als voltooid"}
                >
                    {task.completed
                        ? <FiCheckSquare className="task-check completed" />
                        : <FiSquare className="task-check" />}
                </button>

                <div className="task-card-info">
                    <span className="task-name">{task.name}</span>
                    {task.description && <span className="task-description">{task.description}</span>}
                    <div className="task-meta">
                        {task.assignedTo && (
                            <span className="task-badge task-badge-user"><FiUser /> {task.assignedTo}</span>
                        )}
                        {task.deadline && (
                            <span className="task-badge task-badge-date"><FiCalendar /> {task.deadline}</span>
                        )}
                        <span className={`task-badge ${task.completed ? "task-badge-done" : "task-badge-open"}`}>
                            {task.completed ? "Voltooid" : "Open"}
                        </span>
                    </div>
                </div>

                {isAdmin && (
                    <div style={{ display: "flex", gap: "0.3rem" }}>
                        <button
                            className="task-delete-btn"
                            onClick={() => { setShowEditForm(v => !v); setShowCommentForm(false); setShowIncidentForm(false); }}
                            aria-label="Taak bewerken"
                            title="Bewerken"
                        >
                            <FiEdit2 />
                        </button>
                        <button
                            className="task-delete-btn"
                            onClick={() => onDelete(task.id)}
                            aria-label="Taak verwijderen"
                            title="Verwijderen"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                )}
            </div>

            {/* Inline edit form */}
            {showEditForm && (
                <form className="create-task-form" onSubmit={handleEdit} style={{ marginTop: "0.5rem" }}>
                    <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        placeholder="Naam van de taak *"
                        maxLength={120}
                        required
                        autoFocus
                    />
                    <textarea
                        value={editDesc}
                        onChange={e => setEditDesc(e.target.value)}
                        placeholder="Omschrijving (optioneel)"
                        maxLength={500}
                        rows={2}
                    />
                    <div className="create-task-form-actions">
                        <button type="submit" disabled={saving || !editName.trim()}>
                            <FiSave /> {saving ? "Opslaan…" : "Opslaan"}
                        </button>
                        <button type="button" className="cancel-btn" onClick={() => setShowEditForm(false)}>
                            <FiX /> Annuleren
                        </button>
                    </div>
                </form>
            )}

            {(task.comment || task.incidentReport) && (
                <div className="task-card-notes">
                    {task.comment && (
                        <p className="task-note task-note-comment"><FiMessageSquare /> {task.comment}</p>
                    )}
                    {task.incidentReport && (
                        <p className="task-note task-note-incident"><FiAlertTriangle /> {task.incidentReport}</p>
                    )}
                </div>
            )}

            {(isAdmin || isCleaner) && (
                <div className="task-card-actions">
                    <button
                        className="task-action-btn"
                        onClick={() => { setShowCommentForm(v => !v); setShowIncidentForm(false); setShowEditForm(false); }}
                    >
                        <FiMessageSquare /> Opmerking
                    </button>
                    <button
                        className="task-action-btn task-action-incident"
                        onClick={() => { setShowIncidentForm(v => !v); setShowCommentForm(false); setShowEditForm(false); }}
                    >
                        <FiAlertTriangle /> Incident
                    </button>
                </div>
            )}

            {showCommentForm && (
                <form className="task-inline-form" onSubmit={handleComment}>
                    <input
                        type="text"
                        value={commentInput}
                        onChange={e => setCommentInput(e.target.value)}
                        placeholder="Voeg een opmerking toe…"
                        maxLength={500}
                        autoFocus
                    />
                    <button type="submit" disabled={saving || !commentInput.trim()}>
                        {saving ? "Opslaan…" : "Opslaan"}
                    </button>
                </form>
            )}

            {showIncidentForm && (
                <form className="task-inline-form task-inline-form-incident" onSubmit={handleIncident}>
                    <input
                        type="text"
                        value={incidentInput}
                        onChange={e => setIncidentInput(e.target.value)}
                        placeholder="Beschrijf het incident…"
                        maxLength={500}
                        autoFocus
                    />
                    <button type="submit" disabled={saving || !incidentInput.trim()}>
                        {saving ? "Melden…" : "Melden"}
                    </button>
                </form>
            )}
        </div>
    );
}

TaskCard.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        completed: PropTypes.bool,
        assignedTo: PropTypes.string,
        deadline: PropTypes.string,
        comment: PropTypes.string,
        incidentReport: PropTypes.string,
    }).isRequired,
    isAdmin: PropTypes.bool,
    isCleaner: PropTypes.bool,
    onToggle: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onComment: PropTypes.func.isRequired,
    onIncident: PropTypes.func.isRequired,
};

// ─── CreateTaskForm (Admin only) ─────────────────────────────────────────────

function CreateTaskForm({ weekNumber, onCreated }) {
    const [open,        setOpen]        = useState(false);
    const [name,        setName]        = useState("");
    const [description, setDescription] = useState("");
    const [saving,      setSaving]      = useState(false);
    const [error,       setError]       = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setSaving(true); setError(null);
        try {
            const res = await api.post("/api/cleaning/tasks", {
                weekNumber,
                name: name.trim(),
                description: description.trim() || undefined,
            });
            onCreated(res.data);
            setName(""); setDescription(""); setOpen(false);
        } catch {
            setError("Opslaan mislukt. Probeer het opnieuw.");
        } finally {
            setSaving(false);
        }
    };

    if (!open) {
        return (
            <button className="create-task-btn" onClick={() => setOpen(true)}>
                <FiPlus /> Taak toevoegen
            </button>
        );
    }

    return (
        <form className="create-task-form" onSubmit={handleSubmit}>
            <h4><FiPlus /> Nieuwe taak — rotatieweek {weekNumber}</h4>
            {error && <p className="form-error">{error}</p>}
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Naam van de taak *"
                maxLength={120}
                required
                autoFocus
            />
            <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Omschrijving (optioneel)"
                maxLength={500}
                rows={2}
            />
            <div className="create-task-form-actions">
                <button type="submit" disabled={saving || !name.trim()}>
                    {saving ? "Opslaan…" : "Opslaan"}
                </button>
                <button type="button" className="cancel-btn" onClick={() => setOpen(false)}>
                    Annuleren
                </button>
            </div>
        </form>
    );
}

CreateTaskForm.propTypes = {
    weekNumber: PropTypes.number.isRequired,
    onCreated: PropTypes.func.isRequired,
};

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function SchoonmaakschemaPage() {
    const { isLoggedIn, logout, user } = useAuth();
    const todayIsoWeek = getIsoWeek();
    const todayIsoYear = getIsoYear();

    const [tasks,        setTasks]        = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState(null);
    const [navWeek,      setNavWeek]      = useState({ isoWeek: todayIsoWeek, year: todayIsoYear });
    const [contractFile, setContractFile] = useState(null);
    const weekCache = useRef({});

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    const isAdmin   = hasRole(user, "ADMIN");
    const isCleaner = hasRole(user, "CLEANER");
    const isStudent = hasRole(user, "STUDENT");

    const rotationWeek  = toRotationWeek(navWeek.isoWeek);
    const isCurrentWeek = navWeek.isoWeek === todayIsoWeek && navWeek.year === todayIsoYear;

    const fetchTasks = useCallback(() => {
        const rw = toRotationWeek(navWeek.isoWeek);

        if (weekCache.current[rw]) {
            setTasks(weekCache.current[rw]);
            setLoading(false); setError(null);
            return;
        }

        try {
            const cached = sessionStorage.getItem(`cleaning_rw_${rw}`);
            if (cached) {
                const data = JSON.parse(cached);
                weekCache.current[rw] = data;
                setTasks(data); setLoading(false); setError(null);
                api.get(`/api/cleaning/tasks?weekNumber=${rw}`)
                    .then(res => {
                        weekCache.current[rw] = res.data;
                        setTasks(res.data);
                        try { sessionStorage.setItem(`cleaning_rw_${rw}`, JSON.stringify(res.data)); } catch {}
                    })
                    .catch(() => {});
                return;
            }
        } catch {}

        setLoading(true); setError(null);
        api.get(`/api/cleaning/tasks?weekNumber=${rw}`)
            .then(res => {
                weekCache.current[rw] = res.data;
                try { sessionStorage.setItem(`cleaning_rw_${rw}`, JSON.stringify(res.data)); } catch {}
                setTasks(res.data);
            })
            .catch(() => setError("Taken konden niet worden geladen."))
            .finally(() => setLoading(false));
    }, [navWeek.isoWeek]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    useEffect(() => {
        if (isStudent || isAdmin) {
            api.get("/api/users/me")
                .then(res => setContractFile(res.data.contractFile || null))
                .catch(() => {});
        }
    }, []);

    const updateCache = (rw, updater) => {
        if (weekCache.current[rw]) weekCache.current[rw] = updater(weekCache.current[rw]);
    };

    const handleToggle = async (taskId) => {
        try {
            const res = await api.put(`/api/cleaning/tasks/${taskId}/toggle`);
            setTasks(prev => prev.map(t => t.id === taskId ? res.data : t));
            updateCache(rotationWeek, prev => prev.map(t => t.id === taskId ? res.data : t));
        } catch { setError("Kon taak niet bijwerken."); }
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm("Taak verwijderen?")) return;
        try {
            await api.delete(`/api/cleaning/tasks/${taskId}`);
            setTasks(prev => prev.filter(t => t.id !== taskId));
            updateCache(rotationWeek, prev => prev.filter(t => t.id !== taskId));
        } catch { setError("Kon taak niet verwijderen."); }
    };

    const handleEdit = async (taskId, patch) => {
        // Try PUT/PATCH on backend, always update local state
        try {
            const res = await api.put(`/api/cleaning/tasks/${taskId}`, patch);
            const updated = res.data;
            setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
            updateCache(rotationWeek, prev => prev.map(t => t.id === taskId ? updated : t));
        } catch {
            // Backend not available — update locally
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...patch } : t));
            updateCache(rotationWeek, prev => prev.map(t => t.id === taskId ? { ...t, ...patch } : t));
        }
    };

    const handleComment = async (taskId, comment) => {
        try {
            const res = await api.put(`/api/cleaning/tasks/${taskId}/comment?comment=${encodeURIComponent(comment)}`);
            setTasks(prev => prev.map(t => t.id === taskId ? res.data : t));
            updateCache(rotationWeek, prev => prev.map(t => t.id === taskId ? res.data : t));
        } catch { setError("Kon opmerking niet opslaan."); }
    };

    const handleIncident = async (taskId, incident) => {
        try {
            const res = await api.put(`/api/cleaning/tasks/${taskId}/incident?incident=${encodeURIComponent(incident)}`);
            setTasks(prev => prev.map(t => t.id === taskId ? res.data : t));
            updateCache(rotationWeek, prev => prev.map(t => t.id === taskId ? res.data : t));
        } catch { setError("Kon incident niet melden."); }
    };

    const handleCreated = (newTask) => {
        setTasks(prev => [...prev, newTask]);
        updateCache(rotationWeek, prev => [...prev, newTask]);
    };

    const completedCount = tasks.filter(t => t.completed).length;

    const sidebar = isAdmin
        ? <AdminSidebar active="schema" logout={logout} username={user?.username} />
        : isCleaner
            ? <CleanerSidebar user={user} logout={logout} />
            : <StudentSidebarShared user={user} logout={logout} active="schema" contractFile={contractFile} />;

    return (
        <>
            <Helmet>
                <title>Schoonmaakschema — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <DashboardLayout sidebar={sidebar}>
                <section className="cleaning-header-section">
                    <div className="cleaning-header-content">
                        <h2><MdOutlineCleaningServices /> Schoonmaakschema</h2>
                        <p>
                            {isAdmin
                                ? "Beheer en bewerk alle schoonmaaktaken per rotatieweek. Klik op het potlood-icoon om een taak te bewerken."
                                : isCleaner
                                    ? "Jouw toegewezen schoonmaaktaken voor deze week. Vink taken af en meld incidenten."
                                    : "Bekijk de schoonmaaktaken voor deze week en vink jouw taken af."}
                        </p>
                    </div>

                    <div className="cleaning-week-nav">
                        <button
                            className="week-nav-btn"
                            onClick={() => setNavWeek(w => addWeeks(w.isoWeek, w.year, -1))}
                            aria-label="Vorige week"
                        >
                            <FiChevronLeft />
                        </button>
                        <div className="week-label-wrap">
                            <span className="week-label">
                                Week {navWeek.isoWeek} · {formatWeekRange(navWeek.isoWeek, navWeek.year)}
                                {navWeek.year !== todayIsoYear && ` ${navWeek.year}`}
                                {isCurrentWeek && <span className="week-current-badge">nu</span>}
                            </span>
                        </div>
                        <button
                            className="week-nav-btn"
                            onClick={() => setNavWeek(w => addWeeks(w.isoWeek, w.year, 1))}
                            aria-label="Volgende week"
                        >
                            <FiChevronRight />
                        </button>
                    </div>

                    {!loading && !error && (
                        <p className="cleaning-progress">
                            {completedCount} van {tasks.length} taken voltooid
                            {isAdmin && tasks.length > 0 && (
                                <span style={{ fontSize: 12, opacity: 0.6, marginLeft: "0.5rem" }}>
                                    · Rotatieweek {rotationWeek}
                                </span>
                            )}
                        </p>
                    )}
                </section>

                {loading && <Spinner fullPage label="Taken laden…" />}
                {error && <div className="cleaning-status cleaning-error">{error}</div>}

                {!loading && !error && tasks.length === 0 && (
                    <div className="cleaning-status">
                        Geen taken voor week {navWeek.isoWeek}.
                        {isAdmin && " Voeg een taak toe via de knop hieronder."}
                    </div>
                )}

                {!loading && !error && tasks.length > 0 && (
                    <div className="cleaning-task-list">
                        {tasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                isAdmin={isAdmin}
                                isCleaner={isCleaner}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                                onComment={handleComment}
                                onIncident={handleIncident}
                            />
                        ))}
                    </div>
                )}

                {isAdmin && !loading && (
                    <CreateTaskForm weekNumber={rotationWeek} onCreated={handleCreated} />
                )}
            </DashboardLayout>
        </>
    );
}