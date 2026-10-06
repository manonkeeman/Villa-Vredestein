import { useTranslation } from "react-i18next";
import i18n from "./index";

// Vaste paginatekst staat in de code in het Nederlands. tc("Nederlandse tekst")
// geeft de vertaling uit src/i18n/content/<taal>.json, en valt terug op de
// Nederlandse tekst zelf als er (nog) geen vertaling is.
export type Tc = <T>(text: T) => T;

const OPTIES = { ns: "content", keySeparator: false, nsSeparator: false } as const;

export function useContent(): Tc {
    // abonneert dit component op taalwissels en op het laden van vertalingen
    useTranslation("content");
    return ((text: unknown) => {
        if (typeof text !== "string" || !text) return text;
        const taal = (i18n.language || "nl").split("-")[0];
        if (taal === "nl") return text;
        return i18n.t(text, { ...OPTIES, defaultValue: text });
    }) as Tc;
}
