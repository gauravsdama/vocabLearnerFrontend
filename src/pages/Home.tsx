import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import Card from "../components/Card";
import Mascot from "../components/Mascot";
import { useMessages } from "../components/MessageCenter";

export default function Home() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { fetchMessages } = useMessages();

  useEffect(() => {
    fetchMessages().catch(() => undefined);
  }, [fetchMessages]);

  return (
    <AppShell
      eyebrow="VocabCat"
      title="Choose your next move."
      action={
        <Button variant="ghost" onClick={logout}>
          Log out
        </Button>
      }
    >
      <section className="tile-grid">
        <Card
          as="button"
          type="button"
          accent="word"
          className="tile-card tile-card-primary card-hover"
          onClick={() => navigate("/feed")}
        >
          <div className="tile-card-primary-content">
            <div className="tile-card-copy">
              <span className="tile-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2 className="ds-h2">Start Scrolling</h2>
              <p className="ds-body muted">
                Dive into words, quizzes, and prompts in a full-screen feed.
              </p>
            </div>
            <Mascot
              pose="happy_warm"
              alt="A warm smiling cat welcoming you into the study feed."
              size="xl"
              className="tile-card-mascot"
            />
          </div>
        </Card>
        <Card
          as="button"
          type="button"
          accent="sentence"
          className="tile-card card-hover"
          onClick={() => navigate("/settings")}
        >
          <span className="tile-icon tile-icon-amber" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M7 7v10M17 7v10M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <h2 className="ds-h2">Preferences</h2>
          <p className="ds-body muted">
            Set your goals, timezone, and SMS updates.
          </p>
        </Card>
        <Card
          as="button"
          type="button"
          accent="quiz"
          className="tile-card card-hover"
          onClick={() => navigate("/stats")}
        >
          <span className="tile-icon tile-icon-indigo" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M5 19V9M12 19V5M19 19v-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <h2 className="ds-h2">Stats & Summary</h2>
          <p className="ds-body muted">Track streaks, accuracy, and progress.</p>
        </Card>
      </section>
    </AppShell>
  );
}
