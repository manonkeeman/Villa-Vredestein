import React from "react";
import { FiArrowUpCircle, FiGlobe } from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>
                    © {new Date().getFullYear()} Villa Vredestein | Alle rechten voorbehouden
                </p>
                <p>Design & Code | Manon Keeman</p>
                <div className="footer-icons">
                    <a
                        href="https://manonkeeman.nl"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Website"
                    >
                        <FiGlobe />
                    </a>
                    <a
                        href="#top"
                        className="scroll-top"
                        aria-label="Scroll to top"
                    >
                        <FiArrowUpCircle />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
