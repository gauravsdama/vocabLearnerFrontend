import Card from "../Card";
import { audienceSection } from "./content";

export default function AudienceValueSection() {
  return (
    <section className="marketing-section" aria-labelledby="audience-title">
      <div className="marketing-shell">
        <div className="marketing-section-heading">
          <h2 id="audience-title" className="marketing-section-title">
            {audienceSection.headline}
          </h2>
        </div>
        <div className="marketing-audience-grid">
          <Card className="marketing-surface-card marketing-audience-card">
            <h3>Students</h3>
            <ul className="marketing-checklist">
              {audienceSection.students.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
          <Card className="marketing-surface-card marketing-audience-card">
            <h3>Parents</h3>
            <ul className="marketing-checklist">
              {audienceSection.parents.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}
