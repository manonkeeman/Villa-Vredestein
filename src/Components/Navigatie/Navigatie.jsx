import React from 'react';
import { NavLink } from "react-router-dom";
import "./navigatie.css";  // Zorg dat je CSS-bestand is gekoppeld

export default function Navigatie() {
    return (
        <nav className="navigatie-container">
            <h3 className="logo">Villa Vredestein</h3>
            <ul className="nav-links">
                <li><NavLink to="/" className="default-link">Home</NavLink></li>
                <li><NavLink to="/about" className="default-link">About</NavLink></li>
                <li><NavLink to="/contact" className="default-link">Contact</NavLink></li>
                <li><NavLink to="/login" className="default-link">Login</NavLink></li>
            </ul>
        </nav>
    );
}