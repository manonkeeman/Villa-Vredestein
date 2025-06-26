import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import axios from "../../Helpers/AxiosHelper.js";

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
            const res = await axios.post("/users/authenticate", {
                username: cleanEmail,
                password,
            });

            const token = res.data?.jwt;
            if (!token) return false;

            const userData = decodeToken(token);
            if (!userData) return false;

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

            const res = await axios.post("/users", cleanData);
            return res.status === 201 || res.status === 200;
        } catch (error) {
            console.error("❌ Register error:", error.response?.data || error.message);
            return false;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            if (isTokenExpired(token)) {
                logout();
            } else {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("❌ Error loading user from localStorage:", e);
                    logout();
                }
            }
        }

        setLoading(false);
    }, [logout]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};