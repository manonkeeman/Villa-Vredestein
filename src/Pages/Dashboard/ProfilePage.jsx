import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import Spinner from "../../Components/Spinner/Spinner.jsx";
import {
    FiLogOut, FiHome, FiAlertCircle, FiFileText, FiCalendar,
    FiUser, FiUsers, FiDollarSign, FiClipboard, FiShield,
    FiUpload, FiSave, FiTrash2, FiLock,
} from "react-icons/fi";
import api from "../../Helpers/AxiosHelper.js";
import "./StudentDashboard.css";
import "./ProfilePage.css";
import "../../Styles/Global.css";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

const SOCIAL_OPTIONS = [
    { value: "", label: "— Kies voorkeur —" },
    { value: "OPEN_FOR_CONTACT", label: "Open voor contact" },
    { value: "LEUK", label: "Leuk, maar niet altijd" },
    { value: "AF_EN_TOE", label: "Af en toe" },
    { value: "LIEVER_OP_MEZELF", label: "Liever op mezelf" },
];

const MEAL_OPTIONS = [
    { value: "", label: "— Kies voorkeur —" },
    { value: "JA", label: "Ja, graag!" },
    { value: "SOMS", label: "Soms" },
    { value: "NEE", label: "Nee, bedankt" },
];

const AVAILABILITY_OPTIONS = [
    { value: "", label: "— Kies status —" },
    { value: "OPEN_VOOR_CHILLEN", label: "Open voor chillen" },
    { value: "AF_EN_TOE", label: "Af en toe" },
    { value: "DRUK", label: "Druk" },
    { value: "TENTAMENPERIODE", label: "Tentamenperiode" },
];

