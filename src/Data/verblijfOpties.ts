import IntMiddenverdieping from "../Assets/Images/int-middenverdieping.jpg";
import IntWoonkamer        from "../Assets/Images/int-woonkamer.jpg";
import IntWoonkamer2       from "../Assets/Images/int-woonkamer2.jpg";
import IntKroonluchter     from "../Assets/Images/int-kroonluchter.jpg";
import TuinTerras          from "../Assets/Images/tuin-terras.jpg";
import ExtVillaVoorkant    from "../Assets/Images/ext-villa-voorkant.jpg";
import ExtVillaBloei       from "../Assets/Images/ext-villa-bloei.jpg";
import ExtGevel            from "../Assets/Images/ext-gevel.jpg";
import LifeKoken           from "../Assets/Images/life-koken.jpg";

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
        titel: "Privékamer",
        sub: "In de villa",
        beschrijving: "Eigen kamer op de middelste verdieping, met of zonder balkon — dezelfde opzet als de studentenkamers, maar dan op aanvraag.",
        langeBeschrijving: [
            "Deze privékamer bevindt zich op de middelste verdieping van Villa Vredestein — dezelfde verdieping waar onze vaste bewoners een eigen kamer met balkon hebben.",
            "Je deelt de woonkamer en keuken met de andere bewoners van de villa, en hebt vrij gebruik van de tuin en het terras. Een parkeerplaats op de oprit is inbegrepen.",
            "Omdat de indeling van deze verdieping nog in ontwikkeling is, bespreken we de exacte kamer en beschikbaarheid altijd persoonlijk — vandaar 'op aanvraag'.",
        ],
        vanaf: "Op aanvraag",
        kenmerken: ["Eigen kamer", "Middelste verdieping", "Met of zonder balkon", "Gedeelde woonkamer & keuken", "Tuin & terras", "Parkeerplaats"],
        afbeeldingen: [
            { src: IntMiddenverdieping, alt: "De middelste verdieping van Villa Vredestein" },
            { src: IntWoonkamer, alt: "Gedeelde woonkamer in Villa Vredestein" },
            { src: TuinTerras, alt: "Tuin en terras van Villa Vredestein" },
            { src: ExtVillaBloei, alt: "Villa Vredestein in bloei" },
        ],
    },
    {
        id: "tijdelijk",
        icon: "📅",
        titel: "Tijdelijk verblijf",
        sub: "Kort of lang",
        beschrijving: "Op zoek naar tijdelijk onderdak tijdens je studie, of een IVA-student op zoek naar een kamer op loopafstand? We denken graag mee.",
        langeBeschrijving: [
            "Onze studentenverdieping, bovenin de villa, bestaat uit gemeubileerde kamers met een gedeelde keuken, badkamer en zitruimte — ideaal voor een tijdelijk verblijf tijdens je studie of stage.",
            "We verhuren geregeld aan IVA-studenten die op loopafstand van school willen wonen, maar denken ook graag mee bij andere tijdelijke woonvragen: van een paar weken tot een heel studiejaar.",
            "Internet, een parkeerplaats en toegang tot de tuin zijn altijd inbegrepen. De exacte duur en voorwaarden stemmen we in overleg af.",
        ],
        vanaf: "Op aanvraag",
        kenmerken: ["Flexibele duur", "Gemeubileerd", "Inclusief internet", "Gedeelde keuken, badkamer en woonruimte", "Parkeerplaats", "Beschikbaarheid in overleg"],
        featured: true,
        afbeeldingen: [
            { src: ExtVillaVoorkant, alt: "Voorgevel van Villa Vredestein" },
            { src: IntWoonkamer2, alt: "Gedeelde zitruimte in Villa Vredestein" },
            { src: LifeKoken, alt: "Samen koken in de gedeelde keuken" },
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
            "Voor wie de hele villa wil: zes slaapkamers (een zevende in aanbouw), drie keukens en een grote tuin met terras — allemaal voor jouw familie of groep alleen.",
            "De benedenverdieping heeft een riante woonkamer met houtkachel, een keukeneiland met bar en een aparte eetkamer, perfect voor een langer verblijf met meerdere gezinsleden.",
            "Deze optie is geliefd bij expats die net in Nederland zijn, en bij gezinnen die tijdelijk een thuis zoeken tijdens een eigen verbouwing.",
        ],
        vanaf: "Op aanvraag",
        kenmerken: ["6 slaapkamers (7e in aanbouw)", "Volledige woonkamer", "3 keukens", "3 badkamers (derde in aanbouw)", "Grote tuin & terras", "Oprit met parkeerplaats"],
        afbeeldingen: [
            { src: ExtVillaVoorkant, alt: "Voorgevel van Villa Vredestein" },
            { src: IntWoonkamer, alt: "Woonkamer van Villa Vredestein" },
            { src: IntKroonluchter, alt: "Kristallen kroonluchter in Villa Vredestein" },
            { src: ExtGevel, alt: "Gevel van Villa Vredestein" },
        ],
    },
];
