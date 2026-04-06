import React from "react";
import "./Button.css";
import PropTypes from "prop-types";
import { FaArrowRight } from "react-icons/fa";

const Button = ({
                    text,
                    onClick,
                    type = "button",
                    variant = "primary",
                    className = "",
                    disabled = false,
                }) => {
    const getClassName = () => {
        switch (variant) {
            case "link":
                return "btn-link";
            case "secundary":
            case "secondary":
                return "btn-secundary";
            case "round":
                return "btn-round";
            case "primary":
            default:
                return "btn-primary";
        }
    };

    return (
        <button
            className={`${getClassName()} ${className}`.trim()}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {variant === "secundary" || variant === "secondary" ? (
                <>
                    {text} <FaArrowRight size={16} className="btn-arrow" />
                </>
            ) : variant === "round" ? (
                "→"
            ) : (
                text
            )}
        </button>
    );
};

Button.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
    variant: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default Button;