import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Omgeving.css";

import OmgevingImg        from "../../Assets/Images/DeOmgevingVillaVredestein.jpg";
import ImgGrot             from "../../Assets/Images/omg-grot.jpg";
import ImgPannen           from "../../Assets/Images/PannenkoekenAvondVillaVredestein.jpg";
import ImgDiner            from "../../Assets/Images/life-diner.jpg";
import ImgSfeer            from "../../Assets/Images/life-sfeer.jpg";
import ImgFiets            from "../../Assets/Images/life-bloemen-fiets.jpg";
import ImgBuiten           from "../../Assets/Images/life-buiten-eten.jpg";
import ImgTuinfeest        from "../../Assets/Images/ext-tuinfeest.jpg";
import ImgVilla1910        from "../../Assets/Images/VillaVredestein1910.jpg";
import ImgBloemen          from "../../Assets/Images/ext-villa-bloemen.jpg";
import ImgMoestuin         from "../../Assets/Images/life-moestuin.jpg";
import ImgHuiskamer        from "../../Assets/Images/omg-huiskamer.jpg";
import ImgVroeg            from "../../Assets/Images/omg-vroeg.jpg";
import ImgKoekei           from "../../Assets/Images/omg-koekei.jpg";
import ImgLouwietje        from "../../Assets/Images/omg-louwietje.jpg";
import ImgMasMontagne      from "../../Assets/Images/omg-mas-montagne.webp";
import ImgChaletHelenaheuvel from "../../Assets/Images/omg-chalet-helenaheuvel.jpg";
import ImgKoffieZoZeist    from "../../Assets/Images/omg-koffie-zo-zeist.jpg";
import ImgBagelsBeans      from "../../Assets/Images/omg-bagels-beans.jpg";
import ImgSpotDoorn        from "../../Assets/Images/omg-spot-doorn.jpg";
import ImgJagershuis       from "../../Assets/Images/omg-jagershuis.jpg";
import ImgWapenRijsenburg  from "../../Assets/Images/omg-wapen-rijsenburg.jpg";
import ImgFatItalian       from "../../Assets/Images/omg-fat-italian.jpg";
import ImgNio              from "../../Assets/Images/omg-nio.jpg";
import ImgBistroPaul       from "../../Assets/Images/omg-bistro-paul.jpg";
import ImgVagabond         from "../../Assets/Images/omg-vagabond.jpg";
import ImgKleinZwitserland from "../../Assets/Images/omg-klein-zwitserland.jpg";
import ImgRoose           from "../../Assets/Images/omg-roose.webp";
import ImgMiPiace         from "../../Assets/Images/omg-mi-piace.webp";
import ImgRotiq           from "../../Assets/Images/omg-rotiq.jpg";
import ImgCafeOlivier     from "../../Assets/Images/omg-cafe-olivier.jpg";
import ImgBrasserieButt   from "../../Assets/Images/omg-brasserie-buut.jpg";
import ImgHuisDoorn       from "../../Assets/Images/omg-huis-doorn.jpg";
import ImgCentrumZeist    from "../../Assets/Images/omg-centrum-zeist.jpg";
import ImgCentrumUtrecht  from "../../Assets/Images/omg-centrum-utrecht.jpg";
import ImgCentrumWijk     from "../../Assets/Images/omg-centrum-wijk.jpg";
import ImgCentrumAmersfoort  from "../../Assets/Images/omg-centrum-amersfoort.jpg";
import ImgBrouwerijBrasser      from "../../Assets/Images/omg-brouwerij-brasser.jpg";
import ImgKaapseBossen          from "../../Assets/Images/omg-kaapse-bossen.jpg";
import ImgAmerongseBerg         from "../../Assets/Images/omg-amerongse-berg.jpg";
import ImgBibliotheek           from "../../Assets/Images/omg-bibliotheek.jpg";
import ImgDeHaar                from "../../Assets/Images/omg-de-haar.jpg";
import ImgSportFitness          from "../../Assets/Images/omg-sport-fitness.jpg";
import ImgHeidetuin             from "../../Assets/Images/omg-heidetuin.webp";
import ImgKasteelAmerongen      from "../../Assets/Images/omg-kasteel-amerongen.jpg";
import ImgKasteelDuurstede      from "../../Assets/Images/omg-kasteel-duurstede.jpg";
import ImgAmelisweerd           from "../../Assets/Images/omg-amelisweerd.jpg";
import ImgPaleisSoestdijk       from "../../Assets/Images/omg-paleis-soestdijk.jpg";
import ImgVliegbasis            from "../../Assets/Images/omg-vliegbasis-soesterberg.jpg";
import ImgPatheCinema           from "../../Assets/Images/omg-pathe-cinema.jpg";
import ImgFigi                 from "../../Assets/Images/omg-figi.jpg";
import ImgKraaybeek            from "../../Assets/Images/omg-kraaybeek.jpg";
import ImgWijngaardZeist      from "../../Assets/Images/omg-wijngaard-zeist.jpg";
import ImgMarktDriebergen      from "../../Assets/Images/omg-markt-driebergen.webp";
import ImgMarktDoorn           from "../../Assets/Images/omg-markt-doorn.webp";
import ImgMarktLeersum         from "../../Assets/Images/omg-markt-leersum.webp";
import ImgMarktGroeneveld      from "../../Assets/Images/omg-markt-groeneveld.webp";
import ImgWindmolen             from "../../Assets/Images/omg-windmolen-rijn.jpg";
import ImgKartbaan              from "../../Assets/Images/omg-kartbaan.jpg";
import ImgRhijnauwen            from "../../Assets/Images/omg-rhijnauwen.jpg";
import ImgSlotZeist             from "../../Assets/Images/omg-slot-zeist.jpg";
import ImgVoetveer              from "../../Assets/Images/omg-voetveer-rhenen.jpg";

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
    { pos: [52.0888, 5.1185],                         label: "Café Olivier",              sub: "15 min trein · Utrecht",       emoji: "🍺", color: "#8b5e3c", link: "https://www.cafeolivier.nl",                                      linkLabel: "cafeolivier.nl"               },
    { pos: [52.1538, 5.3798],                         label: "De Kleine Winst",           sub: "35 min auto · Amersfoort",     emoji: "🍺", color: "#8b5e3c", link: "https://maps.google.com/?q=De+Kleine+Winst+Amersfoort",            linkLabel: "Google Maps →"                },
    { pos: [52.0462, 5.2844],                         label: "Eetcafé Louwietje",         sub: "5 min fiets",                  emoji: "🍺", color: "#8b5e3c", link: "https://www.louwietje.nl",                                        linkLabel: "louwietje.nl"                 },
    { pos: [52.0884, 5.2157],                         label: "Brouwerij Brasser",         sub: "25 min fiets · Zeist",         emoji: "🍺", color: "#8b5e3c", link: "https://www.brouwerijbrasser.nl",                                 linkLabel: "brouwerijbrasser.nl"          },
    { pos: [51.9770, 5.4522],                         label: "Boscafé Mas Montagne",      sub: "35 min fiets · Amerongen",     emoji: "🌲", color: "#8b5e3c", link: "https://www.masmontagne.nl",                                      linkLabel: "masmontagne.nl"               },
    { pos: [52.0890, 5.2320],                         label: "Restaurant Hoog Beek",      sub: "25 min fiets · Zeist",         emoji: "🍽️", color: "#8b5e3c", link: "https://maps.google.com/?q=Restaurant+Hoog+Beek+Zeist",            linkLabel: "Google Maps →"                },
    { pos: [51.9741, 5.3328],                         label: "Centrum Wijk bij Duurstede",sub: "25 min fiets",                 emoji: "🏘️", color: "#8b5e3c", link: "https://maps.google.com/?q=Markt+Wijk+bij+Duurstede",             linkLabel: "Google Maps →"                },
    { pos: [52.1551, 5.3875],                         label: "Centrum Amersfoort",        sub: "35 min auto",                  emoji: "🏙️", color: "#8b5e3c", link: "https://maps.google.com/?q=Hof+Amersfoort",                       linkLabel: "Google Maps →"                },

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
    { pos: [51.9762, 5.3338],                         label: "Windmolen aan de Rijn",     sub: "25 min fiets · Wijk bij Duurstede", emoji: "🌬️", color: "#5a8a40", link: "https://maps.google.com/?q=Windmolen+Wijk+bij+Duurstede",   linkLabel: "Google Maps →"                },
    { pos: [52.1240, 5.2840],                         label: "Park Vliegbasis Soesterberg",sub: "20 min auto · Soesterberg",    emoji: "✈️", color: "#5a8a40", link: "https://maps.google.com/?q=Nationaal+Militair+Museum+Soesterberg", linkLabel: "Google Maps →"               },
    { pos: [51.9624, 5.5659],                         label: "Fiets & Voetveer Rhenen",   sub: "30 min fiets · Rhenen",        emoji: "⛴️", color: "#5a8a40", link: "https://maps.google.com/?q=Voetveer+Rhenen",                      linkLabel: "Google Maps →"                },

    // Kastelen & Landgoederen
    { pos: [52.0846, 5.1470],                         label: "Kasteel Rhijnauwen",        sub: "20 min fiets · Bunnik",        emoji: "🏰", color: "#7a6080", link: "https://www.kasteelrhijnauwen.nl",                                linkLabel: "kasteelrhijnauwen.nl"         },
    { pos: [52.0273, 5.3514],                         label: "Huis Doorn",                sub: "20 min fiets · Doorn",         emoji: "🏛️", color: "#7a6080", link: "https://www.huisdoorn.nl",                                        linkLabel: "huisdoorn.nl"                 },
    { pos: [52.0846, 5.1547],                         label: "Landgoed Oud-Amelisweerd",  sub: "25 min auto · Bunnik",         emoji: "🏡", color: "#7a6080", link: "https://www.veldkeuken.nl",                                       linkLabel: "veldkeuken.nl"                },
    { pos: [51.9749, 5.4519],                         label: "Kasteel Amerongen",         sub: "35 min fiets · Amerongen",     emoji: "🏰", color: "#7a6080", link: "https://www.kasteelamerongen.nl",                                 linkLabel: "kasteelamerongen.nl"          },
    { pos: [51.9726, 5.3340],                         label: "Kasteel Duurstede",         sub: "25 min fiets · Wijk bij Duurstede", emoji: "🏯", color: "#7a6080", link: "https://www.kasteelduurstede.nl",                            linkLabel: "kasteelduurstede.nl"          },
    { pos: [52.0888, 5.2363],                         label: "Slot Zeist",                sub: "25 min fiets · Zeist",         emoji: "🏰", color: "#7a6080", link: "https://www.slotzeist.nl",                                        linkLabel: "slotzeist.nl"                 },
    { pos: [52.0910, 4.9790],                         label: "Kasteel de Haar",           sub: "30 min auto · Haarzuilens",    emoji: "🏰", color: "#7a6080", link: "https://www.kasteeldehaar.nl",                                   linkLabel: "kasteeldehaar.nl"             },
    { pos: [52.1975, 5.2835],                         label: "Paleis Soestdijk",          sub: "25 min auto · Baarn",          emoji: "🏛️", color: "#7a6080", link: "https://www.paleis-soestdijk.nl",                                 linkLabel: "paleis-soestdijk.nl"          },

    // Activiteiten
    { pos: [52.0356, 5.2722],                         label: "Kartcircuit Driebergen",    sub: "10 min fiets",                 emoji: "🏎️", color: "#4a6080", link: "https://www.kartbaan.com",                                        linkLabel: "kartbaan.com"                 },
    { pos: [52.0434, 5.2871],                         label: "Bibliotheek Driebergen",    sub: "2 min te voet",                emoji: "📚", color: "#4a6080", link: "https://www.bibliotheekzout.nl",                                  linkLabel: "bibliotheekzout.nl"           },

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

