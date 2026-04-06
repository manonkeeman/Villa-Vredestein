import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import "./ModalContactForm.css";

const ModalContactForm = ({ show, onClose }) => {
    const { t } = useTranslation();
    const closeRef = useRef(null);

    useEffect(() => {
        if (!show) return;
        closeRef.current?.focus();
        const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h3 id="modal-title">{t("contact.form.successTitle")}</h3>
                <p>{t("contact.form.successMessage")}</p>
                <p className="modal-groet">{t("contact.form.signature")}</p>
                <button className="modal-button" ref={closeRef} onClick={onClose}>
                    {t("contact.form.close")}
                </button>
            </div>
        </div>
    );
};

ModalContactForm.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ModalContactForm;