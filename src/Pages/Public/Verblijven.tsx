import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "./Verblijven.css";

import VillaVoorImg   from "../../Assets/Images/ext-villa-voorkant.jpg";
import VillaBloeiImg  from "../../Assets/Images/ext-villa-bloei.jpg";
import TuinTerrasImg  from "../../Assets/Images/tuin-terras.jpg";

const OPTIES = [
    {
        id: "kamer",
        icon: "🛏️",
        titel: "Privékamer",
        sub: "In de villa",
        beschrijving: "Eigen ruimte in een historisch pand. Gedeelde woonkamer, keuken en tuin.",
        vanaf: "Op aanvraag",
        kenmerken: ["Eigen kamer", "Gedeelde woonkamer", "Gemeenschappelijke keuken", "Tuin & terras", "Parkeerplaats", "Historisch pand"],
    },
    {
        id: "tijdelijk",
        icon: "📅",
        titel: "Tijdelijk verblijf",
        sub: "Kort of lang",
        beschrijving: "Op zoek naar tijdelijk onderdak tijdens je studie, of een IVA-student op zoek naar een kamer op loopafstand? We denken graag mee.",
        vanaf: "Op aanvraag",
        kenmerken: ["Flexibele duur", "Gemeubileerd", "Inclusief internet", "IVA-studenten welkom", "Parkeerplaats", "Beschikbaarheid in overleg"],
        featured: true,
    },
    {
        id: "villa",
        icon: "🏛️",
        titel: "Volledige villa",
        sub: "Exclusief gebruik",
        beschrijving: "De gehele Villa Vredestein voor jouw familie. Alle zes slaapkamers, alle gemeenschappelijke ruimtes en de volledige tuin. Ook ideaal voor expats of als tijdelijk thuis tijdens een verbouwing.",
        vanaf: "Op aanvraag",
        kenmerken: ["6 slaapkamers", "Volledige woonkamer", "Keukens", "Grote tuin & terras", "Parkeerplaats"],
    },
];

