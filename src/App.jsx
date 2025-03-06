import React from "react";
import FontLoader from "./Components/FontLoader/Fonts.jsx";
import Navigatie from "./Components/Navigatie/Navigatie.jsx";
import {Route, Routes} from "react-router-dom";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Login from "./Pages/Login.jsx";
import Recipe from "./Pages/Recipe.jsx";
import NotFound from "./Pages/NotFound.jsx";

export default function App() {
    return (
        <div>
            <FontLoader />
            <Navigatie />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={ <Recipe /> } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

