import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaUser } from "react-icons/fa";
import { useAuth } from "../Auth/AuthContext";
import "./Navigatie.css";
import Logo from "../../Assets/Images/VVLogo.png";

const Navigatie = () => {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navigatie-container">
            <div className="logo">
                <NavLink to="/contact" className="logo-link">
                    <img src={Logo} alt="Villa Vredestein Logo" className="logo-img" />
                </NavLink>
            </div>

            <ul className="nav-links">
                <li><NavLink to="/" className="default-link">Home</NavLink></li>
                <li><NavLink to="/about" className="default-link">About</NavLink></li>
                <li><NavLink to="/contact" className="default-link">Contact</NavLink></li>
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
                {isLoggedIn && !isLoginPage ? (
                <li className="user-icon-wrapper">
                    <FaUser className="user-icon" onClick={() => setDropdownOpen(!dropdownOpen)} />
                    {dropdownOpen &&  (
                        <div className="dropdown-menu">
                            <button className="logout-button" onClick={handleLogout}>Uitloggen</button>
                        </div>
                    )}
                </li>
                    ) : (
                    <li>
                        <NavLink to="/login" className="icon-link">
                            <FaUser />
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navigatie;