import { useRef, useState, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContent } from "../../i18n/content";
import "./Boek.css";

import Omslag from "../../Assets/Images/boek-omslag.jpg";

// Titels van het boek zelf blijven Nederlands in alle talen; de toelichting wordt vertaald.
const THEMAS = [
    { titel: "Een huis aan de straatweg & Het Kokerpark", tekst: "Hoe het adres ontstond, en de grond waarop het huis kwam te staan." },
    { titel: "Rustoord voor den burgerstand", tekst: "De tijd waarin het huis een rustoord was." },
    { titel: "Kantoor, oorlog en een café", tekst: "Een bewogen periode met wisselend gebruik." },
    { titel: "Pension, rusthuis, verzorgingshuis", tekst: "Decennia waarin het huis zorg en onderdak bood." },
    { titel: "Tandtechniek en studenten", tekst: "Van tandtechniek tot studentenhuis." },
    { titel: "Terug naar 1900", tekst: "De terugkeer naar de oorspronkelijke sfeer van het huis." },
    { titel: "Eigenaren en gebruikers", tekst: "Wie het huis bezaten en gebruikten, op een rij." },
    { titel: "Wat dit boek niet weet", tekst: "Eerlijk over wat niet meer te achterhalen was." },
];
const NASLAG = ["Tijdlijn", "Het huis in het kort", "De grond in 1832", "Het weer sinds de bouw", "Bronnen"];