const ONTBIJT: Venue[] = [
    { naam: "Huiskamer van Driebergen", desc: "Knus koffiehuis voor ontbijt en brunch. Doordeweeks v.a. 8:30, weekend v.a. 9:00 tot 17:00.", adres: "Traaij 84b, Driebergen",       web: "https://www.dehuiskamervandriebergen.nl/", photo: ImgHuiskamer        },
    { naam: "Restaurant Vroeg",         desc: "Boerderij met bakkerij en landwinkel. De hele dag welkom, ma–zo 8:00–23:00.",                    adres: "Achterdijk 1, Bunnik",         web: "https://www.vroeg.nl/",                    photo: ImgVroeg            },
    { naam: "The Fat Italian",           desc: "Authentieke Italiaanse trattoria in Driebergen. Verse pasta, pizza uit de houtoven en antipasti. Hartelijk en gezellig.", adres: "Hoofdstraat, Driebergen", web: "https://fatitalian.nl/",           photo: ImgFatItalian       },
    { naam: "Eetcafé Louwietje",        desc: "Bruin eetcafé voor lunch, een borrel of gewoon een drankje. 5 min fietsen van de villa.",        adres: "Traaij 56, Driebergen",        web: "https://www.louwietje.nl/",               photo: ImgLouwietje        },
    { naam: "Boscafé Mas Montagne",     desc: "Verborgen boscafé in het groen bij Kasteel Amerongen. Perfect rustpunt op de fietsroute langs de kastelen. Di–zo 10:00–17:00.", adres: "Maarsbergseweg 2, Amerongen", web: "https://www.masmontagne.nl/",     photo: ImgMasMontagne      },
    { naam: "Café Spot Doorn",           desc: "Gezellig café in het centrum van Doorn. Koffie, lunch en een fijn terras. Perfect tussenstop op de fietsroute door de Heuvelrug.",              adres: "Dorpsstraat, Doorn",     web: "https://www.spottdoorn.nl/",       photo: ImgSpotDoorn       },
    { naam: "Chalet St. Helenaheuvel",  desc: "Sfeervolle theetuin en koffiehuis verscholen in het bos bij Doorn. Homemade taart, verse lunch en een terras tussen de bomen. Di–zo 10:00–17:00.", adres: "St. Helenaheuvellaan, Doorn", web: "https://helenaheuvel.nl/", photo: ImgChaletHelenaheuvel },
    { naam: "Bagels & Beans Zeist",     desc: "Verse bagels, goede koffie en een fijne brunchkaart in het centrum van Zeist. Ma–za 8:00–17:00, zo 9:00–17:00.",              adres: "1e Hogeweg, Zeist",            web: "https://www.bagelsbeans.nl/vestigingen/zeist-1e-hogeweg/", photo: ImgBagelsBeans },
];

