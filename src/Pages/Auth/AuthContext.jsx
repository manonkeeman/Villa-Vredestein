import React, {createContext, useContext, useState, useEffect, useCallback,} from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../Helpers/AxiosHelper.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const ADMIN_EMAILS = ["admin@villavredestein.com"];

const decodeToken = (token) => {
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error("❌ Token decoding failed:", error);
        return null;
    }
};

const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    return !decoded?.exp || decoded.exp * 1000 < Date.now();
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = Boolean(user);

    const login = async (email, password) => {
        const cleanEmail = email.trim().toLowerCase();

        try {
            const res = await axiosInstance.post("/users/authenticate", {
                username: cleanEmail,
                password,
            });

            const token = res.data?.jwt;
            if (!token) {
                console.error("❌ Geen JWT ontvangen bij login.");
                return false;
            }

            const userData = decodeToken(token);
            if (!userData) {
                console.error("❌ JWT kon niet worden gedecodeerd.");
                return false;
            }

            // ✅ Bepaal rol op basis van email
            const role = ADMIN_EMAILS.includes(cleanEmail) ? "ADMIN" : "USER";

            const parsedUser = {
                ...userData,
                role,
            };

            localStorage.setItem("accessToken", token);
            localStorage.setItem("user", JSON.stringify(parsedUser));
            setUser(parsedUser);
            return true;
        } catch (error) {
            console.error("❌ Login error:", error.response?.data || error.message);
            return false;
        }
    };

    const logout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
    }, []);

    const register = async (data) => {
        try {
            const cleanData = {
                ...data,
                username: data.username.trim().toLowerCase(),
                email: data.email.trim().toLowerCase(),
            };

            const response = await axiosInstance.post("/users", cleanData);
            return response.status === 201 || response.status === 200;
        } catch (error) {
            const status = error.response?.status;
            if (status === 409) {
                console.error("❌ Gebruiker bestaat al.");
            } else {
                console.error(
                    "❌ Registratiefout:",
                    error.response?.data || error.message
                );
            }
            return false;
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            if (isTokenExpired(storedToken)) {
                console.warn("⏰ Token verlopen bij app-start. Uitloggen...");
                logout();
            } else {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("❌ User kon niet geladen worden:", e);
                    logout();
                }
            }
        }

        setLoading(false);
    }, [logout]);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                user,
                login,
                logout,
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