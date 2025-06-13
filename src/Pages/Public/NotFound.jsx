import React from "react";
import "./NotFound.css";
import "../../Styles/Global.css";
import { Link } from "react-router-dom";

function NotFound() {
  return (
      <main className="not-found">
          <h1>404</h1>
          <h2>Oeps deze pagina wordt niet gevonden</h2>
          <p>Breng me terug naar <Link to="/">Home</Link> Villa Vredestein</p>
      </main>
  );
}

export default NotFound;
