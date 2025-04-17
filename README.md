**\*** Installatie handleiding – Villa Vredestein - React Applicatie **\***

VOORVEREISTEN

Zorg dat de volgende software op je computer is geïnstalleerd:

 • Node.js (v16 of hoger): https://nodejs.org/en/download
 • Git: https://desktop.github.com/download/
 • Code editor Webstorm: https://www.jetbrains.com/webstorm/download


Stap 1: Project clonen

Open een terminal of Git Bash en voer het volgende commando uit:

git clone https://github.com/manonkeeman/villa-vredestein.git

Ga daarna naar de map van het project:

cd villa-vredestein



Stap 2: Dependencies installeren

Installeer de benodigde pakketten:

npm install


Stap 3: API-keys toevoegen 

voeg het .ENV bestand toe in de root van het project met daarin:

VITE_APP_ID=6497d4b5
VITE_APP_KEY=e91c571eeff4f52de58c80b420451144
VITE_USER_ID=manonkeeman

VITE_USER1_EMAIL=student@villavredestein.com
VITE_USER1_PASSWORD=welkomenvoeljethuis
VITE_ADMIN_EMAIL=manon@villavredestein.com
VITE_ADMIN_PASSWORD=veiligheidbovenalles


Stap 4: Start de applicatie

Start de development server:

npm run dev

De applicatie draait nu op:

http://localhost:5173


Optioneel: productie

De productieversie staat online alleen zonder de inlog-mogelijkheid: 

https://villavredestein.com/
