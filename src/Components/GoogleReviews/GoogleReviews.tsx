import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { fetchPlaceDetails } from "../../Helpers/googlePlaces";
import "./GoogleReviews.css";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
const PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID as string | undefined;

export default function GoogleReviews() {
    const [place, setPlace] = useState<GooglePlaceResult | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    useEffect(() => {
        if (!API_KEY || !PLACE_ID) return;
        fetchPlaceDetails(API_KEY, PLACE_ID)
            .then(setPlace)
            .catch(() => setPlace(null));
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

    const reviews = place?.reviews ?? [];

    const updateArrows = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanPrev(el.scrollLeft > 4);
        setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        updateArrows();
        window.addEventListener("resize", updateArrows);
        return () => window.removeEventListener("resize", updateArrows);
    }, [reviews.length, updateArrows]);

    // Schuift precies één kaart op (kaartbreedte + gap), scroll-snap lijnt uit.
    const slide = (dir: 1 | -1) => {
        const el = trackRef.current;
        const card = el?.querySelector<HTMLElement>(".gr-card");
        if (!el || !card) return;
        const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
        el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
    };

    const writeReviewUrl = "/review";

    return (
        <section className="gr-section" ref={sectionRef}>
            <div className="gr-inner">
                <div className="gr-header">
                    <h2 className="gr-title">Google reviews</h2>
                    {typeof place?.rating === "number" && (
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

                {reviews.length > 0 && (
                    <div className="gr-slider">
                        <button
                            type="button"
                            className="gr-arrow gr-arrow--prev"
                            onClick={() => slide(-1)}
                            disabled={!canPrev}
                            aria-label="Vorige review"
                        >
                            <FiChevronLeft />
                        </button>
                        <div className="gr-track" ref={trackRef} onScroll={updateArrows}>
                            {reviews.map((r, i) => (
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
                        <button
                            type="button"
                            className="gr-arrow gr-arrow--next"
                            onClick={() => slide(1)}
                            disabled={!canNext}
                            aria-label="Volgende review"
                        >
                            <FiChevronRight />
                        </button>
                    </div>
                )}

                <div className="gr-cta">
                    <a href={writeReviewUrl} target="_blank" rel="noreferrer" className="gr-cta-btn gr-cta-btn--primary">
                        Schrijf een review
                    </a>
                    {place?.url && (
                        <a href={place.url} target="_blank" rel="noreferrer" className="gr-cta-btn">
                            Bekijk alle reviews →
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
