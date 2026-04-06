import React from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

const normalizeRole = (role) => {
    if (!role) return "";
    const s = String(role).trim().toUpperCase();
    return s.startsWith("ROLE_") ? s : `ROLE_${s}`;
};

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, loading, isLoggedIn } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <main style={{ padding: 24 }}>
                <p>Bezig met laden…</p>
            </main>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (!allowedRoles.length) {
        return children;
    }

    const userRoles = Array.isArray(user?.roles) ? user.roles.map(normalizeRole) : [];
    const required = allowedRoles.map(normalizeRole);

    const hasAccess = required.some((r) => userRoles.includes(r));

    if (!hasAccess) {
        return (
            <Navigate
                to="/unauthorized"
                replace
                state={{
                    from: location,
                    required,
                    userRoles,
                }}
            />
        );
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
};