import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../Components/Auth/AuthContext";
import "../Styles/BentoGrid.css";
import "./StudentDashboard.css";
import Watetenwevandaag from "../Assets/Images/Watetenwevandaag.jpg";

const StudentDashboard = () => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="StudentDashboard">
            <div className="bento-grid">
                <div className="box dashboard-sidebar">
                    <h3>Welkom Vredesteiner</h3>
                    <p>Informatie gegevens</p>
                    <p>Schoonmaaktaken</p>
                    <p>Heb ik mijn huur betaald?</p>
                </div>

                <div className="image-box">
                    <img
                        src={Watetenwevandaag}
                        alt="Wat eten we vandaag?"
                        className="box-image"
                    />
                    <div className="search-overlay">
                        <Link to="/receptenzoeker" className="search-link">
                            Wat eten we vandaag? →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;