import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import axios from "../../Helpers/AxiosHelper.jsx";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = Boolean(user);
    const parseToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (e) {
            console.error("❌ Kan token niet decoderen:", e);
            return null;
        }
    };

    const isTokenExpired = (token) => {
        const decoded = parseToken(token);
        if (!decoded?.exp) return true;
        return decoded.exp * 1000 < Date.now();
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
    };

    const refreshToken = async () => {
        try {
            const response = await axios.post("/api/refresh", {}, { withCredentials: true });
            const newToken = response.data.accessToken;
            const userData = response.data.user;

            if (newToken && userData) {
                localStorage.setItem("accessToken", newToken);
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                return newToken;
            }

            throw new Error("❌ Geen nieuwe token ontvangen bij refresh");
        } catch (err) {
            console.warn("⚠️ Refresh token mislukt:", err.message);
            handleLogout();
            return null;
        }
    };

    useEffect(() => {
        const interceptor = axios.interceptors.request.use(
            async (config) => {
                const accessToken = localStorage.getItem("accessToken");

                if (accessToken && isTokenExpired(accessToken)) {
                    const newToken = await refreshToken();
                    if (!newToken) throw new Error("Token refresh faalt");
                    config.headers.Authorization = `Bearer ${newToken}`;
                } else if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => axios.interceptors.request.eject(interceptor);
    }, []);

    useEffect(() => {
        const init = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const userData = localStorage.getItem("user");

            if (accessToken && userData) {
                if (isTokenExpired(accessToken)) {
                    await refreshToken();
                } else {
                    try {
                        const parsed = JSON.parse(userData);
                        setUser(parsed);
                    } catch (e) {
                        console.warn("❌ Corrupt user object:", e);
                        handleLogout();
                    }
                }
            }

            setLoading(false);
        };

        init();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post("/api/login", { email, password }, { withCredentials: true });

            const accessToken = response.data.accessToken || response.data.token;
            const userData = response.data.user;

            if (!accessToken || !userData) {
                console.error("❌ Login response mist token of user");
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

    const logout = async () => {
        try {
            await axios.post("/api/logout", {}, { withCredentials: true });
        } catch (error) {
            console.warn("⚠️ Logout fout:", error.message);
        } finally {
            handleLogout();
        }
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