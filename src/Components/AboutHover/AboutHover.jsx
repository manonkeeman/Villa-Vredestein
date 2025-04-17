import React from "react";
import PropTypes from "prop-types";
import "./AboutHover.css";

const AboutHover = ({ title, text, image, video }) => {
    return (
        <div className={`about-card ${image || video ? "with-hover-image" : ""}`}>
            <h2>{title}</h2>
            <p>{text}</p>

            {image && (
                <div
                    className="hover-image"
                    style={{ backgroundImage: `url(${image})` }}
                ></div>
            )}

            {video && (
                <video
                    className="hover-image"
                    src={video}
                    muted
                    autoPlay
                    loop
                    playsInline
                />
            )}
        </div>
    );
};

AboutHover.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    image: PropTypes.string,
    video: PropTypes.string,
};

export default AboutHover;