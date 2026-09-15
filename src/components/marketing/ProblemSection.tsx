import Card from "../Card";
import { copy, problemSection } from "./content";
import { marketingProblemCats } from "./marketingCats";

export default function ProblemSection() {
  return (
    <section className="marketing-section" aria-labelledby="problem-title">
      <div className="marketing-shell">
        <div className="marketing-section-heading">
          <h2 id="problem-title" className="marketing-section-title">
            {problemSection.headline}
          </h2>
          <p className="marketing-section-body">{problemSection.body}</p>
        </div>
        <div className="marketing-problem-grid">
          {problemSection.cards.map((card, index) => (
            <Card key={card.title} className="marketing-surface-card marketing-problem-card">
              <span className="marketing-problem-number" aria-hidden>
                0{index + 1}
              </span>
              <div className="marketing-problem-figure">
                <img
                  src={marketingProblemCats[index].src}
                  alt={copy(`problem.card.${index + 1}.imageAlt`)}
                  className="marketing-problem-cat"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="marketing-problem-copy">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
