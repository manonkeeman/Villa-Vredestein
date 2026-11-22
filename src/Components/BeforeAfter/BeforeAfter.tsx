import { useState } from "react";
import "./BeforeAfter.css";

type Props = {
    before: string;
    after: string;
    beforeLabel: string;
    afterLabel: string;
    alt: string;
    hint: string;
    caption?: string;
};

// Voor-en-na-slider: schuif over de foto om te zien hoe de ruimte veranderde.
// Werkt met muis, aanraking en toetsenbord (pijltjes) via een gewone range-input.
export default function BeforeAfter({ before, after, beforeLabel, afterLabel, alt, hint, caption }: Props) {
    const [pos, setPos] = useState(50);
    return (
        <figure className="ba" data-no-reveal style={{ "--pos": `${pos}%` } as React.CSSProperties}>
            <div className="ba-stage">
                <img className="ba-img" src={after} alt={alt} loading="lazy" decoding="async" />
                <img className="ba-img ba-img--before" src={before} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                <span className="ba-tag ba-tag--before" aria-hidden="true">{beforeLabel}</span>
                <span className="ba-tag ba-tag--after" aria-hidden="true">{afterLabel}</span>
                <input
                    className="ba-range"
                    type="range"
                    min={0}
                    max={100}
                    value={pos}
                    onChange={(e) => setPos(Number(e.target.value))}
                    aria-label={hint}
                />
                <div className="ba-handle" aria-hidden="true"><i>⇄</i></div>
            </div>
            {caption && <figcaption className="ba-caption">{caption}</figcaption>}
            <p className="ba-hint">{hint}</p>
        </figure>
    );
}
