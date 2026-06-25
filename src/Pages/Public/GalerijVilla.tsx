import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import "./GalerijVilla.css";

// Interieur
import ImgWoonkamer         from "../../Assets/Images/int-woonkamer.jpg";
import ImgKroonluchter      from "../../Assets/Images/int-kroonluchter.jpg";
import ImgKroonluchterBloemen from "../../Assets/Images/int-kroonluchter-bloemen.jpg";
import ImgKachel            from "../../Assets/Images/int-kachel.jpg";
import ImgMiddenverdieping  from "../../Assets/Images/int-middenverdieping.jpg";

// Exterieur
import ImgVillaFront        from "../../Assets/Images/ext-villa-voorkant.jpg";
import ImgVredesteinBord    from "../../Assets/Images/ext-vredestein-bord.jpg";

import ImgNight             from "../../Assets/Images/VredesteineByNight.jpg";
import ImgVillaNight2       from "../../Assets/Images/ext-villa-night-2.jpg";
import ImgBallon            from "../../Assets/Images/ext-ballon.png";
import ImgBloeiVoorkant     from "../../Assets/Images/ext-villa-bloei.jpg";
import ImgHoogte            from "../../Assets/Images/ext-hoogte.jpg";
import ImgGevel             from "../../Assets/Images/ext-gevel.jpg";

// Tuin
import ImgTuinFeest         from "../../Assets/Images/ext-tuinfeest.jpg";
import ImgMoestuinBloei     from "../../Assets/Images/tuin-moestuin-bloei.jpg";
import ImgGroente           from "../../Assets/Images/tuin-groente.jpg";
import ImgKlaproos          from "../../Assets/Images/tuin-klaproos.jpg";

// Leven
import ImgMoestuin          from "../../Assets/Images/life-moestuin.jpg";
import ImgRommertBram       from "../../Assets/Images/life-rommert-bram.jpg";
import ImgPannenkoeken2025  from "../../Assets/Images/life-pannenkoeken-2025.jpg";
import ImgKoken             from "../../Assets/Images/life-koken.jpg";
import ImgEtenOekrainers    from "../../Assets/Images/life-eten-oekrainers.jpg";
import ImgEtenBuren         from "../../Assets/Images/life-eten-buren.jpg";
import ImgKLM               from "../../Assets/Images/life-klm.jpg";

// Geschiedenis — ansichtkaarten & familie
import ImgAnsichtPension    from "../../Assets/Images/hist-ansichtkaart-pension.jpg";
import ImgAnsichtHfdstr     from "../../Assets/Images/hist-ansichtkaart-hfdstr.jpg";
import ImgFamilieRoelofsen  from "../../Assets/Images/hist-familie-roelofsen.jpg";
import ImgZustersPension    from "../../Assets/Images/hist-zusters-pension.jpg";
import ImgTuinVroeger       from "../../Assets/Images/hist-tuin-vroeger.jpg";
import ImgVerhuiskaart      from "../../Assets/Images/hist-verhuiskaart.jpg";
import ImgGekocht2020       from "../../Assets/Images/hist-gekocht-2020.jpg";
import ImgVoorkantRoelofsen from "../../Assets/Images/hist-voorkant-roelofsen.jpg";
import ImgKrantReclame      from "../../Assets/Images/hist-krant-reclame.jpg";

// Geschiedenis — kadasterdocumenten
import ImgVilla1910         from "../../Assets/Images/VillaVredestein1910.jpg";
import ImgKaartBlauw1       from "../../Assets/Images/archief-kadasterkaart-blauw-1.jpg";
import ImgKaartBlauw2       from "../../Assets/Images/archief-kadasterkaart-blauw-2.jpg";
import ImgPercelen          from "../../Assets/Images/archief-kadaster-percelen.jpg";
import ImgKadasterHoofdstraat from "../../Assets/Images/archief-kadaster-hoofdstraat.jpg";
import ImgRegister1         from "../../Assets/Images/archief-register-1.jpg";
import ImgRegister2         from "../../Assets/Images/archief-register-2.jpg";
import ImgBouwreg1          from "../../Assets/Images/archief-bouwregister-1.jpg";
import ImgBouwreg2          from "../../Assets/Images/archief-bouwregister-2.jpg";

