import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaInstagram, FaWhatsapp, FaUser } from "react-icons/fa";
import "./Navigatie.css";

export default function Navigatie() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useAuth();
    const location = useLocation();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    // Sluit menu bij klik op een link
    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    return (
        <nav className="navigatie-container">
            <h3 className="logo">Villa Vredestein</h3>

            {/* Hamburger-menu icoon zichtbaar op mobiel */}
            <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>

            {/* Navigatielinks met iconen */}
            <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
                <li><NavLink to="/" className="default-link">Home</NavLink></li>
                <li><NavLink to="/about" className="default-link">About</NavLink></li>
                <li><NavLink to="/contact" className="default-link">Contact</NavLink></li>

                {/* Social media icons */}
                <li>
                    <a href="https://www.instagram.com/villa.vredestein" target="_blank" rel="noopener noreferrer" className="icon-link">
                        <FaInstagram />
                    </a>
                </li>
                <li>
                    <a href="https://wa.me/31625015299" target="_blank" rel="noopener noreferrer" className="icon-link">
                        <FaWhatsapp />
                    </a>
                </li>

                {/* User icon linking to login */}
                <li>
                    <NavLink to="/login" className="icon-link">
                        <FaUser />
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}