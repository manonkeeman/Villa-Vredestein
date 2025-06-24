import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import PropTypes from "prop-types";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken || !user) {
        return <Navigate to="/login" replace />;
    }

    //const userRoles = user?.role?.map(role => role) || [];//
    const userRoles = user?.role

    const isAuthorized = allowedRoles.some(role => userRoles.includes(role));

    if (!isAuthorized) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

RoleProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleProtectedRoute;