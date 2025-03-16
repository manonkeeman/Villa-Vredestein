import React from "react";
import "../Styles/BentoGrid.css"; // ✅ Import de gedeelde grid-stijlen

const About = () => {
    return (
        <div className="bento-grid">
            <div className="box box1">
                <h1>Over Ons</h1>
                <p>Welkom bij Villa Vredestein.</p>
            </div>

            <div className="box box2">
                <img src="/images/about.jpg" alt="Over Ons"/>
            </div>

            <div className="box box3">
                <p>Extra informatie hier.</p>
            </div>

            <div className="box box4">
                <p>Meer details over de villa.</p>
            </div>

            <div className="box box5">
                <video autoPlay loop muted playsInline width="100%">
                    <source src="/videos/AboutVilla.mp4" type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};

export default About;