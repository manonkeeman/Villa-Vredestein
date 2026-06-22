import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Omgeving.css";

import OmgevingImg   from "../../Assets/Images/DeOmgevingVillaVredestein.jpg";
import ImgGrot       from "../../Assets/Images/omg-grot.jpg";
import ImgPannen     from "../../Assets/Images/PannenkoekenAvondVillaVredestein.jpg";
import ImgDiner      from "../../Assets/Images/life-diner.jpg";
import ImgSfeer      from "../../Assets/Images/life-sfeer.jpg";
import ImgFiets      from "../../Assets/Images/life-bloemen-fiets.jpg";
import ImgBuiten     from "../../Assets/Images/life-buiten-eten.jpg";
import ImgTuinfeest  from "../../Assets/Images/ext-tuinfeest.jpg";
import ImgVilla1910  from "../../Assets/Images/VillaVredestein1910.jpg";
import ImgBloemen    from "../../Assets/Images/ext-villa-bloemen.jpg";
import ImgMoestuin   from "../../Assets/Images/life-moestuin.jpg";

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

type Poi = { pos: [number, number]; label: string; sub: string; emoji: string; color: string; link: string; linkLabel: string };

const POIS: Poi[] = [
    // Villa & Vervoer
    { pos: VILLA,                                     label: "Villa Vredestein",          sub: "Hoofdstraat 147",              emoji: "🏛️", color: "#FCBC2D", link: "https://www.villavredestein.nl",                                  linkLabel: "villavredestein.nl"           },
    { pos: [52.0317, 5.2447],                         label: "NS Driebergen-Zeist",       sub: "5 min met de auto",            emoji: "🚂", color: "#d4804a", link: "https://maps.google.com/?q=NS+Station+Driebergen-Zeist",           linkLabel: "Google Maps →"                },
    { pos: [52.0543, 5.3211],                         label: "Utrechtse Heuvelrug NP",    sub: "Op loopafstand",               emoji: "🌲", color: "#6a9050", link: "https://www.np-utrechtse-heuvelrug.nl",                           linkLabel: "np-utrechtse-heuvelrug.nl"    },
    { pos: [52.0894, 5.1101],                         label: "Utrecht Centraal",           sub: "15 min per trein",             emoji: "🏙️", color: "#888",    link: "https://maps.google.com/?q=Utrecht+Centraal",                     linkLabel: "Google Maps →"                },
    { pos: [52.3791, 4.8999],                         label: "Amsterdam Centraal",         sub: "~40 min per trein",            emoji: "🌆", color: "#666",    link: "https://maps.google.com/?q=Amsterdam+Centraal",                   linkLabel: "Google Maps →"                },
    { pos: [52.3105, 4.7683],                         label: "Schiphol Airport",           sub: "~50 min per trein",            emoji: "✈️", color: "#666",    link: "https://www.schiphol.nl",                                         linkLabel: "schiphol.nl"                  },

    // Ontbijt & Brunch
    { pos: [52.0466, 5.2841],                         label: "Huiskamer van Driebergen",  sub: "5 min fiets",                  emoji: "☕", color: "#a06030", link: "https://www.dehuiskamervandriebergen.nl",                         linkLabel: "dehuiskamervandriebergen.nl"  },
    { pos: [52.0428, 5.2853],                         label: "Het Wapen van Driebergen",  sub: "5 min fiets",                  emoji: "🍽️", color: "#a06030", link: "https://www.wapenvandriebergen.nl",                               linkLabel: "wapenvandriebergen.nl"        },
    { pos: [52.0640, 5.1980],                         label: "Restaurant Vroeg",           sub: "15 min auto · Bunnik",         emoji: "🌾", color: "#a06030", link: "https://www.vroeg.nl",                                            linkLabel: "vroeg.nl"                     },
    { pos: [52.0432, 5.2857],                         label: "Koek & Ei",                 sub: "5 min fiets",                  emoji: "🥐", color: "#a06030", link: "https://www.koekeneidriebergen.nl",                               linkLabel: "koekeneidriebergen.nl"        },

    // Afhaal & Dinner
    { pos: [52.0452, 5.2878],                         label: "De Sluis Gaarde",           sub: "5 min fiets",                  emoji: "🥡", color: "#c05040", link: "https://www.desluisgaarde.nl",                                    linkLabel: "desluisgaarde.nl"             },
    { pos: [52.0453, 5.2857],                         label: "Mi Piace",                  sub: "5 min fiets",                  emoji: "🍕", color: "#c05040", link: "https://www.mipiacedriegergen.nl",                                linkLabel: "mipiacedriegergen.nl"         },
    { pos: [52.0463, 5.2843],                         label: "Kwalitaria",                sub: "5 min fiets",                  emoji: "🍟", color: "#c05040", link: "https://www.kwalitaria.nl",                                       linkLabel: "kwalitaria.nl"                },
    { pos: [52.0464, 5.2841],                         label: "Rotiq",                     sub: "5 min fiets",                  emoji: "🍛", color: "#c05040", link: "https://www.rotiq.nl",                                            linkLabel: "rotiq.nl"                     },

    // Bier, Wijn & Cocktails
    { pos: [52.0875, 5.2255],                         label: "De Schavuit",               sub: "20 min fiets · Zeist",         emoji: "🍺", color: "#8b5e3c", link: "https://www.deschavuit.nl",                                       linkLabel: "deschavuit.nl"                },
    { pos: [52.0462, 5.2844],                         label: "Eetcafé Louwietje",         sub: "5 min fiets",                  emoji: "🍺", color: "#8b5e3c", link: "https://www.louwietje.nl",                                        linkLabel: "louwietje.nl"                 },
    { pos: [52.0884, 5.2157],                         label: "Brouwerij Brasser",         sub: "25 min fiets · Zeist",         emoji: "🍺", color: "#8b5e3c", link: "https://www.brouwerijbrasser.nl",                                 linkLabel: "brouwerijbrasser.nl"          },

    // Boodschappen
    { pos: [52.0434, 5.2869],                         label: "Albert Heijn",              sub: "2 min te voet",                emoji: "🛒", color: "#3a7a28", link: "https://maps.google.com/?q=Hoofdstraat+162+Driebergen",            linkLabel: "Google Maps →"                },
    { pos: [52.0481, 5.2812],                         label: "Lidl",                      sub: "8 min fiets",                  emoji: "🛒", color: "#3a7a28", link: "https://maps.google.com/?q=Traaij+153+Driebergen",                linkLabel: "Google Maps →"                },
    { pos: [52.0468, 5.2833],                         label: "Aldi",                      sub: "5 min fiets",                  emoji: "🛒", color: "#3a7a28", link: "https://maps.google.com/?q=Traaij+99+Driebergen",                 linkLabel: "Google Maps →"                },
    { pos: [52.0460, 5.2845],                         label: "Woensdagmarkt Traaij",      sub: "5 min fiets · wekelijks",      emoji: "🥦", color: "#3a7a28", link: "https://maps.google.com/?q=Traaij+Driebergen",                    linkLabel: "Google Maps →"                },

    // Bezienswaardigheden
    { pos: [52.0459, 5.2884],                         label: "Heidetuin Driebergen",      sub: "5 min te voet",                emoji: "🌿", color: "#5a8a40", link: "https://maps.google.com/?q=Wethouder+Verhaarlaan+1+Driebergen",   linkLabel: "Google Maps →"                },
    { pos: [52.0188, 5.3316],                         label: "Kaapse Bossen Uitkijktoren",sub: "20 min fiets · Doorn",         emoji: "🗼", color: "#5a8a40", link: "https://maps.google.com/?q=St.+Helenaheuvellaan+2+Doorn",         linkLabel: "Google Maps →"                },
    { pos: [52.0620, 5.3490],                         label: "Pyramide van Austerlitz",   sub: "20 min fiets",                 emoji: "🔺", color: "#5a8a40", link: "https://maps.google.com/?q=Pyramide+van+Austerlitz",              linkLabel: "Google Maps →"                },
    { pos: [52.0420, 5.2862],                         label: "De Lourdesgrot",            sub: "5 min te voet",                emoji: "⛪", color: "#5a8a40", link: "https://maps.google.com/?q=Park+Seminarie+61+Driebergen",         linkLabel: "Google Maps →"                },

    // Kastelen & Landgoederen
    { pos: [51.9934, 5.4200],                         label: "Parc Broekhuizen",          sub: "30 min fiets · Leersum",       emoji: "🏰", color: "#7a6080", link: "https://www.parcbroekhuizen.nl",                                  linkLabel: "parcbroekhuizen.nl"           },
    { pos: [52.0273, 5.3514],                         label: "Huis Doorn",                sub: "20 min fiets · Doorn",         emoji: "🏛️", color: "#7a6080", link: "https://www.huisdoorn.nl",                                        linkLabel: "huisdoorn.nl"                 },
    { pos: [52.0846, 5.1547],                         label: "Landgoed Oud-Amelisweerd",  sub: "25 min auto · Bunnik",         emoji: "🏡", color: "#7a6080", link: "https://www.veldkeuken.nl",                                       linkLabel: "veldkeuken.nl"                },
    { pos: [51.9749, 5.4519],                         label: "Kasteel Amerongen",         sub: "35 min fiets · Amerongen",     emoji: "🏰", color: "#7a6080", link: "https://www.kasteelamerongen.nl",                                 linkLabel: "kasteelamerongen.nl"          },

    // Activiteiten
    { pos: [52.0356, 5.2722],                         label: "Kartcircuit Driebergen",    sub: "10 min fiets",                 emoji: "🏎️", color: "#4a6080", link: "https://www.kartbaan.com",                                        linkLabel: "kartbaan.com"                 },
    { pos: [52.0434, 5.2871],                         label: "Bibliotheek Driebergen",    sub: "2 min te voet",                emoji: "📚", color: "#4a6080", link: "https://www.bibliotheekzout.nl",                                  linkLabel: "bibliotheekzout.nl"           },

    // Nightlife Utrecht
    { pos: [52.0920, 5.1189],                         label: "Club Poema",                sub: "40 min trein · Utrecht",       emoji: "🎶", color: "#443355", link: "https://www.clubpoema.nl",                                        linkLabel: "clubpoema.nl"                 },
    { pos: [52.0934, 5.1239],                         label: "EKKO",                      sub: "40 min trein · Utrecht",       emoji: "🎸", color: "#443355", link: "https://www.ekko.nl",                                             linkLabel: "ekko.nl"                      },
    { pos: [52.0921, 5.1155],                         label: "Tivoli Vredenburg",         sub: "40 min trein · Utrecht",       emoji: "🎤", color: "#443355", link: "https://www.tivolivredenburg.nl",                                 linkLabel: "tivolivredenburg.nl"          },
    { pos: [52.0903, 5.1197],                         label: "Club Basis",                sub: "40 min trein · Utrecht",       emoji: "🎛️", color: "#443355", link: "https://www.clubbasis.nl",                                        linkLabel: "clubbasis.nl"                 },
];

