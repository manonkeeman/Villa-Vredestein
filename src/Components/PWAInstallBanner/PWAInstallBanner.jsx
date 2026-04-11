import { useState, useEffect } from 'react';
import './PWAInstallBanner.css';

export default function PWAInstallBanner() {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isIos, setIsIos] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Niet tonen als al geinstalleerd
        if (window.matchMedia('(display-mode: standalone)').matches) return;
        if (sessionStorage.getItem('pwa-banner-dismissed')) return;

        // iOS detectie
        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
        setIsIos(ios);

        if (ios) {
            // Op iOS tonen we handlematig een instructiebanner
            setShowBanner(true);
            return;
        }

        // Android/Chrome: luisteren op beforeinstallprompt
        const handler = (e) => {
            e.preventDefault();
            setInstallPrompt(e);
            setShowBanner(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowBanner(false);
        }
        setInstallPrompt(null);
    };

    const handleDismiss = () => {
        sessionStorage.setItem('pwa-banner-dismissed', '1');
        setDismissed(true);
        setShowBanner(false);
    };

    if (!showBanner || dismissed) return null;

    return (
        <div className="pwa-banner" role="banner" aria-label="App installeren">
            <div className="pwa-banner__icon">
                <img src="/icons/icon-96x96.png" alt="Villa Vredestein" />
            </div>
            <div className="pwa-banner__text">
                <strong>Villa Vredestein</strong>
                {isIos ? (
                    <span>
                        Tik op <span className="pwa-banner__share-icon">⬆</span> en kies
                        <em> "Zet op beginscherm"</em>
                    </span>
                ) : (
                    <span>Installeer de app op je telefoon</span>
                )}
            </div>
            {!isIos && (
                <button className="pwa-banner__install-btn" onClick={handleInstall}>
                    Installeer
                </button>
            )}
            <button
                className="pwa-banner__close"
                onClick={handleDismiss}
                aria-label="Sluiten"
            >
                ✕
            </button>
        </div>
    );
}