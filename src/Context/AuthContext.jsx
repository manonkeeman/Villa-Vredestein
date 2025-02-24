import React, { createContext, useState, useContext } from "react";

// Maak een context
const AuthContext = createContext();

// Custom hook voor gemakkelijke toegang tot AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component voor het beheren van inlogstatus
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};