// Geschiedenis — krantenartikelen
import ImgK1912 from "../../Assets/Images/Krant1912.jpg";
import ImgK1913 from "../../Assets/Images/Krant1913.jpg";
import ImgK1916 from "../../Assets/Images/Krant1916.jpg";
import ImgK1918 from "../../Assets/Images/Krant1918.jpg";
import ImgK1919 from "../../Assets/Images/Krant1919.jpg";
import ImgK1921 from "../../Assets/Images/Krant1921.jpg";
import ImgK1926 from "../../Assets/Images/Krant1926.jpg";
import ImgK1927 from "../../Assets/Images/Krant1927.png";
import ImgK1928 from "../../Assets/Images/Krant1928.jpg";
import ImgK1930 from "../../Assets/Images/Krant1930.jpg";
import ImgK1932 from "../../Assets/Images/Krant1932.jpg";
import ImgK1934 from "../../Assets/Images/Krant1934.png";
import ImgK1935 from "../../Assets/Images/Krant1935.jpg";
import ImgK1954 from "../../Assets/Images/Krant1954.jpg";
import ImgK1959 from "../../Assets/Images/Krant1959.jpg";
import ImgK1965 from "../../Assets/Images/Krant1965.jpg";

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

const CATEGORIEEN = ["Alles", "Interieur", "Exterieur", "Tuin", "Leven", "Geschiedenis", "Restauratie"];

