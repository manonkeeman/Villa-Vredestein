import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isLoggedIn = !!user;

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.warn("❌ Ongeldige user-data in localStorage:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // voor refreshToken cookie
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.warn("❌ Login response niet OK:", errorText);
                return false;
            }

            const data = await response.json();

            if (!data.accessToken) {
                console.error("❌ accessToken ontbreekt in login response");
                return false;
            }

            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("user", JSON.stringify({ email }));
            setUser({ email });
            return true;
        } catch (err) {
            console.error("❌ Login fout:", err.message);
            return false;
        }
    };

    const logout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
                method: "POST",
                credentials: "include", // om de cookie weg te halen
            });
        } catch (err) {
            console.warn("⚠️ Logout fout, doorgaan met lokaal verwijderen.");
        }

        localStorage.removeItem("token");
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