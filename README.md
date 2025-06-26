🇳🇱 DUTCH TRANSLATION
_(English version below)_

⸻

🏡 Villa Vredestein – React Applicatie

Welkom bij de webapplicatie voor Studentenhuis Villa Vredestein.
Deze app is ontwikkeld om studenten op een toegankelijke manier te helpen met het plannen van gezonde, betaalbare en lekkere maaltijden.
Beheerders (admins) krijgen toegang tot een extra dashboardgedeelte voor toekomstig gebruikersbeheer.

📋 Functies
• Inloggen voor studenten en beheerders (admin)
• Recepten zoeken op basis van dieet, keuken en ingrediënten
• Boodschappenlijstjes genereren
• Delen via WhatsApp of mobiel
• Visueel overzichtelijk dashboard met subpagina’s
• Admin-knop bij login met beheerdersaccount (niet-functioneel, wel voorbereid)

⸻

⚙️ Voorwaarden voor installatie

Zorg dat je deze tools op je systeem hebt:

- Node.js (v16 of hoger)
- Git
- WebStorm, VSCode of een andere editor

⸻

🚀 Installatie

### 1. Clone het project

```bash
git clone https://github.com/manonkeeman/villa-vredestein.git
cd villa-vredestein
```

### 2. Dependencies installeren

```bash
npm install
```

### 3. .env bestand toevoegen
   Maak in de root van het project een `.env` bestand aan met de volgende inhoud:

```env
VITE_APP_ID=6497d4b5
VITE_APP_KEY=e91c571eeff4f52de58c80b420451144
VITE_USER_ID=manonkeeman

VITE_API_BASE_URL=https://api.datavortex.nl
VITE_API_KEY=villavredesteinlogin:2NkpAp3ZiXKfSlM4fwxW
```

### 4. Development server starten

```bash
npm run dev
```

De app draait dan op: [http://localhost:5173](http://localhost:5173)

⸻

🌐 Routes in de app

| Route                 | Functie                                                                                 |
| --------------------- |-----------------------------------------------------------------------------------------|
| `/login`              | Inlogpagina voor studenten en admins                                                    |
| `/studentendashboard` | Dashboard met recepten en filters                                                       |
| `/recepten`           | Receptenoverzicht                                                                       |
| `/receptenzoeker`     | Receptenzoeker met Edamam API                                                           |

⸻

🔑 Admin Login

Log in als admin via:
```bash
E-mailadres: admin@villavredestein.com
Wachtwoord: veiligheidbovenalles
```
Na inloggen verschijnt er een extra knop Admin op het dashboard.
Deze is nog niet functioneel, maar al wel voorbereid op toekomstige features.
⸻

🌍 Live versie

Je kunt de app live bekijken via:
🔗 [https://villavredestein.com](https://villavredestein.com)

⸻

🎯 Doel van de applicatie

Deze app is gebouwd voor de bewoners van Villa Vredestein met als doel:
• Inspiratie bieden voor maaltijden
• Gezondere keuzes makkelijker maken
• Structuur en verbondenheid in huis vergroten
• Beheer mogelijk maken via een aparte admin-omgeving

Dankzij de Edamam API, JWT-authenticatie en een gebruiksvriendelijke interface.

⸻

Dank aan de Edamam API, JWT authentication, and a user-friendly interface.

Built with ❤️ by Manon Keeman
⸻
