import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigatie from "./Components/Navigatie/Navigatie.jsx";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Login from "./Pages/Login.jsx";
import StudentDashboard from "./Pages/StudentDashboard.jsx";
import Receptenzoeker from "./Pages/Receptenzoeker.jsx";
import NotFound from "./Pages/NotFound.jsx";
import { AuthProvider } from "./Components/Auth/AuthContext";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";

function App() {
    return (
        <>
            <Navigatie />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                <Route
                    path="/login"
                    element={
                        <AuthProvider>
                            <Login />
                        </AuthProvider>
                    }
                />
                <Route
                    path="/studentdashboard"
                    element={
                        <AuthProvider>
                            <ProtectedRoute>
                                <StudentDashboard />
                            </ProtectedRoute>
                        </AuthProvider>
                    }
                />
                <Route
                    path="/receptenzoeker"
                    element={
                        <AuthProvider>
                            <ProtectedRoute>
                                <Receptenzoeker />
                            </ProtectedRoute>
                        </AuthProvider>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;