const AFSTANDEN = [
    { icon: "🚂", label: "NS Driebergen-Zeist",  km: "3 km",   tijd: "5 min auto"   },
    { icon: "🏙️", label: "Utrecht Centraal",      km: "13 km",  tijd: "15 min trein" },
    { icon: "🌆", label: "Amsterdam",             km: "48 km",  tijd: "40 min trein" },
    { icon: "✈️", label: "Schiphol Airport",      km: "54 km",  tijd: "50 min trein" },
    { icon: "🌲", label: "Heuvelrug bos",         km: "< 1 km", tijd: "Te voet"      },
    { icon: "🛒", label: "Driebergen centrum",    km: "1 km",   tijd: "5 min fiets"  },
];

type Venue = { naam: string; desc: string; adres: string; web: string; photo: string };
type BzItem = { emoji: string; naam: string; desc: string; adres: string; web?: string | null; photo: string };
type Boodschap = { naam: string; sub: string };

const ONTBIJT: Venue[] = [
    { naam: "Huiskamer van Driebergen", desc: "Knus koffiehuis voor ontbijt en brunch. Doordeweeks v.a. 8:30, weekend v.a. 9:00 tot 17:00.", adres: "Traaij 84b, Driebergen",       web: "dehuiskamervandriebergen.nl", photo: ImgPannen  },
    { naam: "Het Wapen van Driebergen", desc: "Van koffie tot lunch en diner. Dagelijks geopend vanaf 10:00.",                                  adres: "Hoofdstraat 83, Driebergen",  web: "wapenvandriebergen.nl",       photo: ImgSfeer   },
    { naam: "Restaurant Vroeg",         desc: "Boerderij met bakkerij en landwinkel. De hele dag welkom, ma–zo 8:00–23:00.",                    adres: "Achterdijk 1, Bunnik",         web: "vroeg.nl",                    photo: ImgBuiten  },
    { naam: "Koek & Ei",                desc: "Klein en gezellig lunchrestaurant. Personeel met een hart voor de arbeidsmarkt. Ma–za 10:00–16:00.", adres: "Hoofdstraat 113, Driebergen", web: "koekeneidriebergen.nl",     photo: ImgPannen  },
];

