import IntWoonkamer        from "../Assets/Images/int-woonkamer.jpg";
import IntWoonkamer2       from "../Assets/Images/int-woonkamer2.jpg";
import IntBank             from "../Assets/Images/int-bank.jpg";
import IntKroonluchter     from "../Assets/Images/int-kroonluchter.jpg";
import TuinTerras          from "../Assets/Images/tuin-terras.jpg";
import ExtVillaVoorkant    from "../Assets/Images/ext-villa-voorkant.jpg";
import FotoSchuurdeur      from "../Assets/Images/fotoproductie-schuurdeur.jpg";
import FotoSchuurdeur2     from "../Assets/Images/fotoproductie-schuurdeur-2.jpg";
import FotoBackstage1      from "../Assets/Images/fotoproductie-backstage-1.jpg";
import FotoBackstage2      from "../Assets/Images/fotoproductie-backstage-2.jpg";

export type VerblijfAfbeelding = { src: string; alt: string; pos?: string };

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
        sub: "Kort of voor langer",
        beschrijving: "Gastvrije kamer op de bovenste verdieping, tussen de studenten in, van een nacht tot een langer verblijf.",
        langeBeschrijving: [
            "Op doorreis, een feestje in de buurt, of een langer verblijf: deze kamer op de bovenste verdieping van Villa Vredestein is flexibel te boeken, van één nacht tot een langere periode.",
            "Je hebt een eigen kamer en deelt de badkamer, keuken en zitruimte met de andere bewoners van deze verdieping. Vrij gebruik van de tuin en het terras, en een parkeerplaats op de oprit, zijn ook inbegrepen.",
            "Boek eenvoudig via het formulier hieronder, we bespreken de gewenste duur en beschikbaarheid graag persoonlijk.",
        ],
        vanaf: "Op aanvraag",
        kenmerken: ["Vanaf één nacht", "Eigen kamer", "Gedeelde badkamer & keuken", "Gedeelde zitruimte", "Tuin & terras", "Parkeerplaats"],
        afbeeldingen: [
            { src: ExtVillaVoorkant, alt: "Voorgevel van Villa Vredestein, met de kamers op de bovenste verdieping" },
            { src: IntWoonkamer2, alt: "Gedeelde woonkamer in Villa Vredestein" },
            { src: TuinTerras, alt: "Tuin en terras van Villa Vredestein" },
            { src: IntKroonluchter, alt: "Kristallen kroonluchter in Villa Vredestein" },
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
    {
        id: "tijdelijk",
        icon: "📅",
        titel: "Tijdelijk verblijf",
        sub: "Alleen IVA-studenten",
        beschrijving: "Gemeubileerde kamer voor de duur van je studie bij de IVA, op loopafstand van school.",
        langeBeschrijving: [
            "Onze studentenverdieping, bovenin de villa, bestaat uit gemeubileerde kamers met een gedeelde badkamer, keuken en zitruimte. Ideaal voor een tijdelijk verblijf tijdens je studie bij de IVA.",
            "Dit verblijf is uitsluitend voor IVA-studenten. Maxim heeft zelf de IVA-opleiding gevolgd en is nog steeds bij de IVA-club betrokken, dus de band met de school is nooit ver weg.",
            "Praktische zaken regelen we digitaal via een eigen app: het schoonmaakrooster, de huisregels en betalingsherinneringen staan daar overzichtelijk bij elkaar.",
            "Internet, een parkeerplaats en toegang tot de tuin zijn altijd inbegrepen. De exacte duur en voorwaarden stemmen we in overleg af.",
        ],
        vanaf: "Op aanvraag",
        kenmerken: ["Flexibele duur", "Gemeubileerd", "Inclusief internet", "Digitaal rooster & huisregels via app", "Gedeelde badkamer, keuken en zitruimte", "Parkeerplaats"],
        featured: true,
        afbeeldingen: [
            { src: IntBank, alt: "Gedeelde zitruimte in Villa Vredestein" },
            { src: ExtVillaVoorkant, alt: "Voorgevel van Villa Vredestein, met de kamers op de bovenste verdieping" },
            { src: IntWoonkamer2, alt: "Gedeelde woonkamer in Villa Vredestein" },
            { src: TuinTerras, alt: "Tuin en terras van Villa Vredestein" },
        ],
    },
    {
        id: "fotoproductie",
        icon: "📸",
        titel: "Fotoproducties",
        sub: "Villa als decor",
        beschrijving: "Historische gevel, rustieke details, veel daglicht en kamers van vintage tot modern: Villa Vredestein is te huren als decor voor fotoshoots en (kleinschalige) producties.",
        langeBeschrijving: [
            "Met zijn historische gevel, rustieke details en een mix van vintage, rustieke en modern gerenoveerde kamers biedt Villa Vredestein volop variatie als decor voor fotoshoots en producties.",
            "Grote ramen zorgen voor veel natuurlijk licht, en de sfeervolle tuin en oprit bieden ruimte voor buitenopnames en voor de crew om op te stellen.",
            "De villa is al eerder gebruikt als decor voor een professionele fotoshoot. Van de rustieke schuurdeur tot sfeervolle vintage kamers en modern gerenoveerde ruimtes: er is voor elke shoot een passende setting.",
            "Er is voldoende parkeerruimte voor crew en apparatuur. Neem contact op om de mogelijkheden, beschikbaarheid en voorwaarden te bespreken.",
        ],
        vanaf: "Op aanvraag",
        kenmerken: [
            "Historische gevel",
            "Rustieke details",
            "Keuze uit vintage, rustieke en moderne kamers",
            "Grote ramen & veel daglicht",
            "Sfeervolle tuin & oprit",
            "Parkeerruimte voor crew",
            "In overleg beschikbaar",
        ],
        afbeeldingen: [
            { src: FotoSchuurdeur, alt: "Fotoshoot bij de rustieke schuurdeur van Villa Vredestein", pos: "center 15%" },
            { src: FotoBackstage1, alt: "Achter de schermen bij een professionele fotoshoot in Villa Vredestein", pos: "center 10%" },
            { src: FotoBackstage2, alt: "De fotograaf aan het werk tijdens een shoot in Villa Vredestein", pos: "center 10%" },
            { src: FotoSchuurdeur2, alt: "Fotoshoot bij Villa Vredestein", pos: "center 15%" },
        ],
    },
];
