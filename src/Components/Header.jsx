import React from "react";
import Navigatie from "./Navigatie/Navigatie.jsx";
import "./Navigatie/Navigatie.css";
import "./Header.css";

const Header = () => {
    return (
        <header className="header">
            <Navigatie />
        </header>
    );
};
export default Header;