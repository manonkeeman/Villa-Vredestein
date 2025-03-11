import React from 'react';
import './BentoBox.css';
import VillaVredestein from "../../Assets/Images/VillaVredestein.jpeg";

const BentoBox = () => {
    return (
        <>
            <div className="bento-grid">
                <div className="box box1">Box 1</div>
                <div className="box box2">Box 2</div>
                <img src={VillaVredestein} alt="Villa Vredestein" className="Villa Vredestein"/>
            </div>

            <div className="bento-grid-onderste">
                <div className="box box3">Box 3</div>
                <div className="box box4">Box 4</div>
                <div className="box box5">Box 5</div>
            </div>
        </>
    );
};

export default BentoBox;