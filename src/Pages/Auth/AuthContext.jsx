import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../Helpers/AxiosHelper.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = Boolean(user);
    const parseToken = (token) => {
        try {
            return jwtDecode(token);
        } catch (e) {
            console.error("❌ Token decoding mislukt:", e);
            return null;
        }
    };

    const isTokenExpired = (token) => {
        const decoded = parseToken(token);
        return !decoded?.exp || decoded.exp * 1000 < Date.now();
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
    };

    const login = async (email, password) => {
        const cleanEmail = email.trim().toLowerCase();

        try {
            const response = await axiosInstance.post("/users/authenticate", {
                username: cleanEmail,
                password: password,
            });

            const accessToken = response.data?.jwt;
            const userData = parseToken(accessToken);

            if (!accessToken) {
                console.error("❌ Geen token ontvangen bij login");
                return false;
            }

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            return true;
        } catch (error) {
            console.error("❌ Login fout:", error.response?.data || error.message);
            return false;
        }
    };

    const register = async (data) => {
        const cleanUsername = data.username.trim().toLowerCase();

        try {
            const response = await axiosInstance.post("/users", {
                ...data,
                username: cleanUsername,
                email: data.email.trim().toLowerCase(),
            });
            return response.status === 201 || response.status === 200;
        } catch (error) {
            if (error.response?.status === 409) {
                console.error("❌ Gebruiker bestaat al.");
            } else {
                console.error("❌ Registratie fout:", error.response?.data || error.message);
            }
            return false;
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("user");

        if (accessToken && userData) {
            if (isTokenExpired(accessToken)) {
                console.warn("⏰ Token verlopen bij app start. Automatisch uitloggen.");
                handleLogout();
            } else {
                try {
                    setUser(JSON.parse(userData));
                } catch (e) {
                    console.error("❌ Kon userData niet parsen:", e);
                    handleLogout();
                }
            }
        }

        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                user,
                login,
                logout: handleLogout,
                register,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};