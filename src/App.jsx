import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import PWAInstallBanner from "./Components/PWAInstallBanner/PWAInstallBanner.jsx";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}
import { AuthProvider } from "./Pages/Auth/AuthContext.jsx";
import ProtectedRoute from "./Pages/Auth/ProtectedRoute.jsx";
import Nav from "./Components/Nav/Nav.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Home from "./Pages/Public/Home.jsx";
import About from "./Pages/Public/About.jsx";
import Contact from "./Pages/Public/Contact.jsx";
import Unauthorized from "./Pages/Public/Unauthorized.jsx";
import Blog from "./Pages/Public/Blog.jsx";
import Login from "./Pages/Auth/Login.jsx";
import RegisterUser from "./Pages/Auth/RegisterUser.jsx";
import StudentDashboard from "./Pages/Dashboard/StudentDashboard.jsx";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard.jsx";
import CleaningDashboard from "./Pages/Dashboard/CleaningDashboard.jsx";
import ProfilePage from "./Pages/Dashboard/ProfilePage.jsx";
import NoodlijstPage from "./Pages/Dashboard/NoodlijstPage.jsx";
import HuisregelsPage from "./Pages/Dashboard/HuisregelsPage.jsx";
import SchoonmaakschemaPage from "./Pages/Dashboard/SchoonmaakschemaPage.jsx";
import BetalingenPage from "./Pages/Dashboard/BetalingenPage.jsx";
import AdminBetalingenPage from "./Pages/Dashboard/AdminBetalingenPage.jsx";
import EventsPage from "./Pages/Dashboard/EventsPage.jsx";
import SamenEtenPage from "./Pages/Dashboard/SamenEtenPage.jsx";
import PaymentSuccessPage from "./Pages/Public/PaymentSuccessPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ScrollToTop />
                <Nav />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/blog/:slug" element={<Blog />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/registeruser" element={<RegisterUser />} />

                    <Route path="/unauthorized" element={<Unauthorized />} />

                    <Route
                        path="/student"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/student/profiel"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/student/noodlijst"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
                                <NoodlijstPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/student/huisregels"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT", "ROLE_ADMIN"]}>
                                <HuisregelsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/student/:id"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/cleaning"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_CLEANER"]}>
                                <CleaningDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/schoonmaakschema"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT", "ROLE_ADMIN", "ROLE_CLEANER"]}>
                                <SchoonmaakschemaPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/student/betalingen"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT", "ROLE_ADMIN"]}>
                                <BetalingenPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/betalingen"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                                <AdminBetalingenPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/student/samen-eten"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT", "ROLE_ADMIN"]}>
                                <SamenEtenPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/student/events"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT", "ROLE_ADMIN"]}>
                                <EventsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/betaling-verwerkt" element={<PaymentSuccessPage />} />

                    <Route path="*" element={<Unauthorized />} />
                </Routes>

                <Footer />
                <PWAInstallBanner />

            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;