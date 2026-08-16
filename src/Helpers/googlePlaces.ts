const SCRIPT_ID = "google-maps-script";

function loadGoogleMapsScript(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (window.google?.maps?.places) {
            resolve();
            return;
        }

        const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
        if (existing) {
            existing.addEventListener("load", () => resolve());
            existing.addEventListener("error", () => reject(new Error("Kon Google Maps script niet laden")));
            return;
        }

        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Kon Google Maps script niet laden"));
        document.head.appendChild(script);
    });
}

export async function fetchPlaceDetails(apiKey: string, placeId: string): Promise<GooglePlaceResult> {
    await loadGoogleMapsScript(apiKey);

    return new Promise((resolve, reject) => {
        if (!window.google) {
            reject(new Error("Google Maps niet beschikbaar"));
            return;
        }

        const container = document.createElement("div");
        container.style.display = "none";
        document.body.appendChild(container);

        const service = new window.google.maps.places.PlacesService(container);
        service.getDetails(
            { placeId, fields: ["name", "rating", "user_ratings_total", "reviews", "url"] },
            (place, status) => {
                document.body.removeChild(container);
                if (status === window.google!.maps.places.PlacesServiceStatus.OK && place) {
                    resolve(place);
                } else {
                    reject(new Error(`Places API-fout: ${status}`));
                }
            }
        );
    });
}
