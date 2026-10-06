import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./NotFound.css";
import { useContent } from "../../i18n/content";

export default function NotFound() {
    const tc = useContent();
    return (
        <main className="not-found">
            <Helmet>
                <title>{tc("404, Pagina niet gevonden | Villa Vredestein")}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="not-found-content">
                <h1>404</h1>
                <h2>{tc("Pagina niet gevonden")}</h2>
                <p>{tc("Deze pagina bestaat niet (meer).")}</p>
                <Link to="/" className="not-found-button">{tc("Terug naar home")}</Link>
            </div>
        </main>
    );
}