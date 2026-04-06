import React from "react";
import { Helmet } from "react-helmet-async";

export default function AdminDashboard() {
    return (
        <div style={{ padding: 24 }}>
            <Helmet>
                <title>Beheer — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <h1>Admin dashboard</h1>
            <p>Hier komt het beheer-dashboard (users, rooms, invoices, taken).</p>
        </div>
    );
}