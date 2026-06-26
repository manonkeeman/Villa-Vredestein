import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import "./GalerijVilla.css";


// Leven
import ImgRommertBram       from "../../Assets/Images/life-rommert-bram.jpg";
import ImgPannenkoeken2025  from "../../Assets/Images/life-pannenkoeken-2025.jpg";
import ImgKoken             from "../../Assets/Images/life-koken.jpg";
import ImgEtenOekrainers    from "../../Assets/Images/life-eten-oekrainers.jpg";
import ImgEtenBuren         from "../../Assets/Images/life-eten-buren.jpg";
import ImgKLM               from "../../Assets/Images/life-klm.jpg";
import ImgFeestje           from "../../Assets/Images/life-feestje.jpg";
import ImgImg1070           from "../../Assets/Images/life-img1070.jpeg";
import ImgKattensporenbeton from "../../Assets/Images/life-kattensporenbeton.jpeg";
import ImgKokenVredestein   from "../../Assets/Images/life-koken-vredestein.jpg";
import ImgMaximCarpediem    from "../../Assets/Images/life-maxim-carpediem.jpg";
import ImgMotorrijden       from "../../Assets/Images/life-motorrijden.jpg";
import ImgTanteMaximBloemen from "../../Assets/Images/life-tante-maxim-bloemen.jpg";

// Ansichtkaarten
import ImgAnsichtPension         from "../../Assets/Images/hist-ansichtkaart-pension.jpg";
import ImgAnsichtHfdstr          from "../../Assets/Images/hist-ansichtkaart-hfdstr.jpg";
import ImgAnsichtDorpsstraat     from "../../Assets/Images/hist-ansicht-dorpsstraat.jpg";
import ImgAnsichtHoofdweg        from "../../Assets/Images/hist-ansicht-hoofdweg.jpeg";
import ImgAnsichtVredesteinP     from "../../Assets/Images/hist-ansicht-vredestein-pension.jpg";
import ImgAnsichtVredesteinDrb   from "../../Assets/Images/hist-ansicht-vredestein-driebergen.jpg";

import ImgAnsichtRustoord        from "../../Assets/Images/hist-ansicht-rustoord.jpg";

// Geschiedenis, familie
import ImgFamilieRoelofsen  from "../../Assets/Images/hist-familie-roelofsen.jpg";
import ImgZustersPension    from "../../Assets/Images/hist-zusters-pension.jpg";
import ImgTuinVroeger       from "../../Assets/Images/hist-tuin-vroeger.jpg";
import ImgVerhuiskaart      from "../../Assets/Images/hist-verhuiskaart.jpg";
import ImgGekocht2020       from "../../Assets/Images/hist-gekocht-2020.jpg";
import ImgVoorkantRoelofsen from "../../Assets/Images/hist-voorkant-roelofsen.jpg";


// Geschiedenis, kadasterdocumenten
import ImgVilla1910         from "../../Assets/Images/VillaVredestein1910.jpg";
import ImgKaartBlauw1       from "../../Assets/Images/archief-kadasterkaart-blauw-1.jpg";
import ImgKaartBlauw2       from "../../Assets/Images/archief-kadasterkaart-blauw-2.jpg";
import ImgPercelen          from "../../Assets/Images/archief-kadaster-percelen.jpg";
import ImgKadasterHoofdstraat from "../../Assets/Images/archief-kadaster-hoofdstraat.jpg";
import ImgRegister1         from "../../Assets/Images/archief-register-1.jpg";
import ImgRegister2         from "../../Assets/Images/archief-register-2.jpg";
import ImgBouwreg1          from "../../Assets/Images/archief-bouwregister-1.jpg";
import ImgBouwreg2          from "../../Assets/Images/archief-bouwregister-2.jpg";

