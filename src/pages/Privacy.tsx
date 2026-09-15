import LegalDocument from "../components/LegalDocument";

export default function Privacy() {
  return (
    <LegalDocument eyebrow="Legal" title="Privacy Policy" effectiveDate="September 15, 2026">
      <section>
        <h2>Who this policy covers</h2>
        <p>
          This policy explains how VocabCat handles personal information when you use
          our website, learning app, accounts, reminders, and support features.
          VocabCat is intended for people age 13 and older. We do not knowingly allow
          children under 13 to create accounts.
        </p>
      </section>

      <section>
        <h2>Information we collect</h2>
        <ul>
          <li>
            Account information, such as email address, display name, password hash,
            authentication provider identifiers, profile image, and account status.
          </li>
          <li>
            Learning information, such as words viewed, answers, quiz attempts, written
            practice sentences, scores, feedback, streaks, and progress.
          </li>
          <li>
            Preferences, such as timezone, learning goals, feed choices, reminder
            frequency, phone number, and SMS consent status.
          </li>
          <li>
            Support information, such as issue descriptions and basic device or app
            details you submit with a report.
          </li>
          <li>
            Technical information needed to operate and secure the service, such as IP
            address, user agent, request identifiers, security events, and limited
            site-usage analytics.
          </li>
        </ul>
      </section>

      <section>
        <h2>How we use information</h2>
        <p>
          We use information to create and secure accounts, deliver vocabulary lessons,
          personalize review, measure progress, provide practice feedback, send requested
          reminders, provide support, prevent abuse, diagnose failures, and improve the
          service. We do not sell personal information or use it for targeted advertising.
        </p>
      </section>

      <section>
        <h2>Service providers</h2>
        <p>
          We use service providers to run VocabCat. These may include Google for sign-in,
          Google Cloud for backend hosting, Vercel for web hosting and limited analytics,
          Twilio for opted-in text messages and Resend for account email. They process
          information for the services they provide to us and under their own contractual
          and legal obligations.
        </p>
      </section>

      <section>
        <h2>Retention and deletion</h2>
        <p>
          We keep account and learning information while your account is active and as
          needed to provide the service, protect it, resolve disputes, and meet legal
          obligations. Retention periods may differ for security records, provider logs,
          and backups. You can permanently delete your account and associated application
          data from Settings. Some limited records may remain when law, fraud prevention,
          security, or backup-integrity requirements require it.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <ul>
          <li>Update learning and reminder preferences in Settings.</li>
          <li>Opt out of SMS reminders in SMS settings or by replying STOP.</li>
          <li>Delete your account and application data in Settings.</li>
          <li>Use the in-app support feature for access, correction, or privacy requests.</li>
        </ul>
      </section>

      <section>
        <h2>Security and international processing</h2>
        <p>
          We use administrative, technical, and organizational safeguards designed to
          protect personal information. No system is completely secure. VocabCat and its
          providers may process information in the United States and other countries where
          they operate.
        </p>
      </section>

      <section>
        <h2>Changes and contact</h2>
        <p>
          We may update this policy as the service changes. We will update the effective
          date and provide additional notice when required. For privacy questions or
          requests, use Help &amp; Support in the VocabCat app. If you cannot access the
          app, use the public support contact listed in the store or website where you
          obtained VocabCat.
        </p>
      </section>
    </LegalDocument>
  );
}
