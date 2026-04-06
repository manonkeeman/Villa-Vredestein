import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import "./Footer.css";

const Footer = () => {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    const blogSlugs = [
        "villa-vredestein",
        "geschiedenis",
        "restauratie",
        "omgeving",
        "over-ons",
        "bezoek-inspiratie",
    ];

    const blogs = t("blogs", { returnObjects: true });

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

                {/* Kolom 2 — Navigatie + Blogs */}
                <div className="footer-col">
                    <h3 className="footer-heading">{t("footer.links")}</h3>
                    <nav aria-label="Footer navigatie">
                        <ul className="footer-links">
                            <li><NavLink to="/">{t("nav.home")}</NavLink></li>
                            <li><NavLink to="/about">{t("nav.about")}</NavLink></li>
                            <li><NavLink to="/contact">{t("nav.contact")}</NavLink></li>
                        </ul>
                    </nav>
                    <ul className="footer-links footer-blogs-list">
                        {Array.isArray(blogs) && blogSlugs.map((slug) => {
                            const blog = blogs.find((b) => b.slug === slug);
                            return blog ? (
                                <li key={slug}>
                                    <NavLink to={`/blog/${slug}`}>{blog.title}</NavLink>
                                </li>
                            ) : null;
                        })}
                    </ul>
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