const AFHAAL_DINNER: Venue[] = [
    { naam: "De Sluis Gaarde", desc: "Chinees-Oriëntaals restaurant. Di–zo vanaf 16:00. €–€€.",   adres: "De Sluis 36-37, Driebergen", web: "desluisgaarde.nl",      photo: ImgDiner    },
    { naam: "Mi Piace",        desc: "Pizzeria en wijn. Dagelijks 17:00–22:00. €5–20.",            adres: "Traaij 1C, Driebergen",      web: "mipiacedriegergen.nl",  photo: ImgBuiten   },
    { naam: "Kwalitaria",      desc: "Snackbar met groot assortiment. Di–zo 11:30–21:00. €1–10.", adres: "Traaij 62, Driebergen",      web: "kwalitaria.nl",         photo: ImgTuinfeest},
    { naam: "Rotiq",           desc: "Surinaamse gerechten. Dagelijks 11:30–20:00. €6–20.",        adres: "Traaij 70, Driebergen",      web: "rotiq.nl",              photo: ImgDiner    },
];

const CAFE: Venue[] = [
    { naam: "De Schavuit",          desc: "Muziek & bierspecialiteiten café. Pool, darten, pubquiz. Dagelijks 16:00–2:00.", adres: "Steynlaan 21, Zeist",           web: "deschavuit.nl",           photo: ImgSfeer    },
    { naam: "Eetcafe Louwietje",    desc: "Bruin eetcafe — voor lunch, een borrel of gewoon een drankje.",                  adres: "Traaij 56, Driebergen",          web: "louwietje.nl",            photo: ImgDiner    },
    { naam: "Wapen van Rijsenburg", desc: "Eten, drinken, netwerken, dansen en zingen. Voor van alles en iedereen.",       adres: "Hoofdstraat 83, Driebergen",     web: "wapenvandriebergen.nl",   photo: ImgTuinfeest},
    { naam: "Brouwerij Brasser",    desc: "Ambachtelijk gebrouwen bier uit Zeist. Wo–zo 16:00–00:00.",                     adres: "Slotlaan 314, Zeist",            web: "brouwerijbrasser.nl",     photo: ImgBuiten   },
];

