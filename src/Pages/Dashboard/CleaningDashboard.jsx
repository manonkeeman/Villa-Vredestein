import React from "react";
import { Helmet } from "react-helmet-async";

export default function CleaningDashboard() {
    return (
        <div style={{ padding: 24 }}>
            <Helmet>
                <title>Schoonmaak — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <h1>Schoonmaak dashboard</h1>
            <p>Hier komt het schoonmaakoverzicht (taken, meldingen, planning).</p>
        </div>
    );
}