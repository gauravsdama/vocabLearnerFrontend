import clsx from "../clsx";
import { demoStates } from "./content";

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
              <p className="phone-word">Eloquent</p>
              <p className="phone-definition">
                Fluent, persuasive, and clear in speech or writing.
              </p>
            </div>
          </div>
          <div className="phone-mini-insight phone-animate delay-2">
            <span className="phone-mini-label">Today&apos;s focus</span>
            <strong>Read once. Recall once. Keep going.</strong>
          </div>
        </>
      );
    case "question":
      return (
        <>
          <div className="phone-copy-card phone-animate delay-1">
            <div className="phone-copy-stack">
              <p className="phone-question">What does “eloquent” most nearly mean?</p>
              <div className="phone-option-list">
                {[
                  "A. Confusing",
                  "B. Persuasive",
                  "C. Careless",
                  "D. Ordinary",
                ].map((option, index) => (
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
            Correct.
          </div>
          <div className="phone-copy-card phone-animate delay-2">
            <div className="phone-copy-stack">
              <p className="phone-feedback-text">“Eloquent” means persuasive and clear.</p>
              <p className="phone-feedback-body">
                The correct answer focuses on clear and persuasive communication.
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
              <p className="phone-review-title">3 words ready for review</p>
              <p className="phone-review-subtitle">Missed words return automatically</p>
            </div>
          </div>
          <div className="phone-review-list phone-animate delay-2">
            {[
              ["Eloquent", "Needs one more correct answer"],
              ["Pragmatic", "Missed yesterday"],
              ["Lucid", "Ready for a fast check-in"],
            ].map(([word, meta]) => (
              <div key={word} className="phone-review-row">
                <div>
                  <strong>{word}</strong>
                  <span>{meta}</span>
                </div>
                <span className="phone-review-chip">Review</span>
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
                <span className="phone-notification-app-name">Mail</span>
              </div>
              <span className="phone-notification-time">now</span>
            </div>
            <strong>Your vocab review is ready.</strong>
            <span>You have 5 words waiting for practice.</span>
          </div>
          <div className="phone-notification phone-animate delay-2">
            <div className="phone-notification-topline">
              <div className="phone-notification-app">
                <span className="phone-notification-app-icon phone-notification-app-icon-messages" aria-hidden />
                <span className="phone-notification-app-name">Messages</span>
              </div>
              <span className="phone-notification-time">2m ago</span>
            </div>
            <strong>5 words are waiting today.</strong>
            <span>Your daily vocab session is ready.</span>
          </div>
        </>
      );
    case "summary":
      return (
        <>
          <div className="phone-copy-card phone-animate delay-1">
            <div className="phone-summary-grid">
              <div className="phone-summary-stat">
                <strong>18</strong>
                <span>words reviewed this week</span>
              </div>
              <div className="phone-summary-stat">
                <strong>7</strong>
                <span>words improved</span>
              </div>
              <div className="phone-summary-stat">
                <strong>6</strong>
                <span>day streak</span>
              </div>
            </div>
          </div>
          <div className="phone-mini-insight phone-animate delay-2">
            <span className="phone-mini-label">Next review</span>
            <strong>3 words still need attention</strong>
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
        aria-label={`Vocabcat app preview showing ${activeState.ariaLabel}.`}
      >
        <div className="phone-shell">
          <div className="phone-island" aria-hidden />
          <div className="phone-screen">
            <div className="phone-statusbar" aria-hidden>
              <span>9:41</span>
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
