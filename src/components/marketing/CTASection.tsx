import Button from "../Button";
import { ctaSection } from "./content";

type CTASectionProps = {
  onGetStarted: () => void;
};

export default function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="marketing-section marketing-cta-section" aria-labelledby="cta-title">
      <div className="marketing-shell">
        <div className="marketing-cta-panel">
          <span className="ds-label">Get Started</span>
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
            <a className="marketing-link-button" href="#how-it-works">
              {ctaSection.secondaryCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
