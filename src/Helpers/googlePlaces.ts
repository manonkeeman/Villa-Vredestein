interface RawGoogleReview {
    rating?: number;
    text?: { text: string };
    relativePublishTimeDescription?: string;
    authorAttribution?: { displayName?: string; photoUri?: string };
}

interface RawGooglePlace {
    displayName?: { text: string };
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    reviews?: RawGoogleReview[];
}

export async function fetchPlaceDetails(apiKey: string, placeId: string): Promise<GooglePlaceResult> {
    const res = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=displayName,rating,userRatingCount,googleMapsUri,reviews`,
        { headers: { "X-Goog-Api-Key": apiKey } }
    );

    if (!res.ok) {
        throw new Error(`Places API-fout: ${res.status}`);
    }

    const data: RawGooglePlace = await res.json();

    const reviews: GooglePlaceReview[] = (data.reviews ?? [])
        .filter((r): r is RawGoogleReview & { text: { text: string } } => Boolean(r.text?.text))
        .map((r) => ({
            author_name: r.authorAttribution?.displayName ?? "Google-gebruiker",
            rating: Math.round(r.rating ?? 5),
            text: r.text.text,
            relative_time_description: r.relativePublishTimeDescription ?? "",
            profile_photo_url: r.authorAttribution?.photoUri,
        }));

    return {
        name: data.displayName?.text,
        rating: data.rating,
        user_ratings_total: data.userRatingCount,
        url: data.googleMapsUri,
        reviews,
    };
}
