import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const [langOpen, setLangOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoClicked, setLogoClicked] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const langRef = useRef(null);
    const navLinksId = "nav-links-menu";

    const currentLang = i18n.language?.split("-")[0] || "nl";

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Escape closes everything
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setLangOpen(false);
                setMenuOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    const handleLangChange = (code) => {
        i18n.changeLanguage(code);
        setLangOpen(false);
    };

    const handleLogoClick = () => {
        setLogoClicked(true);
        setTimeout(() => setLogoClicked(false), 1000);
    };

    const closeAll = () => { setMenuOpen(false); };

    return (
        <nav className={`navigatie-container ${scrolled ? "nav-scrolled" : "nav-transparent"}`} aria-label="Hoofdnavigatie">
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
                    <NavLink to="/" className="default-link" onClick={closeAll} end>
                        {t("nav.home")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/tijdlijn" className="default-link" onClick={closeAll}>
                        {t("nav.tijdlijn")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/galerij" className="default-link" onClick={closeAll}>
                        {t("nav.galerij")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/omgeving" className="default-link" onClick={closeAll}>
                        {t("nav.omgeving")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/verblijven" className="default-link nav-highlight" onClick={closeAll}>
                        {t("nav.verblijven")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/verhaal" className="default-link" onClick={closeAll}>
                        {t("nav.overons")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/in-de-pers" className="default-link" onClick={closeAll}>
                        {t("nav.indepers")}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/contact" className="default-link" onClick={closeAll}>
                        {t("nav.contact")}
                    </NavLink>
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
            </ul>
        </nav>
    );
};

export default Nav;