export default function ProfilePage() {
    const { isLoggedIn, logout, user: authUser } = useAuth();

    const [profile, setProfile]       = useState(null);
    const [form, setForm]             = useState({});
    const [saving, setSaving]         = useState(false);
    const [feedback, setFeedback]     = useState(null);
    const [uploading, setUploading]   = useState(false);
    const [loadSlow, setLoadSlow]     = useState(false);
    const [pwForm, setPwForm]         = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [pwSaving, setPwSaving]     = useState(false);
    const [pwFeedback, setPwFeedback] = useState(null);
    const fileInputRef = useRef(null);

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    useEffect(() => {
        const slowTimer = setTimeout(() => setLoadSlow(true), 4000);
        api.get("/api/users/me").then(res => {
            setProfile(res.data);
            setForm({
                username:             res.data.username             || "",
                fullName:             res.data.fullName             || "",
                phoneNumber:          res.data.phoneNumber          || "",
                emergencyPhoneNumber: res.data.emergencyPhoneNumber || "",
                studyOrWork:          res.data.studyOrWork          || "",
                parentsAddress:       res.data.parentsAddress       || "",
                favoriteMeal:         res.data.favoriteMeal         || "",
                socialPreference:     res.data.socialPreference     || "",
                mealPreference:       res.data.mealPreference       || "",
                availabilityStatus:   res.data.availabilityStatus   || "",
            });
            clearTimeout(slowTimer);
            setLoadSlow(false);
        }).catch(() => {
            clearTimeout(slowTimer);
            setFeedback({ type: "error", msg: "Profiel kon niet worden geladen." });
        });
        return () => clearTimeout(slowTimer);
    }, []);

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setFeedback(null);
    };

    const handleSave = async e => {
        e.preventDefault();
        setSaving(true);
        setFeedback(null);
        try {
            const payload = {
                username:             form.username             || null,
                fullName:             form.fullName             || null,
                phoneNumber:          form.phoneNumber          || null,
                emergencyPhoneNumber: form.emergencyPhoneNumber || null,
                studyOrWork:          form.studyOrWork          || null,
                parentsAddress:       form.parentsAddress       || null,
                favoriteMeal:         form.favoriteMeal         || null,
                socialPreference:     form.socialPreference     || null,
                mealPreference:       form.mealPreference       || null,
                availabilityStatus:   form.availabilityStatus   || null,
            };
            const res = await api.put("/api/users/me/profile", payload);
            setProfile(res.data);
            setFeedback({ type: "success", msg: "Profiel opgeslagen!" });
        } catch {
            setFeedback({ type: "error", msg: "Opslaan mislukt. Probeer het opnieuw." });
        } finally {
            setSaving(false);
        }
    };

    const handlePwChange = e => {
        setPwForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setPwFeedback(null);
    };

    const handlePwSave = async e => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwFeedback({ type: "error", msg: "Nieuwe wachtwoorden komen niet overeen." });
            return;
        }
        if (pwForm.newPassword.length < 8) {
            setPwFeedback({ type: "error", msg: "Nieuw wachtwoord moet minimaal 8 tekens zijn." });
            return;
        }
        setPwSaving(true);
        setPwFeedback(null);
        try {
            await api.patch("/api/users/me/password", {
                oldPassword: pwForm.oldPassword,
                newPassword: pwForm.newPassword,
            });
            setPwFeedback({ type: "success", msg: "Wachtwoord gewijzigd!" });
            setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            const msg = err?.response?.status === 400
                ? "Huidig wachtwoord is onjuist."
                : "Wijzigen mislukt. Probeer het opnieuw.";
            setPwFeedback({ type: "error", msg });
        } finally {
            setPwSaving(false);
        }
    };

    const handlePhotoUpload = async e => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setFeedback(null);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await api.post("/api/users/me/profile-photo", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setProfile(res.data);
            setFeedback({ type: "success", msg: "Profielfoto bijgewerkt!" });
        } catch {
            setFeedback({ type: "error", msg: "Foto uploaden mislukt. Gebruik JPG, PNG of WebP." });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDeletePhoto = async () => {
        setUploading(true);
        setFeedback(null);
        try {
            const res = await api.delete("/api/users/me/profile-photo");
            setProfile(res.data);
            setFeedback({ type: "success", msg: "Profielfoto verwijderd." });
        } catch {
            setFeedback({ type: "error", msg: "Verwijderen mislukt." });
        } finally {
            setUploading(false);
        }
    };

    const photoUrl = profile?.profileImagePath
        ? `${BASE_URL}/uploads/${profile.profileImagePath}`
        : null;

    return (
        <div className="profile-page">
            <Helmet>
                <title>Mijn profiel — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Sidebar — zelfde als StudentDashboard */}
            <aside className="dashboard-sidebar" aria-label="Navigatie zijbalk">
                <header className="sidebar-profile">
                    {photoUrl
                        ? <img src={photoUrl} alt="Profielfoto" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                        : <FiUser className="profile-icon" />
                    }
                </header>
                <h3 className="sidebar-title">{authUser?.username || "Vredesteiner"}</h3>

                <nav className="sidebar-nav">
                    <ul>
                        <li><Link to="/student"><FiHome /> Dashboard</Link></li>
                        <li><Link to="/student/profiel" className="active"><FiUser /> Mijn profiel</Link></li>
                        <li><Link to="/student/noodlijst"><FiAlertCircle /> Noodlijst</Link></li>
                        <li><Link to="/student/huisregels"><FiFileText /> Huisregels</Link></li>
                        <li><Link to="/schoonmaakschema"><FiClipboard /> Schoonmaakschema</Link></li>
                        <li><Link to="#"><FiDollarSign /> Betalingen</Link></li>
                        <li>
                            {profile?.contractFile
                                ? <a href={`${BASE_URL}/uploads/${encodeURIComponent(profile.contractFile)}`} target="_blank" rel="noopener noreferrer"><FiFileText /> Huurcontract</a>
                                : <Link to="#"><FiFileText /> Huurcontract</Link>
                            }
                        </li>
                        <li><Link to="#"><FiUsers /> Samen eten?</Link></li>
                        <li><Link to="#"><FiCalendar /> Events</Link></li>

                        {hasRole(authUser, "ADMIN") && (
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

            {/* Main content */}
            <div className="profile-content">

                {/* Profielfoto */}
                <section className="profile-photo-section">
                    <div className="profile-avatar">
                        {photoUrl
                            ? <img src={photoUrl} alt="Profielfoto" />
                            : <FiUser />
                        }
                    </div>
                    <div className="photo-actions">
                        <p>JPG, PNG of WebP · max 5 MB</p>
                        <label className="photo-upload-label">
                            <FiUpload /> {uploading ? "Bezig…" : "Foto uploaden"}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handlePhotoUpload}
                                disabled={uploading}
                            />
                        </label>
                        {profile?.profileImagePath && (
                            <button
                                type="button"
                                className="btn-delete-photo"
                                onClick={handleDeletePhoto}
                                disabled={uploading}
                            >
                                <FiTrash2 /> Foto verwijderen
                            </button>
                        )}
                    </div>
                </section>

                {/* Profielgegevens */}
                <section className="profile-form-section">
                    <h2><FiUser /> Persoonlijke gegevens</h2>

                    {profile === null && !feedback && (
                        loadSlow
                            ? <p style={{ color: "#fcbc2d", fontSize: 14 }}>Server wordt opgestart… even geduld (±30 sec).</p>
                            : <Spinner fullPage label="Profiel laden…" />
                    )}

                    {profile && (
                        <form className="profile-form" onSubmit={handleSave}>
                            <div className="form-group">
                                <label htmlFor="username">Gebruikersnaam</label>
                                <input id="username" name="username" value={form.username} onChange={handleChange} maxLength={50} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fullName">Volledige naam</label>
                                <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} maxLength={100} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phoneNumber">Telefoonnummer</label>
                                <input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} maxLength={30} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="emergencyPhoneNumber">Noodnummer</label>
                                <input id="emergencyPhoneNumber" name="emergencyPhoneNumber" value={form.emergencyPhoneNumber} onChange={handleChange} maxLength={30} />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="studyOrWork">Studie / werk</label>
                                <input id="studyOrWork" name="studyOrWork" value={form.studyOrWork} onChange={handleChange} maxLength={100} />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="parentsAddress">Adres ouders / contactpersoon</label>
                                <input id="parentsAddress" name="parentsAddress" value={form.parentsAddress} onChange={handleChange} maxLength={255} />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="favoriteMeal">Lievelingseten</label>
                                <input id="favoriteMeal" name="favoriteMeal" value={form.favoriteMeal} onChange={handleChange} maxLength={100} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="socialPreference">Sociale voorkeur</label>
                                <select id="socialPreference" name="socialPreference" value={form.socialPreference} onChange={handleChange}>
                                    {SOCIAL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="mealPreference">Samen eten?</label>
                                <select id="mealPreference" name="mealPreference" value={form.mealPreference} onChange={handleChange}>
                                    {MEAL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="availabilityStatus">Beschikbaarheidsstatus</label>
                                <select id="availabilityStatus" name="availabilityStatus" value={form.availabilityStatus} onChange={handleChange}>
                                    {AVAILABILITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-save" disabled={saving}>
                                    <FiSave /> {saving ? "Opslaan…" : "Opslaan"}
                                </button>
                                {feedback && (
                                    <span className={`form-feedback ${feedback.type}`}>{feedback.msg}</span>
                                )}
                            </div>
                        </form>
                    )}
                </section>

                {/* Wachtwoord wijzigen */}
                <section className="profile-form-section">
                    <h2><FiLock /> Wachtwoord wijzigen</h2>
                    <form className="profile-form" onSubmit={handlePwSave}>
                        <div className="form-group full-width">
                            <label htmlFor="oldPassword">Huidig wachtwoord</label>
                            <input
                                id="oldPassword"
                                name="oldPassword"
                                type="password"
                                value={pwForm.oldPassword}
                                onChange={handlePwChange}
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">Nieuw wachtwoord</label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={pwForm.newPassword}
                                onChange={handlePwChange}
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={72}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Herhaal nieuw wachtwoord</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={pwForm.confirmPassword}
                                onChange={handlePwChange}
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={72}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-save" disabled={pwSaving}>
                                <FiLock /> {pwSaving ? "Opslaan…" : "Wachtwoord wijzigen"}
                            </button>
                            {pwFeedback && (
                                <span className={`form-feedback ${pwFeedback.type}`}>{pwFeedback.msg}</span>
                            )}
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
