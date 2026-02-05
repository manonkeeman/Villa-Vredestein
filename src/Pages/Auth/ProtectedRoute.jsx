import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import PropTypes from "prop-types";

const normalizeRole = (role) => {
    if (!role) return "";
    const r = String(role).trim().toUpperCase();
    return r.startsWith("ROLE_") ? r : `ROLE_${r}`;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const accessToken = localStorage.getItem("accessToken");

    if (loading) return null;

    if (!accessToken || !user) return <Navigate to="/login" replace />;

    const userRoles = Array.isArray(user.roles) ? user.roles.map(normalizeRole) : [];
    const requiredRoles = Array.isArray(allowedRoles) ? allowedRoles.map(normalizeRole) : [];

    const isAuthorized =
        requiredRoles.length === 0 || requiredRoles.some((r) => userRoles.includes(r));

    if (!isAuthorized) return <Navigate to="/unauthorized" replace />;

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

ProtectedRoute.defaultProps = {
    allowedRoles: [],
};

export default ProtectedRoute;