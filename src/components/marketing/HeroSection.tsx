import BrandWordmark from "../BrandWordmark";
import Button from "../Button";
import Mascot from "../Mascot";
import PhoneMockup from "./PhoneMockup";
import { copy, heroContent, heroHighlights } from "./content";

type HeroSectionProps = {
  onStartLearning: () => void;
  onLogin: () => void;
};

export default function HeroSection({ onStartLearning, onLogin }: HeroSectionProps) {
  return (
    <section className="marketing-hero-section" aria-labelledby="landing-title">
      <div className="marketing-shell">
        <header className="marketing-nav">
          <a className="marketing-brand" href="/" aria-label={copy("nav.homeAriaLabel")}>
            <BrandWordmark text={copy("nav.brand")} textClassName="marketing-brand-text" />
          </a>
          <div className="marketing-nav-actions">
            <span className="marketing-nav-note">{copy("nav.note")}</span>
            <Button variant="secondary" onClick={onLogin}>
              {copy("nav.login")}
            </Button>
          </div>
        </header>

        <div className="marketing-hero-grid">
          <div className="marketing-hero-copy">
            <h1 id="landing-title" className="ds-h1">{heroContent.headline}</h1>
            <p className="marketing-lede">{heroContent.subheadline}</p>
            <div className="marketing-button-row">
              <Button size="lg" onClick={onStartLearning}>
                {heroContent.primaryCta}
              </Button>
              <a className="marketing-link-button" href="#how-it-works">
                {heroContent.secondaryCta}
              </a>
            </div>
            <div className="marketing-highlight-row" aria-label={copy("hero.highlightsAriaLabel")}>
              {heroHighlights.map((highlight) => (
                <span key={highlight} className="marketing-highlight-chip">
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          <div className="marketing-hero-visual">
            <Mascot pose="peek_left" decorative size="xl" className="marketing-hero-peek" />
            <div className="marketing-floating-card marketing-floating-card-top">
              <span className="marketing-floating-label">{copy("hero.floatingTopLabel")}</span>
              <strong>{copy("hero.floatingTopBody")}</strong>
            </div>
            <PhoneMockup activeIndex={0} className="marketing-hero-phone" />
            <div className="marketing-floating-card marketing-floating-card-bottom">
              <span className="marketing-floating-label">{copy("hero.floatingBottomLabel")}</span>
              <strong>{copy("hero.floatingBottomBody")}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
