import React, { useEffect, useRef } from "react";
import "./About.css";
import VillaVredestein from "../Assets/Images/VillaVredestein.jpeg";
import InkijkjeInVredestein from "../Assets/Images/InkijkjeinVredestein.jpeg";

const bewoners = [
    {
        naam: "Manon",
        kamer: "De Studio",
        emoji: "🎨",
        bio: "Bouwt websites, houdt van koffie om middernacht en bedenkt plannen voor de verbouw die iedereen enthousiast maken.",
    },
    {
        naam: "Maxim",
        kamer: "De Werkplaats",
        emoji: "🔧",
        bio: "Weet hoe je een spijker slaat en een IKEA-kast in de helft van de tijd opbouwt. Onmisbaar.",
    },
    {
        naam: "Arwen",
        kamer: "Italië",
        emoji: "🧒",
        bio: "Heeft de mooiste kamer van de villa — en dat weet ze. Italië is haar wereld en ze laat je daar graag in.",
    },
    {
        naam: "Desmond",
        kamer: "Thailand",
        emoji: "🧒",
        bio: "Ontdekt elke dag iets nieuws in de villa. Weet al precies welke plekken het leukst zijn om te verstoppertje te spelen.",
    },
    {
        naam: "Medoc",
        kamer: "Frankrijk",
        emoji: "🧒",
        bio: "Energiek, creatief en altijd ergens mee bezig. De villa is zijn speelparadijs.",
    },
    {
        naam: "Q",
        kamer: "Overal",
        emoji: "🐱",
        bio: "De echte baas van de villa. Kiest zelf waar hij slaapt, wanneer hij eet en wie aandacht verdient. Hint: jij niet.",
    },
];

const About = () => {
    const cardsRef = useRef([]);
    const heroRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.15 }
        );

        cardsRef.current.forEach((el) => el && observer.observe(el));
        if (heroRef.current) observer.observe(heroRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="about-page">
            <div className="about-hero" ref={heroRef}>
                <div className="about-hero-text fade-in-up">
                    <h1>De Vredesteiners</h1>
                    <p>
                        Een gezin, een kat en één villa uit 1906. We wonen hier niet zomaar — we maken er
                        samen iets van. Van drukke ochtenden tot avonden met z'n allen aan tafel,
                        van kinderen die de tuin overnemen tot plannen die groter worden dan de kamers zelf.
                    </p>
                </div>
                <div className="about-hero-img fade-in-right">
                    <img src={VillaVredestein} alt="Villa Vredestein van buiten" />
                </div>
            </div>

            <div className="about-bewoners">
                <h2 className="bewoners-titel fade-in-up-trigger" ref={(el) => (cardsRef.current[0] = el)}>
                    Wie wonen hier?
                </h2>
                <div className="bewoners-grid">
                    {bewoners.map((b, i) => (
                        <div
                            key={b.naam}
                            className="bewoner-card fade-in-up-trigger"
                            ref={(el) => (cardsRef.current[i + 1] = el)}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className="bewoner-avatar">{b.emoji}</div>
                            <h3 className="bewoner-naam">{b.naam}</h3>
                            <span className="bewoner-kamer">{b.kamer}</span>
                            <p className="bewoner-bio">{b.bio}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="about-sfeer">
                <div
                    className="sfeer-img fade-in-up-trigger"
                    ref={(el) => (cardsRef.current[5] = el)}
                >
                    <img src={InkijkjeInVredestein} alt="Inkijkje in Villa Vredestein" />
                    <div className="sfeer-overlay">
                        <p>"Een huis vol verhalen, nog lang niet uitverteld."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
