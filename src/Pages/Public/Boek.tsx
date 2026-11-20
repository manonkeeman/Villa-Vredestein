import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useContent } from "../../i18n/content";
import "./Boek.css";

import Omslag from "../../Assets/Images/boek-omslag.jpg";
import Inhoud from "../../Assets/Images/boek-inhoud.jpg";
import Qr from "../../Assets/Images/boek-qr.jpg";

// Titels van het boek zelf: blijven Nederlands in alle talen.
const VOORAF = [{ titel: "Over dit boek", p: 5 }];
const GESCHIEDENIS = [
    { nr: "I", titel: "Een huis aan de straatweg", p: 7 },
    { nr: "II", titel: "Het Kokerpark", p: 13 },
    { nr: "III", titel: "Rustoord voor den burgerstand", p: 18 },
    { nr: "IV", titel: "Kantoor, oorlog en een café", p: 32 },
    { nr: "V", titel: "Pension, rusthuis, verzorgingshuis", p: 35 },
    { nr: "VI", titel: "Tandtechniek en studenten", p: 40 },
    { nr: "VII", titel: "Terug naar 1900", p: 43 },
    { nr: "VIII", titel: "Eigenaren en gebruikers", p: 54 },
    { nr: "IX", titel: "Wat dit boek niet weet", p: 57 },
];
const NASLAG = [
    { titel: "Tijdlijn", p: 61 },
    { titel: "Het huis in het kort", p: 65 },
    { titel: "De grond in 1832", p: 67 },
    { titel: "Het weer sinds de bouw", p: 69 },
    { titel: "Bronnen", p: 70 },
];

const Boek = () => {
    const tc = useContent();
    const { i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";
    const titel = tc("Hoofdstraat 147, het boek | Villa Vredestein");
    const omschrijving = tc("Hoofdstraat 147: het verhaal van één adres in Driebergen-Rijsenburg. Een huisbiografie over Villa Vredestein, van 1905 tot nu.");

    return (
        <main className="boek" role="main">
            <Helmet>
                <html lang={langCode} />
                <title>{titel}</title>
                <meta name="description" content={omschrijving} />
                <link rel="canonical" href="https://villavredestein.com/boek" />
                <meta property="og:type" content="book" />
                <meta property="og:url" content="https://villavredestein.com/boek" />
                <meta property="og:title" content={titel} />
                <meta property="og:description" content={omschrijving} />
                <meta property="og:image" content="https://villavredestein.com/og-image.jpg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            {/* ── Hero: omslag naast titel ── */}
            <section className="boek-hero" aria-label={tc("Het boek")}>
                <div className="boek-hero-text">
                    <p className="boek-eyebrow">{tc("Het boek")}</p>
                    <h1 className="boek-title">Hoofdstraat 147</h1>
                    <p className="boek-sub">{tc("Het verhaal van één adres in Driebergen-Rijsenburg.")}</p>
                    <p className="boek-lead">
                        {tc("Een huisbiografie over Villa Vredestein: negen hoofdstukken over wie hier woonden, werkten en logeerden, van het bouwjaar 1905 tot nu. Met tijdlijn, kaarten en bronnen.")}
                    </p>
                </div>
                <figure className="boek-cover" data-no-reveal>
                    <img src={Omslag} alt={tc("Omslag van het boek Hoofdstraat 147 met een tekening van Villa Vredestein")} width="1116" height="1612" fetchPriority="high" />
                </figure>
            </section>

            {/* ── Inhoud ── */}
            <section className="boek-inhoud" aria-labelledby="boek-inhoud-kop">
                <p className="boek-eyebrow">{tc("Inhoud")}</p>
                <h2 id="boek-inhoud-kop">{tc("Negen hoofdstukken, één adres")}</h2>

                <div className="boek-toc">
                    <div>
                        <h3>{tc("Vooraf")}</h3>
                        <ol className="boek-toc-list">
                            {VOORAF.map((r) => (
                                <li key={r.titel}><span className="boek-toc-nr" /><span className="boek-toc-t">{r.titel}</span><span className="boek-toc-p">{r.p}</span></li>
                            ))}
                        </ol>
                        <h3>{tc("Naslag")}</h3>
                        <ol className="boek-toc-list">
                            {NASLAG.map((r) => (
                                <li key={r.titel}><span className="boek-toc-nr" /><span className="boek-toc-t">{r.titel}</span><span className="boek-toc-p">{r.p}</span></li>
                            ))}
                        </ol>
                    </div>
                    <div>
                        <h3>{tc("De geschiedenis")}</h3>
                        <ol className="boek-toc-list">
                            {GESCHIEDENIS.map((r) => (
                                <li key={r.nr}><span className="boek-toc-nr">{r.nr}</span><span className="boek-toc-t">{r.titel}</span><span className="boek-toc-p">{r.p}</span></li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            {/* ── Blader door het boek ── */}
            <section className="boek-blader" aria-labelledby="boek-blader-kop">
                <p className="boek-eyebrow">{tc("Een kijkje")}</p>
                <h2 id="boek-blader-kop">{tc("Blader door het boek")}</h2>
                <div className="boek-pages">
                    <figure data-no-reveal>
                        <img src={Inhoud} alt={tc("Inhoudsopgave van het boek Hoofdstraat 147")} loading="lazy" width="1006" height="1430" />
                        <figcaption>{tc("De inhoudsopgave")}</figcaption>
                    </figure>
                </div>
            </section>

            {/* ── Bestellen: alleen de QR-code ── */}
            <section className="boek-bestel" id="bestellen" aria-labelledby="boek-bestel-kop">
                <h2 id="boek-bestel-kop">{tc("Bestel het boek")}</h2>
                <img className="boek-qr" src={Qr} alt={tc("QR-code om het boek te bestellen")} width="250" height="250" loading="lazy" />
                <p className="boek-bestel-p">{tc("Scan de code om het boek te bestellen.")}</p>
                <p className="boek-code">{tc("Met kortingscode")} <code>BOEK98GJAC</code> {tc("krijg je € 10 korting.")}</p>
            </section>
        </main>
    );
};

export default Boek;