const AFHAAL_DINNER: Venue[] = [
    { naam: "Het Jagershuys Zeist",                               desc: "Sfeervolle pannekoekenherberg in een historisch pand in Zeist. Grote kaart met zoet en hartig, open haarden en een oud-Hollands interieur.",                 adres: "Zeist",                web: "https://www.hetjagershuyszeist.nl/",     photo: ImgJagershuis },
    { naam: "Mi Piace",        desc: "Pizzeria en wijn. Dagelijks 17:00–22:00. €5–20.",            adres: "Traaij 1C, Driebergen",      web: "https://www.mipiacedriebergen.nl/",      photo: ImgMiPiace  },
    { naam: "Brasserie Buut",  desc: "Moderne brasserie in Driebergen. Verse seizoensgerechten, een mooie wijn- en cocktailkaart en een warm terras. Zowel lunch als diner.",   adres: "Driebergen",           web: "https://www.brasseriebuut.nl/",          photo: ImgBrasserieButt },
    { naam: "Rotiq",           desc: "Surinaamse gerechten. Dagelijks 11:30–20:00. €6–20.",        adres: "Traaij 70, Driebergen",      web: "https://www.rotiq.nl/",                  photo: ImgRotiq    },
    { naam: "Restaurant NIO",          desc: "Modern restaurant in het centrum van Driebergen. Creatieve gerechten, mooie wijnen en een sfeervolle ambiance.",               adres: "Hoofdstraat, Driebergen",          web: "https://nio-driebergen.nl/",            photo: ImgNio      },
    { naam: "Bistro Paul",             desc: "Frans-geïnspireerde bistro met een eerlijke keuken. Dagverse gerechten, goede wijn en een warm terras.",                         adres: "Doorn",                            web: "https://www.bistropaul.nl/",            photo: ImgBistroPaul },
    { naam: "Vagabond Driebergen",     desc: "Café-restaurant in Driebergen. Ontspannen sfeer, mooie drankkaart en een wisselend menu van ontbijt tot diner.",                adres: "Driebergen",                       web: "https://devagebond.nl/",               photo: ImgVagabond },
    { naam: "Klein Zwitserland",       desc: "Sfeervol restaurant op de Heuvelrug in Driebergen. Terrasdiner in het groen, seizoensgebonden keuken.",                         adres: "Driebergen",                       web: "https://kleinzwitserlanddriebergen.nl/", photo: ImgKleinZwitserland },
];

