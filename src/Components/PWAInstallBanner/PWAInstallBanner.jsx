import { useState, useEffect } from 'react';
import './PWAInstallBanner.css';

// iOS/iPadOS detection (iPadOS 13+ reports MacIntel with touch)
const isIosDevice = () =>
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Already running as installed PWA?
const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

export default function PWAInstallBanner() {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isIos, setIsIos] = useState(false);

    useEffect(() => {
        if (isStandalone()) return;
        if (localStorage.getItem('pwa-banner-dismissed')) return;

        const ios = isIosDevice();
        setIsIos(ios);

        if (ios) {
            setShowBanner(true);
            return;
        }

        // Android/Chrome: use already-captured prompt (fired before React mount)
        const applyPrompt = (prompt) => {
            if (prompt) {
                setInstallPrompt(prompt);
                setShowBanner(true);
            }
        };

        if (window.__pwaInstallPrompt) {
            applyPrompt(window.__pwaInstallPrompt);
        } else {
            // Fallback: listen for it if it fires after mount
            const onReady = () => applyPrompt(window.__pwaInstallPrompt);
            window.addEventListener('pwa-prompt-ready', onReady);

            // Also listen directly in case neither fired yet
            const onPrompt = (e) => {
                e.preventDefault();
                window.__pwaInstallPrompt = e;
                applyPrompt(e);
            };
            window.addEventListener('beforeinstallprompt', onPrompt);

            return () => {
                window.removeEventListener('pwa-prompt-ready', onReady);
                window.removeEventListener('beforeinstallprompt', onPrompt);
            };
        }
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowBanner(false);
            window.__pwaInstallPrompt = null;
        }
        setInstallPrompt(null);
    };

    const handleDismiss = () => {
        localStorage.setItem('pwa-banner-dismissed', '1');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="pwa-banner" role="banner" aria-label="App installeren">
            <div className="pwa-banner__icon">
                <img src="/icons/icon-96x96.png" alt="Villa Vredestein" />
            </div>
            <div className="pwa-banner__text">
                <strong>Villa Vredestein</strong>
                {isIos ? (
                    <span>
                        Tik op{' '}
                        <span className="pwa-banner__share-icon" aria-label="Deel-knop">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                <polyline points="16 6 12 2 8 6"/>
                                <line x1="12" y1="2" x2="12" y2="15"/>
                            </svg>
                        </span>{' '}
                        en kies <em>"Zet op beginscherm"</em>
                    </span>
                ) : (
                    <span>Installeer de app voor snelle toegang</span>
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