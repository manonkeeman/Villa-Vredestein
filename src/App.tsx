import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import PWAInstallBanner from "./Components/PWAInstallBanner/PWAInstallBanner";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

function BackToTopBtn() {
    const [visible, setVisible] = React.useState(false);
    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    if (!visible) return null;
    return (
        <button
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Naar boven"
        >
            ↑
        </button>
    );
}
import { AuthProvider } from "./Pages/Auth/AuthContext";
import ProtectedRoute from "./Pages/Auth/ProtectedRoute";
import Nav from "./Components/Nav/Nav";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Public/Home";
import Contact from "./Pages/Public/Contact";
import Unauthorized from "./Pages/Public/Unauthorized";
import Blog from "./Pages/Public/Blog";
import Login from "./Pages/Auth/Login";
import RegisterUser from "./Pages/Auth/RegisterUser";
import StudentDashboard from "./Pages/Dashboard/StudentDashboard";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import CleaningDashboard from "./Pages/Dashboard/CleaningDashboard";
import ProfilePage from "./Pages/Dashboard/ProfilePage";
import NoodlijstPage from "./Pages/Dashboard/NoodlijstPage";
import HuisregelsPage from "./Pages/Dashboard/HuisregelsPage";
import SchoonmaakschemaPage from "./Pages/Dashboard/SchoonmaakschemaPage";
import BetalingenPage from "./Pages/Dashboard/BetalingenPage";
import AdminBetalingenPage from "./Pages/Dashboard/AdminBetalingenPage";
import AdminBetalingenMatrix from "./Pages/Dashboard/AdminBetalingenMatrix";
import AdminBewonersPage from "./Pages/Dashboard/AdminBewonersPage";
import AdminContractenPage from "./Pages/Dashboard/AdminContractenPage";
import AdminTicketsPage from "./Pages/Dashboard/AdminTicketsPage";
import AdminCommunicatiePage from "./Pages/Dashboard/AdminCommunicatiePage";
import AdminBerichtenPage from "./Pages/Dashboard/AdminBerichtenPage";
import AdminInstellingenPage from "./Pages/Dashboard/AdminInstellingenPage";
import StudentTicketsPage from "./Pages/Dashboard/StudentTicketsPage";
import MededelingenPage from "./Pages/Dashboard/MededelingenPage";
import EventsPage from "./Pages/Dashboard/EventsPage";
import SamenEtenPage from "./Pages/Dashboard/SamenEtenPage";
import PaymentSuccessPage from "./Pages/Public/PaymentSuccessPage";
import Tijdlijn from "./Pages/Public/Tijdlijn";
import OverOns from "./Pages/Public/OverOns";
import GalerijVilla from "./Pages/Public/GalerijVilla";
import Omgeving from "./Pages/Public/Omgeving";
import Verblijven from "./Pages/Public/Verblijven";
import Plattegrond from "./Pages/Public/Plattegrond";
import InDePers from "./Pages/Public/InDePers";
import Privacy from "./Pages/Public/Privacy";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ScrollToTop />
                <BackToTopBtn />
                <Nav />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/blog/:slug" element={<Blog />} />
                    <Route path="/tijdlijn" element={<Tijdlijn />} />
                    <Route path="/over-ons" element={<OverOns />} />
                    <Route path="/verhaal" element={<OverOns />} />
                    <Route path="/in-de-pers" element={<InDePers />} />
                    <Route path="/galerij" element={<GalerijVilla />} />
                    <Route path="/galerij-villa" element={<GalerijVilla />} />
                    <Route path="/omgeving" element={<Omgeving />} />
                    <Route path="/verblijven" element={<Verblijven />} />
                    <Route path="/ruimtes" element={<Plattegrond />} />
                    <Route path="/privacy" element={<Privacy />} />

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
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT", "ROLE_ADMIN"]}>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/student/noodlijst"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT", "ROLE_ADMIN"]}>
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
                        path="/admin/bewoners"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                                <AdminBewonersPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/betaalmatrix"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                                <AdminBetalingenMatrix />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/contracten"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                                <AdminContractenPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/tickets"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                                <AdminTicketsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/communicatie"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                                <AdminCommunicatiePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/berichten"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                                <AdminBerichtenPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/instellingen"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                                <AdminInstellingenPage />
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

                    <Route
                        path="/student/meldingen"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT", "ROLE_ADMIN"]}>
                                <StudentTicketsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/student/mededelingen"
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_STUDENT", "ROLE_ADMIN"]}>
                                <MededelingenPage />
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