import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { useAuth } from "./AuthContext.jsx";
import Button from "../../Components/Buttons/Button.jsx";
import "./RegisterUser.css";

const normEmail = (s) => String(s ?? "").trim().toLowerCase();

const EMAIL_TO_ROOM = {
    "arwenleonor@gmail.com": "Italië",
    "ikheetalvar@gmail.com": "Oekraïne",
    "medocstaal@gmail.com": "Frankrijk",
    "desmondstaal@gmail.com": "Thailand",
    "simontalsma2@gmail.com": "Argentinie",
};

const ROOM_OPTIONS = [
    { value: "Italië", label: "Italië" },
    { value: "Oekraïne", label: "Oekraïne" },
    { value: "Frankrijk", label: "Frankrijk" },
    { value: "Thailand", label: "Thailand" },
    { value: "Argentinie", label: "Argentinie" },
    { value: "Japan", label: "Japan (beschikbaar)" },
];

export default function RegisterUser() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const cleanEmail = useMemo(() => normEmail(email), [email]);
    const forcedRoom = useMemo(() => EMAIL_TO_ROOM[cleanEmail] ?? "", [cleanEmail]);
    const roomLocked = Boolean(forcedRoom);

    useEffect(() => {
        setError("");
        setSuccess("");

        if (forcedRoom) {
            setRoom((prev) => (prev === forcedRoom ? prev : forcedRoom));
            return;
        }

        setRoom((prev) => {
            if (!prev) return "";
            if (prev === "Japan") return prev;
            return "";
        });
    }, [forcedRoom]);

    const allowedRoomOptions = useMemo(() => {
        if (roomLocked) return ROOM_OPTIONS.filter((o) => o.value === forcedRoom);
        return ROOM_OPTIONS.filter((o) => o.value === "Japan");
    }, [roomLocked, forcedRoom]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!cleanEmail || !password || !confirmPassword || !room) {
            setError("❌ Vul alle velden in.");
            return;
        }

        if (password.length < 8) {
            setError("❌ Wachtwoord moet minimaal 8 tekens bevatten.");
            return;
        }

        if (password !== confirmPassword) {
            setError("❌ Wachtwoorden komen niet overeen.");
            return;
        }

        if (forcedRoom && room !== forcedRoom) {
            setError(`❌ Dit e-mailadres hoort bij kamer: ${forcedRoom}.`);
            return;
        }

        if (!forcedRoom && room !== "Japan") {
            setError("❌ Alleen Japan is nog beschikbaar voor nieuwe registratie.");
            return;
        }

        const payload = {
            username: cleanEmail,
            email: cleanEmail,
            password,
            role: "STUDENT",
            info: room,
            room,
        };

        try {
            setSubmitting(true);

            const ok = await register(payload);

            if (ok) {
                setSuccess("✅ Account succesvol aangemaakt! Je wordt doorgestuurd…");
                setTimeout(() => navigate("/login"), 900);
            } else {
                setError("❌ Registratie mislukt. Check Network tab: waarschijnlijk 400/409.");
            }
        } catch (err) {
            console.error("Register error:", err);
            setError("❌ Er ging iets mis. Check Console + Network tab voor response.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-box">
                <h1 className="register-title">Registreren</h1>

                <p className="notice">
                    Deze registratie is bedoeld voor bewoners van Villa Vredestein.
                    <br />
                    <Link to="/contact">Nog geen uitnodiging? Neem contact op.</Link>
                </p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mailadres</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="room">Kamer (land)</label>
                    <select
                        id="room"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        required
                        disabled={roomLocked}
                    >
                        <option value="">-- Maak een keuze --</option>
                        {allowedRoomOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {roomLocked ? (
                        <p className="notice" style={{ marginTop: "-0.5rem" }}>
                            Deze kamer is vast gekoppeld aan dit e-mailadres.
                        </p>
                    ) : (
                        cleanEmail && (
                            <p className="notice" style={{ marginTop: "-0.5rem" }}>
                                Alleen Japan is nog beschikbaar voor nieuwe registratie.
                            </p>
                        )
                    )}

                    <label htmlFor="password">Wachtwoord</label>
                    <div className="password-input-wrapper">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                        <span
                            onClick={() => setShowPassword((v) => !v)}
                            className="toggle-password"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") setShowPassword((v) => !v);
                            }}
                        >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
                    </div>

                    <label htmlFor="confirmPassword">Bevestig wachtwoord</label>
                    <div className="password-input-wrapper">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                        <span
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="toggle-password"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") setShowConfirmPassword((v) => !v);
                            }}
                        >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
                    </div>

                    <Button
                        type="submit"
                        text={submitting ? "Bezig…" : "Registreer"}
                        variant="primary"
                        disabled={submitting}
                    />

                    {success && <p className="success">{success}</p>}
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </div>
    );
}