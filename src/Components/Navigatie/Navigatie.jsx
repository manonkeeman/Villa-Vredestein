import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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

        {/* Navigatielinks */}
        <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
          <li><NavLink to="/" className="default-link">Home</NavLink></li>
          <li><NavLink to="/about" className="default-link">About</NavLink></li>
          <li><NavLink to="/contact" className="default-link">Contact</NavLink></li>
          <li><NavLink to="/login" className="default-link">Login</NavLink></li>
          {isLoggedIn && (
              <>
                <li><NavLink to="/register" className="default-link">Dashboard</NavLink></li>
                <li><button onClick={logout} className="default-link">Logout</button></li>
              </>
          )}
        </ul>
      </nav>
  );
}