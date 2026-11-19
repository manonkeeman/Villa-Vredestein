import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import "./Tijdlijn.css";

import ImgVilla1910 from "../../Assets/Images/VillaVredestein1910.jpg";
import ImgAnsichtVredesteinP from "../../Assets/Images/hist-ansicht-vredestein-pension.jpg";
import ImgKrant1912 from "../../Assets/Images/Krant1912.jpg";
import ImgKrantOpening1912 from "../../Assets/Images/krant-1912-opening-het-nieuws.jpg";
import ImgKrant1954 from "../../Assets/Images/Krant1954.jpg";
import ImgFamilieRoelofsen from "../../Assets/Images/hist-familie-roelofsen.jpg";
import ImgGekocht2020 from "../../Assets/Images/hist-gekocht-2020.jpg";
import ImgSlopen from "../../Assets/Images/rest-slopen.jpg";
import ImgAmelisweerd from "../../Assets/Images/omg-amelisweerd.jpg";
import ImgKachelBouw from "../../Assets/Images/rest-kachel-bouw.jpg";
import ImgMoestuinBloei from "../../Assets/Images/tuin-moestuin-bloei.jpg";
import { useContent } from "../../i18n/content";

const historisch = [
    {
        datum: "Vóór de villa",
        titel: "Timmerman Fukkink",
        emoji: "🪚",
        status: "historisch",
        tekst: "Voordat Vredestein er stond, woonde op deze plek een timmerman met de naam Fukkink. Meer is over hem nog niet bekend.",
    },
    {
        datum: "1905",
        titel: "De villa wordt gebouwd",
        emoji: "🏛️",
        status: "historisch",
        tekst: "Burgemeester Baltus Koker van Krimpen aan den IJssel laat aan de Hoofdstraat in Driebergen-Rijsenburg een statig buitenhuis bouwen. Hoge plafonds, dikke muren en een ziel die meer dan een eeuw later nog voelbaar is.",
        detail: "Koker koos voor vakmanschap dat generaties zou meegaan: sierstucwerk aan de plafonds, hoge paneeldeuren, een imposante schouw en forse houten balken. De locatie aan de Hoofdstraat was geen toeval. Driebergen was in die tijd een geliefde villawijk voor gegoede burgers uit de steden.",
        afbeelding: ImgVilla1910,
        afbeeldingAlt: "Villa Vredestein circa 1910, een van de vroegste bekende foto's",
    },
    {
        datum: "Juni 1912",
        titel: "Christelijk Rustoord Vredestein",
        emoji: "🕊️",
        status: "historisch",
        tekst: "Op 3 juni 1912 opent het Christelijk Rust- en Herstellingsoord Vredestein zijn deuren, een oord der ruste voor de kleine burger. De openingsrede wordt gehouden door ds. W. Verhoef uit Zeist.",
        detail: "In de zomer logeren er vijftien tot dertig gasten, vooral uit Rotterdam en Amsterdam, voor f 1,25 per dag (1915). In 1916 wordt een villa Vredestein aan de straatweg geveild voor f 7.400, waarschijnlijk dit pand. In 1918 is er een benefietavond voor het fonds Draagt elkanders lasten, voor rustkuren voor wie die niet kan betalen.",
        afbeelding: ImgKrantOpening1912,
        afbeeldingAlt: "Het Nieuws van 8 juni 1912 over de opening van het rustoord",
    },
    {
        datum: "1912, 1921",
        titel: "Familie Sluijter",
        emoji: "📰",
        status: "historisch",
        tekst: "Directeur W. Sluijter en zijn gezin leiden het christelijke rustoord. Krantenartikelen uit die periode getuigen van een druk en actief huis: vacatures voor keukenmeiden, ingezonden stukken en advertenties.",
        detail: "De krantenknipsels lopen van 1912 tot diep in de jaren dertig. Vacatures, bijeenkomsten en af en toe nieuws over de inbraak in 1928 schilderen een levendig beeld van het pension in zijn bloeitijd.",
        afbeelding: ImgKrant1912,
        afbeeldingAlt: "Krantenbericht over het pension, oktober 1912",
    },
    {
        datum: "1923, 1925",
        titel: "Gezusters van der Zijden",
        emoji: "🌿",
        status: "historisch",
        tekst: "Pension Villa Vredestein van de gezusters Van der Zijden: „3 groote zitkamers met serre, 7 frissche slaapkamers met balcons. Mooie tuin.”",
    },
    {
        datum: "1926, 1933",
        titel: "Gezusters van de Bosch",
        emoji: "🏨",
        status: "historisch",
        tekst: "In 1926 nemen de Dames Van den Bosch het over als zomer- en winterpension tegen billijke prijzen. De villa opent haar deuren voor gasten die rust en bezinning zoeken in de bossen van Driebergen.",
        detail: "In juni 1933 adverteren ze landelijk met Pension „Villa Vredenstein”: kamers voor families, met aparte bediening en stromend water. Na de samenvoeging van de gemeenten in 1931-1932 wordt het huisnummer Hoofdstraat 83 omgezet in 147.",
        afbeelding: ImgAnsichtVredesteinP,
        afbeeldingAlt: "Ansichtkaart van Pension Villa Vredestein",
    },
    {
        datum: "1939, 1945",
        titel: "Oorlogsjaren",
        emoji: "⚔️",
        status: "historisch",
        tekst: "Vlak voor de oorlog gebruikt verzekeringsagent J.H.L. de Bruin het adres voor zijn advertenties. In 1941 woont J.J. Vierkant op Hoofdstraat 147 en in 1944 J.J. van der Weerd, de plaatselijke leider van het Nederlandsch Arbeidsfront in Driebergen. Het pand is dan het kantoor van deze organisatie onder Duits bewind.",
        detail: "In 1944 houdt J.J. van der Weerd elke dinsdagavond spreekuur te zijnen huize, Hoofdstraat 147. In 1940 en 1941 zit er ook Maison Daman, een zaak in betere dameskleding. Daarnaast bestaat in 1940 nog gewoon een ansichtkaart van Pension Vredestein.",
    },
    {
        datum: "1945, 1969",
        titel: "Pension en verzorgingshuis",
        emoji: "🌺",
        status: "historisch",
        tekst: "Direct na de bevrijding exploiteert J.J. Vierkant in het pand Café-Restaurant Hotel Royal: „Kamers met stromend water. Geheel gerestaureerd.” Daarna duikt mevrouw Wasterval op, met inwonend personeel. In de jaren vijftig is het weer Pension Vredestein en vanaf 1959 een verzorgingshuis voor ouderen. Mevrouw Elings heeft het huis in deze periode onder haar hoede.",
        detail: "Mevrouw Wasterval zoekt in 1947 via advertenties een net meisje voor dag en nacht en een huisnaaister. In 1954 verhuurt het pension zitkamers en slaapkamers met pension, onder meer aan echtparen. In 1958 wordt een mooie kamer parterre met volledig pension aangeboden en in 1959 adverteert Verzorgingshuis Vredestein met twee vrije kamers. Daarna biedt C.L. van Alderden kamers aan voor oudere echtparen met prima verzorging en is mevrouw De Vries in 1958 waarschijnlijk uitbaatster. Een vacature voor verpleegdames uit 1965 getuigt van een actief huis. Rond 1969 volgt de laatste vermelding als klein rusthuis: het einde van ruim 55 jaar rust en zorg.",
        afbeelding: ImgKrant1954,
        afbeeldingAlt: "Te huur-advertentie uit april 1954, tijdens het beheer van mevrouw Elings",
    },
    {
        datum: "1964, 1971",
        titel: "Familie Roelofsen",
        emoji: "🏡",
        status: "historisch",
        tekst: "Familie Roelofsen bewoont de villa gedurende bijna een decennium. Het pand blijft een vertrouwd gezicht aan de Hoofdstraat in Driebergen.",
        afbeelding: ImgFamilieRoelofsen,
        afbeeldingAlt: "Familie Roelofsen, die opgroeide in Vredestein in de jaren zestig en zeventig",
    },
    {
        datum: "1975, 1977",
        titel: "Ortholab",
        emoji: "🔬",
        status: "historisch",
        tekst: "Ortholab B.V. vestigt een orthodontisch laboratorium in de villa. Het bedrijf zoekt technici, administratief personeel en parttimers en biedt eventueel woonruimte aan.",
    },
    {
        datum: "1982, 1986",
        titel: "Het pand wordt gesplitst",
        emoji: "🚪",
        status: "historisch",
        tekst: "In de jaren tachtig is het pand opgesplitst: naast Hoofdstraat 147 bestaat ook 147a, dat in die jaren bewoond wordt door een Driebergs gezin.",
    },
    {
        datum: "Na Ortholab, 2019",
        titel: "Familie Blooi",
        emoji: "🎓",
        status: "historisch",
        tekst: "Dhr. Blooi, van een loodgieters- en dakdekkersbedrijf, koopt het pand na Ortholab en blijft eigenaar tot zijn overlijden. Onder zijn beheer is Vredestein ook een studentenhuis, onder meer voor de IVA-opleiding in Driebergen.",
        detail: "Dhr. Blooi werkte zelf veel aan het pand. In de loop van de decennia raakte het totaaloverzicht verloren. Pas bij de restauratie in 2021 kwamen gasleidingen in de tuin en andere bijzondere aansluitingen aan het licht. In 1982 is het pand inzamelpunt van de Polenhulpactie. In welke jaren precies studenten in het huis woonden, wordt nog uitgezocht.",
    },
];

