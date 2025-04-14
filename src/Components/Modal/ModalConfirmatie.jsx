import React from "react";
import PropTypes from "prop-types";
import "./ModalConfirmatie.css";

const ModalConfirmatie = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h3>Bedankt voor uw bericht!</h3>
                <p>
                    Wij zullen zo spoedig mogelijk reageren.
                    <br /><br />
                    Tot ziens!
                </p>
                <p className="modal-groet">Manon en Maxim</p>

                <button className="modal-button" onClick={onClose}>Sluiten</button>
            </div>
        </div>
    );
};

ModalConfirmatie.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ModalConfirmatie;