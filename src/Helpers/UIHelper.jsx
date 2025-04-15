/*Sluit de modal als er buiten het modal venster wordt geklikt.*/

export const handleOutsideClick = (e, onClose) => {
    if (e.target.classList.contains("modal-overlay")) {
        onClose();
    }
};

/* Toggle een waarde in een checkbox-lijst (zoals filters).*/

export const toggleCheckbox = (value, selectedValues, setSelected) => {
    const updated = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
    setSelected(updated);
};

/* Resize observer die toggles aanpast op basis van schermgrootte.*/

export const handleResponsiveToggle = (setToonFilters) => {
    const handleResize = () => {
        setToonFilters(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
};