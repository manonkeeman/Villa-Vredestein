import React from "react";
import "./Button.css";
import PropTypes from "prop-types";
import { FaArrowRight } from "react-icons/fa";

const Button = ({ text, onClick, type = "button", variant = "primary" }) => {
    const getClassName = () => {
        switch (variant) {
            case "link":
                return "btn-link";
            case "secundary":
                return "btn-secundary";
            case "round":
                return "btn-round";
            case "primary":
            default:
                return "btn-primary";
        }
    };

    return (
        <button className={getClassName()} onClick={onClick} type={type}>
            {variant === "secundary" ? (
                <>
                    {text} <FaArrowRight size={16} style={{ marginLeft: "8px" }} />
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
};

export default Button;