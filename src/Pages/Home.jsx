import React from "react";
import BentoBox from "../Components/BentoBox/BentoBox.jsx";
import "../Styles/BentoGrid.css";
import "./Home.css";
import VillaVredestein from "../Assets/Images/VillaVredestein.jpeg";

const Home = () => {
    return (
        <div className="home">
            <BentoBox
                content={
                    <div className="bento-wrapper">
                        <div className="box box1">
                            <h2>Welkom bij Villa Vredestein</h2>
                            <p>Een unieke plek waar karakter, rust en avontuur samenkomen.</p>
                        </div>
                        <div className="box box2-5"
                             style={{ backgroundImage: `url(${VillaVredestein})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        </div>
                        <div className="box box3">
                            <p>Hier komt een korte tekst.</p>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default Home;