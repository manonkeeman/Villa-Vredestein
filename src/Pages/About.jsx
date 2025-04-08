import React from "react";
import "../Styles/BentoGrid.css";
import "./About.css";
import MaximManonChevroletSuburban from "../Assets/Images/Maxim_Manon_ChevroletSuburban.jpg";

const About = () => {
    return (
        <div className="about">
            <div className="bento-grid">
                <div className="box box1">
                    <h1>Een huis met een verhaal</h1>
                    <p>Gebouwd op historie, gevuld met dromen. Elke kamer fluistert een stukje verleden.</p>
                </div>

                <div className="box box2">
                    <img src={MaximManonChevroletSuburban} alt="Maxim Manon Chevrolet Suburban" />
                </div>

                <div className="box box3">
                    <h1>Ruimte voor verbinding</h1>
                    <p>Samen tafelen, verhalen delen, elkaar vinden. Hier ontstaat echte ontmoeting.</p>
                </div>

                <div className="box box4">
                    <h1>Carpe Diem</h1>
                    <p>Niets is standaard in Vredestein. Elk hoekje, elk detail vertelt een verhaal. Soms een beetje gek, soms briljant. Maar altijd authentiek.</p>
                </div>

                <div className="box box5">
                    <iframe
                        src="https://snapwidget.com/embed/1091842"
                        className="snapwidget-widget"
                        frameBorder="0"
                        scrolling="no"
                        style={{
                            overflow: "hidden",
                            width: "100%",
                            height: "100%",
                            borderRadius:"10px",
                        }}
                        title="Vredestein op Instagram"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default About;