// Plattegronden
import ImgPlattBG   from "../../Assets/Images/plattegrond-begane-grond.jpg";
import ImgPlattE1   from "../../Assets/Images/plattegrond-eerste-verd.jpg";
import ImgPlattE1b  from "../../Assets/Images/plattegrond-eerste-verd-optie.jpg";
import ImgPlattE2   from "../../Assets/Images/plattegrond-tweede-verd.jpg";

// Restauratie
import ImgWijnkamer         from "../../Assets/Images/int-wijnkamer.jpg";
import ImgRestauratie       from "../../Assets/Images/VillaVredesteinRestauratie.jpg";

import ImgGlasLood2         from "../../Assets/Images/rest-glas-lood-2.jpg";
import ImgVerbouwen         from "../../Assets/Images/rest-verbouwen.jpg";
import ImgSlopen            from "../../Assets/Images/rest-slopen.jpg";
import ImgIsoleren          from "../../Assets/Images/rest-isoleren.jpg";
import ImgKachelBouw        from "../../Assets/Images/rest-kachel-bouw.jpg";
import ImgSchatvondsten     from "../../Assets/Images/rest-schatvondsten.jpg";
import ImgGietvloer         from "../../Assets/Images/rest-gietvloer.jpg";
import ImgTerrasAanleg      from "../../Assets/Images/rest-terras.jpg";
import ImgKroonluchtersVerv from "../../Assets/Images/rest-kroonluchters.jpg";

const CATEGORIEEN = ["Alles", "Samenleven", "Geschiedenis", "Ansichtkaarten", "De Verbouwing", "Plattegrond"];

