import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./Pages/Auth/AuthContext.jsx";
import axios from "./Helpers/AxiosHelper.jsx";

const AppInitializer = () => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const refreshToken = async () => {
            try {
                const storedToken = localStorage.getItem("token");
                if (!storedToken) {
                    const res = await axios.post("/refresh-token");
                    if (res.data.token) {
                        localStorage.setItem("token", res.data.token);
                    }
                }
            } catch (err) {
                console.warn("⚠️ Kan accessToken niet verversen:", err.message);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } finally {
                setReady(true);
            }
        };

        refreshToken();
    }, []);

    if (!ready) {
        return <div style={{ padding: "120px", textAlign: "center" }}>Opstarten...</div>;
    }

    return <App />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <AppInitializer />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);