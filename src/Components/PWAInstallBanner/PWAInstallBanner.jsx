import { useState, useEffect } from 'react';
import './PWAInstallBanner.css';

const isIosDevice = () =>
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const isAndroidDevice = () => /android/i.test(navigator.userAgent);

const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

// platform: 'ios' | 'android-prompt' | 'android-manual'
export default function PWAInstallBanner() {
    const [platform, setPlatform] = useState(null);
    const [installPrompt, setInstallPrompt] = useState(null);

    useEffect(() => {
        if (isStandalone()) return;
        if (localStorage.getItem('pwa-banner-dismissed')) return;

        if (isIosDevice()) {
            setPlatform('ios');
            return;
        }

        const applyPrompt = (prompt) => {
            if (!prompt) return;
            setInstallPrompt(prompt);
            setPlatform('android-prompt');
        };

        // Already captured before React mounted
        if (window.__pwaInstallPrompt) {
            applyPrompt(window.__pwaInstallPrompt);
            return;
        }

        const onReady = () => applyPrompt(window.__pwaInstallPrompt);
        window.addEventListener('pwa-prompt-ready', onReady);

        const onPrompt = (e) => {
            e.preventDefault();
            window.__pwaInstallPrompt = e;
            applyPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', onPrompt);

        // Android fallback: Chrome may not fire beforeinstallprompt if it
        // already showed its own install chip, or the criteria aren't met.
        // After 3s with no prompt, show Chrome menu instructions instead.
        let fallback;
        if (isAndroidDevice()) {
            fallback = setTimeout(() => {
                if (!window.__pwaInstallPrompt) {
                    setPlatform('android-manual');
                }
            }, 3000);
        }

        return () => {
            window.removeEventListener('pwa-prompt-ready', onReady);
            window.removeEventListener('beforeinstallprompt', onPrompt);
            clearTimeout(fallback);
        };
    }, []);

    const handleInstall = () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        installPrompt.userChoice.then(({ outcome }) => {
            if (outcome === 'accepted') {
                window.__pwaInstallPrompt = null;
                setPlatform(null);
            }
            setInstallPrompt(null);
        });
    };

    const handleDismiss = () => {
        localStorage.setItem('pwa-banner-dismissed', '1');
        setPlatform(null);
    };

    if (!platform) return null;

    return (
        <div className="pwa-banner" role="banner" aria-label="App installeren">
            <div className="pwa-banner__icon">
                <img src="/icons/icon-96x96.png" alt="Villa Vredestein" />
            </div>

            {platform === 'ios' && (
                <div className="pwa-banner__text pwa-banner__text--steps">
                    <strong>App installeren</strong>
                    <span className="pwa-step">
                        <span className="pwa-step__num">1</span>
                        Tik op het
                        <span className="pwa-safari-share" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                <polyline points="16 6 12 2 8 6"/>
                                <line x1="12" y1="2" x2="12" y2="15"/>
                            </svg>
                        </span>
                        icoon in Safari
                    </span>
                    <span className="pwa-step">
                        <span className="pwa-step__num">2</span>
                        Kies <em>"Zet op beginscherm"</em>
                    </span>
                </div>
            )}

            {platform === 'android-prompt' && (
                <div className="pwa-banner__text">
                    <strong>Villa Vredestein</strong>
                    <span>Installeer de app voor snelle toegang</span>
                </div>
            )}

            {platform === 'android-manual' && (
                <div className="pwa-banner__text pwa-banner__text--steps">
                    <strong>App installeren</strong>
                    <span className="pwa-step">
                        <span className="pwa-step__num">1</span>
                        Tik op <em>⋮</em> rechtsboven in Chrome
                    </span>
                    <span className="pwa-step">
                        <span className="pwa-step__num">2</span>
                        Kies <em>"App installeren"</em>
                    </span>
                </div>
            )}

            {platform === 'android-prompt' && (
                <button className="pwa-banner__install-btn" onClick={handleInstall}>
                    Installeer
                </button>
            )}

            <button className="pwa-banner__close" onClick={handleDismiss} aria-label="Sluiten">
                ✕
            </button>
        </div>
    );
}