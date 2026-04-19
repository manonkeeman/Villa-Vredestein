import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../Pages/Auth/AuthContext.jsx";
import "./Nav.css";

const LANGUAGES = [
    { code: "nl", label: "NL" },
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "de", label: "DE" },
    { code: "es", label: "ES" },
    { code: "it", label: "IT" },
];

const hasRole = (user, role) => {
    const roles = user?.roles || [];
    const normalized = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return roles.includes(normalized);
};

const Nav = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoClicked, setLogoClicked] = useState(false);

    const userRef = useRef(null);
    const langRef = useRef(null);
    const navLinksId = "nav-links-menu";

    const currentLang = i18n.language?.split("-")[0] || "nl";

    const dashboardHome = hasRole(user, "ADMIN")
        ? "/admin"
        : hasRole(user, "CLEANER")
            ? "/cleaning"
            : "/student";

    // Close all dropdowns on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (userRef.current && !userRef.current.contains(e.target)) setDropdownOpen(false);
            if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Escape closes everything
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setDropdownOpen(false);
                setLangOpen(false);
                setMenuOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate("/login");
    };

    const handleLangChange = (code) => {
        i18n.changeLanguage(code);
        setLangOpen(false);
    };

    const handleLogoClick = () => {
        setLogoClicked(true);
        setTimeout(() => setLogoClicked(false), 1000);
    };

    const closeAll = () => { setMenuOpen(false); setDropdownOpen(false); };

    return (
        <nav className="navigatie-container" aria-label="Hoofdnavigatie">
            {/* Logo */}
            <div className="logo">
                <NavLink to="/" className="logo-link" onClick={handleLogoClick}>
                    <img
                        src="/VVLogo.png"
                        alt="Villa Vredestein Logo"
                        className={`logo-img ${logoClicked ? "clicked" : ""}`}
                        width="100"
                        height="100"
                    />
                </NavLink>
            </div>

            {/* Hamburger */}
            <button
                className={`hamburger ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-controls={navLinksId}
                aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
            >
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </button>

            {/* Navigatielinks */}
            <ul id={navLinksId} className={`nav-links ${menuOpen ? "show" : ""}`} role="list">
                <li>
                    <NavLink to="/" className="default-link" onClick={closeAll}>
                        {t("nav.home")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about" className="default-link" onClick={closeAll}>
                        {t("nav.about")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/contact" className="default-link" onClick={closeAll}>
                        {t("nav.contact")}
                    </NavLink>
                </li>
                <li>
                    <a href="https://www.instagram.com/villa.vredestein" target="_blank" rel="noreferrer"
                        className="icon-link" aria-label="Villa Vredestein op Instagram">
                        <FaInstagram aria-hidden="true" />
                    </a>
                </li>
                <li>
                    <a href="https://wa.me/31625015299" target="_blank" rel="noreferrer"
                        className="icon-link" aria-label="Contact via WhatsApp">
                        <FaWhatsapp aria-hidden="true" />
                    </a>
                </li>

                {/* Taalkiezer */}
                <li className="lang-switcher-wrapper" ref={langRef}>
                    <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}
                        aria-expanded={langOpen} aria-label="Taal kiezen">
                        {currentLang.toUpperCase()}
                        <span className="lang-caret" aria-hidden="true">▾</span>
                    </button>
                    {langOpen && (
                        <ul className="lang-dropdown" role="menu" aria-label="Beschikbare talen">
                            {LANGUAGES.map((lang) => (
                                <li key={lang.code} role="none">
                                    <button role="menuitem"
                                        className={`lang-option ${currentLang === lang.code ? "active" : ""}`}
                                        onClick={() => handleLangChange(lang.code)}
                                        lang={lang.code}>
                                        {lang.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>

                {/* User icon — login of uitloggen */}
                <li ref={userRef}>
                    {isLoggedIn ? (
                        <div className="user-icon-wrapper">
                            <button className="user-icon-btn" onClick={() => setDropdownOpen(o => !o)}
                                aria-expanded={dropdownOpen} aria-label="Gebruikersmenu">
                                <FaUser aria-hidden="true" />
                            </button>
                            {dropdownOpen && (
                                <div className="dropdown-menu" role="menu">
                                    <button className="logout-button" role="menuitem" onClick={handleLogout}>
                                        Uitloggen
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <NavLink to="/login" className="icon-link" onClick={closeAll} aria-label="Inloggen">
                            <FaUser aria-hidden="true" />
                        </NavLink>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Nav;
