import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { FaInstagram, FaWhatsapp, FaUser } from "react-icons/fa";
import "./Navigatie.css"; // Zorg dat je CSS-bestand is gekoppeld

export default function Navigatie() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
      <nav className="navigatie-container">
        <h3 className="logo">Villa Vredestein</h3>

        {/* Hamburger-menu voor mobiel */}
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
              <li><NavLink to="/login" className="default-link">Login</NavLink></li>

              {/* Social media icons */}
              <li>
                  <a href="https://www.instagram.com/villavredestein" target="_blank" rel="noopener noreferrer" className="icon-link">
                      <FaInstagram />
                  </a>
              </li>
              <li>
                  <a href="https://wa.me/31625015299" target="_blank" rel="noopener noreferrer" className="icon-link">
                      <FaWhatsapp />
                  </a>
              </li>
              <li>

                  {/* User icon that links to login */}
                  <li>
                      <NavLink to="/login" className="icon-link">
                          <FaUser />
                      </NavLink>
                  </li>
          </ul>
      </nav>
);
}