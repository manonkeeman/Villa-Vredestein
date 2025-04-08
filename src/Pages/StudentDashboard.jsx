import React from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Components/Auth/AuthContext";
import "../Styles/BentoGrid.css";
import "./StudentDashboard.css";

const StudentDashboard = () => {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="StudentDashboard">
            <div className="bento-grid">
                <div className="box box1">
                    <h1>Welkom Vredesteiner</h1>
                </div>
                <div className="box box2">
                    <h1>Wat eten we vandaag</h1>
                    <Link to="/dashboard/receptenzoeker">→ Naar receptenzoeker</Link>
                </div>
                <div className="box box3">
                    <h1>Informatie gegevens</h1>
                </div>
                <div className="box box4">
                    <h1>Schoonmaaktaken</h1>
                </div>
                <div className="box box5">
                    <h1>Heb ik mijn huur betaald?</h1>
                </div>
                {/* Logout knop eventueel als test */}
                <div className="box box6">
                    <button onClick={handleLogout}>Uitloggen</button>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;