const renovatie = [
    {
        datum: "2020",
        titel: "Manon & Maxim kopen de villa",
        emoji: "🗝️",
        status: "gedaan",
        tekst: "Maxim groeide op in Driebergen. Na zijn scheiding bleef hij verbonden aan de buurt voor zijn kinderen en kocht een pand vlak bij zijn ouderlijk huis. Hij zag de grootte, de ruimte en de schuur. Als oud-IVA-student vond hij het mooi dit studentenhuis in stand te houden. Manon ruilde Amsterdam en de zee voor de Utrechtse Heuvelrug. Ze mist het strand, maar werkt nu in Culemborg en is er stilletjes fan van geworden.",
        detail: "De villa was in de jaren zeventig rigoureus verbouwd: kersenhout overal, karrenwielen verwerkt in de muren en bronzen deurhendels die losvielen zodra je ze openmaakte. De begane grondvloer was verrot en we hebben de kruipkelder opgeheven voor een industriële betonnen gietvloer, geïsoleerd met kleikorrels en daarna gevlinderd tot een mooie industriële basis. Op de verdiepingen werken we met een gebrande grenenvloer en brengen we de panelen terug in oude glorie. Het sierstucwerk was helaas verdwenen en dat hebben we opgelost met kroonluchters. We willen wel de markiezen, de openslaande deuren en de ramen met glas in lood terugbrengen. Via contact met de familie Roelofsen kregen we in 2022 de kans heel veel foto's te zien van vóór de radicale jaren zeventig verbouwing. We mochten de hele familie uitnodigen en hoorden alle jeugdverhalen: het roetsjen van de trapleuning, de schuurfeesten en de gaarkeuken met de kolenkachel. De meest waardevolle foto die we ooit van dit huis hebben gezien. Er is nog steeds contact en ze houden graag de verbouwing bij van hun jeugdhuis.",
        afbeelding: ImgGekocht2020,
        afbeeldingAlt: "Oktober 2020, Maxim ontvangt de sleutels van Hoofdstraat 147",
    },
    {
        datum: "2021, 2022",
        titel: "De restauratie begint",
        emoji: "🔨",
        status: "gedaan",
        tekst: "Van kelder tot zolder gestript en opnieuw opgebouwd. 15 cm isolatie, volledig gestuct, vloerverwarming in de betonnen gietvloer en airco's op de verdiepingen. Alle elektriciteit en leidingwerk vernieuwd. Van 11 kamers naar 7, met 3 badkamers, twee keukens, een kitchenette en een sportkamer.",
        detail: "Elke ruimte werd teruggestript naar de basis. De wanden zijn voorzien van 15 centimeter isolatie en daarna volledig opnieuw gestuct. In de industriële betonnen gietvloer op de begane grond is vloerverwarming aangebracht. Op de tweede en derde verdieping hangen airco's: de voorkant van het huis staat recht op de zon en warmt in de zomer flink op. Vroeger plantten bewoners lindenbomen voor de deur voor schaduw. Wij kozen voor een open tuin met zicht op de straat. Alle elektriciteit is vernieuwd en aangepast aan de moderne eisen. Hetzelfde geldt voor het leidingwerk. Dhr. Blooi was loodgieter en had door de jaren heen veel zelf aan elkaar geplakt. Het totaaloverzicht was verloren gegaan: bij het uitgraven vonden we gasleidingen in de tuin en andere gevaarlijke aansluitingen. Alles is veiliggesteld en opnieuw aangelegd. Het doel blijft het huis in oude glorie terugbrengen, maar naar de moderne eisen van duurzaamheid en klimaat.",
        afbeelding: ImgSlopen,
        afbeeldingAlt: "Slopen, het begin van de grote transformatie",
    },
    {
        datum: "2023",
        titel: "De omgeving ontdekt",
        emoji: "🌳",
        status: "gedaan",
        tekst: "De villa staat niet op zichzelf. Driebergen-Rijsenburg biedt bos, rust en architectuur die je nergens anders vindt. De omgeving werd een bewuste keuze.",
        detail: "Het Nationaal Park Utrechtse Heuvelrug begint letterlijk aan de achterdeur. Utrecht ligt op een kwartier, Amsterdam op veertig minuten. Driebergen was geen compromis, maar een bewuste keuze. En dat verschil voel je.",
        afbeelding: ImgAmelisweerd,
        afbeeldingAlt: "Landgoed Amelisweerd, onderdeel van de groene omgeving rond de villa",
    },
    {
        datum: "2024",
        titel: "Woonkamer & interieur",
        emoji: "🔥",
        status: "gedaan",
        tekst: "Een houtkachel brengt de warmte van vroeger terug. De woonkamer is ingericht met vintage vondsten: van veilingen, van reizen, soms gerepareerd en opnieuw gestoffeerd in India. Elk meubelstuk heeft een verhaal.",
        detail: "We hebben een houtkachel teruggebracht in het huis. Het vuur geeft de woonkamer precies de warmte die een pand van deze leeftijd verdient. De inrichting is samengesteld uit vintage vondsten: soms trekken we een dag door Nederland op zoek naar iets bijzonders, soms repareren we een oude bank en laten die herstofferen in India. Op veilingen vinden we prachtige Eicholtz-meubels en passen de rest van de inrichting daarop aan. Elk meubelstuk heeft een verhaal. Wij wonen in principe beneden, de studenten en de kinderen delen de ruimtes boven. Ze zijn volwassen en hebben zo hun eigen leefwereld. Je hoeft hier niet per se samen te komen, maar dat doe je toch.",
        afbeelding: ImgKachelBouw,
        afbeeldingAlt: "De houtkachel 'Carpe Diem' wordt geplaatst en ingemetseld",
    },
    {
        datum: "Vroegejaar 2025",
        titel: "De tuin wordt wakker",
        emoji: "🌱",
        status: "bezig",
        tekst: "De sauna met dompelbad zet de toon. Passieflora, jasmijn en kruiden in potten voor geur en kleur. Een moestuin om uit te eten. En achteraan de schuur van 110 m² met werkplaats, veranda en buitenkeuken.",
        detail: "De tuin komt als laatste aan de beurt maar heeft de meeste plannen. Een sauna met dompelbad wordt het rustpunt in de buitenruimte. Daaromheen een kleine urban tuin met passieflora, jasmijn en kruiden in potten. Een moestuin voor het eigen eten. Helemaal achteraan de schuur van 110 m²: ruimte om te klussen aan auto's en andere projecten, een veranda en een buitenkeuken. Voor zowel ons als de studenten.",
        afbeelding: ImgMoestuinBloei,
        afbeeldingAlt: "De moestuin in bloei",
    },
    {
        datum: "Zomer 2025",
        titel: "Badkamer renovatie",
        emoji: "🚿",
        status: "gepland",
        tekst: "De grote klus op de eerste verdieping. Nieuwe tegels, nieuwe kranen, nieuwe energie. Dit wordt het pronkstuk van boven.",
        detail: "Nog in voorbereiding. Materialen zijn gekozen, inspiratie is er genoeg. Zodra het werk begint, volgt een update.",
    },
    {
        datum: "Wordt vervolgd",
        titel: "Meer plannen onderweg",
        emoji: "✨",
        status: "toekomst",
        tekst: "Villa Vredestein is een werk in uitvoering. Er zijn altijd meer ideeën dan tijd. En juist dat maakt dit huis zo bijzonder.",
        detail: "Volg de tijdlijn. Er komen updates over de schuur, de voortuin, de kamers en veel meer.",
    },
];

