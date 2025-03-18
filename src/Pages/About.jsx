import React from "react";
import "../Styles/BentoGrid.css";
import MaximManonChevroletSuburban from "../Assets/Images/Maxim_Manon_ChevroletSuburban.jpg";

const About = () => {
    return (
        <div className="bento-grid">
            <div className="box box1">
                <h1>Over Ons</h1>
                <p>Welkom bij Villa Vredestein.</p>
            </div>

            <div className="box box2">
                <img src={MaximManonChevroletSuburban} alt="Maxim Manon Chevrolet Suburban"/>
            </div>

            <div className="box box3">
                <p>Extra informatie hier.</p>
            </div>

            <div className="box box4">
                <p>Meer details over de villa.</p>
            </div>

            <div className="box box5">
                <p>De Vredesteiners</p>
            </div>
        </div>
    );
};

export default About;