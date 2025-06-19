import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import axios from "../../Helpers/AxiosHelper.jsx";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                let token = localStorage.getItem("accessToken");

                if (!token) throw new Error("Geen accessToken");

                let response = await axios.get("/api/protected", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });

                if (response.status === 200) {
                    setAuthorized(true);
                }
            } catch (error) {
                console.warn("❌ Eerste accessToken verificatie faalde:", error.message);

                try {
                    const refreshResponse = await axios.post("/api/refresh-token", {}, { withCredentials: true });
                    const newAccessToken = refreshResponse.data.accessToken;

                    if (newAccessToken) {
                        localStorage.setItem("accessToken", newAccessToken);

                        const verifyAgain = await axios.get("/api/protected", {
                            headers: {
                                Authorization: `Bearer ${newAccessToken}`
                            },
                            withCredentials: true
                        });

                        if (verifyAgain.status === 200) {
                            setAuthorized(true);
                            return;
                        }
                    }
                } catch (refreshError) {
                    console.warn("❌ Refresh-token mislukte:", refreshError.message);
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [logout]);

    if (loading) {
        return (
            <div style={{ paddingTop: "120px", textAlign: "center" }}>
                Authenticatie controleren...
            </div>
        );
    }

    if (!authorized || !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;