const Verblijven = () => {
    const navigate = useNavigate();
    const [selectedOptie, setSelectedOptie] = useState("kamer");
    const [form, setForm] = useState({
        naam: "", email: "", telefoon: "",
        aankomst: "", vertrek: "", gasten: "1",
        optie: "kamer", bericht: "",
    });
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
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

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleOptieSelect = (id) => {
        setSelectedOptie(id);
        setForm((f) => ({ ...f, optie: id }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        // Endpoint: POST /api/verblijf/aanvraag (Spring Boot)
        // Voor nu: simulate
        await new Promise((r) => setTimeout(r, 1200));
        setSent(true);
        setSending(false);
    };

    return (
        <main className="verblijven-page">
            <Helmet>
                <title>Verblijven & Boeken — Villa Vredestein</title>
                <meta name="description" content="Verblijf in Villa Vredestein in Driebergen-Rijsenburg. Privékamer, volledige villa of tijdelijk verblijf. Vraag beschikbaarheid op." />
                <link rel="canonical" href="https://villavredestein.nl/verblijven" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://villavredestein.nl/verblijven" />
                <meta property="og:title" content="Verblijven in Villa Vredestein — Driebergen-Rijsenburg" />
                <meta property="og:description" content="Privékamer, volledige villa of tijdelijk verblijf in een historisch pand uit 1906. Vraag beschikbaarheid op." />
                <meta property="og:image" content="https://villavredestein.nl/og-image.jpg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Verblijven in Villa Vredestein — Driebergen-Rijsenburg" />
                <meta name="twitter:description" content="Privékamer, volledige villa of tijdelijk verblijf in een historisch pand uit 1906. Vraag beschikbaarheid op." />
                <meta name="twitter:image" content="https://villavredestein.nl/og-image.jpg" />
            </Helmet>

            {/* Hero */}
            <header className="verb-hero">
                <div className="verb-hero-bg" style={{ backgroundImage: `url(${VillaBloeiImg})` }} />
                <div className="verb-hero-overlay" />
                <div className="verb-hero-content">
                    <span className="verb-eyebrow">Verblijven</span>
                    <h1>Jouw plek in de villa</h1>
                    <p>Een nacht, een maand of langer. Villa Vredestein verwelkomt je.</p>
                </div>
                <a href="#verblijf-opties" className="verb-hero-scroll" aria-label="Scroll naar verblijfsopties">
                    <span />
                </a>
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
                        <strong>{s.num}</strong>
                        <span>{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Opties */}
            <section id="verblijf-opties" className="verb-opties reveal-section" ref={addRef}>
                <div className="verb-inner">
                    <h2 className="verb-section-title">Kies jouw verblijf</h2>
                    <div className="opties-grid">
                        {OPTIES.map((o) => (
                            <article
                                key={o.id}
                                className={`optie-card ${o.featured ? "optie-featured" : ""} ${selectedOptie === o.id ? "optie-selected" : ""}`}
                                onClick={() => handleOptieSelect(o.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOptieSelect(o.id)}
                                aria-pressed={selectedOptie === o.id}
                            >
                                {o.featured && <div className="optie-badge">Populair</div>}
                                <div className="optie-icon">{o.icon}</div>
                                <h3>{o.titel}</h3>
                                <span className="optie-sub">{o.sub}</span>
                                <p>{o.beschrijving}</p>
                                <ul className="optie-features">
                                    {o.kenmerken.map((k) => (
                                        <li key={k}>
                                            <span aria-hidden="true">✓</span> {k}
                                        </li>
                                    ))}
                                </ul>
                                <div className="optie-prijs">
                                    <span>{o.vanaf}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sfeer — beeld + inbegrepen */}
            <section className="verb-sfeer reveal-section" ref={addRef}>
                <div className="verb-sfeer-img-wrap">
                    <img src={TuinTerrasImg} alt="Het terras van Villa Vredestein" className="verb-sfeer-img" loading="lazy" />
                    <div className="verb-sfeer-overlay" />
                    <div className="verb-sfeer-quote-wrap">
                        <blockquote className="verb-sfeer-quote">
                            "Wonen in Villa Vredestein is meer dan een kamer huren.<br />
                            Het is deel worden van een levend verhaal."
                        </blockquote>
                        <cite className="verb-sfeer-cite">— Manon &amp; Maxim, eigenaren</cite>
                    </div>
                </div>
                <div className="verb-inbegrepen">
                    <div className="verb-inner">
                        <h3 className="verb-inbegrepen-titel">Altijd inbegrepen</h3>
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
                                    <span aria-hidden="true">{c.icon}</span>
                                    {c.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* De Ruimtes */}
            <section className="verb-ruimtes reveal-section" ref={addRef}>
                <div className="verb-inner">
                    <h2 className="verb-section-title">De ruimtes</h2>
                    <p className="verb-ruimtes-intro">
                        Villa Vredestein telt drie verdiepingen met elk een eigen karakter.
                        292 m² woonoppervlak op een perceel van 680 m².
                    </p>
                    <div className="verb-ruimtes-grid">
                        <article className="verb-ruimte-card">
                            <div className="verb-ruimte-verd" style={{ background: "#d4804a" }}>Bovenste verdieping</div>
                            <div className="verb-ruimte-body">
                                <h3>🎓 Studenten</h3>
                                <p>Drie privékamers (16–17 m²) met eigen keuken, badkamer en zitruimte. Airco aanwezig.</p>
                                <ul className="verb-ruimte-list">
                                    <li>Thailand · Japan · Argentinië</li>
                                    <li>Gedeelde studentenkeuken</li>
                                    <li>Eigen badkamer & zitruimte</li>
                                </ul>
                            </div>
                        </article>
                        <article className="verb-ruimte-card">
                            <div className="verb-ruimte-verd" style={{ background: "#FCBC2D", color: "#000" }}>Middelste verdieping</div>
                            <div className="verb-ruimte-body">
                                <h3>✨ Luxe kamers</h3>
                                <p>Drie ruime kamers met balkon, airco en eigen ingang. Kitchenette, badkamer en sportruimte in aanbouw.</p>
                                <ul className="verb-ruimte-list">
                                    <li>Italië (22 m², balkon tuin)</li>
                                    <li>Frankrijk (18 m², balkon straat)</li>
                                    <li>Oekraïne (15 m², airco)</li>
                                    <li>Eigen ingang · Airco</li>
                                    <li className="verb-ruimte-aanbouw">Badkamer · Sportruimte · Kitchenette — in aanbouw</li>
                                </ul>
                            </div>
                        </article>
                        <article className="verb-ruimte-card">
                            <div className="verb-ruimte-verd" style={{ background: "#c8a46e" }}>Onderste verdieping</div>
                            <div className="verb-ruimte-body">
                                <h3>🏡 Woonverdieping</h3>
                                <p>Grote woonkamer met houtkachel, open keukeneiland met bar en aparte eetkamer. Gedeelde ruimtes.</p>
                                <ul className="verb-ruimte-list">
                                    <li>Woonkamer 45 m² · Erker</li>
                                    <li>Keukeneiland met bar</li>
                                    <li>Terras &amp; moestuin</li>
                                    <li className="verb-ruimte-aanbouw">Slaapkamer · Badkamer — in aanbouw</li>
                                </ul>
                            </div>
                        </article>
                    </div>
                    <div className="verb-ruimtes-cta">
                        <button className="verb-ruimtes-btn" onClick={() => navigate("/ruimtes")}>
                            Bekijk alle ruimtes in detail →
                        </button>
                    </div>
                </div>
            </section>

            {/* Reviews */}
            <section className="verb-reviews reveal-section" ref={addRef}>
                <div className="verb-inner">
                    <h2 className="verb-section-title">Wat bewoners zeggen</h2>
                    <div className="reviews-grid">
                        {[
                            {
                                naam: "Bram",
                                rol: "Student · Bovenste verdieping",
                                tekst: "Ik had niet verwacht dat wonen in een historische villa zo ontspannen zou zijn. De kamers zijn ruim, de tuin is een plek om echt bij te komen en Manon en Maxim zijn de beste huisbazen die je je kunt wensen.",
                                sterren: 5,
                            },
                            {
                                naam: "Simon",
                                rol: "Student · Bovenste verdieping",
                                tekst: "De sfeer hier is echt uniek. Een pand met zoveel karakter, midden in de natuur van Driebergen — en toch op fietsafstand van alles. De eigen keuken en zitruimte op onze verdieping zijn een groot pluspunt.",
                                sterren: 5,
                            },
                            {
                                naam: "Rommert",
                                rol: "Student · Bovenste verdieping",
                                tekst: "Al snel voelde het als mijn eigen thuis. De historische details in het pand, de grote tuin en het samenleven met een fijne groep mensen maakt Villa Vredestein echt bijzonder. Absoluut aan te raden.",
                                sterren: 5,
                            },
                        ].map((r) => (
                            <article key={r.naam} className="review-card">
                                <div className="review-sterren">
                                    {"★".repeat(r.sterren)}
                                </div>
                                <p className="review-tekst">"{r.tekst}"</p>
                                <div className="review-auteur">
                                    <div className="review-avatar">{r.naam.charAt(0)}</div>
                                    <div>
                                        <strong>{r.naam}</strong>
                                        <span>{r.rol}</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Boekingsformulier */}
            <section className="verb-form-section reveal-section" ref={addRef}>
                <div className="verb-inner verb-form-grid">

                    <div className="verb-form-left">
                        <h2 className="verb-section-title">Beschikbaarheid opvragen</h2>
                        <p>
                            Vul het formulier in en we nemen binnen 24 uur contact met je op.
                            We vertellen je alles over de beschikbaarheid, voorwaarden en prijs.
                        </p>
                        <div className="verb-form-img">
                            <img src={VillaVoorImg} alt="Voorgevel van Villa Vredestein in Driebergen-Rijsenburg" loading="lazy" />
                        </div>
                        <div className="verb-garanties">
                            {["Persoonlijk antwoord binnen 24u", "Geen verborgen kosten", "Flexibele annulering bespreekbaar"].map((g) => (
                                <div key={g} className="garantie-item">
                                    <span aria-hidden="true">✓</span>
                                    <span>{g}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="verb-form-right">
                        {sent ? (
                            <div className="verb-success">
                                <div className="verb-success-icon">✓</div>
                                <h3>Aanvraag ontvangen!</h3>
                                <p>We nemen zo snel mogelijk contact met je op via het opgegeven e-mailadres.</p>
                                <button className="verb-btn-secondary" onClick={() => navigate("/contact")}>
                                    Nog een vraag stellen
                                </button>
                            </div>
                        ) : (
                            <form
                                className="verb-form"
                                onSubmit={handleSubmit}
                                name="verblijven"
                                data-netlify="true"
                                netlify-honeypot="bot-field"
                            >
                                <input type="hidden" name="form-name" value="verblijven" />
                                <input type="hidden" name="bot-field" style={{ display: "none" }} />

                                <div className="form-field-select">
                                    <label htmlFor="optie">Type verblijf</label>
                                    <select
                                        id="optie"
                                        name="optie"
                                        value={form.optie}
                                        onChange={(e) => { handleChange(e); handleOptieSelect(e.target.value); }}
                                        required
                                    >
                                        {OPTIES.map((o) => (
                                            <option key={o.id} value={o.id}>{o.icon} {o.titel}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-row">
                                    <div className="form-field">
                                        <label htmlFor="aankomst">Aankomst</label>
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
                                        <label htmlFor="vertrek">Vertrek</label>
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
                                        <label htmlFor="naam">Naam *</label>
                                        <input
                                            type="text"
                                            id="naam"
                                            name="naam"
                                            value={form.naam}
                                            onChange={handleChange}
                                            placeholder="Jouw naam"
                                            required
                                            autoComplete="name"
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label htmlFor="gasten">Aantal gasten</label>
                                        <select id="gasten" name="gasten" value={form.gasten} onChange={handleChange}>
                                            {[1,2,3,4,5,6,7,8].map((n) => (
                                                <option key={n} value={n}>{n} {n === 1 ? "gast" : "gasten"}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="email">E-mailadres *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="jouw@email.nl"
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="telefoon">Telefoon <span>(optioneel)</span></label>
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
                                    <label htmlFor="bericht">Toelichting <span>(optioneel)</span></label>
                                    <textarea
                                        id="bericht"
                                        name="bericht"
                                        value={form.bericht}
                                        onChange={handleChange}
                                        placeholder="Vertel ons iets over jouw verblijf, wensen of vragen..."
                                        rows={4}
                                    />
                                </div>

                                <button type="submit" className="verb-submit" disabled={sending}>
                                    {sending ? "Versturen..." : "Stuur aanvraag"}
                                </button>

                                <p className="form-privacy">
                                    Je gegevens worden alleen gebruikt om contact met je op te nemen.
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
