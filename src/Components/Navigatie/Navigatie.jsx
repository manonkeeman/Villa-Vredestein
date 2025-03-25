import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaUser } from "react-icons/fa";
import "./Navigatie.css";
import Logo from "./VV Logo.png";

const Navigatie = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        if (menuOpen) {
            setMenuOpen(false);
        }
    }, [location]);

    return (
        <nav className="navigatie-container">
            <div className="logo">
                <NavLink to="/contact" className="logo-link">
                    <img src={Logo} alt="Villa Vredestein Logo" className="logo-img"/>
                </NavLink>
            </div>

            <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
                <li><NavLink to="/" className="default-link" onClick={() => setMenuOpen(false)}>Home</NavLink></li>
                <li><NavLink to="/about" className="default-link" onClick={() => setMenuOpen(false)}>About</NavLink>
                </li>
                <li><NavLink to="/contact" className="default-link" onClick={() => setMenuOpen(false)}>Contact</NavLink>
                </li>
                <li>
                    <a href="https://www.instagram.com/villa.vredestein" target="_blank" rel="noopener noreferrer"
                       className="icon-link">
                        <FaInstagram/>
                    </a>
                </li>
                <li>
                    <a href="https://wa.me/31625015299" target="_blank" rel="noopener noreferrer" className="icon-link">
                        <FaWhatsapp/>
                    </a>
                </li>
                <li>
                    <NavLink to="/login" className="icon-link">
                        <FaUser/>
                    </NavLink>
                </li>
            </ul>

            <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
        </nav>
    );
};

export default Navigatie;