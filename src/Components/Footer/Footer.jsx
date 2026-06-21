import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    const blogs = t("blogs", { returnObjects: true });

    const paginas = [
        { to: "/", label: t("nav.home") },
        { to: "/verhaal", label: "Het Verhaal" },
        { to: "/galerij-villa", label: "Galerij" },
        { to: "/ruimtes", label: "De Ruimtes" },
        { to: "/omgeving", label: "Omgeving" },
        { to: "/verblijven", label: "Verblijven" },
        { to: "/tijdlijn", label: "Tijdlijn" },
        { to: "/galerij", label: "Historisch archief" },
        { to: "/contact", label: t("nav.contact") },
    ];

    const blogSlugs = ["villa-vredestein", "geschiedenis", "restauratie", "omgeving", "het-boek", "carpe-diem-design", "over-ons", "bezoek-inspiratie"];
    const blogLinks = Array.isArray(blogs)
        ? blogSlugs.map((slug) => {
              const b = blogs.find((x) => x.slug === slug);
              return b ? { to: `/blog/${slug}`, label: b.title } : null;
          }).filter(Boolean)
        : [];

    return (
        <footer className="site-footer" aria-label="Sitefooter">

            {/* Branding — bovenaan, volle breedte */}
            <div className="footer-brand-bar">
                <NavLink to="/" aria-label="Villa Vredestein – naar homepage" className="footer-brand-logo-link">
                    <img src="/VVLogo.png" alt="Villa Vredestein logo" className="footer-logo" width="64" height="64" />
                </NavLink>
                <div className="footer-brand-text">
                    <p className="footer-name">Villa Vredestein</p>
                    <p className="footer-tagline">{t("footer.tagline")}</p>
                </div>
            </div>

            {/* Links — drie kolommen */}
            <div className="footer-inner">

                <div className="footer-col">
                    <h3 className="footer-heading">{t("footer.links")}</h3>
                    <ul className="footer-links">
                        {paginas.map((link) => (
                            <li key={link.to}>
                                <NavLink to={link.to}>{link.label}</NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="footer-col">
                    <h3 className="footer-heading">{t("footer.verhalen")}</h3>
                    <ul className="footer-links">
                        {blogLinks.map((link) => (
                            <li key={link.to}>
                                <NavLink to={link.to}>{link.label}</NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="footer-col">
                    <h3 className="footer-heading">{t("footer.contactTitle")}</h3>
                    <address className="footer-address">
                        <span className="footer-address-row">
                            <FiMapPin aria-hidden="true" />
                            <span>
                                {t("footer.address")}<br />
                                {t("footer.city")}
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
