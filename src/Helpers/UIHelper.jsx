export const handleOutsideClick = (e, onClose) => {
    if (e.target.classList.contains("modal-overlay")) {
        onClose();
    }
};

export const handleResponsiveToggle = (setToonFilters) => {
    const handleResize = () => {
        setToonFilters(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
};