export const handleOutsideClick = (e, onClose, className = "modal-overlay") => {
    if (e.target.classList.contains(className)) {
        onClose();
    }
};

export const addResponsiveResizeListener = (setToonFilters) => {
    const handleResize = () => {
        setToonFilters(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initieel uitvoeren

    return () => window.removeEventListener("resize", handleResize);
};

export const toggleItemInArray = (item, array, setArray) => {
    if (array.includes(item)) {
        setArray(array.filter((i) => i !== item));
    } else {
        setArray([...array, item]);
    }
};