import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useContent } from "../../i18n/content";
import "./Boek.css";

import Omslag from "../../Assets/Images/boek-omslag.jpg";
import Inhoud from "../../Assets/Images/boek-inhoud.jpg";
import Qr from "../../Assets/Images/boek-qr.jpg";

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
