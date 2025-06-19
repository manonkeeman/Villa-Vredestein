import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Components/Buttons/Button.jsx";
import "../../Styles/Global.css";
import "./Home.css";
import VillaVredestein from "../../Assets/Images/VillaVredestein.jpg";

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
        <main className="home" role="main" aria-labelledby="home-title">
            <section className="card-wrapper">
                <figure className="card image-card home-image">
                    <img
                        src={VillaVredestein}
                        alt="Voorgevel van Villa Vredestein"
                        className="home-image-full"
                    />
                </figure>

                <section className="card text-card home-text">
                    <header>
                        <h1 id="home-title">Welkom bij Villa Vredestein</h1>
                    </header>
                    <p>
                        Gebouwd in 1906, ademt Villa Vredestein de charme van weleer.
                        Hoge plafonds, oude details en een ziel die je voelt zodra je binnenstapt.
                    </p>
                    <p>
                        Toch is dit geen huis dat stilstaat in de tijd.
                        Achter de nostalgische gevel schuilt een frisse wind.
                        We moderniseren met respect voor het verleden,
                        zodat dit huis niet alleen herinneringen bewaart,
                        maar ook ruimte biedt aan nieuwe verhalen.
                    </p>
                    <p>
                        De originele elementen blijven behouden waar mogelijk —
                        niet uit nostalgie, maar uit liefde voor vakmanschap.
                        Zo ontstaat een harmonie tussen oud en nieuw.
                    </p>
                    <p>
                        Villa Vredestein draagt het verleden met trots en kijkt vooruit.
                        Ontdek wat deze unieke plek zo bijzonder maakt.
                    </p>
                    <Button
                        text="Lees meer"
                        variant="secundary"
                        onClick={() => navigate("/about")}
                    />
                </section>
            </section>
        </main>
    );
};

export default Home;