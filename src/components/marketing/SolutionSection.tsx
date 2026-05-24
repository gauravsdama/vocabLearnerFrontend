import Card from "../Card";
import { solutionSection } from "./content";

export default function SolutionSection() {
  return (
    <section className="marketing-section" aria-labelledby="solution-title">
      <div className="marketing-shell">
        <div className="marketing-section-heading">
          <h2 id="solution-title" className="marketing-section-title">
            {solutionSection.headline}
          </h2>
          <p className="marketing-section-body">{solutionSection.body}</p>
        </div>
        <div className="marketing-solution-grid">
          {solutionSection.features.map((feature) => (
            <Card key={feature.title} className="marketing-surface-card marketing-feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
