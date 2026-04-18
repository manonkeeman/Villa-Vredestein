import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import "./i18n/index.js";
import { registerSW } from "virtual:pwa-register";

// Reload the page the moment the new service worker takes control,
// so installed PWA users always get fresh assets after a deploy.
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
    });
}

registerSW({
    // Check for a new service worker every hour while the app is open.
    onRegisteredSW(swUrl, registration) {
        setInterval(() => {
            registration?.update();
        }, 60 * 60 * 1000);
    },
    onOfflineReady() {},
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </React.StrictMode>
);
