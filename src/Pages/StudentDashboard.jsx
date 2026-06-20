import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Components/Auth/AuthContext";
import "../Styles/BentoGrid.css";
import "./StudentDashboard.css";

const StudentDashboard = () => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="StudentDashboard">
            <div className="dashboard-content">
                <h2 className="dashboard-title">Welkom, Vredesteiner</h2>
                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <span className="card-icon">🏠</span>
                        <h3>Huisinfo</h3>
                        <p>Praktische informatie over de villa.</p>
                    </div>
                    <div className="dashboard-card">
                        <span className="card-icon">🧹</span>
                        <h3>Schoonmaaktaken</h3>
                        <p>Bekijk wie er deze week aan de beurt is.</p>
                    </div>
                    <div className="dashboard-card">
                        <span className="card-icon">💶</span>
                        <h3>Huur</h3>
                        <p>Overzicht van je betalingen.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
