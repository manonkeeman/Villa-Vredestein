import React, { createContext, useState, useContext } from "react";

// Maak een context aan
const AuthContext = createContext();

// Custom hook om AuthContext gemakkelijk te gebruiken
export const useAuth = () => useContext(AuthContext);

// AuthProvider component om inlogstatus bij te houden
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