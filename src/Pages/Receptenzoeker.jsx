import React, { useState } from "react";
import axios from "axios";
import "./ReceptenZoeker.css";
import Watetenwevandaag from "../Assets/Images/Watetenwevandaag.jpg";
import { FiSearch } from "react-icons/fi";

const ReceptenZoeker = () => {
    const [zoekwoord, setZoekwoord] = useState("");
    const [recepten, setRecepten] = useState([]);
    const [laden, setLaden] = useState(false);
    const [fout, setFout] = useState(null);

    const handleZoek = async (e) => {
        e.preventDefault();
        setLaden(true);
        setFout(null);

        try {
            const response = await axios.get("https://api.edamam.com/api/recipes/v2", {
                params: {
                    q: zoekwoord,
                    type: "public",
                    app_id: import.meta.env.VITE_APP_ID,
                    app_key: import.meta.env.VITE_APP_KEY,
                },
                headers: {
                    "Edamam-Account-User": import.meta.env.VITE_USER_ID,
                },
            });

            setRecepten(response.data.hits.map(hit => hit.recipe));
        } catch (error) {
            console.error("API error:", error);
            if (error.response) {
                setFout(`Error ${error.response.status}: ${error.response.data.message || "Onbekende fout"}`);
            } else {
                setFout("Netwerkfout of verkeerde API-configuratie");
            }
        } finally {
            setLaden(false);
        }
    };

    return (
        <div className="receptenzoeker">
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

            {laden && <p>Even geduld... recepten worden geladen.</p>}
            {fout && <p className="fout">{fout}</p>}
            {!laden && recepten.length === 0 && !fout && (
                <p>Geen recepten gevonden. Probeer een ander ingrediënt.</p>
            )}

            <div className="receptenlijst">
                {recepten.map((item, index) => (
                    <div key={index} className="recept-card">
                        <h3>{item.label}</h3>
                        <img src={item.image} alt={item.label} />
                        <p>
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                Bekijk recept
                            </a>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReceptenZoeker;