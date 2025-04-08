import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("https://jouw-api-url.com/login", {
                email,
                password,
            });

            const { token } = response.data;

            localStorage.setItem("token", token); // JWT opslaan
            navigate("/dashboard"); // doorgaan naar beveiligde route
        } catch (err) {
            alert("Login mislukt. Controleer je gegevens.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wachtwoord"
                required
            />
            <button type="submit">Inloggen</button>
        </form>
    );
};

export default Login;