import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoogleReviews from "../../Components/GoogleReviews/GoogleReviews";
import { OPTIES } from "../../Data/verblijfOpties";
import "./Verblijven.css";

import VillaVoorImg   from "../../Assets/Images/ext-villa-voorkant.jpg";
import VillaBloeiImg  from "../../Assets/Images/ext-villa-bloei.jpg";
import { useContent } from "../../i18n/content";

const Verblijven = () => {
    const tc = useContent();
    const { i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedOptie, setSelectedOptie] = useState("kamer");
    const [form, setForm] = useState({
        naam: "", email: "", telefoon: "",
        aankomst: "", vertrek: "", gasten: "1",
        optie: "kamer", bericht: "",
    });
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const revealRefs = useRef([]);
    const addRef = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in-view")),
            { threshold: 0.08 }
        );
        revealRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const optieVanRuimte = location.state?.optie;
        if (optieVanRuimte && OPTIES.some((o) => o.id === optieVanRuimte)) {
            setSelectedOptie(optieVanRuimte);
            setForm((f) => ({ ...f, optie: optieVanRuimte }));
            const targetId = location.state?.scrollTo === "formulier" ? "verblijf-formulier" : "verblijf-opties";
            requestAnimationFrame(() => {
                document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
    }, [location.state]);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleOptieSelect = (id) => {
        setSelectedOptie(id);
        setForm((f) => ({ ...f, optie: id }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSending(true);
        const formEl = e.target;
        const data = new FormData(formEl);

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
        })
            .then(() => {
                setSent(true);
            })
            .catch(() => {
                setError("Er ging iets mis bij het versturen. Probeer het later opnieuw of neem direct contact op.");
            })
            .finally(() => setSending(false));
    };

    const verblijfSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ItemList",
                "@id": "https://villavredestein.com/verblijven#opties",
                "name": "Verblijfsopties bij Villa Vredestein",
                "itemListElement": OPTIES.map((o, i) => ({
                    "@type": "ListItem",
                    "position": i + 1,
                    "item": {
                        "@type": "Offer",
                        "name": o.titel,
                        "description": o.beschrijving,
                        "url": `https://villavredestein.com/verblijven/${o.id}`,
                        "availability": "https://schema.org/InStock",
                        "seller": { "@id": "https://villavredestein.com/#business" },
                    },
                })),
            },
        ],
    });

    return (
        <main className="verblijven-page">
            <Helmet>
                <html lang={langCode} />
                <title>{tc("Verblijven & Boeken, Villa Vredestein")}</title>
                <meta name="description" content={tc("Verblijf in Villa Vredestein in Driebergen-Rijsenburg: logeerkamer, tijdelijk verblijf voor IVA-studenten, de volledige villa, of huur als decor voor fotoproducties. Vraag beschikbaarheid op.")} />
                <link rel="canonical" href="https://villavredestein.com/verblijven" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.com/verblijven" />
                <meta property="og:title" content={tc("Verblijven in Villa Vredestein, Driebergen-Rijsenburg")} />
                <meta property="og:description" content={tc("Logeerkamer, tijdelijk verblijf voor IVA-studenten, de volledige villa, of huur als decor voor fotoproducties. Vraag beschikbaarheid op.")} />
                <meta property="og:image" content="https://villavredestein.com/og-image.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:alt" content={tc("Villa Vredestein, historische villa uit 1906 in Driebergen-Rijsenburg")} />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={tc("Verblijven in Villa Vredestein, Driebergen-Rijsenburg")} />
                <meta name="twitter:description" content={tc("Logeerkamer, tijdelijk verblijf voor IVA-studenten, de volledige villa, of huur als decor voor fotoproducties. Vraag beschikbaarheid op.")} />
                <meta name="twitter:image" content="https://villavredestein.com/og-image.jpg" />
                <script type="application/ld+json">{verblijfSchema}</script>
            </Helmet>

            {/* Hero */}
            <header className="verb-hero">
                <div className="verb-hero-bg" style={{ backgroundImage: `url(${VillaBloeiImg})` }} />
                <div className="verb-hero-overlay" />
                <div className="verb-hero-content">
                    <span className="verb-eyebrow">{tc("Verblijven")}</span>
                    <h1>{tc("Een nacht, een maand of langer. Villa Vredestein verwelkomt je.")}</h1>
                    <p>{tc("Een nacht, je studieperiode bij de IVA of een verbouwing en een tijdelijke oplossing nodig?")}</p>
                </div>
            </header>

            {/* Stats strip */}
            <div className="verb-stats-strip">
                {[
                    { num: "1906", label: "Gebouwd" },
                    { num: "292 m²", label: "Woonoppervlak" },
                    { num: "6", label: "Slaapkamers" },
                    { num: "680 m²", label: "Perceel" },
                    { num: "3", label: "Verdiepingen" },
                ].map((s) => (
                    <div key={s.label} className="verb-stat">
                        <strong>{tc(s.num)}</strong>
                        <span>{tc(s.label)}</span>
                    </div>
                ))}
            </div>

            {/* Opties */}
            <section id="verblijf-opties" className="verb-opties reveal-section" ref={addRef}>
                <div className="verb-inner">
                    <h2 className="verb-section-title">{tc("Kies jouw verblijf")}</h2>
                    <div className="opties-grid">
                        {OPTIES.map((o) => (
                            <Link
                                key={o.id}
                                to={`/verblijven/${o.id}`}
                                className={`optie-card ${o.featured ? "optie-featured" : ""} ${selectedOptie === o.id ? "optie-selected" : ""}`}
                            >
                                {o.featured && <div className="optie-badge">{tc("Populair")}</div>}
                                <div className="optie-icon">{tc(o.icon)}</div>
                                <h3>{tc(o.titel)}</h3>
                                <span className="optie-sub">{tc(o.sub)}</span>
                                <p>{tc(o.beschrijving)}</p>
                                <ul className="optie-features">
                                    {o.kenmerken.map((k) => (
                                        <li key={k}>
                                            <span aria-hidden="true">✓</span> {tc(k)}
                                        </li>
                                    ))}
                                </ul>
                                <div className="optie-footer">
                                    <span className="optie-prijs">{tc(o.vanaf)}</span>
                                    <span className="optie-meer">{tc("Bekijk details & foto's →")}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Altijd inbegrepen */}
            <section className="verb-inbegrepen-section reveal-section" ref={addRef}>
                <div className="verb-inner">
                    <h3 className="verb-inbegrepen-titel">{tc("Altijd inbegrepen")}</h3>
                    <div className="verb-chips">
                        {[
                            { icon: "📶", label: "Snel internet" },
                            { icon: "🚗", label: "Parkeerplaats" },
                            { icon: "🌳", label: "Tuin & terras" },
                            { icon: "🌿", label: "Moestuin" },
                            { icon: "🏛️", label: "Historisch pand (1906)" },
                            { icon: "🔑", label: "Eigen sleutel" },
                            { icon: "🤝", label: "Persoonlijk contact" },
                        ].map((c) => (
                            <div key={c.label} className="verb-chip">
                                <span aria-hidden="true">{tc(c.icon)}</span>
                                {tc(c.label)}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <GoogleReviews />

            {/* Boekingsformulier */}
            <section id="verblijf-formulier" className="verb-form-section reveal-section" ref={addRef}>
                <div className="verb-inner verb-form-grid">

                    <div className="verb-form-left">
                        <h2 className="verb-section-title">{tc("Beschikbaarheid opvragen")}</h2>
                        <p>
                            {tc("Vul het formulier in en we nemen binnen 24 uur contact met je op. We vertellen je alles over de beschikbaarheid, voorwaarden en prijs.")}
                        </p>
                        <div className="verb-form-img">
                            <img src={VillaVoorImg} alt={tc("Voorgevel van Villa Vredestein in Driebergen-Rijsenburg")} loading="lazy" />
                        </div>
                        <div className="verb-garanties">
                            {["Persoonlijk antwoord binnen 24u", "Geen verborgen kosten", "Flexibele annulering bespreekbaar"].map((g) => (
                                <div key={g} className="garantie-item">
                                    <span aria-hidden="true">✓</span>
                                    <span>{tc(g)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="verb-form-right">
                        {sent ? (
                            <div className="verb-success">
                                <div className="verb-success-icon">✓</div>
                                <h3>{tc("Aanvraag ontvangen!")}</h3>
                                <p>{tc("We nemen zo snel mogelijk contact met je op via het opgegeven e-mailadres.")}</p>
                                <button className="verb-btn-secondary" onClick={() => navigate("/contact")}>
                                    {tc("Nog een vraag stellen")}
                                </button>
                            </div>
                        ) : (
                            <form
                                className="verb-form"
                                onSubmit={handleSubmit}
                                name="verblijven"
                                data-netlify="true"
                                data-netlify-honeypot="bot-field"
                            >
                                <input type="hidden" name="form-name" value="verblijven" />
                                <p style={{ display: "none" }} aria-hidden="true"><label>{tc("Niet invullen:")} <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>

                                <div className="form-field-select">
                                    <label htmlFor="optie">{tc("Type verblijf")}</label>
                                    <select
                                        id="optie"
                                        name="optie"
                                        value={form.optie}
                                        onChange={(e) => { handleChange(e); handleOptieSelect(e.target.value); }}
                                        required
                                    >
                                        {OPTIES.map((o) => (
                                            <option key={o.id} value={o.id}>{tc(o.icon)} {tc(o.titel)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-row">
                                    <div className="form-field">
                                        <label htmlFor="aankomst">{tc("Aankomst")}</label>
                                        <input
                                            type="date"
                                            id="aankomst"
                                            name="aankomst"
                                            value={form.aankomst}
                                            onChange={handleChange}
                                            min={new Date().toISOString().split("T")[0]}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label htmlFor="vertrek">{tc("Vertrek")}</label>
                                        <input
                                            type="date"
                                            id="vertrek"
                                            name="vertrek"
                                            value={form.vertrek}
                                            onChange={handleChange}
                                            min={form.aankomst || new Date().toISOString().split("T")[0]}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-field">
                                        <label htmlFor="naam">{tc("Naam *")}</label>
                                        <input
                                            type="text"
                                            id="naam"
                                            name="naam"
                                            value={form.naam}
                                            onChange={handleChange}
                                            placeholder={tc("Jouw naam")}
                                            required
                                            autoComplete="name"
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label htmlFor="gasten">{tc("Aantal gasten")}</label>
                                        <select id="gasten" name="gasten" value={form.gasten} onChange={handleChange}>
                                            {[1,2,3,4,5,6,7,8].map((n) => (
                                                <option key={n} value={n}>{tc(n)} {n === 1 ? tc("gast") : tc("gasten")}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="email">{tc("E-mailadres *")}</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder={tc("jouw@email.nl")}
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="telefoon">{tc("Telefoon")} <span>{tc("(optioneel)")}</span></label>
                                    <input
                                        type="tel"
                                        id="telefoon"
                                        name="telefoon"
                                        value={form.telefoon}
                                        onChange={handleChange}
                                        placeholder="+31 6 ..."
                                        autoComplete="tel"
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="bericht">{tc("Toelichting")} <span>{tc("(optioneel)")}</span></label>
                                    <textarea
                                        id="bericht"
                                        name="bericht"
                                        value={form.bericht}
                                        onChange={handleChange}
                                        placeholder={tc("Vertel ons iets over jouw verblijf, wensen of vragen...")}
                                        rows={4}
                                    />
                                </div>

                                <button type="submit" className="verb-submit" disabled={sending}>
                                    {sending ? tc("Versturen...") : tc("Stuur aanvraag")}
                                </button>

                                {error && <p className="verb-form-error" role="alert">❌ {tc(error)}</p>}

                                <p className="form-privacy">
                                    {tc("Je gegevens worden alleen gebruikt om contact met je op te nemen.")}
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Verblijven;