const statusLabel = {
    historisch: "Geschiedenis",
    gedaan: "Afgerond",
    bezig: "In uitvoering",
    gepland: "Gepland",
    toekomst: "Binnenkort",
};

function TijdlijnItem({ item, index, globalIndex, expanded, onKlik, innerRef }) {
    const tc = useContent();
    const isOpen = expanded === globalIndex;

    return (
        <div
            className={`tijdlijn-item ${index % 2 === 0 ? "links" : "rechts"} fade-trigger`}
            ref={innerRef}
        >
            <div className="tijdlijn-dot"><span>{tc(item.emoji)}</span></div>

            <div className={`tijdlijn-kaart ${item.detail ? "kaart-expandable" : ""} ${isOpen ? "kaart-open" : ""}`}>
                {item.afbeelding && (
                    <div className="tijdlijn-kaart-img-wrap">
                        <img
                            src={item.afbeelding}
                            alt={tc(item.afbeeldingAlt || item.titel)}
                            loading="lazy"
                            className="tijdlijn-kaart-img"
                        />
                    </div>
                )}
                <div className="tijdlijn-kaart-header">
                    <span className="tijdlijn-datum">{tc(item.datum)}</span>
                    <span className={`tijdlijn-badge badge-${item.status}`}>{tc(statusLabel[item.status])}</span>
                </div>
                <h3>{tc(item.titel)}</h3>
                <p className="tijdlijn-preview">{tc(item.tekst)}</p>

                {item.detail && (
                    <div className={`tijdlijn-detail ${isOpen ? "detail-open" : ""}`}>
                        <div className="tijdlijn-detail-inner">
                            <p>{tc(item.detail)}</p>
                        </div>
                    </div>
                )}

                {item.detail && (
                    <button
                        className="tijdlijn-lees-meer"
                        onClick={() => onKlik(globalIndex)}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? tc("Minder lezen") : tc("Lees meer")}
                        <span className={`lees-meer-pijl ${isOpen ? "pijl-omhoog" : ""}`} aria-hidden="true">↓</span>
                    </button>
                )}
            </div>
        </div>
    );
}

