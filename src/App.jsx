import React from "react";
import Header from "./Components/Header/Header.jsx";
import "./App.css";
import {Route, Routes} from "react-router-dom";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Login from "./Pages/Login.jsx";
import Recipe from "./Pages/Recipe.jsx";
import NotFound from "./Pages/NotFound.jsx";

function App() {
    return (
        <>
            <Header/>
            <Routes>
                <Route index element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/recipe" element={<Recipe/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </>
    );
}

export default App;