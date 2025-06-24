import React from "react";
import PropTypes from "prop-types";
import "./ModalContactForm.css";

const ModalContactForm = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h3>Bedankt voor je bericht!</h3>
                <p>
                    We hebben uw bericht goed ontvangen <br /> en zullen gauw contact opnemen.</p>
                <p className="modal-groet">Hartelijke groet,<br />Manon & Maxim</p>
                <button className="modal-button" onClick={onClose}>Sluiten</button>
            </div>
        </div>
    );
};

ModalContactForm.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ModalContactForm;