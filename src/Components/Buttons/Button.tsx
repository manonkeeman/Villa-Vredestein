import "./Button.css";
import { FaArrowRight } from "react-icons/fa";

type ButtonVariant = "primary" | "secondary" | "link" | "round";

interface ButtonProps {
    text?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: ButtonVariant;
    className?: string;
    disabled?: boolean;
}

const Button = ({
    text,
    onClick,
    type = "button",
    variant = "primary",
    className = "",
    disabled = false,
}: ButtonProps) => {
    const getClassName = (): string => {
        switch (variant) {
            case "link":      return "btn-link";
            case "secondary": return "btn-secundary";
            case "round":     return "btn-round";
            default:          return "btn-primary";
        }
    };

    return (
        <button
            className={`${getClassName()} ${className}`.trim()}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {variant === "secondary" ? (
                <>{text} <FaArrowRight size={16} className="btn-arrow" /></>
            ) : variant === "round" ? "→" : text}
        </button>
    );
};

export default Button;
