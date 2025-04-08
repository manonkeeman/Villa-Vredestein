import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const approvedUsers = [
    { email: "student@villavredestein.com", password: "welkom123" },
    { email: "manon@villavredestein.com", password: "secure456" },
];

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true";
    });

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

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
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);