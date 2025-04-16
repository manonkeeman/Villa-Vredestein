import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Components/Buttons/Button.jsx";
import "../Styles/Global.css";
import "./Home.css";
import VillaVredestein from "../Assets/Images/VillaVredestein.jpeg";

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://snapwidget.com/js/snapwidget.js";
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    return (
        <div className="home">
            <div className="card-wrapper">
                <div className="card text-card home-text">
                    <h1>Welkom bij Villa Vredestein</h1>
                    <p>
                        Gebouwd in 1906, ademt Villa Vredestein de charme van weleer.
                        Hoge plafonds, oude details en een ziel die je voelt zodra je binnenstapt.
                        <br /><br />
                        Toch is dit geen huis dat stilstaat in de tijd.
                        Achter de nostalgische gevel schuilt een frisse wind.
                        We moderniseren met respect voor het verleden,
                        zodat dit huis niet alleen herinneringen bewaart,
                        maar ook ruimte biedt aan nieuwe verhalen.
                        <br /><br />
                        De originele elementen blijven behouden waar mogelijk —
                        niet uit nostalgie, maar uit liefde voor vakmanschap.
                        Zo ontstaat een harmonie tussen oud en nieuw.
                        <br /><br />
                        Villa Vredestein draagt het verleden met trots en kijkt vooruit.
                        Ontdek wat deze unieke plek zo bijzonder maakt.
                    </p>
                    <Button text="Lees meer" variant="secundary" onClick={() => navigate("/about")} />
                </div>

                <div className="card image-card home-image">
                    <img src={VillaVredestein} alt="Villa Vredestein" />
                </div>
            </div>
        </div>
    );
};

export default Home;