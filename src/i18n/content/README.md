# Vaste paginatekst vertalen

De tekst in de pagina's staat in de code in het Nederlands. Een component
haalt de vertaling op met `tc("Nederlandse tekst")` (hook `useContent` in
`src/i18n/content.ts`). Staat de tekst niet in het taalbestand, dan blijft de
Nederlandse tekst staan.

- `en.json`, `de.json`, `fr.json`, `es.json`, `it.json`: `"Nederlandse tekst": "vertaling"`.
- De sleutel moet exact de Nederlandse tekst uit de code zijn.
- Namen, adressen en cijfers hoeven er niet in.
- Een taalbestand laadt pas als die taal gekozen is.
- `Privacy.tsx` blijft bewust Nederlands (juridisch leidend).

Nieuwe tekst toevoegen: schrijf `tc("...")` in de code, voeg de vertalingen
toe aan de vijf bestanden, en controleer de taal in de browser.
