import React from "react";
import "./Button.css";
import PropTypes from "prop-types";

const Button = ({ text, onClick, type = "button", variant = "primary" }) => {
    const getClassName = () => {
        switch (variant) {
            case "link":
                return "btn-link";
            case "round":
                return "btn-round";
            default:
                return "custom-button";
        }
    };

    return (
        <button className={getClassName()} onClick={onClick} type={type}>
            {variant === "round" ? "→" : text}
        </button>
    );
};
export default Button;

Button.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
    variant: PropTypes.string,
};