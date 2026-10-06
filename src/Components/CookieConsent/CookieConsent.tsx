import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStoredConsent, storeConsent, loadGoogleAnalytics } from "../../Helpers/analytics";
import "./CookieConsent.css";
import { useContent } from "../../i18n/content";

export default function CookieConsent() {
    const tc = useContent();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const stored = getStoredConsent();
        if (stored === "accepted") {
            loadGoogleAnalytics();
        } else if (stored === null) {
            setVisible(true);
        }
    }, []);

    const accept = () => {
        storeConsent("accepted");
        loadGoogleAnalytics();
        setVisible(false);
    };

    const decline = () => {
        storeConsent("declined");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="cookie-consent" role="region" aria-label={tc("Cookiemelding")}>
            <p>
                {tc("We gebruiken Google Analytics om te zien hoe bezoekers deze site gebruiken. Dat gebeurt alleen als je hieronder akkoord gaat. Lees meer in ons")}{" "}
                <Link to="/privacy">{tc("privacybeleid")}</Link>.
            </p>
            <div className="cookie-consent__actions">
                <button className="cookie-consent__decline" onClick={decline}>
                    {tc("Weigeren")}
                </button>
                <button className="cookie-consent__accept" onClick={accept}>
                    {tc("Accepteren")}
                </button>
            </div>
        </div>
    );
}
