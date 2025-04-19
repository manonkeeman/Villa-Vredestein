import React from "react";
import PropTypes from "prop-types";
import "./AboutHover.css";

const getImageClass = (image) => {
    if (image.includes("VillaVredestein2024")) return "image-villa1";
    if (image.includes("VillaVredestein1910")) return "image-villa2";
    if (image.includes("WonenenWerkeninVredestein")) return "image-villa4";
    if (image.includes("VillaVredesteinGlazenBol")) return "image-villa7";
    return "";
};

const AboutHover = ({ title, text, image }) => {
    const extraClass = getImageClass(image || "");

    return (
        <div className={`about-card ${image ? "with-hover-image" : ""} ${extraClass}`}>
            <h2>{title}</h2>
            <p>{text}</p>

            {image && (
                <div
                    className="hover-image"
                    style={{ backgroundImage: `url(${image})` }}
                ></div>
            )}
        </div>
    );
};

AboutHover.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    image: PropTypes.string,
};

export default AboutHover;

