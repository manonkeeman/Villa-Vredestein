import React, { useState } from "react";
import Watetenwevandaag from "../Assets/Images/Watetenwevandaag.jpg";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { fetchRecipes, buildIngredientsList } from "../Helpers/ApiHelper";
import ModalLink from "../Components/Modal/ModalLink";
import "./ReceptenZoeker.css";

const maaltijdOpties = ["Breakfast", "Lunch", "Brunch", "Dinner"];
const dieetOpties = [
    "Vegetarian", "Vegan", "Dairy-free", "Gluten-free",
    "Sugar-conscious", "Peanut-free", "Tree-nut-free",
];
const wereldkeukenOpties = [
    "Italian", "Greek", "South East Asian", "Japanese", "American", "Mexican",
];

const ReceptenZoeker = () => {
    const [zoekwoord, setZoekwoord] = useState("");
    const [recepten, setRecepten] = useState([]);
    const [laden, setLaden] = useState(false);
    const [fout, setFout] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [ingredientsList, setIngredientsList] = useState("");
    const [selectedRecipeTitle, setSelectedRecipeTitle] = useState("");
    const [geselecteerdeMaaltijden, setGeselecteerdeMaaltijden] = useState([]);
    const [geselecteerdeDieet, setGeselecteerdeDieet] = useState([]);
    const [geselecteerdeKeukens, setGeselecteerdeKeukens] = useState([]);

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

    const generateShoppingList = (ingredients, title) => {
        const list = buildIngredientsList(ingredients);
        setIngredientsList(list);
        setSelectedRecipeTitle(title);
        setShowModal(true);
    };

    return (
        <div className="receptenzoeker">
            <div className="receptencontent">
                <div className="zoekresultaatkolom">

                    {/* Hero met image en overlays */}
                    <div className="zoekbalk-hero">
                        <img
                            src={Watetenwevandaag}
                            alt="Wat eten we vandaag?"
                            className="zoekbalk-achtergrond"
                        />

                        {/* Dropdown buttons */}
                        <div className="filter-button-overlay">
                            <div className="filter-dropdown">
                                <select
                                    value={geselecteerdeMaaltijden[0] || ""}
                                    onChange={(e) => setGeselecteerdeMaaltijden([e.target.value])}
                                >
                                    <option value="">Maaltijd ▾</option>
                                    {maaltijdOpties.map((optie) => (
                                        <option key={optie} value={optie}>{optie}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-dropdown">
                                <select
                                    value={geselecteerdeDieet[0] || ""}
                                    onChange={(e) => setGeselecteerdeDieet([e.target.value])}
                                >
                                    <option value="">Dieet ▾</option>
                                    {dieetOpties.map((optie) => (
                                        <option key={optie} value={optie}>{optie}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-dropdown">
                                <select
                                    value={geselecteerdeKeukens[0] || ""}
                                    onChange={(e) => setGeselecteerdeKeukens([e.target.value])}
                                >
                                    <option value="">Keuken ▾</option>
                                    {wereldkeukenOpties.map((optie) => (
                                        <option key={optie} value={optie}>{optie}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Zoekbalk */}
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

                    {/* Resultaten */}
                    <div className="resultaten-wrapper">
                        {laden && <p>Even geduld... recepten worden geladen.</p>}
                        {fout && <p className="fout">{fout}</p>}
                        {!laden && recepten.length === 0 && !fout && (
                            <p>Geen recepten gevonden. Probeer een ander ingrediënt of filter.</p>
                        )}

                        <div className="receptenlijst">
                            {recepten.map((item, index) => (
                                <div key={index} className="recept-card">
                                    <div className="recept-kop">
                                        <img src={item.image} alt={item.label} />
                                        <button
                                            onClick={() => generateShoppingList(item.ingredients, item.label)}
                                            className="icon-btn"
                                            aria-label="Boodschappenlijst"
                                        >
                                            <FiShoppingCart />
                                        </button>
                                    </div>
                                    <div className="recept-titel-onder">
                                        <h3>{item.label}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <ModalLink
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    ingredientsList={ingredientsList}
                    recipeTitle={selectedRecipeTitle}
                />
            )}
        </div>
    );
};

export default ReceptenZoeker;