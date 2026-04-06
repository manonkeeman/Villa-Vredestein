import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./Unauthorized.css";

export default function Unauthorized() {
    return (
        <main className="not-found">
            <Helmet>
                <title>403 — Geen toegang | Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="not-found-content">
                <h1>403</h1>
                <h2>Geen toegang</h2>
                <p>Je hebt niet de juiste rechten om deze pagina te bekijken.</p>
                <Link to="/" className="not-found-button">Terug naar home</Link>
            </div>
        </main>
    );
}