const FOTOS = [
    // ── Interieur ──────────────────────────────────────────────────────────
    { src: ImgWoonkamer,        cat: "Interieur", caption: "De woonkamer",          sub: "Hoge plafonds, authentieke stoelen, veel licht",
      verhaal: "De woonkamer is het kloppend hart van de villa. Hoge plafonds, originele architraven en een mix van verhalen — van pensiongenoten uit 1912 tot studenten van nu. Elke stoel heeft hier zijn eigen plek gevonden." },
    { src: ImgKroonluchter,     cat: "Interieur", caption: "Kristallen kroonluchter", sub: "Origineel, meer dan een eeuw oud",
      verhaal: "Deze kroonluchter hangt hier al meer dan honderd jaar. Door brandjes, oorlogen en verbouwingen bleef hij hangen — een stille getuige van alles wat er onder hem is gezegd en gevierd." },
    { src: ImgKachel,           cat: "Interieur", caption: "De houtkachel",         sub: "Carpe Diem — het hart van de woonkamer",
      verhaal: "Kachel 'Carpe Diem' — de naam staat in het ijzer gegraveerd. Maxim heeft hem eigenhandig geplaatst en ingemetseld. Op koude avonden trekt iedereen vanzelf naar de woonkamer." },
    { src: ImgMiddenverdieping, cat: "Interieur", caption: "Middenverdieping",       sub: "De luxe verdieping met eigen ingang",
      verhaal: "De middenverdieping is de meest zelfstandige plek van de villa. Eigen ingang, ruim balkon en airco. Hier wonen gasten die de rust van de villa willen zonder de drukte van het studentenleven erboven." },

    // ── Exterieur ──────────────────────────────────────────────────────────
    { src: ImgVillaFront,          cat: "Exterieur", caption: "De voorkant",                  sub: "Balkon en erker, karakteristiek voor 1906",
      verhaal: "De erker en het balkon zijn beeldbepalend voor Hoofdstraat 147 — en al meer dan een eeuw ongewijzigd. In 1906 was dit een van de meest opvallende nieuwbouwvilla's van Driebergen." },
    { src: ImgBloeiVoorkant,       cat: "Exterieur", caption: "Villa in volle bloei",         sub: "De gevel in de zomer, kleurrijk en uitnodigend",
      verhaal: "In de zomer verandert de gevel in een bloemenmuur. De planten groeien elk jaar iets hoger. Voorbijgangers stoppen regelmatig om een foto te maken van dit stukje Hoofdstraat." },
    { src: ImgGevel,               cat: "Exterieur", caption: "De gevel",                     sub: "Hoofdstraat 147, Driebergen-Rijsenburg",
      verhaal: "Dezelfde gevel als in 1906, op een grondige restauratie na. De bakstenen zijn origineel, de ramen zijn deels vervangen maar passen bij de stijl. 'Vredestein' staat nog altijd in steen boven de deur." },
    { src: ImgKroonluchterBloemen, cat: "Exterieur", caption: "Kroonluchter met bloemen",     sub: "De kroonluchter opgemaakt voor een bijzondere gelegenheid",
      verhaal: "Voor bijzondere gelegenheden wordt de hal versierd met bloemen, groen en licht. De kristallen kroonluchter doet dan extra zijn best — honderd jaar oud, maar nooit moe." },
    { src: ImgVredesteinBord,      cat: "Exterieur", caption: "Vredestein",                   sub: "Het originele naambordje in de boogvorm boven de ingang",
      verhaal: "Het naambordje boven de ingang is origineel. 'Vredestein' — een naam die rust en geborgenheid uitstraalt. In het tijdperk van het pension stond dit bord bekend in de hele regio." },
    { src: ImgHoogte,              cat: "Exterieur", caption: "Villa vanuit de hoogte",        sub: "Luchtfoto van het perceel en de omgeving",
      verhaal: "Vanuit de lucht zie je hoe groot het perceel eigenlijk is: 680 m². De moestuin, het terras, de villa zelf — alles geordend langs de Hoofdstraat in Driebergen-Rijsenburg." },
    { src: ImgBallon,              cat: "Exterieur", caption: "Luchtballon boven Vredestein",  sub: "Een bijzonder gezicht boven de Hoofdstraat",
      verhaal: "Op een vroege ochtend dreef er een luchtballon langs de Hoofdstraat. Net boven de dakrand van Villa Vredestein. Een voorbijganger ving het moment op — en het is sindsdien een van onze lievelingsfoto's." },
    { src: ImgNight,               cat: "Exterieur", caption: "Vredestein by night",           sub: "Sfeer als de zon ondergaat",
      verhaal: "Als de lichten aangaan en de zon zakt, toont de villa zijn avondgezicht. De sfeer is anders — stiller, warmer. Dit is het Vredestein dat de bewoners elke avond zien als ze thuiskomen." },
    { src: ImgVillaNight2,         cat: "Exterieur", caption: "Nacht na restauratie",          sub: "De villa na voltooiing, verlicht in het donker",
      verhaal: "De villa verlicht in het donker, na de grote restauratie. Voor Manon & Maxim was dit het moment waarop het allemaal echt werd — na maanden bouwen, eindelijk thuiskomen." },

    // ── Tuin ───────────────────────────────────────────────────────────────
    { src: ImgTuinFeest,    cat: "Tuin", caption: "Tuinfeest",               sub: "Buiten eten op het terras",
      verhaal: "Een zomeravond in de tuin van Vredestein. Lange tafels, kaarsen en de geur van vers eten. Zo gaat dat hier — iemand begint, en voor je het weet zitten er twintig mensen buiten." },
    { src: ImgMoestuinBloei, cat: "Tuin", caption: "Moestuin in bloei",      sub: "De moestuin op het perceel in volle pracht",
      verhaal: "De moestuin groeit elk jaar verder uit. Tomaten, courgettes, kruiden, zonnebloemen. Het idee was eenvoudig: zaaien, zorgen en eten wat de tuin geeft." },
    { src: ImgGroente,       cat: "Tuin", caption: "Oogst uit de moestuin",  sub: "Eigen groenten gekweekt op het perceel",
      verhaal: "Geen supermarkt, maar de eigen tuin. Courgettes die te groot worden als je even niet oplet, sla die sneller groeit dan je hem kunt eten. De moestuin leert je anders kijken naar eten." },
    { src: ImgKlaproos,      cat: "Tuin", caption: "Klaproos bij Vredestein",sub: "Natuur die vrij opkomt in de tuin",
      verhaal: "Klaprozen komen hier vanzelf op — elk jaar op een andere plek. Ze groeien gewoon langs het pad, tussen de stenen. Een vriendelijk teken dat de tuin zijn eigen gang gaat." },

    // ── Leven ──────────────────────────────────────────────────────────────
    { src: ImgFamilieRoelofsen,  cat: "Leven", caption: "Familie Roelofsen",          sub: "De familie die lang de bewoners van Villa Vredestein waren",
      verhaal: "De familie Roelofsen woonde hier decennialang. Op dit portret zijn ze zo alledaags en vertrouwd — midden in een huis dat nu zo anders aanvoelt, maar toch hetzelfde is. Dit is de menselijke continuïteit van Villa Vredestein." },
    { src: ImgRommertBram,       cat: "Leven", caption: "Rommert & Bram",             sub: "Twee van de studenten die de bovenverdieping bewonen",
      verhaal: "Rommert en Bram zijn twee van de studenten op de bovenste verdieping. Ze hebben elk een eigen kamer, een gedeelde keuken en — belangrijker — een gedeeld gevoel van thuis. Dat is precies de bedoeling van Villa Vredestein." },
    { src: ImgPannenkoeken2025,  cat: "Leven", caption: "Pannenkoekenavaond 2025",    sub: "De jaarlijkse pannenkoekentraditie in Villa Vredestein",
      verhaal: "Elk jaar is er een pannenkoekenavaond. Iedereen staat mee te bakken, de keuken staat vol, en niemand telt het aantal opgestapelde pannenkoeken. Het is een van die tradities die vanzelf zijn ontstaan." },
    { src: ImgKoken,             cat: "Leven", caption: "Koken in Vredestein",         sub: "De open keuken als ontmoetingsplek",
      verhaal: "De open keuken is meer dan een plek om eten te bereiden — het is de plek waar de dag begint en eindigt. Iemand zet koffie, iemand anders begint over wat er is. Zo werkt het hier." },
    { src: ImgEtenBuren,         cat: "Leven", caption: "Eten met de buren",           sub: "De deur staat altijd open in Villa Vredestein",
      verhaal: "Bij Villa Vredestein staat de deur letterlijk open. De buren weten dat. Soms is het toeval, soms is het gepland — maar een tafel vol mensen is hier nooit een uitzondering." },
    { src: ImgEtenOekrainers,    cat: "Leven", caption: "Oekraïense gasten",           sub: "Gastvrij onthaal van Oekraïense bezoekers",
      verhaal: "Na het uitbreken van de oorlog in Oekraïne opende Villa Vredestein zijn deuren voor vluchtelingen. Samen eten, samen verhalen delen — taal was soms een barrière, maar gastvrijheid niet." },
    { src: ImgKLM,               cat: "Leven", caption: "KLM fotoshoot",               sub: "Villa Vredestein als decor voor een KLM-fotoshoot",
      verhaal: "KLM koos Villa Vredestein als decor voor een interne fotoshoot. De hoge plafonds, de kroonluchters, de sfeer — het paste precies bij wat ze zochten. Een bijzondere dag in de lange geschiedenis van dit pand." },

    // ── Geschiedenis ──────────────────────────────────────────────────────
    { src: ImgAnsichtPension,    cat: "Geschiedenis", caption: "Ansichtkaart pension Vredestein", sub: "Het pension zoals het begin 1900 werd geadverteerd",
      verhaal: "Een ansichtkaart uit het begin van de twintigste eeuw, waarop Vredestein als pension werd aangeprezen. 'Rustig gelegen, christelijk pension' — dat was de boodschap. Toeristen kwamen van ver voor de lucht van de Heuvelrug." },
    { src: ImgAnsichtHfdstr,     cat: "Geschiedenis", caption: "Ansichtkaart Hoofdstraat",        sub: "Historische ansichtkaart van de Hoofdstraat in Driebergen",
      verhaal: "De Hoofdstraat van Driebergen zoals hij er rond 1910 uitzag. Minder auto's, meer rust. Villa Vredestein is ergens op dit beeld — maar de Hoofdstraat herkent u ongetwijfeld nog." },
    { src: ImgVilla1910,         cat: "Geschiedenis", caption: "Vredestein circa 1910",           sub: "Historische foto van de villa kort na de bouw in 1906",
      verhaal: "Een van de vroegste bekende foto's van de villa, gemaakt enkele jaren na de bouw in 1906. De gevel is bijna identiek aan hoe hij er nu uitziet — het pand heeft zijn karakter door de eeuwen bewaard." },
    { src: ImgVoorkantRoelofsen, cat: "Geschiedenis", caption: "Villa in het tijdperk Roelofsen", sub: "De voorkant van de villa zoals de familie Roelofsen hem kende",
      verhaal: "Zo zag de voorkant er uit in de jaren dat de familie Roelofsen hier woonde. De tuin is kaler, de gevel kleiner op de foto — maar de structuur is onmiskenbaar dezelfde als vandaag." },
    { src: ImgZustersPension,    cat: "Geschiedenis", caption: "Zusters van het pension",        sub: "Het personeel van het christelijk pension Vredestein",
      verhaal: "De vrouwen die het christelijk pension Vredestein draaiende hielden. Ze staan hier zo vertrouwelijk — alsof ze zo weer naar binnen gaan om thee te zetten voor de gasten." },
    { src: ImgTuinVroeger,       cat: "Geschiedenis", caption: "De tuin vroeger",                sub: "De achtertuin zoals die er uitzag in het tijdperk Roelofsen",
      verhaal: "De achtertuin in de tijd van het pension. Geen moestuin, maar een nette siertuin die paste bij een respectabel logeeradres. Nu is het een wilder, levendiger plek geworden." },
    { src: ImgKrantReclame,      cat: "Geschiedenis", caption: "Krantenadvertentie pension",     sub: "Het pension adverteerde regelmatig in de regionale pers",
      verhaal: "Pension Vredestein adverteerde trouw in de regionale krant. 'Aangename omgeving, goede tafel, christelijke huishouding.' Zo klonk het in die tijd. De gasten kwamen van heinde en verre." },
    { src: ImgGekocht2020,       cat: "Geschiedenis", caption: "Gekocht in 2020",               sub: "Het moment dat Manon & Maxim de sleutels in ontvangst nemen",
      verhaal: "17 december 2020. Manon & Maxim ontvangen de sleutels van Hoofdstraat 147. Achter hen een leeg, enigszins verwaarloosd pand. Voor hen: jaren werk en een droom die ze niet van plan waren los te laten." },
    { src: ImgVerhuiskaart,      cat: "Geschiedenis", caption: "De verhuiskaart",               sub: "De officiële aankondiging van het nieuwe hoofdstuk van Vredestein",
      verhaal: "De officiële aankondiging van het nieuwe hoofdstuk. Een verhuiskaart in de traditie van vroeger — met adres, datum en de belofte van een open deur. Die belofte is nagekomen." },
    { src: ImgKaartBlauw1,       cat: "Geschiedenis", caption: "Kadasterkaart Driebergen (I)",  sub: "Historische blauwdruk-kadasterkaart van Driebergen-Rijsenburg",
      verhaal: "In het Nationaal Archief liggen de blauwdrukkaarten van Driebergen uit het begin van de twintigste eeuw. Elk perceel netjes ingetekend — inclusief Hoofdstraat 147, toen al een opvallend groot kavel." },
    { src: ImgKaartBlauw2,       cat: "Geschiedenis", caption: "Kadasterkaart Driebergen (II)", sub: "Tweede blauwdrukkaart van het gebied rond Driebergen-Rijsenburg",
      verhaal: "Een tweede blauwdrukkaart van hetzelfde gebied. Samen geven ze een volledig beeld van hoe Driebergen er een eeuw geleden uitzag — straat voor straat, perceel voor perceel." },
    { src: ImgPercelen,          cat: "Geschiedenis", caption: "Kadastrale perceelkaart",       sub: "Perceelkaart met bouwnummers 2253-2256, Hoofdstraat 147",
      verhaal: "Bouwnummers 2253 tot 2256. Op dit stuk papier staat de juridische identiteit van de villa — meters, grenzen, eigendom. Droog op het oog, maar achter elk getal zit een verhaal." },
    { src: ImgKadasterHoofdstraat, cat: "Geschiedenis", caption: "Situatiekaart Hoofdstraat",   sub: "Historische bebouwingskaart langs de Hoofdstraat",
      verhaal: "De Hoofdstraat in kaart gebracht. Je ziet hoe dicht de bebouwing al was, hoe smal de percelen, hoe weinig er in honderd jaar is veranderd aan de plattegrond van dit deel van Driebergen." },
    { src: ImgRegister1,         cat: "Geschiedenis", caption: "Kamerafmetingen register",      sub: "Handgeschreven archiefregister met ruimtematen van Hfdstr. 147",
      verhaal: "Handgeschreven in het kadasterarchief: de afmetingen van elke kamer van Hoofdstraat 147, ooit opgemeten door een ambtenaar met een liniaal en inkt. De villa is nu precies zo groot als hier staat." },
    { src: ImgRegister2,         cat: "Geschiedenis", caption: "Historisch register II",        sub: "Tweede pagina — historische maatvoering van het pand",
      verhaal: "De tweede pagina van datzelfde register. Samen vormen ze een nauwkeurig beeld van de indeling van de villa — vastgelegd op papier, meer dan een eeuw geleden." },
    { src: ImgBouwreg1,          cat: "Geschiedenis", caption: "Bouwregister Hfdstr. 147 (I)",  sub: "Officieel bouwregister met aantekeningen en bouwdata",
      verhaal: "Het officiële bouwregister uit de archieven. Hier staat wanneer de villa is gebouwd, wie de eigenaar was en wat de bouwdata zijn. Het begin van het verhaal in drie regels zwarte inkt." },
    { src: ImgBouwreg2,          cat: "Geschiedenis", caption: "Bouwregister Hfdstr. 147 (II)", sub: "Vervolg van het bouwregister — historische indeling",
      verhaal: "Het vervolg van het bouwregister — aanvullingen, correcties, aantekeningen. Dit soort documenten zijn de ruggengraat van de geschiedenis van Villa Vredestein." },
    { src: ImgK1912, cat: "Geschiedenis", caption: "Ingezonden stuk, 1912",             sub: "Over het pension na de overname door Familie Sluijter",
      verhaal: "In 1912 nam Familie Sluijter het pension over. Dit ingezonden stuk kondigt dat nieuwe tijdperk aan — met dankbetuigingen en goede wensen in de hoffelijke stijl van die tijd." },
    { src: ImgK1913, cat: "Geschiedenis", caption: "Vacature keukenmeid, 1913",         sub: "Het pension adverteert voor personeel",
      verhaal: "Pension Vredestein was een degelijke werkgever. In 1913 werd er een keukenmeid gevraagd — 'flink en van goede beginselen'. De advertentie zegt veel over hoe het er hier aan toe ging." },
    { src: ImgK1916, cat: "Geschiedenis", caption: "Ingezonden stuk, 1916",             sub: "Midden in de Eerste Wereldoorlog",
      verhaal: "Midden in de Eerste Wereldoorlog. Nederland was neutraal, maar de onrust was voelbaar. Dit stuk uit Driebergen geeft een inkijk in het dagelijks leven van die onzekere jaren." },
    { src: ImgK1918, cat: "Geschiedenis", caption: "Vacature juffrouw, 1918",           sub: "Gezocht: hulp voor huishoudelijke werkzaamheden",
      verhaal: "Het einde van de oorlog nadert, maar het pension draait door. Een 'flinke juffrouw' gezocht voor de huishouding. De dagelijkse bedrijvigheid van Vredestein, vastgelegd in een paar woorden." },
    { src: ImgK1919, cat: "Geschiedenis", caption: "Rust- en herstellingsoorden, 1919", sub: "Vredestein vermeld als gerenommeerde bestemming",
      verhaal: "Na de oorlogsjaren adverteert een gids voor rust- en herstellingsoorden — en Vredestein staat erbij. Mensen uit de steden zochten rust op de Heuvelrug. Driebergen was een geliefde bestemming." },
    { src: ImgK1921, cat: "Geschiedenis", caption: "Krantenartikel, 1921",              sub: "Nieuws uit Driebergen in de jaren twintig",
      verhaal: "De jaren twintig beginnen. Driebergen is een bedrijvig dorp en het pension bloeit. Dit krantenartikel geeft een kijkje in het dagelijkse leven van Vredestein en zijn omgeving." },
    { src: ImgK1926, cat: "Geschiedenis", caption: "Familie Van de Bosch, 1926",        sub: "Bericht over de oorspronkelijke bewoners",
      verhaal: "Een bericht over de familie Van de Bosch, vroege bewoners van de villa. Namen die je terugvindt in de archieven — mensen van wie de sporen langzaam verdwijnen, maar hier nog zichtbaar zijn." },
    { src: ImgK1927, cat: "Geschiedenis", caption: "25 november 1927",                  sub: "Nieuws uit Driebergen-Rijsenburg",
      verhaal: "Een gewone nieuwsdag in Driebergen, vastgelegd in de krant. Maar de villa staat erin — een kleine vermelding, een bewijs dat Vredestein ook toen al een bekende naam was in het dorp." },
    { src: ImgK1928, cat: "Geschiedenis", caption: "Nieuws over inbraak, 1928",         sub: "Zelfs in rustig Driebergen bleef de wereld niet buiten",
      verhaal: "Zelfs in het rustige Driebergen van 1928 bleef de wereld niet buiten. Dit krantenartikel meldt een inbraak in de omgeving — en laat zien dat het leven hier ook zijn schaduwkanten had." },
    { src: ImgK1930, cat: "Geschiedenis", caption: "Advertentie, 1930",                 sub: "Bloeitijd van het christelijk pension",
      verhaal: "Bloeitijd van het christelijk pension onder Familie Sluijter. De advertentie is trots en uitnodigend — 'aangenaam gelegen, goede tafel'. Het pension trok gasten van heinde en verre." },
    { src: ImgK1932, cat: "Geschiedenis", caption: "Krantenartikel, 1932",              sub: "Driebergen in de zomer van 1932",
      verhaal: "Een zomers bericht uit Driebergen, 1932. Midden in de crisisjaren, maar het pension houdt stand. De villa was een constante in een turbulente tijd." },
    { src: ImgK1934, cat: "Geschiedenis", caption: "Krantenartikel, 1934",              sub: "Einde van het tijdperk-Sluijter nadert",
      verhaal: "Het einde van het tijdperk-Sluijter nadert. Na meer dan twintig jaar zoekt het pension nieuwe eigenaren. Een nieuwe bladzijde in het boek van Villa Vredestein." },
    { src: ImgK1935, cat: "Geschiedenis", caption: "Krantenartikel, 1935",              sub: "Na 23 jaar zoekt de villa nieuwe bewoners",
      verhaal: "Na 23 jaar verlaat Familie Sluijter het pension. De villa gaat opnieuw over naar nieuwe bewoners. Zo is de geschiedenis van Vredestein — een opeenvolging van hoofdstukken, elk met zijn eigen gezichten." },
    { src: ImgK1954, cat: "Geschiedenis", caption: "Te huur-advertentie, 1954",         sub: "Tijdperk mevrouw Elings, naoorlogse periode",
      verhaal: "Naoorlogs Nederland. Villa Vredestein wordt aangeboden als huurwoning — een nieuw hoofdstuk onder mevrouw Elings. De villa past zich aan, zoals hij dat altijd heeft gedaan." },
    { src: ImgK1959, cat: "Geschiedenis", caption: "Krantenartikel, 1959",              sub: "Nieuws uit de periode van mevrouw Elings",
      verhaal: "Een bericht uit de tijd van mevrouw Elings, die Vredestein haar thuis maakte. De villa was inmiddels een begrip in Driebergen — oud genoeg om als historisch te gelden." },
    { src: ImgK1965, cat: "Geschiedenis", caption: "Vacature verpleeghulp, 1965",       sub: "Villa Vredestein had in deze periode een zorgende functie",
      verhaal: "In de jaren zestig had Villa Vredestein een verzorgende functie. Er werd gezocht naar een verpleeghulp — een aanwijzing dat het pand in die periode ook voor kwetsbare bewoners een thuis bood." },

    // ── Restauratie ────────────────────────────────────────────────────────
    { src: ImgWijnkamer,         cat: "Restauratie", caption: "Vóór de restauratie",         sub: "De woonkamer zoals die er uitzag vóór de werkzaamheden",
      verhaal: "Zo zag de woonkamer eruit voordat Manon & Maxim de handen uit de mouwen staken. Verouderde afwerking, gedateerde kleuren — maar onder dat alles: dezelfde ruimte, dezelfde proporties, dezelfde magie." },
    { src: ImgSlopen,            cat: "Restauratie", caption: "Slopen",                      sub: "Het begin van de grote transformatie in 2020",
      verhaal: "Het begin was radicaal: alles eruit wat niet kon blijven. Slopen is een daad van vertrouwen — je vernietigt iets in de hoop dat wat eronder zit beter is. Dat bleek inderdaad zo te zijn." },
    { src: ImgIsoleren,          cat: "Restauratie", caption: "Isoleren",                    sub: "Maanden isolatiewerk voor een energiezuinig pand",
      verhaal: "Maanden van isolatiewerk. Muren, vloeren, daken — alles werd gelaagd en gedicht. Het is het onzichtbare werk dat je later nooit ziet, maar altijd voelt op een koude winteravond." },
    { src: ImgRestauratie,       cat: "Restauratie", caption: "Glas-in-lood",                sub: "Het originele glas-in-loodraam tijdens de restauratie",
      verhaal: "De glas-in-loodramen zijn origineel en werden met de grootst mogelijke zorg behandeld. Elk paneel werd geïnspecteerd, gerepareerd en teruggeplaatst. Ze geven de villa zijn onmiskenbare karakter." },
    { src: ImgGlasLood2,         cat: "Restauratie", caption: "Glas-in-lood werkzaamheden",  sub: "Het herstelwerk aan de historische ramen",
      verhaal: "Het herstelwerk aan de ramen was precisiewerk. Glazenmakers werkten dagenlang aan elk raam — kleur voor kleur, lood voor lood. Het resultaat is te zien in het licht dat nu door de hal valt." },
    { src: ImgKachelBouw,        cat: "Restauratie", caption: "De kachel bouwen",            sub: "De houtkachel werd vakkundig geplaatst en ingemetseld",
      verhaal: "Maxim heeft de houtkachel met eigen handen geplaatst en ingemetseld. 'Carpe Diem' heet hij — en dat gevoel gaf hij de woonkamer meteen mee. Nu is de kachel het eerste wat mensen opvalt als ze binnenkomen." },
    { src: ImgKroonluchtersVerv, cat: "Restauratie", caption: "Kroonluchters vervoeren",     sub: "De originele kristallen kroonluchters werden met zorg verplaatst",
      verhaal: "De originele kristallen kroonluchters konden niet blijven hangen tijdens de werkzaamheden. Ze werden voorzichtig gedemonteerd, ingepakt en opgeslagen — en na de restauratie weer opgehangen op precies dezelfde plek." },
    { src: ImgSchatvondsten,     cat: "Restauratie", caption: "Schatvondsten",               sub: "Bijzondere vondsten tijdens de verbouwingswerkzaamheden",
      verhaal: "Tijdens het slopen kwamen er bijzondere vondsten tevoorschijn: oude munten, een brief, verborgen decoratieve elementen. Elke verbouwing in een oud pand is een beetje archeologie." },
    { src: ImgGietvloer,         cat: "Restauratie", caption: "Gietvloer — gevierd!",        sub: "De legdag van de gietvloer werd feestelijk gevierd",
      verhaal: "De dag dat de gietvloer werd gelegd, werd gevierd. Dat klinkt overdreven — maar wie wekenlang op zand heeft gelopen, begrijpt het. Het was een mijlpaal in de restauratie van de begane grond." },
    { src: ImgTerrasAanleg,      cat: "Restauratie", caption: "Terras aanleggen",            sub: "Het terras werd aangelegd en het perceel ingericht",
      verhaal: "Het terras en de tuin werden als laatste aangepakt. Tegels leggen, beplanting aanbrengen, de moestuin indelen. Na de binnenkant eindelijk ook de buitenkant — het geheel werd compleet." },
    { src: ImgVerbouwen,         cat: "Restauratie", caption: "Verbouwen met Manon & Maxim", sub: "Samen aan de slag in het historische pand",
      verhaal: "Niet alles is uitbesteed. Manon & Maxim hebben zelf meegebouwd — geschilderd, geschroefd, gesleept. Het is hun pand in de letterlijkste zin van het woord, en dat is aan elke kamer te zien." },
];

const GalerijVilla = () => {
    const [actieveCat, setActieveCat] = useState("Alles");
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
                <title>Galerij & Historisch Archief — Villa Vredestein</title>
                <meta
                    name="description"
                    content="Fotogalerij en historisch archief van Villa Vredestein: interieur, exterieur, tuin, kadasterkaarten en krantenartikelen van 1906 tot nu."
                />
                <link rel="canonical" href="https://villavredestein.nl/galerij" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl/galerij" />
                <meta property="og:title" content="Galerij & Historisch Archief — Villa Vredestein" />
                <meta property="og:description" content="Fotogalerij en historisch archief van Villa Vredestein. Interieur, exterieur, kadasterkaarten en een eeuw krantenartikelen." />
                <meta property="og:image" content="https://villavredestein.nl/og-image.jpg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Galerij & Historisch Archief — Villa Vredestein" />
                <meta name="twitter:description" content="Fotogalerij en historisch archief van Villa Vredestein. Interieur, exterieur, kadasterkaarten en een eeuw krantenartikelen." />
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
                        aria-label={`${foto.caption} — klik om te vergroten`}
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
