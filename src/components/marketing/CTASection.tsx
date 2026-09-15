import Button from "../Button";
import { copy, ctaSection } from "./content";

type CTASectionProps = {
  onGetStarted: () => void;
  onViewDemo: () => void;
};

export default function CTASection({ onGetStarted, onViewDemo }: CTASectionProps) {
  return (
    <section className="marketing-section marketing-cta-section" aria-labelledby="cta-title">
      <div className="marketing-shell">
        <div className="marketing-cta-panel">
          <span className="ds-label">{copy("cta.eyebrow")}</span>
          <h2 id="cta-title" className="marketing-section-title">
            {ctaSection.headline}
          </h2>
          <p className="marketing-section-body marketing-cta-body">
            {ctaSection.subheadline}
          </p>
          <div className="marketing-button-row marketing-button-row-center">
            <Button size="lg" onClick={onGetStarted}>
              {ctaSection.primaryCta}
            </Button>
            <button type="button" className="marketing-link-button" onClick={onViewDemo}>
              {ctaSection.secondaryCta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
