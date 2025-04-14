import React from "react";
import QRCode from "react-qr-code";
import PropTypes from "prop-types";
import "./ModalQRcode.css";

const ModalQRcode = ({ show, onClose, ingredientsList }) => {
    if (!show) return null;

    return (
        <div className="modalQR-overlay" onClick={onClose}>
            <div className="modalQR-box" onClick={(e) => e.stopPropagation()}>
                <h3>Boodschappenlijst QR Code</h3>
                <QRCode value={ingredientsList} size={256} />
                <p>Scan de QR-code om de boodschappenlijst op je telefoon op te slaan!</p>
                <button className="modalQR-button" onClick={onClose}>Sluiten</button>
            </div>
        </div>
    );
};

ModalQRcode.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    ingredientsList: PropTypes.string.isRequired,  // Ingrediëntenlijst als string, geen array
};

export default ModalQRcode;