const FOTOS = [
    // ── Samenleven ────────────────────────────────────────────────────────
    { src: ImgFamilieRoelofsen,  cat: "Samenleven", caption: "Familie Roelofsen",          sub: "De familie die lang de bewoners van Villa Vredestein waren",
      verhaal: "De familie Roelofsen woonde hier decennialang. Op dit portret zijn ze zo alledaags en vertrouwd, midden in een huis dat nu zo anders aanvoelt, maar toch hetzelfde is. Dit is de menselijke continuïteit van Villa Vredestein." },
    { src: ImgRommertBram,       cat: "Samenleven", caption: "Rommert & Bram",             sub: "Twee van de studenten die de bovenverdieping bewonen",
      verhaal: "Rommert en Bram zijn twee van de studenten op de bovenste verdieping. Ze hebben elk een eigen kamer, een gedeelde keuken en, belangrijker, een gedeeld gevoel van thuis. Dat is precies de bedoeling van Villa Vredestein." },
    { src: ImgPannenkoeken2025,  cat: "Samenleven", caption: "Pannenkoekenavaond 2025",    sub: "De jaarlijkse pannenkoekentraditie in Villa Vredestein",
      verhaal: "Elk jaar is er een pannenkoekenavaond. Iedereen staat mee te bakken, de keuken staat vol, en niemand telt het aantal opgestapelde pannenkoeken. Het is een van die tradities die vanzelf zijn ontstaan." },
    { src: ImgKoken,             cat: "Samenleven", caption: "Koken in Vredestein",         sub: "De open keuken als ontmoetingsplek",
      verhaal: "De open keuken is meer dan een plek om eten te bereiden, het is de plek waar de dag begint en eindigt. Iemand zet koffie, iemand anders begint over wat er is. Zo werkt het hier." },
    { src: ImgEtenBuren,         cat: "Samenleven", caption: "Eten met de buren",           sub: "De deur staat altijd open in Villa Vredestein",
      verhaal: "Bij Villa Vredestein staat de deur letterlijk open. De buren weten dat. Soms is het toeval, soms is het gepland, maar een tafel vol mensen is hier nooit een uitzondering." },
    { src: ImgEtenOekrainers,    cat: "Samenleven", caption: "Oekraïense gasten",           sub: "Gastvrij onthaal van Oekraïense bezoekers",
      verhaal: "Na het uitbreken van de oorlog in Oekraïne opende Villa Vredestein zijn deuren voor vluchtelingen. Samen eten, samen verhalen delen, taal was soms een barrière, maar gastvrijheid niet." },
    { src: ImgKLM,               cat: "Samenleven", caption: "KLM fotoshoot",               sub: "Villa Vredestein als decor voor een KLM-fotoshoot",
      verhaal: "KLM koos Villa Vredestein als decor voor een interne fotoshoot. De hoge plafonds, de kroonluchters, de sfeer, het paste precies bij wat ze zochten. Een bijzondere dag in de lange geschiedenis van dit pand." },
    { src: ImgFeestje,           cat: "Samenleven", caption: "Feestje Vredestein",           sub: "Samen vieren in Villa Vredestein",
      verhaal: "Een avond die vanzelf uitliep op een feestje. Dat is Villa Vredestein op zijn best: mensen die samenkomen, de grote eettafel vol, en buiten de tijd even stilstaat." },
    { src: ImgImg1070,           cat: "Samenleven", caption: "Moment in de villa",            sub: "Een alledaags moment in een bijzonder huis",
      verhaal: "Niet elk moment hoeft groots te zijn. Juist die gewone momenten, de ochtendkoffie, het gesprek aan tafel, de stilte in de gang, maken dit huis echt." },
    { src: ImgKattensporenbeton, cat: "Samenleven", caption: "Kattensporenbeton",             sub: "Sporen van een kat in het verse beton",
      verhaal: "Tijdens het storten van het beton had niet iedereen rekening gehouden met de kat. Die liep er gewoon overheen. De afdrukken zitten er nu voor altijd in. Een onbedoelde handtekening van het leven in Villa Vredestein." },
    { src: ImgKokenVredestein,   cat: "Samenleven", caption: "Koken in Vredestein",           sub: "Samen koken in de grote keuken",
      verhaal: "De keuken is de kern van het huis. Wie kookt, trekt mensen aan. Dat werkt hier altijd." },
    { src: ImgMaximCarpediem,    cat: "Samenleven", caption: "Maxim & Carpe Diem",            sub: "Maxim aan het werk aan het Carpe Diem project",
      verhaal: "Maxim in zijn element. Handen vuil, hoofd helder, bezig met iets wat pas klaar is als het klaar is. Carpe Diem is geen spreuk meer, het is een manier van werken." },
    { src: ImgMotorrijden,       cat: "Samenleven", caption: "Motorrijden",                   sub: "Maxim op de motor",
      verhaal: "Vrijheid op twee wielen. De cafe racer die Maxim zelf heeft opgebouwd rijdt nu echt. Hier neemt hij hem mee naar buiten." },
    { src: ImgTanteMaximBloemen, cat: "Samenleven", caption: "Tante Maxim & bloemen",         sub: "Bloemen van de markt, gezelligheid in de keuken",
      verhaal: "Bloemen op tafel, tante op bezoek. De gewoonste dingen kunnen hier thuiskomen en dat is precies waarom het hier fijn is." },

    // ── Ansichtkaarten ────────────────────────────────────────────────────
    { src: ImgAnsichtPension,      cat: "Ansichtkaarten", caption: "Pension Villa Vredestein",            sub: "Het pension zoals het begin 1900 werd geadverteerd",
      verhaal: "Een ansichtkaart uit het begin van de twintigste eeuw, waarop Vredestein als pension werd aangeprezen. 'Rustig gelegen, christelijk pension', dat was de boodschap. Toeristen kwamen van ver voor de lucht van de Heuvelrug." },
    { src: ImgAnsichtHfdstr,       cat: "Ansichtkaarten", caption: "Ansichtkaart Hoofdstraat",            sub: "Historische ansichtkaart van de Hoofdstraat in Driebergen",
      verhaal: "De Hoofdstraat van Driebergen zoals hij er rond 1910 uitzag. Minder auto's, meer rust. Villa Vredestein staat rechts in beeld, herkenbaar aan het karakteristieke dak en de erker." },
    { src: ImgAnsichtDorpsstraat,  cat: "Ansichtkaarten", caption: "Driebergen Dorpstraat",              sub: "De Dorpsstraat van Driebergen, begin twintigste eeuw",
      verhaal: "De Dorpsstraat van Driebergen rond 1910. Een man met zijn fiets, rails in het midden van de weg, hoge villa's aan weerszijden. De rust en deftigheid van Driebergen ademen uit elk detail van deze kaart." },
    { src: ImgAnsichtHoofdweg,     cat: "Ansichtkaarten", caption: "Driebergen Hoofdweg",                sub: "Vroeg twintigste-eeuwse ansichtkaart van de Hoofdweg",
      verhaal: "De Driebergse Hoofdweg in sepia, vermoedelijk rond 1905–1915. De tramrails zijn nog aanwezig, de bebouwing herkenbaar. Links in beeld het begin van het perceel van Villa Vredestein." },
    { src: ImgAnsichtVredesteinP,  cat: "Ansichtkaarten", caption: "Pension Villa \"Vredestein\"",        sub: "Portretansichtkaart van het pension aan de Hoofdstraat",
      verhaal: "Een verticale ansichtkaart met voluit de tekst 'Pension Villa Vredestein, Driebergen'. De villa in zijn beste kleren, vol klimop, elegant en uitnodigend. Zo presenteerde het pension zich aan de buitenwereld." },
    { src: ImgAnsichtVredesteinDrb, cat: "Ansichtkaarten", caption: "Vredestein, Driebergen",           sub: "Vroege ansichtkaart van de villa zelf",
      verhaal: "Een vroege ansichtkaart met het opschrift 'Vredestein, Driebergen'. De villa staat er nog kaler bij dan nu, de beplanting had nog jaren te groeien. Maar de contouren zijn onmiskenbaar hetzelfde als vandaag." },

    { src: ImgAnsichtRustoord,     cat: "Ansichtkaarten", caption: "Dorpstraat met Rustoord Vredestein", sub: "Het pand aangeduid als rustoord aan de Dorpstraat",
      verhaal: "Opschrift: 'Driebergen, Dorpstraat met Rustoord Vredestein'. Het pand werd door de jaren heen ook als rustoord aangeduid, een rustpunt langs de Heuvelrug. Een herinnering aan de vele gedaanten die dit huis in een eeuw heeft aangenomen." },

    // ── Geschiedenis ──────────────────────────────────────────────────────
    { src: ImgVilla1910,         cat: "Geschiedenis", caption: "Vredestein circa 1910",           sub: "Historische foto van de villa kort na de bouw in 1906",
      verhaal: "Een van de vroegste bekende foto's van de villa, gemaakt enkele jaren na de bouw in 1906. De gevel is bijna identiek aan hoe hij er nu uitziet, het pand heeft zijn karakter door de eeuwen bewaard." },
    { src: ImgVoorkantRoelofsen, cat: "Geschiedenis", caption: "Villa in het tijdperk Roelofsen", sub: "De voorkant van de villa zoals de familie Roelofsen hem kende",
      verhaal: "Zo zag de voorkant er uit in de jaren dat de familie Roelofsen hier woonde. De tuin is kaler, de gevel kleiner op de foto, maar de structuur is onmiskenbaar dezelfde als vandaag." },
    { src: ImgZustersPension,    cat: "Geschiedenis", caption: "Zusters van het pension",        sub: "Het personeel van het christelijk pension Vredestein",
      verhaal: "De vrouwen die het christelijk pension Vredestein draaiende hielden. Ze staan hier zo vertrouwelijk, alsof ze zo weer naar binnen gaan om thee te zetten voor de gasten." },
    { src: ImgTuinVroeger,       cat: "Geschiedenis", caption: "De tuin vroeger",                sub: "De achtertuin zoals die er uitzag in het tijdperk Roelofsen",
      verhaal: "De achtertuin in de tijd van het pension. Geen moestuin, maar een nette siertuin die paste bij een respectabel logeeradres. Nu is het een wilder, levendiger plek geworden." },
    { src: ImgGekocht2020,       cat: "Geschiedenis", caption: "Gekocht in 2020",               sub: "Het moment dat Manon & Maxim de sleutels in ontvangst nemen",
      verhaal: "17 december 2020. Manon & Maxim ontvangen de sleutels van Hoofdstraat 147. Achter hen een leeg, enigszins verwaarloosd pand. Voor hen: jaren werk en een droom die ze niet van plan waren los te laten." },
    { src: ImgVerhuiskaart,      cat: "Geschiedenis", caption: "De verhuiskaart",               sub: "De officiële aankondiging van het nieuwe hoofdstuk van Vredestein",
      verhaal: "De officiële aankondiging van het nieuwe hoofdstuk. Een verhuiskaart in de traditie van vroeger, met adres, datum en de belofte van een open deur. Die belofte is nagekomen." },
    { src: ImgKaartBlauw1,       cat: "Geschiedenis", caption: "Kadasterkaart Driebergen (I)",  sub: "Historische blauwdruk-kadasterkaart van Driebergen-Rijsenburg",
      verhaal: "In het Nationaal Archief liggen de blauwdrukkaarten van Driebergen uit het begin van de twintigste eeuw. Elk perceel netjes ingetekend, inclusief Hoofdstraat 147, toen al een opvallend groot kavel." },
    { src: ImgKaartBlauw2,       cat: "Geschiedenis", caption: "Kadasterkaart Driebergen (II)", sub: "Tweede blauwdrukkaart van het gebied rond Driebergen-Rijsenburg",
      verhaal: "Een tweede blauwdrukkaart van hetzelfde gebied. Samen geven ze een volledig beeld van hoe Driebergen er een eeuw geleden uitzag, straat voor straat, perceel voor perceel." },
    { src: ImgPercelen,          cat: "Geschiedenis", caption: "Kadastrale perceelkaart",       sub: "Perceelkaart met bouwnummers 2253-2256, Hoofdstraat 147",
      verhaal: "Bouwnummers 2253 tot 2256. Op dit stuk papier staat de juridische identiteit van de villa, meters, grenzen, eigendom. Droog op het oog, maar achter elk getal zit een verhaal." },
    { src: ImgKadasterHoofdstraat, cat: "Geschiedenis", caption: "Situatiekaart Hoofdstraat",   sub: "Historische bebouwingskaart langs de Hoofdstraat",
      verhaal: "De Hoofdstraat in kaart gebracht. Je ziet hoe dicht de bebouwing al was, hoe smal de percelen, hoe weinig er in honderd jaar is veranderd aan de plattegrond van dit deel van Driebergen." },
    { src: ImgRegister1,         cat: "Geschiedenis", caption: "Kamerafmetingen register",      sub: "Handgeschreven archiefregister met ruimtematen van Hfdstr. 147",
      verhaal: "Handgeschreven in het kadasterarchief: de afmetingen van elke kamer van Hoofdstraat 147, ooit opgemeten door een ambtenaar met een liniaal en inkt. De villa is nu precies zo groot als hier staat." },
    { src: ImgRegister2,         cat: "Geschiedenis", caption: "Historisch register II",        sub: "Tweede pagina, historische maatvoering van het pand",
      verhaal: "De tweede pagina van datzelfde register. Samen vormen ze een nauwkeurig beeld van de indeling van de villa, vastgelegd op papier, meer dan een eeuw geleden." },
    { src: ImgBouwreg1,          cat: "Geschiedenis", caption: "Bouwregister Hfdstr. 147 (I)",  sub: "Officieel bouwregister met aantekeningen en bouwdata",
      verhaal: "Het officiële bouwregister uit de archieven. Hier staat wanneer de villa is gebouwd, wie de eigenaar was en wat de bouwdata zijn. Het begin van het verhaal in drie regels zwarte inkt." },
    { src: ImgBouwreg2,          cat: "Geschiedenis", caption: "Bouwregister Hfdstr. 147 (II)", sub: "Vervolg van het bouwregister, historische indeling",
      verhaal: "Het vervolg van het bouwregister, aanvullingen, correcties, aantekeningen. Dit soort documenten zijn de ruggengraat van de geschiedenis van Villa Vredestein." },
    // ── Plattegrond ────────────────────────────────────────────────────────
    { src: ImgPlattBG,  cat: "Plattegrond", caption: "Begane grond",              sub: "Hoofdstraat 147, Driebergen",
      verhaal: "De begane grond van Villa Vredestein: woonkamer, keuken, hal en twee slaapkamers. De grote woonkamer met hoge plafonds vormt het hart van de villa." },
    { src: ImgPlattE1,  cat: "Plattegrond", caption: "Eerste verdieping",         sub: "Middenverdieping met vier zit-slaapkamers",
      verhaal: "De eerste verdieping telt vier zit-slaapkamers, een eetkamer, een gang en balkon aan de voorkant. Dit is de middenverdieping voor langere verhuur." },
    { src: ImgPlattE1b, cat: "Plattegrond", caption: "Eerste verdieping, optie B", sub: "Alternatieve indeling met extra badkamer",
      verhaal: "Een alternatieve indeling van de eerste verdieping waarbij een extra badkamer is ingepast. Toont de flexibiliteit van de ruimte voor toekomstige verbouwingsfases." },
    { src: ImgPlattE2,  cat: "Plattegrond", caption: "Tweede verdieping",          sub: "Bovenste verdieping met vier studentenkamers",
      verhaal: "De bovenste verdieping: vier zit-slaapkamers, een gang, badkamer en berging. Dit is de verdieping waar de studenten wonen, elk met een eigen kamer." },

    // ── Restauratie ────────────────────────────────────────────────────────
    { src: ImgWijnkamer,         cat: "De Verbouwing", caption: "Vóór de restauratie",         sub: "De woonkamer zoals die er uitzag vóór de werkzaamheden",
      verhaal: "Zo zag de woonkamer eruit voordat Manon & Maxim de handen uit de mouwen staken. Verouderde afwerking, gedateerde kleuren, maar onder dat alles: dezelfde ruimte, dezelfde proporties, dezelfde magie." },
    { src: ImgSlopen,            cat: "De Verbouwing", caption: "Slopen",                      sub: "Het begin van de grote transformatie in 2020",
      verhaal: "Het begin was radicaal: alles eruit wat niet kon blijven. Slopen is een daad van vertrouwen, je vernietigt iets in de hoop dat wat eronder zit beter is. Dat bleek inderdaad zo te zijn." },
    { src: ImgIsoleren,          cat: "De Verbouwing", caption: "Isoleren",                    sub: "Maanden isolatiewerk voor een energiezuinig pand",
      verhaal: "Maanden van isolatiewerk. Muren, vloeren, daken, alles werd gelaagd en gedicht. Het is het onzichtbare werk dat je later nooit ziet, maar altijd voelt op een koude winteravond." },
    { src: ImgRestauratie,       cat: "De Verbouwing", caption: "Glas-in-lood",                sub: "Het originele glas-in-loodraam tijdens de restauratie",
      verhaal: "De glas-in-loodramen zijn origineel en werden met de grootst mogelijke zorg behandeld. Elk paneel werd geïnspecteerd, gerepareerd en teruggeplaatst. Ze geven de villa zijn onmiskenbare karakter." },
    { src: ImgGlasLood2,         cat: "De Verbouwing", caption: "Glas-in-lood werkzaamheden",  sub: "Het herstelwerk aan de historische ramen",
      verhaal: "Het herstelwerk aan de ramen was precisiewerk. Glazenmakers werkten dagenlang aan elk raam, kleur voor kleur, lood voor lood. Het resultaat is te zien in het licht dat nu door de hal valt." },
    { src: ImgKachelBouw,        cat: "De Verbouwing", caption: "De kachel bouwen",            sub: "De houtkachel werd vakkundig geplaatst en ingemetseld",
      verhaal: "Maxim heeft de houtkachel met eigen handen geplaatst en ingemetseld. 'Carpe Diem' heet hij, en dat gevoel gaf hij de woonkamer meteen mee. Nu is de kachel het eerste wat mensen opvalt als ze binnenkomen." },
    { src: ImgKroonluchtersVerv, cat: "De Verbouwing", caption: "Kroonluchters vervoeren",     sub: "De originele kristallen kroonluchters werden met zorg verplaatst",
      verhaal: "De originele kristallen kroonluchters konden niet blijven hangen tijdens de werkzaamheden. Ze werden voorzichtig gedemonteerd, ingepakt en opgeslagen, en na de restauratie weer opgehangen op precies dezelfde plek." },
    { src: ImgSchatvondsten,     cat: "De Verbouwing", caption: "Schatvondsten",               sub: "Bijzondere vondsten tijdens de verbouwingswerkzaamheden",
      verhaal: "Tijdens het slopen kwamen er bijzondere vondsten tevoorschijn: oude munten, een brief, verborgen decoratieve elementen. Elke verbouwing in een oud pand is een beetje archeologie." },
    { src: ImgGietvloer,         cat: "De Verbouwing", caption: "Gietvloer, gevierd!",        sub: "De legdag van de gietvloer werd feestelijk gevierd",
      verhaal: "De dag dat de gietvloer werd gelegd, werd gevierd. Dat klinkt overdreven, maar wie wekenlang op zand heeft gelopen, begrijpt het. Het was een mijlpaal in de restauratie van de begane grond." },
    { src: ImgTerrasAanleg,      cat: "De Verbouwing", caption: "Terras aanleggen",            sub: "Het terras werd aangelegd en het perceel ingericht",
      verhaal: "Het terras en de tuin werden als laatste aangepakt. Tegels leggen, beplanting aanbrengen, de moestuin indelen. Na de binnenkant eindelijk ook de buitenkant, het geheel werd compleet." },
    { src: ImgVerbouwen,         cat: "De Verbouwing", caption: "Verbouwen met Manon & Maxim", sub: "Samen aan de slag in het historische pand",
      verhaal: "Niet alles is uitbesteed. Manon & Maxim hebben zelf meegebouwd, geschilderd, geschroefd, gesleept. Het is hun pand in de letterlijkste zin van het woord, en dat is aan elke kamer te zien." },
];

