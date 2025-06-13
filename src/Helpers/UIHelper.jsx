/* Sluit de modal als er buiten het modalvenster wordt geklikt. */
export const handleOutsideClick = (e, onClose) => {
    if (e.target.classList.contains("modal-overlay")) {
        onClose();
    }
};

/* Resize observer die toggles aanpast op basis van schermgrootte. */
export const handleResponsiveToggle = (setToonFilters) => {
    const handleResize = () => {
        setToonFilters(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
};