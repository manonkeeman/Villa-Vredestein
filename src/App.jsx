import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header.jsx";
import "./App.css";

import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Login from "./Pages/Login.jsx";
import StudentDashboard from "./Pages/StudentDashboard.jsx";
import Receptenzoeker from "./Pages/Receptenzoeker.jsx";
import NotFound from "./Pages/NotFound.jsx";
import ProtectedRoute from "./Components/Auth/ProtectedRoute.jsx";

function App() {
    return (
        <>
            <Header />
            <Routes>
                {/* Publieke routes */}
                <Route index element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />

                {/* Beveiligde routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/receptenzoeker"
                    element={
                        <ProtectedRoute>
                            <Receptenzoeker />
                        </ProtectedRoute>
                    }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;