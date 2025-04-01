import React from "react";
import "./Modal.css";

const Modal = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box">
                <h3>Bedankt voor uw bericht!</h3>
                <p>Wij zullen zo spoedig mogelijk reageren.<br /><br />Tot ziens!</p>
                <p className="modal-groet">Manon en Maxim</p>

                <button className="modal-button" onClick={onClose}>Sluiten</button>
            </div>
        </div>
    );
};

export default Modal;