const CAFE: Venue[] = [
    { naam: "Café Olivier",              desc: "Belgisch biercafé in een voormalige gotische kerk. Meer dan 200 bieren, overdekt terras. Ma–zo 11:00–01:00.", adres: "Achter Clarenburg 9A, Utrecht",   web: "https://www.cafe-olivier.be/nl/",             photo: ImgCafeOlivier },
    { naam: "Roose Restobar",            desc: "Sfeervolle restobar in Amersfoort. Goede wijnen, cocktails en een wisselend menu in een warm interieur.",          adres: "Amersfoort",                     web: "https://www.rooserestobar.nl/",               photo: ImgRoose },
    { naam: "Wapen van Rijsenburg",      desc: "Eten, drinken, netwerken, dansen en zingen. Voor van alles en iedereen.",       adres: "Hoofdstraat 83, Driebergen",           web: "https://wapenvanrijsenburg.nl/",              photo: ImgWapenRijsenburg },
    { naam: "Brouwerij Brasser",         desc: "Ambachtelijk gebrouwen bier uit Zeist. Wo–zo 16:00–00:00.",                     adres: "Slotlaan 314, Zeist",                  web: "https://www.brouwerijbrasser.nl/",            photo: ImgBrouwerijBrasser },
    { naam: "Centrum Zeist",             desc: "Gezellig centrum met terrassen, wijncafés en bierspecialiteiten. Op 20 min fietsen of 10 min rijden.", adres: "Slotlaan, Zeist",   web: "https://www.zeist.nl/",               photo: ImgCentrumZeist     },
    { naam: "Centrum Utrecht",           desc: "Bruisende binnenstad langs de Oudegracht met cocktailbars, wijnbars en levendige terrassen. 15 min per trein.", adres: "Oudegracht, Utrecht", web: "https://centrumutrecht.nl/",  photo: ImgCentrumUtrecht   },
    { naam: "Centrum Wijk bij Duurstede",desc: "Historisch stadje direct aan de Rijn. Sfeervolle terrassen rondom het kasteel en langs het water. 25 min fietsen.", adres: "Markt, Wijk bij Duurstede", web: "https://www.wijkbijduurstede.nl/informatie-voor-toeristen", photo: ImgCentrumWijk },
    { naam: "Centrum Amersfoort",        desc: "Levendige binnenstad met terrassen, restaurants en cultuur. 35 min met de auto of trein.", adres: "Hof 10, Amersfoort", web: "https://www.vvvamersfoort.nl/", photo: ImgCentrumAmersfoort },
];

