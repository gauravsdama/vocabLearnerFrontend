import { Link } from "react-router-dom";
import { copy } from "./content";

export default function MarketingFooter() {
  return (
    <footer className="marketing-footer">
      <div className="marketing-shell marketing-footer-inner">
        <div>
          <strong>{copy("footer.product")}</strong>
          <span>{copy("footer.ageNotice")}</span>
        </div>
        <nav aria-label={copy("footer.legalAriaLabel")}>
          <Link to="/privacy">{copy("footer.privacy")}</Link>
          <Link to="/terms">{copy("footer.terms")}</Link>
          <Link to="/accessibility">{copy("footer.accessibility")}</Link>
        </nav>
      </div>
    </footer>
  );
}
