import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    const paginas = [
        { to: "/", label: t("nav.home") },
        { to: "/galerij", label: "Galerij" },
        { to: "/tijdlijn", label: "Tijdlijn" },
        { to: "/verhaal", label: "Het Verhaal" },
        { to: "/ruimtes", label: "De Ruimtes" },
        { to: "/omgeving", label: "Omgeving" },
        { to: "/verblijven", label: "Verblijven" },
        { to: "/in-de-pers", label: "In de pers" },
        { to: "/contact", label: t("nav.contact") },
    ];

    return (
        <footer className="site-footer" aria-label="Sitefooter">
            <div className="footer-accent-line" aria-hidden="true" />

            <div className="footer-inner">

                {/* Brand */}
                <div className="footer-brand">
                    <NavLink to="/" aria-label="Villa Vredestein – naar homepage" className="footer-brand-logo-link">
                        <img src="/VVLogo.png" alt="Villa Vredestein logo" className="footer-logo" width="52" height="52" />
                    </NavLink>
                    <div className="footer-brand-text">
                        <p className="footer-name">Villa Vredestein</p>
                        <p className="footer-tagline">{t("footer.tagline")}</p>
                        <p className="footer-brand-desc">
                            Verblijf, restauratie en een open deur.
                        </p>
                    </div>
                </div>

                {/* Navigatie */}
                <div className="footer-col">
                    <h3 className="footer-heading">{t("footer.links")}</h3>
                    <ul className="footer-links">
                        {paginas.map((link) => (
                            <li key={link.to}>
                                <NavLink to={link.to} end={link.to === "/"}>{link.label}</NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div className="footer-col">
                    <h3 className="footer-heading">{t("footer.contactTitle")}</h3>
                    <address className="footer-address">
                        <span className="footer-address-row">
                            <FiMapPin aria-hidden="true" />
                            <span>
                                Hoofdstraat 147<br />
                                3975 ED Driebergen-Rijsenburg
                            </span>
                        </span>
                        <a
                            href="https://www.instagram.com/villa.vredestein"
                            target="_blank"
                            rel="noreferrer"
                            className="footer-address-row"
                        >
                            <FaInstagram aria-hidden="true" />
                            <span>@villa.vredestein</span>
                        </a>
                        <a
                            href="https://wa.me/31625015299"
                            target="_blank"
                            rel="noreferrer"
                            className="footer-address-row"
                        >
                            <FaWhatsapp aria-hidden="true" />
                            <span>WhatsApp</span>
                        </a>
                    </address>
                </div>

            </div>

            {/* Bottombar */}
            <div className="footer-bottom">
                <p>© {year} Villa Vredestein — {t("footer.copyright")}</p>
                <p>
                    <NavLink to="/privacy" className="footer-privacy-link">Privacybeleid</NavLink>
                    {" · "}
                    {t("footer.madeBy")}{" "}
                    <a href="https://www.manonit.com" target="_blank" rel="noreferrer">
                        ManonIT
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