const BOODSCHAPPEN: Boodschap[] = [
    { naam: "Albert Heijn",    sub: "Hoofdstraat 162 & Binnenhof 1 · ma–za 8:00–22:00, zo 12:00–18:00" },
    { naam: "Lidl",            sub: "Traaij 153a · ma–za 8:00–21:00, zo 12:00–18:00"    },
    { naam: "Aldi",            sub: "Traaij 99-101 · ma–za 8:00–18:00"                  },
    { naam: "Woensdagmarkt",   sub: "Traaij, Driebergen · wekelijks 11:00–17:00"         },
];

const BEZIENSWAARDIGHEDEN: BzItem[] = [
    { emoji: "🌿", naam: "Heidetuin Driebergen",       desc: "500 soorten heide achter de beuken en dennen. Elk seizoen de moeite waard.",                                              adres: "Wethouder Verhaarlaan 1, Driebergen",    photo: OmgevingImg,  web: null },
    { emoji: "🗼", naam: "Kaapse Bossen Uitkijktoren", desc: "Bij Doorn. Beklim de toren voor een weids uitzicht over vrijwel de hele Utrechtse Heuvelrug.",                           adres: "St. Helenaheuvellaan 2, Doorn",          photo: ImgBloemen,   web: null },
    { emoji: "🔺", naam: "Pyramide van Austerlitz",    desc: "Eén van de meest bijzondere bezienswaardigheden van de Heuvelrug — bos, wandelingen en een groot terras.",              adres: "Zeisterweg 98, Woudenberg",              photo: OmgevingImg,  web: null },
    { emoji: "⛪", naam: "De Lourdesgrot",             desc: "Circa 120 jaar oud. De opening ligt richting Jeruzalem. Rustige plek om een kaarsje te branden.",                       adres: "Park Seminarie 61, Driebergen",          photo: ImgGrot,      web: null },
];

