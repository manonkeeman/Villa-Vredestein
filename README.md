# Villa Vredestein — website

Marketing- en informatiesite voor Villa Vredestein, een historische villa uit 1906 in Driebergen-Rijsenburg. Statische React-site: geen login, geen dashboard, geen backend. De studentenverhuur-app die hier ooit aan gekoppeld was, is verwijderd en wordt losstaand verder ontwikkeld.

🔗 Live: [https://villavredestein.nl](https://villavredestein.nl)

## Stack

- React + TypeScript, gebouwd met Vite
- react-router-dom voor client-side routing
- react-i18next voor de taalkiezer (NL, EN, FR, DE, ES, IT)
- react-helmet-async voor per-pagina SEO-tags
- Netlify Forms voor het contact- en verblijfsformulier (geen eigen backend)
- Google Analytics (GA4), laadt pas na toestemming via de cookiemelding
- Deploy via Netlify, gebouwd vanaf de `main`-branch

De site draait zonder environment variables. Optioneel: de Google reviews-sectie op
`/verblijven` heeft `VITE_GOOGLE_MAPS_API_KEY` en `VITE_GOOGLE_PLACE_ID` nodig — zie
`.env.example` voor hoe je daaraan komt. Zonder die twee blijft de sectie gewoon verborgen.

## Installatie

```bash
git clone git@github.com:manonkeeman/Villa-Vredestein.git
cd villavredestein-FRONTEND
npm install
```

## Development

```bash
npm run dev
```

Draait op [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Output komt in `dist/`. `npm run preview` serveert die build lokaal.

## Pagina's

| Route | Inhoud |
| --- | --- |
| `/` | Home |
| `/verhaal` (alias `/over-ons`) | Over ons |
| `/about` | Verhalen-overzicht (blogposts) |
| `/blog/:slug` | Individuele blogpost |
| `/tijdlijn` | Geschiedenis van het pand, 1906–nu |
| `/galerij` | Villa Galerij (leven, ansichtkaarten, restauratie) |
| `/galerij-villa` | Alias van `/galerij` |
| `/omgeving` | Omgeving & locatie |
| `/verblijven` | Verblijven & boeken |
| `/ruimtes` | De ruimtes (plattegronden) |
| `/in-de-pers` | Perspagina |
| `/contact` | Contactformulier |
| `/privacy` | Privacybeleid |

Built with ❤️ by Manon Keeman
