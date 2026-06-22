import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "./Privacy.css";

const Privacy = () => (
    <main className="privacy-page">
        <Helmet>
            <title>Privacybeleid — Villa Vredestein</title>
            <meta name="description" content="Privacybeleid van Villa Vredestein. Hoe wij omgaan met persoonsgegevens die via het contactformulier of verblijfsaanvraag worden verstrekt." />
            <link rel="canonical" href="https://villavredestein.nl/privacy" />
            <meta name="robots" content="noindex, follow" />
        </Helmet>

        <header className="priv-hero">
            <div className="priv-hero-inner">
                <span className="priv-eyebrow">Juridisch</span>
                <h1>Privacybeleid</h1>
                <p>Laatst bijgewerkt: juni 2026</p>
            </div>
        </header>

        <div className="priv-body">
            <section className="priv-section">
                <h2>1. Wie zijn wij</h2>
                <p>Villa Vredestein is een particuliere woning en kleinschalig verblijfsadres, gevestigd op Hoofdstraat 147, 3975 ED Driebergen-Rijsenburg. Verantwoordelijk voor de verwerking van persoonsgegevens zijn Manon Keeman en Maxim Staal (hierna: "wij" of "Villa Vredestein"). Vragen over dit beleid kunnen worden gestuurd naar <a href="mailto:info@villavredestein.nl">info@villavredestein.nl</a>.</p>
            </section>

            <section className="priv-section">
                <h2>2. Welke gegevens verzamelen wij</h2>
                <p>Wij verzamelen uitsluitend gegevens die u zelf actief aan ons verstrekt via:</p>
                <ul>
                    <li><strong>Contactformulier:</strong> naam, e-mailadres en uw bericht.</li>
                    <li><strong>Verblijfsaanvraag:</strong> naam, e-mailadres, telefoonnummer (optioneel), gewenste verblijfsperiode en type verblijf.</li>
                </ul>
                <p>Wij verzamelen geen gevoelige persoonsgegevens (zoals gezondheidsgegevens, BSN of financiële gegevens).</p>
            </section>

            <section className="priv-section">
                <h2>3. Waarvoor gebruiken wij uw gegevens</h2>
                <p>Uw gegevens worden uitsluitend gebruikt om:</p>
                <ul>
                    <li>Uw vraag of aanvraag te beantwoorden.</li>
                    <li>Een verblijfsovereenkomst voor te bereiden indien u een aanvraag indient.</li>
                </ul>
                <p>Wij sturen geen nieuwsbrieven en doen niet aan direct marketing.</p>
            </section>

            <section className="priv-section">
                <h2>4. Grondslag voor verwerking</h2>
                <p>De verwerking is gebaseerd op uw toestemming, gegeven op het moment dat u het formulier invult en verstuurt (artikel 6 lid 1 sub a AVG), en op de voorbereiding van een overeenkomst indien het een verblijfsaanvraag betreft (artikel 6 lid 1 sub b AVG).</p>
            </section>

            <section className="priv-section">
                <h2>5. Bewaartermijn</h2>
                <p>Formulierinzendingen worden maximaal 12 maanden bewaard, tenzij er een lopende verblijfsovereenkomst is op basis waarvan een langere bewaartermijn wettelijk vereist is. Daarna worden uw gegevens permanent verwijderd.</p>
            </section>

            <section className="priv-section">
                <h2>6. Delen met derden</h2>
                <p>Uw gegevens worden niet verkocht of gedeeld met derde partijen voor commerciële doeleinden. Formulieren worden technisch verwerkt via Netlify Forms (Netlify Inc., San Francisco, VS). Netlify is gecertificeerd en voldoet aan de AVG. De gegevens worden niet door Netlify gebruikt voor andere doeleinden. Meer informatie: <a href="https://www.netlify.com/privacy/" target="_blank" rel="noreferrer">netlify.com/privacy</a>.</p>
            </section>

            <section className="priv-section">
                <h2>7. Cookies</h2>
                <p>Villa Vredestein maakt geen gebruik van tracking- of analytische cookies. Er worden alleen technisch noodzakelijke cookies geplaatst die de website laten functioneren (sessie en PWA-cache). Er worden geen advertentiecookies of cookies van derden geplaatst.</p>
            </section>

            <section className="priv-section">
                <h2>8. Uw rechten</h2>
                <p>U heeft het recht om:</p>
                <ul>
                    <li>Inzage te vragen in de gegevens die wij van u bewaren.</li>
                    <li>Uw gegevens te laten corrigeren of verwijderen.</li>
                    <li>Bezwaar te maken tegen de verwerking.</li>
                    <li>Uw toestemming in te trekken.</li>
                </ul>
                <p>Stuur uw verzoek naar <a href="mailto:info@villavredestein.nl">info@villavredestein.nl</a>. Wij reageren binnen 30 dagen.</p>
                <p>U heeft ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens: <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noreferrer">autoriteitpersoonsgegevens.nl</a>.</p>
            </section>

            <section className="priv-section">
                <h2>9. Beveiliging</h2>
                <p>De website maakt gebruik van HTTPS (TLS) voor versleutelde gegevensoverdracht. Formuliergegevens worden uitsluitend intern gedeeld via beveiligde kanalen.</p>
            </section>

            <section className="priv-section">
                <h2>10. Wijzigingen</h2>
                <p>Wij kunnen dit privacybeleid aanpassen. De datum bovenaan dit document geeft aan wanneer het voor het laatst is bijgewerkt. Raadpleeg deze pagina bij twijfel.</p>
            </section>

            <div className="priv-back">
                <Link to="/">← Terug naar Villa Vredestein</Link>
            </div>
        </div>
    </main>
);

export default Privacy;
