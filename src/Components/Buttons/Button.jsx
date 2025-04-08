import React from "react";
import "./Button.css";
import PropTypes from "prop-types";
<<<<<<< HEAD
import { ArrowRight } from "lucide-react";
=======
>>>>>>> bd7a647afdf0b6d1d6d7f93d53e07b011ae3e781

const Button = ({ text, onClick, type = "button", variant = "primary" }) => {
    const getClassName = () => {
        switch (variant) {
            case "link":
                return "btn-link";
<<<<<<< HEAD
            case "secundary":
                return "btn-secundary";
            default:
                return "btn-primary";
=======
            case "round":
                return "btn-round";
            default:
                return "custom-button";
>>>>>>> bd7a647afdf0b6d1d6d7f93d53e07b011ae3e781
        }
    };

    return (
        <button className={getClassName()} onClick={onClick} type={type}>
<<<<<<< HEAD
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

=======
            {variant === "round" ? "→" : text}
        </button>
    );
};
>>>>>>> bd7a647afdf0b6d1d6d7f93d53e07b011ae3e781
export default Button;

Button.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
    variant: PropTypes.string,
};