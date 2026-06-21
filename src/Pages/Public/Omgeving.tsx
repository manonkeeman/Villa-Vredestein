import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Omgeving.css";

import GrotImg from "../../Assets/Images/omg-grot.jpg";
import OmgevingImg from "../../Assets/Images/DeOmgevingVillaVredestein.jpg";
import FietsImg from "../../Assets/Images/life-bloemen-fiets.jpg";

// Fix leaflet default icon path (Vite/bundler issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const makeIcon = (emoji, color = "#FCBC2D") =>
    L.divIcon({
        className: "",
        html: `<div style="
            background:${color};
            border-radius:50%;
            width:36px;height:36px;
            display:flex;align-items:center;justify-content:center;
            font-size:16px;
            box-shadow:0 2px 8px rgba(0,0,0,0.5);
            border:2px solid rgba(255,255,255,0.3);
        ">${emoji}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
    });

const VILLA = [52.0431, 5.2870];

const POIS = [
    { pos: VILLA, label: "Villa Vredestein", sub: "Hoofdstraat 147", emoji: "🏛️", color: "#FCBC2D" },
    { pos: [52.0317, 5.2447], label: "NS Driebergen-Zeist", sub: "5 min met de auto", emoji: "🚂", color: "#7c9ef8" },
    { pos: [52.0543, 5.3211], label: "Utrechtse Heuvelrug NP", sub: "Op loopafstand", emoji: "🌳", color: "#4caf50" },
    { pos: [52.0894, 5.1101], label: "Utrecht Centraal", sub: "15 min per trein", emoji: "🏙️", color: "#c8a46e" },
    { pos: [52.3791, 4.8999], label: "Amsterdam Centraal", sub: "~40 min per trein", emoji: "🌆", color: "#aaa" },
    { pos: [52.3105, 4.7683], label: "Schiphol Airport", sub: "~50 min per trein", emoji: "✈️", color: "#888" },
];

const AFSTANDEN = [
    { icon: "🚂", label: "NS Driebergen-Zeist", km: "3 km", tijd: "5 min auto" },
    { icon: "🏙️", label: "Utrecht Centraal", km: "13 km", tijd: "15 min trein" },
    { icon: "🌆", label: "Amsterdam", km: "48 km", tijd: "40 min trein" },
    { icon: "✈️", label: "Schiphol Airport", km: "54 km", tijd: "50 min trein" },
    { icon: "🌳", label: "Heuvelrug bos", km: "< 1 km", tijd: "Te voet" },
    { icon: "🛒", label: "Driebergen centrum", km: "1 km", tijd: "5 min fiets" },
];

const Omgeving = () => {
    const revealRefs = useRef([]);
    const addRef = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in-view")),
            { threshold: 0.1 }
        );
        revealRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <main className="omgeving-page">
            <Helmet>
                <title>Omgeving & Locatie — Villa Vredestein</title>
                <meta name="description" content="Villa Vredestein ligt in Driebergen-Rijsenburg op de Utrechtse Heuvelrug. Utrecht in 15 minuten, Amsterdam in 40, bos op de stoep." />
                <link rel="canonical" href="https://villavredestein.nl/omgeving" />
            </Helmet>

            <header className="omg-hero reveal-section" ref={addRef}>
                <div className="omg-hero-inner">
                    <span className="omg-eyebrow">Locatie</span>
                    <h1>Midden in het groen,<br />vlak bij alles</h1>
                    <p>
                        Driebergen-Rijsenburg ligt op de zuidflank van de Utrechtse Heuvelrug.
                        Bos op de stoep. Utrecht in een kwartier. Amsterdam in veertig minuten.
                    </p>
                </div>
                <div className="omg-hero-img" style={{ backgroundImage: `url(${OmgevingImg})` }} aria-hidden="true" />
            </header>

            {/* Afstandstabel */}
            <section className="omg-afstanden reveal-section" ref={addRef} aria-label="Afstanden">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Alles binnen bereik</h2>
                    <div className="afstand-grid">
                        {AFSTANDEN.map((a) => (
                            <div key={a.label} className="afstand-card">
                                <span className="afstand-icon" aria-hidden="true">{a.icon}</span>
                                <div className="afstand-info">
                                    <strong>{a.label}</strong>
                                    <span>{a.km} · {a.tijd}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leaflet map */}
            <section className="omg-map-section reveal-section" ref={addRef} aria-label="Kaart">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Op de kaart</h2>
                    <p className="omg-section-sub">
                        Klik op een marker voor meer informatie.
                    </p>
                </div>
                <div className="omg-map-wrap">
                    <MapContainer
                        center={VILLA}
                        zoom={11}
                        scrollWheelZoom={false}
                        style={{ width: "100%", height: "100%" }}
                        aria-label="Interactieve kaart van de omgeving"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                        {POIS.map((poi) => (
                            <Marker
                                key={poi.label}
                                position={poi.pos}
                                icon={makeIcon(poi.emoji, poi.color)}
                            >
                                <Popup>
                                    <div className="map-popup">
                                        <strong>{poi.label}</strong>
                                        <span>{poi.sub}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        {/* Lijn villa → Utrecht */}
                        <Polyline
                            positions={[VILLA, [52.0894, 5.1101]]}
                            color="rgba(252,188,45,0.3)"
                            weight={2}
                            dashArray="6 6"
                        />
                    </MapContainer>
                </div>
            </section>

            {/* Sfeer omgeving */}
            <section className="omg-sfeer reveal-section" ref={addRef}>
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">De omgeving</h2>
                    <p className="omg-section-sub">
                        Driebergen-Rijsenburg is meer dan een slapend dorp. Hier is een
                        levendige gemeenschap, veel groen, lokale winkels en het beste
                        van zowel stad als natuur.
                    </p>
                </div>
                <div className="omg-sfeer-grid">
                    <div className="omg-sfeer-item omg-sfeer-large">
                        <img src={GrotImg} alt="Lourdesgrot Driebergen" loading="lazy" />
                        <div className="omg-sfeer-caption">
                            <strong>Lourdesgrot</strong>
                            <span>Driebergen, op wandelafstand</span>
                        </div>
                    </div>
                    <div className="omg-sfeer-item">
                        <img src={FietsImg} alt="Bloemen markt Driebergen" loading="lazy" />
                        <div className="omg-sfeer-caption">
                            <strong>Lokale markt</strong>
                            <span>Bloemen, vers en authentiek</span>
                        </div>
                    </div>
                    <div className="omg-sfeer-item">
                        <img src={OmgevingImg} alt="Utrechtse Heuvelrug" loading="lazy" />
                        <div className="omg-sfeer-caption">
                            <strong>Utrechtse Heuvelrug</strong>
                            <span>Direct achter de deur</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="omg-tips reveal-section" ref={addRef}>
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Tips van de bewoners</h2>
                    <div className="tips-grid">
                        {[
                            { icon: "🌲", titel: "Wandelen op de Heuvelrug", tekst: "Loop rechtstreeks de bossen in via de Hoofdstraat. Stiltezone, heideveldenverder dan je denkt." },
                            { icon: "☕", titel: "Koffie bij de lokale bakker", tekst: "Het dorp heeft een paar topkoffietentjes. Loop er 's morgens even naartoe." },
                            { icon: "🚂", titel: "Utrecht in een kwartier", tekst: "NS station Driebergen-Zeist brengt je in een kwartier naar het centrum van Utrecht." },
                            { icon: "🛁", titel: "Kastelen & tuinen", tekst: "Paleis Soestdijk, Kasteel Amerongen en Huis Doorn liggen allemaal op fietsafstand." },
                        ].map((t) => (
                            <div key={t.titel} className="tip-card">
                                <span className="tip-icon" aria-hidden="true">{t.icon}</span>
                                <h3>{t.titel}</h3>
                                <p>{t.tekst}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Omgeving;
