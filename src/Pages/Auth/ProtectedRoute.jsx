import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken || !user) {
        return <Navigate to="/login" replace />;
    }

    const isAuthorized = allowedRoles.includes(user.role);

    if (!isAuthorized) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;