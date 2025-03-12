import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Components/Header/Header.jsx";
import BentoBox from "./Components/BentoBox/BentoBox";
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