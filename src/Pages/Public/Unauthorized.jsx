import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Unauthorized() {
    const location = useLocation();
    const info = location.state;

    return (
        <main style={{ padding: 24 }}>
            <h1>403 - Geen toegang</h1>
            <p>Je hebt niet de juiste rechten om deze pagina te bekijken.</p>

            {info?.required && (
                <pre style={{ marginTop: 16, padding: 16, background: "#111", color: "#fff", borderRadius: 12 }}>
          required: {JSON.stringify(info.required, null, 2)}
                    {"\n"}userRoles: {JSON.stringify(info.userRoles, null, 2)}
        </pre>
            )}

            <p style={{ marginTop: 16 }}>
                <Link to="/">Terug naar home</Link> · <Link to="/login">Naar login</Link>
            </p>
        </main>
    );
}