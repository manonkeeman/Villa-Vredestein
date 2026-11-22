// Wordt door Netlify automatisch aangeroepen na elke goedgekeurde formulierinzending
// (Netlify filtert zelf al spam via Akismet). Hier sturen we de bevestigingsmail
// voor het bestelformulier van /boek en doen we extra spamcontroles.
//
// Instellen in Netlify (Site configuration → Environment variables):
//   GMAIL_USER          het Gmail-adres waarvan de bevestiging verstuurd wordt
//   GMAIL_APP_PASSWORD  een app-wachtwoord van dat Google-account (geen gewoon wachtwoord)
// Optioneel: MAIL_DRY_RUN=1 om alleen te loggen zonder te versturen.

import nodemailer from "nodemailer";

const FORM = "boek-bestelling";
const MIN_MS = 2500;            // sneller dan dit invullen doet geen mens
const MAX_MS = 1000 * 60 * 60 * 6; // formulier hoort niet uren open te staan
const EMAIL_RE = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[A-Za-z]{2,}$/;

const TEKST = {
    nl: {
        onderwerp: "We hebben je bestelaanvraag ontvangen · Hoofdstraat 147",
        hallo: (n) => `Hallo ${n},`,
        intro: "Bedankt voor je bestelaanvraag voor het boek Hoofdstraat 147. We hebben het goed ontvangen en nemen snel contact met je op.",
        kop: "Dit hebben we genoteerd:",
        aantal: "Aantal exemplaren", adres: "Adres", opm: "Opmerking",
        slot: "Klopt er iets niet? Antwoord dan gewoon op deze mail.",
        groet: "Hartelijke groet,",
    },
    en: {
        onderwerp: "We received your order request · Hoofdstraat 147",
        hallo: (n) => `Hello ${n},`,
        intro: "Thank you for your order request for the book Hoofdstraat 147. We have received it and will contact you soon.",
        kop: "This is what we noted:",
        aantal: "Number of copies", adres: "Address", opm: "Comment",
        slot: "Something not right? Just reply to this email.",
        groet: "Kind regards,",
    },
    de: {
        onderwerp: "Wir haben deine Bestellanfrage erhalten · Hoofdstraat 147",
        hallo: (n) => `Hallo ${n},`,
        intro: "Danke für deine Bestellanfrage für das Buch Hoofdstraat 147. Sie ist bei uns eingegangen, und wir melden uns bald bei dir.",
        kop: "Das haben wir notiert:",
        aantal: "Anzahl Exemplare", adres: "Adresse", opm: "Anmerkung",
        slot: "Stimmt etwas nicht? Antworte einfach auf diese E-Mail.",
        groet: "Herzliche Grüße,",
    },
    fr: {
        onderwerp: "Nous avons bien reçu votre demande de commande · Hoofdstraat 147",
        hallo: (n) => `Bonjour ${n},`,
        intro: "Merci pour votre demande de commande du livre Hoofdstraat 147. Nous l'avons bien reçue et vous contacterons bientôt.",
        kop: "Voici ce que nous avons noté :",
        aantal: "Nombre d'exemplaires", adres: "Adresse", opm: "Remarque",
        slot: "Quelque chose ne va pas ? Répondez simplement à cet e-mail.",
        groet: "Cordialement,",
    },
    es: {
        onderwerp: "Hemos recibido tu solicitud de pedido · Hoofdstraat 147",
        hallo: (n) => `Hola ${n},`,
        intro: "Gracias por tu solicitud de pedido del libro Hoofdstraat 147. La hemos recibido y nos pondremos en contacto contigo pronto.",
        kop: "Esto es lo que hemos anotado:",
        aantal: "Número de ejemplares", adres: "Dirección", opm: "Comentario",
        slot: "¿Algo no es correcto? Responde simplemente a este correo.",
        groet: "Un cordial saludo,",
    },
    it: {
        onderwerp: "Abbiamo ricevuto la tua richiesta d'ordine · Hoofdstraat 147",
        hallo: (n) => `Ciao ${n},`,
        intro: "Grazie per la tua richiesta d'ordine del libro Hoofdstraat 147. L'abbiamo ricevuta e ti contatteremo presto.",
        kop: "Ecco cosa abbiamo annotato:",
        aantal: "Numero di copie", adres: "Indirizzo", opm: "Nota",
        slot: "Qualcosa non va? Rispondi semplicemente a questa e-mail.",
        groet: "Cordiali saluti,",
    },
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const schoon = (v, max) => String(v ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max);

// Geeft null terug als alles klopt, anders de reden waarom de inzending niet vertrouwd wordt.
export function controleer(data, nu = Date.now()) {
    if (data["bot-field"]) return "honeypot ingevuld";
    const t = Number(data._t);
    if (!Number.isFinite(t) || t <= 0) return "tijdstempel ontbreekt";
    const verstreken = nu - t;
    if (verstreken < MIN_MS) return "te snel ingevuld";
    if (verstreken > MAX_MS) return "formulier te lang open";
    const naam = schoon(data.naam, 80);
    if (naam.length < 2) return "naam ontbreekt";
    if (!EMAIL_RE.test(schoon(data.email, 254))) return "ongeldig e-mailadres";
    const aantal = Number(data.aantal);
    if (!Number.isInteger(aantal) || aantal < 1 || aantal > 20) return "ongeldig aantal";
    const blob = [data.naam, data.adres, data.opmerking].join(" ");
    if (/https?:\/\/|www\./i.test(blob)) return "link in tekstveld";
    return null;
}

export function maakMail(data) {
    const taal = TEKST[data.taal] ? data.taal : "nl";
    const x = TEKST[taal];
    const naam = schoon(data.naam, 80);
    const rijen = [[x.aantal, String(Number(data.aantal))]];
    if (schoon(data.adres, 200)) rijen.push([x.adres, schoon(data.adres, 200)]);
    if (schoon(data.opmerking, 600)) rijen.push([x.opm, schoon(data.opmerking, 600)]);
    const tekst = [x.hallo(naam), "", x.intro, "", x.kop, ...rijen.map(([k, v]) => `- ${k}: ${v}`), "", x.slot, "", x.groet, "Villa Vredestein"].join("\n");
    const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#222;max-width:560px">
<p>${esc(x.hallo(naam))}</p><p>${esc(x.intro)}</p><p><strong>${esc(x.kop)}</strong></p>
<ul>${rijen.map(([k, v]) => `<li>${esc(k)}: ${esc(v)}</li>`).join("")}</ul>
<p>${esc(x.slot)}</p><p>${esc(x.groet)}<br>Villa Vredestein</p></div>`;
    return { onderwerp: x.onderwerp, tekst, html };
}

export async function handler(event) {
    let payload;
    try { payload = JSON.parse(event.body).payload; } catch { return { statusCode: 400, body: "ongeldige aanvraag" }; }
    if (!payload || payload.form_name !== FORM) return { statusCode: 200, body: "negeer: ander formulier" };

    const data = payload.data || {};
    const reden = controleer(data);
    if (reden) {
        console.log(`Bestelling niet bevestigd (${reden})`);
        return { statusCode: 200, body: "overgeslagen" };
    }

    const { onderwerp, tekst, html } = maakMail(data);
    const aan = schoon(data.email, 254);

    if (process.env.MAIL_DRY_RUN === "1") {
        console.log("DRY RUN, zou versturen naar", aan, "\n" + tekst);
        return { statusCode: 200, body: "dry-run" };
    }
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    if (!user || !pass) {
        console.error("GMAIL_USER of GMAIL_APP_PASSWORD ontbreekt; geen bevestiging verstuurd.");
        return { statusCode: 500, body: "mail niet ingesteld" };
    }
    try {
        const transport = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
        await transport.sendMail({
            from: `"Villa Vredestein" <${user}>`,
            to: aan,
            replyTo: user,
            subject: onderwerp,
            text: tekst,
            html,
        });
        return { statusCode: 200, body: "verstuurd" };
    } catch (err) {
        console.error("Mail versturen mislukt:", err && err.message);
        return { statusCode: 500, body: "versturen mislukt" };
    }
}
