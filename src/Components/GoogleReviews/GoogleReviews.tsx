import { useEffect, useRef, useState } from "react";
import { fetchPlaceDetails } from "../../Helpers/googlePlaces";
import "./GoogleReviews.css";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
const PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID as string | undefined;

export default function GoogleReviews() {
    const [place, setPlace] = useState<GooglePlaceResult | null>(null);
    const [failed, setFailed] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!API_KEY || !PLACE_ID) return;
        fetchPlaceDetails(API_KEY, PLACE_ID)
            .then(setPlace)
            .catch(() => setFailed(true));
    }, []);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("gr-in-view")),
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [place]);

    // Niet geconfigureerd, geen resultaat, of iets misgegaan: sectie blijft onzichtbaar
    if (!API_KEY || !PLACE_ID || failed) return null;
    const reviews = place?.reviews ?? [];
    if (!place || reviews.length === 0) return null;

    const writeReviewUrl = `https://search.google.com/local/writereview?placeid=${PLACE_ID}`;

    return (
        <section className="gr-section" ref={sectionRef}>
            <div className="gr-inner">
                <div className="gr-header">
                    <h2 className="gr-title">Google reviews</h2>
                    {typeof place.rating === "number" && (
                        <div className="gr-aggregate">
                            <span className="gr-stars" aria-hidden="true">
                                {"★".repeat(Math.round(place.rating))}
                            </span>
                            <span className="gr-score">{place.rating.toFixed(1)}</span>
                            {typeof place.user_ratings_total === "number" && (
                                <span className="gr-count">
                                    ({place.user_ratings_total} review{place.user_ratings_total === 1 ? "" : "s"})
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="gr-grid">
                    {reviews.slice(0, 5).map((r, i) => (
                        <article key={`${r.author_name}-${i}`} className="gr-card">
                            <div className="gr-card-sterren" aria-hidden="true">
                                {"★".repeat(r.rating)}
                            </div>
                            <p className="gr-card-tekst">&quot;{r.text}&quot;</p>
                            <div className="gr-card-auteur">
                                {r.profile_photo_url ? (
                                    <img
                                        src={r.profile_photo_url}
                                        alt=""
                                        className="gr-avatar gr-avatar--photo"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="gr-avatar">{r.author_name.charAt(0)}</div>
                                )}
                                <div>
                                    <strong>{r.author_name}</strong>
                                    <span>{r.relative_time_description}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="gr-cta">
                    <a href={writeReviewUrl} target="_blank" rel="noreferrer" className="gr-cta-btn gr-cta-btn--primary">
                        Schrijf een review
                    </a>
                    {place.url && (
                        <a href={place.url} target="_blank" rel="noreferrer" className="gr-cta-btn">
                            Bekijk alle reviews →
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
