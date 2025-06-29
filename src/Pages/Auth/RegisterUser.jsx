import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Button from "../../Components/Buttons/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./RegisterUser.css";

const RegisterUser = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        room: "",
        authorities: [{ authority: "USER" }],
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "authority") {
            setFormData({ ...formData, authorities: [{ authority: value }] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const { username, password, confirmPassword, room } = formData;

        if (!username || !password || !confirmPassword || !room) {
            setError("❌ Vul alle verplichte velden in.");
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

        if (username.toLowerCase() === "admin@villavredestein.com") {
            formData.authorities = [{ authority: "ADMIN" }];
        }

        const success = await register({
            username,
            email: username,
            password,
            info: room,
            authorities: formData.authorities,
        });

        if (success) {
            setSuccess("✅ Account succesvol aangemaakt!");
            setTimeout(() => navigate("/login"), 2000);
        } else {
            setError("❌ Registratie mislukt. Probeer een ander e-mailadres.");
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-box">
                <h1 className="register-title">Registreren</h1>
                <p className="notice">
                    Deze registratie is bedoeld voor bewoners en beheerders van Villa Vredestein.<br />
                    <Link to="/contact">Nog geen uitnodiging? Neem contact op.</Link>
                </p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">E-mailadres</label>
                    <input
                        type="email"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="password">Wachtwoord (min. 8 tekens)</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    <label htmlFor="confirmPassword">Bevestig wachtwoord</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="toggle-password">
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>

                    <label htmlFor="room">Kamerselectie</label>
                    <select
                        name="room"
                        value={formData.room}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Maak een keuze --</option>
                        <option value="Control Center">Paddock Office</option>
                        <option value="Safety-Car">Paddock Cleanroom</option>
                        <option value="Nürburgring">Kamer: Nürburgring</option>
                        <option value="Autodromo Imola">Kamer: Autodromo Imola</option>
                        <option value="Autodromo di Monza">Kamer: Autodromo di Monza</option>
                        <option value="Spa-Francorchamps">Kamer: Spa-Francorchamps</option>
                        <option value="Circuit Zandvoort">Kamer: Zandvoort</option>
                        <option value="Circuit Zolder">Kamer: Zolder</option>
                    </select>

                    <label htmlFor="authority">Bevoegdheid</label>
                    <select
                        name="authority"
                        value={formData.authorities[0].authority}
                        onChange={handleChange}
                        required
                    >
                        <option value="USER">Bewoner</option>
                        <option value="ADMIN">Beheerder</option>
                    </select>

                    <Button type="submit" text="Maak account aan" variant="primary" />
                    {success && <p className="success">{success}</p>}
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default RegisterUser;