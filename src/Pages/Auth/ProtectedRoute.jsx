import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();

    if (loading) {
        return <div style={{ paddingTop: "120px", textAlign: "center" }}>Laden...</div>;
    }
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;