const Tijdlijn = () => {
    const tc = useContent();
    const { i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";
    const itemsRef = useRef([]);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
            { threshold: 0.12 }
        );
        itemsRef.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleKlik = (i) => setExpanded(expanded === i ? null : i);

    return (
        <main className="tijdlijn-page">
            <Helmet>
                <html lang={langCode} />
                <title>{tc("Tijdlijn, Villa Vredestein")}</title>
                <meta name="description" content={tc("Van 1905 tot nu: de volledige geschiedenis van Villa Vredestein. De bewoners, de restauratie en de plannen voor de toekomst.")} />
                <link rel="canonical" href="https://villavredestein.com/tijdlijn" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.com/tijdlijn" />
                <meta property="og:title" content={tc("Tijdlijn, Villa Vredestein")} />
                <meta property="og:description" content={tc("Van 1905 tot nu: de volledige geschiedenis van Villa Vredestein. De bewoners, de restauratie en de plannen voor de toekomst.")} />
                <meta property="og:image" content="https://villavredestein.com/og-image.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:alt" content={tc("Villa Vredestein, historische villa in Driebergen-Rijsenburg")} />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={tc("Tijdlijn, Villa Vredestein")} />
                <meta name="twitter:description" content={tc("Van 1905 tot nu: de volledige geschiedenis van Villa Vredestein. De bewoners, de restauratie en de plannen voor de toekomst.")} />
                <meta name="twitter:image" content="https://villavredestein.com/og-image.jpg" />
            </Helmet>

            <header className="tijdlijn-header">
                <h1>{tc("Tijdlijn Villa Vredestein")}</h1>
                <p>{tc("Van 1905 tot nu: de volledige geschiedenis van het pand, de bewoners door de jaren heen, de restauratie en de plannen voor de toekomst.")}</p>
            </header>

            <div className="tijdlijn-sectie-label">{tc("📜 Geschiedenis")}</div>

            <div className="tijdlijn-container">
                <div className="tijdlijn-lijn tijdlijn-lijn--historisch" />
                {historisch.map((item, i) => (
                    <TijdlijnItem
                        key={`h-${i}`}
                        item={item}
                        index={i}
                        globalIndex={i}
                        expanded={expanded}
                        onKlik={handleKlik}
                        innerRef={(el) => (itemsRef.current[i] = el)}
                    />
                ))}
            </div>

            <div className="tijdlijn-sectie-label">{tc("🔨 Renovatie & toekomst")}</div>

            <div className="tijdlijn-container">
                <div className="tijdlijn-lijn" />
                {renovatie.map((item, i) => {
                    const globalIndex = historisch.length + i;
                    return (
                        <TijdlijnItem
                            key={`r-${i}`}
                            item={item}
                            index={i}
                            globalIndex={globalIndex}
                            expanded={expanded}
                            onKlik={handleKlik}
                            innerRef={(el) => (itemsRef.current[globalIndex] = el)}
                        />
                    );
                })}
            </div>
        </main>
    );
};

export default Tijdlijn;
