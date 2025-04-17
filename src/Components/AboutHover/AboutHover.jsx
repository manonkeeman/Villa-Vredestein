import React from "react";
import PropTypes from "prop-types";
import "./AboutHover.css";

const AboutHover = ({ title, text, image }) => {
    return (
        <div className={`about-card ${image ? "with-hover-image" : ""}`}>
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