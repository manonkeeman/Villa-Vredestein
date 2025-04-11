import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReceptenZoeker.css";
import Watetenwevandaag from "../Assets/Images/Watetenwevandaag.jpg";
import { FiSearch } from "react-icons/fi";

const maaltijdOpties = [
    { label: "Ontbijt", value: "breakfast" },
    { label: "Lunch", value: "lunch" },
    { label: "Brunch", value: "brunch" },
    { label: "Diner", value: "dinner" },
];

const dieetOpties = [
    { label: "Vegetarisch", value: "vegetarian" },
    { label: "Veganistisch", value: "vegan" },
    { label: "Lactosevrij", value: "dairy-free" },
    { label: "Glutenvrij", value: "gluten-free" },
    { label: "Suikervrij", value: "sugar-conscious" },
    { label: "Pindavrij", value: "peanut-free" },
    { label: "Notenvrij", value: "tree-nut-free" },
];

const wereldkeukenOpties = [
    { label: "Italiaans", value: "Italian" },
    { label: "Grieks", value: "Greek" },
    { label: "Thais", value: "South East Asian" },
    { label: "Japans", value: "Japanese" },
    { label: "Amerikaans", value: "American" },
    { label: "Mexicaans", value: "Mexican" },
];

const ReceptenZoeker = () => {
    const [zoekwoord, setZoekwoord] = useState("");
    const [recepten, setRecepten] = useState([]);
    const [laden, setLaden] = useState(false);
    const [fout, setFout] = useState(null);
    const [geselecteerdeMaaltijden, setGeselecteerdeMaaltijden] = useState([]);
    const [geselecteerdeDieet, setGeselecteerdeDieet] = useState([]);
    const [geselecteerdeKeukens, setGeselecteerdeKeukens] = useState([]);

    const fetchRecepten = async () => {
        setLaden(true);
        setFout(null);

        const params = {
            q: zoekwoord || "dinner",
            type: "public",
            app_id: import.meta.env.VITE_APP_ID,
            app_key: import.meta.env.VITE_APP_KEY,
            from: 0,
            to: 6,
        };

        if (geselecteerdeMaaltijden.length > 0) {
            params.mealType = geselecteerdeMaaltijden.join(",");
        }
        if (geselecteerdeDieet.length > 0) {
            params.health = geselecteerdeDieet.join(",");
        }
        if (geselecteerdeKeukens.length > 0) {
            params.cuisineType = geselecteerdeKeukens.join(",");
        }

        try {
            const response = await axios.get("https://api.edamam.com/api/recipes/v2", {
                params,
                headers: {
                    "Edamam-Account-User": import.meta.env.VITE_USER_ID,
                },
            });

            setRecepten(response.data.hits.map(hit => hit.recipe));
        } catch (error) {
            console.error("API error:", error);
            setFout("Fout bij het ophalen van recepten.");
        } finally {
            setLaden(false);
        }
    };

    useEffect(() => {
        fetchRecepten();
    }, [zoekwoord, geselecteerdeMaaltijden, geselecteerdeDieet, geselecteerdeKeukens]);

    const handleZoek = (e) => {
        e.preventDefault();
        fetchRecepten();
    };

    const toggleCheckbox = (value, selectedValues, setSelected) => {
        const updated = selectedValues.includes(value)
            ? selectedValues.filter(v => v !== value)
            : [...selectedValues, value];
        setSelected(updated);
    };

    return (
        <div className="receptenzoeker">
            <div className="receptencontent">
                {/* Sidebar met filters */}
                <div className="filtersidebar">
                    <h4>Menugang</h4>
                    {maaltijdOpties.map(({ label, value }) => (
                        <label key={value} className="filter-label">
                            <input
                                type="checkbox"
                                value={value}
                                checked={geselecteerdeMaaltijden.includes(value)}
                                onChange={() => toggleCheckbox(value, geselecteerdeMaaltijden, setGeselecteerdeMaaltijden)}
                            />
                            {label}
                        </label>
                    ))}

                    <h4>Dieetsoorten</h4>
                    {dieetOpties.map(({ label, value }) => (
                        <label key={value} className="filter-label">
                            <input
                                type="checkbox"
                                value={value}
                                checked={geselecteerdeDieet.includes(value)}
                                onChange={() => toggleCheckbox(value, geselecteerdeDieet, setGeselecteerdeDieet)}
                            />
                            {label}
                        </label>
                    ))}

                    <h4>Wereldkeuken</h4>
                    {wereldkeukenOpties.map(({ label, value }) => (
                        <label key={value} className="filter-label">
                            <input
                                type="checkbox"
                                value={value}
                                checked={geselecteerdeKeukens.includes(value)}
                                onChange={() => toggleCheckbox(value, geselecteerdeKeukens, setGeselecteerdeKeukens)}
                            />
                            {label}
                        </label>
                    ))}
                </div>

                {/* Zoekbalk en recepten */}
                <div className="receptengedeelte">
                    <div className="zoekbalk-hero">
                        <img src={Watetenwevandaag} alt="Wat eten we vandaag?" className="zoekbalk-achtergrond" />
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

                    {/* Laad indicator */}
                    {laden && <p>Even geduld... recepten worden geladen.</p>}
                    {fout && <p className="fout">{fout}</p>}
                    {!laden && recepten.length === 0 && !fout && <p>Geen recepten gevonden. Probeer een ander ingrediënt.</p>}

                    {/* Receptenlijst */}
                    <div className="receptenlijst">
                        {recepten.map((item, index) => (
                            <div
                                key={index}
                                className="recept-card"
                                onClick={() => window.open(item.url, "_blank")}
                            >
                                <img src={item.image} alt={item.label} />
                                <h3>{item.label}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptenZoeker;