import Card from "../Card";
import { habitSection } from "./content";

export default function HabitSection() {
  return (
    <section className="marketing-section" aria-labelledby="habit-title">
      <div className="marketing-shell">
        <div className="marketing-section-heading">
          <h2 id="habit-title" className="marketing-section-title">
            {habitSection.headline}
          </h2>
          <p className="marketing-section-body">{habitSection.body}</p>
        </div>
        <div className="marketing-pillars-grid">
          {habitSection.pillars.map((pillar) => (
            <Card key={pillar.title} className="marketing-surface-card marketing-pillar-card">
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
