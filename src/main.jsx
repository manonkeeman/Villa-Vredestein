import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext.jsx";
import FontLoader from "./Components/FontLoader/Fonts.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <FontLoader />
                <App/>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);