const KASTELEN: Venue[] = [
    { naam: "Landgoed Parc Broekhuizen",   desc: "Imposant landgoed verscholen in de natuur. Restaurant Voltaire, bistro LOF en boetiek hotel.", adres: "Broekhuizerlaan 2, Leersum",   web: "parcbroekhuizen.nl", photo: ImgVilla1910 },
    { naam: "Huis Doorn",                  desc: "Beroemd als het voormalige verblijf van de Duitse ex-keizer Wilhelm II.",                       adres: "Langbroekerweg 10, Doorn",     web: "huisdoorn.nl",       photo: ImgBloemen   },
    { naam: "Landgoed Oud-Amelisweerd",    desc: "Prachtig natuurgebied met fijn restaurant, bakkerij en landwinkel De Veldkeuken.",             adres: "Koningslaan 11A, Bunnik",      web: "veldkeuken.nl",      photo: ImgMoestuin  },
    { naam: "Kasteel Amerongen",           desc: "Een tipje van de kastelengeschiedenis van de Heuvelrug. Vlakbij boscafé Mas Montagne.",        adres: "Drostestraat 20, Amerongen",   web: "kasteelamerongen.nl",photo: ImgVilla1910 },
];

const ACTIVITEITEN: BzItem[] = [
    { emoji: "🏎️", naam: "Kartcircuit Driebergen", desc: "Uniek kartcircuit van 750 meter lang. Prijzen vanaf €15.",                                                                    adres: "De Woerd 7, Driebergen",        web: "kartbaan.com",       photo: ImgTuinfeest },
    { emoji: "📚", naam: "Bibliotheek Driebergen", desc: "Ma–vr 10:00–17:00, zaterdag 10:00–13:00.",                                                                                    adres: "Hoofdstraat 164, Driebergen",   web: "bibliotheekzout.nl", photo: ImgSfeer     },
    { emoji: "💪", naam: "Sport & Fitness",         desc: "Fitline (Hoofdstraat 166) · Health Center Hoenderdaal (De Hoendersteeg 7) · Laco Sportcentrum De Zwoer (Schellingerlaan 20).", adres: "Driebergen",                   web: null,                 photo: ImgFiets     },
    { emoji: "🎬", naam: "Pathé Cinema",            desc: "Meerdere locaties in de regio: Utrecht Leidsche Rijn, Utrecht centrum, Amersfoort en Ede.",                                  adres: "o.a. Berlijnplein 100, Utrecht",web: null,                 photo: ImgBuiten    },
];

const NIGHTLIFE: Venue[] = [
    { naam: "Club Poema",       desc: "Een van de oudste clubs van Utrecht. Elektronische muziek en techno, speciale studentenavonden. Vanaf 18 jaar.", adres: "Drieharingstraat 22, Utrecht",          web: "clubpoema.nl",       photo: ImgTuinfeest },
    { naam: "EKKO",             desc: "Concerten en clubavonden, alternatief clubben. Toegankelijk vanaf 14 jaar.",                                      adres: "Bemuurde Weerd Westzijde 3, Utrecht",   web: "ekko.nl",            photo: ImgSfeer     },
    { naam: "Tivoli Vredenburg",desc: "Alle muziekgenres onder één dak, midden in het centrum van Utrecht.",                                             adres: "Vredenburg 11, Utrecht",                web: "tivolivredenburg.nl", photo: ImgBuiten    },
    { naam: "Club Basis",       desc: "Donkere club met Berlijnse vibe — voornamelijk techno.",                                                          adres: "Oudegracht aan de Werf 9, Utrecht",     web: "clubbasis.nl",       photo: ImgTuinfeest },
];

const VenueCard = ({ v }: { v: Venue }) => (
    <a href={`https://www.${v.web}`} target="_blank" rel="noreferrer" className="venue-card">
        <div className="venue-photo">
            <img src={v.photo} alt={v.naam} loading="lazy" />
        </div>
        <div className="venue-body">
            <strong className="venue-naam">{v.naam}</strong>
            <p className="venue-desc">{v.desc}</p>
            <span className="venue-adres">{v.adres}</span>
            <span className="venue-web">{v.web} →</span>
        </div>
    </a>
);