const MARKTEN: Venue[] = [
    { naam: "Weekmarkt Driebergen",           desc: "Gezellige wekelijkse markt op de Traaij met groente, fruit, kaas, bloemen en lokale producten. Elke woensdag 11:00–17:00.", adres: "Traaij, Driebergen",                  web: "https://www.opdeheuvelrug.nl/agenda/4130532773/weekmarkt-driebergen",             photo: ImgMarktDriebergen },
    { naam: "Weekmarkt Doorn",                desc: "Verse markt in het hart van Doorn. Buurtgevoel, eerlijke producten en een fijn terras erbij. Elke donderdag 9:00–13:00.",  adres: "Dorpsstraat, Doorn",                   web: "https://www.opdeheuvelrug.nl/agenda/1415645051/weekmarkt-doorn",                  photo: ImgMarktDoorn },
    { naam: "Weekmarkt Leersum",              desc: "Kleine maar fijne weekmarkt in Leersum met lokale standhouders en een dorps karakter. Elke vrijdag 10:00–13:00.",           adres: "Dorpsplein, Leersum",                  web: "https://www.opdeheuvelrug.nl/agenda/593901549/weekmarkt-leersum",                 photo: ImgMarktLeersum },
    { naam: "Trotsmarkt Kasteel Groeneveld", desc: "Sfeervol seizoensmarkt op het landgoed van Kasteel Groeneveld in Baarn. Ambacht, streekproducten en een koninklijke omgeving.", adres: "Groeneveld 1, Baarn",              web: "https://www.opdeheuvelrug.nl/agenda/2991085050/trotsmarkt-kasteel-groeneveld-baarn-1", photo: ImgMarktGroeneveld },
];

