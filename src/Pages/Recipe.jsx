import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

const Recepten = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
      <div>
        <h2>Welkom op de receptenpagina!</h2>
        <p>Hier staan heerlijke recepten.</p>
      </div>
  );
};

export default Recepten;