const BzCard = ({ b }: { b: BzItem }) => {
    const inner = (
        <>
            <div className="venue-photo venue-photo--bz">
                <img src={b.photo} alt={b.naam} loading="lazy" />
                <span className="bz-emoji-overlay" aria-hidden="true">{b.emoji}</span>
            </div>
            <div className="venue-body">
                <strong className="venue-naam">{b.naam}</strong>
                <p className="venue-desc">{b.desc}</p>
                <span className="venue-adres">{b.adres}</span>
                {b.web && <span className="venue-web">{b.web} →</span>}
            </div>
        </>
    );
    return b.web
        ? <a href={`https://www.${b.web}`} target="_blank" rel="noreferrer" className="venue-card">{inner}</a>
        : <div className="venue-card venue-card--nolink">{inner}</div>;
};

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
                <meta name="twitter:title" content="Omgeving & Locatie — Villa Vredestein" />
                <meta name="twitter:description" content="Bos op de stoep, Utrecht in een kwartier. Villa Vredestein ligt op de Utrechtse Heuvelrug in Driebergen-Rijsenburg." />
                <meta name="twitter:image" content="https://villavredestein.nl/og-image.jpg" />
            </Helmet>

            {/* Hero — kaart als header */}
            <header className="omg-hero-map" aria-label="Locatie kaart">
                <div className="omg-hero-map-inner">
                    <MapContainer center={VILLA} zoom={11} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }} aria-label="Interactieve kaart van de omgeving">
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                        {POIS.map((poi) => (
                            <Marker key={poi.label} position={poi.pos} icon={makeIcon(poi.emoji, poi.color)}>
                                <Popup>
                                    <div className="map-popup">
                                        <strong>{poi.label}</strong>
                                        <span>{poi.sub}</span>
                                        <a href={poi.link} target="_blank" rel="noreferrer" className="map-popup-link">{poi.linkLabel}</a>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        <Polyline positions={[VILLA, [52.0894, 5.1101]]} color="rgba(252,188,45,0.3)" weight={2} dashArray="6 6" />
                    </MapContainer>
                </div>
                <div className="omg-hero-map-overlay" aria-hidden="true">
                    <div className="omg-hero-map-text">
                        <span className="omg-eyebrow">Locatie</span>
                        <h1>Midden in het groen,<br />vlak bij alles</h1>
                        <p>Driebergen-Rijsenburg op de Utrechtse Heuvelrug. Bos op de stoep. Utrecht in een kwartier. Amsterdam in veertig minuten.</p>
                    </div>
                </div>
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
                            {ONTBIJT.map((v) => <VenueCard key={v.naam} v={v} />)}
                        </div>
                    </div>

                    <div className="omg-cat-block">
                        <span className="omg-cat-label">Afhaal & Dinner</span>
                        <div className="omg-venues-grid">
                            {AFHAAL_DINNER.map((v) => <VenueCard key={v.naam} v={v} />)}
                        </div>
                    </div>

                    <div className="omg-cat-block">
                        <span className="omg-cat-label">Bier, Wijn & Cocktails</span>
                        <div className="omg-venues-grid">
                            {CAFE.map((v) => <VenueCard key={v.naam} v={v} />)}
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

            {/* Bezienswaardigheden */}
            <section className="omg-bz reveal-section" ref={addRef} aria-label="Bezienswaardigheden">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Things to see</h2>
                    <p className="omg-section-sub">Dompel jezelf onder in de schatten van de Utrechtse Heuvelrug.</p>
                    <div className="omg-venues-grid">
                        {BEZIENSWAARDIGHEDEN.map((b) => <BzCard key={b.naam} b={b} />)}
                    </div>
                </div>
            </section>

            {/* Kastelen */}
            <section className="omg-kastelen reveal-section" ref={addRef} aria-label="Kastelen en landgoederen">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Kastelen & Landgoederen</h2>
                    <p className="omg-section-sub">Culture is calling — allemaal op fietsafstand.</p>
                    <div className="omg-venues-grid">
                        {KASTELEN.map((v) => <VenueCard key={v.naam} v={v} />)}
                    </div>
                </div>
            </section>

            {/* Ontdekken */}
            <section className="omg-ontdekken reveal-section" ref={addRef} aria-label="Activiteiten">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Ontdekken</h2>
                    <p className="omg-section-sub">Rondom en in Driebergen.</p>
                    <div className="omg-venues-grid">
                        {ACTIVITEITEN.map((a) => <BzCard key={a.naam} b={a} />)}
                    </div>
                </div>
            </section>

            {/* Nightlife */}
            <section className="omg-nightlife reveal-section" ref={addRef} aria-label="Clubs en uitgaan">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Clubs & Nightlife</h2>
                    <p className="omg-section-sub">Dance like no one is watching — Utrecht is vlakbij.</p>
                    <div className="omg-venues-grid omg-venues-grid--last">
                        {NIGHTLIFE.map((v) => <VenueCard key={v.naam} v={v} />)}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Omgeving;
