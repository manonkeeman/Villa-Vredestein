import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Components/Header/Header.jsx";
import "./App.css";

function App() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}

export default App;