import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import {jwtDecode} from "jwt-decode";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);

    const handleLogin = () => {
        login();
        navigate("/recepten");
    };

    return (
        <div>
            <h2>Inloggen</h2>
            <p>Welkom, {decoded.name}!</p> {/* ✅ Laat de naam uit de token zien */}
            <button onClick={handleLogin}>Log in</button>
        </div>
    );
};

export default Login;