import IntWoonkamer        from "../Assets/Images/int-woonkamer.jpg";
import IntWoonkamer2       from "../Assets/Images/int-woonkamer2.jpg";
import IntBank             from "../Assets/Images/int-bank.jpg";
import IntKroonluchter     from "../Assets/Images/int-kroonluchter.jpg";
import TuinTerras          from "../Assets/Images/tuin-terras.jpg";
import ExtVillaVoorkant    from "../Assets/Images/ext-villa-voorkant.jpg";

export type VerblijfAfbeelding = { src: string; alt: string };

export type VerblijfOptie = {
    id: string;
    icon: string;
    titel: string;
    sub: string;
    beschrijving: string;
    langeBeschrijving: string[];
    vanaf: string;
    kenmerken: string[];
    afbeeldingen: VerblijfAfbeelding[];
    featured?: boolean;
};

export const OPTIES: VerblijfOptie[] = [
    {
        id: "kamer",
        icon: "🛏️",
        titel: "Logeerkamer",
        sub: "Voor één nacht",
        beschrijving: "Gastvrije logeerkamer voor een nacht, op de bovenste verdieping tussen de studenten in.",
        langeBeschrijving: [
            "Op doorreis, een feestje in de buurt, of gewoon zin om een nachtje te logeren? Deze kamer op de bovenste verdieping van Villa Vredestein is te boeken voor één nacht.",
            "Je hebt een eigen kamer en deelt de badkamer, keuken en zitruimte met de andere bewoners van deze verdieping. Vrij gebruik van de tuin en het terras, en een parkeerplaats op de oprit, zijn ook inbegrepen.",
            "Boek eenvoudig via het formulier hieronder, we laten je snel weten of de kamer die nacht beschikbaar is.",
        ],
        vanaf: "Op aanvraag",
        kenmerken: ["Voor één nacht", "Eigen kamer", "Gedeelde badkamer & keuken", "Gedeelde zitruimte", "Tuin & terras", "Parkeerplaats"],
        afbeeldingen: [
            { src: ExtVillaVoorkant, alt: "Voorgevel van Villa Vredestein, met de kamers op de bovenste verdieping" },
            { src: IntWoonkamer2, alt: "Gedeelde woonkamer in Villa Vredestein" },
            { src: TuinTerras, alt: "Tuin en terras van Villa Vredestein" },
            { src: IntKroonluchter, alt: "Kristallen kroonluchter in Villa Vredestein" },
        ],
    },
    {
        id: "tijdelijk",
        icon: "📅",
        titel: "Tijdelijk verblijf",
        sub: "Alleen IVA-studenten",
        beschrijving: "Gemeubileerde kamer voor de duur van je studie bij de IVA, op loopafstand van school.",
        langeBeschrijving: [
            "Onze studentenverdieping, bovenin de villa, bestaat uit gemeubileerde kamers met een gedeelde badkamer, keuken en zitruimte. Ideaal voor een tijdelijk verblijf tijdens je studie bij de IVA.",
            "Dit verblijf is uitsluitend voor IVA-studenten.",
            "Internet, een parkeerplaats en toegang tot de tuin zijn altijd inbegrepen. De exacte duur en voorwaarden stemmen we in overleg af.",
        ],
        vanaf: "Op aanvraag",
        kenmerken: ["Flexibele duur", "Gemeubileerd", "Inclusief internet", "Gedeelde badkamer, keuken en zitruimte", "Parkeerplaats"],
        featured: true,
        afbeeldingen: [
            { src: IntBank, alt: "Gedeelde zitruimte in Villa Vredestein" },
            { src: ExtVillaVoorkant, alt: "Voorgevel van Villa Vredestein, met de kamers op de bovenste verdieping" },
            { src: IntWoonkamer2, alt: "Gedeelde woonkamer in Villa Vredestein" },
            { src: TuinTerras, alt: "Tuin en terras van Villa Vredestein" },
        ],
    },
    {
        id: "villa",
        icon: "🏛️",
        titel: "Volledige villa",
        sub: "Exclusief gebruik",
        beschrijving: "De gehele Villa Vredestein voor jouw familie. Alle gemeenschappelijke ruimtes en de volledige tuin. Ook ideaal voor expats of als tijdelijk thuis tijdens een verbouwing.",
        langeBeschrijving: [
            "Voor wie de hele villa wil: zes slaapkamers (een zevende in aanbouw), drie keukens en een grote tuin met terras, allemaal voor jouw familie of groep alleen.",
            "De benedenverdieping heeft een riante woonkamer met houtkachel, een keukeneiland met bar en een aparte eetkamer, perfect voor een langer verblijf met meerdere gezinsleden.",
            "Deze optie is geliefd bij expats die net in Nederland zijn, en bij gezinnen die tijdelijk een thuis zoeken tijdens een eigen verbouwing.",
        ],
        vanaf: "Op aanvraag",
        kenmerken: ["6 slaapkamers (7e in aanbouw)", "Volledige woonkamer", "3 keukens", "3 badkamers (derde in aanbouw)", "Grote tuin & terras", "Oprit met parkeerplaats"],
        afbeeldingen: [
            { src: IntWoonkamer, alt: "Woonkamer van Villa Vredestein" },
            { src: IntKroonluchter, alt: "Kristallen kroonluchter in Villa Vredestein" },
            { src: ExtVillaVoorkant, alt: "Voorgevel van Villa Vredestein" },
            { src: TuinTerras, alt: "Tuin en terras van Villa Vredestein" },
        ],
    },
];
