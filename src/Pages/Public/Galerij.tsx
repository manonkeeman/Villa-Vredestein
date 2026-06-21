import React, { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import "./Galerij.css";

import Img1912 from "../../Assets/Images/Krant1912.jpg";
import Img1913 from "../../Assets/Images/Krant1913.jpg";
import Img1916 from "../../Assets/Images/Krant1916.jpg";
import Img1918 from "../../Assets/Images/Krant1918.jpg";
import Img1919 from "../../Assets/Images/Krant1919.jpg";
import Img1921 from "../../Assets/Images/Krant1921.jpg";
import Img1926 from "../../Assets/Images/Krant1926.jpg";
import Img1927 from "../../Assets/Images/Krant1927.png";
import Img1928 from "../../Assets/Images/Krant1928.jpg";
import Img1930 from "../../Assets/Images/Krant1930.jpg";
import Img1932 from "../../Assets/Images/Krant1932.jpg";
import Img1934 from "../../Assets/Images/Krant1934.png";
import Img1935 from "../../Assets/Images/Krant1935.jpg";
import Img1954 from "../../Assets/Images/Krant1954.jpg";
import Img1959 from "../../Assets/Images/Krant1959.jpg";
import Img1965 from "../../Assets/Images/Krant1965.jpg";
import ImgNight from "../../Assets/Images/VredesteineByNight.jpg";

import ImgKaartBlauw1  from "../../Assets/Images/archief-kadasterkaart-blauw-1.jpg";
import ImgKaartBlauw2  from "../../Assets/Images/archief-kadasterkaart-blauw-2.jpg";
import ImgPercelen     from "../../Assets/Images/archief-kadaster-percelen.jpg";
import ImgHoofdstraat  from "../../Assets/Images/archief-kadaster-hoofdstraat.jpg";
import ImgRegister1    from "../../Assets/Images/archief-register-1.jpg";
import ImgRegister2    from "../../Assets/Images/archief-register-2.jpg";
import ImgBouwreg1     from "../../Assets/Images/archief-bouwregister-1.jpg";
import ImgBouwreg2     from "../../Assets/Images/archief-bouwregister-2.jpg";

const FOTOS = [
    {
        src: Img1912,
        jaar: "1912",
        caption: "Ingezonden stuk, oktober 1912",
        beschrijving: "Een van de vroegste krantenberichten over het pension, kort nadat Familie Sluijter de villa overnam van de Gezusters van de Bosch.",
    },
    {
        src: Img1913,
        jaar: "1913",
        caption: "Vacature keukenmeid, juli 1913",
        beschrijving: "Advertentie voor een keukenmeid bij het pension op de Hoofdstraat. Het huis draaide op personeel.",
    },
    {
        src: Img1916,
        jaar: "1916",
        caption: "Ingezonden stuk, oktober 1916",
        beschrijving: "Midden in de Eerste Wereldoorlog verscheen dit stuk in de krant over het pension in Driebergen.",
    },
    {
        src: Img1918,
        jaar: "1918",
        caption: "Vacature juffrouw, december 1918",
        beschrijving: "Kort voor het einde van de oorlog zocht het pension naar een 'flinke juffrouw' voor huishoudelijke werkzaamheden.",
    },
    {
        src: Img1919,
        jaar: "1919",
        caption: "Rust- en herstellingsoorden, 1919",
        beschrijving: "Een overzicht van instellingen voor rust en herstel in Nederland, met Vredestein vermeld als gerenommeerde bestemming.",
    },
    {
        src: Img1921,
        jaar: "1921",
        caption: "Krantenartikel, december 1921",
        beschrijving: "Nieuws uit de buurt van het pension in het begin van de jaren twintig.",
    },
    {
        src: Img1926,
        jaar: "1926",
        caption: "Familie Van de Bosch, mei 1926",
        beschrijving: "Bericht gerelateerd aan de oorspronkelijke bewoners, de familie Van de Bosch, ruim tien jaar na hun vertrek.",
    },
    {
        src: Img1927,
        jaar: "1927",
        caption: "Krantenartikel, 25 november 1927",
        beschrijving: "Nieuws uit Driebergen-Rijsenburg over het pension en de directe omgeving.",
    },
    {
        src: Img1928,
        jaar: "1928",
        caption: "Nieuws over inbraak, 1928",
        beschrijving: "Bericht over een inbraak bij het pension. Zelfs in rustig Driebergen bleef de wereld niet buiten de deur.",
    },
    {
        src: Img1930,
        jaar: "1930",
        caption: "Advertentie, 1930",
        beschrijving: "Advertentie voor het pension tijdens de bloeitijd van het christelijk logement onder Familie Sluijter.",
    },
    {
        src: Img1932,
        jaar: "1932",
        caption: "Krantenartikel, juli 1932",
        beschrijving: "Krantenknipsel uit de zomer van 1932, toen het pension nog volop in bedrijf was.",
    },
    {
        src: Img1934,
        jaar: "1934",
        caption: "Krantenartikel, 1934",
        beschrijving: "Een van de laatste berichten voor het einde van het tijdperk-Sluijter. Het pension nadert de overgang naar een nieuwe periode.",
    },
    {
        src: Img1935,
        jaar: "1935",
        caption: "Krantenartikel, juni 1935",
        beschrijving: "Na bijna 23 jaar eindigt het tijdperk van Familie Sluijter. De villa zoekt nieuwe bewoners.",
    },
    {
        src: Img1954,
        jaar: "1954",
        caption: "Te huur-advertentie, april 1954",
        beschrijving: "Tijdens het beheer van mevrouw Elings staat een deel van de villa te huur. Een zeldzame blik in de naoorlogse periode.",
    },
    {
        src: Img1959,
        jaar: "1959",
        caption: "Krantenartikel, oktober 1959",
        beschrijving: "Nieuws uit de periode van mevrouw Elings, die de villa van 1945 tot 1963 bewoonde en beheerde.",
    },
    {
        src: Img1965,
        jaar: "1965",
        caption: "Vacature verpleeghulp, januari 1965",
        beschrijving: "Gezocht: hulp in de verpleging bij Villa Vredestein. De villa had in deze periode een zorgende functie.",
    },
    {
        src: ImgNight,
        jaar: "Archief",
        caption: "Vredestein by night",
        beschrijving: "Een nachtfoto van de villa aan de Hoofdstraat. De verlichte ramen vertellen hun eigen verhaal.",
    },
    {
        src: ImgKaartBlauw1,
        jaar: "Oud Kadaster",
        caption: "Kadasterkaart Driebergen (blauwdruk I)",
        beschrijving: "Historische blauwdruk-kadasterkaart van Driebergen-Rijsenburg met de ligging van percelen langs de Hoofdstraat.",
    },
    {
        src: ImgKaartBlauw2,
        jaar: "Oud Kadaster",
        caption: "Kadasterkaart Driebergen (blauwdruk II)",
        beschrijving: "Tweede blauwdrukkaart van het gebied rond Driebergen-Rijsenburg — een zeldzaam historisch document.",
    },
    {
        src: ImgPercelen,
        jaar: "Oud Kadaster",
        caption: "Kadastrale perceelkaart Hoofdstraat",
        beschrijving: "Perceelkaart met bouwnummers 2253, 2254, 2255 en 2256. Toont de ligging van Hoofdstraat 147 in zijn historische context.",
    },
    {
        src: ImgHoofdstraat,
        jaar: "Oud Kadaster",
        caption: "Situatiekaart Hoofdstraat",
        beschrijving: "Overzichtskaart van de bebouwing langs de Hoofdstraat in Driebergen — de villa is herkenbaar in de rij panden.",
    },
    {
        src: ImgRegister1,
        jaar: "Oud Archief",
        caption: "Historisch register — kamerafmetingen",
        beschrijving: "Handgeschreven archiefregister met ruimtematen en perceelgegevens van Hoofdstraat 147. Bevat de oorspronkelijke oppervlakten.",
    },
    {
        src: ImgRegister2,
        jaar: "Oud Archief",
        caption: "Historisch register II",
        beschrijving: "Tweede pagina uit hetzelfde register. De cijfers bevatten de historische maatvoering van het pand.",
    },
    {
        src: ImgBouwreg1,
        jaar: "Oud Archief",
        caption: "Bouwregister Hoofdstraat 147 (I)",
        beschrijving: "Officieel bouwregister met kolommen voor grootte, aantekeningen en bouwdata. Historische grondstoffenregistratie van het pand.",
    },
    {
        src: ImgBouwreg2,
        jaar: "Oud Archief",
        caption: "Bouwregister Hoofdstraat 147 (II)",
        beschrijving: "Vervolg van het bouwregister — bevat aanvullende data over de historische indeling en oppervlakten van de villa.",
    },
];

const Galerij = () => {
    const [lightbox, setLightbox] = useState(null);
    const lightboxRef = useRef(null);
    const previousFocusRef = useRef(null);

    const open = useCallback((index) => {
        previousFocusRef.current = document.activeElement;
        setLightbox(index);
        document.body.style.overflow = "hidden";
    }, []);

    const close = useCallback(() => {
        setLightbox(null);
        document.body.style.overflow = "";
        previousFocusRef.current?.focus();
    }, []);

    const prev = useCallback(() =>
        setLightbox((i) => (i - 1 + FOTOS.length) % FOTOS.length), []);

    const next = useCallback(() =>
        setLightbox((i) => (i + 1) % FOTOS.length), []);

    useEffect(() => {
        if (lightbox === null) return;

        const handleKey = (e) => {
            if (e.key === "ArrowRight") next();
            else if (e.key === "ArrowLeft") prev();
            else if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [lightbox, next, prev, close]);

    useEffect(() => {
        if (lightbox !== null) {
            lightboxRef.current?.focus();
        }
    }, [lightbox]);

    const foto = lightbox !== null ? FOTOS[lightbox] : null;

    return (
        <main className="galerij-page">
            <Helmet>
                <title>Historische Galerij — Villa Vredestein</title>
                <meta
                    name="description"
                    content="Krantenartikelen en historische foto's van Villa Vredestein van 1912 tot nu. Een visueel archief van meer dan een eeuw Hoofdstraat 147."
                />
                <link rel="canonical" href="https://villavredestein.nl/galerij" />
                <meta property="og:title" content="Historische Galerij — Villa Vredestein" />
                <meta property="og:description" content="Krantenartikelen en historische foto's van 1912 tot nu." />
            </Helmet>

            <header className="galerij-header">
                <h1>Historische Galerij</h1>
                <p>
                    Meer dan een eeuw bewaard gebleven. Krantenartikelen, advertenties en
                    foto's die het leven op Hoofdstraat 147 vastleggen, van 1912 tot nu.
                </p>
            </header>

            <div className="galerij-grid" role="list">
                {FOTOS.map((foto, i) => (
                    <article
                        key={i}
                        className="galerij-item"
                        role="listitem"
                        onClick={() => open(i)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open(i)}
                        tabIndex={0}
                        aria-label={`${foto.caption} — klik om te vergroten`}
                    >
                        <div className="galerij-img-wrap">
                            <img
                                src={foto.src}
                                alt={foto.caption}
                                loading="lazy"
                                className="galerij-img"
                                decoding="async"
                            />
                            <div className="galerij-overlay" aria-hidden="true">
                                <span className="galerij-jaar">{foto.jaar}</span>
                                <p className="galerij-caption">{foto.caption}</p>
                                <span className="galerij-zoom">⊕ Bekijk</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Lightbox */}
            {foto && (
                <div
                    className="lb-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Foto: ${foto.caption}`}
                    onClick={(e) => e.target === e.currentTarget && close()}
                >
                    <div
                        className="lb-box"
                        ref={lightboxRef}
                        tabIndex={-1}
                    >
                        {/* Close */}
                        <button className="lb-close" onClick={close} aria-label="Sluiten">
                            ✕
                        </button>

                        {/* Image */}
                        <div className="lb-img-wrap">
                            <img
                                src={foto.src}
                                alt={foto.caption}
                                className="lb-img"
                            />
                        </div>

                        {/* Caption */}
                        <div className="lb-info">
                            <span className="lb-jaar">{foto.jaar}</span>
                            <h2 className="lb-caption">{foto.caption}</h2>
                            <p className="lb-beschrijving">{foto.beschrijving}</p>
                        </div>

                        {/* Navigation */}
                        <button
                            className="lb-nav lb-prev"
                            onClick={prev}
                            aria-label="Vorige foto"
                        >
                            ‹
                        </button>
                        <button
                            className="lb-nav lb-next"
                            onClick={next}
                            aria-label="Volgende foto"
                        >
                            ›
                        </button>

                        {/* Counter */}
                        <div className="lb-counter" aria-live="polite">
                            {lightbox + 1} / {FOTOS.length}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Galerij;
