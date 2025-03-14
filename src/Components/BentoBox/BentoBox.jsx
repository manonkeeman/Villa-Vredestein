import React from 'react';
import './BentoBox.css';
import Button from "../Buttons/Button";
import VillaVredestein from "../../Assets/Images/VillaVredestein.jpeg";
import InkijkjeinVredestein from "../../Assets/Images/InkijkjeinVredestein.jpeg";

const BentoBox = () => {
    return (
        <div className="wrapper">
            <div className="bento-grid">

                <div className="box box1">
                    <h2>Welkom bij Villa Vredestein</h2>
                    <Button text="Lees meer"/>
                </div>

                <div className="box box2">
                    <img src={VillaVredestein} alt="Villa Vredestein"/>
                </div>

                <div className="box box3">
                    <img src={InkijkjeinVredestein} alt="Inkijkje in Villa Vredestein"/>
                </div>

                <div className="box box4">
                    <p>Hier komt tekst</p>
                    <Button text="Meer info"/>
                </div>

                <div className="box box5">
                    <video autoPlay loop muted playsInline width="100%">
                        <source src="/Videos/MaximEnManonInSuburban.mp4" type="video/mp4"/>
                        Your browser does not support the video tag.
                    </video>
                </div>

            </div>
        </div>
    );
};

export default BentoBox;