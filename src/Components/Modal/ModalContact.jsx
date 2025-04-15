import React from "react";
import PropTypes from "prop-types";
import "./ModalContact.css";

const ModalContact = ({ show, onClose }) => {
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

ModalContact.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ModalContact;