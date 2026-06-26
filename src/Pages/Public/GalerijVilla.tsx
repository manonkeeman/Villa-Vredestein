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
    { src: ImgFamilieRoelofsen,  cat: "Samenleven", caption: "Familie Roelofsen",          sub: "De familie die opgroeide in Vredestein, jaren zestig en zeventig",
      verhaal: "De familie Roelofsen groeide op in Vredestein, in de jaren zestig en zeventig. Op dit portret zijn ze gewoon en vertrouwd, midden in een huis dat nu zo anders aanvoelt en toch hetzelfde is.\n\nWe kwamen in contact toen ik op zoek was naar informatie van vroeger. Wat volgde was een familiereünie, bij ons in Vredestein. Ik maakte appeltaart en zij deelden hun verhalen en jeugdfoto's. We hebben nog steeds contact en ze volgen de verbouwing op de voet.\n\nZo blijft Villa Vredestein leven, door de mensen die er ooit thuis waren." },
    { src: ImgRommertBram,       cat: "Samenleven", caption: "Rommert & Bram",             sub: "Onze allereerste studenten van de IVA",
      verhaal: "Rommert en Bram waren onze allereerste studenten van de IVA, boven op de bovenste verdieping. Ze woonden middenin de verbouwing en hadden er lol in. Wij ook, met hen. Toen ze al lang en breed een mooie baan hadden, nodigden we ze nog eens uit. Rommert is trouwens de neef van Maxim." },
    { src: ImgPannenkoeken2025,  cat: "Samenleven", caption: "Pannenkoekenavaond",         sub: "Een traditie die vanzelf is ontstaan",
      verhaal: "Eens in de zoveel tijd organiseren we een pannenkoekenavaond. Iedereen mag een introducé meenemen. Hier staan IVA-studenten Simon en Lucas, en Manon en Maxim met dochter Arwen. Niemand telt hoeveel pannenkoeken er opgestapeld worden. Het is een van die tradities die vanzelf zijn ontstaan." },
    { src: ImgKoken,             cat: "Samenleven", caption: "Koken in Vredestein",         sub: "De Bruynzeel-keuken die binnenkort verdwijnt",
      verhaal: "Onze oude Bruynzeel-keuken bewijst zich op de drukke dagen, wanneer iedereen hard aan het werk is en Manon voor veel monden tegelijk kookt. Sinds 1906 is dit altijd de keuken geweest, ooit nog op kolen. Binnenkort verandert die geschiedenis: deze ruimte wordt een slaapkamer.\n\nVoor nu kun je nog gewoon aanschuiven voor een lekkere maaltijd." },
    { src: ImgEtenBuren,         cat: "Samenleven", caption: "Eten met de buren",           sub: "De deur staat altijd open in Villa Vredestein",
      verhaal: "Bij Villa Vredestein staat de deur letterlijk open. De buren weten dat. Soms is het toeval, soms is het gepland, maar een tafel vol mensen is hier nooit een uitzondering." },
    { src: ImgEtenOekrainers,    cat: "Samenleven", caption: "Oekraïense gasten",           sub: "Gastvrij onthaal van Oekraïense vluchtelingen",
      verhaal: "Na het uitbreken van de oorlog in Oekraïne opende Villa Vredestein zijn deuren voor vluchtelingen. Samen eten, samen verhalen delen. De taal was soms een barrière, gastvrijheid nooit." },
    { src: ImgKLM,               cat: "Samenleven", caption: "Fotoshoot in Vredestein",     sub: "Villa Vredestein als decor voor een fotoshoot",
      verhaal: "De fotograaf koos Villa Vredestein als decor voor een fotoshoot. De hoge plafonds, de kroonluchters, de sfeer: het paste precies bij wat ze zochten. Een bijzondere dag in de lange geschiedenis van dit pand." },
    { src: ImgFeestje,           cat: "Samenleven", caption: "Feestje Vredestein",           sub: "Maxims verjaardag in een huis dat tegen een stootje kan",
      verhaal: "Dit was nog voor het feest. Maxims verjaardag, in een huis dat tegen een stootje kan. Een avond die vanzelf uitliep op een feest. Zo is Villa Vredestein op zijn best: mensen die samenkomen, de woonkamer zo leeg als een grote danszaal, en buiten staat de tijd even stil." },
    { src: ImgImg1070,           cat: "Samenleven", caption: "BBQ Party",                   sub: "Afsluiting van het IVA-schooljaar",
      verhaal: "Het schooljaar zit erop, en dat vieren we zoals het hoort: met de grill aan, ijskoude drankjes en iedereen samen op het terrein. Vega of glutenvrij, onze BBQ-master draait er zijn hand niet voor om. Een avond die altijd langer duurt dan gepland." },
    { src: ImgKattensporenbeton, cat: "Samenleven", caption: "Kattensporenbeton",           sub: "Er woont ook nog een kat bij ons",
      verhaal: "Er woont ook nog een kat bij ons. Na het storten van het beton bleek hij ook even gekeken te hebben wat we aan het doen waren. En zo liet ook hij zijn sporen na in Villa Vredestein." },
    { src: ImgMaximCarpediem,    cat: "Samenleven", caption: "Maxim & Carpe Diem",          sub: "Pannenkoeken bakken als Carpe Diem",
      verhaal: "Maxim in zijn element. Handen vuil, hoofd helder, bezig met iets wat pas klaar is als het klaar is. Al was het deze keer gewoon pannenkoeken bakken. Carpe Diem is geen spreuk meer, het is een manier van werken." },
    { src: ImgMotorrijden,       cat: "Samenleven", caption: "Samen motorrijden",            sub: "Maxim & Manon delen een passie voor twee wielen",
      verhaal: "Naast het verbouwen houden we van die andere vrijheid: de weg open, de motor onder ons. Want het leven is er niet alleen om aan te werken, maar ook om van te genieten." },
    { src: ImgTanteMaximBloemen, cat: "Samenleven", caption: "Maxims tante & bloemen",      sub: "Altijd fijn als zij langskomt",
      verhaal: "Bloemen op tafel, tante op bezoek. Altijd fijn als zij langskomt, en altijd laat ze haar bloemensporen achter." },

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
    { src: ImgVilla1910,         cat: "Geschiedenis", caption: "Vredestein circa 1910",           sub: "Een van de vroegste bekende foto's van de villa",
      verhaal: "Een van de vroegste bekende foto's van de villa, gemaakt rond 1910. De gevel is helaas niet meer identiek aan hoe hij er nu uitziet. Het boegwerk willen we graag weer in oude glorie herstellen. De veranda aan de voorkant is er niet meer, de glas-in-loodramen en de openslaande ramen ook niet. We zijn erg blij met foto's als deze om te zien hoe het was, en om te weten waar we naartoe werken." },
    { src: ImgVoorkantRoelofsen, cat: "Geschiedenis", caption: "Villa in het tijdperk Roelofsen", sub: "De voorkant in de jaren '60-'70, voor de fatale verbouwing",
      verhaal: "Zo zag de voorkant eruit in de jaren dat de familie Roelofsen hier woonde, jaren zestig of zeventig. Dit is nog voor de fatale verbouwing waarbij al het glas en lood vervangen werd. De veranda met openslaande deuren is hier nog aanwezig, net als de openslaande ramen. Ook de brandtrap aan de zijkant is er nog niet. De boeg van de gevel was toen al verwijderd." },
    { src: ImgZustersPension,    cat: "Geschiedenis", caption: "Zusters van het pension",        sub: "Het personeel van het christelijk pension Vredestein",
      verhaal: "Het personeel van het christelijk pension Vredestein, ten tijde van de familie Roelofsen. Deze foto kregen we van hen.\n\nZe staan hier zo vertrouwelijk, alsof ze zo weer naar binnen gaan om thee te zetten voor de gasten." },
    { src: ImgTuinVroeger,       cat: "Geschiedenis", caption: "De tuin vroeger",                sub: "De achtertuin zoals die er uitzag in het tijdperk Roelofsen",
      verhaal: "De achtertuin in de tijd van het pension. Geen moestuin, maar een nette siertuin die paste bij een respectabel logeeradres. Nu is het een wilder, levendiger plek geworden." },
    { src: ImgGekocht2020,       cat: "Geschiedenis", caption: "Oktober 2020",                   sub: "Maxim ontvangt de sleutels van Hoofdstraat 147",
      verhaal: "Oktober 2020. Maxim ontvangt de sleutels van Hoofdstraat 147. Achter hem een weg van zoeken en loslaten. Voor hem: jaren werk, en een plek die hij dit keer vasthoudt." },
    { src: ImgVerhuiskaart,      cat: "Geschiedenis", caption: "De verhuiskaart",                sub: "De aankondiging van het nieuwe hoofdstuk, oktober 2020",
      verhaal: "De aankondiging van het nieuwe hoofdstuk, in oktober 2020. Een verhuiskaart met adres, datum en de belofte van een open deur. Die belofte komen we nog steeds na." },
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
    { src: ImgPlattBG,  cat: "Plattegrond", caption: "Begane grond",               sub: "Zo zag het eruitzag toen we kochten, 2020",
      verhaal: "De begane grond van Villa Vredestein in 2020: woonkamer, keuken, hal en twee slaapkamers. Inmiddels is er flink geschoven. De openslaande deuren aan de achterkant zijn weer in ere hersteld. De keuken wordt onze slaapkamer, de slaapkamer een badkamer, de badkamer een technische ruimte voor waterpomp en cv. De twee slaapkamers zijn bij de woonkamer getrokken, die nu L-vormig is, en het achterste gedeelte is een open keuken met een eiland geworden." },
    { src: ImgPlattE1,  cat: "Plattegrond", caption: "Eerste verdieping",          sub: "De middenverdieping, anno 2020",
      verhaal: "Zo zag de plattegrond eruit in 2020. De eerste verdieping telt vier zit-slaapkamers, een eetkamer, een gang en balkon aan de voorkant. Dit is de middenverdieping waar nu onze kinderen verblijven. De berging en eetkamer zijn de laatste plekken van Vredestein die nog geïsoleerd moeten worden. De berging wordt een sportkamer met een kitchenette, en de eetkamer een luxe badkamer met bad." },
    { src: ImgPlattE1b, cat: "Plattegrond", caption: "Eerste verdieping — optie B", sub: "Zo kochten we het huis, met extra badkamer",
      verhaal: "Zo kochten we het huis in 2020, met een extra badkamer. Die studentenbadkamer bevatte 3.000 kg aan gewapend beton en was volledig beschimmeld. We hebben hem er als eerste uitgesloopt." },
    { src: ImgPlattE2,  cat: "Plattegrond", caption: "Tweede verdieping",           sub: "De bovenste verdieping, anno 2020",
      verhaal: "De bovenste verdieping anno 2020: vier zit-slaapkamers, een gang, badkamer en berging. Dit is de verdieping waar de studenten wonen, elk met een eigen kamer. Van de zit-slaapkamer-hal hebben wij een gedeelde keuken en woonkamer gemaakt. De wc en berging zijn een gedeelde badkamer met toilet geworden. Op termijn willen we graag een eigen opgang naar deze verdieping creëren. Het balkon wordt nu gebruikt als nooduitgang." },

    // ── Restauratie ────────────────────────────────────────────────────────
    { src: ImgWijnkamer,         cat: "De Verbouwing", caption: "Vóór de restauratie",         sub: "De woonkamer zoals die er uitzag vóór de werkzaamheden",
      verhaal: "Zo zag de woonkamer eruit voordat Manon & Maxim de handen uit de mouwen staken. Verouderde afwerking, gedateerde kleuren, maar onder dat alles: dezelfde ruimte, dezelfde proporties, dezelfde magie." },
    { src: ImgSlopen,            cat: "De Verbouwing", caption: "Slopen",                      sub: "Het begin van de grote transformatie in 2020",
      verhaal: "Het begin was radicaal: alles eruit wat niet kon blijven. Slopen is een daad van vertrouwen, je vernietigt iets in de hoop dat wat eronder zit beter is. Dat bleek inderdaad zo te zijn." },
    { src: ImgIsoleren,          cat: "De Verbouwing", caption: "Isoleren",                    sub: "Maanden isolatiewerk voor een energiezuinig pand",
      verhaal: "Maanden van isolatiewerk. Muren, vloeren, daken, alles werd gelaagd en gedicht. Het is het onzichtbare werk dat je later nooit ziet, maar altijd voelt op een koude winteravond." },
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