const BEZIENSWAARDIGHEDEN: BzItem[] = [
    { emoji: "🌿", naam: "Heidetuin Driebergen",       desc: "500 soorten heide achter de beuken en dennen. Elk seizoen de moeite waard.",                                                adres: "Wethouder Verhaarlaan 1, Driebergen",        photo: ImgHeidetuin,    web: "https://www.utrechtslandschap.nl/gebied/natuur/heidetuin-en-seminarieterrein" },
    { emoji: "🗼", naam: "Kaapse Bossen Uitkijktoren", desc: "Bij Doorn. Beklim de toren voor een weids uitzicht over vrijwel de hele Utrechtse Heuvelrug.",                             adres: "St. Helenaheuvellaan 2, Doorn",              photo: ImgKaapseBossen, web: "https://www.natuurmonumenten.nl/natuurgebieden/kaapse-bossen" },
    { emoji: "🔺", naam: "Pyramide van Austerlitz",    desc: "Bijzondere bezienswaardigheid van de Heuvelrug met bos, wandelingen en een groot terras.",                                 adres: "Zeisterweg 98, Woudenberg",                  photo: OmgevingImg,  web: "https://nl.wikipedia.org/wiki/Pyramide_van_Austerlitz" },
    { emoji: "⛪", naam: "De Lourdesgrot",             desc: "Circa 120 jaar oud. De opening ligt richting Jeruzalem. Rustige plek om een kaarsje te branden.",                         adres: "Park Seminarie 61, Driebergen",              photo: ImgGrot,      web: "https://nl.wikipedia.org/wiki/Lourdesgrot_(Driebergen-Rijsenburg)" },
    { emoji: "🌬️", naam: "Molen Rijn en Lek",        desc: "Historische molen op het punt waar de Rijn en de Lek samenkomen. Karakteristiek landschap en mooi startpunt voor een wandeling langs het water.", adres: "Rijnkade, Wijk bij Duurstede", photo: ImgWindmolen, web: "https://www.molenrijnenlek.nl/en/" },
    { emoji: "✈️", naam: "Park Vliegbasis Soesterberg", desc: "Nationaal park op een voormalige militaire vliegbasis. Uitgestrekte natuur, bunkers en het Nationaal Militair Museum. Gratis toegankelijk.", adres: "Kampweg 5, Soesterberg",              photo: ImgVliegbasis,    web: "https://www.nmm.nl/nl/zien-en-doen/buiten/park-vliegbasis-soesterberg/" },
    { emoji: "⛴️", naam: "Fiets & Voetveer Rhenen",   desc: "Schilderachtige veerpont voor fietsers en voetgangers die de Rijn oversteekt bij Rhenen. Uniek uitje langs de rivier met mooi uitzicht.", adres: "Rijnkade, Rhenen",                    photo: ImgVoetveer,      web: "https://www.uiterwaarde.nl/pontjes/rhenen-lienden/" },
    { emoji: "🌄", naam: "Amerongse Berg",             desc: "Het hoogste punt van de Utrechtse Heuvelrug op 69 meter. Prachtige wandelpaden door het bos en weidse vergezichten. Vrij toegankelijk.", adres: "Amerongse Berg, Amerongen",   photo: ImgAmerongseBerg, web: "https://www.staatsbosbeheer.nl/uit-in-de-natuur/boswachterspad-landal-amerongse-berg" },
    { emoji: "🌿", naam: "Tuinen van Kraaybeekerhof", desc: "Biologische tuinen op het landgoed Kraaybeekerhof in Driebergen. Prachtige moestuin, kruidentuin en rondleidingen. Een rustpunt vol kleur en geur midden op de Heuvelrug.", adres: "Kraaijbeeklaan 1, Driebergen", photo: ImgKraaybeek, web: "https://kraaybeekerhof.nl/tuinen/" },
    { emoji: "🍇", naam: "Wijngaard Zeist",           desc: "Verrassende wijngaard midden in het Stichtse Landschap bij Zeist. Proef lokale wijnen, geniet van het uitzicht over de wijngaardpercelen en ontdek het verhaal achter de druiven.", adres: "Zeist", photo: ImgWijngaardZeist, web: "https://wijngaardzeist.nl/" },
];

