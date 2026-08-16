const GA_MEASUREMENT_ID = "G-39YSKD0JSH";
const CONSENT_KEY = "cookie-consent";

export type ConsentChoice = "accepted" | "declined";

export function getStoredConsent(): ConsentChoice | null {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "declined" ? value : null;
}

export function storeConsent(choice: ConsentChoice) {
    localStorage.setItem(CONSENT_KEY, choice);
}

export function clearConsent() {
    localStorage.removeItem(CONSENT_KEY);
}

let gaLoaded = false;

export function loadGoogleAnalytics() {
    if (gaLoaded) return;
    gaLoaded = true;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => {
        window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}
