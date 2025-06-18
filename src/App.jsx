import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./Components/Nav/Nav.jsx"; // Houd consistent: gebruik 'Nav' overal
import Footer from "./Components/Footer/Footer.jsx";

import Home from "./Pages/Public/Home.jsx";
import About from "./Pages/Public/About.jsx";
import Contact from "./Pages/Public/Contact.jsx";
import NotFound from "./Pages/Public/NotFound.jsx";

import Login from "./Pages/Auth/Login.jsx";
import StudentDashboard from "./Pages/Dashboard/StudentDashboard.jsx";
import Receptenzoeker from "./Pages/Dashboard/RecipeSearch.jsx";

import { AuthProvider } from "./Pages/Auth/AuthContext.jsx";
import ProtectedRoute from "./Pages/Auth/ProtectedRoute.jsx";

import "./Styles/Global.css";

function App() {
    return (
        <AuthProvider>
            <Nav />
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
            <Footer />
        </AuthProvider>
    );
}

export default App;