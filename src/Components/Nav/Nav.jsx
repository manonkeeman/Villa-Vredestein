import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaUser } from "react-icons/fa";
import { useAuth } from "../../Pages/Auth/AuthContext.jsx";
import "./Nav.css";

const Nav = () => {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const isLoginPage = location.pathname === "/login";
    const ALLOW_LOGOUT_MENU = ["/studentdashboard", "/receptenzoeker"];
    const showLogoutDropdown = isLoggedIn && ALLOW_LOGOUT_MENU.includes(location.pathname);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navigatie-container">
            {/* Logo */}
            <div className="logo">
                <NavLink to="/contact" className="logo-link">
                    <img src="/VVLogo.png" alt="Villa Vredestein Logo" className="logo-img" />
                </NavLink>
            </div>

            {/* Hamburger button (alleen zichtbaar op mobiel) */}
            <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>

            {/* Navigatielinks */}
            <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
                <li><NavLink to="/" className="default-link" onClick={() => setMenuOpen(false)}>Home</NavLink></li>
                <li><NavLink to="/about" className="default-link" onClick={() => setMenuOpen(false)}>About</NavLink></li>
                <li><NavLink to="/contact" className="default-link" onClick={() => setMenuOpen(false)}>Contact</NavLink></li>
                <li>
                    <a href="https://www.instagram.com/villa.vredestein" target="_blank" rel="noreferrer" className="icon-link">
                        <FaInstagram />
                    </a>
                </li>
                <li>
                    <a href="https://wa.me/31625015299" target="_blank" rel="noreferrer" className="icon-link">
                        <FaWhatsapp />
                    </a>
                </li>
                {showLogoutDropdown ? (
                    <li className="user-icon-wrapper">
                        <FaUser className="user-icon" onClick={() => setDropdownOpen(!dropdownOpen)} />
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <button className="logout-button" onClick={handleLogout}>Uitloggen</button>
                            </div>
                        )}
                    </li>
                ) : (
                    <li>
                        <NavLink to="/login" className="icon-link" onClick={() => setMenuOpen(false)}>
                            <FaUser />
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Nav;