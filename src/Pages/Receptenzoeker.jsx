import React, { useState, useEffect } from "react";
import Watetenwevandaag from "../Assets/Images/Watetenwevandaag.jpg";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import ModalQR from "../Components/Modal/ModalQR";
import { fetchRecipes, buildIngredientsList } from "../Helpers/ApiHelper";
import { handleResponsiveToggle, toggleCheckbox } from "../Helpers/UIHelper";
import "./ReceptenZoeker.css";

const maaltijdOpties = ["breakfast", "lunch", "brunch", "dinner"];
const dieetOpties = [
    "vegetarian",
    "vegan",
    "dairy-free",
    "gluten-free",
    "sugar-conscious",
    "peanut-free",
    "tree-nut-free",
];
const wereldkeukenOpties = [
    "Italian",
    "Greek",
    "South East Asian",
    "Japanese",
    "American",
    "Mexican",
];

const ReceptenZoeker = () => {
    const [zoekwoord, setZoekwoord] = useState("");
    const [recepten, setRecepten] = useState([]);
    const [laden, setLaden] = useState(false);
    const [fout, setFout] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [ingredientsList, setIngredientsList] = useState("");
    const [geselecteerdeMaaltijden, setGeselecteerdeMaaltijden] = useState([]);
    const [geselecteerdeDieet, setGeselecteerdeDieet] = useState([]);
    const [geselecteerdeKeukens, setGeselecteerdeKeukens] = useState([]);
    const [toonFilters, setToonFilters] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => handleResponsiveToggle(setToonFilters);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleZoek = async (e) => {
        e.preventDefault();
        setLaden(true);
        setFout(null);
        try {
            const data = await fetchRecipes(
                zoekwoord,
                geselecteerdeMaaltijden,
                geselecteerdeDieet,
                geselecteerdeKeukens
            );
            setRecepten(data);
        } catch (err) {
            setFout(err.message || "Fout bij het ophalen van recepten.");
        } finally {
            setLaden(false);
        }
    };

    const generateShoppingList = (ingredients) => {
        const ingredientsString = buildIngredientsList(ingredients);
        setIngredientsList(ingredientsString);
        setShowModal(true);
    };

    return (
        <div className="receptenzoeker">
            <button
                className="toggle-filters-btn"
                onClick={() => setToonFilters((prev) => !prev)}
            >
                {toonFilters ? "Verberg filters" : "Toon filters"}
            </button>

            <div className="zoekcontent">
                {toonFilters && (
                    <aside className="filtersidebar">
                        <h4>Menugang</h4>
                        {maaltijdOpties.map((type) => (
                            <label key={type} className="filter-label">
                                <input
                                    type="checkbox"
                                    checked={geselecteerdeMaaltijden.includes(type)}
                                    onChange={() => toggleCheckbox(type, geselecteerdeMaaltijden, setGeselecteerdeMaaltijden)}
                                />
                                {type}
                            </label>
                        ))}

                        <h4>Dieet</h4>
                        {dieetOpties.map((type) => (
                            <label key={type} className="filter-label">
                                <input
                                    type="checkbox"
                                    checked={geselecteerdeDieet.includes(type)}
                                    onChange={() => toggleCheckbox(type, geselecteerdeDieet, setGeselecteerdeDieet)}
                                />
                                {type}
                            </label>
                        ))}

                        <h4>Wereldkeuken</h4>
                        {wereldkeukenOpties.map((type) => (
                            <label key={type} className="filter-label">
                                <input
                                    type="checkbox"
                                    checked={geselecteerdeKeukens.includes(type)}
                                    onChange={() => toggleCheckbox(type, geselecteerdeKeukens, setGeselecteerdeKeukens)}
                                />
                                {type}
                            </label>
                        ))}
                    </aside>
                )}

                <div className="zoekresultaatkolom">
                    <div className="zoekbalk-hero">
                        <img
                            src={Watetenwevandaag}
                            alt="Wat eten we vandaag?"
                            className="zoekbalk-achtergrond"
                        />
                        <form onSubmit={handleZoek} className="zoekbalk-overlay">
                            <input
                                type="text"
                                placeholder="Wat eten we vandaag? Typ een ingrediënt..."
                                value={zoekwoord}
                                onChange={(e) => setZoekwoord(e.target.value)}
                                className="zoekbalk-input"
                            />
                            <button type="submit" className="zoekbalk-button">
                                <FiSearch />
                            </button>
                        </form>
                    </div>

                    <div className="resultaten-wrapper">
                        {laden && <p>Even geduld... recepten worden geladen.</p>}
                        {fout && <p className="fout">{fout}</p>}
                        {!laden && recepten.length === 0 && !fout && (
                            <p>Geen recepten gevonden. Probeer een ander ingrediënt of filter.</p>
                        )}

                        <div className="receptenlijst">
                            {recepten.map((item, index) => (
                                <div key={index} className="recept-card">
                                    <div
                                        className="recept-kop"
                                        onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                                    >
                                        <img src={item.image} alt={item.label} />
                                        <div className="recept-title-overlay">
                                            <h3>{item.label}</h3>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => generateShoppingList(item.ingredients)}
                                        className="btn-primary"
                                    >
                                        <FiShoppingCart style={{ marginRight: "0.5rem" }} />
                                        Boodschappenlijst
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <ModalQR
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    ingredientsList={ingredientsList}
                />
            )}
        </div>
    );
};

export default ReceptenZoeker;