import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContent } from "../../i18n/content";
import chaptersData from "../../Data/boekTekst.json";
import "./BoekLezen.css";

// De boektekst (Nederlands) staat in src/Data/boekTekst.json; de pagina zelf is vertaald.
type Block =
    | { t: "p" | "bronnen"; text: string }
    | { t: "h2" | "h3"; text: string }
    | { t: "bron"; text: string; url?: string }
    | { t: "event"; jaar: string; text: string; bron?: string }
    | { t: "fact"; getal: string; label: string; sub?: string }
    | { t: "img"; src: string; w: number; h: number; alt: string; cap: string; soort?: string; jaar?: string };
type Chapter = { id: string; kicker: string; titel: string; groep: string; blocks: Block[] };
const CHAPTERS = chaptersData as Chapter[];
const GROEPEN = ["Vooraf", "De geschiedenis", "Naslag"];

function renderBlocks(blocks: Block[]) {
    const out: React.ReactNode[] = [];
    let facts: Extract<Block, { t: "fact" }>[] = [];
    let events: Extract<Block, { t: "event" }>[] = [];
    const flush = (key: string) => {
        if (facts.length) {
            out.push(
                <div className="bl-facts" key={`f-${key}`}>
                    {facts.map((f, i) => (
                        <p key={i}><span className="bl-fact-n" dangerouslySetInnerHTML={{ __html: f.getal }} /><strong>{f.label}</strong>{f.sub && <small>{f.sub}</small>}</p>
                    ))}
                </div>
            );
            facts = [];
        }
        if (events.length) {
            out.push(
                <ol className="bl-events" key={`e-${key}`}>
                    {events.map((e, i) => (
                        <li key={i}>
                            <span className="bl-ev-jaar">{e.jaar}</span>
                            <span className="bl-ev-tekst"><span dangerouslySetInnerHTML={{ __html: e.text }} />{e.bron && <small>{e.bron}</small>}</span>
                        </li>
                    ))}
                </ol>
            );
            events = [];
        }
    };
    blocks.forEach((b, i) => {
        if (b.t !== "fact" && b.t !== "event") flush(String(i));
        switch (b.t) {
            case "fact": facts.push(b); break;
            case "event": events.push(b); break;
            case "p": out.push(<p key={i} dangerouslySetInnerHTML={{ __html: b.text }} />); break;
            case "h2": out.push(<h3 className="bl-h2" key={i}>{b.text}</h3>); break;
            case "h3": out.push(<h4 className="bl-h3" key={i}>{b.text}</h4>); break;
            case "bronnen": out.push(<p className="bl-bronnen" key={i} dangerouslySetInnerHTML={{ __html: b.text }} />); break;
            case "bron":
                out.push(
                    <p className="bl-bron" key={i}>
                        <span dangerouslySetInnerHTML={{ __html: b.text }} />
                        {b.url && /^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(b.url) && (
                            <> <a href={`https://${b.url}`} target="_blank" rel="noreferrer noopener">↗</a></>
                        )}
                    </p>
                );
                break;
            case "img":
                out.push(
                    <figure className="bl-fig" key={i}>
                        {b.jaar && <span className="bl-fig-jaar">{b.jaar}</span>}
                        <img src={b.src} alt={b.alt} width={b.w} height={b.h} loading="lazy" decoding="async" />
                        {(b.cap || b.soort) && <figcaption>{b.soort && <b>{b.soort}</b>}{b.cap}</figcaption>}
                    </figure>
                );
                break;
        }
    });
    flush("end");
    return out;
}

const BoekLezen = () => {
    const tc = useContent();
    const { i18n } = useTranslation();
    const langCode = i18n.language?.split("-")[0] || "nl";
    const titel = tc("Lees het boek Hoofdstraat 147 | Villa Vredestein");
    const omschrijving = tc("Lees het hele boek Hoofdstraat 147 online: negen hoofdstukken over Villa Vredestein, met tijdlijn, kaarten en bronnen.");

    return (
        <main className="bl">
            <Helmet>
                <html lang={langCode} />
                <title>{titel}</title>
                <meta name="description" content={omschrijving} />
                <link rel="canonical" href="https://villavredestein.com/boek/lezen" />
                <meta property="og:type" content="book" />
                <meta property="og:url" content="https://villavredestein.com/boek/lezen" />
                <meta property="og:title" content={titel} />
                <meta property="og:description" content={omschrijving} />
                <meta property="og:image" content="https://villavredestein.com/og-image.jpg" />
                <meta property="og:site_name" content="Villa Vredestein" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <header className="bl-head">
                <Link to="/boek" className="bl-back">← {tc("Terug naar het boek")}</Link>
                <p className="bl-eyebrow">{tc("Het boek")}</p>
                <h1>Hoofdstraat 147</h1>
                <p className="bl-sub">{tc("Het verhaal van één adres in Driebergen-Rijsenburg.")}</p>
                <p className="bl-note">{tc("Het boek is in het Nederlands geschreven en wordt hier in zijn geheel getoond.")}</p>
            </header>

            <nav className="bl-toc" aria-label={tc("Inhoud")} id="inhoud">
                <h2>{tc("Inhoud")}</h2>
                {GROEPEN.map((g) => (
                    <div key={g} className="bl-toc-groep">
                        <h3>{tc(g)}</h3>
                        <ol>
                            {CHAPTERS.filter((c) => c.groep === g).map((c) => (
                                <li key={c.id}>
                                    <a href={`#${c.id}`}>{c.kicker && <span className="bl-toc-nr">{c.kicker}</span>}<span>{c.titel}</span></a>
                                </li>
                            ))}
                        </ol>
                    </div>
                ))}
            </nav>

            <article className="bl-text" lang="nl" data-no-reveal>
                {CHAPTERS.map((c, i) => (
                    <section key={c.id} id={c.id} className="bl-chapter" aria-labelledby={`${c.id}-kop`}>
                        <p className="bl-kicker">{c.kicker ? `${c.kicker} · ` : ""}{c.groep}</p>
                        <h2 id={`${c.id}-kop`}>{c.titel}</h2>
                        <div className="bl-body">{renderBlocks(c.blocks)}</div>
                        <p className="bl-nav">
                            <a href="#inhoud">↑ {tc("Inhoud")}</a>
                            {CHAPTERS[i + 1] && <a href={`#${CHAPTERS[i + 1].id}`}>{CHAPTERS[i + 1].titel} →</a>}
                        </p>
                    </section>
                ))}
            </article>

            <p className="bl-end"><Link className="boek-btn" to="/boek#bestellen">{tc("Bestel het boek")}</Link></p>
        </main>
    );
};

export default BoekLezen;
