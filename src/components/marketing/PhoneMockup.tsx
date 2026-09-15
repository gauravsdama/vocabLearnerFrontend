import clsx from "../clsx";
import { copy, demoStates } from "./content";

type PhoneMockupProps = {
  activeIndex: number;
  reducedMotion?: boolean;
  className?: string;
};

function clampIndex(index: number) {
  return Math.max(0, Math.min(index, demoStates.length - 1));
}

function renderScreen(stateId: (typeof demoStates)[number]["id"]) {
  switch (stateId) {
    case "word":
      return (
        <>
          <div className="phone-copy-card phone-animate delay-1">
            <div className="phone-copy-stack">
              <p className="phone-word">{copy("phone.word.term")}</p>
              <p className="phone-definition">
                {copy("phone.word.definition")}
              </p>
            </div>
          </div>
          <div className="phone-mini-insight phone-animate delay-2">
            <span className="phone-mini-label">{copy("phone.word.focusLabel")}</span>
            <strong>{copy("phone.word.focusBody")}</strong>
          </div>
        </>
      );
    case "question":
      return (
        <>
          <div className="phone-copy-card phone-animate delay-1">
            <div className="phone-copy-stack">
              <p className="phone-question">{copy("phone.question.prompt")}</p>
              <div className="phone-option-list">
                {Array.from({ length: 4 }, (_, index) =>
                  copy(`phone.question.option.${index + 1}`),
                ).map((option, index) => (
                  <div
                    key={option}
                    className={clsx(
                      "phone-option",
                      index === 1 ? "phone-option-highlighted" : "",
                    )}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      );
    case "feedback":
      return (
        <>
          <div className="phone-feedback-banner phone-animate delay-1">
            <span className="phone-feedback-dot" aria-hidden />
            {copy("phone.feedback.status")}
          </div>
          <div className="phone-copy-card phone-animate delay-2">
            <div className="phone-copy-stack">
              <p className="phone-feedback-text">{copy("phone.feedback.title")}</p>
              <p className="phone-feedback-body">
                {copy("phone.feedback.body")}
              </p>
            </div>
          </div>
        </>
      );
    case "review":
      return (
        <>
          <div className="phone-copy-card phone-animate delay-1">
            <div className="phone-copy-stack">
              <p className="phone-review-title">{copy("phone.review.title")}</p>
              <p className="phone-review-subtitle">{copy("phone.review.subtitle")}</p>
            </div>
          </div>
          <div className="phone-review-list phone-animate delay-2">
            {Array.from({ length: 3 }, (_, index) => [
              copy(`phone.review.item.${index + 1}.word`),
              copy(`phone.review.item.${index + 1}.meta`),
            ]).map(([word, meta]) => (
              <div key={word} className="phone-review-row">
                <div>
                  <strong>{word}</strong>
                  <span>{meta}</span>
                </div>
                <span className="phone-review-chip">{copy("phone.review.action")}</span>
              </div>
            ))}
          </div>
        </>
      );
    case "reminders":
      return (
        <>
          <div className="phone-notification phone-animate delay-1">
            <div className="phone-notification-topline">
              <div className="phone-notification-app">
                <span className="phone-notification-app-icon phone-notification-app-icon-mail" aria-hidden />
                <span className="phone-notification-app-name">{copy("phone.reminder.email.app")}</span>
              </div>
              <span className="phone-notification-time">{copy("phone.reminder.email.time")}</span>
            </div>
            <strong>{copy("phone.reminder.email.subject")}</strong>
            <span>{copy("phone.reminder.email.body")}</span>
          </div>
          <div className="phone-notification phone-animate delay-2">
            <div className="phone-notification-topline">
              <div className="phone-notification-app">
                <span className="phone-notification-app-icon phone-notification-app-icon-messages" aria-hidden />
                <span className="phone-notification-app-name">{copy("phone.reminder.sms.app")}</span>
              </div>
              <span className="phone-notification-time">{copy("phone.reminder.sms.time")}</span>
            </div>
            <strong>{copy("phone.reminder.sms.subject")}</strong>
            <span>{copy("phone.reminder.sms.body")}</span>
          </div>
        </>
      );
    case "summary":
      return (
        <>
          <div className="phone-copy-card phone-animate delay-1">
            <div className="phone-summary-grid">
              <div className="phone-summary-stat">
                <strong>{copy("phone.summary.stat.1.value")}</strong>
                <span>{copy("phone.summary.stat.1.label")}</span>
              </div>
              <div className="phone-summary-stat">
                <strong>{copy("phone.summary.stat.2.value")}</strong>
                <span>{copy("phone.summary.stat.2.label")}</span>
              </div>
              <div className="phone-summary-stat">
                <strong>{copy("phone.summary.stat.3.value")}</strong>
                <span>{copy("phone.summary.stat.3.label")}</span>
              </div>
            </div>
          </div>
          <div className="phone-mini-insight phone-animate delay-2">
            <span className="phone-mini-label">{copy("phone.summary.nextLabel")}</span>
            <strong>{copy("phone.summary.nextBody")}</strong>
          </div>
        </>
      );
    default:
      return null;
  }
}

export default function PhoneMockup({
  activeIndex,
  reducedMotion = false,
  className,
}: PhoneMockupProps) {
  const safeIndex = clampIndex(activeIndex);
  const activeState = demoStates[safeIndex];

  return (
    <div className={clsx("phone-preview", className)}>
      <div
        className="phone-frame"
        role="img"
        aria-label={`${copy("phone.previewAriaPrefix")} ${activeState.ariaLabel}.`}
      >
        <div className="phone-shell">
          <div className="phone-island" aria-hidden />
          <div className="phone-screen">
            <div className="phone-statusbar" aria-hidden>
              <span>{copy("phone.statusTime")}</span>
              <div className="phone-status-icons">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="phone-screen-body">
              {demoStates.map((state, index) => {
                const offset = index - safeIndex;
                const distance = Math.abs(offset);
                const isActive = index === safeIndex;
                const opacity = reducedMotion
                  ? isActive
                    ? 1
                    : 0
                  : isActive
                    ? 1
                    : Math.max(0, 0.14 - distance * 0.05);
                const translateY = reducedMotion ? 0 : offset * 26;
                const scale = reducedMotion ? 1 : 1 - Math.min(distance, 3) * 0.04;

                return (
                  <div
                    key={state.id}
                    className={clsx("phone-panel", isActive ? "phone-panel-active" : "")}
                    style={{
                      opacity,
                      transform: `translateY(${translateY}px) scale(${scale})`,
                      zIndex: demoStates.length - distance,
                    }}
                    aria-hidden={!isActive}
                  >
                    {renderScreen(state.id)}
                  </div>
                );
              })}
            </div>
            <div className="phone-progress" aria-hidden>
              {demoStates.map((state, index) => (
                <span
                  key={state.id}
                  className={index <= safeIndex ? "phone-progress-active" : ""}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