const KASTELEN: Venue[] = [
    { naam: "Huis Doorn",                  desc: "Beroemd als het voormalige verblijf van de Duitse ex-keizer Wilhelm II.",                       adres: "Langbroekerweg 10, Doorn",          web: "https://www.huisdoorn.nl/",   photo: ImgHuisDoorn },
    { naam: "Landgoed Oud-Amelisweerd",    desc: "Prachtig natuurgebied met fijn restaurant, bakkerij en landwinkel De Veldkeuken.",             adres: "Koningslaan 11A, Bunnik",           web: "https://www.veldkeuken.nl/",          photo: ImgAmelisweerd      },
    { naam: "Kasteel Amerongen",           desc: "Een tipje van de kastelengeschiedenis van de Heuvelrug. Vlakbij boscafé Mas Montagne.",        adres: "Drostestraat 20, Amerongen",        web: "https://www.kasteelamerongen.nl/",    photo: ImgKasteelAmerongen },
    { naam: "Kasteel Duurstede",           desc: "Indrukwekkende middeleeuwse kasteelruïne direct aan de Rijn in Wijk bij Duurstede. Museum met eeuwenoude geschiedenis. Op 25 minuten fietsen.", adres: "Kasteel 1, Wijk bij Duurstede", web: "https://www.kasteelduurstede.nl/", photo: ImgKasteelDuurstede },
    { naam: "Slot Zeist",                  desc: "Prachtig 17e-eeuws kasteel midden in Zeist, omgeven door een monumentaal park. Regelmatig evenementen en markten.",                    adres: "Zinzendorflaan 1, Zeist",           web: "https://www.slotzeist.nl/",            photo: ImgSlotZeist },
    { naam: "Kasteel Rhijnauwen",          desc: "Monumentale buitenplaats bij Bunnik met een van de grootste terrassen van Nederland. Perfecte fietsstop langs de Kromme Rijn. 20 min fietsen.",           adres: "Rhijnauwenselaan 14, Bunnik",  web: "https://geheimvandegraaf.nl/locaties/kasteel-rhijnauwen/", photo: ImgRhijnauwen },
    { naam: "Kasteel de Haar",             desc: "Het meest complete middeleeuwse kasteel van Nederland. Gerestaureerd eind 19e eeuw door Pierre Cuypers. Prachtige torens, staatsievertrekken en tuinen. 30 min auto.", adres: "Kasteellaan 1, Haarzuilens", web: "https://www.kasteeldehaar.nl/", photo: ImgDeHaar },
    { naam: "Paleis Soestdijk",            desc: "Voormalig zomerverblijf van koningin Juliana en prins Bernhard. Nu opengesteld als museum en evenementenlocatie in het bos van Baarn. 25 min auto.", adres: "Amsterdamsestraatweg 1, Baarn", web: "https://www.paleissoestdijk.nl/", photo: ImgPaleisSoestdijk },
];

const ACTIVITEITEN: BzItem[] = [
    { emoji: "🏎️", naam: "Kartcircuit Driebergen", desc: "Uniek kartcircuit van 750 meter lang. Prijzen vanaf €15.",                                                                    adres: "De Woerd 7, Driebergen",        web: "kartbaan.com",       photo: ImgKartbaan      },
    { emoji: "📚", naam: "Bibliotheek Driebergen", desc: "Ma–vr 10:00–17:00, zaterdag 10:00–13:00.",                                                                                    adres: "Hoofdstraat 164, Driebergen",   web: "bibliotheekzout.nl", photo: ImgBibliotheek   },
    { emoji: "💪", naam: "Sport & Fitness",         desc: "Fitline (Hoofdstraat 166) · Health Center Hoenderdaal (De Hoendersteeg 7) · Laco Sportcentrum De Zwoer (Schellingerlaan 20).", adres: "Driebergen",                   web: null,                 photo: ImgSportFitness  },
    { emoji: "🎬", naam: "Pathé Cinema",            desc: "Meerdere locaties in de regio: Utrecht Leidsche Rijn, Utrecht centrum, Amersfoort en Ede.",                                  adres: "o.a. Berlijnplein 100, Utrecht",web: null,                 photo: ImgPatheCinema   },
    { emoji: "🎭", naam: "Restaurant Theater Figi", desc: "Iconisch theater en restaurant in het hart van Zeist. Uitstekende keuken, grandioze zalen en een gevarieerd cultureel programma het hele jaar door.", adres: "Canadaplein 1, Zeist", web: "https://www.figi.nl/", photo: ImgFigi },
];


const VenueCard = ({ v }: { v: Venue }) => {
    let displayDomain = v.web;
    try { displayDomain = new URL(v.web).hostname.replace(/^www\./, ""); } catch {}
    return (
        <a href={v.web} target="_blank" rel="noreferrer" className="venue-card">
            <div className="venue-photo">
                <img src={v.photo} alt={v.naam} loading="lazy" />
            </div>
            <div className="venue-body">
                <strong className="venue-naam">{v.naam}</strong>
                <p className="venue-desc">{v.desc}</p>
                <span className="venue-adres">{v.adres}</span>
                <span className="venue-web">{displayDomain} →</span>
            </div>
        </a>
    );
};

