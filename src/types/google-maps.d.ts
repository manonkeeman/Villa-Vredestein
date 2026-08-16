export {};

declare global {
    interface Window {
        google?: {
            maps: {
                places: {
                    PlacesService: new (attrContainer: HTMLDivElement) => {
                        getDetails: (
                            request: { placeId: string; fields: string[] },
                            callback: (result: GooglePlaceResult | null, status: string) => void
                        ) => void;
                    };
                    PlacesServiceStatus: { OK: string };
                };
            };
        };
    }

    interface GooglePlaceReview {
        author_name: string;
        rating: number;
        text: string;
        relative_time_description: string;
        profile_photo_url?: string;
    }

    interface GooglePlaceResult {
        name?: string;
        rating?: number;
        user_ratings_total?: number;
        reviews?: GooglePlaceReview[];
        url?: string;
    }
}
