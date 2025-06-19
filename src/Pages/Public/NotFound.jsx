import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";
import "../../Styles/Global.css";

function NotFound() {
    return (
        <main className="not-found" role="main" aria-labelledby="notfound-title">
            <section className="not-found-content">
                <header>
                    <h1 id="notfound-title">404</h1>
                    <h2>Oeps, deze pagina bestaat niet</h2>
                </header>
                <p>
                    Geen zorgen – je kunt altijd terug naar de{" "}
                    <Link to="/">homepagina van Villa Vredestein</Link>.
                </p>
            </section>
        </main>
    );
}

export default NotFound;