import React from "react";
import { FiArrowUpCircle } from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="footer-copy">
                    © {currentYear} Villa Vredestein | Alle rechten voorbehouden{" "}
                    <a href="#top" className="scroll-up-inline" aria-label="Scroll naar boven">
                        <FiArrowUpCircle className="arrow-icon-inline" />
                    </a>
                </p>
                <p className="footer-design">
                    Design & Code |{" "}
                    <a
                        href="https://manonkeeman.nl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                    >
                        Manon Keeman
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;