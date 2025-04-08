import React from "react";
import "./Button.css";
import PropTypes from "prop-types";
import { ArrowRight } from "lucide-react";

const Button = ({ text, onClick, type = "button", variant = "primary" }) => {
    const getClassName = () => {
        switch (variant) {
            case "link":
                return "btn-link";
            case "secundary":
                return "btn-secundary";
            default:
                return "btn-primary";
        }
    };

    return (
        <button className={getClassName()} onClick={onClick} type={type}>
            {variant === "secundary" ? (
                <>
                    {text} <ArrowRight size={16} style={{ marginLeft: "8px" }} />
                </>
            ) : (
                text
            )}
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