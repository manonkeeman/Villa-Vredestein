import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./NotFound.css";

export default function NotFound() {
    return (
        <main className="not-found">
            <Helmet>
                <title>404, Pagina niet gevonden | Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="not-found-content">
                <h1>404</h1>
                <h2>Pagina niet gevonden</h2>
                <p>Deze pagina bestaat niet (meer).</p>
                <Link to="/" className="not-found-button">Terug naar home</Link>
            </div>
        </main>
    );
}