const BzCard = ({ b }: { b: BzItem }) => {
    let displayWeb = b.web ?? "";
    try { if (b.web) displayWeb = new URL(b.web).hostname.replace(/^www\./, ""); } catch {}
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
                {b.web && <span className="venue-web">{displayWeb} →</span>}
            </div>
        </>
    );
    return b.web
        ? <a href={b.web} target="_blank" rel="noreferrer" className="venue-card">{inner}</a>
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
                <div className="omg-hero-map-overlay">
                    <div className="omg-hero-map-text">
                        <span className="omg-eyebrow">Locatie</span>
                        <h1>Midden in het groen,<br />vlak bij alles</h1>
                        <p>Driebergen-Rijsenburg op de Utrechtse Heuvelrug. Bos op de stoep. Utrecht in een kwartier. Amsterdam in veertig minuten.</p>
                    </div>
                    <nav className="omg-hero-quicknav" aria-label="Snelnavigatie">
                        <a href="#eten"              className="omg-qnav-card">🍽️ <span>Eten & Drinken</span></a>
                        <a href="#markten"           className="omg-qnav-card">🛍️ <span>Markten</span></a>
                        <a href="#bezienswaardigheden" className="omg-qnav-card">🌿 <span>Ontdekken</span></a>
                        <a href="#kastelen"          className="omg-qnav-card">🏰 <span>Kastelen</span></a>
                        <a href="#activiteiten"      className="omg-qnav-card">🎭 <span>Activiteiten</span></a>
                        <a href="#vervoer"           className="omg-qnav-card">🚂 <span>Vervoer</span></a>
                    </nav>
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
            <section id="vervoer" className="omg-transport reveal-section" ref={addRef} aria-label="Vervoer">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Vervoer & Bereikbaarheid</h2>
                    <p className="omg-section-sub">Trein, bus of fiets. Driebergen is goed bereikbaar.</p>
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
                                <li>OV Fiets: €4,65 (na 3 dagen €9,65 p.d.)</li>
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
            <section id="eten" className="omg-eten reveal-section" ref={addRef} aria-label="Eten en drinken">
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

            {/* Markten */}
            <section id="markten" className="omg-boodschappen reveal-section" ref={addRef} aria-label="Markten">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Markten</h2>
                    <p className="omg-section-sub">Wekelijkse en seizoensmarkten in de omgeving.</p>
                    <div className="omg-venues-grid">
                        {MARKTEN.map((v) => <VenueCard key={v.naam} v={v} />)}
                    </div>
                </div>
            </section>

            {/* Bezienswaardigheden */}
            <section id="bezienswaardigheden" className="omg-bz reveal-section" ref={addRef} aria-label="Bezienswaardigheden">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Things to see</h2>
                    <p className="omg-section-sub">Dompel jezelf onder in de schatten van de Utrechtse Heuvelrug.</p>
                    <div className="omg-venues-grid">
                        {BEZIENSWAARDIGHEDEN.map((b) => <BzCard key={b.naam} b={b} />)}
                    </div>
                </div>
            </section>

            {/* Kastelen */}
            <section id="kastelen" className="omg-kastelen reveal-section" ref={addRef} aria-label="Kastelen en landgoederen">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Kastelen & Landgoederen</h2>
                    <p className="omg-section-sub">Kastelen, landgoederen en een rijke geschiedenis op fietsafstand.</p>
                    <div className="omg-venues-grid">
                        {KASTELEN.map((v) => <VenueCard key={v.naam} v={v} />)}
                    </div>
                </div>
            </section>

            {/* Ontdekken */}
            <section id="activiteiten" className="omg-ontdekken reveal-section" ref={addRef} aria-label="Activiteiten">
                <div className="omg-section-inner">
                    <h2 className="omg-section-title">Ontdekken</h2>
                    <p className="omg-section-sub">Rondom en in Driebergen.</p>
                    <div className="omg-venues-grid">
                        {ACTIVITEITEN.map((a) => <BzCard key={a.naam} b={a} />)}
                    </div>
                </div>
            </section>

        </main>
    );
};

export default Omgeving;
