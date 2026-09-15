import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import BrandWordmark from "./BrandWordmark";

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  effectiveDate: string;
  children: ReactNode;
};

export default function LegalDocument({
  eyebrow,
  title,
  effectiveDate,
  children,
}: LegalDocumentProps) {
  return (
    <div className="legal-page">
      <a className="skip-link" href="#legal-content">
        Skip to content
      </a>
      <header className="legal-header">
        <Link to="/" aria-label="VocabCat home">
          <BrandWordmark />
        </Link>
        <Link className="legal-back-link" to="/">
          Back to VocabCat
        </Link>
      </header>
      <main id="legal-content" className="legal-document">
        <p className="ds-label">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="legal-effective-date">Effective: {effectiveDate}</p>
        <div className="legal-sections">{children}</div>
      </main>
      <footer className="legal-footer">
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/accessibility">Accessibility</Link>
      </footer>
    </div>
  );
}
