import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FontLoader from "./Components/FontLoader/Fonts.jsx";
import Navigatie from "./Components/Navigatie/Navigatie.jsx";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Login from "./Pages/Login.jsx";
import Recipe  from "./Pages/Recipe.jsx";
import NotFound from "./Pages/NotFound.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
            <BrowserRouter>
                <FontLoader />
                <Navigatie />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/recipe" element={<Recipe />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
    </React.StrictMode>
);