const GalerijVilla = () => {
    const location = useLocation();
    const initCat = CATEGORIEEN.includes(location.state?.cat) ? location.state.cat : "Alles";
    const [actieveCat, setActieveCat] = useState(initCat);
    const [lightbox, setLightbox] = useState<number | null>(null);
    const lightboxRef = useRef<HTMLDivElement>(null);
    const prevFocusRef = useRef<HTMLElement | null>(null);

    const gefilterd = actieveCat === "Alles" ? FOTOS : FOTOS.filter((f) => f.cat === actieveCat);

    const open = useCallback((i: number) => {
        prevFocusRef.current = document.activeElement as HTMLElement;
        setLightbox(i);
        document.body.style.overflow = "hidden";
    }, []);

    const close = useCallback(() => {
        setLightbox(null);
        document.body.style.overflow = "";
        prevFocusRef.current?.focus();
    }, []);

    const prev = useCallback(() => setLightbox((i) => ((i ?? 0) - 1 + gefilterd.length) % gefilterd.length), [gefilterd.length]);
    const next = useCallback(() => setLightbox((i) => ((i ?? 0) + 1) % gefilterd.length), [gefilterd.length]);

    useEffect(() => {
        if (lightbox === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next();
            else if (e.key === "ArrowLeft") prev();
            else if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightbox, next, prev, close]);

    useEffect(() => { if (lightbox !== null) lightboxRef.current?.focus(); }, [lightbox]);

    const foto = lightbox !== null ? gefilterd[lightbox] : null;

    return (
        <main className="galerij-villa-page">
            <Helmet>
                <title>Galerij & Historisch Archief, Villa Vredestein</title>
                <meta
                    name="description"
                    content="Fotogalerij en historisch archief van Villa Vredestein: interieur, exterieur, tuin, kadasterkaarten en krantenartikelen van 1906 tot nu."
                />
                <link rel="canonical" href="https://villavredestein.nl/galerij" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl/galerij" />
                <meta property="og:title" content="Galerij & Historisch Archief, Villa Vredestein" />
                <meta property="og:description" content="Fotogalerij en historisch archief van Villa Vredestein. Ansichtkaarten, plattegronden, de verbouwing en een eeuw geschiedenis." />
                <meta property="og:image" content="https://villavredestein.nl/og-image.jpg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Galerij & Historisch Archief, Villa Vredestein" />
                <meta name="twitter:description" content="Fotogalerij en historisch archief van Villa Vredestein. Ansichtkaarten, plattegronden, de verbouwing en een eeuw geschiedenis." />
                <meta name="twitter:image" content="https://villavredestein.nl/og-image.jpg" />
            </Helmet>

            <header className="gv-header">
                <h1>De villa in beeld</h1>
                <p>Van kroonluchter tot krantenartikel. Klik op een foto om te vergroten.</p>
            </header>

            <div className="gv-filter" role="group" aria-label="Filtercategorieën">
                {CATEGORIEEN.map((cat) => (
                    <button
                        key={cat}
                        className={`gv-filter-btn ${actieveCat === cat ? "active" : ""}`}
                        onClick={() => setActieveCat(cat)}
                        aria-pressed={actieveCat === cat}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="gv-grid" role="list">
                {gefilterd.map((foto, i) => (
                    <article
                        key={`${foto.src}-${i}`}
                        className="gv-item"
                        role="listitem"
                        onClick={() => open(i)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open(i)}
                        tabIndex={0}
                        aria-label={`${foto.caption}, klik om te vergroten`}
                    >
                        <div className="gv-img-wrap">
                            <img src={foto.src} alt={foto.caption} loading="lazy" decoding="async" />
                            <div className="gv-overlay" aria-hidden="true">
                                <span className="gv-cat">{foto.cat}</span>
                                <p className="gv-caption">{foto.caption}</p>
                                <span className="gv-zoom">⊕</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {foto && (
                <div
                    className="gvlb-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Foto: ${foto.caption}`}
                    onClick={(e) => e.target === e.currentTarget && close()}
                >
                    <div className="gvlb-box" ref={lightboxRef} tabIndex={-1}>
                        <button className="gvlb-close" onClick={close} aria-label="Sluiten">✕</button>
                        <div className="gvlb-img-wrap">
                            <img src={foto.src} alt={foto.caption} className="gvlb-img" />
                        </div>
                        <div className="gvlb-info">
                            <span className="gvlb-cat">{foto.cat}</span>
                            <h2 className="gvlb-caption">{foto.caption}</h2>
                            <p className="gvlb-sub">{foto.sub}</p>
                            {foto.verhaal && <p className="gvlb-verhaal">{foto.verhaal}</p>}
                        </div>
                        <button className="gvlb-nav gvlb-prev" onClick={prev} aria-label="Vorige">‹</button>
                        <button className="gvlb-nav gvlb-next" onClick={next} aria-label="Volgende">›</button>
                        <div className="gvlb-counter" aria-live="polite">
                            {(lightbox ?? 0) + 1} / {gefilterd.length}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default GalerijVilla;
