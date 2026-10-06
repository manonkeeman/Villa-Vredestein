import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import nl from "./locales/nl.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import it from "./locales/it.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            nl: { translation: nl },
            en: { translation: en },
            fr: { translation: fr },
            de: { translation: de },
            es: { translation: es },
            it: { translation: it },
        },
        fallbackLng: "nl",
        supportedLngs: ["nl", "en", "fr", "de", "es", "it"],
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
        },
        interpolation: {
            escapeValue: false,
        },
        ns: ["translation", "content"],
        react: {
            useSuspense: false,
            bindI18nStore: "added",
        },
    });

// Vaste paginatekst (namespace "content") laadt per taal pas als die taal
// gekozen is, zodat de hoofdbundel klein blijft.
async function laadContent(taal?: string) {
    const code = (taal || "nl").split("-")[0];
    if (code === "nl" || i18n.hasResourceBundle(code, "content")) return;
    try {
        const module = await import(`./content/${code}.json`);
        i18n.addResourceBundle(code, "content", module.default, true, true);
    } catch {
        // geen vertaalbestand: de Nederlandse tekst blijft staan
    }
}

i18n.on("languageChanged", laadContent);
laadContent(i18n.language);

export default i18n;