const Boek = () => {
    const tc = useContent();
    const [status, setStatus] = useState<"idle" | "bezig" | "ok" | "fout">("idle");
    const geopend = useRef(Date.now()); // spamfilter: hoe lang het formulier open stond
    const verstuur = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        if (form.get("bot-field")) { setStatus("ok"); return; } // bot: doen alsof het gelukt is
        setStatus("bezig");
        try {
            const data = new URLSearchParams(form as unknown as Record<string, string>);
            const res = await fetch("/bestel-form.html", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: data.toString() });
            setStatus(res.ok ? "ok" : "fout");
        } catch { setStatus("fout"); }
    };
    const { i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";
    const titel = tc("Hoofdstraat 147, het boek | Villa Vredestein");
    const omschrijving = tc("Hoofdstraat 147: het verhaal van één adres in Driebergen-Rijsenburg. Een huisbiografie over Villa Vredestein, van 1905 tot nu.");

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Book",
        name: "Hoofdstraat 147",
        description: omschrijving,
        inLanguage: "nl",
        about: "Villa Vredestein, Driebergen-Rijsenburg",
        image: "https://villavredestein.com/og-image.jpg",
        url: "https://villavredestein.com/boek",
    };

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
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            </Helmet>

            {/* ── Hero ── */}
            <section className="boek-hero" aria-label={tc("Het boek")}>
                <div className="boek-hero-text">
                    <p className="boek-eyebrow">{tc("Het boek")}</p>
                    <h1 className="boek-title">Hoofdstraat 147</h1>
                    <p className="boek-sub">{tc("Het verhaal van één adres in Driebergen-Rijsenburg.")}</p>
                    <p className="boek-lead">
                        {tc("Een huisbiografie over Villa Vredestein: negen hoofdstukken over wie hier woonden, werkten en logeerden, van het bouwjaar 1905 tot nu. Met tijdlijn, kaarten en bronnen.")}
                    </p>
                    <div className="boek-ctas">
                        <a className="boek-btn boek-btn--solid" href="#bestellen">{tc("Bestel het boek")}</a>
                        <Link className="boek-btn" to="/boek/lezen">{tc("Lees het boek online")}</Link>
                    </div>
                </div>
                <figure className="boek-cover" data-no-reveal>
                    <img src={Omslag} alt={tc("Omslag van het boek Hoofdstraat 147 met een tekening van Villa Vredestein")} width="1116" height="1612" fetchPriority="high" />
                </figure>
            </section>

            {/* ── Kerncijfers ── */}
            <ul className="boek-facts" data-no-reveal>
                <li><strong>9</strong><span>{tc("Hoofdstukken")}</span></li>
                <li><strong>1905 – nu</strong><span>{tc("Eén adres")}</span></li>
                <li><strong>5</strong><span>{tc("Naslagdelen")}</span></li>
            </ul>

            {/* ── Over het boek ── */}
            <section className="boek-intro" aria-labelledby="boek-intro-kop">
                <div>
                    <p className="boek-eyebrow">{tc("Over het boek")}</p>
                    <h2 id="boek-intro-kop">{tc("Een huis als hoofdpersoon")}</h2>
                </div>
                <div className="boek-intro-tekst">
                    <p>{tc("Hoofdstraat 147 volgt één adres door de tijd. Niet alleen de stenen, maar vooral de mensen: wie er woonden, werkten, logeerden en studeerden.")}</p>
                    <p>{tc("Van een huis aan de straatweg tot rustoord, kantoor, pension, verzorgingshuis en studentenhuis, en de terugkeer naar de sfeer van 1900. Ook wat niet meer te achterhalen is, staat eerlijk in het boek.")}</p>
                </div>
            </section>

            {/* ── Thema's ── */}
            <section className="boek-themas" aria-labelledby="boek-themas-kop">
                <p className="boek-eyebrow">{tc("Wat je leest")}</p>
                <h2 id="boek-themas-kop">{tc("Een eeuw aan verhalen")}</h2>
                <ul className="boek-grid">
                    {THEMAS.map((t, i) => (
                        <li key={t.titel} className="boek-card">
                            <span className="boek-card-nr">{String(i + 1).padStart(2, "0")}</span>
                            <h3>{t.titel}</h3>
                            <p>{tc(t.tekst)}</p>
                        </li>
                    ))}
                </ul>
            </section>

            {/* ── Naslag ── */}
            <section className="boek-naslag" aria-labelledby="boek-naslag-kop">
                <p className="boek-eyebrow">{tc("Naslag")}</p>
                <h2 id="boek-naslag-kop">{tc("Meer dan een verhaal")}</h2>
                <p className="boek-naslag-p">{tc("Achterin vind je tijdlijn, kaarten en bronnen om zelf verder te zoeken.")}</p>
                <ul className="boek-chips">
                    {NASLAG.map((n) => <li key={n}>{n}</li>)}
                </ul>
            </section>

            {/* ── Bestellen ── */}
            <section className="boek-bestel" id="bestellen" aria-labelledby="boek-bestel-kop">
                <h2 id="boek-bestel-kop">{tc("Bestel het boek")}</h2>
                <p className="boek-bestel-p">{tc("Laat je gegevens achter en we nemen contact met je op over je exemplaar van het boek.")}</p>
                {status === "ok" ? (
                    <p className="boek-form-ok" role="status">{tc("Bedankt! Je bestelaanvraag is ontvangen. Je krijgt een bevestiging per e-mail en we nemen snel contact met je op.")}</p>
                ) : (
                    <form className="boek-form" name="boek-bestelling" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={verstuur}>
                        <input type="hidden" name="form-name" value="boek-bestelling" />
                        <input type="hidden" name="_t" value={geopend.current} />
                        <input type="hidden" name="taal" value={langCode} />
                        <p className="boek-hp" aria-hidden="true"><label>Niet invullen <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
                        <label>{tc("Naam")}<input name="naam" required autoComplete="name" /></label>
                        <label>{tc("E-mailadres")}<input name="email" type="email" required autoComplete="email" /></label>
                        <label>{tc("Aantal exemplaren")}<input name="aantal" type="number" min={1} max={20} defaultValue={1} required /></label>
                        <label>{tc("Adres (optioneel)")}<input name="adres" autoComplete="street-address" /></label>
                        <label>{tc("Opmerking (optioneel)")}<textarea name="opmerking" rows={3} /></label>
                        <button className="boek-btn boek-btn--solid" type="submit" disabled={status === "bezig"}>{tc("Verstuur bestelaanvraag")}</button>
                        {status === "fout" && <p className="boek-form-err" role="alert">{tc("Versturen is niet gelukt. Probeer het later opnieuw of neem contact met ons op.")}</p>}
                    </form>
                )}
            </section>

            {/* ── Verder ── */}
            <section className="boek-meer" aria-labelledby="boek-meer-kop">
                <p className="boek-eyebrow">{tc("Meer verhalen")}</p>
                <h2 id="boek-meer-kop">{tc("Ontdek meer over het huis")}</h2>
                <div className="boek-links">
                    <Link to="/tijdlijn"><strong>{tc("Tijdlijn")}</strong><span>{tc("De geschiedenis van het huis in jaartallen.")}</span></Link>
                    <Link to="/in-de-pers"><strong>{tc("In de pers")}</strong><span>{tc("Krantenartikelen en pensioncourant uit 1912-1940.")}</span></Link>
                    <Link to="/verhaal"><strong>{tc("Over ons")}</strong><span>{tc("Het verhaal achter Villa Vredestein.")}</span></Link>
                </div>
            </section>
        </main>
    );
};

export default Boek;
