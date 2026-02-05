import React, { useState } from "react";
import axios from "../../Helpers/AxiosHelper.js";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "STUDENT",
    });

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const payload = {
                username: formData.username.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                role: formData.role,
            };

            await axios.post("/api/auth/register", payload);

            navigate("/login", { replace: true });
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "❌ Registratie mislukt. Controleer je gegevens en probeer het opnieuw.";

            setError(msg);
            console.error("Register error:", err?.response?.data || err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-form">
            <h2>Registreer</h2>

            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    placeholder="Gebruikersnaam"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="E-mailadres"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Wachtwoord"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                />

                <label style={{ display: "block", marginTop: 12 }}>
                    Rol
                </label>
                <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="STUDENT">Student</option>
                    <option value="CLEANER">Schoonmaak</option>
                </select>

                <button type="submit" disabled={submitting} style={{ marginTop: 16 }}>
                    {submitting ? "Bezig..." : "Registreer"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            <p style={{ marginTop: 12, opacity: 0.85, fontSize: 12 }}>
                Let op: Admin-accounts maak je niet via dit formulier aan.
            </p>
        </div>
    );
};

export default Register;