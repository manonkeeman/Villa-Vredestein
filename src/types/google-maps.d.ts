export {};

declare global {
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
