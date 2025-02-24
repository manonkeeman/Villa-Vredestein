import React from 'react';
import './NotFound.css'
import {Link} from "react-router-dom";

function NotFound() {
    return (
        <main className="not-found">
            <h2>Ooops deze pagina wordt niet gevonden</h2>
            <p>Breng me terug naar <Link to="/">Home</Link> Villa Vredestein</p>
        </main>
    );
}

export default NotFound;