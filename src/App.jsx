import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Nav from "./Components/Nav/Nav.jsx";
import Footer from "./Components/Footer/Footer.jsx";

import Home from "./Pages/Public/Home.jsx";
import About from "./Pages/Public/About.jsx";
import Contact from "./Pages/Public/Contact.jsx";
import NotFound from "./Pages/Public/NotFound.jsx";

import RegisterUser from "./Pages/Auth/RegisterUser.jsx";
import Login from "./Pages/Auth/Login.jsx";
import StudentDashboard from "./Pages/Dashboard/StudentDashboard.jsx";
import Receptenzoeker from "./Pages/Dashboard/RecipeSearch.jsx";

import { AuthProvider } from "./Pages/Auth/AuthContext.jsx";
import ProtectedRoute from "./Pages/Auth/ProtectedRoute.jsx";

import "./Styles/Global.css";

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

function App() {
    return (
        <AuthProvider>
            <ScrollToTop />
            <Nav />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/register" element={<RegisterUser />} />
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/studentdashboard"
                        element={
                            <ProtectedRoute allowedRoles={["BEWONER"]}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/receptenzoeker"
                        element={
                            <ProtectedRoute allowedRoles={["BEWONER", "BEHEERDER"]}>
                                <Receptenzoeker />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/unauthorized"
                        element={
                            <div style={{ textAlign: "center", padding: "2rem", color: "#fcbc2d" }}>
                                <h1>❌ Geen toegang</h1>
                                <p>Je hebt niet de juiste bevoegdheid voor deze pagina.</p>
                            </div>
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