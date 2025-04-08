import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

const approvedUsers = [
    { email: "student@villavredestein.com", password: "welkom123" },
    { email: "manon@villavredestein.com", password: "secure456" },
];

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedLogin = localStorage.getItem("isLoggedIn") === "true";
        const storedUser = localStorage.getItem("user");

        if (storedLogin && storedUser) {
            setIsLoggedIn(true);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const match = approvedUsers.find(
            (u) => u.email === email && u.password === password
        );

        if (match) {
            setIsLoggedIn(true);
            setUser({ email });
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", JSON.stringify({ email }));
            return true;
        } else {
            return false;
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
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