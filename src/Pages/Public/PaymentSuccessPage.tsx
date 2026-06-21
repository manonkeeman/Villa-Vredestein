import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiHome } from "react-icons/fi";
import "./PaymentSuccessPage.css";

const PaymentSuccessPage = () => {
    return (
        <div className="payment-success-page">
            <Helmet>
                <title>Betaling verwerkt — Villa Vredestein</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="payment-success-card">
                <FiCheckCircle className="payment-success-icon" />
                <h1>Betaling ontvangen</h1>
                <p>
                    Bedankt voor je betaling! Je factuur wordt zo snel mogelijk verwerkt.
                    Je ontvangt een bevestiging per e-mail.
                </p>
                <Link to="/student/betalingen" className="payment-success-btn">
                    <FiHome /> Terug naar betalingen
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;