import { useState, useEffect } from 'react';
import './OfflineBanner.css';

export default function OfflineBanner() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const goOffline = () => setIsOffline(true);
        const goOnline = () => setIsOffline(false);

        window.addEventListener('offline', goOffline);
        window.addEventListener('online', goOnline);

        return () => {
            window.removeEventListener('offline', goOffline);
            window.removeEventListener('online', goOnline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="offline-banner" role="status" aria-label="Geen internetverbinding">
            <span className="offline-banner__dot" />
            <span>Je bent offline — getoonde gegevens zijn mogelijk niet actueel</span>
        </div>
    );
}
