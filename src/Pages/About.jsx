import React from "react";
import "./About.css";
import AboutHover from "../Components/AboutHover/AboutHover";

import Villa1 from "../Assets/Images/BezoekOnsVillaVredestein.jpg";
import Villa2 from "../Assets/Images/DeOmgevingVillaVredestein.jpg";
import Villa3 from "../Assets/Images/DuurzaamVillaVredestein.jpg";
import Villa4 from "../Assets/Images/VillaVredestein1910.jpg";
import Villa5 from "../Assets/Images/VillaVredestein2024.jpg";
import Villa6 from "../Assets/Images/VillaVredesteinRestauratie.jpg";
import Villa7 from "../Assets/Images/Maxim_Manon_ChevroletSuburban.jpg";
import Villa8 from "../Assets/Images/InkijkjeinVredestein.jpg";

const aboutData = [
    {
        title: "Over Villa Vredestein",
        text: "Villa Vredestein is gebouwd in 1906 en combineert historische charme met moderne functionaliteit. Een plek die inspireert.",
        image: Villa5,
    },
    {
        title: "De Geschiedenis",
        text: "Oorspronkelijk een statige woning in het hart van Driebergen. Door de jaren heen is het pand uitgegroeid tot een plek van verbinding en creativiteit.",
        image: Villa4,
    },
    {
        title: "De Restauratie",
        text: "Met aandacht voor originele details is de villa gerenoveerd. Zo blijven authentieke elementen behouden in een eigentijdse setting.",
        image: Villa6,
    },
    {
        title: "Wonen & Werken",
        text: "Villa Vredestein biedt ruimte aan mensen met uiteenlopende passies. Er wordt gewoond, gestudeerd én gewerkt.",
    },
    {
        title: "Duurzaam verbouwen",
        text: "Bij elke verbouwing houden we duurzaamheid in gedachten. Energiezuinige oplossingen en hergebruik van materialen staan centraal.",
        image: Villa3,
    },
    {
        title: "De omgeving",
        text: "Villa Vredestein ligt in het groene hart van Driebergen, aan de rand van de Utrechtse Heuvelrug. Een omgeving waar rust, natuur en historie samenkomen.",
        image: Villa2,
    },
    {
        title: "Toekomstplannen",
        text: "Ontdek hoe Villa Vredestein zich blijft ontwikkelen. Van woonhuis tot creatieve broedplaats of AirBnB — de mogelijkheden groeien mee.",
        image: Villa8,
    },
    {
        title: "Over ons",
        text: "Wij zijn Manon en Maxim, samen bouwen we aan een plek die rust, creativiteit en avontuur biedt. Een thuis én een basis.",
        image: Villa7,
    },
    {
        title: "Bezoek & Inspiratie",
        text: "Ontdek de verhalen, charme en ambities van Villa Vredestein via deze website — en laat je inspireren door het proces.",
        image: Villa1,
    },
];

const About = () => {
    return (
        <div className="about-page">
            <h1 className="about-title">Over Villa Vredestein</h1>
            <div className="about-grid">
                {aboutData.map((item, index) => (
                    <AboutHover
                        key={index}
                        title={item.title}
                        text={item.text}
                        image={item.image}
                    />
                ))}
            </div>
        </div>
    );
};

export default About;