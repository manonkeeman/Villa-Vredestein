** Installatiehandleiding – Villa Vredestein React Applicatie **

Welkom bij de webapplicatie voor Studentenhuis Villa Vredestein. 
Deze app is speciaal ontwikkeld om studenten op een toegankelijke 
manier te helpen met het plannen van gezonde, betaalbare en 
lekkere maaltijden.

De applicatie biedt functies zoals:
•	Inloggen voor studenten
•	recepten zoeken op basis van dieet, keuken en ingrediënten
•	Boodschappenlijstjes genereren
•	Delen via WhatsApp of mobiele deelmenu’s

⸻

VOORWAARDEN VOOR INSTALLATIE

Zorg dat je de volgende tools geïnstalleerd hebt op je computer:
•	Node.js (v16 of hoger) https://nodejs.org/en/download
•	Git (versiebeheer) https://desktop.github.com/download/
•	WebStorm (of een andere code-editor) https://www.jetbrains.com/webstorm/download/#section=mac

INSTALLATIESTAPPEN

1. Project clonen

Open een terminal of Git Bash en voer uit:
git clone https://github.com/manonkeeman/villa-vredestein.git

Ga naar de projectmap:
cd villa-vredestein 

2. DEPENDENCIES INSTALLEREN

Installeer de benodigde packages:
npm install

3. .env BESTAND TOEVOEGEN
   
Maak in de root van het project een .env bestand aan en 
voeg onderstaande inhoud toe:

VITE_APP_ID=6497d4b5
VITE_APP_KEY=e91c571eeff4f52de58c80b420451144
VITE_USER_ID=manonkeeman

VITE_USER1_EMAIL=student@villavredestein.com
VITE_USER1_PASSWORD=welkomenvoeljethuis
VITE_ADMIN_EMAIL=manon@villavredestein.com
VITE_ADMIN_PASSWORD=veiligheidbovenalles

4. DEVELOPMENT SERVER STARTEN

Start de app lokaal:
npm run dev

De applicatie draait vervolgens op:
http://localhost:5173

PAGINA'S IN DE APP

Na het opstarten kun je de volgende routes gebruiken:
ROUTE                FUNCTIE
/login               Inlogpagina voor studenten
/studentendashboard  Dashboard met toegang tot recepten & filters
/recepten            Receptenoverzicht met filters
/receptenzoeker      Edamam API receptenzoeker

ONLINE VERSIE

De app is ook live te bekijken via (behalve het login gedeelte):
https://villavredestein.com

DOEL VAN DEZE APPLICATIE

De receptenapp is speciaal gebouwd voor studenten van Villa Vredestein. 
Het doel is om:
•   Inspiratie te bieden voor dagelijkse maaltijden
•   Gezondere keuzes makkelijker te maken
•	Samen koken en delen te stimuleren

Dankzij interactieve functies, filters en een visueel dashboard 
is dit meer dan een simpele receptenzoeker — 
het is een hulpmiddel voor verbinding, structuur en gemak 
in het studentenhuis.