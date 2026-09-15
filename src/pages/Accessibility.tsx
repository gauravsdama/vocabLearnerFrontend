import LegalDocument from "../components/LegalDocument";

export default function Accessibility() {
  return (
    <LegalDocument
      eyebrow="Accessibility"
      title="Accessibility Statement"
      effectiveDate="September 15, 2026"
    >
      <section>
        <h2>Our commitment</h2>
        <p>
          VocabCat is working toward conformance with the Web Content Accessibility
          Guidelines (WCAG) 2.2 Level AA. Accessibility is an ongoing practice, and this
          statement does not claim that every screen or assistive-technology combination
          is currently free of barriers.
        </p>
      </section>

      <section>
        <h2>Measures we take</h2>
        <ul>
          <li>semantic headings, landmarks, labels, and keyboard-operable controls;</li>
          <li>visible keyboard focus and a skip-to-content link;</li>
          <li>text alternatives for meaningful images;</li>
          <li>support for reduced-motion preferences and responsive text;</li>
          <li>clear form instructions, validation states, and status messages; and</li>
          <li>browser and automated checks during frontend changes.</li>
        </ul>
      </section>

      <section>
        <h2>Known limitations</h2>
        <p>
          Some complex feed interactions and third-party sign-in controls may behave
          differently across screen readers and browsers. We continue to test these areas
          and prioritize fixes that block access to core learning or account functions.
        </p>
      </section>

      <section>
        <h2>Feedback</h2>
        <p>
          If a disability-related barrier prevents you from using VocabCat, please report
          the affected screen, what you were trying to do, and your browser or assistive
          technology through Help &amp; Support in the VocabCat app or the public support
          contact listed where you obtained VocabCat. We will review the report and work
          toward a reasonable solution.
        </p>
      </section>
    </LegalDocument>
  );
}
