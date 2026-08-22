import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Nav from "./Components/Nav/Nav";
import Footer from "./Components/Footer/Footer";
import CookieConsent from "./Components/CookieConsent/CookieConsent";
import Home from "./Pages/Public/Home";
import Contact from "./Pages/Public/Contact";
import NotFound from "./Pages/Public/NotFound";
import About from "./Pages/Public/About";
import Blog from "./Pages/Public/Blog";
import Tijdlijn from "./Pages/Public/Tijdlijn";
import OverOns from "./Pages/Public/OverOns";
import GalerijVilla from "./Pages/Public/GalerijVilla";
import Omgeving from "./Pages/Public/Omgeving";
import Verblijven from "./Pages/Public/Verblijven";
import Plattegrond from "./Pages/Public/Plattegrond";
import InDePers from "./Pages/Public/InDePers";
import Privacy from "./Pages/Public/Privacy";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

function TrackPageView() {
    const location = useLocation();
    useEffect(() => {
        if (typeof window.gtag === "function") {
            window.gtag("event", "page_view", {
                page_path: location.pathname + location.search,
                page_location: window.location.href,
            });
        }
    }, [location]);
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

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <TrackPageView />
            <BackToTopBtn />
            <Nav />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
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

                <Route path="*" element={<NotFound />} />
            </Routes>

            <Footer />
            <CookieConsent />
        </BrowserRouter>
    );
}

export default App;