import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./i18n/index";
import { registerSW } from "virtual:pwa-register";

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
    });
}

registerSW({
    onRegisteredSW(_swUrl: string, registration: ServiceWorkerRegistration | undefined) {
        setInterval(() => registration?.update(), 60 * 60 * 1000);
    },
    onOfflineReady() {},
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </StrictMode>
);
