import React from "react";
import PropTypes from "prop-types";
import "./ModalLink.css";
import { FaWhatsapp, FaShareAlt, FaClipboard } from "react-icons/fa";

const ModalLink = ({ show, onClose, ingredientsList, recipeTitle }) => {
    if (!show) return null;

    const shareText = `Recept: ${recipeTitle}\n\nBoodschappenlijst:\n${ingredientsList
        .split(",")
        .map((item) => `• ${item.trim()}`)
        .join("\n")}`;

    const handleShareSystem = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Boodschappenlijst voor ${recipeTitle}`,
                    text: shareText,
                });
            } else {
                await navigator.clipboard.writeText(shareText);
                alert("Lijst gekopieerd naar het klembord (systeemdeling niet ondersteund).");
            }
        } catch (error) {
            console.error("Fout bij delen:", error);
        }
    };

    const handleShareWhatsapp = () => {
        const encoded = encodeURIComponent(shareText);
        const whatsappUrl = `https://wa.me/?text=${encoded}`;
        window.open(whatsappUrl, "_blank");
    };

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareText);
            alert("Lijst gekopieerd naar het klembord.");
        } catch (error) {
            console.error("Fout bij kopiëren:", error);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Boodschappenlijst voor: {recipeTitle}</h2>
                <ul className="ingredienten-lijst">
                    {ingredientsList.split(",").map((item, i) => (
                        <li key={i}>{item.trim()}</li>
                    ))}
                </ul>

                <div className="share-icons">
                    <button className="icon-button whatsapp" onClick={handleShareWhatsapp} title="Deel via WhatsApp">
                        <FaWhatsapp />
                    </button>
                    <button className="icon-button share" onClick={handleShareSystem} title="Systeemdeling">
                        <FaShareAlt />
                    </button>
                    <button className="icon-button clipboard" onClick={handleCopyToClipboard} title="Kopieer naar klembord">
                        <FaClipboard />
                    </button>
                </div>

                <button className="btn-close" onClick={onClose}>
                    Sluiten
                </button>
            </div>
        </div>
    );
};

ModalLink.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    ingredientsList: PropTypes.string.isRequired,
    recipeTitle: PropTypes.string.isRequired,
};

export default ModalLink;