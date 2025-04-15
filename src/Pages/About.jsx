import React from "react";
import "./About.css";
import "../Styles/Global.css";
import MaximManon from "../Assets/Images/Maxim_Manon_ChevroletSuburban.jpg";

const About = () => {
    return (
        <div className="about-page">
            <h1 className="about-title">Over Villa Vredestein</h1>
            <div className="about-grid">
                <div className="about-card">
                    <h2>Over Villa Vredestein</h2>
                    <p>
                        Villa Vredestein is gebouwd in 1906 en combineert historische charme met moderne functionaliteit. Een plek die inspireert.                    </p>
                </div>
                <div className="about-card">
                    <h2>De Geschiedenis</h2>
                    <p>
                        Oorspronkelijk een statige woning in het hart van Driebergen. Door de jaren heen is het pand uitgegroeid tot een plek van verbinding en creativiteit.                    </p>
                </div>
                <div className="about-card">
                    <h2>De Restauratie</h2>
                    <p>
                        Met aandacht voor originele details is de villa gerenoveerd. Zo blijven authentieke elementen behouden in een eigentijdse setting.                    </p>
                </div>
                <div className="about-card">
                    <h2>Wonen & Werken</h2>
                    <p>
                        Villa Vredestein biedt ruimte aan mensen met uiteenlopende passies. Er wordt gewoond, gestudeerd én gewerkt.                    </p>
                </div>
                <div className="about-card">
                    <h2>Duurzaam verbouwen</h2>
                    <p>
                        Bij elke verbouwing houden we duurzaamheid in gedachten. Energiezuinige oplossingen en hergebruik van materialen staan centraal.                    </p>
                </div>
                <div className="about-card">
                    <h2>De omgeving</h2>
                    <p>
                        Villa Vredestein ligt in het groene hart van Driebergen, aan de rand van de Utrechtse Heuvelrug. Een omgeving waar rust, natuur en historie samenkomen.              </p>
                </div>
                <div className="about-card">
                    <h2>Toekomstplannen</h2>
                    <p>
                        Ontdek hoe Villa Vredestein zich blijft ontwikkelen. Van woonhuis tot creatieve broedplaats of AirBnB — de mogelijkheden groeien mee.                </p>
                </div>
                <div className="about-card with-hover-image">
                    <h2>Over ons</h2>
                    <p>
                        Wij zijn Manon en Maxim, samen bouwen we aan een plek die rust, creativiteit en avontuur biedt. Een thuis én een basis.
                    </p>
                    <div
                        className="hover-image"
                        style={{ backgroundImage: `url(${MaximManon})` }}
                    ></div>
                </div>

                <div className="about-card">
                    <h2>Bezoek & Inspiratie</h2>
                    <p>
                        Ontdek de verhalen, charme en ambities van Villa Vredestein via deze website — en laat je inspireren door het proces.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;