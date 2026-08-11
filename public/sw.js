// De PWA-laag (installeerbare app, offline caching) is verwijderd.
// Deze service worker vervangt de oude en ruimt zichzelf en alle
// oude caches op, zodat bezoekers met een nog actieve service worker
// niet vast blijven zitten op een verouderde, gecachete versie van de site.
self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(keys.map((key) => caches.delete(key)));
            await self.registration.unregister();

            const clients = await self.clients.matchAll({ type: "window" });
            clients.forEach((client) => client.navigate(client.url));
        })()
    );
});
