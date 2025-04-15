import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./ModalQR.css";

const ModalQR = ({ show, onClose, ingredientsList }) => {
    const [QRCodeComponent, setQRCodeComponent] = useState(null);

    useEffect(() => {
        // Dynamisch laden om Vite import issues te vermijden
        import("qrcode.react").then((mod) => {
            setQRCodeComponent(() => mod.QRCode || mod.default); // fallback
        });
    }, []);

    if (!show) return null;

    const lijstItems = ingredientsList
        .split(",")
        .map((item, index) => <li key={index}>{item.trim()}</li>);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h3>Boodschappenlijst</h3>
                <ul>{lijstItems}</ul>

                {QRCodeComponent && (
                    <div className="qr-container">
                        <QRCodeComponent value={ingredientsList} size={180} />
                    </div>
                )}

                <button className="modal-button" onClick={onClose}>Sluiten</button>
            </div>
        </div>
    );
};

ModalQR.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    ingredientsList: PropTypes.string.isRequired,
};

export default ModalQR;