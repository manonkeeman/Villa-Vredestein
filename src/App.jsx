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
import "./Styles/Global.css";

function App() {
    return (
        <AuthProvider>
            <Navigatie />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/studentdashboard"
                        element={
                            <ProtectedRoute>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/receptenzoeker"
                        element={
                            <ProtectedRoute>
                                <Receptenzoeker />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </AuthProvider>
    );
}

export default App;