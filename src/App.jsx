import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import axios from "axios";
import Navigatie from "./Components/Navigatie/Navigatie.jsx";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import NotFound from "./Pages/NotFound.jsx";

// Routebescherming voor ingelogde gebruikers
function PrivateRoute({ children }) {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? children : <Login />;
}

// Edamam API ophalen
async function fetchRecipes(query) {
    try {
        const appId = "6497d4b5";
        const appKey = "030438b0ae6eccd53c24c5040dc23cfc";
        const userId = "manonkeeman";

        const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${appId}&app_key=${appKey}`;

        const response = await axios.get(url, {
            headers: {
                Accept: "application/json",
                "Edamam-Account-User": userId,
            },
        });

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Data opgehaald:", response.data);
        return response.data;
    } catch (e) {
        console.error("Fout bij het ophalen van recepten:", e);
    }
}

// Hoofdcomponent van de app
function App() {
    useEffect(() => {
        fetchRecipes("pasta");
    }, []);

    return (
        <AuthProvider>
            <Navigatie />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/register"
                    element={
                        <PrivateRoute>
                            <Register />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;