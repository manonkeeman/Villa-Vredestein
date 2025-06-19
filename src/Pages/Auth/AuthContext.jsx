import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "../../Helpers/AxiosHelper.jsx"; // gebruik eigen helper met baseURL

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isLoggedIn = !!user;

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("user");

        if (accessToken && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (err) {
                console.warn("❌ Ongeldige user-data in localStorage:", err);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
            }
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post("/api/login", { email, password }, { withCredentials: true });

            const accessToken = response.data.accessToken || response.data.token;

            if (!accessToken) {
                console.error("❌ accessToken ontbreekt in login response");
                return false;
            }

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("user", JSON.stringify({ email }));
            setUser({ email });
            return true;
        } catch (error) {
            console.error("❌ Login fout:", error.response?.data || error.message);
            return false;
        }
    };

    const logout = async () => {
        try {
            await axios.post("/api/logout", {}, { withCredentials: true });
        } catch (error) {
            console.warn("⚠️ Logout fout:", error.message);
        }

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);