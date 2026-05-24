import BrandWordmark from "../BrandWordmark";
import Button from "../Button";
import Mascot from "../Mascot";
import PhoneMockup from "./PhoneMockup";
import { heroContent, heroHighlights } from "./content";

type HeroSectionProps = {
  onStartLearning: () => void;
  onLogin: () => void;
};

export default function HeroSection({ onStartLearning, onLogin }: HeroSectionProps) {
  return (
    <section className="marketing-hero-section">
      <div className="marketing-shell">
        <header className="marketing-nav">
          <a className="marketing-brand" href="/" aria-label="Vocabcat home">
            <BrandWordmark textClassName="marketing-brand-text" />
          </a>
          <div className="marketing-nav-actions">
            <span className="marketing-nav-note">Habit-building vocabulary review</span>
            <Button variant="secondary" onClick={onLogin}>
              Log In
            </Button>
          </div>
        </header>

        <div className="marketing-hero-grid">
          <div className="marketing-hero-copy">
            <h1 className="ds-h1">{heroContent.headline}</h1>
            <p className="marketing-lede">{heroContent.subheadline}</p>
            <div className="marketing-button-row">
              <Button size="lg" onClick={onStartLearning}>
                {heroContent.primaryCta}
              </Button>
              <a className="marketing-link-button" href="#how-it-works">
                {heroContent.secondaryCta}
              </a>
            </div>
            <div className="marketing-highlight-row" aria-label="Key benefits">
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
              <span className="marketing-floating-label">Daily rhythm</span>
              <strong>Short daily sessions that are easy to keep doing.</strong>
            </div>
            <PhoneMockup activeIndex={0} className="marketing-hero-phone" />
            <div className="marketing-floating-card marketing-floating-card-bottom">
              <span className="marketing-floating-label">Today</span>
              <strong>3 words ready for review</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
