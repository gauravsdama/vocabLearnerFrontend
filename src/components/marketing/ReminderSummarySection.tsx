import Card from "../Card";
import { reminderSection } from "./content";

export default function ReminderSummarySection() {
  return (
    <section className="marketing-section" aria-labelledby="reminder-title">
      <div className="marketing-shell">
        <div className="marketing-section-heading">
          <h2 id="reminder-title" className="marketing-section-title">
            {reminderSection.headline}
          </h2>
          <p className="marketing-section-body">{reminderSection.body}</p>
        </div>
        <div className="marketing-reminder-grid">
          {reminderSection.cards.map((card) => (
            <Card
              key={`${card.app}-${card.subject}`}
              className="marketing-surface-card marketing-notification-card"
            >
              <div className="marketing-notification-app-row">
                <div className="marketing-notification-app">
                  <span
                    className={`marketing-notification-icon ${
                      card.app === "Messages"
                        ? "marketing-notification-icon-messages"
                        : "marketing-notification-icon-mail"
                    }`}
                    aria-hidden
                  />
                  <span className="marketing-notification-app-name">{card.app}</span>
                </div>
                <span className="marketing-notification-time">{card.time}</span>
              </div>
              <span className="marketing-notification-channel">{card.channel}</span>
              <strong>{card.subject}</strong>
              <p>{card.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
