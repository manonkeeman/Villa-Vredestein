import React from "react";
import "./Home.css";

const Home = () => {
    return (
        <>
            <div className="bento-grid">
                <div className="box box1">Box 1</div>
                <div className="box box2">Box 2</div>
            </div>

            {/* Onderste rij correct gescheiden in 3 kolommen */}
            <div className="bento-grid-onderste">
                <div className="box box3">Box 3</div>
                <div className="box box4">Box 4</div>
                <div className="box box5">Box 5</div>
            </div>
        </>
    );
};

export default Home;