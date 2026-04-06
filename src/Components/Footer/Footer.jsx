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

    const col1 = [
        { to: "/", label: t("nav.home") },
        { to: "/about", label: t("nav.about") },
        { to: "/contact", label: t("nav.contact") },
    ];

    const blogSlugs = ["villa-vredestein", "geschiedenis", "restauratie", "omgeving", "over-ons", "bezoek-inspiratie"];
    const blogLinks = Array.isArray(blogs)
        ? blogSlugs.map((slug) => {
              const b = blogs.find((x) => x.slug === slug);
              return b ? { to: `/blog/${slug}`, label: b.title } : null;
          }).filter(Boolean)
        : [];

    const col2 = blogLinks.slice(0, 3);
    const col3 = blogLinks.slice(3);

    return (
        <footer className="site-footer" aria-label="Sitefooter">
            <div className="footer-inner">

                {/* Kolom 1 — Branding */}
                <div className="footer-col footer-brand">
                    <NavLink to="/" aria-label="Villa Vredestein – naar homepage">
                        <img src="/VVLogo.png" alt="Villa Vredestein logo" className="footer-logo" width="80" height="80" />
                    </NavLink>
                    <p className="footer-name">Villa Vredestein</p>
                    <p className="footer-tagline">{t("footer.tagline")}</p>
                </div>

                {/* Kolom 2 — Alle links in 3 sub-kolommen */}
                <div className="footer-col footer-nav-wide">
                    <h3 className="footer-heading">{t("footer.links")}</h3>
                    <nav aria-label="Footer navigatie" className="footer-links-grid">
                        <ul className="footer-links">
                            {col1.map((link) => (
                                <li key={link.to}>
                                    <NavLink to={link.to}>{link.label}</NavLink>
                                </li>
                            ))}
                        </ul>
                        <ul className="footer-links">
                            {col2.map((link) => (
                                <li key={link.to}>
                                    <NavLink to={link.to}>{link.label}</NavLink>
                                </li>
                            ))}
                        </ul>
                        <ul className="footer-links">
                            {col3.map((link) => (
                                <li key={link.to}>
                                    <NavLink to={link.to}>{link.label}</NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Kolom 3 — Contact info */}
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
                    <a href="https://www.manonkeeman.com" target="_blank" rel="noreferrer">
                        Manon Keeman
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;