import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Omgeving.css";

import GrotImg from "../../Assets/Images/omg-grot.jpg";
import OmgevingImg from "../../Assets/Images/DeOmgevingVillaVredestein.jpg";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const makeIcon = (emoji: string, color = "#FCBC2D") =>
    L.divIcon({
        className: "",
        html: `<div style="background:${color};border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.5);border:2px solid rgba(255,255,255,0.3);">${emoji}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
    });

const VILLA: [number, number] = [52.0431, 5.2870];

const POIS = [
    { pos: VILLA, label: "Villa Vredestein", sub: "Hoofdstraat 147", emoji: "🏛️", color: "#FCBC2D" },
    { pos: [52.0317, 5.2447] as [number, number], label: "NS Driebergen-Zeist", sub: "5 min met de auto", emoji: "🚂", color: "#d4804a" },
    { pos: [52.0543, 5.3211] as [number, number], label: "Utrechtse Heuvelrug NP", sub: "Op loopafstand", emoji: "🌲", color: "#c8a46e" },
    { pos: [52.0894, 5.1101] as [number, number], label: "Utrecht Centraal", sub: "15 min per trein", emoji: "🏙️", color: "#c8a46e" },
    { pos: [52.3791, 4.8999] as [number, number], label: "Amsterdam Centraal", sub: "~40 min per trein", emoji: "🌆", color: "#888" },
    { pos: [52.3105, 4.7683] as [number, number], label: "Schiphol Airport", sub: "~50 min per trein", emoji: "✈️", color: "#888" },
];

const AFSTANDEN = [
    { icon: "🚂", label: "NS Driebergen-Zeist", km: "3 km", tijd: "5 min auto" },
    { icon: "🏙️", label: "Utrecht Centraal", km: "13 km", tijd: "15 min trein" },
    { icon: "🌆", label: "Amsterdam", km: "48 km", tijd: "40 min trein" },
    { icon: "✈️", label: "Schiphol Airport", km: "54 km", tijd: "50 min trein" },
    { icon: "🌲", label: "Heuvelrug bos", km: "< 1 km", tijd: "Te voet" },
    { icon: "🛒", label: "Driebergen centrum", km: "1 km", tijd: "5 min fiets" },
];

const ONTBIJT = [
    { naam: "Huiskamer van Driebergen", desc: "Knus koffiehuis voor ontbijt en brunch. Doordeweeks v.a. 8:30, weekend v.a. 9:00 tot 17:00.", adres: "Traaij 84b, Driebergen", web: "dehuiskamervandriebergen.nl" },
    { naam: "Het Wapen van Driebergen", desc: "Van koffie tot lunch en diner. Dagelijks geopend vanaf 10:00.", adres: "Hoofdstraat 83, Driebergen", web: "wapenvandriebergen.nl" },
    { naam: "Restaurant Vroeg", desc: "Boerderij met bakkerij en landwinkel. De hele dag welkom, ma–zo 8:00–23:00.", adres: "Achterdijk 1, Bunnik", web: "vroeg.nl" },
    { naam: "Koek & Ei", desc: "Klein en gezellig lunchrestaurant. Personeel met een hart voor de arbeidsmarkt. Ma–za 10:00–16:00.", adres: "Hoofdstraat 113, Driebergen", web: "koekeneidriebergen.nl" },
];

const AFHAAL_DINNER = [
    { naam: "De Sluis Gaarde", desc: "Chinees-Oriëntaals restaurant. Di–zo vanaf 16:00. €–€€.", adres: "De Sluis 36-37, Driebergen", web: "desluisgaarde.nl" },
    { naam: "Mi Piace", desc: "Pizzeria en wijn. Dagelijks 17:00–22:00. €5–20.", adres: "Traaij 1C, Driebergen", web: "mipiacedriegergen.nl" },
    { naam: "Kwalitaria", desc: "Snackbar met groot assortiment. Di–zo 11:30–21:00. €1–10.", adres: "Traaij 62, Driebergen", web: "kwalitaria.nl" },
    { naam: "Rotiq", desc: "Surinaamse gerechten. Dagelijks 11:30–20:00. €6–20.", adres: "Traaij 70, Driebergen", web: "rotiq.nl" },
];

const CAFE = [
    { naam: "De Schavuit", desc: "Muziek & bierspecialiteiten café. Pool, darten, pubquiz. Dagelijks 16:00–2:00.", adres: "Steynlaan 21, Zeist", web: "deschavuit.nl" },
    { naam: "Eetcafe Louwietje", desc: "Bruin eetcafe — voor lunch, een borrel of gewoon een drankje.", adres: "Traaij 56, Driebergen", web: "louwietje.nl" },
    { naam: "Wapen van Rijsenburg", desc: "Eten, drinken, netwerken, dansen en zingen. Voor van alles en iedereen.", adres: "Hoofdstraat 83, Driebergen", web: "wapenvandriebergen.nl" },
    { naam: "Brouwerij Brasser", desc: "Ambachtelijk gebrouwen bier uit Zeist. Wo–zo 16:00–00:00.", adres: "Slotlaan 314, Zeist", web: "brouwerijbrasser.nl" },
];

const BOODSCHAPPEN = [
    { naam: "Albert Heijn", sub: "Hoofdstraat 162 · ma–za 8:00–22:00, zo 12:00–18:00" },
    { naam: "Albert Heijn", sub: "Binnenhof 1 · ma–za 8:00–22:00, zo 12:00–18:00" },
    { naam: "Lidl", sub: "Traaij 153a · ma–za 8:00–21:00, zo 12:00–18:00" },
    { naam: "Aldi", sub: "Traaij 99-101 · ma–za 8:00–18:00" },
    { naam: "Woensdagmarkt", sub: "Traaij, Driebergen · wekelijks 11:00–17:00" },
];

const BEZIENSWAARDIGHEDEN = [
    { emoji: "🌿", naam: "Heidetuin Driebergen", desc: "500 soorten heide achter de beuken en dennen. Elk seizoen de moeite waard.", adres: "Wethouder Verhaarlaan 1, Driebergen" },
    { emoji: "🗼", naam: "Kaapse Bossen Uitkijktoren", desc: "Bij Doorn. Beklim de toren voor een weids uitzicht over vrijwel de hele Utrechtse Heuvelrug.", adres: "St. Helenaheuvellaan 2, Doorn" },
    { emoji: "🔺", naam: "Pyramide van Austerlitz", desc: "Eén van de meest bijzondere bezienswaardigheden van de Heuvelrug — bos, wandelingen en een groot terras.", adres: "Zeisterweg 98, Woudenberg" },
    { emoji: "⛪", naam: "De Lourdesgrot", desc: "Circa 120 jaar oud. De opening ligt richting Jeruzalem. Rustige plek om een kaarsje te branden.", adres: "Park Seminarie 61, Driebergen" },
];

const KASTELEN = [
    { naam: "Landgoed Parc Broekhuizen", desc: "Imposant landgoed verscholen in de natuur. Restaurant Voltaire, bistro LOF en boetiek hotel.", adres: "Broekhuizerlaan 2, Leersum", web: "parcbroekhuizen.nl" },
    { naam: "Huis Doorn", desc: "Beroemd als het voormalige verblijf van de Duitse ex-keizer Wilhelm II.", adres: "Langbroekerweg 10, Doorn", web: "huisdoorn.nl" },
    { naam: "Landgoed Oud-Amelisweerd", desc: "Prachtig natuurgebied met fijn restaurant, bakkerij en landwinkel De Veldkeuken.", adres: "Koningslaan 11A, Bunnik", web: "veldkeuken.nl" },
    { naam: "Kasteel Amerongen", desc: "Een tipje van de kastelengeschiedenis van de Heuvelrug. Vlakbij boscafé Mas Montagne.", adres: "Drostestraat 20, Amerongen", web: "kasteelamerongen.nl" },
];

const ACTIVITEITEN = [
    { emoji: "🏎️", naam: "Kartcircuit Driebergen", desc: "Uniek kartcircuit van 750 meter lang. Prijzen vanaf €15.", adres: "De Woerd 7, Driebergen", web: "kartbaan.com" },
    { emoji: "📚", naam: "Bibliotheek Driebergen", desc: "Ma–vr 10:00–17:00, zaterdag 10:00–13:00.", adres: "Hoofdstraat 164, Driebergen", web: "bibliotheekzout.nl" },
    { emoji: "💪", naam: "Sport & Fitness", desc: "Fitline (Hoofdstraat 166) · Health Center Hoenderdaal (De Hoendersteeg 7) · Laco Sportcentrum De Zwoer (Schellingerlaan 20).", adres: "Driebergen", web: null },
    { emoji: "🎬", naam: "Pathé Cinema", desc: "Meerdere locaties in de regio: Utrecht Leidsche Rijn, Utrecht centrum, Amersfoort en Ede.", adres: "o.a. Berlijnplein 100, Utrecht", web: null },
];

const NIGHTLIFE = [
    { naam: "Club Poema", desc: "Een van de oudste clubs van Utrecht. Elektronische muziek en techno, speciale studentenavonden. Vanaf 18 jaar.", adres: "Drieharingstraat 22, Utrecht", web: "clubpoema.nl" },
    { naam: "EKKO", desc: "Concerten en clubavonden, alternatief clubben. Toegankelijk vanaf 14 jaar.", adres: "Bemuurde Weerd Westzijde 3, Utrecht", web: "ekko.nl" },
    { naam: "Tivoli Vredenburg", desc: "Alle muziekgenres onder één dak, midden in het centrum van Utrecht.", adres: "Vredenburg 11, Utrecht", web: "tivolivredenburg.nl" },
    { naam: "Club Basis", desc: "Donkere club met Berlijnse vibe — voornamelijk techno.", adres: "Oudegracht aan de Werf 9, Utrecht", web: "clubbasis.nl" },
];

const Omgeving = () => {
    const revealRefs = useRef<(HTMLElement | null)[]>([]);
    const addRef = (el: HTMLElement | null) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in-view")),
            { threshold: 0.08 }
        );
        revealRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <main className="omgeving-page">
            <Helmet>
                <title>Omgeving & Locatie — Villa Vredestein</title>
                <meta name="description" content="Restaurants, boodschappen, kastelen en tips voor Driebergen-Rijsenburg. Villa Vredestein op de Utrechtse Heuvelrug — Utrecht in 15 min, Amsterdam in 40." />
                <link rel="canonical" href="https://villavredestein.nl/omgeving" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl/omgeving" />
                <meta property="og:title" content="Omgeving & Locatie — Villa Vredestein" />
                <meta property="og:description" content="Bos op de stoep, Utrecht in een kwartier. Villa Vredestein ligt op de Utrechtse Heuvelrug in Driebergen-Rijsenburg." />
                <meta property="og:image" content="https://villavredestein.nl/og-image.jpg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="https://villavredestein.nl/og-image.jpg" />
            </Helmet>

            {/* Hero */}
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

            {/* Kaart */}
            <section className="omg-map-section reveal-section" ref={addRef} aria-label="Kaart">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Op de kaart</h2>
                    <p className="omg-section-sub">Klik op een marker voor meer informatie.</p>
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
                            <Marker key={poi.label} position={poi.pos} icon={makeIcon(poi.emoji, poi.color)}>
                                <Popup>
                                    <div className="map-popup">
                                        <strong>{poi.label}</strong>
                                        <span>{poi.sub}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        <Polyline positions={[VILLA, [52.0894, 5.1101]]} color="rgba(252,188,45,0.3)" weight={2} dashArray="6 6" />
                    </MapContainer>
                </div>
            </section>

            {/* Getting Around */}
            <section className="omg-transport reveal-section" ref={addRef} aria-label="Vervoer">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Getting around</h2>
                    <p className="omg-section-sub">Train, bus, bike — Driebergen moves smoothly.</p>
                    <div className="transport-grid">
                        <div className="transport-card">
                            <span className="transport-icon">🚂</span>
                            <h3>Trein</h3>
                            <p className="transport-loc">Station Driebergen-Zeist</p>
                            <ul className="transport-list">
                                <li>Intercity Nijmegen – Den Helder</li>
                                <li>Sprinter Breukelen – Rhenen</li>
                                <li>Sprinter Uitgeest – Driebergen-Zeist</li>
                                <li>Intercity Utrecht CS – Nijmegen</li>
                            </ul>
                        </div>
                        <div className="transport-card">
                            <span className="transport-icon">🚌</span>
                            <h3>Bus</h3>
                            <p className="transport-loc">Halte NS Station Driebergen-Zeist</p>
                            <ul className="transport-list">
                                <li>Buslijn 50: Utrecht – Wageningen</li>
                                <li>Buslijn 56: Driebergen – Wijk bij Duurstede</li>
                                <li>Buslijn 71: Driebergen – Zeist</li>
                            </ul>
                        </div>
                        <div className="transport-card">
                            <span className="transport-icon">🚲</span>
                            <h3>OV Fiets</h3>
                            <p className="transport-loc">Bij het station beschikbaar</p>
                            <ul className="transport-list">
                                <li>OV E-bike: €10 (eerste 24 uur)</li>
                                <li>OV Fiets: €4,65 — na 3 dagen €9,65 p.d.</li>
                                <li><a href="https://www.ovfietsbeschikbaar.nl" target="_blank" rel="noreferrer" className="transport-web-item">ovfietsbeschikbaar.nl</a></li>
                            </ul>
                        </div>
                        <div className="transport-card">
                            <span className="transport-icon">🚗</span>
                            <h3>Parkeren</h3>
                            <p className="transport-loc">Terrein Villa Vredestein</p>
                            <ul className="transport-list">
                                <li>Achteringang via het hek rechts</li>
                                <li>4 plaatsen op eigen terrein</li>
                                <li>3 extra op terrein achter Vredestein</li>
                                <li>Laat ruimte voor elkaar</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Eten & Drinken */}
            <section className="omg-eten reveal-section" ref={addRef} aria-label="Eten en drinken">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Eten & drinken</h2>
                    <p className="omg-section-sub">Proef de lokale smaken van Driebergen en omgeving.</p>

                    <div className="omg-cat-block">
                        <span className="omg-cat-label">Ontbijt & Brunch</span>
                        <div className="omg-venues-grid">
                            {ONTBIJT.map((v) => (
                                <a key={v.naam} href={`https://www.${v.web}`} target="_blank" rel="noreferrer" className="venue-card venue-card--link">
                                    <strong className="venue-naam">{v.naam}</strong>
                                    <p className="venue-desc">{v.desc}</p>
                                    <span className="venue-adres">{v.adres}</span>
                                    <span className="venue-web">{v.web}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="omg-cat-block">
                        <span className="omg-cat-label">Afhaal & Dinner</span>
                        <div className="omg-venues-grid">
                            {AFHAAL_DINNER.map((v) => (
                                <a key={v.naam} href={`https://www.${v.web}`} target="_blank" rel="noreferrer" className="venue-card venue-card--link">
                                    <strong className="venue-naam">{v.naam}</strong>
                                    <p className="venue-desc">{v.desc}</p>
                                    <span className="venue-adres">{v.adres}</span>
                                    <span className="venue-web">{v.web}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="omg-cat-block">
                        <span className="omg-cat-label">Bier, Wijn & Cocktails</span>
                        <div className="omg-venues-grid">
                            {CAFE.map((v) => (
                                <a key={v.naam} href={`https://www.${v.web}`} target="_blank" rel="noreferrer" className="venue-card venue-card--link">
                                    <strong className="venue-naam">{v.naam}</strong>
                                    <p className="venue-desc">{v.desc}</p>
                                    <span className="venue-adres">{v.adres}</span>
                                    <span className="venue-web">{v.web}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Boodschappen */}
            <section className="omg-boodschappen reveal-section" ref={addRef} aria-label="Boodschappen">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Dagelijkse boodschappen</h2>
                    <p className="omg-section-sub">Alles op loopafstand of een korte fietsrit.</p>
                    <div className="boodschappen-grid">
                        {BOODSCHAPPEN.map((b, i) => (
                            <div key={i} className="boodschappen-card">
                                <span className="boodschappen-icon" aria-hidden="true">🛒</span>
                                <div>
                                    <strong>{b.naam}</strong>
                                    <span>{b.sub}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sfeer foto's */}
            <section className="omg-sfeer reveal-section" ref={addRef}>
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">De omgeving</h2>
                    <p className="omg-section-sub">
                        Driebergen-Rijsenburg is meer dan een slapend dorp. Een levendige gemeenschap,
                        veel groen, lokale winkels en het beste van zowel stad als natuur.
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
                        <img src={OmgevingImg} alt="Utrechtse Heuvelrug" loading="lazy" />
                        <div className="omg-sfeer-caption">
                            <strong>Utrechtse Heuvelrug</strong>
                            <span>Direct achter de deur</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bezienswaardigheden */}
            <section className="omg-bz reveal-section" ref={addRef} aria-label="Bezienswaardigheden">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Things to see</h2>
                    <p className="omg-section-sub">Dompel jezelf onder in de schatten van de Utrechtse Heuvelrug.</p>
                    <div className="bz-grid">
                        {BEZIENSWAARDIGHEDEN.map((b) => (
                            <div key={b.naam} className="bz-card">
                                <span className="bz-emoji" aria-hidden="true">{b.emoji}</span>
                                <strong className="bz-naam">{b.naam}</strong>
                                <p className="bz-desc">{b.desc}</p>
                                <span className="bz-adres">{b.adres}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Kastelen */}
            <section className="omg-kastelen reveal-section" ref={addRef} aria-label="Kastelen en landgoederen">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Kastelen & Landgoederen</h2>
                    <p className="omg-section-sub">Culture is calling — allemaal op fietsafstand.</p>
                    <div className="omg-venues-grid">
                        {KASTELEN.map((k) => (
                            <a key={k.naam} href={`https://www.${k.web}`} target="_blank" rel="noreferrer" className="venue-card venue-card--link">
                                <strong className="venue-naam">{k.naam}</strong>
                                <p className="venue-desc">{k.desc}</p>
                                <span className="venue-adres">{k.adres}</span>
                                <span className="venue-web">{k.web}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ontdekken */}
            <section className="omg-ontdekken reveal-section" ref={addRef} aria-label="Activiteiten">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Ontdekken</h2>
                    <p className="omg-section-sub">Rondom en in Driebergen.</p>
                    <div className="bz-grid">
                        {ACTIVITEITEN.map((a) => (
                            a.web ? (
                                <a key={a.naam} href={`https://www.${a.web}`} target="_blank" rel="noreferrer" className="bz-card bz-card--link">
                                    <span className="bz-emoji" aria-hidden="true">{a.emoji}</span>
                                    <strong className="bz-naam">{a.naam}</strong>
                                    <p className="bz-desc">{a.desc}</p>
                                    <span className="bz-adres">{a.adres}</span>
                                    <span className="venue-web">{a.web}</span>
                                </a>
                            ) : (
                                <div key={a.naam} className="bz-card">
                                    <span className="bz-emoji" aria-hidden="true">{a.emoji}</span>
                                    <strong className="bz-naam">{a.naam}</strong>
                                    <p className="bz-desc">{a.desc}</p>
                                    <span className="bz-adres">{a.adres}</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </section>

            {/* Nightlife */}
            <section className="omg-nightlife reveal-section" ref={addRef} aria-label="Clubs en uitgaan">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Clubs & Nightlife</h2>
                    <p className="omg-section-sub">Dance like no one is watching — Utrecht is vlakbij.</p>
                    <div className="omg-venues-grid omg-venues-grid--last">
                        {NIGHTLIFE.map((n) => (
                            <a key={n.naam} href={`https://www.${n.web}`} target="_blank" rel="noreferrer" className="venue-card venue-card--link">
                                <strong className="venue-naam">{n.naam}</strong>
                                <p className="venue-desc">{n.desc}</p>
                                <span className="venue-adres">{n.adres}</span>
                                <span className="venue-web">{n.web}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Omgeving;
