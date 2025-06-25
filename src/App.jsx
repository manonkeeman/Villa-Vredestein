import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Nav from "./Components/Nav/Nav.jsx";
import Footer from "./Components/Footer/Footer.jsx";

import Home from "./Pages/Public/Home.jsx";
import About from "./Pages/Public/About.jsx";
import Contact from "./Pages/Public/Contact.jsx";
import NotFound from "./Pages/Public/NotFound.jsx";

import RegisterUser from "./Pages/Auth/RegisterUser.jsx";
import Login from "./Pages/Auth/Login.jsx";

import { AuthProvider } from "./Pages/Auth/AuthContext.jsx";
import ProtectedRoute from "./Pages/Auth/ProtectedRoute.jsx";

import StudentDashboard from "./Pages/Dashboard/StudentDashboard.jsx";
import RecipeSearch from "./Pages/Dashboard/RecipeSearch.jsx";

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
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterUser />} />

                    <Route
                        path="/student/:id"
                        element={
                            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN"]}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recipes"
                        element={
                            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
                                <RecipeSearch />
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