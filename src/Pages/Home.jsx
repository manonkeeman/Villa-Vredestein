import React, { useEffect } from "react";
import BentoBox from "../Components/BentoBox/BentoBox.jsx";
import "../Styles/BentoGrid.css";
import "./Home.css";
import VillaVredestein from "../Assets/Images/VillaVredestein.jpeg";

const Home = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://snapwidget.com/js/snapwidget.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="home">
            <BentoBox
                content={
                    <div className="bento-wrapper">
                        <div className="box box1">
                            <h1>Welkom bij Villa Vredestein</h1>
                            <p>Gebouwd in 1906, ademt Villa Vredestein de charme van weleer. Hoge plafonds, oude details en een ziel die je voelt zodra je binnenstapt. Maar achter die nostalgische gevel schuilt een frisse wind: een eigentijdse plek in volle ontwikkeling.

                                We moderniseren met respect voor het verleden, zodat dit huis niet alleen herinneringen bewaart, maar ook ruimte biedt aan nieuwe verhalen.

                                Villa Vredestein wordt een plek waar creativiteit, ontmoeting en toekomstplannen samenkomen — en jij bent van harte welkom om dat mee te beleven.

                                Lees hier meer → </p>
                        </div>
                        <div className="box box2-5">
                            <img src={VillaVredestein} alt="Villa Vredestein" />
                        </div>
                        <div className="box box3">
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default Home;