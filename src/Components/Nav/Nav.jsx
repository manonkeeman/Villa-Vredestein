import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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

const Nav = () => {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoClicked, setLogoClicked] = useState(false);

    const currentLang = i18n.language?.split("-")[0] || "nl";

    const showLogoutDropdown =
        isLoggedIn &&
        (location.pathname.startsWith("/student") ||
            location.pathname.startsWith("/admin") ||
            location.pathname.startsWith("/cleaning"));

    const handleLogout = () => {
        logout();
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
                aria-label="Menu openen"
            >
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </button>

            {/* Navigatielinks */}
            <ul className={`nav-links ${menuOpen ? "show" : ""}`} role="list">
                <li>
                    <NavLink to="/" className="default-link" onClick={() => setMenuOpen(false)}>
                        {t("nav.home")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about" className="default-link" onClick={() => setMenuOpen(false)}>
                        {t("nav.about")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/contact" className="default-link" onClick={() => setMenuOpen(false)}>
                        {t("nav.contact")}
                    </NavLink>
                </li>
                <li>
                    <a
                        href="https://www.instagram.com/villa.vredestein"
                        target="_blank"
                        rel="noreferrer"
                        className="icon-link"
                        aria-label="Villa Vredestein op Instagram"
                    >
                        <FaInstagram aria-hidden="true" />
                    </a>
                </li>
                <li>
                    <a
                        href="https://wa.me/31625015299"
                        target="_blank"
                        rel="noreferrer"
                        className="icon-link"
                        aria-label="Contact via WhatsApp"
                    >
                        <FaWhatsapp aria-hidden="true" />
                    </a>
                </li>

                {/* Taalkiezer */}
                <li className="lang-switcher-wrapper">
                    <button
                        className="lang-btn"
                        onClick={() => setLangOpen(!langOpen)}
                        aria-expanded={langOpen}
                        aria-label="Taal kiezen"
                    >
                        {currentLang.toUpperCase()}
                        <span className="lang-caret" aria-hidden="true">▾</span>
                    </button>
                    {langOpen && (
                        <ul className="lang-dropdown" role="menu" aria-label="Beschikbare talen">
                            {LANGUAGES.map((lang) => (
                                <li key={lang.code} role="none">
                                    <button
                                        role="menuitem"
                                        className={`lang-option ${currentLang === lang.code ? "active" : ""}`}
                                        onClick={() => handleLangChange(lang.code)}
                                        lang={lang.code}
                                    >
                                        {lang.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>

                {showLogoutDropdown ? (
                    <li className="user-icon-wrapper">
                        <FaUser
                            className="user-icon"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            aria-label="Gebruikersmenu"
                            role="button"
                            tabIndex={0}
                        />
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <button className="logout-button" onClick={handleLogout}>
                                    Uitloggen
                                </button>
                            </div>
                        )}
                    </li>
                ) : (
                    <li>
                        <NavLink to="/login" className="icon-link" onClick={() => setMenuOpen(false)} aria-label="Inloggen">
                            <FaUser aria-hidden="true" />
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Nav;